var markerArr = new Array;//标签数组
var labelArr = new Array;//文本数组
var serverIP = "";
var serverPort = "";
var GisObject;

var codes_1    = [];
var codes_2    = [];
var codes_3    = [];
var codes_4    = [];
var codes_5    = [];
var codes_6    = [];

//加载地图
function mapInit()
{
	dojo.require("extras.MapInitObject");
	
	
	dojo.ready(function(){
		GisObject = new extras.MapInitObject("mapDiv");
		var tmpPoint = new esri.geometry.Point(113.2759952545166, 23.117055306224895);
		GisObject.setMapOptions({
			logo:false,
			extent : "12557877.595482401,2596928.9267310356,12723134.450635016,2688653.360673282",
			level:10,
			center:tmpPoint
		});
	
		GisObject.addDefaultLayers();
	});
	
	StartTime();
}

//清除覆盖物
function remove_overlay(){
    GisObject.toolbar.drawLayer.clear();
    markerArr.splice(0,markerArr.length);
    labelArr.splice(0,labelArr.length);
}

function createMarker(data)
{
	var iconUrl = "";
	var icon_h  = 35 / 2;
	var icon_w  = 35 / 2;
	switch(data.device_type){
		case 1 :
			iconUrl = basePath + "/content/images/mapCommand/ic_police1_0.png";
			icon_h = 35 / 2; 
			icon_w = 47 / 2;
			break;
		case 2 :
			iconUrl = basePath + "/content/images/mapCommand/ic_camera.png";
			break;
		case 3 :
			iconUrl = basePath + "/content/images/mapCommand/ic_GH.png";
			break;
		case 4 :
			iconUrl = basePath + "/content/images/mapCommand/ic_police2_pLcar.png";
			break;
		
		default:
			iconUrl = "";
	}
	
    var myIcon = new esri.symbols.PictureMarkerSymbol({"url":iconUrl,"height":icon_h,"width":icon_w,"type":"esriPMS",xoffset:0,yoffset:0});
    var point = esri.geometry.webMercatorUtils.geographicToWebMercator(new esri.geometry.Point(parseFloat(data.longitude), parseFloat(data.latitude)));
    var pictureSymbol = new esri.symbols.PictureMarkerSymbol(myIcon);//图片
    var content = "";
    var uid = data.uid;
    var battery = parseInt(data.battery);
    /*content += "<div class='markInfo' style='background:rbga(255,255,255,0.1)'><span class='title'>"+data.name+"(警号:"+data.pno+")"+"</span><hr style='height:1px;border:none;border-top:1px solid #CCCCCC;'><table><tr><td class='detail'>设备编号："+data.sn+"</td></tr><tr><td class='detail' ";
    if(battery<=100 && battery>75){
        content += "style='color:green'>"+"剩余电量："+ battery+"% <img src='images/100.png'/>";
    }else if(battery<=75 && battery>50){
        content += "style='color:green'>"+"剩余电量："+ battery+"% <img src='images/75.png'/>";
    }else if(battery<=50 && battery>25){
        content += "style='color:#EE9F07'>"+"剩余电量："+ battery+"% <img src='images/50.png'/>";
    }else if(battery<=25 && battery>10){
        content += "style='color:#EE9F07'>"+"剩余电量："+ battery+"% <img src='images/25.png'/>";
    }else{
        content += "style='color:red'>"+"剩余电量："+ battery+"% <img src='images/10.png'/>";
    }
    content +="</td></tr><tr><td class='detail'>速&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;度："+data.speed+"</td></tr><tr><td class='detail'>容&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;量："+data.storage+"</td></tr><tr><td class='detail' "

    switch(data.sign){
        case 1:
           content += "style='color:#EE9F07'>信&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;号：弱&nbsp;<img src='images/2.png'/>";
           break; 
        case 2:
           content += "style='color:#EE9F07'>信&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;号：较弱&nbsp;<img src='images/3.png'/>";
           break; 
        case 3:
           content += "style='color:#32B209'>信&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;号：较强&nbsp;<img src='images/4.png'/>";
           break; 
        case 4:
           content += "style='color:#32B209'>信&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;号：强&nbsp;<img src='images/5.png'/>";
           break; 
    }*/
    //content += "</td></tr></table><form accept-charset='utf-8'><input type='button' class='callTo' onclick='setTimeout(function(){sendcrtlcmd(6, &quot;"+serverIP+"&quot;,"+uid+", &quot;1234&quot;, &quot;sa&quot;,&quot;"+ data.pno+"&quot;, &quot;&quot;, &quot;&quot;);sendcrtlcmd(8, &quot;"+serverIP+"&quot;,"+uid+", &quot;1234&quot;, &quot;sa&quot;,&quot;"+ data.pno+"&quot;, &quot;&quot;, &quot;&quot;);},5000);sendcrtlcmd(1, &quot;"+serverIP+"&quot;,"+uid+", &quot;1234&quot;, &quot;sa&quot;,&quot;"+ data.pno+"&quot;, &quot;&quot;, &quot;&quot;);' value='视频呼叫'><input type='button' class='hTrack' onclick='setTimeout(function(){sendcrtlcmd(6, &quot;"+serverIP+"&quot;,"+uid+", &quot;1234&quot;, &quot;sa&quot;,&quot;"+ data.pno+"&quot;, &quot;&quot;, &quot;&quot;);sendcrtlcmd(8, &quot;"+serverIP+"&quot;,"+uid+", &quot;1234&quot;, &quot;sa&quot;,&quot;"+ data[0].pno+"&quot;, &quot;&quot;, &quot;&quot;);},5000);sendcrtlcmd(2, &quot;"+serverIP+"&quot;,"+uid+", &quot;1234&quot;, &quot;sa&quot;,&quot;"+ data.pno+"&quot;, &quot;&quot;, &quot;&quot;)' value='语音呼叫'></form></div>";
    content += '<div class="row"><div class="col-xs-12"><button class="btn btn-info" onclick="PlayRec('+data.device_code+');">视频呼叫</button><button class="btn btn-info">语音呼叫</button></div></div>'
	   
    if(data.name){
        var ls = new esri.symbols.TextSymbol(data.user_name).setColor(new esri.Color([4, 128, 209, 0.9])).setFont(new esri.symbol.Font("12px").setWeight(esri.symbol.Font.WEIGHT_BOLD)).setOffset(-20, -28).setAlign(esri.symbol.TextSymbol.ALIGN_START);
        var pointLabel = new esri.graphic(point,ls);
        pointLabel.id  = data.user_code;
        pointLabel.name= data.user_name;
        pointLabel.dev = data.device_code;
        labelArr.push(pointLabel);
        GisObject.toolbar.drawLayer.add(pointLabel);
    }
   
	var infoTemp = new esri.InfoTemplate("警员信息", content);
	var marker = new esri.Graphic(point,pictureSymbol,{},infoTemp);
	marker.id  = data.user_code;
	marker.name= data.user_name;
	marker.dev = data.device_code;
	marker.type = data.device_type;
	markerArr.push(marker);
	GisObject.toolbar.drawLayer.add(marker);
	// GisObject.loadDefaultCluster(points);//画点
	GisObject.map.infoWindow.hide();
	
	setMapCenter(data);
}

/**
* 设置地图中心点
*/
function setMapCenter(data)
{
    var point = esri.geometry.webMercatorUtils.geographicToWebMercator(new esri.geometry.Point(parseFloat(data.longitude), parseFloat(data.latitude)));
    GisObject.map.centerAndZoom(point,11);
}

/**
* 删除的单个标注
* @param {number} id 标注唯一识别标识
* @param {number} longitude 经度 简写 lon
* @param {number} latitude 纬度 简写 la
*/
function removerMarker(data)
{
    var markerTmp;
    for(var i =0;i< markerArr.length;i++)
    {
        markerTmp = markerArr[i];
        if(markerTmp.id == data)
        {
            GisObject.map.infoWindow.hide();
            GisObject.toolbar.drawLayer.remove(markerTmp);
            markerArr.splice(i--, 1);
        }
    }
    for(var j =0;j< labelArr.length;j++)
    {
        markerTmp = labelArr[j];
        if(markerTmp.id == data)
        {
            GisObject.toolbar.drawLayer.remove(markerTmp);
            labelArr.splice(j--,1);
        }
    }
}

/**
* 更新坐标点
* @param {String} upId 更新id
* @param {number} la 经度
* @param {number} la 纬度
*/
function updateMarkers(data)
{
    for (var i = 0; i< data.length;i++) 
    {   
        var markerTmp;
        for(var j =0;j< markerArr.length;j++)
        {
            markerTmp = markerArr[j];
            if(markerTmp.dev == data[i].device_code)
            {
            	data[i].id = markerTmp.id;
            	data[i].name = markerTmp.name;
                removerMarker([data[i].id]);
                createMarker([data[i]]);
            }
        }
    }
}

function StartTime()
{
	setTimeout(updateData, 10000);
}

var dev_finish_count = 6;
function updateData(){
	if(dev_finish_count < 6){
		setTimeout(updateData, 1000);
		return;
	}
	
	codes_1 = [];
	codes_2 = [];
	codes_3 = [];
	codes_4 = [];
	codes_5 = [];
	codes_6 = [];
	
	var len = markerArr.length;
	for(var i=0; i<len;i++){
		switch(markerArr[i].type){
			case 1 : codes_1.push(markerArr[i].type);break;
			//case 2 : codes_2.push(markerArr[i].type);break;
			case 3 : codes_3.push(markerArr[i].type);break;
			case 4 : codes_4.push(markerArr[i].type);break;
			case 5 : codes_5.push(markerArr[i].type);break;
			case 6 : codes_6.push(markerArr[i].type);break;
		}
	}
	
	dev_finish_count = 0;
	
	getDatas(codes_1, 1);
	getDatas(codes_2, 2);
	getDatas(codes_3, 3);
	getDatas(codes_4, 4);
	getDatas(codes_5, 5);
	getDatas(codes_6, 6);
	
	setTimeout(updateData, 10000);
}

function getDatas(Ids, type)
{
	if(Ids.length == 0){
		dev_finish_count++;
		return;
	}
	
	var pData = {
		'device_codes' : Ids,
		'device_type'  : type
	};
	
	$.ajax({
        url			: basePath + "/map/command/device/codes.action",
        type		: "post",
        contentType	: "application/json",
        dataType	: 'json',
        data		: JSON.stringify(pData),
        async		: false,
        cache		: false,
        error		: function() {
          	//alert("获取数据失败`~`");
          	dev_finish_count++;
          	return;
		},
      
        success		: function(ret){
        	updateMarkers(ret.body);
        	dev_finish_count++;
        }
    });
}
	
