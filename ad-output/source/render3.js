const {chromium}=require('playwright');const fs=require('fs');const path=require('path');
const [,,layer,a,b]=process.argv;
(async()=>{const br=await chromium.launch();const pg=await br.newPage({viewport:{width:1080,height:1920}});
 const errs=[];pg.on('pageerror',e=>errs.push(e.message));
 await pg.goto('file://'+path.resolve('ad_v3.html')+'#'+layer);await pg.evaluate(()=>window.ready);await pg.waitForTimeout(300);
 if(errs.length)console.log('ERR',errs);
 const out='L_'+layer;fs.mkdirSync(out,{recursive:true});const rects={};
 for(let i=+a;i<+b;i++){await pg.evaluate(t=>seek(t),i/30);
  if(layer=='bg'){rects[i]=await pg.evaluate(()=>pupRects());await pg.screenshot({path:`${out}/f${String(i).padStart(5,'0')}.jpg`,type:'jpeg',quality:92})}
  else await pg.screenshot({path:`${out}/f${String(i).padStart(5,'0')}.png`,omitBackground:true})}
 if(layer=='bg')fs.writeFileSync(`rects_${a}.json`,JSON.stringify(rects));
 if(layer=='sfx')0;
 await br.close()})();
