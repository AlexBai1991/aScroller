var AScroller = (function (win, doc, undefined) {
	function extend (target, source, isOverwrite) {
		isOverwrite = typeof isOverwrite == 'undefined' ? true : isOverwrite;
		for (var key in source) {
			var value = source[key];
			if (isOverwrite) {
				target[key] = value;
			} else {
				if (!(key in target)) {
					target[key] = value;
				}
			}
		}
		return target;
	}
	var _supportTransform3d = ('WebKitCSSMatrix' in window),
        _supportTouch = ('ontouchstart' in window);
	var _e = {
		start: _supportTouch ? 'touchstart' : 'mousedown',
		move: _supportTouch ? 'touchmove' : 'mousemove',
		end: _supportTouch ? 'touchend' : 'mouseup'
	};
	var Scroller = function (element, opts) {
		var len = [].slice.call(arguments, 1).length,
			defaultOpts = {
				element: null,
				isEase: true
			};

		if (!len) {
			opts = element || {};
			element = null;
		}
		this.opts = extend(opts, defaultOpts, true);
		this.element = element || opts.element;
		if (!this.element) throw new Error('need arguments: element here.');
		if (typeof this.element === 'string') this.element = doc.querySelector(this.element);
		this.con = this.element.querySelector('*');

		this.isTouching = false;
		this.translateY = 0;
		this.newTranslateY = 0;

		// initialize
		this.init();
	};

	Scroller.prototype = {
		init: function () {
			var self = this;
			this.element.addEventListener(_e.start, function (e) { self._handleStart(e); }, false);
			this.element.addEventListener(_e.move, function (e) { self._handleMove(e); }, false);
			this.element.addEventListener(_e.end, function (e) { self._handleEnd(e); }, false);
		},
		_handleStart: function (e) {
			this.isTouching = true;
			this.touchstartY = this._getPage(e, 'pageY');
			this.con.style.webkitTransitionDuration = '0';
		},
		_handleMove: function (e) {
			_supportTouch && e.preventDefault();
			if (this.isTouching) {
				var moveY = this._getPage(e, 'pageY'),
					distanceY = moveY - this.touchstartY;
				this.newTranslateY = this.translateY + distanceY;
				if (this._overRange(this.newTranslateY)) {
					// this.newTranslateY = this._limitY(this.newTranslateY);
				}
				this.con.style.webkitTransform = this._getTranslateY(this.newTranslateY);
			}

		},
		_handleEnd: function (e) {
			this.isTouching = false;
			this.translateY = this.newTranslateY;
			this.con.style.webkitTransitionDuration = '500ms';
			if (this._overRange(this.translateY)) {
				console.log(111);
				console.log(this._limitY(this.translateY));
				this.translateY = this._limitY(this.translateY);
				this.con.style.webkitTransform = 'translate3d(0, '+ this.translateY +'px, 0)';
			}
		},
		_getPage: function (event, attr) {
			return _supportTouch ? event.changedTouches[0][attr] : event[attr]; 
		},
		_getTranslateY: function (y) {
			return _supportTransform3d ? 'translate3d(0, '+ y +'px, 0)' : 'translate(0,'+ y +'px)';
		},
		_overRange: function (y) {
			return y > 0 || y < (this.element.offsetHeight - this.element.scrollHeight);
		},
		_limitY: function (y) {
			var minY = this.element.offsetHeight - this.element.scrollHeight;
			if (y > 0) {
				y = 0;
			} else if (y < minY) {
				y = minY;
			}
			return y;
		}
	};
	return Scroller;
})(window, window.document, void 0);

if (typeof module === 'object' && module.exports) {
	module.exports = AScroller;
} else {
	window.AScroller = AScroller;
}