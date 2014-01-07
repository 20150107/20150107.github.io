/*----------------------------------------*\
Eagle Productivity JS Debug File
\*----------------------------------------*/

//Initialize debug features
if(DEBUG_MODE == true){
	//var elf = new Object(); //mantis submission
	var debug = new Object(); //eagle debug information
	
	initDebugObject();
	initDebugWindow();
}




/*----------------------------------------*\
These functions handle Debug Tool interaction
\*----------------------------------------*/
function debugElfSubmit(){
	var assi = $('#debug-elf-assignto').val();
	var cate = $('#debug-elf-category').val();
	var summ = $('#debug-elf-summary').val();
	var desc = $('#debug-elf-description').val();

	alert('assignto: ' + assi + '\n' + 'category: ' + cate + '\n' + 'summary: ' + summ + '\n' + 'description: ' + desc);
}

function debugMediaBtnHandler(btn){
	switch(btn.id){
		case 'debug-btn-media-mute':
			$('#debug-btn-media-mute').attr('id', 'debug-btn-media-unmute');
			$('#jquery_jplayer_1').jPlayer("mute");
			break;
		case 'debug-btn-media-unmute':
			$('#debug-btn-media-unmute').attr('id', 'debug-btn-media-mute');
			$('#jquery_jplayer_1').jPlayer("unmute");
			break;
	}
}

function debugSkipToSlide(btn){
	var slide = '';
	
	switch(btn.id){
		case 'debug-btn-skipToSlide':
			slide = $('#debug-slide-id').val();	
			break;
		case 'debug-btn-skipToSlide-small':
			slide = $('#debug-slide-id-small').val();
			break;
	}
	
	shellAPI.skipToPage(slide);
}

function debugElfDoLogin(){
	var username = $('#debug-elf-loginUsername').val();
	var password = $('#debug-elf-loginPassword').val();
	alert(username + '---' + password);
	
	var soap = new jSOAPClient();
	
	/*
	soap.consume = function(location, urn, method, data, success, error);
	
	
	var WEBSERVICE_URL = 'http://www.eagleproductivity.com/mantis/api/soap/mantisconnect.php?wsdl';
	jQuery.jSOAPClient.consume('http://localhost/webservice/index.php', 'MYWBS.webservice', 'service', mydata, 
	
	mydata = '{"data":[{"type":"xsd:string", "value":"HELLO WORLD!"}, {"type":"xsd:string", "value":"SECOND PARAMETER OF MY WEBSERVICE"}]}'
	soap.consume(WEBSERVICE_URL, 'MYWBS.webservice', 'service', mydata, 
		function(data){ //success
			alert('success:' + data);
		},
		function(data){ //error
			alert('success:' + data);
		}
	);
	*/
	
}


/*----------------------------------------*\
Returns the HTML markup for different 
debug tools
\*----------------------------------------*/
function debugTabTools(){
	var tools = "<div id='debug-window-tools'><dl>";
	tools += "<dt>Slide:</dt><dd><input id='debug-slide-id' type='text' />" +
				"<button id='debug-btn-skipToSlide' type='button' onclick='debugSkipToSlide(this);'>Go</button>" +
				"</dd>";
	tools += "<dt>Audio:</dt><dd><button type='button' id='debug-btn-media-mute' onclick='debugMediaBtnHandler(this);' class='debug-btn-media'></button></dd>";
	tools += "</dl></div>";
	return tools;
}

function debugTabELF(){
	var usernames = "<select id='debug-elf-assignto'>" +
						"<option value='0'>atom</option>" +
						"<option value='1'>kevin</option>" +
						"<option value='2'>zach</option>" +
					"</select>";
					
	var categories = "<select id='debug-elf-category'>" +
						"<option value='0'>Graphic</option>" +
						"<option value='1'>Audio</option>" +
						"<option value='2'>Text/Text</option>" +
					"</select>";

	var elf = "<div id='debug-elf-container'><dl>";
	elf += "<div id='debug-elf-login-container'><dl>";
	elf += "<dt>Username:</dt><dd><input id='debug-elf-loginUsername' type='text' /></dd>";
	elf += "<dt>Password:</dt><dd><input id='debug-elf-loginPassword' type='password' /></dd>";
	elf += "<dt>Submit:</dt><dd style='text-align: center;'><button id='debug-elf-btn-submit' type='button' onclick='debugElfDoLogin();'>Submit</button></dd>";
	elf += "</div>";
	
	elf += "<div id='debug-elf-form-container' style='display: none;'><dl>";
	elf += "<dt>Assign To:</dt><dd>" + usernames + "</dd>";
	elf += "<dt>Category:</dt><dd>" + categories + "</dd>";
	elf += "<dt>Summary:</dt><dd><input id='debug-elf-summary' type='text' /></dd>";
	elf += "<dt style='height: 84px;'>Description:</dt><dd style='height: 84px;'><textarea id='debug-elf-description'></textarea></dd>";
	elf += "<dt>Submit:</dt><dd style='text-align: center;'><button id='debug-elf-btn-submit' type='button' onclick='debugElfSubmit();'>Submit</button></dd>";
	elf += "</dl></div>";
	return elf;
}

/*----------------------------------------*\
Initializes Debug object
\*----------------------------------------*/
function initDebugObject(){
	debug.mantis = {
		projectID: '220'
	}
	
	debug.setSlideId = function(text) {
		$('#debug-slide-id').val(text);
		$('#debug-slide-id-small').val(text);
	};
	
}



/*----------------------------------------*\
Initializes Debug Window
\*----------------------------------------*/
function initDebugWindow(){
	var tabs = "<div id='debug-tool-tabs'>" +
					"<ul>" +
						"<li><a href='#tabs-1'>Tools</a></li>" +
						"<li><a href='#tabs-2'>Feedback</a></li>" +
					"</ul>" +
					"<div id='tabs-1'>" +
						debugTabTools() +
					"</div>" +
					"<div id='tabs-2'>" +
						debugTabELF() + 
					"</div>" +
				"</div>";
	
	//Append markup to shell
	$('#shell').append('<div id="debug-window-container" style="display:none;"><h2>Eagle Debug Tool</h2>' + tabs + '</div>');
	$('#shell').append("<div id='debug-window-container-small' style='display:block;'>" +
						"<dl><dt>Slide:</dt><dd><input id='debug-slide-id-small' type='text' />" +
							"<button id='debug-btn-skipToSlide-small' type='button' onclick='debugSkipToSlide(this);'>Go</button>" +
							"</dd></dl><div>");
	
	//Set up key bindings
	$(document).ready(function(){
		$( "#debug-tool-tabs" ).tabs();
		
		$(document).bind('keydown', 'f2', function(){
			$('#debug-window-container').toggle(500);
			$('#debug-window-container-small').toggle(500);
		});
		
		$('#debug-slide-id').bind('keydown', 'return', function(){
			$('#debug-btn-skipToSlide').click();
		});
	});
	
}



/*********************************************************************
jQuery.jSOAPClient 
@version: 0.2
@author: Alexandre Almeida Ferreira (alexandrealmeidaferreira@ibest.com.br)
@desc: A Simple Soap Client for JavaScript
@usage:

jQuery.jSOAPClient.consume(URL_WEBSERVICE, URN_WEBSERVICE, METHOD_WEBSERVICE, JSON_DATA, SUCCESS_FUNCTION, ERROR_FUNCTION);

OR

jQuery.jSOAPClient.setLocation(URL_WEBSERVICE);
jQuery.jSOAPClient.setUrn(URN_WEBSERVICE);
jQuery.jSOAPClient.setSuccess(function(data){
	//MY RESULT
	$('#result').html(data);
});
jQuery.jSOAPClient.setError(function(data){
	//OOPS
	$('#result').html('error : '+data);
});
jQuery.jSOAPClient.call(METHOD_WEBSERVICE, JSON_DATA);

1) EXAMPLE N? 1
mydata = '{"data":[{"type":"xsd:string", "value":"HELLO WORLD!"}, {"type":"xsd:string", "value":"SECOND PARAMETER OF MY WEBSERVICE"}]}'
jQuery.jSOAPClient.consume('http://localhost/webservice/index.php', 'MYWBS.webservice', 'service', mydata, 
	function(data){ //success
		$('#result').html(data);
	},
	function(data){ //error
		$('#result').html("error : "+data);
	}
);

2) EXAMPLE n? 2
jQuery.jSOAPClient.setLocation('http://localhost/ws/index.php');
jQuery.jSOAPClient.setUrn('MYWBS.webservice');
jQuery.jSOAPClient.setSuccess(function(data){
	$('#result').html(data);
});

jQuery.jSOAPClient.setError(function(data){
	$('#result').html('error : '+data);
});
jQuery.jSOAPClient.call('service', mydata);

*********************************************************************/


(function($) {
	jQuery.jSOAPClient = Object();
	jQuery.jSOAPClient.location = "http://localhost/webservice/",
	jQuery.jSOAPClient.urn = "http://localhost/webservice/",
	jQuery.jSOAPClient.success = function(data){},
	jQuery.jSOAPClient.error = function(data){},
	jQuery.jSOAPClient.setLocation = function(location){
		this.location = location;
	},
	jQuery.jSOAPClient.setUrn = function(urn){
		this.urn = urn;
	},
	jQuery.jSOAPClient.setSuccess = function(success){
		this.success = success;
	},
	jQuery.jSOAPClient.setError = function(error){
		this.error = error;
	},
	jQuery.jSOAPClient.call = function(method, data){
		d = jQuery.parseJSON(data);
		sm  = '<?xml version="1.0" encoding="UTF-8"?>';
		sm += '<SOAP-ENV:Envelope SOAP-ENV:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/" xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:SOAP-ENC="http://schemas.xmlsoap.org/soap/encoding/" ';
		sm += 'xmlns:tns="urn:'+this.urn+'">';
		sm += '<SOAP-ENV:Body>';
		sm += '<tns:'+method+' xmlns:tns="urn:'+this.urn+'">';
		jQuery.each(d.data, function(){
			sm += '<'+method+' xsi:type="'+this.type+'">'+this.value+'</'+method+'>';
		});
		sm += '</tns:'+method+'>';
		sm += '</SOAP-ENV:Body>';
		sm += '</SOAP-ENV:Envelope>';
		jQuery.ajax({
				url: this.location,
				type: 'POST',
				data: sm,
				contentType: "text/xml",
				crossDomain: true,
				dataType: "text",
				success: jQuery.jSOAPClient.success,
				error: jQuery.jSOAPClient.error
		});
	},
	jQuery.jSOAPClient.consume = function(location, urn, method, data, success, error){
		this.setLocation(location);
		this.setUrn(urn);
		this.setSuccess(success);
		this.setError(error);
		this.call(method, data);
	};
})(jQuery);




/*----------------------------------------*\
jQuery  Hotkeys plugin, do not edit or remove
\*----------------------------------------*/
(function(a){function b(b){if(typeof b.data!=="string"){return}var c=b.handler,d=b.data.toLowerCase().split(" ");b.handler=function(b){if(this!==b.target&&(/textarea|select/i.test(b.target.nodeName)||b.target.type==="text")){return}var e=b.type!=="keypress"&&a.hotkeys.specialKeys[b.which],f=String.fromCharCode(b.which).toLowerCase(),g,h="",i={};if(b.altKey&&e!=="alt"){h+="alt+"}if(b.ctrlKey&&e!=="ctrl"){h+="ctrl+"}if(b.metaKey&&!b.ctrlKey&&e!=="meta"){h+="meta+"}if(b.shiftKey&&e!=="shift"){h+="shift+"}if(e){i[h+e]=true}else{i[h+f]=true;i[h+a.hotkeys.shiftNums[f]]=true;if(h==="shift+"){i[a.hotkeys.shiftNums[f]]=true}}for(var j=0,k=d.length;j<k;j++){if(i[d[j]]){return c.apply(this,arguments)}}}}a.hotkeys={version:"0.8",specialKeys:{8:"backspace",9:"tab",13:"return",16:"shift",17:"ctrl",18:"alt",19:"pause",20:"capslock",27:"esc",32:"space",33:"pageup",34:"pagedown",35:"end",36:"home",37:"left",38:"up",39:"right",40:"down",45:"insert",46:"del",96:"0",97:"1",98:"2",99:"3",100:"4",101:"5",102:"6",103:"7",104:"8",105:"9",106:"*",107:"+",109:"-",110:".",111:"/",112:"f1",113:"f2",114:"f3",115:"f4",116:"f5",117:"f6",118:"f7",119:"f8",120:"f9",121:"f10",122:"f11",123:"f12",144:"numlock",145:"scroll",191:"/",224:"meta"},shiftNums:{"`":"~",1:"!",2:"@",3:"#",4:"$",5:"%",6:"^",7:"&",8:"*",9:"(",0:")","-":"_","=":"+",";":": ","'":'"',",":"<",".":">","/":"?","\\":"|"}};a.each(["keydown","keyup","keypress"],function(){a.event.special[this]={add:b}})})(jQuery)