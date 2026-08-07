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

/* Projects Catalog with Multi-Category Support */
const projectsData = [
  // SQL & Data Analytics Projects
  {
    id: 'fashion-store-oracle',
    title: 'Fashion Store Database using Oracle',
    date: 'May 2024 – Jun 2024',
    association: 'University of South Asia',
    origin: 'university',
    focus: ['sql_analytics'],
    icon: 'fa-database',
    badge: 'University Project',
    tech: ['SQL', 'Database Design', 'Oracle Database', 'Inventory Management'],
    hasRepoLink: false,
    description: `Created a fashion store database using Oracle. It handles essential tasks like managing inventory, customer data, and order tracking. Provided hands-on experience with SQL and relational database design.`
  },
  {
    id: 'baab-ul-salah',
    title: 'e.Baab-Ul-Salah — Your Complete Islamic Companion',
    date: 'Oct 2025 – Jun 2026',
    association: 'University of South Asia',
    origin: 'university',
    focus: ['sql_analytics', 'ml_ai'],
    icon: 'fa-kaaba',
    badge: 'CS FYP • University Project',
    tech: ['Python', 'SQL Server', 'FastAPI', 'ASP.NET Core (.NET 8)', 'Random Forest', 'Vercel'],
    hasRepoLink: true,
    repoLink: 'https://github.com/HussainRiaz-sudo/Baab-Ul-Salah',
    description: `e-Baab-ul-Salah is a comprehensive mobile Islamic lifestyle application built as a final year project, designed to serve as a complete spiritual companion. Features prayer times, GPS Masjid finder, Prayer Tracker, Tasbeeh counter, Qibla Direction, Quran translations, and AI-powered Islamic Q&A chatbot.

ML & Backend: Congregation timing prediction model is a Random Forest Regressor trained on 51,000+ rows of seasonal offset data (< 3s MAE). Microservices architecture on FastAPI and ASP.NET Core gateway with SQL Server database design.

My Role — Backend & Machine Learning Engineer: Astronomical baseline calculations, Random Forest model training, FastAPI microservice development, and AI chatbot design.`
  },

  // Machine Learning & AI Category Projects
  {
    id: 'movie-recommender',
    title: 'Movie Recommender System (Data Science)',
    date: 'Nov 2025 – Nov 2025',
    association: 'University of South Asia',
    origin: 'university',
    focus: ['ml_ai'],
    icon: 'fa-film',
    badge: 'University Project',
    tech: ['Data Science', 'Machine Learning', 'Python', 'Pandas'],
    hasRepoLink: false,
    description: `Built a movie recommendation system for data science course. Processing and analyzing movie datasets, applying collaborative and content-based filtering techniques, and evaluating recommendation quality.`
  },
  {
    id: 'titanic-ml-prediction',
    title: 'Titanic Survival Prediction (ML)',
    date: 'May 2024 – Jun 2024',
    association: 'University of South Asia',
    origin: 'university',
    focus: ['ml_ai'],
    icon: 'fa-ship',
    badge: 'University Project',
    tech: ['Machine Learning', 'Model Training', 'Python', 'Pandas', 'Classification'],
    hasRepoLink: false,
    description: `Worked on improving survival predictions on the classic Titanic dataset. Focused on feature engineering, handling missing data, and comparing classification models.`
  },
  {
    id: 'skin-cancer-detection',
    title: 'Skin Cancer Detection Research Paper (AI)',
    date: 'Apr 2025 – May 2025',
    association: 'University of South Asia',
    origin: 'university',
    focus: ['ml_ai'],
    icon: 'fa-notes-medical',
    badge: 'University Project • Research Paper',
    tech: ['Python', 'Deep Learning', 'Pandas', 'Medical AI'],
    hasRepoLink: false,
    description: `Authored a research paper focused on improving accuracy of skin cancer detection using deep learning, exploring model architectures and class imbalance in medical imaging.`
  },

  // Systems & Security Category
  {
    id: 'scientific-calculator-8086',
    title: 'Scientific Calculator | 8086 Assembly Language',
    date: 'May 2026 – May 2026',
    association: 'University of South Asia',
    origin: 'university',
    focus: ['systems'],
    icon: 'fa-microchip',
    badge: 'University Project',
    tech: ['Assembly Language', 'x86 Assembly', '8086 Registers', 'DOS Interrupts'],
    hasRepoLink: false,
    description: `Functional scientific calculator in 8086 Assembly Language running on EMU8086. Implemented 9 math operations using processor registers and DOS interrupts (INT 21h).`
  },
  {
    id: 'local-password-manager',
    title: 'Local Password Manager (AES-256)',
    date: 'May 2025 – Jun 2025',
    association: 'University of South Asia',
    origin: 'university',
    focus: ['systems'],
    icon: 'fa-key',
    badge: 'University Project • Competition Winner 🏆',
    tech: ['Cybersecurity', 'AES-256', 'Product Pitching', 'Usability'],
    hasRepoLink: false,
    description: `Locally stored credential manager with AES-256 encryption. Won 1st place in Cyber Security Idea Competition for product pitching and usability.`
  },
  {
    id: 'library-system-cpp',
    title: 'Library Management System in C++',
    date: 'May 2024 – Jun 2024',
    association: 'University of South Asia',
    origin: 'university',
    focus: ['systems'],
    icon: 'fa-book-bookmark',
    badge: 'University Project',
    tech: ['Coding Experience', 'Data Structures', 'C++', 'Linked Lists'],
    hasRepoLink: false,
    description: `Library management system using linked lists in C++ for adding, deleting, and searching books.`
  },
  {
    id: 'elicense-system-cpp',
    title: 'E-License System Project in C++',
    date: 'Oct 2023 – Nov 2023',
    association: 'University of South Asia',
    origin: 'university',
    focus: ['systems'],
    icon: 'fa-id-card',
    badge: 'University Project',
    tech: ['Coding Experience', 'Object-Oriented Programming (OOP)', 'C++', 'Inheritance'],
    hasRepoLink: false,
    description: `E-License system in C++ utilizing Object-Oriented Programming concepts with age eligibility verification (18+).`
  },
  {
    id: 'banking-system-cpp',
    title: 'Banking System Project in C++',
    date: 'Jun 2023 – Jul 2023',
    association: 'University of South Asia',
    origin: 'university',
    focus: ['systems'],
    icon: 'fa-piggy-bank',
    badge: 'University Project',
    tech: ['Coding Experience', 'Programming', 'C++', 'Control Structures'],
    hasRepoLink: false,
    description: `Banking system in C++ simulating core account creation, deposit, withdrawal, and balance inquiry transactions.`
  },

  // Web & Mobile Apps Category
  {
    id: 'patient-tracker-js',
    title: 'Patient-Tracker Workflow Application',
    date: 'Jul 2026 – Aug 2026',
    association: 'Personal Project',
    origin: 'personal',
    focus: ['web'],
    icon: 'fa-hospital-user',
    badge: 'Personal Project',
    tech: ['JavaScript', 'HTML/CSS', 'Workflow Management', '70/30 Revenue Split'],
    hasRepoLink: true,
    repoLink: 'https://github.com/HussainRiaz-sudo/Patient-Tracker',
    description: `Custom web application built for healthcare workflow management and 70-30% revenue sharing tracking between medical facilities and attending physicians.`
  },
  {
    id: 'todo-django-rest',
    title: 'To-Do List App (Django REST API)',
    date: 'May 2025 – Jun 2025',
    association: 'University of South Asia',
    origin: 'university',
    focus: ['web'],
    icon: 'fa-list-check',
    badge: 'University Project',
    tech: ['Python', 'Django', 'Django REST Framework', 'REST API'],
    hasRepoLink: false,
    description: `Full-stack task management application built with Django REST Framework exposing CRUD RESTful endpoints.`
  },
  {
    id: 'flutter-news-app',
    title: 'News App (Flutter)',
    date: 'Mar 2025 – Apr 2025',
    association: 'University of South Asia',
    origin: 'university',
    focus: ['web'],
    icon: 'fa-newspaper',
    badge: 'University Project',
    tech: ['Flutter', 'Mobile Application Development', 'REST API', 'Dart'],
    hasRepoLink: false,
    description: `Cross-platform mobile news application built with Flutter featuring live news API integration and category browsing.`
  },
  {
    id: 'monster-wiki-html',
    title: 'Wiki Page Development for the Anime Monster',
    date: 'Apr 2023 – May 2023',
    association: 'Personal Project',
    origin: 'personal',
    focus: ['web'],
    icon: 'fa-globe',
    badge: 'Personal Project',
    tech: ['Coding Experience', 'Front-end Coding', 'HTML', 'CSS'],
    hasRepoLink: false,
    description: `Developed a wiki page for the anime Monster using HTML and CSS, focusing on creating a well-structured, responsive, and visually appealing design.`
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
          ` : `<span style="font-size: 0.78rem; color: var(--text-dim);">Academic Code</span>`}
        </div>
      `;

      const btn = card.querySelector('.view-detail-btn');
      btn.addEventListener('click', () => {
        openModal({
          title: proj.title,
          date: proj.date,
          association: proj.association,
          tech: proj.tech,
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

  body.innerHTML = `
    <h2>${data.title}</h2>
    <p style="color: var(--accent-gold); font-family: var(--font-code); font-size: 0.85rem; margin-top: 0.25rem; margin-bottom: 0.5rem;">
      📅 ${data.date} • ${data.association}
    </p>
    <div style="display: flex; gap: 0.4rem; flex-wrap: wrap; margin-bottom: 1.5rem;">
      ${data.tech.map(t => `<span class="badge-tag">#${t}</span>`).join('')}
    </div>
    <div style="color: var(--text-main); font-size: 0.95rem; line-height: 1.8; white-space: pre-line;">
      ${data.description}
    </div>
  `;
  modal.classList.add('active');
}

function openCertImageModal(imagePath, title) {
  const modal = document.getElementById('article-modal');
  const body = document.getElementById('modal-article-body');
  if (!modal || !body) return;

  body.innerHTML = `
    <h2>${title}</h2>
    <p style="color: var(--text-muted); font-size: 0.85rem; margin-bottom: 1.25rem;">Click anywhere outside to close the viewer.</p>
    <div style="width: 100%; border-radius: var(--radius-md); overflow: hidden; border: 1px solid var(--border-color); background: var(--bg-dark);">
      <img src="${imagePath}" alt="${title}" style="width: 100%; height: auto; display: block;" onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1200&auto=format&fit=crop';">
    </div>
  `;
  modal.classList.add('active');
}

function initModalLogic() {
  const modal = document.getElementById('article-modal');
  const closeBtn = document.getElementById('modal-close');
  if (!modal || !closeBtn) return;

  closeBtn.addEventListener('click', () => modal.classList.remove('active'));
  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.classList.remove('active');
  });
}
