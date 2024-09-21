const constants = require('../formulas/constants.js');
const cpmPerLevel = constants.cpm;
const sdCostPerLevel = constants.sdCostPerLevel;
const candyCostPerLevel = constants.candyCostPerLevel;
// import { raidBossStamina as bossStamina } from './constants';
module.exports = {

Calculateattack: function (stat,spStat,speed){

  var max_stat = 0.875 * Math.max(spStat, stat);
  var min_stat = 0.125 * Math.min(spStat, stat);
  var speed_modifier = 1 + (speed - 75) / 500;

  console.log(
    "Speed: " + speed +
    "\nAtk: " + stat +
    "\nSp Atk: " + spStat +
    "\nMax Atk: " + max_stat +
    "\nMin Atk: " + min_stat +
    "\nUnrounded Atk: " + (max_stat + min_stat) * 2 * speed_modifier +
    "\nRounded Atk: " + Math.round(Math.round((max_stat + min_stat) * 2) * speed_modifier)
  );

  return Math.round(Math.round((max_stat + min_stat) * 2) * speed_modifier);
},

Calculatedefense: function (stat,spStat,speed){

  var max_stat = 0.625 * Math.max(spStat, stat);
  var min_stat = 0.375 * Math.min(spStat, stat);
  var speed_modifier = 1 + ((speed - 75) / 500);

  console.log(
    "Def: " + stat +
    "\nSp Def: " + spStat +
    "\nMax Def: " + max_stat +
    "\nMin Def: " + min_stat +
    "\nUnrounded Def: " + (max_stat + min_stat) * 2 * speed_modifier +
    "\nRounded Def: " + Math.round(Math.round((max_stat + min_stat) * 2) * speed_modifier)
  );
  return Math.round(Math.round((max_stat + min_stat) * 2) * speed_modifier);
},

Calculatehp: function (hp){
  return Math.floor(hp * 1.75 + 50);
},

CalculateCombatPower: function (pokemon, level = 40, ivs = { atk: 15, def: 15, sta: 15}) {
	var cpm = cpmPerLevel[2 * level - 2];

	var Attack = pokemon.attack;
	var Defense = pokemon.defense;
	var Stamina = pokemon.stamina;
  var product = (Attack + ivs.atk) * Math.pow((Defense + ivs.def), 0.5) * Math.pow(Stamina + ivs.sta, 0.5) * Math.pow(cpm, 2) / 10;

  if(product >= 3900){
    Attack = Math.round(Attack - (Attack * 0.09));
    Defense = Math.round(Defense - (Defense * 0.09));
    Stamina = Math.ceil(Stamina - (Stamina * 0.09));
    console.log("Nerf 9% reduction - \nAtk: " + Attack + "\nDef: " + Defense + "\nSta: " + Stamina);
    product = (Attack + ivs.atk) * Math.pow((Defense + ivs.def), 0.5) * Math.pow(Stamina + ivs.sta, 0.5) * Math.pow(cpm, 2) / 10;
  };
  console.log("Unfloored CP: " + product);
  product = {
    cp: Math.floor(product),
    atk: Attack,
    def: Defense,
    sta: Stamina
  };
	return product;
},

CalculateBossCombatPower: function (pokemon, tier = 1) {
	var Attack  = (pokemon.atk + 15);
	var Defense = (pokemon.def + 15);
	var Stamina = bossStamina[tier];

	return Math.floor((Attack * Math.pow(Defense, 0.5) * Math.pow(Stamina, 0.5)) / 10);
},

CalculateCost: function(level = 40){
  //console.log(2 * level -1)
  var sdlist = sdCostPerLevel.filter(function(x,index){
    return index>=(2 * level-1)
  });

  var candylist = candyCostPerLevel.filter(function(x,index){
    return index>=(2 * level-1)
  });

  let cost = {
    timesToPower: sdlist.length,
    sdToPower: sdlist.reduce(function(x,y){return x + y},0).toLocaleString(),
    candyToPower: candylist.reduce(function(x,y){return x + y},0).toLocaleString()
  };
  return cost;
}
}
//
// export default {
//     CalculateCombatPower,
//     CalculateBossCombatPower
// }
