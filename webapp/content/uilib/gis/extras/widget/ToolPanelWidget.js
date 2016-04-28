/**
 * 工具面板类，放置地图通用的工具
 */
dojo.provide("extras.widget.ToolPanelWidget");
dojo.require("dijit._Widget");
dojo.require("dijit._Templated");

dojo.declare("extras.widget.ToolPanelWidget", [dijit._Widget, dijit._Templated], {
	_options : null,
	_algin : 'r',
	_isreload : true,
	templateString:"<div>464564654646546</div>",
    //templatePath: dojo.moduleUrl("extras.widget", "templates/ToolPanelWidget.html"),
	constructor : function(gisobject){
		this.gisObject = gisobject;
		this.map = gisobject.map;
		this.zoomIn = {
			'style' : 'cursor:pointer;background:url(../themes/default/images/fd.png) center no-repeat;background-position: center',
			'icon': 'fd',
    		'text': '放大',
			'isShow' : true,
    		'callback': function(){
        		
    		}
		}
		this.toolbar_js = [this.zoomIn]
	},
	
    startup: function(){
    	document.body.appendChild(this.domNode);
    },
	showToolBarPanel : function(){
		this.toolButtonImg.style.display="none";
		this.toolsDiv.style.display="block";
		this.gisObject.toolbar.showFlashAnimate({
			node : this.toolsDiv,
			duration : 300,
			properties : {
				right: {start: '-65',end: '0'},
				top: {start: '50',end: '50'}
			},
			onEnd : dojo.hitch(this,function(){
				this.closePanel.style.display="block";
			})
		})
	},
	hideToolBarPanel : function(){
		this.closePanel.style.display="none";
		this.gisObject.toolbar.showFlashAnimate({
			node : this.toolsDiv,
			duration : 300,
			properties : {
				right: {start: '0',end: '-65'},
				top: {start: '50',end: '50'}
			},
			onEnd : dojo.hitch(this,function(){
				this.toolsDiv.style.display="none";
				this.toolButtonImg.style.display="block";
			})
		})
	},
	displayToolBarPanel : function(display){
		this.domNode.style.display = display;
	}
    
});
