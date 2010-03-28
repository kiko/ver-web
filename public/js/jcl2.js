/**
 * jCarouselLite - jQuery plugin to navigate images/any content in a carousel style widget.
 * Version: 1.0.1
 */

(function($) {
$.fn.jcl = function(o) {
    o = $.extend({
    }, o || {});

    return this.each(function() {

      function go(to) {
        if(!running) {
          if(o.beforestart)
            o.beforestart.call(this, vis());
          if(o.circular) {
            if(to <= o.start - v - 1) {
              ul.css(animcss, -((itemlength - (v * 2)) * lisize) + "px");
              curr = to == o.start - v - 1 ? itemlength - (v * 2) - 1 : itemlength - (v * 2) - o.scroll;
            } else if(to >= itemlength - v + 1) {
              ul.css(animcss, -( (v) * lisize ) + "px" );
              curr = to == itemlength - v + 1 ? v + 1 : v + o.scroll;
            } else curr = to;
          } else {
            if(to < 0 || to > itemlength - v) return;
            else curr = to;
          }

          running = true;

          ul.animate(
            animcss == "left" ? { left: -(curr * lisize) } : { top: -(curr * lisize) } , o.speed, o.easing
          );
        }
        return false;
      };
    });
  };

})(jQuery);
