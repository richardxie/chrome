function tender() {
	console.log("开始投标");
	var data = chrome.extension.getBackgroundPage().investData;

	if ( localStorage.getItem(data.userid) == null ) 
		localStorage.setItem(data.userid, $("#trade-pwd").val());

	lunchid = data.coupons[0]['id'];
    ammount = data.coupons[0]['user_constraint'];
  	ppay = localStorage.getItem(data.userid);
  	console.log(ppay);
    ppay = encode64(xxtea_encrypt(utf16to8(ppay), data.uniqkey));
	var values = {
        '__hash__': data.hash,
        'ibnum': data.borrowNum,
        'lunchId': lunchid, 
        'amount': ammount,
        'p_pay': ppay,
        'user_id': data.userid
    };
    console.log(values);
};

document.addEventListener('DOMContentLoaded', function () {
	
	var data = chrome.extension.getBackgroundPage().investData;

	chrome.cookies.getAll({'domain':'jr.yatang.cn'}, function(cookies) {
	    for (var i in cookies) {
	      //console.log(cookies[i]);
	    }	  
	});

	document.querySelector('#doit').addEventListener('click', tender);
	if(data.error){
		$("#message").text(data.error);
		$("#content").hide();
	}else{
		$("#message").hide();
		$("#content-title").text(data.title);
		$("#content-author").text(data.amt);
		$("#content-date").text(data.borrowtype);
		$("#content-number").text(data.borrowNum);
		$("#content-cid").text(data.userid);
		$("#content-first-access").text(data.firstAccess);
		if ( localStorage.getItem(data.userid) ) {
			$("#trade-pwd").val( localStorage.getItem(data.userid) );
		}
	}
});
