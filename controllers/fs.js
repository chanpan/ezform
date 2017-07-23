var fs = require('fs');
module.exports = {
    writer:(file, data)=>{
         fs.writeFile(`./assets/db/${file}.json`, data, function (err) {
            if (err) 
                return console.log(err);
               //console.log('Hello World > helloworld.txt');
        });
    },
    reader:()=>{

    }
}