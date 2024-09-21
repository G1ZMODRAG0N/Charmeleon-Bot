var stops = require('../data/stops.json');
var gyms = require('../data/gyms.json');

module.exports = {

  name: "add",
  description: "**ADMIN ONLY** - Add data for any gym or pokestop.\n**Command format**  `" +
  config.prefix + "add-stop/gym [name], [coordinates (including the comma)]`",
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
    //split inputs
    var input = string.split(/\,/g).map(x=>x.trim());

    if(input.length<3){
      message.channel.send("`ERROR :` Please provide a location coordinates for your second input.");
      return;
    }else if(edit.some(x=>x.name.toLowerCase()==string.toLowerCase())){// FIX THIS NOT WORKING ELLIOTESDFGSA GT#@%$!@%@#
      message.reply(`Sorry it looks like that ${editName} already exists.` + " Please use the `edit` command to make changes to that entry.");
      return;
    }else if(!(/(^[-+]?([1-8]?\d(\.\d+)?|90(\.0+)?),\s*[-+]?(180(\.0+)?|((1[0-7]\d)|([1-9]?\d))(\.\d+)?)$)/i).test(`${input[1]},${input[2]}`)){
      message.channel.send("`ERROR :` Please input coordinates only.");
      return;
    };

    let location =  `http://maps.google.com/maps?q=${input[1]},${input[2]}`;

    let newData = editName=="stop"?{name: input[0],location: location}:{name: input[0],location: location,ex_eligible: false};
    edit.push(newData);
    fs.writeFile(`./src/data/${editName}s.json`,beautify(edit, null, 2, 100),(err) => console.error);

    message.channel.send("✅ `" + newData.name + "` : Has been successfully added.");
  }

}
