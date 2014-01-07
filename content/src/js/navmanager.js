/* Helper to bind functions to a given scope.
 * Thanks, PrototypeJS!
 * http://prototypejs.org/
 */
Function.prototype.bind = function(scope) {
	var _function = this;
	return function() {
		return _function.apply(scope, arguments);
	}
};

/* Simple JavaScript Inheritance
 * By John Resig http://ejohn.org/
 * MIT Licensed.
 */
// Inspired by base2 and Prototype
(function() {
var initializing = false, fnTest = /xyz/.test(function(){xyz;}) ? /\b_super\b/ : /.*/;
// The base Class implementation (does nothing)
this.Class = function(){};

// Create a new Class that inherits from this class
Class.extend = function(prop) {
	var _super = this.prototype;

	// Instantiate a base class (but only create the instance,
	// don't run the init constructor)
	initializing = true;
	var prototype = new this();
	initializing = false;

	// Copy the properties over onto the new prototype
	for (var name in prop) {
		// Check if we're overwriting an existing function
		prototype[name] = typeof prop[name] == "function" && 
		typeof _super[name] == "function" && fnTest.test(prop[name]) ?
		(function(name, fn){
			return function() {
				var tmp = this._super;

				// Add a new ._super() method that is the same method
				// but on the super-class
				this._super = _super[name];

				// The method only need to be bound temporarily, so we
				// remove it when we're done executing
				var ret = fn.apply(this, arguments);        
				this._super = tmp;

				return ret;
			};
		})(name, prop[name]) :
		prop[name];
	}

	// The dummy class constructor
	function Class() {
	  // All construction is actually done in the init method
	  if ( !initializing && this.init )
		this.init.apply(this, arguments);
	}

	// Populate our constructed prototype object
	Class.prototype = prototype;

	// Enforce the constructor to be what we expect
	Class.prototype.constructor = Class;

	// And make this class extendable
	Class.extend = arguments.callee;

	return Class;
	};
})();

/**
 * Nav Manager Object
 */
NavManager = Class.extend({
	
	// List of states that we'll be managing.
	states: {},
	
	// Reference to the current state.
	current: null,
	// Name of the current state.
	currentName: null,
	
	// Duration of transitions (in ms).
	duration: 500,
	
	// Add a state to manager.
	add: function(name, uiState) {
		if(this.states[name]) {
			throw Error("State with name '" + name + "' already exists.");
		} else {
			// Set reference to this manager.
			uiState.mgr = this;
			// Add to our list of states.
			this.states[name] = uiState;
			// Added states are disabled by default.
			uiState.disable();
			// Added states are invisible by default.
			uiState.transOut(0, null);
		}
		
	},
	
	// Return the named state object (if it exists).
	getState: function(name) {
		// Make sure the state exists.
		if(this.states[name] === undefined) {
			throw Error("No state with the name '" + name + "' exists.");
		}
		return this.states[name];
	},
	
	/**
	 * Sets the active NavState and disables the previous one.
	 *
	 * @param name (String) The name of the NavState to switch to.
	 * @param copyState (Boolean) Copy enabled/disabled state of previous the previous state to the new state, assuming that the two states share commonly named elements in their "button" arrays.  Default is "true".
	 * @return Void
	 */
	set: function(name, copyState) {
		// Make sure the state exists.
		if(this.states[name] === undefined) {
			throw Error("No state with the name '" + name + "' exists.");
		}
		
		// Copy element status to new state?
		if(copyState === undefined) {
			copyState = true;
		}
		
		var oldState = this.current;
		// Update the currentName property so we can switch states from
		// the transOutCallback() method (see below).
		this.currentName = name;
		this.current = this.states[name];
		
		// If we need to copy state, build a map of elements to enable.
		var disabledEls = false;
		if(copyState && oldState) {
			disabledEls = [];
			for (var i in oldState.buttons) {
				// Only copy states when:
				// - The element is marked as disabled.
				//   AND
				// - both states share a commonly named element.
				if(oldState.buttons[i].status == "disabled"
				&& this.current.buttons[i] !== undefined) {
					disabledEls.push(i);
				}
			}
		}
		
		// Transition the old state out.
		if(oldState) {
			oldState.disable();
			
			// Create a temp. pointer to "this" so we can pass arguments to our
			// callback function.
			var _this = this;
			
			// Do transition.
			oldState.transOut(this.duration, function() {
				_this.transOutCallback(disabledEls);
			});
		} 
		else {
			this.transOutCallback(disabledEls);
		}	
	},
	
	// ---
	// Cached, scope-bound versions of the transIn/Out callback functions.
	
	// Called when old state is transitioned out.
	transOutCallback: function(disabledEls) {
		// Enable the new state here instead of in transInCallback
		// since it seems to avoid a problem where the fadeIn()
		// animation skips at the end.
		this.current.enable();
		
		// If we need to copy states over...
		if(disabledEls) {
			for (var a=0; a<disabledEls.length; a++) {
				this.current.disable(disabledEls[a]);
			}
		}
		
		// Allow the state to do any last-minute activation stuff before we
		// display it.
		this.current.onActive();
		
		// Display the new state.
		this.current.transIn(this.duration, this.transInCallback);
	},
	
	// Called when the new state is transitioned in.
	transInCallback: function() {
		// Allow the state to do any last-minute activation stuff.
		// this.current.onActive();
	},
	//
	// ---
	
	init: function() {
		// Bind and cache callbacks for state transIn/Out callbacks.
		this.transInCallback = this.transInCallback.bind(this);
		this.transOutCallback = this.transOutCallback.bind(this);
	}
});

/**
 * Based UIState object.
 */
NavState = Class.extend({
	
	// ---
	// UI elements managed by this NavState.
	// Should be overridden by "sub-classes".
	// Shown here for documentation only.
	// ---
	/*
	buttons: {
		"btn-next": {
			el: null,
			func: function(e) {
				// Go to next slide.
			}
		},
		"btn-previous": {
			el: null,
			func: function(e) {
				// Go to previous slide.
			}
		},
		"btn-replay": {
			el: null,
			func: function(e) {
				// Replay current slide.
			}
		},
		"btn-menu": {
			el: null,
			func: function(e) {
				// Show menu screen.
			}
		},
		"btn-help": {
			el: null,
			func: function(e) {
				// Show help screen.
			}
		}
	},
	*/
	
	// A function that splits up the x/y background position values so they can
	// be applied separately. We have to do this since certain browsers don't
	// support the background-position-x/y properties.
	getBackgroundPos: function(el) {
		var arr, pos;
		try {
			arr = $(el).css("background-position").split(" ");
		} catch(e) {
			// NOTE: Using 50% as the X value here is somewhat arbitrary.
			// It's specifically for the initial build-out of the BI NxGn
			// shell and so it may not apply to future courses, particularly
			// if the sprite sheets that are used are set up differently.
			arr = ["50%", "0"];
		}
		pos = {
			"x": arr[0],
			"y": arr[1]
		}
		return pos;
	},
	
	// Shared event handlers.
	mouseover: function(e) {
		//console.og("orig over!");
		// EMPTY.
	},
	mouseleave: function() {
		//console.og("orig leave");
		// EMPTY.
	},
	
	// A function to be called by the state manager after a state has been 
	// activated and the element states have been (optiontally) copied from the
	// previous NavState object but BEFORE the transIn() method is called.
	onActive: function() {
		// Empty here.  Should be extended.
	},
	
	// A reference to the UI manager object.  Should be set by the manager when
	// the UI state is added to the manager.
	mgr: null,
	
	// A reference to the element that houses the UI markup.
	container: null,
	
	// A reference to the scope that we'll look in for any external function
	// calls.  Generally, this is the "parent" scope of this object.
	scope: null,
	
	transIn: function(duration, callback) {
		// Transition the UI state out.
		// Then, call the callback.
		var me = this;
		
		if(callback===null || callback===undefined) {
			this.container.fadeIn(0);
		} else {
			this.container.fadeIn(duration, callback);
		}
	},
	
	transOut: function(duration, callback) {
		// Transition the UI state out.
		// Then, call the callback.
		var me = this;
		if(callback===null || callback===undefined) {
			this.container.fadeOut(0);
		} else {
			this.container.fadeOut(duration, callback);
		}
	},
	
	enable: function(name) {
		// console.log("enable");
		
		var el, func, mouseOverFunc, mouseLeaveFunc;
		if(name) {
			// (Re)bind.
			// Use a try...catch block so the shell can continue happily even if
			// a given element doesn't have a handler associated with it.
			// try {
				el = this.buttons[name].el;
				func = this.buttons[name].func;
				mouseOverFunc = this.buttons[name].mouseover;
				mouseLeaveFunc = this.buttons[name].mouseleave;
				
				el.unbind("click").click(func);
				el.unbind("mouseover").mouseover(mouseOverFunc);
				el.unbind("mouseleave").mouseleave(mouseLeaveFunc);
				el.removeClass("shell-btn-disabled");
			// } catch (e) {
				// throw new Error("Nav element " + name + " doesn't have all of the handlers that it needs...");
			// }
			
			el.removeClass("shell-btn-rollover");
			el.removeClass("shell-btn-disabled");
			
			// Make an internal note that this is enabled.
			this.buttons[name].status = "enabled";
		}
		else {
			for(var btn in this.buttons) {
				// (Re)bind.
				// Use a try...catch block so the shell can continue happily even if
				// a given element doesn't have a handler associated with it.
				// try {
					el = this.buttons[btn].el;
					func = this.buttons[btn].func;
					mouseoverFunc = this.buttons[btn].mouseover;
					mouseleaveFunc = this.buttons[btn].mouseleave;
					
					// (Re)bind.
					el.unbind("click").click(func);
					el.unbind("mouseover").mouseover(mouseoverFunc);
					el.unbind("mouseleave").mouseleave(mouseleaveFunc);
				// } catch (e) {
					// EMPTY.
				// }
				el.removeClass("shell-btn-rollover");
				el.removeClass("shell-btn-disabled");
				
				// Make an internal note that this is enabled.
				this.buttons[btn].status = "enabled";
			}
		}
	},
	
	disable: function(name) {
		// console.log("disable");
		
		var el;
		if(name) {
			// (Re)bind.
			// Use a try...catch block so the shell can continue happily even if
			// a given element doesn't have a handler associated with it.
			try {
				el = this.buttons[name].el;
				el.unbind("click");
				el.unbind("mouseover");
				el.unbind("mouseleave");
			} catch (e) {
				// EMPTY.
			}
			el.removeClass("shell-btn-rollover");
			el.addClass("shell-btn-disabled");
			
			// Make an internal note that this is disabled.
			this.buttons[name].status = "disabled";
		}
		else {
			for(var btn in this.buttons) {
				// (Re)bind.
				// Use a try...catch block so the shell can continue happily even if
				// a given element doesn't have a handler associated with it.
				try {
					el = this.buttons[btn].el;
					el.unbind("click");
					el.unbind("mouseover");
					el.unbind("mouseleave");
				} catch (e) {
					// EMPTY.
				}
				el.removeClass("shell-btn-rollover");
				el.addClass("shell-btn-disabled");
				
				// Make an internal note that this is disabled.
				this.buttons[btn].status = "disabled";
			}
		}
	},
	
	init: function(containerName, scope) {
		// Ensure that the container is wrapped in a jQuery object so we can
		// use jQuery methods on it.
		this.container = $("#" + containerName);
		if(!this.container) {
			throw Error("Container element couldn't be found.");
		}
		
		// Set scope.
		this.scope = scope;
		
		for(var btn in this.buttons) {
			var cur = this.buttons[btn];
			
			// Get references to buttons and store them.
			cur.el = $("." + btn, this.container);
			
			// Bind functions to scope.
			cur.func = cur.func.bind(this);
			
			var mo = cur.mouseover ? cur.mouseover : this.mouseover;
			var ml = cur.mouseleave ? cur.mouseleave : this.mouseleave;
			cur.mouseover = mo.bind(this);
			cur.mouseleave = ml.bind(this);
		}
	}
});

DefaultNavState = NavState.extend({
	
	// Shared mouseover/mouseleave handlers.
	mouseover: function(e) {
		$(e.target).addClass("shell-btn-rollover");
	},
	mouseleave: function(e) {
		$(e.target).removeClass("shell-btn-rollover");
	},

	// UI elements managed by this NavState.
	buttons: {
		"btn-next": {
			el: null,
			func: function(e) {
				this.scope.gotoNextSlide();
			}
		},
		"btn-previous": {
			el: null,
			func: function(e) {
				this.scope.gotoPreviousSlide();
			}
		},
		"btn-replay": {
			el: null,
			func: function(e) {
				this.scope.audio.replay();
			}
		},
		"btn-menu": {
			el: null,
			func: function(e) {
				this.scope.menu.open();
			}
		},
		"btn-help": {
			el: null,
			func: function(e) {
				this.scope.help.open();
			}
		},
		"btn-subtitle-toggle": {
			el: null,
			func: function(e) {
				this.createLangSelection(0, 0, this.container);
			}
		}
	},
	
	// Keep track of whether or not the language selection pop-up is visible.
	isLangOpen: false,
	
	/**
	 * Create a dropdown/up list of languages so the user can select their
	 * language.  Called by the subtitle toggle button.
	 */
	createLangSelection: function(x, y, parent) {
		//console.og("Creating language selection.");
		
		// A reference to "this" so our internal functions can access this scope.
		// See the bottom of this function for their definitions.
		var me = this;
		
		// If the pop-up is open already, don't open it again.
		if(this.isLangOpen == true) {
			return;
		} else {
			this.isLangOpen = true;
		}
		
		// Get a list of supported languages from the shell.
		var langs = this.scope.subtitleData.settings.languages;
		
		// Create an overlay so we can catch clicks that occur outside of the
		// language selection.
		var overlay = $("<div id='lang-overlay'></div>").appendTo(parent);
		overlay.click(function(e) {
			removeLangSelection();
		});
		
		// Create a container element to house our language selection items.
		var langContainer = $("<div id='lang-select-container'></div>").appendTo(parent);
		
		
		// Create background graphic elements.
		var bgTop = $("<div id='lang-select-bg-top'></div>").appendTo(langContainer);
		var bgMid = $("<div id='lang-select-bg-middle'></div>").appendTo(langContainer);
		var bgBtm = $("<div id='lang-select-bg-bottom'></div>").appendTo(langContainer);
		
		var btnContainer = $("<div id='lang-select-btn-container'></div>").appendTo(langContainer);
		
		// Loop through the lang list...
		for(var i in langs) {
			// Create DIVs
			var markup = "<div>" + langs[i] + "</div>";
			var el = $(markup).appendTo(btnContainer);
			// Store data with our button.
			el.data("lang", i);
			// Style 'em. (See course.css for style definitions).
			el.addClass("btn-subtitle-lang-select");
			// Assign button handers.
			// TODO: Is there a way to cache this click handler?
			el.click(function() {
				handleLangBtn.apply(this);
			});
		}
		// End Loop.
		
		// Remove bottom border from last language button.
		$(".btn-subtitle-lang-select:last-child")
		.css({
			"border": "none"
		});
		
		// Move the language selection container into place.
		var subtitleBtnPos = this.buttons["btn-subtitle-toggle"].el.position();
		var padding = 20;
		var newPos = {
			x: subtitleBtnPos.left - 75,
			y: subtitleBtnPos.top - btnContainer.outerHeight() - padding
		}
		langContainer.css({
			"top": newPos.y,
			"left": newPos.x
		});
		
		// This seems to fix an issue on the iPad2 (others not tested)
		// where the language selection items don't appear until the screen is
		// updated by the user by tapping another button, etc.
		langContainer.hide();
		langContainer.fadeIn(0);
		
		// Adjust background size.
		bgMid.css({
			height: btnContainer.outerHeight() - bgTop.outerHeight()
		});
		bgBtm.css({
			"top": bgTop.outerHeight() + bgMid.outerHeight()
		});
		
		// A click handler for language selection buttons.
		function handleLangBtn(e) {
			// Update the subtitle nav state.
			var lang = $(this).data("lang");
			var subState = me.mgr.getState("subtitles");
			subState.setLanguage(lang);
			/*
			 * This will update the current subtitle text when the language
			 * selection is changed by a user.  This fixes an issue where the 
			 * default subtitle text doesn't change when:
			 *   - The current slide has no audio.
			 *   - The user changes their language selection on the current 
			 *     slide from a previously selected language to a new one.
			 */
			subState.goToSubtitle(subState.subtitleIndex);
			
			// Close the dropdown.
			removeLangSelection();
			// Tell the nav manager to change states.
			me.mgr.set("subtitles");
		}
		
		// A click handler for when the user clicks outside of the language
		// selection buttons.
		function handleClickOff(e) {
			// TODO
		}
		
		function removeLangSelection() {
			me.isLangOpen = false;
			overlay.remove();
			langContainer.remove();
		}
	}
});

SubtitleNavState = NavState.extend({
	// Shared mouseover/mouseleave handlers.
	mouseover: function(e) {
		$(e.target).addClass("shell-btn-rollover");
	},
	mouseleave: function(e) {
		$(e.target).removeClass("shell-btn-rollover");
	},

	// UI elements managed by this NavState.
	buttons: {
		"btn-next": {
			el: null,
			func: function(e) {
				this.scope.gotoNextSlide();
			}
		},
		"btn-previous": {
			el: null,
			func: function(e) {
				this.scope.gotoPreviousSlide();
			}
		},
		"btn-replay": {
			el: null,
			func: function(e) {
				this.scope.audio.replay();
			}
		},
		"btn-menu": {
			el: null,
			func: function(e) {
				this.scope.menu.open();
			}
		},
		"btn-help": {
			el: null,
			func: function(e) {
				this.scope.help.open();
			}
		},
		"btn-subtitle-toggle": {
			el: null,
			func: function(e) {
				this.mgr.set("default");
			}
		},
		"btn-subtitle-previous": {
			el: null,
			func: function(e) {
				this.previousSubtitle();
			}
		},
		"btn-subtitle-next": {
			el: null,
			func: function(e) {
				this.nextSubtitle();
			}
		},
		
		// TODO: Does this need to be here?  It's not a button.
		"txt-subtitle-enumerator": {
			el: null,
			func: function(e) {
				// TODO
			}
		},
		
		// TODO: Does this need to be here?  It's not a button.
		"txt-subtitle-current": {
			el: null,
			func: function(e) {
				// TODO
			}
		}
	},
	
	// A reference to the subtitle data (from subtitleData.js).
	// TODO: Use this instead of the global subtitleData object.
	subtitleData: null,
	
	// Default verbiage for slides that don't contain subtitles.  Pulled from
	// subtitleData.
	defaultSubtitle: null,
	
	// A string the represents the user's current location in the course.
	// Will be used to determine which subtitles should be shown.
	location: null,
	
	// An array containing strings that represent the subtitles to display.
	subtitles: null,
	
	// Index of current subtitle.
	subtitleIndex: null,
	
	// Language to display the subtitles in.
	lang: null,
	
	/**
	 * Allows the shell to tell this NavState whether or not the current audio
	 * has finished playing or not.  This information will be used to enable or
	 * disable the next/previous subtitle buttons when the user changes state 
	 * during or after audio playback.
	 */
	audioHasPlayed: false,
	setAudioStatus: function(flag) {
		if(flag === undefined) {
			this.audioHasPlayed = !audioHasPlayed;
		} else {
			this.audioHasPlayed = flag;
		}
	},
	
	/**
	 * Set the location of the course to pull the subtitles from.
	 * @param loc A string representing the user's current location in the course.
	 * @return Void
	 */
	setLocation: function(loc) {
		// console.log("setLocation");
		
		this.location = loc;
		this.subtitleIndex = 0;
		// Drill down in the subtitleData structure to the "cues" and store a reference
		// so we can get to it easily later.
		try {
			this.subtitles = subtitleData["subtitles"][this.location]["cues"];
		} catch(e) {
			this.subtitles = null;
		}
		// Disable the next/previous buttons by default since the animation 
		// engine will be responsible for advancing the subtitles while the 
		// audio is playing.
		this.disable("btn-subtitle-next");
		this.disable("btn-subtitle-previous");
		
		// Display the first subtitle for this slide (if there is one).
		this.goToSubtitle(0);
	},
	
	/**
	 * Set the language to display in subtitles.
	 * @param lang String representing the languages abbreviated title (ex. "en" for English).
	 * @return Void
	 */
	setLanguage: function(lang) {
		// console.log("setLanguage");
		
		this.lang = lang;
	},
	// You'll never guess what this function does.
	getLanguage: function() {
		// console.log("getLanguage");
		
		return this.lang;
	},
	
	/**
	 * Display the next subtitle in the queue.
	 * @return Void
	 */
	nextSubtitle: function() {
		// console.log("nextSubtitle");
		
		if(this.subtitleIndex < this.subtitles.length - 1) {
			this.subtitleIndex++;
			// TODO: Display the next subtitle.
			this.goToSubtitle(this.subtitleIndex);
		} else {
			// Disable the next button.
			// TODO: Find a way to re-enable the button without adding a bunch of extra click() handlers in cases where the button is already enabled.
			// this.disable("btn-subtitle-next");
		}
	},
	
	/**
	 * Display the previous subtitle in the queue.
	 * @return Void
	 */
	previousSubtitle: function() {
		// console.log("previousSubtitle");
		
		if(this.subtitleIndex > 0) {
			this.subtitleIndex--;
			// TODO: Display the next subtitle.
			this.goToSubtitle(this.subtitleIndex);
		} else {
			// Disable the previous button.
			// TODO: Find a way to re-enable the button without adding a bunch of extra click() handlers in cases where the button is already enabled.
			// this.disable("btn-subtitle-previous");
		}
	},
	
	/**
	 * Go to the specified subtitle in the queue.
	 * @param n The index to go to.
	 * @return Void
	 */
	goToSubtitle: function(n) {
		// console.log("goToSubtitle called... n=", n);
		
		try {
			// Update the internal index.
			this.subtitleIndex = n;
			
			// Display the subtitle in the DOM.
			// Note: We use valueOf() here to ensure that this block will throw
			// an error if no such subtitle is found, thus triggering the catch
			// block.  Neat, eh?
			var currentSub = this.subtitles[this.subtitleIndex]["text"][this.lang].valueOf();
			this.buttons["txt-subtitle-current"].el.html(currentSub);
		} 
		
		// No such subtitle was found.  Display default verbiage.
		catch(e) {
			try {
				// Note: We use valueOf() here to ensure that this block will throw
				// an error if no such subtitle is found, thus triggering the catch
				// block.  Neat, eh?
				var defaultSub = this.defaultSubtitle[this.lang].valueOf();
			} 
			catch (e) {
				throw new Error("No default subtitle has been provided for " + this.lang);
			}
			// Set subtitle to default text.
			this.buttons["txt-subtitle-current"].el.html(defaultSub);
		}
		
		// Update the enumerator display.
		this.updateEnum();
	},
	
	/**
	 * Update the textual display that shows how many subtitles are available
	 * for the current slide.
	 * @return Void
	 */
	updateEnum: function() {
		// console.log("updateEnum");
	
		if(this.subtitles != null && this.subtitles.length > 0) {
			var text = Number(this.subtitleIndex + 1) + "/" + this.subtitles.length;
			this.buttons["txt-subtitle-enumerator"].el.show();
			this.buttons["txt-subtitle-enumerator"].el.html(text);
		} 
		// If no subtitles are available, show "0/0".
		else {		
			this.buttons["txt-subtitle-enumerator"].el.html("0/0");
		}
	},
	
	/**
	 * Displays the next/previous buttons for navigating through the subtitles
	 * for the current slide.  They are hidden by default but this function can
	 * be called from the animation engine when the audio is done playing.
	 * @return Void
	 */
	showSubtitleNav: function() {
		// console.log("showSubtitleNav");
		
		if(this.hasSubtitle(this.subtitleIndex)) {
			this.enable("btn-subtitle-next");
			this.enable("btn-subtitle-previous");
		} else {
			this.disable("btn-subtitle-next");
			this.disable("btn-subtitle-previous");
		}
	},
	
	hasSubtitle: function(n) {
		try {
			// Display the subtitle in the DOM.
			// Note: We use valueOf() here to ensure that this block will throw
			// an error if no such subtitle is found, thus triggering the catch
			// block.  Neat, eh?
			var currentSub = this.subtitles[this.subtitleIndex]["text"][this.lang].valueOf();
			
			// We made it this far so the subtitle must exist!
			return true;
		} 
		catch (e) {
			return false;
		}
	},
	
	// Called by NavManager when this state is activated.
	onActive: function() {
		// console.log("onActive called...");
		// console.log("subtitleIndex = ", this.subtitleIndex);
		
		// Enable the subtitle buttons if:
		//     - The audio for the current slide has finished playing.
		//         * AND *
		//     - The current slide has subtitles provided.
		if(this.audioHasPlayed && this.hasSubtitle(this.subtitleIndex)) {
			this.enable("btn-subtitle-next");
			this.enable("btn-subtitle-previous");
		} 
		
		// ... Otherwise, disable the subtitle nav buttons.
		else {	
			// Disable next/previous subtitle buttons by default.
			// They'll be enabled later via showSubtitleNav() if necessary.
			this.disable("btn-subtitle-next");
			this.disable("btn-subtitle-previous");
		}
	},
	
	init: function(container, scope) {
		//console.og("init");
		
		// Get and store default text for slides that don't have subtitles.
		this.defaultSubtitle = subtitleData.settings.defaultText;
		
		// Set default language.
		this.lang = "en";
		
		// Do initialization in "super class".
		this._super(container, scope);
	}
});