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
		var t=this;
		if(t.data.slug){
			t.self.FindValue('slug',{id:t.data._id},function(oldSlug){
				if(oldSlug && oldSlug!=t.data.slug) t.oldSlug=oldSlug;
				onEnd();
			});
		}
	},
	afterUpdate:function(onEnd){
		//VPage::destroy($this->id);
		if(this.oldSlug) M.PageSlugRedirect.create(this.oldSlug,this.data.slug);
		onEnd();
	},
},{
	
})
