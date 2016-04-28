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
						</ul>
						<div id="myTabContent" class="tab-content" style="background-color: #FFF; margin-left: 50px;height: 100%; overflow: auto;">
						   	<div class="tab-pane fade" id="camera">
								<div class="input-group">
							    	<input type="text" class="form-control" name="" id="" value="" placeholder="警号、姓名、设备号..." />
							        <span class="input-group-btn">
							        	<button class="btn btn-primary"><i class="fa fa-search"></i></button>
							        </span>
							    </div>
						  		<div class="left">
									<ul id="tree_camera" class="ztree ztree-camera"></ul>
								</div>
						   	</div>
						   	<div class="tab-pane fade" id="police">
						   		<div class="input-group">
							    	<input type="text" class="form-control" name="" id="" value="" placeholder="警号、姓名、设备号..." />
							        <span class="input-group-btn">
							        	<button class="btn btn-primary"><i class="fa fa-search"></i></button>
							        </span>
							    </div>
						  		<div class="left">
									<ul id="tree_police" class="ztree ztree-police"></ul>
								</div>
						   	</div>
						   	<div class="tab-pane fade" id="tingzi">
						   		<div class="input-group">
							    	<input type="text" class="form-control" name="" id="" value="" placeholder="警号、姓名、设备号..." />
							        <span class="input-group-btn">
							        	<button class="btn btn-primary"><i class="fa fa-search"></i></button>
							        </span>
							    </div>
						  		<div class="left">
									<ul id="tree_tingzi" class="ztree ztree-tingzi"></ul>
								</div>
						   	</div>
						   	<div class="tab-pane fade" id="scar">
						   		<div class="input-group">
							    	<input type="text" class="form-control" name="" id="" value="" placeholder="警号、姓名、设备号..." />
							        <span class="input-group-btn">
							        	<button class="btn btn-primary"><i class="fa fa-search"></i></button>
							        </span>
							    </div>
						  		<div class="left">
									<ul id="tree_scar" class="ztree ztree-scar"></ul>
								</div>
						   	</div>
						   	<div class="tab-pane fade" id="g4g">
						   		<div class="input-group">
							    	<input type="text" class="form-control" name="" id="" value="" placeholder="警号、姓名、设备号..." />
							        <span class="input-group-btn">
							        	<button class="btn btn-primary"><i class="fa fa-search"></i></button>
							        </span>
							    </div>
						  		<div class="left">
									<ul id="tree_4g" class="ztree ztree-g4g"></ul>
								</div>
						   	</div>
						   	<div class="tab-pane fade" id="bcar">
						   		<div class="input-group">
							    	<input type="text" class="form-control" name="" id="" value="" placeholder="警号、姓名、设备号..." />
							        <span class="input-group-btn">
							        	<button class="btn btn-primary"><i class="fa fa-search"></i></button>
							        </span>
							    </div>
						  		<div class="left">
									<ul id="tree_bcar" class="ztree ztree-bcar"></ul>
								</div>
						   	</div>
					    </div>
					</div>	
					
					<div class="col-xs-9" id="div_right" style="height: 100%;padding-left: 0px;padding-right: 0px;">
						<div style="height: 100%; width: 15px;background-color: #DBDBDB;float: left;margin-right: 5px;">
							<img alt="" src="" id="img" style="height: 100%; width: 0px;">
							<a id="a_drag" href="javascript:void(0);" style="vertical-align: middle;"><i class="fa fa-angle-left fa-2x"></i><i class="fa fa-angle-right fa-2x hidden"></i></a>
						</div>
						<div style="height: 100%;padding: 5px;margin-left: 15px;position: relative;">
							<div class="col-xs-12" style="z-index:99;background-color: #0078d7;height: 45px;padding-left: 10px;padding-right: 10px;position: absolute;left: 0px;">
								<h3 style="float: left;margin-top: 10px;color: #FFF;"><strong>监控画面</strong></h3>
								<div style="float: right;">
									<button class="btn btn-primary">四分屏</button>
									<button class="btn btn-primary">八分屏</button>
									<button class="btn btn-primary">十六分屏</button>
								</div>
							</div>
							<div class="col-xs-12" style="height: 100%;padding-left: 0px;padding-right: 0px;padding-top: 50px;">
								<div class="col-xs-12" style="overflow: auto;height: 100%;padding-left: 0px;padding-right: 0px;">
									<div class="col-xs-6" style="background-color: #000;height: 315px;border: 5px solid #0078D7;"></div>
									<div class="col-xs-6" style="background-color: #000;height: 315px;border: 5px solid #FFFFFF;"></div>
									<div class="col-xs-6" style="background-color: #000;height: 315px;border: 5px solid #FFFFFF;"></div>
									<div class="col-xs-6" style="background-color: #000;height: 315px;border: 5px solid #FFFFFF;"></div>
								</div>
							</div>
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
    	<script type="text/javascript" src="${pageContext.request.contextPath}/content/js/common/header.js"></script>
    	<script type="text/javascript" src="${pageContext.request.contextPath}/content/js/videoMonitor/index.js"></script>
	</body>
</html>