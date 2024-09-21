var user_data = require('../data/profile_data.json');

module.exports = {

  name: "profile",
  description: "",
  arguments: [],
  isAdmin: false,
  private: true,
  execute(client,message,arguments){
    if(!user_data.some(x=>x.user_id==message.author.id)){
      user_data.push(
        {
          user_id: user_id,
          gold: 0,
          health: 100,
          max_health: 100,
          level: 1,
          exp: 0,
          max_exp: 1000,
          items: [],
          atk: 10,
          atk_multiplier: 1,
          def: 10,
          def_multiplier: 1,
          agi: 10,
          agi_multiplier: 1,
          level_up_points: 0
        }
      );
      fs.writeFile("./src/data/profile_data.json",beautify(user_data, null, 2, 100),(err) => console.error);
    };
    var user = user_data.find(x=>x.user_id==message.author.id);
    user.image = message.author.avatarURL;
    user.name = message.author.username;
    var healthBar = [];
    for(i=0;i<Math.ceil(user.health/2);i++){
      healthBar.push('l');
    };
    message.channel.send({
      embed:{
        thumbnail: {url:user.image},
        title: `${user.name} (lvl ${user.level})`,
        fields: [
          {name: `**${healthBar.toString().replace(/\,/g,"")}**`, value: `❤ HP ${user.health} / ${user.max_health}`},
          {name: `----------------------`, value: `STATS : `},
          {name: `⚔ Attack`, value: `${user.atk}`},
          {name: `🛡 Defense`, value: `${user.def}`},
          {name: `⏩ Agility`, value: `${user.agi}`},
          {name: `⚙ Stat Points : `, value: `${user.level_up_points}`}
        ],
        footer: {text: `${user.exp} / ${user.max_exp} EXP until (lvl ${user.level+1})`}
      }
    });
  }
}
