import { checkBalance, parseAmount, type Price } from '../lib/balanceChecker';
type Payload = { products: (Price & { name: string })[]; currency: string; digits: number; lang: 'en' | 'ru' };
function initialize() {
  document.querySelectorAll<HTMLElement>('[data-checker]').forEach(root => {
    if (root.dataset.ready) return;
    root.dataset.ready = 'true';
    const { products, currency, digits, lang } = JSON.parse(root.dataset.payload!) as Payload;
    const ru = lang === 'ru';
    const form = root.querySelector<HTMLFormElement>('form')!;
    form.querySelector<HTMLButtonElement>('button[type=submit]')!.disabled = false;
    const input = root.querySelector<HTMLInputElement>('#balance')!;
    const error = root.querySelector<HTMLElement>('#balance-error')!;
    const result = root.querySelector<HTMLElement>('[data-result]')!;
    const formatter = new Intl.NumberFormat(lang, { style: 'currency', currency });
    const format = (amount: number) => {
      const factor = 10 ** digits;
      const fraction = amount % factor;
      // Keep even large, valid amounts exact when displaying their minor units.
      return formatter.formatToParts(BigInt((amount - fraction) / factor)).map(part =>
        part.type === 'fraction' ? String(fraction).padStart(digits, '0') : part.value).join('');
    };
    const clear = () => { result.hidden = true; result.replaceChildren(); error.textContent = ''; input.removeAttribute('aria-invalid'); };
    input.addEventListener('input', clear);
    root.querySelector<HTMLSelectElement>('[data-storefront]')!.addEventListener('change', event => {
      window.location.assign((event.target as HTMLSelectElement).value);
    });
    form.addEventListener('submit', event => {
      event.preventDefault(); clear();
      const target = parseAmount(input.value, digits);
      if (target === null || target <= 0) {
        error.textContent = digits === 0
          ? (ru ? 'Введите целую сумму больше нуля.' : 'Enter a whole amount above zero.')
          : (ru ? `Введите сумму больше нуля, например ${format(products[0].minor)}.` : `Enter an amount above zero, such as ${format(products[0].minor)}.`);
        input.setAttribute('aria-invalid', 'true'); input.focus(); return;
      }
      const match = checkBalance(target, products);
      const add = (tag: string, text: string) => { const node = document.createElement(tag); node.textContent = text; result.append(node); return node; };
      if (match.remainder === 0) {
        add('h3', ru ? 'Сумма подходит' : 'Your amount fits');
        add('p', ru ? `Покупки на ${format(match.total)} — без остатка по ценам каталога.` : `Purchases total ${format(match.total)}, with no remainder at listed prices.`);
        const list = add('ul', '');
        for (const line of match.lines) {
          const item = document.createElement('li');
          item.textContent = `${line.quantity} × ${products.find(p => p.id === line.id)!.name} — ${format(line.quantity * line.minor)}`;
          list.append(item);
        }
      } else {
        add('h3', ru ? 'Точной комбинации нет' : 'No exact combination');
        add('p', match.units
          ? (ru ? `Ближайшая сумма — ${format(match.total)}. После покупки останется ${format(match.remainder)}.` : `The closest total is ${format(match.total)}. Buying it would leave ${format(match.remainder)}.`)
          : (ru ? `Минимальная покупка — ${format(Math.min(...products.map(p => p.minor)))}. Ваш остаток меньше.` : `The lowest price is ${format(Math.min(...products.map(p => p.minor)))}. Your balance is below it.`));
      }
      result.hidden = false;
    });
  });
}
initialize();
document.addEventListener('astro:page-load', initialize);
