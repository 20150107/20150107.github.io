	/*
 * SimpleModal 1.4.2 - jQuery Plugin
 * http://simplemodal.com/
 * Copyright (c) 2011 Eric Martin
 * Licensed under MIT and GPL
 * Date: Sat, Dec 17 2011 15:35:38 -0800
 */
(function(b){"function"===typeof define&&define.amd?define(["jquery"],b):b(jQuery)})(function(b){var j=[],k=b(document),l=b.browser.msie&&6===parseInt(b.browser.version)&&"object"!==typeof window.XMLHttpRequest,n=b.browser.msie&&7===parseInt(b.browser.version),m=null,h=b(window),i=[];b.modal=function(a,d){return b.modal.impl.init(a,d)};b.modal.close=function(){b.modal.impl.close()};b.modal.focus=function(a){b.modal.impl.focus(a)};b.modal.setContainerDimensions=function(){b.modal.impl.setContainerDimensions()};
b.modal.setPosition=function(){b.modal.impl.setPosition()};b.modal.update=function(a,d){b.modal.impl.update(a,d)};b.fn.modal=function(a){return b.modal.impl.init(this,a)};b.modal.defaults={appendTo:"body",focus:!0,opacity:50,overlayId:"simplemodal-overlay",overlayCss:{},containerId:"simplemodal-container",containerCss:{},dataId:"simplemodal-data",dataCss:{},minHeight:null,minWidth:null,maxHeight:null,maxWidth:null,autoResize:!1,autoPosition:!0,zIndex:1E3,close:!0,closeHTML:'<a class="modalCloseImg" title="Close"></a>',
closeClass:"simplemodal-close",escClose:!0,overlayClose:!1,fixed:!0,position:null,persist:!1,modal:!0,onOpen:null,onShow:null,onClose:null};b.modal.impl={d:{},init:function(a,d){if(this.d.data)return!1;m=b.browser.msie&&!b.boxModel;this.o=b.extend({},b.modal.defaults,d);this.zIndex=this.o.zIndex;this.occb=!1;if("object"===typeof a){if(a=a instanceof jQuery?a:b(a),this.d.placeholder=!1,0<a.parent().parent().size()&&(a.before(b("<span></span>").attr("id","simplemodal-placeholder").css({display:"none"})),
this.d.placeholder=!0,this.display=a.css("display"),!this.o.persist))this.d.orig=a.clone(!0)}else if("string"===typeof a||"number"===typeof a)a=b("<div></div>").html(a);else return alert("SimpleModal Error: Unsupported data type: "+typeof a),this;this.create(a);this.open();b.isFunction(this.o.onShow)&&this.o.onShow.apply(this,[this.d]);return this},create:function(a){this.getDimensions();if(this.o.modal&&l)this.d.iframe=b('<iframe src="javascript:false;"></iframe>').css(b.extend(this.o.iframeCss,
{display:"none",opacity:0,position:"fixed",height:i[0],width:i[1],zIndex:this.o.zIndex,top:0,left:0})).appendTo(this.o.appendTo);this.d.overlay=b("<div></div>").attr("id",this.o.overlayId).addClass("simplemodal-overlay").css(b.extend(this.o.overlayCss,{display:"none",opacity:this.o.opacity/100,height:this.o.modal?j[0]:0,width:this.o.modal?j[1]:0,position:"fixed",left:0,top:0,zIndex:this.o.zIndex+1})).appendTo(this.o.appendTo);this.d.container=b("<div></div>").attr("id",this.o.containerId).addClass("simplemodal-container").css(b.extend({position:this.o.fixed?
"fixed":"absolute"},this.o.containerCss,{display:"none",zIndex:this.o.zIndex+2})).append(this.o.close&&this.o.closeHTML?b(this.o.closeHTML).addClass(this.o.closeClass):"").appendTo(this.o.appendTo);this.d.wrap=b("<div></div>").attr("tabIndex",-1).addClass("simplemodal-wrap").css({height:"100%",outline:0,width:"100%"}).appendTo(this.d.container);this.d.data=a.attr("id",a.attr("id")||this.o.dataId).addClass("simplemodal-data").css(b.extend(this.o.dataCss,{display:"none"})).appendTo("body");this.setContainerDimensions();
this.d.data.appendTo(this.d.wrap);(l||m)&&this.fixIE()},bindEvents:function(){var a=this;b("."+a.o.closeClass).bind("click.simplemodal",function(b){b.preventDefault();a.close()});a.o.modal&&a.o.close&&a.o.overlayClose&&a.d.overlay.bind("click.simplemodal",function(b){b.preventDefault();a.close()});k.bind("keydown.simplemodal",function(b){a.o.modal&&9===b.keyCode?a.watchTab(b):a.o.close&&a.o.escClose&&27===b.keyCode&&(b.preventDefault(),a.close())});h.bind("resize.simplemodal orientationchange.simplemodal",
function(){a.getDimensions();a.o.autoResize?a.setContainerDimensions():a.o.autoPosition&&a.setPosition();l||m?a.fixIE():a.o.modal&&(a.d.iframe&&a.d.iframe.css({height:i[0],width:i[1]}),a.d.overlay.css({height:j[0],width:j[1]}))})},unbindEvents:function(){b("."+this.o.closeClass).unbind("click.simplemodal");k.unbind("keydown.simplemodal");h.unbind(".simplemodal");this.d.overlay.unbind("click.simplemodal")},fixIE:function(){var a=this.o.position;b.each([this.d.iframe||null,!this.o.modal?null:this.d.overlay,
"fixed"===this.d.container.css("position")?this.d.container:null],function(b,f){if(f){var g=f[0].style;g.position="absolute";if(2>b)g.removeExpression("height"),g.removeExpression("width"),g.setExpression("height",'document.body.scrollHeight > document.body.clientHeight ? document.body.scrollHeight : document.body.clientHeight + "px"'),g.setExpression("width",'document.body.scrollWidth > document.body.clientWidth ? document.body.scrollWidth : document.body.clientWidth + "px"');else{var c,e;a&&a.constructor===
Array?(c=a[0]?"number"===typeof a[0]?a[0].toString():a[0].replace(/px/,""):f.css("top").replace(/px/,""),c=-1===c.indexOf("%")?c+' + (t = document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop) + "px"':parseInt(c.replace(/%/,""))+' * ((document.documentElement.clientHeight || document.body.clientHeight) / 100) + (t = document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop) + "px"',a[1]&&(e="number"===typeof a[1]?
a[1].toString():a[1].replace(/px/,""),e=-1===e.indexOf("%")?e+' + (t = document.documentElement.scrollLeft ? document.documentElement.scrollLeft : document.body.scrollLeft) + "px"':parseInt(e.replace(/%/,""))+' * ((document.documentElement.clientWidth || document.body.clientWidth) / 100) + (t = document.documentElement.scrollLeft ? document.documentElement.scrollLeft : document.body.scrollLeft) + "px"')):(c='(document.documentElement.clientHeight || document.body.clientHeight) / 2 - (this.offsetHeight / 2) + (t = document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop) + "px"',
e='(document.documentElement.clientWidth || document.body.clientWidth) / 2 - (this.offsetWidth / 2) + (t = document.documentElement.scrollLeft ? document.documentElement.scrollLeft : document.body.scrollLeft) + "px"');g.removeExpression("top");g.removeExpression("left");g.setExpression("top",c);g.setExpression("left",e)}}})},focus:function(a){var d=this,a=a&&-1!==b.inArray(a,["first","last"])?a:"first",f=b(":input:enabled:visible:"+a,d.d.wrap);setTimeout(function(){0<f.length?f.focus():d.d.wrap.focus()},
10)},getDimensions:function(){var a=b.browser.opera&&"9.5"<b.browser.version&&"1.3">b.fn.jquery||b.browser.opera&&"9.5">b.browser.version&&"1.2.6"<b.fn.jquery?h[0].innerHeight:h.height();j=[k.height(),k.width()];i=[a,h.width()]},getVal:function(a,b){return a?"number"===typeof a?a:"auto"===a?0:0<a.indexOf("%")?parseInt(a.replace(/%/,""))/100*("h"===b?i[0]:i[1]):parseInt(a.replace(/px/,"")):null},update:function(a,b){if(!this.d.data)return!1;this.d.origHeight=this.getVal(a,"h");this.d.origWidth=this.getVal(b,
"w");this.d.data.hide();a&&this.d.container.css("height",a);b&&this.d.container.css("width",b);this.setContainerDimensions();this.d.data.show();this.o.focus&&this.focus();this.unbindEvents();this.bindEvents()},setContainerDimensions:function(){var a=l||n,d=this.d.origHeight?this.d.origHeight:b.browser.opera?this.d.container.height():this.getVal(a?this.d.container[0].currentStyle.height:this.d.container.css("height"),"h"),a=this.d.origWidth?this.d.origWidth:b.browser.opera?this.d.container.width():
this.getVal(a?this.d.container[0].currentStyle.width:this.d.container.css("width"),"w"),f=this.d.data.outerHeight(!0),g=this.d.data.outerWidth(!0);this.d.origHeight=this.d.origHeight||d;this.d.origWidth=this.d.origWidth||a;var c=this.o.maxHeight?this.getVal(this.o.maxHeight,"h"):null,e=this.o.maxWidth?this.getVal(this.o.maxWidth,"w"):null,c=c&&c<i[0]?c:i[0],e=e&&e<i[1]?e:i[1],h=this.o.minHeight?this.getVal(this.o.minHeight,"h"):"auto",d=d?this.o.autoResize&&d>c?c:d<h?h:d:f?f>c?c:this.o.minHeight&&
"auto"!==h&&f<h?h:f:h,c=this.o.minWidth?this.getVal(this.o.minWidth,"w"):"auto",a=a?this.o.autoResize&&a>e?e:a<c?c:a:g?g>e?e:this.o.minWidth&&"auto"!==c&&g<c?c:g:c;this.d.container.css({height:d,width:a});this.d.wrap.css({overflow:f>d||g>a?"auto":"visible"});this.o.autoPosition&&this.setPosition()},setPosition:function(){var a,b;a=i[0]/2-this.d.container.outerHeight(!0)/2;b=i[1]/2-this.d.container.outerWidth(!0)/2;var f="fixed"!==this.d.container.css("position")?h.scrollTop():0;this.o.position&&"[object Array]"===
Object.prototype.toString.call(this.o.position)?(a=f+(this.o.position[0]||a),b=this.o.position[1]||b):a=f+a;this.d.container.css({left:b,top:a})},watchTab:function(a){if(0<b(a.target).parents(".simplemodal-container").length){if(this.inputs=b(":input:enabled:visible:first, :input:enabled:visible:last",this.d.data[0]),!a.shiftKey&&a.target===this.inputs[this.inputs.length-1]||a.shiftKey&&a.target===this.inputs[0]||0===this.inputs.length)a.preventDefault(),this.focus(a.shiftKey?"last":"first")}else a.preventDefault(),
this.focus()},open:function(){this.d.iframe&&this.d.iframe.show();b.isFunction(this.o.onOpen)?this.o.onOpen.apply(this,[this.d]):(this.d.overlay.show(),this.d.container.show(),this.d.data.show());this.o.focus&&this.focus();this.bindEvents()},close:function(){if(!this.d.data)return!1;this.unbindEvents();if(b.isFunction(this.o.onClose)&&!this.occb)this.occb=!0,this.o.onClose.apply(this,[this.d]);else{if(this.d.placeholder){var a=b("#simplemodal-placeholder");this.o.persist?a.replaceWith(this.d.data.removeClass("simplemodal-data").css("display",
this.display)):(this.d.data.hide().remove(),a.replaceWith(this.d.orig))}else this.d.data.hide().remove();this.d.container.hide().remove();this.d.overlay.hide();this.d.iframe&&this.d.iframe.hide().remove();this.d.overlay.remove();this.d={}}}}});




function initPage() {
	$(document).ready(function(){
		$("#"+window.location.href.split("#")[1]).trigger("getFocus");
		if(window.initialize)
			initialize();		
	});

	
	if(navigator.userAgent.match(/iPad/i)){
		//prevent scrolling (also applies when loaded into an iframe)
		document.addEventListener("touchmove", function(event){
			event.preventDefault();
		}, false);
	}
	
	// Get all slide markup and store it.
	try
	{
		window.slideData=window.slideData||{};
		window.slideData.markup = {};
		var slides = $(".slide");
		slides.each(function(index, el){
			var el = $(el);
			slideData.markup[el.attr("id")] = el.html();
		});
	} catch(e){};
}

jQuery.fn.tap = function(callback) {
	var returned = false;
	return this.each(function() {
		var $this = $(this);
		$this.animate({
			top: '+=10',
			left: '-=5'
		},
		100).animate({
			top: '-=10',
			left: '+=5'
		},
		100,
		function() {
			if (callback && !returned) {
				returned = true;
				callback();
			}
		});
	});
}

jQuery.fn.fingerDown = function(callback) {
	var returned = false;
	return this.each(function() {
		var $this = $(this);
		$this.animate({
			top: '+=10',
			left: '-=5'
		},
		100,
		function() {
			if (callback && !returned) {
				returned = true;
				callback();
			}
		});
	});
}

jQuery.fn.fingerUp = function(callback) {
	var returned = false;
	return this.each(function() {
		var $this = $(this);
		$this.animate({
			top: '-=10',
			left: '+=5'
		},
		100,
		function() {
			if (callback && !returned) {
				returned = true;
				callback();
			}
		});
	});
}

jQuery.fn.mclick = function(callback) {
	var returned = false;
	return this.each(function() {
		var $this = $(this);
		$this.animate({
			top: '-=5',
			left: '-=5'
		},
		100).animate({
			top: '+=5',
			left: '+=5'
		},
		100,
		function() {
			if (callback && !returned) {
				returned = true;
				callback();
			}
		});
	});
}

jQuery.fn.courseDropShadow = function() {
		
		return this.each(function() {
			var $this 		= $(this);
			var cssWidth 	= $this.outerWidth();
			var cssHeight 	= $this.height();
			var cssTop 		= ($this.css('top') != 'auto') 	? "top: " 	+ (parseInt($this.css('top')) - 10) 	+ "px; " 	: 	"bottom: " 	+ (parseInt($this.css('bottom')) - 10) + "px; ";
			var cssLeft 	= ($this.css('left') != 'auto') ? "left: " 	+ (parseInt($this.css('left')) - 10) 	+ "px; "	: 	"right: " 	+ (parseInt($this.css('right')) - 10) 	+ "px; ";
				
			var html = "<div class='course-dropshadow-container'"+
								"style='position: absolute; " + 
									cssTop + 
									cssLeft +
									"width: " 	+ (cssWidth+22) + "px;'>" +
							"<div class='course-dropshadow-top_left'></div>" + 
							"<div class='course-dropshadow-top' style='width: " 	+ (cssWidth) + "px;'></div>" + 
							"<div class='course-dropshadow-top_right'></div>" + 
							"<div style='clear: both;'></div>" + 
							"<div class='course-dropshadow-left' style='height: " 	+ (cssHeight) + "px;'></div>" + 
							"<div class='course-dropshadow-center' style='height: " 	+ (cssHeight) + "px; " + 
										"width: " 	+ cssWidth + "px; " +
										"float: left; z-index: 0;'>" + 
							"</div>" +
							"<div class='course-dropshadow-right' style='height: " 	+ (cssHeight) + "px;'></div>" + 
							"<div style='clear: both;'></div>" + 
							"<div class='course-dropshadow-bottom_left'></div>" + 
							"<div class='course-dropshadow-bottom' style='width: " 	+ (cssWidth) + "px;'></div>" + 
							"<div class='course-dropshadow-bottom_right'></div>" + 
						"</div>";
			
			$this.before(html);
	});
}


jQuery.fn.coursePopup = function( options, callback ) {  
		var divContainer	= "";
		var divContent		= "";
		var divLeft			= "";
		var divCenter		= "";
		var divRight		= "";
				
		// Create some defaults, extending them with any options that were provided
		var settings = $.extend( {
			'introAnimation'		: '',
			'outroAnimation'		: '',
			'lContent'				: '',
			'cContent'				: '',
			'rContent'				: '',
			'position'				: 'center',
			'callbackBeforeShow'	: null,
			'callbackOnClose' 		: null,
			'callbackOnShow'		: null
		}, options);
		
		// Methods
		var methods = {
			init: function(){
				divLeft = $('<div />')
								.html(settings.lContent)
								.attr({
									'class': 'course-popup-div-content course-popup-div-right'
								});
			
				divCenter = $('<div />')
									.html(settings.cContent)
									.attr({
										'class': 'course-popup-div-content course-popup-div-center'
									});
									
				divRight = $('<div />')
									.html(settings.rContent)
									.attr({
										'class': 'course-popup-div-content course-popup-div-right'
									});
									
				divContent = $('<div />')
									.attr({
										'class': 'course-popup-div-content'
									});
				
				divContainer = $('<div />')
									.attr({
										'class': 'course-popup-div-container'
									});
			},
			
			show: function() { 
				divLeft.appendTo(divContent);
				divCenter.appendTo(divContent);
				divRight.appendTo(divContent);
				divContent.appendTo(divContainer);
				
				//$.modal(divContainer);
				
				$.modal(divContainer, {
					/*onOpen: function(){ 
						if (typeof settings.callbackBeforeShow == 'function') {
							settings.callbackBeforeShow.call(this);
						}
						alert('asdf');
					},*/
					onShow: function(){ 
						methods.introAnimation();
					},
					onClose: function(){ 
						methods.outroAnimation();
					}
				});
			},
			
			introAnimation: function() { 
				switch(settings.introAnimation){
					case "slide":
						divContainer.css({left: '-1960px'});
						divContent.fadeOut(0);
						
						$(divContainer).animate({
							left: '0px'
						}, 1200, function(){
									divContent.fadeIn(1200);
								});
						
						break;
					default:
						//do nothing, make the popup appear as normal
				}
				
				//Do callback if it exists
				if (typeof settings.callbackOnShow == 'function') {
					settings.callbackOnShow.call(this);
				}
			},
			
			outroAnimation: function() { 
				switch(settings.outroAnimation){
					case "slide":
						$(divContainer).animate({
							left: '-2000px'
						}, 1000, function(){$.modal.close()});
						
						break;
					default:
						//do nothing, make the popup disappear as normal
						$.modal.close();
				}
				
				if (typeof settings.callbackOnClose == 'function') {
					settings.callbackOnClose.call(this);
				}
			}
		};
		
		return this.each(function() {
			var $this = $(this);
			
			methods.init();
			
			methods.show();
		});
};


(function(){
	var parent=window.parent;
	window.drcom={
			video:{
				pause:function()
				{
					
					parent.$("#jquery_jplayer_1").jPlayer("pause");
				},
				play:function()
				{
					
					parent.$("#jquery_jplayer_1").jPlayer("play");
				},
				seek:function(percent)
				{
					parent.$("#jquery_jplayer_1").jPlayer("playHead",percent);
				}
			},
			slide:{
				enableNext:function()
				{
					parent.addSlideFlag("visited2");
				}
			}
	};	
})();





	/*
json2.js - Fixes JSON global object support for IE6/7
2011-10-19
Public Domain.

This file creates a global JSON object containing two methods: stringify
and parse.
*/
var JSON;if(!JSON){JSON={}}(function(){function f(a){return a<10?"0"+a:a}function quote(a){escapable.lastIndex=0;return escapable.test(a)?'"'+a.replace(escapable,function(a){var b=meta[a];return typeof b==="string"?b:"\\u"+("0000"+a.charCodeAt(0).toString(16)).slice(-4)})+'"':'"'+a+'"'}function str(a,b){var c,d,e,f,g=gap,h,i=b[a];if(i&&typeof i==="object"&&typeof i.toJSON==="function"){i=i.toJSON(a)}if(typeof rep==="function"){i=rep.call(b,a,i)}switch(typeof i){case"string":return quote(i);case"number":return isFinite(i)?String(i):"null";case"boolean":case"null":return String(i);case"object":if(!i){return"null"}gap+=indent;h=[];if(Object.prototype.toString.apply(i)==="[object Array]"){f=i.length;for(c=0;c<f;c+=1){h[c]=str(c,i)||"null"}e=h.length===0?"[]":gap?"[\n"+gap+h.join(",\n"+gap)+"\n"+g+"]":"["+h.join(",")+"]";gap=g;return e}if(rep&&typeof rep==="object"){f=rep.length;for(c=0;c<f;c+=1){if(typeof rep[c]==="string"){d=rep[c];e=str(d,i);if(e){h.push(quote(d)+(gap?": ":":")+e)}}}}else{for(d in i){if(Object.prototype.hasOwnProperty.call(i,d)){e=str(d,i);if(e){h.push(quote(d)+(gap?": ":":")+e)}}}}e=h.length===0?"{}":gap?"{\n"+gap+h.join(",\n"+gap)+"\n"+g+"}":"{"+h.join(",")+"}";gap=g;return e}}"use strict";if(typeof Date.prototype.toJSON!=="function"){Date.prototype.toJSON=function(a){return isFinite(this.valueOf())?this.getUTCFullYear()+"-"+f(this.getUTCMonth()+1)+"-"+f(this.getUTCDate())+"T"+f(this.getUTCHours())+":"+f(this.getUTCMinutes())+":"+f(this.getUTCSeconds())+"Z":null};String.prototype.toJSON=Number.prototype.toJSON=Boolean.prototype.toJSON=function(a){return this.valueOf()}}var cx=/[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,escapable=/[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,gap,indent,meta={"\b":"\\b","	":"\\t","\n":"\\n","\f":"\\f","\r":"\\r",'"':'\\"',"\\":"\\\\"},rep;if(typeof JSON.stringify!=="function"){JSON.stringify=function(a,b,c){var d;gap="";indent="";if(typeof c==="number"){for(d=0;d<c;d+=1){indent+=" "}}else if(typeof c==="string"){indent=c}rep=b;if(b&&typeof b!=="function"&&(typeof b!=="object"||typeof b.length!=="number")){throw new Error("JSON.stringify")}return str("",{"":a})}}if(typeof JSON.parse!=="function"){JSON.parse=function(text,reviver){function walk(a,b){var c,d,e=a[b];if(e&&typeof e==="object"){for(c in e){if(Object.prototype.hasOwnProperty.call(e,c)){d=walk(e,c);if(d!==undefined){e[c]=d}else{delete e[c]}}}}return reviver.call(a,b,e)}var j;text=String(text);cx.lastIndex=0;if(cx.test(text)){text=text.replace(cx,function(a){return"\\u"+("0000"+a.charCodeAt(0).toString(16)).slice(-4)})}if(/^[\],:{}\s]*$/.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,"@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,"]").replace(/(?:^|:|,)(?:\s*\[)+/g,""))){j=eval("("+text+")");return typeof reviver==="function"?walk({"":j},""):j}throw new SyntaxError("JSON.parse")}}})()










