var user_data = require('../data/profile_data.json');
module.exports = {

  name: "give",
  description: "",
  arguments: ["user", "amount"],
  isAsmin: false,
  private: false,
  execute(client,message,arguments){

    //assign user if tagged or not
    var giving_user = {id: message.author.id};
    var receiving_user = {id: (/\d{1,}/g).exec(arguments[0])[0]};
    var amount = +arguments[1];

    //error feedback
    if(!user_data.some(x=>x.user_id==receiving_user.id)){
      message.channel.send("`ERROR` : Not a user or user does not have a profile set. Use command `" + config.prefix + "profile` to set one.");
      return;
    }else if(arguments.length !== 2 || !(/\d/).test(arguments[1])){
      message.channel.send("`ERROR` : Please input an amount an amount following the user name.");
      return;
    }else if(user_data.some(x=>x.user_id==giving_user.id).gold < amount){
      message.channel.send("'ALERT' : You do not have the required amount to give to that user.");
      return;
    };
    //add
    receiving_user.index =  user_data.findIndex(x=>x.user_id==receiving_user.id);
    user_data[receiving_user.index].gold = user_data[receiving_user.index].gold + amount;
    //sub
    giving_user.index =  user_data.findIndex(x=>x.user_id==giving_user.id);
    user_data[giving_user.index].gold = user_data[giving_user.index].gold - amount;
    //save
    fs.writeFile("./src/data/profile_data.json",beautify(user_data, null, 2, 100),(err) => console.error);

    message.channel.send("`" + amount + "`"+ ` <:coin:354195254536306689> has been successfully transferred to **${message.guild.members.get(receiving_user.id).user.username}**`);
  }
}
