/**
 * 图层绘制类
 */

dojo.provide("extras.control.LayerDraw");
dojo.require("esri.graphic");
dojo.require("esri.geometry.webMercatorUtils");
dojo.require("esri.symbols.SimpleFillSymbol");
dojo.require("esri.symbols.SimpleLineSymbol");
dojo.require("esri.symbols.SimpleMarkerSymbol");
dojo.require("esri.symbols.PictureMarkerSymbol");
dojo.require("esri.symbols.PictureFillSymbol");
dojo.require("esri.symbols.Font");
dojo.require("esri.symbols.TextSymbol");
dojo.require("esri.toolbars.draw");

dojo.declare("extras.control.LayerDraw",null,{
	constructor:function(map)
	{
		//发布toolBarLoadedEvent监听
        dojo.subscribe("toolBarLoadedEvent", this, "initLayerDraw");
        
        //默认样式
        this.defaultSymbol = {
            "Point": {
            	type:"esriSMS",
            	style:"esriSMSCircle",
                angle: 0,
                color:[255,0,0,255],
                outline:{
                	type:"esriSLS",
                	style:"esriSLSSolid",
                	width:1.5,
                	color:[255,255,255]
                },
                size:6.75,
                xoffset:0,
                yoffset:0,
            },
            "Image": {
            	type:"esriPMS",
                angle: 0,
                width:32,
                height: 32,
                xoffset:0,
                yoffset:0,
                url: selfUrl + "/themes/default/img/tt.png"
            },
			"Text": {
				type:"esriTS",
                angle:0,
                color:[51,51,51,255],
                font:{
            		family:"微软雅黑",
            		size:12,
            		style:"normal",
            		variant:"normal",
            		weight:"normal"
                },
                horizontalAlignment:"center",
                kerning:true,
        		rotated:false,
        		text:"添加默认文本",
        		xoffset:0,
        		yoffset:0
            },
            "Line": {
                type:"esriSLS",
                style:"esriSLSSolid",
                width:3,
                color:[255,0,0,255]
            },
            "Polygon": {
            	type:"esriSFS",
                style:"esriSFSSolid",
                color:[0,0,0,64],
                outline:{
                	type:"esriSLS",
                	style:"esriSLSSolid",
                	width:1.5,
                	color:[255,0,0,255]
                }
            }
        };
	},
	initLayerDraw : function(toolbar){
		this.toolbar = toolbar;
	},
	addPictureFill:function(){
		var ext = esri.geometry.webMercatorUtils.geographicToWebMercator(new esri.geometry.Extent(60.568,13.978,67.668,32.678));
		var pictureFillSymbol = new esri.symbols.PictureFillSymbol({
			"url":selfUrl + "/themes/default/images/tt2.jpg",
		    "height":900,
		    "width":1200,
		    "type":"esriPMS"
		});
		
		pictureFillSymbol.setYScale(1);
		var attributs = {};
		var graphic = new esri.Graphic(ext,pictureFillSymbol,attributs);
		this.toolbar.drawLayer.add(graphic);
		return graphic;
	},
	addPointByImage:function(x,y,symbol,attributs){
		var pt = esri.geometry.webMercatorUtils.geographicToWebMercator(new esri.geometry.Point(parseFloat(x),parseFloat(y)));
		var pictureSymbol = new esri.symbols.PictureMarkerSymbol(symbol|| this.defaultSymbol.Image);
		var graphic = new esri.Graphic(pt,pictureSymbol,attributs);
		this.toolbar.drawLayer.add(graphic);
		return graphic;
	},
	addPointByText : function(x,y,textSymbol,attributs){
		var pt = esri.geometry.webMercatorUtils.geographicToWebMercator(new esri.geometry.Point(parseFloat(x),parseFloat(y)));
		var textsym = new esri.symbols.TextSymbol(textSymbol || this.defaultSymbol.Text);
		var graphic = new esri.Graphic(pt,textsym,attributs);
		this.toolbar.drawLayer.add(graphic);
		//graphic.node.style.textShadow = "1px 1px 1px red, 1px -1px 1px red, -1px 1px 1px red, -1px -1px 1px red";
		return graphic;
	},
	/**
	 * 添加线
	 * @param {Object} points	坐标数组
	 * @param {Object} style	线样式
	 */
	addPolyline : function(points,lineSymbol,attributs){
		var pt = esri.geometry.webMercatorUtils.geographicToWebMercator(new esri.geometry.Polyline(points));
		var textsym = new esri.symbols.SimpleLineSymbol(lineSymbol || this.defaultSymbol.Line);
		var graphic = new esri.Graphic(pt,textsym,attributs);
		this.toolbar.drawLayer.add(graphic);
		return graphic;
	},
	/**
	 * 添加面
	 * @param {Object} points	坐标数组
	 * @param {Object} style	面样式
	 */
	addPolygon : function(points,fillSymbol,attributs){
		var pt = esri.geometry.webMercatorUtils.geographicToWebMercator(new esri.geometry.Polygon(points));
		var textsym = new esri.symbols.SimpleFillSymbol(fillSymbol || this.defaultSymbol.Polygon);
		var graphic = new esri.Graphic(pt,textsym,attributs);
		this.toolbar.drawLayer.add(graphic);
		return graphic;
	},
	drawPointByMark:function(symbol,returnFunction){
		this.toolbar.draw(esri.toolbars.draw.POINT,new esri.symbols.SimpleMarkerSymbol(symbol ||this.defaultSymbol.Point),returnFunction);
	},
	/**
	 * 图上画点
	 * @param {Object} style	点样式
	 * @param {Object} returnFunction	返回点实体函数
	 */
	drawPointByImage : function(symbol,returnFunction){
		this.toolbar.draw(esri.toolbars.draw.POINT,new esri.symbols.PictureMarkerSymbol(symbol ||this.defaultSymbol.Image),returnFunction);
	},
	/**
	 * 图上画文字
	 * @param {Object} style	点样式
	 * @param {Object} returnFunction	返回点实体函数
	 */
	drawPointByText : function(textSymbol,returnFunction){
		this.toolbar.draw(esri.toolbars.draw.POINT,new esri.symbols.TextSymbol(textSymbol ||this.defaultSymbol.Text),returnFunction);
	},
	/**
	 * 图上画线
	 * @param {Object} style	线样式
	 * @param {Object} returnFunction	返回线实体函数
	 */
	drawPolyline : function(lineSymbol,returnFunction){
		this.toolbar.draw(esri.toolbars.draw.POLYLINE,new esri.symbols.SimpleLineSymbol(lineSymbol ||this.defaultSymbol.Line),returnFunction);
	},
	/**
	 * 图上画面
	 * @param {Object} style	面样式
	 * @param {Object} returnFunction	返回面实体函数
	 */
	drawPolygon : function(fillSymbol,returnFunction){
		this.toolbar.draw(esri.toolbars.draw.POLYGON,new esri.symbols.SimpleFillSymbol(fillSymbol ||this.defaultSymbol.Polygon),returnFunction);
	},
	/**
	 * 图上画圆
	 * @param {Object} style	圆样式
	 * @param {Object} returnFunction	返回圆实体函数
	 */
	drawCircle : function(fillSymbol,returnFunction){
		this.toolbar.draw(esri.toolbars.draw.CIRCLE,new esri.symbols.SimpleFillSymbol(fillSymbol ||this.defaultSymbol.Polygon),returnFunction);
	},
	/**
	 * 图上画矩形
	 * @param {Object} style	矩形样式
	 * @param {Object} returnFunction	返回矩形实体函数
	 */
	drawExtent : function(fillSymbol,returnFunction){
		this.toolbar.draw(esri.toolbars.draw.EXTENT,new esri.symbols.SimpleFillSymbol(fillSymbol ||this.defaultSymbol.Polygon),returnFunction);
	},
	/**
	 * 清除画图操作
	 */
	endDraw : function(){
		this.toolbar.deactivateToolbar();
	}
});