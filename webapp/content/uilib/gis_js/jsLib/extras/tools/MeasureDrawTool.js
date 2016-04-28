/**
 * 测量工具类
 */
dojo.provide("extras.tools.MeasureDrawTool");
dojo.require("dojo._base.event");
dojo.require("esri.toolbars.draw");
dojo.require("esri.symbols.SimpleMarkerSymbol");
dojo.require("esri.symbols.SimpleLineSymbol");
dojo.require("esri.symbols.SimpleFillSymbol");
dojo.require("esri.symbols.PictureMarkerSymbol");
dojo.require("esri.symbols.Font");
dojo.require("esri.symbols.TextSymbol");
dojo.require("esri.layers.GraphicsLayer");
dojo.require("esri.graphic");
dojo.require("esri.Color");
dojo.require("esri.units");
dojo.require("esri.geometry.geodesicUtils");
dojo.require("esri.geometry.webMercatorUtils");



dojo.declare("extras.tools.MeasureDrawTool",[esri.toolbars.draw],{
	DISTANCE:"distance",
	AREA:"area",
	AREARPRE:"measure_area_",
	DISTANCEPRE:"measure_distance_",
	drawType:null,
	points:[],
	latestEndPoint:null,
	lastClickPoint:null,
	isRunning:false,
	lineSymbol:null,
	fillSymbol:null,
	measureLayer:null,
	constructor: function (map,options) {
		this.inherited(arguments);
		this.points = [];
		this._onMapClickHandler = dojo.hitch(this, this._onMapClickHandler);
		//this._onMapDoubleClickHandler = dojo.hitch(this, this._onMapDoubleClickHandler);
		this._onDrawEndHandler = dojo.hitch(this, this._onDrawEndHandler);
		this._closeGraphicHandler = dojo.hitch(this, this._closeGraphicHandler);
		this.measureLayer = new esri.layers.GraphicsLayer({id:"GXX_GIS_MEAREALAYER_RESULT"});
		if(this.map){
			this.map.addLayer(this.measureLayer);
		}
		//this.lineSymbol = new esri.symbols.SimpleLineSymbol(esri.symbols.SimpleFillSymbol.STYLE_SOLID,"#FF7839",1,2);
		//this.fillSymbol = new esri.symbols.SimpleFillSymbol(esri.symbols.SimpleFillSymbol.STYLE_SOLID,"#FF372D",0.39,new esri.symbols.SimpleLineSymbol(esri.symbols.SimpleLineSymbol.STYLE_SOLID,"#FF7839",1,2));
	},
	activate:function(geometryType,options){
		this.inherited(arguments);
		this.drawType = geometryType;
		var map = this.map;

		map.reorderLayer(this.measureLayer,map._layers.length -1);
		
		this._onMapClickHandler_connect = dojo.connect(map,"onClick", this._onMapClickHandler);
        //this._onMapDoubleClickHandler_connect = dojo.connect(map,"onDblClick", this._onMapDoubleClickHandler);
        this._onDrawEndHandler_connect = dojo.connect(this,"onDrawEnd", this._onDrawEndHandler);
		this.points = [];
		this.isRunning = true;
		this.setTipsText("单击开始测量");
	},
	deactivate:function(){
		this.inherited(arguments);
		
		dojo.disconnect(this._onMapClickHandler_connect);
		dojo.disconnect(this._onMapDoubleClickHandler_connect);
		dojo.disconnect(this._onDrawEndHandler_connect);
		
		if(this.isRunning){
			suffix = this.drawType = esri.toolbars.draw.POLYGON ? this.AREARPRE:this.DISTANCEPRE;
			tmpId = suffix + djConfig.measureTotal;
			this.deleteGraphicById(tmpId);
			this.isRunning = false;
		}
	},
	_onMapClickHandler:function(evt){
		var endPoint = evt.mapPoint;
		this.lastClickPoint = endPoint;
		this.points.push(this.lastClickPoint);
		
		var num = 0;
		if(this.drawType == esri.toolbars.draw.POLYGON){
			this.updateMeasureArea();
			num = 2;
		}else if(this.drawType == esri.toolbars.draw.POLYLINE){
			this.updateMeasureDistance();
			num = 1;
		}
		
		if(this.points.length >= num){
			this.setTipsText("双击结束测量");
		}else{
			this.setTipsText("单击继续绘制");
		}
	},
	_onMapDoubleClickHandler:function(evt){
		this.points.pop();
		if(this.drawType == esri.toolbars.draw.POLYGON && this.points.length < 3){
			this.onDrawEnd();
		}
	},
	_onDrawEndHandler:function(geometry){
		var deleteTimer = null;
		var deleftTimerEndHandler= null;
		if(this.drawType == esri.toolbars.draw.POLYGON){
			if(this.points.length < 3){
				deleftTimerEndHandler = dojo.hitch(this,function(){
					var tmpId = this.AREARPRE + djConfig.measureTotal;
					this.deleteGraphicById(tmpId);
					clearInterval(deleteTimer);
					deleteTimer = null;
				});
				alert("无法测量面积，请重新绘制");
				this.points = [];
				deleteTimer = setInterval(deleftTimerEndHandler,200);
				return;
			}
			this.finishMeasureArea(new esri.Graphic(geometry));
			dojo.disconnect(this._onMapClickHandler_connect);
		}else if(this.drawType == esri.toolbars.draw.POLYLINE){
			this.finishMeasureDistance(new esri.Graphic(geometry));
			dojo.disconnect(this._onMapClickHandler_connect);
		}
		this.points = [];
	},
	updateMeasureArea:function(){
		var point = this.points[this.points.length -1];
		this.drawCircle(point,this.AREA);
	},
	updateMeasureDistance:function(){
		var pt = null;
		var tmpGraphic = null;
		var atrributes = {};
		atrributes.id = this.DISTANCEPRE + djConfig.measureTotal;
		var textsym = new esri.symbols.TextSymbol();
		var font  = new esri.symbols.Font();
		font.setSize("12px");
		font.setFamily("微软雅黑");
		textsym.setFont(font);
		textsym.setColor(new esri.Color("#000000"));
		textsym.setOffset(40,-5);
		
		if(this.points.length == 1){
			pt = this.points[this.points.length - 1];
			this.drawCircle(pt,this.DISTANCE);
			textsym.setOffset(20,-10);
			textsym.setText("起点");
			tmpGraphic = new esri.Graphic(pt,textsym,atrributes);
			this.measureLayer.add(tmpGraphic)
		}else{
			pt = this.points[this.points.length -1];
			this.drawCircle(pt,this.DISTANCE);
		}
	},
	finishMeasureArea:function(graphic){
		var tmpId = this.AREARPRE + djConfig.measureTotal;
		var attributes = {};
		attributes.id = tmpId;
		graphic.attributes = attributes;
		var transferPolygon = null;
		var resultArray= null;
		graphic.setSymbol(this.fillSymbol);
		this.measureLayer.add(graphic);
		this.latestEndPoint = this.points[this.points.length -1];
		var polygon = graphic.geometry;

		if(!this.isWebMercator(polygon.spatialReference)){
			resultArray = esri.geometry.geodesicUtils.geodesicAreas([polygon],esri.units.SQUARE_METERS);
		}else{
			transferPolygon = esri.geometry.webMercatorUtils.webMercatorToGeographic(polygon);
			resultArray = esri.geometry.geodesicUtils.geodesicAreas([transferPolygon],esri.units.SQUARE_METERS);
		}
		
		var resultTxt = resultArray[0];
		this.drawResult(this.latestEndPoint,resultTxt,this.AREA);
		this.points = [];
	},
	finishMeasureDistance:function(graphic){
		var transferPolyline = null;
		var tmpId = this.DISTANCEPRE + djConfig.measureTotal;
		var attr = {}
		attr.id = tmpId;
		graphic.attributes = attr;
		
		graphic.setSymbol(this.lineSymbol);
		this.measureLayer.add(graphic);
		this.latestEndPoint = this.points[this.points.length - 1];
		var resultArray = null;
		var polyline = graphic.geometry;
		if(!this.isWebMercator(polyline.spatialReference)){
			resultArray = esri.geometry.geodesicUtils.geodesicLengths([polyline],esri.units.METERS);
		}else{
			transferPolyline = esri.geometry.webMercatorUtils.webMercatorToGeographic(polyline);
			resultArray = esri.geometry.geodesicUtils.geodesicLengths([transferPolyline],esri.units.METERS);
		}

		var resultTxt = resultArray[0];
		this.drawCircle(this.latestEndPoint,this.DISTANCE);
		this.drawResult(this.latestEndPoint,resultTxt,this.DISTANCE);
		this.measureLengthsCount = 0;
		this.points = [];
	},
	isWebMercator:function(reference){
		var resultFlag = false;
		
		switch(reference.wkid){
			case 100112:{
				resultFlag = true;
				break;
			}
			case 102113:{
				resultFlag = true;
				break;
			}
			case 102100:{
				resultFlag = true;
				break;
			}
			case 3857:{
				resultFlag = true;
				break;
			}
			case 3785:{
				resultFlag = true;
				break;
			}
		}
		return resultFlag;
	},
	drawCircle:function(centerPt,type){
		var circle = null;
		var timer;
		var timerEndHandler = null;
		var point = centerPt;
		
		var circleSymbol = new esri.symbols.SimpleMarkerSymbol(esri.symbols.SimpleMarkerSymbol.STYLE_CIRCLE, 9, new esri.symbols.SimpleLineSymbol(esri.symbols.SimpleLineSymbol.STYLE_SOLID, new esri.Color([255,0,0]), 2), new dojo.Color([255,255,255,1]));
		//var circleSymbol = new esri.symbols.SimpleMarkerSymbol(esri.symbols.SimpleMarkerSymbol.STYLE_CIRCLE,9,new esri.Color("#FFFFFF"),1,0,0,0,new esri.symbols.SimpleLineSymbol(esri.symbols.SimpleLineSymbol.STYLE_SOLID,0xFF0000,1,2));
		circle = new esri.Graphic(point,circleSymbol);
		var attr = new Object();
		if(type == this.DISTANCE){
			attr.id = this.DISTANCEPRE + djConfig.measureTotal;
			circle.attributes = attr;
			this.measureLayer.add(circle);
		}else{
			timerEndHandler = dojo.hitch(this,function(){
				this.measureLayer.add(circle);
				clearInterval(timer);
				timer = null;
			});
			attr.id = this.AREARPRE + djConfig.measureTotal;
			dojo.hitch(this, timerEndHandler);
			timer = setInterval(timerEndHandler,200);
			circle.attributes = attr;
		}
	},
	drawResult:function(pt,result,type){
		var resultText = this.getResultText(result,type);
		var textSymbol = new esri.symbols.TextSymbol();
		var p_close = selfUrl+"/themes/default/img/close-btn.png"
		var closeMarkSymbol = new esri.symbols.PictureMarkerSymbol(p_close,12,12);
		closeMarkSymbol.setOffset(13,0);
		var textsym = new esri.symbols.TextSymbol();
		var font  = new esri.symbols.Font();
		font.setSize("12px");
		font.setFamily("微软雅黑");
		textsym.setFont(font);
		textsym.setColor(new esri.Color("#333333"));
		textsym.setOffset(50,-20);
		textsym.setText(resultText);
		
		
		var txtGraphic = new esri.Graphic(pt,textsym);
		var closeGraphic = new esri.Graphic(pt,closeMarkSymbol);
		
		var attr = {};
		if(type == this.DISTANCE){
			attr.id = this.DISTANCEPRE + djConfig.measureTotal;
		}else{
			attr.id = this.AREARPRE + djConfig.measureTotal;
		}
		txtGraphic.attributes = attr;
		closeGraphic.attributes = attr;
		closeGraphic.close = true;
		
		dojo.connect(this.measureLayer,"onClick",this._closeGraphicHandler);
		
		this.measureLayer.add(txtGraphic);
		this.measureLayer.add(closeGraphic);
		
		var node = txtGraphic.getNode();
		console.log(node);
		//closeGraphic.addEventListener(MouseEvent.CLICK,this.closeGraphicHandler);
		djConfig.measureTotal++;
		this.isRunning = false;
		this.deactivate();
	},
	_closeGraphicHandler:function(evt){
		dojo._base.event.stop(evt);
		var closeGraphic = evt.graphic;
		if(closeGraphic&&closeGraphic.close){
			var id = closeGraphic.attributes.id;
			this.deleteGraphicById(id);
			djConfig.measureTotal--;
		}
	},
	deleteGraphicById:function(id){
		var graphicProvider = this.measureLayer.graphics;
		for(var i = graphicProvider.length -1;i>=0;i--){
			var graphic = graphicProvider[i];
			if(graphic && graphic.attributes){
				if(id == graphic.attributes.id){
					this.measureLayer.remove(graphic);
				}
			}
		}
	},
	getResultText:function(result,type){
		var resultTxt = "";
		var allTxt = "";
		var unitTxt = "";
		if(type == this.DISTANCE){
			allTxt = "总长：";
			unitTxt = " 米";
			if(result > 1000){
				unitTxt = " 公里";
				result = result/1000;
			}
			result = Math.floor(result * 100)/100;
		}else{
			allTxt = "面积： ";
			unitTxt = "平方米";
			if(result > 1000000){
				result = result / 1000000;
				unitTxt = " 平方公里";
			}
			result = Math.floor(result *100)/ 100;
		}
		
		result = result < 0?(0): result;
		resultTxt = result.toFixed(2);
		//resultTxt = allTxt +"<font color='#ff372d'><B>"+ resultTxt +"</B></font>"+ unitTxt;
		resultTxt = allTxt + resultTxt + unitTxt;
		return resultTxt;
	},
	clearAll:function(){
		var keyword = "measure_";
		var graphicProvider = this.measureLayer.graphics;
		for(var graphic in graphicProvider){
			if(graphic.attributes != null){
				if(graphic.attributes.id.indexOf(keyword) > -1){
					this.measureLayer.remove(graphic);
				}
			}
		}
		djConfig.measureTotal = 0;
	},
	setTipsText:function(message){
		var tooltip = this._tooltip;
        if (!tooltip){
            return;
        }
        tooltip.innerHTML = message;   
	}
});
