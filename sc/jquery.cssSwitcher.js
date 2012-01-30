/**
    -=[ CSS Switcher jQuery plugin version 1.0 Beta ]=-
 *  
 * [What is the CSS Switcher?]:
 * 
 *      CSS Switcher plugin intended to build interactive sites with flexible design.
 *      Using this you can allow user to modify color schemas, font and layout variants.
 *      Switcher have a memory function based on local storage and can be used in multiple mode.
 *
 * [Arguments]: 
 *
 *      @group:     css properties group e.g. color, font or layout;
 *      @path:      path to advanced stylesheets (every group need a different path);
 *      @range:     number of styles from 1 to n;
 *      @debug:     1 for randomization query ( some.css?random ).
 *
 * [Usage example for single mode]: 
 * 
 *  $('#content').cssSwitcher({
 *      path: '/pathToCSS/', 
 *      range: 3
 *  });
 *
 *
 * [Usage example for multiply mode]: 
 *
 *  $('#content').cssSwitcher({
 *      group: 'fonts',   
 *      path: '/pathToCSS/',
 *      range: 3,
 *  });
 *
 * [Usage example in debug mode]:
 *  
 *  Sometimes you need to test your color schemas before connect layout. The browser will chache every CSS. 
 *  To prevent this effect use @debug argument in plugin call & every stylesheet
 *  will have a random query in link href.  
 *
 *  $('#content').cssSwitcher({
 *      group: 'fonts',   
 *      path: '/pathToCSS/',
 *      range: 3,
 *      debug: 1    //call with debug
 *  });
 *
 * [About this]:
 *
 *      @autor:     FroZen Code: www.Shift-Web.ru
 *      @license:   CC-BY-SA 3.0
 *      @version:   1.0 beta   
 * 
 **/

;(function($){

  var methods = {
    engine: function( options ) {

        //self configuration & check correction
        var pl      = this;
        var sp      = options.path;
        var st      = ( isNaN( options.range ) ) ? 0 : options.range;
        var group   = ( options.group !== undefined ) ? 'usr_style_' + options.group : 'usr_style';     
        var data    = $.Storage.get( group );

        //debug mode
        var unify   = ( options.debug == 1 ) ? '?' + Math.floor( Math.random( 1, 30 ) * 200 ) : '';

        //default states
        var items   = links = '';
        var menu    = $('<menu class="switcher" data-gr="'+ group +'"></menu>');

        //construct switch menu & links
        for( i = 1; i <= st; i++ ) {
            var marker   = 'id="st'+ i +'_'+ group + '" data-gr="'+ group +'" data-st="st'+ i + '_'+ group +'"',
                items    = items + '<li '+ marker +'>['+ i +']</li>',
                links    = links + '<link '+ marker +' rel="fake" media="screen" href="'+ sp +'st'+ i +'.css'+ unify +'">'; 
        }

        $('head').append(links);
        $(pl).prepend(menu);
        menu.html(items);

        //check for choice & activate
        if( data !== undefined ) {
            $('link[data-st='+ data +']', 'head').attr('rel', 'stylesheet');
            $('li[data-st='+ data +']', '.switcher[data-gr="'+ group +'"]').addClass('activ');
        }

        //switch engine
        $('li', '.switcher').click(function() { 
        var t = $(this).attr('data-st'),
            g = $(this).attr('data-gr');
            
            //clear
            $('link[data-gr="'+ g +'"]', 'head').attr('rel','fake');
            $('li', '.switcher[data-gr="'+ g +'"]').removeClass('activ');
            
            //set
            $('link[data-st='+ t +']','head').attr('rel', 'stylesheet');
            $(this).addClass('activ');
            $.Storage.set( g, t );
        });     

    },
  };

  $.fn.cssSwitcher = function() {
    if( typeof arguments === 'object' ) {
      return methods.engine.apply( this, arguments );
    } 
    else {
      $.error( 'CSS Switcher: Missing configuration of $.fn.cssSwitcher' );
    }  
  };

})(jQuery);
