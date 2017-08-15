if(document.title!='我要投资'){
	chrome.runtime.sendMessage({type:"cnblog-article-information", error:"获取文章信息失败."});
}
else{

	var msg = {
		type: "cnblog-article-information",
		title : $(".borrow_name").text(),
		amt : $("#jd_account").attr( "value" ),
		borrowtype : $("#iborrowtype").attr( "value" ),
		url: document.URL
	};
	chrome.runtime.sendMessage(msg);
}
