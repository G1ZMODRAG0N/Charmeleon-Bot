module.exports = {

  name: "help",
  description:
  "Get help and information for commands. Add a command name to call individual help text. \n**Command format** : `" +
  config.prefix+"help [command name(opt)]`",
  arguments: [],
  isAdmin: false,
  private: false,
  execute(client,message,arguments){
    var help_listing = client.commands.array().filter(x=>!x.private).map(x=>{return "\n🔸`"+x.name+ "` - "+x.description}).toString().replace(/\,/g,"")
    //console.log(client.commands.array());
    if(arguments.length && client.commands.array().some(x=>x.name==arguments[0])){
      var command = client.commands.get(arguments[0]);
      message.channel.send("`ABOUT THIS COMMAND : `\n\n`" + command.name + "` - " + command.description);
    }else{
      message.reply("Check your DMs. 📬")
      message.author.send("\n**COMMANDS:**\n"+help_listing);
    };
    //message.delete(1000);
  }
}
