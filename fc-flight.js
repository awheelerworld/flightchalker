/* Flight Chalker - flight designer drawing code, shared by the designer, dashboard and profiles.
   A design is {shape, pattern, motif, c1, c2, c3, text}. Everything is drawn as SVG, no images. */
(function(){
  var SHAPES={
    standard:'M47 127 L10 80 Q5 72 5 62 L5 26 Q5 14 17 13 Q50 7 83 13 Q95 14 95 26 L95 62 Q95 72 90 80 L53 127 Z',
    slim:'M47 127 L24 84 Q19 76 19 66 L19 30 Q19 19 29 17 Q50 11 71 17 Q81 19 81 30 L81 66 Q81 76 76 84 L53 127 Z',
    kite:'M50 4 L77 15.7 C90 20.5 97.5 31 97.5 45 C97.5 52 95 56 92 61 L53 127 L47 127 L8 61 C5 56 2.5 52 2.5 45 C2.5 31 10 20.5 23 15.7 Z',
    pear:'M50 4 C72 9 91 30 91 56 C91 86 68 108 53 127 L47 127 C32 108 9 86 9 56 C9 30 28 9 50 4 Z'
  };
  var PATTERNS=['solid','stripes','half','chevron','dots','rings','rays'];
  var MOTIFS=['none','star','bolt','board','heart','crown','flame','trophy','pint','dart','moon','sun','diamond','clover'];
  var NAMES={shape:{standard:'Standard',slim:'Slim',kite:'Kite',pear:'Pear'},
    pattern:{solid:'Plain',stripes:'Stripes',half:'Split',chevron:'Chevrons',dots:'Dots',rings:'Rings',rays:'Fan'},
    motif:{none:'None',star:'Star',bolt:'Bolt',board:'Board',heart:'Heart',crown:'Crown',flame:'Flame',trophy:'Trophy',pint:'Pint',dart:'Dart',moon:'Moon',sun:'Sun',diamond:'Diamond',clover:'Clover'}};
  var DEFAULT={shape:'standard',pattern:'stripes',motif:'star',c1:'#1f6f43',c2:'#f2cf4a',c3:'#ffffff',text:''};
  var PALETTE=['#c0392b','#e67e22','#f2cf4a','#27ae60','#1f6f43','#2980b9','#1b2a6b','#8e44ad','#e84393','#111111','#ffffff','#95a5a6'];
  var uid=0;
  function col(c,d){return /^#[0-9a-fA-F]{6}$/.test(c||'')?c:d;}
  function clean(d){
    d=d||{};
    return {
      shape:SHAPES[d.shape]?d.shape:DEFAULT.shape,
      pattern:PATTERNS.indexOf(d.pattern)>-1?d.pattern:DEFAULT.pattern,
      motif:MOTIFS.indexOf(d.motif)>-1?d.motif:DEFAULT.motif,
      c1:col(d.c1,DEFAULT.c1),c2:col(d.c2,DEFAULT.c2),c3:col(d.c3,DEFAULT.c3),
      text:String(d.text||'').replace(/[^A-Za-z0-9]/g,'').slice(0,3).toUpperCase()
    };
  }
  function patternSvg(d){
    var s='<rect x="-10" y="-10" width="120" height="150" fill="'+d.c1+'"/>',i,j;
    if(d.pattern==='stripes'){
      s+='<g transform="rotate(-35 50 65)" fill="'+d.c2+'">';
      for(i=-3;i<8;i++)s+='<rect x="-50" y="'+(i*24)+'" width="200" height="11"/>';
      s+='</g>';
    }else if(d.pattern==='half'){
      s+='<rect x="50" y="-10" width="60" height="150" fill="'+d.c2+'"/>';
    }else if(d.pattern==='chevron'){
      s+='<g fill="none" stroke="'+d.c2+'" stroke-width="8">';
      for(i=0;i<7;i++)s+='<path d="M-5 '+(i*24-4)+' L50 '+(i*24+20)+' L105 '+(i*24-4)+'"/>';
      s+='</g>';
    }else if(d.pattern==='dots'){
      s+='<g fill="'+d.c2+'">';
      for(j=0;j<8;j++)for(i=0;i<6;i++)s+='<circle cx="'+(i*20+(j%2?10:0))+'" cy="'+(j*18+4)+'" r="5"/>';
      s+='</g>';
    }else if(d.pattern==='rays'){
      s+='<g fill="'+d.c2+'">';
      [-80,-60,-40,-20,0,20,40,60,80].forEach(function(c){
        var a1=(c-5)*Math.PI/180,a2=(c+5)*Math.PI/180;
        s+='<polygon points="50,129 '+(50+220*Math.sin(a1)).toFixed(1)+','+(129-220*Math.cos(a1)).toFixed(1)+' '+(50+220*Math.sin(a2)).toFixed(1)+','+(129-220*Math.cos(a2)).toFixed(1)+'"/>';
      });
      s+='</g>';
    }else if(d.pattern==='rings'){
      s+='<g fill="none" stroke="'+d.c2+'" stroke-width="6">';
      [14,28,42,58,76].forEach(function(r){s+='<circle cx="50" cy="52" r="'+r+'"/>';});
      s+='</g>';
    }
    return s;
  }
  function motifSvg(d){
    var c=d.c3,shadow='rgba(0,0,0,.35)';
    if(d.motif==='star'){
      var pts=[],k,r,a;
      for(k=0;k<10;k++){r=k%2?7.5:18;a=-Math.PI/2+k*Math.PI/5;pts.push((50+r*Math.cos(a)).toFixed(1)+','+(56+r*Math.sin(a)).toFixed(1));}
      return '<polygon points="'+pts.join(' ')+'" fill="'+c+'" stroke="'+shadow+'" stroke-width="1.5"/>';
    }
    if(d.motif==='bolt')return '<path d="M57 36 L38 62 L49 62 L43 84 L64 55 L52 55 Z" fill="'+c+'" stroke="'+shadow+'" stroke-width="1.5" stroke-linejoin="round"/>';
    if(d.motif==='board')return '<g fill="none" stroke="'+c+'" stroke-width="3.5"><circle cx="50" cy="58" r="17"/><circle cx="50" cy="58" r="8"/></g><circle cx="50" cy="58" r="2.8" fill="'+c+'"/>';
    if(d.motif==='heart')return '<path d="M50 74 C28 59 33 43 44 43 C48 43 50 46 50 49 C50 46 52 43 56 43 C67 43 72 59 50 74 Z" fill="'+c+'" stroke="'+shadow+'" stroke-width="1.5" stroke-linejoin="round"/>';
    var st=' stroke="'+shadow+'" stroke-width="1.5" stroke-linejoin="round"';
    if(d.motif==='crown')return '<path d="M32 74 L30 46 L41 56 L50 42 L59 56 L70 46 L68 74 Z" fill="'+c+'"'+st+'/>';
    if(d.motif==='flame')return '<path d="M50 36 C52 46 64 52 64 65 C64 74 57 79 50 79 C43 79 36 74 36 65 C36 58 40 54 43 50 C44 55 46 57 48 57 C47 50 47 42 50 36 Z" fill="'+c+'"'+st+'/><path d="M50 62 C54 66 57 69 57 72 C57 76 54 78 50 78 C46 78 43 76 43 72 C43 69 47 66 50 62 Z" fill="rgba(0,0,0,.28)"/>';
    if(d.motif==='trophy')return '<g fill="'+c+'"'+st+'><path d="M36 42 H64 V54 C64 63 57 68 50 68 C43 68 36 63 36 54 Z"/><rect x="46" y="68" width="8" height="7"/><rect x="38" y="75" width="24" height="6" rx="1.5"/></g><path d="M36 46 H30 C30 57 34 59 38 59 M64 46 H70 C70 57 66 59 62 59" fill="none" stroke="'+c+'" stroke-width="3"/>';
    if(d.motif==='pint')return '<path d="M37 42 H63 L58 78 H42 Z" fill="'+c+'"'+st+'/><path d="M39 52 H61" stroke="'+shadow+'" stroke-width="2"/>';
    if(d.motif==='dart')return '<g transform="rotate(40 50 56)" fill="'+c+'"'+st+'><path d="M50 81 L47 68 H53 Z"/><rect x="46" y="53" width="8" height="15" rx="2"/><rect x="48.5" y="46" width="3" height="7"/><path d="M50 47 L38 38 L42 31 L50 39 L58 31 L62 38 Z"/><path d="M46.5 58 H53.5 M46.5 61.5 H53.5 M46.5 65 H53.5" fill="none" stroke="'+shadow+'" stroke-width="1.2"/></g>';
    if(d.motif==='moon')return '<path d="M58 40 A19 19 0 1 0 68 68 A15 15 0 1 1 58 40 Z" fill="'+c+'"'+st+'/>';
    if(d.motif==='sun'){var rays='',q;for(q=0;q<8;q++){rays+='<line x1="50" y1="38" x2="50" y2="43" transform="rotate('+(q*45)+' 50 58)"/>';}return '<circle cx="50" cy="58" r="9" fill="'+c+'"'+st+'/><g stroke="'+c+'" stroke-width="3.5" stroke-linecap="round">'+rays+'</g>';}
    if(d.motif==='diamond')return '<polygon points="50,40 68,58 50,78 32,58" fill="'+c+'"'+st+'/>';
    if(d.motif==='clover'){var lf='M0 0 C-12 -6 -12 -20 -5 -20 C-2 -20 0 -17 0 -14 C0 -17 2 -20 5 -20 C12 -20 12 -6 0 0 Z',lv='',a;for(a=0;a<360;a+=90)lv+='<path d="'+lf+'" transform="translate(50 56) rotate('+a+')"/>';return '<path d="M50 70 Q50 78 57 80" fill="none" stroke="'+c+'" stroke-width="3.5" stroke-linecap="round"/><g fill="'+c+'"'+st+'>'+lv+'</g>';}
    return '';
  }
  function inner(d,id){
    var text=d.text?'<text x="50" y="100" text-anchor="middle" font-family="Barlow Condensed,Arial Narrow,Arial,sans-serif" font-weight="900" font-size="21" fill="'+d.c3+'" stroke="rgba(0,0,0,.5)" stroke-width="3.2" paint-order="stroke" stroke-linejoin="round">'+d.text+'</text>':'';
    return '<defs><clipPath id="'+id+'"><path d="'+SHAPES[d.shape]+'"/></clipPath></defs>'
      +'<g clip-path="url(#'+id+')">'+patternSvg(d)+(d.motif!=='none'?'<circle cx="50" cy="58" r="25" fill="'+d.c1+'" fill-opacity=".88"/><g transform="translate(50 58) scale(1.2) translate(-50 -58)">'+motifSvg(d)+'</g>':'')+'</g>'
      +'<path d="'+SHAPES[d.shape]+'" fill="none" stroke="rgba(0,0,0,.5)" stroke-width="2.5" stroke-linejoin="round"/>'
      +(true?'<path d="M47 127 L53 127 L52 132 L48 132 Z" fill="#8a9080"/>':'<path d="M43 127 L57 127 L55 132 L45 132 Z" fill="#8a9080"/>')
      +text;
  }
  function svg(design,opts){
    var d=clean(design),o=opts||{},id='fcf'+(++uid);
    var w=o.width?(' width="'+o.width+'"'):'';
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 132"'+w+' role="img" aria-label="Dart flight design" style="display:block;overflow:visible">'+inner(d,id)+'</svg>';
  }
  // A whole dart (flight, shaft, barrel, tip) carrying the player's flight design
  function dart(design,opts){
    var d=clean(design),o=opts||{},id='fcf'+(++uid),gid='fcg'+uid;
    var w=o.width?(' width="'+o.width+'"'):'';
    var ang=o.angle||0;
    var grooves='',g;
    for(g=0;g<7;g++)grooves+='<path d="M41 '+(178+g*7)+' H59" stroke="rgba(0,0,0,.35)" stroke-width="1.4"/>';
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="-30 -10 160 290"'+w+' role="img" aria-label="Dart with your flight design" style="display:block;overflow:visible">'
      +'<defs><linearGradient id="'+gid+'" x1="0" x2="1"><stop offset="0" stop-color="#8a9080"/><stop offset=".35" stop-color="#e6e9e2"/><stop offset=".7" stop-color="#aab0a2"/><stop offset="1" stop-color="#6d7366"/></linearGradient></defs>'
      +'<g transform="rotate('+ang+' 50 140)">'
      +'<rect x="46" y="128" width="8" height="52" rx="2" fill="'+d.c1+'" stroke="rgba(0,0,0,.45)" stroke-width="1.5"/>'
      +'<rect x="46" y="140" width="8" height="5" fill="'+d.c2+'" opacity=".9"/>'
      +inner(d,id)
      +'<path d="M41 172 H59 L58 236 H42 Z" fill="url(#'+gid+')" stroke="rgba(0,0,0,.5)" stroke-width="1.5" stroke-linejoin="round"/>'
      +grooves
      +'<path d="M42 236 H58 L51 270 H49 Z" fill="url(#'+gid+')" stroke="rgba(0,0,0,.5)" stroke-width="1.5" stroke-linejoin="round"/>'
      +'</g></svg>';
  }
  // Round avatar with the flight inside (px = diameter)
  function avatar(design,px){
    px=px||72;
    return '<span class="fc-flight-av" style="display:inline-flex;align-items:center;justify-content:center;width:'+px+'px;height:'+px+'px;border-radius:50%;background:#243628;border:2px solid #4a7c59;overflow:hidden;flex-shrink:0">'
      +'<span style="display:block;width:'+Math.round(px*0.5)+'px">'+svg(design)+'</span></span>';
  }
  function random(){
    function pick(a){return a[Math.floor(Math.random()*a.length)];}
    var c1=pick(PALETTE),c2=pick(PALETTE),c3=pick(PALETTE);
    while(c2===c1)c2=pick(PALETTE);
    while(c3===c1)c3=pick(PALETTE);
    return {shape:pick(Object.keys(SHAPES)),pattern:pick(PATTERNS),motif:pick(MOTIFS),c1:c1,c2:c2,c3:c3,text:''};
  }
  window.FCFlight={svg:svg,dart:dart,avatar:avatar,clean:clean,random:random,
    SHAPES:Object.keys(SHAPES),PATTERNS:PATTERNS,MOTIFS:MOTIFS,NAMES:NAMES,PALETTE:PALETTE,DEFAULT:DEFAULT};
})();
