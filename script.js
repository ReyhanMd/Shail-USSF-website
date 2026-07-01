const forms = [document.getElementById('hero-waitlist'), document.getElementById('bottom-waitlist')];
const message = document.getElementById('form-message');
forms.forEach((form) => {
  if (!form) return;
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const email = form.querySelector('input[type="email"]').value;
    localStorage.setItem('shail_waitlist_email', email);
    if (message) message.textContent = 'Saved locally for demo. Connect this form to Supabase, Loops, or Resend before launch.';
    form.reset();
  });
});

document.querySelector('.menu-button')?.addEventListener('click', () => {
  const nav = document.querySelector('.nav');
  if (!nav) return;
  nav.style.display = nav.style.display === 'flex' ? 'none' : 'flex';
  nav.style.position = 'absolute';
  nav.style.top = '64px';
  nav.style.left = '0';
  nav.style.right = '0';
  nav.style.padding = '20px 28px';
  nav.style.flexDirection = 'column';
  nav.style.alignItems = 'flex-start';
  nav.style.background = 'rgba(5,6,8,.96)';
  nav.style.borderBottom = '1px solid rgba(255,255,255,.12)';
});

// Re-trigger page reveal transition when clicking the brand logo on the home page
const brandLogo = document.querySelector('.brand');
const mainEl = document.querySelector('main');
const isHomePage = !!document.querySelector('.hero');
if (brandLogo && mainEl) {
  brandLogo.addEventListener('click', (e) => {
    if (isHomePage) {
      // Prevent default scroll/jump behavior to top so we can animate smoothly
      e.preventDefault();
      
      // Smooth scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' });
      
      // Re-trigger CSS animation
      mainEl.style.animation = 'none';
      void mainEl.offsetHeight; // Force reflow
      mainEl.style.animation = 'pageReveal 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards';
    }
  });
}

// Scroll animation for enlarging image
const observerOptions = {
  root: null,
  rootMargin: '0px',
  threshold: 0.15
};

const imageObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

const scrollImage = document.querySelector('.scroll-zoom-image');
if (scrollImage) {
  imageObserver.observe(scrollImage);
}

// Initialize Orchestrate Particles
const initParticles = () => {
  const container = document.getElementById('particle-container');
  if (!container) return;

  const particleCount = 500;
  const colors = ['#EB473D', '#111111', '#CCCCCC', '#888888']; // SHAIL light mode colors
  
  const random = (min, max) => Math.random() * (max - min) + min;
  const randomColor = () => colors[Math.floor(Math.random() * colors.length)];
  const randomRotation = () => random(-180, 180);

  const fragment = document.createDocumentFragment();

  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    
    const duration = random(1, 5);
    const delay = -random(0.1, 2);
    const rotateX = randomRotation();
    const rotateY = randomRotation();
    const rotateZ = randomRotation();
    const color = randomColor();
    const transparentStop = random(50, 100);

    particle.style.setProperty('--duration', `${duration}s`);
    particle.style.setProperty('--delay', `${delay}s`);
    particle.style.setProperty('--rX', `${rotateX}deg`);
    particle.style.setProperty('--rY', `${rotateY}deg`);
    particle.style.setProperty('--rZ', `${rotateZ}deg`);
    particle.style.setProperty('--color', color);
    particle.style.setProperty('--transparentStop', `${transparentStop}%`);
    
    fragment.appendChild(particle);
  }
  
  container.appendChild(fragment);
};

initParticles();

