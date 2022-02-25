class BotService {
    constructor(){
        this.agents=[];
        this.index=0;
    }
 
    async follow(id){
        try{
            await this.agents[this.index].follow(id);
        }
        catch(e){}
    }

    async dm(id, text){
        try{
            await this.agents[this.index].dm(id, text);
        }
        catch(e){}
    }

    addAgent(client){
        this.agents.push(client);
    }
}

module.exports=BotService;