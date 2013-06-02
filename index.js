global.SPRINGBOK_ENV=""+require('fs').readFileSync('./env');
module.exports=require('./'+(SPRINGBOK_ENV==='dev'||SPRINGBOK_ENV==='home'||SPRINGBOK_ENV==='work'?'dev':'prod')+'/app.js');
