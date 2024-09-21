//load globals
fs = require('fs');
beautify = require('json-beautify');
config = require('./config/client_config.json');

//load dependencies
const Discord = require('discord.js');
//client creation
client = new Discord.Client();
//create a collection for all commands
client.commands = new Discord.Collection();
//create a collection for all events
client.events = new Discord.Collection();
//load authorization file
auth = require('./config/auth.json');

//read all files in /commands ending in .js
const commandFiles = fs.readdirSync('./src/commands').filter(file=>file.endsWith(".js"));
//read all files in /events ending in .js
const eventFiles = fs.readdirSync('./src/events').filter(file=>file.endsWith(".js"));
//load guild data
const guildData = require('./src/data/guild_data.json');

//load command files
console.log("\x1b[0m%s\x1b[0m","[cb] Starting Charmeleon Bot...\n\n[cb] Loading command files...");

//laod command files
for(const file of commandFiles) {
  //console.log("Loading '"+file+"'...")
  try{
    const command = require(`./src/commands/${file}`);
    //set the command name and function
    client.commands.set(command.name, command);
    //console.log("Success")
  }catch(error){
    console.error("[cb] \x1b[31m%s\x1b[0m",`Failed: '${file}' failed to load`);
    console.error("\n\n\x1b[31m",error,"\n\n\x1b[0m");
    continue;
  }
};
console.log("[cb]\x1b[32m Loaded!\x1b[0m\n\n[cb] Loading event files...");

//load event files
for(const file of eventFiles){
  try{
    const events = require(`./src/events/${file}`);
    client.events.set(events.name, events)
  }catch(error){
    console.error("[cb] \x1b[31m%s\x1b[0m",`Failed: '${file}' failed to load`);
    console.error("\n\n\x1b[31m",error,"\n\n\x1b[0m");
    continue;
  }
};
console.log("\x1b[0m[cb]\x1b[32m Loaded!\x1b[0m");

//discord error log
client.on("error", error => {console.log(`Discord error:\n- ${error.message}`)});
//reconnecting log
client.on("reconnecting", reconnecting => {console.log(`Reconnecting...`)});
//reconnecting log
client.on("disconnect", disconnect => {
  console.log(disconnect);
  return;
});
//reconnected log
client.on("resume", resume => {console.log("[cb] \x1b[32m%s\x1b[0m","\nConnection successful! Session resumed...")});

//client login attempt
client.login(auth.token)
 .then(()=>{
   console.log("\n\x1b[0m[cb] Last login: " + new Date(client.readyAt).toLocaleDateString() + " " + new Date(client.readyAt).toLocaleTimeString());
   console.log("\n\x1b[0m[cb] Logging in...");
 })
 .catch(error=>{console.error("[cb] \x1b[31m%s\x1b[0m",`Error: failed to log in...\n- ${error.message}`)});

//client is ready
client.on("ready", ready => {
  console.log("\x1b[0m[cb]\x1b[32m Connected!\x1b[0m\n\n[cb] Logged in as: \x1b[41m" + `${client.user.username}` + "\x1b[40m")
  client.user.setActivity("Need help? Use "+config.prefix+"help");
});

//guild join event listener
client.on('guildCreate', guildCreate => {
  //add new guild info
  if(!guildData.some(x=>x.id==guildCreate.id)){
    guildData.push({
      "name":guildCreate.name,
      "id":guildCreate.id,
      "memberCount":guildCreate.memberCount,
      "owner_name":guildCreate.owner.username,
      "owner_id":guildCreate.ownerID,
      "joined":guildCreate.createdTimestamp,
      "admin_roles":guildCreate.roles.filter(role=>role.hasPermission('ADMINISTRATOR')).map(role=>role.id)
    });
    fs.writeFile("./src/data/guild_data.json",JSON.stringify(guildData),(err)=>console.error);
    console.log("[cb] Joined Guild:\n"+guildCreate.name+"\n"+guildCreate.id);
  };

});

//reaction add event listener
client.on('messageReactionAdd', reaction => {
  //cancel if not the bot and is an x emoji
  if(reaction.message.author.id !== client.user.id && reaction._emoji.name == ('❌'||'↪')){
    console.log("reaction event cancelled")
    return;
  };
  try {
    client.events.get('reactionadd').execute(client,reaction);
  } catch (error) {
    console.log("ReactionAdd ERROR \n",error);
  };
});

//raw event listener
client.on('raw', raw => {
  if(raw.t == 'MESSAGE_REACTION_ADD'){client.events.get('givegold').execute(client,raw)};
});

//message event listener
client.on('message', message => {

  //botception if author is bot return
  if(!(message.author.id!==client.user.id) && !!message.author.bot)return;
  //temp friendcode channel management
  if(message.channel.id=="590687309096157247"){
    if(!(/^\d{4} \d{4} \d{4}/).test(message.content))message.delete();
  };

  //variables
  const prefix = config.prefix;
  const command_name = message.content.slice(prefix.length).trim().replace(/\-/g," ").split(/\s/g)[0].toLowerCase();
  const arguments = message.content.slice(prefix.length).trim().split(/\s/g).slice(1).map(x=>x.toLowerCase());
  const command = client.commands.get(command_name);

  //verify if message starts with prefix
  if(!message.content.startsWith(prefix)||message.channel.type=="dm"){
    return;
  }//verfiy command
  else if(!client.commands.has(command_name)){
    console.log(`${command_name} - is not a command`)
    return;
  }//verfiy if admin rights required
  else if(command.isAdmin && !message.member.hasPermission('ADMINISTRATOR')){
    message.channel.send("`ACCESS DENIED:` Sorry you do not have permission to access this command.");
    return;
  }//verfiy arguments
  else if(command.arguments.length && !arguments.length){
    message.channel.send("`ERROR:` Argument(s) must be provided with the `"+command_name+
    "` command. Use the command `" +`${prefix}help ${command_name}`+"` for instructions on using that command.");
    console.log(`[cb] No arguments provided for ${command.name} command. Command cancelled`)
    return;
  };

  //command + args log
  console.log(`[cb] Command: ${command_name} \nArguments: ${arguments}\nArguments length: ${arguments.length}`);

  //execute a command
  try{
    command.execute(client,message,arguments);
  }catch(error){
    console.error(error)//("\x1b[31m%s\x1b[0m",error);
    message.channel.send('`ERROR:` An issue has occured with that command. Please notify an admin if the issue continues.');
  };

});
