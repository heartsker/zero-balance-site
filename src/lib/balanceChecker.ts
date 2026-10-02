/** Listed-price arithmetic only. No floating-point parsing and no tax estimates. */
export interface Price { id: string; minor: number }
export interface Match { total: number; remainder: number; units: number; lines: { id: string; quantity: number; minor: number }[]; confirmations: number }
export const MAX_QUANTITY_PER_CONFIRMATION = 10; // StoreCoordinator.maxQuantityPerPurchase

export function parseAmount(text: string, digits: number): number | null {
  if (!Number.isInteger(digits) || digits < 0 || digits > 3) return null;
  const match = /^(\d+)(?:[.,](\d+))?$/.exec(text.trim());
  if (!match || (match[2]?.length ?? 0) > digits) return null;
  const result = Number(match[1] + (match[2] ?? '').padEnd(digits, '0'));
  return Number.isSafeInteger(result) ? result : null;
}
export function gcd(a: number, b: number): number { while (b) [a, b] = [b, a % b]; return a; }

/** Every normalized amount at or above this value is reachable. Shortest paths
 * over residues modulo the smallest price give an exact bound, including when
 * no pair of prices is coprime. This runs only for large balances. */
function conductor(prices: number[]): number {
  const smallest = Math.min(...prices);
  const distance = new Float64Array(smallest).fill(Infinity);
  const visited = new Uint8Array(smallest);
  distance[0] = 0;
  for (let n = 0; n < smallest; n++) {
    let next = -1;
    for (let r = 0; r < smallest; r++) {
      if (!visited[r] && (next < 0 || distance[r] < distance[next])) next = r;
    }
    visited[next] = 1;
    for (const price of prices) {
      const amount = distance[next] + price;
      const residue = amount % smallest;
      if (amount < distance[residue]) distance[residue] = amount;
    }
  }
  return Math.max(...distance) - smallest + 1;
}

/** Maximize spend without exceeding the balance. Consumables can repeat without
 * a total quantity cap; Apple confirmations split each SKU into groups of ten.
 * Like the app's BalancePlanner, large balances use the largest tier for the
 * bulk. The reserved DP window is provably reachable, so this does not lose exact
 * matches. Within the window we minimize units; global minimum units/sheets are
 * not promised. All arithmetic uses integer currency minor units. */
export function checkBalance(target: number, prices: Price[]): Match {
  if (!Number.isSafeInteger(target) || target < 0
    || !prices.length || prices.some(p => !Number.isSafeInteger(p.minor) || p.minor <= 0)) throw new RangeError('Invalid balance or prices');
  const step = prices.reduce((a, p) => gcd(a, p.minor), 0);
  const values = prices.map(p => p.minor / step);
  const largest = Math.max(...values);
  const largestIndex = values.indexOf(largest);
  // Validate catalog complexity, not the user's amount. All audited storefronts
  // are comfortably inside these bounds (smallest <= 900, largest <= 129900).
  if (Math.min(...values) > 10_000 || largest > 1_000_000) throw new RangeError('Unsupported price catalog');
  const normalized = (target - target % step) / step;
  let window = Math.max(2 * largest, 6_000);
  if (normalized > window) window = Math.max(window, conductor(values) + largest);
  if (window > 2_000_000) throw new RangeError('Unsupported price catalog');
  const bulk = normalized > window ? Math.floor((normalized - (window - largest)) / largest) : 0;
  const ceiling = normalized - bulk * largest;
  const unreachable = 0xffffffff;
  const count = new Uint32Array(ceiling + 1).fill(unreachable);
  const chosen = new Int16Array(ceiling + 1).fill(-1);
  count[0] = 0;
  for (let amount = 1; amount <= ceiling; amount++) {
    prices.forEach((price, index) => {
      const previous = amount - price.minor / step;
      if (previous >= 0 && count[previous] !== unreachable && count[previous] + 1 < count[amount]) {
        count[amount] = count[previous] + 1; chosen[amount] = index;
      }
    });
  }
  let reached = ceiling;
  while (reached > 0 && count[reached] === unreachable) reached--;
  const quantities = new Map<number, number>();
  for (let cursor = reached; cursor > 0;) {
    const index = chosen[cursor];
    quantities.set(index, (quantities.get(index) ?? 0) + 1);
    cursor -= prices[index].minor / step;
  }
  // Prefer a single repeatable SKU when it achieves the same minimum unit count.
  // This mirrors the app's concentration step and avoids needless confirmations.
  const single = values.findIndex(value => value * count[reached] === reached);
  if (reached > 0 && single >= 0) { quantities.clear(); quantities.set(single, count[reached]); }
  if (bulk) quantities.set(largestIndex, (quantities.get(largestIndex) ?? 0) + bulk);
  const lines = [...quantities].map(([index, quantity]) => ({ ...prices[index], quantity }));
  const total = (bulk * largest + reached) * step;
  return { total, remainder: target - total, units: bulk + count[reached], lines,
    confirmations: lines.reduce((sum, line) => sum + Math.ceil(line.quantity / MAX_QUANTITY_PER_CONFIRMATION), 0) };
}
