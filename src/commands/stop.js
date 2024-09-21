const item = require('../functions/itemLookup.js');

module.exports = {

  name: "stop",
  description: "Pull up directions for any of our local pokestops.",
  arguments: ["name"],
  isAdmin: false,
  private: false,
  execute(client,message,arguments){item.stopLookup(message)}
}
