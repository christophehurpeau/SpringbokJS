module.exports=App.Model('Page',{
	parent:'Searchable', behaviours:['Child'],
	
	Fields:{
		content:[String]
	},

	onModified:function(pageId,deleted){
		//deleted ? VPage::destroy($pageId) : VPage::generate($pageId);
		//ACSitemapPages::generate();
	},
	internalLink:function(id,onEnd){
		M.Page.FindValue('slug',{id:id},function(slug){
			var page=new M.Page({id:id,slug:slug});
			onEnd(page.link());
		});
	}
},{
	beforeUpdate:function(onEnd){
		if(this.data.slug){
			this.self.FindValue('slug',{id:this.data._id},function(oldSlug){
				if(oldSlug && oldSlug!=this.data.slug) this.oldSlug=oldSlug;
				onEnd();
			}.bind(this));
		}
	},
	afterUpdate:function(onEnd){
		//VPage::destroy($this->id);
		if(this.data.slug){
			if(this.oldSlug) M.SlugRedirect.create('Page',this.oldSlug,this.data.slug);
			M.SlugRedirect.slugAdded('Page',this.data.slug);
		}
		onEnd();
	},
},{
	
})
