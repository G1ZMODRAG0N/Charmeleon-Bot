const gyms = require('../data/gyms.json');
const stops = require('../data/stops.json');

module.exports = {

  gymLookup: function (message){
    var string;
    if(message.content.startsWith(config.prefix)){
      string = message.content.slice(config.prefix.length + 4).trim().toLowerCase();
    } else {string = message.content.trim().toLowerCase()};

    function mapURL(location){
      return `https://maps.googleapis.com/maps/api/staticmap?center=${location}&zoom=18&size=350x170&maptype=roadmap&markers=color:red%7C${location}&key=${auth.google_key}`;
    };

    var totals = gyms.map(gym => {
      let terms = string.split(/\s/);
      let total = 0;
      for(i=0;i<terms.length;i++){
        if(new RegExp(`(^${terms[i]}| ${terms[i]})`,"ig").test(gym.name)){total++};///<<<make this a try catch?
      };
      let mapped = gym.name.toLowerCase() == string.toLowerCase()?{name: gym.name, total: 100}:{name: gym.name, total: total}
      return mapped;
    });

    var gym = gyms[totals.map(x=>+x.total).indexOf(Math.max(...totals.map(x=>+x.total)))];
    var coords = gym.location.slice(gym.location.indexOf("3"));
    var compare = totals.map(x=>+x.total).sort((a,b)=>b-a);
    var ex = gym.ex_eligible ? "<:ex:440205423572680705>" : ""

    if(compare[0]<=0){
      message.reply("I was unable to find that gym. Please try again.");
      return;
    } else if(compare.slice(1).some(x => x == compare[0])){
      let filtered = totals.slice(1).filter(x => x.total >= compare[0]).map(x=>`🔸${x.name}`);
      message.channel.send("`ALERT:` Looks like there is more than one gym with that result. Re-type the command with any of the correctly corresponding gym names.\n\n" + filtered.slice(0,5).toString().replace(/\,/g,"\n") + "\n\n`This post will be removed in 15 seconds.`")
      .then(message => message.delete(15000));
      return;
    };

    message.channel.send({
      embed: {
        title: `${ex}GYM : ${gym.name} \n(${coords})`,
      thumbnail: {url: "attachment://thumbnail.png"},
      image: {url: mapURL(coords)},
      color: 16733184,
      footer: {text: `If this gym is incorrect please hit the ❌ below.`},
      description: `[CLICK HERE FOR DIRECTIONS](${gym.location})`
    }, files: [
      {attachment: "./images/gym_icon.png", name: "thumbnail.png"}
    ]
  })
  .then((message) =>message.react('❌'));

},

stopLookup: function (message){
  var string;
  if(message.content.startsWith(config.prefix)){
    string = message.content.slice(config.prefix.length + 4).trim().toLowerCase();
  } else {string = message.content.trim().toLowerCase()};
  let terms = string.split(/\s/);

  function mapURL(location){
    return `https://maps.googleapis.com/maps/api/staticmap?center=${location}&zoom=18&size=350x170&maptype=roadmap&markers=color:red%7C${location}&key=${auth.google_key}`;
  };

  var totals = stops.map(stop => {
    let total = 0;
    let result;
    for(i=0;i<terms.length;i++){
      if(new RegExp(`(^${terms[i]}| ${terms[i]})`,"ig").test(stop.name.replace(/(\)|\()/g,""))){total++};
    };
    if(stop.name.toLowerCase() == string){
      result = {name: stop.name, total: 99};
    }else{result = {name: stop.name, total: total}};
    return result;
  });

  var stop = stops[totals.map(x=>+x.total).indexOf(Math.max(...totals.map(x=>+x.total)))];
  var coords = stop.location.slice(stop.location.indexOf("3"));
  var compare = totals.map(x=>+x.total).sort((a,b)=>b-a);

  if(compare[0]<=0){
    message.reply("I was unable to find that stop. Please try again.");
    return;
  } else if(compare.slice(1).some(x => x == compare[0])){
    let filtered = totals.slice(1).filter(x => x.total >= compare[0]).map(x=>`🔸${x.name}`);
    message.channel.send("`ALERT:` Looks like there is more than one stop with that result. Re-type the command with any of the correctly corresponding stop names.\n\n" + filtered.slice(0,5).toString().replace(/\,/g,"\n"))
    //.then(message => message.delete(15000));
    return;
  };

  message.channel.send({
    embed: {
      title: `POKESTOP : ${stop.name} \n(${coords})`,
    thumbnail: {url: "attachment://thumbnail.png"},
    image: {url: mapURL(coords)},
    color: 45055,
    footer: {text: `If this stop is incorrect please hit the ❌ below.`},
    description: `[CLICK HERE FOR DIRECTIONS](${stop.location})`
  }, files: [
    {attachment: "./images/stop_icon.png", name: "thumbnail.png"}
  ]
})
.then((message) =>message.react('❌'));

  }
}
