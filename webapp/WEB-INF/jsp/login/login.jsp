<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="zh-CN">
<%String path = request.getContextPath();
	String basePath = request.getScheme() + "://" + 
	request.getServerName() + ":" + 
	request.getServerPort()+ path + "/";%>
<head>
<base href="<%=basePath%>"></base>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<meta name="renderer" content="webkit" />

<title>文档管理系统-登陆</title>

<meta name="viewport" content="width=device-width,initial-scale=1.0" />

<!-- 引入 Bootstrap -->
<link href="content/css/bootstrap.min.css" rel="stylesheet" />
<link href="content/css/login.css" rel="stylesheet" />

<!-- jQuery (Bootstrap 的 JavaScript 插件需要引入 jQuery) -->
<script src="content/js/jquery-1.12.1.min.js"></script>

<!-- 包括所有已编译的插件 -->
<script src="content/js/bootstrap.min.js"></script>

<!-- HTML5 Shim 和 Respond.js 用于让 IE8 支持 HTML5元素和媒体查询 -->
<!-- 注意： 如果通过 file://  引入 Respond.js 文件，则该文件无法起效果 -->
<!--[if lt IE 9]>
		   <script src="https://oss.maxcdn.com/libs/html5shiv/3.7.0/html5shiv.js"></script>
		   <script src="https://oss.maxcdn.com/libs/respond.js/1.3.0/respond.min.js"></script>
		<![endif]-->

<script type="text/javascript" src="content/js/security.js"></script>
<script type="text/javascript" src="content/js/md5.js"></script>

<script>
	window.onload = function() {
		$("#btn_login").on("click", function() {
 			var userName = $("input[name='j_username']").val();
			var password = $("input[name='j_password']").val();
			var result = checkUserPassword(userName, password);//检测登录
			var code = result.code;
			var msg = result.msg;
			if (code != 200) {
				alert(msg);
				return;
			} 
			//如果有需要保存密码，可以引入jquery.cookie.js保存cookie
			/* 					if(that.bSavePassword){ 
			 $.cookie(userName , password , { expires: 7 });
			 } */
			$("input[name='j_password']").val(hex_md5(password));
			$("form").submit(); //验证成功，直接提交表单，会自动跳转到index.jsp
			return;
		});
	}
</script>
</head>

<body>
	<div class="main_container">
		<div class="container">
			<div class="row">
				<div class="col-sm-8 col-sm-offset-2">
					<div class="login_title"></div>
				</div>
			</div>

			<div class="row">
				<div class="col-sm-6 col-sm-offset-2">
					<div class="login_u"></div>
				</div>
			</div>

			<div class="row">
				<div class="col-sm-8 col-sm-offset-2">
					<div class="row">
						<div class="col-sm-8 col-sm-offset-2">
							<form method="post" action="j_security_check">
								<div class="form-group">
									<div class="input-group input_user">
										<span class="input-group-addon"
											style="background-color: #B62015;"><span
											class="glyphicon glyphicon-user" style="color: #FFFFFF;"></span></span>
										<input name="j_username" type="text" class="form-control"
											placeholder="请输入用户名" />
									</div>

									<div class="input-group input_pwd">
										<span class="input-group-addon"
											style="background-color: #B62015;"><span
											class="glyphicon glyphicon-lock" style="color: #FFFFFF;"></span></span>
										<input name="j_password" type="password" class="form-control"
											placeholder="请输入密码" />
									</div>

									<div class="btn_sub">
										<input id="btn_login" type="button"
											class="btn btn-danger btn-lg col-sm-12"
											style="font-family: '微软雅黑'; height: 39px; font-size: 15px;"
											value="登录" />
									</div>

									<div class="lab_concact">
										<label
											style="font-family: '微软雅黑'; color: #0000FF; width: 239px; font-size: 12px; text-align: right;">忘记密码请联系管理员</label>
									</div>
								</div>
							</form>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>

	<div class="main_footer">
		<div class="login_right">
			<label
				style="font-family: '微软雅黑'; color: #FFFFFF; width: 1000px; font-size: 13px; text-align: center;">版权所有©
				2016中华人民共和国公安局交通管理局</label><br /> <label
				style="font-family: '微软雅黑'; color: #FFFFFF; width: 1000px; font-size: 13px; text-align: center;">著作权号:
				中华人民共和国国家版权局2011SR012287</label><br /> <label
				style="font-family: '微软雅黑'; color: #FFFFFF; width: 1000px; font-size: 13px; text-align: center;">技术支持:
				广州市国迈科技有限公司 支持电话: 020-2839 8008</label><br /> <label
				style="font-family: '微软雅黑'; color: #FFFFFF; width: 1000px; font-size: 13px; text-align: center;">软件版本号:
				V1.0.0 发布日期: 2016-01-01</label><br />
		</div>
	</div>
</body>
</html>