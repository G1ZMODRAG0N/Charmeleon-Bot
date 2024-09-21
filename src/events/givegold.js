var guildedMessages = [];
var user_data = require('../data/profile_data.json');
module.exports = {
  name:'givegold',
  execute(client,raw){

    client.guilds.get(raw.d.guild_id).channels.get(raw.d.channel_id).fetchMessage(raw.d.message_id).then(message => {
      var isAuthor = raw.d.user_id == message.author.id;

      if(!user_data.some(x=>x.user_id==message.author.id) && client.guilds.get(raw.d.guild_id).members.has(message.author.id)){
        user_data.push(
          {
            user_id: message.author.id,
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

    if(raw.d.emoji.name == 'coin' && !isAuthor){
      //add user to message collection
      let newUser = guildedMessages.some(x=> x.id == raw.d.user_id && x.messageID == message.id)
      ? false
      : raw.d.user_id;

      if(!newUser){return} else{
        guildedMessages.push({id: raw.d.user_id, messageID: message.id});
        user_data[user_data.findIndex(x=> x.user_id === message.author.id)].gold++;
        fs.writeFile("./src/data/profile_data.json",beautify(user_data, null, 2, 100),(err) => console.error);
      }
    };
    })



}
}
