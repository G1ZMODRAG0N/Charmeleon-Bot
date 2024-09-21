module.exports = {

  name: "coinflip",
  description: "Flip a coin, heads or tails.",
  arguments: [],
  isAdmin: false,
  private: false,
  execute(client,message,arguments){
    let outcome = Math.round(Math.random()*1) ? "heads" : "tails";
    message.channel.send({
      embed:{
        color:12582912,
        image:{url:'attachment://file.png'}},
        files:[{attachment:'./images/coin_'+outcome+'.png',name:'file.png'}]
      })
    .catch((error)=>console.log("ERROR retrieving file: "+error));
  }
}
