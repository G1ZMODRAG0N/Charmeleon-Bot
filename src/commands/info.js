module.exports = {

  name: "info",
  description: "Current discord status and up time:",
  arguments: [],
  isAdmin: false,
  private: false,
  execute(client,message,arguments){
    message.channel.send({
      embed:{
        title: "STATUS",
        thumbnail: {url: message.channel.guild.iconURL},
        color: 12582912,
        fields: [
          {
            name: "Bot Ping :",
            value: "`" + client.ping.toFixed(0) + "ms`"
          },
          {
            name: "Uptime :",
            value: "`" + Math.round(client.uptime/60000) + " m " + Math.round(client.uptime/1000) + " s`"
          },
          {
            name: "Servers : ",
            value: client.guilds.array().length
          },
          {
            name: "This Server :",
            value: "`" + message.channel.guild.name + "`"
          },
          {
            name: "Server Members :",
            value: "`" + message.channel.guild.memberCount + "`"
          },
          {
            name: "Server Owner :",
            value: message.channel.guild.owner.user.username
          },
          {
            name: "Admin Roles :",
            value: message.channel.guild.roles.filter(x=>x.hasPermission('ADMINISTRATOR')).array().toString().replace(/\,/g,"\n")
          }
        ]
      }//, files: [{}]
    }
    );
  }

}
