// Общие утилиты
function qs(selector, root = document) { return root.querySelector(selector); }
function qsa(selector, root = document) { return Array.from(root.querySelectorAll(selector)); }

// Проекты: фильтрация и модалка
(function initProjects() {
  const grid = qs('.project-grid');
  if (!grid) return;

  // Фильтрация
  qsa('.projects-filter .btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const tag = btn.getAttribute('data-filter');
      qsa('.project-card', grid).forEach(card => {
        const tags = (card.getAttribute('data-tags') || '').split(/\s+/);
        const visible = tag === 'all' || tags.includes(tag);
        card.style.display = visible ? '' : 'none';
      });
    });
  });

  // Модалка
  const backdrop = qs('#projectModal');
  const titleEl = qs('#modalTitle');
  const descEl = qs('#modalDesc');
  const liveEl = qs('#modalLive');
  const codeEl = qs('#modalCode');

  function openModal(data) {
    titleEl.textContent = data.title;
    descEl.textContent = data.desc;
    liveEl.href = data.live || '#';
    codeEl.href = data.code || '#';
    backdrop.classList.add('active');
  }
  function closeModal() { backdrop.classList.remove('active'); }

  qsa('.project-card', grid).forEach(card => {
    card.addEventListener('click', () => {
      const title = qs('h3', card)?.textContent || 'Проект';
      const desc = qs('p', card)?.textContent || '';
      openModal({ title, desc, live: '#', code: '#' });
    });
  });

  backdrop?.addEventListener('click', (e) => { if (e.target === backdrop) closeModal(); });
  qs('[data-close]', backdrop)?.addEventListener('click', closeModal);
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });
})();

// Контакты: валидация формы
(function initContactsForm() {
  const form = qs('#contactForm');
  if (!form) return;

  const nameEl = qs('#name');
  const emailEl = qs('#email');
  const messageEl = qs('#message');

  function showError(input, message) {
    const err = qs(`[data-error-for="${input.id}"]`);
    if (err) err.textContent = message || '';
    input.setAttribute('aria-invalid', message ? 'true' : 'false');
  }

  function validate() {
    let valid = true;
    // Имя
    if (!nameEl.value || nameEl.value.trim().length < 2) {
      showError(nameEl, 'Введите минимум 2 символа');
      valid = false;
    } else showError(nameEl, '');
    // Email
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
    if (!re.test(emailEl.value)) { showError(emailEl, 'Введите корректный email'); valid = false; }
    else showError(emailEl, '');
    // Сообщение
    if (!messageEl.value || messageEl.value.trim().length < 10) {
      showError(messageEl, 'Минимум 10 символов'); valid = false;
    } else showError(messageEl, '');
    return valid;
  }

  qsa('input, textarea', form).forEach(el => {
    el.addEventListener('input', validate);
    el.addEventListener('blur', validate);
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!validate()) return;
    alert('Сообщение отправлено!');
    form.reset();
  });
})();

// Дневник: добавление записи
(function initDiary() {
  const form = qs('#addRecord');
  const list = qs('#timeline');
  if (!form || !list) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const input = qs('#recordText');
    const text = (input.value || '').trim();
    if (!text) return;
    const item = document.createElement('div');
    item.className = 'timeline-item panel';
    item.textContent = text;
    list.prepend(item);
    input.value = '';
  });
})();


