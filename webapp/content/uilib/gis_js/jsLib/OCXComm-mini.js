/**
 * ocx封装的简易版本
 */

/**
 * @class OCXComm ocx控件操作函数
 */
var OCXComm = function(id, ocxObj) {
	this.id = id;
	this.ocxObj = ocxObj;
};

/**
 * 初始化窗口
 * 
 * @returns {Boolean}
 */
OCXComm.prototype.init = function() {
	try{
		var params = '{"arguments":{"nDefaultSplit":1,"nMaxSplit":4},"action":"InitMonitorWnd"}';
		this.ocxObj.GS_RealTimeFunc(params);
		this.hideToolbar();
		return true ;
	}catch(e){
		return false ;
	}
};

/**
 * 登录
 */
OCXComm.prototype.login = function(userName,password) {
//	var result = "[{'bms.ip':'"+_app.bmsIp+"','bms.port':'"+_app.bmsPort+"'}]";
//	OCXComm.prototype.bms  = (new Function("return " + result))(); 
	/*
	$.ajax({
		url : CECE_DMS_DATA_URL,
		dataType : 'text',
		type : 'POST',
		async : false,
		success : function(result) {
			if(result != null){
//				var result = "[{'bms.ip':'192.168.16.151','bms.port':'10002'}]";
				OCXComm.prototype.bms  = (new Function("return " + result))(); 
			}
		},
		error : function(e){
			alert("获取cecs的dms数据失败!!!");
		}
		
	});*/
	//var result = "[{'bms.ip':'"+_app.bmsIp+"','bms.port':'"+_app.bmsPort+"'}]";
//	var result = "[{'bms.ip':'"+GisObject.bms.ip+"','bms.port':'"+GisObject.bms.port+"'}]";
	
	var result = "[{'bms.ip':'"+document.getElementById("bmsIp").value+"','bms.port':'"+document.getElementById("bmsPort").value+"'}]";
	this.bms = (new Function("return " + result))(); 
	var params = '{"action":"Login","arguments":{"sIP":"'+this.bms[0]["bms.ip"]+'","nPort":'+this.bms[0]["bms.port"]+',"sUserName":"'+userName+'","sPassword":"'+password+'"}}';
	this.ocxObj.GS_SysFunc(params);
};
/**
 * 播放视频
 * 
 * @param monitorId
 */
OCXComm.prototype.play = function(monitorId) {
	var params = '{"action":"PlayRealVideo","arguments":{"szNodeID":"'+monitorId+'","nStreamType":1,"nIndex":-1,"nVideoReqType":1}}';
	this.ocxObj.GS_SysFunc(params);
};

/**
 * 播放视频
 * @param monitorId
 */
OCXComm.prototype.hideToolbar = function() {
	var params = '{"action":"SetLiveWndStyle","arguments":{"nWindowStyle":0}}';
	this.ocxObj.GS_RealTimeFunc(params);
};

/**
 * 获取窗口的状态
 */
OCXComm.prototype.getLiveDispWndInfo = function(nIndex){
	if(this.ocxObj == null){
		alert("OCX对象尚未初始化");
		return false;
	}
	var params = '{"action":"GetLiveDispWndInfo","arguments":{"nIndex":'+nIndex+'}}';
	var ret = this.ocxObj.GS_RealTimeFunc(params);
	return ret;
};

/**
 * 云台控制
 * 
 * @ptzCommand 命令 GS_PTZ_COMMAND_NULL = 0, //云台停止,没有运动
 *             GS_PTZ_COMMAND_LIGHT_PWRON = 1, // 接通灯光电源
 *             GS_PTZ_COMMAND_WIPER_PWRON =2, // 接通雨刷开关 GS_PTZ_COMMAND_ZOOM_IN
 *             =3, // 焦距变大(倍率变大) GS_PTZ_COMMAND_ZOOM_OUT =4, // 焦距变小(倍率变小)
 *             GS_PTZ_COMMAND_FOCUS_NEAR=5, // 焦点前调 GS_PTZ_COMMAND_FOCUS_FAR=6, //
 *             焦点后调 GS_PTZ_COMMAND_IRIS_OPEN=7, // 光圈扩大
 *             GS_PTZ_COMMAND_IRIS_CLOSE=8, // 光圈缩小 GS_PTZ_COMMAND_TILT_UP=9, //
 *             云台上仰 GS_PTZ_COMMAND_TILT_DOWN=10, // 云台下俯
 *             GS_PTZ_COMMAND_PAN_LEFT=11, // 云台左转 GS_PTZ_COMMAND_PAN_RIGHT=12, //
 *             云台右转 GS_PTZ_COMMAND_UP_LEFT=13, // 云台上仰和左转
 *             GS_PTZ_COMMAND_UP_RIGHT=14, // 云台上仰和右转
 *             GS_PTZ_COMMAND_DOWN_LEFT=15, // 云台下俯和左转
 *             GS_PTZ_COMMAND_DOWN_RIGHT=16, // 云台下俯和右转
 *             GS_PTZ_COMMAND_PAN_AUTO=17, // 云台左右自动扫描
 *             GS_PTZ_COMMAND_GOTO_PRESET=18 // 转到预置点
 */
OCXComm.prototype.ptzControl = function(ptzCommand, monitorId, isStart) {
	var params = '{"action":"PTZControl","arguments":{"ptzCommand":'
			+ ptzCommand + ',"szNodeID":"' + monitorId
			+ '","nSpeed":3,"isStart":' + isStart + ',"szName":""}}';
	this.ocxObj.GS_SysFunc(params);
}
/**
 * 用户注销
 */
OCXComm.prototype.logout = function() {
	var params = '{"action":"LogOut"}';
	this.ocxObj.GS_RealTimeFunc(params);
};
/**
 * 控件销毁
 */
OCXComm.prototype.destroy = function() {
	var params = '{"action":"Delete"}';
	this.ocxObj.GS_RealTimeFunc(params);
};

var  ocx = null;
var isLogin = false;
/**
 * 获取视频树的结果集
 */
//var CECS_TREE_DATA_URL = _app.cecsUrl+"/manage/device/showAllChannelTree.action";
//var CECS_TREE_DATA_URL = _app.cecsUrl+"/client/realtime/showAllDeviceTree.action?type=channel";
//var CECE_DMS_DATA_URL =  _app.cecsUrl+"/manage/device/getBMSInfo.action" ;

$(document).ready(function() {
	ocx = new OCXComm("h3c_IMOS_ActiveX", document
			.getElementById("h3c_IMOS_ActiveX"));

	//判断是否登录
	isLoginToOcx();
	
	if(!ocx.init()){
		//window.parent.downloadOcx();
		return;
	}

	
	//播放
	if(isLogin){
		if(document.getElementById("videoValue").value){
			ocx.play(document.getElementById("videoValue").value);
		}
	}
//	document.getElementById("h3c_IMOS_ActiveX").style.width = (window.document.documentElement.clientWidth-4)+"px";
//	document.getElementById("h3c_IMOS_ActiveX").style.height = (window.document.documentElement.clientHeight-4)+"px";
	//$('#h3c_IMOS_ActiveX').css('width' , ($(window).width()-4)+"px").css('height' , ($(window).height()-4)+"px");
	bindEvent();
	
	window.parent.isOpeningVideo = false;
}); 

$(window).unload(function(){
	closeVideoOcx();
});

function isLoginToOcx(){
	if(!isLogin){
		try{
//			var accountName = window.parent.currentUser.accountName;
//			var password = window.parent.currentUser.password;
			var accountName =  document.getElementById("bmsUserName").value;//GisObject.bms.userName;
			var password = document.getElementById("bmsPassword").value;//GisObject.bms.password;
			if(accountName&&password){
				ocx.login(accountName, password);
				isLogin = true;
			}
		}catch(ex){
			isLogin = false;
		}
	}
}

function closeVideoOcx(){
	if(ocx){
		try{
			ocx.destroy();
		}catch(ex){
//			if(console){
//				console.log(ex.message);
//			}
		}
		
	}
}

//Gosun.VodWindow.playingStatus = {
//		free : 0,//		DISP_FREE : 0,
//		connecting : 1,//		DISP_CONNECTING : 1,
//		playing : 2,//		DISP_PLAYING : 2,
//		closeing : 3,//		DISP_CLOSING : 3,
//		devOff : 4//		DISP_DEVOFF : 4
//	};

function changeChannelVideo(szNodeId){
	var info = getPlayInfo();
	if(info.isPlaying&&info.szNodeId==szNodeId) return;
	
	ocx.play(szNodeId);
}

function getPlayInfo(){
	var res = {};
	var info = ocx.getLiveDispWndInfo(0);
	var objInfo = $.parseJSON(info);
	var status = objInfo.data.dispStatus;
	if(status==2){
		res.isPlaying = true;
	}else{
		res.isPlaying = false;
	}
	res.szNodeId = objInfo.data.szNodeID;
	
	return res;
}

/**
 * 绑定事件
 */
function bindEvent() {

	$(".col,.col2").mousedown(function() {
		var monitorId = $("#videoValue").val();
		if (!monitorId)
			return;
		switch ($(this).attr("id")) {

		case "left_up":
			ocx.ptzControl(13, monitorId, 1);// 云台上仰和左转
			break;
		case "up":
			ocx.ptzControl(9, monitorId, 1); // 云台上仰
			break;
		case "right_up":
			ocx.ptzControl(14, monitorId, 1);// 云台上仰和右转
			break;

		case "left":
			ocx.ptzControl(11, monitorId, 1);// 云台左转
			break;
		case "refresh":
			ocx.ptzControl(18, monitorId, 1);// 转到预置点
			break;
		case "right":
			ocx.ptzControl(12, monitorId, 1);// 云台右转
			break;
		case "left_down":
			ocx.ptzControl(15, monitorId, 1);// 云台下俯和左转
			break;
		case "down":
			ocx.ptzControl(10, monitorId, 1);// 云台下俯
			break;
		case "right_down":
			ocx.ptzControl(16, monitorId, 1);// 云台下俯和右转
			break;
		case "zoom_out":
			ocx.ptzControl(4, monitorId, 1);// 焦距变小(倍率变小)
//			ocx.ptzControl(3, monitorId, 1); // 焦距变大(倍率变大)
			break;
		case "zoom_in":
			ocx.ptzControl(3, monitorId, 1); // 焦距变大(倍率变大)
//			ocx.ptzControl(4, monitorId, 1);// 焦距变小(倍率变小)
			break;
		case "focus_near":
			ocx.ptzControl(5, monitorId, 1);// 焦点前调
			break;

		case "focus_far":
			ocx.ptzControl(6, monitorId, 1);// 焦点后调
			break;
		case "iris_open":
			ocx.ptzControl(7, monitorId, 1);// 光圈扩大
			break;
		case "iris_close":
			ocx.ptzControl(8, monitorId, 1);// 光圈缩小
			break;

		}

	});

	$(".col,.col2").mouseup(function() {
		var monitorId = $("#videoValue").val();
		if (!monitorId)
			return;
		switch ($(this).attr("id")) {
		case "left_up":
			ocx.ptzControl(12, monitorId, 0);// 云台上仰和左转
			break;
		case "up":
			ocx.ptzControl(9, monitorId, 0); // 云台上仰
			break;
		case "right_up":
			ocx.ptzControl(14, monitorId, 0);// 云台上仰和右转
			break;

		case "left":
			ocx.ptzControl(11, monitorId, 0);// 云台左转
			break;
		case "refresh":
			ocx.ptzControl(18, monitorId, 0);// 转到预置点
			break;
		case "right":
			ocx.ptzControl(12, monitorId, 0);// 云台右转
			break;
		case "left_down":
			ocx.ptzControl(15, monitorId, 0);// 云台下俯和左转
			break;
		case "down":
			ocx.ptzControl(10, monitorId, 0);// 云台下俯
			break;
		case "right_down":
			ocx.ptzControl(16, monitorId, 0);// 云台下俯和右转
			break;
		case "zoom_out":
			ocx.ptzControl(3, monitorId, 0); // 焦距变大(倍率变大)
			break;
		case "zoom_in":
			ocx.ptzControl(4, monitorId, 0);// 焦距变小(倍率变小)
			break;
		case "focus_near":
			ocx.ptzControl(5, monitorId, 0);// 焦点前调
			break;

		case "focus_far":
			ocx.ptzControl(6, monitorId, 0);// 焦点后调
			break;
		case "iris_open":
			ocx.ptzControl(7, monitorId, 0);// 光圈扩大
			break;
		case "iris_close":
			ocx.ptzControl(8, monitorId, 0);// 光圈缩小
			break;
		}
	});

}

