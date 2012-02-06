/**
    -=[ CSS Switcher jQuery plugin version 1.5 Beta ]=-
 *  
 * [What is the CSS Switcher?]:
 * 
 *      CSS Switcher plugin intended to build interactive sites with flexible design.
 *      Using this you can allow user to modify color schema's, font and layout variants.
 *      Switcher have a memory function based on local storage and can be used in multiple mode.
 *
 * [Arguments]: 
 *
 *      @group:     css properties group e.g. color, font or layout;
 *      @path:      path to advanced stylesheets (every group need a different path);
 *      @range:     number of styles from 1 to n;
 *      @controls:  ul, menu, plain, div, where plain = <span> wrapper;
 *      @debug:     1 for randomization query ( some.css?random ).
 *
 *      @grid:      enable advanced schema's for layout by screen resolution;
 *                  [auto]:     no controls & auto switch;
 *                  [handle]:   enable controls menu;      
 *
 *      @step:      allow 3 of 5 switch schema's;
 *
 *                    [mob]:  mobile      ( 480px  - 960px  );
 *                               
 *
 *                  (!)choose only one of two way:
 *                    [smin]: station     ( 1024px - 1280px );
 *                    [smax]: station     ( 1024px - 1440px );
 *
 *                  (!)choose only one of two way:
 *                    [wmin]: big screens ( 1280px - more   );
 *                    [wmax]: big screens ( 1440px - more   );
 *
 *      If you use the grid mode be sure that you css has correct names( e.g. mob.css, smax.css, wmin.css )
 *      and allocated in different directory;
 *      
 * [Grid mode API syntax example]:
 *
 *  // all schema's with handle controls( handle was helpful on debug )
 *  // maximum width variant 
 *  $('#content').cssSwitcher({
 *      grid: 'handle',
 *      step: 'mob|smax|wmax',
 *      path: '/schemas/grids/', 
 *      controls: 'ul'
 *  });
 *
 *  // 2 schema's with auto switching( handle was helpful on debug )
 *  // minimum width variant 
 *  $('#content').cssSwitcher({
 *      grid: 'auto',
 *      step: 'smin|wmin',
 *      path: '/schemas/grids/', 
 *  });
 *
 *
 * [Usage example for single mode]: 
 * 
 *  $('#content').cssSwitcher({
 *      path: '/pathToCSS/', 
 *      controls: 'ul',
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
 *  Sometimes you need to test your color schema's before connect layout. The browser will cache every CSS. 
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
 *      @license:   MIT
 *      @version:   1.5 Beta   
 * 
 **/

;(function ( $, window, document, undefined ) {

    //Create the defaults
    var pluginName = 'cssSwitcher',
        defaults = {
            controls:   'ul',               //default element style
            path:       '/schemas/base/',   //path to schema folder
            dest:       'prepend',          //prepend, append, before, after
            group:      'base',             //schema group prefix
            grid:       null,               //mode grid enables schema's by resolution
            step:       null,               //grid mode variants
            debug:      null,               //unify parameter in link.href
            range:      0                   //number of styles in schema
        };

        /* Todo: 
            - parse directory to extract styles range; 
            - method (append, prepend);
            - resize listener;
        */

    //Plugin constructor
    function Plugin( element, options ) {
        this.element = element;
        this.options = $.extend( {}, defaults, options );
        this._defaults = defaults;
        this._name = pluginName;

        //execute engine
        this.init();
    }

    Plugin.prototype.init = function () {
        
        //rebuild cfg
        pl      = this.element;
        gm      = this.options.grid;
        st      = this.options.range; 
        sp      = this.options.path;
        group   = this.options.group;
        data    = $.Storage.get( group );        
        
 
        //parse grid variants  
        if( gm !== null ) {

            group   = 'grid';            
            stp     = this.options.step;                  
            gsc     = stp.split('|');

            // prevent a bug named developer 
            // who not read the API reference
            st  = 0; 
    
            for( var gstp in gsc ) {                        
                
                data = ( this.resolution( gsc[st] ) !== null ) ? this.resolution( gsc[st] ) : data;
                $.Storage.set( group, data );
                st++;

            }
        }           
           

        //debug unifier
        unify   = ( this.options.debug === true ) ? '?' + Math.floor( Math.random( 1, 30 ) * 200 ) : '';       
                
        //controls variants
        switch( this.options.controls ) {
            default:
            case 'ul': 
                cntwrp = $('<ul>');
                itmwrp = 'li';
                break;
            
            case 'menu': 
                cntwrp = $('<menu>');
                itmwrp = 'li';
                break;
            
            case 'plain':
                cntwrp = null; 
                itmwrp = 'span';
                break;
            
            case 'div':
                cntwrp = null;
                itmwrp = 'div';
                break;
        }                
        

        // construct DOM & switchers
        this.builder( gm, gsc, data, cntwrp, itmwrp, group, unify, pl, sp, st );

        // on-ready activation
        if( data !== undefined ) this.activation( data, group );


        //switch engine
        $('li', '.switcher').click(function( e ) { 
            t = $(this).attr('data-st');
            g = $(this).attr('data-gr');
            
            //clear
            $('link[data-gr="'+ g +'"]', 'head').attr('rel','fake');
            $('li', '.switcher[data-gr="'+ g +'"]').removeClass('activ');
            
            //set
            $('link[data-st='+ t +']','head').attr('rel', 'stylesheet');
            $(this).addClass('activ');
            $.Storage.set( g, t );

            e.preventDefault();
        }); 

    };

    Plugin.prototype.resolution = function ( probe ) {

        //screen resolution detector
        resolutionGrid  = null;
        dWidth          = window.screen.width;


        //check switcher: dWidth = 500;
    
        switch( probe ) {

            //@mobile
            case 'mob':
            if ( dWidth >= 480 && dWidth <= 960 ) { 

                resolutionGrid = 'mob'; 
                                
            } break;

            //@station
            case 'smin':
            if ( dWidth >= 1024 && dWidth <= 1280 ) {

                resolutionGrid = 'smin';
                
            } break;

            case 'smax':
            if ( dWidth >= 1024 && dWidth <= 1440 ) {

                resolutionGrid = 'smax';
                
            } break;

            //@wide
            case 'wmin':
            if ( dWidth > 1280 ) {

                resolutionGrid = 'wmin';
                
            } break;

            case 'wmax':
            if ( dWidth > 1440 ) {

                resolutionGrid = 'wmax';
                
            } break;
        }

        return resolutionGrid;
        
    };

    Plugin.prototype.activation = function ( data, group ) {

        //enable active css and set activ class to control
        $('link[data-st='+ data +']', 'head').attr('rel', 'stylesheet');
        $('li[data-st='+ data +']', '.switcher[data-gr="'+ group +'"]').addClass('activ');
        
    };

    Plugin.prototype.builder = function ( gm, gsc, data, cntwrp, itmwrp, group, unify, pl, sp, st ) {

        
        //flush temp
        itms = lnks = '';
        x = 0;
      
        for( i = 1; i <= st; i++ ) {   
        
            //prepare attributes
            if( group === 'grid' ) {

                href    = sp + gsc[x] +'.css'+ unify;
                idm     = gsc[x]; 
                x++;
               
            } 
            else {

                href    = sp +'st'+ i +'.css'+ unify; 
                idm     = 'st'+ i +'_'+ group;
            }                
            
            //construct style link & controls
            lnks += '<link href="'+ href +'" rel="fake" media="screen" data-st="'+ idm +'" data-gr="'+ group +'" />';
            itms += '<'+ itmwrp +' id="'+ idm +'" data-gr="'+ group +'" data-st="'+ idm +'"'+'>'+'['+ i +']'+'</'+ itmwrp +'>';

        }

        //build links
        $('head').append(lnks);


        if( cntwrp === null ) { // independent block
            cntwrp = $('<div style="display: inline" id="inline_merge_'+ group +'"></div>');
        }

        //check for grid and control style
        if( gm !== 'auto' ) {

            $(pl).append( cntwrp );
            cntwrp.attr({ 'class': 'switcher', 'data-gr': group }).html( itms );
        
        }    

        //memory leaks prevent
        cntwrp = null;
        itms   = null;
        lnks   = null;        

    }

    // Plugin logic wrapper
    $.fn[pluginName] = function ( options ) {
        return this.each(function () {
            if (!$.data(this, 'plugin_' + pluginName)) {
                $.data(this, 'plugin_' + pluginName,
                new Plugin( this, options ));
            }
        });
    }

})( jQuery, window, document );

