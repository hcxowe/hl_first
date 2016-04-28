dojo.provide("ccs.ext.InfoGraphicLayer");

dojo.declare("ccs.ext.InfoGraphicLayer",[esri.layers.GraphicsLayer],{
	constructor: function (options) {
		this._id = options.id || "";
        this._divId = options.divId;
        this._bindGraphicLayer = options.bindGraphicLayer || null;
        this.visible=true;
	},
	// 重构esri/layers/GraphicsLayer方法
    _setMap: function(map, surface) {
        // GraphicsLayer will add its own listener here
        var div = this.inherited(arguments);
        return div;
    },
    _unsetMap: function() {
        this.inherited(arguments);
    },
    hide: function() {
    	this.visible=false;
        if(this.clickGraphic){
        	debugger
        	$("#div_"+this.clickGraphic.id).hide();
        }
        var _graphics = this.graphics;
        for(var i= 0,dl =_graphics.length;i<dl;i++){
        	_graphics[i].hide();
        }
    },
    show: function() {
    	this.visible=true;
    	if(this.clickGraphic){
        	$("#div_"+this.clickGraphic.id).show();
        }
    	var _graphics = this.graphics;
        for(var i= 0,dl =_graphics.length;i<dl;i++){
        	_graphics[i].show();
        }
    },
    remove:function(graphic){
    	if (!this._map) {
            return;
        }
    	this.inherited(arguments);
    	var id =graphic.id;
    	$("#div_"+id).hide();
        $("#div_"+id).remove();
    },
    _refresh: function(redrawFlag, zoomFlag) {
    	if(!this.visible) return;
    	
        var gs = this.graphics,
            _draw = this._draw;
        for (i = 0; i < gs.length; i++) {
            _draw(gs[i], redrawFlag, zoomFlag);
        }
        this.show();
    },
    //拖拽
    _onPanStartHandler: function() {
    	this.hide();
    	this.inherited(arguments);
    },
    //缩放
    _onZoomStartHandler:function(){
//    	this.hide();
    	this.inherited(arguments);
    },
    
    _onExtentChangeHandler: function(delta, extent, levelChange, lod) {
    	this._refresh(true, true);
    	this.inherited(arguments);
    },
    _draw:function(graphic, redrawFlag, zoomFlag){
        if (!this._map) {
            return;
        }

        this.inherited(arguments);
        
        if(this.clickGraphic&&this.clickGraphic._shape&&this.clickGraphic.id==graphic.id){
        	var showDiv = $("#div_"+this.clickGraphic.id);
            var upArrow = showDiv.find("div.entry-trangle-left");
            var mapPt = this.clickGraphic.geometry;
            var srcPt = this._map.toScreen(mapPt);
            var padding = window.getComputedStyle ? window.getComputedStyle(showDiv[0],null).paddingLeft : showDiv[0].currentStyle.paddingLeft;

            var dx = (this.clickGraphic._shape.shape.width*3/4)/2;+parseInt(upArrow.css("borderRightWidth"));
            var dy = parseInt(showDiv.css("height"))/2;
            upArrow.css("top",(dy)+"px").css("left",(-parseInt(upArrow.css("borderRightWidth")))+"px");
            showDiv.css("top",(srcPt.y-dy-parseInt(upArrow.css("borderTopWidth")))+"px")
            	   .css("left",(srcPt.x+2*dx)+"px");
            
            showDiv.show();
        }
    }
});