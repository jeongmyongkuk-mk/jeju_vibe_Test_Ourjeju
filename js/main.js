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
    tk.addEventListener('mouseenter', ()=>{
      tk.querySelectorAll('.ticker-track').forEach(tt => tt.style.animationPlayState = 'paused');
    });
    tk.addEventListener('mouseleave', ()=>{
      tk.querySelectorAll('.ticker-track').forEach(tt => tt.style.animationPlayState = 'running');
    });
  });

  // Contact form: submit to backend API for automatic email dispatch
  const contactForm = document.getElementById('contact-form');
  if(contactForm){
    const submitButton = document.getElementById('contact-submit');
    const successPanel = document.getElementById('contact-success');
    const errorText = document.getElementById('contact-error');

    contactForm.addEventListener('submit', async (e)=>{
      e.preventDefault();
      errorText.hidden = true;

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

      const endpointField = document.getElementById('form-endpoint');
      let endpoint = (endpointField && endpointField.value.trim()) || '';
      const payload = { name, store, phone, email: from, message };

      submitButton.disabled = true;
      submitButton.textContent = '전송 중...';

      const useLocalBackend = endpoint === '';
      if(useLocalBackend){
        endpoint = '/api/contact';
      }

      const requestOptions = {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify(payload),
      };

      const isGAS = !useLocalBackend && (endpoint.startsWith('https://script.google.com') || endpoint.includes('macros.google.com'));
      if(isGAS){
        requestOptions.mode = 'no-cors';
        requestOptions.headers = {'Content-Type':'text/plain;charset=utf-8'};
      }

      try {
        const res = await fetch(endpoint, requestOptions);

        const success = isGAS || (res && res.ok);
        if(success){
          saveSubmission(payload);
          contactForm.hidden = true;
          successPanel.hidden = false;
          showToast('문의가 접수되었습니다. 담당자가 곧 연락드립니다.');
        } else {
          const data = await res.json().catch(()=>null);
          errorText.textContent = data?.error || '전송에 실패했습니다. 잠시 후 다시 시도해주세요.';
          errorText.hidden = false;
          showToast('전송에 실패했습니다.');
        }
      } catch(err){
        console.error('Contact submit failed', err);
        errorText.textContent = useLocalBackend
          ? '로컬 서버 연결에 실패했습니다. 서버가 실행 중인지 확인해주세요.'
          : '전송에 실패했습니다. endpoint URL과 CORS 설정을 확인해주세요.';
        errorText.hidden = false;
        showToast('전송에 실패했습니다.');
      } finally {
        submitButton.disabled = false;
        submitButton.textContent = '문의하기';
      }
    });
  }

  // Save submission in localStorage (simple record)
  function saveSubmission(payload){
    try{
      const key = 'maxjeju_submissions';
      const list = JSON.parse(localStorage.getItem(key) || '[]');
      list.unshift(Object.assign({ ts: new Date().toISOString() }, payload));
      localStorage.setItem(key, JSON.stringify(list.slice(0,50)));
    }catch(e){ console.warn('failed to save submission', e); }
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
