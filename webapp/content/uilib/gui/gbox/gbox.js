

/**
 * gbox.js
 * @param handlers 事件处理，有右边事件['tab','bclose' ,'bexpand' ,'bcompress'] tab tab切换事件 返回false不切换
 * bclose 窗口关闭之前的事件 返回false不关闭窗口 bexpand 全屏之前的事件 返回false不全屏 bcompress
 * 收缩之前的事件，返回false不返回原来事件 bup 收起之前的事件 返回false 不执行 bdown 下拉之前的事件 返回false 不执行
 * dragable true 可拖动 false 不拖动 ，默认不拖动 
 * @author liuxg
 */
$.fn.gbox = function(handlers) {
	var that = this;
	var gboxWidth = $(that).outerWidth();
	var gbodyHeight = $(that).find(".gbody").outerHeight();
	
	toolHandler();
	tabHandler();
	dragerHandler();

	/**
	* 拖动处理
	*/
	function dragerHandler(){

	   if(handlers && handlers.dragable){ //如果用户需要开启拖动，则做拖动处理
	        $(that).find(".gec").css("display","none");
			var move = false ;
			$(that).mousedown(function(e) {
			 
			   if($(e.target).parents(".gtool").length > 0) return ;   //工具栏事件不下发
			   move = true;
			   if($(that).css("position") == "relative"){		//将拖动体变为绝对定位 
				   $(that).css("position","absolute")
				   .css("z-index",1000)
				   .css("left",$(that).offset().left)
				   .css("top",$(that).offset().top);  
				}
			    $(that).css("cursor" , "move");   //将鼠标变化变成移动手形
				_x = e.pageX - parseInt($(that).css("left"));   //获取鼠标和拖动体边缘的位置
				_y = e.pageY - parseInt($(that).css("top"));
				
				$(document).bind("mousemove" ,function(e){
					if (move) {
					
						var x = e.pageX - _x;  //控件左上角到屏幕左上角的相对位置
						var y = e.pageY - _y;
						
						if(y < 0) y = 0 ;      //越出顶部
						if(x < 0) x = 0 ;      //越出左边界
						if(x + $(that).width() > $(window).width()){		//越出右边界       
							x = $(window).width() - $(that).width() - 3 ;
						}
						if(y + $(that).height() > ($(window).height() + $(window).scrollTop())){	 //越出底部      	            
							y = ($(window).height() + $(window).scrollTop()) - $(that).height() - 3 ;
						}
						
						$(that).css("top" ,y).css("left" ,x);   //修改拖动体位置
					}
				});
				
				$(document).bind("mouseup",function(e){   //删除事件
					move = false;
					$(this).unbind("mouseup");
					$(this).unbind("mousemove");
					$(that).css("cursor" , "default");
				});
		    });
		}
	}
	
	/**
	 * 工具栏处理
	 */
	function toolHandler() {
		if ($(that).find(".gtool").length > 0) { // 工具栏存在
			$(that)
					.find(".gtool span")
					.on(
							"click",
							function(e) { // 注册工具栏基本事件
								switch ($(this).attr("class")) {
								case "gflex":

									if ($(that).find(".gbody:visible").length > 0) { // 展开，需要收缩
										if (userEventHandler("bup")) {
											$(that).find(".gbody").slideUp(
													"fast");
											$(this)
													.find("i")
													.removeClass(
															"fa-angle-double-up")
													.addClass(
															"fa-angle-double-down");
										}
									} else { // 需要展开
										if (userEventHandler("bdown")) {
											$(that).find(".gbody").slideDown(
													"fast");
											$(this)
													.find("i")
													.removeClass(
															"fa-angle-double-down")
													.addClass(
															"fa-angle-double-up");
										}
									}
									break;
								case "gclose": // 关闭按钮
									if (userEventHandler("bclose"))
										$(that).fadeOut(); // 返回false的时候，不关闭窗口
									break;
								case "gec":
									var gbody = $(that).find(".gbody");
									var gheader = $(that).find(".gheader");
									var gfooter = gbody.find(".gfooter");
									var toolIcon = gheader.find(".gtool .gec i");
									if (toolIcon.hasClass("fa-expand")) { // 原型状态

										if (userEventHandler("bexpand")) { // 返回false不打开
											$(that).css("position", "absolute")
													.css("width", // 将box编程绝对定位
													$(window).width() - 2).css(
															"top", 0).css(
															"left", 0).css(
															"z-index", 1001);
											gbody.css("height", $(window)
													.height()
													+ $(window).scrollTop()
													- gheader.outerHeight()
													- gfooter.outerHeight()
													- 3
													+ "px"); // 计算gbody的高度
											gheader.find(".gtool .gec i")
													.removeClass("fa-expand")
													.addClass("fa-compress");
										}
									} else { // 缩为原来职位
										if (userEventHandler("bcompress")) { // 返回false不打开
											$(that).css("position", "relative")
													.css("width", // 将box变为相对定位
													gboxWidth + 2).css(
															"z-index", 0);
											gbody.css("height", gbodyHeight
													+ "px");
											gheader.find(".gtool .gec i")
													.removeClass("fa-compress")
													.addClass("fa-expand");
										}
									}
									break;
								}

							});
		}
	}

	/**
	 * tab处理
	 */
	function tabHandler() {
		if ($(that).find(".gtab").length > 0) {
			$(that).find(".gtab button").on(
					"click",
					function() {
						if (userEventHandler("tab", $(this))) { // 先处理用户事件
							$(that).find(".gtab button").not(this).removeClass(
									"current");
							$(this).addClass("current");
						}

					});
		}
	}

	/**
	 * 用户事件处理，返回true执行后面动作，false不执行后面动作
	 */
	function userEventHandler(eventType, param) {
		var b = true;
		if (handlers && handlers[eventType]) { // 用户有传事件进来则调用用户事件，再切换tab
			b = handlers[eventType](param);
		}
		return typeof (b) == "undefined" ? true : b;
	}

}
