require('springbokjs-utils/UString/normalize');
/*#ifelse NODE*/(module.exports||S.behaviours.Normalize)/*#/if*/=function(model,onEnd){
	model.Fields.normalized=[String];
	model.beforeInsert.push(function(data,onEnd){
		/*#if DEV*/ if(!data[model.displayField]) throw new Error(model.displayField+" REQUIRED ! data="+UDebug.dump(data)) /*#/if*/
		data.normalized=UString.normalize(data[model.displayField]);
		onEnd();
	});
	model.beforeUpdate.push(function(data,onEnd){ if(data[model.displayField]) data.normalized=UString.normalize(data[model.displayField]); onEnd(); });
	onEnd();
};