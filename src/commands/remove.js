var stops = require('../data/stops.json');
var gyms = require('../data/gyms.json');

module.exports = {

  name: "remove",
  description: "**ADMIN ONLY** - Remove data for any gym or pokestop.\n**Command format**  `" +
  config.prefix + "remove-stop/gym [exact name]`",
  arguments: [],
  isAdmin: true,
  private: true,
  execute(client,message,arguments){

    //define entire message content excluding command and prefix
    let string = message.content.slice(message.content.indexOf(" ") + 1);
    //define which data set to use
    try{var edit = (/stop|gym/i).exec(message.content)[0]=="stop"?stops:gyms;}catch(err){return};
    //data set name
    var editName = (/stop|gym/i).exec(message.content)[0].toLowerCase();

    var index = edit.findIndex(x=>x.name.toLowerCase()==string.toLowerCase());

    if(index==-1){
      message.channel.send("`ERROR :` Unable to find the requested entry. Please be sure you are inputting the *exact* entry name.");
      return;
    };

    var user = message.author.id;

    message.channel.send("`- REMOVAL MODE -`\n\n" + `Are you sure you want to delete that ${editName}? ` + "Respond with `yes` or `no`.")
    .then((message)=>{


      message.channel.awaitMessages(message => {
        return (/(^yes|^no)/i).test(message.content) && message.author.id == user;
      }, {max:1,time:30000,errors:'time'})
      .then(collected => {
        if(!(/^yes/i).test(collected.array()[0].content)){
          message.channel.send("`REMOVAL CANCELLED`");
          return
        }else{
          message.channel.send("✅ `" + edit[index].name + "` : Has been successfully removed.");
          edit.splice(index,1);
          fs.writeFile(`./src/data/${editName}s.json`,beautify(edit, null, 2, 100),(err) => console.error);
        };
      })
      .catch(err=>console.error(err));


    })
    .catch(err=>console.error(err));

  }

}
