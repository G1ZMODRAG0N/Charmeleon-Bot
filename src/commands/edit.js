var stops = require('../data/stops.json');
var gyms = require('../data/gyms.json');

module.exports = {

  name: "edit",
  description: "**ADMIN ONLY** - Edit data for any gym or pokestop. Use `edit-stop [stop name]` for stops, `edit-gym [gym name]` for gyms.",
  arguments: [],
  isAdmin: true,
  private: true,
  execute(client,message,arguments){
    //define entire message content excluding command and prefix
    let string = message.content.slice(message.content.indexOf(" ") + 1);
    //define which data set to use
    try{var edit = (/stop|gym/i).exec(message.content)[0]=="stop"?stops:gyms;}catch(err){return};
    //data set name
    var editName = (/stop|gym/i).exec(message.content)[0];

    //loop through array and map total matches
    var totals = edit.map(data => {
      let terms = string.split(/\s/);
      let total = 0;
      for(i=0;i<terms.length;i++){
        if(new RegExp(`(^${terms[i]}| ${terms[i]})`,"ig").test(data.name.replace(/(\)|\()/g,""))){total++};
      };
      return {name: data.name, total: total};
    });

    //find index of highest matched total
    var data = edit[totals.map(x=>+x.total).indexOf(Math.max(...totals.map(x=>+x.total)))];
    //sort by highest to least
    var compare = totals.map(x=>+x.total).sort((a,b)=>b-a);

    //if 0 matches were found, return
    if(compare[0]<=0){
      message.reply(`I was unable to find that ${editName}. Please try again.`);
      return;
      //if 2 or more matches are equal, return list of up to 5 matches
    } else if(compare.slice(1).some(x => x == compare[0])){
      let filtered = totals.slice(1).filter(x => x.total >= compare[0]).map(x=>`🔸${x.name}`);
      message.channel.send("`ALERT:` Looks like there is more than one " + editName + " associated with your query. Re-type the command with any of the correctly corresponding " + editName + " names.\n\n" + filtered.slice(0,5).toString().replace(/\,/g,"\n") + "\n\n`This post will be removed in 15 seconds.`")
      .then(message => message.delete(15000));
      return;
    };

    //set new data array
    var newData =[];
    var user = message.author.id;

    function isCancelled(){
      if(newData.some(x=>(/cancel/i).test(x))){
        message.channel.send("`- EDIT CANCELLED - `");
      };
      return newData.some(x=>(/cancel/i).test(x));
    };

    function userInput(message,input){
      let filter;
      let cancelled = (/^cancel/i).test(message.content);
      if(user!==message.author.id){
        filter = false;
      }else if(input == "location" && !cancelled && !(/(^[-+]?([1-8]?\d(\.\d+)?|90(\.0+)?),\s*[-+]?(180(\.0+)?|((1[0-7]\d)|([1-9]?\d))(\.\d+)?)$)/i).test(message.content)){
        message.channel.send("`ERROR :` Please input coordinates only.");
        filter = false;
      }else if(input == "ex" && !cancelled && !(/(^true|^false)/i).test(message.content)){
        message.channel.send("`ERROR :` Please input TRUE or FALSE only.");
        filter = false;
      }else{
        newData.push(message.content);
        filter = true;
      };
      return filter;
    };

    message.channel.send("`- EDIT MODE -`\n\nWhat is the new name for : `" + data.name + "`\nTo cancel type `cancel`.");

    message.channel.awaitMessages(message => {return userInput(message,"name")}, {max:1,time:30000,errors:'time'})
    .then(collected => {
      if(isCancelled())return;
      message.channel.send("`- EDIT MODE -`\n✅ Input accepted.\n\nWhat is the location? (Coordinates only)\nTo cancel type `cancel`.");
      message.channel.awaitMessages(message => {return userInput(message,"location")},{max:1,time:30000,errors:'time'})
      .then(collected => {
        if(isCancelled())return;
        if((/gym/i).test(editName)){
          message.channel.send("`- EDIT MODE -`\n✅ Input accepted.\n\nIs this gym EX-eligible? (TRUE or FALSE)\nTo cancel type `cancel`.");
          message.channel.awaitMessages(message => {return userInput(message,"ex")},{max:1,time:30000,errors:'time'})
          .then(collected => {
            if(isCancelled())return;
            message.channel.send("\n✅ Input accepted, changes applied.");
            edit.splice(edit.findIndex(x=>x.name==data.name),1,{name: newData[0],location: `http://maps.google.com/maps?q=${newData[1]}`, ex_eligible: newData[2]});

            fs.writeFile("./src/data/gyms.json",beautify(edit, null, 2, 100),(err) => console.error);
          })
          .catch(e => console.log(e));
        }else{
          edit.splice(edit.findIndex(x=>x.name==data.name),1,{name: newData[0],location: `http://maps.google.com/maps?q=${newData[1]}`});

          fs.writeFile("./src/data/stops.json",beautify(edit, null, 2, 100),(err) => console.error);
          console.log(newData);
        }
      })
      .catch(e => console.log(e));

    })
    .catch(e => console.log(e));
    }
}
