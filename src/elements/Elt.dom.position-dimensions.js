/* http://msdn.microsoft.com/en-us/library/ie/hh781509%28v=vs.85%29.aspx */


/*
 * https://developer.mozilla.org/en-US/docs/Determining_the_dimensions_of_elements
 * https://developer.mozilla.org/en-US/docs/Web/API/element.scrollHeight
 * element.scrollHeight - element.scrollTop === element.clientHeight
 * 
 */

(function(){
	var getOffsets = function( offsets, width, height ){
		return [
			parseFloat( offsets[ 0 ] ) * ( rpercent.test( offsets[ 0 ] ) ? width / 100 : 1 ),
			parseFloat( offsets[ 1 ] ) * ( rpercent.test( offsets[ 1 ] ) ? height / 100 : 1 )
		];
	};
	/*
	var checkWidthOrHeight=function( elt, value, name ){
		if( value && value > 0 ) return value;
	};
	
	Elt.width = function( elt ){
		return checkWidthOrHeight(elt, elt.offsetWidth, 'width');
	};
	
	Elt.height = function( elt ){
		return checkWidthOrHeight(elt, elt.offsetHeight, 'height');
	};
	*/
	Elt.dimensions = function( elt ){
		if( elt.nodeType === NodeTypes.DOCUMENT ){
			return {
				width: Elt.width(elt),
				height: Elt.height(elt),
				offsetTop: 0,
				offsetLeft: 0
			};
		}
		if( elt.preventDefault ){
			// an event
			return {
				width: 0,
				height: 0,
				offsetTop: raw.pageY,
				offsetLeft: raw.pageX
			};
		}
		
		return {
			width: Elt.outerWidth( elt ),
			height: Elt.outerHeight( elt ),
			offsetTop: Elt.prop(elt,'offsetTop'),
			offsetLeft: Elt.prop(elt,'offsetLeft')
		}
	};
	
	//TODO : use prop instead ? and propHooks !
	
	Elt.position = function( elt ){
		/*/ Set position
		var ww = $document.width(),wh = $document.height();
		var w = c.outerWidth(1),h = c.outerHeight(1);
		c.css({
			display : 'block',
			top	 : e.pageY > (wh - h) ? wh : e.pageY,
			left	: e.pageX > (ww - w) ? ww : e.pageX
		});
		*/
		return {
			parent: e.offsetParent,
			
		};
	};
	
	Elt.setPosition = function(e,position){
		if( position.nodeType ){
			var ofElement = position;
			position = {
			};
		}
		Elt.setStyle(e,'top',e.pageY > (wh - h) ? wh : e.pageY);
		Elt.setStyle(e,'left',e.pageX > (ww - w) ? ww : e.pageX);
	}

})();