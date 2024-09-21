const formula = require('../formulas/stat.formulas.js');
const got = require('got');
const dps = require('../data/dps_data.json');
const pokemon_images = fs.readdirSync('./images/pokemon').filter(file=>file.endsWith('.png'));
const w = require('../formulas/constants.js');

module.exports = {
  name: "stats",
  description:
  "Search pokemon by name or dex number. \n**Command format** : `" +
  config.prefix + "stats [pokemon name or id [-form]] [lvl(opt)] [atk(opt)] [def(opt)] [sta(opt)]`",
  arguments: ["pokemon", "level","atk","def","sta"],
  isAsmin:false,
  private: false,
  execute(client,message,arguments){

    message.channel.startTyping();

    function findEmoji(name){
      let emoji = client.guilds.get("192870971189755904").emojis.find(x=>x.name==name);
      return "<:"+emoji.name+":"+emoji.id+">";
    };

    function findStat(data,name){
      let found;
      if(name!=="hp"){
        var stat = {
          normal: data.stats.find(x=>x.stat.name==name).base_stat,
          special: data.stats.find(x=>x.stat.name=="special-" + name).base_stat,
          speed: data.stats.find(x=>x.stat.name=="speed").base_stat
        };
        found = formula["Calculate" + name](stat.normal,stat.special,stat.speed);
      } else {
        var stat = data.stats.find(x=>x.stat.name==name).base_stat;
        console.log(`HP : ${stat}`);
        found = formula["Calculate" + name](stat);
        console.log(`HP Calculated : ${found}`);
      };
      return found;
    };

    function singleType(type1){
      console.log(type1)
      let primary = w.defending.find(x => type1.test(x.name)).vs;
      return primary.map(
        (item,index) => {
          let product = item > 1 ?
          (item * 100).toFixed(1)*1 :
          (item * 100);
          return product;
        })
    };

    function dualType(type1,type2){
      let primary = w.defending.find(x => type1.test(x.name)).vs;
      let secondary = w.defending.find(x => type2.test(x.name)).vs;
      return primary.map(
        (item,index) => {
          let product = item > 1 ?
          (item * secondary[index] * 100).toFixed(1)*1 :
          (item * secondary[index] * 100);
          return product;
        })
    };

    (async() => {
      try {
        const response = await got('https://pokeapi.co/api/v2/pokemon/' + arguments[0]);
        var data = JSON.parse(response.body);
        var level = (typeof arguments[1]!=="undefined" &&
        (/[1-9].5|[0-4][0-9].5|[0-4][0-9]|[1-9]/g).exec(arguments[1])[0]<40) ?
        (/[1-9].5|[0-4][0-9].5|[0-4][0-9]|[1-9]/g).exec(arguments[1])[0] : 40;

        var ivs =
        (arguments.length==5 && arguments.slice(2).every(x => x <= 15 && x >= 0)) ?
        {atk: +arguments[2], def: +arguments[3], sta: +arguments[4]} :
        {atk: 15, def: 15, sta: 15};

        console.log(
          `--------${data.name.charAt(0).toUpperCase()}${data.name.slice(1)}---------`
        );

        var types = data.types.map(t => new RegExp(t.type.name, "i"));

        var weakAgainst = data.types.length !== 2 ?
        singleType(types[0]).map((x,y)=> {
          if(x==0){x=39.1};
          return x + "% " + findEmoji(w.attacking[y].name)
        })
          .sort((a,b) => b.replace(/\D/g,"")-a.replace(/\D/g,"")) :
        dualType(types[0],types[1]).map((x,y)=> {
          if(x==0){x=39.1};
          return x + "% " + findEmoji(w.attacking[y].name)
        })
        .sort((a,b) => b.replace(/\D/g,"")-a.replace(/\D/g,""));

console.log(weakAgainst)
        var pokemon = {
          level: level,
          ivs: ivs,
          name: data.name.charAt(0).toUpperCase() + data.name.slice(1),
          number: data.id < 10 ? " #00" + data.id : data.id < 100 ? " #0" + data.id : " #" + data.id,
          typeEmoji: data.types.map(x => findEmoji(x.type.name)).toString().replace(/,/,""),
          stardustEmoji: findEmoji("stardust"),
          candyEmoji: findEmoji("rarecandy"),
          weak: weakAgainst.filter(x=>(/^(160|256)/).test(x)).toString(),
          resists: weakAgainst.filter(x=>(/^(24.4|62.5|39.1)/).test(x)).toString(),
          stats: {
            attack: findStat(data,"attack"),
            defense: findStat(data,"defense"),
            stamina: findStat(data,"hp")
          }
        };
        pokemon.sprite = data.name.includes("-")
        ? pokemon_images.find(x=> {
          //console.log(data.species.url.slice(data.species.url.indexOf("s/")+1).replace(/\//g,"")+"-"+data.name.split("-")[data.name.split("-").length-1])
          return new RegExp(data.species.url.slice(data.species.url.indexOf("s/")+1).replace(/\//g,"")+"-"+data.name.split("-")[data.name.split("-").length-1],"i").test(x)
        })
        : pokemon.number.replace(/\D/g,"")+".png";

        var maxCP = pokemon.level<40 ? "\nMaxCP : `" +
        formula.CalculateCombatPower(pokemon.stats,40,pokemon.ivs).cp + "`" : "";

console.log(pokemon.weak)

        var revisedStats =
        formula.CalculateCombatPower(pokemon.stats,pokemon.level,pokemon.ivs);

        let nameExp = new RegExp(
          pokemon.name.split("-")[0] + ".*" +
          pokemon.name.split("-")[1] + "|" +
          pokemon.name.split("-")[1] + ".*" +
          pokemon.name.split("-")[0]
          ,'i');

        function nameFilter(x){
          let y = pokemon.name.includes("-") ? nameExp : new RegExp(pokemon.name +"$","i")
          return y.test(x.pokemon)
        }

        var battleData = {
          dps: dps.filter(nameFilter).sort(function (a,b){return b.DPS-a.DPS})
          .map(x => `${x.fastMove} / ${x.chargeMove} at ${x.DPS} dps`),

          fastMoves: [...new Set(dps.filter(nameFilter).map(x => x.fastMove))],

          chargeMoves: [...new Set(dps.filter(nameFilter).map(x => x.chargeMove))]
        };

      var battleString = typeof battleData.dps[0] == "undefined" ? "" :
      `${battleData.dps[0]}\n${battleData.dps[1]}\n${battleData.dps[2]}`

        console.log(revisedStats);
        console.log(battleData.fastMoves);
        console.log(battleData.chargeMoves);

        let newFields = typeof battleData.dps[0] == "undefined" ?
        [
          {
            name:
            "at Level : `" + pokemon.level +
            "`\nwith IVs : `" + Object.values(pokemon.ivs).toString().replace(/,/g,"/") +
            "`\nCP : `" + revisedStats.cp + "`" + maxCP +
            "\nBase Stats : `" +
            `${revisedStats.atk}/${revisedStats.def}/${revisedStats.sta}`
            + "`",
            value: "---------------------------"
          },
          {
            name:"\nCosts : ",
            value:
            `${formula.CalculateCost(pokemon.level).sdToPower}${pokemon.stardustEmoji}${formula.CalculateCost(pokemon.level).candyToPower} ${pokemon.candyEmoji} : to lvl 40`
          }
        ] :
        [
          {
            name:
            "at Level : `" + pokemon.level +
            "`\nwith IVs : `" + Object.values(pokemon.ivs).toString().replace(/,/g,"/") +
            "`\nCP : `" + revisedStats.cp + "`" + maxCP +
            "\nBase Stats : `" +
            `${revisedStats.atk}/${revisedStats.def}/${revisedStats.sta}`
            + "`",
            value: "---------------------------"
          },
          {
            name:
            "Fast Moves :",
            value: battleData.fastMoves.toString().replace(/\,/g,", "),
          },
          {
            name:
            "Charge Moves :",
            value: `${battleData.chargeMoves.toString().replace(/\,/g,", ")}\n`
          },
          {
            name: "Top 3 DPS Movesets :",
            value: battleString
          },
          {
            name: "Weak Against :",
            value: pokemon.weak
          },
          {
            name: "Resists :",
            value: pokemon.resists
          },
          {
            name:"\nCosts : ",
            value:
            `${formula.CalculateCost(pokemon.level).sdToPower}${pokemon.stardustEmoji}${formula.CalculateCost(pokemon.level).candyToPower} ${pokemon.candyEmoji} : to lvl 40`
          }
        ]

        message.channel.stopTyping();
        message.channel.send({
          embed:{
            title: pokemon.typeEmoji + " " + pokemon.name + " - " + pokemon.number,
            //description: pokemon.number,
            //image:"",
            thumbnail: {url: "attachment://sprite.png"},
            color: 12582912,
            fields: newFields
          }, files: [
            {
              attachment: "./images/pokemon/"+pokemon.sprite,
              name: "sprite.png"
            }
          ]
        });
        //message.channel.send({embed:{title:arguments[0],thumbnail:{url:"attachment://sprite.png"}},files:[{attachment:pokemon.sprites.front_default,name:"sprite.png"}]});
      } catch(error) {
        message.channel.stopTyping();
        message.channel.send('`ERROR:` Unable to pull data for that request. Please try again.')
        console.error(error);
      }
    })();
  }
}
