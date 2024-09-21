const got = require('got');
module.exports = {

  name: "gif",
  description: "Search Tenor and post a gif relavent to your search term.",
  arguments: ["keyword"],
  isAdmin: false,
  private: false,
  execute(client,message,arguments){
    var q = message.content.slice(config.prefix.length+3).replace(/\s/g, "+");
    got(`https://api.tenor.com/v1/search?q=${q}&key=${auth.tenor_key}&limit=10&locale=en_US&media_filter=minimal&safesearch=moderate`)
    .then(response =>{
      var data = JSON.parse(response.body);
      //console.log(data.results[Math.floor(0+Math.random()*5)].media[0].gif.url)
      let gif = data.results.length ? data.results[Math.floor(0+Math.random()*5)].media[0].gif.url : "`ERROR:` No gif found for: `" + q + "`";
      message.channel.send({embed:{image:{url:gif}}}).then((message)=>message.react('❌'))
      //console.log(Math.floor(0+Math.random()*5))
    })
    .catch(error =>{
      message.channel.send("`ERROR:` There was an issue getting that gif. Please try again.");
      console.error("[cb] \x1b[31m%s\x1b[0m",error);
    })
  }
};
