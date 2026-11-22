// Renders social graphics from concept art: node render.js  (needs Playwright)
const {chromium}=require('playwright');const path=require('path');
const art='data:image/jpeg;base64,'+require('fs').readFileSync(path.resolve(__dirname,'../../storefront/assets/img/rtt-orange-back.jpg')).toString('base64');
const css=`<link href="https://fonts.googleapis.com/css2?family=Anton&family=Yellowtail&family=JetBrains+Mono&display=swap" rel="stylesheet">
<style>body{margin:0;background:#141414;color:#EDE4CF;font-family:Anton,Impact,sans-serif}
.s{position:relative;overflow:hidden;display:flex;flex-direction:column;align-items:center;text-align:center}
.e{font-family:'JetBrains Mono',monospace;letter-spacing:.2em;font-size:28px;color:#b9b0a0}
.y{font-family:Yellowtail,cursive;color:#D4621B}.c{font-family:'JetBrains Mono',monospace;font-size:22px;color:#b9b0a0}
img{display:block}</style>`;
const story=`${css}<div class="s" style="width:1080px;height:1920px;padding-top:150px;box-sizing:border-box">
<div class="e">DROP 001 · WAITLIST OPEN</div>
<div style="font-size:150px;line-height:.92;margin-top:30px">TROUBLE<br>FINDS ME</div>
<img src="${art}" style="width:820px;margin-top:50px;background:#EDE4CF">
<div class="y" style="font-size:110px;margin-top:20px">Ride the Tiger</div>
<div class="e" style="margin-top:10px">LINK IN BIO · FIRST ACCESS</div>
<div class="c" style="margin-top:24px">Concept artwork. Samples coming.</div></div>`;
const square=`${css}<div class="s" style="width:1080px;height:1080px;justify-content:center;gap:10px">
<div style="font-size:170px;line-height:.9;white-space:nowrap">CHEW GLASS</div><div style="font-size:150px;line-height:.9;white-space:nowrap;color:#C9A227">BREATHE SMOKE</div>
<div class="y" style="font-size:150px">Ride the Tiger</div><div class="e" style="margin-top:30px">TROUBLE FINDS ME · DROP 001</div></div>`;
(async()=>{const b=await chromium.launch();for(const [n,h,w,ht] of [['story_waitlist.png',story,1080,1920],['square_quote.png',square,1080,1080]]){
const p=await b.newPage({viewport:{width:w,height:ht}});await p.setContent(h,{waitUntil:'networkidle'});await p.evaluate(()=>document.fonts.ready);await p.screenshot({path:n});await p.close();}await b.close();console.log('rendered');})();
