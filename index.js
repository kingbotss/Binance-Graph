const fs = require('fs');
const axios = require('axios');
const urlFile = new (require('./src/util/file'))('locations.json');
const dmRecordFile = new (require('./src/util/file'))('dmrecord.json');
const BotService = require('./src/bot-service');
const BotAgent = require('./src/bot-agent');
const botManager = new BotService();

const DMS_PER_HOUR = 55;
const SITES_ASYNC = 30;
const DELAY=6;
(async() => {
    let pages;

    const agentCredentials = fs.readFileSync('agents.txt', 'utf-8').split('\n').map(c => {
        var str=c.split(':')[1];
        var n = str.indexOf("#");
       // console.log(n);
        let password;
        let proxy;
        if(n>1){
       proxy= c.split('#')[1].replace('\r',""); 
        password=c.split(':')[1].substr(0,n);
        }else{
            password=c.split(':')[1].replace('\r',"");
           proxy="";  
        }

        return {
            username: c.split(':')[0],
            password: password,
            proxy:proxy
        }
    });


console.log(agentCredentials.length+" No. of Accounts Given. ");
  /*  setImmediate(async () => {
        const browser = await puppeteer.launch({
        //headless:false
        });
        const page = (await browser.pages())[0]
        await page.setUserAgent('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Safari/537.36');
        for(let i = 0; i < SITES_ASYNC - 1; i++){
            const newPage = await browser.newPage();
            await newPage.setUserAgent('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Safari/537.36');
        }

        pages = await browser.pages();
    });
	*/

    let errorAgents = 0;

    agentCredentials.forEach(async agentCredential => {
        const agent = new BotAgent(agentCredential.username, agentCredential.password,agentCredential.proxy);
        if(await agent.login()){
            errorAgents++;
        }
        else {
            botManager.addAgent(agent);
        }
    })

    const locationURLs = urlFile.read();

    while(botManager.agents.length < agentCredentials.length - errorAgents){
        await new Promise(_ => setInterval(_, 1000));
    }

    console.log(`Starting with ${botManager.agents.length} agents.`);

  })()