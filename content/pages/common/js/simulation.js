// Constant var's
var settings = new Object();
var simsArray = new Array();
var simIsScrolling = false;
// An interval to check if an input textbox has the expected input in it yet.
var simTextCheckInt;

initialize();

/*----------------------------------------*\
Initialize Simulation values
\*----------------------------------------*/
function initialize(){
	settings.step = new Object();
	settings.dialog = new Object();
	settings.tooltip = new Object();
	settings.simType = undefined;

	//DEFAULT VALUES
	//these values may be overwritten in the simData array's settings{} object
	settings.step.text_width 		= 310; 		//step text width 		(subtract padding) (only used for Sidebar sims)
	settings.step.text_height 		= 541; 		//step text height		(subtract padding) (only used for Sidebar sims)
	
	settings.step.container_top 	= 65; 		//image container top
	settings.step.container_left 	= 0; 		//image container left (this default value isn't used, its value gets set in simulationGenerate)
	settings.step.container_width 	= 720; 		//image container width
	settings.step.container_height 	= 540; 		//image container height
	
	settings.step.screenshot_width 	= 720; 		//screenshot width
	settings.step.screenshot_height = 540; 		//screenshot height
	
	settings.tooltip.ost_width 		= 400; 		//tooltip on screen text width
	settings.dialog.ost_width 		= 400; 		//tooltip on screen text width
}


/*----------------------------------------*\
Generate simulation DOM
\*----------------------------------------*/
function simulationGenerate(_simData){
	
	var useCustomSettings = false;
	
	//Initialize settings/var's and generate the sim based on its type
	switch(_simData.type){
		case "tooltip":
			settings.simType 				= "tooltip";
			
			//Check if we can use custom settings for the sim
			if("settings" in _simData){
				useCustomSettings = true;
			}
			
			settings.step.container_width 	= (useCustomSettings && _simData.settings.container_width 	!= undefined && _simData.settings.container_width 	!== "") ? _simData.settings.container_width 		: settings.step.container_width;
			settings.step.container_height 	= (useCustomSettings && _simData.settings.container_height 	!= undefined && _simData.settings.container_height 	!== "") ? _simData.settings.container_height 	: settings.step.container_height;
			settings.step.container_top 	= (useCustomSettings && _simData.settings.container_top 	!= undefined && _simData.settings.container_top 	!== "") ? _simData.settings.container_top 		: settings.step.container_top;
			settings.step.container_left 	= (useCustomSettings && _simData.settings.container_left 	!= undefined && _simData.settings.container_left 	!== "") ? _simData.settings.container_left 		: ($('#' + _simData.slide).width() - settings.step.container_width) / 2;	
			settings.step.screenshot_width 	= (useCustomSettings && _simData.settings.screenshot_width 	!= undefined && _simData.settings.screenshot_width 	!== "") ? _simData.settings.screenshot_width 	: settings.step.screenshot_width;
			settings.step.screenshot_height = (useCustomSettings && _simData.settings.screenshot_height != undefined && _simData.settings.screenshot_height !== "") ? _simData.settings.screenshot_height 	: settings.step.screenshot_height;
			
			settings.tooltip.ost_width 		= (useCustomSettings && _simData.settings.tooltip_ost_width != undefined && _simData.settings.tooltip_ost_width !== "") ? _simData.settings.tooltip_ost_width 	: settings.tooltip.ost_width;
			settings.dialog.ost_width		= (useCustomSettings && _simData.settings.dialog_ost_width 	!= undefined && _simData.settings.dialog_ost_width 	!== "") ? _simData.settings.dialog_ost_width 	: settings.dialog.ost_width;
			
			//Add sim data to simsArray
			simsArray[_simData.slide] = _simData;		
			
			simTypeTooltips(_simData);
		break;
		case "popup":
			settings.simType 				= "popup";
			
			//Check if we can use custom settings for the sim
			if("settings" in _simData){
				useCustomSettings = true;
			}
			
			settings.step.container_width 	= (useCustomSettings && _simData.settings.container_width 	!= undefined && _simData.settings.container_width 	!== "") ? _simData.settings.container_width 		: settings.step.container_width;
			settings.step.container_height 	= (useCustomSettings && _simData.settings.container_height 	!= undefined && _simData.settings.container_height 	!== "") ? _simData.settings.container_height 	: settings.step.container_height;
			settings.step.container_top 	= (useCustomSettings && _simData.settings.container_top 	!= undefined && _simData.settings.container_top 	!== "") ? _simData.settings.container_top 		: settings.step.container_top;
			settings.step.container_left 	= (useCustomSettings && _simData.settings.container_left 	!= undefined && _simData.settings.container_left 	!== "") ? _simData.settings.container_left 		: ($('#' + _simData.slide).width() - settings.step.container_width) / 2;
			
			settings.step.screenshot_width 	= (useCustomSettings && _simData.settings.screenshot_width 	!= undefined && _simData.settings.screenshot_width 	!== "") ? _simData.settings.screenshot_width 	: settings.step.screenshot_width;
			settings.step.screenshot_height = (useCustomSettings && _simData.settings.screenshot_height != undefined && _simData.settings.screenshot_height !== "") ? _simData.settings.screenshot_height 	: settings.step.screenshot_height;
			
			settings.tooltip.ost_width 		= (useCustomSettings && _simData.settings.tooltip_ost_width != undefined && _simData.settings.tooltip_ost_width !== "") ? _simData.settings.tooltip_ost_width 	: settings.tooltip.ost_width;
			settings.dialog.ost_width		= (useCustomSettings && _simData.settings.dialog_ost_width 	!= undefined && _simData.settings.dialog_ost_width 	!== "") ? _simData.settings.dialog_ost_width 	: settings.dialog.ost_width;
			simTypePopups(_simData);
		break;
	}
}

function simTypeTooltips(_simData){
	var cssClass 			= "";
	var cssDisplay 			= "";
	var cssZindex 			= "0";
	
	var simContainer		= "";
	var htmlImage 			= "";
	var htmlStepContainer 	= "";
	var htmlStepPart		= "";
	
	var nextStepVars 		= "";
	var nextImgId 			= 0;
	
	var focusX 				= "";
	var focusY 				= "";
	var simDataLength 		= _simData.steps.length;
	var slideId 			= _simData.slide;
	var stepData 			= _simData.steps;
	var iNextStep			= 0;
	
	for (var i=0; i < simDataLength; i++){
		if(i == 0){
			simContainer 	= "<div id='" + slideId + "-sim-container' class='sim-container' " +
								"style=' width: " +  settings.step.container_width + "px; " +
										"height: " +  settings.step.container_height + "px; " +
										"top: " +  settings.step.container_top + "px; " +
										"left: " +  settings.step.container_left + "px;'" +
							">";
			simContainer 	+= "<input id='" + slideId + "-sim-maxsteps' type='hidden' value='" + (simDataLength-1) + "' />";
			cssDisplay = "block";
			nextImgId = 1;
			cssZindex = "1000";
		}else{
			cssDisplay = "none";
			nextImgId = i+1;
			cssZindex = "1";
		}
		
		// Get focus coordinates
		focusX = (i == (simDataLength - 1)) ? getFocusPixel(stepData[i].focusX, "x") : getFocusPixel(stepData[i+1].focusX, "x");
		focusY = (i == (simDataLength - 1)) ? getFocusPixel(stepData[i].focusY, "y") : getFocusPixel(stepData[i+1].focusY, "y");
		
		//Set the variables to be passed to the function that calls the next simulation image
		//nextStepVars = "\"" + slideId + "\", " + nextImgId + ", " + simDataLength + ", " + focusX + ", " + focusY + ", " + "\"" + _simData.type + "\"";
		
		iNextStep = (i == (simDataLength-1)) ? 0 : i+1;
			
		//Replace step text apostrophe's, that break HTML js events
		stepData[i].stepText = stepData[i].stepText.replace(/[']/g, "&#96;");
		stepData[iNextStep].stepText = stepData[iNextStep].stepText.replace(/[']/g, "&#96;");
		
		nextStepVarsObj = {
			slideId: slideId,
			stepNum: nextImgId,
			simDataLength: simDataLength,
			focusX:	focusX,
			focusY: focusY,
			simType: _simData.type,
			stepData: stepData[i],
			nextStepData: stepData[iNextStep]
		};
		
		
		nextStepVars = JSON.stringify(nextStepVarsObj);
		
		htmlStepPart = "<div id='" + slideId + "-step-part" + i + "'>";
		
		switch(stepData[i].type){
			case "dialog":
				htmlStepPart += buildDialog(slideId, i, stepData[i], nextStepVars);
			break;
			case "hotspot":
				htmlStepPart += buildTooltip(slideId, i, stepData[i], nextStepVars);
			break;
			case "textbox":
				htmlStepPart += buildTooltip(slideId, i, stepData[i], nextStepVars);
			break;
		}
		
		htmlStepPart += "</div>"; //close div for step part
		
		// Generate markup
		htmlImage = 	"<img id='" + slideId + "-sim-screenshot" + i + "' " +
							"src='" + stepData[i].image + "' " +
							"class='sim-screenshot' " +
							"border='0' " +
							"style=' display:"	+  cssDisplay + "; " +
									"width: " 	+  settings.step.screenshot_width + "px; " +
									"height: "	+  settings.step.screenshot_height + "px;'" +
						"/>";
						
		
		htmlStepContainer = "<div id='" + slideId + "-step-container" + i + "' class='sim-step-container' " +
								"style='width: " 	+  settings.step.screenshot_width + "px; " +
										"height: " 	+  settings.step.screenshot_height + "px; " +
										"z-index: "	+ cssZindex + ";'" +
								">" +
								htmlStepPart + 
							"</div>"; //close step container div
		
		//htmlStepContainer += "</div>"; //close step div
		simContainer += htmlImage + htmlStepContainer;
	}
	
	simContainer += "</div>"; //close sim container div
	
	$('#' + slideId).append(simContainer);	
	
	//Fade out all the steps except the first one
	//Also, set the height of each tooltip/dialog so dropshadow's are applied correctly
	for (var i=1; i < simDataLength; i++){
		var dialogId = '#' + slideId + "-sim-dialog-ost" + i;
		var tipId = '#' + slideId + "-sim-tooltip-tip" + i;
		var fixHeight = 0;
		
		fixHeight = $(dialogId).height();
		$(dialogId).css('height', fixHeight);
		
		fixHeight = $(tipId).height();
		/* removed for Shire Agg Spend - should be accounted for another way, as setting height here is causing undesired results
		if($(tipId).has('img') && fixHeight < 70){
			$(tipId).css('height', parseInt(fixHeight) + 20);
		}else{
			$(tipId).css('height', parseInt(fixHeight));
		}*/
		
		$('#' + slideId + "-step-container" + i).fadeOut(0);
	}
	
	afterGenerationTooltips();
}

function simTypePopups(_simData){
	var cssClass 			= "";
	var cssDisplay 			= "";
	
	var simContainer		= "";
	var clickContainer		= "";
	var htmlImage 			= "";
	var htmlStepContainer 	= "";
	var htmlStepPart		= "";
	
	var onClick			= "";
	var nextStepVars 		= "";
	var popupVars 			= "";
	var nextImgId 			= 0;
	var focusX 				= "";
	var focusY 				= "";
	var simDataLength 		= _simData.steps.length;
	var slideId 			= _simData.slide;
	var stepData 			= _simData.steps;
	var tipIcon 			= "";
	var invisNextBtn		= "";
	
	for (var i=0; i < simDataLength; i++){
		if(i == 0){
			simContainer	= "<div id='" + slideId + "-sim-container' class='sim-container' " +
								"style=' width: " 	+  settings.step.container_width + "px; " +
										"height: " 	+  settings.step.container_height + "px; " +
										"top: " 	+  settings.step.container_top + "px; " +
										"left: " 	+  settings.step.container_left + "px;'" +
								">";
			simContainer 	+= "<input id='" + slideId + "-sim-maxsteps' type='hidden' value='" + (simDataLength-1) + "' />";
			cssDisplay 	= "block";
			cssZindex 	= "1000";
			nextImgId 	= 1;
		}else{
			cssDisplay 	= "none";
			cssZindex 	= "1";
			nextImgId 	= i+1;
		}
		
		// Get focus coordinates
		focusX = (i == (simDataLength - 1)) ? getFocusPixel(stepData[i].focusX, "x") : getFocusPixel(stepData[i+1].focusX, "x");
		focusY = (i == (simDataLength - 1)) ? getFocusPixel(stepData[i].focusY, "y") : getFocusPixel(stepData[i+1].focusY, "y");
		
		//Set the variables to be passed to the function that calls the next simulation image
		nextStepVars 	= "\"" + slideId + "\", " + nextImgId + ", " + simDataLength + ", " + focusX + ", " + focusY + ", " + "\"" + _simData.type + "\"";
		popupVars 		= "\"" + slideId + "\", " + i;
		
		htmlStepPart = "<div id='" + slideId + "-step-part" + i + "' style='z-index: 100;'>";
		
		// Generate markup
		switch(stepData[i].type){
			case "dialog":
				htmlStepPart 	+= buildDialog(slideId, i, stepData[i], nextStepVars);
				invisNextBtn	= "";
				clickContainer	= "";
			break;
			case "hotspot":
				onClick 		= "onClick='showPopup(" + popupVars + ")' ";
				htmlStepPart 	+= buildPopup(slideId, i, stepData[i], nextStepVars);
				
				
				clickContainer 		= "<div id='" + slideId + "-click-container" + i + "' class='sim-click-container' " +
									"style='width: " 	+  settings.step.screenshot_width + "px; " +
											"height: " 	+  settings.step.screenshot_height + "px; " +
											"z-index: 1;' " +
									onClick + 
									">" +
								"</div>";
				
				
				//Quick fix for popups, creates an invisible "next" button for hotspots
				invisNextBtn 	= buildPopupNextButton(slideId, i, stepData[i], nextStepVars);
			break;
			case "textbox":
				//onClick 		= "onClick='showPopup(" + popupVars + ")' ";		
				htmlStepPart 	+= buildPopup(slideId, i, stepData[i], nextStepVars);
				invisNextBtn	= "";
				clickContainer	= "";
			break;
		}
		
		htmlStepPart += "</div>"; //close div for step part
		
		htmlImage 			= 	"<img id='" + slideId + "-sim-screenshot" + i + "' " +
									"src='" + stepData[i].image + "' " +
									"class='sim-screenshot' " +
									"border='0' " +
									"style=' display:" 	+  cssDisplay + "; " +
											"width: " 	+  settings.step.screenshot_width + "px; " +
											"height: " 	+  settings.step.screenshot_height + "px;'" +
								"/>";
		
		htmlStepContainer 	= "<div id='" + slideId + "-step-container" + i + "' class='sim-popup-step-container' " +
									"style='width: " 	+  settings.step.screenshot_width + "px; " +
											"height: " 	+  settings.step.screenshot_height + "px; " +
											"z-index: "	+ cssZindex + ";'" +
									">" + 
									htmlStepPart + 
									invisNextBtn +
									clickContainer +  
								"</div>"; //close step container div
		
		simContainer += htmlImage + htmlStepContainer;
	}
	
	simContainer += "</div>";
	
	$('#' + slideId).append(simContainer);
	
	
	//Fade out all the steps except the first one
	//Also, set the height of each tooltip/dialog so dropshadow's are applied correctly
	for (var i=1; i < simDataLength; i++){
		var dialogId 	= '#' + slideId + "-sim-dialog-ost" + i;
		var tipId 		= '#' + slideId + "-sim-popup-tip" + i;
		var fixHeight 	= 0;
		
		fixHeight = $(dialogId).outerHeight();
		$(dialogId).css('height', fixHeight);
		
		fixHeight = $(tipId).outerHeight();
		
		if($(tipId).has('img') && fixHeight < 70){
			$(tipId).css('height', parseInt(fixHeight) + 20);
		}else{
			$(tipId).css('height', fixHeight);
		}
		
		//If the step has popupText, hide the hints
		if(_simData.steps[i].popupText != undefined && _simData.steps[i].popupText !== ""){		
			$("#" + slideId + "-step-part" + i).fadeOut(0);
		}
		$('#' + slideId + "-step-container" + i).fadeOut(0);
	}
	
	afterGenerationPopups();
}


/*----------------------------------------*\
HTML generation helper functions
\*----------------------------------------*/
function buildDialog(_slideId, _i, _stepData, _nextStepVars){
	//Generate markup for a dialog box
	if(_stepData.dialogX != undefined && _stepData.dialogX !== "" || _stepData.dialogY != undefined && _stepData.dialogY !== ""){
		var html 		= "";
		var btn 		= "";
		var tipIcon 	= "";
		var arrowClass 	= "";
		var arrowStyle 	= "";
		var htmlArrow 	= "";
		//var cssDisplay = (_i==0) ? "block" : "block";
		var cssDisplay 	= "block";
		//var cssWidth 	= settings.dialog.ost_width;
		var cssWidth 	= (_stepData.dialogWidth 	!= undefined && _stepData.dialogWidth 	!== "") ? _stepData.dialogWidth : settings.dialog.ost_width;
		
		//Add an icon to the tip box if needed
		tipIcon = getTooltipIcon(_stepData.tipIcon);
		
		
		if(_stepData.buttonText != undefined && _stepData.buttonText !== ""){
			btn = "<div id='" + _slideId + "-sim-dialog-button" + _i + "' class='sim-dialog-button' onclick='simNextStep(" + _nextStepVars + ");'>" + _stepData.buttonText + "</div>";
		}
		
		var coords = _stepData.coords.split(',');
		for (var lcv = 0; lcv < coords.length; lcv++) coords[lcv] = Number(coords[lcv]);
		if (coords.length >= 4) {
			if (coords[0] !== "" && coords[1] !== "" && coords[2] !== "" && coords[3] !== "") {
				var width = coords[2] - coords[0];
				var height = coords[3] - coords[1]; 
				
				//Build tip arrows
				if (_stepData.tipY == "top") {
					if (_stepData.tipX == "right") {
						arrowClass =	"class='sim-tooltip-tip-arrow-top' ";
						arrowStyle = 	"style='top: " 		+ (coords[1] - 24) + "px; " + 
												"left: " 	+ (coords[0] - 4 + (width / 2)) + "px; " + 
												"display:" 	+  cssDisplay + ";' ";
					}
					else if (_stepData.tipX == "left") {
						arrowClass = 	"class='sim-tooltip-tip-arrow-top' ";
						arrowStyle = 	"style='top: " 		+ (coords[1] - 24) + "px; " + 
												"left: " 	+ (coords[0] - 4 + (width / 2)) + "px; " + 
												"z-index: 6; " + 
												"display:" 	+  cssDisplay + ";' ";
					}
				}else if (_stepData.tipY == "bottom") {
					if (_stepData.tipX == "right") {
						arrowClass = 	"class='sim-tooltip-tip-arrow-bottom' ";
						arrowStyle =	"style='top: " 		+ (coords[3] + 16) + "px; " + 
												"left: " 	+ (coords[0] - 4 + (width / 2)) + "px; " + 
												"display:" 	+  cssDisplay + ";' ";
					}
					else if (_stepData.tipX == "left") {
						arrowClass =	"class='sim-tooltip-tip-arrow-bottom' ";
						arrowStyle =	"style='top: " 		+ (coords[3] + 16) + "px; " + 
												"left: " 	+ (coords[0] - 4 + (width / 2)) + "px; " + 
												"display:" 	+  cssDisplay + ";' ";
					}
				}

				htmlArrow = "<div id='" + _slideId + "-sim-tooltip-tip-arrow" + _i + "' " + arrowClass + arrowStyle + "></div>";
			}
			
			
			
			
			html = "<div id='" + _slideId + "-sim-dialog-ost" + _i + "' " +
							"class='sim-dialog-ost dropshadow' " + 
							"style='top: " 		+ _stepData.dialogY + "; " + 
									"left: " 	+ _stepData.dialogX + "; " + 
									"width: " 	+ cssWidth + "px; " + 
									"display: " + cssDisplay + "; z-index: 1000;'>" +
						tipIcon + "<p>" + _stepData.stepText + "</p>" + btn + 
					"</div>" + htmlArrow;

			return html;
		}else{
			return "";
		}
	}
}

function buildTooltip(_slideId, _i, _stepData, _nextStepVars){
	var tipIcon 			= "";
	var html 				= "";
	var nextBtn 			= "";
		
	var htmlHighlight 		= "";
	var htmlTextarea 		= "";
	var htmlArrow 			= "";
	var htmlTip 			= "";
	
	var highlightClass 		= "";
	var highlightStyle 		= "";
	var highlightOnClick 	= "";
	
	var textClass 			= "";
	var textStyle 			= "";
	var textOnKeyPress 		= "";
	var textOffsetY			= (_stepData.textOffsetY 	!= undefined && _stepData.textOffsetY 	!== "") ? _stepData.textOffsetY 	: 0;
	var textOffsetX			= (_stepData.textOffsetX 	!= undefined && _stepData.textOffsetX 	!== "") ? _stepData.textOffsetX 	: 0;
	var textWidth 			= (_stepData.textWidth 		!= undefined && _stepData.textWidth 	!== "") ? _stepData.textWidth 	: null;
	var textHeight 			= (_stepData.textHeight 	!= undefined && _stepData.textHeight 	!== "") ? _stepData.textHeight 	: null;
	var textWrap			= (_stepData.textWrap 		!= undefined && _stepData.textWrap 		!== "") ? _stepData.textWrap 	: false;
	var textWrapCSS			= "";
	var textAlign			= (_stepData.textAlign 		!= undefined && _stepData.textAlign 	!== "") ? _stepData.textAlign 	: "left";
	var textClass			= (_stepData.textClass 		!= undefined && _stepData.textClass 	!== "") ? _stepData.textClass 	: "";

	var arrowClass 			= "";
	var arrowStyle 			= "";
	var arrowOffsetY		= (_stepData.arrowOffsetY 	!= undefined && _stepData.arrowOffsetY 	!== "") ? _stepData.arrowOffsetY 	: 0;
	var arrowOffsetX		= (_stepData.arrowOffsetX 	!= undefined && _stepData.arrowOffsetX 	!== "") ? _stepData.arrowOffsetX 	: 0;
	
	var tipClass 			= "";
	var tipStyle 			= "";
	var tipOffsetX			= (_stepData.tipOffsetX 	!= undefined && _stepData.tipOffsetX 	!== "") ? _stepData.tipOffsetX 	: 0;
	
	var cssDisplay 			= "block";
	var cssWidth 			= (_stepData.tipWidth != undefined && _stepData.tipWidth !== "") ? _stepData.tipWidth : settings.tooltip.ost_width;
	
	//Add an icon to the tip box if needed
	tipIcon = getTooltipIcon(_stepData.tipIcon);

	//Generate the tooltip
	var coords = _stepData.coords.split(',');
	for (var lcv = 0; lcv < coords.length; lcv++) coords[lcv] = Number(coords[lcv]);
	if (coords.length >= 4) {
		if (coords[0] !== "" && coords[1] !== "" && coords[2] !== "" && coords[3] !== "") {
			
			var width = coords[2] - coords[0];
			var height = coords[3] - coords[1]; 
			
			// Build highlights
			if(_stepData.type == "hotspot"){
				highlightClass = 		"class='sim-tooltip-highlight' ";
				highlightStyle = 		"style='cursor: pointer; " +
												"top: " 	+ coords[1] + "px; " + 
												"left: " 	+ coords[0] + "px; " + 
												"width: " 	+ width + "px; " + 
												"height: " 	+ height + "px; " + 
												"display:" 	+  cssDisplay + ";' ";
				
				
				rearHighlightClass = 		"class='sim-popup-highlight-rear' ";
				rearHighlightStyle = 		"style='top: " 	+ (coords[1] - 1) + "px; " + 
											"left: " 	+ (coords[0] - 1) + "px; " + 
											"width: " 	+ (width - 2) + "px; " + 
											"height: " 	+ (height - 2) + "px; " + 
											"display:" 	+  cssDisplay + ";' ";
				
				//Check if the highlight or a button advances to the next step
				if(_stepData.buttonText != undefined && _stepData.buttonText !== ""){
					nextBtn = "<div id='" + _slideId + "-sim-dialog-button" + _i + "' class='sim-dialog-button' onclick='simNextStep(" + _nextStepVars + ");'>" + _stepData.buttonText + "</div>";
					
					highlightStyle = 	"style='top: " 		+ coords[1] + "px; " + 
												"left: " 	+ coords[0] + "px; " + 
												"width: " 	+ width + "px; " + 
												"height: " 	+ height + "px; " + 
												"display:" 	+  cssDisplay + ";' ";
				}else{
					highlightOnClick = 	"onclick='simNextStep(" + _nextStepVars + ");'";
				}
				
			}else if(_stepData.type == "textbox"){
				highlightClass = 		"class='sim-tooltip-highlight' ";
				highlightStyle = 		"style='top: " 		+ coords[1] + "px; " + 
												"left: " 	+ coords[0] + "px; " + 
												"width: " 	+ width + "px; " + 
												"height: " 	+ height + "px; " + 
												"display:" 	+  cssDisplay + ";' ";
				highlightOnClick = 		"onclick='focusTextbox(\"" + _slideId + "-sim-textbox"  + _i + "\");'";
				
				rearHighlightClass = 		"class='sim-popup-highlight-rear' ";
				rearHighlightStyle = 		"style='top: " 	+ (coords[1] - 1) + "px; " + 
											"left: " 	+ (coords[0] - 1) + "px; " + 
											"width: " 	+ (width - 2) + "px; " + 
											"height: " 	+ (height - 2) + "px; " + 
											"display:" 	+  cssDisplay + ";' ";
				
				//Set text entry specific vars
				if(textWidth == null) 	{textWidth = _stepData.maxLength * 7;}
				if(textHeight == null) 	{textHeight = height;}
				if(textWrap == false) 	{textWrapCSS = "white-space: nowrap; overflow-x: hidden; overflow-y: hidden; ";}
				
				textClass = 		"class='sim-textEntry " + textClass + "' ";
				textStyle = 		"style='top: " 			+ (coords[1] + textOffsetY) + "px; " + 
											"left: " 		+ (coords[0] + textOffsetX) + "px; " + 
											"width: " 		+ textWidth + "px; " + 
											"height: " 		+ textHeight + "px; " + 
											"text-align: " 	+ textAlign + "; " +
											textWrapCSS		+
											"display:" 		+  cssDisplay + ";' ";
				//textOnKeyPress = 	"onkeypress='simTextboxNextStep(this, " + _stepData.maxLength + ", " + _nextStepVars + ");' ";
				textOnKeyPress = 	"onkeyup='simTextboxNextStep(this, " + _nextStepVars + ");' ";
				
				htmlTextarea = "<textarea id='" + _slideId + "-sim-textbox"  + _i + "' " + textStyle + textClass + textOnKeyPress + "></textarea>";
			}
			
			//Build tooltips
			if (_stepData.tipY == "top") {
				if (_stepData.tipX == "right") {
					arrowClass =	"class='sim-tooltip-tip-arrow-top' ";
					arrowStyle = 	"style='top: " 		+ ((coords[1] - 36) + arrowOffsetY) + "px; " + 
											"left: " 	+ ((coords[0] - 4 + (width / 2))  + arrowOffsetX) + "px; " + 
											"display:" 	+  cssDisplay + ";' ";
					
					tipClass = 		"class='sim-tooltip-tip dropshadow' ";
					tipStyle = 		"style='bottom: " 	+ (settings.step.screenshot_height - (coords[1] - 25)) + "px; " + 
											"left: " 	+ ((coords[0] - 16 + (width / 2)) + tipOffsetX) + "px; " + 
											"width: " 	+ cssWidth + "px; " + 
											"display:" 	+  cssDisplay + ";' ";
				}
				else if (_stepData.tipX == "left") {
					arrowClass = 	"class='sim-tooltip-tip-arrow-top' ";
					arrowStyle = 	"style='top: " 		+ ((coords[1] - 36)  + arrowOffsetY) + "px; " + 
											"left: " 	+ ((coords[0] - 4 + (width / 2))  + arrowOffsetX) + "px; " + 
											"z-index: 6; " + 
											"display:" 	+  cssDisplay + ";' ";
					
					tipClass = 		"class='sim-tooltip-tip dropshadow' ";
					tipStyle = 		"style='bottom: " 	+ (settings.step.screenshot_height - (coords[1] - 25)) + "px; " + 
											"right: " 	+ ((settings.step.container_width - coords[0] - 36 -(width / 2)) + tipOffsetX) + "px; " + 
											"z-index: 5; " + 
											"width: " 	+ cssWidth + "px; " + 
											"display:" 	+  cssDisplay + ";' ";
				}
			}else if (_stepData.tipY == "bottom") {
				if (_stepData.tipX == "right") {
					arrowClass = 	"class='sim-tooltip-tip-arrow-bottom' ";
					arrowStyle =	"style='top: " 		+ ((coords[3] + 16) + arrowOffsetY) + "px; " + 
											"left: " 	+ ((coords[0] - 4 + (width / 2)) + arrowOffsetX) + "px; " + 
											"display:" 	+  cssDisplay + ";' ";
                    
					tipClass = 		"class='sim-tooltip-tip dropshadow' ";
					tipStyle = 		"style='top: " 		+ (coords[3] + 16 + 23) + "px; " +
											"left: " 	+ ((coords[0] - 16 + (width / 2)) + tipOffsetX) + "px; " + 
											"width: " 	+ cssWidth + "px; " + 
											"display:" 	+  cssDisplay + ";' ";
				}
				else if (_stepData.tipX == "left") {
					arrowClass =	"class='sim-tooltip-tip-arrow-bottom' ";
					arrowStyle =	"style='top: " 		+ ((coords[3] + 16) + arrowOffsetY) + "px; " + 
											"left: " 	+ ((coords[0] - 4 + (width / 2)) + arrowOffsetX) + "px; " + 
											"display:" 	+  cssDisplay + ";' ";
				                    
					tipClass = 		"class='sim-tooltip-tip dropshadow' ";
					tipStyle = 		"style='top: " 		+ (coords[3] + 16 + 23) + "px; " + 
											"right: " 	+ ((settings.step.container_width - coords[0] - 36 -(width / 2)) + tipOffsetX) + "px; " + 
											"width: " 	+ cssWidth + "px; " + 
											"display:" 	+  cssDisplay + ";' ";
				}
			}

			//Put together markup
			htmlHighlight 	+= "<div " + rearHighlightClass + rearHighlightStyle + "></div>";
			htmlHighlight 	+= "<div id='" + _slideId + "-sim-tooltip-highlight" + _i + "' " + highlightClass + highlightStyle + highlightOnClick + "></div>";
			htmlArrow 		= "<div id='" + _slideId + "-sim-tooltip-tip-arrow" + _i + "' " + arrowClass + arrowStyle + "></div>";
			htmlTip 		= "<div id='" + _slideId + "-sim-tooltip-tip" 		+ _i + "' " + tipClass 	+ tipStyle + ">" + tipIcon + "<p>" + _stepData.stepText + "</p>" + nextBtn + "</div>";
			
			html += htmlHighlight + htmlTextarea + htmlArrow + htmlTip;
		}
	}
	
	return html;
}

function buildPopup(_slideId, _i, _stepData, _nextStepVars){
	var tipIcon 			= "";
	var html 				= "";
		
	var htmlArrow 			= "";
	var htmlHidden 			= "";
	var htmlHighlight 		= "";
	var htmlPopup 			= "";
	var htmlTextarea 		= "";
	var htmlTip 			= "";
		
	var arrowClass 			= "";
	var highlightClass 		= "";
	var textClass			= "";
	var tipClass 			= "";
	var tipOffsetX			= (_stepData.tipOffsetX 	!= undefined && _stepData.tipOffsetX 	!== "") ? _stepData.tipOffsetX 	: 0;
		
	var arrowStyle 			= "";
	var highlightStyle 		= "";
	var textStyle 			= "";
	var tipStyle 			= "";
	
	var highlightOnClick 	= "";
	var textOnKeyPress 		= "";
	var textOffsetY 		= (_stepData.textOffsetY != undefined && _stepData.textOffsetY !== "") ? _stepData.textOffsetY : 0;
	var textOffsetX 		= (_stepData.textOffsetX != undefined && _stepData.textOffsetX !== "") ? _stepData.textOffsetX : 0;
	var textWidth 			= (_stepData.textWidth != undefined && _stepData.textWidth !== "") ? _stepData.textWidth : null;
	var textHeight 			= (_stepData.textHeight != undefined && _stepData.textHeight !== "") ? _stepData.textHeight : null;
	var textWrap			= (_stepData.textWrap 		!= undefined && _stepData.textWrap 		!== "") ? _stepData.textWrap 	: false;
	var textWrapCSS			= "";
	var textAlign			= (_stepData.textAlign 		!= undefined && _stepData.textAlign 	!== "") ? _stepData.textAlign 	: "left";
	var textClass			= (_stepData.textClass 		!= undefined && _stepData.textClass 	!== "") ? _stepData.textClass 	: "";
	
	//var cssDisplay 		= "none";
	var cssDisplay 			= "block";
	var cssWidth 			= (_stepData.tipWidth != undefined && _stepData.tipWidth !== "") ? _stepData.tipWidth : settings.tooltip.ost_width;
	var maxPopups 			= 1;
	
	//Add an icon to the tip box if needed
	tipIcon = getTooltipIcon(_stepData.tipIcon);
	
	
	//Generate the tooltip
	var coords = _stepData.coords.split(',');
	for (var lcv = 0; lcv < coords.length; lcv++) coords[lcv] = Number(coords[lcv]);
	if (coords.length >= 4) {
		if (coords[0] !== "" && coords[1] !== "" && coords[2] !== "" && coords[3] !== "") {
			var width = coords[2] - coords[0];
			var height = coords[3] - coords[1]; 
			
			// Build highlights
			if(_stepData.type == "hotspot"){
				highlightClass = 		"class='sim-popup-highlight' ";
				highlightStyle = 		"style='top: " 	+ coords[1] + "px; " + 
											"left: " 	+ coords[0] + "px; " + 
											"width: " 	+ width + "px; " + 
											"height: " 	+ height + "px; " + 
											"display:" 	+  cssDisplay + ";' ";
				highlightOnClick = 		"onclick='simNextStep(" + _nextStepVars + ");'";	
			}else if(_stepData.type == "textbox"){
				highlightClass = 		"class='sim-popup-textbox-highlight' ";
				highlightStyle = 		"style='top: " 	+ coords[1] + "px; " + 
											"left: " 	+ coords[0] + "px; " + 
											"width: " 	+ width + "px; " + 
											"height: " 	+ height + "px; " + 
											"display:" 	+  cssDisplay + ";' ";
				highlightOnClick = 		"onclick='focusTextbox(\"" + _slideId + "-sim-textbox"  + _i + "\");'";
				
				//Set text entry specific vars
				if(textWidth == null) 	{textWidth = _stepData.maxLength * 7;}
				if(textHeight == null) 	{textHeight = height;}
				if(textWrap == false) 	{textWrapCSS = "white-space: nowrap; overflow-x: hidden; overflow-y: hidden; ";}
				
				
				textClass = 		"class='sim-textEntry sim-popup-textEntry' ";
				textStyle = 		"style='top: " 			+ (coords[1] + textOffsetY) + "px; " + 
											"left: " 		+ (coords[0] + textOffsetX) + "px; " + 
											"width: " 		+ textWidth + "px; " + 
											"height: " 		+ textHeight + "px; " + 
											"text-align: " 	+ textAlign + "; " +
											textWrapCSS		+
											"display:" 		+  cssDisplay + ";' ";
				textOnKeyPress = 	"onkeyup='simTextboxNextStep(this, " + _stepData.maxLength + ", " + _nextStepVars + ");' ";
				
				htmlTextarea = "<textarea id='" + _slideId + "-sim-textbox"  + _i + "' " + textStyle + textClass + textOnKeyPress + "></textarea>";
			}
			
			//Build tooltips
			if (_stepData.tipY == "top") {
				if (_stepData.tipX == "right") {
					arrowClass =	"class='sim-tooltip-tip-arrow-top' ";
					arrowStyle = 	"style='top: " 		+ (coords[1] - 24) + "px; " + 
											"left: " 	+ (coords[0] - 4 + (width / 2)) + "px; " + 
											"display:" 	+  cssDisplay + ";' ";
					tipStyle = 		"style='bottom: " 	+ (settings.step.container_height - (coords[1] - 22)) + "px; " + 
											"left: " 	+ ((coords[0] - 24 + (width / 2)) + tipOffsetX) + "px; " + 
											"width: " 	+  cssWidth + "px; " + 
											"display:" 	+  cssDisplay + "; z-index: 1000;' ";
				}
				else if (_stepData.tipX == "left") {
					arrowClass =	"class='sim-tooltip-tip-arrow-top' ";
					arrowStyle = 	"style='top: " 		+ (coords[1] - 24) + "px; " + 
											"left: " 	+ (coords[0] - 4 + (width / 2)) + "px; " + 
											"z-index: 6; " + 
											"display:" 	+  cssDisplay + ";' ";
					tipStyle = 		"style='bottom: " 	+ (settings.step.container_height - (coords[1] - 22)) + "px; " + 
											"right: " 	+ ((settings.step.container_width - coords[0] - 24 -(width / 2)) + tipOffsetX) + "px; " + 
											"z-index: 5; " + 
											"width: " 	+  cssWidth + "px; " + 
											"display:" 	+  cssDisplay + "; z-index: 1000;' ";
				}
			}else if (_stepData.tipY == "bottom") {
				if (_stepData.tipX == "right") {
					arrowClass =	"class='sim-tooltip-tip-arrow-bottom' ";
					arrowStyle =	"style='top: " 		+ (coords[3] + 16) + "px; " + 
											"left: " 	+ (coords[0] - 4 + (width / 2)) + "px; " + 
											"display:" 	+  cssDisplay + ";' ";
					tipStyle = 		"style='top: " 		+ (coords[3] + 16 + 24) + "px; " + 
											"left: " 	+ ((coords[0] - 24 + (width / 2)) + tipOffsetX) + "px; " + 
											"width: " 	+  cssWidth + "px; " + 
											"display:" 	+  cssDisplay + "; z-index: 1000;' ";
				}
				else if (_stepData.tipX == "left") {
					arrowClass =	"class='sim-tooltip-tip-arrow-bottom' ";
					arrowStyle =	"style='top: " 		+ (coords[3] + 16) + "px; " + 
											"left: " 	+ (coords[0] - 4 + (width / 2)) + "px; " + 
											"display:" 	+  cssDisplay + ";' ";
					tipStyle = 		"style='top: " 		+ (coords[3] + 16 + 24) + "px; " + 
											"right: " 	+ ((settings.step.container_width - coords[0] - 24 -(width / 2)) + tipOffsetX) + "px; " + 
											"width: " 	+  cssWidth + "px; " + 
											"display:" 	+  cssDisplay + "; z-index: 1000;' ";
				}
			}
			
			tipClass = 		"class='sim-popup-tip dropshadow' ";
		
			//Build dialog popup tip
			if(_stepData.popupText != undefined && typeof _stepData.popupText != "undefined"){
				maxPopups = _stepData.popupText.length;
				
				for(lcv = 0; lcv < maxPopups; lcv++) {
					/*htmlPopup += "<div id='" + _slideId + "-sim-popup-dialog" + _i + "-" + (lcv + 1) + "' " +
									"class='dialog-modal' " +
									"title='Hint'>" + 
									"<p>" + _stepData.popupText[lcv] + "</p>" + 
								"</div>";*/
					
					htmlPopup += "<input type='hidden' id='" + _slideId + "-sim-popup-" + _i + "-" + (lcv + 1) + "' value='" +  _stepData.popupText[lcv] + "' />";
				}
				
				htmlHidden = 	"<input type='hidden' id='" + _slideId + "-sim-popup-" + _i + "-currentPopup' value='0' />";
				htmlHidden += 	"<input type='hidden' id='" + _slideId + "-sim-popup-" + _i + "-maxPopups' value='" +  maxPopups + "' />";
			}
			
			//Put together markup
			htmlHighlight 	+=	"<div id='" + _slideId + "-sim-popup-highlight" 	+ _i + "' " + highlightClass + highlightStyle + highlightOnClick 				+ "></div>";
			htmlArrow 		+= 	"<div id='" + _slideId + "-sim-popup-tip-arrow" 	+ _i + "' " + arrowClass + arrowStyle 											+ "></div>";
			htmlTip 		+=	"<div id='" + _slideId + "-sim-popup-tip" 			+ _i + "' "  + tipClass + tipStyle + ">" + tipIcon + "<p>" + _stepData.stepText + "</p></div>";
			
		
			html += htmlHighlight + htmlTextarea + htmlArrow + htmlTip + htmlHidden + htmlPopup;
		}
	}
	
	return html;
}

function buildPopupNextButton(_slideId, _i, _stepData, _nextStepVars){
	var button	= "";

	var coords = _stepData.coords.split(',');
	for (var lcv = 0; lcv < coords.length; lcv++) coords[lcv] = Number(coords[lcv]);
	if (coords.length >= 4) {
		if (coords[0] !== "" && coords[1] !== "" && coords[2] !== "" && coords[3] !== "") {
			var width 	= coords[2] - coords[0];
			var height 	= coords[3] - coords[1]; 
			
			button 	= "<div id='" + _slideId + "-sim-popup-invisbtn" 	+ _i + "' class='sim-popup-invis-btnNext' " +
							"style='top: " 		+ coords[1] 	+ "px; " + 
									"left: " 	+ coords[0] 	+ "px; " + 
									"width: " 	+ (width + 8) 	+ "px; " + 			//add 8 to make up for the border
									"height: " 	+ (height + 8) 	+ "px; " + 			//add 8 to make up for the border
									"display: block; z-index: 100;' " +
							"onclick='simNextStep(" + _nextStepVars + ");'" +	
						"></div>";
		}
	}

	return button;
}

/*----------------------------------------*\
After simulation text and image containers have loaded, set their width and height
\*----------------------------------------*/
function afterGenerationTooltips(){
	$('area').attr('tabindex', '-1');
	$('textarea').attr('tabindex', '-1');
	
	$('.sim-container').css({
		top: settings.step.container_top + 'px',
		left: settings.step.container_left + 'px',
		width : settings.step.container_width +'px',
		height : settings.step.container_height +'px'
	});
}

function afterGenerationPopups(){
	 $('area').attr('tabindex', '-1');
	 $('textarea').attr('tabindex', '-1');
	
	$('.sim-container').css({
		top: settings.step.container_top + 'px',
		left: settings.step.container_left + 'px',
		width: settings.step.container_width +'px',
		height: settings.step.container_height +'px'
	});
	
	/*
	$(".dialog-modal").dialog({
		autoOpen: false,
		draggable: false,
		resizable: false,
		modal: true,
		buttons: {
			"Try Again": function() {
				$(this).dialog( "close" );
			}
		}
	});*/
}


/*----------------------------------------*\
Simulation Control Functions
\*----------------------------------------*/
/*
function simNextStep(_slideId, _intImgId, _simDataLength, _focusX, _focusY, _simType) {
	
	if(!simIsScrolling) {
		simIsScrolling = true;
		
		var intPrevImg = _intImgId-1;
		var intNextImg = _intImgId;
		
		//To allow for replays,set intNextImg = 0 so the "next step" loops back to step 0
		if($('#' + _slideId + '-sim-maxsteps').val() < intNextImg){
			intNextImg = 0;
		}
		
		debugUpdateSimStep(_slideId, intNextImg); //update debug slide textbox text
		
		// Set vars
		var prevStep = '#' + _slideId + "-step-container" + intPrevImg;
		var nextStep = '#' + _slideId + "-step-container" + intNextImg;
		
		var prevTextboxId = 		'#' + _slideId + '-sim-textbox'  + intPrevImg;
		var nextTextboxId = 		'#' + _slideId + '-sim-textbox'  + intNextImg;
		
		//var prevImgId = 			'#' + _slideId + '-sim-' + _simType + '-image' + intPrevImg;
		//var nextImgId = 			'#' + _slideId + '-sim-' + _simType + '-image' + intNextImg;
		
		var prevImgId = 			'#' + _slideId + '-sim-screenshot' + intPrevImg;
		var nextImgId = 			'#' + _slideId + '-sim-screenshot' + intNextImg;
		
		var newHighlightId = 		'#' + _slideId + '-sim-' + _simType + '-highlight'  + intNextImg;
		
		//Fade out previous step tips and reset z-index
		$(prevStep).fadeOut(500);
		$(prevStep).css('z-index', '1');
		
		
		//If textbox's existed on the next or previous steps, diable/enable them accordingly
		if($(prevTextboxId).length > 0){
			$(prevTextboxId).blur(); // cause blur so iPad keyboard goes away
			$(prevTextboxId).hide();
			$(prevTextboxId).attr('disabled','disabled');
		}
		if ($(nextTextboxId).length > 0){
			$(nextTextboxId).removeAttr('disabled');
			$(nextTextboxId).val('');
			$(nextTextboxId).show();
		}
		
		// Fade in image for next step
		$(nextImgId).fadeIn(500, function() {
			if(intNextImg == _simDataLength-1){
				shellAPI.addSlideFlag('simulation'); 
				debugUpdateSimStep(_slideId, intNextImg); //TEMP FIX 5-1-2012: course.js->updateNav() gets called from addSlideFlag which updates the debug text, this fix updates the text after updateNav() is called
			}
						
			$(prevImgId).fadeOut(0, function() {
				prevImgId = nextImgId;
			});
			
			//$(prevTextboxId).blur(); // cause blur so iPad keyboard goes away
			
			// Scroll to next area
			var currentX = $('#' + _slideId + '-sim-container').scrollLeft();
			var currentY = $('#' + _slideId + '-sim-container').scrollTop();
			var transDurCoefficient = 5; //pixels per millisecond
			var transDuration = (Math.abs(currentX - _focusX) + Math.abs(currentY - _focusY)) * transDurCoefficient;
			
			$('#' + _slideId + '-sim-container').scrollTo( {top: _focusY +'px', left: _focusX + 'px'}, {
				queue: true,
				duration: transDuration,
				axis: 'xy',
				onAfter: function(){ 
					simIsScrolling = false;
					
					//Fade in next step tips
					$(nextStep).css('z-index', '1000');
					$(nextStep).fadeIn(500);
					
					if($("#" + _slideId + "-sim-popup-" + intNextImg + "-currentPopup").length == 0){
						$("#" + _slideId + "-step-part" + intNextImg).show();
						
					}
				}
			});
		});
		
		// Scroll step text (ignore if intNextImg = 1 since the simulation just started)
		if(intNextImg != 1 && $(nextTextboxId).length > 0){
			$('#' + _slideId + "-sim-text").scrollTo(nextTextboxId, {
				duration: 500,
				axis: 'y',
				offset: { top: -10}
			});
		}
	}
}
*/
function simNextStep(_nextStepVars) {
	//Set var's
	var nextStepVars = _nextStepVars;
	var slideId 		= nextStepVars.slideId;
	var stepNum 		= nextStepVars.stepNum;
	var focusX 			= nextStepVars.focusX;
	var focusY 			= nextStepVars.focusY;
	var simDataLength 	= nextStepVars.simDataLength;
	var simType 		= nextStepVars.simType;
	var stepData 		= nextStepVars.stepData;
	var nextStepData 	= nextStepVars.nextStepData;
	//Check and set optional parameters
	var textSelect 			= (typeof nextStepData.textSelect 		=== "undefined") 	? false : nextStepData.textSelect;
	var textDefaultValue 	= (typeof nextStepData.textDefaultValue === "undefined") 	? "" 	: nextStepData.textDefaultValue;
	
	//If the sim isn't scrolling, advance to the next step
	if(!simIsScrolling) {
		simIsScrolling = true;
		
		var prevStepNum = stepNum-1;
		var nextStepNum = stepNum;
		
		//To allow for replays,set nextStepNum = 0 so the "next step" loops back to step 0
		if($('#' + slideId + '-sim-maxsteps').val() < nextStepNum){
			nextStepNum = 0;
		}
		
		debugUpdateSimStep(slideId, nextStepNum); //update debug slide textbox text
		
		// Set vars
		var prevStep = '#' + slideId + "-step-container" + prevStepNum;
		var nextStep = '#' + slideId + "-step-container" + nextStepNum;
		
		var prevTextboxId = 		'#' + slideId + '-sim-textbox'  + prevStepNum;
		var nextTextboxId = 		'#' + slideId + '-sim-textbox'  + nextStepNum;
		
		//var prevImgId = 			'#' + slideId + '-sim-' + simType + '-image' + prevStepNum;
		//var nextImgId = 			'#' + slideId + '-sim-' + simType + '-image' + nextStepNum;
		
		var prevImgId = 			'#' + slideId + '-sim-screenshot' + prevStepNum;
		var nextImgId = 			'#' + slideId + '-sim-screenshot' + nextStepNum;
		
		var newHighlightId = 		'#' + slideId + '-sim-' + simType + '-highlight'  + nextStepNum;
		
		//Fade out previous step tips and reset z-index
		$(prevStep).fadeOut(500);
		$(prevStep).css('z-index', '1');
		
		
		//If textbox's existed on the next or previous steps, diable/enable them accordingly
		if($(prevTextboxId).length > 0){
			$(prevTextboxId).blur(); // cause blur so iPad keyboard goes away
			$(prevTextboxId).hide();
			$(prevTextboxId).attr('disabled','disabled');
			
			// Clear "safety" interval for input text checking.
			clearInterval(simTextCheckInt)
		}
		if ($(nextTextboxId).length > 0){
			$(nextTextboxId).removeAttr('disabled');
			$(nextTextboxId).val('');
			$(nextTextboxId).show();
			
			// Check input box every X milliseconds for a match.
			simTextCheckInt = setInterval(function(){$(nextTextboxId)[0].onkeyup()}, 100);
		}
		
		// Fade in image for next step
		$(nextImgId).fadeIn(500, function() {
			if(nextStepNum == simDataLength-1){
				shellAPI.addSlideFlag('simulation'); 
				debugUpdateSimStep(slideId, nextStepNum); //TEMP FIX 5-1-2012: course.js->updateNav() gets called from addSlideFlag which updates the debug text, this fix updates the text after updateNav() is called
			}
						
			$(prevImgId).fadeOut(0, function() {
				prevImgId = nextImgId;
			});
			
			//$(prevTextboxId).blur(); // cause blur so iPad keyboard goes away
			
			// Scroll to next area
			var currentX = $('#' + slideId + '-sim-container').scrollLeft();
			var currentY = $('#' + slideId + '-sim-container').scrollTop();
			var transDurCoefficient = 5; //pixels per millisecond
			var transDuration = (Math.abs(currentX - focusX) + Math.abs(currentY - focusY)) * transDurCoefficient;
			
			$('#' + slideId + '-sim-container').scrollTo( {top: focusY +'px', left: focusX + 'px'}, {
				queue: true,
				duration: transDuration,
				axis: 'xy',
				onAfter: function(){ 
					simIsScrolling = false;
					
					//Fade in next step tips
					$(nextStep).css('z-index', '1000');
					$(nextStep).fadeIn(500);
					
					if($("#" + slideId + "-sim-popup-" + nextStepNum + "-currentPopup").length == 0){
						$("#" + slideId + "-step-part" + nextStepNum).show();
						
						//Set default text here, this way "Replay Sim" works and resets the default text
						$(nextTextboxId).val(textDefaultValue);
						
						if(textSelect){
							//auto-select textbox
							$(nextTextboxId).select();
						}
					}
				}
			});
		});
		
		// Scroll step text (ignore if nextStepNum = 1 since the simulation just started)
		if(nextStepNum != 1 && $(nextTextboxId).length > 0){
			$('#' + slideId + "-sim-text").scrollTo(nextTextboxId, {
				duration: 500,
				axis: 'y',
				offset: { top: -10}
			});
		}
		
		// When a highlight is clicked, focus on the next textbox (this is an ipad fix)
		/*$(newHighlightId).click(function(){
			focusTextbox(slideId + "-sim-textbox"  + (nextStepNum + 1));
		});*/
	}
}

function simTextboxNextStep(Object, _nextStepVars) {
	var answerLength		= _nextStepVars.stepData.textAnswer.length;
	var textAnswer			= _nextStepVars.stepData.textAnswer;
	var textExactMatch 		= (typeof _nextStepVars.stepData.textExactMatch 	=== "undefined") ? false : _nextStepVars.stepData.textExactMatch;
	var textCaseSensitive 	= (typeof _nextStepVars.stepData.textCaseSensitive	=== "undefined") ? false : _nextStepVars.stepData.textCaseSensitive;
	var currentText 		= Object.value;
	
	//If textExactMatch is true, the students answer must match the answer text
	//Else if textExatchMatch is false, advance to the next step based on the number of characters typed
	if(textExactMatch){
		if(textCaseSensitive && currentText === textAnswer || textCaseSensitive === false && currentText.toUpperCase() === textAnswer.toUpperCase()){
			Object.value = "";
			simNextStep(_nextStepVars);
		}
	}else if(Object.value.length >= answerLength){
		Object.value = "";
		simNextStep(_nextStepVars);
	}
}

function simReset(){
	
	$.modal.close();
	
	var slideId = shellAPI.getCurrentSlideId();
	
	// shellAPI.getCurrentSlideId() lags by a few ms's to get the ID so a
	// while loop fixes this by waiting until slideId is set
	while(slideId != null){
		var totalSteps 		= $('#' + slideId + '-sim-maxsteps').val();
		var imageId 		= '#' + slideId + '-sim-screenshot';
		var containerId 	= '#' + slideId + '-step-container';
		var partId			= '#' + slideId + '-step-part';
		
		// Loop through every step
		for (var i=0; i <= totalSteps; i++){
				//$("#" + slideId + "-step-part" + i).css({opacity: 0});
				$(imageId + i).fadeOut(0);
				$(containerId + i).fadeOut(0);
				$(containerId + i).css('z-index', '1');	
				
				//If popups were used for this step, reset the number of current popups
				if($("#" + slideId + "-sim-popup-" + i + "-currentPopup").length > 0){
					$("#" + slideId + "-sim-popup-" + i + "-currentPopup").val("0");
				}
				
				$(partId + i).hide();
		}
		
		$(partId + '0').show();
		$(imageId + '0').fadeIn(0);
		$(containerId + '0').fadeIn(500);
		$(containerId + '0').css('z-index', '1000');
		
		debugUpdateSimStep(slideId, 0); //update debug slide textbox text
		break;
	}
}


/*----------------------------------------*\
Helpful Functions to perform misc tasks
\*----------------------------------------*/
function debugUpdateSimStep(_slideId, _intStep){
	//Set the stepId to the custom ID or use *_slideId*-*_intStep* for text
	var stepId = (simsArray[_slideId].steps[_intStep].id != undefined && simsArray[_slideId].steps[_intStep].id !== "") ? simsArray[_slideId].steps[_intStep].id : _slideId + "-" + _intStep;
	shellAPI.setDebugField(stepId); //update debug slide textbox text
}

function showPopup(_slideId, _i){
	var currentPopup 	= 	$("#" + _slideId + "-sim-popup-" + _i + "-currentPopup").val();
	var maxPopups 		= 	$("#" + _slideId + "-sim-popup-" + _i + "-maxPopups").val();
	var popupText		=	'';
	currentPopup 		= Number(currentPopup);
	maxPopups 			= Number(maxPopups);
	popupText 			= $("#" + _slideId + "-sim-popup-" + _i + "-" + (currentPopup + 1)).val();
	
	//increment currentPopup
	currentPopup = currentPopup + 1;
	$("#" + _slideId + "-sim-popup-" + _i + "-currentPopup").val(currentPopup);
	
	if(currentPopup <= maxPopups){
		//displayPopup
		//$("#" + _slideId + "-sim-popup-dialog" + _i + "-" + currentPopup).dialog("open");
		
		$('body').coursePopup({
			'lContent'				: '',
			'cContent'				: '<p>' + popupText + '</p><div class="course-popup-button" onclick="$.modal.close()">Try Again</div>',
			'rContent'				: ''
		});
		
		
		//display the popup hint if the last popup is displayed
		if(currentPopup >= maxPopups){
			$('#' + _slideId + "-step-part" + _i).fadeIn(500);
		}
	}
}

function focusTextbox(_target){
	$("#" + _target).focus().select();
}

function getFocusPixel(_focusPixel, _axis){
	if(_focusPixel == "left"){
		return 0;
	}else if(_focusPixel == "top"){
		return 0;
	}else if(_focusPixel == "right"){
		return settings.step.screenshot_width - settings.step.container_width;
	}else if(_focusPixel == "bottom"){
		return settings.step.screenshot_height - settings.step.container_height;
	}else if(_focusPixel == "center" && _axis == "x"){
		return (settings.step.screenshot_width / 2) - (settings.step.container_width / 2);
	}else if(_focusPixel == "center" && _axis == "y"){
		return (settings.step.screenshot_height / 2) - (settings.step.container_height / 2);
	}else if(_focusPixel.indexOf("px") != -1) {
		return _focusPixel.substring(0, _focusPixel.indexOf("px"));
	}else{
		return 0;
	}
}

function getTooltipIcon(_icon){
	var src = "";
	var tipIcon = "";
	
	if(_icon != undefined && _icon !== ""){
		switch(_icon){
			case "swipe-down":
				src = "common/images/gestures/swipe-down.png";
			break;
			case "swipe-left":
				src = "common/images/gestures/swipe-left.png";
			break;
			case "swipe-right":
				src = "common/images/gestures/swipe-right.png";
			break;
			case "swipe-right-left":
				src = "common/images/gestures/swipe-right-left.png";
			break;
			case "swipe-up":
				src = "common/images/gestures/swipe-up.png";
			break;
			case "swipe-up-down":
				src = "common/images/gestures/swipe-up-down.png";
			break;
			case "tap":
				src = "common/images/gestures/tap.png";
			break;
			case "tap-double":
				src = "common/images/gestures/tap-double.png";
			break;
			case "tap-hold":
				src = "common/images/gestures/tap-hold.png";
			break;
		}
		tipIcon = "<img src='" + src + "' style='position: relative; float:right;' />";
	}

	return tipIcon;
}