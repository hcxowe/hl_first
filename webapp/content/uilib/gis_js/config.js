/**
 * 加载配置文件
 */

var baseUrl = "";//document.location.href.substring(0,document.location.href.lastIndexOf("/"));
var selfUrl = baseUrl.substring(0,baseUrl.lastIndexOf("/"));

djConfig = {
    parseOnLoad: true,
    measureTotal:0,
    modulePaths: {
        "extras": basePath +"/content/uilib/gis_js/jsLib/extras"
    }
};