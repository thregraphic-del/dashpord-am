const {chromium}=require('playwright');const fs=require('fs');const path=require('path');
const [,,mode,a,b,step]=process.argv;
(async()=>{const br=await chromium.launch();const pg=await br.newPage({viewport:{width:1080,height:1920}});
 const errs=[];pg.on('pageerror',e=>errs.push(e.message));pg.on('console',m=>{if(m.type()=='error')errs.push(m.text())});
 await pg.goto('file://'+path.resolve('ad.html'));await pg.evaluate(()=>window.ready);await pg.waitForTimeout(300);
 if(errs.length)console.log('ERR',errs);
 if(mode=='sfx'){fs.writeFileSync('sfx.json',JSON.stringify(await pg.evaluate(()=>SFX)));}
 else if(mode=='test'){for(const t of a.split(',')){await pg.evaluate(t=>seek(t),+t);await pg.screenshot({path:`test/t_${t}.jpg`,type:'jpeg',quality:80})}}
 else{fs.mkdirSync('frames',{recursive:true});for(let i=+a;i<+b;i++){await pg.evaluate(t=>seek(t),i/30);await pg.screenshot({path:`frames/f${String(i).padStart(5,'0')}.jpg`,type:'jpeg',quality:92})}}
 await br.close()})();
