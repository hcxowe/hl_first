/**
 * 
 * @author skz
 * @date 2016年4月14日
 * @time 下午3:19:16
 */
dojo.require("extras.control.LayerManager");
var Gis = {
		
}

function addGraphic(layerId,graphicType,graphicObj,isClear,fn){
	var layerManager;
	layerManager = new  extras.control.LayerManager();
	layerManager.addGraphicToMap(layerId,graphicType,graphicObj,isClear,fn);
	if(fn){
		dojo.connect(layer,"onClick",function(evt){
			fn(layer,evt);
		});
	}
}