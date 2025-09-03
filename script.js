const intro = document.getElementById('intro');
const main = document.getElementById('main-content');
const topBar = document.getElementById('topBar') || document.querySelector('.top-bar');
const heroLeft = document.querySelector('.about-left');
const heroRight = document.querySelector('.about-right');

let currentProject = 0;
const projectItems = Array.from(document.querySelectorAll('.project-item'));

window.addEventListener('load', () => {
  setTimeout(() => {
    intro.style.transition = 'opacity 1s ease';
    intro.style.opacity = '0';

    setTimeout(() => {
      intro.style.display = 'none';
      main.style.display = 'block';

      document.getElementById('about')?.scrollIntoView({ behavior: 'auto' });

      animateAboutMe();
      initObservers();

    }, 1000);
  }, 1500);
});

function animateAboutMe() {
  if (heroLeft) {
    heroLeft.style.opacity = '0';
    heroLeft.style.transform = 'translateX(-100px)';
    setTimeout(() => {
      heroLeft.style.transition = 'all 1s ease';
      heroLeft.style.opacity = '1';
      heroLeft.style.transform = 'translateX(0)';
    }, 200);
  }
  if (heroRight) {
    heroRight.style.opacity = '0';
    heroRight.style.transform = 'translateX(100px)';
    setTimeout(() => {
      heroRight.style.transition = 'all 1s ease';
      heroRight.style.opacity = '1';
      heroRight.style.transform = 'translateX(0)';
    }, 400);
  }
}

let lastScroll = 0;
window.addEventListener('scroll', () => {
  const y = window.pageYOffset || document.documentElement.scrollTop;
  if (!topBar) return;
  if (y === 0) {
    topBar.style.top = '0';
  } else if (y > lastScroll && y > 80) {
    topBar.style.top = '-86px';
  } else {
    topBar.style.top = '0';
  }
  lastScroll = y;
});

document.querySelectorAll('.nav-left a[data-target]').forEach(a => {
  a.addEventListener('click', (e)=>{
    e.preventDefault();
    const id = a.getAttribute('data-target');
    document.getElementById(id)?.scrollIntoView({behavior:'smooth'});
  });
});

function initObservers() {
  // Skills
  const skillCards = document.querySelectorAll('.skill-card');
  const skillObserver = new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        entry.target.classList.add('show');
      }
    });
  }, {threshold: 0.35});
  skillCards.forEach(c => skillObserver.observe(c));

  const projectsSection = document.getElementById('projects');
  const projObserver = new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        document.querySelectorAll('.project-item').forEach((it, i)=>{
          it.style.opacity = 1;
          it.style.transform = 'translateY(0)';
          it.style.transition = `all 0.6s ease ${i * 0.2}s`;
        });
      }
    });
  }, {threshold: 0.3});
  if (projectsSection) projObserver.observe(projectsSection);
}

(function setupProjects(){
  const trackEl = document.getElementById('projectsTrack');
  if(!trackEl) return;

  const inner = document.createElement('div');
  inner.className = 'projects-track-inner';
  const items = Array.from(trackEl.querySelectorAll('.project-item'));
  items.forEach(it => inner.appendChild(it));
  trackEl.appendChild(inner);

  const prev = document.getElementById('projPrev');
  const next = document.getElementById('projNext');

  function render(){
    const width = trackEl.clientWidth;
    inner.style.transform = `translateX(${-currentProject * width}px)`;
  }

  prev?.addEventListener('click', ()=>{ currentProject = Math.max(0, currentProject-1); render(); });
  next?.addEventListener('click', ()=>{ currentProject = Math.min(items.length-1, currentProject+1); render(); });

  window.addEventListener('resize', render);
  document.addEventListener('keydown', e=>{
    if(e.key === 'ArrowRight') { currentProject = Math.min(items.length-1, currentProject+1); render(); }
    if(e.key === 'ArrowLeft') { currentProject = Math.max(0, currentProject-1); render(); }
  });

  setTimeout(render, 100);
})();

function scrollToSection(id){
  document.getElementById(id)?.scrollIntoView({behavior:'smooth'});
}
