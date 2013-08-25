/* http://msdn.microsoft.com/en-us/library/ie/hh781509%28v=vs.85%29.aspx */


/*
 * https://developer.mozilla.org/en-US/docs/Determining_the_dimensions_of_elements
 * https://developer.mozilla.org/en-US/docs/Web/API/element.scrollHeight
 * element.scrollHeight - element.scrollTop === element.clientHeight
 * 
 */

(function(){
	var getOffset = function( offset, widthOrHeight ){
		return parseInt( offset, 10 ) * ( S.isString(offset) && offset.contains('%') ? widthOrHeight / 100 : 1 );
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
				width: elt.width,
				height: elt.height,
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
			width: Elt.prop(elt,'offsetWidth'),
			height: Elt.prop(elt, 'offsetHeight'),
			offsetTop: Elt.prop(elt,'offsetTop'),
			offsetLeft: Elt.prop(elt,'offsetLeft')
		};
	};
	
	Elt.position = function( elt, position ){
		/*/ Set position
		var ww = $document.width(),wh = $document.height();
		var w = c.outerWidth(1),h = c.outerHeight(1);
		c.css({
			display : 'block',
			top	 : e.pageY > (wh - h) ? wh : e.pageY,
			left	: e.pageX > (ww - w) ? ww : e.pageX
		});
		
		
		
		Elt.setStyle(e,'top',e.pageY > (wh - h) ? wh : e.pageY);
		Elt.setStyle(e,'left',e.pageX > (ww - w) ? ww : e.pageX);
		*/
		
		var $elt = $(elt), $of,ofElement, ofWidth, ofHeight, ofOffsetTop, ofOffsetLeft;
		
		if( position.nodeType ){
			$of = position;
			position = {};
		}else{
			$of = position.of;
		}
		
		if($of.preventDefault){
			ofElement = $of;
			$of = null;
		}else{
			$of = $($of);
			ofElement = $of[0];
		}
		
		var collision = position.collision ? position.collision.split(' ') : ["flip"];
		if( collision.length === 1 ) collision[ 1 ] = collision[ 0 ];
		
		var $within = position.within ? $(position.within) : $(elt.offsetParent || document.body);
		
		/*if ( ofElement.nodeType === NodeTypes.DOCUMENT ) {
			ofWidth = $of.prop('width');
			ofHeight = $of.prop('height');
			ofOffsetTop = ofOffsetLeft = 0;
		} else if ( $.isWindow( ofElement ) ) {
			ofWidth = $of.prop('width');
			ofHeight = $of.prop('height');
			ofOffsetTop = $of.prop('scrollTop');
			ofOffsetLeft = $of.prop('scrollLeft');
		} else */if ( ofElement.preventDefault ) {
			// force left top to allow flipping
			position.at = "left top";
			ofWidth = ofHeight = 0;
			ofOffsetTop = ofElement.pageY;
			ofOffsetLeft = ofElement.pageX;
		} else {
			ofWidth = $of.prop('offsetWidth');
			ofHeight = $of.prop('offsetHeight');
			ofOffsetTop = $of.prop('offsetTop');
			ofOffsetLeft = $of.prop('offsetLeft');
		}
		
		var at=position.at ? position.at.split(' ') : [ 'center', 'center' ];
		var my=position.my ? position.my.split(' ') : [ 'center', 'center' ];
		
		var basePositionLeft = ofOffsetLeft, basePositionTop = ofOffsetTop;
		
		if( at[0] === "right" )
			basePositionLeft += ofWidth;
		else if ( at[0] === "center" )
			basePositionLeft += ofWidth / 2;
	
		if( at[1] === "bottom" )
			basePositionTop += ofHeight;
		else if ( at[1] === "center" )
			basePositionTop += ofHeight / 2;
		
		var atOffsetLeft = getOffset( 0, ofWidth);
		basePositionLeft += atOffsetLeft;
		var atOffsetTop = getOffset( 0, ofHeight);
		basePositionTop += atOffsetTop;
		
		var
			eltWidth = $elt.prop('offsetWidth'),
			eltHeight = $elt.prop('offsetHeight'),
			marginLeft = Elt.getIntStyle(elt,'marginLeft'),
			marginTop = Elt.getIntStyle(elt,'marginTop'),
			collisionWidth = eltWidth + marginLeft + Elt.getIntStyle(elt, 'marginRight') + $within.prop('scrollLeft'),
			collisionHeight = eltHeight + marginTop + Elt.getIntStyle(elt, 'marginBottom') + $within.prop('scrollTop'),
			positionTop = basePositionTop, positionLeft = basePositionLeft;
		
		console.log('collision = ',collisionWidth , collisionHeight);
		//console.log('collisionWidth = ',eltWidth +' + '+ marginLeft +' + '+ Elt.getIntStyle(elt, 'marginRight') +' + '+ $within.prop('scrollLeft'));
		
		if( my[0] === "right" )
			positionLeft -= eltWidth;
		else if ( my[0] === "center" )
			positionLeft -= eltWidth / 2;

		if ( my[1] === "bottom" )
			positionTop -= eltHeight;
		else if ( my[1] === "center" )
			positionTop -= eltHeight / 2;
		
		
		var myOffsetLeft = getOffset( 0, eltWidth);
		var myOffsetTop = getOffset( 0, eltHeight);
		
		var ofDimensions = { width: ofWidth, height: ofHeight };
		var collisionDimensions = { width: collisionWidth, height: collisionHeight, marginLeft: marginLeft, marginTop: marginTop };
		var eltDimensions = { width: eltWidth, height: eltHeight, };
		var offset= [ atOffsetLeft + myOffsetLeft, atOffsetTop + myOffsetTop ];
		
		console.log('position = ',positionLeft , positionTop);
		
		positionLeft = Elt.position.positions[ collision[0] ].left(positionLeft, $within, ofDimensions, collisionDimensions, eltDimensions,at,my,offset, position);
		positionTop = Elt.position.positions[ collision[1] ].top(positionTop, $within, ofDimensions, collisionDimensions, eltDimensions,at,my,offset, position);
		/*
				$ui.position[ collision[ i ] ][ dir ]( position, {
					targetWidth: targetWidth,
					targetHeight: targetHeight,
					elemWidth: elemWidth,
					elemHeight: elemHeight,
					collisionPosition: collisionPosition,
					collisionWidth: collisionWidth,
					collisionHeight: collisionHeight,
					offset: [ atOffset[ 0 ] + myOffset[ 0 ], atOffset [ 1 ] + myOffset[ 1 ] ],
					my: options.my,
					at: options.at,
					within: within,
					elem : elem
				});
			}
		});*/
		
		console.log('position = ',positionLeft , positionTop);
		
		if(Elt.getStyle(elt,'position') === 'static')
			elt.style.position = 'relative';
		elt.style.left = positionLeft+'px';
		elt.style.top = positionTop+'px';
	};
	Elt.position.positions = {
		fit: {
			left: function( position, $within, ofDimensions, collision ) {
				var withinOffset = $within.prop('offsetLeft'),
					outerWidth = $within.prop('offsetWidth'),
					collisionPosLeft = position - collision.marginLeft,
					overLeft = withinOffset - collisionPosLeft,
					overRight = collisionPosLeft + collision.width - outerWidth - withinOffset,
					newOverRight;
	
				// element is wider than within
				if ( collision.width > outerWidth ) {
					// element is initially over the left side of within
					if ( overLeft > 0 && overRight <= 0 ) {
						newOverRight = position + overLeft + collision.width - outerWidth - withinOffset;
						position += overLeft - newOverRight;
					// element is initially over right side of within
					} else if ( overRight > 0 && overLeft <= 0 ) {
						position = withinOffset;
					// element is initially over both left and right sides of within
					} else {
						if ( overLeft > overRight ) {
							position = withinOffset + outerWidth - collision.width;
						} else {
							position = withinOffset;
						}
					}
				// too far left -> align with left edge
				} else if ( overLeft > 0 ) {
					position += overLeft;
				// too far right -> align with right edge
				} else if ( overRight > 0 ) {
					position -= overRight;
				// adjust based on position and margin
				} else {
					position = Math.max( position - collisionPosLeft, position );
				}
				return position;
			},
			top: function( position, $within, ofDimensions, collision ) {
				console.log('within : ',$within);
				var withinOffset = $within.prop('offsetTop'),
					outerHeight = $within.prop('offsetHeight'),
					collisionPosTop = position - collision.marginTop,
					overTop = withinOffset - collisionPosTop,
					overBottom = collisionPosTop + collision.height - outerHeight - withinOffset,
					newOverBottom;
	
				// element is taller than within
				if ( collision.height > outerHeight ) {
					S.log('element is taller than within',collision.height +' > '+ outerHeight);
					// element is initially over the top of within
					if ( overTop > 0 && overBottom <= 0 ) {
						S.log('element is initially over the top of within');
						newOverBottom = position + overTop + collision.height - outerHeight - withinOffset;
						position += overTop - newOverBottom;
					// element is initially over bottom of within
					} else if ( overBottom > 0 && overTop <= 0 ) {
						S.log('element is initially over bottom of within',overBottom +'> 0 && '+overTop+' <= 0');
						position = withinOffset;
					// element is initially over both top and bottom of within
					} else {
						S.log('element is initially over both top and bottom of within');
						if ( overTop > overBottom ) {
							position = withinOffset + outerHeight - collision.height;
						} else {
							position = withinOffset;
						}
					}
				// too far up -> align with top
				} else if ( overTop > 0 ) {
					S.log('too far up -> align with top',overTop,withinOffset,collisionPosTop);
					position += overTop;
				// too far down -> align with bottom edge
				} else if ( overBottom > 0 ) {
					S.log('too far down -> align with bottom edge',overBottom,collisionPosTop , collision , outerHeight , withinOffset);
					position -= overBottom;
				// adjust based on position and margin
				} else {
					S.log('adjust based on position and margin');
					position = Math.max( position - collisionPosTop, position );
				}
				return position;
			}
		},
		
		flip: {
			left: function( position, $within, ofDimensions, collision, eltDimensions, at,my,offset, positionOptions ) {
				var offsetLeft = $within.prop('offsetLeft'),
					withinOffset = offsetLeft + $within.prop('scrollLeft'),
					outerWidth = $within.prop('offsetWidth'),
					collisionPosLeft = position - collision.marginLeft,
					overLeft = collisionPosLeft - offsetLeft,
					overRight = collisionPosLeft + collision.width - outerWidth - offsetLeft,
					myOffset = my[0] === "left" ? -eltDimensions.width : my[0] === "right" ? eltDimensions.width : 0,
					atOffset = at[0] === "left" ? ofDimensions.width : at[0] === "right" ? -ofDimensions.width : 0,
					offset = -2 * offset[0],
					newOverRight,
					newOverLeft;
	
				if ( overLeft < 0 ) {
					newOverRight = position + myOffset + atOffset + offset + collision.width - outerWidth - withinOffset;
					if ( newOverRight < 0 || newOverRight < Math.abs( overLeft ) ) {
						positionOptions.flippedLeft && positionOptions.flippedLeft();
						position += myOffset + atOffset + offset;
					}
				}
				else if ( overRight > 0 ) {
					newOverLeft = position - collision.marginLeft + myOffset + atOffset + offset - offsetLeft;
					if ( newOverLeft > 0 || Math.abs( newOverLeft ) < overRight ) {
						positionOptions.flippedLeft && positionOptions.flippedLeft();
						position += myOffset + atOffset + offset;
					}
				}
				return position;
			},
			top: function( position, $within, ofDimensions, collision, eltDimensions, at,my,offset, positionOptions ) {
				var offsetTop = $within.prop('offsetTop'),
					withinOffset = offsetTop + $within.prop('scrollTop'),
					outerHeight = $within.prop('offsetHeight'),
					collisionPosTop = position - collision.marginTop,
					overTop = collisionPosTop - offsetTop,
					overBottom = collisionPosTop + collision.height - outerHeight - offsetTop,
					top = my[1] === "top", myOffset = top ? -eltDimensions.height : my[1] === "bottom" ? eltDimensions.height : 0,
					atOffset = at[1] === "top" ? ofDimensions.height : at[1] === "bottom" ? -ofDimensions.height : 0,
					offset = -2 * offset[1],
					newOverTop,
					newOverBottom;
				if ( overTop < 0 ) {
					newOverBottom = position + myOffset + atOffset + offset + collision.height - outerHeight - withinOffset;
					if ( ( position + myOffset + atOffset + offset) > overTop && ( newOverBottom < 0 || newOverBottom < Math.abs( overTop ) ) ) {
						positionOptions.flippedTop && positionOptions.flippedTop();
						position += myOffset + atOffset + offset;
					}
				}
				else if ( overBottom > 0 ) {
					newOverTop = position -  collision.marginTop + myOffset + atOffset + offset - offsetTop;
					if ( ( position + myOffset + atOffset + offset) > overBottom && ( newOverTop > 0 || Math.abs( newOverTop ) < overBottom ) ) {
						positionOptions.flippedTop && positionOptions.flippedTop();
						position += myOffset + atOffset + offset;
					}
				}
				return position;
			}
		},
		flipfit: {
			left: function() {
				var args = arguments;
				args[0] = Elt.position.positions.flip.left.apply( this, args );
				return Elt.position.positions.fit.left.apply( this, args );
			},
			top: function() {
				var args = arguments;
				args[0] = Elt.position.positions.flip.top.apply( this, args );
				return Elt.position.positions.fit.top.apply( this, args );
			}
		}
	};
	
})();