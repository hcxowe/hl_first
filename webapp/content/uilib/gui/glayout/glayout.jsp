<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>布局demo</title>
</head>
<body>
	<jsp:include page="gheader.jsp" />

	<div class="main-container">
		<div class="left-side gray"> <!--左边菜单栏 -->
			<ul class="menu">
				<li class="item"> <!-- 添加active关键字表明选中此项 -->
					<button type="button" class="item-btn"
						src="demo/commonplugin/commonplugin.html"> <!-- src表明点击之后的路径  -->
						<i class="fa fa-tachometer"></i><span>主菜单一</span>
					</button>
				</li>
				<li class="item">
					<button type="button" class="item-btn">
						<i class="fa fa-paper-plane"></i><span>主菜单二</span> <i
							class="fa fa-angle-down dropdown-icon"></i>
					</button>
					<ul class="child-menu">
						<li class="child-item active"> <!-- 子菜单添加active关键字表明选中此项 -->
							<button type="button" src="demo/webuploader/webuploader.html">
								<span>子菜单一</span>
							</button>
						</li>
						<li class="child-item">
							<button type="button"
								src="demo/My97DatePicker/My97DatePicker.html">
								<span> 子菜单二</span>
							</button>
						</li>
						<li class="child-item">
							<button type="button"
								src="demo/bootstrap-table/bootstrap-table.html">
								<span> 子菜单三</span>
							</button>
						</li>
					</ul>
				</li>
				<li class="item">
					<button type="button" class="item-btn">
						<i class="fa fa-comments-o"></i><span>主菜单三</span> <i
							class="fa fa-angle-down dropdown-icon"></i>
					</button>
					<ul class="child-menu">
						<li class="child-item">
							<button type="button" src="demo/nprogress/nprogress.html">
								<span>子菜单一</span>
							</button>
						</li>
						<li class="child-item">
							<button type="button" src="demo/numberpb/numberpb.html">
								<span>子菜单二</span>
							</button>
						</li>
					</ul>
				</li>
			</ul>
		</div>
		<div class="right-side">
			<iframe src="page1.html" frameborder="0" scrolling="yes"></iframe>
		</div>
		<div class="clear-float"></div><!-- 清除浮动 -->
	</div>

	<jsp:include page="gfooter.jsp" />
</body>
</html>