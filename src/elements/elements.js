includeCore('elements/Elt');

/*#if NODE*/
global.$={
	div:S.Elt.div,
	create:S.Elt.create
}
/*#/if*/

/*#if BROWSER*/
if(!global.$){
	global.$=function(){};
	$.div=S.Elt.div;
	$.create=S.Elt.create;
}else{
	//TODO : jquery for now. Should change later.
	$.div=S.Elt.div;
	$.create=S.Elt.create;
}
/*#/if*/
