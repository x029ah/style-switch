/**
	-=Style Switcher jQuery function=-
 *
 * [arguments]:	
 * @place: 		element selector to apply menu ( e.g. $('body'), $('#head'), $('.here') )
 * @skinsPath:	path to advanced stylesheet
 * @styles: 	number of styles from 1 to n( st0 is reserved by default) 
 *
 * [usage example]: 
 *				var place = $('#shell'),
 *				path = 'sc/';
 *				style_witcher( placeholder, path, 2 );
 *
 * [About this]:
 * @version: 1.2 
 * @autor: www.Shift-Web.ru
 * @license: CC-BY-SA 3.0
 *
 */
 
style_switcher = function( pl, sp, st ) {
	
	//configuration
	var	menu	  = $('<menu id="switcher"></menu>'),
		data 	  = $.Storage.get('usr_style'),
		items	  = '';
	
	//apply style list
	for( i = 1; i <= st; i++ ) {
		var marker 	 = 'id="st'+ i +'" data-st="st'+ i +'"';
		var items 	 = items + '<li '+ marker +'>['+ i +']</li>'; 
		$('head').append('<link '+ marker +' rel="fake" media="screen" href="'+ sp +'st'+ i +'.css">');
	}

	//set menu
	$(pl).prepend(menu);
	menu.html(items);

	//check for choice & activate
	if( data !== undefined ) {
		$('link[data-st='+ data +']', 'head').attr('rel', 'stylesheet');
		$('#'+ data, '#switcher').addClass('active');
	}

	//switch
	$('#switcher li').click(function() {	
		var t = $(this).attr('data-st');
		
		//clear
		$('link[data-st]', 'head').attr('rel','fake');
		$('li', '#switcher').removeClass('active');
		
		//set
		$('link[data-st='+ t +']','head').attr('rel', 'stylesheet');
		$(this).addClass('active');
		$.Storage.set('usr_style', t);
	});
		
} //end switcher
	


// IIFE document.ready
$(function() {

/* initialization */
var placeholder = $('#shell'),
	path = 'sc/';

style_switcher( placeholder, path, 5 );	

	
});
//end switcher
