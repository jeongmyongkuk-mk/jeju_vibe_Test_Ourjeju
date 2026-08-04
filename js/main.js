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
      const store = (document.getElementById('store') && document.getElementById('store').value.trim()) || '';
      const phoneEl = document.getElementById('phone');
      const phone = (phoneEl && phoneEl.value.trim()) || '';
      const phoneErrorEl = document.getElementById('phone-error');
      const from = document.getElementById('email').value.trim();
      const message = document.getElementById('message').value.trim();

      // Phone validation: allow digits, spaces, hyphens, parentheses; require 9-11 digits
      const digits = phone.replace(/\D/g, '');
      if(digits.length > 0 && (digits.length < 9 || digits.length > 11)){
        phoneErrorEl.textContent = '전화번호는 숫자 9~11자리여야 합니다.';
        phoneEl.classList.add('invalid');
        phoneEl.focus();
        showToast('전화번호 형식을 확인해주세요.');
        return;
      } else {
        phoneErrorEl.textContent = '';
        phoneEl.classList.remove('invalid');
      }

      const subject = encodeURIComponent(`제작상담 문의: ${name}${store ? ' / ' + store : ''}`);
      const body = encodeURIComponent(`이름: ${name}\n매장명: ${store}\n전화번호: ${phone}\n이메일: ${from}\n\n문의 내용:\n${message}`);
      const mailto = `mailto:${to}?subject=${subject}&body=${body}`;

      // Show modal confirmation
      const modal = document.getElementById('confirm-modal');
      const toast = document.getElementById('toast');
      const sendBtn = document.getElementById('modal-send');
      const cancelBtn = document.getElementById('modal-cancel');
      const closeBtn = modal.querySelector('.modal-close');

      function openMail(){
        window.location.href = mailto;
      }

      // attach handlers
      const cleanup = ()=>{
        sendBtn.removeEventListener('click', openMailHandler);
        cancelBtn.removeEventListener('click', closeHandler);
        closeBtn.removeEventListener('click', closeHandler);
        modal.setAttribute('aria-hidden','true');
      };
      const openMailHandler = ()=>{ cleanup(); openMail(); };
      const closeHandler = ()=>{ cleanup(); };

      sendBtn.addEventListener('click', openMailHandler);
      cancelBtn.addEventListener('click', closeHandler);
      closeBtn.addEventListener('click', closeHandler);
      modal.setAttribute('aria-hidden','false');

      // also show a brief toast
      showToast('메일 클라이언트를 여는 중입니다...');
      // auto open mail after short delay
      setTimeout(()=>{ openMail(); cleanup(); }, 1400);
    });
  }

  // Toast helper
  function showToast(msg, timeout=2200){
    const t = document.getElementById('toast');
    if(!t) return;
    t.textContent = msg;
    t.classList.add('show');
    setTimeout(()=> t.classList.remove('show'), timeout);
  }
});
