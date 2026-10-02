import { readFile } from 'node:fs/promises';
import { describe, expect, it } from 'vitest';
import { load } from 'cheerio';
import { catalog } from '../src/lib/iapCatalog';

describe('static price catalog and canonical alternates', () => {
  it.each([['dist','en/','en'],['dist','ru/','ru'],['dist-test-ru','','ru'],['dist-test-ru','en/','en']])('%s/%s has crawlable prices and reciprocal preferred URLs', async (dist,prefix,lang) => {
    for(const code of ['rus','usa','jpn','kor']) {
      const $=load(await readFile(`${dist}/${prefix}prices/${code}/index.html`,'utf8'));
      expect($('tbody tr')).toHaveLength(21);
      expect($('h1')).toHaveLength(1);
      expect($('time').attr('datetime')).toBe(catalog.date);
      const preferred=lang==='ru'?`https://zerobalanceapp.ru/prices/${code}/`:`https://zerobalance.pro/en/prices/${code}/`;
      expect($('link[rel=canonical]').attr('href')).toBe(preferred);
      expect($(`link[hreflang=${lang}]`).attr('href')).toBe(preferred);
      expect($('link[hreflang=en]').attr('href')).toBe(`https://zerobalance.pro/en/prices/${code}/`);
      expect($('link[hreflang=ru]').attr('href')).toBe(`https://zerobalanceapp.ru/prices/${code}/`);
      expect($('link[hreflang=de]')).toHaveLength(0);
      expect($('a[href="https://support.apple.com/118283"]').length).toBeGreaterThan(0);
      expect($('[data-balance-form] input, [data-balance-form] select')).toHaveLength(2);
      expect($('#unit-limit')).toHaveLength(0);
      expect($('meta[name=robots]').attr('content')).toContain('index,follow');
    }
  });
  it('has 175 static country links and no JavaScript-only prices',async()=>{
    const $=load(await readFile('dist/en/prices/index.html','utf8'));
    expect($('.store-directory li')).toHaveLength(175);
    expect($('tbody tr')).toHaveLength(21);
    const csv=await readFile('dist/data/iap-prices-2026-10-02.csv','utf8');
    expect(csv.trim().split('\n')).toHaveLength(3676);
  });
  it('indexes only preferred URLs for both deployments',async()=>{
    const global=await readFile('dist/sitemap-0.xml','utf8');
    const ru=await readFile('dist-test-ru/sitemap-0.xml','utf8');
    expect(global).toContain('<loc>https://zerobalance.pro/en/prices/usa/</loc>');
    expect(global).not.toContain('<loc>https://zerobalance.pro/ru/');
    expect(ru).toContain('<loc>https://zerobalanceapp.ru/prices/rus/</loc>');
    expect(ru).not.toContain('<loc>https://zerobalanceapp.ru/en/');
    expect(ru).not.toContain('zerobalanceapp.ru/ru/');
  });
});
