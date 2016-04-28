/**
 * 
 */
dojo.provide("extras.MapInitObject");

dojo.require("dojo.dom-construct");
dojo.require("esri.map");
dojo.require("esri.graphic");
dojo.require("esri.Color");
dojo.require("esri.SpatialReference");
dojo.require("esri.geometry.Point");
dojo.require("esri.geometry.Polyline");
dojo.require("esri.geometry.webMercatorUtils");
dojo.require("esri.symbols.PictureFillSymbol");
dojo.require("esri.symbols.PictureMarkerSymbol");
dojo.require("esri.symbols.SimpleLineSymbol");
dojo.require("extras.control.ToolBar");
dojo.require("extras.control.LayerLocate");
dojo.require("extras.control.LayerDraw");
dojo.require("extras.control.MapControl");
dojo.require("extras.control.LayerManager");
dojo.require("extras.control.LayerQuery");
dojo.require("extras.InfoWindow");
dojo.require("extras.utils.MapUtil");
dojo.require("esri.dijit.OverviewMap");
dojo.require("extras.utils.GPSConvertor");
dojo.require("extras.layer.BaiduTiledMap");
dojo.require("extras.symbol.ArrowLineSymbol");
dojo.require("extras.layer.FlareClusterLayer");
dojo.require("esri.renderers.ClassBreaksRenderer");
dojo.require("esri.dijit.PopupTemplate");




dojo.declare("extras.MapInitObject",null,{
	mapId:null,
	map:null,
	mapParam:null,
	curLayer: {},//当前加载图层
	baseLayer : [],//电子地图栅格图层
	imageLayer : [],//影像栅格图层
	currentOptions : null,//地图初始化参数
	displaySingleFlaresAtCount:10,
	preClustered:false,
	areaDisplayMode:null,
	constructor:function(divId,options)
	{
		dojo.byId(divId).onselectstart = dojo.byId(divId).ondrag = function(){return false;};//IE下去掉DIV选中状态(其他浏览器的通过样式-moz-user-select : none取消了)
		this.mapId = divId;
		
		//发布mapLoadedEvent监听
        dojo.subscribe("mapLoadedEvent", this, "loadMapCompelete");
		
		this.spatialReference = new esri.SpatialReference({ wkid: 102100 });  
		//图层树控制类
        this.layerManager = new  extras.control.LayerManager();
        //图层查询控制类
        this.layerQuery = new extras.control.LayerQuery();
		//地图定位类
        this.layerLocate = new extras.control.LayerLocate();
		 //地图工具类
        this.toolbar = new extras.control.ToolBar(this);
        //地图常用方法
        this.baseUtil = new  extras.utils.MapUtil();
        //地图矢量图层操作
		this.layerDraw = new extras.control.LayerDraw();
		//地图控件操作
		this.mapcontrol = new extras.control.MapControl(this);
		
		this.bms={
			ip:null,
			port:null,
			userName:null,
			password:null
		};
		
		if(options){
			this.setMapOptions(options);
		}
	},
	setMapOptions:function(mapParam){
		this.mapParam = mapParam;
		this.currentOptions = {
			logo:false,
			slider:true,
			center:mapParam.center||new esri.geometry.Point(12615151.657772028,2645790.939302407,this.spatialReference),
			level:10
			/*zoom:mapParam.zoom,
			center:new esri.geometry.Point(mapParam.center,this.spatialReference)*/
		};
		if(this.map){
			dojo.mixin(this.map,this.currentOptions);
		}else{
			this.map = new esri.Map(this.mapId,this.currentOptions);
			this.map.spatialReference =new esri.SpatialReference({ wkid: 102113});
			//this.map.setInfoWindow(infoWindow);
			var mapLoadHandle = dojo.connect(this.map, "onLoad", dojo.hitch(this, function(map) {
				setTimeout(dojo.hitch(this, function() {
					if(this.currentOptions.center){
						if (this.map.center !== this.currentOptions.center) {
							//this.map.setExtent(params.extent);
							this.map.centerAndZoom(this.currentOptions.center, this.currentOptions.zoom || 10);
						}
					}
					dojo.publish("mapLoadedEvent", [this.map]);
				}), 1000);
				dojo.disconnect(mapLoadHandle);
			}));
		}
		
		this.removeCurLayers();
	},
	addDefaultLayers:function(){
		this.addLayers([{
    		"id": "100",
			"layerId":"GXX_XXXXX",
			"online":false,
			"name": "谷歌电子地图",
			"suffix": "png",
			"tileSize": "256",
			"tileType": "googlemap",
			"mapStyle":"roadmap",
			"tile_url": "http://192.168.16.177:8088"
    	}]);
	},
	/**
     * 添加地图图层
     * @param {Object} layers
     */
    addLayers: function(layers){
    	if(!(layers instanceof Array)){
    		layers = [layers];
    	}
    	
    	dojo.forEach(layers, dojo.hitch(this,function(layerObj, index){
    		var layer = this.createLayer(layerObj);
    		if(layer){
    			this.map.addLayer(layer);
    			//判断是电子地图还是影像图
				if(layerObj.featureType == "7"){
					this.imageLayer.push(layer);//影像图
				}else{
					this.baseLayer.push(layer);//电子地图
				}
    			this.curLayer[layerObj.name + "_" + layerObj.id] = layer;
    		}
		}));
    },
    createLayer:function(layerObj){
    	var layerType  = layerObj.tileType.toLowerCase();
    	if(layerType == "tiled"){
    		return this.createTiledLayer(layerObj);
    	}else if(layerType == "dynamic"){
    		return this.createDynamicLayer(layerObj);
    	}else if(layerType == "graphiclayer"){
    		return this.createGraphicLayer(layerObj);
    	}else if(layerType == "feature"){
    		return this.createFeatureLayer(layerObj);
    	}else if(layerType == "image"){
    		return this.createImageLayer(layerObj);
    	}else if(layerType == "wms"){
    		return this.createWMSLayer(layerObj);
    	}else if(layerType == "wfs"){
    		return this.createWFSLayer(layerObj);
    	}else if(layerType == "googlemap"){
    		return this.createGoogleMapLayer(layerObj);
    	}else if(layerType == "baidumap"){
    		return this.createBaiDuMapLayer(layerObj);
    	}else if(layerType == "tianditu"){
    		return this.createTianDiTuLayer(layerObj);
    	}
    },
    switchRoadMap:function(){
    	dojo.forEach(this.imageLayer,function(layerObj, index){
			layerObj.setVisibility(false);
		});
		
		dojo.forEach(this.baseLayer,function(layerObj, index){
			layerObj.setVisibility(true);
		});
    },
    switchSatelliteMap:function(){
    	dojo.forEach(GisObject.baseLayer,function(layerObj, index){
			layerObj.setVisibility(false);
		});
		
		dojo.forEach(GisObject.imageLayer,function(layerObj, index){
			layerObj.setVisibility(true);
		});
    },
    setInitCenter:function(x,y,zoom){
    	var xys = esri.geometry.webMercatorUtils.lngLatToXY(x,y);
    	var centerPt = new esri.geometry.Point(xys[0],xys[1],this.spatialReference);
    	if(this.map){
    		this.map.centerAndZoom(centerPt,parseInt(zoom)|| 10);
    	}
    },
    addZoomBar:function(){
    	if(!this.zoomBar){
    		this.zoomBar = "";
    	}
    	return this.zoomBar;
    },
    addCoordinate:function(){
    	if(!this.mousePosition){
    		
    	}
    	return addCoordinate;
    },
    showOverViewerMap:function(){
    	/*if(!this.omap){
    		this.omap = new esri.dijit.OverviewMap({  
                map: this.map,  
                visible: true  
            });  
    		this.omap.startup();  
    	}
    	this.omap.show();*/
    },
    loadMapCompelete:function(map){
    	dojo.require("extras.widget.ToolPanelWidget");
    	var theDiv = document.createElement("div");
		var mapDiv = dojo.byId(this.map.id);
		mapDiv.appendChild(theDiv);
		
    },
    addToolPanel:function(){
    	if(!this.toolPanel){
    		dojo.require("extras.widget.ToolPanelWidget");
    		//this.toolPanel = new extras.widget.ToolPanelWidget(this);
			//this.toolPanel.startup();
    	}
    	return this.toolPanel;
    },
    addScalebar:function(){
    	if(!this.scalebar){
    		
    	}
    	return this.scalebar;
    },
    addRightMenu:function(){
    	if(!this.rightMenu){
    		
    	}else{
    		
    	}
    	return this.rightMenu;
    },
    addLayerLabel:function(){
    	if(!this.label){
    		
    	}
    	return this.label;
    },
    createTiledLayer:function(layerObj){
    	dojo.require("esri.layers.ArcGISTiledMapServiceLayer");
    	var layer = new esri.layers.ArcGISTiledMapServiceLayer(layerObj);
    	return layer;
    },
    createGraphicLayer:function(layerObj){
    	dojo.require("esri.layers.GraphicsLayer");
    	var layer = new esri.layers.GraphicsLayer(layerObj);
    	return layer;
    },
    createDynamicLayer:function(layerObj){
    	dojo.require("esri.layers.ArcGISDynamicMapServiceLayer");
    	var layer = new esri.layers.ArcGISDynamicMapServiceLayer(layerObj);
    	return layer;
    },
    createFeatureLayer:function(layerObj){
    	dojo.require("esri.layers.FeatureLayer");
    	var layer = new esri.layers.FeatureLayer(layerObj);
    	return layer;
    },
    createImageLayer:function(layerObj){
    	dojo.require("esri.layers.ArcGISImageServiceLayer");
    	var layer = new esri.layers.ArcGISImageServiceLayer(layerObj);
    	return layer;
    },
    createWMSLayer:function(layerObj){
    	dojo.require("esri.layers.WMSLayer");
    	var layer = new esri.layers.WMSLayer(layerObj);
    	return layer;
    },
    createWFSLayer:function(layerObj){
    	dojo.require("esri.layers.WFSLayer");
    	var layer = new esri.layers.WFSLayer(layerObj);
    	return layer;;
    },
    createGoogleMapLayer:function(layerObj){
    	dojo.require("extras.layer.GoogleTiledMap");
    	var layer = new extras.layer.GoogleTiledMap(layerObj);
    	return layer;
    },
    createBaiDuMapLayer:function(layerObj){
    	var layer = new extras.layer.BaiduTiledMap(layerObj);
    	return layer;
    },
    createTianDiTuLayer:function(layerObj){
    	dojo.require("extras.layer.TianDiTuTiledMap");
    	var layer = new extras.layer.TianDiTuTiledMap(layerObj);
    	return layer;
    },
	removeCurLayers:function(){
		this.curLayer = {};
		this.baseLayer = [];
		this.imageLayer = [];
	},
	destroy:function(){
		if(this.mapcontrol){
			this.mapcontrol.destroy();
		}
				
		if(this.infoCloseHandle){
			dojo.disconnect(this._infoCloseHandle);
		}
		if(this.zoomBar){
			this.zoomBar.destroy();
			this.zoomBar = null;
		}
		if(this.omap){
			this.omap.destroy();
			this.omap = null;
		}
		if(this.scalebar){
			this.scalebar.destroy();
			this.scalebar = null;
		}
		if(this.rightMenu){
			this.rightMenu.clearBufferResult();
		}
		if(this.label){
			this.label.destroy();
			this.label = null;
		}
		if(this.toolbar){
			this.toolbar.destroy();
		}
				
		if(this.map != null){
			/*if(this.map.layers){
				for(var i = 0,il = this.map.layers.length;i < il; ++i){
					if(this.map.layers[i].CLASS_NAME == "AG.MicMap.Layer.Vector"){
						this.map.layers[i].removeAllFeatures();
					}
				}
			}*/
			this.map.destroy();
			this.map = null;
		}
	},
	drawDefaultTrack:function(){
		var picSymbol = new esri.symbols.PictureMarkerSymbol();
        picSymbol.setUrl(selfUrl+"/themes/default/img/filled-arrow.png");
        picSymbol.setHeight(12);
        picSymbol.setWidth(12);
        
        
        /*var basicOptions = {
        		style: esri.symbols.SimpleLineSymbol.STYLE_DASH,
                color: new esri.Color([51, 102, 255]),
                width: 2,
                directionSymbol: "arrow1",
                directionPixelBuffer: 60,
                directionColor: new esri.Color([204, 51, 0]),
                directionSize: 14
        };*/
        
        var pgOptions = {
                style: esri.symbols.SimpleLineSymbol.STYLE_SOLID,
                color: new esri.Color([255, 0, 0]),
                width: 3,
                directionSymbol: "arrow3",
                directionPixelBuffer: 80,
                directionColor: new esri.Color([255, 0, 0]),
                directionSize:16,
                directionScale: 1
            };

        var basicSymbol = new extras.symbol.ArrowLineSymbol(pgOptions);
        var points = [[113.316,23.12],[113.3474,23.1315],[113.3655,23.11393]];
        var basicPolyline = esri.geometry.webMercatorUtils.geographicToWebMercator(new esri.geometry.Polyline(points));
        var bg = new esri.Graphic(basicPolyline, basicSymbol, {}, null);
        //graphicsLayer.add(bg);
        if(this.toolbar.drawLayer){
        	this.toolbar.drawLayer.add(bg);
        }
        
        basicSymbol.stopAnimation();
        basicSymbol.animateDirection(20, 350);
	},
	loadDefaultCluster:function(){
		debugger;
		var clusterLayer = new extras.layer.FlareClusterLayer({
			 id: "flare-cluster-layer",
             spatialReference: this.spatialReference,
             subTypeFlareProperty: "facilityType",
             singleFlareTooltipProperty: "name",
             displaySubTypeFlares: true,
             displaySingleFlaresAtCount: this.displaySingleFlaresAtCount,
             flareShowMode: "mouse",
             preClustered: this.preClustered,
             clusterRatio: 65,
             clusterAreaDisplay: this.areaDisplayMode,
             clusteringBegin: function () {
                 console.log("clustering begin");
             },
             clusteringComplete: function () {
                 console.log("clustering complete");
             }
		});
		
		
		 var defaultSym = new esri.symbols.SimpleMarkerSymbol().setSize(6).setColor("#FF0000").setOutline(null)
         var renderer = new esri.renderers.ClassBreaksRenderer(defaultSym, "clusterCount");
         var xlSymbol = new esri.symbols.SimpleMarkerSymbol(esri.symbols.SimpleMarkerSymbol.STYLE_CIRCLE, 32, new esri.symbols.SimpleLineSymbol(esri.symbols.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([200, 52, 59, 0.8]), 1), new dojo.Color([250, 65, 74, 0.8]));
         var lgSymbol = new esri.symbols.SimpleMarkerSymbol(esri.symbols.SimpleMarkerSymbol.STYLE_CIRCLE, 28, new esri.symbols.SimpleLineSymbol(esri.symbols.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([41, 163, 41, 0.8]), 1), new dojo.Color([51, 204, 51, 0.8]));
         var mdSymbol = new esri.symbols.SimpleMarkerSymbol(esri.symbols.SimpleMarkerSymbol.STYLE_CIRCLE, 24, new esri.symbols.SimpleLineSymbol(esri.symbols.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([82, 163, 204, 0.8]), 1), new dojo.Color([102, 204, 255, 0.8]));
         var smSymbol = new esri.symbols.SimpleMarkerSymbol(esri.symbols.SimpleMarkerSymbol.STYLE_CIRCLE, 22, new esri.symbols.SimpleLineSymbol(esri.symbols.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([230, 184, 92, 0.8]), 1), new dojo.Color([255, 204, 102, 0.8]));
         renderer.addBreak(0, 19, smSymbol);
         renderer.addBreak(20, 150, mdSymbol);
         renderer.addBreak(151, 1000, lgSymbol);
         renderer.addBreak(1001, Infinity, xlSymbol);
         
         
         if (this.areaDisplayMode) {
             //if area display mode is set. Create a renderer to display cluster areas. Use SimpleFillSymbols as the areas are polygons
             var defaultAreaSym = new  esri.symbols.SimpleFillSymbol().setStyle( esri.symbols.SimpleFillSymbol.STYLE_SOLID).setColor(new dojo.Color([0, 0, 0, 0.2])).setOutline(new esri.symbols.SimpleLineSymbol( esri.symbols.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([0, 0, 0, 0.3]), 1));
             var areaRenderer = new  esri.renderers.ClassBreaksRenderer(defaultAreaSym, "clusterCount");
             var xlAreaSymbol = new  esri.symbols.SimpleFillSymbol( esri.symbols.SimpleFillSymbol.STYLE_SOLID, new  esri.symbols.SimpleLineSymbol( esri.symbols.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([200, 52, 59, 0.8]), 1), new dojo.Color([250, 65, 74, 0.8]));
             var lgAreaSymbol = new  esri.symbols.SimpleFillSymbol( esri.symbols.SimpleFillSymbol.STYLE_SOLID, new  esri.symbols.SimpleLineSymbol( esri.symbols.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([41, 163, 41, 0.8]), 1), new dojo.Color([51, 204, 51, 0.8]));
             var mdAreaSymbol = new  esri.symbols.SimpleFillSymbol( esri.symbols.SimpleFillSymbol.STYLE_SOLID, new  esri.symbols.SimpleLineSymbol( esri.symbols.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([82, 163, 204, 0.8]), 1), new dojo.Color([102, 204, 255, 0.8]));
             var smAreaSymbol = new  esri.symbols.SimpleFillSymbol( esri.symbols.SimpleFillSymbol.STYLE_SOLID, new  esri.symbols.SimpleLineSymbol( esri.symbols.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([230, 184, 92, 0.8]), 1), new dojo.Color([255, 204, 102, 0.8]));

             areaRenderer.addBreak(0, 19, smAreaSymbol);
             areaRenderer.addBreak(20, 150, mdAreaSymbol);
             areaRenderer.addBreak(151, 1000, lgAreaSymbol);
             areaRenderer.addBreak(1001, Infinity, xlAreaSymbol);

             //use the custom overload of setRenderer to include the renderer for areas.
             clusterLayer.setRenderer(renderer, areaRenderer);
         }
         else {
             clusterLayer.setRenderer(renderer); //use standard setRenderer.
         }
         
         //set up a popup template
         var template = new esri.dijit.PopupTemplate({
             title: "{name}",
             fieldInfos: [
               { fieldName: "facilityType", label: "Facility Type", visible: true },
               { fieldName: "postcode", label: "Post Code", visible: true },
               { fieldName: "isOpen", label: "Opening Hours", visible: true }
             ]
         });
         clusterLayer.infoTemplate = template;
         this.map.infoWindow.titleInBody = false;
		 this.map.addLayer(clusterLayer);
		 
		 var data = [];
		 for(var i=0,il=5000;i<il;i++){
			 var aa = esri.geometry.webMercatorUtils.xyToLngLat(12557877.595482401,2596928.9267310356, true);
			 var bb = esri.geometry.webMercatorUtils.xyToLngLat(12723134.450635016,2688653.360673282,true);
			 var ptX = this.getRandom(aa[0],bb[0]);
			 var ptY = this.getRandom(aa[1],bb[1]);
			 
			 var pt = esri.geometry.webMercatorUtils.geographicToWebMercator(new esri.geometry.Point(ptX,ptY));
			 
			 data.push({
				 "name":"cluster_"+i,
				 "facilityType":"Gxx_"+(i%10),
				 "x":pt.x,
				 "y":pt.y
			 });
		 }
		 
		 clusterLayer.addData(data);
		 //clusterLayer.refresh();
	},
	getRandom:function(max,min){
		return min+Math.random()*(max-min);
	},
	test:function(x,y){
		
		var pointObj = extras.utils.GPSConvertor.transferWgs84ToBaidu(x,y);
		
		 var pt01 = esri.geometry.webMercatorUtils.geographicToWebMercator(new esri.geometry.Point(pointObj.lon,pointObj.lat));
		 var pt02 = extras.utils.MapUtil.geographicToWebMercator(new esri.geometry.Point(x,y));
	}
});