module.exports = {

  name: "prefix",
  description: "ADMIN ONLY - Change the prefix used for commands.",
  arguments: ["new_prefix"],
  isAdmin: true,
  private: false,
  execute(client,message,arguments){
    message.reply("Prefix changed to `"+arguments[0]+"`");
    config.prefix = arguments[0];
    fs.writeFile("./config/client_config.json",JSON.stringify(config),(err) => console.error);
  }

}
