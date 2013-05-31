//https://github.com/dcodeIO/Preprocessor.js/blob/master/Preprocessor.js

module.exports=function(defines,data,isBrowser,baseDir){
	defines=defines||{};
	defines.NODE=!isBrowser; defines.BROWSER=!!isBrowser;
	
	var Preprocessor={
		errorSourceAhead:50,
		EXPR: /(^[ ]*)?\/\*[ ]*#(include|ifn?def|ifelse|if|\/if|endif|else|el(?:se)?if|eval|value|val)[ ]*([^\*]*)[ ]*\*\//gm,
		
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
	
	var match, match2, include, stack = [];
	while ((match = Preprocessor.EXPR.exec(data)) !== null) {
		//console.log(match,match.index,Preprocessor.EXPR.lastIndex);
		var indent = match[1], instruction=match[2], content=match[3].trim();
		switch (instruction) {
			case 'eval':
			case 'value': case 'val':
				if(instruction==='eval') include = eval(content);
				else include = String(defines[content]);
				
				var removeAfterLength=0,
					first5=data.substr(Preprocessor.EXPR.lastIndex,5), 
					first4=first5&&first5.substr(0,4), 
					first2=first4&&first4.substr(0,2);
				if(first2){
					if(first2==='0 ') removeAfterLength=2;
					else if(['0;','0,','0)','0.','0+','0-'].indexOf(first2)!==-1) removeAfterLength=1;
					else if(first2==="''") removeAfterLength=2;
					else if(first5==='false') removeAfterLength=5;
					else if(first4==='true') removeAfterLength=4;
				}
				
				data = data.substring(0, match.index)+include+data.substring(Preprocessor.EXPR.lastIndex + removeAfterLength);
				Preprocessor.EXPR.lastIndex = match.index + include.length;
				break;
			
			case 'ifdef': case 'ifndef': case 'if': case 'ifelse':
				if (instruction==='ifdef') include = defines.hasOwnProperty(content);//!!defines[match2[2]];
				else if (instruction==='ifndef') include = defines.hasOwnProperty(content);//!defines[match2[2]];
				else if (instruction==='ifelse') include = defines[content] ? 1 : 2;
				else{
					var ifThenMatch=/^(.*) then (.*)$/.exec(content);
					if(ifThenMatch){
						include = defines[ifThenMatch[1]] ? ifThenMatch[2] : '';
						data = data.substring(0, match.index)+include+data.substring(Preprocessor.EXPR.lastIndex);
						break;
					}else{
						if(content.substr(0,1)==='!') include = !defines[content.substr(1).trim()]
						else include = defines[content];
					}
				}
				
				stack.push({ "include": include, "index": match.index, "lastIndex": Preprocessor.EXPR.lastIndex });
				break;
			
			case '/if': case 'endif': case 'else': case 'elif': case 'elseif':
				if (stack.length == 0)
					throw(new Error("Unexpected #"+instruction+": "+data.substring(match.index, match.index+Preprocessor.errorSourceAhead)+"..."));
				
				var before = stack.pop();
				include = data.substring(before["lastIndex"], match.index);
				if(before.include === 1 || before.include === 2){
					if(include.substr(0,1)==='(' && include.slice(-1)===')') include=include.slice(1,-1);
					include=include.split('||');
					if(include.length !== 2) throw new Error('ifelse : '+include.length+' != 2 : '+data);
					include=include[before.include-1];
				}else if(!before.include) include='';
				data = data.substring(0, before["index"])+include+data.substring(Preprocessor.EXPR.lastIndex);
				Preprocessor.EXPR.lastIndex = before["index"]+include.length;
				if (instruction == "else" || instruction == "elif" || instruction == "elseif") {
					if(instruction==='else') include=!before['include'];
					else{
						if(content.substr(0,1)==='!') include = !defines[content.substr(1).trim()]
						else include = defines[content];
					}
					stack.push({ "include": !before["include"], "index": Preprocessor.EXPR.lastIndex, "lastIndex": Preprocessor.EXPR.lastIndex });
				}
				break;
				
		}
	}
	if(stack.length!==0) throw new Error('Still have stack : missing endif');
	return data;
}
