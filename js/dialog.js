/**
 * @author jerrodz(hehe123)
 * qq: 241728923
 *
 * base by jQuery
 */
(function($, win, doc) {
	var Bsz = {};
	Bsz.util = {};
	Bsz.dom = {};

	Bsz.dom.createElm = function(name, style, opt, className, parent, callback) {
		var elm = document.createElement(name), _style = '', i;
		if (style) {
			for (i in style) {
				elm.style[i] = style[i];
			}
		}
		if (opt) {
			for (i in opt) {
				elm[i] = opt[i];
			}
		}
		elm = $(elm);
		className && elm.addClass(className);
		parent && parent.append(elm);
		callback && callback(elm);
		return elm;
	};
	Bsz.util.dialog = {
		data : {
			layersArr : [],
			layersIds : 0,
			layersIdx : 1000
		},
		/**
		 * opt
		 * 	id 			'' || 'J-dialogs-' + num
		 * 	width		w || 240
		 * 	height		h || 80
		 * 	left		l || center
		 * 	top			t || middle
		 * 	zindex		z || topIndex
		 * 	renderTo	null
		 * 	hadMask		true || false
		 * 	src			''	|| src
		 * 	content		''	|| content
		 * 	title		title || ''
		 * 	move		false || true
		 * 	resize		false || true
		 *  maxWidth	width || documentWidth
		 *  maxHeight	height || documentHeight
		 * 	drag		false || true
		 *  type		dialog || alert || confrim
		 *  hideInit	false || true
		 *
		 */
		_create : function(opts) {

			opts.type = !opts.type ? 'dialog' : opts.type;
			var dd = doc.documentElement;

			var P = this, data = P.data, w = opts.width ? opts.width < 160 ? 160 : opts.width > 800 ? 800 : opts.width : 160, W = w + 20, h = opts.height ? opts.height < 120 ? 120 : opts.height > 480 ? 480 : opts.height : 120, H = h + 20, l = opts.left || ($(doc.body).width() - W) / 2, t = opts.top || (dd.clientHeight - H < 0 ? (dd.clientHeight - h) / 2 : (dd.clientHeight - h) / 2 + Math.max(dd.scrollTop, doc.body.scrollTop)), zindex = opts.zindex || (opts.topest ? 9999999 : data.layersIdx++), Div = Bsz.dom.createElm('div', {
				'width' : W + 'px',
				'height' : H + 'px',
				'zIndex' : zindex,
				'left' : l + 'px',
				'top' : t + 'px'
			}, {
				id : 'J-BszDialog-' + (++data.layersIds)
			}, 'Bsz-dialog'), bg = Bsz.dom.createElm('div', {
				'width' : W + 'px',
				'height' : H + 'px'
			}, null, 'bg', Div), con = Bsz.dom.createElm('div', {
				'width' : w + 'px',
				'height' : h + 'px'
			}, null, 'co', Div), hd = Bsz.dom.createElm('div', null, null, 'hd', con), bd = Bsz.dom.createElm('div', {
				'width' : w + 'px',
				'height' : h - (opts.type == 'dialog' ? 30 : 60) + 'px'
			}, null, 'bd', con), ft = Bsz.dom.createElm('div', {
				'width' : w - 20 + 'px',
				'display' : opts.type == 'dialog' ? 'none' : 'block'
			}, null, 'ft', con);
			var arrUnbind = [], ObjClass = {
				id : 'J-BszDialog-' + data.layersIds,
				view : Div,
				hide : null,
				show : null,
				maskshow : function() {
					ObjClass.view.find('div.bd-mask').show();
					return ObjClass;
				},
				maskhide : function() {
					ObjClass.view.find('div.bd-mask').hide();
					return ObjClass;
				},
				properties : {
					width : W,
					height : H,
					left : l,
					top : t
				},
				buttons : opts.buttons,
				content : opts.src ? null : opts.content,
				hasBottom : /^(alert|confirm|loading)$/.test(opts.type),
				onshow : opts.onshow,
				onhide : opts.onhide,
				remove : null,
				restoreFocus : opts.restoreFocus,
				status : {
					isShow : false,
					removeEverytime : opts.removeEverytime,
					isTopest : opts.topest,
					hasmask : opts.hasMask
				},
				_fnList : {}
			}, Hide;

			ObjClass.hide = P._hide(ObjClass);
			ObjClass.show = P._show(ObjClass);
			ObjClass.remove = P._remove(ObjClass);
			Hide = ObjClass[opts.removeEverytime ? 'remove' : 'hide'];

			data.layersArr.push(ObjClass);
			//P.elms.push(ObjClass); 给予唯一识别号.
			! function HD() {
				var html = ['<span class="title" title="' + opts.title + '" style="width:' + (w - 100) + 'px">' + opts.title + '</span>', !/^loading$/.test(opts.type) ? '<a href="javascript:void(0);" title="关闭">关闭 [×]</a>' : ''].join('');
				hd.html(html);
				if (!/^loading$/.test(opts.type)) {
					hd.find('a').click(function() {
						ObjClass.status.isShow = false;
						Hide();
					});
					arrUnbind.push(function() {
						hd.find('a').unbind('click');
					});
				}
			}(); ! function BD() {
				if (opts.src) {
					bd.html('<iframe frameborder="0" src="' + opts.src + '" width="100%" height="100%"></iframe><div class="bd-mask"></div>');
					var ifr = bd.find('iframe'), mask = bd.find('div.bd-mask');
					ifr.bind('focus', P._onTop).bind('load', P._ifrLoad(mask));
					arrUnbind.push(function() {
						ifr.unbind('focus,load');
					});
				} else {
					var html = ['<div class="bd-main" style="width:' + (w - 20) + 'px;height:' + (h - (opts.type == 'dialog' ? 50 : 80)) + 'px">' + (opts.content || '') + '</div>', '<div class="bd-mask"></div>'].join('');
					bd.html(html);
					var bdm = bd.find('.bd-main'), mask = bd.find('div.bd-mask');
					mask.hide();
				}
			}(); ! function FT() {
				if (/^alert$/.test(opts.type)) {
					ft.html('<a href="javascript:void(0);" title="确定">确定</a>');
					var btn = ft.find('a');
					btn.click(function() {
						ObjClass.status.isShow = false; ObjClass.buttons && ObjClass.buttons[0] && ObjClass.buttons[0](ObjClass);
						Hide();
					});
					arrUnbind.push(function() {
						btn.unbind('click');
					});
				} else if (/^confirm$/.test(opts.type)) {
					var html = ['<a href="javascript:void(0);" actType="continue" title="继续">确定</a>', '<a href="javascript:void(0);" actType="cancel" title="取消">取消</a>'].join('');
					ft.html(html);
					var _continue = ft.find('a[actType=continue]'), _cancel = ft.find('a[actType=cancel]');
					_cancel.click(function() {
						ObjClass.status.isShow = false; ObjClass.buttons && ObjClass.buttons[0] && ObjClass.buttons[0](ObjClass);
						Hide();
					});
					_continue.click(function() {
						ObjClass.status.isShow = false; ObjClass.buttons && ObjClass.buttons[1] && ObjClass.buttons[1](ObjClass);
						Hide();
					});
					arrUnbind.push(function() {
						_cancel.unbind('click');
						_continue.unbind('click');
					});
				}
			}(); ! function DIV() {
				var DocMove = P._docmove(ObjClass, hd), onTop = P._ontop(ObjClass, Div);
				Div.bind('mousedown', onTop);
				hd.bind('mousedown', P._mousedown(ObjClass, DocMove));
				$(doc).bind('mouseup', P._mouseup(ObjClass, DocMove, hd));
				arrUnbind.push(function() {
					hd.unbind('mousedown');
					Div.unbind('mousedown');
				});
				if (opts.initHide) {
					Div.hide();
				} else {opts.hasMask && !Bsz.util.mask.isShow && Bsz.util.mask.show();
					ObjClass.status.isShow = true;
					ObjClass.onshow && ObjClass.onshow(ObjClass.view);
				}
				$(doc.body).append(Div);
			}();
			ObjClass._fnList.unbindList = arrUnbind;
			return ObjClass;
		},
		create : function(opts) {
			var P = this;
			opts.title = opts.title || '';
			opts.content = opts.content || '';
			return P._create(opts);
		},
		_ifrLoad : function(mk) {
			var mask = mk;
			return function() {
				mask.hide();
			};
		},
		_selectstart : function() {
			return false;
		},
		_docmove : function(objclass, elm) {
			var _this = this;
			return function(e) {
				var P = $(this), view = objclass.view, l = e.clientX - objclass.properties.left, t = e.clientY - objclass.properties.top, w = objclass.properties.width, h = objclass.properties.height, H = Math.max(doc.body.clientHeight, doc.documentElement.offsetHeight, doc.body.scrollHeight);
				win.getSelection ? win.getSelection().removeAllRanges() : this.selection.empty();
				this.setCapture && this.setCapture(); l < 0 && ( l = 0); l > P.width() - w && ( l = P.width() - w - ($.browser.msie && /^(8|9)/.test($.browser.version) ? 22 : 0)); t < 0 && ( t = 0); t > H - h && ( t = H - h);
				elm.css('cursor', 'move');
				view.css({
					left : l + 'px',
					top : t + 'px'
				});
				elm.preventDefault && elm.preventDefault();
				return false;
			};
		},
		_mousedown : function(objclass, docmove) {
			var _this = this;
			return function(e) {
				var P = $(this), view = objclass.view, offset = view.offset(), l = objclass.properties.left = offset.left, t = objclass.properties.top = offset.top;

				objclass.status.isDrag = false;
				objclass.properties.left = e.clientX - l;
				objclass.properties.top = e.clientY - t;
				$(doc).bind('mousemove', docmove).bind('selectstart', _this._selectstart);
			};
		},
		_mouseup : function(objclass, docmove, hd) {
			var _this = this;
			return function(e) {
				var P = $(this), view = objclass.view, offset = view.offset();
				hd.css('cursor', 'default');
				objclass.status.isDrag = true;
				objclass.properties.left = offset.left;
				objclass.properties.top = offset.top;
				P.unbind('mousemove', docmove).unbind('selectstart', _this._selectstart);
				this.releaseCapture && this.releaseCapture();
			};
		},
		_show : function(objclass) {
			var _this = this, data = this.data;
			return function(opts) {
				if (!objclass.view[0]) {
					return;
				}
				var view = objclass.view, w = objclass.properties.width, h = objclass.properties.height, l, t, body = $(doc.body), H = Math.max(doc.body.clientHeight, doc.documentElement.offsetHeight, doc.body.scrollHeight), dd = doc.documentElement;
				if ((opts && opts.content !== undefined && opts.content !== objclass.content) || (opts && opts.width !== undefined && opts.width !== objclass.properties.width) || (opts && opts.height !== undefined && opts.height !== objclass.properties.height)) {opts && opts.content !== undefined && opts.content !== objclass.content && (objclass.content = opts.content);
					w = (opts && opts.width !== undefined && (opts.width)) || objclass.properties.width;
					h = (opts && opts.height !== undefined && (opts.height)) || objclass.properties.height; w > 800 && ( w = 800); h > 480 && ( h = 480);
					view.find('div.bg').css({
						width : w + 'px',
						height : h + 'px'
					});
					view.find('div.co').css({
						width : w - 20 + 'px',
						height : h - 20 + 'px'
					});
					view.find('div.bd').css({
						width : w - 20 + 'px',
						height : h - (objclass.hasBottom ? 80 : 50) + 'px'
					});
					objclass.hasBottom && view.find('div.ft').css({
						width : w - 40 + 'px'
					});
					view.find('div.bd-main').css({
						width : w - 40 + 'px',
						height : h - (objclass.hasBottom ? 100 : 70) + 'px'
					}).html(objclass.content);
				}
				l = (opts && opts.left !== undefined && opts.left !== objclass.properties.left) ? opts.left : ((body.width() - w) / 2);
				t = (opts && opts.top !== undefined && opts.top !== objclass.properties.top) ? opts.top : (dd.clientHeight - h < 0 ? (dd.clientHeight - h) / 2 : (dd.clientHeight - h) / 2 + Math.max(dd.scrollTop, doc.body.scrollTop)); l < 0 && ( l = 0); l > body.width() - w && ( l = body.width() - w - ($.browser.msie && /^(8|9)/.test($.browser.version) ? 22 : 0)); t < 0 && ( t = 0); t > H - h && ( t = H - h);
				objclass.status.isShow = true;
				objclass.properties.left = l;
				objclass.properties.top = t;
				objclass.properties.width = w;
				objclass.properties.height = h; opts && opts.hasmask !== undefined && (objclass.status.hasmask = opts.hasmask);
				var act = function() {
					view.css({
						left : l + 'px',
						top : t + 'px',
						width : w + 'px',
						height : h + 'px',
						display : 'block',
						'z-index' : +view.css('zIndex') === data.layersIdx ? data.layersIdx : data.layersIdx += 2
					});
					objclass.maskhide(); opts && opts.title !== undefined && (objclass.title = opts.title, objclass.view.find('div.hd span.title').html(objclass.title)); opts && opts.onshow !== undefined && (objclass.onshow = opts.onshow); opts && opts.onhide !== undefined && (objclass.onhide = opts.onhide); opts && opts.buttons !== undefined ? (objclass.buttons = opts.buttons) : (objclass.buttons = []);
					objclass.onshow && objclass.onshow();
				}; objclass.status.hasmask && !Bsz.util.mask.isShow ? Bsz.util.mask.show(null, null, act) : act();
				return objclass;
			};
		},
		_checkMask : function(id) {
			var P = Bsz.util.dialog, data = P.data, i = 0, arr = data.layersArr, len = arr.length, needToHide = true;
			for (; i < len; i++) {
				var he = arr[i];
				if (he && id !== he.id && he.status.isShow && he.status.hasmask) {
					needToHide = false;
					break;
				}
			}
			return needToHide;
		},
		_hide : function(objclass) {
			var _this = this;
			return function() {
				if (!objclass.view[0]) {
					return;
				}
				var _hide = objclass.status.removeEverytime ? _this._remove(objclass) : function() {
					objclass.view.hide();
					objclass.onhide && objclass.onhide(); objclass.restoreFocus && objclass.restoreFocus[0] && objclass.restoreFocus.focus();
				}
				objclass.status.isShow = false;
				objclass.maskhide();
				if (_this._checkMask(objclass) && Bsz.util.mask.isShow) {
					Bsz.util.mask.hide(null, _hide);
				} else {
					_hide();
				}
				return objclass;
			};
		},
		_remove : function(objclass) {
			var P = this, data = P.data;
			return function() {

				if (!objclass.view[0]) {
					return;
				}
				var arr = objclass._fnList.unbindList, i = 0, len = arr.length;
				for (; i < len; i++) {
					arr[i] && arr[i]();
				}
				function _remove() {
					objclass.view.hide().html('').remove();
				}

				for ( i = 0, arr = data.layersArr, len = arr.length; i < len; i++) {
					if (arr[i] && arr[i].id === objclass.id) {
						data.layersArr.splice(i, 1);
						break;
					}
				}
				if (P._checkMask(objclass) && Bsz.util.mask.isShow) {
					Bsz.util.mask.hide(null, _remove)
				} else {
					_remove();
				}
				objclass.onhide && objclass.onhide();
			};
		},
		_ontop : function(objclass) {
			var _this = this, data = this.data;
			return function() {
				if (objclass.status.topest) {
					return;
				}
				var view = objclass.view, curIdx = data.layersIdx.index;
				if (+view.css('z-index') != curIdx) {
					curIdx = data.layersIdx.index++;
					view.css('z-index', curIdx);
				}
			};
		}
	};
	Bsz.util.alert = function(opts) {
		opts.title = opts.title || '提醒';
		opts.type = 'alert';
		opts.content = opts.content || '';
		return Bsz.util.dialog._create(opts);
	};
	Bsz.util.confirm = function(opts) {
		opts.title = opts.title || '提醒';
		opts.type = 'confirm';
		opts.content = opts.content || '';
		return Bsz.util.dialog._create(opts);
	};
	Bsz.util.loading = function(opts) {
		var P = this, dialog = P.dialog;
		/*
		 * loading 仍然属于dialog的浮层之一
		 */
	};
	/**
	 *  systime record
	 */

	/**
	 *  Class mask
	 *
	 */
	Bsz.util.mask = {
		dom : null,
		timer : null,
		isShow : false,
		create : function() {
			return Bsz.dom.createElm('div', {
				display : 'none',
				position : 'absolute',
				filter : 'alpha(opacity=30)',
				opacity : '0.3',
				background : '#000',
				'z-index' : '999'
			}, null, null, $(doc.body));
		},
		show : function(id, time, onMaskShow) {
			var P = this, isBody = id == null || id == '', time = time || 500, mask;
			if (!P.mask) {
				P.mask = P.create();
			}
			mask = P.mask;
			mask.css( isBody ? {
				width : '100%',
				height : Math.max(doc.body.clientHeight, doc.documentElement.offsetHeight, doc.body.scrollHeight),
				left : 0,
				top : 0,
				right : 0,
				botton : 0
			} : {
				width : id.width() + 'px',
				height : id.outerHeight() + 'px',
				left : id.offset().left + 'px',
				top : id.offset().top + 'px'
			}).fadeIn(time, function() {
				P.isShow = true;
				onMaskShow && onMaskShow();
			});
		},
		hide : function(time, afterMaskHide) {
			var time = time || 500, P = this, mask = P.mask;
			mask.fadeOut(time, function() {
				P.isShow = false;
				afterMaskHide && afterMaskHide();
			});
		}
	};
	win.Bsz = Bsz;
})(jQuery, window, document);
