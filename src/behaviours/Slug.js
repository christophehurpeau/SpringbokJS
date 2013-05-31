require('springboktools/UString/normalize');
/*#ifelse NODE*/(module.exports||S.behaviours.Slug)/*#/if*/=function(model,onEnd){
	model.Fields.slug=[String];
	model.beforeInsert.push(function(data,onEnd){
		/*#if DEV*/ if(!data[model.displayField]) throw new Error(model.displayField+" REQUIRED ! data="+UDebug.dump(data)) /*#/if*/
		data.slug=UString.slugify(data[model.displayField]);
		onEnd();
	});
	model.beforeUpdate.push(function(data,onEnd){ if(data[model.displayField]) data.slug=UString.slugify(data[model.displayField]); onEnd(); });
	onEnd();
};