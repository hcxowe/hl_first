$(function() {
	leftNavbar.init();
	$(window).resize(function() {
		leftNavbar.initLayout();
	});

});

/**
 * 左边目录栏操作
 */
var leftNavbar = {

	init : function() {
		this.initLayout();
		if($(".left-side").length > 0 ){
			this.initSelectItem();
			this.bindEvent();
		}
	},

	initLayout : function() {
		
		if($(".left-side").length > 0 ){
			$(".left-side").css("height", ($(window).outerHeight() - 90) + "px");
			$(".right-side").css("height", ($(window).outerHeight() - 90) + "px");
			$(".right-side iframe").css("height", ($(window).outerHeight() - 93) + "px")
		}else{
			$(".main-container").height($(window).outerHeight() - 50 - 30 - 5);
		}
		
	},

	bindEvent : function() {
		/**
		 * 主菜单的点击事件
		 */
		$(".item-btn").on("click", function() {
			leftNavbar.noMainItem($(this).parent()[0]); // 去掉其他主菜单的选择样式
			leftNavbar.selMainItem($(this).parent()[0]); // 添加点击的主菜单的选择样式
			leftNavbar.changeIframeSrc($(this).attr("src")) // 路径跳转
		});

		/**
		 * 子菜单的点击事件
		 */
		$(".child-item button").on("click", function() {
			leftNavbar.noChildItem($(this).parent()[0]);
			leftNavbar.selChildItem($(this).parent()[0]);
			leftNavbar.changeIframeSrc($(this).attr("src")) // 跳转
		});

	},

	changeIframeSrc : function(src) {
		if (src) {
			$($("iframe")[0]).attr("src", src);
		}
	},

	initSelectItem : function() { // 初始化有active字样的item
		var activeChild = $(".child-menu .child-item.active button"); // 找到button
		if (activeChild.length > 0) {
			leftNavbar.selMainItem(activeChild.parents(".item")[0]);
			leftNavbar.changeIframeSrc(activeChild.attr("src")) // 跳转
		} else {
			var item = $(".menu .item.active .item-btn");
			if (item.length > 0) {
				leftNavbar.changeIframeSrc(item.attr("src")) // 跳转
			}
		}

	},

	selChildItem : function(obj) { // 选中子菜单样式
		$(obj).addClass("active");
	},

	noChildItem : function(sel) { // 不选中子菜单样式
		$(".child-item").parents(".item.active").addClass("no-arrow");
		$(".child-item").not(sel).removeClass("active");
	},

	selMainItem : function(obj) { // 主菜单选中时的样式
		var childMenu = $(obj).find(".child-menu");
		$(obj).addClass("active");
		if (childMenu.length > 0) {// 有子菜单
			if (childMenu.css("display") != "block") {
				childMenu.slideDown("fast");
			} else {
				childMenu.slideUp("fast");
			}
			
			$(obj).addClass("no-arrow");
		}
	},

	noMainItem : function(sel) {// 取消主菜单选择样式
		$(".menu .item").not(sel).removeClass("active");
		$(".menu .item").not(sel).find(".child-item.active").removeClass(
				"active"); // 去掉子菜单的选中
		// 查找不包括自己的有子菜单的主菜单，再根据这些主菜单查找没有收起的子菜单
		var childMenu = $(".menu .item").not(sel).has(".child-menu").find(
				".child-menu:visible");
		if (childMenu.length > 0) {
			childMenu.slideUp("fast");
		}

	}

}
