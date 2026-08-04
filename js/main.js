document.addEventListener('DOMContentLoaded', ()=>{
  // Flip-card interaction: toggle .flipped on click or Enter/Space
  document.querySelectorAll('.flip-card').forEach(card=>{
    card.addEventListener('click', ()=>{
      card.classList.toggle('flipped');
    });
    card.addEventListener('keydown', (e)=>{
      if(e.key === 'Enter' || e.key === ' '){
        e.preventDefault();
        card.classList.toggle('flipped');
      }
    });
  });

  // Reduce motion: stop ticker if user prefers reduced motion
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  if(prefersReduced.matches){
    document.querySelectorAll('.ticker-track').forEach(t => t.style.animationPlayState = 'paused');
  }

  // IntersectionObserver: reveal on scroll
  const reveals = document.querySelectorAll('.reveal');
  if('IntersectionObserver' in window){
    const io = new IntersectionObserver((entries)=>{
      entries.forEach(ent=>{
        if(ent.isIntersecting){
          // stagger reveal by index if multiple children
          const idx = Array.from(reveals).indexOf(ent.target);
          ent.target.style.transitionDelay = (idx * 90) + 'ms';
          ent.target.classList.add('in-view');
          io.unobserve(ent.target);
        }
      });
    },{threshold:0.12});
    reveals.forEach(r=>io.observe(r));
  } else {
    reveals.forEach(r=>r.classList.add('in-view'));
  }

  // Start subtle hero background animation
  const heroBg = document.querySelector('.hero-bg');
  if(heroBg) heroBg.classList.add('animate');

  // Pause ticker on hover (for desktop)
  document.querySelectorAll('.hero-ticker').forEach(tk=>{
    tk.addEventListener('mouseenter', ()=>{ tk.querySelectorAll('.ticker-track').forEach(tt=>tt.style.animationPlayState='paused')});
    tk.addEventListener('mouseleave', ()=>{ tk.querySelectorAll('.ticker-track').forEach(tt=>tt.style.animationPlayState='running')});
  });

  // Contact form: build mailto and open user's mail client
  const contactForm = document.getElementById('contact-form');
  if(contactForm){
    contactForm.addEventListener('submit', (e)=>{
      e.preventDefault();
      const to = document.getElementById('to-email').value || 'jeongmyongkuk@gmail.com';
      const name = document.getElementById('name').value.trim();
      const from = document.getElementById('email').value.trim();
      const message = document.getElementById('message').value.trim();
      const subject = encodeURIComponent(`제작상담 문의: ${name}`);
      const body = encodeURIComponent(`이름: ${name}\n이메일: ${from}\n\n문의 내용:\n${message}`);
      const mailto = `mailto:${to}?subject=${subject}&body=${body}`;
      window.location.href = mailto;
    });
  }
});
