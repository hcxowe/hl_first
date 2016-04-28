//index.js
$('document').ready(function(){
	
	navSelect(0);

	$('a[data-toggle="pill"]').on('shown.bs.tab', showTab);
	
	$('#myTab a:first').tab('show');

	mapInit();

	// 隐藏 / 显示 左侧菜单
	$('#a_drag').on("click", function(){
		if($('.fa-angle-left').hasClass('hidden')){
			$('.fa-angle-left').removeClass('hidden');
			$('.fa-angle-right').addClass('hidden');
			$('#div_left').removeClass('hidden');
			$('#div_right').removeClass('col-xs-12');
			$('#div_right').addClass('col-xs-9');
			$('#div_right').css('padding-left', 0);
			$('#div_right').css('padding-right', 0);
		}else{
			$('.fa-angle-left').addClass('hidden');
			$('.fa-angle-right').removeClass('hidden');
			$('#div_left').addClass('hidden');
			$('#div_right').removeClass('col-xs-9');
			$('#div_right').addClass('col-xs-12');
			$('#div_right').css('padding-left', 15);
			$('#div_right').css('padding-right', 0);
		}
	});	
});

function showTab(e) 
{
	//e.target // 激活的标签页
	//e.relatedTarget // 前一个激活的标签页
	var tab = e.target;
	
	if($(tab).hasClass("shown"))
		return;
	
	var type = $(tab).attr("href");
	
	switch(type){
		case "#search":
			$.each($('.col-right'), function(i, e) {
				var h_r  = $(e).height();
				var left = $(e).parent().prev('.col-left');
				var h_l = $(left).height();
				$(e).css("height", h_l+2);
				$(e).css("padding-top", (h_l-h_r)/2);
			});
			break;
		
		case "#camera" :
		case "#police" :
		case "#tingzi" :
		case "#scar"   :
		case "#g4g"    :
		case "#bcar"   :
			getOrgtree(type);
			$(tab).addClass("shown");
			break;
	}
}




