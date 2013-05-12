evaluate = function(defines,expr) {
	var Preprocessor = null;
	for (var key in defines) {
		if (defines.hasOwnProperty(key)) {
			eval("var "+key+" = "+JSON.stringify(""+defines[key])+";");
		}
	}
	return eval(expr);
}.bind(null)

//https://github.com/dcodeIO/Preprocessor.js/blob/master/Preprocessor.js

module.exports=function(defines,data,isBrowser,baseDir){
	defines=defines||{};
	
	var Preprocessor={
		errorSourceAhead:50,
		EXPR: /\/\*\s+#(include|ifn?def|if|endif|else|elif|eval)\s+(.+)\s+\*\//g,
		
		INCLUDE: /include[ ]+"([^"\\]*(\\.[^"\\]*)*)"[ ]*\r?\n/g,
		EVAL: /eval\s+([^\n]+)/g,
		IF: /(ifdef|ifndef|if)[ ]*([^\r\n]+)\r?\n/g,
		ENDIF: /(endif|else|elif)([ ]+[^\r\n]+)?\r?\n/g,
		
		/**
		 * Indents a multi-line string.
		 * @param {string} str Multi-line string to indent
		 * @param {string} indent Indent to use
		 * @return {string} Indented string
		 * @expose
		 */
		indent:function(str, indent) {
			var lines = str.split("\n");
			for (var i=0; i<lines.length; i++)
				lines[i] = indent + lines[i];
			return lines.join("\n");
		}

	};
	
	var match, match2, include, p, stack = [];
	while ((match = Preprocessor.EXPR.exec(data)) !== null) {
		var indent = match[1];
		switch (match[2]) {
			case 'include':
					Preprocessor.INCLUDE.lastIndex = match.index;
					if ((match2 = Preprocessor.INCLUDE.exec(data)) === null)
						throw(new Error("Illegal #"+match[2]+": "+data.substring(match.index, match.index+Preprocessor.errorSourceAhead)+"..."));
					
					try {//TODO
						var key = include;
						include = require("fs").readFileSync(baseDir+"/"+include)+"";
					} catch (e) {
						throw(new Error("File not found: "+include+" ("+e+")"));
					}
					data = data.substring(0, match.index)+Preprocessor.indent(include, indent)+data.substring(Preprocessor.INCLUDE.lastIndex);
					Preprocessor.EXPR.lastIndex = stack.length > 0 ? stack[stack.length-1].lastIndex : 0; // Start over again
					break;
					
			case 'eval':
				Preprocessor.EVAL.lastIndex = match.index;
				if ((match2 = Preprocessor.EVAL.exec(data)) === null)
					throw new Error("Illegal #"+match[2]+": "+data.substring(match.index, match.index+Preprocessor.errorSourceAhead)+"...");
				
				include = match2[1];
				include = evaluate(defines, match2[1]);
				data = data.substring(0, match.index)+indent+include+data.substring(Preprocessor.EVAL.lastIndex);
				Preprocessor.EXPR.lastIndex = match.index + include.length;
				break;
			
			case 'ifdef':
			case 'ifndef':
			case 'if':
				Preprocessor.IF.lastIndex = match.index;
				if ((match2 = Preprocessor.IF.exec(data)) === null)
					throw(new Error("Illegal #"+match[2]+": "+data.substring(match.index, match.index+Preprocessor.errorSourceAhead)+"..."));
				
				if (match2[1] == "ifdef") include = !!defines[match2[2]];
				else if (match2[1] == "ifndef")  include = !defines[match2[2]];
				else include = Preprocessor.evaluate(defines, match2[2]);
				
				stack.push(p={ "include": include, "index": match.index, "lastIndex": Preprocessor.IF.lastIndex });
				break;
			case 'endif':
			case 'else':
			case 'elif':
				Preprocessor.ENDIF.lastIndex = match.index;
				if ((match2 = Preprocessor.ENDIF.exec(data)) === null)
					throw(new Error("Illegal #"+match[2]+": "+data.substring(match.index, match.index+Preprocessor.errorSourceAhead)+"..."));
				
				if (stack.length == 0)
					throw(new Error("Unexpected #"+match2[1]+": "+data.substring(match.index, match.index+Preprocessor.errorSourceAhead)+"..."));
				
				var before = stack.pop();
				include = data.substring(before["lastIndex"], match.index);
				if (before["include"]) {
					data = data.substring(0, before["index"])+include+data.substring(Preprocessor.ENDIF.lastIndex);
				} else {
					include = "";
					data = data.substring(0, before["index"])+data.substring(Preprocessor.ENDIF.lastIndex);
				}
				Preprocessor.EXPR.lastIndex = before["index"]+include.length;
				if (match2[1] == "else" || match2[1] == "elif") {
					include =  match2[1] == 'else' ? !before["include"] : evaluate(defines, match2[2]);
					stack.push(p={ "include": !before["include"], "index": Preprocessor.EXPR.lastIndex, "lastIndex": Preprocessor.EXPR.lastIndex });
				}
				break;
		}
	}
	return data;
}
