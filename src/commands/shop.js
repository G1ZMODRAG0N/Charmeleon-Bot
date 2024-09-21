var user_data = require('../data/profile_data.json');

module.exports = {

  name: "shop",
  description: "",
  arguments: [],
  isAdmin: false,
  private: true,
  execute(client,message,arguments){
    var user = user_data.find(x=>x.user_id==message.author.id);

    message.channel.send({
      embed:{
        thumbnail: {url:'attachment://icon.png'},
        title: `Shop`,
        fields: [
          {name: `Weapons`, value: `words`},
          {name: `Boosts`, value: `words`},
          {name: `Items`, value: `words`}
        ],
        footer: {text: `- ${user.gold} 💰 -`}
      }
    , files: [
      {attachment: "./images/shop_icon.png", name: "icon.png"}
    ]
  }
);
  }
}
