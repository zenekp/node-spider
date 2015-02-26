var siteUrl = 'http://fivebyfiveuk.com/';

var Spider = require('node-spider');

var fs = require('fs');

var spider = new Spider({
    concurrent: 5,
    logs: true,
    headers: { 'user-agent': 'node-spider' },
    error: function(url, err){
    // handle error 
    },
    done: function() {
		console.log(internalUrls, externalUrls);
    }
});

var internalUrls = {};
var externalUrls = {};

var isInternalUrl = function(url){
	var prefix = 'https://www.';
	var index = url.indexOf(siteUrl.replace('http://', ''));
	return ( index != -1 && index <= prefix.length + 1 ) ? true : false;
};

var isImageUrl = function(url){
	var imageExtensions = ['jpg', 'jpeg', 'gif', 'png'];
	for (var i in imageExtensions) {
		if ( url.indexOf('jpg') != -1 ){
			return true;
		}
	}
	return false;
};

var handleRequest = function(doc){
    doc.$('a').each(function(){
		if ( this.attr('href') ){
	        var href = this.attr('href').split('#')[0];
	        var url = doc.resolve(href);
			if ( isInternalUrl(url) ) {
				if ( internalUrls[url] == undefined ){
					if ( ! isImageUrl(url) ){
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