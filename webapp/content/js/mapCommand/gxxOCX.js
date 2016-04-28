var globalOcxPlayer1;
var globalOcxPlayer2;
var globalOcxPlayer3;
var globalOcxPlayer4;

window.onload = function(){
	globalOcxPlayer1 = document.getElementById('regOcxDiv1');
	globalOcxPlayer1.style.display = "block";
	globalOcxPlayer1.RegJsFunctionCallback(_onOcxEventProxy);
	
	globalOcxPlayer2 = document.getElementById('regOcxDiv2');
	globalOcxPlayer2.style.display = "block";
	globalOcxPlayer2.RegJsFunctionCallback(_onOcxEventProxy);
	
	globalOcxPlayer3 = document.getElementById('regOcxDiv3');
	globalOcxPlayer3.style.display = "block";
	globalOcxPlayer3.RegJsFunctionCallback(_onOcxEventProxy);
	
	globalOcxPlayer4 = document.getElementById('regOcxDiv4');
	globalOcxPlayer4.style.display = "block";
	globalOcxPlayer4.RegJsFunctionCallback(_onOcxEventProxy);
						
	var data = {};
	data.action = 'InitDeviceSdk'; 
	var str = JSON.stringify(data);
	
	globalOcxPlayer1.GS_ReplayFunc(str);
	globalOcxPlayer2.GS_ReplayFunc(str);
	globalOcxPlayer3.GS_ReplayFunc(str);
	globalOcxPlayer4.GS_ReplayFunc(str);
	
	CreateRealTime();
	LoadSS();
	//PlayRec();
}

function _onOcxEventProxy(data){		//回调入口函数
		//alert(data);
}

//1-为实时视频；2-为录像
var g_ViewMode = 0;
function CreateRealTime() {
    if (globalOcxPlayer1 == null) {
        alert("提示:控件未加载", "提示");
        return;
    }

    if (g_ViewMode == 1) {
        alert("实时视图已经创建", "提示!");
        return;
    }

    if (g_ViewMode == 2) {
        alert("已经创建录像视图，如果要测试实时请重新打开浏览器", "提示!");
        return;
    }
    
    g_ViewMode = 1;

    var data = {};

    data = {};
    data.action = 'InitPara';                                         //设置视图标识，作为每个视图回调事件的标识
    data['arguments'] = {};
    data['arguments']['ocxID'] = "RealTimeView";//用户自定义
    var str = JSON.stringify(data);
    globalOcxPlayer1.GS_RealTimeFunc(str);
	globalOcxPlayer2.GS_RealTimeFunc(str);
	globalOcxPlayer3.GS_RealTimeFunc(str);
	globalOcxPlayer4.GS_RealTimeFunc(str);

    data = {};
    data.action = 'SetConfigParam';                                         //设置视图标识，作为每个视图回调事件的标识
    data['arguments'] = {};
    data['arguments']['captureSavePath'] = "c:\\capture"; //抓图保存路径
    data['arguments']['savePath'] = "c:\\Record"; //录像下载跟本地录像保存路径
    var str = JSON.stringify(data);
    globalOcxPlayer1.GS_RealTimeFunc(str);
    globalOcxPlayer2.GS_RealTimeFunc(str);
    globalOcxPlayer3.GS_RealTimeFunc(str);
    globalOcxPlayer4.GS_RealTimeFunc(str);
	
    data = {};
    data.action = 'InitMonitorWnd';                                         //创建实时视图
    data['arguments'] = {};
    data['arguments']['nDefaultSplit'] = 1;
    data['arguments']['nMaxSplit'] = 4;
    var str = JSON.stringify(data);
    globalOcxPlayer1.GS_RealTimeFunc(str);
    globalOcxPlayer2.GS_RealTimeFunc(str);
    globalOcxPlayer3.GS_RealTimeFunc(str);
    globalOcxPlayer4.GS_RealTimeFunc(str);
}

//登录SS服务
function LoadSS(){
	if(globalOcxPlayer1 == null){
		alert("提示:控件未加载","控件未加载!");
		return ;
	}

	var data = {};
	data = {};
	if (g_ViewMode == 1) {
	    data.action = 'Login_SSServer';
	    data['arguments'] = {};
	    data['arguments']['strIp'] = "192.168.21.51";
	    data['arguments']['userName'] = "admin";
	    data['arguments']['passWord'] = "admin";
	    data['arguments']['nPort'] = 10086;
	    var str = JSON.stringify(data);
	    var ret = globalOcxPlayer1.GS_RealTimeFunc(str);

		//var ret = globalOcxPlayer1.GS_RealTimeFunc(str);
	    ret = eval('(' + ret + ')');
	    if (ret.code != 0) {
	        alert("登录失败,错误码:" + ret.code, "提示");
	        return;
	    }

	    //alert("登录SS服务成功", "登录SS成功");
	}
	else {
	    data.action = 'Login_VodServer';
	    data['arguments'] = {};
	    data['arguments']['strIp'] = "192.168.15.20";
	    data['arguments']['userName'] = "admin";
	    data['arguments']['passWord'] = "admin";
	    data['arguments']['nPort'] = 10100;
	    var str = JSON.stringify(data);
	    var ret = globalOcxPlayer.GS_ReplayFunc(str);
		//var ret = globalOcxPlayer1.GS_RealTimeFunc(str);
	    ret = eval('(' + ret + ')');
	    if (ret.code != 0) {
	        alert("提示", "登录失败,错误码:" + ret.code);
	        return;
	    }

	    alert("登录VODS成功", "登录VODS成功");
	}
}

//播放视频
function PlayRec(devId){
	if(globalOcxPlayer1 == null){
		alert("提示","控件未加载!");
		return ;
	}

	var data = {};
	data = {};
	if (g_ViewMode == 1) {
	    data.action = 'PlayRealVideo';
	    data['arguments'] = {};
	    data['arguments']['szDevID'] = ""+devId;
	    data['arguments']['nStreamType'] = 1;
	    data['arguments']['nDevType'] = 150001;
	    data['arguments']['nIndex'] = -1;   //填写-1默认选择空闲窗口
	    var str = JSON.stringify(data);
	    globalOcxPlayer1.GS_RealTimeFunc(str);
	    //globalOcxPlayer2.GS_RealTimeFunc(str);
	    //globalOcxPlayer3.GS_RealTimeFunc(str);
	    //globalOcxPlayer4.GS_RealTimeFunc(str);
	}
	else {
	    data.action = 'Replay_Ex';
	    data['arguments'] = {};
	    data['arguments']['recordUrl'] = "local://E:/2015-12-08-10-28-27#2015-12-08-10-30-54.gmf";
	    data['arguments']['szStartTime'] = "2015-12-08-10-28-27";
	    data['arguments']['szEndTime'] = "2015-12-08-10-30-54";
	    data['arguments']['nIndex'] = -1;   //填写-1默认选择空闲窗口
	    var str = JSON.stringify(data);
	    globalOcxPlayer1.GS_RealTimeFunc(str);
	    globalOcxPlayer2.GS_RealTimeFunc(str);
	    globalOcxPlayer3.GS_RealTimeFunc(str);
	    globalOcxPlayer4.GS_RealTimeFunc(str);
	}
}