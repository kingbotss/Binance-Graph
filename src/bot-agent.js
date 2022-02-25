const { IgApiClient } = require('../dist');
const dmFile = require("fs");
const path=require('path');

module.exports = class BotAgent{
    constructor(username, password,proxy) {
        this.client = new IgApiClient();
        this.username = username;
        this.password = password;
        this.proxy=proxy;
    }
    

    async login() {
        try{
            if(this.proxy.length>3){
            this.client.state.proxyUrl=this.proxy;
            }
            await this.client.state.generateDevice(this.username);
            let loggedInAcc;
          
            if(this.fakeExists(this.username)){
              //  console.log(this.fileRead(this.username));
                let data=JSON.parse(this.fileRead(this.username));
                
              this.client.state.customHeaders=data;
              //const user_info = await this.client.user.info(this.client.state.cookieUserId);
               // console.debug(user_info);
             
                loggedInAcc = await this.client.account.login(this.username, this.password);
               // console.log('session will be stored now.');
            }else{
                
               await this.client.simulate.preLoginFlow();
               // console.log('session to be stored now.');
              // await this.client.account
               loggedInAcc = await this.client.account.login(this.username, this.password);
              
               // await this.client.simulate.postLoginFlow();
            }
          
        await this.client.request.end$.subscribe(async () => {
                const serialized = await this.client.request.getDefaultHeaders();
              
               // delete serialized.constants; // this deletes the version info, so you'll always use the version provided by the library
            this.fakeSave(serialized);
          });
         
        //  this.client.request.end$.subscribe(async () => save(await ig.state.serialize()));
            console.log(`${loggedInAcc.username} is logged in!`);
           
           
            return false;
        }
        catch(e){
            console.warn(`${this.username} got an error logging in. ${e}`);
            //console.log(await this.client.);
            return true;
        }
    }
    async setHeaders(){
        let data=JSON.parse(this.fileRead(this.username));    
        this.client.request.setHeaders(data,this.username);
    return data;
    }
    async follow(id){
        await this.client.friendship.show(id); //flow for account follow.
        await this.client.feed.user(id);
        await this.client.highlights.highlightsTray(id);
        await this.client.feed.userStory(id);
        await this.client.friendship.create(id);
    }

    async unfollow(id){
        await this.client.friendship.destroy(id);
    }
    async getFollowings(){
       let list= await this.client.feed.accountFollowing().items();
        return list;
    }
    async loadFeed(){
        let list= await this.client.feed.accountFollowing().items();
         return list;
     }


    async SearchUser(name){
        let list=await this.client.search.users(name);
        return list;
    }
    async getUserFollowers(id){
        let list=await this.client.feed.accountFollowers(id);
        return list;
    }
    async getUserFollowing(id){
        let list=await this.client.feed.accountFollowing(id);
        return list;

    }
    async getFollowers(){
        let list= await this.client.feed.accountFollowers().items();
         return list;
     }
    async getPosts(id){
        const posts=await this.client.feed.user(id).items();
       ///console.log(posts.length);
       return posts[0].id;
     
   
    }
    async comment(str_id,strings){
        await this.client.feed.mediaComments(str_id);
        await this.client.media.checkOffensiveComment(strings,str_id);
        try{
            //@ts-ignore
        await this.client.media.comment({mediaId:str_id,text:strings,moduleInfo:{ module_name: 'feed_contextual_post' }});
        console.log("Comment done.")
        }catch(e){console.log("Error When comment!..")}
       // console.log(cmlog);
    }
    async like(str_id){
        await this.client.media.like({mediaId:str_id,d:0,moduleInfo:{ module_name: "feed_contextual_post" }});
    }
    async dm(id, text){
        const thread = await this.client.entity.directThread([id.toString()]);
        await thread.broadcastText(text);
    }
    async threadid(id){
       // console.log( await this.client.entity.directThread([id.toString()])); //this will writen if already exist
        const thread = await this.client.direct.createGroupThread([id.toString()]);  //returning 500 error
        return {id:thread.thread_id,id2:thread.thread_v2_id}
         //const thread = await this.client.entity.directThread([id.toString()]);
         //await thread.broadcastText(text);
     }
    async ChangeProfile(buffer){
        await this.client.account.changeProfilePicture(buffer);
    }
    async GetMyID(){
        let ids=await this.client.account.currentUser();
        return ids;
    }
    async AddPost(options){
        await this.client.publish.photo(options);
    }

    async register(){

        await this.client.account.create({email:"hotingsspring1221@hotmail.com",
        first_name:"hotspring",password:"Hot12854787$",username:"hotsping_new_latest"});



    }

    fakeSave(data){
        let file=dmFile.writeFile(this.cookiepath+this.username+".json",JSON.stringify(data),{flag:"w"},function(err){
            if(err) throw err;
        })
    }

    fakeExists(username){
        if (dmFile.existsSync(this.cookiepath+username+".json")) {
            return true;
          }
          return false;
    }
    fileRead(username){
      
       let my= dmFile.readFileSync(this.cookiepath+username+".json",{encoding:"utf-8"})
        //console.log("my "+my.toString());
     return my;
    }
    async cookieDir(path){
        this.cookiepath=path+`\\COOKIES\\`;
        if(!dmFile.existsSync(this.cookiepath)){
            dmFile.mkdirSync(this.cookiepath);
        }
    }
    async GetStats(id){
        let stst=await this.client.user.info(id,"profile");
     
        return stst;
    }

}