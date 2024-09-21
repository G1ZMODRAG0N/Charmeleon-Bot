const got = require('got');
module.exports = {

  name: "yt",
  description: "Search Youtube and post a video relavent to your search term.",
  arguments: ["keyword"],
  isAdmin: false,
  private: false,
  execute(client,message,arguments){
    var q = message.content.slice(config.prefix.length+3).replace(/\s/g, "+");
    got(`https://www.googleapis.com/youtube/v3/search?q=${q}&maxResults=1&part=snippet&key=${auth.youtube_key}`)
    .then(response =>{
      var data = JSON.parse(response.body);
      let video = data.items[0].id.videoId;
      message.channel.send(`https://youtube.com/watch?v=${video}`).then((message)=>message.react('❌'))
    })
    .catch(error =>{
      message.channel.send("`ERROR:` Unable to find a video with that result. Please try again.");
      console.error("[cb] \x1b[31m%s\x1b[0m",error);
    })
  }
};
