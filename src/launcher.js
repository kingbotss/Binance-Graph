/*var spawn = require('child_process').spawn;
spawn('node', ['bgService.js'], {
    detached: true
});
*/

const puppeteer = require('puppeteer');
        //const StealthPlugin = require('puppeteer-extra-plugin-stealth');
      //  console.log(StealthPlugin());
//puppeteer.use(StealthPlugin());
       // let cpath=this.command.question("Paste Chrome Location\n")
  (async()=>{     let browser= await puppeteer.launch({
            headless: false, //Headless
            args: ['--no-sandbox']
           // executablePath:cpath//'C:/Program Files/Google/Chrome/Application/chrome.exe'
          
        });
        console.log(browser._connection.url());
      })()