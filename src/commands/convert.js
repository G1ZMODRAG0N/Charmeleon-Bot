var stops = require('../data/stops.json');
var gyms = require('../data/gyms.json');

module.exports = {

  name: "convert",
  description: "**ADMIN ONLY** - Convert data for any gym or pokestop. Use `convert-stop` for stops, `convert-gym` for gyms.",
  arguments: [],
  isAdmin: true,
  private: true,
  execute(client,message,arguments){
    //define entire message content excluding command and prefix
    let string = message.content.slice(message.content.indexOf(" ") + 1);
    //define which data set to use
    try{var convert = (/stop|gym/i).exec(message.content)[0]=="stop"?stops:gyms;}catch(err){return};
    //data set name
    var convertType = (/stop|gym/i).exec(message.content)[0];

    //loop through array and map total matches
    var totals = convert.map(data => {
      let terms = string.split(/\s/);
      let total = 0;
      for(i=0;i<terms.length;i++){
        if(new RegExp(`(^${terms[i]}| ${terms[i]})`,"ig").test(data.name.replace(/(\)|\()/g,""))){total++};
      };
      return {name: data.name, total: total};
    });

    //find index of highest matched total
    var index = totals.map(x=>+x.total).indexOf(Math.max(...totals.map(x=>+x.total)));
    //sort by highest to least
    var compare = totals.map(x=>+x.total).sort((a,b)=>b-a);

    //if 0 matches were found, return
    if(compare[0]<=0){
      message.reply(`I was unable to find that ${convertType}. Please try again.`);
      return;
      //if 2 or more matches are equal, return list of up to 5 matches
    } else if(compare.slice(1).some(x => x == compare[0])){
      let filtered = totals.slice(1).filter(x => x.total >= compare[0]).map(x=>`🔸${x.name}`);
      message.channel.send("`ALERT:` Looks like there is more than one " + convertType + " associated with your query. Re-type the command with any of the correctly corresponding " + convertType + " names.\n\n" + filtered.slice(0,5).toString().replace(/\,/g,"\n") + "\n\n`This post will be removed in 15 seconds.`")
      .then(message => message.delete(15000));
      return;
    };

    convertType = (/stop/i).test(convertType)?"gym":"stop";

    message.channel.send("✅ Conversion of `" + convert[index].name  + "` to a " + convertType + " successful.");

    //conversion to gym
    if( !(/stop/i).test(convertType)){
      gyms.push(
        convert.filter(x => x.name==convert[index].name)
        .map(x => {return {name: x.name,location: x.location,ex_eligible: false}})[0]
      );
      stops.splice(stops.findIndex(x => x.name==convert[index].name),1);
    } else {
      stops.push(
        convert.filter(x => x.name==convert[index].name)
        .map(x => {return {name: x.name,location: x.location}})[0]
      );
      gyms.splice(gyms.findIndex(x => x.name==convert[index].name),1);
    };

    //save
    fs.writeFile("./src/data/stops.json",beautify(stops, null, 2, 100),(err) => console.error);

    fs.writeFile("./src/data/gyms.json",beautify(gyms, null, 2, 100),(err) => console.error);

    }
}
