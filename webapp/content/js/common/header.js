/**
 * Created by kinkoo on 2016-03-28.
 */
$('document').ready(function(){
	
});

function navSelect(index)
{
	$(".ma-nav").children().removeClass("ma-active");
	$(".ma-nav").children("li:eq("+index+")").addClass("ma-active");
}