/**
 * 地图查询类
 */



dojo.provide("extras.control.LayerQuery");
dojo.require("esri.graphic");
dojo.require("esri.layers.GraphicsLayer");
dojo.require("esri.geometry.Point");
dojo.require("esri.geometry.webMercatorUtils");
dojo.require("esri.toolbars.draw");
dojo.require("esri.symbols.PictureMarkerSymbol");
dojo.require("esri.dijit.PopupTemplate");


dojo.declare("extras.control.LayerQuery",null,{
	layerQueryLayer:null,
	constructor:function()
	{
		//发布toolBarLoadedEvent监听(用来获得MAP和Toolbar)
        dojo.subscribe("toolBarLoadedEvent", this, "initLayerQuery");
        
        //默认样式
        this.defaultSymbol = {
            "POINT": {
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
            "IMAGE": {
            	type:"esriPMS",
                angle: 0,
                width:32,
                height: 32,
                xoffset:0,
                yoffset:0,
                url: baseUrl + "/themes/default/images/tt.png"
            },
			"TEXT": {
				type:"esriTS",
                angle:0,
                color:[51,51,51,255],
                font:{
            		family:"微软雅黑",
            		size:9,
            		style:"normal",
            		variant:"normal",
            		weight:"normal"
                },
                horizontalAlignment:"center",
                kerning:true,
        		rotated:false,
        		text:"默认文本",
        		xoffset:0,
        		yoffset:0
            },
            "LINE": {
                type:"esriSLS",
                style:"esriSLSSolid",
                width:1.5,
                color:[255,0,0,255]
            },
            "POLYGON": {
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
        
        this.layerQueryLayer = new esri.layers.GraphicsLayer({id:"GXX_GIS_QUERYRESULT_LAYER"});
	},
	initLayerQuery : function(toolbar){
		this.toolbar = toolbar;
		this.map = this.toolbar.map;
		this.map.addLayer(this.layerQueryLayer);
	},
	startDraw:function(type,sybmol,callBackFun){
		this.layerQueryLayer.clear();
		this.map.reorderLayer(this.layerQueryLayer,this.map._layers.length -1);
		this.toolbar.draw(type,sybmol || this.defaultSymbol[type.toUpperCase()],dojo.hitch(this,function(graphic){
			if(graphic){
				callBackFun(graphic);
			}else{
				callBackFun(null);
			}
		}));
	},
	pullBoxSearch:function(){
		this.startDraw(esri.toolbars.draw.EXTENT, new esri.symbols.SimpleFillSymbol(this.defaultSymbol.POLYGON),dojo.hitch(this,function(graphic){
			//this.map.graphics.add(graphic);
			this.layerQueryLayer.add(graphic);
		}));
	},
	polygonSearch:function(){
		this.startDraw(esri.toolbars.draw.POLYGON, new esri.symbols.SimpleFillSymbol(this.defaultSymbol.POLYGON),dojo.hitch(this,function(graphic){
			this.layerQueryLayer.add(graphic);
		}));
	},
	circleSearch:function(){
		this.startDraw(esri.toolbars.draw.CIRCLE, new esri.symbols.SimpleFillSymbol(this.defaultSymbol.POLYGON),dojo.hitch(this,function(graphic){
			this.layerQueryLayer.add(graphic);
		
			var resultData = this.queryByGeometry("GXX_Device",graphic.geometry);
			
			
			dojo.forEach(resultData, dojo.hitch(this,function(graphic, index){
				//var pt = esri.geometry.webMercatorUtils.geographicToWebMercator(graphic.geometry); 
				var pt = graphic.geometry;
				var sms = null;  
	            switch(index){
	            	case 0:
	            		sms = new esri.symbols.PictureMarkerSymbol(baseUrl+"/themes/default/images/location/1.png",36,36);  
	            		break;
	            	case 1:
	            		sms = new esri.symbols.PictureMarkerSymbol(baseUrl+"/themes/default/images/location/2.png",36,36);
	            		break;
	            	case 2:
	            		sms = new esri.symbols.PictureMarkerSymbol(baseUrl+"/themes/default/images/location/3.png",36,36);
	            		break;
	            	case 3:
	            		sms = new esri.symbols.PictureMarkerSymbol(baseUrl+"/themes/default/images/location/4.png",36,36);
	            		break;
	            	default:
	            		sms = new esri.symbols.PictureMarkerSymbol(baseUrl+"/themes/default/images/location/0.png",36,36);
	            		break;
	            } 
	            
	            var template = new esri.dijit.PopupTemplate({
		          title: "{title}",
		          description:"{description}",
		        });
	            
	            var newGraphic = new esri.Graphic(pt, sms, {title:"标题"+index,description:"内容"+index},template);
	            this.layerQueryLayer.add(newGraphic);
			}));
			
			
		}));
	},
	/**
	 * 属性查询
	 * @param {Object} id	工程图层ID
	 * @param {Object} where	属性条件
	 * @param {Object} sussFunction		成功返回调用函数，以字符串格式返回数据
	 * @param {Object} errorFunction	失败返回调用函数,返回错误信息
	 */
	queryByAttribute : function(layerId,attrName,attrValue,isLike){
		var param = new SpatialQueryParam();
		param.layerId = layerId;
		param.attrName = attrName;
		param.attrValue = attrValue;
		param.isLike = isLike || true;
		return this.queryByLayerId(1,param)
	},
	/**
	 * 空间查询
	 * @param {Object} id
	 * @param {Object} geometry
	 * @param {Object} sussFunction
	 * @param {Object} errorFunction
	 */
	queryByGeometry : function(layerId,geometry){
		var param = new SpatialQueryParam();
		param.layerId = layerId;
		param.geometry = geometry;
		return this.queryByLayerId(2,param)
	},
	/**
	 * 综合查询
	 * @param {Object} params
	 * @param {Object} sussFunction
	 * @param {Object} errorFunction
	 */
	queryByAttrAndGeo : function(layerId,geometry,attrName,attrValue,isLike){
		var param = new SpatialQueryParam();
		param.layerId = layerId;
		param.geometry = geometry;
		param.attrName = attrName;
		param.attrValue = attrValue;
		return this.queryByLayerId(3,param)
	},
	queryByLayerId:function(type,param){
		var layerId = param.layerId;
		var attrName = param.attrName;
		var attrValue = param.attrValue;
		var geometry = param.geometry || null;
		var isLike = param.isLike || true; //默认是模糊查询
		var layer = this.map.getLayer(layerId);
		var resultData = null;
		if(layer){
			if(type == 1){ // 属性是查询
				resultData = this.getGraphicByAttribute(layer,attrName,attrValue,isLike);
			}else if(type == 2){ //空间查询
				resultData = this.getGraphicByGeometry(layer,geometry);
			}else if(type == 3){ //属性空间联合查询
				resultData = this.getGraphicByAttributeAndGeometry(layer,geometry,attrName,attrValue,isLike);
			}
		}
		return resultData;
	},
	 getGraphicBy: function(layer,property, value) {
        var feature = null;
        if(layer){
        	var graphics = layer.graphics;
	        for(var i=0, len= graphics.length; i<len; ++i) {
	            if(graphics[i][property] == value) {
	                feature = this.features[i];
	                break;
	            }
	        }
        }
        return feature;
    },
    getGraphicById: function(layer,idKey) {
        return this.getGraphicBy(layer,'id', idKey);
    },
    getAllGraphic:function(layer){
    	return layer.graphics;
    },
    getGraphicByAttributeAndGeometry:function(layer,geometry,attrName,attrValue,isLike){
    	var foundGraphics = null;
    	var resultData = this.getGraphicByAttribute(layer,attrName,attrValue,isLike);
    	if(resultData && resultData.lenght > 0){
    		foundGraphics = [];
	    	dojo.forEach(resultData,function(graphic, index){
	    		if(geometry.contains(graphic.geometry)){
	    			foundGraphics.push(graphic);
				 }
	    	});
    	}
    	return foundGraphics;
    },
    getGraphicByGeometry:function(layer,geometry){
    	 var foundGraphics = null;
    	 if(layer && geometry){
    		 foundGraphics = [];
    		 var allGraphic = this.getAllGraphic(layer);
    		 for(var i = 0,len = allGraphic.length; i < len; i++) {
    			 var g = allGraphic[i];
    			 if(geometry.contains(g.geometry.getPoint(0))){
    				 foundGraphics.push(g);
    			 }
    		 }
    	 }
    	 return foundGraphics;
    },
    getGraphicByAttribute: function(layer,attrName, attrValue,isLike) {
       var foundGraphics = null;
	       if(layer){
	    	   var feature = null;
	    	   foundGraphics = [];
	    	   var graphics = layer.graphics;
		       for(var i = 0,len = graphics.length; i < len; i++) {            
		           feature = graphics[i];
		           if(feature && feature.attributes) {
		        	   if(!isLike){
			               if (feature.attributes[attrName] == attrValue) {
			            	   foundGraphics.push(feature);
			               }
		               }else{
		            	   if (feature.attributes[attrName].indexOf(attrValue) != -1){
		            		   foundGraphics.push(feature);
			               }
		               }
		           }
		       }
	       }
        return foundGraphics;
    }
});

var SpatialQueryParam = function(){
	return {
		layerId : null,//工程图层ID
		geometry : null,//空间查询范围
		outFields : null,//返回字段
		where : null,//查询条件
		returnGeometry : true,//是否返回空间实体
		returnValues : true,//是否返回字段值信息
		returnAlias : true,//是否返回字段别名
		isReturnMis : true,//是否返回MIS关联信息,
		startRow : null,//分页起始记录数
		endRow : null,//分页终止记录数
		orderbyFields : null,
		groupbyFields : null,
		filtrateNum : 0,
		spatialRelationship : SpatialQueryParam.SPATIAL_REL_INTERSECTS//空间关系
	}
};

/*SpatialQueryParam.WFS_QUERY_TYPE_LIKE = "Like";
SpatialQueryParam.WFS_QUERY_TYPE_GREATERTHAN = "GreaterThan";
SpatialQueryParam.WFS_QUERY_TYPE_LESSTHANEQUALTO = "LessThanEqualTo";
SpatialQueryParam.WFS_QUERY_TYPE_GREATERTHANEQUALTO = "GreaterThanEqualTo";
SpatialQueryParam.WFS_QUERY_TYPE_EQUALTO = "EqualTo";
SpatialQueryParam.WFS_QUERY_TYPE_NOTEQUALTO = "NotEqualTo";
SpatialQueryParam.WFS_QUERY_TYPE_BETWEEN = "Between";
SpatialQueryParam.WFS_QUERY_TYPE_NULLCHECK = "NullCheck";


SpatialQueryParam.SPATIAL_REL_CONTAINS = "ST_Contains";// 第二个几何完全被第一个几何包含
SpatialQueryParam.SPATIAL_REL_CROSSES = "ST_Crosses";// 两个几何相交 只适用于一部分实体判断
SpatialQueryParam.SPATIAL_REL_EQUALS = "ST_Equals";// 两个几何类型相同，并且坐标序列相同
SpatialQueryParam.SPATIAL_REL_INTERSECTS = "ST_Intersects";// 两个几何相交
SpatialQueryParam.SPATIAL_REL_OVERLAPS = "ST_Overlaps";// 比较的2个几何维数相同并且相交
SpatialQueryParam.SPATIAL_REL_TOUCHES = "ST_Touches";// 两个几何相交的部分都不在两个几何的内部(接触)
SpatialQueryParam.SPATIAL_REL_WITHIN = "ST_Within";// 第一个几何完全在第二个几何内部
SpatialQueryParam.SPATIAL_REL_DISJOINT = "ST_Disjoint";// 两个几何不相交*/