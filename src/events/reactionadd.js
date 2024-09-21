var previousMessage;
module.exports = {
  name:'reactionadd',
  execute(client,reaction){
    let emoji = reaction._emoji;
    //message deletion via emoji
    if(emoji.name == '❌' && emoji.reaction.count > 1 && reaction.me){
      //console.log()
      reaction.message.channel.send(`Post deleted by: *${reaction.users.array()[1].username}*. To restore hit the ↪ below.`)
      .then((message) => message.react('↪'));
      previousMessage = [reaction.message.embeds[0]];
      reaction.message.delete();
    } else if(emoji.name == '↪' && emoji.reaction.count > 1 && reaction.me){
      reaction.message.delete();
      reaction.message.channel.send({embed:previousMessage[0]})
      .then((message) => message.react('❌'));
    } else if(reaction.me){return};
    }
}
