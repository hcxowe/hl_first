function Qmask(b){var a={};a.background=document.createElement("div");a.background.style.cssText="display:none;position:absolute;top:0;left:0;width:100%;height:100%;background-color:white;z-index:2001;";a.loading=document.createElement("img");a.loading.src="qmask-1.0.gif";a.loading.style.cssText="display:none;position:absolute;top:50%;left:50%;width:200px;height:200px;margin:-100px 0 0 -100px;z-index:2002;overflow:auto;";a.show=function(){this.background.style.display="block";this.loading.style.display=
"block"};a.hide=function(){this.background.style.display="none";this.loading.style.display="none"};if(b){if(b.hasOwnProperty("bgcss"))a.background.style.cssText=b.bgcss;if(b.hasOwnProperty("loadingcss"))a.loading.style.cssText=b.loadingcss;if(b.hasOwnProperty("loadingimg"))a.loading.src=base+b.loadingimg}document.body.appendChild(a.background);document.body.appendChild(a.loading);return a}var qmask=new Qmask;qmask.show();
