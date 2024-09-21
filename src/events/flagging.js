module.exports = {
  name:'flagging',
  execute(client,reaction){
    if (reaction.get('❌').count > 1){
      reaction.message.delete()
    }
    }
}
