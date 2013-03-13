require('springboktools/UString/normalize');
((/* NODE||BROWSER */module.exports||S.behaviours.Slug))=function(model,onEnd){
	model.Fields.slug=[String];
	model.beforeInsert.push(function(data,onEnd){
		/* DEV */ if(!data[model.displayField]) throw new Error(model.displayField+" REQUIRED ! data="+UDebug.dump(data)) /* /DEV */
		data.slug=UString.slugify(data[model.displayField]);
		onEnd();
	});
	model.beforeUpdate.push(function(data,onEnd){ if(data[model.displayField]) data.slug=UString.slugify(data[model.displayField]); onEnd(); });
	onEnd();
};