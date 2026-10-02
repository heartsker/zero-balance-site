import { describe, expect, it } from 'vitest';
import { checkBalance, parseAmount } from '../src/lib/balanceChecker';
import { catalog, pricesFor, currencyDigits } from '../src/lib/iapCatalog';
const prices = (code: string) => pricesFor(catalog.storefronts.find(s => s.code === code)!);

describe('exact decimal input', () => {
  it('accepts decimal separators without binary rounding', () => {
    expect(parseAmount(' 15,01 ', 2)).toBe(1501);
    expect(parseAmount('0.29', 2)).toBe(29);
    expect(parseAmount('1.234', 3)).toBe(1234);
    expect(parseAmount('500', 0)).toBe(500);
  });
  it.each(['', '1e3', '-1', 'NaN', 'Infinity', '12abc', '1,234.56', '1 000', '1.001', '0.009', '9007199254740992'])('rejects invalid/ambiguous or excessive precision: %s', value => expect(parseAmount(value, 2)).toBeNull());
  it('does not round zero-decimal currencies', () => expect(parseAmount('50.5', 0)).toBeNull());
});
describe('audited catalog', () => {
  it('contains 3,675 positive prices, one currency per storefront, and no legacy non-consumables', () => {
    expect(catalog.products).toHaveLength(21);
    expect(catalog.storefronts).toHaveLength(175);
    for (const store of catalog.storefronts) {
      expect(Object.keys(store.prices).sort()).toEqual(catalog.products.map(p => p.id).sort());
      expect(pricesFor(store)).toHaveLength(21);
    }
    expect(catalog.products.find(p => p.id.endsWith('cloud_scarf'))).toBeUndefined();
    expect(catalog.products.find(p => p.id.endsWith('cloud_scarf_2'))).toBeDefined();
    expect(prices('RUS')[0].minor).toBe(1500);
    expect(prices('USA')[0].minor).toBe(29);
    expect(currencyDigits('JPY')).toBe(0);
    expect(prices('JPN')[0].minor).toBe(50);
  });
});
describe('repeatable purchase search', () => {
  it.each([[21,0,21],[67,59,8],[68,68,0],[78,78,0],[600,600,0]])('USD target %i has total %i and remainder %i', (target, total, remainder) => expect(checkBalance(target, prices('USA'))).toMatchObject({total, remainder}));
  it('separates units from confirmations', () => expect(checkBalance(600, prices('USA'))).toMatchObject({ total:600, units:6, confirmations:1 }));
  it.each([[300,0,300],[1500,1500,0],[1501,1500,1],[4600,4500,100]])('RUB target %i has total %i and remainder %i', (target,total,remainder) => expect(checkBalance(target, prices('RUS'))).toMatchObject({total,remainder}));
  it('allows more than ten units and splits Apple confirmations per SKU', () => {
    expect(checkBalance(31,[{id:'one',minor:1}])).toMatchObject({total:31,remainder:0,units:31,confirmations:4});
    expect(checkBalance(1100,[{id:'one',minor:100}])).toMatchObject({total:1100,remainder:0,units:11,confirmations:2});
    expect(checkBalance(58,prices('USA'))).toMatchObject({total:58,remainder:0,units:2});
  });
  it('preserves exact reachability for large balances without freezing the page', () => {
    for (const store of catalog.storefronts) {
      const p = pricesFor(store);
      const target = p[p.length-1].minor * 351 + p[0].minor;
      const result = checkBalance(target,p);
      expect(result.total,store.code).toBe(target);
      expect(result.remainder,store.code).toBe(0);
      expect(result.lines.reduce((sum,line)=>sum+line.minor*line.quantity,0)).toBe(target);
      expect(result.confirmations).toBe(result.lines.reduce((sum,line)=>sum+Math.ceil(line.quantity/10),0));
    }
  });
  it('solves large amounts even when no pair of normalized prices is coprime', () => {
    const p = [{id:'a',minor:6},{id:'b',minor:10},{id:'c',minor:15}];
    expect(checkBalance(999999,p)).toMatchObject({total:999999,remainder:0});
    expect(checkBalance(999999,p.map(p=>({...p,minor:p.minor*100})))).toMatchObject({total:999900,remainder:99});
  });
  it('keeps the last minor unit exact for safe-integer balances', () => {
    expect(checkBalance(Number.MAX_SAFE_INTEGER,[{id:'one',minor:1}])).toMatchObject({total:Number.MAX_SAFE_INTEGER,remainder:0,units:Number.MAX_SAFE_INTEGER});
    expect(checkBalance(Number.MAX_SAFE_INTEGER,[{id:'even',minor:2}])).toMatchObject({total:Number.MAX_SAFE_INTEGER-1,remainder:1});
  });
  it('matches both independently audited reachability counts', () => {
    expect(Array.from({length:500},(_,i) => checkBalance((i+1)*100,prices('RUS')).remainder === 0).filter(Boolean)).toHaveLength(458);
    expect(Array.from({length:1000},(_,i) => checkBalance(i+1,prices('USA')).remainder === 0).filter(Boolean)).toHaveLength(877);
  });
  it('matches an independent exhaustive sum-set reference across every storefront', () => {
    for (const store of catalog.storefronts) {
      const p=pricesFor(store);
      // Enumerate sum sets by quantity, independently of the amount-based DP.
      const samples=[1,p[0].minor-1,p[0].minor,p[0].minor*2+1,p[0].minor*11,p[0].minor*12+1];
      const ceiling=Math.max(...samples);
      const reached=new Map<number,number>([[0,0]]);
      let layer=new Set([0]);
      for(let n=1;n<=Math.floor(ceiling/p[0].minor);n++) {
        const next=new Set<number>();
        for(const amount of layer) for(const price of p) if(amount+price.minor<=ceiling) next.add(amount+price.minor);
        for(const amount of next) if(!reached.has(amount)) reached.set(amount,n);
        layer=next;
      }
      for(const target of samples) {
        const expected=Math.max(...[...reached.keys()].filter(n=>n<=target));
        const result=checkBalance(target,p);
        expect(result.total,store.code).toBe(expected);
        expect(result.units,store.code).toBe(reached.get(expected));
        expect(result.lines.reduce((sum,line)=>sum+line.minor*line.quantity,0)).toBe(result.total);
      }
    }
  });
  it('rejects invalid programmatic inputs', () => {
    expect(()=>checkBalance(NaN,prices('USA'))).toThrow();
    expect(()=>checkBalance(12,[{id:'invalid',minor:0}])).toThrow();
    expect(()=>checkBalance(Number.MAX_SAFE_INTEGER+1,prices('USA'))).toThrow();
  });
});
