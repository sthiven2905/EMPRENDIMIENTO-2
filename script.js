'use strict';

(() => {
  const WHATSAPP_NUMBER = '34623554090';
  const products = [
    {id:1,name:'Taladro inalámbrico',category:'herramientas',label:'Herramientas',description:'Una opción versátil para tareas de montaje, bricolaje y mantenimiento.',price:'Consultar precio',icon:'🔩',details:'Consulta los modelos disponibles, la potencia, la batería y los accesorios incluidos.'},
    {id:2,name:'Juego de llaves',category:'herramientas',label:'Herramientas',description:'Juego práctico para trabajos de ajuste, montaje y reparación.',price:'Consultar precio',icon:'🔧',details:'Pregúntanos por las medidas, el número de piezas y el material de fabricación.'},
    {id:3,name:'Caja de herramientas',category:'equipamiento',label:'Equipamiento',description:'Mantén tus herramientas organizadas y listas para trabajar.',price:'Consultar precio',icon:'🧰',details:'Podemos orientarte sobre tamaño, compartimentos y opciones de almacenamiento.'},
    {id:4,name:'Guantes de protección',category:'accesorios',label:'Accesorios',description:'Accesorio de protección para diferentes tareas de trabajo.',price:'Consultar precio',icon:'🧤',details:'Elige la protección adecuada según el uso. Consulta tallas y características.'},
    {id:5,name:'Amoladora angular',category:'herramientas',label:'Herramientas',description:'Herramienta eléctrica para tareas de corte y desbaste compatibles.',price:'Consultar precio',icon:'⚙️',details:'Consulta diámetro de disco, potencia, sistema de seguridad y accesorios compatibles.'},
    {id:6,name:'Carro de taller',category:'equipamiento',label:'Equipamiento',description:'Una solución para guardar y mover herramientas dentro del espacio de trabajo.',price:'Consultar precio',icon:'🛒',details:'Pregúntanos por dimensiones, capacidad de carga, cajones y ruedas.'},
    {id:7,name:'Gafas de seguridad',category:'accesorios',label:'Accesorios',description:'Protección ocular para trabajos que requieren seguridad adicional.',price:'Consultar precio',icon:'🥽',details:'Consulta el tipo de protección y la normativa aplicable a la tarea que vas a realizar.'},
    {id:8,name:'Maletín organizador',category:'equipamiento',label:'Equipamiento',description:'Guarda piezas pequeñas y accesorios de forma ordenada.',price:'Consultar precio',icon:'🗃️',details:'Consulta tamaños, separadores y capacidad para tus piezas y accesorios.'}
  ];

  const $ = (selector, root = document) => root.querySelector(selector); const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));
  const grid = $('#product-grid');
  const searchInput = $('#product-search');
  const count = $('#results-count');
  const emptyState = $('#empty-state');
  const clearSearchButton = $('#clear-search'); const filterButtons = $$('.filter-button');
  const menuToggle = $('.menu-toggle');
  const mainNav = $('#main-nav');
  const backToTop = $('#back-to-top');
  
  // Enlaces para Inicio / Volver arriba
  const footerUp = $('#footer-up-btn');
  const homeLink = $('#home-nav-link');
  const brandTop = $('#brand-top');
  const footerBrandLink = $('#footer-brand-link');

  // Modales
  const productModal = $('#productModal');
  const dialogContent = $('#dialog-content');
  const dialogClose = $('#dialog-close');
  
  const discountModal = $('#discountModal');
  const openDiscountBtn = $('#open-discount-btn');
  const discountClose = $('#discount-close');
  const copyCodeBtn = $('#copy-code-btn');
  const copyStatus = $('#copy-status');
  const promoCodeText = $('#promo-code-text');

  const contactForm = $('#contact-form');
  const formStatus = $('#form-status');

  let selectedCategory = 'todos';

  function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, character => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    })[character]);
  }

  function makeWhatsAppUrl(message) {
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  }

  function renderProducts() {
    if (!grid) return;
    const term = (searchInput?.value || '').trim().toLocaleLowerCase('es');
    const visibleProducts = products.filter(product => {
      const matchesCategory = selectedCategory === 'todos' || product.category === selectedCategory;
      const searchable = `${product.name} ${product.description} ${product.label}`.toLocaleLowerCase('es');
      return matchesCategory && searchable.includes(term);
    });

    grid.innerHTML = visibleProducts.map(product => `
      <article class="product-card" data-category="${product.category}">
        <div class="product-art"><span class="product-category">${escapeHTML(product.label)}</span><span class="product-emoji" aria-hidden="true">${product.icon}</span></div>
        <div class="product-info">
          <h3>${escapeHTML(product.name)}</h3>
          <p>${escapeHTML(product.description)}</p>
          <div class="product-bottom"><span class="product-price">${escapeHTML(product.price)}</span><button class="product-detail" type="button" data-product-id="${product.id}" aria-label="Ver detalles de ${escapeHTML(product.name)}">Ver detalles →</button></div>
        </div>
      </article>`).join('');

    if (count) count.textContent = `${visibleProducts.length} ${visibleProducts.length === 1 ? 'producto encontrado' : 'productos encontrados'}`;
    if (emptyState) emptyState.hidden = visibleProducts.length !== 0;
    grid.hidden = visibleProducts.length === 0;
  }

  function showProductDetails(productId) {
    const product = products.find(item => item.id === Number(productId));
    if (!product || !productModal || !dialogContent) return;
    const message = `Hola, quiero información sobre ${product.name}. ¿Podrían indicarme el precio y la disponibilidad?`;
    dialogContent.innerHTML = `
      <div class="dialog-art" aria-hidden="true">${product.icon}</div>
      <span class="dialog-category">${escapeHTML(product.label)}</span>
      <h2 id="dialog-title">${escapeHTML(product.name)}</h2>
      <p>${escapeHTML(product.description)}</p>
      <p>${escapeHTML(product.details)}</p>
      <strong>${escapeHTML(product.price)}</strong>
      <div class="dialog-actions">
        <a class="button" href="${makeWhatsAppUrl(message)}" target="_blank" rel="noopener noreferrer">
          <i class="fa-brands fa-whatsapp"></i> Consultar por WhatsApp ↗
        </a>
        <button class="button button-outline" type="button" data-close-dialog="true">Cerrar</button>
      </div>`;
    productModal.classList.add('active');
    document.body.classList.add('dialog-open');
  }

  function closeDialog() {
    if (productModal) productModal.classList.remove('active');
    document.body.classList.remove('dialog-open');
  }

  // Funciones del Modal de Descuento
  function openDiscountModal(e) {
    if (e) e.preventDefault();
    if (discountModal) discountModal.classList.add('active');
    document.body.classList.add('dialog-open');
  }

  function closeDiscountModal() {
    if (discountModal) discountModal.classList.remove('active');
    document.body.classList.remove('dialog-open');
    if (copyStatus) copyStatus.hidden = true;
  }

  // Copiar código al portapapeles
  copyCodeBtn?.addEventListener('click', () => {
    const code = promoCodeText?.textContent || 'JIMCARVIP10';
    navigator.clipboard.writeText(code).then(() => {
      if (copyStatus) {
        copyStatus.hidden = false;
        setTimeout(() => { copyStatus.hidden = true; }, 3500);
      }
    }).catch(err => {
      console.error('Error al copiar el código', err);
    });
  });

  openDiscountBtn?.addEventListener('click', openDiscountModal);
  discountClose?.addEventListener('click', closeDiscountModal);
  discountModal?.addEventListener('click', event => {
    if (event.target === discountModal) closeDiscountModal();
  });

  // Desplazamiento a la parte superior exacta de la página
  function scrollToTop(e) {
    if (e) e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    closeMobileMenu();
  }

  homeLink?.addEventListener('click', scrollToTop);
  brandTop?.addEventListener('click', scrollToTop);
  footerUp?.addEventListener('click', scrollToTop);
  footerBrandLink?.addEventListener('click', scrollToTop);

  function closeMobileMenu() {
    if (!menuToggle || !mainNav) return;
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Abrir menú');
    mainNav.classList.remove('is-open');
  }

  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      selectedCategory = button.dataset.category || 'todos';
      filterButtons.forEach(item => {
        const isActive = item === button;
        item.classList.toggle('active', isActive);
        item.setAttribute('aria-pressed', String(isActive));
      });
      renderProducts();
    });
  });

  searchInput?.addEventListener('input', renderProducts);
  clearSearchButton?.addEventListener('click', () => {
    if (searchInput) searchInput.value = '';
    selectedCategory = 'todos';
    filterButtons.forEach(button => {
      const isActive = button.dataset.category === 'todos';
      button.classList.toggle('active', isActive);
      button.setAttribute('aria-pressed', String(isActive));
    });
    renderProducts();
    searchInput?.focus();
  });

  grid?.addEventListener('click', event => {
    const button = event.target.closest('[data-product-id]');
    if (button) showProductDetails(button.dataset.productId);
  });

  dialogClose?.addEventListener('click', closeDialog);
  productModal?.addEventListener('click', event => {
    if (event.target === productModal) closeDialog();
    if (event.target.closest('[data-close-dialog]')) closeDialog();
  });

  menuToggle?.addEventListener('click', () => {
    const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', String(!isOpen));
    menuToggle.setAttribute('aria-label', isOpen ? 'Abrir menú' : 'Cerrar menú');
    mainNav?.classList.toggle('is-open', !isOpen);
  });
  
  $$('.main-nav a:not(#home-nav-link)').forEach(link => link.addEventListener('click', closeMobileMenu));
  document.addEventListener('keydown', event => { 
    if (event.key === 'Escape') {
      closeMobileMenu();
      closeDialog();
      closeDiscountModal();
    }
  });

  function updateBackToTop() {
    backToTop?.classList.toggle('visible', window.scrollY > 450);
  }
  window.addEventListener('scroll', updateBackToTop, { passive: true });
  backToTop?.addEventListener('click', scrollToTop);

  contactForm?.addEventListener('submit', event => {
    event.preventDefault();
    if (!contactForm.reportValidity()) return;
    const formData = new FormData(contactForm);
    const name = String(formData.get('nombre') || '').trim();
    const email = String(formData.get('email') || '').trim();
    const message = String(formData.get('mensaje') || '').trim();
    const whatsappMessage = [
      'Hola, JIMCARSERVIS. Quiero hacer una consulta.',
      `Nombre: ${name}`,
      email ? `Correo: ${email}` : '',
      `Consulta: ${message}`
    ].filter(Boolean).join('\n');
    if (formStatus) formStatus.textContent = 'Se abrirá WhatsApp con tu mensaje preparado. Revisa el texto y pulsa Enviar en WhatsApp.';
    const newWindow = window.open(makeWhatsAppUrl(whatsappMessage), '_blank', 'noopener,noreferrer');
    if (!newWindow) window.location.href = makeWhatsAppUrl(whatsappMessage);
  });

  const year = $('#current-year');
  if (year) year.textContent = String(new Date().getFullYear());

  updateBackToTop();
})();