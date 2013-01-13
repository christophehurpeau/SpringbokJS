var fs=require('fs');

module.exports={
	getJsonSync:function(file){ return JSON.parse(fs.readFileSync(file)); }
};
