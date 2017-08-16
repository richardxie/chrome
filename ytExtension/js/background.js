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

var investData = {};
investData.error = "加载中...";

chrome.runtime.onMessage.addListener(function(request, sender, sendRequest){
	if( request.type !== "cnblog-article-information" ) {
		console.log( "无效的消息类型：%s", request.type );
		return;
	}
	investData = request;
	investData.firstAccess = "获取中...";
	if(!investData.error){
		var requestData = {
			'investMoney': '',
            'borrowNum': investData.borrowNum,
            'pageNum': '1'
		};

		$.ajax({
			url: "https://jr.yatang.cn/Ajax/getUserCoupon",
			cache: false,
			type: "POST",
			data: requestData
		}).done(function(msg) {
			var jsonMsg = JSON.parse(msg);
			if(jsonMsg.status == 0){
				investData.firstAccess = '失败:' + jsonMsg.info;
			} else {
				coupons = jsonMsg.data.map(function(i){ 
					return i.value + ":" + i.user_constraint;
				});

				investData.firstAccess = '成功:' + coupons;
				investData.coupons = jsonMsg.data;
			}
		}).fail(function(jqXHR, textStatus) {
			investData.firstAccess = textStatus;
		});
	}
});
