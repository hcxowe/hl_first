
/**
 * gdropdown.js 下拉菜单，提供一个div内容块，控制这个div粘附在元素上
 * 
 * @param width
 *            内容块高度 height 内容块高度 content 内容块选择器，必填，target
 *            需要粘住的元素，不填，默认是粘附在触发事件所在元素上
 * @author liuxg
 */
(function(jQuery) {
	$.gdropdown = function(options,param) {
		
		if(options && "string" == typeof(options) && "hide" == options) { //调用方法
			if(param && $(param).is(":visible")){
				$(param).hide();
			}
			return ;
		}
		
		if (!options || !options.content || !options.target || !options.triev) return;        // 必填参数没有，直接返回
	
		var settings = settingsHandler();                                         // 初始化设置
		focusHandler($(options.target)); 
		if(!$(options.target).attr("init") && $(options.target).attr("init") != "yes"){
			$(document).on("click", function(ev) {                                 //注册document事件
				if (ev.target != $(settings.content)[0]                            // 事件不在下拉列表上
						&& $(ev.target).parents(settings.content).length == 0      // 事件不在下拉列表的子元素上
						&& ev.target != $(options.target)[0]                       // 过滤吸附的事件源
						&& ev.target != options.triev.target) {                    // 过滤触发下拉框的事件源                 
					    focusoutHandler(ev);
				}
			});
			$(options.target).attr("init","yes");         //给对象添加一个属性，避免用户重复初始化
		}
		
		/**
		 * 焦点事件处理
		 */
		function focusHandler(target) {
			var left = target.offset().left;
			var top = target.offset().top + $(target).outerHeight() + 1;
			if (top + $(settings.content).outerHeight() > $(window)
					.outerHeight()) { // 边界检测，超出底部，框往上
				top = target.offset().top
						- $(settings.content).outerHeight() - 1;
			}
			if (left + $(settings.content).outerWidth() > $(window)
					.outerWidth()) { // 边界检测，超出右侧，框往左
				left = target.offset().left + target.outerWidth()
						- $(settings.content).outerWidth();
			}
			
			///$(settings.content).offset({"left":left , "top" : top});
			$(settings.content).css("left", left + "px").css("top", top + "px");
			if ($(settings.content).is(":hidden")) {
				$(settings.content).show();
			}
		}
		;

		/**
		 * 失去焦点事件处理
		 */
		function focusoutHandler(ev) {
			if ($(settings.content).is(":visible")) {
				$(settings.content).hide();
			}
		}

		/**
		 * 初始化一些设置
		 */
		function settingsHandler() {
			var settings = {       // 默认设置
				content : null,    // 需要吸附的内容块jq选择器或元素js dom对象
				target : null,     // 需要吸附的元素jq选择器或元素js dom对象
				triev : null,      // 触发下拉框的事件源
			    width : "153px",   // 默认宽度
			    height : "120px"   // 默认高度
			}
			settings =  $.extend(settings, options);
			$(options.content).css("min-width", settings.width); // 配置宽度
			$(options.content).css("min-height", settings.height); // 配置高度
			return settings ;
		}
		;

		return {
			"settings" : settings,
			"hide" : function(ev) {
				if ($(settings.content).is(":visible")) {
					$(settings.content).hide();
					ev.stopPropagation(); // 阻止事件下发
				}
			},
			"destory" : function() {
                $(document).off("click");
                $(options.target).removeAttr("init","no");
			}

		}
	}
})(jQuery)