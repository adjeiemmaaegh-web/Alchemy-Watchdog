/* Lightweight, progressively enhanced site interaction. No analytics or form backend. */
(() => {
  'use strict';
  const year = document.getElementById('yr');
  if (year) year.textContent = String(new Date().getFullYear());

  const button = document.querySelector('.menu-toggle');
  const links = document.querySelector('.navlinks');
  if (button && links) {
    const close = (restoreFocus = false) => {
      links.classList.remove('open');
      button.setAttribute('aria-expanded', 'false');
      button.setAttribute('aria-label', 'Open navigation menu');
      button.textContent = '☰';
      if (restoreFocus) button.focus();
    };
    button.addEventListener('click', () => {
      const open = links.classList.toggle('open');
      button.setAttribute('aria-expanded', String(open));
      button.setAttribute('aria-label', open ? 'Close navigation menu' : 'Open navigation menu');
      button.textContent = open ? '✕' : '☰';
    });
    links.querySelectorAll('a').forEach(a => a.addEventListener('click', () => close()));
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && links.classList.contains('open')) close(true);
    });
    document.addEventListener('click', event => {
      if (links.classList.contains('open') && !event.target.closest('.nav')) close();
    });
    window.addEventListener('resize', () => {
      if (window.innerWidth > 980 && links.classList.contains('open')) close();
    });
  }

  const observer = 'IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ? new IntersectionObserver(entries => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        }
      }, { threshold: 0.08 })
    : null;
  document.querySelectorAll('.reveal').forEach(element => observer
    ? observer.observe(element) : element.classList.add('visible'));

  const form = document.getElementById('interest-form');
  if (!form) return;
  const preview = document.getElementById('inquiry-preview');
  const prepared = document.getElementById('prepared-message');
  const status = document.getElementById('form-result');
  const copy = document.getElementById('copy-inquiry');
  const send = document.getElementById('send-inquiry');
  const configuredEmail = window.ALCHEMY_SITE_CONFIG?.contactEmail?.trim() || '';
  const verified = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(configuredEmail)
    && !configuredEmail.endsWith('.example');

  const updateMessage = () => {
    const fields = new FormData(form);
    const product = String(fields.get('product') || 'Alchemy');
    const subject = 'Alchemy website inquiry — ' + product;
    const body = [
      'Hello Alchemy team,', '',
      'I am interested in ' + product + '.',
      'Name: ' + String(fields.get('name') || '').trim(),
      'Reply-to email: ' + String(fields.get('email') || '').trim(),
      'Message: ' + String(fields.get('message') || '').trim(),
      '', 'Prepared locally; not sent by the Alchemy website.'
    ].join('\n');
    prepared.value = 'Subject: ' + subject + '\n\n' + body;
    if (verified) {
      send.href = 'mailto:' + encodeURIComponent(configuredEmail) +
        '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
      send.hidden = false;
    } else {
      send.removeAttribute('href');
      send.hidden = true;
    }
  };

  form.addEventListener('submit', event => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    updateMessage();
    preview.hidden = false;
    status.textContent = verified
      ? 'Your message is prepared. Copy it or choose Open email application; nothing has been sent.'
      : 'Your message is prepared. Copy it below. The Alchemy contact inbox is not configured, so nothing has been sent.';
    preview.scrollIntoView({ block: 'nearest', behavior: 'auto' });
  });
  form.addEventListener('input', () => {
    if (!preview.hidden) {
      preview.hidden = true;
      status.textContent = 'Details changed. Prepare your message again.';
    }
  });
  copy.addEventListener('click', async () => {
    if (preview.hidden || !prepared.value) return;
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
      await navigator.clipboard.writeText(prepared.value);
      status.textContent = 'Message copied. No information has been sent to Alchemy.';
    } catch (_) {
      prepared.focus();
      prepared.select();
      status.textContent = 'Select and copy the highlighted message. No information has been sent.';
    }
  });
})();
