/************************************************
*   Library: Web 2.0 UI for jQuery
*   - Rich HTML Editor (WYSIWYG)
*   - Dependencies: jQuery, w2utils, w2toolbar
*   - Optional Dependencies: beautify-html.js, CodeMirror
* 
************************************************/

(function ($) {

var obj = {
	name: 			null,		// unique name for w2ui
	box: 			null,		// DOM Element that holds the element
	textarea: 		null, 
	width: 			null,		// reads from textarea
	height: 		null,		// reads from textarea
	toolbar: 		null,
	toolbar2:  		null,
	showSource: 	false, 
	showButtons:    {},
	useCodeMirror:  true,
	useBeautify:    true,
	scriptPath: 	'',
	codeMirror: 	null,
	target: 		null, 		// current target where events dispatched 
	path: 			null, 		// current path in the dom
	charTab:		'&nbsp;&nbsp;&nbsp;&nbsp;',
	maximized: 		false, 
	smallToolbar: 	true,
	readOnly: 		false,
	history: 		[], 		// array for all undo history
	historyMaxLen: 	120, 		// max number of undo history entries
	historyCurrent: 0,			// current undo position in the array
	historyKeyCnt:  0,			// save history only every 5 strokes (this is a counter for it)
	
	focus: function () {
		var editor 	= $('#editor_'+ this.name +' .w2ui-editor-iframe')[0].contentDocument;
		editor.body.focus();	
	},
	
	content: function (html) {
		// set or get content
		if (String(html) == 'undefined') {
			var editor = $('#editor_'+ this.name +' .w2ui-editor-iframe')[0].contentDocument;
			return editor.body.innerHTML;
		} else {
			var editor = $('#editor_'+ this.name +' .w2ui-editor-iframe')[0].contentDocument;
			editor.body.innerHTML = html;
		}
	},
	
	insert: function (html) {
		this.saveUndo();
		var editor 	= $('#editor_'+ this.name +' .w2ui-editor-iframe')[0].contentDocument;
		editor.execCommand('insertHTML', false, html);
	},
		
	saveUndo: function () {		
		this._tmp_save_during_undo = false;
		if (this.history.length -1 != this.historyCurrent) {
			this.history = this.history.slice(0, this.historyCurrent+1);
		}
		this.history.push(this.content()); // save history
		if (this.history.length > this.historyMaxLen) {
			this.history = this.history.slice(this.history.length - this.historyMaxLen);
		}
		this.historyCurrent = this.history.length - 1;
	},
	
	max: function () {
		// save back to textarea
		if (this.textarea != null) {
			$(this.textarea).val(this.content()); 
			$(this.textarea).change();
		} else { 
			this._tmp_content = this.content();
		}
		// --
		this.maximized = !this.maximized;
		this.codeMirror = null;		
		if (this.maximized) {
			$('#w2ui-popup').css('z-Index', 1280); // hide popup
			$('body').append('<div id="editor_full_'+ this.name +'" '+
				'style="-webkit-transform: scale(0.8); opacity: 0.7; -webkit-transition: -webkit-transform 0.3s, opacity 0.3s; '+
				'		position: fixed; z-index: 1290; left: 0px; top: 0px; width: 100%; height: 100%; margin: 0px; padding: 0px;"></div>');
				
			this._old_box 		= this.box;
			this._old_width  	= parseInt($('#editor_'+ this.name +'').css('width'));
			this._old_height 	= parseInt($('#editor_'+ this.name +'').css('height'));
			this._old_css    	= $('#editor_'+ this.name +'')[0].style.cssText;
			this._old_overflow 	= $('body').css('overflow');
			$('body').css('overflow', 'hidden');
						
			this.render($('#editor_full_'+this.name)[0]);
			this.content(this._tmp_content);
			this.resize($(window).width(), $(window).height());
			
			$('#editor_full_'+ this.name +'').css({ '-webkit-transform': 'scale(1)', 'opacity': '1' });
			
			// toolbar
			this.toolbar.set('btn-fullscreen', { img: 'icon-arrow-in', hint: 'Inline mode' });
			if (this.smallToolbar) {
				this.toolbar.show('btn-undo');
				this.toolbar.show('btn-redo');
				this.toolbar.show('btn-break1');
				this.toolbar.show('btn-formating');
				this.toolbar.show('btn-break3');
				//this.toolbar.show('btn-paste');
				this.toolbar.show('btn-source');
				this.toolbar.show('btn-spacing');
				this.toolbar.show('btn-break6');
				this.toolbar.show('btn-indent');
				this.toolbar.show('btn-outdent');
				this.toolbar.show('btn-break7');
				this.toolbar.show('btn-link');
				this.toolbar.show('btn-unlink');
				this.toolbar.uncheck('btn-source');
			}
		} else {
			setTimeout(function () {
				$('#w2ui-popup').css('z-Index', 1600); // show popup
			}, 300);
			$('#editor_full_'+this.name).css({ '-webkit-transform': 'scale(0.7)', 'opacity': '0.7' });
			var obj = this;
			setTimeout(function () {
				obj.width  = null;
				obj.height = null;
				obj.render(obj._old_box);
				obj.content(obj._tmp_content);
				obj.resize(obj._old_width, obj._old_height);
				$('body').css('overflow', obj._old_overflow);
				$('#editor_full_'+obj.name).remove();
				// toolbar
				obj.toolbar.set('btn-fullscreen', { img: 'icon-arrow-out', hint: 'Full screen mode' });
				if (obj.smallToolbar) {
					obj.toolbar.hide('btn-undo');
					obj.toolbar.hide('btn-redo');
					obj.toolbar.hide('btn-break1');
					obj.toolbar.hide('btn-formating');
					obj.toolbar.hide('btn-break3');
					//this.toolbar.hide('btn-paste');
					obj.toolbar.hide('btn-source');
					obj.toolbar.hide('btn-spacing');
					obj.toolbar.hide('btn-break6');
					obj.toolbar.hide('btn-indent');
					obj.toolbar.hide('btn-outdent');
					obj.toolbar.hide('btn-break7');
					obj.toolbar.hide('btn-link');
					obj.toolbar.hide('btn-unlink');
					obj.showSource = false;
				}
			}, 200);
		}
	},
	
	source: function (elem, select) {
		if (String(elem) != 'undefined') this.target = elem;
		if (this.target == null) return false;
		this.toolbar2.enable('btn-paragraph');
		$('#'+ this.name +'_link_properties').hide();
		// build tag tree
		var tmp 	= this.target;
		var tree 	= '';
		this.path 	= [];
		while (true) {
			if (tree != '') tree = ' <span style="font-size: 14px;">' + String.fromCharCode(8594) + '</span> ' + tree;
			var ind = this.path.length;
			this.path[ind] = tmp;
			tree = '<a href="javascript: w2ui[\''+ this.name +'\'].source(w2ui[\''+ this.name +'\'].path[\''+ ind +'\'], true);">&lt;'+ tmp.tagName.toLowerCase() + '&gt;</a>' + tree;
			if (tmp.tagName.toLowerCase() == 'body') { break; }
			tmp = tmp.parentNode; 
			if (!tmp) break;
		}
		$('#editor_'+ this.name +' .w2ui-editor-element-path').html(tree);		
		// -- outerHTML
		var outerHTML = '';
		if (this.target.outerHTML) {
			outerHTML = this.target.outerHTML;
			if (this.target.tagName.toLowerCase() == 'body') outerHTML = '<body>'+ this.target.innerHTML + '</body>';
		} else {  // Firefox
			var attributes = this.target.attributes;
			var attrs = "";
			for (var i = 0; i < attributes.length; i++) {
				if (attributes[i].name == '_moz_dirty') continue;
				if (attributes[i].name == '_moz_resizing') continue;
				if (attributes[i].name == 'contenteditable') continue;
				attrs += " " + attributes[i].name + "=\"" + attributes[i].value + "\"";
			}
			if (this.target.innerHTML == '') {
				outerHTML = "<" + this.target.tagName.toLowerCase() + attrs + " />";
			} else {
				outerHTML = "<" + this.target.tagName.toLowerCase() + attrs + ">" + this.target.innerHTML + "</" + this.target.tagName.toLowerCase() + ">";
			}
			if (this.target.tagName.toLowerCase() == 'body') outerHTML = '<body>'+ this.target.innerHTML + '</body>';
		}
		
		// if beautify if available 
		try {
			outerHTML = style_html(outerHTML, {
		      'indent_size': 4,
		      'indent_char': ' ',
		      'max_char': 140,
		      'brace_style': 'expand',
		      'unformatted': ['a', 'sub', 'sup', 'b', 'i', 'u']
		    });
		} catch (evt) { }
		// if CodeMirror is available
		try {
			var obj = this;
			if (this.codeMirror == null) {
				this.codeMirror = CodeMirror($('#editor_'+ this.name +' div.w2ui-code-mirror')[0], {
					mode:  'text/html',
					indentUnit: 4,
					undoDepth: 120,
					onKeyEvent: function () {
						obj.toolbar2.enable('tb2-undo');
						obj.toolbar2.enable('tb2-apply');
					}
				});
			}
			this.codeMirror.clearHistory();
		} catch(evt) { }
		
		if (this.codeMirror == null) {
			$('#editor_'+ this.name +' .w2ui-editor-source-text textarea').val(outerHTML);
		} else {
			this.codeMirror.setValue(outerHTML);
		}
		
		$('#editor_'+ this.name +' .w2ui-code-mirror')[0].scrollTop = 0;
		$('#editor_'+ this.name +' .w2ui-editor-source-text textarea')[0].scrollTop = 0;
				
		// select element
		if (select === true) this.select(this.target);
		
		this.toolbar2.disable('tb2-undo');
		this.toolbar2.disable('tb2-redo');
	},
	
	iframeClick: function (evt) {
		$(document).click(); // hide drop down
		this.target = evt.target ? evt.target : evt.srcElement;
		this.updateToolbar();
		this.source(this.target, false);
		// link dialog
		var el  = this.target;
		var tmp = null;
		while (true) {
			if (el.tagName.toLowerCase() == 'a') { tmp = el; break; }
			if (el.tagName.toLowerCase() == 'body') { break; }
			el = el.parentNode; if (!el) break;
		}
		if (tmp != null) {
			var left = $(tmp).offset().left + $('#editor_'+ this.name +' .w2ui-editor-iframe').offset().left;
			var top  = $(tmp).offset().top + 
					   (this.maximized ? 31 : $('#editor_'+ this.name +' .w2ui-editor-iframe').offset().top) + 
					   $(tmp).height() + 2 - 
					   $('#editor_'+ this.name +' .w2ui-editor-iframe')[0].contentDocument.body.scrollTop;
			var width  = $(window).width();
			var height = $(window).height();
			// if more then screen width
			if (left + $('#'+ this.name +'_link_properties').width() > width) { 
				left = width - $('#'+ this.name +'_link_properties').width() - 62;
			}
			$('#'+ this.name +'_link_properties').css({
				'left': left + 'px',
				'top': top + 'px'
			}).show();
			$('#'+ this.name +'_link_url').val(tmp.href);
			$('#'+ this.name +'_new_window').attr('checked', tmp.target == '_blank' ? true : false);
		} else {
			$('#'+ this.name +'_link_properties').hide();
		}
	},
	
	iframeKeyDown: function (evt) {
		// save undo
		if (!(evt.keyCode == 16 || evt.keyCode == 17 || evt.keyCode == 18 || evt.keyCode == 91 || 
					((evt.ctrlKey || evt.metaKey) && evt.keyCode == 90) )) { 
			if (this.historyKeyCnt >= 5) { // save every 5 chars
				this.saveUndo();
				this.historyKeyCnt = 0;
			} else {
				this.historyKeyCnt++;
			}
			if (this.toolbar != null && !(evt.ctrKey || evt.metaKey || (evt.ctrlKey || evt.metaKey) && evt.keyCode == 90)) {
				if (this.historyCurrent == 0) this.toolbar.disable('btn-undo'); else this.toolbar.enable('btn-undo');
				if (this.historyCurrent >= this.history.length-1) this.toolbar.disable('btn-redo'); else this.toolbar.enable('btn-redo');
			}
		}
		var editor 	= $('#editor_'+ this.name +' .w2ui-editor-iframe')[0].contentDocument;
		// -- prevent tab
		if (evt.keyCode == 9) { 
			var tmp_target = this.target;
			while (true) {
				var tmp = String(tmp_target.tagName).toLowerCase();
				if ($.inArray(tmp, ['b', 'i', 'u', 'span', 'strike', 'sub', 'sup', 'font']) == -1) break;
				if ($.inArray(tmp, ['body']) != -1) break;
				tmp_target = tmp_target.parentNode;
			}
			
			if (tmp == 'ul' || tmp == 'ol' || tmp == 'li') {
				this.saveUndo();
				if (evt.shiftKey) editor.execCommand('outdent', false, null); else editor.execCommand('indent', false, null);
			} else {
				this.saveUndo();
				editor.execCommand('insertHTML', false, this.charTab);
			}
			evt.preventDefault(); 
			evt.stopPropagation(); 
			return false; 
		}
		// -- present ctrl+s
		if ((evt.ctrlKey || evt.metaKey) && evt.keyCode == 83) { 
			evt.preventDefault(); 
			evt.stopPropagation(); 
			return false; 
		}		
		// -- prevent undo/redo (standard one is too buggy)
		if ((evt.ctrlKey || evt.metaKey) && evt.keyCode == 90) { 
			// manually process
			if (evt.shiftKey) this.tbAction('btn-redo'); else this.tbAction('btn-undo');
			// cancel default
			evt.preventDefault(); 
			evt.stopPropagation(); 
			return false; 
		}
	},
	
	iframeKeyUp: function (evt) {
		// initiate target
		if (getSelection) {
			var sel = $('#editor_'+ this.name +' .w2ui-editor-iframe')[0].contentWindow.getSelection();
			if (sel.getRangeAt) {
				this.target = sel.getRangeAt(0).startContainer.parentElement;
				if (this.target == null || String(this.target) == 'undefined' || String(this.target.tagName).toLowerCase() == 'html') {
					this.target = $('#editor_'+ this.name +' .w2ui-editor-iframe')[0].contentWindow.document.body;
				} 
				this.updateToolbar();
				this.source(this.target, false);
			}
		}		
	},
	
	updateToolbar: function () {
		if (this.readOnly === true) return;
		
		var sel    = $('#editor_'+ this.name +' .w2ui-editor-iframe')[0].contentWindow.getSelection();
		var editor = $('#editor_'+ this.name +' .w2ui-editor-iframe')[0].contentDocument;
		
		// disable
		if (sel == '') {
			this.toolbar.disable('btn-formating');
			this.toolbar.disable('btn-clear');
			this.toolbar.disable('btn-spacing');
			this.toolbar.disable('btn-link');
			this.toolbar.disable('btn-unlink');
		} else {
			this.toolbar.enable('btn-formating');
			this.toolbar.enable('btn-clear');
			this.toolbar.enable('btn-spacing');
			this.toolbar.enable('btn-link');
			this.toolbar.enable('btn-unlink');
		}
		
		// find header
		var el  = this.target;
		var tmp = '';
		while (true) {
			if (el.tagName.toLowerCase() == 'h1') { tmp = 'icon-text-heading1'; break; }
			if (el.tagName.toLowerCase() == 'h2') { tmp = 'icon-text-heading2'; break; }
			if (el.tagName.toLowerCase() == 'h3') { tmp = 'icon-text-heading3'; break; }
			if (el.tagName.toLowerCase() == 'h4') { tmp = 'icon-text-heading4'; break; }
			if (el.tagName.toLowerCase() == 'blockquote') { tmp = 'icon-comment'; break; }
			if (el.tagName.toLowerCase() == 'address') { tmp = 'icon-text-signature'; break; }
			if (el.tagName.toLowerCase() == 'pre') { tmp = 'icon-page-white-code'; break; }
			if (el.tagName.toLowerCase() == 'body') { tmp = 'icon-text-smallcaps'; break; }
			el = el.parentNode; if (!el) break;
		}
		// this.toolbar.set('btn-paragraph', { img: tmp });
		
		// find font
		this.toolbar.set('btn-font', { caption: String($(this.target).css('font-family')).split(',')[0].replace("'", "").replace("'", "") });
		
		// find font size
		this.toolbar.set('btn-size', { caption: $(this.target).css('font-size') });

		// find if bold
		var el  = this.target;
		while (true) {
			if (el.style.fontWeight.toLowerCase() == 'bold') { tmp = true; break; }
			if (el.tagName.toLowerCase() == 'b') { tmp = true; break; }
			if (el.tagName.toLowerCase() == 'html') { tmp = false; break; }
			el = el.parentNode; if (!el) break;
		}
		this.toolbar.set('btn-bold', { checked: tmp });
		
		// find if italic
		var el  = this.target;
		while (true) {
			if (el.style.fontStyle.toLowerCase() == 'italic') { tmp = true; break; }
			if (el.tagName.toLowerCase() == 'i') { tmp = true; break; }
			if (el.tagName.toLowerCase() == 'html') { tmp = false; break; }
			el = el.parentNode; if (!el) break;
		}
		this.toolbar.set('btn-italic', { checked: tmp });
			
		// if selected then bold, italic off
		if (sel != '') {
			this.toolbar.uncheck('btn-bold');
			this.toolbar.uncheck('btn-italic');
		}
		
		// find text color
		var el  = this.target;
		while (true) {
			if (el.style.color != '') { tmp = el.style.color; break; }
			if (el.tagName.toLowerCase() == 'html') { tmp = 'black'; break; }
			el = el.parentNode; if (!el) break;
		}
		this.toolbar.set('btn-color', { caption: '<div id="font_color" style="color: '+ $(this.target).css('color')+'; margin-top: 4px; width: 16px; height: 16px; font-size: 13px; font-weight: bold;">Aa</div>' }); 
		
		// find background color
		var el  = this.target;
		while (true) {
			if (el.style.backgroundColor != '') { tmp = el.style.backgroundColor; break; }
			if (el.tagName.toLowerCase() == 'html') { tmp = 'white'; break; }
			el = el.parentNode; if (!el) break;
		}
		this.toolbar.set('btn-bgcolor', { caption: '<div id=bg_color style="border: 1px solid silver; margin-top: 1px; background-color: '+tmp+'; width: 12px; height: 12px;">&nbsp;</div>' });
			
		// text alignment
		var el  = this.target;
		while (true) {
			if (el.style.textAlign != '') { tmp = el.style.textAlign; break; }
			if (el.tagName.toLowerCase() == 'html') { tmp = 'left'; break; }
			el = el.parentNode; if (!el) break;
		}
		this.toolbar.set('btn-align', { img: 'icon-text-align-'+ tmp.toLowerCase() });
		
		// lists
		var el  = this.target;
		while(true) {
			if (el.tagName.toLowerCase() == 'li') { tmp = el.parentNode; break; }
			if (el.tagName.toLowerCase() == 'html') { tmp = null; break; }
			el = el.parentNode; if (!el) break;
		}
		if (tmp) {
			if (tmp.tagName.toLowerCase() == 'ul') { tmp2 = 'bullets'; }
			if (tmp.tagName.toLowerCase() == 'ol') { tmp2 = 'numbers'; }
			this.toolbar.set('btn-lists', { img: 'icon-text-list-'+ tmp2.toLowerCase() });
		}
	},
		
	link: function (id, param) {
		this.saveUndo();
		// find link
		var el  = this.target;
		var tmp = null;
		while (true) {
			if (el.tagName.toLowerCase() == 'a') { tmp = el; break; }
			if (el.tagName.toLowerCase() == 'body') { break; }
			el = el.parentNode; if (!el) break;
		}
		switch (id) {
			case 'url':
				tmp.href = param;
				break;
			case 'new-win':
				tmp.target = (param ? '_blank' : '');
				break;
			case 'remove':
				this.select(tmp);
				this.tbAction('btn-unlink');
				break;
			case 'goto':
				window.open(tmp.href, '_blank');
				break;
		}
	},
	
	select: function (elem) {
		if (elem == null || String(elem) == 'undefined') return;
		var sel   = window.getSelection();
		var range = document.createRange();
		range.selectNodeContents(elem);
		sel.removeAllRanges();
		sel.addRange(range);
		this.target = elem;
		$('#editor_'+ this.name +' .w2ui-editor-iframe')[0].contentWindow.focus();
		this.updateToolbar();
	},
	
	tbAction: function (id) {
		if (this.toolbar != null && id != 'btn-redo') {
			if (this.historyCurrent == 0) this.toolbar.disable('btn-undo'); else this.toolbar.enable('btn-undo');
			if (this.historyCurrent >= this.history.length-1) this.toolbar.disable('btn-redo'); else this.toolbar.enable('btn-redo');
		}
		$('#'+ this.name +'_link_properties').hide();

		var sel    	= $('#editor_'+ this.name +' .w2ui-editor-iframe')[0].contentWindow.getSelection();
		var editor 	= $('#editor_'+ this.name +' .w2ui-editor-iframe')[0].contentDocument;
		if (sel != '') {
			var tmp		= document.createElement("p"); tmp.appendChild(sel.getRangeAt(0).cloneContents());
			var selHTML = tmp.innerHTML;
		} else {
			var tmp		= '';
			var selHTML = '';
		}
		
		switch (id) {
			case 'btn-undo': // undo
				if (this.historyCurrent == 0) break;
				if (this.historyCurrent == this.history.length - 1 && this._tmp_save_during_undo !== true) {
					this.saveUndo(); 
					this._tmp_save_during_undo = true;
				}
				this.historyCurrent--;
				this.content(this.history[this.historyCurrent]);
				if (this.historyCurrent == 0) this.toolbar.disable('btn-undo'); else this.toolbar.enable('btn-undo');
				if (this.historyCurrent >= this.history.length-1) this.toolbar.disable('btn-redo'); else this.toolbar.enable('btn-redo');
				//var prev = this.content();
				//editor.execCommand('undo', false, null);
				//if (this.content() == prev) { this.toolbar.disable('btn-undo'); }
				//this.toolbar.enable('btn-redo');
				break;
			case 'btn-redo': // redo 
				if (this.historyCurrent >= this.history.length -1) break;
				this.historyCurrent++;
				this.content(this.history[this.historyCurrent]);
				if (this.historyCurrent == 0) this.toolbar.disable('btn-undo'); else this.toolbar.enable('btn-undo');
				if (this.historyCurrent >= this.history.length-1) this.toolbar.disable('btn-redo'); else this.toolbar.enable('btn-redo');
				//var prev = this.content();
				//editor.execCommand('redo', false, null);
				//if (this.content() == prev) { this.toolbar.disable('btn-redo'); }
				//this.toolbar.enable('btn-undo');
				break;
			case 'btn-bold': // bold
				this.saveUndo();
				if (sel == '')  this.select(this.target);
				editor.execCommand('bold', false, null);
				break;
			case 'btn-italic': // italic
				this.saveUndo();
				if (sel == '')  this.select(this.target);
				editor.execCommand('italic', false, null);
				break;
			case 'btn-clear': // clear formating
				this.saveUndo();
				//var txt = sel.getRangeAt(0).toString();
				//editor.execCommand('insertHTML', false, txt);
				editor.execCommand('removeFormat', false, null);
				break;
			case 'btn-source': // source
				this.showSource = !this.showSource;
				this.resize();
				if (this.showSource) this.toolbar.check('btn-source'); else this.toolbar.uncheck('btn-source');
				break;
			case 'btn-indent': // indent
				this.saveUndo();
				if (sel == '')  this.select(this.target);
				editor.execCommand('outdent', false, null);
				break;
			case 'btn-outdent': // outdent
				this.saveUndo();
				if (sel == '')  this.select(this.target);
				editor.execCommand('indent', false, null);
				break;
			case 'btn-link': // link
				this.saveUndo();
				var link = prompt('Please type a link:', 'http://');
				editor.execCommand('createLink', false, link);
				break;
			case 'btn-unlink': // unlink
				this.saveUndo();
				editor.execCommand('unlink', false, null);
				break;
			case 'btn-fullscreen': // full screen
				this.max();
				break;
		}
		editor.body.focus();
		this.source();
		
		// save back to textarea
		if (this.textarea != null) { $(this.textarea).val(this.content()); $(this.textarea).change(); }
	},

	fontAction: function (id, el) {
		if (this.toolbar != null && id != 'btn-redo') {
			if (this.historyCurrent == 0) this.toolbar.disable('btn-undo'); else this.toolbar.enable('btn-undo');
			if (this.historyCurrent >= this.history.length-1) this.toolbar.disable('btn-redo'); else this.toolbar.enable('btn-redo');
		}
		// this.toolbar.doDropOut();
		$(document).click();
		$('#'+ this.name +'_link_properties').hide();
		
		var sel    	= $('#editor_'+ this.name +' .w2ui-editor-iframe')[0].contentWindow.getSelection();
		var editor 	= $('#editor_'+ this.name +' .w2ui-editor-iframe')[0].contentDocument;
		if (sel != '') {
			var tmp		= document.createElement("p"); tmp.appendChild(sel.getRangeAt(0).cloneContents());
			var selHTML = tmp.innerHTML;
		} else {
			var tmp		= '';
			var selHTML = '';
		}
		
		switch (id) {
			case 'head': // paragraph
				this.saveUndo();
				if (sel == '') this.select(this.target);
				if (el.indexOf('Normal') != -1)	  { editor.execCommand('formatBlock', false, '<p>'); tmp = 'icon-text'; }
				if (el.indexOf('Quote') != -1)    { editor.execCommand('formatBlock', false, '<blockquote>'); tmp = 'icon-text'; }
				if (el.indexOf('Address') != -1)  { editor.execCommand('formatBlock', false, '<address>'); tmp = 'icon-text'; }
				if (el.indexOf('Pre') != -1)      { editor.execCommand('formatBlock', false, '<pre>'); tmp = 'icon-text'; }
				if (el.indexOf('Header 1') != -1) { editor.execCommand('formatBlock', false, '<h1>'); tmp = 'icon-text'; }
				if (el.indexOf('Header 2') != -1) { editor.execCommand('formatBlock', false, '<h2>'); tmp = 'icon-text'; }
				if (el.indexOf('Header 3') != -1) { editor.execCommand('formatBlock', false, '<h3>'); tmp = 'icon-text'; }
				if (el.indexOf('Header 4') != -1) { editor.execCommand('formatBlock', false, '<h4>'); tmp = 'icon-text'; }
				console.log(el);
				// this.toolbar.set('btn-paragraph', { icon: tmp });
				break;			
			case 'font': 
				this.saveUndo();
				// if no selection, then select target
				if (sel == '') {
					this.select(this.target);
					var sel    	= $('#editor_'+ this.name +' .w2ui-editor-iframe')[0].contentWindow.getSelection();
					var tmp		= document.createElement("p"); tmp.appendChild(sel.getRangeAt(0).cloneContents());
					var selHTML = tmp.innerHTML;
				}
				//editor.execCommand('insertHTML', false, '<span style="font-family: '+ el +'">'+ selHTML +'</span>');
				editor.execCommand('fontName', false, el);
				this.toolbar.set('btn-font', { caption: el });
				break;
			case 'size': 
				this.saveUndo();
				// if no selection, then select target
				if (sel == '') {
					this.select(this.target);
					var sel    	= $('#editor_'+ this.name +' .w2ui-editor-iframe')[0].contentWindow.getSelection();
					var tmp		= document.createElement("p"); tmp.appendChild(sel.getRangeAt(0).cloneContents());
					var selHTML = tmp.innerHTML;
				}
				editor.execCommand('insertHTML', false, '<span style="font-size: '+ el +'">'+ selHTML +'</span>');
				//editor.execCommand('fontName', false, 'Arial');
				//top.editor_focusElem.firstChild.fontFamily = 'inherit';
				//top.editor_focusElem.firstChild.fontSize	= el;
				this.toolbar.set('btn-size', { caption: el });
				break;
			case 'color': 
				this.saveUndo();
				if (sel == '') this.select(this.target);
				editor.execCommand('foreColor', false, el);
				//editor.execCommand('insertHTML', false, '<span style="color: '+ el +'">'+ selHTML +'</span>');
				this.toolbar.set('btn-color', { caption: '<div id=font_color style="color: '+el+'; margin-top: 4px; width: 16px; height: 16px; font-size: 13px; font-weight: bold;">Aa</div>' });
				break;
			case 'bgcolor': 
				this.saveUndo();
				if (sel == '') this.select(this.target);
				editor.execCommand('hiliteColor', false, el);
				//editor.execCommand('insertHTML', false, '<span style="background-color: '+ el +'">'+ selHTML +'</span>');
				this.toolbar.set('btn-bgcolor', { caption: '<div id=bg_color style="border: 1px solid silver; margin-top: 1px; background-color: '+el+'; width: 12px; height: 12px;">&nbsp;</div>' });
				break;
			case 'para': // alignment
				this.saveUndo();
				if (sel == '') this.select(this.target);
				if (el == 'Left')	  editor.execCommand('justifyLeft', false, null);
				if (el == 'Right')	  editor.execCommand('justifyRight', false, null);
				if (el == 'Center')	  editor.execCommand('justifyCenter', false, null);
				if (el == 'Justify')  editor.execCommand('justifyFull', false, null);
				this.toolbar.set('btn-align', { img: 'icon-text-align-'+ el.toLowerCase() });
				break;
			case 'list': // lists
				this.saveUndo();
				if (sel == '') this.select(this.target);
				var tag;
				var obj = this;
				var tmp_target = obj.target;
				if (tmp_target == null) tmp_target = editor.body;
				while (true) {
					var tmp = String(tmp_target.tagName).toLowerCase();
					if ($.inArray(tmp, ['li', 'body']) !== -1) break;
					tmp_target = tmp_target.parentNode;
				}

				if (el.indexOf('Bullets') != -1) tag = 'ol'; else tag = 'ul';
				if (el == 'Remove List') {
					editor.execCommand('outdent', false, null);
					break;
				}
				
				function applyList(type) {
					if (tmp == 'body' || (tmp_target.parentNode && String(tmp_target.parentNode.tagName).toLowerCase() == tag)) {
						if (tag == 'ul') editor.execCommand('insertOrderedList', false);
						if (tag == 'ol') editor.execCommand('insertUnorderedList', false);
						// obj.iframeKeyUp(); 			// uncommented this will cause infinite loop when inserting in 
						// obj.fontAction(id, type);	// newly created document
						//return;
					} 
					type = String(w2utils.stripTags(
							type.replace('Bullets (', '')
								.replace('Bullets', '')
								.replace(')', '')								
								.replace(' ', '-')
							)
						).split(' ')[0].replace('-(1,2,3,...', '');
					if (type == 'Numbers') type = 'Decimal';

					var tmp_el = editor.getSelection();
					if (tmp_el) {
						tmp_el.baseNode.parentNode.parentNode.style.listStyleType = type;
					} else {
						if (tmp_target.parentNode) tmp_target.parentNode.style.listStyleType = type;
					}
				}
				applyList(el);				
				//this.toolbar.set('btn-lists', { img 'icon-text-list-'+ el.toLowerCase() });
				break;
			case 'extra': // extra formating		
				this.saveUndo();
				if (sel == '') this.select(this.target);
				if (el == 'Underline')  	editor.execCommand('underline', false, null);
				if (el == 'Strikethrough')  editor.execCommand('strikethrough', false, null);
				if (el == 'Superscript')  	editor.execCommand('superscript', false, null);
				if (el == 'Subscript')  	editor.execCommand('subscript', false, null);
				break;
			case 'linespacing':
				this.saveUndo();
				// if no selection, then select target
				if (sel == '') {
					this.select(this.target);
					var sel    	= $('#editor_'+ this.name +' .w2ui-editor-iframe')[0].contentWindow.getSelection();
					var tmp		= document.createElement("p"); tmp.appendChild(sel.getRangeAt(0).cloneContents());
					var selHTML = tmp.innerHTML;
				}
				el = el.replace('&nbsp;', '')
				el = el.replace('&nbsp;', '')
				editor.execCommand('insertHTML', false, '<span style="line-height: '+ el +'">'+ selHTML +'</span>');
				break;
			case 'letterspacing':
				this.saveUndo();
				// if no selection, then select target
				if (sel == '') {
					this.select(this.target);
					var sel    	= $('#editor_'+ this.name +' .w2ui-editor-iframe')[0].contentWindow.getSelection();
					var tmp		= document.createElement("p"); tmp.appendChild(sel.getRangeAt(0).cloneContents());
					var selHTML = tmp.innerHTML;
				}
				el = el.replace('&nbsp;', '')
				el = el.replace('&nbsp;', '')
				editor.execCommand('insertHTML', false, '<span style="letter-spacing: '+ el +'">'+ selHTML +'</span>');
				break;
		}
		editor.body.focus();
		this.source();
		
		// save back to textarea
		if (this.textarea != null) { $(this.textarea).val(this.content()); $(this.textarea).change(); }
	},

	tb2Action: function (id) {
		// init undo/redo
		if (this.toolbar != null) { 
			if (this.historyCurrent == 0) this.toolbar.disable('btn-undo'); else this.toolbar.enable('btn-undo');
			if (this.historyCurrent >= this.history.length-1) this.toolbar.disable('btn-redo'); else this.toolbar.enable('btn-redo');
		}
		if (this.toolbar2 != null && id != 'tb2-redo') {
			this.toolbar2.enable('tb2-undo');
			this.toolbar2.disable('tb2-redo');				
		}
		// this.toolbar2.doDropOut();
		$(document).click();
		
		var sel    	= $('#editor_'+ this.name +' .w2ui-editor-iframe')[0].contentWindow.getSelection();
		var editor 	= $('#editor_'+ this.name +' .w2ui-editor-iframe')[0].contentDocument;
		if (sel != '') {
			var tmp		= document.createElement("p"); tmp.appendChild(sel.getRangeAt(0).cloneContents());
			var selHTML = tmp.innerHTML;
		} else {
			var tmp		= '';
			var selHTML = '';
		}
		
		switch (id) {
			
			case 'tb2-undo': // undo
				this.codeMirror.undo();
				if (this.codeMirror.historySize().undo <= 1) this.toolbar2.disable('tb2-undo'); else this.toolbar2.enable('tb2-undo');
				if (this.codeMirror.historySize().redo <= 0) this.toolbar2.disable('tb2-redo'); else this.toolbar2.enable('tb2-redo');
				break;
				
			case 'tb2-redo': // redo 
				this.codeMirror.redo();
				if (this.codeMirror.historySize().undo <= 1) this.toolbar2.disable('tb2-undo'); else this.toolbar2.enable('tb2-undo');
				if (this.codeMirror.historySize().redo <= 0) this.toolbar2.disable('tb2-redo'); else this.toolbar2.enable('tb2-redo');
				break;
				
			case 'tb2-apply':  // apply
				this.saveUndo();
				if (sel == '') this.select(this.target);
				if (this.codeMirror == null) {
					var txt = $('#editor_'+ this.name +' .w2ui-editor-source-text textarea').val() + ' ';
				} else {
					var txt = this.codeMirror.getValue() + ' ';
				}
				// get tag, attr, and innerHTML
				var pos1 = txt.indexOf('<');
				var pos2 = txt.indexOf('>', pos1);
				var pos3 = txt.indexOf(' ', pos1);
				var pos4 = txt.lastIndexOf('</');				
				var innerHTML = txt.substr(pos2+1, pos4-pos2-1);
				var tag  = txt.substr(pos1 + 1, pos2 - pos1 -1);
				if (pos3 < pos2) tag = txt.substr(pos1 + 1, pos3 - pos1 - 1);
				var attr = '';
				if (pos3 < pos2) attr = txt.substr(pos3, pos2 - pos3);
				txt = $.trim(txt);
				
				if (tag.toLowerCase() == 'body') {
					if (attr != '') alert('Cannot apply attributes for the <body> tag. If you define them, they will be ignored.');
					$(editor).find('body').html(innerHTML);
				} else {
					$(this.target).before(txt);
					$(this.target).remove();
				}

				// clear source
				if (this.codeMirror == null) {
					$('#editor_'+ this.name +' .w2ui-editor-source-text textarea').val('');
				} else {
					this.codeMirror.setValue('');
				}
				$('#editor_'+ this.name +' .w2ui-editor-element-path').html('');
				
				this.toolbar2.disable('tb2-undo');
				this.toolbar2.disable('tb2-redo');
				this.toolbar2.disable('tb2-apply');
				
				// save back to textarea
				if (this.textarea != null) { $(this.textarea).val(this.content()); $(this.textarea).change(); }
				break;
		}
		return;
	},	
	
	initToolbars: function () {		
		
		// function to build menu
		function buildMenu (items, action) {
			var html = '<table cellpadding=1 cellspacing=0 style="padding: 4px 0px;">';
			for (var i in items) {
				if (items[i] == 'break') {
					html += "<tr><td colspan=2><div style=\"padding: 10px 5px 0px 5px; border-top: 1px solid silver;\"></div></td></tr>";
				} else {
					var tmp = String(items[i]).split('|');
					html += "<tr onmouseover=\"this.style.backgroundColor = '#d8e4f3';\" onmouseout=\"this.style.backgroundColor = '';\" onclick=\""+ action +"\">"+
							"	<td style=\"cursor: default; text-align: left; padding: 8px; padding-right: 2px; color: #8E95A1\">"+
							"		<div class=\""+ (tmp[0].substr(0,1) == '-' ? '' : 'icon-font ' + tmp[0]) +"\" style=\"font-size: 12px !important\">"+ (tmp[0].substr(0,1) == '-' ? tmp[0].substr(1) : '') +"</div>"+
							"</td>"+
							"	<td style=\"cursor: default; text-align: left; padding: 8px 15px 8px 2px;\"> "+ tmp[1] +"</td>"+
							"</tr>";
				}
			}
			html += '</table>';
			return html;
		}
		
		var paragraph_html = buildMenu(['-Tx|Normal', '-H1|Header 1', '-H2|Header 2', 
			'-H3|Header 3', '-H4|Header 4', '-" "|Quote', '-Ad|Address',
			'-&lt;/&gt;|Preformated'], "w2ui['"+ this.name +"'].fontAction('head', w2utils.stripTags(this.innerHTML));");
					
		// -- fonts
		var fonts = ['Arial', 'Comic Sans MS', 'Courier New', 'Franklin Gothic Medium', 'Garamond', 'Georgia', 'Impact', 'Kartika', 
					'Lucida Grande', 'Microsoft Sans Serif', 'Myriad Pro', 'Verdana', 'Serif', 'Tahoma', 'Times', 'Times New Roman'];
		var fonts_html = "<table celpadding=0 cellspacing=0 style=\"text-align: left; padding-top: 5px;\">";
		for (var f in fonts) { 
			fonts_html += "<tr><td style=\"cursor: default; padding: 4px 10px !important; font-family: "+ fonts[f] +";\" "+
						  " onmouseover=\"this.style.backgroundColor = '#d8e4f3';\" onmouseout=\"this.style.backgroundColor = '';\" "+
						  " onclick=\"w2ui['"+ this.name +"'].fontAction('font', this.innerHTML)\">"+ fonts[f] +"</td></tr>"; 
		}	
		fonts_html += "<tr><td><input style=\"margin: 5px 9px 5px 9px; font-size: 11px; "+
					  "	 border: 1px solid #e9e9f5; background-color: #fbfbfc; padding: 2px; width: 140px;\" "+
					  "  type=text onchange=\"w2ui['"+ this.name +"'].fontAction('font', this.value)\"></td></tr>";
		fonts_html += "</table>";		
		
		// -- font size
		var sizes = ['8px', '9px', '10px', '11px', '12px', '13px', '14px', '16px', '18px', '20px', '24px', '28px', '36px', '44px', '52px'];
		var fonts_size = "<table cellpadding=0 cellspacing=0 style=\"text-align: left; padding-top: 5px;\">";
		for (var s in sizes) { 
			fonts_size += "<tr><td style=\"cursor: default; padding: 4px 10px !important; font-size: 11px;\" "+
						  " onmouseover=\"this.style.backgroundColor = '#d8e4f3';\" onmouseout=\"this.style.backgroundColor = '';\" "+
						  " onclick=\"w2ui['"+ this.name +"'].fontAction('size', '"+ sizes[s] +"')\">"+ sizes[s] +"</td></tr>";
						  " onclick=\"w2ui['"+ this.name +"'].fontAction('size', '"+ sizes[s] +"')\">"+ sizes[s] +"</td></tr>";
		}
		fonts_size += "<tr><td><input style=\"margin: 1px 5px 3px 5px; font-size: 11px; "+
					  "	 border: 1px solid #e9e9f5; background-color: #fbfbfc; padding: 2px; width: 31px;\" "+
					  "  type=text onchange=\"w2ui['"+ this.name +"'].fontAction('size', this.value)\"></td></tr>";
		fonts_size += "</table>";
		
		// -- colors
		var colors = [['rgb(255, 255, 255)', 'rgb(204, 204, 204)', 'rgb(192, 192, 192)', 'rgb(153, 153, 153)', 'rgb(102, 102, 102)', 'rgb(51, 51, 51)', 'rgb(0, 0, 0)'],
			  ['rgb(255, 204, 204)', 'rgb(255, 102, 102)', 'rgb(255, 0, 0)', 'rgb(204, 0, 0)', 'rgb(153, 0, 0)', 'rgb(102, 0, 0)', 'rgb(51, 0, 0)'],
			  ['rgb(255, 204, 153)', 'rgb(255, 153, 102)', 'rgb(255, 153, 0)', 'rgb(255, 102, 0)', 'rgb(204, 102, 0)', 'rgb(153, 51, 0)', 'rgb(102, 51, 0)'],
			  ['rgb(255, 255, 153)', 'rgb(255, 255, 102)', 'rgb(255, 204, 102)', 'rgb(255, 204, 51)', 'rgb(204, 153, 51)', 'rgb(153, 102, 51)', 'rgb(102, 51, 51)'],
			  ['rgb(255, 255, 204)', 'rgb(255, 255, 51)', 'rgb(255, 255, 0)', 'rgb(255, 204, 0)', 'rgb(153, 153, 0)', 'rgb(102, 102, 0)', 'rgb(51, 51, 0)'],
			  ['rgb(153, 255, 153)', 'rgb(102, 255, 153)', 'rgb(51, 255, 51)', 'rgb(51, 204, 0)', 'rgb(0, 153, 0)', 'rgb(0, 102, 0)', 'rgb(0, 51, 0)'],
			  ['rgb(153, 255, 255)', 'rgb(51, 255, 255)', 'rgb(102, 204, 204)', 'rgb(0, 204, 204)', 'rgb(51, 153, 153)', 'rgb(51, 102, 102)', 'rgb(0, 51, 51)'],
			  ['rgb(204, 255, 255)', 'rgb(102, 255, 255)', 'rgb(51, 204, 255)', 'rgb(51, 102, 255)', 'rgb(51, 51, 255)', 'rgb(0, 0, 153)', 'rgb(0, 0, 102)'],
			  ['rgb(204, 204, 255)', 'rgb(153, 153, 255)', 'rgb(102, 102, 204)', 'rgb(102, 51, 255)', 'rgb(102, 0, 204)', 'rgb(51, 51, 153)', 'rgb(51, 0, 153)'],
			  ['rgb(255, 204, 255)', 'rgb(255, 153, 255)', 'rgb(204, 102, 204)', 'rgb(204, 51, 204)', 'rgb(153, 51, 153)', 'rgb(102, 51, 102)', 'rgb(51, 0, 51)']];
		var fcolor = '<table cellpadding=0 cellspacing=3 style="text-align: left; padding: 5px;">';
		for (var i=0; i<9; i++) {
			fcolor += '<tr>';
			for (var j=0; j<7; j++) {
				fcolor += '<td><div onclick="w2ui[\''+ this.name +'\'].fontAction(\'color\', \''+ colors[i][j] +'\')" '+
						  ' onmouseover="this.style.cssText += \'border: 1px solid black;\'" onmouseout="this.style.cssText += \'border: 1px solid silver;\'" '+
						  '	style="padding: 1px margin: 1px; border: 1px solid silver; width: 16px; height: 16px; background-color: '+ colors[i][j] +'">&nbsp;</div></td>';
			}
			fcolor += '</tr>';
		}
		fcolor += "<tr><td colspan=3><input onkeyup=\"document.getElementById('fcolor_preview').style.backgroundColor = this.value;\" "+
				  "style=\"margin: 3px 1px 3px 1px; font-size: 11px; border: 1px solid #e9e9f5; background-color: #fbfbfc; padding: 2px; width: 58px;\" "+
				  "  type=text onchange=\"w2ui['"+ this.name +"'].fontAction('color', this.value)\"></td>"+
				  "<td colspan=4><div id=\"fcolor_preview\" style=\"margin: 2px; width: 75px; height: 16px;\">&nbsp;</div></td>"+
				  "</tr>";
		fcolor += '</table>';
		var bcolor = '<table cellpadding=0 cellspacing=3 style="text-align: left; padding: 5px;">';
		for (var i=0; i<9; i++) {
			bcolor += '<tr>';
			for (var j=0; j<7; j++) {
				bcolor += '<td><div onclick="w2ui[\''+ this.name +'\'].fontAction(\'bgcolor\', \''+ colors[i][j] +'\')" '+
						  ' onmouseover="this.style.cssText += \'border: 1px solid black;\'" onmouseout="this.style.cssText += \'border: 1px solid silver;\'" '+
						  '	style="margin: 2px; border: 1px solid silver; width: 16px; height: 16px; background-color: '+ colors[i][j] +'">&nbsp;</div></td>';
			}
			bcolor += '</tr>';
		}
		bcolor += "<tr><td colspan=3><input onkeyup=\"document.getElementById('bcolor_preview').style.backgroundColor = this.value;\" "+
				  "style=\"margin: 3px 1px 3px 1px; font-size: 11px; border: 1px solid #e9e9f5; background-color: #fbfbfc; padding: 2px; width: 58px;\" "+
				  "  type=text onchange=\"w2ui['"+ this.name +"'].fontAction('bgcolor', this.value)\"></td>"+
				  "<td colspan=4><div id=\"bcolor_preview\" style=\"margin: 2px; width: 75px; height: 16px;\">&nbsp;</div></td>"+
				  "</tr>";
		bcolor += '</table>';
		
		// -- paragraph align
		var paragraph2_html = buildMenu(['-|Left', '-|Center', '-|Right', 
			'-|Justify'], "w2ui['"+ this.name +"'].fontAction('para', w2utils.stripTags(this.innerHTML));");
			
		// -- lists
		var list_html = buildMenu(['icon-list-numbers|Numbers <span style="color: #666"></span>',
			'icon-list-numbers|Lower Latin <span style="color: #666">(a,b,c,...)</span>', 
			'icon-list-numbers|Upper Latin <span style="color: #666">(A,B,C,...)</span>',
			'icon-list-numbers|Lower Roman <span style="color: #666">(i,ii,iii,...)</span>', 
			'icon-list-numbers|Upper Roman <span style="color: #666">(I,II,III,...)</span>',
			'icon-list-numbers|Lower Greek <span style="color: #666">(&#945;,&#946;,&#947;,...)</span>', 
			'icon-list-numbers|Upper Greek <span style="color: #666">(&#913;,&#914;,&#915;,...)</span>',
			'break',
		 	'icon-list-bullets|Bullets', 
		 	'icon-list-bullets|Bullets (circle)', 
			'icon-list-bullets|Bullets (disc)', 'icon-list-bullets|Bullets (square)',
			'break', 
			'icon-trash|Remove List'], 
			"w2ui['"+ this.name +"'].fontAction('list', w2utils.stripTags(this.innerHTML));");

		// -- paragraph
		var tmp2 = "style=\"cursor: pointer; padding: 5px 10px !important;\" onmouseover=\"this.style.backgroundColor = '#d8e4f3';\" "+
				   "	onmouseout=\"this.style.backgroundColor = '';\" onclick=\"w2ui['"+ this.name +"'].fontAction('linespacing', w2utils.stripTags(this.innerHTML));\"";
		var tmp3 = "style=\"cursor: pointer; padding: 5px 10px !important;\" onmouseover=\"this.style.backgroundColor = '#d8e4f3';\" "+
				   "	onmouseout=\"this.style.backgroundColor = '';\" onclick=\"w2ui['"+ this.name +"'].fontAction('letterspacing', w2utils.stripTags(this.innerHTML));\"";
		var line_html = '<table cellpadding=0 cellspacing=0 style="text-align: left; padding-top: 5px;\">'+
			'<tr><td style=\"padding: 5px 10px;\"><b>Line Height</b></td></tr>'+
			'<tr><td '+tmp2+'>&nbsp;&nbsp;90%</td></tr>'+
			'<tr><td '+tmp2+'>&nbsp;&nbsp;100%</td></tr>'+
			'<tr><td '+tmp2+'>&nbsp;&nbsp;125%</td></tr>'+
			'<tr><td '+tmp2+'>&nbsp;&nbsp;150%</td></tr>'+
			'<tr><td '+tmp2+'>&nbsp;&nbsp;200%</td></tr>'+
			"<tr><td><input style=\"margin: 0px 5px 3px 12px; font-size: 11px; "+
					  "	 border: 1px solid #e9e9f5; background-color: #fbfbfc; padding: 2px; width: 40px;\" "+
					  "  type=text onchange=\"w2ui['"+ this.name +"'].fontAction('linespacing', this.value);\"></td></tr>"+
			'<tr><td style=\"padding: 5px 10px;\"><b>Letter Spacing</b></td></tr>'+
			'<tr><td '+tmp3+'>&nbsp;&nbsp;0px</td></tr>'+
			'<tr><td '+tmp3+'>&nbsp;&nbsp;1px</td></tr>'+
			'<tr><td '+tmp3+'>&nbsp;&nbsp;2px</td></tr>'+
			'<tr><td '+tmp3+'>&nbsp;&nbsp;3px</td></tr>'+
			'<tr><td '+tmp3+'>&nbsp;&nbsp;4px</td></tr>'+
			"<tr><td><input style=\"margin: 0px 5px 3px 12px; font-size: 11px; "+
					  "	 border: 1px solid #e9e9f5; background-color: #fbfbfc; padding: 2px; width: 40px;\" "+
					  "  type=text onchange=\"w2ui['"+ this.name +"'].fontAction('letterspacing', this.value);\"></td></tr>"+
			'</table>';
			
		// -- underline
		var extra_html = buildMenu(['-|Underline', '-|Strikethrough', '-|Subscript', 
			'-|Superscript'], "w2ui['"+ this.name +"'].fontAction('extra', w2utils.stripTags(this.innerHTML));");

		// multi-purpose drop	
		var drop = 
			"<div style='position: absolute;'>"+
			"	<div style='position: relative; margin-top: 14px; margin-left: 10px;'>"+
			"		<div id='"+ this.name +"_drop' style='padding: 3px; display: none; position: absolute; z-Index: 100; "+
			"				background-color: #f7f7f7; border: 1px solid #e1e1e1; border: 1px solid silver; border-top: 0px;'>111</div>"+
			"	</div>"+
			"</div>"+
			"<div id='"+ this.name + "_link_properties' class='w2ui-link-properties'>"+
			"	Link: <input id='"+ this.name + "_link_url' onchange=\"w2ui['"+ this.name +"'].link('url', this.value)\" type='text' size='30'> "+
			"	<input id='"+ this.name +"_new_window' type='checkbox' onchange=\"w2ui['"+ this.name +"'].link('new-win', this.checked)\" /> <label for='"+ this.name +"_new_window'>New Window</label>"+
			"	<input id='"+ this.name +"_goto' type='button' onclick=\"var obj = w2ui['"+ this.name +"'].link('goto')\" value='Go to Link'>"+
			"	<input id='"+ this.name +"_remove' type='button' onclick=\"var obj = w2ui['"+ this.name +"'].link('remove')\" value='Remove Link'>"+
			"</div>";
			
		// build toolbar
		var obj = this;
		if (w2ui[this.name + '_toolbar'] != null) {
			w2ui[this.name + '_toolbar'].destroy();
		}
		this.toolbar = $().w2toolbar({
			name: this.name + '_toolbar',
			items: [
				{ type: 'html',   id: 'btn-html', html: drop, hidden: true },
				{ type: 'button', id: 'btn-undo', icon: 'icon-undo', hint: 'Undo' },
				{ type: 'button', id: 'btn-redo', icon: 'icon-redo', hint: 'Redo', disabled: true },
				{ type: 'break',  id: 'btn-break1' },
				{ type: 'drop',   id: 'btn-paragraph', icon: 'icon-text', html: paragraph_html, hint: 'Paragraph' },
				{ type: 'drop',   id: 'btn-font', caption: 'Times', html: fonts_html, hint: 'Text font' },
				{ type: 'drop',   id: 'btn-size', caption: '16px', html: fonts_size, hint: 'Text size' },
				{ type: 'break',  id: 'btn-break2' },
				{ type: 'check',  id: 'btn-bold', icon: 'icon-bold', hint: 'bold' },
				{ type: 'check',  id: 'btn-italic', icon: 'icon-italic', hint: 'italic' },
				{ type: 'drop',   id: 'btn-formating', icon: 'icon-star-empty', html: extra_html, hint: 'Extra formating' },
				{ type: 'break',  id: 'btn-break3' },
				{ type: 'drop',   id: 'btn-color', caption: '<div id="font_color style="color: black; margin-top: 4px; width: 16px; height: 16px; font-size: 13px; font-weight: bold;">Aa</div>', html: fcolor, hint: 'Text color' },
				{ type: 'drop',   id: 'btn-bgcolor', caption: '<div id="bg_color" style="border: 1px solid silver; margin-top: 1px; background-color: white; width: 13px; height: 13px;">&nbsp;</div>', html: bcolor, hint: 'Background color' },
				{ type: 'break',  id: 'btn-break4' },
				{ type: 'button', id: 'btn-paste', icon: 'icon-paste', hint: 'Paste from Word', hidden: true },
				{ type: 'button', id: 'btn-clear', icon: 'icon-trash', hint: 'Clear text formating' },
				{ type: 'check',  id: 'btn-source', icon: 'icon-file-xml', hint: 'Show HTML source' },
				{ type: 'break',  id: 'btn-break5' },
				{ type: 'drop',   id: 'btn-align', icon: 'icon-align-left', html: paragraph2_html, hint: 'Paragraph alignment' },
				{ type: 'drop',   id: 'btn-spacing', icon: 'icon-text-height', html: line_html, hint: 'Text options' },
				{ type: 'drop',   id: 'btn-lists', icon: 'icon-list-bullets', html: list_html, hint: 'Lists' },
				{ type: 'break',  id: 'btn-break6' },
				{ type: 'button', id: 'btn-indent', icon: 'icon-indent-left', hint: 'Remove text indent' },
				{ type: 'button', id: 'btn-outdent', icon: 'icon-indent-right', hint: 'Indent text' },
				{ type: 'break',  id: 'btn-break7' },
				{ type: 'button', id: 'btn-link', icon: 'icon-link', hint: 'Create a link' },
				{ type: 'button', id: 'btn-unlink', icon: 'icon-unlink', hint: 'Remove links' },
				{ type: 'break',  id: 'btn-break8' },
				{ type: 'button', id: 'btn-fullscreen', icon: 'icon-expand', hint: 'Full screen mode' }
			],
			onClick: function (event) {
				obj.tbAction(event.target);
			}
		});	
		// source toolbar
		this.toolbar2 = $().w2toolbar({
			name: this.name + '_source_toolbar',
			items: [
				{ type: 'html',   id: 'tb2-html' },
				{ type: 'button', id: 'tb2-undo', icon: 'icon-undo', hint: 'Undo', disabled: true },
				{ type: 'button', id: 'tb2-redo', icon: 'icon-redo', hint: 'Redo', disabled: true },
				{ type: 'break',  id: 'tb2-break1' },
				{ type: 'button', id: 'tb2-apply', caption: 'Apply', disabled: true, icon: 'icon-check', hint: 'Apply changes to the document' },
				{ type: 'break',  id: 'tb2-break2' },
				{ type: 'html',   id: 'tb2-tree', html: '<div class="w2ui-editor-element-path" style="margin-top: -2px"></div>' }
			],
			onClick: function (event) {
				obj.tb2Action(event.target);
			}
		});
	},
	
	render: function (box) {
		if (String(box) != 'undefined' && box != null) { 
			if (String(box.tagName).toLowerCase() == 'textarea') {
				$(this.box).html('');
				this.box = null;
				this.textarea = box;
			} else {
				$(this.box).html('');
				this.box = box;
			}
		}
		if (this.box == null && this.textarea == null) return;
		
		var border_top_left_radius 		= 0;
		var border_top_right_radius 	= 0;
		var border_bottom_left_radius	= 0;
		var border_bottom_right_radius 	= 0;
		if (this.textarea != null) {
			if (this.width == null) {
				this.width  = parseInt($(this.textarea).width()) + 
							  parseInt($(this.textarea).css('border-right-width')) + parseInt($(this.textarea).css('border-left-width')) +
							  parseInt($(this.textarea).css('margin-right')) + parseInt($(this.textarea).css('margin-left')) +
							  parseInt($(this.textarea).css('padding-right')) + parseInt($(this.textarea).css('padding-left'));
			}
			if (this.height == null)  {
				this.height  = parseInt($(this.textarea).height()) + 
							  parseInt($(this.textarea).css('border-top-width')) + parseInt($(this.textarea).css('border-bottom-width')) +
							  parseInt($(this.textarea).css('margin-top')) + parseInt($(this.textarea).css('margin-bottom')) +
							  parseInt($(this.textarea).css('padding-top')) + parseInt($(this.textarea).css('padding-bottom'));
			}	
			// read position, float and margin from textarea
			var addCSS = 'position: ' + $(this.textarea).css('position') + '; float: '+ $(this.textarea).css('float') +'; '+
				 'margin-top: ' + $(this.textarea).css('margin-top') + '; margin-bottom: ' + $(this.textarea).css('margin-bottom') +'; '+		
				 'margin-left: ' + $(this.textarea).css('margin-left') + '; margin-right: ' + $(this.textarea).css('margin-right') + '; '+
				 'border-top-left-radius: ' + $(this.textarea).css('border-top-left-radius') + '; '+
				 'border-bottom-left-radius: ' + $(this.textarea).css('border-bottom-left-radius') +'; '+		
				 'border-top-right-radius: ' + $(this.textarea).css('border-top-right-radius') + '; '+
				 'border-bottom-right-radius: ' + $(this.textarea).css('border-bottom-right-radius') + ';';
			var addCSSBody = 'font-family: ' + $(this.textarea).css('font-family') + '; font-size: ' + $(this.textarea).css('font-size') + '; '+
				 'color: ' + $(this.textarea).css('color') + '; background-color: ' + $(this.textarea).css('background-color') + ';';
			// do not $.hide() because it won't hold a value and won't save
			$(this.textarea).css({ display: 'none' }); 
			// some css from textarea
			border_top_left_radius 		= $(this.textarea).css('border-top-left-radius');
			border_top_right_radius 	= $(this.textarea).css('border-top-right-radius');
			border_bottom_left_radius	= $(this.textarea).css('border-bottom-left-radius');
			border_bottom_right_radius 	= $(this.textarea).css('border-bottom-right-radius');
		} else {
			if (this.width == null) {
				this.width  = parseInt($(this.box).width()) + 
							  parseInt($(this.box).css('border-right-width')) + parseInt($(this.box).css('border-left-width')) +
							  parseInt($(this.box).css('margin-right')) + parseInt($(this.box).css('margin-left')) +
							  parseInt($(this.box).css('padding-right')) + parseInt($(this.box).css('padding-left'));
			}
			if (this.height == null)  {
				this.height  = parseInt($(this.box).height()) + 
							  parseInt($(this.box).css('border-top-width')) + parseInt($(this.box).css('border-bottom-width')) +
							  parseInt($(this.box).css('margin-top')) + parseInt($(this.box).css('margin-bottom')) +
							  parseInt($(this.box).css('padding-top')) + parseInt($(this.box).css('padding-bottom'));
			}	
		}
		
		// create place holders
		var html = 
			'<div id="editor_'+ this.name +'" class="w2ui-editor" style="'+ addCSS +'; background-color: #ddd; width: '+ this.width +'px; height: '+ this.height +'px;">'+
			'	<div class="w2ui-editor-toolbar" style="border-top-left-radius: ' + border_top_left_radius + '; border-top-right-radius: ' + border_top_right_radius + ';"></div>'+
			'	<iframe class="w2ui-editor-iframe" tabindex="-1" frameborder="0" '+
			'		style="border-bottom-left-radius: ' + border_bottom_left_radius +'; border-bottom-right-radius: ' + border_bottom_right_radius +';"></iframe>'+
			'	<div class="w2ui-editor-source-toolbar"></div>'+
			'	<div class="w2ui-editor-source-text">'+
			'		<div class="w2ui-code-mirror" style="width: 100%; height: 100%; display: '+ (this.useCodeMirror ? '' : 'none') +';"></div>'+
			'		<textarea style="width: 100%; height: 100%; display: '+ (this.useCodeMirror ? 'none' : '') +';"></textarea>'+
			'	</div>'+
			'</div>';	
		if (this.box == null && this.textarea != null) {
			$(this.textarea).before('<div id="editor_tmp_'+ this.name +'"></div>');
			this.box = $('#editor_tmp_'+ this.name)[0];
		}
		$(this.box).html(html);

		var editor = $('#editor_'+ this.name +' .w2ui-editor-iframe')[0].contentDocument;		
		var obj = this;
		
		// turn editor on
		if (editor) { 
			editor.write('<br>');
			if (this.readOnly === false) editor.body.contentEditable = true;
			//editor.body.focus();
			editor.body.addEventListener('mouseup',  function (event) { obj.iframeClick.call(obj, event) }, false);	
			editor.body.addEventListener('keydown',  function (event) { obj.iframeKeyDown.call(obj, event) }, false);	
			editor.body.addEventListener('keyup', 	 function (event) { obj.iframeKeyUp.call(obj, event) }, false);	
			editor.body.addEventListener('blur',     function (event) { $(obj.textarea).val(obj.content()); $(obj.textarea).trigger('change'); }, false);	
			editor.addEventListener('scroll',        function (event) { $('#'+ obj.name +'_link_properties').hide(); }, false);	
			if (this.textarea != null) editor.body.innerHTML = $(this.textarea).val();
			editor.body.style.cssText = addCSSBody;
			this.saveUndo();
		}

		// if read only - disable all buttons else - enable them
		if (this.readOnly === true) {
			for (var i in this.toolbar.items) {
				if (this.toolbar.items[i].id == 'btn-fullscreen') continue;
				this.toolbar.items[i].disabled = true;
			}
		} else {
			for (var i in this.toolbar.items) this.toolbar.items[i].disabled = false;
		}
		// Toolbars 
		this.toolbar.render($('#editor_'+ this.name +' .w2ui-editor-toolbar')[0]);
		this.toolbar2.render($('#editor_'+ this.name +' .w2ui-editor-source-toolbar')[0]);
		
		// small toolbar
		if (this.smallToolbar) {
			this.toolbar.hide('btn-undo');
			this.toolbar.hide('btn-redo');
			this.toolbar.hide('btn-break1');
			this.toolbar.hide('btn-formating');
			this.toolbar.hide('btn-break4');
			this.toolbar.hide('btn-paste');
			this.toolbar.hide('btn-source');
			this.toolbar.hide('btn-spacing');
			this.toolbar.hide('btn-break6');
			this.toolbar.hide('btn-indent');
			this.toolbar.hide('btn-outdent');
			this.toolbar.hide('btn-break7');
			this.toolbar.hide('btn-link');
			this.toolbar.hide('btn-unlink');
		}
				
		// show/hide buttons
		for (var b in this.showButtons) { 
			if (this.showButtons[b] === false) { this.toolbar.hide(b); }
		}
		if (this.showSource)  this.toolbar.check('btn-source'); else this.toolbar.uncheck('btn-source');
		
		// additional scripts
		var isBeautify   = false
		var isCodeMirror = false;
		$('script').each(function (index, script) {
			var sc = String(script.src);
			if (sc.indexOf('w2editor.js') != -1) {
				obj.scriptPath = sc.replace('w2ui/w2editor.js', '');
			}
			if (sc.indexOf('beautify-html.js') != -1) isBeautify = true;
			if (sc.indexOf('codemirror.js') != -1) isCodeMirror  = true;
		});
		// beautify
		if (this.useBeautify && isBeautify === false) { 
			$('head').append('<script src="'+ this.scriptPath +'beautify/beautify-html.js"></script>');
		}
		// CodeMirror
		if (obj.useCodeMirror && isCodeMirror === false) {
			$('head').append('<script src="'+ this.scriptPath +'CodeMirror/lib/codemirror.js"></script>');
			$('head').append('<script src="'+ this.scriptPath +'CodeMirror/mode/xml.js"></script>');
			$('head').append('<script src="'+ this.scriptPath +'CodeMirror/mode/javascript.js"></script>');
			$('head').append('<script src="'+ this.scriptPath +'CodeMirror/mode/css.js"></script>');
			$('head').append('<script src="'+ this.scriptPath +'CodeMirror/mode/htmlmixed.js"></script>');
			$('head').append('<link rel="stylesheet" href="'+ this.scriptPath +'CodeMirror/lib/codemirror.css" />');
		}
		
		setTimeout(function () { obj.resize(); /* editor.body.focus(); */ }, 100); // allow to render first
	},
	
	refresh: function () {
		this.toolbar.refresh();
		this.toolbar2.refresh();
		this.resize();
	},
	
	resize: function (width, height) {
		if (String(width) != 'undefined')  this.width  = parseInt(width);
		if (String(height) != 'undefined') this.height = parseInt(height);
		
		var addW = parseInt($('#editor_'+ this.name +'').css('border-left-width')) + 
				   parseInt($('#editor_'+ this.name +'').css('border-right-width'));
		var addH = parseInt($('#editor_'+ this.name +'').css('border-top-width')) + 
				   parseInt($('#editor_'+ this.name +'').css('border-bottom-width'));
		var addS = this.height * 0.35; // source hight is 35%
		
		// editor
		$('#editor_'+ this.name +'').css({ 
			width: this.width + 'px', 
			height: this.height + 'px'
		});
		// main toolbar
		$('#editor_'+ this.name +' .w2ui-editor-toolbar').css({ 
			width: (this.width - addW) + 'px', 
			height: '31px'
		});
		if (this.showSource == false) {			
			// iframe
			$('#editor_'+ this.name +' .w2ui-editor-iframe').css({ 
				width: (this.width - addW) + 'px', 
				height: (this.height - 31 - addH) + 'px'
			});
			// hide source toolbar and source iframe
			$('#editor_'+ this.name +' .w2ui-editor-source-toolbar').hide();
			$('#editor_'+ this.name +' .w2ui-editor-source-text').hide();
		} else {
			// iframe
			$('#editor_'+ this.name +' .w2ui-editor-iframe').css({ 
				width: (this.width - addW) + 'px', 
				height: (this.height - 62 - addH - addS) + 'px'
			});
			// source toolbar
			$('#editor_'+ this.name +' .w2ui-editor-source-toolbar').css({ 
				width: (this.width - addW) + 'px', 
				height: '31px'
			});
			// source iframe
			$('#editor_'+ this.name +' .w2ui-editor-source-text').css({ 
				width: (this.width - addW) + 'px', 
				height: (addS - 3) + 'px'
			});
			// show source toolbar and source iframe
			$('#editor_'+ this.name +' .w2ui-editor-source-toolbar').show();
			$('#editor_'+ this.name +' .w2ui-editor-source-text').show();
		}
		if (this.toolbar) this.toolbar.resize();
		if (this.toolbar2) this.toolbar2.resize();
	},
	
	destroy: function () {
		// clean up
		$('#editor_'+ this.name +'').remove();		
		$('#editor_tmp_'+ this.name +'').remove();		
		$(this.textarea).show();
		// destroy objects
		this.toolbar.destroy();
		this.toolbar2.destroy();
		// remove from elements
		delete w2ui[this.name];
	}	
};

var init = function (options) { 
	// check required parameters
	if (!options) {
		$.error('The options object is empty in w2editor.init() method.');
		return;
	}
	if (String(options.name) == 'undefined') {
		$.error('The parameter "name" is required but not supplied in w2editor.init() method (obj: '+ options.name +').');
		return;
	}
	if (String(w2ui[options.name]) != 'undefined') {
		$.error('The parameter "name" is not unique. There are other objects already created with the same name (obj: '+ options.name +').');
		return;			
	}
	var object = $.extend({}, obj, options);
	object.initToolbars();
	if ($(this).length != 0) {
		if (String($(this)[0].tagName).toLowerCase() == 'textarea') {
			object.textarea = $(this)[0];
		} else {
			object.box = $(this)[0];
		}
		$(this).data('w2name', object.name);
		object.render();
		if (object.maximized) this.max();
	}
	// register new object
	w2ui[object.name] = object;		
	return object;
}

$.fn.w2editor = function(method) {
	if (typeof method === 'object' || !method ) {
		return init.apply( this, arguments );
	} else if (typeof $(this).data('w2name') != 'undefined') {
		w2ui[$(this).data('w2name')][method].apply(w2ui[$(this).data('w2name')], Array.prototype.slice.call(arguments, 1));
		return this;
	} else {
		$.error( 'Method ' +  method + ' does not exist on w2editor' );
	}    
};

}) (jQuery);