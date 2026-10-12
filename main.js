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
// FEATURE 4: INTERACTIVE WORLD MAP EXPLORER
// =========================================================
const EXPLORER_HUBS = {
  maldives: {
    title: 'The Maldives',
    region: 'INDIAN OCEAN • PRIVATE ISLANDS',
    price: '₹1,85,000',
    img: 'images/hero_slide_1.png',
    desc: 'Wake up in a private overwater pool villa surrounded by turquoise lagoons, private seaplane transfers, and underwater fine dining.',
    flight: '~4h 15m Direct',
    season: 'Nov – April',
    highlights: [
      '✦ Private Overwater Pool Villa with Butler',
      '✦ Sunset Dolphin Cruise & Sandbank Dinner',
      '✦ Complimentary Seaplane Lounge Access'
    ]
  },
  dubai: {
    title: 'Dubai & Palm Jumeirah',
    region: 'MIDDLE EAST • ULTRA LUXURY',
    price: '₹1,45,000',
    img: 'images/hero_palm.png',
    desc: 'Experience the pinnacle of Arabian glamour with suites on Palm Jumeirah, private Marina yacht charters, and royal desert stargazing.',
    flight: '~3h 45m Direct',
    season: 'Oct – April',
    highlights: [
      '✦ 5-Star Atlantis / Palm Jumeirah Suite Stay',
      '✦ Private Sunset Yacht Charter at Dubai Marina',
      '✦ VIP Royal Desert Safari & Private Dining'
    ]
  },
  switzerland: {
    title: 'Swiss Alps & Lucerne',
    region: 'EUROPE • ALPINE GRANDEUR',
    price: '₹3,20,000',
    img: 'images/hero_mountain.png',
    desc: 'Glide across snow-kissed peaks aboard the Glacier Express Excellence Class and unwind in 5-star alpine chalets overlooking the Matterhorn.',
    flight: '~8h 30m Direct',
    season: 'May – Sep / Dec – Mar',
    highlights: [
      '✦ First-Class Swiss Travel Pass & Scenic Trains',
      '✦ Private Helicopter Glacier Tour in Zermatt',
      '✦ 5-Star Lakefront Suite in Lucerne & Interlaken'
    ]
  },
  london: {
    title: 'London & Royal UK',
    region: 'EUROPE • HERITAGE LUXURY',
    price: '₹2,95,000',
    img: 'images/hero_bigben.png',
    desc: 'Stay in iconic Mayfair luxury hotels, enjoy private after-hours access to royal landmarks, and savour Michelin-starred afternoon teas.',
    flight: '~9h 10m Direct',
    season: 'April – October',
    highlights: [
      '✦ 5-Star Mayfair & Westminster Boutique Stays',
      '✦ Chauffeur-Driven Cotswolds & Windsor Excursion',
      '✦ Private Thames Evening Champagne Cruise'
    ]
  },
  paris: {
    title: 'Paris & French Riviera',
    region: 'EUROPE • ROMANCE & HAUTE COUTURE',
    price: '₹2,80,000',
    img: 'images/hero_slide_3.png',
    desc: 'Indulge in Eiffel Tower terrace suites, private Louvre art curation, and day trips to historic estates in the Champagne valley.',
    flight: '~8h 50m Direct',
    season: 'April – October',
    highlights: [
      '✦ Suite with Private Eiffel Tower Balcony View',
      '✦ Skip-the-Line Private Louvre & Versailles Tour',
      '✦ Michelin-Starred Seine River Dinner Cruise'
    ]
  },
  singapore: {
    title: 'Singapore Marina Bay',
    region: 'SOUTHEAST ASIA • URBAN OASIS',
    price: '₹1,55,000',
    img: 'images/hero_singapore.png',
    desc: 'From the iconic Marina Bay infinity pool to private Sentosa island villas and world-renowned botanical conservatories.',
    flight: '~5h 30m Direct',
    season: 'Year-Round',
    highlights: [
      '✦ Iconic Marina Bay Sands / Raffles Luxury Stay',
      '✦ Private Buggy Tour at Night Safari & Gardens',
      '✦ Sentosa Cove VIP Yacht & Beach Club Access'
    ]
  },
  goa: {
    title: 'South Goa Private Villas',
    region: 'INDIA • COASTAL SERENITY',
    price: '₹85,000',
    img: 'images/hero_goa.png',
    desc: 'Escape to secluded beachfront estates in South Goa with private infinity pools, personal chefs, and sunset catamarans.',
    flight: '~2h 15m Domestic',
    season: 'Oct – March',
    highlights: [
      '✦ 5-Star Beachfront Resort or Private Pool Villa',
      '✦ Private Mandovi Sunset Yacht with Live Grill',
      '✦ Chauffeur-Driven Portuguese Heritage Trail'
    ]
  },
  bali: {
    title: 'Bali Ubud & Uluwatu',
    region: 'INDONESIA • TROPICAL SANCTUARY',
    price: '₹1,35,000',
    img: 'images/hero_slide_2.png',
    desc: 'Immerse yourself in Ubud rainforest infinity villas and dramatic Uluwatu cliffside resorts with bespoke Balinese spa rituals.',
    flight: '~6h 45m',
    season: 'April – October',
    highlights: [
      '✦ Private Heated Infinity Pool Villa in Ubud',
      '✦ Nusa Penida Speedboat & Helicopter Coastal Tour',
      '✦ Cliffside Sunset Kecak & Seafood Degustation'
    ]
  }
};

function initWorldExplorer() {
  const pins = document.querySelectorAll('.map-pin');
  const pills = document.querySelectorAll('.explorer-pill');
  if (!pins.length && !pills.length) return;

  function selectHub(hubKey) {
    const data = EXPLORER_HUBS[hubKey];
    if (!data) return;

    pins.forEach(p => p.classList.toggle('active', p.dataset.hub === hubKey));
    pills.forEach(p => p.classList.toggle('active', p.dataset.hub === hubKey));

    const spotImg = document.getElementById('spotImg');
    const spotRegion = document.getElementById('spotRegion');
    const spotTitle = document.getElementById('spotTitle');
    const spotPrice = document.getElementById('spotPrice');
    const spotDesc = document.getElementById('spotDesc');
    const spotFlight = document.getElementById('spotFlight');
    const spotSeason = document.getElementById('spotSeason');
    const spotHighlights = document.getElementById('spotHighlights');
    const spotPlanBtn = document.getElementById('spotPlanBtn');
    const spotWaBtn = document.getElementById('spotWaBtn');

    if (spotImg) spotImg.src = data.img;
    if (spotImg) spotImg.alt = data.title;
    if (spotRegion) spotRegion.textContent = data.region;
    if (spotTitle) spotTitle.textContent = data.title;
    if (spotPrice) spotPrice.textContent = data.price;
    if (spotDesc) spotDesc.textContent = data.desc;
    if (spotFlight) spotFlight.textContent = data.flight;
    if (spotSeason) spotSeason.textContent = data.season;
    if (spotHighlights) {
      spotHighlights.innerHTML = data.highlights.map(item => `<li>${item}</li>`).join('');
    }
    if (spotPlanBtn) {
      spotPlanBtn.href = `inquiry.html?dest=${encodeURIComponent(data.title)}`;
    }
    if (spotWaBtn) {
      const msg = `Hello Holiday Planner! I am interested in your ${data.title} package (starting ${data.price}/couple). Please share a custom itinerary!`;
      spotWaBtn.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
    }
  }

  pins.forEach(pin => {
    pin.addEventListener('click', () => selectHub(pin.dataset.hub));
  });
  pills.forEach(pill => {
    pill.addEventListener('click', () => selectHub(pill.dataset.hub));
  });

  // Initialize default hub
  selectHub('maldives');
}

// =========================================================
// FEATURE 2: INTERACTIVE TRIP BUDGET ESTIMATOR
// =========================================================
function initBudgetEstimator() {
  const destSelect = document.getElementById('estDestination');
  const nightsSlider = document.getElementById('estNights');
  const travelersSlider = document.getElementById('estTravelers');
  const tierBtns = document.querySelectorAll('.est-tier-btn');

  if (!destSelect || !nightsSlider || !travelersSlider) return;

  let currentTier = 'signature';
  let currentMult = 1;

  const TIER_INCLUDES = {
    signature: [
      '✓ Handpicked 5-Star Luxury Accommodations',
      '✓ Daily Gourmet Breakfast & Welcome Dinner',
      '✓ Private Chauffeur Airport & Local Transfers',
      '✓ Curated Skip-the-Line Experiences',
      '✓ 24/7 Dedicated Holiday Planner Concierge'
    ],
    vip: [
      '👑 Private Pool Villas / Presidential Suites',
      '👑 Chauffeur-Driven Luxury SUV Throughout Trip',
      '👑 Private Yacht Charter / Scenic Helicopter Experience',
      '👑 Fine-Dining Degustation & Personal Butler Service',
      '👑 VIP Fast-Track Airport Meet & Greet'
    ]
  };

  function formatINR(num) {
    return '₹' + Math.round(num).toLocaleString('en-IN');
  }

  function updateEstimate() {
    const selectedOption = destSelect.options[destSelect.selectedIndex];
    const basePerNightPerPerson = parseFloat(selectedOption.getAttribute('data-base')) || 25000;
    const destName = selectedOption.getAttribute('data-name') || selectedOption.textContent;
    const nights = parseInt(nightsSlider.value, 10) || 5;
    const travelers = parseInt(travelersSlider.value, 10) || 2;

    // Update pill labels
    const nightsDisplay = document.getElementById('estNightsDisplay');
    if (nightsDisplay) nightsDisplay.textContent = `${nights} Nights / ${nights + 1} Days`;

    const travelersDisplay = document.getElementById('estTravelersDisplay');
    if (travelersDisplay) {
      let suffix = 'Guests';
      if (travelers === 1) suffix = 'Guest (Solo)';
      else if (travelers === 2) suffix = 'Guests (Couple)';
      else if (travelers <= 4) suffix = 'Guests (Family)';
      else suffix = 'Guests (Group)';
      travelersDisplay.textContent = `${travelers} ${suffix}`;
    }

    // Group efficiency discount for >2 guests sharing villas/transfers
    const groupFactor = travelers === 1 ? 1.25 : (travelers > 2 ? 0.92 : 1.0);
    const rawPerPerson = basePerNightPerPerson * nights * currentMult * groupFactor;
    const rawTotal = rawPerPerson * travelers;

    const lowEst = Math.round((rawTotal * 0.9) / 5000) * 5000;
    const highEst = Math.round((rawTotal * 1.1) / 5000) * 5000;
    const perPersonEst = Math.round((rawPerPerson) / 1000) * 1000;

    const totalRangeEl = document.getElementById('estTotalRange');
    const perPersonEl = document.getElementById('estPerPerson');
    const includesListEl = document.getElementById('estIncludesList');

    const rangeText = `${formatINR(lowEst)} – ${formatINR(highEst)}`;
    if (totalRangeEl) totalRangeEl.textContent = rangeText;
    if (perPersonEl) {
      perPersonEl.textContent = `Approx. ${formatINR(perPersonEst)} per person for ${nights} nights`;
    }

    if (includesListEl && TIER_INCLUDES[currentTier]) {
      includesListEl.innerHTML = TIER_INCLUDES[currentTier].map(i => `<li>${i}</li>`).join('');
    }

    // Determine budget radio bucket for inquiry.html
    let budgetCode = '2L-5L';
    if (highEst <= 200000) budgetCode = '2L or less';
    else if (highEst <= 500000) budgetCode = '2L-5L';
    else if (highEst <= 1000000) budgetCode = '5L-10L';
    else if (highEst <= 2000000) budgetCode = '10L-20L';
    else if (highEst <= 3000000) budgetCode = '20L-30L';
    else budgetCode = '30L+';

    const tierLabel = currentTier === 'vip' ? 'Ultra-Bespoke VIP' : '5-Star Signature';

    const lockBtn = document.getElementById('estLockBtn');
    if (lockBtn) {
      const params = new URLSearchParams({
        dest: destName,
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
      const waMsg = `Hello Holiday Planner! I used your Trip Budget Estimator:\n` +
        `• Destination: ${destName}\n` +
        `• Duration: ${nights} Nights / ${nights + 1} Days\n` +
        `• Travelers: ${travelers} Guests\n` +
        `• Style: ${tierLabel}\n` +
        `• Estimated Budget: ${rangeText}\n\n` +
        `Please help me customize and book this itinerary!`;
      waBtn.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(waMsg)}`;
    }
  }

  destSelect.addEventListener('change', updateEstimate);
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
    addInfoInput.value = `Selected Tier: ${tier || '5-Star Signature'} | Estimated Budget Range: ${est || 'Custom'}`;
  }

  if (budget) {
    const budgetRadio = document.querySelector(`input[name="budget"][value="${budget}"]`);
    if (budgetRadio) budgetRadio.checked = true;
  }
}

