module.exports = {

  name: "poll",

  description:
  "Setup a poll. Commas are used as seperators. Up to 8 options. Time must be specified for custom polls. Default timer 15min.  \n**Command format** :" +
  "\ndefault - `" + config.prefix + "poll [title], [time(mins)(optional)]`" +
  "\ncustom - `" + config.prefix + "poll [title], [time(mins)], [option1], [option2], [option...etc]`",

  arguments: ["title", "option"],

  isAdmin: false,
  private: false,

  execute(client,message,arguments){

    let content = (/.,(\d\.\d+|\d+),./g).test(message.content.replace(/\s/g,"")) ?
    message.content.slice(config.prefix.length+5).split(",") ://[title,time(minutes),options.split(",")]
    [
      message.content.slice(config.prefix.length+5),
      isNaN(message.content.slice(config.prefix.length+5).split(",")[1]) ? 15 : message.content.slice(config.prefix.length+5).split(",")[1],//no time specified default: 15min
      "Yes",
      "No"
    ];//[title,time(minutes),option1,option2]

    let emoji = ['1⃣','2⃣','3⃣','4⃣','5⃣','6⃣','7⃣','8⃣','9⃣'];

    if(content.slice(2).length>8){
      message.reply(`ERROR : Poll must not exceed 8 options.`);
      return;
    };

    let options = content.slice(2).map((x,y)=>{return`${emoji[y]} ${x}`});
    emoji = options.map(x=>x.slice(0,2));
    function userEmoji(count){
      let emoji = [];
      for(i=0;i<count;i++)emoji.push(":bust_in_silhouette:");
      if(count==0)emoji.push("NONE");
      return emoji.toString().replace(/\,/g,"");
    };
    function findCount(reactions){
      console.log(reactions)
    }

    message.delete();

    message.channel.send({
      embed: {
        title: `📊 POLL : ${content[0].split(",")[0]}`,
        thumbnail: {url: "attachment://thumbnail.png"},
        color: 16054073,
        footer: {text: `Poll will end in : ${content[1]} min(s).`},
        fields: [
          {
            name: "Options :",
            value: options.toString().replace(/\,/g,"\n\n")
          }
        ]
      }, files: [{
        attachment: "./images/question.png",
        name: "thumbnail.png"
      }]
    })
    .then((message) => {
      options.forEach(function (item,index){message.react(item.slice(0,2))});
      setTimeout(pollEnd=>{
        let results = message.reactions
        .array()
        .filter(x=>emoji.some(y=>y==x._emoji.name))
        .map(
          function (x,y) {
            return {
              count: x.count-1,
              emoji: x._emoji.name,
              users: x.users.array().map(x=>x.username)
            }
          })
          .sort((a,b)=>b.count-a.count)
          console.log(results)
        let result = results.map((x,y)=>`${x.emoji} : ${x.count} user(s)`).toString().replace(/\,/g,"\n\n");
        //let revoked =  message.reactions.array().toString();
        message.channel.send({
          embed: {
            title: `📊 POLL RESULTS for : ${content[0].split(",")[0]}`,
            color: 16054073,
            fields: [
              {
                name: "Options :",
                value: result
              }//,
              // {
              //   name: "Revoked : ",
              //   value: revoked
              // }
            ]
          }
        })
      },content[1]*60000);
    })
    .catch((error) => {
      console.log(error);
      message.delete;
      message.channel.send("`ERROR: `Something went wrong. Please try again...")
    })
  }
};
