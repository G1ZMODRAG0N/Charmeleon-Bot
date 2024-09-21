module.exports = {

  name: "dice",
  description: "Roll the dice. Roll additional dice by placing a number after the command.",
  arguments: [],
  isAdmin: false,
  private: false,
  execute(client,message,arguments){
    let outcome = Math.round(1+Math.random()*6);
    let image;
    message.channel.send({
      embed:{
        color:12582912,
        image:{url:'attachment://file.png'}
      },files:[{attachment:'./images/dice_'+outcome+'.png',name:'file.png'}]})
    .catch((error)=>console.log("ERROR retrieving file: "+error));
  }
}
