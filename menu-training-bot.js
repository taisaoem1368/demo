$(document).ready(function() {
    $('.ari_menu_container').hover(function(){
        $('.name-item-menu').css({"animation":"showNameMenu 0.16s ease-in forwards"});
        $('.sub-menu').css({"animation":"showNameMenu 0.16s ease-in forwards"});
        }, 
        function(){
        $('.name-item-menu').css({"animation":"hideNameMenu 0.1s ease-in forwards"});
        $('.sub-menu').css({"animation":"hideNameMenu 0.1s ease-in forwards"});
    });
});
//{"transition":"all 1.8s ease", "opacity": "1"}
