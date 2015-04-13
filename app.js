var siteUrl = 'http://pfaudler.com';

var Spider = require('node-spider');

var spider = new Spider({
    concurrent: 5,
    logs: false,
    headers: { 'user-agent': 'node-spider' },
    error: function(url, err){
    	// handle error 
		console.log(url, err);
    },
    done: function() {
		console.log(internalUrls, externalUrls);
    }
});

var internalUrls = {};
var externalUrls = {};

var isInternalUrl = function(url){
	var prefix = 'https://www.';
	var index = url.toLowerCase().indexOf(siteUrl.replace('http://', ''));
	return ( index != -1 && index <= prefix.length + 1 ) ? true : false;
};

var isImageUrl = function(url){
	var imageExtensions = ['jpg', 'jpeg', 'gif', 'png'];
	for (var i in imageExtensions) {
		var index = url.toLowerCase().indexOf(imageExtensions[i]); 
		if ( index != -1 ){
			return true;
		}
	}
	return false;
};

var isIgnoredUrl = function(url){
	var ignoredExtensions = ['doc', 'pdf'];
	for (var i in ignoredExtensions) {
		if ( url.toLowerCase().indexOf(ignoredExtensions[i]) != -1 ){
			return false;
		}
	}
	return true;
};

var handleRequest = function(doc){
    doc.$('a').each(function(){
		if ( this.attr('href') ){
	        var href = this.attr('href').split('#')[0];
	        var url = doc.resolve(href);
			if ( isInternalUrl(url) ) {
				if ( internalUrls[url] == undefined ){
					if ( 1 /* ! isImageUrl(url) && ! isIgnoredUrl(url) */ ){
						console.log(url);
						internalUrls[url] = 1;
						setTimeout( function() {
							spider.queue(url, handleRequest);
						}, 0);
					}
				} 
			} else {
				if ( externalUrls[url] == undefined ){
					externalUrls[url] = 1;
				}
			}
		}
    });
};
 
// start crawling 
spider.queue(siteUrl, handleRequest);