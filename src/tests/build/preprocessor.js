var Preprocessor=require('../../../bin/commands/build/Preprocessor');
//app=require('../../app.js');

module.exports={
	ifDev:function(t){
		var result;
		result=Preprocessor({DEV:true},"/*#if DEV*/alert('test');\n/*#endif*/");
		t.equal(result,"alert('test');\n");
		result=Preprocessor({PROD:false},"/*#if PROD*/\nalert('test');\n/*#endif*/");
		t.equal(result,"");
		t.done();
	},
	
	ifNot:function(t){
		var result;
		result=Preprocessor({DEV:false},"/*#if !DEV*/alert('test');\n/*#endif*/");
		t.equal(result,"alert('test');\n");
		result=Preprocessor({DEV:true},"/*#if ! DEV*/\nalert('test');\n/*#endif*/");
		t.equal(result,"");
		t.done();
	},
	
	ifThen:function(t){
		var result,str="function /*#if DEV then _*/test(var1,var2){}";
		result=Preprocessor({DEV:true},str);
		t.equal(result,"function _test(var1,var2){}");
		result=Preprocessor({DEV:false},str);
		t.equal(result,"function test(var1,var2){}");
		t.done();
	},
	
	value:function(t){
		var result;
		result=Preprocessor({size:1},'test.limit(/*#val size */)');
		t.equal(result,"test.limit(1)");
		result=Preprocessor({size:1},'test.limit(/*#val size */0)');
		t.equal(result,"test.limit(1)");
		result=Preprocessor({size:1},'test.limit(/*#val size */0,123)');
		t.equal(result,"test.limit(1,123)");
		result=Preprocessor({arg1:'"ahah"'},'test.limit(/*#val arg1 */\'\',123)');
		t.equal(result,'test.limit("ahah",123)');
		result=Preprocessor({arg1:false},'test.limit(/*#val arg1 */true,123)');
		t.equal(result,'test.limit(false,123)');
		result=Preprocessor({arg1:true},'test.limit(/*#val arg1 */false,123)');
		t.equal(result,'test.limit(true,123)');
		t.done();
	},
	
	ifelse:function(t){
		var result;
		result=Preprocessor({},'/*#ifelse NODE*/module.exports||S.behaviours.Slug/*#/if*/');
		t.equal(result,"module.exports");
		result=Preprocessor({},'/*#ifelse NODE*/module.exports||S.behaviours.Slug/*#/if*/',true);
		t.equal(result,"S.behaviours.Slug");
		result=Preprocessor({},'nextTick:/*#ifelse NODE*/(process.nextTick||function(fn){ setTimeout(fn,0); })/*#/if*/,');
		t.equal(result,"nextTick:process.nextTick,");
		t.done();
	}
}
