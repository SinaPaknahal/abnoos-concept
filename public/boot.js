(()=>{
 const started=performance.now(),loader=document.getElementById('water-loader');
 try{const language=JSON.parse(localStorage.getItem('abnoos-lang'));document.documentElement.lang=language==='en'?'en':'fa';document.documentElement.dir=language==='en'?'ltr':'rtl';document.documentElement.dataset.theme=JSON.parse(localStorage.getItem('abnoos-theme'))||(matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light')}catch{}
 if(document.documentElement.lang==='en'){document.getElementById('loader-title').textContent='One drop. A clearer beginning.';document.getElementById('loader-subtitle').textContent='Preparing your Abnoos experience';loader.setAttribute('aria-label','Preparing the Abnoos experience')}
 let finished=false;
 const finish=()=>{if(finished)return;finished=true;const min=matchMedia('(prefers-reduced-motion: reduce)').matches?80:950;setTimeout(()=>{loader.classList.add('leaving');document.documentElement.classList.remove('booting');document.getElementById('root').inert=false;setTimeout(()=>loader.remove(),650)},Math.max(0,min-(performance.now()-started)))};
 window.addEventListener('abnoos:scene-ready',()=>Promise.resolve(document.fonts?.ready).then(finish),{once:true});setTimeout(finish,8000);
})();
