

/* ***
 * Evaluator Prototype (for Question Sets)
 * ---------------------------------------
 *
 * - Invoked by QuestionMgr.
 *
 * - Reads user interaction results in question data (as injected by
 *   QuestionMgr) to appraise user's input.
 *
 * - Generates and inserts HTML/JS/CSS into the DOM to display the results of
 *   the evaluation.
 *
 * - Provides methods and functionality for visual transitions for the results
 *   display.
 *
 * ***/

/* ---
 * Create a global container for all question proxy types so they can be safely
 * and easily accesses later.
 */
var Evaluators = {};

/* ---
 * Assessment Evaluator
 */
Evaluators.Assessment = new function(){
	
	// Define a reference to this object within this closure so our private
	// methods can access it later.
	var that = this;
	
	// ---
	// PUBLIC VARIABLES
	// ---
	
	/* ---
	 * Information about this evaluator.
	 */
	this.about = {
		/* ---
		 * The type of this evaluator.  A real evaluator might have a type of
		 * 'assessment' or 'knowledge-check'.
		 */
		type : "assessment",
		
		/* ---
		 * A list of question types that can be evaluated by this Evaluator object.
		 */
		accepts :[
			"multi-choice",
			"multi-choice-image",
			"multi-select",
			"multi-select-image",
			"ordered-text"
		]
	}
	
	// ---
	// PRIVATE VARIABLES
	// ---
	
	/* ---
	 * Store a reference to the current question data (as stored in the active
	 * QuestionMgr object).
	 */
	var qSet;
	
	/* ---
	 * Store a reference to the container that we'll insert all of our markup 
	 * into.
	 */
	var container;
	
	/* ---
	 * A reference to the QuestionMgr object that uses this QuestionProxy.
	 * This will be set by the QuestionMgr using the setMgr method.
	 */
	var mgr = null;
	
	/* --
	 * A reference to the node that contains all of our feedback elements
	 */
	var node = null;
	
	// ---
	// PUBLIC METHODS
	// ---
	
	/* ---
	 * Accept question data and begin evaluation.
	 */
	this.parse = function(container, _qSet)
	{
		// Validate our data.
		if(validate(_qSet))
		{
			// Store qSet for use later.
			qSet = _qSet;
			
			// Generate and insert markup.
			insertMarkup(container, qSet);
			
			// Get the user's score.
			var qSetGrade = getGrade(qSet).percent;
			
			// If the user passed, tell the shell.
			if(qSetGrade >= qSet.about.passingGrade)
			{
				try{
					shellAPI.addSlideFlag('question-set');
					shellAPI.setScore(qSetGrade);
					shellAPI.setPassed();
				} catch(e)
				{
					log.debug("Assessment is not running in shell... Skipping call to addSlideFlag()");
				}
			}
			
			// Display the feedback.
			this.transIn(400);
		}
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
			log.debug("Evaluator :: setMgr : Invalid argument.");
		}
	}
	
	/* ---
	 * Methods for firing transitions
	 */
	this.transIn = function(duration)
	{
		// Fade the feedback in.
		$(node).fadeIn(duration, this.enable);
	}
	
	this.transOut = function(duration)
	{
		// Disable the question controls.
		this.disable();
		
		// Fade the feedback out.
		$(node).fadeOut(duration);
	}
	
	/* ---
	 * Methods for enabling and disabling the question UI controls.
	 */
	this.enable = function()
	{
		// TODO
		log.debug("Please implement Evaluator.enable().  Thanks! :)");
	}
	
	this.disable = function()
	{
		// TODO
		log.debug("Please implement Evaluator.disable().  Thanks! :)");
	}
	
	// ---
	// PRIVATE METHODS
	// ---
	
	/* ---
	 * Verifies that the question data that was passed to the evaluator does not
	 * contain any questions types that the evaluator can't handle.
	 */
	var validate = function(qSet)
	{
		// TODO
		log.debug("NOTE: Please implement validate() in Evaluators.Assessment.  Thanks! :)");
		// Just return TRUE for now... Will change this when full implemented...
		return true;
	}
	
	/* ---
	 * Generate and insert HTML/CSS/JavaScript necessary for displaying the
	 * question, accepting user input, and facilitating visual transitions.
	 */
	var insertMarkup = function(container, qSet)
	{
		var m = "";
		m += "<div class='evaluator'>";
		m += "<h1>Assessment Summary</h1>";
		
		// Did the user pass or fail?
		var grade = getGrade(qSet);
		var passingGrade = parseInt(qSet.about.passingGrade);
		
		// Pass message.
		if(grade.percent >= passingGrade)
		{
			m += "<p>Congratulations! You passed the assessment, answering <strong>"+ grade.correct +"</strong> of "; 
			m += "<strong>"+ grade.total +"</strong> questions correct and scoring <strong>"+ grade.percent +"%</strong></p>";
		}
		
		// Fail Message.
		else
		{
			m += "<p>You answered <strong>"+ grade.correct +"</strong> of <strong>"+ grade.total +"</strong> questions correct.</p>"
			m += "<p>You scored <strong>"+ grade.percent +"%</strong> but needed <strong>"+ passingGrade +"%</strong> in order to pass.</p>"
		}
		
		// Dispaly missed questions (if the user got less than 100%)
		if(grade.percent < 100)
		{
			m += "<p>Please review the suggested items below.</p>";
			
			// Don't insert next/previous buttons if only one question was missed.
			if(grade.incorrect > 1){
				m += "<div id='review-buttons'>";
				m += 	"<button id='prev-review' class=''>&lt;&lt;</button>";
				m += 	"<button id='next-review' class=''>&gt;&gt;</button>";
				m +=	"<div id='review-counter'></div>";
				m += 	"<div style='clear:both;'></div>";
				m += "</div>";
			}
			
			m += "<div id='review-window'>";
			m += 	"<div id='review-item-container'>";
			
			// BEGIN LOOP THRU MISSED QUESTIONS
			for(var i = 0; i < qSet.questions.length; i++)
			{
				var q = qSet.questions[i];
				var qText = q.text;
				var ansText = q.answers[q.input.selectedIndex].text;
				
				// We're only concerned with displaying _incorrect_ answers.
				if(q.evaluation.correct != "true"){
					m +="<div id='review-item-"+ i +"' class='review-item'>";
					m +=	"<p><strong>Question: </strong>" + qText + "</p>";
					m +=	"<p><strong>Your answer: </strong>" + ansText + "</p>";
					m +=	"<p>You can find more information about this topic in:</p>";
					m +=	"<ul class='review-item'>";
					
					// BEGIN LOOP THRU REVIEW ITEMS
					for(var b=0; b<q.reviewItems.length; b++){
						
						try{
							// Localize vars for readability.
							var chapId = q.reviewItems[b].chapId;
							var pageId = q.reviewItems[b].pageId;
							var slideId = q.reviewItems[b].slideId;
							
							var chapLabel = shellAPI.getChapterLabel(chapId);
							var pageLabel = shellAPI.getPageLabel(pageId);
							
							// String to use as parameters for shellAPI.setLocation();
							var locStr = "\"" + slideId + "\",\"" + pageId + "\",\"" + chapId + "\"";
							
							m +=	"<li class=''>";
							m +=		"<a class='' href='javascript:shellAPI.setLocation("+ locStr +");'>";
							m +=		"<span class='review-chapter'>"+ chapLabel +": </span> ";
							m +=		"<span class='review-page'>"+ pageLabel +"</span>";
							m +=		"</a>";
							m +=	"</li>";
						}catch(e){
							log.debug("ERROR: Review items not supplied for question!");
						}
					}
					// END LOOP THRU REVIEW ITEMS
					
					m +=	"</ul>";
					m +="</div>";
				}
			}
			// END LOOP THRU MISSED QUESTIONS.
			
			m += 	"</div>";
			m += "</div>";
			
			// Retake assessment button (if the user failed.
			if(grade.percent < passingGrade){
				m += "<button id='retake-button' class=''>Retake Assessment</button>";
			}
			
			// Close container DIV.
			m += "<div>";
			
			// Insert markup.
			node = $(m).appendTo(container);
			
			// Make markup invisible initially so we can transition it in.
			$(node).hide();
			
			// Get a reference to retake button and style it with jQuery UI.
			var btns = $(":button", node);
			$(btns).button();
			
			// Hide "previous" button by default.
			$("#prev-review").hide();
			
			// Fill in review counter DIV.
			$("#review-counter").html("1 of " + grade.incorrect);
			
			// Assign event handlers.
			assignHandlers();
		}
		
		// User got 100%.
		else
		{
			// Close container DIV.
			m += "</div>";
			
			// Insert markup.
			node = $(m).appendTo(container);
		}
	}
	
	/* --
	 * Assigns even handlers to UI elements.
	 */
	function assignHandlers()
	{
		// Keep track of which review item is being viewed.
		var index = 0;
		
		/* ---
		 * Previous Button
		 */
		$("#prev-review").bind("click", function(e){
			
			if(index == 0){
				
				return;
			}else{
				index--;
			}
			
			// Check to see if we've reached the beginning of the list.
			if(index == 0){
				$("#prev-review").fadeOut(400);
			}
			
			// If we're using the Previous button, the Next button will be
			// useful soon!
			$("#next-review").fadeIn(400);
			
			var reviewItems = $("#review-item-container").children();
			
			$("#review-window").scrollTo(reviewItems[index], {
				duration: 400,
				axis: 'x',
				onAfter: function(){ scrollWorking = false }
			});
			
			// Update review-counter.
			var grade = getGrade(qSet);
			$("#review-counter").html(Number(index+1) + " of " + grade.incorrect);
			
		});
		
		/* ---
		 * Next Button
		 */
		$("#next-review").bind("click", function(e){
			
			var reviewItems = $("#review-item-container").children();
			
			if(index == reviewItems.length-1){
				// We've reached the last item in the list. Hide the next
				// button.
				$("#next-review").fadeOut(400);
				return;
			}else{
				index++;
			}
			
			// Check to see if we've reached the end of the list.
			if(index == reviewItems.length-1){
				$("#next-review").fadeOut(400);
			}
			
			// If we're using the Next button, the Previous button will be
			// useful soon!
			$("#prev-review").fadeIn(400);
			
			$("#review-window").scrollTo(reviewItems[index], {
				duration: 400,
				axis: 'x',
				onAfter: function(){ scrollWorking = false }
			});
			
			// Update review-counter.
			var grade = getGrade(qSet);
			$("#review-counter").html(Number(index+1) + " of " + grade.incorrect);
		});
		// Get reference to "retake button"
		var retakeBtn = $("#retake-button", node);
		
		// Assign handler to retake button (assuming the user failed and it
		// was defined.
		if(retakeBtn) $(retakeBtn).bind("click", handleRetakeBtn);
	}
	
	/* ---
	 * Fires when the "Retake Assessment" button is clicked.
	 */
	function handleRetakeBtn(e)
	{
		// Tell the QuestionMgr to reset the assessment.
		// TODO: Make a call to this.transOut() instead of direct call to fadeOut/mgr.reset()
		$(node).fadeOut(400, function(){mgr.reset()});
	}
	
	/* ---
	 * Inspects user's input and returns an overall grade.
	 *
	 * NOTE: This method assumes that the Question Proxy object for each
	 *       question object has created 'evaluation.correct' property and
	 *       populated it with either 'true' or 'false'.
	 */
	function getGrade(qSet)
	{
		var total = qSet.questions.length;
		var correct = 0;
		for(var i=0; i<qSet.questions.length; i++)
		{
			var q = qSet.questions[i];
			if(q.evaluation.correct == "true")
			{
				correct++;
			}
		}
		
		var returnObj = {
			"total" : total,
			"correct" : correct,
			"incorrect" : Number(total - correct),
			"percent" : Math.round((correct/total)*100)
		}
		
		return returnObj;
	}
	
	/* ---
	 * Expose this object for use!
	 */
	return this;
};

/* ---
 * Knowledge Check Evaluator
 */
Evaluators.KnowledgeCheck = new function(){
	
	// Define a reference to this object within this closure so our private
	// methods can access it later.
	var that = this;
	
	// ---
	// PUBLIC VARIABLES
	// ---
	
	/* ---
	 * Information about this evaluator.
	 */
	this.about = {
		/* ---
		 * The type of this evaluator.  A real evaluator might have a type of
		 * 'assessment' or 'knowledge-check'.
		 */
		type : "knowledge-check",
		
		/* ---
		 * A list of question types that can be evaluated by this Evaluator object.
		 */
		accepts :[
			"multi-choice",
			"multi-choice-image",
			"multi-select",
			"multi-select-image",
			"ordered-text"
		]
	}
	
	// ---
	// PRIVATE VARIABLES
	// ---
	
	/* ---
	 * Store a reference to the current question data (as stored in the active
	 * QuestionMgr object).
	 */
	var qSet;
	
	/* ---
	 * Store a reference to the container that we'll insert all of our markup 
	 * into.
	 */
	var container;
	
	/* ---
	 * A reference to the QuestionMgr object that uses this QuestionProxy.
	 * This will be set by the QuestionMgr using the setMgr method.
	 */
	var mgr = null;
	
	/* --
	 * A reference to the node that contains all of our feedback elements
	 */
	var node = null;
	
	// ---
	// PUBLIC METHODS
	// ---
	
	/* ---
	 * Accept question data and begin evaluation.
	 */
	this.parse = function(container, qSet)
	{
		// Validate our data.
		if(validate(qSet))
		{
			// Generate and insert markup.
			insertMarkup(container, qSet);
			
			// Tell the shell that the question set is complete.
			shellAPI.addSlideFlag('question-set');
			
			// Display the feedback.
			this.transIn(400);
		}
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
			log.debug("Evaluator :: setMgr : Invalid argument.");
		}
	}
	
	/* ---
	 * Methods for firing transitions
	 */
	this.transIn = function(duration)
	{
		// Fade the feedback in.
		$(node).fadeIn(duration, this.enable);
	}
	
	this.transOut = function(duration)
	{
		// Disable the question controls.
		this.disable();
		
		// Fade the feedback out.
		$(node).fadeOut(duration);
	}
	
	/* ---
	 * Methods for enabling and disabling the question UI controls.
	 */
	this.enable = function()
	{
		// TODO
		log.debug("Please implement Evaluator.enable().  Thanks! :)");
	}
	
	this.disable = function()
	{
		// TODO
		log.debug("Please implement Evaluator.disable().  Thanks! :)");
	}
	
	// ---
	// PRIVATE METHODS
	// ---
	
	/* ---
	 * Verifies that the question data that was passed to the evaluator does not
	 * contain any questions types that the evaluator can't handle.
	 */
	var validate = function(qSet)
	{
		// TODO
		log.debug("NOTE: Please implement validate() in Evaluators.Assessment.  Thanks! :)");
		// Just return TRUE for now... Will change this when full implemented...
		return true;
	}
	
	/* ---
	 * Generate and insert HTML/CSS/JavaScript necessary for displaying the
	 * question, accepting user input, and facilitating visual transitions.
	 */
	var insertMarkup = function(container, qSet)
	{
		var m = "";
		m += "<div class='evaluator'>";
		m +=	"<h1>Knowledge Check Summary</h1>";
		
		// Get evaluation/grade information.
		var grade = getGrade(qSet);
		
		m += "<p>You answered " + grade.correct + " of " + grade.total + " questions correctly.  Remember, you can use the menu to review the previous topics at any time.</p>";
		m += "</div>";
		
		// Insert markup.
		node = $(m).appendTo(container);
		
		// Make markup invisible initially so we can transition it in.
		$(node).hide();
		
		// Assign event handlers.
		assignHandlers();
	}
	
	/* --
	 * Assigns even handlers to UI elements.
	 */
	function assignHandlers()
	{
		// EMPTY
	}
	
	/* ---
	 * Inspects user's input and returns an overall grade.
	 *
	 * NOTE: This method assumes that the Question Proxy object for each
	 *       question object has created 'evaluation.correct' property and
	 *       populated it with either 'true' or 'false'.
	 */
	function getGrade(qSet)
	{
		var total = qSet.questions.length;
		var correct = 0;
		for(var i=0; i<qSet.questions.length; i++)
		{
			var q = qSet.questions[i];
			if(q.evaluation.correct == "true")
			{
				correct++;
			}
		}
		
		var returnObj = {
			"total" : total,
			"correct" : correct,
			"incorrect" : Number(total - correct),
			"percent" : Math.round((correct/total)*100)
		}
		
		return returnObj;
	}
	
	/* ---
	 * Expose this object for use!
	 */
	return this;
};