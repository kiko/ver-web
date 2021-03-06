/**
 * jCarouselLite - jQuery plugin to navigate images/any content in a carousel style widget.
 * Version: 1.0.1
 */

// Compliant with jquery.noConflict()
(function($) {
  var Carousel =
    function(element, options) {
      element = $(element);
      var obj = this;

      var settings = $.extend({
        btnPrev: null,
        btnNext: null,
        btnGo: null,
        mouseWheel: false,
        auto: null,

        speed: 200,
        easing: null,

        vertical: false,
        circular: true,
        visible: 3,
        start: 0,
        scroll: 1,

        beforeStart: null,
        afterEnd: null
      }, options || {});

      this.publicMethod = function(){
        console.log('public method called!');
      };
      var privateMethod = function(){
        console.log('private method called.');
      };
      var initialize = function(){
        var running = false,
            animCss = o.vertical?"top":"left",
            sizeCss = o.vertical?"height":"width";
        var div = $(this),
            ul  = $("ul", div),
            tLi = $("li", ul),
            tl  = tLi.size(),
            v   = o.visible;

        if(o.circular){
          ul.prepend(tLi.slice(tl-v-1+1).clone())
          .append(tLi.slice(0,v).clone());
          o.start += v;
        }

        var li         = $("li", ul),
            itemLength = li.size(),
            curr       = o.start;
        div.css("visibility", "visible");

        li.css({overflow: "hidden",
                float: o.vertical ? "none" : "left"});
        ul.css({margin: "0",
                padding: "0",
                position: "relative", "list-style-type": "none", "z-index": "1"});
        div.css({overflow: "hidden",
                position: "relative", "z-index": "2",
                left: "0px"});

        // Full li size(incl margin)-Used for animation
        var liSize  = o.vertical ? height(li) : width(li);
        // size of full ul(total length, not just for the visible items)
        var ulSize  = liSize * itemLength;
        // size of entire div(total length for just the visible items)
        var divSize = liSize * v;

        //li.css({width: li.width(),
        //        height: li.height()});
        ul.css(sizeCss, ulSize + "px").css(animCss, - (curr*liSize));

        // Width of the DIV. length of visible images
        div.css(sizeCss, divSize + "px");

// observers
        if(o.btnPrev)
          $(o.btnPrev).click(function(){
            return go(curr - o.scroll);
          });

        if(o.btnNext)
          $(o.btnNext).click(function(){
            return go(curr + o.scroll);
          });

        if(o.btnGo)
          $.each(o.btnGo, function(i, val) {
            $(val).click(function(){
              return go(o.circular ? o.visible + i : i);
            });
        });

        // if(o.mouseWheel && div.mousewheel)
        //   div.mousewheel(function(e, d){
        //     return d > 0 ? go(curr-o.scroll) : go(curr + o.scroll);
        // });

        if(o.auto)
          setInterval(function(){
            go(curr + o.scroll);
          }, o.auto + o.speed);
      };
      var vis = function(){
        return li.slice(curr).slice(0,v);
      };
      var go = function(to){
        if(!running) {

          if(o.beforeStart)
            o.beforeStart.call(this, vis());
          // If circular we are in first or last, then goto the other end
          if(o.circular){
            // If first, then goto last
            if(to <= o.start - v - 1) {
              ul.css(animCss, -((itemLength - (v * 2)) * liSize) + "px");
              // If "scroll" > 1, then the "to" might not be equal to the condition;
              // it can be lesser depending on the number of elements.
              curr = to == o.start - v - 1 ? itemLength - (v * 2) - 1 : itemLength - (v * 2) - o.scroll;
              // If last, then goto first
            } else if(to >= itemLength - v + 1) {
              ul.css(animCss, -( (v) * liSize ) + "px" );
              // If "scroll" > 1, then the "to" might not be equal to the condition;
              //it can be greater depending on the number of elements.
              curr = to == itemLength - v + 1 ? v + 1 : v + o.scroll;
            } else curr = to;
              // If non-circular and to points to first or last, we just return.
            } else {
              if(to < 0 || to > itemLength - v) return;
                // If neither overrides it, the curr will still be "to" and we can proceed.
                else curr = to;
              }

              running = true;

              ul.animate(
                animCss == "left" ? { left: -(curr * liSize) } : { top: -(curr * liSize) } , o.speed, o.easing,
                function() {
                  if(o.afterEnd)
                    o.afterEnd.call(this, vis());
                    running = false;
                  }
                );
              // Disable buttons when the carousel reaches the last/first,
              // and enable when not
              if(!o.circular) {
                $(o.btnPrev + "," + o.btnNext).removeClass("disabled");
                $((curr - o.scroll < 0 && o.btnPrev) || (curr + o.scroll > itemLength - v && o.btnNext) || []
                 ).addClass("disabled");
                }
            }
          return false;
        };
      };
      var css = function(el, prop) {
        return parseInt($.css(el[0], prop)) || 0;
      };
      var width = function(el){
        return  el[0].offsetWidth + css(el, 'marginLeft') + css(el, 'marginRight');
      };
      var height = function(el){
        return el[0].offsetHeight + css(el, 'marginTop') + css(el, 'marginBottom');
      };
    };

    $.fn.carousel = function(options){
      // Returns the element collection. Chainable.
      return this.each(function(){
        var element = $(this);
        if (element.data('carousel')) return;
        var carousel = new Carousel(this, options);
        element.data('carousel', carousel);
      });
    };
})(JQuery);
