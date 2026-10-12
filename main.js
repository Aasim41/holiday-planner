import { travelData } from './data.js';

// --- Page Initialization Logic ---
document.addEventListener('DOMContentLoaded', () => {
  initLoader();
  initNavigation();
  initModals();
  initScrollReveal();
  initToursSlider();
  initWhatsAppConcierge();
  initWorldExplorer();
  initBudgetEstimator();
  initInquiryPrefill();
  
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
  }, 250);
}

function initNavigation() {
  const header = document.querySelector('.header');
  const menuToggle = document.querySelector('.menu-toggle');
  const navLinksContainer = document.querySelector('.nav-animated');

  const sections = document.querySelectorAll('section');
  const navRadios = {
    'destinations': document.getElementById('rd-1'),
    'services': document.getElementById('rd-2'),
    'process': document.getElementById('rd-process'),
    'tours': document.getElementById('rd-3'),
    'testimonials': document.getElementById('rd-4'),
    'about': document.getElementById('rd-about')
  };

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) header.classList.add('scrolled');
    else if (!document.body.classList.contains('inner-page')) header.classList.remove('scrolled');
    
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      if (scrollY >= (sectionTop - 300)) {
        current = section.getAttribute('id');
      }
    });

    if (current && navRadios[current]) {
      if (!navRadios[current].checked) navRadios[current].checked = true;
    } else if (window.scrollY < 300) {
      if (navRadios['destinations'] && !navRadios['destinations'].checked) {
        navRadios['destinations'].checked = true;
      }
    }
  });

  menuToggle.addEventListener('click', () => {
    menuToggle.classList.toggle('active');
    navLinksContainer.classList.toggle('active');
    document.body.classList.toggle('modal-open');
  });



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
    <a href="location.html?id=${dest.id}" class="dest-card scroll-reveal visible" style="animation-delay: ${index * 0.1}s">
      <div class="dest-img-wrap">
        <img src="${dest.img}" alt="${dest.name}" loading="lazy">
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
    <a href="location.html?id=${dest.id}" class="dest-card scroll-reveal visible" style="animation-delay: ${index * 0.1}s">
      <div class="dest-img-wrap">
        <img src="${dest.img}" alt="${dest.name}" loading="lazy">
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
          window.location.href = `destinations.html?location=${loc}&filter=${cat}`;
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

// =========================================================
// FEATURE 1: DIRECT WHATSAPP VIP CONCIERGE WIDGET (9454838266)
// =========================================================
const WHATSAPP_NUMBER = '919454838266';

function initWhatsAppConcierge() {
  if (document.querySelector('.wa-concierge-float')) return;

  let defaultMsg = "Hello Holiday Planner! I would like to plan a bespoke luxury holiday. Could you assist me?";
  const locId = getQueryParam('id');
  const srvType = getQueryParam('type');
  const destParam = getQueryParam('dest');

  if (locId) {
    const loc = travelData.destinations.find(d => d.id === locId);
    if (loc) defaultMsg = `Hello Holiday Planner! I am exploring ${loc.name} on your website and would love to plan a bespoke trip.`;
  } else if (srvType && travelData.services[srvType]) {
    defaultMsg = `Hello Holiday Planner! I would like to inquire about your ${travelData.services[srvType].title} service.`;
  } else if (destParam) {
    defaultMsg = `Hello Holiday Planner! I am planning a trip to ${destParam} and would love to speak with a concierge specialist.`;
  }

  const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(defaultMsg)}`;

  const waFloat = document.createElement('a');
  waFloat.href = waUrl;
  waFloat.target = '_blank';
  waFloat.rel = 'noopener noreferrer';
  waFloat.className = 'wa-concierge-float';
  waFloat.setAttribute('aria-label', 'Chat with Holiday Planner VIP Concierge on WhatsApp');
  waFloat.innerHTML = `
    <div class="wa-icon-circle">
      <span class="wa-online-dot"></span>
      <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
        <path d="M16.004 3.2c-7.07 0-12.8 5.73-12.8 12.8 0 2.257.59 4.46 1.71 6.404L3.2 28.8l6.56-1.72a12.74 12.74 0 0 0 6.244 1.62h.005c7.068 0 12.795-5.73 12.795-12.8 0-3.42-1.332-6.636-3.75-9.054A12.71 12.71 0 0 0 16.004 3.2zm7.486 18.27c-.318.894-1.85 1.71-2.567 1.816-.656.098-1.486.14-2.398-.15-.553-.176-1.262-.41-2.172-.803-3.822-1.65-6.318-5.502-6.51-5.756-.19-.255-1.554-2.068-1.554-3.945 0-1.878.983-2.802 1.332-3.184.35-.382.763-.477 1.018-.477.254 0 .508.003.73.013.235.012.55-.089.86.656.318.764 1.08 2.642 1.176 2.833.095.19.158.414.032.668-.127.255-.19.414-.38.637-.192.223-.402.498-.573.668-.19.19-.39.397-.168.78.223.38 1.04 1.715 2.233 2.778 1.535 1.368 2.828 1.792 3.21 1.983.38.19.603.159.826-.096.222-.254.953-1.113 1.207-1.495.254-.382.508-.318.858-.19.35.127 2.225 1.05 2.606 1.24.382.192.636.287.73.446.096.16.096.923-.222 1.817z"/>
      </svg>
    </div>
    <div class="wa-concierge-text">
      <span class="wa-concierge-status">VIP Concierge • Online</span>
      <span class="wa-concierge-label">Chat on WhatsApp</span>
    </div>
  `;
  document.body.appendChild(waFloat);
}

// =========================================================
// FEATURE 4: REAL INTERACTIVE WORLD MAP WITH ALL 46 DESTINATIONS
// =========================================================
const DEST_COORDS = {
  // 25 Domestic Destinations (India)
  goa:         { lat: 15.2993, lng: 74.1240, zoom: 8, season: 'Oct – March' },
  kerala:      { lat: 9.4981,  lng: 76.3388, zoom: 8, season: 'Sep – March' },
  jaipur:      { lat: 26.9124, lng: 75.7873, zoom: 8, season: 'Oct – March' },
  ladakh:      { lat: 34.1526, lng: 77.5771, zoom: 7, season: 'May – September' },
  agra:        { lat: 27.1751, lng: 78.0421, zoom: 8, season: 'Oct – March' },
  manali:      { lat: 32.2432, lng: 77.1892, zoom: 8, season: 'Oct – June' },
  munnar:      { lat: 10.0889, lng: 77.0595, zoom: 9, season: 'Sep – May' },
  spiti:       { lat: 32.2461, lng: 78.0349, zoom: 8, season: 'May – October' },
  varanasi:    { lat: 25.3176, lng: 82.9739, zoom: 8, season: 'Oct – March' },
  andaman:     { lat: 11.7401, lng: 92.6586, zoom: 7, season: 'Oct – May' },
  udaipur:     { lat: 24.5854, lng: 73.7125, zoom: 8, season: 'Oct – March' },
  darjeeling:  { lat: 27.0410, lng: 88.2663, zoom: 8, season: 'March – Jun / Oct – Dec' },
  ooty:        { lat: 11.4102, lng: 76.6950, zoom: 9, season: 'Oct – June' },
  mysore:      { lat: 12.2958, lng: 76.6394, zoom: 8, season: 'Oct – March' },
  hampi:       { lat: 15.3350, lng: 76.4600, zoom: 8, season: 'Oct – February' },
  pondicherry: { lat: 11.9416, lng: 79.8083, zoom: 9, season: 'Oct – March' },
  gokarna:     { lat: 14.5479, lng: 74.3188, zoom: 9, season: 'Oct – March' },
  srinagar:    { lat: 34.0837, lng: 74.7973, zoom: 8, season: 'March – November' },
  leh:         { lat: 34.1642, lng: 77.5848, zoom: 8, season: 'May – September' },
  ranthambore: { lat: 26.0173, lng: 76.5026, zoom: 8, season: 'Oct – June' },
  shimla:      { lat: 31.1048, lng: 77.1734, zoom: 8, season: 'Year-Round' },
  kolkata:     { lat: 22.5726, lng: 88.3639, zoom: 8, season: 'Oct – March' },
  mumbai:      { lat: 19.0760, lng: 72.8777, zoom: 8, season: 'Nov – February' },
  delhi:       { lat: 28.6139, lng: 77.2090, zoom: 8, season: 'Oct – March' },
  hyderabad:   { lat: 17.3850, lng: 78.4867, zoom: 8, season: 'Oct – March' },

  // 21 International Destinations
  maldives:    { lat: 3.2028,   lng: 73.2207,   zoom: 6, season: 'Nov – April' },
  swiss_alps:  { lat: 46.5979,  lng: 7.9079,    zoom: 7, season: 'May – Sep / Dec – Mar' },
  dubai:       { lat: 25.1124,  lng: 55.1390,   zoom: 8, season: 'Oct – April' },
  paris:       { lat: 48.8584,  lng: 2.2945,    zoom: 8, season: 'April – October' },
  bali:        { lat: -8.4095,  lng: 115.1889,  zoom: 8, season: 'April – October' },
  banff:       { lat: 51.1784,  lng: -115.5708, zoom: 7, season: 'June – Sep / Dec – Mar' },
  turkey:      { lat: 38.6431,  lng: 34.8289,   zoom: 6, season: 'April – November' },
  kyoto:       { lat: 35.0116,  lng: 135.7681,  zoom: 8, season: 'March – May / Oct – Nov' },
  rome:        { lat: 41.8902,  lng: 12.4922,   zoom: 8, season: 'April – October' },
  hawaii:      { lat: 21.3069,  lng: -157.8583, zoom: 7, season: 'Year-Round' },
  phuket:      { lat: 7.8804,   lng: 98.3923,   zoom: 8, season: 'Nov – April' },
  cape_town:   { lat: -33.9249, lng: 18.4241,   zoom: 8, season: 'Oct – April' },
  mecca:       { lat: 21.4225,  lng: 39.8262,   zoom: 8, season: 'Year-Round (Umrah & Ziyarat)' },
  venice:      { lat: 45.4408,  lng: 12.3155,   zoom: 9, season: 'April – October' },
  prague:      { lat: 50.0755,  lng: 14.4378,   zoom: 8, season: 'April – October' },
  london:      { lat: 51.5007,  lng: -0.1246,   zoom: 8, season: 'April – October' },
  malaysia:    { lat: 3.1390,   lng: 101.6869,  zoom: 7, season: 'Year-Round' },
  singapore:   { lat: 1.2834,   lng: 103.8607,  zoom: 10, season: 'Year-Round' },
  indonesia:   { lat: -7.7956,  lng: 110.3695,  zoom: 6, season: 'April – October' },
  bangkok:     { lat: 13.7563,  lng: 100.5018,  zoom: 8, season: 'Nov – April' },
  egypt:       { lat: 29.9792,  lng: 31.1342,   zoom: 6, season: 'Oct – April' }
};

function initWorldExplorer() {
  const mapEl = document.getElementById('luxuryWorldMap');
  const pillsContainer = document.getElementById('explorerPills');
  const regionTabBtns = document.querySelectorAll('.exp-tab-btn');
  const searchInput = document.getElementById('mapHubSearch');
  const counterLabel = document.getElementById('mapCounterLabel');

  if (!mapEl && !pillsContainer) return;

  // Build full list of all 46 destinations from travelData.destinations
  const allMapDestinations = (travelData.destinations || []).map(dest => {
    const coord = DEST_COORDS[dest.id] || { lat: 20.5937, lng: 78.9629, zoom: 6, season: 'Oct – April' };
    const nights = Math.max(1, (dest.days || 5) - 1);
    const formattedPrice = '₹' + (dest.price || 45000).toLocaleString('en-IN');
    return {
      ...dest,
      lat: coord.lat,
      lng: coord.lng,
      zoom: coord.zoom || 7,
      season: coord.season || 'Oct – April',
      formattedPrice,
      durationLabel: `${dest.days || 5} Days / ${nights} ${nights === 1 ? 'Night' : 'Nights'}`,
      regionLabel: `${dest.location === 'domestic' ? 'INDIA DOMESTIC' : 'INTERNATIONAL'} • ${(dest.tag || 'LUXURY').toUpperCase()}`,
      highlights: [
        `✦ 3-Star, 4-Star & 5-Star Hotels Available in ${dest.name}`,
        `✦ Private Airport Transfers & Guided ${dest.tag || 'Sightseeing'} Tours`,
        `✦ 24/7 Holiday Planner Concierge & Custom Itinerary`
      ]
    };
  });

  let mapInstance = null;
  let tileLayer = null;
  let isSatellite = false;
  let activeId = 'maldives';
  let currentRegionFilter = 'all';
  const markersById = {};

  const ATLAS_TILES = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}';
  const SATELLITE_TILES = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';

  function createPinIcon(label, isActive) {
    return window.L.divIcon({
      className: 'lux-leaflet-icon',
      html: `
        <div class="lux-pin-wrapper ${isActive ? 'active' : ''}">
          <span class="lux-pin-ring"></span>
          <span class="lux-pin-core"></span>
          <span class="lux-pin-tag">${label}</span>
        </div>
      `,
      iconSize: [90, 42],
      iconAnchor: [45, 14],
      popupAnchor: [0, -14]
    });
  }

  function createPopupHTML(dest) {
    return `
      <div class="lux-popup-card">
        <img src="${dest.img}" alt="${dest.name}" onerror="this.onerror=null;this.src='/images/hero_slide_1.png';">
        <div class="lux-popup-info">
          <span class="lux-popup-tag">${dest.location === 'domestic' ? '🇮🇳 India' : '✈️ International'} • ${dest.tag}</span>
          <h4>${dest.name}</h4>
          <div class="lux-popup-meta">
            <span>${dest.durationLabel}</span>
            <span style="color:#ff007b;">${dest.formattedPrice}</span>
          </div>
        </div>
      </div>
    `;
  }

  function selectDestination(destId, shouldFly = true) {
    const data = allMapDestinations.find(d => d.id === destId) || allMapDestinations[0];
    if (!data) return;
    activeId = data.id;

    // Highlight active pill
    if (pillsContainer) {
      pillsContainer.querySelectorAll('.explorer-pill').forEach(p => {
        p.classList.toggle('active', p.dataset.hub === activeId);
      });
    }

    // Update marker icons & fly to destination
    if (window.L && mapInstance) {
      allMapDestinations.forEach(d => {
        const m = markersById[d.id];
        if (m) {
          m.setIcon(createPinIcon(d.name, d.id === activeId));
        }
      });
      if (shouldFly) {
        mapInstance.flyTo([data.lat, data.lng], data.zoom || 7, {
          animate: true,
          duration: 1.1
        });
        if (markersById[data.id]) {
          markersById[data.id].openPopup();
        }
      }
    }

    // Update Spotlight Card
    const spotImg = document.getElementById('spotImg');
    const spotRegion = document.getElementById('spotRegion');
    const spotTitle = document.getElementById('spotTitle');
    const spotPrice = document.getElementById('spotPrice');
    const spotDaysLabel = document.getElementById('spotDaysLabel');
    const spotDesc = document.getElementById('spotDesc');
    const spotFlight = document.getElementById('spotFlight');
    const spotSeason = document.getElementById('spotSeason');
    const spotHighlights = document.getElementById('spotHighlights');
    const spotPlanBtn = document.getElementById('spotPlanBtn');
    const spotWaBtn = document.getElementById('spotWaBtn');

    if (spotImg) {
      spotImg.src = data.img;
      spotImg.alt = data.name;
    }
    if (spotRegion) spotRegion.textContent = data.regionLabel;
    if (spotTitle) spotTitle.textContent = data.name;
    if (spotPrice) spotPrice.textContent = data.formattedPrice;
    if (spotDaysLabel) spotDaysLabel.textContent = data.durationLabel;
    if (spotDesc) spotDesc.textContent = data.desc;
    if (spotFlight) spotFlight.textContent = data.durationLabel;
    if (spotSeason) spotSeason.textContent = data.season;
    if (spotHighlights) {
      spotHighlights.innerHTML = data.highlights.map(item => `<li>${item}</li>`).join('');
    }
    if (spotPlanBtn) {
      spotPlanBtn.href = `inquiry.html?dest=${encodeURIComponent(data.name)}&nights=${Math.max(1, (data.days || 5) - 1)}`;
    }
    if (spotWaBtn) {
      const msg = `Hello Holiday Planner! I am exploring ${data.name} (${data.durationLabel}, starting ${data.formattedPrice}) on your interactive map. Please share 3-Star, 4-Star, and 5-Star package options!`;
      spotWaBtn.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
    }
  }

  function renderPillsAndMarkers() {
    const query = (searchInput ? searchInput.value : '').trim().toLowerCase();
    const filtered = allMapDestinations.filter(d => {
      const matchesRegion = currentRegionFilter === 'all' || d.location === currentRegionFilter;
      const matchesQuery = !query || d.name.toLowerCase().includes(query) || (d.tag && d.tag.toLowerCase().includes(query));
      return matchesRegion && matchesQuery;
    });

    if (counterLabel) {
      counterLabel.textContent = `Showing ${filtered.length} destination${filtered.length === 1 ? '' : 's'} — Click any pin for photo & details`;
    }

    if (pillsContainer) {
      pillsContainer.innerHTML = filtered.map(d => `
        <button type="button" class="explorer-pill ${d.id === activeId ? 'active' : ''}" data-hub="${d.id}">
          <img src="${d.img}" alt="${d.name}" loading="lazy" onerror="this.onerror=null;this.src='/images/hero_slide_1.png';">
          <span>${d.name}</span>
        </button>
      `).join('');

      pillsContainer.querySelectorAll('.explorer-pill').forEach(pill => {
        pill.addEventListener('click', () => selectDestination(pill.dataset.hub, true));
      });
    }

    if (window.L && mapInstance) {
      const visibleIds = new Set(filtered.map(d => d.id));
      allMapDestinations.forEach(d => {
        const marker = markersById[d.id];
        if (!marker) return;
        if (visibleIds.has(d.id)) {
          if (!mapInstance.hasLayer(marker)) marker.addTo(mapInstance);
        } else {
          if (mapInstance.hasLayer(marker)) mapInstance.removeLayer(marker);
        }
      });
    }
  }

  // Initialize Real Leaflet Map if available
  if (mapEl && window.L) {
    mapInstance = window.L.map(mapEl, {
      center: [22.0, 65.0],
      zoom: 3,
      minZoom: 2,
      maxZoom: 16,
      scrollWheelZoom: false
    });

    tileLayer = window.L.tileLayer(ATLAS_TILES, {
      attribution: '&copy; Esri &mdash; National Geographic, Esri, DeLorme, NAVTEQ',
      maxZoom: 18
    }).addTo(mapInstance);

    // Plot all 46 destinations on the map
    allMapDestinations.forEach(dest => {
      const marker = window.L.marker([dest.lat, dest.lng], {
        icon: createPinIcon(dest.name, dest.id === activeId)
      }).addTo(mapInstance);

      marker.bindPopup(createPopupHTML(dest), { maxWidth: 230, closeButton: false });
      marker.on('click', () => selectDestination(dest.id, true));
      markersById[dest.id] = marker;
    });

    // Zoom India button
    const indiaBtn = document.getElementById('mapIndiaBtn');
    if (indiaBtn) {
      indiaBtn.addEventListener('click', () => {
        mapInstance.flyTo([22.5, 79.0], 5, { animate: true, duration: 1.0 });
      });
    }

    // Reset World View button
    const resetBtn = document.getElementById('mapResetBtn');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        mapInstance.flyTo([22.0, 65.0], 3, { animate: true, duration: 1.0 });
      });
    }

    // Atlas / Satellite View Toggle button
    const themeBtn = document.getElementById('mapThemeBtn');
    if (themeBtn) {
      themeBtn.addEventListener('click', () => {
        isSatellite = !isSatellite;
        tileLayer.setUrl(isSatellite ? SATELLITE_TILES : ATLAS_TILES);
        themeBtn.textContent = isSatellite ? '🗺️ Atlas View' : '🛰️ Satellite View';
      });
    }

    setTimeout(() => {
      mapInstance.invalidateSize();
    }, 400);
  }

  // Region Filter Tabs (All 46 / Domestic 25 / International 21)
  regionTabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      regionTabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentRegionFilter = btn.getAttribute('data-region') || 'all';
      renderPillsAndMarkers();
      if (mapInstance) {
        if (currentRegionFilter === 'domestic') {
          mapInstance.flyTo([22.5, 79.0], 5, { animate: true, duration: 1.0 });
        } else {
          mapInstance.flyTo([22.0, 65.0], 3, { animate: true, duration: 1.0 });
        }
      }
    });
  });

  if (searchInput) {
    searchInput.addEventListener('input', () => {
      renderPillsAndMarkers();
      const q = searchInput.value.trim().toLowerCase();
      if (q.length >= 2) {
        const firstMatch = allMapDestinations.find(d => d.name.toLowerCase().includes(q));
        if (firstMatch) selectDestination(firstMatch.id, true);
      }
    });
  }

  renderPillsAndMarkers();
  selectDestination('maldives', false);
}

// =========================================================
// FEATURE 2: INTERACTIVE TRIP BUDGET ESTIMATOR WITH SEARCH
// (Supports 1-Night Min Duration & 3-Star / 4-Star / 5-Star / VIP)
// =========================================================
function initBudgetEstimator() {
  const searchInput = document.getElementById('estDestSearch');
  const clearBtn = document.getElementById('estSearchClear');
  const dropdown = document.getElementById('estDestDropdown');
  const selectedBadge = document.getElementById('estSelectedBadge');
  const quickChips = document.querySelectorAll('.est-chip');
  const nightsSlider = document.getElementById('estNights');
  const travelersSlider = document.getElementById('estTravelers');
  const tierBtns = document.querySelectorAll('.est-tier-btn');

  if (!searchInput || !nightsSlider || !travelersSlider) return;

  // Build searchable destination catalog from all 46 destinations in travelData.destinations + extra hubs
  const CURATED_CATALOG = [];
  const seenNames = new Set();

  if (travelData && Array.isArray(travelData.destinations)) {
    travelData.destinations.forEach(d => {
      const cleanKey = d.name.toLowerCase();
      if (!seenNames.has(cleanKey)) {
        seenNames.add(cleanKey);
        const nights = Math.max(1, (d.days || 5) - 1);
        const perNight = d.price ? Math.max(5500, Math.round(d.price / nights)) : (d.location === 'domestic' ? 9500 : 24000);
        CURATED_CATALOG.push({
          name: d.name,
          short: d.name,
          region: `${d.location === 'domestic' ? '🇮🇳 Domestic • India' : '✈️ International'} • ${d.tag || 'Luxury'}`,
          base: perNight,
          img: d.img
        });
      }
    });
  }

  let currentDestName = 'Maldives';
  let currentBaseRate = 32000;
  let currentTier = 'signature';
  let currentMult = 1;

  const TIER_CONFIG = {
    '3star': {
      label: '3-Star Comfort',
      includes: [
        '✓ Verified Clean & Comfortable 3-Star Hotels',
        '✓ Daily Complimentary Breakfast Included',
        '✓ Standard AC Airport & Railway Transfers',
        '✓ Major Local Sightseeing & Tour Coordination',
        '✓ 24/7 Holiday Planner Support Helpline'
      ]
    },
    '4star': {
      label: '4-Star Premium',
      includes: [
        '✓ Handpicked 4-Star Deluxe Hotels & Resorts',
        '✓ Daily Buffet Breakfast & Welcome Drinks',
        '✓ Private AC Sedan / SUV Transfers & Sightseeing',
        '✓ Guided City Tours & Priority Entry Tickets',
        '✓ Dedicated Holiday Planner Trip Coordinator'
      ]
    },
    'signature': {
      label: '5-Star Luxury',
      includes: [
        '✓ Handpicked 5-Star Luxury Accommodations',
        '✓ Daily Gourmet Breakfast & Welcome Dinner',
        '✓ Private Chauffeur Airport & Local Transfers',
        '✓ Curated Skip-the-Line Experiences',
        '✓ 24/7 Dedicated Holiday Planner Concierge'
      ]
    },
    'vip': {
      label: 'Ultra-Bespoke VIP',
      includes: [
        '👑 Private Pool Villas / Presidential Suites',
        '👑 Chauffeur-Driven Luxury SUV Throughout Trip',
        '👑 Private Yacht Charter / Scenic Helicopter Experience',
        '👑 Fine-Dining Degustation & Personal Butler Service',
        '👑 VIP Fast-Track Airport Meet & Greet'
      ]
    }
  };

  function formatINR(num) {
    return '₹' + Math.round(num).toLocaleString('en-IN');
  }

  function inferBaseRateFromText(query) {
    const q = (query || '').toLowerCase();
    const match = CURATED_CATALOG.find(item =>
      item.name.toLowerCase().includes(q) || item.short.toLowerCase().includes(q)
    );
    if (match) return { name: match.name, short: match.short, base: match.base };

    const domesticKeywords = ['india', 'goa', 'kashmir', 'jaipur', 'udaipur', 'kerala', 'shimla', 'manali', 'agra', 'varanasi', 'rishikesh', 'ooty', 'munnar', 'darjeeling', 'andaman', 'coorg', 'ladakh', 'prayagraj', 'delhi', 'mumbai', 'kolkata', 'hyderabad'];
    const isDom = domesticKeywords.some(k => q.includes(k));
    return {
      name: query.trim() || 'Custom Destination',
      short: query.trim() || 'Custom',
      base: isDom ? 10500 : 25000
    };
  }

  function renderDropdown(filterText = '') {
    if (!dropdown) return;
    const q = filterText.trim().toLowerCase();
    const matches = CURATED_CATALOG.filter(item =>
      !q || item.name.toLowerCase().includes(q) || item.region.toLowerCase().includes(q)
    ).slice(0, 15);

    if (matches.length === 0 && q) {
      dropdown.innerHTML = `
        <div class="est-dropdown-item" data-name="${filterText.trim()}" data-short="${filterText.trim()}" data-base="22000">
          <div class="est-dd-left">
            <span class="est-dd-name">✨ Plan Custom Trip to "${filterText.trim()}"</span>
            <span class="est-dd-sub">Click to calculate estimate for ${filterText.trim()}</span>
          </div>
          <span class="est-dd-tag">Custom</span>
        </div>
      `;
    } else {
      dropdown.innerHTML = matches.map(item => `
        <div class="est-dropdown-item" data-name="${item.name}" data-short="${item.short}" data-base="${item.base}">
          <div class="est-dd-left">
            <span class="est-dd-name">${item.name}</span>
            <span class="est-dd-sub">${item.region}</span>
          </div>
          <span class="est-dd-tag">From ${formatINR(Math.round(item.base * 0.55))}/night</span>
        </div>
      `).join('');
    }

    dropdown.querySelectorAll('.est-dropdown-item').forEach(el => {
      el.addEventListener('click', () => {
        currentDestName = el.getAttribute('data-name');
        currentBaseRate = parseFloat(el.getAttribute('data-base')) || 22000;
        const shortLabel = el.getAttribute('data-short') || currentDestName;
        searchInput.value = currentDestName;
        if (selectedBadge) selectedBadge.textContent = `📍 ${shortLabel}`;
        dropdown.classList.remove('open');

        quickChips.forEach(c => {
          c.classList.toggle('active', c.getAttribute('data-dest').toLowerCase() === currentDestName.toLowerCase());
        });
        updateEstimate();
      });
    });
  }

  function updateEstimate() {
    const nights = parseInt(nightsSlider.value, 10) || 1;
    const travelers = parseInt(travelersSlider.value, 10) || 2;

    const nightsDisplay = document.getElementById('estNightsDisplay');
    if (nightsDisplay) {
      const nightWord = nights === 1 ? 'Night' : 'Nights';
      nightsDisplay.textContent = `${nights} ${nightWord} / ${nights + 1} Days`;
    }

    const travelersDisplay = document.getElementById('estTravelersDisplay');
    if (travelersDisplay) {
      let suffix = 'Guests';
      if (travelers === 1) suffix = 'Guest (Solo)';
      else if (travelers === 2) suffix = 'Guests (Couple)';
      else if (travelers <= 4) suffix = 'Guests (Family)';
      else suffix = 'Guests (Group)';
      travelersDisplay.textContent = `${travelers} ${suffix}`;
    }

    const groupFactor = travelers === 1 ? 1.2 : (travelers > 2 ? 0.9 : 1.0);
    const rawPerPerson = currentBaseRate * nights * currentMult * groupFactor;
    const rawTotal = rawPerPerson * travelers;

    const lowEst = Math.max(4000, Math.round((rawTotal * 0.9) / 1000) * 1000);
    const highEst = Math.max(6000, Math.round((rawTotal * 1.1) / 1000) * 1000);
    const perPersonEst = Math.max(2500, Math.round(rawPerPerson / 500) * 500);

    const totalRangeEl = document.getElementById('estTotalRange');
    const perPersonEl = document.getElementById('estPerPerson');
    const includesListEl = document.getElementById('estIncludesList');

    const rangeText = `${formatINR(lowEst)} – ${formatINR(highEst)}`;
    if (totalRangeEl) totalRangeEl.textContent = rangeText;
    if (perPersonEl) {
      const nightWord = nights === 1 ? 'night' : 'nights';
      perPersonEl.textContent = `Approx. ${formatINR(perPersonEst)} per person for ${nights} ${nightWord}`;
    }

    const activeTierCfg = TIER_CONFIG[currentTier] || TIER_CONFIG['signature'];
    if (includesListEl) {
      includesListEl.innerHTML = activeTierCfg.includes.map(i => `<li>${i}</li>`).join('');
    }

    let budgetCode = '2L-5L';
    if (highEst <= 200000) budgetCode = '2L or less';
    else if (highEst <= 500000) budgetCode = '2L-5L';
    else if (highEst <= 1000000) budgetCode = '5L-10L';
    else if (highEst <= 2000000) budgetCode = '10L-20L';
    else if (highEst <= 3000000) budgetCode = '20L-30L';
    else budgetCode = '30L+';

    const tierLabel = activeTierCfg.label;

    const lockBtn = document.getElementById('estLockBtn');
    if (lockBtn) {
      const params = new URLSearchParams({
        dest: currentDestName,
        nights: String(nights),
        travelers: String(travelers),
        tier: tierLabel,
        est: rangeText,
        budget: budgetCode
      });
      lockBtn.href = `inquiry.html?${params.toString()}`;
    }

    const waBtn = document.getElementById('estWaBtn');
    if (waBtn) {
      const nightWord = nights === 1 ? 'Night' : 'Nights';
      const waMsg = `Hello Holiday Planner! I used your Trip Budget Estimator:\n` +
        `• Destination: ${currentDestName}\n` +
        `• Duration: ${nights} ${nightWord} / ${nights + 1} Days\n` +
        `• Travelers: ${travelers} Guests\n` +
        `• Hotel Category: ${tierLabel}\n` +
        `• Estimated Budget: ${rangeText}\n\n` +
        `Please help me customize and book this itinerary!`;
      waBtn.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(waMsg)}`;
    }
  }

  // Search Input Events
  searchInput.addEventListener('focus', () => {
    renderDropdown(searchInput.value === 'Maldives' ? '' : searchInput.value);
    if (dropdown) dropdown.classList.add('open');
  });

  searchInput.addEventListener('input', () => {
    const val = searchInput.value;
    renderDropdown(val);
    if (dropdown) dropdown.classList.add('open');

    if (val.trim().length >= 2) {
      const inferred = inferBaseRateFromText(val);
      currentDestName = val.trim();
      currentBaseRate = inferred.base;
      if (selectedBadge) selectedBadge.textContent = `📍 ${inferred.short}`;
      updateEstimate();
    }
  });

  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      searchInput.value = '';
      searchInput.focus();
      renderDropdown('');
      if (dropdown) dropdown.classList.add('open');
    });
  }

  document.addEventListener('click', (e) => {
    const wrapper = document.getElementById('estSearchWrapper');
    if (wrapper && !wrapper.contains(e.target) && dropdown) {
      dropdown.classList.remove('open');
    }
  });

  quickChips.forEach(chip => {
    chip.addEventListener('click', () => {
      quickChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      currentDestName = chip.getAttribute('data-dest');
      currentBaseRate = parseFloat(chip.getAttribute('data-base')) || 22000;
      searchInput.value = currentDestName;
      if (selectedBadge) selectedBadge.textContent = `📍 ${chip.textContent}`;
      if (dropdown) dropdown.classList.remove('open');
      updateEstimate();
    });
  });

  nightsSlider.addEventListener('input', updateEstimate);
  travelersSlider.addEventListener('input', updateEstimate);

  tierBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tierBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentTier = btn.dataset.tier || 'signature';
      currentMult = parseFloat(btn.dataset.mult) || 1;
      updateEstimate();
    });
  });

  updateEstimate();
}

// =========================================================
// AUTO-PREFILL INQUIRY FORM FROM MAP OR BUDGET ESTIMATOR
// =========================================================
function initInquiryPrefill() {
  const destInput = document.getElementById('destination');
  if (!destInput) return; // Only runs on inquiry.html

  const dest = getQueryParam('dest');
  const nights = getQueryParam('nights');
  const travelers = getQueryParam('travelers');
  const tier = getQueryParam('tier');
  const est = getQueryParam('est');
  const budget = getQueryParam('budget');

  if (dest) destInput.value = dest;

  const nightsInput = document.getElementById('nights');
  if (nights && nightsInput) nightsInput.value = nights;

  const travelersInput = document.getElementById('travelers');
  if (travelers && travelersInput) travelersInput.value = travelers;

  const addInfoInput = document.getElementById('addInfo');
  if (addInfoInput && (tier || est)) {
    addInfoInput.value = `Selected Hotel Tier: ${tier || '5-Star Luxury'} | Estimated Budget Range: ${est || 'Custom'}`;
  }

  if (budget) {
    const budgetRadio = document.querySelector(`input[name="budget"][value="${budget}"]`);
    if (budgetRadio) budgetRadio.checked = true;
  }
}



