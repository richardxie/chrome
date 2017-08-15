document.addEventListener('DOMContentLoaded', function () {
	var data = chrome.extension.getBackgroundPage().articleData;
	if(data.error){
		$("#message").text(data.error);
		$("#content").hide();
	}else{
		$("#message").hide();
		$("#content-title").text(data.title);
		$("#content-author").text(data.amt);
		$("#content-date").text(data.borrowtype);
		$("#content-first-access").text(data.firstAccess);
	}
});
