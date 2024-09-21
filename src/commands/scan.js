const tesseract = require('tesseract.js');
const jimp = require('jimp');
const item = require('../functions/itemLookup.js');

module.exports = {

  name: "scan",
  description: "",
  arguments: [],
  isAdmin: false,
  private: true,
  execute(client,message,arguments){
    var isGym = (/gym/i).test(message.content)?true:false;
    var crop = isGym?[240,130,640,250]:[0,80,780,250];
    message.channel.startTyping();
    var image = message.attachments.first().url
    var buffer;
    jimp.read(image)
    .then(scannedImage => {
      scannedImage
      .resize(1080, jimp.AUTO)
      .crop(crop[0],crop[1],crop[2],crop[3])
      .brightness(-0.4)
      .contrast(0.8)
      .posterize(1)
      .greyscale()
      .getBuffer(jimp.MIME_PNG, (error, result) => {
        //message.channel.send({file:result})
        buffer = result;
      })
    })
    .then(() => {
      tesseract.recognize(buffer, 'eng')
      .then(result => {

        message.content = result.text;
        console.log(result.text)

        if(isGym) {
          item.gymLookup(message);
        }else {
          item.stopLookup(message);
        };

      })
      .catch(err => console.error(err));
    })
    .catch(err => console.error(err));

    message.channel.stopTyping();
  }
}
