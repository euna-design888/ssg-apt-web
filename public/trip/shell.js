/* 여행 모아보기 공용 껍데기: 축제·캠핑 상세 페이지 맨 위에 앱 상단바를 붙인다 (10/7).
   페이지마다 <link href="/trip/shell.css"><script defer src="/trip/shell.js"> 두 줄만 넣으면 됨. */
(function(){
  if(document.getElementById('tripshell'))return;
  var p=location.pathname,sec=p.indexOf('/camping')===0?'camp':p.indexOf('/festival')===0?'fest':'';
  var tabs=[['홈','/trip#week','h'],['둘러보기','/trip#'+(sec||'fest'),'e'],['지도','/trip#map','m']];
  var bar=document.createElement('div');bar.id='tripshell';
  bar.innerHTML='<div class="ts-in"><a class="ts-brand" href="/trip#week">놀멍지도</a><nav class="ts-nav" aria-label="앱 메뉴">'+
    tabs.map(function(t){return '<a href="'+t[1]+'" class="ts-'+t[2]+'">'+t[0]+'</a>'}).join('')+'</nav></div>';
  document.body.insertBefore(bar,document.body.firstChild);
  document.documentElement.classList.add('trip-shell',sec?'ts-'+sec:'ts-x');
})();
