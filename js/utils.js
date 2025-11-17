// utility helpers
window.GAME_UTILS = (function(){
  function shuffle(a){ for(let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]] } return a; }
  function escapeHtml(s){ return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":"&#39;"}[c])); }
  function lerp(a,b,t){ return a + (b-a)*t; }
  return { shuffle, escapeHtml, lerp };
})();
