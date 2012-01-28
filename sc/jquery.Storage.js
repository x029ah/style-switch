/**
 * Storage plugin
 * Provides a simple interface for storing data such as user preferences.
 * Storage is useful for saving and retreiving data from the user's browser.
 * For newer browsers, localStorage is used.
 * If localStorage isn't supported, then cookies are used instead.
 * Retrievable data is limited to the same domain as this file.
 *
 * @author Dave Schindler
 *
 * Distributed under the MIT License
 *
 * Copyright (c) 2010 Dave Schindler
 */
 
(function($) {
	var isLS = typeof window.localStorage !== 'undefined';
	function wls(n,v){var c;if(typeof n==="string"&&typeof v==="string"){localStorage[n]=v;return true;}else if(typeof n==="object"&&typeof v==="undefined"){for(c in n){if(n.hasOwnProperty(c)){localStorage[c]=n[c];}}return true;}return false;}
	function wc(n,v) {var dt,e,c;dt=new Date();dt.setTime(dt.getTime()+31536000000);e="; expires="+dt.toGMTString();if(typeof n==="string"&&typeof v==="string"){document.cookie=n+"="+v+e+"; path=/";return true;}else if(typeof n==="object"&&typeof v==="undefined"){for(c in n) {if(n.hasOwnProperty(c)){document.cookie=c+"="+n[c]+e+"; path=/";}}return true;}return false;}
	function rls(n)  {return localStorage[n];}
	function rc(n)   {var nn, ca, i, c;nn=n+"=";ca=document.cookie.split(';');for(i=0;i<ca.length;i++){c=ca[i];while(c.charAt(0)===' '){c=c.substring(1,c.length);}if(c.indexOf(nn)===0){return c.substring(nn.length,c.length);}}return null;}
	function dls(n)  {return delete localStorage[n];}
	function dc(n)   {return wc(n,"",-1);}

	/**
  	* Public API
  	* $.Storage - Represents the user's data store, whether it's cookies or local storage.
  	* $.Storage.set("name", "value") - Stores a named value in the data store.
  	* $.Storage.set({"name1":"value1", "name2":"value2", etc}) - Stores multiple name/value pairs in the data store.
  	* $.Storage.get("name") - Retrieves the value of the given name from the data store.
  	* $.Storage.remove("name") - Permanently deletes the name/value pair from the data store.
	 */
	
	$.extend({
		Storage: {
			set: isLS ? wls : wc,
			get: isLS ? rls : rc,
			remove: isLS ? dls :dc
		}
	});
})(jQuery);
