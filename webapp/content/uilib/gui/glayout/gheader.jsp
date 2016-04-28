<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>布局demo</title>
<link href="glayout.css" rel="stylesheet" type="text/css">
<link rel="stylesheet" type="text/css" href="../../font-awesome/css/font-awesome.min.css" />
</head>
<body>
<!-- 头部导航栏 -->
<div class="gnavbar">
	<a class="navbar-logo" href="#"> 
	    <!-- <img alt="Brand" src="demoimg/logo.png"> -->
		<i class="fa fa-leaf"></i><span>高新兴UI插件库</span>
	</a>
	<!-- 一级菜单   -->
	<ul class="navbar-menu">
		<li class="menu-item">
		 <img alt="图标" src="demoimg/setting.png">
		 <a href="#">主菜单一</a>
		</li>
		<li class="menu-item">
		  <i class="fa fa-book micon"></i>
		  <a href="#">主菜单二</a>
		</li>
		<li class="menu-item drop active">
		   <a href="#">主菜单三 </a>
		   <i class="fa fa-caret-down dropdown-icon"></i><!-- 下三角 -->
		   <ul class="dropdown">
				<li><a href="#"><i class="fa fa-book"></i>子菜单一</a></li>
				<li><a href="#"><i class="fa fa-rocket"></i>子菜单二</a></li>
				<li><a href="#"><i class="fa fa-hand-o-right"></i>子菜单三</a></li>
				<li class="divider"></li>
				<li><a href="#"><i class="fa fa-smile-o"></i>子菜单四</a></li>
		   </ul> 
		</li>
		<li class="menu-item">
		  <a href="#">主菜单四</a>
		</li>
	</ul>
	
	<!-- 用户信息 -->
	<div class="setting-info drop"> 
	 <!--  <i class="fa fa-user header-icon"></i> -->
	  <img src="demoimg/header.jpg">
	  <span>管理员</span>
         <i class="fa fa-caret-down dropdown-icon"></i>
         <ul class = "dropdown">
		<li><a href="#"><i class="fa fa-book"></i>我的信息</a></li>
		<li><a href="#"><i class="fa fa-key"></i>设置密码</a></li>
		<li><a href="#"><i class="fa fa-wrench"></i>更改主题</a></li>
		<li class="divider"></li>
		<li><a href="#"><i class="fa fa-power-off"></i>退出系统</a></li>
	  </ul>
	</div>
</div>
<script type="text/javascript" src="../../jquery/jquery-1.11.2.min.js"></script>
<script type = "text/javascript" src = "glayout.js" ></script>
</body>
</html>

