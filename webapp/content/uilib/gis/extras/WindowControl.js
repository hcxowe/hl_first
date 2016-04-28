/**
 * 
 */



dojo.provide("extras.WindowControl");

dojo.declare("extras.WindowControl",null,{
	constructor:function(config)
	{
		this.name = config.name;
        this.platIp = config.platip;
        this.platPort = config.platPort;
        this.username = config.username;
        this.passwd = config.pwd;
        
        this.subscribe('/ocx/playrealvideo',this,"onPlayRealtimeVideoCallBack");
        this.subscribe('/ocx/imageframereceive',this,"onReceiveImageFrame");
        this.subscribe('/ocx/stoprealvideo',this,"onStopRealCloseVideo");
        
        
        this.ocxComm = null;
        this.hasInited = false;
    	this.hasLogin = false;
    	this.COUNT_WIN = 16;//最大分屏数
    	
    	this.focusWin = null;
    	this.lastSelectIndex = 1;
    	this.voice = 5;
    	this.isMaxShow = false;
    	this.toBeMaxShow = false;
    	this.isMaxShowHasChangeWin = false;
    	
    	//暂停获取即时回放的进度条，保证进度获取的是最新的，否则会导致即时回放的进度条回弹的问题
    	this.stopGetInstantReplayProgress = false;
    	
    	//节点类型
    	this.nodeType = Gosun.ChannelTreePanel.nodeType;
    	
    	//分屏参数
    	this.windowSplitNumArr = [1,4,6,8,9,13,16,1000],
    	this.nowWindowNum = 1;
    	this.xSplit = 0;
    	this.ySplit = 0;
    	this.beforeMaxShowWindowNum = 0;
    	
    	this.windowNotVisableWithOcxPlaying = {};
    	for(var i=1;i<=this.COUNT_WIN;i++){
    		this.windowNotVisableWithOcxPlaying[i] = null;
    	}
	},
    /**
     * isSingle标志是不是单窗口用到的ocx
     * @param isSingle
     * @returns
     */
    createOcxPlayer : function(isSingle){
    	var ocxPlayer = window.document.createElement("object");
    	ocxPlayer.classid = "CLSID:455791d4-4095-4f70-b2b3-f5c424f25ad9";
    	ocxPlayer.style.width = "100%";
    	ocxPlayer.style.height = "100%";
    	if(isSingle){
        	ocxComm = new OCXComm(ocxPlayer.id, ocxPlayer);
        	return ocxComm;
    	}else{
        	ocxPlayer.id = "map_realtime_player"; // 唯一标识
        	this.ocxComm = new OCXComm(ocxPlayer.id, ocxPlayer);
    	}
    },
    initParam : function(){
   		 this.ocxComm.initPara(this.ocxComm.id);
    },
    pollingOperateDynamic:function(szNodeIDArray,pollingInterval,nDispSplit,nDispWndArray){
    	if(this.ocxComm == null){
			Gsui.Msg.alert("提示","OCX对象尚未初始化");
		}
    	nDispSplit=nDispSplit||4;
    	nDispWndArray=nDispWndArray||[1,2,3,4];
    	if(_app.currentUser.maxViews != -1 && _app.currentUser.maxViews < 4){
    		var array =[];
    		for(var i=0;i<_app.currentUser.maxViews;i++){
    			array.push(i+1);
    		}
    		nDispWndArray = array;
    	}
    	pollingInterval = pollingInterval||5;
    	ret = this.ocxComm.pollingOperateDynamic(nDispSplit, nDispWndArray, szNodeIDArray, pollingInterval);
    	
    	return ret;
    },
    stopPollingOperate:function(){
    	if(this.ocxComm == null){
			Gsui.Msg.alert("提示","OCX对象尚未初始化");
		}
    	ret = this.ocxComm.pollingOperate(1,0);
    	
    	return ret;
    },
    /**
	 * 播放实时视频
	 * @param szNodeId
	 * @param index
	 * @param channelName
	 * @param detailInfo
	 * @param streamType
	 * @param facade
	 * @param controlType
	 * @returns
	 */
	playRealTimeVideo : function(szNodeId,index,isAlarm,channelName,detailInfo,streamType,facade,controlType) {
		//facade,controlType 要处理
		if(this.ocxComm == null){
			Gsui.Msg.alert("提示","OCX对象尚未初始化");
		}
		if (!this.hasLogin) {
			this.loginIntoPmsByFocusOcx(this.ocxComm);
		}
		var reqType = extras.VodWindow.requestType.manual;
		if(isAlarm) reqType = extras.VodWindow.requestType.alarm;
		ret = this.ocxComm.playRealVideo(szNodeId,streamType,index,reqType);
		if(ret.code != 0){
			return ret.code;
		}
		return ret;
	},
	onPlayRealtimeVideoCallBack:function(){
		if(params.code != 0){
			if(params.code == 26){
				Gsui.Msg.alert("提示","您没有点流的权限！请与管理人员联系");
			}else{
				Gsui.Msg.alert("提示","错误ID:"+params.code+",错误原因："+Gosun.getErrorInfoByCode(params.code));
			}
		}
	},
	onReceiveImageFrame:function(){
		if(params.code == 0){
			var winInfo = this.getWindowInfoByIndex(params.data.nIndex);
			if(!winInfo.isBlank()){
				//如果窗口是正在执行轮巡方案，则不进行后面的操作
				if(winInfo.isPolling()) return false;
				this.publish("/windowchange/channelstartplaying",params.data.szNodeID);
				
				if(this.checkIndexIsFocus(params.data.nIndex)) {
					this.publish("/windowchange/onfocuswinchange",winInfo);
				}
				return true;
			}
		}else{
			Gsui.Msg.alert("提示","错误ID:"+params.code+",错误原因："+Gosun.getErrorInfoByCode(params.code));
			return false;
		}
	},
	initOcxPlayerParams : function(maxWinNum){    	
    	if(!this.hasLogin) {
        	this.loginIntoPmsByFocusOcx(this.ocxComm);
        }
		
//    	if(!this.hasInited){
//    		this.ocxComm.initMonitorWnd(parseInt(this.nowWindowNum),maxWinNum);
//    		this.ocxComm.setLiveWndStyle(0);
//    		this.hasInited = true;
//    	}  
    	this.ocxComm.initMonitorWnd(parseInt(this.nowWindowNum),maxWinNum);
		if(maxWinNum>1){
			this.ocxComm.setLiveWndStyle(0);
		}else{
			this.ocxComm.SetElcMapFlag(1);
		}
    	
//		this.hasInited = true;
    },
    loginIntoPmsByFocusOcx:function(ocxComm) {
		if (ocxComm == null) {
			Gsui.Msg.alert("警告","页面OCX初始化失败！");
			return false;
		}
		var ret = ocxComm.login(this.platIp, this.platPort,
				this.username, this.passwd);
		if (ret.code != 0) {
//			Gsui.Msg.alert("警告","登陆失败！");
			return false;
		}
		this.hasLogin = true;
	},
	//将关闭窗口的动作抽象出成一个方法，供界面处理层调用，关不关闭，怎么关闭由此方法处理
	/**
	 * param : cb 关闭之后的处理
	 * param : forceClose 强制关闭，不需要管窗口状态
	 * 
	 */
	closeWin : function(index,forceClose,cb,scope,params){
		var windowInfo = this.getWindowInfoByIndex(index);
		if(forceClose){
			this.closeWinImplement(windowInfo,cb,scope,params);
		}else{
			if(windowInfo.isPlaying()){
				if(windowInfo.isLocalRecording()){
					var msg = "窗口正在本地录像，是否确认关闭？";
//					if(win.isRecord && win.isServerRecord) msg = "窗口正在本地录像和平台录像，是否确认关闭（关闭不会停止平台录像）？";
//					if(win.isRecord && !win.isServerRecord) msg = "窗口正在本地录像，是否确认关闭？";
//					if(!win.isRecord && win.isServerRecord) msg = "窗口正在平台录像，是否确认关闭（关闭不会停止平台录像）？";
					Gsui.Msg.confirm("警告",msg,function(flag){
						if(flag == 'yes'){
							this.closeWinImplement(windowInfo,cb,scope,params);
			    		}
					},this);
					return false;
				}
			}
			this.closeWinImplement(windowInfo,cb,scope,params);
		}
	},
	
	/**
	 * type 用来规定关闭的窗口类型(0或者null为正常实时播放的视频窗口关闭，1为关闭轮巡组窗口)
	 * P.S if type = null and close pollingGroup,in this situation,don't clear interval and alert
	 */
	closeWinImplement : function(win,cb,scope,params){
		var szNodeId = win.szNodeId;
		if (win.isBlank() == true) {
			return false;
		}
	
		ret = this.ocxComm.closeRealVideo(win.index);
		
		if(win.isPlaying()){
			this.winCloseAffectView(szNodeId,win.index);
		}
		
		if(cb){
			if(scope) cb.call(scope,win.szNodeId,params);
			else cb.call(this,szNodeId,params);
		}
		return ret;
	},
	/**
	 * 处理窗口关闭的情况下，处理页面变化
	 * @param win
	 */
	winCloseAffectView : function(szNodeId,index){
		/*var isImmediateReplay = initParamObj.isImmediateReplay;
		if(isImmediateReplay == "on"){
			win.stopInstantReplay();
		}*/
		this.publish("/windowchange/closevideo",szNodeId);
		if(this.checkIndexIsFocus(index)){
			var windowInfo = this.getWindowInfoByIndex(index);
			
			this.publish("/windowchange/onfocuswinchange",windowInfo);//这种是当前选中窗口状态变化了
		}
	},
	onReceiveOcxCloseVideo:function(data){
		this.winCloseAffectView(data.data.szNodeID,data.data.nIndex);
	},
	onStopRealCloseVideo:function(data){
		//this.winCloseAffectView(data.data.szNodeID,data.data.nIndex);
		var szNodeId = data.data.szNodeID;
		if(szNodeId){
			this.publish("/windowchange/closevideo",szNodeId);
			this.publish("/ocxchange/closevideo",szNodeId);
		}
	},
	/**
	 * 判断传入的index是否是选中窗口
	 * @param index
	 * @returns {Boolean}
	 */
	checkIndexIsFocus : function(index){
		var focusWin = this.getFocusWin();
		if(index == focusWin.index){
			return true;
		}else{
			return false;
		}
	},
	getFocusWin : function() {
		var index = 0;//index传0是获取当前焦点窗口信息
		var vodWindow = this.getWindowInfoByIndex(index);
		return vodWindow;
	},
	getWindowInfoByIndex : function(index){
		var vodWindow = null;
		var jsonObj = this.ocxComm.getLiveDispWndInfo(index).data;
		
		vodWindow = new VodWindow();
		vodWindow.index = jsonObj.nIndex;
		vodWindow.szNodeId = jsonObj.szNodeID;
		vodWindow.status = jsonObj.dispStatus;
		vodWindow.requestType = jsonObj.videoReqType;
		vodWindow.recordStatus = jsonObj.localRecord;//本地录像状态
		
		return vodWindow;
	},
	getOcxPlayer : function(){
    	return this.ocxComm.ocxObj;
    }
});



//窗口对象，保存ocx视频窗口当前的状态
/**
  	status状态有以下值
  	DISP_FREE = 0,
	DISP_CONNECTING,
	DISP_PLAYING,
	DISP_CLOSING,
	DISP_DEVOFF
	
	
 */
function VodWindow(index,status,requestType,szNodeId,recordStatus) {
	this.index = index;
	this.szNodeId = szNodeId;
	this.status = status;
	this.requestType = requestType;
	this.recordStatus = recordStatus;//本地录像状态
	
	this.isBlank = function(){
		if(this.status == extras.VodWindow.playingStatus.free){
			return true;
		}else{
			return false;
		}
	};
	
	this.isPlaying = function(){
		if(this.status == extras.VodWindow.playingStatus.playing){
			if(this.requestType == extras.VodWindow.requestType.manual 
					|| this.requestType == extras.VodWindow.requestType.alarm 
					|| this.requestType == extras.VodWindow.requestType.auto){
				return true;
			}
		}
		return false;
	};
	
	this.isLocalRecording = function(){
		if(this.recordStatus == 1){
			return true;
		}else{
			return false;
		}
	};
	
	this.isPolling = function(){
		if(this.status == extras.VodWindow.playingStatus.playing || this.status == extras.VodWindow.playingStatus.connecting){
			if(this.requestType == extras.VodWindow.requestType.circle){
				return true;
			}
		}
		return false;
	};
}


dojo.provide("extras.VodWindow");
extras.VodWindow = {};

extras.VodWindow.playingStatus = {
	free : 0,//		DISP_FREE : 0,
	connecting : 1,//		DISP_CONNECTING : 1,
	playing : 2,//		DISP_PLAYING : 2,
	closeing : 3,//		DISP_CLOSING : 3,
	devOff : 4//		DISP_DEVOFF : 4
};

extras.VodWindow.requestType = {
	manual : 0,//		REQ_MANUAL,
	alarm : 1,//		REQ_ALARM,
	auto : 2,//		REQ_AUTO,
	circle : 3,//		REQ_CIRCLE,
	deviceOff : 4,//		REQ_DEVICEOFF,
	record : 5,//		REQ_RECORD,
	unknow : 6//		REQ_UNKNOWN
};