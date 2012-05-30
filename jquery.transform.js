/*
 *  jquery.transform.js
 *
 *  This file contains a simple jQuery facade to css transformation filters.
 */
/*globals jQuery */
;
(function ($) {

	$.fn.transform = function (options) {
		var $this = $(this),
			opt = $.extend({
				angle: 0,
				vreflect: false,
				hreflect: false,
				zoom: 1
			}, options);
		
		$this.each(function () {
			var $this = $(this),
				data = $this.data();
			
			if (!data.initWidth) {
				$this.data('initWidth', $this.outerWidth());
			}
			if (!data.initHeight) {
				$this.data('initHeight', $this.outerHeight());
			}
			
			doTransform($this, opt);
		});
	};
	
	
	function doTransform($el, options) {
		var angle = options.angle,
			vreflect = options.vreflect,
			hreflect = options.hreflect,
			zoom = options.zoom,
			mozTransform = '',
			webkitTransform = '',
			oTransform = '',
			transform = '',
			msFilter = '',
			filter = '',
			radians = angle * (Math.PI / 180),
			M11 = Math.cos(radians),
			M12 = -Math.sin(radians),
			M21 = Math.sin(radians),
			M22 = Math.cos(radians)
			initWidth = $el.data('initWidth'),
			initHeight = $el.data('initHeight');
		
		if (angle !== 0) {
			mozTransform += 'rotate(' + (angle % 360) + 'deg)';
			webkitTransform += 'rotate(' + (angle % 360) + 'deg)';
			oTransform += 'rotate(' + (angle % 360) + 'deg)';
			transform += 'rotate(' + (angle % 360) + 'deg)';
		}
		
		if (vreflect) {
			mozTransform += ' scaleY(-1)';
			webkitTransform += ' scaleY(-1)';
			oTransform += ' scaleY(-1)';
			transform += ' scaleY(-1)';
			
			// IE flip Image w/ matrix transformation
			M12 = -M12;
			M22 = -M22;
		}
		
		if (hreflect) {
			mozTransform += ' scaleX(-1)';
			webkitTransform += ' scaleX(-1)';
			oTransform += ' scaleX(-1)';
			transform += ' scaleX(-1)';
			
			// IE flip Image w/ matrix transformation
			M11 = -M11;
			M21 = -M21;
		}
		
		// must be last for IE... :/
		if ($.browser.msie && $.browser.version < 9 &&
				(angle !== 0 || hreflect || vreflect)) {
			msFilter += ' progid:DXImageTransform.Microsoft.Matrix(M11=' + M11 + ', M12=' + M12 + ', M21=' + M21 + ', M22=' + M22 + ', SizingMethod=\'auto expand\')';
			filter += ' progid:DXImageTransform.Microsoft.Matrix(M11=' + M11 + ', M12=' + M12 + ', M21=' + M21 + ', M22=' + M22 + ', SizingMethod=\'auto expand\')';
		}
		
		
		
		//handle zoom
		$el.width(initWidth * zoom);
		$el.height(initHeight * zoom);
		
		
		$el.css('-ms-filter', msFilter);
		$el.css('filter', filter);
		$el.css('-moz-transform', mozTransform);
		$el.css('-webkit-transform', webkitTransform);
		$el.css('-o-transform', oTransform);
		$el.css('transform', transform);
		
		if ($.browser.msie) {
			ieOffsetFix($el);
		}
	}
	
	function ieOffsetFix($el) {
		var initWidth = $el.data('initWidth'),
			initHeight = $el.data('initHeight'),
			currentWidth = $el.outerWidth(),
			currentHeight = $el.outerHeight(),
			dx = (currentWidth - initWidth) / 2,
			dy = (currentHeight - initHeight) / 2;
			
		$el.css({
			position: 'relative',
			left: -dx,
			top: -dy
		});
	}
	
}(jQuery));