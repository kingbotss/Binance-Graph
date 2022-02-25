require('@electron/remote/main').initialize();
const { app, BrowserWindow,dialog,ipcMain} =require('electron');
app.commandLine.appendSwitch('disable-site-isolation-trials');
const cp=require('child_process');
const path=require('path');
  const fs = require('fs');
  const API=require('axios').default;
  const Store=require('./store');
  const store = new Store({
    configName: 'user-preferences',
    defaults: {}
  });
  

  //const puppeteer=require('puppeteer-core');

/*cp.exec('start chrome.exe --remote-debugging-port=15999 --headless',(error)=>{
  if(error) throw error;
});*/
  async function DI(url,filename){
    var data= await API.get(url,{responseType: "arraybuffer"});
    //const buffer = Buffer.from(data.data, 'binary');
    console.log("downloaded\n");
    if(!fs.existsSync(`${__dirname}/images`)) fs.mkdirSync(`${__dirname}/images`);
    fs.writeFileSync(`${__dirname}/images/`+filename,data.data,{encoding: null});
  
  }

  const BotAgent = require('./bot-agent');
  //const BotService=require('./bot-service');
  const botManager=require('./bot-service');
  let botAccount;
  const logged=[];
  var util = require('util');
const { error } = require('console');
  var logFile = fs.createWriteStream('log.txt', { flags: 'w' });
    // Or 'w' to truncate the file every time the process starts.
  var logStdout = process.stdout;
  console.log = function () {
    logFile.write(util.format.apply(null, arguments) + '\n');
    logStdout.write(util.format.apply(null, arguments) + '\n');
  }
  console.error = console.log;
let accounts=null;
let comments=null;
let tags=null;
let account=null;
async function test(data) {
 // cp.exec('start chrome --remote-debugging-port=9222');
 account={user:data[0],pass:data[1],proxy:data[2]};
let bot=new BotAgent(data[0],data[1],data[2]);
try{
  await bot.cookieDir(app.getPath("appData"));
let agent=await bot.login();
if(agent){
 mainWindow.webContents.send('loginfailed');
  return false;
}else{
  store.set('username',account.user);

  mainWindow.webContents.send('loginsuccess');
//let posts=await bot.getPosts("6005164655");

  botAccount=bot;
let it=await bot.GetMyID();
  store.set('islogged',true);
let profile=await bot.GetStats(it.pk);
let image=await DI(profile.hd_profile_pic_url_info.url,it.pk+'.jpg');
mainWindow.loadURL(`file://${__dirname}/stats.html`);
mainWindow.webContents.send('accountdata',profile);
let list=await bot.getFollowers();
mainWindow.webContents.send('accountfollowers',list);

let list1=await bot.getFollowings();
mainWindow.webContents.send('accountfollowing',list1);
}
}catch(e){
console.log("Error "+e);
}

}

async function CheckLogin(){
        let primary={user:store.get('username'),pass:store.get('password'),proxy:store.get('proxy')}
        let bot=new BotAgent(primary.user,primary.pass,primary.proxy);
      let login=false;
      let he;
        try{ 
        try{ await bot.cookieDir(app.getPath('appData'));
      
        await bot.setHeaders();}catch(e){console.log(e);return false;} console.log('Check login2');

        await bot.client.feed.accountFollowers();
      }catch(e){console.log('login failed with headers'); 
    }
        return bot?bot:login;
}
// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit();
}

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

const createWindow = () => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true, // is default value after Electron v5
      contextIsolation: false, // protect against prototype pollution
     enableRemoteModule: true, // turn off remote
   //  preload: path.join(__dirname, "renderer.js") // use a preload script
    }

  });
  mainWindow.setMenuBarVisibility(false);
  // and load the index.html of the app.
  mainWindow.loadURL(`file://${__dirname}/index.html`);


  // Open the DevTools.
  mainWindow.webContents.openDevTools();


  // Emitted when the window is closed.
  mainWindow.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });
  mainWindow.webContents.on("did-finish-load", () => { 

  });

};

async function showerrodialog(str){
 dialog.showErrorBox("Error Occured",str);
}


ipcMain.on('click', (event,args) => {
  //console.log(args.data);
  let data=args.data;
 Start();
async function Start(){
 await test(data);
}
});

ipcMain.on('searchuser',async (event,args)=>{
let bota=await CheckLogin();
if(!bota){
  
  mainWindow.loadURL(`file://${__dirname}/index.html`);
  console.log('searchuser called');
  store.set('islogged',false);
}else{
console.log(await bota.getFollowings());
}
})

async function MultiStart(){

  let errorAgents = 0;

  accounts.forEach(async agentCredential => {
      const agent = new BotAgent(agentCredential.user, agentCredential.pass,agentCredential.proxy);
      if(await agent.login()){
          errorAgents++;
      }
      else {
        if(!logged.indexOf(agentCredential.user)){
        botAccount.push(agent);
        logged.push(agentCredential.user);
        }
        
      }
  })

  while(botAccount.length < accounts.length - errorAgents){
      await new Promise(_ => setInterval(_, 1000));
  }

console.log(botAccount);


}



ipcMain.on("multipleaccounts",(event,args)=>{
  console.log(args.data);
  accounts=args.data;
  MultiStart();
});

ipcMain.on("multiplecomments",(event,args)=>{
  console.log(args.data);
  comments=args.data;
});

ipcMain.on("multipletags",(event,args)=>{
  console.log(args.data);
  tags=args.data;
});
// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
 // cp.spawn('taskkill /IM /F chrome.exe',{shell:true});
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
    mainWindow.reload();
  }
});
global.app=app;
// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
