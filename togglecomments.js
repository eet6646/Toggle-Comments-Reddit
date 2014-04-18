
var onCommentClick = function(commentId) {
	var cURL = commentId.attr('href');
	var parentDiv = commentId.parents('div:eq(1)');
	var commentDivId = 'redditCommentToggle_' + parentDiv.attr('data-fullname');

	var commentDiv = $('#'+commentDivId);
	if(commentDiv.length == 0){
		redditCommentToggle.requestPage(parentDiv, commentDivId, cURL);
	}else{
		commentDiv.slideToggle("slow");
	}
}


$("a.comments").click(function() {
	onCommentClick($(this));
	return false;
}).addClass("commenttoggle");


function nodeInsertedCallback(event) {

	if(event.relatedNode.className == "tagline"){

		var commentLink = $($(event.relatedNode).next().find('a.comments:eq(0)'));
		if(commentLink[0].className == "comments may-blank"){
			commentLink.click(function() {
					onCommentClick($(this));
					return false;
				});
			commentLink.addClass("commenttoggle");
		}
	}
};


document.addEventListener('DOMNodeInserted', nodeInsertedCallback);

var redditCommentToggle = {
	requestPage: function(parentDiv, commentDivId, url) {

		$.get(url,function(source) {

			var loadedComments = $(source).find('div[id^="siteTable_t3_"]');
			var commentDiv = $("<div>").html(loadedComments);
			commentDiv.attr('id', commentDivId)

			var scrollUpFunc = function() {
				$('html,body').animate({ scrollTop: parentDiv.offset().top }, 'slow');
			}

			var scrollUp = $(" <a>(back up)</a>").click(scrollUpFunc);
			var hideAll = $(" <a>(hide all)</a>").click(function() {
				commentDiv.slideToggle("slow");
				scrollUpFunc();
				return false;
			});
			loadedComments.find("p.tagline").append(" -- ").append(scrollUp);
			loadedComments.find("p.tagline").append(" - ").append(hideAll);

			parentDiv.append(commentDiv).hide().slideDown("slow");
		});
	}
}