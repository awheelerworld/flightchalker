/* Flight Chalker - achievements helper, shared by the scorer, training zone, dashboard and Achievements page.
   Badges are worked out by the database (refresh_my_achievements). This file asks for them, shows a pop-up
   for any newly earned badge, and draws medals. */
(function(){
  var RARITY={common:{label:'Common',ring:'#b08d57'},rare:{label:'Rare',ring:'#9aa7b4'},epic:{label:'Epic',ring:'#e0b93a'},legendary:{label:'Legendary',ring:'#c05cff'}};
  var TIERNAME=['','','II','III','IV'];
  var defsCache=null,running=false,lastRun=0;
  function esc(s){return String(s==null?'':s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];});}
  function medal(d,tier,px,locked){
    var r=RARITY[d.rarity]||RARITY.common,size=px||56;
    var ring=locked?'#5d6a5f':r.ring;
    var t=(tier&&tier>1&&d.tiers&&d.tiers.length>1)?'<span style="position:absolute;right:-4px;bottom:-4px;background:#142119;color:#f2cf4a;border:1px solid '+ring+';border-radius:9px;font:700 '+Math.max(10,Math.round(size*0.22))+'px Barlow Condensed,Arial Narrow,sans-serif;padding:0 5px;line-height:1.4">'+(TIERNAME[tier]||tier)+'</span>':'';
    return '<span style="position:relative;display:inline-flex;align-items:center;justify-content:center;width:'+size+'px;height:'+size+'px;border-radius:50%;flex-shrink:0;'
      +'background:'+(locked?'#243026':'radial-gradient(circle at 35% 30%,#2f4a39,#16251c)')+';border:3px solid '+ring+';box-shadow:0 0 0 2px rgba(0,0,0,.35)'+(locked?'':',0 0 12px '+ring+'55')+';'
      +'font-size:'+Math.round(size*0.46)+'px;line-height:1;'+(locked?'filter:grayscale(1);opacity:.55':'')+'" aria-hidden="true">'+d.icon+t+'</span>';
  }
  async function loadDefs(sb){
    if(defsCache)return defsCache;
    var r=await sb.from('achievement_defs').select('*').order('sort');
    if(r.error)throw r.error;
    defsCache=r.data||[];return defsCache;
  }
  function ensureBox(){
    var b=document.getElementById('fcach-box');
    if(b)return b;
    b=document.createElement('div');b.id='fcach-box';b.setAttribute('aria-live','polite');
    b.style.cssText='position:fixed;left:0;right:0;bottom:calc(14px + env(safe-area-inset-bottom,0px));display:flex;flex-direction:column;align-items:center;gap:8px;z-index:100000;pointer-events:none;padding:0 16px';
    document.body.appendChild(b);return b;
  }
  function toast(d,tier,rows){
    var box=ensureBox(),el=document.createElement('div');
    var lvl=(d.tiers&&d.tiers.length>1)?' · level '+tier:'';
    el.style.cssText='pointer-events:auto;display:flex;align-items:center;gap:12px;max-width:420px;width:100%;background:#142119;color:#f1efe4;border:2px solid '+(RARITY[d.rarity]||RARITY.common).ring+';border-radius:14px;padding:10px 14px;box-shadow:0 8px 28px rgba(0,0,0,.45);font-family:Barlow,system-ui,sans-serif;cursor:pointer;transform:translateY(20px);opacity:0;transition:all .35s';
    el.innerHTML=medal(d,tier,46)+'<span style="min-width:0"><span style="display:block;font:700 .72rem Barlow Condensed,Arial Narrow,sans-serif;letter-spacing:.12em;text-transform:uppercase;color:#f2cf4a">Badge earned'+esc(lvl)+'</span><span style="display:block;font-weight:600">'+esc(d.name)+'</span><span style="display:block;font-size:.8rem;color:#9aa690">'+esc(d.description)+'</span></span>';
    el.onclick=function(){location.href='/achievements';};
    box.appendChild(el);
    requestAnimationFrame(function(){el.style.transform='none';el.style.opacity='1';});
    setTimeout(function(){el.style.opacity='0';el.style.transform='translateY(20px)';setTimeout(function(){el.remove();},400);},7000);
  }
  function more(n){
    var box=ensureBox(),el=document.createElement('div');
    el.style.cssText='pointer-events:auto;background:#142119;color:#f2cf4a;border:1px solid #4a7c59;border-radius:12px;padding:8px 14px;font:600 .9rem Barlow,system-ui,sans-serif;cursor:pointer';
    el.textContent='+'+n+' more badge'+(n===1?'':'es')+' earned. See them all';
    el.onclick=function(){location.href='/achievements';};
    box.appendChild(el);setTimeout(function(){el.remove();},7000);
  }
  // Ask the database to refresh my badges. Returns {rows, defs, newly}. quiet=true skips pop-ups.
  async function check(sb,quiet){
    if(running||!sb)return null;
    if(Date.now()-lastRun<1500)return null;
    running=true;
    try{
      var s=await sb.auth.getSession();
      if(!s.data||!s.data.session)return null;
      var r=await sb.rpc('refresh_my_achievements');
      if(r.error)throw r.error;
      lastRun=Date.now();
      var defs=await loadDefs(sb),by={};defs.forEach(function(d){by[d.key]=d;});
      var rows=r.data||[],newly=rows.filter(function(x){return x.tier>x.prev_tier&&by[x.key];});
      if(!quiet){
        newly.slice(0,3).forEach(function(x,i){setTimeout(function(){toast(by[x.key],x.tier);},i*900);});
        if(newly.length>3)setTimeout(function(){more(newly.length-3);},3*900);
      }
      return {rows:rows,defs:defs,newly:newly};
    }catch(e){console.error('Achievements:',e);return null;}
    finally{running=false;}
  }
  window.FCAch={check:check,medal:medal,loadDefs:loadDefs,RARITY:RARITY,esc:esc};
})();
