/* ===== ABOUT PAGE LOGIC ===== */
(function(){
  function initSkillBars(){
    const bars = document.querySelectorAll('.skill .bar i');
    const io = new IntersectionObserver(entries=>{
      entries.forEach(e=>{
        if(e.isIntersecting){
          const width = e.target.dataset.target;
          e.target.style.width = '0';
          requestAnimationFrame(()=> setTimeout(()=>{ e.target.style.width = width; }, 80));
          io.unobserve(e.target);
        }
      });
    }, { threshold:.4 });
    bars.forEach(b=>{
      b.dataset.target = b.style.width;
      io.observe(b);
    });
  }
  document.addEventListener('DOMContentLoaded', initSkillBars);
})();
