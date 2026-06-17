import { travelData } from './data.js';

// --- Page Initialization Logic ---
document.addEventListener('DOMContentLoaded', () => {
  initLoader();
  initNavigation();
  initModals();
  initScrollReveal();
  initToursSlider();
  
  // Dynamic Page Routing Handlers
  const currentPath = window.location.pathname;
  if (currentPath.includes('destinations')) {
    renderAllDestinations();
  } else if (currentPath.includes('location')) {
    renderLocationDetails();
  } else if (currentPath.includes('service')) {
    renderServiceDetails();
  } else {
    renderHomepageDestinations();
    initHomepageFilters();
  }
});

function initLoader() {
  const loader = document.getElementById('loader');
  if (!loader) return; // Not on every page
  
  setTimeout(() => {
    loader.classList.add('fade-out');
    document.body.classList.add('loaded');
  }, 1200); // Wait 1.2s then fade out
}

function initNavigation() {
  const header = document.querySelector('.header');
  const menuToggle = document.querySelector('.menu-toggle');
  const navLinksContainer = document.querySelector('.nav-animated');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) header.classList.add('scrolled');
    else if (!document.body.classList.contains('inner-page')) header.classList.remove('scrolled');
    
    // Bulletproof scrollspy for bottom section
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 50) {
      const aboutRadio = document.getElementById('rd-about');
      if (aboutRadio && !aboutRadio.checked) aboutRadio.checked = true;
    }
  });

  menuToggle.addEventListener('click', () => {
    menuToggle.classList.toggle('active');
    navLinksContainer.classList.toggle('active');
    document.body.classList.toggle('modal-open');
  });

  // ScrollSpy for Top Nav Bar
  const sections = document.querySelectorAll('#destinations, #services, #process, #tours, #testimonials, #about');
  const navRadios = {
    'destinations': 'rd-1',
    'services': 'rd-2',
    'process': 'rd-process',
    'tours': 'rd-3',
    'testimonials': 'rd-4',
    'about': 'rd-about'
  };

  const observerOptions = {
    root: null,
    rootMargin: '-20% 0px -40% 0px',
    threshold: 0
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const radioId = navRadios[entry.target.id];
        const radio = document.getElementById(radioId);
        if (radio && !radio.checked) {
          radio.checked = true;
        }
      }
    });
  }, observerOptions);

  sections.forEach(section => observer.observe(section));

  // Smooth scroll logic only for anchor links on current page
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if(targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if(targetElement) {
        e.preventDefault();
        window.scrollTo({ top: targetElement.offsetTop - 80, behavior: 'smooth' });
        
        if (navLinksContainer.classList.contains('active')) {
          menuToggle.classList.remove('active');
          navLinksContainer.classList.remove('active');
          document.body.classList.remove('modal-open');
        }
      }
    });
  });
}

function initScrollReveal() {
  const revealElements = document.querySelectorAll('.scroll-reveal');
  const revealOptions = { threshold: 0.15, rootMargin: "0px 0px -50px 0px" };
  const revealOnScroll = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, revealOptions);
  revealElements.forEach(el => revealOnScroll.observe(el));
}

function initToursSlider() {
  const tourSlides = document.querySelectorAll('.tour-slide');
  tourSlides.forEach(slide => {
    slide.addEventListener('click', (e) => {
      if(e.target.closest('.icon-btn')) return; // Link handles redirect
      tourSlides.forEach(s => s.classList.remove('active'));
      slide.classList.add('active');
    });
  });
}

// --- Dynamic Content Rendering ---

function getQueryParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

function renderAllDestinations() {
  const grid = document.getElementById('allDestinationsGrid');
  if(!grid) return;
  
  const filterStr = getQueryParam('filter') || 'all';
  const locQuery = getQueryParam('location') || 'all';
  const locStr = locQuery === 'india' ? 'domestic' : locQuery;
  
  let filteredData = travelData.destinations;
  
  if (locStr !== 'all' && locStr !== 'any') {
      filteredData = filteredData.filter(d => d.location === locStr);
  }

  if (filterStr !== 'any' && filterStr !== 'all') {
      filteredData = filteredData.filter(d => 
          d.category === filterStr || (d.groups && d.groups.includes(filterStr))
      );
  }
  
  // Set header text to reflect filter
  const headerText = document.querySelector('#allDestinationsHeader');
  if(headerText) {
      let text = 'All Destinations';
      if(locStr !== 'all' && locStr !== 'any') text = (locStr === 'domestic' ? 'Domestic' : 'International') + ' Destinations';
      if(filterStr !== 'any' && filterStr !== 'all') text += ` for ${filterStr.charAt(0).toUpperCase() + filterStr.slice(1)}`;
      headerText.textContent = text;
  }

  grid.innerHTML = filteredData.map((dest, index) => `
    <a href="location?id=${dest.id}" class="dest-card scroll-reveal visible" style="animation-delay: ${index * 0.1}s">
      <div class="dest-img-wrap">
        <img src="${dest.img}" alt="${dest.name}">
      </div>
      <div class="dest-info text-left">
        <span class="dest-tag">${dest.tag}</span>
        <h3>${dest.name}</h3>
        <p>${dest.desc.substring(0, 180)}...</p>
      </div>
    </a>
  `).join('');
}

function renderHomepageDestinations(filterStr = 'all') {
  const grid = document.getElementById('homepageDestGrid');
  if(!grid) return;
  
  let filteredData = travelData.destinations;
  
  if (filterStr !== 'all' && filterStr !== 'any') {
      filteredData = travelData.destinations.filter(d => 
          d.category === filterStr || (d.groups && d.groups.includes(filterStr))
      );
  }

  // Show top 6 (Mix 3 domestic, 3 international if viewing 'all')
  let previewData = [];
  if (filterStr === 'all' || filterStr === 'any') {
      const domestic = filteredData.filter(d => d.location === 'domestic').slice(0, 3);
      const international = filteredData.filter(d => d.location === 'international').slice(0, 3);
      previewData = [...domestic, ...international];
  } else {
      previewData = filteredData.slice(0, 6);
  }

  grid.innerHTML = previewData.map((dest, index) => `
    <a href="location?id=${dest.id}" class="dest-card scroll-reveal visible" style="animation-delay: ${index * 0.1}s">
      <div class="dest-img-wrap">
        <img src="${dest.img}" alt="${dest.name}">
      </div>
      <div class="dest-info text-left">
        <span class="dest-tag">${dest.tag}</span>
        <h3>${dest.name}</h3>
        <p style="font-size: 0.9rem; color: var(--text-light); margin-top: 5px;">${dest.desc.substring(0, 180)}...</p>
      </div>
    </a>
  `).join('');
}

function initHomepageFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  if(filterBtns.length === 0) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => {
          b.classList.remove('active');
          b.style.background = 'var(--white)';
          b.style.color = 'var(--text-dark)';
      });
      btn.classList.add('active');
      btn.style.background = 'var(--primary-color)';
      btn.style.color = 'var(--white)';

      const filter = btn.getAttribute('data-filter');
      renderHomepageDestinations(filter);
    });
  });

  const searchBtn = document.getElementById('searchDestinationsBtn');
  if(searchBtn) {
      searchBtn.addEventListener('click', () => {
          const loc = document.getElementById('searchLocation').value;
          const cat = document.getElementById('searchCategory').value;
          window.location.href = `destinations?location=${loc}&filter=${cat}`;
      });
  }
}

function renderLocationDetails() {
  const locId = getQueryParam('id');
  const location = travelData.destinations.find(d => d.id === locId) || travelData.destinations[0]; // fallback to first
  
  document.title = `${location.name} - Holiday Planner`;
  document.getElementById('locImage').src = location.img;
  document.getElementById('locTag').textContent = location.tag;
  document.getElementById('locTitle').textContent = location.name;
  document.getElementById('locDesc').textContent = location.desc;
  
  // Pre-fill inquiry form
  const inquiryText = document.getElementById('inquiryText');
  if(inquiryText) inquiryText.value = `I am interested in planning a trip to ${location.name}. Please contact me with more details!`;
}

function renderServiceDetails() {
  const srvType = getQueryParam('type');
  const service = travelData.services[srvType] || travelData.services['flights'];
  document.title = `${service.title} - Holiday Planner`;
  
  if (service.heroImg) {
    document.getElementById('srvHeroContainer').style.display = 'block';
    document.getElementById('srvHero').src = service.heroImg;
  }
  
  document.getElementById('srvIcon').textContent = service.icon;
  document.getElementById('srvTitle').textContent = service.title;
  document.getElementById('srvDesc').textContent = service.desc;
  
  const perksContainer = document.getElementById('srvPerks');
  if(perksContainer) {
    perksContainer.innerHTML = service.perks.map(perk => `
      <div class="perk-item">
        <div class="perk-icon">✔️</div>
        <div class="perk-text">
          <h4>${perk.title}</h4>
          <p>${perk.desc}</p>
        </div>
      </div>
    `).join('');
  }
  
  const formContainer = document.getElementById('dynamicFormFields');
  if(formContainer && service.formFields) {
    let formHTML = '<div class="service-form-grid">';
    
    // Standard Contact Fields
    formHTML += `<input type="text" name="name" placeholder="Your Name" class="form-input custom-input" required>
                 <input type="email" name="email" placeholder="Your Email" class="form-input custom-input" required>
                 <input type="tel" name="phone" placeholder="Phone Number" class="form-input custom-input" required>`;
    
    service.formFields.forEach(field => {
      const nameAttr = field.placeholder.toLowerCase().replace(/[^a-z0-9]+/g, '_');
      if (field.type === 'select') {
        formHTML += `<select name="${nameAttr}" class="form-input custom-input" required>
          <option value="" disabled selected>${field.placeholder}</option>
          ${field.options.map(opt => `<option value="${opt}">${opt}</option>`).join('')}
        </select>`;
      } else if (field.type === 'date' || field.type === 'month') {
        // use a text input that converts to date to show placeholder properly
        formHTML += `<input type="text" name="${nameAttr}" placeholder="${field.placeholder}" class="form-input custom-input" onfocus="(this.type='${field.type}')" onblur="(this.type='text')" required>`;
      } else {
        formHTML += `<input type="${field.type}" name="${nameAttr}" placeholder="${field.placeholder}" class="form-input custom-input" required>`;
      }
    });
    
    formHTML += '</div>';
    formContainer.innerHTML = formHTML;
    
    // adjust max-width of form
    formContainer.style.maxWidth = "600px";
  }
  
  // Pre-fill inquiry form
  const inquiryText = document.getElementById('inquiryText');
  if(inquiryText) inquiryText.value = `I am interested in ${service.title}.`;
}

// --- Modals & Interactivity ---
function initModals() {
  const inquiryModal = document.getElementById('inquiryModal');
  const toast = document.getElementById('toast');
  const toastMessage = toast ? toast.querySelector('.toast-message') : null;

  function openModal(modal) {
    if(modal) { modal.classList.add('active'); document.body.classList.add('modal-open'); }
  }

  function closeModal(modal) {
    if(modal) { modal.classList.remove('active'); document.body.classList.remove('modal-open'); }
  }

  function showToast(message) {
    if(!toast) return;
    toastMessage.textContent = message;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3000);
  }

  document.querySelectorAll('.book-btn:not([type="submit"])').forEach(btn => {
    btn.addEventListener('click', (e) => { e.preventDefault(); openModal(inquiryModal); });
  });

  document.querySelectorAll('.modal-close').forEach(btn => {
    btn.addEventListener('click', () => closeModal(btn.closest('.modal-overlay')));
  });

  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', (e) => { if (e.target === overlay) closeModal(overlay); });
  });

  // Universal Web3Forms Handler
  const forms = document.querySelectorAll('form[data-web3forms]');
  forms.forEach(form => {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalBtnText = submitBtn.innerHTML;
      submitBtn.innerHTML = '<span>Sending...</span>';
      submitBtn.disabled = true;

      const formData = new FormData(form);
      
      try {
        const response = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          body: formData
        });
        
        const data = await response.json();
        
        if (data.success) {
          if (inquiryModal) closeModal(inquiryModal);
          showToast("Success! We have received your details and will contact you soon.");
          form.reset();
        } else {
          showToast("Oops! Something went wrong. Please try again.");
        }
      } catch (error) {
        showToast("Oops! Network error. Please try again.");
      } finally {
        submitBtn.innerHTML = originalBtnText;
        submitBtn.disabled = false;
      }
    });
  });
}
