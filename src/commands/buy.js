var user_data = require('../data/profile_data.json');
module.exports = {

  name: "give",
  description: "",
  arguments: ["item"],
  isAsmin: false,
  private: true,
  execute(client,message,arguments){

    //assign user if tagged or not
    var user_id = {id: message.author.id};
    var item =

    //
    if(!user_data.some(x=>x.user_id==user_id.id)){
      message.channel.send("`ERROR` : Not a user or user does not have a profile set. Use command `" + config.prefix + "profile` to set one.");
      return;
    }else if(arguments.length !== 1 || !(/\d/).test(arguments[1])){
      message.channel.send("`ERROR` : Please input a correct item available in the shop. To see whats available use command `" + config.prefix + "shop`.");
      return;
    }else if(user_data.some(x=>x.user_id==giving_user.id).gold < amount){
      message.channel.send("'ALERT' : You do not have the required amount to give to that user.");
      return;
    };
    //sub
    giving_user.index =  user_data.findIndex(x=>x.user_id==giving_user.id);
    user_data[giving_user.index].gold = user_data[giving_user.index].gold - amount;
    //save
    fs.writeFile("./src/data/profile_data.json",beautify(user_data, null, 2, 100),(err) => console.error);

    message.channel.send("`" + amount + "`"+ ` <:coin:354195254536306689> has been successfully transferred to **${message.guild.members.get(receiving_user.id).user.username}**`);
  }
}
