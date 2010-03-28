/**
  Script: mooGlider.js
  License: MIT
  Copyright: Copyright (c) 2008 Tadahiko Uehara <kikofx@gmail.com>
  URL: http://
  Dependencie(s): mootools-1.11+
  Description:
    Recreation of prototype's glider.js with mootools.
    (http://code.google.com/p/missingmethod-projects/wiki/Glider)
**/

var MooGlider = new Class({
  Implements: [Options, Events, Chain],
  options: {
    //onMoveTo: Class.empty,
    //onNext: Class.empty,
    //onPrevious: Class.empty,
    //onStop: Class.empty,
    //scrollerSelector: 'scroller',
    scrollerSelector: 'carousel',
    uiSelector: 'ui',
    slidesSelector: '.slide',
    uiJumpSelector: '.jump',
    uiNextSelector: '.next',
    uiPrevSelector: '.prev',
    initialSlide: null,
    jumpOnClass: null,
    eventTrigger: 'click',
    fxOptions: {duration: 400}
    //rightOffest: 0
  },

  /* Usage:
       window.addEvent('domready', function(){
         glider = new MooGlider('glider', {jumpOnClass:'selected'});
       });
  */
  initialize: function(wrapper, options){
    var wrapper = $(wrapper);
    console.log(wrapper);
    if(!wrapper.hasClass('hasGlider')){
      wrapper.addClass('hasGlider');
      this.ui = $(this.options.uiSelector);
      this.slides = [];
      if(this.ui){
	this.uiJump = [];
	this.uiNext = [];
	this.uiPrev = [];}
      this.setOptions(options);
      this.scroller = wrapper.getElementById(this.options.scrollerSelector);
      console.log(this.scroller);
      this.slides = wrapper.getElements(this.options.slidesSelector);

      this.currentIndex = this.options.initialSlide || 0


      if(this.ui){
        // this.uiJump = this.ui.getElements(this.options.uiJumpSelector);
	this.uiNext = this.ui.getElements(this.options.uiNextSelector);
	this.uiPrev = this.ui.getElements(this.options.uiPrevSelector);
	this.addObservers();
	if(this.uiJump && this.options.jumpOnClass){
	  this.uiJump[this.currentIndex].addClass(this.options.jumpOnClass);}
      }

      console.log(this.uiNext);
      this.createFx();
      this.scrollFx.toElement(this.slides[this.currentIndex]).chain(function(){
	this.callChain;
      }.bind(this));

    } else return false;
  },

  createFx: function(){
    console.log(this);
    if(!this.scrollFx){
      this.scrollFx = new Fx.Scroll(this.scroller, this.options.fxOptions);}

    this.scroller.setStyles({'overflow': 'hidden', 'height':'372px'});
    //, 'float': 'left'});
    $each(this.slides, function(slide){
      slide.setStyles({'overflow':'hidden'});
    }, this);
  },

  addObservers: function(){
    if(this.uiJump){
      $each(this.uiJump, function(jump){
	jump.addEvent(this.options.eventTrigger,
		      this.jumpHandler.bindWithEvent(this, jump));
      }, this);}
    if(this.uiNext){
      $each(this.uiNext, function(next){
	next.addEvent(this.options.eventTrigger, this.next.bind(this));
      }, this);}
    if(this.uiPrev){
      $each(this.uiPrev, function(prev){
	prev.addEvent(this.options.eventTrigger, this.previous.bind(this));
      }, this);}
  },

  jumpHandler: function(e, button){
    if(e.target == this.uiJump[this.currentIndex]) return;
      e = new Event(e).stop();
      this.moveTo(this.slides[this.uiJump.indexOf($(button))]);
  },

  moveTo: function(element){
    this.scrollFx.cancel();

    if(this.uiJump && this.options.jumpOnClass){
      this.uiJump[this.currentIndex].removeClass(this.options.jumpOnClass);};

    this.currentIndex = this.slides.indexOf(element);

    if(this.uiJump && this.options.jumpOnClass){
      this.uiJump[this.currentIndex].addClass(this.options.jumpOnClass);};

    console.log(this.slides);
    this.scrollFx.toElement(element);
  },

  next: function(){
    var nextIndex = this.currentIndex + 1;
    if(nextIndex >= this.slides.length) nextIndex = 0;
    this.moveTo(this.slides[nextIndex]);
  },

  previous: function(){
    var prevIndex = this.currentIndex - 1;
    if(prevIndex < 0) prevIndex = this.slides.length - 1;
    this.moveTo(this.slides[prevIndex]);
  }

});
