<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
    <head>
        <meta name="renderer" content="webkit">
		<meta http-equiv="content-type" charset="utf-8" >
	    <meta http-equiv="X-UA-Compatible" content="IE=EDGE" />
	    <meta http-equiv="X-UA-Compatible" content="IE=9;IE=8;IE=EDGE;chrome=1" />
	    <meta name="viewport" content="initial-scale=1,maximum-scale=1,user-scalable=no,width=device-width,height=device-height">
		
		<title>实时指挥-地图指挥</title>
		
		<link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/content/css/bootstrap.css">
		<link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/content/css/font-awesome.min.css">
    	<link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/content/uilib/zTree_v3/css/zTreeStyle/zTreeStyle.css">  
    	<link rel="stylesheet" type="text/css" href="http://192.168.21.20:8088/jsapi/3.14/dijit/themes/claro/claro.css">
    	<link rel="stylesheet" type="text/css" href="http://192.168.21.20:8088/jsapi/3.14/esri/css/esri.css">
		<link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/content/css/common/header.css">
		<link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/content/css/mapCommand/mapCommand.css">
		<link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/content/css/common/tree.css"/>
    </head>
    
    <body>
		<!-- 头部  -->
		<jsp:include page="../common/header.jsp"></jsp:include>

		<!-- 主题内容 -->
		<div class="content" style="height: 100%;min-height: 500px;margin-top: -65px;padding-top: 65px;">
			<div class="container-fluid" style="height: 100%;padding-left: 0px;">
				<div class="row" style="height: 100%;">
					<div class="col-xs-3" id="div_left" style="background-color: #DBDBDB;padding-top: 5px;height: 100%;padding-right: 0px;">					
						<!-- 左侧菜单栏 -->
						<ul id="myTab" class="nav nav-pills">
						   	<li style="margin-left:2px;">
						      	<a href="#camera" data-toggle="pill" class="a-camera">
						      		<div></div>
						      	</a>
						   	</li>
						   	<li>
						   		<a href="#police" data-toggle="pill" class="a-police">
						   			<div></div>
						   		</a>
						   	</li>
						   	<li>
						   		<a href="#tingzi" data-toggle="pill" class="a-dingzi">
						   			<div></div>
						   		</a>
						   	</li>
						   	<li>
						   		<a href="#scar" data-toggle="pill" class="a-smallcar">
						   			<div></div>
						   		</a>
						   	</li>
						   	<li>
						   		<a href="#g4g" data-toggle="pill" class="a-4g">
						   			<div></div>
						   		</a>
						   	</li>
						   	<li>
						   		<a href="#bcar" data-toggle="pill" class="a-bigcar">
						   			<div></div>
						   		</a>
						   	</li>
						   	<li>
						   		<a href="#search" data-toggle="pill" class="a-search">
						   			<div></div>
						   		</a>
						   	</li>
						</ul>
						<div id="myTabContent" class="tab-content" style="background-color: #FFF; margin-left: 50px;height: 100%; overflow: auto;">
						   	<div class="tab-pane fade" id="camera">
						  		<div class="left">
									<ul id="tree_camera" class="ztree ztree-camera"></ul>
								</div>
						   	</div>
						   	<div class="tab-pane fade" id="police">
						  		<div class="left">
									<ul id="tree_police" class="ztree ztree-police"></ul>
								</div>
						   	</div>
						   	<div class="tab-pane fade" id="tingzi">
						  		<div class="left">
									<ul id="tree_tingzi" class="ztree ztree-tingzi"></ul>
								</div>
						   	</div>
						   	<div class="tab-pane fade" id="scar">
						  		<div class="left">
									<ul id="tree_scar" class="ztree ztree-scar"></ul>
								</div>
						   	</div>
						   	<div class="tab-pane fade" id="g4g">
						  		<div class="left">
									<ul id="tree_4g" class="ztree ztree-g4g"></ul>
								</div>
						   	</div>
						   	<div class="tab-pane fade" id="bcar">
						  		<div class="left">
									<ul id="tree_bcar" class="ztree ztree-bcar"></ul>
								</div>
						   	</div>
						   	<div class="tab-pane fade" id="search" style="background-color: #DBDBDB;">
						  		<div class="container-fluid">
						  			<div class="row" style="background-color: #FFFFFF; margin-bottom: 5px;">
						  				<div class="col-xs-12" style="padding-left: 0px;padding-right: 0px;">
						  					<a href="javascript:void(0);" class="list-group-item" >
						  						<img src="${pageContext.request.contextPath}/content/images/mapCommand/no_g4g.png" style="float: left;margin-top: 10px;margin-right: 5px;"/>
						  						<p style="margin-bottom: 0px;font-size: 14px;color: #0586ea;font-weight: bold;font-family: Microsoft Yahei;line-height: 20px;">
						  							 张三(4G) PC10888 18909874638<br/>广西壮族自治区柳州市跃进路1号
						  						</p>
						  					</a>
											<a href="javascript:void(0);" class="list-group-item" style="padding: 15px;">
						  						<img src="${pageContext.request.contextPath}/content/images/mapCommand/ad_2.png" style="float: left;margin-top: 10px;margin-right: 5px;"/>
						  						<p style="margin-bottom: 0px;font-size: 14px;color: #b8b8b8;font-weight: bold;font-family: Microsoft Yahei;line-height: 20px;">
						  							 张三(4G) PC10888 18909874638<br/>广西壮族自治区柳州市跃进路1号
						  						</p>
						  					</a>
						  					<a href="javascript:void(0);" class="list-group-item" style="padding: 15px;">
						  						<img src="${pageContext.request.contextPath}/content/images/mapCommand/ad_3.png" style="float: left;margin-top: 10px;margin-right: 5px;"/>
						  						<p style="margin-bottom: 0px;font-size: 14px;color: #b8b8b8;font-weight: bold;font-family: Microsoft Yahei;line-height: 20px;">
						  							 张三(4G) PC10888 18909874638<br/>广西壮族自治区柳州市跃进路1号
						  						</p>
						  					</a>
						  				</div>
						  			</div>
						  			
						  			<div class="row" style="background-color: #FFFFFF;">
						  				<ul class="list-group">
							  				<li class="list-group-item" style="padding: 10px 10px 1px 10px;border: none;">
							  					<div class="col-xs-10 col-left" style="border: 1px solid #DBDBDB;background-color: #def1f4;min-height: 100px;">
							  						<h4>
							  							<img src="${pageContext.request.contextPath}/content/images/mapCommand/ic_camera.png" /> 高清摄像头
							  						</h4>
							  						<ul class="list-unstyled">
							  							<li>
							  								<label><input type="checkbox"> 摄像头1 SJ-1080 </label>
							  							</li>
							  							<li>
							  								<label><input type="checkbox"> 摄像头2 SJ-1670 </label>
							  							</li>
							  						</ul>
							  					</div>
							  					<div class="col-xs-2" style="padding-left: 2px;padding-right: 2px;text-align: center;">
							  						<div class="col-right" style="border: 1px solid #DBDBDB;background-color: #def1f4;">
							  							<img src="${pageContext.request.contextPath}/content/images/mapCommand/ico6.png" />
						  							</div>
							  					</div>
							  					
							  					<div class="clearfix"/>
							  				</li>
							  				
							  				<li class="list-group-item" style="padding: 10px 10px 1px 10px;border: none;">
							  					<div class="col-xs-12 col-left" style="border: 1px solid #DBDBDB;background-color: #def1f4;min-height: 100px;">
							  						<h4>
							  							<img src="${pageContext.request.contextPath}/content/images/mapCommand/ic_police.png" /> 警员
							  						</h4>
							  						<ul class="list-unstyled">
							  							<li>
							  								<label><input type="checkbox"> 张三(4G) PC10888 </label>
							  							</li>
							  							<li>
							  								<label><input type="checkbox"> 张三(4G) PC10888 </label>
							  							</li>
							  							<li>
							  								<label><input type="checkbox"> 张三(4G) PC10888 </label>
							  							</li>
							  						</ul>
							  					</div>
							  					
							  					<div class="clearfix"/>
							  				</li>
							  				
							  				<li class="list-group-item" style="padding: 10px 10px 1px 10px;border: none;">
							  					<div class="col-xs-10 col-left" style="border: 1px solid #DBDBDB;background-color: #def1f4;min-height: 100px;">
							  						<h4>
							  							<img src="${pageContext.request.contextPath}/content/images/mapCommand/ic_GH.png" /> 岗亭
							  						</h4>
							  						<ul class="list-unstyled">
							  							<li>
							  								<label><input type="checkbox"> 摄像头1 SJ-1080 </label>
							  							</li>
							  							<li>
							  								<label><input type="checkbox"> 摄像头2 SJ-1670 </label>
							  							</li>
							  						</ul>
							  					</div>
							  					<div class="col-xs-2" style="padding-left: 2px;padding-right: 2px;text-align: center;">
							  						<div class="col-right" style="border: 1px solid #DBDBDB;background-color: #def1f4;">
							  							<img src="${pageContext.request.contextPath}/content/images/mapCommand/ico6.png" />
						  							</div>
							  					</div>
							  					
							  					<div class="clearfix"/>
							  				</li>
							  				
							  				<li class="list-group-item" style="padding: 10px 10px 1px 10px;border: none;">
							  					<div class="col-xs-12 col-left" style="border: 1px solid #DBDBDB;background-color: #def1f4;min-height: 100px;">
							  						<h4>
							  							<img src="${pageContext.request.contextPath}/content/images/mapCommand/ic_police2_pLcar.png" /> 警车
							  						</h4>
							  						<ul class="list-unstyled">
							  							<li>
							  								<label><input type="checkbox"> 桂 888888 </label>
							  							</li>
							  							<li>
							  								<label><input type="checkbox"> 桂 888888 </label>
							  							</li>
							  							<li>
							  								<label><input type="checkbox"> 桂 888888 </label>
							  							</li>
							  						</ul>
							  					</div>
							  					
							  					<div class="clearfix"/>
							  				</li>
							  				
							  				<li class="list-group-item" style="padding: 10px 10px 1px 10px;border: none;">
							  					<div class="col-xs-10 col-left" style="border: 1px solid #DBDBDB;background-color: #def1f4;min-height: 100px;">
							  						<h4>
							  							<img src="${pageContext.request.contextPath}/content/images/mapCommand/ic_GH.png" /> 执法仪
							  						</h4>
							  						<ul class="list-unstyled">
							  							<li>
							  								<label><input type="checkbox"> DJS-232342 </label>
							  							</li>
							  							<li>
							  								<label><input type="checkbox"> DJS-232342 </label>
							  							</li>
							  							<li>
							  								<label><input type="checkbox"> DJS-232342 </label>
							  							</li>
							  						</ul>
							  					</div>
							  					<div class="col-xs-2" style="padding-left: 2px;padding-right: 2px;text-align: center;">
							  						<div class="col-right" style="border: 1px solid #DBDBDB;background-color: #def1f4;">
							  							<img src="${pageContext.request.contextPath}/content/images/mapCommand/ico7.png" />
							  							<img src="${pageContext.request.contextPath}/content/images/mapCommand/ico8.png" />
							  							<img src="${pageContext.request.contextPath}/content/images/mapCommand/ico9.png" />
						  							</div>
							  					</div>
							  					
							  					<div class="clearfix"/>
							  				</li>
							  			</ul>
						  			</div>
						  			
						  		</div>
						   	</div>
						</div>
					</div>

					<div class="col-xs-9" id="div_right" style="height: 100%;padding-left: 0px;padding-right: 0px;">
						<div class="col-xs-9" style="height: 100%;padding-left: 0px;padding-right: 0px;">
							<div style="height: 100%; width: 15px;background-color: #DBDBDB;float: left;margin-right: 5px;">
								<img alt="" src="" id="img" style="height: 100%; width: 0px;">
								<a id="a_drag" href="javascript:void(0);" style="vertical-align: middle;"><i class="fa fa-angle-left fa-2x"></i><i class="fa fa-angle-right fa-2x hidden"></i></a>
							</div>
							<div style="height: 100%;padding: 5px;position: relative;margin-left: 15px;">
								<div id="mapDiv" style="height:100%;border: 1px solid #CCCCCC;"></div>
								<div style="position: absolute;top: 10px;left: 70px;width: 250px;">
									<div class="input-group">
								    	<input type="text" class="form-control" name="" id="" value="" placeholder="警号、姓名、设备号..." />
								        <span class="input-group-btn">
								        	<button id="btn_search" class="btn btn-primary"><i class="fa fa-search"></i></button>
								        </span>
								    </div>
								</div>
							</div>	
						</div>
						
						<div id="div_gxxocx" class="col-xs-3" style="height: 100%;padding-left: 0px;padding-right: 0px;">
							<object id="regOcxDiv1" classid="clsid:455791d4-4095-4f70-b2b3-f5c424f25ad9" width="100%" height="25%"></object>
  							<object id="regOcxDiv2" classid="clsid:455791d4-4095-4f70-b2b3-f5c424f25ad9" width="100%" height="25%"></object>
  							<object id="regOcxDiv3" classid="clsid:455791d4-4095-4f70-b2b3-f5c424f25ad9" width="100%" height="25%"></object>
  							<object id="regOcxDiv4" classid="clsid:455791d4-4095-4f70-b2b3-f5c424f25ad9" width="100%" height="25%"></object>
						</div>
					</div>
				</div>
			</div>
		</div>
		
		<script type="text/javascript">
			var basePath = "${pageContext.request.contextPath}";
		</script>

        <script type="text/javascript" src="${pageContext.request.contextPath}/content/js/jquery-1.12.1.min.js" type="text/javascript"></script>
        <script type="text/javascript" src="${pageContext.request.contextPath}/content/js/bootstrap.min.js" type="text/javascript"></script>
    	<script type="text/javascript" src="${pageContext.request.contextPath}/content/uilib/zTree_v3/js/jquery.ztree.all.min.js"></script>
    	<script type="text/javascript" src="${pageContext.request.contextPath}/content/uilib/jquery-jsonp/src/jquery.jsonp.js"></script>
    	<script type="text/javascript" src="${pageContext.request.contextPath}/content/uilib/gis_js/config.js"></script>
		<script type="text/javascript" src="http://192.168.21.20:8088/jsapi/3.14/init.js"></script>
		<script type="text/javascript" src="${pageContext.request.contextPath}/content/js/mapCommand/gxxOCX.js"></script>
		<script type="text/javascript" src="${pageContext.request.contextPath}/content/js/base/gis.js"></script>
		<script type="text/javascript" src="${pageContext.request.contextPath}/content/js/common/header.js"></script>
		<script type="text/javascript" src="${pageContext.request.contextPath}/content/js/mapCommand/trees.js"></script>
    	<script type="text/javascript" src="${pageContext.request.contextPath}/content/js/mapCommand/index.js"></script>
	</body>
</html>