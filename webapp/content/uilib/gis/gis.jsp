<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
<meta name="renderer" content="webkit">
<meta name="viewport" content="initial-scale=1, maximum-scale=1,user-scalable=no"/>
<meta http-equiv="X-UA-Compatible" content="IE=EDGE" />
<meta http-equiv="X-UA-Compatible" content="IE=9;IE=8;IE=EDGE;chrome=1" />
<meta name="viewport" content="initial-scale=1,maximum-scale=1,user-scalable=no,width=device-width,height=device-height">
<title>电子地图</title>
<link rel="stylesheet" href="http://192.168.16.177:8088/jsapi/3.14/dijit/themes/claro/claro.css">
<link rel="stylesheet" href="http://192.168.16.177:8088/jsapi/3.14/esri/css/esri.css">
<link rel="stylesheet" href="${pageContext.request.contextPath }/resources/uilib/bootstrap/dist/css/bootstrap.min.css"/>
<link rel="stylesheet" href="${pageContext.request.contextPath }/resources/uilib/artDialog/css/ui-dialog.css"/>
<link rel="stylesheet" href="${pageContext.request.contextPath }/resources/css/common/mui.css" />
<link rel="stylesheet" href="${pageContext.request.contextPath }/resources/css/common/common.css"/>
<link rel="stylesheet" href="${pageContext.request.contextPath }/resources/css/home/carMsgDetail.css"/>
<link rel="stylesheet" href="${pageContext.request.contextPath }/resources/css/queryAnaly/judge/base.css"/>
<link rel="stylesheet" href="${pageContext.request.contextPath }/resources/css/queryAnaly/judge/carFollow.css"/>
<style type="text/css">
	body, html,#map {width: 100%;height: 100%;overflow: hidden;margin:0;font-family:"微软雅黑";}
</style>
<!-- GIS -->
<script src="${pageContext.request.contextPath }/resources/uilib/gis/config.js"></script>
<script src="http://192.168.16.177:8088/jsapi/3.14/init.js"></script>
<script src="${pageContext.request.contextPath }/resources/uilib/jquery/dist/jquery-1.11.2.min.js"></script>
<script src="${pageContext.request.contextPath }/resources/uilib/gis/InfoGraphicLayer.js"></script>
<script src="${pageContext.request.contextPath }/resources/uilib/bootstrap/dist/js/bootstrap.min.js"></script>
<script src="${pageContext.request.contextPath }/resources/uilib/My97DatePicker/WdatePicker.js"></script>
<!--[if lt IE 9]>
    <script src="${pageContext.request.contextPath }/resources/uilib/html5shiv/dist/html5shiv.min.js"></script>
    <script src="${pageContext.request.contextPath }/resources/uilib/respond/dest/respond.src.js"></script>
<![endif]-->
</head>

<!-- 视区 -->
    <div id="map">
<!--     	<input type="button" text="绘制碰撞区域" onclick="drawCollsionAreaOnMap()"/>   -->
    </div>

<!-- 弹窗模板 -->
<div id="carPopupMsg" style="display:none;">
	<div class="grid car-msg">
	<div class="grid-col col-6 pull-left">
		<div class="thumbnail">
			<a><img src="/cbds/resources/images/test/example.jpg" alt="carimage"></a>
		</div>
	</div>
    <div class="grid-col col-6 pull-left text" id="carProp">
		<p class="carNum">
			<span class="text-label">车牌号码：</span>
			<span class="text-txt">${carNum}</span>
		</p>
		<p class="bayonet">
			<span class="text-label">经过卡口：</span>
			<span class="text-txt">${bayonet}</span>
		</p>
		<p class="carNumColor">
			<span class="text-label">车牌颜色：</span>
			<span class="text-txt">${carNumColor}</span>
		</p>
		<p class="carLogo">
			<span class="text-label">车牌品牌：</span>
			<span class="text-txt">${carLogo}</span>
		</p>
		<p class="carType">
			<span class="text-label">车牌类型：</span>
			<span class="text-txt">${carNumType}</span>
		</p>
		<p class="carColor">
			<span class="text-label">车辆颜色：</span>
			<span class="text-txt">${carColor}</span>
		</p>
		<p class="carNumColor">
			<span class="text-label">经过速度：</span>
			<span class="text-txt">${carSpeed}</span>
		</p>
		<p class="driveWay">
			<span class="text-label">通过车道：</span>
			<span class="text-txt">${driveway}</span>
		</p>
		<p class="passTime">
			<span class="text-label">通过时间：</span>
			<span class="text-txt">${passTime}</span>
		</p>
	</div>
</div>
</div>
<script src="${pageContext.request.contextPath }/resources/uilib/artDialog/dialog-plus-min.js"></script>
<script src="${pageContext.request.contextPath }/resources/js/common/commonUtil.js"></script>
<script src="${pageContext.request.contextPath }/resources/uilib/gis/gis.js"></script>
</body>
</html>