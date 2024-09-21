//var jimp = require('jimp');
var user_data = require('../data/profile_data.json');

module.exports = {

  name: "battle",
  description: "WIP",
  arguments: ["opponent"],
  isAdmin: false,
  private: true,
  execute(client,message,arguments){

    let opponent = (arguments.length && message.guild.members.has((/\d{1,}/g).exec(arguments[0])[0]))
    ? (/\d{1,}/g).exec(arguments[0])[0]
    : false;

    if(!opponent && opponent!==client.user.id && opponent!==message.author.id){
      message.channel.send("`ERROR: `That is not a valid user. Please tag a user to start a battle.");
      return;
    };

    message.channel.send(`<@${opponent}> ${message.author.username} wants to battle you. `)
    .then((message) => {
      message.react(':yes_icon:594369568961462273');
      message.react(':no_icon:594369553106993153')
      .then(() => {
        message.awaitReactions(
          (reaction, user) => {return user.id == opponent},
          {time: 3000, max: 1, errors: ['time']}
        )
        .then(reaction => console.log(reaction.author.id))
      })
      .catch(error => {console.log(typeof error)})
    })
    return;

    //create battle category
    message.guild.createChannel('battle', 'category', [
      { id: message.guild.defaultRole.id, deny: ['VIEW_CHANNEL'] },
      { id: opponent,allow: ['VIEW_CHANNEL'] }
    ])
    .then(category => {
      //set user channel
      message.guild.createChannel(message.author.username, 'text', [
        { id: message.guild.defaultRole.id, deny: ['VIEW_CHANNEL'] },
        { id: message.author.id, allow: ['VIEW_CHANNEL'] }
      ]).then(channel => channel.setParent(category.id));
      //set opponent channel
      message.guild.createChannel('2', 'text', [
        { id: message.guild.defaultRole.id, deny: ['VIEW_CHANNEL'] },
        { id: opponent, allow: ['VIEW_CHANNEL'] }
      ]).then(channel => channel.setParent(category.id));

    })
    .catch(console.error);
  }
}
