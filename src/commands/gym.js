const item = require('../functions/itemLookup.js');

module.exports = {

  name: "gym",
  description: "Pull up directions for any of our local gyms. ie`;gym [gym name/partial name]`",
  arguments: ["name"],
  isAdmin: false,
  private: false,
  execute(client,message,arguments){item.gymLookup(message)}
}
