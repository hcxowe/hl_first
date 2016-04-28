/**
 * 图层管理类
 */
dojo.provide("extras.control.LayerManager");
dojo.require("esri.graphic");
dojo.require("esri.SpatialReference");
dojo.require("esri.geometry.Point");
dojo.require("esri.geometry.Extent");
dojo.require("esri.geometry.Multipoint");
dojo.require("esri.geometry.webMercatorUtils");
dojo.require("esri.symbols.PictureMarkerSymbol");
dojo.require("esri.layers.GraphicsLayer");
dojo.require("esri.dijit.PopupTemplate");

dojo.declare("extras.control.LayerManager",null,{
	constructor:function()
	{
		dojo.subscribe("toolBarLoadedEvent", this, "setToolbar");
		this.initLayer();
		this._infoTip = null;
	},
	setToolbar : function(toolbar){
		this.toolbar = toolbar;
		this.map = toolbar.map;
	},
	initLayer:function(){
		this.layerContainer = {};
	},
	addOneGraphicToMap:function(layerId,graphicObj,isClear){
		if(typeof graphicObj == "string"){
			graphicObj = dojo.fromJson(graphicObj);
		}
		var layer = this.createLayerById(layerId,isClear);
		if(layer){
			try{
				var idKey = graphicObj.id;
				var ptObj = graphicObj.geometry;
				var point = esri.geometry.webMercatorUtils.geographicToWebMercator(new esri.geometry.Point(ptObj.x,ptObj.y));
				var symbol = new esri.symbols.PictureMarkerSymbol(graphicObj.symbol);
				var attributes = graphicObj.attributes;
				var graphic = new esri.Graphic(point,symbol,attributes);
				graphic.id = idKey;
				layer.add(graphic);
				
				dojo.connect(layer, "onClick", dojo.hitch(this,function(evt) {
					this.toolbar.showInfoWindow(evt.graphic);
		        }));
			}catch(e){
				
			}
		}
	},
	/**
	 * 删除所有图元
	 * layerId:图层id
	 * fn:回调函数
	 */
	removeAllGraphicFromMap:function(layerId,fn){
		var layer = this.createLayerById(layerId,false);
		if(layer){
			var code = 1;
			try{
				layer.clear();
			}catch(ex){
				code = -1;
			}
			if(fn){
				fn.apply(this,[{"code":code}]);
			}
		}
	},
	/**
	 * 删除gaphic
	 * layerId:图层id
	 * gId:graphic的唯一标识
	 * fn:回调函数
	 */
	removeGraphicFromMap:function(layerId,gId,fn){
		var layer = this.createLayerById(layerId,false);
		if(layer){
			var graphic = this.getGrahpicById(layer,gId);
			if(graphic){
				var code = 1;
				try{
					layer.remove(graphic);
				}catch(ex){
					code = -1;
				}
				
				if(fn){
					fn.apply(this,[{"code":code}]);
				}
			}
		}
	},
	/**
	 * layerId:图层id
	 * graphicType:0:markger,1:polyline,2:polygon
	 * graphicObj:图形json对象
	 * isClear:是否需要先进行清洗数据
	 * fn:回调函数
	 */
	addGraphicToMap:function(layerId,graphicType,graphicObj,isClear,fn){
		if(dojo.isString(graphicObj)){
			graphicObj = dojo.fromJson(graphicObj);
		}
		var layer = this.createLayerById(layerId,isClear);
		this.addGraphic2Layer(layer,graphicObj,graphicType);
		if(fn){
			dojo.connect(layer,"onClick",function(evt){
				fn(layer,evt);
			});
		}
	},
	createLayerById:function(layerId,isClear){
		var layer = null;
		if(layerId){
			layer = this.layerContainer[layerId];
			if(!layer){
				layer = new esri.layers.GraphicsLayer({id:layerId});
				//layer.setScaleRange(2311162.217155,1128.497176);
				this.map.addLayer(layer);
				this.layerContainer[layerId] = layer;
				
				dojo.connect(layer,"onClick",function(evt){
		    		try{
		    			graphicClickHandler(evt);
		    		}catch(e){
		    			
		    		}
		    	});
			}
		}else{
			layer = this.map.graphics;
		}
		
		if(isClear){
			layer.clear();
		}
		this.map.reorderLayer(layer,this.map._layers.length -1);
		return layer;
	},
	/**
	 * @description 将图元添加到图层
	 * @param layer	图层
	 * @param graphicObj	图元配置项
	 * @param graphicType	图元类型	0:图标，1，2
	 */
	addGraphic2Layer : function(layer,graphicObj,graphicType){
		try{
			var showpopuptype = graphicObj.showpopuptype; //默认0只显示文本，1显示图片，2显示视频，
			var geometriesArr = graphicObj.geometries;
			var symbolObj = graphicObj.symbol;
			var infoTemplateObj = graphicObj.infotemplate;
			
			if(!geometriesArr) return;
			var infoTemplate = null;
			//var mulitPoint = new esri.geometry.Multipoint();
			for(var i=0,il=geometriesArr.length;i<il;i++){
				var idKey =  geometriesArr[i].id;
				var attributes = geometriesArr[i].attributes;
				var geometry = null;
				var symbol = null;
				switch(graphicType){
					case 0:
						geometry = esri.geometry.webMercatorUtils.geographicToWebMercator(new esri.geometry.Point(geometriesArr[i].x,geometriesArr[i].y));
						symbol = new esri.symbols.PictureMarkerSymbol(geometriesArr[i].symbol ||symbolObj);
						break;
					case 1:
						geometry = esri.geometry.webMercatorUtils.geographicToWebMercator(new esri.geometry.Polyline(geometriesArr[i].paths));
						symbol = new esri.symbols.SimpleLineSymbol(symbolObj);
						break;
					case 2:
						geometry = esri.geometry.webMercatorUtils.geographicToWebMercator(new esri.geometry.Polygon(geometriesArr[i].rings));
						symbol = new esri.symbols.SimpleFillSymbol(symbolObj);
						break;
				}
				var graphic = this.getGrahpicById(layer,idKey);
				if(graphic){
					if(geometry){
						graphic.setGeometry(geometry)	
					}
					if(attributes){
						graphic.setAttributes(attributes)
					}	
					if(symbol){
						graphic.setSymbol(symbol)
					}
					if(infoTemplateObj){
						if(showpopuptype==undefined){
							//做其他处理
						}else if(showpopuptype == 0||showpopuptype == 1){
							this.map.infoWindow.resize(830, 430);
							infoTemplate = new esri.dijit.PopupTemplate(infoTemplateObj);
							graphic.setInfoTemplate(infoTemplate);
						}else if(showpopuptype == 2){
							this.map.infoWindow.resize(330, 230);
							infoTemplate = new esri.dijit.PopupTemplate({"title":'测试'});
							var valueObj = infoTemplateObj.mediaInfos[0].value;
							var szNodeIdField = valueObj.szNodeId;
							var szNodeNameField = valueObj.szNodeName;
							var szNodeId = attributes[szNodeIdField];
							var szNodeName = attributes[szNodeNameField];
							var params = "videoValue="+encodeURIComponent(szNodeId)+"&bmsIp="+encodeURIComponent(GisObject.bms.ip)+"&bmsPort="+encodeURIComponent(GisObject.bms.port)+
										 "&bmsUserName="+encodeURIComponent(GisObject.bms.userName)+"&bmsPassword="+encodeURIComponent(GisObject.bms.password);
							infoTemplate.setContent("<iframe width=300 height=210 frameborder='no' border='0' src='"+selfUrl+"/playRealtimeVideo.jsp?"+params+"'></iframe>");
							graphic.setInfoTemplate(infoTemplate);
						}else if(showpopuptype == 3){
							
						}
					}
					graphic.refresh();
				}else{
					graphic = new esri.Graphic(geometry,symbol,attributes);
					graphic.id = idKey;
					
					if(infoTemplateObj){
						if(showpopuptype==undefined){
							//做其他处理
						}else if(showpopuptype == 0||showpopuptype == 1){
							this.map.infoWindow.resize(630, 430);
							infoTemplate = new esri.dijit.PopupTemplate(infoTemplateObj);
							//infoTemplate.setContent(this.getTemplate());
							graphic.setInfoTemplate(infoTemplate);
						}else if(showpopuptype == 2){
							this.map.infoWindow.resize(330, 230);
							infoTemplate = new esri.dijit.PopupTemplate({"title":'测试'});
							var valueObj = infoTemplateObj.mediaInfos[0].value;
							var szNodeIdField = valueObj.szNodeId;
							var szNodeNameField = valueObj.szNodeName;
							var szNodeId = attributes[szNodeIdField];
							var szNodeName = attributes[szNodeNameField];
							var params = "videoValue="+encodeURIComponent(szNodeId)+"&bmsIp="+encodeURIComponent(GisObject.bms.ip)+"&bmsPort="+encodeURIComponent(GisObject.bms.port)+
							 			 "&bmsUserName="+encodeURIComponent(GisObject.bms.userName)+"&bmsPassword="+encodeURIComponent(GisObject.bms.password);
							infoTemplate.setTitle(szNodeName);
							infoTemplate.setContent("<iframe width=300 height=210 frameborder='no' border='0' src='"+selfUrl+"/playRealtimeVideo.jsp?"+params+"'></iframe>");
							graphic.setInfoTemplate(infoTemplate);
						}else if(showpopuptype == 3){
							
						}
					}
					layer.add(graphic);
				}
			}
		}catch(e){
			throw new Error("图元添加到图层时错误!" + e);
		}
	},
	getGrahpicById:function(layer,idKey){
		if(dojo.isString(layer)){
			layer = this.map.getLayer(layer);
		}
		var graphicsArr = layer.graphics; 
		for(var i=0,il=graphicsArr.length;i<il;i++){
			if(graphicsArr[i].id == idKey){
				return graphicsArr[i];
			}
		}
		return null;
	},
	getLayerStyle:function(){
		
	},
	destroy:function(){
		for(var a in this.layerContainer){
			this.layerContainer[a].destroy();
		}
		this.layerContainer = {};
	},
	getTemplate : function(){
		//var tem = dojo.byId("carPopupMsg").innerHTML;
		var tem = '<div class="grid car-msg">'
		+'<div class="grid-col col-6 pull-left">'
		+	'<div class="thumbnail">'
		+		'<a><img src="/cbds/resources/images/test/example.jpg" alt="carimage"></a>'
		+	'</div>'
		+'</div>'
	    +'<div class="grid-col col-6 pull-left text" id="carProp">'
		+  '  <p class="carNum">'
		+  '		<span class="text-label">车牌号码：</span>'
		+  '		<span class="text-txt">${carNum}</span>'
		+  '	</p>'
		+  '	<p class="bayonet">'
		+  '		<span class="text-label">经过卡口：</span>'
		+  '		<span class="text-txt">${bayonet}</span>'
		+  '	</p>'
		+  '	<p class="carNumColor">'
		+  '		<span class="text-label">车牌颜色：</span>'
		+  '		<span class="text-txt">${carNumColor}</span>'
		+  '	</p>'
		+  '	<p class="carLogo">'
		+  '		<span class="text-label">车牌品牌：</span>'
		+  '		<span class="text-txt">${carLogo}</span>'
		+  '	</p>'
		+  '	<p class="carType">'
		+  '		<span class="text-label">车牌类型：</span>'
		+  '		<span class="text-txt">${carNumType}</span>'
		+  '	</p>'
		+  '	<p class="carColor">'
		+  '		<span class="text-label">车辆颜色：</span>'
		+  '		<span class="text-txt">${carColor}</span>'
		+  '	</p>'
		+  '	<p class="carNumColor">'
		+  '		<span class="text-label">经过速度：</span>'
		+  '		<span class="text-txt">${carSpeed}</span>'
		+  '	</p>'
		+  '	<p class="driveWay">'
		+		'<span class="text-label">通过车道：</span>'
		+		'<span class="text-txt">${driveway}</span>'
		+	'</p>'
		+	'<p class="passTime">'
		+		'<span class="text-label">通过时间：</span>'
		+		'<span class="text-txt">${passTime}</span>'
		+	'</p>'
		+'</div>';
		return tem;
	}
});