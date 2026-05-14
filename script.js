// ═══════════════════════════════════════════
//   PARTICLE SYSTEM (AGS-style adapted)
// ═══════════════════════════════════════════
(function initParticles() {
  const canvas = document.getElementById('particleCanvas');
  const ctx = canvas.getContext('2d');
  let particles = [];
  let animFrame;
  let W, H;

  function resize() {
    const hero = document.getElementById('heroSection');
    W = canvas.width = hero.offsetWidth;
    H = canvas.height = hero.offsetHeight;
  }

  function getAccentColor() {
    const theme = document.documentElement.getAttribute('data-theme');
    return theme === 'light' ? '0,153,187' : '0,229,255';
  }

  function createParticle() {
    return {
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      size: Math.random() * 2.5 + 0.5,
      opacity: Math.random() * 0.6 + 0.1,
      pulse: Math.random() * Math.PI * 2
    };
  }

  function initParticleArr() {
    particles = [];
    const count = Math.min(Math.floor((W * H) / 9000), 120);
    for (let i = 0; i < count; i++) particles.push(createParticle());
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    const color = getAccentColor();
    const now = Date.now() * 0.001;

    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.pulse += 0.02;
      if (p.x < 0) p.x = W;
      if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H;
      if (p.y > H) p.y = 0;

      const opacity = p.opacity * (0.7 + 0.3 * Math.sin(p.pulse));
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${color},${opacity})`;
      ctx.fill();
    });

    // Draw connections
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 100) {
          const opacity = (1 - dist / 100) * 0.15;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(${color},${opacity})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }

    animFrame = requestAnimationFrame(draw);
  }

  window.addEventListener('resize', () => { resize(); initParticleArr(); });
  resize();
  initParticleArr();
  draw();

  // Mouse interactivity
  document.getElementById('heroSection').addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    particles.forEach(p => {
      const dx = p.x - mx;
      const dy = p.y - my;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 80) {
        p.vx += dx / dist * 0.05;
        p.vy += dy / dist * 0.05;
        p.vx = Math.max(-1.5, Math.min(1.5, p.vx));
        p.vy = Math.max(-1.5, Math.min(1.5, p.vy));
      }
    });
  });

  // Re-init when theme changes so colors update
  window._particleRecolor = () => {};
})();

// ═══════════════════════════════════════════
//   TYPED HERO TEXT
// ═══════════════════════════════════════════
(function initTyped() {
  const texts = [
    'Free Developer Tools & Website Kits',
    'Ship Your Next Project Faster',
    'SaaS Templates. E-Commerce Kits.',
    'Remix. Build. Export. Ship.',
    '100% Free. Always.'
  ];
  let ti = 0, ci = 0, del = false;
  const el = document.getElementById('typedHero');
  function type() {
    const t = texts[ti];
    if (!del) {
      el.textContent = t.slice(0, ++ci);
      if (ci === t.length) { del = true; setTimeout(type, 2200); return; }
    } else {
      el.textContent = t.slice(0, --ci);
      if (ci === 0) { del = false; ti = (ti + 1) % texts.length; }
    }
    setTimeout(type, del ? 35 : 60);
  }
  setTimeout(type, 1000);
})();

// ═══════════════════════════════════════════
//   DATA
// ═══════════════════════════════════════════
const KITS = [
  { id:1, emoji:'🛒', title:'E-Commerce Launch Kit', desc:'Everything to launch a WooCommerce store in 30 days. Includes theme, plugins list, 30-day roadmap, abandoned cart emails, and product photography guide.', category:'ecommerce', tags:['free','hot'], includes:['WooCommerce-compatible theme','30-Day launch roadmap PDF','7 email automation templates','Product page copywriting guide','Analytics setup checklist','Social media launch templates'], rating:4.9, downloads:3241, isNew:false },
  { id:2, emoji:'🎨', title:'Creative Portfolio Starter', desc:'A minimal, stunning portfolio setup for designers, photographers, and illustrators. Includes case study templates, client pitch deck, and pricing guide.', category:'portfolio', tags:['free','new'], includes:['Portfolio WordPress theme','Case study template (Figma + PDF)','Client onboarding questionnaire','Pricing guide for creatives','SEO meta guide for artists','Booking inquiry form setup'], rating:4.8, downloads:2109, isNew:true },
  { id:3, emoji:'✍️', title:'Blog Monetization Kit', desc:'From zero to your first $1 online. Niche selection guide, content calendar, affiliate setup walkthrough, and email list building system.', category:'blog', tags:['free'], includes:['Fast-loading blog theme','Niche profitability worksheet','90-day content calendar template','Affiliate marketing setup guide','Email welcome sequence (5 emails)','Monetization progression roadmap'], rating:4.7, downloads:1876, isNew:false },
  { id:4, emoji:'⚡', title:'SaaS Landing Page Kit', desc:'Launch your software product with a high-converting landing page. Includes copy frameworks, pricing page design, onboarding email sequence, and analytics events guide.', category:'saas', tags:['free','hot'], includes:['SaaS-optimized landing page theme','Hero copy framework (fill-in template)','Pricing page design patterns','7-email onboarding sequence','Product tour script template','Churn reduction email playbook'], rating:4.9, downloads:2887, isNew:false },
  { id:5, emoji:'🏢', title:'Local Business Presence Kit', desc:'Help any local business establish a professional web presence quickly. Includes GMB setup guide, review collection system, and local SEO checklist.', category:'business', tags:['free'], includes:['Local business WordPress theme','Google My Business setup guide','Review collection email templates','Local SEO 50-point checklist','WhatsApp chat integration setup','Contact & quote form templates'], rating:4.6, downloads:1542, isNew:false },
  { id:6, emoji:'🚀', title:'Agency Proposal Kit', desc:'Win more clients with polished proposals. Includes proposal template, discovery call script, project scope worksheet, and contract starter template.', category:'business', tags:['free','new'], includes:['Web design proposal template','Discovery call question script','Project scope & pricing worksheet','Contract starter (editable)','Client portal setup guide','Invoice & payment terms template'], rating:4.8, downloads:987, isNew:true },
  { id:7, emoji:'📸', title:'Photography Business Kit', desc:'Turn your photography skills into a profitable business. Includes booking system setup, pricing calculator, client gallery, and social media strategy.', category:'portfolio', tags:['free'], includes:['Photography portfolio theme','Pricing & packages template','Client booking form setup','Gallery with lightbox','Shooting checklist PDF','Instagram growth strategy'], rating:4.7, downloads:1203, isNew:false },
  { id:8, emoji:'💼', title:'Freelance Web Designer Kit', desc:'Everything a freelance web designer needs to run a professional business. Contracts, proposals, onboarding, and a client-ready portfolio theme.', category:'portfolio', tags:['free','new'], includes:['Freelance portfolio theme','Service contract template','Project proposal template','Client onboarding checklist','Rate card template','Invoice & payment guide'], rating:4.8, downloads:1654, isNew:true },
  { id:9, emoji:'📱', title:'Mobile App Landing Page Kit', desc:'Launch your mobile app with a stunning landing page. App store optimization guide, screenshots template, and beta launch email sequence.', category:'saas', tags:['free'], includes:['App landing page theme','App Store screenshot templates','Beta signup email sequence','Launch countdown page','Press kit template','Product Hunt launch checklist'], rating:4.6, downloads:876, isNew:false }
];

const PLAYBOOKS = [
  { icon:'🛒', bg:'var(--success-subtle)', title:'30-Day E-Commerce Launch Roadmap', desc:'From choosing your niche to taking your first order. Covers setup, product photography, copywriting, payment gateways, and launch marketing.', pages:47, reads:8420, category:'ecommerce' },
  { icon:'🎨', bg:'var(--purple-subtle)', title:'Portfolio Site That Gets You Hired', desc:'How to present your work to win clients. Case study structure, about page copywriting, rates and negotiation, and turning visitors into inquiries.', pages:32, reads:5210, category:'portfolio' },
  { icon:'✍️', bg:'var(--blue-subtle)', title:'Blog Monetization Step-by-Step', desc:'Build an audience and turn it into income. Niche selection, SEO basics, email list growth, affiliate marketing, and your first digital product.', pages:58, reads:6730, category:'blog' },
  { icon:'⚡', bg:'var(--accent-subtle)', title:'SaaS MVP Launch Playbook', desc:'Ship your first software product. Landing page copy, beta user acquisition, onboarding emails, pricing strategy, and retention fundamentals.', pages:41, reads:4890, category:'saas' },
  { icon:'🏢', bg:'var(--red-subtle)', title:'Local Business Digital Setup Guide', desc:'Get any local business online and findable. Google My Business, local SEO, review strategy, WhatsApp business setup, and paid ads basics.', pages:29, reads:3140, category:'business' }
];

const STORIES = [
  { avatar:'👩‍💻', user:'Amara Osei', role:'Freelance Designer, Lagos', quote:'I downloaded the Agency Proposal Kit on a Sunday and landed a ₦450K project by Wednesday. The proposal template alone was worth it.', kit:'Agency Proposal Kit', result:'₦450K project won in 4 days' },
  { avatar:'👨‍💼', user:'Tunde Adesanya', role:'E-Commerce Founder, Ibadan', quote:'This kit saved me two weeks of research. I had my store live in 3 days and made my first sale in week one.', kit:'E-Commerce Launch Kit', result:'First sale within 7 days' },
  { avatar:'👩‍🎨', user:'Sophie Chen', role:'UX Designer, London', quote:'The portfolio kit is genuinely the best starting point I\'ve found. Clean, professional, and it got me my first 3 client inquiries in a week.', kit:'Creative Portfolio Starter', result:'3 new client inquiries' },
  { avatar:'👨‍💻', user:'Marcus Webb', role:'SaaS Founder, Austin', quote:'Used the SaaS landing page kit to validate my idea. Hit 200 beta signups in the first week. Now we\'re at 800+ users.', kit:'SaaS Landing Page Kit', result:'200 beta signups in one week' },
  { avatar:'👩‍🏫', user:'Ngozi Adeyemi', role:'Content Creator, Abuja', quote:'The Blog Monetization playbook is exactly what I needed. Within 3 months I went from 0 to 8,000 monthly readers and my first affiliate income.', kit:'Blog Monetization Kit', result:'8,000 readers in 3 months' },
  { avatar:'👨‍🔧', user:'James Okafor', role:'Web Agency Owner, Port Harcourt', quote:'I send every client to Buy Me Code before we start their project. It saves hours of briefings and they come prepared.', kit:'Local Business Presence Kit', result:'40% faster client onboarding' }
];

const ACTIVE_ADS = [
  { emoji:'☁️', name:'Cloudways Hosting', desc:'Homepage banner — All visitors', clicks:234, views:8420, budget:'$49/wk', status:'live' },
  { emoji:'📧', name:'Mailchimp for WooCommerce', desc:'Kit grid card — E-Commerce builders', clicks:89, views:2310, budget:'$35/wk', status:'live' },
  { emoji:'🔒', name:'Wordfence Security', desc:'Sidebar slot — All visitors', clicks:45, views:1870, budget:'$25/wk', status:'pending' }
];

const ADS_CONFIG = [
  { emoji:'☁️', title:'Cloudways — Managed Hosting for Developers', desc:'Deploy your kit on blazing-fast cloud hosting. Auto-scaling, 1-click staging, and 24/7 expert support.', cta:'Start Free Trial →' },
  { emoji:'📧', title:'Mailchimp — Email Marketing Made Simple', desc:'Set up abandoned cart emails, welcome sequences, and broadcast campaigns in minutes. Free up to 500 contacts.', cta:'Get Started Free →' },
  { emoji:'🎨', title:'Canva Pro — Design Like a Pro', desc:'Create social media graphics, logos, and marketing materials that match your new website. 1 month free for BMC users.', cta:'Claim Free Month →' },
  { emoji:'🔒', title:'Wordfence — Security for WordPress', desc:'Protect your new site from day one. Firewall, malware scanner, and login protection. Used by 4M+ sites.', cta:'Secure My Site →' }
];

const KIT_PRESETS = [
  { name:'MyStore', tagline:'Everything your shop needs', logo:'🛒', headline:'Launch Your Store in 30 Days', subtext:'Complete kit — theme, plugins, emails, and playbook included.', cta:'Get Started Free →', navlinks:'Home, Products, About, Contact', primary:'#00e5ff', bg:'#0d0d0d', nav:'#141414' },
  { name:'MyPortfolio', tagline:'Work that speaks for itself', logo:'🎨', headline:'A Portfolio That Gets You Hired', subtext:'Clean, fast, and conversion-ready. Close clients on autopilot.', cta:'View My Work →', navlinks:'Work, About, Services, Contact', primary:'#b87fff', bg:'#0a0a0a', nav:'#111111' },
  { name:'MySaaS', tagline:'Ship your idea, not excuses', logo:'⚡', headline:'Ship Your SaaS in 30 Days', subtext:'Landing page, onboarding emails, and pricing strategy — all included.', cta:'Start Free Trial →', navlinks:'Features, Pricing, Blog, Login', primary:'#ff6b6b', bg:'#0d0d16', nav:'#12121f' },
  { name:'MyBusiness', tagline:'Your neighbourhood, online', logo:'🏢', headline:'Get Your Business Found Online', subtext:'Professional site, Google setup, and local SEO — ready to go.', cta:'Get a Free Quote →', navlinks:'Home, Services, About, Contact', primary:'#00e096', bg:'#0d0d0d', nav:'#0a1a0d' }
];

// ═══════════════════════════════════════════
//   STATE
// ═══════════════════════════════════════════
let state = {
  theme: 'dark',
  currentPage: 'home',
  activeFilter: 'all',
  currentKit: null,
  downloads: JSON.parse(localStorage.getItem('bmc_downloads') || '[]'),
  adRotation: 0
};

const REMIX_STATE = {
  kit: 0, primary:'#00e5ff', bg:'#0d0d0d', nav:'#141414',
  headingStyle:'normal', layout:'centered', btnStyle:'rounded',
  sections:{hero:true,features:true,testimonial:true,pricing:true,faq:true,footer:true}
};

// ═══════════════════════════════════════════
//   INIT
// ═══════════════════════════════════════════
document.addEventListener('DOMContentLoaded', () => {
  renderKits();
  renderHomeStories();
  renderTrending();
  renderPlaybooks();
  renderStories();
  renderAdsStats();
  renderActiveAds();
  renderProfileStats();
  renderMyDownloads();
  rotateAd();
  setInterval(rotateAd, 8000);
  setTimeout(updatePreview, 400);
  // Show subscribe modal on first visit after 8s
  if (!localStorage.getItem('bmc_subscribed') && !sessionStorage.getItem('bmc_sub_shown')) {
    setTimeout(() => { showSubscribeModal(); sessionStorage.setItem('bmc_sub_shown','1'); }, 8000);
  }
});

// ═══════════════════════════════════════════
//   THEME
// ═══════════════════════════════════════════
function toggleTheme() {
  state.theme = state.theme === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', state.theme);
  document.getElementById('themeBtn').textContent = state.theme === 'dark' ? '🌙' : '☀️';
}

// ═══════════════════════════════════════════
//   NAVIGATION
// ═══════════════════════════════════════════
function showPage(page) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  document.getElementById(`page-${page}`).classList.add('active');
  const navEl = document.getElementById(`nav-${page}`);
  if (navEl) navEl.classList.add('active');
  state.currentPage = page;
  window.scrollTo(0,0);
  if (page === 'remix') setTimeout(updatePreview, 120);
}

function filterByCategory(cat) {
  showPage('home');
  setFilter(cat, null);
  setTimeout(() => document.getElementById('kits-section').scrollIntoView({behavior:'smooth'}), 100);
}

// ═══════════════════════════════════════════
//   KITS RENDERING
// ═══════════════════════════════════════════
function getFilteredKits() {
  let kits = [...KITS];
  if (state.activeFilter !== 'all') {
    if (state.activeFilter === 'new') kits = kits.filter(k => k.isNew);
    else kits = kits.filter(k => k.category === state.activeFilter || k.tags.includes(state.activeFilter));
  }
  return kits;
}

function renderKits() {
  const grid = document.getElementById('kitsGrid');
  const kits = getFilteredKits();
  const items = [];
  let adInserted = false;
  kits.forEach((kit, i) => {
    items.push(renderKitCard(kit));
    if (i === 4 && !adInserted) { items.push(renderAdCard()); adInserted = true; }
  });
  grid.innerHTML = items.join('');
  document.getElementById('stat-kits').textContent = kits.length;
}

function renderKitCard(kit) {
  const tagHtml = kit.tags.map(t => `<span class="kit-tag ${t}">${t==='free'?'✓ Free':t==='new'?'✨ New':t==='hot'?'🔥 Hot':t}</span>`).join('');
  const dlCount = state.downloads.includes(kit.id) ? `<span style="color:var(--success);font-size:11px;font-family:var(--font-mono)">✓ Downloaded</span>` : '';
  const colors = {
    ecommerce:'background:linear-gradient(135deg,var(--success-subtle),var(--bg-tertiary))',
    portfolio:'background:linear-gradient(135deg,var(--purple-subtle),var(--bg-tertiary))',
    blog:'background:linear-gradient(135deg,var(--blue-subtle),var(--bg-tertiary))',
    saas:'background:linear-gradient(135deg,var(--accent-subtle),var(--bg-tertiary))',
    business:'background:linear-gradient(135deg,var(--red-subtle),var(--bg-tertiary))'
  };
  return `
    <div class="kit-card" onclick="openKit(${kit.id})">
      <div class="kit-thumb" style="${colors[kit.category]||'background:var(--bg-tertiary)'}">
        ${kit.emoji}
        ${kit.isNew?'<span class="kit-sponsored-badge">NEW</span>':''}
      </div>
      <div class="kit-body">
        <div class="kit-tags">${tagHtml}</div>
        <div class="kit-title">${kit.title}</div>
        <div class="kit-desc">${kit.desc.substring(0,90)}…</div>
        <div class="kit-meta">
          <div class="kit-rating">★ ${kit.rating} <span style="color:var(--text-tertiary)">(${Math.floor(kit.downloads/10)})</span></div>
          <div class="kit-downloads">${kit.downloads.toLocaleString()} dl</div>
        </div>
        <div class="kit-footer">
          <div class="kit-price">FREE ${dlCount}</div>
          <button class="kit-download-btn" onclick="event.stopPropagation();quickDownload(${kit.id})">⬇ Download</button>
        </div>
      </div>
    </div>`;
}

function renderAdCard() {
  const ad = ADS_CONFIG[state.adRotation % ADS_CONFIG.length];
  return `
    <div class="ad-card" onclick="trackAdClick('grid')">
      <span class="ad-card-badge">Sponsored</span>
      <div class="ad-card-inner">
        <div class="ad-card-logo">${ad.emoji}</div>
        <div class="ad-card-title">${ad.title}</div>
        <div class="ad-card-desc">${ad.desc}</div>
        <button class="ad-card-btn">${ad.cta}</button>
      </div>
    </div>`;
}

function setFilter(filter, el) {
  state.activeFilter = filter;
  document.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
  if (el) el.classList.add('active');
  renderKits();
}

function sortKits(val) { toast('🔄', `Sorted by ${val}`); }

function handleSearch(val) {
  if (!val.trim()) { state.activeFilter = 'all'; renderKits(); return; }
  const q = val.toLowerCase();
  const matches = KITS.filter(k =>
    k.title.toLowerCase().includes(q) ||
    k.desc.toLowerCase().includes(q) ||
    k.category.includes(q) ||
    k.tags.some(t => t.includes(q))
  );
  if (state.currentPage !== 'home') showPage('home');
  document.getElementById('kitsGrid').innerHTML = matches.length
    ? matches.map(renderKitCard).join('')
    : `<div class="empty-state" style="grid-column:1/-1"><div class="empty-icon">🔍</div>No kits found for "${val}"</div>`;
}

// ═══════════════════════════════════════════
//   KIT MODAL
// ═══════════════════════════════════════════
function openKit(id) {
  const kit = KITS.find(k => k.id === id);
  if (!kit) return;
  state.currentKit = kit;
  document.getElementById('modalTitle').textContent = kit.title;
  document.getElementById('modalThumb').textContent = kit.emoji;
  document.getElementById('modalDesc').textContent = kit.desc;
  document.getElementById('modalDownloads').textContent = kit.downloads.toLocaleString();
  document.getElementById('modalRating').textContent = `★ ${kit.rating}`;
  document.getElementById('modalCategory').textContent = kit.category;
  document.getElementById('modalTags').innerHTML = kit.tags.map(t => `<span class="kit-tag ${t}">${t}</span>`).join('');
  document.getElementById('modalIncludes').innerHTML = kit.includes.map(item =>
    `<div class="include-item"><span class="include-check">✓</span> ${item}</div>`
  ).join('');
  const alreadyDl = state.downloads.includes(kit.id);
  const btn = document.getElementById('modalDlBtn');
  btn.textContent = alreadyDl ? '✓ Re-download Kit' : '⬇ Download Free Kit';
  btn.style.background = '';
  document.getElementById('kitModal').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeKitModal() {
  document.getElementById('kitModal').classList.remove('open');
  document.body.style.overflow = '';
}

function closeModal(e) {
  if (e.target === document.getElementById('kitModal')) closeKitModal();
}

function downloadKit() {
  const kit = state.currentKit;
  if (!kit) return;
  const btn = document.getElementById('modalDlBtn');
  // Check if email on file, else prompt subscribe
  if (!localStorage.getItem('bmc_subscribed')) {
    toast('📧', 'Enter your email to download — it\'s free!');
    setTimeout(() => { closeKitModal(); showSubscribeModal(); }, 800);
    return;
  }
  btn.textContent = '⬇ Preparing download…';
  btn.classList.add('downloading');
  setTimeout(() => {
    if (!state.downloads.includes(kit.id)) {
      state.downloads.push(kit.id);
      localStorage.setItem('bmc_downloads', JSON.stringify(state.downloads));
      kit.downloads++;
    }
    btn.textContent = '✓ Downloaded!';
    btn.classList.remove('downloading');
    btn.style.background = 'var(--success)';
    toast('✅', `"${kit.title}" downloaded — check My Downloads`);
    renderMyDownloads();
    renderKits();
    setTimeout(closeKitModal, 1200);
  }, 1200);
}

function quickDownload(id) {
  if (!localStorage.getItem('bmc_subscribed')) {
    toast('📧', 'Subscribe free to unlock all downloads!');
    setTimeout(showSubscribeModal, 600);
    return;
  }
  const kit = KITS.find(k => k.id === id);
  if (!kit) return;
  if (!state.downloads.includes(id)) {
    state.downloads.push(id);
    localStorage.setItem('bmc_downloads', JSON.stringify(state.downloads));
    kit.downloads++;
  }
  toast('⬇', `Downloading "${kit.title}"…`);
  renderMyDownloads();
  renderKits();
}

// ═══════════════════════════════════════════
//   SUBSCRIBE MODAL
// ═══════════════════════════════════════════
function showSubscribeModal() {
  document.getElementById('subscribeModal').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeSubscribeModal() {
  document.getElementById('subscribeModal').classList.remove('open');
  document.body.style.overflow = '';
}

function closeSubscribeOutside(e) {
  if (e.target === document.getElementById('subscribeModal')) closeSubscribeModal();
}

function handleSubscribe() {
  const email = document.getElementById('sub-email').value.trim();
  const name = document.getElementById('sub-name').value.trim();
  if (!email || !email.includes('@')) { toast('⚠️', 'Please enter a valid email address'); return; }
  localStorage.setItem('bmc_subscribed', '1');
  localStorage.setItem('bmc_email', email);
  document.getElementById('subscribeFormWrap').style.display = 'none';
  document.getElementById('subSuccess').style.display = 'block';
  toast('🎉', `Welcome${name ? ', '+name : ''}! Check your inbox for access.`);
  setTimeout(closeSubscribeModal, 3500);
}

function handleInlineSubscribe() {
  const email = document.getElementById('inlineSubEmail').value.trim();
  if (!email || !email.includes('@')) { toast('⚠️', 'Please enter a valid email'); return; }
  localStorage.setItem('bmc_subscribed', '1');
  localStorage.setItem('bmc_email', email);
  document.getElementById('inlineSubEmail').value = '';
  toast('🎉', 'Subscribed! Check your inbox for kit access.');
}

// ═══════════════════════════════════════════
//   TRENDING
// ═══════════════════════════════════════════
function renderTrending() {
  const sorted = [...KITS].sort((a,b) => b.downloads - a.downloads);
  document.getElementById('trendingList').innerHTML = sorted.slice(0,6).map((kit, i) => `
    <div class="trending-item" onclick="openKit(${kit.id})">
      <div class="trending-rank ${i < 3 ? 'top' : ''}">#${i+1}</div>
      <div class="trending-emoji">${kit.emoji}</div>
      <div class="trending-info">
        <div class="trending-name">${kit.title}</div>
        <div class="trending-meta">${kit.downloads.toLocaleString()} downloads · ${kit.category}</div>
      </div>
      <div class="trending-badge">${i===0?'🔥 #1':i<3?'↑ Rising':'✓ Free'}</div>
    </div>`
  ).join('');
}

// ═══════════════════════════════════════════
//   PLAYBOOKS
// ═══════════════════════════════════════════
function renderPlaybooks() {
  document.getElementById('playbooksList').innerHTML = PLAYBOOKS.map(pb => `
    <div class="playbook-item">
      <div class="playbook-icon" style="background:${pb.bg}">${pb.icon}</div>
      <div class="playbook-info">
        <div class="playbook-title">${pb.title}</div>
        <div class="playbook-desc">${pb.desc}</div>
        <div class="playbook-meta">
          <span class="playbook-stat">📄 ${pb.pages} pages</span>
          <span class="playbook-stat">👁 ${pb.reads.toLocaleString()} reads</span>
          <span class="playbook-stat" style="color:var(--success)">✓ Free</span>
        </div>
      </div>
      <div class="playbook-action">
        <button class="btn-secondary" style="font-size:12px" onclick="toast('📖','Opening ${pb.title}…')">Read Online</button>
        <button class="btn-primary" style="font-size:12px" onclick="toast('⬇','Downloading PDF…')">Download PDF</button>
      </div>
    </div>`
  ).join('');
}

// ═══════════════════════════════════════════
//   STORIES
// ═══════════════════════════════════════════
function storyHtml(s) {
  const colors = ['var(--success-subtle)','var(--purple-subtle)','var(--blue-subtle)','var(--accent-subtle)','var(--red-subtle)','var(--orange-subtle)'];
  const c = colors[STORIES.indexOf(s) % colors.length];
  return `
    <div class="story-card">
      <div class="story-avatar" style="background:${c}">${s.avatar}</div>
      <div class="story-user">${s.user}</div>
      <div class="story-role">${s.role}</div>
      <div class="story-quote">"${s.quote}"</div>
      <div class="story-kit">Kit: <span>${s.kit}</span></div>
      <div class="story-result">✓ ${s.result}</div>
    </div>`;
}

function renderStories() {
  document.getElementById('storiesGrid').innerHTML = STORIES.map(storyHtml).join('');
}

function renderHomeStories() {
  document.getElementById('homeStories').innerHTML = STORIES.slice(0,3).map(storyHtml).join('');
}

// ═══════════════════════════════════════════
//   ADS MANAGER
// ═══════════════════════════════════════════
function renderAdsStats() {
  const stats = [
    { label:'Total Impressions', value:'24,870', change:'+12% this week' },
    { label:'Total Clicks', value:'1,247', change:'+8% this week' },
    { label:'Active Campaigns', value:'3', change:'2 pending review' },
    { label:'Est. Reach / Week', value:'8,400+', change:'Unique visitors' }
  ];
  document.getElementById('adsStatsRow').innerHTML = stats.map(s => `
    <div class="ads-stat-card">
      <div class="ads-stat-label">${s.label}</div>
      <div class="ads-stat-value">${s.value}</div>
      <div class="ads-stat-change">${s.change}</div>
    </div>`).join('');
}

function renderActiveAds() {
  document.getElementById('activeAdsList').innerHTML = ACTIVE_ADS.map(ad => `
    <div class="active-ad-item">
      <div class="active-ad-logo">${ad.emoji}</div>
      <div class="active-ad-info">
        <div class="active-ad-name">${ad.name}</div>
        <div class="active-ad-stats">${ad.desc} · ${ad.clicks} clicks · ${ad.views.toLocaleString()} views · ${ad.budget}</div>
      </div>
      <div class="ad-actions-row">
        <button class="btn-xs" onclick="toast('⏸','Campaign paused')">Pause</button>
        <button class="btn-xs" onclick="toast('✏️','Edit mode coming soon')">Edit</button>
      </div>
      <span class="active-ad-status status-${ad.status}">${ad.status==='live'?'● Live':ad.status==='pending'?'○ Pending':'◌ Paused'}</span>
    </div>`).join('');
}

function submitAd() {
  const name = document.getElementById('adName').value.trim();
  const headline = document.getElementById('adHeadline').value.trim();
  if (!name || !headline) { toast('⚠️', 'Please fill in Business Name and Headline'); return; }
  ACTIVE_ADS.push({
    emoji: document.getElementById('adEmoji').value || '📦', name,
    desc:`${document.getElementById('adPlacement').value} · ${document.getElementById('adTarget').value}`,
    clicks:0, views:0,
    budget: {'banner':'$49/wk','card':'$35/wk','sidebar':'$25/wk','trending':'$40/wk'}[document.getElementById('adPlacement').value] || '$35/wk',
    status:'pending'
  });
  renderActiveAds();
  toast('🎉', 'Ad submitted for review! Expect a response within 24 hours.');
  ['adName','adEmoji','adHeadline','adDesc','adCTA','adURL'].forEach(id => document.getElementById(id).value = '');
  document.getElementById('adPreviewBox').style.display = 'none';
}

function previewAd() {
  const box = document.getElementById('adPreviewBox');
  document.getElementById('preview-logo').textContent = document.getElementById('adEmoji').value || '📦';
  document.getElementById('preview-title').textContent = document.getElementById('adHeadline').value || 'Your Headline Here';
  document.getElementById('preview-desc').textContent = document.getElementById('adDesc').value || 'Your description will appear here.';
  document.getElementById('preview-cta').textContent = document.getElementById('adCTA').value || 'Learn More →';
  box.style.display = 'block';
  box.scrollIntoView({behavior:'smooth'});
}

function trackAdClick(placement) { toast('🎯', `Ad clicked from ${placement} — redirecting…`); }

function rotateAd() {
  const ad = ADS_CONFIG[state.adRotation % ADS_CONFIG.length];
  document.getElementById('adLogo').textContent = ad.emoji;
  document.getElementById('adTitle').textContent = ad.title;
  document.getElementById('adDesc').textContent = ad.desc;
  document.getElementById('adCta').textContent = ad.cta;
  state.adRotation++;
}

// ═══════════════════════════════════════════
//   PROFILE
// ═══════════════════════════════════════════
function renderMyDownloads() {
  const el = document.getElementById('myDownloads');
  if (!state.downloads.length) {
    el.innerHTML = '<div class="empty-state"><div class="empty-icon">📦</div>No downloads yet — browse kits to get started!</div>';
    return;
  }
  const dls = state.downloads.map(id => KITS.find(k => k.id === id)).filter(Boolean);
  el.innerHTML = dls.map(kit => `
    <div class="trending-item" onclick="openKit(${kit.id})">
      <div class="trending-emoji">${kit.emoji}</div>
      <div class="trending-info">
        <div class="trending-name">${kit.title}</div>
        <div class="trending-meta">${kit.category} · ★ ${kit.rating}</div>
      </div>
      <div class="trending-badge">✓ Downloaded</div>
    </div>`).join('');
}

function renderProfileStats() {
  const stats = [
    { label:'Total Downloads', value: state.downloads.length.toString(), change:'Free forever' },
    { label:'Kits Available', value: KITS.length.toString(), change:'More coming weekly' },
    { label:'Playbooks', value: PLAYBOOKS.length.toString(), change:'Deep-dive guides' },
    { label:'Community', value:'4,200+', change:'Active subscribers' }
  ];
  document.getElementById('profileStats').innerHTML = stats.map(s => `
    <div class="ads-stat-card">
      <div class="ads-stat-label">${s.label}</div>
      <div class="ads-stat-value">${s.value}</div>
      <div class="ads-stat-change">${s.change}</div>
    </div>`).join('');
}

// ═══════════════════════════════════════════
//   REMIX STUDIO — CodePen-style live editor
// ═══════════════════════════════════════════
function buildPreviewHTML() {
  const s = REMIX_STATE;
  const sitename = document.getElementById('rx-sitename')?.value || 'MySite';
  const tagline  = document.getElementById('rx-tagline')?.value  || '';
  const logo     = document.getElementById('rx-logo')?.value     || '🌐';
  const headline = document.getElementById('rx-headline')?.value || 'Welcome';
  const subtext  = document.getElementById('rx-subtext')?.value  || '';
  const cta      = document.getElementById('rx-cta')?.value      || 'Get Started';
  const navlinks = (document.getElementById('rx-navlinks')?.value || 'Home,About,Contact').split(',').map(l=>l.trim());
  const font     = document.getElementById('rx-font')?.value     || 'system-ui,sans-serif';
  const fontSize = document.getElementById('rx-fontsize')?.value || '16';
  const radius   = document.getElementById('rx-radius')?.value   || '8';

  const hMap = { normal:'400', bold:'700', light:'300', italic:'400' };
  const hStyle = s.headingStyle === 'italic' ? 'italic' : 'normal';
  const hWeight = hMap[s.headingStyle] || '400';

  const maxWidth = { centered:'800px', wide:'1200px', sidebar:'900px' }[s.layout] || '800px';
  const btnRadius = { rounded:`${radius}px`, square:'0px', pill:'999px' }[s.btnStyle] || `${radius}px`;

  const isLightBg = isLight(s.bg);
  const textOnBg   = isLightBg ? '#111111' : '#f0f0f0';
  const mutedOnBg  = isLightBg ? '#555555' : '#aaaaaa';
  const textOnNav  = isLight(s.nav) ? '#111111' : '#f0f0f0';
  const cardBg     = isLightBg ? 'rgba(0,0,0,0.04)' : 'rgba(255,255,255,0.06)';
  const cardBorder = isLightBg ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.1)';

  const { hero:secHero, features:secFeatures, testimonial:secTestimonial, pricing:secPricing, faq:secFaq, footer:secFooter } = s.sections;

  const featuresData = [
    { icon:'⚡', title:'Blazing Fast', desc:'Optimized for performance. Every millisecond counts.' },
    { icon:'🔒', title:'Secure', desc:'Enterprise-grade security built in from day one.' },
    { icon:'📱', title:'Mobile First', desc:'Looks perfect on every screen, every device.' },
    { icon:'🔧', title:'Easy Setup', desc:'Ready to ship in hours, not weeks.' }
  ];
  const featuresHTML = featuresData.map(f => `
    <div style="background:${cardBg};border:1px solid ${cardBorder};border-radius:${radius}px;padding:24px;text-align:center">
      <div style="font-size:28px;margin-bottom:12px">${f.icon}</div>
      <div style="font-weight:700;font-style:${hStyle};color:${textOnBg};margin-bottom:8px">${f.title}</div>
      <div style="font-size:14px;color:${mutedOnBg}">${f.desc}</div>
    </div>`).join('');

  const pricingData = [
    { name:'Free', price:'$0', features:['5 Projects','Basic Templates','Community Support'], highlight:false },
    { name:'Pro', price:'$29', features:['Unlimited Projects','Premium Templates','Priority Support','Custom Domain'], highlight:true },
    { name:'Agency', price:'$99', features:['Unlimited Everything','White Label','Team Access','API Access'], highlight:false }
  ];
  const pricingHTML = pricingData.map(p => `
    <div style="background:${p.highlight?s.primary+'22':cardBg};border:2px solid ${p.highlight?s.primary:cardBorder};border-radius:${radius}px;padding:28px;text-align:center;${p.highlight?'transform:scale(1.03)':''}">
      <div style="font-weight:700;font-style:${hStyle};color:${textOnBg};margin-bottom:4px">${p.name}</div>
      <div style="font-size:32px;font-weight:800;color:${p.highlight?s.primary:textOnBg};margin-bottom:16px">${p.price}<span style="font-size:14px;font-weight:400;color:${mutedOnBg}">/mo</span></div>
      ${p.features.map(f=>`<div style="font-size:13px;color:${mutedOnBg};padding:6px 0;border-bottom:1px solid ${cardBorder}">✓ ${f}</div>`).join('')}
      <button style="margin-top:20px;width:100%;background:${p.highlight?s.primary:'transparent'};color:${p.highlight?'#111':textOnBg};border:2px solid ${p.highlight?s.primary:cardBorder};border-radius:${btnRadius};padding:10px;font-weight:700;cursor:pointer">${p.highlight?'Get Started':'Choose Plan'}</button>
    </div>`).join('');

  return `<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${sitename}</title></head>
<body style="margin:0;font-family:${font};font-size:${fontSize}px;background:${s.bg};color:${textOnBg};line-height:1.6">

<!-- NAV -->
<nav style="background:${s.nav};padding:0 24px;height:56px;display:flex;align-items:center;justify-content:space-between;position:sticky;top:0;z-index:100;border-bottom:1px solid ${cardBorder}">
  <div style="font-weight:800;font-size:17px;color:${textOnNav}">${logo} ${sitename}</div>
  <div style="display:flex;gap:16px;align-items:center">
    ${navlinks.map(l=>`<a style="color:${textOnNav};opacity:0.75;font-size:14px;font-weight:500;cursor:pointer">${l}</a>`).join('')}
    <button style="background:${s.primary};color:#111;border:none;border-radius:${btnRadius};padding:8px 18px;font-weight:700;cursor:pointer">${cta}</button>
  </div>
</nav>

${secHero ? `
<!-- HERO -->
<section style="padding:80px 24px;text-align:center;max-width:${maxWidth};margin:0 auto">
  <h1 style="font-size:clamp(28px,5vw,54px);font-weight:${hWeight};font-style:${hStyle};line-height:1.1;color:${textOnBg};letter-spacing:-1px;margin-bottom:20px">${headline}</h1>
  <p style="font-size:18px;color:${mutedOnBg};margin-bottom:32px;max-width:560px;margin-left:auto;margin-right:auto">${subtext}</p>
  <button style="background:${s.primary};color:#111;border:none;border-radius:${btnRadius};padding:14px 32px;font-size:16px;font-weight:700;cursor:pointer;margin-right:12px">${cta}</button>
  <button style="background:transparent;color:${textOnBg};border:2px solid ${cardBorder};border-radius:${btnRadius};padding:14px 32px;font-size:16px;font-weight:600;cursor:pointer">Learn More</button>
  <div style="display:flex;justify-content:center;gap:40px;margin-top:48px;padding-top:32px;border-top:1px solid ${cardBorder}">
    <div style="text-align:center"><div style="font-size:24px;font-weight:800;color:${s.primary}">10k+</div><div style="font-size:12px;color:${mutedOnBg}">Users</div></div>
    <div style="text-align:center"><div style="font-size:24px;font-weight:800;color:${s.primary}">4.9★</div><div style="font-size:12px;color:${mutedOnBg}">Rating</div></div>
    <div style="text-align:center"><div style="font-size:24px;font-weight:800;color:${textOnBg}">100%</div><div style="font-size:12px;color:${mutedOnBg}">Free</div></div>
  </div>
</section>` : ''}

${secFeatures ? `
<!-- FEATURES -->
<section style="padding:60px 24px;max-width:${maxWidth};margin:0 auto">
  <h2 style="text-align:center;font-size:28px;font-weight:${hWeight};font-style:${hStyle};margin-bottom:8px;color:${textOnBg}">What's Included</h2>
  <p style="text-align:center;color:${mutedOnBg};margin-bottom:36px">Everything you need, nothing you don't.</p>
  <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:16px">${featuresHTML}</div>
</section>` : ''}

${secTestimonial ? `
<!-- TESTIMONIAL -->
<section style="padding:60px 24px;background:${s.primary}12;margin:0">
  <div style="max-width:680px;margin:0 auto;text-align:center">
    <div style="font-size:48px;color:${s.primary};margin-bottom:16px">"</div>
    <p style="font-size:18px;font-style:italic;color:${textOnBg};margin-bottom:20px;line-height:1.7">This kit saved me two weeks of research. I had my site live in 3 days and landed my first client the same week.</p>
    <div style="font-weight:700;color:${textOnBg}">Tunde A.</div>
    <div style="font-size:13px;color:${mutedOnBg}">Freelance Developer, Ibadan</div>
  </div>
</section>` : ''}

${secPricing ? `
<!-- PRICING -->
<section style="padding:60px 24px;max-width:${maxWidth};margin:0 auto">
  <h2 style="text-align:center;font-size:28px;font-weight:${hWeight};font-style:${hStyle};margin-bottom:8px;color:${textOnBg}">Simple Pricing</h2>
  <p style="text-align:center;color:${mutedOnBg};margin-bottom:36px">Start free. Upgrade when you're ready.</p>
  <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:16px;align-items:center">${pricingHTML}</div>
</section>` : ''}

${secFaq ? `
<!-- FAQ -->
<section style="padding:60px 24px;max-width:680px;margin:0 auto">
  <h2 style="text-align:center;font-size:28px;font-weight:${hWeight};font-style:${hStyle};margin-bottom:36px;color:${textOnBg}">Common Questions</h2>
  ${[
    ['Do I need coding skills?','Not at all. Every kit includes step-by-step guides written for non-developers.'],
    ['What if I already have a site?','The kits are designed to be flexible — use what you need, skip what you don\'t.'],
    ['Can I use this for client projects?','Yes, all kits include a commercial use license for client projects.'],
    ['How do I get support?','Every kit includes a playbook with detailed instructions. The community forum is also free.']
  ].map(([q,a]) => `
  <div style="border-bottom:1px solid ${cardBorder};padding:18px 0">
    <div style="font-weight:700;margin-bottom:8px;color:${textOnBg}">${q}</div>
    <div style="font-size:14px;color:${mutedOnBg}">${a}</div>
  </div>`).join('')}
</section>` : ''}

${secFooter ? `
<!-- FOOTER -->
<footer style="background:${s.nav};padding:32px 24px;text-align:center">
  <div style="font-weight:800;font-size:16px;color:${textOnNav};margin-bottom:8px">${logo} ${sitename}</div>
  <div style="font-size:13px;color:${textOnNav};opacity:0.5">${tagline}</div>
  <div style="margin-top:16px;display:flex;justify-content:center;gap:16px;flex-wrap:wrap">
    ${navlinks.map(l=>`<a style="color:${textOnNav};opacity:0.6;font-size:13px">${l}</a>`).join('')}
  </div>
  <div style="margin-top:16px;font-size:12px;color:${textOnNav};opacity:0.35">© ${new Date().getFullYear()} ${sitename}. Built with Buy Me Code.</div>
</footer>` : ''}

</body></html>`;
}

function isLight(hex) {
  if (!hex || hex.length < 7) return false;
  const r = parseInt(hex.slice(1,3),16);
  const g = parseInt(hex.slice(3,5),16);
  const b = parseInt(hex.slice(5,7),16);
  return (r*299 + g*587 + b*114) / 1000 > 128;
}

function updatePreview() {
  const frame = document.getElementById('sitePreview');
  if (!frame) return;
  const html = buildPreviewHTML();
  const blob = new Blob([html], {type:'text/html'});
  const url = URL.createObjectURL(blob);
  frame.src = url;
  document.getElementById('previewUrl').textContent =
    `https://${(document.getElementById('rx-sitename')?.value||'yoursite').toLowerCase().replace(/\s+/g,'-')}.com — Live Preview`;
}

function switchRemixKit(idx) {
  REMIX_STATE.kit = parseInt(idx);
  const preset = KIT_PRESETS[REMIX_STATE.kit];
  document.getElementById('rx-sitename').value = preset.name;
  document.getElementById('rx-tagline').value = preset.tagline;
  document.getElementById('rx-logo').value = preset.logo;
  document.getElementById('rx-headline').value = preset.headline;
  document.getElementById('rx-subtext').value = preset.subtext;
  document.getElementById('rx-cta').value = preset.cta;
  document.getElementById('rx-navlinks').value = preset.navlinks;
  setColorRaw('primary', preset.primary);
  setColorRaw('bg', preset.bg);
  setColorRaw('nav', preset.nav);
  document.getElementById('rx-primary-picker').value = preset.primary;
  document.getElementById('rx-bg-picker').value = preset.bg;
  document.getElementById('rx-nav-picker').value = preset.nav;
  updatePreview();
}

function setColor(type, val, el) {
  document.querySelectorAll(`[onclick*="setColor('${type}'"]`).forEach(e => e.classList.remove('active'));
  if (el) el.classList.add('active');
  setColorRaw(type, val);
}

function setColorRaw(type, val) {
  REMIX_STATE[type] = val;
  if (type==='primary') document.getElementById('rx-primary-picker').value = val;
  if (type==='bg') document.getElementById('rx-bg-picker').value = val;
  if (type==='nav') document.getElementById('rx-nav-picker').value = val;
  updatePreview();
}

function setHeadingStyle(style, el) {
  REMIX_STATE.headingStyle = style;
  document.querySelectorAll('[id^="ht-"]').forEach(e => e.classList.remove('active'));
  el.classList.add('active');
  updatePreview();
}

function setLayout(layout, el) {
  REMIX_STATE.layout = layout;
  document.querySelectorAll('[id^="lt-"]').forEach(e => e.classList.remove('active'));
  el.classList.add('active');
  updatePreview();
}

function setBtnStyle(style, el) {
  REMIX_STATE.btnStyle = style;
  document.querySelectorAll('[id^="bs-"]').forEach(e => e.classList.remove('active'));
  el.classList.add('active');
  updatePreview();
}

function toggleSection(sec, el) {
  REMIX_STATE.sections[sec] = !REMIX_STATE.sections[sec];
  el.classList.toggle('active', REMIX_STATE.sections[sec]);
  updatePreview();
}

function setDevice(device, el) {
  document.querySelectorAll('.device-btn').forEach(b => b.classList.remove('active'));
  el.classList.add('active');
  const frame = document.getElementById('sitePreview');
  if (device === 'mobile') { frame.style.width = '375px'; frame.style.minHeight = '667px'; }
  else if (device === 'tablet') { frame.style.width = '768px'; frame.style.minHeight = '600px'; }
  else { frame.style.width = '100%'; frame.style.minHeight = '500px'; }
}

function resetRemix() {
  switchRemixKit(0);
  document.getElementById('remixKitSelect').value = '0';
  document.getElementById('rx-font').value = 'system-ui, sans-serif';
  document.getElementById('rx-fontsize').value = 16;
  document.getElementById('rx-radius').value = 8;
  document.getElementById('rx-fontsize-val').textContent = '16px';
  document.getElementById('rx-radius-val').textContent = '8px';
  REMIX_STATE.headingStyle = 'normal';
  REMIX_STATE.layout = 'centered';
  REMIX_STATE.btnStyle = 'rounded';
  REMIX_STATE.sections = {hero:true,features:true,testimonial:true,pricing:true,faq:true,footer:true};
  document.querySelectorAll('[id^="ht-"],[id^="lt-"],[id^="bs-"],[id^="sec-"]').forEach(e => {
    const isDefault = ['ht-normal','lt-centered','bs-rounded'].includes(e.id) || e.id.startsWith('sec-');
    e.classList.toggle('active', isDefault);
  });
  toast('↺', 'Remix reset to defaults');
  updatePreview();
}

function saveRemix() {
  const data = { kit: REMIX_STATE.kit, sitename: document.getElementById('rx-sitename').value, ...REMIX_STATE };
  localStorage.setItem('bmc_remix_saved', JSON.stringify(data));
  toast('💾', 'Remix saved locally!');
}

function exportRemix() {
  const html = buildPreviewHTML();
  const blob = new Blob([html], {type:'text/html'});
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `${(document.getElementById('rx-sitename')?.value||'mysite').toLowerCase().replace(/\s+/g,'-')}-buyMeCode-kit.html`;
  a.click();
  toast('⬇', 'Exporting your remixed kit as HTML…');
}

// ═══════════════════════════════════════════
//   TOAST
// ═══════════════════════════════════════════
function toast(icon, text) {
  const container = document.getElementById('toastContainer');
  const el = document.createElement('div');
  el.className = 'toast';
  el.innerHTML = `<span class="toast-icon">${icon}</span><span class="toast-text">${text}</span>`;
  container.appendChild(el);
  setTimeout(() => { el.style.opacity = '0'; el.style.transition = 'opacity 0.3s'; setTimeout(() => el.remove(), 300); }, 3200);
}

// Init preview on page load
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(updatePreview, 300);
});
