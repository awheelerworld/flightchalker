/* Flight Chalker cookie notice: Google Analytics loads only after the visitor accepts. */
(function(){
  var KEY='fc_analytics_consent',ID='G-WQRGJRFF1Q',loaded=false;
  function get(){try{return localStorage.getItem(KEY)}catch(e){return null}}
  function set(v){try{localStorage.setItem(KEY,v)}catch(e){}}
  function load(){
    if(loaded)return;loaded=true;
    var s=document.createElement('script');s.async=true;
    s.src='https://www.googletagmanager.com/gtag/js?id='+ID;
    document.head.appendChild(s);
  }
  function clearGA(){
    try{
      var host=location.hostname.replace(/^www\./,'');
      document.cookie.split(';').forEach(function(c){
        var n=c.split('=')[0].trim();
        if(n==='_ga'||n.indexOf('_ga_')===0){
          ['','; domain='+host,'; domain=.'+host].forEach(function(d){
            document.cookie=n+'=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/'+d;
          });
        }
      });
    }catch(e){}
  }
  function banner(){
    if(document.getElementById('fc-consent'))return;
    var d=document.createElement('div');d.id='fc-consent';d.setAttribute('role','dialog');d.setAttribute('aria-label','Cookie notice');
    d.innerHTML='<style>#fc-consent{position:fixed;left:0;right:0;bottom:0;z-index:99999;background:#142119;border-top:2px solid #f2cf4a;color:#f1efe4;font:14px/1.4 "Hanken Grotesk",Arial,sans-serif;padding:.75rem 1rem;display:flex;gap:.75rem;align-items:center;justify-content:center;flex-wrap:wrap}#fc-consent p{margin:0;max-width:560px;color:#f1efe4}#fc-consent a{color:#f2cf4a}#fc-consent button{font:inherit;font-weight:700;border-radius:999px;padding:.5rem 1.1rem;cursor:pointer;border:1px solid #4c9468;background:transparent;color:#f1efe4}#fc-consent button.y{background:#f2cf4a;border-color:#f2cf4a;color:#14200f}</style><p>We use Google Analytics cookies to see how the site is used. Nothing is loaded unless you accept. <a href="/privacy">Privacy policy</a></p><div style="display:flex;gap:.5rem"><button class="y" type="button">Accept</button><button class="n" type="button">Decline</button></div>';
    d.querySelector('.y').onclick=function(){set('yes');d.remove();load()};
    d.querySelector('.n').onclick=function(){set('no');d.remove();clearGA()};
    document.body.appendChild(d);
  }
  window.fcCookieSettings=function(){try{localStorage.removeItem(KEY)}catch(e){}banner()};
  var c=get();
  if(c==='yes')load();
  else if(c!=='no'){
    if(document.body)banner();else document.addEventListener('DOMContentLoaded',banner);
  }
})();
