/**
 * 地图工具类
 */
dojo.provide("extras.control.ToolBar");
dojo.require("esri.layers.GraphicsLayer");
dojo.require("esri.toolbars.navigation");
dojo.require("esri.toolbars.draw");
dojo.require("extras.tools.MeasureDrawTool");
dojo.require("esri.symbols.SimpleFillSymbol");
dojo.require("esri.symbols.SimpleLineSymbol");
dojo.require("esri.symbols.SimpleMarkerSymbol");
dojo.require("esri.symbols.PictureMarkerSymbol");
dojo.require("esri.symbols.Font");
dojo.require("esri.symbols.TextSymbol");


dojo.declare("extras.control.ToolBar",null,{
	gisObject:null,
	map:null,
	constructor:function(gisObject)
	{
		this.gisObject = gisObject;
		
		//发布mapLoadedEvent监听
        dojo.subscribe("mapLoadedEvent", this, "initToolbar");
	},
	initToolbar:function(map){
		this.map = map;
		try{
			this.navToolbar = new esri.toolbars.Navigation(this.map);
			this.drawToolbar = new esri.toolbars.Draw(this.map);
			this.measureToolbar = new extras.tools.MeasureDrawTool(this.map);
			
			this.drawLayer = new esri.layers.GraphicsLayer({id:"GXX_GIS_DRAW_LAYER"});
			this.map.addLayer(this.drawLayer);
			this.pan();
		}catch(e){
			
		}
		
		dojo.publish("toolBarLoadedEvent", [this]);
	},
	 setMouseCursor: function(type){
        var cur = baseUrl + '/themes/cursor/pan.ani';
        switch (type.toString()) {
            case extras.control.ToolBar.PAN:
                cur = baseUrl + '/themes/cursor/pan.ani';
                break;
            case extras.control.ToolBar.ZOOMIN:
                cur = baseUrl + '/themes/cursor/zoomin.ani';
                break;
            case extras.control.ToolBar.ZOOMOUT:
                cur = baseUrl + '/themes/cursor/zoomout.ani';
                break;
            case extras.control.ToolBar.POLYGON:
                cur = baseUrl + '/themes/cursor/select_poly.ani';
                break;
            case extras.control.ToolBar.POLYLINE:
                cur = baseUrl + '/themes/cursor/select_polyline.ani';
                break;
            case extras.control.ToolBar.OVAL:
                cur = baseUrl + '/themes/cursor/select_polyline.ani';
                break;
            case extras.control.ToolBar.POINT:
                cur = baseUrl + '/themes/cursor/click.ani';
                break;
			case extras.control.ToolBar.IDENTIFY:
                cur = baseUrl + '/themes/cursor/Hand.cur';
                break;
            case extras.control.ToolBar.EXTENT:
                cur = baseUrl + '/themes/cursor/select_extent.ani';
                break;
            case extras.control.ToolBar.POSITION:
                cur = baseUrl + '/themes/cursor/SunPositionTool.ani';
                break;
        }
        this.map.setMapCursor(cur);
        //dojo.byId(this.map.id).style.cursor = "url(" + cur + ")";
    },
    removeDrawGraphic:function(graphic){
    	if(graphic){
    		this.drawLayer.remove(graphic);
    	}
    },
    draw: function(type, symbol, handler, handler_before){
    	this.deactivateToolbar();
    	switch(type){
	    	case esri.toolbars.draw.POINT:
	    		this.drawToolbar.setMarkerSymbol(symbol);
	    		break;
	    	case esri.toolbars.draw.POLYLINE:
	    		this.drawToolbar.setLineSymbol(symbol);
	    		break;
	    	case esri.toolbars.draw.POLYGON:
	    		this.drawToolbar.setFillSymbol(symbol);
	    		break;
	    	case esri.toolbars.draw.CIRCLE:
	    		this.drawToolbar.setFillSymbol(symbol);
	    		break;
	    	case esri.toolbars.draw.EXTENT:
	    		this.drawToolbar.setFillSymbol(symbol);
	    		break;
    	}
    	var onDrawEndHandler = dojo.connect(this.drawToolbar, "onDrawEnd", dojo.hitch(this,function(geometry) {
    		this.drawToolbar.deactivate();
    		
    		var graphic = new esri.Graphic(geometry,symbol);
    		this.drawLayer.add(graphic);
    		
    		if(onDrawEndHandler){
    			dojo.disconnect(onDrawEndHandler);
    		}
    		if(handler){
    			handler(graphic);
    		}
    	}));
    	
    	this.drawToolbar.activate(type);
    },
    deactivateToolbar:function(){
    	this.navToolbar.deactivate();
		this.drawToolbar.deactivate();
		this.measureToolbar.deactivate();
    },
    zoomIn:function(){
    	this.setMouseCursor(extras.control.ToolBar.ZOOMIN);
    	this.deactivateToolbar();
    	this.navToolbar.activate(esri.toolbars.Navigation.ZOOM_IN);
    },
    zoomOut:function(){
    	this.setMouseCursor(extras.control.ToolBar.ZOOMOUT);
    	this.deactivateToolbar();
    	this.navToolbar.activate(esri.toolbars.Navigation.ZOOM_OUT);
    },
	pan:function(){
		this.setMouseCursor(extras.control.ToolBar.ZOOMOUT);
    	this.deactivateToolbar();
    	this.navToolbar.activate(esri.toolbars.Navigation.PAN);
	},
	fullExtent:function(){
		this.navToolbar.zoomToFullExtent();
	},
	previous:function(){
		this.navToolbar.zoomToPrevExtent();
	},
	next:function(){
		this.navToolbar.zoomToNextExtent();
	},
	measureLength:function(){
		this.deactivateToolbar();
		this.measureToolbar.activate(esri.toolbars.draw.POLYLINE);
	},
	measureArea:function(){
		this.deactivateToolbar();
		this.measureToolbar.activate(esri.toolbars.draw.POLYGON);
	},
	clear:function(){
		 this.setMouseCursor(extras.control.ToolBar.PAN);
		 if( this.measureToolbar){
			 this.measureToolbar.clearAll();
		 }
		 if(this.map){
			 this.map.graphics.clear();
		 }
	     this.pan();
	},
	print:function(){
		
	},
	showMessageWidget:function(){
		
	},
	destroy:function(){
		this.clear();
		this.navToolbar = null;
		this.drawToolbar = null;
		this.measureToolbar = null;
		this.map = null;
		this.gisObject = null;
	},
	setCenter:function(x,y,zoom){
		this.map.centerAtZoom();
	},
	getCenter:function(){
		return this.map.center;
	},
	getExtent:function(){
		return this.map.extent;
	},
	getScale:function(){
		return this.map.getScale();
	},
	zoomToExtent:function(){
		
	},
	getLayerByName:function(layerName){
		
	},
	getLayerById:function(layerId){
		
	},
	bindMapEvents:function(evtName,bindFunction){
		
	},
	showInfoWindow:function(geometry){
		this.gisObject.layerLocate.unHightlightOnMap();
		//this.gisObject.layerLocate.locateByGeometry(geometry,null,true,true);
		//this.pan();
	}
});


dojo.mixin(extras.control.ToolBar, {
    "PAN": "1",
    "ZOOMIN": "2",
    "ZOOMOUT": "3",
    "POLYGON": "4",
    "POLYLINE": "5",
    "POINT": "6",
    "EXTENT": "7",
	"IDENTIFY" : "8",
	"OVAL" : "9",
	"POSITION" : "10"
});