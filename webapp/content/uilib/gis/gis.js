dojo.require("esri.graphic");
dojo.require("esri.Color");
dojo.require("esri.toolbars.draw");
dojo.require("esri.geometry.Point");
dojo.require("esri.geometry.Polyline");
dojo.require("esri.geometry.webMercatorUtils");
dojo.require("esri.symbols.PictureFillSymbol");
dojo.require("esri.symbols.PictureMarkerSymbol");
dojo.require("esri.symbols.SimpleLineSymbol");
dojo.require("ccs.ext.InfoGraphicLayer");
dojo.require("esri.symbols.SimpleFillSymbol");
dojo.require("extras.MapInitObject");
dojo.require("extras.symbol.ArrowLineSymbol");


var GisObject,dialogObj;
var initMapFlag = false;
dojo.ready(function(){
	GisObject = new extras.MapInitObject("map");
	GisObject.setMapOptions({
		logo:false,
		extent : "12557877.595482401,2596928.9267310356,12723134.450635016,2688653.360673282",
		level:10,
		center:null
	});
	
	GisObject.addDefaultLayers();
	
	initMapFlag = true;
});


function launch(callback){
	var timeTicket = window.setInterval(function(){
		if(initMapFlag){//地图加载完成
			window.clearInterval(timeTicket); 
			if(callback) callback();
		}else{ self.isMapInit = false;}
	}, 800);
}

function buildMapFeatures(bayonets,marker,win){
	var featuresArr = [],self = this;
	marker = !marker || true; win = !win || true;
	$.each(bayonets,function(idx,bayonet){
		var feature = {};
		feature.id = bayonet.id;
		feature.x = bayonet.lon;
		feature.y = bayonet.lat;
		marker && (feature.symbol = {url:bayonet.markerUrl || GlobalVar.markerUrl,width:16,height:16});
		win && (feature.attributes = bayonet);
		featuresArr.push(feature);
	});
	return {
		//showpopuptype:1, //显示图片
		geometries:featuresArr,
		/*infotemplate:{
		    title: "{bayonet}",
		    fieldInfos: [
		      {"label":"车牌号码",fieldName: "carNum", visible: true},
		      {"label":"卡口",fieldName: "bayonet", visible: true},
		      {"label":"车牌类型",fieldName: "carNumType", visible: true},
		      {"label":"车牌颜色",fieldName: "carNumColor", visible: true},
		      {"label":"车速",fieldName: "carSpeed", visible: true},
		      {"label":"车辆类型",fieldName: "carType", visible: true},
		      {"label":"车辆颜色",fieldName: "carColor", visible: true},
		      {"label":"车标",fieldName: "carLogo", visible: true},
		      {"label":"经过车道",fieldName: "driveway", visible: true},
		      {"label":"经过时间",fieldName: "passTime", visible: true}
		    ],
		    mediaInfos:[{
		    	type: 'image',
				value: {
					sourceURL: 'XXXX'
				}
		    }]
		},
		symbol:null,*/
	};
}

function loadFeatures(graphicObj){
	GisObject.layerManager.addGraphicToMap("Gxx_gis_bayonet",0,graphicObj,true,function(layer,evt){
		var graphic = evt.graphic,attr = graphic.attributes,geometry = graphic.geometry,screenPos;
		screenPos = GisObject.map.toScreen(geometry);
		showDialog(graphic);
		//$("[role='dialog']").css({"top":screenPos.y,"left":screenPos.x}).addClass("ui-popup-right").find(".ui-arrow-a,.ui-arrow-b").css("display","block").end();
	});
}

function drawTrackOnMap(trackData){
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
    var points = [];
    try{
    	var geometriesArr = trackData.geometries;
    	for(var i=0,il=geometriesArr.length;i<il;i++){
    		points.push([geometriesArr[i].x,geometriesArr[i].y]);
    	}
    }catch(e){}
    
    var basicPolyline = esri.geometry.webMercatorUtils.geographicToWebMercator(new esri.geometry.Polyline(points));
    var bg = new esri.Graphic(basicPolyline, basicSymbol, {}, null);
    //graphicsLayer.add(bg);
    if(GisObject.toolbar.drawLayer){
    	GisObject.toolbar.drawLayer.add(bg);
    }
    basicSymbol.stopAnimation();
    basicSymbol.animateDirection(20, 350);
}

function locateFeatureById(idKey){
	var layer = GisObject.map.getLayer("Gxx_gis_bayonet");
	if(layer){
		var findGraphic = null;
		var grpahics = layer.graphics;
		for(var i=0,il=grpahics.length;i<il;i++){
			if(grpahics[i].id == idKey){
				findGraphic = grpahics[i];
				break;
			}
		}
		findGraphic && showDialog(findGraphic);
	}
}
/**
 * 展示地图弹窗
 * @param graphic	graphic
 * @param dialogID	弹窗的ID
 * @param pageUrl	弹窗的请求页面URL
 */
function showDialog(graphic,dialogID,pageUrl){
	GisObject.map.centerAndZoom(graphic.geometry);
	dialogObj && mDialog.closeDialog(dialogObj);
	dialogObj = mDialog.showDialog({
		id : dialogID || "page_dialog",
		align: 'right',
		title : graphic.attributes.carNum,
		url : pageUrl || "/cbds/judgeAnaly/carMsgDetail.html",
		data : graphic.attributes
	});
}

//跟车分析 
function drawCarFollowOnMap(carData){
	var carInfo = carData.carInfo;
	var carFollowFellow = carData.fellowRows;
	
	$.each(carFollowFellow,function(idx,followObj){
		var tmpfollow = buildCarInfoAndTraceList(followObj,{
        	type:"esriPMS",
            angle: 0,
            width:32,
            height: 32,
            xoffset:0,
            yoffset:0,
            url: selfUrl + "/themes/default/img/car02.png"
        },{
            type:"esriSLS",
            style:"esriSLSSolid",
            width:3,
            color:[63,162,192,255]
        });
	});
	
	var carFollowObj = buildCarInfoAndTraceList(carInfo,{
    	type:"esriPMS",
        angle: 0,
        width:32,
        height: 32,
        xoffset:0,
        yoffset:0,
        url: selfUrl + "/themes/default/img/car01.png"
    },{
        type:"esriSLS",
        style:"esriSLSSolid",
        width:3,
        color:[188,212,110,255]
    });
}

function buildCarInfoAndTraceList(carInfo,pointSymbol,lineSymbol){
	var traceList = carInfo.traceList;
	if(traceList && traceList.length > 0){
		var lastPoint = traceList[traceList.length - 1];
		var path = [];
		$.each(traceList,function(idx,traceObj){
			path.push([traceObj.lon,traceObj.lat]);
		});
		
		GisObject.layerDraw.addPointByImage(lastPoint.lon,lastPoint.lat,pointSymbol,carInfo);
		GisObject.layerDraw.addPolyline(path,lineSymbol);
	}
}

//碰撞分析
function drawCollsionAreaOnMap(){
	GisObject.toolbar.draw(esri.toolbars.draw.EXTENT,new esri.symbols.SimpleFillSymbol({
    	type:"esriSFS",
        style:"esriSFSSolid",
        color:[0,0,0,64],
        outline:{
        	type:"esriSLS",
        	style:"esriSLSSolid",
        	width:1.5,
        	color:[255,0,0,255]
        }
    }),function(graphic){
		
		var centerPoint= graphic.geometry.getExtent().getCenter();
		var content = [];
		content.push('<div class="condition">');
		content.push('<div class="card">');
		
		content.push('<div id="condition">')
		content.push('<div class="grid star">');
		content.push('<div class="grid-col text">');
		content.push('		<span class="text-label">开始时间</span>');
		content.push('</div>');
		content.push('	<div class="grid-col text">');
		content.push("		<input type=\"text\" class=\"Wdate form-control text-txt\" id=\"startTime\" name=\"startTime\" value=\"\" onFocus=\"WdatePicker({dateFmt:'yyyy-MM-dd HH:mm:ss',maxDate:'#F{$dp.$D(\'endTime\')||\'2020-10-01\'}'})\"/>"); 
		content.push('	</div>');
		content.push('</div>');
		content.push('<div class="grid star">');
		content.push('<div class="grid-col text">');
		content.push('		<span class="text-label">结束时间</span>');
		content.push('	</div>');
		content.push('	<div class="grid-col text">');
		content.push("		<input type=\"text\" class=\"Wdate form-control text-txt\" id=\"endTime\" name=\"endTime\" value=\"\" onFocus=\"WdatePicker({dateFmt:'yyyy-MM-dd HH:mm:ss',minDate:'#F{$dp.$D(\'startTime\')}',maxDate:'2020-10-01'})\"/>");
		content.push('	</div>');
		content.push('</div>');
		content.push('<div class="grid clearStar">');
		content.push('<div class="grid-col text">');
		content.push('<span class="text-label">卡口点数</span>');
		content.push('</div>');
		content.push('<div class="grid-col text">');
		content.push('<input type="text" class="form-control text-txt" name="followTime" value="0">');
		content.push('</div>');
		content.push('</div>');
		content.push('</div>');
		content.push('</div>');
		content.push('</div>')
		GisObject.map.infoWindow.setContent(content.join(""));
		//在图形的中心点显示infoWindow
		GisObject.map.infoWindow.show(centerPoint);
    });
}


//首次进城
function drawFirstTimeInTown(carData){
	
}

function clearTrackPath(){
	GisObject.toolbar.drawLayer.clear();
}