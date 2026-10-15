import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const read = p => readFileSync(resolve(root,p),'utf8');
const pages = readdirSync(root).filter(f=>f.endsWith('.html'));
const nav = ['index.html','watchdog.html','tallybook.html','solutions.html','about.html','learn.html','faq.html'];
const refs = html => [...html.matchAll(/\b(?:href|src)="([^"]+)"/g)].map(m=>m[1]);
test('ten pages and essential assets exist',()=>{
  assert.equal(pages.length,10);
  for(const name of ['assets/app.js','assets/site-config.js','assets/style.css','assets/learning.js','assets/faq.js','assets/logo.svg'])assert.ok(existsSync(resolve(root,name)),name);
});
for(const file of pages){
  test(file+' has title, description, landmarks, skip link and navigation',()=>{
    const html=read(file);
    for(const element of ['<html lang="en"','<title>','name="description"','name="viewport"','<main id="content"','<header','<footer','href="#content"','<h1'])assert.ok(html.includes(element),file+': '+element);
    assert.equal((html.match(/<h1\b/g)||[]).length,1,file+': single h1');
    assert.equal((html.match(/class="navlinks"/g)||[]).length,1,file+': navlinks');
    for(const link of nav)assert.ok(html.includes('href="'+link+'"'),file+': nav missing '+link);
    assert.ok(html.includes('aria-controls="navlinks"'),file+': menu association');
    for(const dest of refs(html)){
      if(/^(?:https?:|mailto:|tel:|data:|#|\/\/)/.test(dest))continue;
      const path=dest.split('#')[0].split('?')[0];
      if(path)assert.ok(existsSync(resolve(root,path)),file+': broken asset '+path);
    }
  });
}
test('contact is an honest local preparation workflow, not a false registration',()=>{
  const html=read('contact.html'), js=read('assets/app.js'), config=read('assets/site-config.js');
  for(const id of ['interest-form','prepared-message','inquiry-preview','copy-inquiry','form-result'])assert.ok(html.includes('id="'+id+'"'),id);
  assert.ok(html.includes('nothing leaves this website') || html.includes('nothing has been sent') || html.includes('no information leaves'), 'clear warning');
  assert.ok(config.includes("contactEmail: ''"), 'placeholder must not be active');
  assert.ok(js.includes('preview.hidden = false') && js.includes('navigator.clipboard'));
  assert.ok(!js.includes("const address='hello@alchemy.example'"),'no bogus outgoing mailto');
});
test('copy, FAQ and course scripts use local-only mechanisms',()=>{
  assert.ok(read('assets/faq.js').includes('addEventListener'));
  assert.ok(read('assets/learning.js').includes('localStorage'));
  assert.ok(read('assets/app.js').includes('Escape'));
});
test('styles include reduced motion, responsive navigation, and visible keyboard focus',()=>{
 const css=read('assets/style.css');
 for(const v of ['prefers-reduced-motion','focus-visible','max-width: 980px','.navlinks.open','.inquiry-preview'])assert.ok(css.includes(v),v);
});
