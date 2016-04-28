<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<div class="header">
	<div class="container-fluid">
		<a class="ma-brand text-center" href="#">
			<img src="${pageContext.request.contextPath}/content/images/header/main_title.png" style="vertical-align: top;"/>
		</a>
        <ul class="ma-nav" id="nav">
            <li class="ma-active" data-url = "/home/monitor.html">
                <a href="${pageContext.request.contextPath}/map/command/index.action">
                   <i class="fa fa-map"></i> 实时指挥
                </a>
            </li>
            
            <li class="hidden">
                <a href="${pageContext.request.contextPath}/videoMonitor/index.action">
                    <i class="fa fa-video-camera"></i> 视频监控
                </a>
            </li>
            
            <li class="hidden">
                <a href="javascript:void(0)">
                    <i class="fa fa-play-circle-o"></i> 录像回放
                </a>
            </li>
            
            <li class="hidden">
                <a href="javascript:void(0)">
                    <i class="fa fa-gg"></i> 轨迹查询
                </a>
            </li>
            
            <li class="hidden">
                <a href="javascript:void(0)">
                    <i class="fa fa-exclamation-triangle"></i> 告警管理
                </a>
            </li>
        </ul>
        
        <!-- 右侧导航工具 -->
        <ul class="ma-nav ma-nav-clear" style="float: right;">
            <li class="">
                <a class="bell" href="javascript:void(0)" title="home" style="font-size: 20px;">
                    <i class="fa fa-home"></i>
                </a>
            </li>
            <li class="">
                <a href="javascript:void(0)" title="help" style="font-size: 20px;">
                    <i class="fa fa-question-circle-o"></i>
                </a>
            </li>
            <li class="dropdown">
                <a href="#" class="dropdown-toggle" data-toggle="dropdown" style="font-size: 20px;">
                    <i class="fa fa-cog"></i>
                    <span class="caret"></span>
                </a>
                <ul class="dropdown-menu">
                    <li><a href="#">操作</a></li>
                    <li><a href="#">操作</a></li>
                    <li><a href="#">操作</a></li>
                </ul>
            </li>
            <li class="">
                <a href="javascript:void(0)" title="退出" style="font-size: 20px;">
                    <i class="fa fa-sign-out"></i>
                </a>
            </li>
        </ul>
	</div>
</div>
