/* bkmenu jQuery dropdown menu plugin
/* version 0.1
/* Author: b2ik ( https://github.com/b2ik )
/* License: MIT License (more info http://en.wikipedia.org/wiki/MIT_License)
/* 
/**/
(function($) {
  $.fn.bkmenu = function(options) {
    var menu = this.eq(0);                          // create menu only on first element of collection
		var menuCurrentItem         = null;             // current item of menu
		var menuCurrentItemContent  = null;             // content of current item of menu
		var menuCurrent             = null;             // current open menu
		var menuMouseover           = null;             // mouseover flag
		var menutimers              = {
																		menuHide          : null,
																		itemContentShow   : null
		                              };

    var settings = $.extend( {
			'classSelected'        : 'selected',
      'classMenuContent'     : 'submenu',
      'beforeInit'           : function(){},
      'afterInit'            : function(){},
      'afterSelect'          : function(){},
      'beforeShow'           : function(){},
      'afterShow'            : function(){},
      'beforeHide'           : function(){},
      'afterHide'            : function(){},
			'showContentTiming'    : 10
    }, options);
		
		var init = function(){
			settings.beforeInit(menu, menu.callbackInit);                                               // call user function
      menu.on('mouseenter.menu', 'li', function(){
			  menuMouseover = true;
        menuCurrentItem = $(this);
				menu.itemSelect();
	    });
			menu.on('mouseleave.menu', 'li', function(){
				menuMouseover = false;
      });
			menu.on('mouseover.menu',function(){
			  menuMouseover = true;
				clearTimeout(menutimers.menuHide);
			  menutimers.menuHide = setTimeout(function(){
					if (menuMouseover) return false;
				  menu.find('li').removeClass(settings.classSelected).removeClass('hascontent');
					menu.find('.' + settings.classMenuContent).css('visibility','hidden');
			  },1200);
			});
			settings.afterInit(menu, menu.callbackInit);                                                // call user function
		};
		
		menu.itemSelect = function(){
			clearTimeout(menutimers.itemContentShow);
      if ($("html").hasClass("not-selectable")) return false;
      menuCurrentItemContent = menuCurrentItem.children('.' + settings.classMenuContent);
			menutimers.itemContentShow = setTimeout(menu.showContent,settings.showContentTiming);
			settings.afterSelect(menuCurrentItem, menuCurrentItemContent, menu.callbackInit);           // call user function
		};
		
		menu.showContent = function(){
			settings.beforeShow(menuCurrentItem, menuCurrentItemContent, menu.callbackInit);            // call user function
			menuCurrent = menuCurrentItem.parents('.' + settings.classMenuContent).eq(0);
			if (menuCurrent.length < 1) menuCurrent = menu;
      menuCurrent.find('li').removeClass(settings.classSelected).removeClass('hascontent');
			menuCurrentItem.addClass(settings.classSelected);
			menu.hideContent(menuCurrentItemContent);
			if(menuCurrentItemContent.length > 0) {
				if (menuCurrentItem.data('menutype') == 'horizontal') {
					if (  ( ( (menuCurrentItem.outerWidth() + menuCurrentItem.offset().left + menuCurrentItemContent.outerWidth()) > $(window).width() ) || menuCurrent.hasClass('rtl') ) && ( menuCurrent.offset().left - menuCurrentItemContent.outerWidth() > 0 )  ){
			  		menuCurrentItemContent.css({'margin-left': -menuCurrentItemContent.outerWidth(),'top': '0px'});
		        menuCurrentItemContent.addClass('rtl');
				  }
			  	else {
		  			menuCurrentItemContent.removeClass('rtl');
		  			menuCurrentItemContent.css({'margin-left': menuCurrent.width(),'top': '0px'});
	  			}
				}
        menuCurrentItemContent.css('visibility','visible');
				menuCurrentItem.addClass('hascontent');
			}
			settings.afterShow(menuCurrentItem, menuCurrentItemContent, menu.callbackInit);                             // call user function
		};
		
		menu.hideContent = function(menuCurrentItemContent){
			settings.beforeHide(menuCurrentItem, menuCurrentItemContent, menu.callbackInit);                            // call user function
			menuCurrent.find('.' + settings.classMenuContent).not(menuCurrentItemContent).css('visibility','hidden');
			settings.afterHide(menuCurrentItem, menuCurrentItemContent, menu.callbackInit);                             // call user function
		};
		
		menu.callbackInit = function(callback, acallbackItem, acallbackItemContent){
			if (typeof(menu[callback]) !== 'function') return false;
			if (menuCurrentItem === acallbackItem) {
				menuCurrentItemContent = acallbackItemContent;
			  menu[callback]();
			}
		};
		
    init();
		
	};
})(jQuery);