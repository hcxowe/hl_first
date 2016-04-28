
/**
 * 创建连接
 * @returns {Boolean}
 */	
function createRequest() {
	  var httpRequest=false;
	  try {
	    httpRequest= new XMLHttpRequest();
	  } catch (trymicrosoft) {
	    try {
	      httpRequest= new ActiveXObject("Msxml2.XMLHTTP");
	    } catch (othermicrosoft) {
	      try {
	        httpRequest= new ActiveXObject("Microsoft.XMLHTTP");
	      } catch (failed) {
	        httpRequest= false;
	      }
	    }
	  }  
	  if (!httpRequest)
	    alert("Error initializing XMLHttpRequest!");
	  return httpRequest;
}

/**
 * 检查用户密码
 * @param userName
 * @param password
 * @returns  {json} 里面有msg和code code !=200 检测用户失败不成功
 */
function checkUserPassword(userName, password) {
	return;
}

/**
 * 设置窗口高度
 */
function windowHeight() {
    var de = document.documentElement;
    return self.innerHeight||(de && de.clientHeight)||document.body.clientHeight;
}


/**
 * 	pki 登录
 */
function pkiLogin() {
	$('#accountName').val('');
	$('#password').val('');
}

