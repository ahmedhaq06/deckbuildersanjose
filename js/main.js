// Main JavaScript for San Jose Decks & Patios Redesign

document.addEventListener('DOMContentLoaded', () => {
  initStickyHeader();
  initMobileMenu();
  initBeforeAfterSlider();
  initEstimatorWidget();
  initNeighborhoodFilters();
  initGalleryFilters();
  initFaqAccordions();
  initLeadForms();
  initPageTransitions();
});

// 1. Sticky Navigation Effect
function initStickyHeader() {
  const header = document.querySelector('.main-header');
  if (!header) return;

  const handleScroll = () => {
    if (window.scrollY > 30) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}

// 2. Mobile Menu Drawer
function initMobileMenu() {
  const toggleBtn = document.querySelector('.mobile-toggle');
  const drawer = document.querySelector('.mobile-drawer');
  const backdrop = document.querySelector('.drawer-backdrop');
  const closeBtn = document.querySelector('.drawer-close');

  if (!toggleBtn || !drawer || !backdrop) return;

  const openDrawer = () => {
    drawer.classList.add('open');
    backdrop.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const closeDrawer = () => {
    drawer.classList.remove('open');
    backdrop.classList.remove('active');
    document.body.style.overflow = '';
  };

  toggleBtn.addEventListener('click', openDrawer);
  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
  backdrop.addEventListener('click', closeDrawer);

  const drawerLinks = drawer.querySelectorAll('a');
  drawerLinks.forEach(link => {
    link.addEventListener('click', closeDrawer);
  });
}

// 3. Before & After Interactive Comparison Slider
function initBeforeAfterSlider() {
  const container = document.querySelector('.comparison-container');
  if (!container) return;

  const beforeBox = container.querySelector('.comparison-before');
  const beforeImg = beforeBox ? beforeBox.querySelector('img') : null;
  const handle = container.querySelector('.comparison-handle');

  if (!beforeBox || !beforeImg || !handle) return;

  let isDragging = false;

  const updateSlider = (clientX) => {
    const rect = container.getBoundingClientRect();
    let posX = clientX - rect.left;
    if (posX < 0) posX = 0;
    if (posX > rect.width) posX = rect.width;

    const percentage = (posX / rect.width) * 100;
    beforeBox.style.width = `${percentage}%`;
    handle.style.left = `${percentage}%`;
    beforeImg.style.width = `${rect.width}px`;
  };

  const onStart = (e) => {
    isDragging = true;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    updateSlider(clientX);
  };

  const onMove = (e) => {
    if (!isDragging) return;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    updateSlider(clientX);
  };

  const onEnd = () => {
    isDragging = false;
  };

  container.addEventListener('mousedown', onStart);
  window.addEventListener('mousemove', onMove);
  window.addEventListener('mouseup', onEnd);

  container.addEventListener('touchstart', onStart, { passive: true });
  window.addEventListener('touchmove', onMove, { passive: true });
  window.addEventListener('touchend', onEnd);

  window.addEventListener('resize', () => {
    const rect = container.getBoundingClientRect();
    beforeImg.style.width = `${rect.width}px`;
  });

  // Initial sizing trigger
  setTimeout(() => {
    const rect = container.getBoundingClientRect();
    beforeImg.style.width = `${rect.width}px`;
  }, 100);
}

// 4. Interactive Project Cost & Scope Estimator Widget
function initEstimatorWidget() {
  const widget = document.querySelector('.estimator-widget');
  if (!widget) return;

  const projectPills = widget.querySelectorAll('.project-pill');
  const materialPills = widget.querySelectorAll('.material-pill');
  const sizeSlider = widget.querySelector('#estimatorSizeSlider');
  const sizeDisplay = widget.querySelector('#estimatorSizeDisplay');
  const priceDisplay = widget.querySelector('#estimatedPriceDisplay');
  const timelineDisplay = widget.querySelector('#estimatedTimelineDisplay');
  const scopeNotesDisplay = widget.querySelector('#estimatedScopeNotes');
  const prefillButton = widget.querySelector('#estimatorBookBtn');

  // Rates in San Jose Market
  const rates = {
    composite: { baseMin: 45, baseMax: 70, daysPer100SqFt: 2.2, label: 'Composite Decking' },
    wood: { baseMin: 32, baseMax: 50, daysPer100SqFt: 1.8, label: 'Custom Redwood / Wood Deck' },
    patio_cover: { baseMin: 38, baseMax: 65, daysPer100SqFt: 2.0, label: 'Covered Patio & Ceiling' },
    pergola: { baseMin: 28, baseMax: 48, daysPer100SqFt: 1.5, label: 'Custom Pergola' },
    repair: { baseMin: 18, baseMax: 35, daysPer100SqFt: 1.0, label: 'Deck & Patio Restoration' }
  };

  const materialMultipliers = {
    timbertech: 1.25,
    trex: 1.15,
    redwood: 1.0,
    cedar: 1.08,
    aluminum: 1.20
  };

  let selectedProject = 'composite';
  let selectedMaterial = 'timbertech';
  let selectedSize = 350;

  const calculateEstimate = () => {
    const projectData = rates[selectedProject] || rates.composite;
    const materialMult = materialMultipliers[selectedMaterial] || 1.0;

    let minPrice = Math.round(selectedSize * projectData.baseMin * materialMult);
    let maxPrice = Math.round(selectedSize * projectData.baseMax * materialMult);

    // Round to nearest 500
    minPrice = Math.ceil(minPrice / 500) * 500;
    maxPrice = Math.ceil(maxPrice / 500) * 500;

    const days = Math.round(selectedSize * projectData.daysPer100SqFt / 100);
    const weeks = Math.max(1, Math.round(days / 5));

    if (sizeDisplay) sizeDisplay.textContent = `${selectedSize} sq ft`;
    if (priceDisplay) priceDisplay.textContent = `$${minPrice.toLocaleString()} - $${maxPrice.toLocaleString()}`;
    if (timelineDisplay) timelineDisplay.textContent = `Estimated Build Time: ${weeks} to ${weeks + 1} Weeks`;

    if (scopeNotesDisplay) {
      scopeNotesDisplay.textContent = `Includes owner Joel's on-site consultation, permit guidance for San Jose, tear-down, foundation footings, and structural hardware.`;
    }
  };

  projectPills.forEach(pill => {
    pill.addEventListener('click', () => {
      projectPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      selectedProject = pill.dataset.type || 'composite';
      calculateEstimate();
    });
  });

  materialPills.forEach(pill => {
    pill.addEventListener('click', () => {
      materialPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      selectedMaterial = pill.dataset.material || 'timbertech';
      calculateEstimate();
    });
  });

  if (sizeSlider) {
    sizeSlider.addEventListener('input', (e) => {
      selectedSize = parseInt(e.target.value, 10);
      calculateEstimate();
    });
  }

  if (prefillButton) {
    prefillButton.addEventListener('click', () => {
      const contactForm = document.querySelector('#quickConsultForm') || document.querySelector('#contactMainForm');
      if (contactForm) {
        const detailsInput = contactForm.querySelector('textarea[name="project_details"]') || contactForm.querySelector('textarea');
        if (detailsInput) {
          detailsInput.value = `I am looking for a ${selectedProject} project (~${selectedSize} sq ft) with ${selectedMaterial} materials. Estimated range: ${priceDisplay ? priceDisplay.textContent : ''}.`;
        }
        contactForm.scrollIntoView({ behavior: 'smooth' });
        const nameField = contactForm.querySelector('input[type="text"]');
        if (nameField) nameField.focus();
      } else {
        window.location.href = `contact.html?project=${selectedProject}&size=${selectedSize}&material=${selectedMaterial}`;
      }
    });
  }

  calculateEstimate();
}

// 5. Neighborhood Directory Search & Filter (Service Areas Page)
function initNeighborhoodFilters() {
  const searchInput = document.querySelector('.neighborhood-search-input');
  const filterButtons = document.querySelectorAll('.area-filter-btn');
  const cards = document.querySelectorAll('.neighborhood-card');
  const countBadge = document.querySelector('#neighborhoodCountBadge');

  if (!cards.length) return;

  let activeRegion = 'all';
  let searchTerm = '';

  const filterCards = () => {
    let visibleCount = 0;

    cards.forEach(card => {
      const name = (card.dataset.name || '').toLowerCase();
      const region = (card.dataset.region || '').toLowerCase();
      const text = card.textContent.toLowerCase();

      const matchesSearch = !searchTerm || name.includes(searchTerm) || text.includes(searchTerm);
      const matchesRegion = activeRegion === 'all' || region === activeRegion;

      if (matchesSearch && matchesRegion) {
        card.style.display = 'flex';
        visibleCount++;
      } else {
        card.style.display = 'none';
      }
    });

    if (countBadge) {
      countBadge.textContent = `Showing ${visibleCount} communities in South Bay`;
    }
  };

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchTerm = e.target.value.trim().toLowerCase();
      filterCards();
    });
  }

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeRegion = btn.dataset.region || 'all';
      filterCards();
    });
  });
}

// 6. Project Gallery Filter (Gallery Page)
function initGalleryFilters() {
  const filterBtns = document.querySelectorAll('.gallery-filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');

  if (!galleryItems.length || !filterBtns.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;

      galleryItems.forEach(item => {
        const cat = item.dataset.category;
        if (filter === 'all' || cat === filter) {
          item.style.display = 'block';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });
}

// 7. FAQ Accordion Logic
function initFaqAccordions() {
  const faqItems = document.querySelectorAll('.faq-item');
  if (!faqItems.length) return;

  faqItems.forEach(item => {
    const trigger = item.querySelector('.faq-trigger');
    const content = item.querySelector('.faq-content');

    if (!trigger || !content) return;

    trigger.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');

      // Close all others
      faqItems.forEach(other => {
        if (other !== item) {
          other.classList.remove('open');
          const otherContent = other.querySelector('.faq-content');
          if (otherContent) otherContent.style.maxHeight = null;
        }
      });

      if (isOpen) {
        item.classList.remove('open');
        content.style.maxHeight = null;
      } else {
        item.classList.add('open');
        content.style.maxHeight = content.scrollHeight + 30 + 'px';
      }
    });
  });
}

// 8. Lead Capture Forms & Confirmation Dialog
function initLeadForms() {
  const forms = document.querySelectorAll('.lead-capture-form');
  const modal = document.querySelector('#callbackConfirmationModal');
  const modalCloseBtn = document.querySelector('#modalCloseBtn');

  if (!forms.length) return;

  const showModal = (clientName, phone) => {
    if (!modal) {
      alert(`Thank you, ${clientName}! Joel and our team will call or text you shortly at ${phone}.`);
      return;
    }
    const nameSpan = modal.querySelector('#confirmedClientName');
    const phoneSpan = modal.querySelector('#confirmedClientPhone');

    if (nameSpan) nameSpan.textContent = clientName || 'there';
    if (phoneSpan) phoneSpan.textContent = phone || 'your number';

    modal.classList.add('active');
  };

  const closeModal = () => {
    if (modal) modal.classList.remove('active');
  };

  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });
  }

  forms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const nameInput = form.querySelector('input[name="client_name"]') || form.querySelector('input[type="text"]');
      const phoneInput = form.querySelector('input[name="client_phone"]') || form.querySelector('input[type="tel"]');

      const name = nameInput ? nameInput.value : '';
      const phone = phoneInput ? phoneInput.value : '';

      showModal(name, phone);
      form.reset();
    });
  });
}

// 8. Subtle Page Transitions Both Ways (Enter, Exit, Back & Forward)
function initPageTransitions() {
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a');
    if (!link) return;

    const href = link.getAttribute('href');
    if (!href) return;

    // Skip in-page anchors, tel:, mailto:, javascript:, new tabs, or key-modified clicks
    if (
      href.startsWith('#') ||
      href.startsWith('tel:') ||
      href.startsWith('mailto:') ||
      href.startsWith('javascript:') ||
      link.target === '_blank' ||
      e.ctrlKey ||
      e.metaKey ||
      e.shiftKey
    ) {
      return;
    }

    try {
      const targetUrl = new URL(href, window.location.href);
      if (targetUrl.origin === window.location.origin) {
        if (targetUrl.pathname === window.location.pathname && targetUrl.search === window.location.search) {
          return;
        }

        e.preventDefault();
        document.body.classList.add('page-leaving');

        setTimeout(() => {
          window.location.href = href;
        }, 180);
      }
    } catch (err) {
      // Fallback
    }
  });

  // Remove page-leaving class if restored from back/forward cache
  window.addEventListener('pageshow', () => {
    document.body.classList.remove('page-leaving');
  });
}
