/* Alchemy Learn: progressive enhancement. Six topics remain visible without JavaScript. */
(() => {
  'use strict';
  const forms = [...document.querySelectorAll('[data-quiz]')];
  if (forms.length !== 6) return;
  const key = 'alchemy-watchdog-course-v1'; // Preserve earlier course progress
  const moduleLinks = [...document.querySelectorAll('[data-open-lesson]')];
  const panels = [...document.querySelectorAll('[data-lesson]')];
  const progress = document.getElementById('course-progress');
  const progressBar = document.getElementById('course-bar');
  const reset = document.getElementById('course-reset');
  const resume = document.getElementById('course-resume');
  const completion = document.getElementById('course-complete');
  const review = document.getElementById('course-review');
  let saved = new Set();
  let canStore = true;
  try {
    const data = JSON.parse(localStorage.getItem(key) || '[]');
    if (Array.isArray(data)) saved = new Set(data.filter(n => Number.isInteger(n) && n >= 0 && n < forms.length));
  } catch (_) { canStore = false; }
  function persist() {
    if (!canStore) return;
    try { localStorage.setItem(key, JSON.stringify([...saved])); }
    catch (_) { canStore = false; }
  }
  function render() {
    progress.textContent = saved.size + ' of ' + forms.length + ' completed';
    progressBar.value = saved.size;
    document.querySelectorAll('[data-status]').forEach(el => {
      const done = saved.has(Number(el.dataset.status));
      el.textContent = done ? '✓ Completed' : 'Not started';
      el.classList.toggle('is-complete', done);
    });
    completion.hidden = saved.size !== forms.length;
  }
  const getHash = () => {
    const match = /^#lesson-([1-6])$/.exec(window.location.hash);
    return match ? Number(match[1]) - 1 : null;
  };
  function openLesson(index, options = {}) {
    if (!Number.isInteger(index) || index < 0 || index >= panels.length) return;
    panels.forEach((panel, i) => { panel.hidden = i !== index; });
    moduleLinks.forEach(link => {
      const active = Number(link.dataset.openLesson) === index;
      if (link.hasAttribute('data-module')) link.dataset.active = String(active);
      if (link.hasAttribute('data-step-link')) {
        if (active) link.setAttribute('aria-current', 'step');
        else link.removeAttribute('aria-current');
      }
    });
    if (options.updateHash && window.location.hash !== '#lesson-' + (index + 1)) {
      history.pushState(null, '', '#lesson-' + (index + 1));
    }
    if (options.scroll) {
      panels[index].scrollIntoView({ behavior: 'auto', block: 'start' });
      panels[index].querySelector('h2')?.focus({ preventScroll: true });
    }
  }
  moduleLinks.forEach(link => link.addEventListener('click', event => {
    event.preventDefault();
    openLesson(Number(link.dataset.openLesson), { updateHash: true, scroll: true });
  }));
  document.querySelectorAll('[data-go-lesson]').forEach(button => button.addEventListener('click', () => {
    openLesson(Number(button.dataset.goLesson), { updateHash: true, scroll: true });
  }));
  window.addEventListener('popstate', () => { const value = getHash(); if (value !== null) openLesson(value); });
  window.addEventListener('hashchange', () => { const value = getHash(); if (value !== null) openLesson(value); });
  resume?.addEventListener('click', () => {
    const next = forms.findIndex((_, index) => !saved.has(index));
    openLesson(next < 0 ? 0 : next, { updateHash: true, scroll: true });
  });
  review?.addEventListener('click', () => openLesson(0, { updateHash: true, scroll: true }));
  forms.forEach((form, index) => form.addEventListener('submit', event => {
    event.preventDefault();
    const choice = form.querySelector('input[type="radio"]:checked');
    const result = form.querySelector('.quiz-result');
    if (!choice) {
      result.textContent = 'Choose one answer to continue.';
      result.dataset.result = 'incorrect';
      return;
    }
    if (choice.value === form.dataset.answer) {
      saved.add(index);
      result.textContent = form.dataset.explanation || 'Correct — module completed.';
      result.dataset.result = 'correct';
      persist();
      render();
    } else {
      result.textContent = 'Not quite. Review the learning steps above and try again.';
      result.dataset.result = 'incorrect';
    }
  }));
  reset?.addEventListener('click', () => {
    saved.clear();
    if (canStore) {
      try { localStorage.removeItem(key); }
      catch (_) { canStore = false; }
    }
    forms.forEach(form => {
      form.reset();
      const result = form.querySelector('.quiz-result');
      result.textContent = '';
      delete result.dataset.result;
    });
    render();
    progress.focus?.();
  });
  render();
  openLesson(getHash() ?? 0);
})();
