import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import { readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const root = resolve('.');
const pages = readdirSync(root).filter(name => name.endsWith('.html'));
const browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] });
let checked = 0;
try {
  for (const width of [390, 768, 1440]) {
    const context = await browser.newContext({ viewport: { width, height: 860 }, reducedMotion: 'reduce' });
    for (const filename of pages) {
      const page = await context.newPage();
      const errors = [];
      page.on('pageerror', err => errors.push(err.message));
      await page.goto(pathToFileURL(resolve(root, filename)).href, { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(75);
      assert.equal(await page.locator('h1').count(), 1, filename + ': h1');
      assert.ok(await page.locator('footer').count() === 1, filename + ': footer');
      const dimensions = await page.evaluate(() => ({
        viewport: document.documentElement.clientWidth,
        content: document.documentElement.scrollWidth
      }));
      assert.ok(dimensions.content <= dimensions.viewport + 2, filename + ' at ' + width + 'px overflows: ' + JSON.stringify(dimensions));
      assert.deepEqual(errors, [], filename + ': JS exceptions');
      if (filename === 'index.html' || filename === 'contact.html') {
        await page.screenshot({ path: 'artifacts/' + filename.replace('.html', '') + '-' + width + '.png', fullPage: true });
      }
      checked += 1;
      await page.close();
    }
    await context.close();
  }
  const context = await browser.newContext({ viewport: { width: 390, height: 840 }, reducedMotion: 'reduce' });
  const page = await context.newPage();
  await page.goto(pathToFileURL(resolve(root, 'index.html')).href);
  const toggle = page.locator('.menu-toggle');
  await toggle.click();
  assert.equal(await toggle.getAttribute('aria-expanded'), 'true', 'menu opens');
  assert.ok(await page.locator('.navlinks').isVisible(), 'nav visible');
  await page.keyboard.press('Escape');
  assert.equal(await toggle.getAttribute('aria-expanded'), 'false', 'Escape closes menu');

  await page.goto(pathToFileURL(resolve(root, 'contact.html')).href);
  assert.ok(await page.locator('.nav-contact').isVisible(), 'contact visible on mobile');
  assert.ok(await page.locator('.nojs-note').isHidden(), 'js-only fallback hidden with script');
  await page.locator('#full-name').fill('QA Tester');
  await page.locator('#email').fill('qa@example.net');
  await page.locator('#message').fill('Please keep the site as a local preview.');
  await page.locator('.contact-submit').click();
  assert.ok(await page.locator('#inquiry-preview').isVisible(), 'inquiry preview');
  const inquiry = await page.locator('#prepared-message').inputValue();
  assert.ok(inquiry.includes('QA Tester') && inquiry.includes('qa@example.net'), 'prepared copy');
  assert.ok(await page.locator('#send-inquiry').isHidden(), 'placeholder does not activate sending');
  assert.ok((await page.locator('#form-result').textContent()).includes('nothing has been sent'), 'no false success message');
  assert.ok(!page.url().includes('QA+Tester') && !page.url().includes('qa%40'), 'PII not put in URL');

  await page.goto(pathToFileURL(resolve(root, 'faq.html')).href);
  await page.locator('#faq-search').fill('no-such-query-unlikely');
  assert.ok(await page.locator('#faq-empty').isVisible(), 'empty FAQ search result');
  await page.locator('#faq-search').fill('');
  assert.ok((await page.locator('#faq-count').textContent()).includes('17 of 17'), 'restored FAQs');

  await page.goto(pathToFileURL(resolve(root, 'learn.html')).href);
  const lesson = page.locator('[data-quiz="0"]');
  await lesson.locator('input[value="1"]').check();
  await lesson.locator('button[type="submit"]').click();
  assert.ok((await page.locator('#course-progress').textContent()).includes('1 of 6'), 'learning progress');

  const noJs = await browser.newContext({ viewport: { width: 390, height: 840 }, javaScriptEnabled: false });
  const noJsPage = await noJs.newPage();
  await noJsPage.goto(pathToFileURL(resolve(root, 'contact.html')).href);
  assert.ok(await noJsPage.locator('.nojs-note').isVisible(), 'no-script notice visible');
  assert.ok(await noJsPage.locator('#interest-form').isHidden(), 'no-script form hidden to prevent PII transmission');
  assert.ok(await noJsPage.locator('.navlinks').isVisible(), 'no-script navigation usable');
  await noJs.close();
  await context.close();
  console.log('Browser QA PASSED: ' + checked + ' responsive page checks + navigation, contact, FAQ, course and no-JS privacy.');
} finally {
  await browser.close();
}
