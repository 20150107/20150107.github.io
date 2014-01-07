

/* ***
 * Question Manager Prototype
 * --------------------------
 * 
 * - Accepts and stores a question set object.
 * 
 * - Maintains a hash of question-type/question-proxy-object pairs for matching
 *   question types to the appropriate proxy object.
 *
 * - Provides methods for adding and removing question-type/question-proxy-object
 *   pairs at runtime.
 * 
 * - Provides methods for moving forward and backward through the question set.
 *   These methods should be bound to UI elements to facilitate user interaction.
 *   
 * - Detects when the end of a question set has been reached and invokes the 
 *   appropriate Evaluator object to appraise and display the results.
 *   
 * ***/

var QuestionMgr = new function(){
	
	// ---
	// PRIVATE VARIABLES
	// ---
	
	/* ---
	 * An internal reference to the QuestionMgr object.
	 */
	var that = this;
	
	/* ---
	 * A reference to the container element in the DOM that will hold all of the
	 * markup for this question set.
	 */
	var container = null;
	
	/* ---
	 * Store a copy of the question set so we can modify it as the user interacts
	 * with each question.
	 */
	var qSet = null;
	// ... and store another copy that we can revert to if the user decides to
	// retake the assessment.
	var qSet_reset = null;
	
	/****
	* DEBUG METHOD !!!
	* Returns a reference to the internal 'qSet' data object.  This is for 
	* debugging purposes only and should be removed prior to production.
	****/
	this.getData = function(){log.debug("PLEASE REMOVE THE getData() METHOD FROM QuestionMgr!!!"); return qSet};
	
	/* ---
	 * Store information about the active question so we can advance through the
	 * question set and reference the current question quickly.
	 */
	var qCurrent = {
		pos:0,
		ref:null
	};
	
	/* ---
	 * Store a list of question-type/question-proxy pairs so we can determine
	 * which Question Proxy objects to use for each question type.
	 */
	var qMap = {
		"multi-choice"       : "MultiChoice",
		"multi-choice-image" : "MultiChoiceImage",
		"multi-select"       : "MultiSelect",
		"multi-select-image" : "MultiSelectImage",
		"ordered-text"       : "OrderedText",
		"hotspot"			 : "HotSpot"
	}
	
	/* ---
	 * Store a list of evaluator-type/evaluator-object pairs so we can 
	 * determine which Question Proxy objects to use for each question 
	 * type.
	 */
	var evalMap = {
		"knowledge-check"	: "KnowledgeCheck",
		"assessment"		: "Assessment",
		"questionairre"		: "Questionairre",
		"survey"			: "Survey"
	}
	
	/* ---
	 * Store a list of question set types and associated settings so they can be
	 * applied once we know what type of question set we're dealing with.
	 * Ex. assessment, survey, knowledge check, questionairre, etc.
	 */
	var qSetMap = {
		
		"assessment" : {
			showFeedback : "false",
			showCorrect  : "false",
			linkContent  : "false",
			order        : "default",
			resume		 : "true"
		},
		
		"knowledge-check" : {
			showFeedback : "true",
			showCorrect  : "true",
			linkContent  : "false",
			order        : "default",
			resume		 : "false",
			feedback     : {
				correct   : "That's correct!",
				incorrect : "Sorry, that's incorrect."
			}
		},
		
		"survey" : {
			showFeedback : "true",
			showCorrect  : "false",
			linkContent  : "false",
			order        : "default",
			resume		 : "resume",
			feedback     : {
				correct   : "That's correct!",
				incorrect : "Sorry, that's incorrect."
			}
		},
		
		"questionairre" : {
			showFeedback : "false",
			showCorrent  : "false",
			linkContent  : "false",
			order        : "default",
			resume		 : "false"
		}
	}
	
	// ---
	// PUBLIC METHODS
	// ---
	
	/* ---
	 * Parses question set and passes each question to the appropriate
	 * QuestionProxy object.
	 */
	this.parse = function(_container, _qSet)
	{
		// Store a reference to the markup container.
		// TODO: Check to see if the container is valid.
		container = $(_container); 
		
		// Merge default settings with given settings (as long as a 'type'
		// property is defined.
		if(_qSet.about.type)
		{
			_qSet.about = $().extend({}, qSetMap[_qSet.about.type], _qSet.about);
		}
		
		// Check shell API first to see if the user has already completed this question set.
		try{
			var prevQset = shellAPI.data(_qSet.about.name);
			if(prevQset && _qSet.about.resume != "false"){
				qSet = prevQset;
				qSet_reset = _qSet; // We presume that _qSet is the original, unmodified question set.
				evaluate();
				return;
			}
		}
		catch(e){
			log.debug("INFO: Unable to read 'name' from qSet.  Continuing normally.");
		}
		
		// Double-check incoming question set for integrity.
		if(validate(_qSet) == true)
		{
			// Store an internal reference to the question set.
			qSet = _qSet;
			
			// Create a copy of the _qSet data so we can reset 
			qSet_reset = $().extend({}, _qSet);
		} 
		else {
			log.debug("ERROR: Question set contains invalid data.");
			return;
		}
		
		// Loop through the questions and create some mark-up.
		// TODO: Add support for randomization.
		for(var i = 0; i < qSet.questions.length; i++)
		{
			var q = qSet.questions[i];
			
			// Inject a "number" property into each question
			q.number = Number(i + 1);
			
			// Reference to question proxy.
			var proxy = getQuestionProxy(q.type);
			
			// Pass a reference to this QuestionMgr object to the proxy.
			proxy.setMgr(this);
			
			// Tell the proxy object to insert the markup for this question.
			var node = proxy.insertMarkup(container, q);
			
			// Store a reference to this node in the question set object so we
			// can easily minipulate it later.
			q.node = node;
		}
		
		// Initialize the qCurrent pointer object.
		qCurrent = {
			pos: 0,
			ref: qSet.questions[0]
		}
		
		// Display the first question.
		getQuestionProxy(qCurrent.ref.type).transIn(400);
	}
	
	/* ---
	 * Returns an object representing the current question. QuestionProxy
	 * objects can use this method to modify the appropriate question data.
	 */
	this.getCurrent = function()
	{
		return qCurrent.ref;
	}
	
	/* ---
	 * Returns a reference to the node that contains the markup for all of the
	 * questions in the question set.
	 */
	this.getContainer = function()
	{
		return container;
	}
	
	/* ---
	 * Allows read-only access to the 'about' field in the qSet data object.
	 */
	this.getAbout = function(field)
	{
		if(qSet.about[field] != undefined){
			return qSet.about[field];
		}
	}
	
	/* ---
	 * Removes all current markup, reverts to the original question set data
	 * and regenerates the assessment markup.
	 */
	this.reset = function()
	{
		// If the question set has a name, attempt to clear any associated
		// data that was stored in the shell.
		if(qSet.about.name){
			try{
				shellAPI.data(qSet.about.name, "", true);
			}catch(e){
				log.debug("WARNING: Unable to delete data in shell for question set '" + qSet.about.name +"'");
			}
		}
		
		// Clear current assessment HTML.
		$(container).html("");
		
		// Re-parse original data.
		that.parse(container, $().extend(true, {}, qSet_reset));
	}
	
	/* ---
	 * Allows for navigation through the question set.  Bind these to UI events to
	 * let the user navigate.
	 */
	this.forward = function()
	{
		qCurrent.pos++;
		if(qCurrent.pos < qSet.questions.length)
		{
			// NOTE: 
			// This method is usually called by the question proxy, which
			// handles events coming in from the question controls.  Because of
			// this, this.forward() is generally called when the question has
			// finished transitioning out and so there is no reason to tell
			// the current question to transition out from here.
			
			// Update our reference to the current question data object.
			qCurrent.ref = qSet.questions[qCurrent.pos];
			
			// Get a reference to the appropriate Question Proxy for the
			// current question and make a request to transition the current
			// question node in.
			var proxy = getQuestionProxy(qCurrent.ref.type);
			proxy.transIn();
			
		}
		
		// Else, we've reached the end of the question set.  Show the results.
		else
		{
			// If the question set has a name, attempt to store it so we can 
			// use it later.
			if(qSet.about.name)
			{
				try{
					shellAPI.data(qSet.about.name, qSet);
				}catch(e){
					log.debug("WARNING: Unable to save question set '"+qSet.about.name+"' to shellAPI");
				}
			}
			
			// Run the evaluator.
			evaluate();
		}
	}
	
	this.backward = function()
	{
		qCurrent.pos--;
		if(qCurrent.pos > 0)
		{
			hideQuestion(qCurrent.ref);
			qCurrent.ref = qSet.questions[qCurrent.pos];
			showQuestion(qCurrent.ref);
		}
		else
		{
			// TODO: We've reached the end!
			log.debug("TODO: We've reached the beginning of the question set!");
		}
	}
	
	/* ---
	 * Methods for (un)registering QuestionProxy objects at runtime.
	 */
	this.regProxy = function(qType, qProxy)
	{
		if(typeof(qType != "string") || typeof(qProxy) != "string"){
			log.debug("ERROR: QuestionMgr.register() only accepts strings.");
		}
		
		if(getQuestionProxy(qType) == undefined){
			qMap[qType] = qProxy;
		} else {
			log.debug("ERROR: Question type, '" + qType + "' is already mapped to " + qMap[qType]);
		}
	}
	
	this.unregProxy = function(qType)
	{
		if(getQuestionProxy(qType) != undefined) qMap[qType] = undefined;
	}
	
	// ---
	// PRIVATE METHODS
	// ---
	
	/* ---
	 * Performs a cursory check on the question set to make sure it is properly
	 * formed and contains the necessary data.
	 */
	function validate(_qSet)
	{
		if(!_qSet){
			log.debug("ERROR: Question set is not defined");
			return false;
		}
		if(!_qSet.about){
			log.debug("ERROR: Question set does not contain an 'about' property.");
			return false;
		}
		if(!_qSet.questions){
			log.debug("ERROR: Question set contains no questions!");
			return false;
		}
		if(_qSet.questions.length < 1){
			log.debug("ERROR: Question set contains no questions!");
			return false;
		}
		
		// Check questions
		for(var i = 0; i < _qSet.questions.length; i++)
		{
			var q = _qSet.questions[i];
			
			// Check type.
			if(!qMap[q.type]){
				log.debug("ERROR: Question " + i + " defines an invalid question type, '" + q.type + "'");
				return false;
			}
		}
		
		// qSet has passed all checks.  Return true.
		return true;
	}
	
	function evaluate()
	{
		// Find out which evaluator to use.
		var e = getEvaluator(qSet.about.type);
		if(!e)
		{
			log.debug("ERROR: Evaluator, '" + qSet.about.type + "' not found.");
		}
		else
		{
			e.setMgr(that);
			e.parse(container, qSet);
			e.transIn(400);
		}
	}
	
	/* ---
	 * Returns the appropriate question proxy object based on the provided
	 * question type string.
	 */
	function getQuestionProxy(qType)
	{
		var p = QuestionProxies[qMap[qType]];
		if(!p){
			log.debug("ERROR: No proxy is registered for question type, '" + qType + "'");
			return undefined;
		} else {
			return p;
		}
	}
	
	function getEvaluator(eType)
	{
		var e = Evaluators[evalMap[eType]];
		if(!e){
			log.debug("ERROR: No evaluator is registered for evaluator type, '" + eType + "'");
			return undefined;
		} else {
			return e;
		}
	}
	
	/* ---
	 * Display the current question and hide the previous question.
	 */
	function showQuestion(qData)
	{
		$(qData.node).removeClass("hidden");
	}
	
	function hideQuestion(qData)
	{
		$(qData.node).addClass("hidden");
	}
	
	/* ---
	 * Randomizes the question order prior to markup generation.
	 */
	function randomizeOrder()
	{
		// TODO
	}
	
	/* ---
	 * Expose this object for use!
	 */
	return this;
};