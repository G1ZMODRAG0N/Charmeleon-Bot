var user_data = require('../data/profile_data.json');
module.exports = {

  name: "gold",
  description: "Check current gold amount.",
  arguments: [],
  isAsmin: false,
  private: false,
  execute(client,message,arguments){

    //assign user if tagged or not
    var user_id = (arguments.length && message.guild.members.has((/\d{1,}/g).exec(arguments[0])[0]))
    ? (/\d{1,}/g).exec(arguments[0])[0]
    : message.author.id;

    if(!user_data.some(x=>x.user_id==user_id) && message.guild.members.has(user_id)){
      message.channel.send("`ERROR` : Not a user or user does not have a profile set. Use command `" + config.prefix + "profile` to set one.");
      return;
    };

    let gold_amount =  user_data.find(x=>x.user_id==user_id).gold;

    function getImage(amount){
      if(amount<=25){return "small"}else
      if(amount<=50){return "medium"}else
      if(amount<=75){return "large"}else{return "bag"};
    };

    let user_name
    = message.mentions.users.get(user_id)
    && message.mentions.users.get(user_id).username
    || message.author.username;

    if(user_id!==message.author.id){
      message.channel.send({
        embed:{
          color:12582912,
          title:"**" + user_name + "'s** gold amount is : `"+gold_amount+"`",
          thumbnail:{url:'attachment://file.png'}
        },files:[{attachment:'./images/coin_'+getImage(gold_amount)+'.png',name:'file.png'}]
      });
    }else{
      message.channel.send({
        embed:{
          color:12582912,
          title:"Your current gold amount is : `"+gold_amount+"`",
          thumbnail:{url:'attachment://file.png'}
        },files:[{attachment:'./images/coin_'+getImage(gold_amount)+'.png',name:'file.png'}]
      });
    };

  }
}
