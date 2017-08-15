function getDomainFromUrl(url){
	var host = "null";
	if(typeof url == "undefined" || null == url)
		url = window.location.href;
	var regex = /.*\:\/\/([^\/]*).*/;
	var match = url.match(regex);
	if(typeof match != "undefined" && null != match)
		host = match[1];
	return host;
}

function getBidFromUrl(url){
	var bid = '';
	if(typeof url == "undefined" || null == url)
		url = window.location.href;
	var regex = /https\:\/\/jr\.yatang\.cn\/Invest\/ViewBorrow\/ibid\/([0-9]{7})/;
	var match = url.match(regex);
	if(typeof match != "undefined" && null != match)
		bid = match[1];
	return bid;
}

function checkForValidUrl(tabId, changeInfo, tab) {
	var url = tab.url;
	if(getDomainFromUrl(url).toLowerCase()=="jr.yatang.cn"){
		if(getBidFromUrl(url) != '')
			chrome.pageAction.show(tabId);
	}
};

chrome.tabs.onUpdated.addListener(checkForValidUrl);
chrome.tabs.getCurrent(function(tab){  
 console.log(tab);    
 });
var articleData = {};
articleData.error = "加载中...";
chrome.runtime.onMessage.addListener(function(request, sender, sendRequest){
	if(request.type!=="cnblog-article-information")
		console.log("无效的消息类型：%s", request.type);
		return;
	articleData = request;
	articleData.firstAccess = "获取中...";
	if(!articleData.error){
		$.ajax({
			url: "http://localhost/first_access.php",
			cache: false,
			type: "POST",
			data: JSON.stringify({url:articleData.url}),
			dataType: "json"
		}).done(function(msg) {
			if(msg.error){
				articleData.firstAccess = msg.error;
			} else {
				articleData.firstAccess = msg.firstAccess;
			}
		}).fail(function(jqXHR, textStatus) {
			articleData.firstAccess = textStatus;
		});
	}
});
