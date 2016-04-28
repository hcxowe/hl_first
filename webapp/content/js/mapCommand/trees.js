function getOrgtree(type)
{
	var setting = {
		data : {
			key : {
				children : "children",
				name	 : "user_name"
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
			onCheck: onChecked
		}
	};
	
	$.ajax({
        url		: "../../system/org.action",
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
					$.fn.zTree.init($("#tree_camera"), setting, msg);
					break;
				case "#police" :
					$.fn.zTree.init($("#tree_police"), setting, msg);
					break;
				case "#tingzi" :
					//$.fn.zTree.init($("#tree_tingzi"), setting, msg);
					break;
				case "#scar"   :
					//$.fn.zTree.init($("#tree_scar"), setting, msg);
					break;
				case "#g4g"    :
					//$.fn.zTree.init($("#tree_4g"), setting, msg);
					break;
				case "#bcar"   :
					//$.fn.zTree.init($("#tree_bcar"), setting, msg);
					break;
			}	
        }
    });
}

function onChecked(event, treeId, treeNode)
{
	if(treeNode.device_code == "") return;
	if(!treeNode.is_online) return;
	
	if(treeNode.checked == false){
		removerMarker(treeNode.user_code);
		return;
	}
	
	var pData = {
		'device_codes' : [treeNode.device_code],
		'device_type'  : treeNode.device_type
	};
	
	$.ajax({
        url			: basePath + "/map/command/device/codes.action",
        type		: "post",
        contentType	: "application/json",
        dataType	: 'json',
        data		: JSON.stringify(pData),
        async		: false,
        cache		: false,
        error		: function() {
          	alert("获取数据失败`~`");
          	return;
		},
      
        success		: function(ret){
        	ret.body[0].user_name = treeNode.user_name;
        	ret.body[0].user_code  = treeNode.user_code;
        	
        	/*var data = {};
        	data.name = treeNode.user_name;
        	data.pno  = treeNode.user_code;
        	data.longitude  = 113.435215; 
        	data.latitude   = 23.16236;*/
        	
        	createMarker(ret.body[0]);
        	//createMarker(data);
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
	var url = "";
	switch(treeId){
		case "tree_camera":
			url = basePath + "/system/org/camera.action?org_code=" + treeNode.orgCode;
			break;
		case "tree_police":
			url = basePath + "/system/org/user.action?org_id=" + treeNode.id;
			break;
		case "tree_tingzi":
			url = basePath + "/system/org/tingzi.action?org_id=" + treeNode.id;
			break;
		case "tree_scar":
			url = basePath + "/system/org/scar.action?org_id=" + treeNode.id;
			break;
		case "tree_4g":
			url = basePath + "/system/org/user.action?org_id=" + treeNode.id;
			break;
		case "tree_bcar":
			url = basePath + "/system/org/bcar.action?org_id=" + treeNode.id;
			break;
	}
	
	$.ajax({
        url		: url,
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
        		value.nocheck = value.device_code=="";
        		//value.device_type = 1;
        		//value.is_online = true;
        		if(!value.is_online){
        			value.chkDisabled = true;
        			value.icon = basePath + "/content/images/mapCommand/dis_node_camera.png";
        		}
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

function setnoCP(data)
{
	$.each(data, function(i, value) {
		value.user_name = value.text;
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