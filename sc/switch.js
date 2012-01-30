/**
	-=[ jQuery Style Switcher ]=-
 *  
 * [What is the Style Switcher?]:
 * 
 *      Simple script intended to build interactive sites with flexible design.
 *      Using this you can allow user to modify color schemas, font and layout variants.
 *      Switcher have a memory function based on local storage and can be used in multiple mode.
 *
 * [Arguments]:	
 *
 *      @place: 	element selector to apply menu ( e.g. $('body'), $('#head'), $('.here') );
 *      @group:     style properties group e.g. color, font or layout;
 *      @skinsPath:	path to advanced stylesheets (every group need a different path);
 *      @styles: 	number of styles from 1 to n;
 *
 * [Usage example for single mode]: 
 * 
 *      var place = $('#shell'),
 *      path = 'sc/';
 *      style_switcher( placeholder, path, 2 );
 *
 *
 * [Usage example for multiply mode]: 
 *
 *      var place = $('#shell'),
 *      group = 'color',
 *      path  = 'sc/';
 *      style_switcher( placeholder, path, 2, group );
 *
 *
 * [About this]:
 *
 *      @autor:     FroZen Code: www.Shift-Web.ru
 *      @license:   CC-BY-SA 3.0
 *      @version:   2.0 beta 
 *
 *
 * [In future]:
 *  
 *      More optimized engine; 
 *      Support client side DB API for better performance & scalability;
 *      Plugin oriented code style;
 *      
 *
 
 **/
 

style_switcher = function( pl, sp, st, gr ) {
   
    //self configuration
    var group = ( gr !== undefined ) ? 'usr_style_' + gr : 'usr_style';
	var	menu	  = $('<menu class="switcher" data-gr="'+ group +'"></menu>'),
		data 	  = $.Storage.get( group ),
		items	  = links = unify = '';
        
    //unification parameter (use it for debug only): do random query argument in link href
    //var unify = '?' + Math.floor( Math.random( 1, 30 ) * 200 );
    
    //console.log( group );
	
	//apply style list
	for( i = 1; i <= st; i++ ) {
		var marker 	 = 'id="st'+ i +'_'+ group + '" data-gr="'+ group +'" data-st="st'+ i + '_'+ group +'"',
			items 	 = items + '<li '+ marker +'>['+ i +']</li>',
			links	 = links + '<link '+ marker +' rel="fake" media="screen" href="'+ sp +'st'+ i +'.css'+ unify +'">'; 
	}

	//construct dom
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
		
} //end switcher
