

/* ***
 * Question Proxy Prototype
 * ------------------------
 * 
 * - Accepts and stores a reference to an object that describes a single question.
 * 
 * - Accepts and stores a reference to the QuestionMgr object that invoked the 
 *   Question Proxy object so events can be exchanged between them.
 *
 * - Generates and inserts the necessary HTML/JS/CSS into the DOM to provide UI
 *   elements for user interaction.
 *  
 * - Provides functionality for visual transitions for the question elements that
 *   appear in the DOM.
 *   
 * NOTE: This is the form that most Question Proxy objects would take.  This
 *       example object would either need to be extended or copied to implement
 *       the appropriate functionality for each question type.
 *
 * ***/

/* ---
 * Create a global container for all question proxy types so they can be safely
 * and easily accesses later.
 */
var QuestionProxies = {};


/* ---
 * MULTIPLE CHOICE PROXY
 */
QuestionProxies.MultiChoice = new function MultiChoice()
{
	// Define a reference to this object within this closure so our private
	// methods can access it later.
	var that = this;
	
	// ---
	// PRIVATE VARIABLES
	// ---
	
	/* ---
	 * A reference to the QuestionMgr object that uses this QuestionProxy.
	 * This will be set by the QuestionMgr using the setMgr method.
	 */
	var mgr = null;
	
	// ---
	// PUBLIC METHODS
	// ---
	
	/* ---
	 * Generate and insert HTML/CSS/JavaScript necessary for displaying the
	 * question, accepting user input, and facilitating visual transitions.
	 */
	this.insertMarkup = function(container, qData)
	{	
		// Validate the question data.
		// TODO: Conditional return here?
		validate(qData);
		
		// Define markup.
		var m = "";
		m +=  "<div id='question-" + qData.number + "' class='question multichoice'>";
		m +=	"<div class='question-number'>" + qData.number + ".</div>";
		m +=	"<div class='question-text'>" + qData.text + "</div>";
		m +=	"<div style='clear:both;'></div>";
		m +=	"<div class='question-answers'>";
			for(var i = 0; i < qData.answers.length; i++)
			{
				// Gather data to be inserted into answer 
				// markup. This is here primarily for
				// code readability.
				var rGroup = (qData.number + "_answers");
				var rId = (qData.number+"_"+i);
				var rValue = i;
				var rBullet = String.fromCharCode(97+i);
				var rLabel = qData.answers[i].text;
				
				// Create answer markup.
				m += "<div class='answer'>";
				m += "<div class='rb-icon rb-off'></div>";
				m += "<div class='answer-bullet'>" + rBullet + ".</div>";
				m += "<div class='answer-label'>" + rLabel + "</div>";
				m += "<input id='"+ rId +"' name='"+ rGroup +"' type='radio' value='"+ rValue +"' class='rb-input' />";
				m += "<div style='clear:both'></div>";
				m += "</div>";
			}
		m +=	"</div>";
		// m +=	"<input type='button' value='Submit' class='qbutton' />";
		m += "<button class='qbutton'>Continue</button>";
		m += "</div>";
		
		// Insert into DOM.
		var q = $(m).appendTo(container);
		
		// Make question invisible initially so we can transition it in.
		$(q).hide();
		
		// Get reference to submit button.
		var submitBtn = $(":button", q);
		// Make the button look pretty.
		$(submitBtn).button();
		// Hide submitBtn.
		$(submitBtn).hide();
		
		// Disable/hide submit button.
		$(submitBtn).attr("disabled", true);
		// $(".course-button", q).hide();
		
		// Assign event handlers.
		assignHandlers(qData);
		
		// Return the newly added node.
		return q;
	}
	
	/* ---
	 * Sets the internal reference to the QuestionMgr object.  This allows the
	 * sub-classes of the QuestionProxy object to pass the results of user
	 * interaction up to the question manager.
	 */
	this.setMgr = function(mgrObj)
	{
		if(mgrObj != null && mgrObj != undefined && typeof(mgr) == "object")
		{
			mgr = mgrObj;
		}
		else
		{
			log.debug("QuestionProxy :: setMgr : Invalid argument.");
		}
	}
	
	/* ---
	 * Methods for firing transitions
	 */
	this.transIn = function(duration)
	{
		// Fade the current question in.
		var q = mgr.getCurrent();
		// ... and call this.enable() when transition is done.
		$(q.node).fadeIn(duration, this.enable);
	}
	
	this.transOut = function(duration)
	{
		// Disable the question controls.
		this.disable();
		
		// Fade the current question out and alert the question manager when
		// the transition is done.
		var q = mgr.getCurrent();
		$(q.node).fadeOut(duration, mgr.forward);
	}
	
	/* ---
	 * Methods for enabling and disabling the question UI controls.
	 */
	this.enable = function()
	{
		// TODO
		log.debug("Please implement QuestionProxy.enable().  Thanks! :)");
	}
	
	this.disable = function()
	{
		// TODO
		log.debug("Please implement QuestionProxy.disable().  Thanks! :)");
	}
	
	// ---
	// PRIVATE METHODS
	// ---
	
	/* ---
	 * Verifies that the question data contains all of the necessary 
	 * information for this type of question.
	 */
	function validate(qData)
	{
		// Validate QuestionMgr.
		if(mgr == null || mgr == undefined){
			log.debug("WARNING: No QuestionMgr reference set on MultiChoiceProxy.");
		}
		
		// Check question number.
		if(!qData.number) qData.number = 1;
		
		// Check for question text.
		if(!qData.text){
			log.debug("WARNING: No question text found on question: " + qData.toString());
		}
		
		// Check for answers.
		if(!qData.answers){
			log.debug("WARNING: No answers found in question: " + qData.toString());
		}
		
		// Check for feedback.
		if(!qData.feedback){
			log.debug("WARNING: No feedback found in question: " + qData.toString());
		}
		
		// Inject an "input" property into each question for storing the
		// user's input.
		qData.input = {
			selectedIndex:null
		}
	}
	
	/* ---
	 * Method to assign event handlers to HTML elements generated by the
	 * insertMarkup() method.  Usually called directly by the insterMarkup()
	 * method.
	 */
	function assignHandlers(qData)
	{
		// Get me a reference to the current question!
		var qNode = $("#question-" + qData.number);
		
		// Gather references to objects that we'll want to assign actions to.
		var submitBtn = $(":button", qNode)[0];
		var answers = $(".answer-label", qNode);
		var icons = $(".rb-icon", qNode);
		
		// Assign actions!
		$(submitBtn).bind('click', handleSubmitBtn);
		$(answers).bind('click', handleAnswerSelect);
		$(icons).bind('click', handleIconSelect);
	}
	
	// ---
	// UI Event Handlers
	// ---
	
	function handleSubmitBtn(e)
	{
		// Get a reference to the question data object.
		var q = mgr.getCurrent();
		
		// Which answer is selected?
		var radioEl = $(":checked", q.node)[0];
		
		// Record the index of the selected answer.
		var index = radioEl.getAttribute("value");
		
		// Record the index of the selected answer in the question's data model.
		q.input.selectedIndex = index;
		
		// Disable answers.
		$(".answer-label", q.node).unbind("click");
		$(".rb-icon", q.node).unbind("click");
		
		// Disable all input elements.
		$("input", q.node).attr("disabled", true);
		
		// Disable submit button
		$(":button", q.node).attr("disabled", true);
		
		// Evaluate the user's input and record the findings in the object data.
		evaluate(q);
		
		// Should we attempt to show feedback?
		if(mgr.getAbout("showFeedback") == "true"){
			showFeedback();
		} 
		// No feedback necessary.  Just transition out.
		else {
			that.transOut(400);
		}
	}
	
	function selectAnswer(data)
	{
		var selectedAnswer;
		var un
	}
	
	function handleAnswerSelect(e)
	{	
		// Only run this function if the underlying radiobutton is enabled.
		var radioBtn = $(e.target).children()[0];
		if($(radioBtn).attr("disabled") == "disabled") return;
		
		var q = mgr.getCurrent();
		var answerNode = $(e.target).parent();
		
		// Uncheck all radio icons.
		var rbIcons = $(".rb-icon", q.node);
		rbIcons.removeClass("rb-on");
		rbIcons.addClass("rb-off");
		
		// Mark the selected radio button icon.
		var iconDiv = $(".rb-icon", answerNode);
		iconDiv.removeClass("rb-off");
		iconDiv.addClass("rb-on");
		
		// Mark the radio button, too.
		var radioEl = $("input[type='radio']", answerNode)[0];
		$(radioEl).trigger("click");
		
		// Get a reference to the submit button.
		var submitBtn = $(":button", q.node);
		
		// Show and enable the submit button (if it's currently disabled).
		if($(submitBtn).attr("disabled") == "disabled"){
			$(submitBtn).attr("disabled", false);
			$(submitBtn).fadeIn(400);
		}
	}
	
	function handleIconSelect(e)
	{
		var answer = $(e.target).parent();
		var label = $(".answer-label", answer);
		handleAnswerSelect({target:label});
	}
	
	// ---
	// Other Internal methods.
	// ---
	
	/* ---
	 * Display question-level feedback.
	 */
	function showFeedback()
	{
		/* 
		 * TODO: Remove the hard-coded values for the fadeIn sequencing and replace them with variables.
		 */
		
		// Get reference to question node.
		var qData = mgr.getCurrent();
		
		// Remove submit button.
		var submitBtn = $(":button", qData.node);
		submitBtn.fadeOut(400);
		
		// Create feedback markup from question data.
		var feedbackClass;
		var isCorrectText;
		var feedbackText;
		if(qData.evaluation.correct == "true")
		{
			feedbackClass = "correct-feedback";
			isCorrectText = "Correct!";
			feedbackText = qData.feedback.correct;
		}
		else
		{
			feedbackClass = "incorrect-feedback";
			isCorrectText = "Incorrect.";
			feedbackText = qData.feedback.incorrect;
		}
		
		var f = "";
		f += "<div>";
		f +=	"<h1 class='"+ feedbackClass +"'>"+ isCorrectText +"</h1>";
		f +=	"<p class='"+ feedbackClass +"'>"+ feedbackText +"</p>";
		f += "</div>";
		
		// Insert feedback markup into page below question.
		var fbEl = $(f).appendTo(qData.node);
		$(fbEl).hide();
		$(fbEl).delay(400).fadeIn(400);
		
		// Create and insert a continue button so the user can advance to the
		// next question.
		// var nextBtnStr = "<input type='button' value='Next Question' class='qbutton' />";
		var nextBtnStr = "<button class='qbutton'>Continue</button>";
		var nextBtn = $(nextBtnStr).appendTo(fbEl);
		
		// Make button pretty.
		$(nextBtn).button();
		
		// Do transition out when "next" button is clicked.
		$(nextBtn).click(function(){that.transOut(400)});
		
		// Hide "next" button and fade it in.
		$(nextBtn).hide();
		$(nextBtn).delay(800).fadeIn(1000);
		
		// If showCorrect is set to 'true', modify the answer list to show which one is correct.
		if(mgr.getAbout("showCorrect") == "true")
		{
			// Get a list of labels associated with unselected input elements.
			// Create filter to find correct node.
			var correctNode = "[value=" + getCorrectIndex(qData) + "]"
			// Select all answers that are NOT marked as correct.
			var unselected = $('input[type=radio]', qData.node).not(correctNode).parent();
			
			// Fade each of the incorrect labels so they are less opaque.
			$(unselected).fadeTo(400, 0.40);
		}
	}
	
	/* ---
	 * Hides questino-level feedback after it has been displayed.
	 TODO: This function may no longer be needed as all transition duties have been passed to transOut();
	 */
	function hideFeedback()
	{
		that.transOut(400);
	}
	
	/* ---
	 * Evaluates the user's input (as stored in the question data) and injects
	 * the result into the question's 'evaluation' property.
	 */
	function evaluate(qData)
	{
		// Make sure user input has been provided.
		if(!qData.input){
			log.debug("ERROR: Cannot grade question, '" + qData.text + "', as it has no user input.");
			return null;
		}
		
		// Find index marked as "correct".
		// TODO: Replace this code block with a call to getCorrectIndex();
		var correctIndex = null;
		for(var i=0; i<qData.answers.length; i++)
		{
			if(qData.answers[i].correct != undefined && qData.answers[i].correct == "true"){
				correctIndex = String(i);
				break;
			}
		}
		
		// Make sure we found a correct answer.
		if(correctIndex == null){
			log.debug("ERROR: Cannot grade question, '" + qData.text + "', as no correct answer is defined.");
			return null;
		}
		
		// Inject the results into the question data.
		if(qData.input.selectedIndex == correctIndex)
		{
			qData.evaluation = {correct : "true"};
		}
		else {
			qData.evaluation = {correct : "false"};
		}
	}
	
	function getCorrectIndex(qData)
	{
		// Find index marked as "correct".
		var correctIndex = null;
		for(var i=0; i<qData.answers.length; i++)
		{
			if(qData.answers[i].correct != undefined && qData.answers[i].correct == "true"){
				correctIndex = String(i);
				break;
			}
		}
		
		// Make sure we found a correct answer.
		if(correctIndex == null){
			log.debug("ERROR: Cannot grade question, '" + qData.text + "', as no correct answer is defined.");
			return null;
		}
		else
		{
			return correctIndex;
		}
	}
	
	/* ---
	 * Expose this object for use!
	 */
	return this;
};
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 /* ---
 * MULTIPLE CHOICE w/ IMAGES PROXY
 */
QuestionProxies.MultiChoiceImage = new function MultiChoiceImage()
{
	// Define a reference to this object within this closure so our private
	// methods can access it later.
	var that = this;
	
	// ---
	// PRIVATE VARIABLES
	// ---
	
	/* ---
	 * A reference to the QuestionMgr object that uses this QuestionProxy.
	 * This will be set by the QuestionMgr using the setMgr method.
	 */
	var mgr = null;
	
	// ---
	// PUBLIC METHODS
	// ---
	
	/* ---
	 * Generate and insert HTML/CSS/JavaScript necessary for displaying the
	 * question, accepting user input, and facilitating visual transitions.
	 */
	this.insertMarkup = function(container, qData)
	{	
		// Validate the question data.
		// TODO: Conditional return here?
		validate(qData);
		
		// Define markup.
		var m = "";
		m +=  "<div id='question-" + qData.number + "' class='question multichoiceimage'>";
		m +=	"<div class='question-number'>" + qData.number + ".</div>";
		m +=	"<div class='question-text'>" + qData.text + "</div>";
		m +=	"<div style='clear:both;'></div>";
		m +=	"<div class='question-answers'>";
			for(var i = 0; i < qData.answers.length; i++)
			{
				// Gather data to be inserted into answer
				// markup. This is here primarily for
				// code readability.
				var rGroup = (qData.number + "_answers");
				var rId = (qData.number+"_"+i);
				var rValue = i;
				var rBullet = String.fromCharCode(97+i);
				var rLabel = qData.answers[i].text;
				var rImage = qData.answers[i].image.src;
				var rWidth = qData.answers[i].image.width;
				var rHeight = qData.answers[i].image.height;
				var rStyle = "width:"+rWidth+"px; height:"+rHeight+"px;";
				
				// Create answer markup.
				m += "<div class='answer' style='"+ rStyle +"'>";
				m += "<input id='"+ rId +"' name='"+ rGroup +"' type='radio' value='"+ rValue +"' class='rb-input' />";
				m += "<img src='"+ rImage +"' width='"+ rWidth +"' height='"+ rHeight +"' />";
				m += "</div>";
			}
		m +=	"<div style='clear:both'></div>";
		m +=	"</div>";
		m += "<button class='qbutton'>Continue</button>";
		m += "</div>";
		
		// Insert into DOM.
		var q = $(m).appendTo(container);
		
		// Make question invisible initially so we can transition it in.
		$(q).hide();
		
		// Get reference to submit button.
		var submitBtn = $(":button", q);
		// Make the button look pretty.
		$(submitBtn).button();
		// Hide submitBtn.
		$(submitBtn).hide();
		
		// Disable/hide submit button.
		$(submitBtn).attr("disabled", true);
		// $(".course-button", q).hide();
		
		// Assign event handlers.
		assignHandlers(qData);
		
		// Return the newly added node.
		return q;
	}
	
	/* ---
	 * Sets the internal reference to the QuestionMgr object.  This allows the
	 * sub-classes of the QuestionProxy object to pass the results of user
	 * interaction up to the question manager.
	 */
	this.setMgr = function(mgrObj)
	{
		if(mgrObj != null && mgrObj != undefined && typeof(mgr) == "object")
		{
			mgr = mgrObj;
		}
		else
		{
			log.debug("QuestionProxy :: setMgr : Invalid argument.");
		}
	}
	
	/* ---
	 * Methods for firing transitions
	 */
	this.transIn = function(duration)
	{
		// Fade the current question in.
		var q = mgr.getCurrent();
		// ... and call this.enable() when transition is done.
		$(q.node).fadeIn(duration, this.enable);
	}
	
	this.transOut = function(duration)
	{
		// Disable the question controls.
		this.disable();
		
		// Fade the current question out and alert the question manager when
		// the transition is done.
		var q = mgr.getCurrent();
		$(q.node).fadeOut(duration, mgr.forward);
	}
	
	/* ---
	 * Methods for enabling and disabling the question UI controls.
	 */
	this.enable = function()
	{
		// TODO
		log.debug("Please implement QuestionProxy.enable().  Thanks! :)");
	}
	
	this.disable = function()
	{
		// TODO
		log.debug("Please implement QuestionProxy.disable().  Thanks! :)");
	}
	
	// ---
	// PRIVATE METHODS
	// ---
	
	/* ---
	 * Verifies that the question data contains all of the necessary 
	 * information for this type of question.
	 */
	function validate(qData)
	{
		// Validate QuestionMgr.
		if(mgr == null || mgr == undefined){
			log.debug("WARNING: No QuestionMgr reference set on MultiChoiceProxy.");
		}
		
		// Check question number.
		if(!qData.number) qData.number = 1;
		
		// Check for question text.
		if(!qData.text){
			log.debug("WARNING: No question text found on question: " + qData.toString());
		}
		
		// Check for answers.
		if(!qData.answers){
			log.debug("WARNING: No answers found in question: " + qData.toString());
		}
		
		// Check for feedback.
		if(!qData.feedback){
			log.debug("WARNING: No feedback found in question: " + qData.toString());
		}
		
		// Inject an "input" property into each question for storing the
		// user's input.
		qData.input = {
			selectedIndex:null
		}
	}
	
	/* ---
	 * Method to assign event handlers to HTML elements generated by the
	 * insertMarkup() method.  Usually called directly by the insterMarkup()
	 * method.
	 */
	function assignHandlers(qData)
	{
		// Get me a reference to the current question!
		var qNode = $("#question-" + qData.number);
		
		var submitBtn = $(":button", qNode)[0];
		$(submitBtn).click(handleSubmitBtn);
		
		var answers = $(".answer", qNode);
		$(answers).click(handleAnswerSelect);
		$(answers).hover(handleAnswerIn, handleAnswerOut);
	}
	
	function removeHandlers(qData)
	{
		// Get me a reference to the current question!
		var qNode = $("#question-" + qData.number);
		
		var answers = $(".answer", qNode);
		$(answers).unbind("click");
		$(answers).unbind("mouseenter mouseleave");
	}
	
	// ---
	// UI Event Handlers
	// ---
	
	function handleSubmitBtn(e)
	{
		// Get a reference to the question data object.
		var q = mgr.getCurrent();
		
		// Disable answers.
		removeHandlers(q);
		
		// Get a reference to the main markup container.
		var ctr = mgr.getContainer();
		
		// Get a reference to the input element markup that fired this event.
		var el = $(":checked", q.node)[0];
		
		// Record the index of the selected answer.
		var index = el.getAttribute("value");
		
		// Record the index of the selected answer in the question's data model.
		q.input.selectedIndex = index;
		
		// Disable all input elements.
		$("input", q.node).attr("disabled", true);
		
		// Disable submit button
		$(":button", q.node).attr("disabled", true);
		
		// Evaluate the user's input and record the findings in the object data.
		evaluate(q);
		
		// Should we attempt to show feedback?
		if(mgr.getAbout("showFeedback") == "true")
		{
			showFeedback();
		} 
		// No feedback necessary.  Just transition out.
		else {
			that.transOut(400);
		}
		
		// Instruct the QuestionMgr to show the next question.
		// mgr.forward();
		
	}
	
	function handleAnswerSelect(e)
	{
		// Get references to all of the objects that we'll need.
		var container = $(e.target).parent().parent();
		var answers = container.children();
		var selectedAnswer = $(e.target).parent();
		var radio = $(e.target).prev();
		
		// Remove "selected" styles from all answers.
		answers.removeClass("selected");
		
		// Add "selected" style to selected answer.
		selectedAnswer.addClass("selected");
		
		// Select the appropriate checkbox.
		radio.trigger("click");
		
		// Get a reference to the submit button.
		var submitBtn = $(":button", mgr.getCurrent().node);
		
		// Show and enable the submit button (if it's currently disabled).
		if($(submitBtn).attr("disabled") == "disabled")
		{
			$(submitBtn).attr("disabled", false);
			$(submitBtn).fadeIn(400);
		}
	}
	
	function handleAnswerIn(e)
	{
		$(this).addClass("hover");
	}
	
	function handleAnswerOut(e)
	{
		$(this).removeClass("hover");
	}
	
	// ---
	// Other Internal methods.
	// ---
	
	/* ---
	 * Display question-level feedback.
	 */
	function showFeedback()
	{
		/* 
		 * TODO: Remove the hard-coded values for the fadeIn sequencing and replace them with variables.
		 */
		
		// Get reference to question node.
		var qData = mgr.getCurrent();
		
		// Remove submit button.
		var submitBtn = $(":button", qData.node);
		submitBtn.fadeOut(400);
		
		// Create feedback markup from question data.
		var feedbackClass;
		var isCorrectText;
		var feedbackText;
		if(qData.evaluation.correct == "true")
		{
			feedbackClass = "correct-feedback";
			isCorrectText = "Correct!";
			feedbackText = qData.feedback.correct;
		}
		else
		{
			feedbackClass = "incorrect-feedback";
			isCorrectText = "Incorrect.";
			feedbackText = qData.feedback.incorrect;
		}
		
		var f = "";
		f += "<div>";
		f +=	"<h1 class='"+ feedbackClass +"'>"+ isCorrectText +"</h1>";
		f +=	"<p class='"+ feedbackClass +"'>"+ feedbackText +"</p>";
		f += "</div>";
		
		// Insert feedback markup into page below question.
		var fbEl = $(f).appendTo(qData.node);
		$(fbEl).hide();
		$(fbEl).delay(400).fadeIn(400);
		
		// Create and insert a continue button so the user can advance to the
		// next question.
		// var nextBtnStr = "<input type='button' value='Next Question' class='qbutton' />";
		var nextBtnStr = "<button class='qbutton'>Continue</button>";
		var nextBtn = $(nextBtnStr).appendTo(fbEl);
		
		// Make button pretty.
		$(nextBtn).button();
		
		// Do transition out when "next" button is clicked.
		$(nextBtn).click(function(){that.transOut(400)});
		
		// Hide "next" button and fade it in.
		$(nextBtn).hide();
		$(nextBtn).delay(800).fadeIn(1000);
		
		// If showCorrect is set to 'true', modify the answer list to show which one is correct.
		if(mgr.getAbout("showCorrect") == "true")
		{
			// Get a list of labels associated with unselected input elements.
			// Create filter to find correct node.
			var correctNode = "[value=" + getCorrectIndex(qData) + "]"
			// Select all answers that are NOT marked as correct.
			var unselected = $('input[type=radio]', qData.node).not(correctNode).parent();
			
			// Fade each of the incorrect labels so they are less opaque.
			$(unselected).fadeTo(400, 0.40);
		}
	}
	
	/* ---
	 * Hides questino-level feedback after it has been displayed.
	 TODO: This function may no longer be needed as all transition duties have been passed to transOut();
	 */
	function hideFeedback()
	{
		that.transOut(400);
	}
	
	/* ---
	 * Evaluates the user's input (as stored in the question data) and injects
	 * the result into the question's 'evaluation' property.
	 */
	function evaluate(qData)
	{
		// Make sure user input has been provided.
		if(!qData.input){
			log.debug("ERROR: Cannot grade question, '" + qData.text + "', as it has no user input.");
			return null;
		}
		
		// Find index marked as "correct".
		// TODO: Replace this code block with a call to getCorrectIndex();
		var correctIndex = null;
		for(var i=0; i<qData.answers.length; i++)
		{
			if(qData.answers[i].correct != undefined && qData.answers[i].correct == "true"){
				correctIndex = String(i);
				break;
			}
		}
		
		// Make sure we found a correct answer.
		if(correctIndex == null){
			log.debug("ERROR: Cannot grade question, '" + qData.text + "', as no correct answer is defined.");
			return null;
		}
		
		// Inject the results into the question data.
		if(qData.input.selectedIndex == correctIndex)
		{
			qData.evaluation = {correct : "true"};
		}
		else {
			qData.evaluation = {correct : "false"};
		}
	}
	
	function getCorrectIndex(qData)
	{
		// Find index marked as "correct".
		var correctIndex = null;
		for(var i=0; i<qData.answers.length; i++)
		{
			if(qData.answers[i].correct != undefined && qData.answers[i].correct == "true"){
				correctIndex = String(i);
				break;
			}
		}
		
		// Make sure we found a correct answer.
		if(correctIndex == null){
			log.debug("ERROR: Cannot grade question, '" + qData.text + "', as no correct answer is defined.");
			return null;
		}
		else
		{
			return correctIndex;
		}
	}
	
	/* ---
	 * Expose this object for use!
	 */
	return this;
};






















// -----------------------------------

/* ---
 * MULTIPLE CHOICE PROXY
 */
QuestionProxies.HotSpot = new function HotSpot()
{
	// Define a reference to this object within this closure so our private
	// methods can access it later.
	var that = this;
	
	// ---
	// PRIVATE VARIABLES
	// ---
	
	/* ---
	 * A reference to the QuestionMgr object that uses this QuestionProxy.
	 * This will be set by the QuestionMgr using the setMgr method.
	 */
	var mgr = null;
	
	// ---
	// PUBLIC METHODS
	// ---
	
	/* ---
	 * Generate and insert HTML/CSS/JavaScript necessary for displaying the
	 * question, accepting user input, and facilitating visual transitions.
	 */
	this.insertMarkup = function(container, qData)
	{	
		// Validate the question data.
		// TODO: Conditional return here?
		validate(qData);
		
		// Define markup.
		var m = "" + 
		"<div id='question-" + qData.number + "' class='question multichoice'>"+
			"<div class='question-number'>" + qData.number + ". </div>" + 
			"<div class='question-text'>" + qData.text + "</div>" +
			"<div style='clear:both;'></div>" + 
			"<div class='question-answers'>" + 
				"<img class='question-answers' src='" + qData.answers[0].image + "' />" +
			"</div>" +
			"<button class='qbutton'>Continue</button>" +
		"</div>";
		
		// Insert into DOM.
		var q = $(m).appendTo(container);
		
		// Make question invisible initially so we can transition it in.
		$(q).hide();
		
		// Get reference to submit button.
		var submitBtn = $(":button", q);
		// Make the button look pretty.
		$(submitBtn).button();
		// Hide submitBtn.
		$(submitBtn).hide();
		
		// Disable/hide submit button.
		$(submitBtn).attr("disabled", true);
		
		// Assign event handlers.
		assignHandlers(qData);
		
		// Return the newly added node.
		return q;
	}
	
	/* ---
	 * Sets the internal reference to the QuestionMgr object.  This allows the
	 * sub-classes of the QuestionProxy object to pass the results of user
	 * interaction up to the question manager.
	 */
	this.setMgr = function(mgrObj)
	{
		if(mgrObj != null && mgrObj != undefined && typeof(mgr) == "object")
		{
			mgr = mgrObj;
		}
		else
		{
			log.debug("QuestionProxy :: setMgr : Invalid argument.");
		}
	}
	
	/* ---
	 * Methods for firing transitions
	 */
	this.transIn = function(duration)
	{
		// Fade the current question in.
		var q = mgr.getCurrent();
		// ... and call this.enable() when transition is done.
		$(q.node).fadeIn(duration, this.enable);
	}
	
	this.transOut = function(duration)
	{
		// Disable the question controls.
		this.disable();
		
		// Fade the current question out and alert the question manager when
		// the transition is done.
		var q = mgr.getCurrent();
		$(q.node).fadeOut(duration, mgr.forward);
	}
	
	/* ---
	 * Methods for enabling and disabling the question UI controls.
	 */
	this.enable = function()
	{
		// TODO
		log.debug("Please implement QuestionProxy.enable().  Thanks! :)");
	}
	
	this.disable = function()
	{
		// TODO
		log.debug("Please implement QuestionProxy.disable().  Thanks! :)");
	}
	
	// ---
	// PRIVATE METHODS
	// ---
	
	/* ---
	 * Verifies that the question data contains all of the necessary 
	 * information for this type of question.
	 */
	function validate(qData)
	{
		// Validate QuestionMgr.
		if(mgr == null || mgr == undefined) {
			log.debug("WARNING: No QuestionMgr reference set on MultiChoiceProxy.");
		}
		
		// Check question number.
		if(!qData.number) qData.number = 1;
		
		// Check for question text.
		if(!qData.text) {
			log.debug("WARNING: No question text found on question: " + qData.toString());
		}
		
		// Check for answers.
		if(!qData.answers) {
			log.debug("WARNING: No answers found in question: " + qData.toString());
		}
		
		// Check for feedback.
		if(!qData.feedback) {
			log.debug("WARNING: No feedback found in question: " + qData.toString());
		}
		
		// Inject an "input" property into each question for storing the
		// user's input.
		qData.input = {
			x:0,
			y:0
		}
	}
	
	/* ---
	 * Method to assign event handlers to HTML elements generated by the
	 * insertMarkup() method.  Usually called directly by the insterMarkup()
	 * method.
	 */
	function assignHandlers(qData)
	{
		// Get me a reference to the current question!
		var qNode = $("#question-" + qData.number);
		
		// Gather references to objects that we'll want to assign actions to.
		var submitBtn = $(":button", qNode)[0];
		var answers = $("img", qNode);
		
		// Assign actions!
		$(submitBtn).bind('click', handleSubmitBtn);
		$(answers).bind('click', handleAnswerSelect);
	}
	
	// ---
	// UI Event Handlers
	// ---
	
	function handleSubmitBtn(e)
	{
		// Get a reference to the question data object.
		var q = mgr.getCurrent();
		
		// Disable submit button
		$(":button", q.node).attr("disabled", true);
		
		// Disable hotspot.
		$("img", q.node).unbind("click");
		
		// Evaluate the user's input and record the findings in the object data.
		evaluate(q);
		
		// Should we attempt to show feedback?
		if(mgr.getAbout("showFeedback") == "true") {
			showFeedback();
		} 
		// No feedback necessary.  Just transition out.
		else {
			that.transOut(400);
		}
	}
	
	function handleAnswerSelect(e)
	{	
		// Get a reference to the question data object.
		var q = mgr.getCurrent();
		
		// Reference to questions-answers container.
		var qAnswers = $(".question-answers", q.node);
		
		// Where did the user click?
		var aOffset = qAnswers.offset();
		q.input.x = (e.pageX - aOffset.left);
		q.input.y = (e.pageY - aOffset.top);
		
		// Insert marker if one doesn't already exist.
		var marker = $(".click-marker", q.node);
		if(!marker.length){
			var markerStr = "<div class='click-marker'></div>";
			marker = $(markerStr).appendTo(qAnswers);
		}
		
		// Position marker.
		var markerPos = {
			left : q.input.x - (marker.width() / 2),
			top : q.input.y // - (marker.height() / 2)
		}
		$(marker).css(markerPos);
		
		// Get a reference to the submit button.
		var submitBtn = $(":button", mgr.getCurrent().node);
		
		// Show and enable the submit button (if it's currently disabled).
		if($(submitBtn).attr("disabled") == "disabled"){
			$(submitBtn).attr("disabled", false);
			$(submitBtn).fadeIn(400);
		}
	}
	
	// ---
	// Other Internal methods.
	// ---
	
	/* ---
	 * Display question-level feedback.
	 */
	function showFeedback()
	{
		/* 
		 * TODO: Remove the hard-coded values for the fadeIn sequencing and replace them with variables.
		 */
		
		// Get reference to question node.
		var qData = mgr.getCurrent();
		
		// Remove submit button.
		var submitBtn = $(":button", qData.node);
		submitBtn.fadeOut(400);
		
		// Create feedback markup from question data.
		var feedbackClass;
		var isCorrectText;
		var feedbackText;
		if(qData.evaluation.correct == "true")
		{
			feedbackClass = "correct-feedback";
			isCorrectText = "Correct!";
			feedbackText = qData.feedback.correct;
		}
		else
		{
			feedbackClass = "incorrect-feedback";
			isCorrectText = "Incorrect.";
			feedbackText = qData.feedback.incorrect;
		}
		
		var f = "";
		f += "<div class='feedback-container'>";
		f +=	"<h1 class='"+ feedbackClass +"'>"+ isCorrectText +"</h1>";
		f +=	"<p class='"+ feedbackClass +"'>"+ feedbackText +"</p>";
		f += "</div>";
		
		// Insert feedback markup into page below question.
		var fbEl = $(f).appendTo(qData.node);
		$(fbEl).hide();
		$(fbEl).delay(400).fadeIn(400);
		
		// Create and insert a continue button so the user can advance to the
		// next question.
		// var nextBtnStr = "<input type='button' value='Next Question' class='qbutton' />";
		var nextBtnStr = "<button class='qbutton'>Continue</button>";
		var nextBtn = $(nextBtnStr).appendTo(qData.node);
		
		// Make button pretty.
		$(nextBtn).button();
		
		// Do transition out when "next" button is clicked.
		$(nextBtn).click(function(){that.transOut(400)});
		
		// Hide "next" button and fade it in.
		$(nextBtn).hide();
		$(nextBtn).delay(800).fadeIn(1000);
		
		// If showCorrect is set to 'true', highlight the correct area.
		if(mgr.getAbout("showCorrect") == "true")
		{
			var m = "<div class='highlight'></div>";
			var el = $(".question-answers", qData.node);
			var highlight = $(m).appendTo(el);
			
			// Position the highlight.
			highlight.css(qData.answers[0].rect);
			
			// Fade in.
			highlight.hide();
			highlight.fadeIn(400);
		}
	}
	
	/* ---
	 * Hides questino-level feedback after it has been displayed.
	 TODO: This function may no longer be needed as all transition duties have been passed to transOut();
	 */
	function hideFeedback()
	{
		that.transOut(400);
	}
	
	/* ---
	 * Evaluates the user's input (as stored in the question data) and injects
	 * the result into the question's 'evaluation' property.
	 */
	function evaluate(qData)
	{
		// Make sure user input has been provided.
		if(!qData.input){
			log.debug("ERROR: Cannot grade question, '" + qData.text + "', as it has no user input.");
			return null;
		}
		
		if(checkBounds(qData.input.x,
					   qData.input.y,
					   qData.answers[0].rect)){
			qData.evaluation = {correct : "true"};
		} else {
			qData.evaluation = {correct : "false"};
		}
		
		// Return true if x/y is within rect bounds, false if not.
		function checkBounds(x,y,rect)
		{
			// Did the user click in the rectangle?
			if(y<rect.top) return false;
			if(y>rect.top+rect.height) return false;
			if(x<rect.left) return false;
			if(x>rect.left+rect.width) return false;
			return true;
		}
	}
	
	/* ---
	 * Expose this object for use!
	 */
	return this;
};
 
// -----------------------------------
