/* ==========================================================================
   Muhammad Hussain Riaz — Portfolio JavaScript Engine
   Multi-Category Project Filtering & Modal Logic
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initBrandNameTyping();
  initRoleTyping();
  initThemeToggle();
  initProjectsHub();
  initModalLogic();
  initProfileAvatarModal();
  initCertificationsFilter();
  initScrollSpy();
});

/* Theme Toggle (Dark Mode / Light Mode with LocalStorage persistence) */
function initThemeToggle() {
  const toggleBtn = document.getElementById('nav-theme-toggle-btn');
  if (!toggleBtn) return;

  const icon = toggleBtn.querySelector('i');
  const text = toggleBtn.querySelector('span');

  function updateUI(isLight) {
    if (icon) icon.className = isLight ? 'fa-solid fa-moon' : 'fa-solid fa-sun';
    if (text) text.textContent = isLight ? 'Dark Mode' : 'Light Mode';
  }

  const savedTheme = localStorage.getItem('hussain-portfolio-theme');
  if (savedTheme === 'light') {
    document.body.classList.add('light-mode');
    updateUI(true);
  }

  toggleBtn.addEventListener('click', () => {
    document.body.classList.toggle('light-mode');
    const isLight = document.body.classList.contains('light-mode');
    localStorage.setItem('hussain-portfolio-theme', isLight ? 'light' : 'dark');
    updateUI(isLight);
  });
}

/* Top-Left Brand Name Typewriter Animation (English & Urdu) */
function initBrandNameTyping() {
  const nameVariants = [
    { text: "Muhammad Hussain Riaz", lang: "en" },
    { text: "محمد حسین ریاض", lang: "ur" }
  ];
  
  const targetEl = document.getElementById('brand-name-typing');
  if (!targetEl) return;
  
  let nameIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  const typingSpeed = 100;
  const deletingSpeed = 50;
  const delayBetween = 2500;
  
  function type() {
    const currentObj = nameVariants[nameIndex];
    const currentText = currentObj.text;
    
    if (currentObj.lang === 'ur') {
      targetEl.classList.add('urdu-font');
    } else {
      targetEl.classList.remove('urdu-font');
    }
    
    if (isDeleting) {
      targetEl.textContent = currentText.substring(0, charIndex - 1);
      charIndex--;
    } else {
      targetEl.textContent = currentText.substring(0, charIndex + 1);
      charIndex++;
    }
    
    let delta = isDeleting ? deletingSpeed : typingSpeed;
    
    if (!isDeleting && charIndex === currentText.length) {
      delta = delayBetween;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      nameIndex = (nameIndex + 1) % nameVariants.length;
      delta = 400;
    }
    
    setTimeout(type, delta);
  }
  
  type();
}

/* Hero Section Typing Title Effect (SQL, Excel, Data Analysis, Business Intelligence) */
function initRoleTyping() {
  const roles = [
    "SQL",
    "Excel",
    "Data Analysis",
    "Business Intelligence"
  ];
  
  const targetEl = document.getElementById('typing-role');
  if (!targetEl) return;
  
  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  const typingSpeed = 110;
  const deletingSpeed = 60;
  const delayBetween = 2200;
  
  function type() {
    const currentRole = roles[roleIndex];
    
    if (isDeleting) {
      targetEl.textContent = currentRole.substring(0, charIndex - 1);
      charIndex--;
    } else {
      targetEl.textContent = currentRole.substring(0, charIndex + 1);
      charIndex++;
    }
    
    let delta = isDeleting ? deletingSpeed : typingSpeed;
    
    if (!isDeleting && charIndex === currentRole.length) {
      delta = delayBetween;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      delta = 400;
    }
    
    setTimeout(type, delta);
  }
  
  type();
}

/* Projects Catalog with Verified Slide Presentation Data */
const projectsData = [
  {
    id: 'databel-churn-excel',
    title: 'Databel Customer Churn EDA & Data Preparation',
    date: 'Aug 2026 – Aug 2026',
    association: 'Personal Project',
    origin: 'personal',
    focus: ['excel'],
    icon: 'fa-file-excel',
    badge: 'Excel Data Analytics',
    image: 'assets/excel_churn/churn_dashboard_1.jpg',
    images: [
      'assets/excel_churn/churn_dashboard_1.jpg',
      'assets/excel_churn/churn_dashboard_2.jpg',
      'assets/excel_churn/churn_dashboard_3.jpg',
      'assets/excel_churn/churn_dashboard_4.jpg',
      'assets/excel_churn/churn_dashboard_5.jpg'
    ],
    tech: ['Excel', 'EDA', 'Data Cleaning', 'Pivot Tables', 'Feature Engineering', 'Customer Churn', 'Data Preparation'],
    hasRepoLink: true,
    repoLink: 'https://github.com/HussainRiaz-sudo/Analyzing-Customer-Churn',
    description: `Executed exploratory data analysis (EDA), data cleaning, and feature engineering on Databel's 6,687-customer telecom dataset in Microsoft Excel to uncover key drivers of customer attrition.

Key Analytical Highlights & Insights:
• Baseline Metrics: Identified a 26.86% baseline churn rate across 6,687 accounts (1,796 churned customers).
• Risk Segmentation: Discovered Month-to-Month contract holders suffer from a 46.29% churn rate compared to just 2.78% for 2-Year contract holders.
• Primary Churn Drivers: Isolated Competitor Offers & Device Promotions as the #1 churn catalyst (accounting for ~45% of total churned accounts).
• Feature Engineering & Pivoting: Created demographic flags (Senior / Under 30), numeric churn indicators, consumption groupings, and pivot tables to aggregate support call frequencies and extra charges.`
  },
  {
    id: 'patient-tracker-js',
    title: 'Patient-Tracker Workflow Application',
    date: 'Jul 2026 – Aug 2026',
    association: 'Personal Project',
    origin: 'personal',
    focus: ['web'],
    icon: 'fa-hospital-user',
    badge: 'Personal Project',
    tech: ['JavaScript', 'HTML5/CSS3', 'PIN Security', 'Chart.js', 'Google Sheets API', 'PDF Reports', 'Financial Analytics'],
    hasRepoLink: true,
    repoLink: 'https://github.com/HussainRiaz-sudo/Patient-Tracker',
    description: `Dr Naila Patient Tracker is a high-performance, offline-first web application designed for medical practitioners to manage patient intake, ward admissions, surgical procedures, and revenue-sharing across multiple clinical locations. Built using vanilla JavaScript, HTML5, and CSS3, it features an instant multi-hospital switcher supporting custom split algorithms in Pakistani Rupees (PKR) alongside specialized 100% Doctor Payout modules for procedures and ward admission fees. The platform includes a session-based 4-digit PIN Security Lock protecting accumulated financial ledgers and reports, a 1-tap Dark/Light Mode theme engine, retroactive cross-hospital Patient History profiles with fuzzy base name matching, an interactive decision modal workflow, clean autocomplete patient deduplication, Chart.js financial analytics, and an automated background sync engine connecting to Google Sheets. It empowers doctors to generate official, multi-page Itemized Monthly PDF Settlement Reports containing patient serial numbers, consultation date/time stamps, and signature verification blocks for hospital proof of earnings.`
  },
  {
    id: 'baab-ul-salah',
    title: 'e.Baab-Ul-Salah — Your Complete Islamic Companion',
    date: 'Oct 2025 – Jun 2026',
    association: 'University of South Asia',
    origin: 'university',
    focus: ['sql', 'python', 'ml_ai'],
    icon: 'fa-kaaba',
    badge: 'CS FYP • University Project',
    tech: ['Python', 'SQL Server', 'FastAPI', 'ASP.NET Core (.NET 8)', 'Random Forest', 'Vercel'],
    hasRepoLink: true,
    repoLink: 'https://github.com/HussainRiaz-sudo/Baab-Ul-Salah',
    description: `e-Baab-ul-Salah is a comprehensive mobile Islamic lifestyle application built as a final year project, designed to serve as a complete spiritual companion. Features prayer times, GPS Masjid finder, Prayer Tracker, Tasbeeh counter, Qibla Direction, Quran translations, and AI-powered Islamic Q&A chatbot.

ML & Backend: Congregation timing prediction model is a Random Forest Regressor trained on 51,000+ rows of seasonal offset data (< 3s MAE). Microservices architecture on FastAPI and ASP.NET Core gateway with SQL Server database design.

My Role — Backend & Machine Learning Engineer: Astronomical baseline calculations, Random Forest model training, FastAPI microservice development, and AI chatbot design.`
  },
  {
    id: 'movie-recommender',
    title: 'Movie Recommender System (Data Science)',
    date: 'Nov 2025 – Nov 2025',
    association: 'University of South Asia',
    origin: 'university',
    focus: ['python', 'ml_ai'],
    icon: 'fa-film',
    badge: 'University Project',
    tech: ['Data Science', 'KNN', 'Cosine Similarity', 'SciPy Sparse Matrix', 'FuzzyWuzzy'],
    hasRepoLink: false,
    description: `Built an item-based movie recommendation system on the Kaggle MovieLens dataset. Preprocessed ratings into a user-movie pivot table and transformed data into a SciPy sparse matrix to optimize memory usage. Implemented K-Nearest Neighbors (KNN) with Cosine Similarity to compute movie distances, featuring FuzzyWuzzy string matching for title query resolution.`
  },
  {
    id: 'local-password-manager',
    title: 'Local Password Manager (AES-256)',
    date: 'May 2025 – Jun 2025',
    association: 'University of South Asia',
    origin: 'university',
    focus: ['techwar'],
    icon: 'fa-trophy',
    badge: 'TechWar 1st Place Winner 🏆',
    tech: ['Cybersecurity', 'AES-256', 'Zero-Knowledge Architecture', 'Product Pitching', 'Usability'],
    hasRepoLink: false,
    description: `Locally stored credential manager built with AES-256 encryption. Won 1st place in the Cyber Security Competition at TechWar for security architecture, live product pitching, and usability.

Zero-Knowledge Security Architecture & Live Stage Defense:
Engineered with strict Zero-Knowledge principles — no master backdoor keys or plaintext passwords are stored. During the live TechWar Q&A panel, when challenged on data unrecoverability if a user loses their vault password, successfully defended the architecture by establishing that zero-recovery is an intentional security design choice (eliminating backdoor vectors, analogous to Apple ID & Bitwarden end-to-end security standards), securing top marks for technical justification and executive presence.`
  },
  {
    id: 'todo-django-rest',
    title: 'To-Do List App (Django REST API)',
    date: 'May 2025 – Jun 2025',
    association: 'University of South Asia',
    origin: 'university',
    focus: ['python', 'web'],
    icon: 'fa-list-check',
    badge: 'University Project',
    tech: ['Python', 'Django', 'Django REST Framework', 'REST API'],
    hasRepoLink: false,
    description: `Full-stack task management application built with Django REST Framework exposing CRUD RESTful endpoints.`
  },
  {
    id: 'skin-cancer-detection',
    title: 'Skin Cancer Detection AI Research Paper',
    date: 'Apr 2025 – May 2025',
    association: 'University of South Asia',
    origin: 'university',
    focus: ['python', 'ml_ai'],
    icon: 'fa-notes-medical',
    badge: 'University Research Capstone',
    tech: ['Python', 'Deep Learning', 'CNN Architectures', 'Medical AI', 'Pandas'],
    hasRepoLink: false,
    description: `Authored a University Capstone Research Paper evaluating Deep Learning techniques for dermatological image classification. Explored Convolutional Neural Network (CNN) architectures and class-imbalance mitigation strategies for medical diagnostic imaging.`
  },
  {
    id: 'fashion-store-oracle',
    title: 'Fashion Store Database using Oracle',
    date: 'May 2024 – Jun 2024',
    association: 'University of South Asia',
    origin: 'university',
    focus: ['sql'],
    icon: 'fa-database',
    badge: 'University Project',
    tech: ['SQL', 'Database Design', 'Oracle Database', 'Inventory Control'],
    hasRepoLink: false,
    description: `Designed a normalized relational database schema in Oracle Database for managing inventory, customer records, and order tracking. Built multi-table JOINs, constraints, and aggregation queries for operational record reconciliation.`
  },
  {
    id: 'titanic-ml-prediction',
    title: 'Titanic Survival Prediction (ML)',
    date: 'May 2024 – Jun 2024',
    association: 'University of South Asia',
    origin: 'university',
    focus: ['python', 'ml_ai'],
    icon: 'fa-ship',
    badge: 'University Project',
    tech: ['Machine Learning', 'Random Forest', 'Scikit-Learn', 'Feature Imputation', 'Pandas'],
    hasRepoLink: false,
    description: `Analyzed the Kaggle Titanic dataset (891 training records, 12 features). Preprocessed missing values via median (Age, Fare) and mode (Embarked) imputation, dropped non-predictive text features (Name, Ticket, Cabin), and one-hot encoded categorical variables. Trained a Random Forest Classifier (100 estimators, random_state=42) on an 80/20 train/validation split, achieving 0.81 (81%) validation accuracy.`
  }
];

function initProjectsHub() {
  const container = document.getElementById('projects-grid');
  const focusBtns = document.querySelectorAll('.project-focus-chips .tag-btn');
  const originBtns = document.querySelectorAll('.project-origin-chips .tag-btn');
  if (!container) return;

  let activeFocus = 'all';
  let activeOrigin = 'all';

  function render() {
    container.innerHTML = '';

    const filtered = projectsData.filter(p => {
      const matchFocus = activeFocus === 'all' || (Array.isArray(p.focus) && p.focus.includes(activeFocus));
      const matchOrigin = activeOrigin === 'all' || p.origin === activeOrigin;
      return matchFocus && matchOrigin;
    });

    if (filtered.length === 0) {
      container.innerHTML = `<p style="color: var(--text-muted); grid-column: 1/-1; text-align: center; padding: 2rem;">No projects found in this category combination.</p>`;
      return;
    }

    filtered.forEach(proj => {
      const card = document.createElement('div');
      card.className = 'project-card';

      const imgBoxHtml = proj.image ? `
        <div class="cert-img-box project-cover-box" style="margin-bottom: 1rem; border-radius: var(--radius-sm); height: 160px; overflow: hidden; position: relative; cursor: pointer;">
          <img src="${proj.image}" alt="${proj.title}" loading="lazy" decoding="async" style="width: 100%; height: 100%; object-fit: cover;">
          <div class="cert-img-overlay">
            <i class="fa-solid fa-expand" style="margin-right: 0.4rem;"></i> Expand Dashboard Visuals
          </div>
        </div>
      ` : '';

      card.innerHTML = `
        <div>
          <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.85rem;">
            <i class="fa-solid ${proj.icon}" style="font-size: 1.35rem; color: var(--accent-teal);"></i>
            <span class="badge-tag">${proj.badge}</span>
          </div>
          <div style="font-size: 0.78rem; color: var(--accent-gold); font-family: var(--font-code); font-weight: 500; margin-bottom: 0.4rem;">
            <i class="fa-regular fa-calendar"></i> ${proj.date}
          </div>
          <h3 style="font-size: 1.15rem; font-weight: 700; margin-bottom: 0.85rem;">${proj.title}</h3>
          ${imgBoxHtml}
          <div style="display: flex; gap: 0.35rem; flex-wrap: wrap; margin-bottom: 1.25rem;">
            ${proj.tech.map(t => `<span class="badge-tag">#${t}</span>`).join('')}
          </div>
        </div>
        <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--border-color); padding-top: 0.75rem;">
          <button class="view-detail-btn" style="background: transparent; border: none; color: var(--accent-teal); font-weight: 600; font-size: 0.85rem; cursor: pointer;">
            <i class="fa-solid fa-circle-info"></i> Full Description
          </button>
          ${proj.hasRepoLink ? `
            <a href="${proj.repoLink}" target="_blank" style="font-weight: 600; font-size: 0.85rem;">
              GitHub <i class="fa-solid fa-arrow-up-right-from-square" style="font-size: 0.7rem;"></i>
            </a>
          ` : `<span style="font-size: 0.78rem; color: var(--text-dim); font-style: italic;"><i class="fa-solid fa-lock" style="font-size: 0.7rem;"></i> Code on Request</span>`}
        </div>
      `;

      const coverBox = card.querySelector('.project-cover-box');
      if (coverBox) {
        coverBox.addEventListener('click', (e) => {
          e.stopPropagation();
          const imgInput = (proj.images && proj.images.length) ? proj.images : proj.image;
          openCertImageModal(imgInput, `${proj.title} — Dashboard Overview`, 0);
        });
      }

      const btn = card.querySelector('.view-detail-btn');
      btn.addEventListener('click', () => {
        openModal({
          title: proj.title,
          date: proj.date,
          association: proj.association,
          tech: proj.tech,
          images: proj.images,
          description: proj.description
        });
      });

      container.appendChild(card);
    });
  }

  focusBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      focusBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeFocus = btn.getAttribute('data-focus');
      render();
    });
  });

  originBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      originBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeOrigin = btn.getAttribute('data-origin');
      render();
    });
  });

  render();
}

function openModal(data) {
  const modal = document.getElementById('article-modal');
  const body = document.getElementById('modal-article-body');
  if (!modal || !body) return;

  const galleryHtml = data.images && data.images.length ? `
    <div style="margin-bottom: 1.5rem;">
      <h4 style="font-size: 0.92rem; font-weight: 700; color: var(--accent-teal); margin-bottom: 0.75rem;">
        <i class="fa-solid fa-chart-column"></i> Interactive Dashboard Sheets (${data.images.length} Views — Click sheet or use arrows)
      </h4>
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); gap: 0.65rem;">
        ${data.images.map((img, idx) => `
          <div class="cert-img-box gallery-thumb-box" data-img-src="${img}" data-idx="${idx + 1}" style="border-radius: var(--radius-sm); height: 90px; overflow: hidden; border: 1px solid var(--border-color); cursor: pointer;">
            <img src="${img}" alt="Dashboard Sheet ${idx + 1}" loading="lazy" decoding="async" style="width: 100%; height: 100%; object-fit: cover;">
            <div class="cert-img-overlay" style="font-size: 0.75rem;">
              <i class="fa-solid fa-expand"></i> Sheet ${idx + 1}
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  ` : '';

  body.innerHTML = `
    <h2>${data.title}</h2>
    <p style="color: var(--accent-gold); font-family: var(--font-code); font-size: 0.85rem; margin-top: 0.25rem; margin-bottom: 0.5rem;">
      📅 ${data.date} • ${data.association}
    </p>
    <div style="display: flex; gap: 0.4rem; flex-wrap: wrap; margin-bottom: 1.25rem;">
      ${data.tech.map(t => `<span class="badge-tag">#${t}</span>`).join('')}
    </div>
    ${galleryHtml}
    <div style="color: var(--text-main); font-size: 0.95rem; line-height: 1.8; white-space: pre-line;">
      ${data.description}
    </div>
  `;

  body.querySelectorAll('.gallery-thumb-box').forEach(box => {
    box.addEventListener('click', () => {
      const idx = parseInt(box.getAttribute('data-idx')) - 1;
      openCertImageModal(data.images, `${data.title} — Dashboard Sheets`, idx);
    });
  });

  modal.classList.add('active');
}

let currentGalleryList = [];
let currentGalleryIndex = 0;
let currentGalleryTitle = '';

function openCertImageModal(imageInput, title, initialIndex = 0) {
  const modal = document.getElementById('article-modal');
  const body = document.getElementById('modal-article-body');
  if (!modal || !body) return;

  if (Array.isArray(imageInput)) {
    currentGalleryList = imageInput;
  } else {
    currentGalleryList = [imageInput];
  }

  currentGalleryIndex = (initialIndex >= 0 && initialIndex < currentGalleryList.length) ? initialIndex : 0;
  currentGalleryTitle = title || 'Image Viewer';

  renderGalleryModal();
  modal.classList.add('active');
}

function renderGalleryModal() {
  const body = document.getElementById('modal-article-body');
  if (!body) return;

  const total = currentGalleryList.length;
  const currentImg = currentGalleryList[currentGalleryIndex];
  const hasMultiple = total > 1;

  const navControlsHtml = hasMultiple ? `
    <button type="button" class="lightbox-nav-btn prev" id="lightbox-prev-btn" title="Previous Image (Left Arrow)">
      <i class="fa-solid fa-chevron-left"></i>
    </button>
    <button type="button" class="lightbox-nav-btn next" id="lightbox-next-btn" title="Next Image (Right Arrow)">
      <i class="fa-solid fa-chevron-right"></i>
    </button>
    <div class="lightbox-counter-badge" id="lightbox-counter">
      Sheet ${currentGalleryIndex + 1} of ${total}
    </div>
  ` : '';

  body.innerHTML = `
    <h2>${currentGalleryTitle}</h2>
    <p style="color: var(--text-muted); font-size: 0.85rem; margin-bottom: 1.25rem;">
      ${hasMultiple ? 'Use the left/right arrow buttons or keyboard arrow keys to switch images.' : 'Click anywhere outside to close the viewer.'}
    </p>
    <div class="lightbox-img-wrapper">
      ${navControlsHtml}
      <img id="lightbox-active-img" src="${currentImg}" alt="${currentGalleryTitle}" style="width: 100%; height: auto; max-height: 72vh; object-fit: contain; display: block;" onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1200&auto=format&fit=crop';">
    </div>
  `;

  if (hasMultiple) {
    const prevBtn = body.querySelector('#lightbox-prev-btn');
    const nextBtn = body.querySelector('#lightbox-next-btn');
    const imgWrapper = body.querySelector('.lightbox-img-wrapper');

    if (prevBtn) {
      prevBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        stepGallery(-1);
      });
    }
    if (nextBtn) {
      nextBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        stepGallery(1);
      });
    }
    if (imgWrapper) {
      imgWrapper.addEventListener('mousemove', () => {
        triggerBadgeFadeOut();
      });
    }
    triggerBadgeFadeOut();
  }
}

let badgeTimeoutId = null;

function triggerBadgeFadeOut() {
  const counterEl = document.getElementById('lightbox-counter');
  if (!counterEl) return;

  counterEl.classList.remove('fade-out');

  if (badgeTimeoutId) {
    clearTimeout(badgeTimeoutId);
  }

  badgeTimeoutId = setTimeout(() => {
    const el = document.getElementById('lightbox-counter');
    if (el) el.classList.add('fade-out');
  }, 1500);
}

function stepGallery(dir) {
  if (!currentGalleryList.length) return;
  currentGalleryIndex = (currentGalleryIndex + dir + currentGalleryList.length) % currentGalleryList.length;
  
  const imgEl = document.getElementById('lightbox-active-img');
  const counterEl = document.getElementById('lightbox-counter');
  
  if (imgEl) {
    imgEl.src = currentGalleryList[currentGalleryIndex];
  }
  if (counterEl) {
    counterEl.textContent = `Sheet ${currentGalleryIndex + 1} of ${currentGalleryList.length}`;
  }
  triggerBadgeFadeOut();
}

function initModalLogic() {
  const modal = document.getElementById('article-modal');
  const closeBtn = document.getElementById('modal-close');
  if (!modal || !closeBtn) return;

  closeBtn.addEventListener('click', () => modal.classList.remove('active'));
  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.classList.remove('active');
  });

  window.addEventListener('keydown', (e) => {
    if (!modal.classList.contains('active')) return;
    if (e.key === 'ArrowRight') {
      stepGallery(1);
    } else if (e.key === 'ArrowLeft') {
      stepGallery(-1);
    } else if (e.key === 'Escape') {
      modal.classList.remove('active');
    }
  });
}

function initProfileAvatarModal() {
  const avatar = document.querySelector('.profile-avatar-frame');
  if (!avatar) return;
  avatar.addEventListener('click', () => {
    openCertImageModal('assets/hussain_profile.jpg', 'Muhammad Hussain Riaz — Portrait');
  });
}

function initCertificationsFilter() {
  const filterBtns = document.querySelectorAll('.cert-category-chips .tag-btn');
  const certCards = document.querySelectorAll('.cert-card');
  if (!filterBtns.length || !certCards.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const selectedCategory = btn.getAttribute('data-cert-cat');

      certCards.forEach(card => {
        const cardCat = card.getAttribute('data-cert-category');
        if (selectedCategory === 'all' || cardCat === selectedCategory) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* ScrollSpy Topbar Active Link Glow Indicator */
function initScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');

  if (!sections.length || !navLinks.length) return;

  function setActiveNav(id) {
    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href === `#${id}`) {
        link.classList.add('active-glow');
      } else {
        link.classList.remove('active-glow');
      }
    });
  }

  function updateActiveOnScroll() {
    const scrollPos = window.scrollY + 180;

    let activeId = '';
    sections.forEach(sec => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        activeId = sec.getAttribute('id');
      }
    });

    if (activeId) {
      setActiveNav(activeId);
    } else if (window.scrollY < 300) {
      navLinks.forEach(l => l.classList.remove('active-glow'));
    }
  }

  window.addEventListener('scroll', updateActiveOnScroll, { passive: true });
  updateActiveOnScroll();

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      const href = link.getAttribute('href');
      if (href && href.startsWith('#')) {
        const targetId = href.substring(1);
        setActiveNav(targetId);
      }
    });
  });
}
