
var icon_base_path = "/uilib/resources/uilib/lib/aui-artDialog-6.0.4-3/";

/**
 * 操作成功提示
 * 
 * @param content
 *            提示内容，默认是"操作成功"
 * @param sleep
 *            多少秒关闭,默认是2秒
 */
function successBox(content, sleep) {
	var d = dialog(
			{
				content : "<img src = "
						+ icon_base_path + "icons/succeed.png>"
						+ "<span style = 'position:relative;top:-18px;'>" 
						+ (content == null ? "操作成功^_^" : content) + "</span>"
			}).showModal();

	setTimeout(function() {
		d.close().remove();
	}, sleep == null ? 1000 : sleep);
}


/**
 * 操作失败提示
 * 
 * @param content
 *            提示内容，默认是"操作失败"
 * @param sleep
 *            多少秒关闭,默认是2秒
 */
function errorBox(content, sleep) {

	var d = dialog(
			{
				content : "<img src = "
						+ icon_base_path +  "icons/error.png>"
						+ "<span style = 'position:relative;top:-18px;'>" 
						+ (content == null ? "操作失败-_-!" : content) + "</span>"
			}).showModal();

	setTimeout(function() {
		d.close().remove();
	}, sleep == null ? 1000 : sleep);
}

/**
 * 操作提示
 * 
 * @param content
 *            提示内容 默认"不允许此操作"
 * @param sleep
 *            多少秒关闭 默认2秒
 */
function warningBox(content, sleep) {

	var d = dialog(
			{
				content : "<img src = "
						+ icon_base_path + "icons/warning.png>"
						+ "<span style = 'position:relative;top:-18px;'>"  
						+ (content == null ? "不允许此操作!" : content)
						+ "</span>"
			}).showModal();

	setTimeout(function() {
		d.close().remove();
	}, sleep == null ? 1000 : sleep);
}

/**
 * 确定box
 * 
 * @param content
 *            确定内容
 * @param fun
 *            确定所调用的函数
 */
function confirmBox(content, confirmFun,cancelFun) {
	dialog(
			{
				title : "确认",
				content : "<img src = "
						+ icon_base_path + "icons/question.png>  "
						+ "<span style = 'position:relative;top:-18px;'>" + content + "</span>",
				button : [ {
					value : '确定',
					autofocus : true,
					callback : confirmFun
				}, {
					value : '取消',
					callback : cancelFun
				} ]
			}).showModal();
}