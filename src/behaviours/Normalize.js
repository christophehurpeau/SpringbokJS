require('springboktools/UString/normalize');
((/* NODE||BROWSER */module.exports||S.behaviours.Normalize))=function(model,onEnd){
	model.Fields.normalized=[String];
	model.beforeInsert.push(function(data,onEnd){
		/* DEV */ if(!data[model.displayField]) throw new Error(model.displayField+" REQUIRED ! data="+UDebug.dump(data)) /* /DEV */
		data.normalized=UString.normalize(data[model.displayField]);
		onEnd();
	});
	model.beforeUpdate.push(function(data,onEnd){ if(data[model.displayField]) data.normalized=UString.normalize(data[model.displayField]); onEnd(); });
	onEnd();
};