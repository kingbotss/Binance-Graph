const {execFile} = require('child_process');
const {promisify} = require('util');
const Puppeteer=require('puppeteer-core');
const fs=require('fs');


(async () => {
    let bcf=fs.readFileSync('browserconnection.txt',{encoding:"utf-8"});

    let browser;
    let status=false;
    try{
     browser=await Puppeteer.connect({browserWSEndpoint:bcf});
     status=true;
    }catch(e){
        console.log("failed to connect browser.");
     }
    if(!status){
        console.log("Launching browser.");
    browser=await Puppeteer.launch({executablePath:GetValidPath(),headless:true,args: ['--ignore-certificate-errors','--no-sandbox','--disable-setuid-sandbox','--disable-accelerated-2d-canvas','--disable-gpu'],userDataDir:'./puppeteer'});
    }
    
    var bdata=browser.wsEndpoint();
    fs.writeFileSync('browserconnection.txt', bdata,{encoding:"utf-8"});
   function GetValidPath(){
    let cp=require('chrome-paths');
    let sfs=fs.existsSync(cp.chrome);
    let sfs2=fs.existsSync(cp.chromium);
    if(sfs)return cp.chrome;
    if(sfs2) return cp.chromium;
    return null;
   } 
  let page=  await browser.newPage();
    await page.goto('http://dramacool.bid',{waitUntil:"networkidle2"});
    await page.screenshot({path:"screen.png"});
 // (await promisify(execFile)(chrome, ['--version'])).stdout; //=> 'Google Chrome 71.0.3578.98 \n'
 await browser.close();
 
})();