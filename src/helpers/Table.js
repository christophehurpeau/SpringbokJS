includeCore('elements/Form');

(function(){
	var Table=function(H,modelName,cols){
		this.H=H;
		this.cols=S.isStr(cols) ? cols.split(',') : cols;
		this.modelName=modelName;
		this.model=App.models[modelName];
	}
	
	Table.prototype={
		allowFilters:function(){ return this; },
		paginate:function(){ return this; },
		actionClick:function(){ return this; },
		layout:function(layout){ this.layout=layout; return this; },
		
		render:function(layoutTitle,add){
			var t=this,H=this.H,content=S.Elt.div().html(''),table=$.create('table').html('');
			
			if(add){
				if(S.isStr(add)) add={action:add};
				//if(!isset($add['form']['action'])) $add['form']['action']='/'.lcfirst($add['modelName']::$__pluralized).'/add';
				if(!add.fields) add.fields=[[this.model.displayField,H.tF(this.modelName,'New')+' :']];
				
				/*$form=HForm::create($add['modelName'],$add['form'],$add['formContainer']);
				foreach($add['fields'] as $field=>$label)
					echo ' '.$form->autoField($field,array('label'=>$label));
				echo $form->end(_tC('Add'));*/
				
				var form=H.FormForModel(this.modelName).setClass('oneline').action(add.action);
				add.fields.forEach(function(f){ form.autoField(f[0]).label(f[1]).end(); });
				content.aHtml(form.end(H.tC('Add')));
			}
			
			this.model.find.docs(H).exec(function(c){
				c.count(function(err,count){
					content.aHtml('<div class="">count='+count+'</div>');
					
					var addResult=function(err,item){
						if(item===null){
							content.aHtml(table);
							H.renderLayout(t.layout,{layoutTitle:layoutTitle,layoutContent:content.toString()});
							return;
						}
						if(err) table.aHtml('<tr><td>Error occured</td></tr>');
						else{
							table.aHtml('<tr><td>'+JSON.stringify(item)+'</td></tr>');
						}
						c.nextObject(addResult);
					}
					
					c.nextObject(function(err,item){
						if(item===null) table.aHtml('<tr><td>'+H.tC('No results')+'</td></tr>');
						addResult(err,item);
					});
				});
			});
		}
	};
	
	S.extProto(S.Helpers,{
		Table:function(modelName,cols){
			return new Table(this,modelName,cols);
		}
	});
})();