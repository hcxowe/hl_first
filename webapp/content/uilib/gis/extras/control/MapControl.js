/**
 * 
 */



dojo.provide("extras.control.MapControl");

dojo.declare("extras.control.MapControl",null,{
	constructor:function(gisObj)
	{
		this.gisObj = gisObj;
		dojo.subscribe("toolBarLoadedEvent", this, "initLayerDraw");
		
		//默认样式
        this.defaultSymbol = {
            "Point": {
                width: 18,
                height: 18,
                url: baseUrl + "/themes/default/img/info.gif"
            },
            "Line": {
                strokeWeight: 3,
                strokeOpacity: 1,
                strokeColor: "#e6111b",
                strokeDashstyle: "longdashdotdot"
            },
            "Polygon": {
                strokeWeight: 2,
                strokeOpacity: 1,
                strokeColor: "#2b07e5",
                fillColor: "#2b07e5",
                fillOpacity: 0.6,
                strokeDashstyle: "longdashdotdot"
            }
        };
	},
	initLayerDraw : function(toolbar){
		this.toolbar = toolbar;
		
		if(this.zoomin_1 == null || this.zoomin_2 == null || this.zoomin_3 == null || this.zoomin_4 == null){
			this.zoomin_1 = this.createImg("zoomin_1.png");
	        this.zoomin_2 = this.createImg("zoomin_2.png");
	        this.zoomin_3 = this.createImg("zoomin_3.png");
	        this.zoomin_4 = this.createImg("zoomin_4.png");
		}
		if(this.zoomout_1 == null || this.zoomout_2 == null || this.zoomout_3 == null || this.zoomout_4 == null){
			this.zoomout_1 = this.createImg("zoomout_1.png");
	        this.zoomout_2 = this.createImg("zoomout_2.png");
	        this.zoomout_3 = this.createImg("zoomout_3.png");
	        this.zoomout_4 = this.createImg("zoomout_4.png");
		}
		
		dojo.publish("applicationComplete", [true]);
	},
	/**
	 * 显示放大动画效果
	 * @param {Object} xy
	 */
	showZoomInFlash : function(xy){
		var animations = [];
        animations.push(this.fxResize(this.zoomin_1, {
            left: xy.x - 30,
            top: xy.y - 30
        }, {
			left: xy.x - 60,
            top: xy.y - 60
        }));
        animations.push(this.fxResize(this.zoomin_2, {
			left: xy.x + 30,
            top: xy.y -30
        }, {
            left: xy.x + 60,
            top: xy.y - 60
        }));
        animations.push(this.fxResize(this.zoomin_3, {
			left: xy.x + 30,
            top: xy.y + 30
        }, {
            left: xy.x + 60,
            top: xy.y + 60
        }));
        animations.push(this.fxResize(this.zoomin_4, {
			left: xy.x - 30,
            top: xy.y + 30
        }, {
            left: xy.x - 60,
            top: xy.y + 60
        }));
        dojo.fx.combine(animations).play();
	},
	/**
	 * 显示缩小动画
	 * @param {Object} xy
	 */
	showZoomOutFlash : function(xy){
		var animations = [];
        animations.push(this.fxResize(this.zoomout_1, {
            left: xy.x - 60,
            top: xy.y - 60
        }, {
            left: xy.x - 30,
            top: xy.y - 30
        }));
        animations.push(this.fxResize(this.zoomout_2, {
            left: xy.x + 60,
            top: xy.y - 60
        }, {
            left: xy.x + 30,
            top: xy.y - 30
        }));
        animations.push(this.fxResize(this.zoomout_3, {
            left: xy.x + 60,
            top: xy.y + 60
        }, {
            left: xy.x + 30,
            top: xy.y + 30
        }));
        animations.push(this.fxResize(this.zoomout_4, {
            left: xy.x - 60,
            top: xy.y + 60
        }, {
            left: xy.x - 30,
            top: xy.y + 30
        }));
        dojo.fx.combine(animations).play();
	},
	/**
	 * 显示/隐藏 工具栏放大按钮
	 * @param {Object} showOrHide
	 */
	showZoomInBtn : function(showOrHide){
		if(!this.gisObj.toolPanel){
			return;
		}
		if(showOrHide != this.gisObj.toolPanel.zoomIn.isShow){
			this.gisObj.toolPanel._isreload = true;
			this.gisObj.toolPanel.zoomIn.isShow = showOrHide;
			this.gisObj.toolPanel.startup();
		}
	},
	/**
	 * 显示/隐藏 工具栏缩小按钮
	 * @param {Object} showOrHide
	 */
	showZoomOutBtn : function(showOrHide){
		if(!this.gisObj.toolPanel){
			return;
		}
		if(showOrHide != this.gisObj.toolPanel.zoomOut.isShow){
			this.gisObj.toolPanel._isreload = true;
			this.gisObj.toolPanel.zoomOut.isShow = showOrHide;
			this.gisObj.toolPanel.startup();
		}
	},
	/**
	 * 显示/隐藏 工具栏平移按钮
	 * @param {Object} showOrHide
	 */
	showPanBtn : function(showOrHide){
		if(!this.gisObj.toolPanel){
			return;
		}
		if(showOrHide != this.gisObj.toolPanel.pan.isShow){
			this.gisObj.toolPanel._isreload = true;
			this.gisObj.toolPanel.pan.isShow = showOrHide;
			this.gisObj.toolPanel.startup();
		}
	},
	/**
	 * 显示/隐藏 工具栏前一视图按钮
	 * @param {Object} showOrHide
	 */
	showPreviousBtn : function(showOrHide){
		if(!this.gisObj.toolPanel){
			return;
		}
		if(showOrHide != this.gisObj.toolPanel.previous.isShow){
			this.gisObj.toolPanel._isreload = true;
			this.gisObj.toolPanel.previous.isShow = showOrHide;
			this.gisObj.toolPanel.startup();
		}
	},
	/**
	 * 显示/隐藏 工具栏下一视图按钮
	 * @param {Object} showOrHide
	 */
	showNextBtn : function(showOrHide){
		if(!this.gisObj.toolPanel){
			return;
		}
		if(showOrHide != this.gisObj.toolPanel.next.isShow){
			this.gisObj.toolPanel._isreload = true;
			this.gisObj.toolPanel.next.isShow = showOrHide;
			this.gisObj.toolPanel.startup();
		}
	},
	/**
	 * 显示/隐藏 工具栏全图按钮
	 * @param {Object} showOrHide
	 */
	showFullExtentBtn : function(showOrHide){
		if(!this.gisObj.toolPanel){
			return;
		}
		if(showOrHide != this.gisObj.toolPanel.fullExtent.isShow){
			this.gisObj.toolPanel._isreload = true;
			this.gisObj.toolPanel.fullExtent.isShow = showOrHide;
			this.gisObj.toolPanel.startup();
		}
	},
	/**
	 * 显示/隐藏 工具栏长度测量按钮
	 * @param {Object} showOrHide
	 */
	showMeasureLengthBtn : function(showOrHide){
		if(!this.gisObj.toolPanel){
			return;
		}
		if(showOrHide != this.gisObj.toolPanel.measureLength.isShow){
			this.gisObj.toolPanel._isreload = true;
			this.gisObj.toolPanel.measureLength.isShow = showOrHide;
			this.gisObj.toolPanel.startup();
		}
	},
	/**
	 * 显示/隐藏 工具栏面积测量按钮
	 * @param {Object} showOrHide
	 */
	showMeasureAreaBtn : function(showOrHide){
		if(!this.gisObj.toolPanel){
			return;
		}
		if(showOrHide != this.gisObj.toolPanel.measureArea.isShow){
			this.gisObj.toolPanel._isreload = true;
			this.gisObj.toolPanel.measureArea.isShow = showOrHide;
			this.gisObj.toolPanel.startup();
		}
	},
	/**
	 * 显示/隐藏 工具栏打印按钮
	 * @param {Object} showOrHide
	 */
	showPrintBtn : function(showOrHide){
		if(!this.gisObj.toolPanel){
			return;
		}
		if(showOrHide != this.gisObj.toolPanel.print.isShow){
			this.gisObj.toolPanel._isreload = true;
			this.gisObj.toolPanel.print.isShow = showOrHide;
			this.gisObj.toolPanel.startup();
		}
	},
	/**
	 * 显示/隐藏 工具栏清除按钮
	 * @param {Object} showOrHide
	 */
	showClearBtn : function(showOrHide){
		if(!this.gisObj.toolPanel){
			return;
		}
		if(showOrHide != this.gisObj.toolPanel.clear.isShow){
			this.gisObj.toolPanel._isreload = true;
			this.gisObj.toolPanel.clear.isShow = showOrHide;
			this.gisObj.toolPanel.startup();
		}
	},
	/**
	 * 自定义按钮添加到工具栏
	 * @param {Object} param
	 */
	addToolPanelBtn : function(param){
		if(!this.gisObj.toolPanel){
			return;
		}
		this.gisObj.toolPanel._isreload = true;
		this.gisObj.toolPanel.toolbar_js.push(param);
		this.gisObj.toolPanel.startup();
	},
	/**
	 * 显示/隐藏 地图缩放、比例尺导航条
	 * @param {Object} showOrHide
	 */
	showZoomBar : function(showOrHide){
		showOrHide ? this.gisObj.addZoomBar() : this.gisObj.deleteZoomBar();
	},
	/**
	 * 显示/隐藏 比例尺条
	 * @param {Object} showOrHide
	 */
	showScalebar : function(showOrHide){
		showOrHide ? this.gisObj.addScalebar() : this.gisObj.deleteScalebar();
	},
	/**
	 * 显示/隐藏 鹰眼
	 * @param {Object} showOrHide
	 */
	showOmap : function(showOrHide){
		showOrHide ? this.gisObj._omap.showOmap() : this.gisObj._omap.hideOmap();
	},
	/**
	 * 显示/隐藏 工具栏
	 * @param {Object} showOrHide
	 */
	showToolPanel : function(showOrHide){
		showOrHide ? this.gisObj.toolPanel.showToolBarPanel() : this.gisObj.toolPanel.hideToolBarPanel();
	},
	/**
	 * 显示电子地图
	 */
	showBaseMap : function(){
		dojo.forEach(this.gisObj.imageLayer,dojo.hitch(this,function(layer, index){
			if(layer){
				layer.setVisibility(false)
			}
		}));
		
		dojo.forEach(this.gisObj.baseLayer,dojo.hitch(this,function(layer, index){
			if(layer){
				layer.setVisibility(true)
			}
		}));
	},
	/**
	 * 显示影像图
	 */
	showImageMap : function(){
		dojo.forEach(this.gisObj.baseLayer,dojo.hitch(this,function(layer, index){
			if(layer){
				layer.setVisibility(false)
			}
		}));
		
		dojo.forEach(this.gisObj.imageLayer,dojo.hitch(this,function(layer, index){
			if(layer){
				layer.setVisibility(true)
			}
		}));
	},
	/**
	 * 显示/隐藏 坐标信息
	 * @param {Object} showOrHide
	 */
	showCoordinate : function(showOrHide){
		showOrHide ? this.gisObj.addCoordinate() : this.gisObj.deleteCoordinate();
	},
	/**
	 * 
	 * @param {Object} showOrHide
	 */
	showToolPanel : function(showOrHide){
		showOrHide ? this.gisObj.toolPanel.showToolBarPanel() : this.gisObj.toolPanel.hideToolBarPanel();
	},
	/**
	 * 截屏
	 */
	screenCapture : function(){
		/*if(!this.ScreenCapture){
			dojo.require("AG.MicMap.gis.widget.ScreenCapture");
			this.ScreenCapture = new AG.MicMap.gis.widget.ScreenCapture(this.gisObj);
			this.ScreenCapture.startup();
		}
		this.ScreenCapture.capture();*/
	},
	/**
	 * 显示地图信息窗口
	 * @param {Object} x
	 * @param {Object} y
	 * @param {Object} title
	 * @param {Object} context
	 * @param {Object} width
	 * @param {Object} height
	 */
	showInfowindow : function(param){
		if(!this.gisObj.map.infoWindow){
			 var infoWindow = new InfoWindow({}, domConstruct.create("div"));
		     infoWindow.startup();
		     this.gisObj.map.setInfoWindow(infoWindow);
		}
		var lonlat = new esri.geometry.Point(parseFloat(param.x),parseFloat(param.y));
		var geom = esri.geometry.webMercatorUtils.geographicToWebMercator(lonlat);
		if(geom){
			this.gisObj.map.infoWindow.setTitle(param.title);
			this.gisObj.map.infoWindow.setContent(param.context);
			this.gisObj.map.infoWindow.resize(parseFloat(param.width),parseFloat(param.height));
			this.gisObj.map.infoWindow.show(this.gisObj.map.toScreen(lonlat), this.gisObj.map.getInfoWindowAnchor(this.gisObj.map.toScreen(lonlat)));
		}
	},
	/**
	 * 隐藏地图信息窗口
	 */
	hideInfowindow : function(){
		this.gisObj.map.infoWindow.hide();
	},
	addInfoTip : function(param){
		var infoTip = new AG.MicMap.gis.InfoTip(param.id,param.className || 'infoTip roundcorner bluegray',param.offset || {x:0,y:0},false,param.parentObject,param.alpha,"");
		infoTip.bindMap(this.gisObj.map);
		infoTip.setContent(param.context);
		infoTip.setLocation(param.location || 'right');
//		infoTip.setClass(param.className);
		infoTip.show(param.x,param.y);
		
//		dojo.connect(infoTip,'destroy',)
		
//		this._infoTipArray.push(infoTip);
		
		return infoTip;
	},
	/**
	 * 隐藏地图显示的所有DIV窗口
	 */
	hideInfoTip : function(){
		alert("建设中...")
	},
	/**
	 * 使用dojo.animateProperty来进行动画效果展示
	 * @param {Object} node
	 * @param {Object} start
	 * @param {Object} end
	 */
    fxResize: function(node, start, end){
        return dojo.animateProperty({
            node: node,
            properties: {
                left: {
                    start: start.left,
                    end: end.left
                },
                top: {
                    start: start.top,
                    end: end.top
                },
                width: {
                    start: start.width,
                    end: end.width
                },
                height: {
                    start: start.height,
                    end: end.height
                }
            },
            duration: this.duration,
            rate: this.rate,
            beforeBegin: dojo.hitch(this, function(){
                dojo.style(node, "display", "");
            }),
            onEnd: dojo.hitch(this, function(){
                dojo.style(node, "display", "none");
            })
        })
    },
	createImg: function(src){
        var node = document.createElement("img");
        node.src = selfUrl + "/themes/default/img/" + src;
        node.style.position = "absolute";
        node.style.zIndex = 9999;
        node.style.display = "none";
		node.style.width = 7;
		node.style.height = 7;
		
		var mapDiv = dojo.byId(this.gisObj.map.id);
		mapDiv.appendChild(node);
        return node;
    }
});