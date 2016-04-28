//index.js
$('document').ready(function(){

	navSelect(1);
	
	$('a[data-toggle="pill"]').on('shown.bs.tab', showTab);
	
	$('#myTab a:first').tab('show');

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

function getOrgtree(type)
{
	var setting = {
		data : {
			key : {
				children : "children",
				name	 : "userName"
			}
		},
		/*async: {
				enable		: true,
				url			: "../../system/org/user.action",
				autoParam	: ["orgCode=org_id"],
				type		: 'get',
				dataFilter  : filter
		}, */
		check: {
			enable: true
		},
		view : {
			
		},
		callback : {
			beforeExpand: zTreeBeforeExpand,
			beforeClick: beforeClick,
		}
	};
	
	$.ajax({
        url		: "../system/org.action",
        type	: "get",
        data	: null,
        async	: false,
        cache	: false,
        error	: function() {
          	alert("获取数据失败`~`");
          	return;
		},
        
        success : function(msg) 
        {
        	setnoCP(msg);
        	
        	switch(type){
				case "#camera" :
					$.fn.zTree.init($("#tree_camera"), setting, msg);break;
				case "#police" :
					$.fn.zTree.init($("#tree_police"), setting, msg);break;
				case "#tingzi" :
					$.fn.zTree.init($("#tree_tingzi"), setting, msg);break;
				case "#scar"   :
					$.fn.zTree.init($("#tree_scar"), setting, msg);break;
				case "#g4g"    :
					$.fn.zTree.init($("#tree_4g"), setting, msg);break;
				case "#bcar"   :
					$.fn.zTree.init($("#tree_bcar"), setting, msg);break;
			}	
        }
    });
}

function beforeClick(treeId, treeNode, clickFlag)
{
	return treeNode.click;
}

function zTreeBeforeExpand(treeId, treeNode) 
{
	if(treeNode.isLoaded)
		return true;
		
	tree_addPolice(treeId, treeNode);
	return false;
};

function tree_addPolice(treeId, treeNode)
{
	$.ajax({
        url		: "../system/org/user.action?org_id="+treeNode.id,
        type	: "get",
        data	: null,
        async	: false,
        cache	: false,
        error	: function() {
          	alert("获取数据失败`~`");
          	return;
		},
        
        success : function(msg) 
        {
        	var treeObj = $.fn.zTree.getZTreeObj(treeId);
        	treeNode.isLoaded = true;
        	$.each(msg.body, function(i, value) {
        		value.click = false;
        	});
        	
			newNodes = treeObj.addNodes(treeNode, msg.body);
			treeObj.expandNode(treeNode, true);
			return;
        }
    });		
}

function zTreeBeforeClick(treeId, treeNode, clickFlag) 
{
    //console.log(treeNode);
};

function filter(treeId, parentNode, childNodes) 
{
	if (!childNodes) 
		return null;
	
	return childNodes;
}

function setnoCP(data)
{
	$.each(data, function(i, value) {
		value.userName = value.text;
		value.isLoaded = false;
		value.click = false;
	    if(value.children){
	    	value.nocheck = true;
	    	value.isParent = true;
	    	if(value.children.length != 0){
	    		setnoCP(value.children);
	    	}
	    }
	});
}
	
