/*----------------------------------------*\
iPad anti-scrolling utility
Disables scrolling on the iPad
\*----------------------------------------*/
if(navigator.userAgent.match(/iPad/i)){
	//prevent scrolling (also applies when loaded into an iframe)
	document.addEventListener("touchmove", touchMove, false);
	function touchMove(event) {
		// Prevent scrolling on this element
		event.preventDefault();
	}
}

//Fix for the menu because iOS 5 Safari has less screen real estate
/*if(navigator.userAgent.match(/OS 5_\d like Mac OS X/i)){
	document.write("<style type='text/css'> #sb-wrapper-inner {	top: 13px !important; } </style>");
}else{
	document.write("<style type='text/css'> #sb-wrapper-inner {	top: 0px !important; } </style>");
}*/

/*----------------------------------------*\
Initialize global variables
\*----------------------------------------*/
var DEBUG_MODE = false;		
var IS_GATED = true;
//var STORAGE_MODE = "SCORM Driver"; //maybe add support for "cookies" at some point?
var STORAGE_MODE = "SCORM Driver"; //Values: "SCORM Driver", "cookies"
var STORAGE_KEY = "belux_ipad_tutorial_4D23JUER0SD352JH84";

// A reference to the main shell code scope.
SHELL = this;

//--Debug
var debug;
var log = function(killText){}; //if DEBUG_MODE true, will send output to popup window. Else, do nothing and don't break logging
//--Debug

var scorm = parent;

var jsDate = new Date();

var contentData = courseData;

var menu = new Object();
initMenuObj();

var help = new Object();
initHelpObj();

var currentLocation = new Object();
initCurrentLocationObj();

var shellAPI = new Object();
var shellAPI_vars = new Array();
initShellAPIObj();

var audio = new Object();
initAudioObj();

var tooltip = new Object();
initTooltipObj();

// Will be initialized via initNavUI() call from window.onload().
var navManager;

/*----------------------------------------*\
Initialize the course
\*----------------------------------------*/
window.onload = function() {
	$(document).ready(function(){
		if(DEBUG_MODE == true){
			initDebug();				
		}
		var isDevice= /(iPad|iPhone|iPod)/g.test( navigator.userAgent );
		$("#jquery_jplayer_1").jPlayer({
			swfPath: "src/jplayer/Jplayer.swf",
			supplied: "mp3",
			wmode: "window",
			solution:"flash,html",
			ended:function(e){audio.eventPlayerEnded(e, 'ended');},
			pause:function(e){audio.eventPlayerEnded(e, 'pause');},
			timeupdate: audio.updateCueObserver,
			ready: function(){
				if(! isDevice)
					finishInit();
			}
		});
		if(isDevice)
		{
			$("#populateIOSLaunch").show();
			$("#laughPresentation").bind("click",function(){
				$("#populateIOSLaunch").hide();
				$("#shell").show();
				finishInit();
				$("#jquery_jplayer_1").jPlayer("play");
			});
		}
		else
			$("#shell").show();
		
		function finishInit(){
			// executes when complete page is fully loaded, including all frames, objects and images
			$('#contentFrame').load(function() {
				initPage();
				
				shellAPI.setPageIsLoaded(true);
			});
			
			Shadowbox.init({
				// let's skip the automatic setup because we don't have any
				// properly configured link elements on the page
				skipSetup: true,
				overlayOpacity: 1,
				overlayColor: "transparent",
				onOpen: function(){ $("#jquery_jplayer_1").jPlayer("pause"); },
				onClose: function(){ 
					var audioCurrTime = $("#jquery_jplayer_1").data("jPlayer").status.currentTime;
					var audioDuration = $("#jquery_jplayer_1").data("jPlayer").status.duration;
					if(audioCurrTime != 0 && audioCurrTime < audioDuration) {
						$("#jquery_jplayer_1").jPlayer("play"); 
					}
				}
			});
			
			initNavUI();
			
			initContentData();
			
			deserializeBookmark();
		}
	});
}


/*----------------------------------------*\
Serialize/Deserialize Persistent Storage Functions
\*----------------------------------------*/

//Creates a list of all completed pages, chapters, and tracks, then
//converts it to a string and saves it to persistent storage.
//The string is in the format of:
//"#pages:pageId1,pageId2#chaps:chapId1,chapId2#tracks:trackId1,trackId2"
function serializeCompletion() {
	//console.log("serializeCompletion()")
	var deserialized = {pages: [], chapters: [], tracks: []};
	var dPages = new Array();
	var dChaps = new Array();
	var dTracks = new Array();
	
	//gather all completed pages
	for (page in contentData.pages) {
		page = contentData.pages[page];
		if (page.isComplete == true) dPages.push(page.id);
	}
	
	//gather all completed chapters
	for (chapter in contentData.chapters) {
		chapter = contentData.chapters[chapter];
		if (chapter.isComplete == true) dChaps.push(chapter.id);
	}
	
	//gather all completed tracks
	for (track in contentData.tracks) {
		track = contentData.tracks[track];
		if (track.isComplete == true) dTracks.push(track.id);
	}
	
	//convert arrays to strings
	var sPages = dPages.toString();
	var sChaps = dChaps.toString();
	var sTracks = dTracks.toString();
	
	//combine all strings into format that is suspend_data friendly
	var serialized = "#pages:" + sPages + "#chaps:" + sChaps + "#tracks:" + sTracks;
	
	//store completion data to persistent storage
	if (STORAGE_MODE == "SCORM Driver") {
		scorm.SetDataChunk(serialized);
		scorm.CommitData();
	}else if (STORAGE_MODE == "cookies") {
		$.cookie(STORAGE_KEY+"_dataChunk", serialized, { expires: 360 });
	}
	
}

//Gets a list of completed pages from persistent storage as a string,
//then splits the string into arrays and sets isComplete=true on all
//pages, chapters, and tracks listed in persistent storage
function deserializeCompletion() {
	//console.log("deserializeCompletion()")
	var serialized;
	var deserialized;
	var dPages;
	var dChaps;
	var dTracks;
	
	//get completion data from persistent storage
	if (STORAGE_MODE == "SCORM Driver") {
		serialized = scorm.GetDataChunk();
	}else if (STORAGE_MODE == "cookies") {
		serialized = $.cookie(STORAGE_KEY+"_dataChunk");
	}
	
	//if SetDataChunk has never been called, SCORM Driver seems to return "(an empty string)" instead of ""
	if (serialized != undefined && serialized != null && serialized != "" && serialized != "(an empty string)") {
		
		//start deserializing completion data
		//pages, chapters, and tracks are delimited by "#"
		deserialized = serialized.split('#');
		for (var lcv = 0; lcv < deserialized.length; lcv++) {
			//strip out "pages:", "chaps:", and "tracks:" and assign to associated vars
			dPages = (dPages != undefined) ? dPages : deserialized[lcv].split('pages:')[1];
			dChaps = (dChaps != undefined) ? dChaps : deserialized[lcv].split('chaps:')[1];
			dTracks = (dTracks != undefined) ? dTracks : deserialized[lcv].split('tracks:')[1];
		}
		
		//convert comma delimited strings into arrays
		dPages = dPages.split(',');
		dChaps = dChaps.split(',');
		dTracks = dTracks.split(',');
		
		//mark pages complete
		if (dPages[0] != undefined && dPages[0] != "") {
			for (var i = 0; i < dPages.length; i++) {
				contentData.pages[dPages[i]].isComplete = true;
				
				//mark all slides in page complete
				for (var lcv = 0; lcv < contentData.pages[dPages[i]].slides.length; lcv++) {
					contentData.pages[dPages[i]].slides[lcv].isComplete = true;
				}
			}
		}
		
		//mark chapters complete
		if (dChaps[0] != undefined && dChaps[0] != "") {
			for (var i = 0; i < dChaps.length; i++) contentData.chapters[dChaps[i]].isComplete = true;
		}
		
		//mark tracks complete
		if (dTracks[0] != undefined && dTracks[0] != "") {
			for (var i = 0; i < dTracks.length; i++) contentData.tracks[dTracks[i]].isComplete = true;
		}
	}
}

function serializeBookmark() {
	var serialized = currentLocation.track.id + "," + currentLocation.chapter.id + "," + currentLocation.page.id
	
	//store completion data to persistent storage
	if (STORAGE_MODE == "SCORM Driver") {
		scorm.SetBookmark(serialized);
		scorm.CommitData();
	}else if (STORAGE_MODE == "cookies") {
		$.cookie(STORAGE_KEY+'_bookmark', serialized, { expires: 360 });
	}
}

function deserializeBookmark() {
	var serialized;
	var dSlide;
	var dPage;
	var dChap;
	var dTrack;
	
	//get completion data from persistent storage
	if (STORAGE_MODE == "SCORM Driver") {
		serialized = scorm.GetBookmark();
	}else if (STORAGE_MODE == "cookies") {
		serialized = $.cookie(STORAGE_KEY+'_bookmark');
	}
	
	if (serialized != undefined && serialized != null && serialized != "" && serialized != "(an empty string)") {
		var deserialized = serialized.split(',');
		dTrack = deserialized[0];
		dChap = deserialized[1];
		dPage = deserialized[2];
		dSlide = contentData.pages[dPage].slides[0].id;
		
		var bookmarkMarkup = '' +
		'<div id="bookmark-prompt-container" class="popup">' + 
			'<div id="bookmark-prompt-title" class="title">Welcome back!</div>' +
			'<div id="bookmark-prompt-message">是否从您上次结束的地方开始浏览？</div>' +
			
			'<div id="bookmark-prompt-btn-yes"' +
				'class="bookmark-prompt-btn"' +
				'onclick="bookmarkPromptHandleYes(\'' + dSlide+ '\',\''  + dPage + '\',\''  + dChap + '\',\''  + dTrack + '\')">' +
					'是' +
			'</div>' +
			
			'<div id="bookmark-prompt-btn-no"' +
				'class="bookmark-prompt-btn"' + 
				'onclick="bookmarkPromptHandleNo()">' +
					'否' +
			'</div>' +
		'</div>';
		
		Shadowbox.open({
			content:    bookmarkMarkup,
			player:     "html",
			height:     500,
			width:      978,
			options: {
				modal: true,
				displayNav: false,
				viewportPadding: 1,
				animate: false,
				onFinish: function() {
					$('#bookmark-prompt-container').ready(function(){
						$('#bookmark-prompt-container').fadeTo(0, 0, function() {
							$('#bookmark-prompt-container').fadeTo(500, 1); 
						});
					});
				}
			}
		})
	}
	else {
		dTrack = contentData.launchTrack;
		dChap = contentData.tracks[dTrack].chapters[0];
		dPage = contentData.chapters[dChap].pages[0];
		dSlide = contentData.pages[dPage].slides[0].id;
		setLocation(dSlide, dPage, dChap, dTrack);
	}
}

function bookmarkPromptHandleYes(bSlideId, bPageId, bChapterId, bTrackId) {
	setLocation(bSlideId, bPageId, bChapterId, bTrackId);
	Shadowbox.close();
}

function bookmarkPromptHandleNo() {
	var dTrack = contentData.launchTrack;
	var dChap = contentData.tracks[dTrack].chapters[0];
	var dPage = contentData.chapters[dChap].pages[0];
	var dSlide = contentData.pages[dPage].slides[0].id;
	setLocation(dSlide, dPage, dChap, dTrack);
	Shadowbox.close();
}



/*----------------------------------------*\
Initializes contentData properties not defined in courseData.js
\*----------------------------------------*/
function initContentData() {
	//console.log("initContentData()")
	
	for (page in contentData.pages) {
		for (var lcv = 0; lcv < contentData.pages[page].slides.length; lcv++) {
			contentData.pages[page].slides[lcv].isComplete = false;
			requiredFlags = 1;
			requiredFlags = (contentData.pages[page].slides[lcv].audio != "") ? requiredFlags+1 : requiredFlags;
			requiredFlags = (contentData.pages[page].slides[lcv].type == "interactive") ? requiredFlags+1 : requiredFlags;
			contentData.pages[page].slides[lcv].requiredFlags = requiredFlags;
			contentData.pages[page].slides[lcv].acquiredFlags = new Array();
		}
		contentData.pages[page].isComplete = false;
	}
	
	for (chapter in contentData.chapters) {
		contentData.chapters[chapter].isComplete = false;
	}
	
	for (track in contentData.tracks) {
		contentData.tracks[track].isComplete = false;
	}
	
	//now that everything has the isComplete property, mark
	//appropriate items as complete, per persistent storage
	deserializeCompletion();
	
}



/*----------------------------------------*\
Initializes Debug object and functions
\*----------------------------------------*/
function initDebug() {
	//debug = window.open('src/debug/debug.html', 'debug', "toolbar=no,location=no,directories=no,status=no,menubar=no,fullscreen=no,scrollbars=no,resizable=no,left=0,top=0,width=980,height=661");
	//log = debug.debugLogAppend;
	
	$('#shell').append("<div id='debug-window-container-small' style='display:block;'>" +
						"<dl><dt>Slide:</dt><dd><input id='debug-slide-id-small' type='text' />" +
						"<button id='debug-btn-skipToSlide-small' type='button' onclick='shellAPI.skipToPage($(\"#debug-slide-id-small\").val());'>Go</button>" +
						"</dd></dl><div>");
}



/*----------------------------------------*\
Initializes Menu properties and functions
\*----------------------------------------*/
function initMenuObj() {
	//console.log("initMenuObj()")
	menu = {
		open: function() {
			
			//start menu markup
			var menuMarkup = '' +
			
			'<div id="course-menu-container" class="popup" style="display: none;">' + 
				'<div id="course-menu-title" class="title" >菜单:</div>' + 
				'<div id="course-menu-close-btn" class="close" onClick="Shadowbox.close();">回到课程</div>' +
				'<div id="course-menu-rule"></div>';
			
			var chaptersMarkup = '<div id="course-menu-chapters-container" class="">';
			var pagesMarkup = '<div id="course-menu-pages-container" class="">';/*<div id="menu-pages-container-arrow"></div>';*/
			var currTrack = contentData.tracks[currentLocation.track.id];
			var currChapter;
			var currPage;
			var menuActiveChapter = "";
			
			//loop through chapters
			for (var lcvChap = 0; lcvChap < currTrack.chapters.length; lcvChap++) {
				currChapter = contentData.chapters[currTrack.chapters[lcvChap]];
				var chapId = currChapter.id;
				var chapLabel = (lcvChap+1) + ". " + currChapter.label;
				if (lcvChap < 9) chapLabel = "0" + chapLabel;
				var chapClasses = "course-menu-chapter";
				//add classes for complete chapters, if we decide to do that...
				//if (currChapter.isComplete) chapClasses += " ";
				
				//add chapter label to markup
				chaptersMarkup = chaptersMarkup + '<div id="ch' + chapId + '-label" class="' + chapClasses + '" onClick="menu.handleClickChapter(\'' + chapId + '\')" >' + chapLabel + '</div>';
				pagesMarkup = pagesMarkup + '<div id="ch' + chapId + '-page-btns" class="chapter-pages-menu" style="display: none;">';
				pagesMarkup = pagesMarkup + '<div class="chapter-pages-menu-title">' + chapLabel + '</div>';
				
				for (var lcvPg = 0; lcvPg < currChapter.pages.length; lcvPg++) {
					currPage = contentData.pages[currChapter.pages[lcvPg]];
					var pgId = currPage.id;
					var pgLabel = currPage.label;
					
					//init menu page button class
					var pgClasses = "course-menu-page"
					var pgClick = ""
					
					//add enabled/disabled class
					if (IS_GATED == false) {
						pgClasses += " course-menu-page-enabled";
						pgClick = "menu.setPage(\'" + chapId + "\', \'" + pgId + "\');"
					}
					else if (lcvPg == 0 && lcvChap == 0) {
						pgClasses += " course-menu-page-enabled"; //enable if it's the first page of the first chapter
						pgClick = "menu.setPage(\'" + chapId + "\', \'" + pgId + "\');"
					}
					else if (lcvPg == 0 && lcvChap > 0) {
						var prevChapter = contentData.chapters[currTrack.chapters[lcvChap-1]];
						var prevChapLastPage = contentData.pages[prevChapter.pages[prevChapter.pages.length-1]];
						//enable if previous page is complete
						if (prevChapLastPage.isComplete) {
							pgClasses += " course-menu-page-enabled"; 
							pgClick = "menu.setPage(\'" + chapId + "\', \'" + pgId + "\');"
						}
						//disable if it isn't enabled
						else { 
							pgClasses += " course-menu-page-disabled"; 
						}
					}
					else if (lcvPg > 0) {
						var prevPage = contentData.pages[currChapter.pages[lcvPg-1]];
						//enable if previous page is complete
						if (prevPage.isComplete) { 
							pgClasses += " course-menu-page-enabled";
							pgClick = "menu.setPage(\'" + chapId + "\', \'" + pgId + "\');"
						}
						//disable if it isn't enabled
						else { 
							pgClasses += " course-menu-page-disabled";
						}
					}
					
					//add complete class
					//if (currPage.isComplete) {
						//pgClasses += " course-menu-page-complete";
						pgLabel += '<div class="menu-pages-complete-check"></div>'
					//}
					
					//add current class
					if (currChapter.pages[lcvPg] == currentLocation.page.id) {
						pgClasses += " course-menu-page-current";
					}
					
					//add page label to markup
					pagesMarkup = pagesMarkup + '<div id="pg' + pgId + '-btn" class="' + pgClasses + '" onclick="' + pgClick + '" >' + pgLabel + '</div>';
				}
				
				//close chapter markup
				pagesMarkup = pagesMarkup + '</div>';
				
				//remember if this is the current chapter so the menu can open to it automatically
				if (chapId == currentLocation.chapter.id) {
					menuActiveChapter = chapId;
				}
			}
			
			//close menu markup
			chaptersMarkup = chaptersMarkup + '</div>';
			menuMarkup = menuMarkup + chaptersMarkup + pagesMarkup + '</div>';
			
			Shadowbox.open({
				content:    menuMarkup,
				player:     "html",
				height:     500,
				width:      978,
				options: {
					viewportPadding: 1,
					animate: false,
					displayNav: false,
					onFinish:	function() {
						$('#course-menu-container').ready(function(){
							//alert('fade to 0')
							$('#course-menu-container').fadeTo(0, 0, function() {
								//$("#course-menu-container").load(function() { 
									menu.handleClickChapter(menuActiveChapter);
									$('#course-menu-close-btn').mouseover(function (e) { $(e.target).addClass('course-menu-close-btn-hover'); });
									$('#course-menu-close-btn').mouseleave(function (e) { $(e.target).removeClass('course-menu-close-btn-hover'); });
									$('.course-menu-chapter').mouseover(function (e) { $(e.target).addClass('course-menu-chapter-hover'); });
									$('.course-menu-chapter').mouseleave(function (e) { $(e.target).removeClass('course-menu-chapter-hover'); });
									$('.course-menu-page').mouseover(function (e) { if ($(e.target).hasClass('course-menu-page-enabled')) $(e.target).addClass('course-menu-page-enabled-hover'); });
									$('.course-menu-page').mouseleave(function (e) { $(e.target).removeClass('course-menu-page-enabled-hover'); });
									//$('#ch' + menuActiveChapter + '-page-btns').css('display', 'block');
									$('#course-menu-container').fadeTo(500, 1); 
								//})
							});
						});
					}
				}
			})
			
		},
		handleClickChapter: function(chapterId) {
			var chapBtn = $('#ch' + chapterId + '-label');
			var chapBtnHeight = chapBtn.outerHeight();
			var chapBtnTop = Math.round(chapBtn.position().top);
			
			/*var arrow = $('#menu-pages-container-arrow');
			var arrowHeight = arrow.outerHeight();
			var arrowTop = chapBtnTop + ((chapBtnHeight - arrowHeight) / 2);*/
			
			$('.course-menu-chapter').removeClass('course-menu-chapter-active');
			chapBtn.addClass('course-menu-chapter-active');
			
			//arrow.css('top', arrowTop + 'px');
			
			$('.chapter-pages-menu').css('display', 'none');
			$('#ch' + chapterId + '-page-btns').css('display', 'block');
		},
		setPage: function (chapterId, pageId) {
			setLocation(contentData.pages[pageId].slides[0].id, pageId, chapterId, currentLocation.track.id, 0);
			Shadowbox.close();
		}
	};
}



/*----------------------------------------*\
Initializes Help properties and functions
\*----------------------------------------*/
function initHelpObj() {
	//console.log("initMenuObj()")
	help = {
		open: function() {
			
			//start menu markup
			/*
			var helpMarkup = '<div id="course-help-container" style="display: none;">';
			
			helpMarkup += '<div id="course-help-title">Help</div><div id="course-help-close-btn" onClick="Shadowbox.close();">回到课程</div><div id="course-help-items">';
			
			helpMarkup += '<div class="course-help-item"><div id="course-help-item-icon-next" class="course-help-item-icon"></div>';
			helpMarkup += '<div class="course-help-item-label">Next</div>';
			helpMarkup += '<div class="course-help-item-text">Click the Next button to advance to the next slide.</div></div>';
			
			helpMarkup += '<div class="course-help-item"><div id="course-help-item-icon-previous" class="course-help-item-icon"></div>';
			helpMarkup += '<div class="course-help-item-label">Previous</div>';
			helpMarkup += '<div class="course-help-item-text">Click the Previous button to return to the last slide.</div></div>';
			
			helpMarkup += '<div class="course-help-item"><div id="course-help-item-icon-menu" class="course-help-item-icon"></div>';
			helpMarkup += '<div class="course-help-item-label">Menu</div>';
			helpMarkup += '<div class="course-help-item-text">Click the Menu button to view the course menu.</div></div>';
			
			helpMarkup += '<div class="course-help-item"><div id="course-help-item-icon-help" class="course-help-item-icon"></div>';
			helpMarkup += '<div class="course-help-item-label">Help</div>';
			helpMarkup += '<div class="course-help-item-text">Click the Help button to view this help page.</div></div>';
			
			helpMarkup += '<div class="course-help-item"><div id="course-help-item-icon-replay" class="course-help-item-icon"></div>';
			helpMarkup += '<div class="course-help-item-label">Replay</div>';
			helpMarkup += '<div class="course-help-item-text">Click the Replay button to start the current slide from the beginning again.</div></div>';
			
			helpMarkup += '</div></div>'
			*/
			
			var helpMarkup = "" +
			'<div class="popup" id="help-container">' +
				'<div class="title"  id="help-header">帮助:</div>' +
				
				'<div id="help-item-container">' +
				
					'<div id="help-item-next" class="help-item">' +
						'<div class="help-item-icon"></div>' +
						'<div class="help-item-title">下一页</div>' +
						'<div class="help-item-description">点击"下一页"按钮前进到后一张幻灯.</div>' +
					'</div>' +
					
					'<div id="help-item-previous" class="help-item">' +
						'<div class="help-item-icon"></div>' +
						'<div class="help-item-title">上一页</div>' +
						'<div class="help-item-description">点击"上一页"按钮后退到前一张幻灯.</div>' +
					'</div>' +
					
					'<div id="help-item-menu" class="help-item">' +
						'<div class="help-item-icon"></div>' +
						'<div class="help-item-title">菜单</div>' +
						'<div class="help-item-description">点击"菜单"按钮查看课程菜单.</div>' +
					'</div>' +
					
					'<div id="help-item-help" class="help-item">' +
						'<div class="help-item-icon"></div>' +
						'<div class="help-item-title">帮助</div>' +
						'<div class="help-item-description">点击"帮助"按钮查看帮助页面.</div>' +
					'</div>' +
					
					'<div id="help-item-replay" class="help-item">' +
						'<div class="help-item-icon"></div>' +
						'<div class="help-item-title">重播</div>' +
						'<div class="help-item-description">点击"重播"按钮重新开始当前幻灯.</div>' +
					'</div>' +
					
					'<div id="help-item-subtitles" class="help-item">' +
						'<div class="help-item-icon"></div>' +
						'<div class="help-item-title">字幕</div>' +
						'<div class="help-item-description">点击"字幕"按钮查看该幻灯片相关内容字幕.</div>'+
					'</div>' +
					
				'</div>' +
				
				'<div class="vrule"></div>' +
				
				'<div class="close" id="help-close-btn" onClick="Shadowbox.close();">回到课程</div>' +
				
			'</div>';
			
			
			Shadowbox.open({
				content:    helpMarkup,
				player:     "html",
				width:      978,
				height:     500,
				options: {
					viewportPadding: 1,
					animate: false,
					displayNav: false,
					onFinish:	function() {
						$('#help-container').ready(function(){
							//alert('fade to 0')
							$('#help-container').fadeTo(0, 0, function() {
								//$("#course-help-container").load(function() { 
									$('#help-close-btn').mouseover(function (e) { $(e.target).addClass('help-close-btn-hover'); });
									$('#help-close-btn').mouseleave(function (e) { $(e.target).removeClass('help-close-btn-hover'); });
									$('#help-container').fadeTo(500, 1); 
								//})
							});
						});
					}
				}
			})
		}
	};
}



/*----------------------------------------*\
Initializes Current Location properties
Stores reference data for the user's current location in the course
\*----------------------------------------*/
function initCurrentLocationObj() {
	//console.log("initCurrentLocationObj()")
	currentLocation.track = {
		id: ""
	}
	currentLocation.chapter = {
		id: ""
	}
	currentLocation.page = {
		id: ""
	}
	currentLocation.slide = {
		index: 0,
		id: ""
	};
}



/*----------------------------------------*\
Initializes Shell API
Provides an API through which content can control and interact with the shell
\*----------------------------------------*/
function initShellAPIObj() {
	//console.log("initShellAPIObj()")
	shellAPI.addSlideFlag = addSlideFlag; /*function(flag) {
		if (contentData.pages[currentLocation.page.id].slides[currentLocation.slide.index].acquiredFlags.indexOf(flag == -1)) {
			contentData.pages[currentLocation.page.id].slides[currentLocation.slide.index].acquiredFlags.push(flag);
		}
		updatePageCompletion(currentLocation.page.id);
	}*/
	
	shellAPI.setPageIsLoaded = function(isLoaded) {
		// console.log("setPageIsLoaded: " + isLoaded);
		//alert(isLoaded)
		if (isLoaded == true) {
			$('#main-load-screen').fadeOut('fast');
			scrollWorking = false;
			updateNav();
		}
		else {
			$('#main-load-screen').fadeIn('fast');
			scrollWorking = true; /* Added: 4-16-2012, quickfix to stop people from advancing to the next slide while the screen is loading */
			disableNav();
		}
	}
	
	shellAPI.skipToPage = function(target){
		var arrTarget = target.split('-');
		//setPage(arrPage[0] + '-' + arrPage[1], target);
		var chapterId = arrTarget[0];
		var pageId = arrTarget[0];// + '-' + arrTarget[1];
		var slideId = target;
		shellAPI.setLocation(slideId, pageId);
	}
	
	shellAPI.setLocation = setLocation;
	shellAPI.getPageLabel = getPageLabel;
	shellAPI.getChapterLabel = getChapterLabel;
	
	shellAPI.data = function(key, value, bDelete) {
		if(bDelete){
			delete shellAPI_vars[key];
		}
		else if (shellAPI_vars[key] && !value) {
			return shellAPI_vars[key];
		}
		else if (value) {
			shellAPI_vars[key] = value;
		}
		else {
			return undefined;
		}
	}
	
	shellAPI.getStatus = function() {
		if (STORAGE_MODE == "SCORM Driver") {
			scorm.GetStatus();
		}else if (STORAGE_MODE == "cookies") {
			$.cookie(STORAGE_KEY+'_status');
		}
	}
	
	shellAPI.setPassed = function() {
		if (STORAGE_MODE == "SCORM Driver") {
			scorm.SetPassed();
			scorm.CommitData();
		}
	}
	
	shellAPI.getScore = function() {
		if (STORAGE_MODE == "SCORM Driver") {
			scorm.GetScore();
		}else if (STORAGE_MODE == "cookies") {
			$.cookie(STORAGE_KEY+'_score');
		}
	}
	
	shellAPI.setScore = function(intScore, intMaxScore, intMinScore) {
		intMaxScore = (intMaxScore) ? intMaxScore : 100;
		intMinScore = (intMinScore) ? intMinScore : 0;
		if (STORAGE_MODE == "SCORM Driver") {
			scorm.SetScore(intScore, intMaxScore, intMinScore);
			scorm.CommitData();
		}else if (STORAGE_MODE == "cookies") {
			$.cookie(STORAGE_KEY+'_score', intScore, { expires: 360 });
		}
	}
	
	shellAPI.getCurrentSlideId = function(){
		return "" + contentData.pages[currentLocation.page.id].slides[currentLocation.slide.index].id;
	}
	
	shellAPI.setDebugField = function(fieldString) {
		if(DEBUG_MODE == true){
			$('#debug-slide-id-small').val(fieldString);
		}
	}
	
	/* not used! may be useful to keep around for now?
	shellAPI.focusCurrentSlide = function() {
		var pageRef = document.getElementById('contentFrame').contentWindow;
		pageRef.$('#' + currentLocation.slide.id).focus();
		document.getElementById('contentFrame').contentWindow.$('#site').scrollTo('#' + currentLocation.slide.id, {
			duration: 0,
			axis: 'x',
			onAfter: function(){ scrollWorking = false; }
		});
	}
	*/
}



/*----------------------------------------*\
Initialize Audio playback functions
\*----------------------------------------*/
function initAudioObj() {
	//console.log("initAudioObj()")
	
	/**
	 * Play the audio file at the given path.  This will also trigger animations
	 * defined for the current page/slide.
	 *
	 * @param audioPath Path to the audio file to play.
	 * @return Void
	 */
	audio.playPath = function(audioPath) {
		
		// If the current slide has audio...
		if (audioPath != undefined && audioPath != null && audioPath != '') {
			// Fade in loading indicator
			$('#audio-load-screen').fadeIn();
			
			//Reset subtitles
			navManager.getState("subtitles").setAudioStatus(false);
			navManager.getState("subtitles").setLocation(currentLocation.slide.id);
			navManager.getState("subtitles").goToSubtitle(0)
		}
		
		// If the current slide does NOT have audio...
		else {
			$('#audio-load-screen').fadeOut();
			$('#jquery_jplayer_1').jPlayer("stop");
		}
		
		// Set up a "cache buster" to prevent browser from using cached audio.
		var audioPathNoCache = audioPath + '?nocache=' + jsDate.getTime();
		
		// Play the audio for this content panel
		$('#jquery_jplayer_1').jPlayer("setMedia", {
			//this should be updated already
			mp3: audioPathNoCache
		});
		$('#jquery_jplayer_1').jPlayer("play");
		
		// Reset cue index (for use by animation engine + subtitles).
		audio.cueIndex = 0;
		
		// Reset markup/animations for the slide (if necessary).
		var contentPage = document.getElementById('contentFrame').contentWindow;
		var slideId = contentData.pages[currentLocation.page.id].slides[currentLocation.slide.index].id;
		
		// Only reset slide if it has slideData assigned to it in the page.
		if (typeof contentPage.slideData != 'undefined') {
			if (typeof contentPage.slideData[slideId] != 'undefined') {
				
				// Gather some info about the slide so we can continue with our
				// decision making.
				var slide = contentPage.document.getElementById(slideId);
				var cueLen = contentPage.slideData[slideId].cues.length | 0;
				var slideContent = contentPage.slideData.markup[slideId];
				contentPage.$('#' + slideId + ' *').stop(true);
				
				// Only reset animation if:
				// - The current HTML is different from the original slide HTML.
				//   AND
				// - The current slide contains 1 or more cues.
				if (cueLen > 0) {
					if (slide.innerHTML != slideContent) {
						slide.innerHTML = contentPage.slideData.markup[slideId];
						
						contentPage.$('#'+slide.id).trigger("getFocus");
					}
				}
				
				// Call the init() method assigned to the current slide.
				// (If necessary).
				if (typeof contentPage.slideData[slideId].init != 'undefined') {
					contentPage.slideData[slideId].init();
					/*var cues = contentPage.slideData[slideId].cues;
					if (audio.cueIndex < cues.length) {
						if (e.jPlayer.status.currentTime >= cues[audio.cueIndex].time) {
							cues[audio.cueIndex].handler();
							audio.cueIndex++;
						}
					}*/
				}
			}
		}
	}
	
	audio.playSlideById = function(pageId, slideId) {
		audio.playPath(contentData.pages[pageId].slides[slideId].audio);
	}
	
	audio.playCurrentSlide = function() {
		audio.playPath(contentData.pages[currentLocation.page.id].slides[currentLocation.slide.index].audio);
	}
	
	
	audio.replay = function() {
		// Hide "Next to Advance" tooltip.
		tooltip.hide();
		
		// Clear slide's acquiredFlags array.
		clearSlideFlags(currentLocation.page.id, currentLocation.slide.id);
		addSlideFlag('visited', currentLocation.page.id, currentLocation.slide.id);
		
		// Reset subtitles.
		navManager.getState("subtitles").setAudioStatus(false);
		navManager.getState("subtitles").setLocation(currentLocation.slide.id);
		//contentData.pages[currentLocation.page.id].slides[currentLocation.slide.index].acquiredFlags = ['visited'];
		
		// Reset audio and play it again.
		$("#jquery_jplayer_1").jPlayer("stop"); 
		audio.playPath(contentData.pages[currentLocation.page.id].slides[currentLocation.slide.index].audio);
	}
	
	// Event Handlers
	audio.eventPlayerEnded = function(e, eventName){
		//console.log(eventName + ": " + e.jPlayer.status.currentTime + ", " + e.jPlayer.status.duration + ", " + e.jPlayer.status.src);
		// Add slide flag if jPlayer ended event.
		if (eventName == 'ended') {
			addSlideFlag('audio');
			
			navManager.getState("subtitles").setAudioStatus(true);
			navManager.getState("subtitles").showSubtitleNav();
		}
		// Solution for issue where jPlayer ended event doesn't always fire in iOS5.
		else if (eventName == 'pause' && e.jPlayer.status.src.split("?nocache=")[0] != "") {
			// If pause event fires at the end of the audio, treat it the same 
			// as the ended event.
			if (e.jPlayer.status.currentTime == e.jPlayer.status.duration && e.jPlayer.status.currentTime != 0 && e.jPlayer.status.currentTime != 'NaN') {
				addSlideFlag('audio');
				
				navManager.getState("subtitles").setAudioStatus(true);
				navManager.getState("subtitles").showSubtitleNav();
			}
		}
	}
	
	// Variable to keep track of what the current cue is.  This is part of what
	// drives the animation engine and subtitles.
	audio.cueIndex = 0;
	
	audio.updateCueObserver = function(e) {
		// Hide audio loading indicator.
		if (e.jPlayer.status.currentTime > 0) $('#audio-load-screen').fadeOut();
		
		var contentPage = document.getElementById('contentFrame').contentWindow;
		var slideId = contentData.pages[currentLocation.page.id].slides[currentLocation.slide.index].id;
		if (typeof contentPage.slideData != 'undefined') {
			if (typeof contentPage.slideData[slideId] != 'undefined') {
				if (typeof contentPage.slideData[slideId].cues != 'undefined') {
					var cues = contentPage.slideData[slideId].cues;
					if (audio.cueIndex < cues.length) {
						if (e.jPlayer.status.currentTime >= cues[audio.cueIndex].time) {
							cues[audio.cueIndex].handler();
							audio.cueIndex++;
						}
					}
				}
			}
		}
		
		// Update subtitles.
		var navState = navManager.getState("subtitles")
		if (typeof subtitleData != 'undefined') {
			if (typeof subtitleData.subtitles != 'undefined') {
				if (typeof subtitleData.subtitles[slideId] != 'undefined') {
					if (typeof subtitleData.subtitles[slideId].cues != 'undefined') {
						if (navState.subtitleIndex < navState.subtitles.length) {
							if (e.jPlayer.status.currentTime >= navState.subtitles[navState.subtitleIndex + 1].time) {
								navState.goToSubtitle(navState.subtitleIndex + 1)
							}
						}
					}
				}
			}
		}
		
	}
}



/*----------------------------------------*\
Initialize Tooltip Object
\*----------------------------------------*/
function initTooltipObj(){
	
	tooltip.show = function(target, duration){
		if (duration === undefined) duration = 250;
		if (duration !== undefined) tooltip.setTip(target);
		$('#tip-container').fadeIn(duration);
	}
	
	tooltip.hide = function(duration){
		if (duration === undefined) duration = 250;
		$('#tip-container').fadeOut(duration);
	}
	
	tooltip.setTip = function (target){
		var text = 'no text set';
		
		switch (target) {
		case 'btn-next':
			text = '点击进入下一页';
			$('#tip-container').removeClass('tip-btn-replay');
			$('#tip-container').addClass('tip-btn-next');
			break;
		case 'btn-replay':
			text = 'There seems to be a problem starting your audio. Click here to try reloading it.';
			$('#tip-container').removeClass('tip-btn-next');
			$('#tip-container').addClass('tip-btn-replay');	
			break;
		}
		
		$('#tip-text').text(text);
	}
}

/*----------------------------------------*\
Initialize navigation UI.
\*----------------------------------------*/
var navManager;
function initNavUI() {
	navManager = new NavManager();
	navManager.add("default", new DefaultNavState("default-nav-bar", SHELL));
	navManager.add("subtitles", new SubtitleNavState("subtitle-nav-bar", SHELL));
	navManager.set("default");
	
}

/*----------------------------------------*\
Enable/disable navigation functions
\*----------------------------------------*/
function updateNav() {
	//console.log("updateNav()")
	var slideIndex = currentLocation.slide.index;
	var slidesArray = contentData.pages[currentLocation.page.id].slides;
	
	// Check prev button
	if(slidesArray[slideIndex] == getFirstSlide()) {
		disableBtnPrevious();
	}
	else {
		enableBtnPrevious();
	}
	
	// Check next button
	if((slidesArray[slideIndex].isComplete == true || IS_GATED == false) && slidesArray[slideIndex] != getLastSlide()) {
		enableBtnNext();
	} else {
		disableBtnNext();
	}
	
	//Enable buttons not related to gating
	enableBtnMenu();
	enableBtnHelp();
	enableBtnReplay();
	
	// Update headers
	updateHeaderSlide((slideIndex + 1), slidesArray.length);
	updateHeaderPage(getPageLabel(currentLocation.page.id));
	updateHeaderChapter(getChapterLabel(currentLocation.chapter.id));
	
	if(DEBUG_MODE == true){
		/*if(debug.debugSetSlideId != undefined){
			debug.debugSetSlideId(currentLocation.slide.id);
		}*/
		$('#debug-slide-id-small').val(currentLocation.slide.id);
	}
	
}

function disableNav() {
	disableBtnNext();
	disableBtnPrevious();
	disableBtnMenu();
	disableBtnReplay();
	disableBtnHelp();
}

var navFadeDuration = 250; //in milliseconds
var navFadeOutOpacity = .4; //in decimal; 0=0% opacity, 1=100% opacity
var navFadeInOpacity = 1; //in decimal; 0=0% opacity, 1=100% opacity

function enableBtnNext() {
	//console.log("enableBtnNext()")
	/*
	$('#btn-next').unbind('click').click(function(){ gotoNextSlide(); });
	$('#btn-next').removeClass("shell-btn-disabled");
	*/
	navManager.current.enable("btn-next");
}

function disableBtnNext() {
	//console.log("disableBtnNext()")
	/*
	$('#btn-next').unbind('click');
	$('#btn-next').addClass("shell-btn-disabled");
	*/
	navManager.current.disable("btn-next");
}

function enableBtnPrevious() {
	//console.log("enableBtnPrevious()")
	/*
	$('#btn-previous').unbind('click').click(function(){ gotoPreviousSlide(); });
	$('#btn-previous').removeClass("shell-btn-disabled");
	*/
	navManager.current.enable("btn-previous");
}

function disableBtnPrevious() {
	//console.log("disableBtnPrevious()")
	/*
	$('#btn-previous').unbind('click');
	$('#btn-previous').addClass("shell-btn-disabled");
	*/
	navManager.current.disable("btn-previous");
}

function enableBtnMenu() {
	//console.log("enableBtnMenu()")
	/*
	$('#btn-menu').unbind('click').click(function(){ menu.open(); });
	$('#btn-menu').removeClass("shell-btn-disabled");
	*/
	navManager.current.enable("btn-menu");
}

function disableBtnMenu() {
	//console.log("disableBtnMenu()")
	/*
	$('#btn-menu').unbind('click');
	$('#btn-menu').addClass("shell-btn-disabled");
	*/
	navManager.current.disable("btn-menu");
}

function enableBtnHelp() {
	//console.log("enableBtnHelp()")
	/*
	$('#btn-help').unbind('click').click(function(){ help.open(); });
	$('#btn-help').removeClass("shell-btn-disabled");
	*/
	navManager.current.enable("btn-help");
}

function disableBtnHelp() {
	//console.log("disableBtnHelp()")
	/*
	$('#btn-help').unbind('click');
	$('#btn-help').addClass("shell-btn-disabled");
	*/
	navManager.current.disable("btn-help");
}

function enableBtnReplay() {
	//console.log("enableBtnReplay()")
	/*
	$('#btn-replay').unbind('click').click(function(){ audio.replay(); });
	$('#btn-replay').removeClass("shell-btn-disabled");
	*/
	navManager.current.enable("btn-replay");
}

function disableBtnReplay() {
	//console.log("disableBtnReplay()")
	/*
	$('#btn-replay').unbind('click');
	$('#btn-replay').addClass("shell-btn-disabled");
	*/
	navManager.current.disable("btn-replay");
}



/*----------------------------------------*\
Update header functions
\*----------------------------------------*/
function updateHeaderSlide(currSlide, totalSlides) {
	// console.log("updateHeaderSlide()")
	$(".slide-counter-current").html(currSlide);
	$(".slide-counter-total").html(totalSlides);
}

function updateHeaderPage(label) {
	//console.log("updateHeaderPage()")
	if ($('#header-page').html() != label) {
		$('#header-page').fadeOut(250, function() {
			$('#header-page').html(label);
			$('#header-page').fadeIn(250);
		});
	}
}

function updateHeaderChapter(label) {
	//console.log("updateHeaderChapter()")
	if ($('#header-chapter').html() != label) {
		$('#header-chapter').fadeOut(250, function() {
			$('#header-chapter').html(label);
			$('#header-chapter').fadeIn(250);
		});
	}
}



/*----------------------------------------*\
Course Data helper functions
\*----------------------------------------*/
function getPageLabel(pageId) {
	return contentData.pages[pageId].label
}

function getChapterLabel(chapId) {
	return contentData.chapters[chapId].label
}

function getLastSlide() {
	var lastChapterId = contentData.tracks[currentLocation.track.id].chapters[contentData.tracks[currentLocation.track.id].chapters.length - 1];
	var lastPageId = contentData.chapters[lastChapterId].pages[contentData.chapters[lastChapterId].pages.length - 1];
	return contentData.pages[lastPageId].slides[contentData.pages[lastPageId].slides.length - 1]
}

function getFirstSlide() {
	var firstChapterId = contentData.tracks[currentLocation.track.id].chapters[0];
	var firstPageId = contentData.chapters[firstChapterId].pages[0];
	return contentData.pages[firstPageId].slides[0]
}



/*----------------------------------------*\
Completion tracking functions
\*----------------------------------------*/
function updatePageCompletion(pageId) {
	//console.log("updatePageCompletion()")
	var page = contentData.pages[pageId];
	var pageCompleted = true;
	var slide;
	var pageLength = page.slides.length;
	
	for (var lcv = 0; lcv < pageLength; lcv++) {
		slide = page.slides[lcv];
		
		if (slide.acquiredFlags.length >= slide.requiredFlags || slide.isComplete == true) {
			//console.log("slide.isComplete = true")
			slide.isComplete = true;
		}
		else {
			pageCompleted = false;
		}
	}
	
	//console.log("updating page completion...")
	
	if (pageCompleted == true) {
		page.isComplete = true;
		//updateChapterCompletion();
		serializeCompletion(); //temporary, just so I can see what's getting marked complete
	}
	
	updateNav();
}

function updateChapterCompletion(chapterId) {
	//console.log("updateChapterCompletion()")
	
}

function updateTrackCompletion(trackId) {
	//console.log("updateTrackCompletion()")
	
}

//should require a page and slide ID as parameters; should be more "strict"
function addSlideFlag(flag, pageId, slideId) {
	pageId = (pageId) ? pageId : currentLocation.page.id;
	slideId = (slideId) ? slideId : currentLocation.slide.id;
	//console.log("addSlideFlag(" + flag + ", " + pageId + ", " + slideId + ")")
	//console.log("---")
	var slide;
	
	for (var lcv = 0; lcv < contentData.pages[pageId].slides.length; lcv++) {
		if (slideId == contentData.pages[pageId].slides[lcv].id) slide = contentData.pages[pageId].slides[lcv];
	}
	/*
	//if the slide is already complete
	if (slide.isComplete == true && slide != getLastSlide()) {
		//show advance tooltip if audio just finished
		if (flag == 'audio') tooltip.show('btn-next');
		if (flag == 'visited' && slide.audio == '') tooltip.show('btn-next');
	}
	*/
	//if the slide hasn't been marked complete yet
	if ($.inArray(flag, slide.acquiredFlags) == -1/* && slide.isComplete != true*/) {
		slide.acquiredFlags.push(flag);
		if (slide.acquiredFlags.length >= slide.requiredFlags) {
			slide.isComplete = true;
			//show advance tooltip
			if (slide != getLastSlide()) tooltip.show('btn-next');
		}
	}
	
	updatePageCompletion(pageId);
}

function clearSlideFlags(pageId, slideId) {
	pageId = (pageId) ? pageId : currentLocation.page.id;
	slideId = (slideId) ? slideId : currentLocation.slide.id;
	//console.log("clearSlideFlags(" + pageId + ", " + slideId + ")")
	
	for (var lcv = 0; lcv < contentData.pages[pageId].slides.length; lcv++) {
		if (slideId == contentData.pages[pageId].slides[lcv].id) contentData.pages[pageId].slides[lcv].acquiredFlags = [];
	}
}



/*----------------------------------------*\
Content Loading Functions
\*----------------------------------------*/
function setLocation(slideId, pageId, chapterId, trackId, transitionDuration) {
	//console.log("setLocation(" + slideId + ", " + pageId + ", " + chapterId + ", " + trackId + ")");
	slideId = (slideId) ? slideId : currentLocation.slide.id;
	pageId = (pageId) ? pageId : currentLocation.page.id;
	chapterId = (chapterId) ? chapterId : currentLocation.chapter.id;
	trackId = (trackId) ? trackId : currentLocation.track.id;
	
	//console.log(slideId +'\n'+ pageId +'\n'+ chapterId +'\n'+ trackId);
	
	
	if (trackId != currentLocation.track.id) {
		setTrack(trackId);
		setChapter(chapterId);
		setPage(pageId, slideId);
	}
	else if (chapterId != currentLocation.chapter.id) {
		setChapter(chapterId);
		setPage(pageId, slideId);
	}
	else if (pageId != currentLocation.page.id) {
		setPage(pageId, slideId);
	}
	else if (slideId != currentLocation.slide.id) {
		var slideIndex = 0;
		for (var lcv = 0; lcv < contentData.pages[pageId].slides.length; lcv++) {
			if (slideId == contentData.pages[pageId].slides[lcv].id) slideIndex = lcv;
		}
		gotoSlide(slideIndex, transitionDuration);
	}
	
	tooltip.hide();
	//clear slide's acquiredFlags array
	clearSlideFlags(pageId, slideId);
	addSlideFlag('visited', pageId, slideId);
	
	// Update subtitles.
	navManager.getState("subtitles").setLocation(slideId);
	
	serializeBookmark();
}

function setPage(pageId, slideId) {
	// console.log("setPage("+pageId+", "+slideId+")");
	shellAPI.setPageIsLoaded(false);
	document.getElementById('contentFrame').src = contentData.pages[pageId].path + "#" + slideId;
	currentLocation.page.id = pageId;
	currentLocation.slide.id = slideId;
	var newPage = contentData.pages[pageId];
	for (var lcv = 0; lcv < newPage.slides.length; lcv++) {
		if (newPage.slides[lcv].id == slideId) {
			currentLocation.slide.index = lcv;
			break;
		}
	}
	// Play the audio for this content panel
	audio.playCurrentSlide();
}

function setChapter(chapId) {
	//console.log("setChapter()")
	currentLocation.chapter.id = chapId;
}

function setTrack(trackId) {
	//console.log("setTrack()")
	currentLocation.track.id = trackId;
}

function initPage() {
	//console.log("initPage()")
	var pageRef = document.getElementById('contentFrame').contentWindow;
	//console.log(pageRef);
	pageRef.shellAPI = shellAPI;
	//disableNav();
	pageRef.initPage();
}



/*----------------------------------------*\
Navigation functions
Navigates between slides, pages, and chapters
\*----------------------------------------*/
var scrollWorking = false;
function gotoSlide(index, transitionDuration) {
	//console.log("gotoSlide()")
	
	transitionDuration = (transitionDuration || typeof transitionDuration == "number") ? transitionDuration : 1000;
	
	if(!scrollWorking) {
		scrollWorking = true;
		
		var slidesArray = contentData.pages[currentLocation.page.id].slides;
		
		currentLocation.slide.index = index;
		currentLocation.slide.id = slidesArray[index].id;
		//console.log(currentLocation.slide.id);
		audio.playCurrentSlide();
		
		// Run scroll animation
		document.getElementById('contentFrame').contentWindow.$('#site').scrollTo('#' + currentLocation.slide.id, {
			duration: transitionDuration,
			axis: 'x',
			onAfter: function(){
				scrollWorking = false;
				
				var contentPage = document.getElementById('contentFrame').contentWindow;
				var slideId=contentPage.location.href.split("#")[1];
				contentPage.$("#"+slideId).html(contentPage.slideData.markup[slideId]);


				//document.getElementById('contentFrame').contentWindow.$("#"+document.getElementById('contentFrame').contentWindow.location.href.split("#")[1]).trigger("lostFocus");
				document.getElementById('contentFrame').contentWindow.$('#'+currentLocation.slide.id).trigger("getFocus");
				document.getElementById('contentFrame').src = contentData.pages[currentLocation.page.id].path + "#" + currentLocation.slide.id;
			}
		});
	}
}

function gotoNextSlide() {
	//console.log("gotoNextSlide()")
	if (currentLocation.slide.index < contentData.pages[currentLocation.page.id].slides.length - 1) {
		setLocation(contentData.pages[currentLocation.page.id].slides[currentLocation.slide.index + 1].id);
	}
	else {
		gotoNextPage();
	}
}

function gotoPreviousSlide() {
	//console.log("gotoPreviousSlide()")
	if (currentLocation.slide.index > 0) {
		setLocation(contentData.pages[currentLocation.page.id].slides[currentLocation.slide.index - 1].id);
	}
	else {
		gotoPreviousPage();
	}
}

function gotoNextPage() {
	//console.log("gotoNextPage()")
	var currChap = contentData.chapters[currentLocation.chapter.id];
	var currPage = contentData.pages[currentLocation.page.id];
	for (var lcv = 0; lcv < currChap.pages.length; lcv++) {
		if (currPage.id == currChap.pages[lcv]) {
			if (lcv < currChap.pages.length - 1) {
				var nextPageId = currChap.pages[lcv + 1];
				var firstSlideId = contentData.pages[nextPageId].slides[0].id;
				setLocation(firstSlideId, nextPageId, currentLocation.chapter.id);
			}
			else {
				gotoNextChapter();
			}
		}
	}
}

function gotoPreviousPage() {
	//console.log("gotoPreviousPage()")
	var currChap = contentData.chapters[currentLocation.chapter.id];
	var currPage = contentData.pages[currentLocation.page.id];
	for (var lcv = 0; lcv < currChap.pages.length; lcv++) {
		if (currPage.id == currChap.pages[lcv]) {
			if (lcv > 0) {
				var prevPageId = currChap.pages[lcv - 1];
				var lastSlideId = contentData.pages[currChap.pages[lcv - 1]].slides[contentData.pages[currChap.pages[lcv - 1]].slides.length - 1].id;
				setLocation(lastSlideId, prevPageId, currentLocation.chapter.id);
			}
			else {
				gotoPreviousChapter();
			}
		}
	}
}

function gotoNextChapter() {
	//console.log("gotoNextChapter()")
	var currTrack = contentData.tracks[currentLocation.track.id];
	var currChap = contentData.chapters[currentLocation.chapter.id];
	for (var lcv = 0; lcv < currTrack.chapters.length; lcv++) {
		if (currChap.id == currTrack.chapters[lcv]) {
			if (lcv < currTrack.chapters.length - 1) {
				var newChapId = currTrack.chapters[lcv + 1]
				var newPageId = contentData.chapters[newChapId].pages[0];
				var newSlideId = contentData.pages[newPageId].slides[0].id;
				setLocation(newSlideId, newPageId, newChapId);
			}
			else {
				//console.log('This is the last slide of the last page of the last chapter.  There is nowhere left to go.  Give up now.');
			}
		}
	}
}

function gotoPreviousChapter() {
	//console.log("gotoPreviousChapter()")
	var currTrack = contentData.tracks[currentLocation.track.id];
	var currChap = contentData.chapters[currentLocation.chapter.id];
	for (var lcv = 0; lcv < currTrack.chapters.length; lcv++) {
		if (currChap.id == currTrack.chapters[lcv]) {
			if (lcv > 0) {
				var newChapId = currTrack.chapters[lcv - 1];
				var newPageId = contentData.chapters[newChapId].pages[contentData.chapters[newChapId].pages.length - 1];
				var newSlideId = contentData.pages[newPageId].slides[contentData.pages[newPageId].slides.length - 1].id;
				//setChapter(newChapId, newPageId, newSlideId);
				setLocation(newSlideId, newPageId, newChapId);
			}
			else {
				//console.log('This is the first slide of the first page of the first chapter.  Please turn around and go that way.');
			}
		}
	}
}



/*----------------------------------------*\
Functions and properties that are unused currently
\*----------------------------------------*/
function getSlideById(slideId, pageId) {
	//console.log("getSlideById()")
	pageId = pageId || currentLocation.page.id;
	targetPage = contentData[pageId];
	
	for (var lcv = 0; lcv < targetPage.slides.length; lcv++) {
		if (slideId == targetPage.slides[lcv].id) {
			return targetPage.slides[lcv];
		}
	}
}