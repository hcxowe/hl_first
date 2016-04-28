/**
 * 地图定位工具类
 */

dojo.provide("extras.control.LayerLocate");
dojo.require("esri.graphic");
dojo.require("esri.symbols.PictureMarkerSymbol");
dojo.require("esri.symbols.SimpleMarkerSymbol");
dojo.require("esri.SpatialReference");
dojo.require("esri.layers.GraphicsLayer");
dojo.require("dojo.fx");

dojo.declare("extras.control.LayerLocate",null,{
	setIntervalhandler: null,
	locateLayer:null,
	constructor:function()
	{
		//发布mapLoadedEvent监听
        dojo.subscribe("mapLoadedEvent", this, "initLayerLocate");
        
        this.spatialReference = new esri.SpatialReference({ wkid: 102100 }); 
        this.duration = 1000;//动画持续时间
        this.rate = 50;//动画频率
        this.indexFill = 0;
        
        //定位闪烁样式
        this.hightSymbol = {
            "Point": {
            	"type": "esriPMS",
                "angle": 0,
                "width": 20,
                "height": 20,
                "xoffset": 0,
                "yoffset": 0,
                "url": selfUrl+"/themes/default/img/info.gif"
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
	initLayerLocate:function(map){
		this.map = map;
		if(!this.locateLayer){
			this.locateLayer = new esri.layers.GraphicsLayer({id:"GXX_GIS_LAYER_LOCATE"});
			this.map.addLayer(this.locateLayer);
		}
		
		if(this.line_1 == null || this.line_2 == null || this.line_3 == null || this.line_4 == null){
			this.line_1 = this.createImg("line_1.png");
	        this.line_2 = this.createImg("line_1.png");
	        this.line_3 = this.createImg("line_2.png");
	        this.line_4 = this.createImg("line_2.png");
		}
	},
	/**
	 * 清除定位结果
	 */
    unHightlightOnMap: function(){
        if (this.setIntervalhandler) {
            window.clearInterval(this.setIntervalhandler);
        }
		this.locateLayer.clear();
    },
    locate:function(geometry,isCenter,isEffect,zoom,style,fn,endStatic){
    	var center = null;
    	if(geometry){
    		geometry = esri.geometry.webMercatorUtils.geographicToWebMercator(geometry);//转为墨卡托投影
    		center = geometry;
    		
    		if (isEffect || (zoom == null || this.map.getZoom() <= zoom || isNaN(zoom))) {
    			this.startBoxEffect(this.map.toScreen(center));
    		}
    		
    		var me = this;
    		setTimeout(function(){
    			if(zoom == null && geometry.type != "point"){
        			//this.map.zoomToExtent(geometry);
        		}else{
        			if (isCenter || !(me.map.extent.intersects(center) || me.map.extent.contains(center))) {
        				 //this.map.centerAndZoom(center,zoom == null || isNaN(zoom) || (this.map.getZoom() > zoom)  ? this.map.getZoom() : zoom);
        				me.map.centerAndZoom(center,zoom);
        			}
        		}
        		
    			me.hightlightOnMap(geometry,endStatic,style);
    			
    			if(fn){
    				fn(center);
    			}
    		},1000);
    		
//    		if(zoom == null && geometry.type != "point"){
//    			//this.map.zoomToExtent(geometry);
//    		}else{
//    			if (isCenter || !(this.map.extent.intersects(center) || this.map.extent.contains(center))) {
//    				 //this.map.centerAndZoom(center,zoom == null || isNaN(zoom) || (this.map.getZoom() > zoom)  ? this.map.getZoom() : zoom);
//    				this.map.centerAndZoom(center,zoom);
//    			}
//    		}
//    		
//    		this.hightlightOnMap(geometry,false,style);
    	}
//    	return center;
    },
    locateByPoint:function(x,y,zoom,isCenter,isEffect,style,fn,endStatic){
    	var geometry = new esri.geometry.Point(x,y,this.spatialReference);
    	if(endStatic==undefined){
    		endStatic=true;
    	}
    	return this.locate(geometry,isCenter,isEffect,zoom,style,fn,endStatic);
    },
    locateByPolyline:function(points,zoom,isCenter, isEffect,style,fn,endStatic){
    	var geometry = null;
    	if(endStatic==undefined){
    		endStatic=true;
    	}
    	return this.locate(geometry,isCenter,isEffect,zoom.style,fn,endStatic);
    },
    locateByPolygon:function(){
    	var geometry = null;
    	return this.locate(geometry,isCenter,isEffect,zoom);
    },
    locateByGeometry:function(geometry,zoom,isCenter, isEffect,fn,endStatic){
    	if(endStatic==undefined){
    		endStatic=true;
    	}
    	return this.locate(geometry,isCenter, isEffect,zoom,fn,endStatic);
    },
    locateMultiGeometry:function(geometry){
    	if(typeof(geometry) == "object"){
    		geometry = [geometry];
    	}
    	
    	var exent = null;
    	this.map.zoomToExtent(extent);
    },
    hightlightOnMap:function(geometry,endStatic,style){
    	var graphic = null;
    	
    	switch(geometry.type){
    		case "multipoint":
    		case "point":
    			graphic = new esri.Graphic(geometry,style|| new esri.symbols.PictureMarkerSymbol(this.hightSymbol.Point));
        		break;
    		case "polygon":
    			graphic = new esri.Graphic(geometry,style);
    			break;
    		case "polyline":
    			graphic = new esri.Graphic(geometry,style);
    			break;
    	}
    	
    	this.unHightlightOnMap();
    	this.locateLayer.clear();
    	graphic.id = "locate_graphic";
    	this.locateLayer.add(graphic);
    	this.hightGraphic = graphic;
    	
    	var stateInterval = true;
 		var endStaticIndex = 0;
 		//通过定时器来实现闪烁效果
         this.setIntervalhandler = window.setInterval(dojo.hitch(this, function(){
 			endStaticIndex ++;
 			 var mapDiv = dojo.byId(this.hightGraphic.id);
             if (!this.hightGraphic) {
                 window.clearInterval(this.setIntervalhandler);
             }else{
 				/*for(var i = 0,il = this.hightGraphic.node.length;i < il; ++i){
 					dojo.style(this.hightGraphic.node[i], 'display', stateInterval ? "none" : "");
 				}*/
            	 if(stateInterval){
            		 this.hightGraphic.hide();
            	 }else{
            		 this.hightGraphic.show();
            	 }
 			 }
             stateInterval = !stateInterval;
 			 if(endStatic && endStaticIndex >= 8){
 				this.unHightlightOnMap();
 			 }
         }), 1000)
    },
    /**
	 * 定位动画效果
	 * @param {Object} center
	 */
    startBoxEffect: function(center){
//		return;
        var animations = [];
        var coords = dojo.coords(dojo.byId(this.map.id));
        
        animations.push(this.fxResize(this.line_1, {
            left: 0,
            top: center.y,
            width: 50,
            height: 9
        }, {
            left: center.x - 4,
            top: center.y - 4,
            width: 10,
            height: 9
        }));
        animations.push(this.fxResize(this.line_2, {
            left: coords.w,
            top: center.y,
            width: 50,
            height: 9
        }, {
            left: center.x - 4,
            top: center.y - 4,
            width: 10,
            height: 9
        }));
        animations.push(this.fxResize(this.line_3, {
            left: center.x,
            top: 0,
            width: 9,
            height: 50
        }, {
            left: center.x - 4,
            top: center.y,
            width: 9,
            height: 10
        }));
        animations.push(this.fxResize(this.line_4, {
            left: center.x,
            top: coords.h,
            width: 9,
            height: 50
        }, {
            left: center.x - 4,
            top: center.y - 10,
            width: 9,
            height: 10
        }));
        dojo.fx.combine(animations).play();
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
        
        var mapDiv = dojo.byId(this.map.id);
		mapDiv.appendChild(node);
        return node;
    }
});