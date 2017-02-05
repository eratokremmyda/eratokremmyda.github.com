/* parameters */

var navActivateCSS   = { backgroundColor: 'rgb(204, 223, 253)'};
var navDeactivateCSS = { backgroundColor: 'rgb(69, 122, 204)'};

if (!$.support.transition)
  $.fn.transition = $.fn.animate;
// $.extend( $.easing, { def : 'easeOutQuad' } );

/* youtube and soundcloud support */

$.fn.resetExternal = function() {
    // hack to stop currently-playing videos
    this.find("iframe").each(function(w, iframe) {
	var video = $(iframe).attr("src").replace("&autoplay=1","").replace("&amp;auto_play=true", "");
	$(iframe).attr("src","").attr("hiddensrc",video);
    });
    return this;
};

$.fn.autoplayExternal = function() {
    if (this.hasClass('youtube')) {
        this.attr("hiddensrc", this.attr("hiddensrc") + "&autoplay=1");
    } else if (this.hasClass('soundcloudTrack') || this.hasClass('soundcloudPlaylist')) {
        this.attr("hiddensrc", this.attr("hiddensrc") + "&amp;auto_play=true");
    }
}

$.fn.showExternal = function() {
    this.find("iframe").each(function(i, iframe) {
        if (i==0) { $(iframe).autoplayExternal(); }
        var src = $(iframe).attr('hiddensrc');
	$(iframe).attr("hiddensrc", "").attr("src", src);
    });
    if($(this).find(".photoalbum").length != 0) {
        var initGalleries = window.initGalleries;
        window.initGalleries = [];
        $(initGalleries).each(function (i, fn) { window.setTimeout(fn(), 0); });
    }
    return this;
};

$.fn.enableExternal = function() {
    this.find("a.youtube").each(function(w, link) {
        $(link)
	    .replaceWith($("<iframe width='560' height='315' frameborder='0' allowfullscreen class='youtube'>")
			 .attr('hiddensrc', $(link).attr('href') ));
    });
    this.find("a.soundcloudTrack").each(function(w, link) {
        $(link)
            .replaceWith($("<iframe width=\"560\" height=\"166\" scrolling=\"no\" frameborder=\"no\" class='soundcloudTrack'>")
                         .attr('hiddensrc', $(link).attr('href') ));
    });
    this.find("a.soundcloudPlaylist").each(function(w, link) {
        $(link)
            .replaceWith($("<iframe width=\"100%\" height=\"450\" scrolling=\"no\" frameborder=\"no\" class='soundcloudPlaylist'>")
                         .attr('hiddensrc', $(link).attr('href') ));
    });
    return this;
};

/* mailto links */

$.fn.mailToLinks = function() {
    var email = null;
    this.find("a.contactaddress").each(function(w,link) {
        email = $(link).text().replace("(REMOVEME)","");
	$(link).attr('href', "mailto:" + email);
    });
    this.find("a.contactaddress_hidden").each(function(w,link) {
        $(link).attr('href', "mailto:" + email);
    });
};

$.fn.targetLinks = function() {
    this.find("a").attr('target', '_blank');
    return this;
};


/* nav menu options */

$.fn.navActivateOption = function() {
    $(this)
	.stop(true,true)
	.animate(navActivateCSS,
		 800,
		 function() { $(this).addClass("active") });
    return this;
};

$.fn.navDeactivateOption = function() {
    $(this).each(function (i,n) {
	$(n).stop(true,true).removeClass("active");
	var bgcolor = $(n).css('backgroundColor');
	if (bgcolor != "none" && bgcolor != "rgba(0,0,0,0)" && bgcolor != "rgba(0, 0, 0, 0)" &&
	    bgcolor != "transparent" && bgcolor != "inherit") {
	    $(n)
		.animate(navDeactivateCSS,
			 800,
			 function() {
			     $(n).css('background', 'transparent');
			 });
	}
    });
    return this;
};


/* show/hide nav submenus */

$.fn.showSubMenu = function() {

    var mySubMenu = $(this);
    myRun(mySeq([
	function(next) { mySubMenu.show(100, next); },
	function(next) { Waypoint.refreshAll(); mySubMenu.find("li.withanim").stop(true,true)
			 .each(function(i,elm) {
			     $(elm).css({ right: '-' + (50 + $(elm).width()) + 'px' });
			 }); next(); },
	myPar(
	    mySubMenu.find("li.withanim").map( function(i, elm) {
		var f = (function (next) { $(elm).delay( i * 30 ).animate({ right: '0px' }, 100 + ( 20 * (Math.max(6-i,0) )), next); });
		return f;
	    })
	)]));
    return this;
};

$.fn.hideSubMenu = function() {

    var mySubMenu = $(this);
    myRun(mySeq([

	myPar(
	    mySubMenu.find("li.withanim").map( function(i, elm) {
		var f = (function (next) { $(elm).delay( i * 30 ).animate({ right: '-' + (50 + $(elm).width()) + 'px' }, 100 + ( 20 * (Math.max(6-i,0) )), next); });
		return f;
	    })),

	function(next) { mySubMenu.hide(100, next); },
	function(next) { Waypoint.refreshAll(); next(); }

    ]));
    return this;
};



/* hide/select the main page
   activates the <div class="mainpage" id="(1)"> where (1) is the href of the current option */

$.fn.mainPageHide = function(anim, next) {

    if (anim) {
	$("section#main div.mainpage.active")
	    .removeClass("active")
	    .transition({ x: '-' + (Math.max($("section#main").width() + 50, 800)) + 'px' }, 500,
		     function() { $(this).hide().resetExternal(); Waypoint.refreshAll();
                                  if (next) { next(); }
                                });
    } else {
	$("section#main div.mainpage.active").removeClass("active").hide().resetExternal();
	Waypoint.refreshAll();
    }

    return this;

};

$.fn.mainPageSelect = function() {
    
    var id = $(this).find("a").attr("href").substring(1);
    if (id == "") return this;

    $("section#main div.mainpage#" + id)
	.addClass("active")
	.show();
    Waypoint.refreshAll();
    var width = (Math.max($("section#main").width() + 50, 800));
    $("section#main div.mainpage#" + id)
	.css({ x: '-' + width + 'px' })
        .transition({ x: '0px'  },
		 800,
		 function () { $(this).showExternal(); })
    // showExternal makes the first embedded video/sound play automatically
    return this;

};


$.fn.mainPageSelectFade = function() {

    var id = $(this).find("a").attr("href").substring(1);
    if (id == "") return this;

    $("section#main div.mainpage#" + id)
	.addClass("active")
	.show().css('opacity' , '0.0')
	.transition({ 'opacity' : '1.0' },
		 800);
    Waypoint.refreshAll();
    return this;

};


$.fn.switchToSVG = function() {
    $("img.replacesvg").each(
	function (i, img) {
	    var src = $(img).attr("src").replace("png","svg");
	    var width = $(img).css('width');
	    var height = $(img).css('height');
	    $(img).attr('src', src);
	}
    );

}


/* easy CPS-style animation combinators */
function mySeq(l) {
    function cpsSeqAux(l,i,next) {
	if (l.length > i) { l[i](function () { cpsSeqAux(l,i+1,next); }); }
	else              { next(); }
    }
    
    var f = (function (next) { cpsSeqAux(l,0,next); });
    return f;
    
}

function myPar(l) {
    
    var f =
	(function (next) {
	    var hasRun   = 0;
	    var wrapNext = (function() { hasRun++; if (hasRun == l.length) { next(); } });
	    $.each(l, function (idx, elm) { elm(wrapNext); });
	});
    return f;
    
}

function myRun(f) {
    f( (function(){}) );
}


function setupPage() {

    $(".wrapall").mailToLinks();
    $("div.mainpage").targetLinks();
    if (Modernizr.svg) { $("header").switchToSVG(); }

    // anchoring of section#contact at the top of footer

    $("footer").waypoint(function(direction) {
	$("section#contact")
	    .toggleClass("fixed", direction === 'up')
	    .toggleClass("anchored", direction === 'down');
        window.setTimeout(function() { Waypoint.refreshAll(); }, 0);
    }, { offset : function() { return Waypoint.viewportHeight() - $("section#contact").outerHeight() - 5; } });

    /*
    $("#contact_anchor").waypoint(function(event, direction) {
	if (direction === 'up') { $("section#contact").removeClass("anchored").addClass("fixed");  Waypoint.refreshAll(); }
	event.stopPropagation();
    }, { offset: 'bottom-in-view' });
    */

    // menu
    // when an option is clicked, the div.mainpage with the right id is shown

    $("nav p a").click(function(event) {
	event.stopPropagation();
	var mySubMenu = $(this).parent().next(".lavalamp");
	var delay = 0;

	if (mySubMenu.length == 0) {

            if ($(this).hasClass('active') && $(this).attr('href') != '#bio') {

                $(this).removeClass('active');
                $(this).parent().mainPageHide(true, function() {
                    $("nav p a[href='#bio']").parent().mainPageSelectFade();
                });
                
                
            } else {
                
	        /* normal page, no submenu */
	        $(".lavalamp").find("li.real").navDeactivateOption();
                $(this).parent().siblings().find("a.active").removeClass('active');
                $(this).addClass("active");
	        $(this).parent().siblings(".lavalamp:visible").hideSubMenu();
	        $(this).parent().mainPageHide(false).mainPageSelect();
	        return false;
                
            }

	} else {

	    var otherSubMenus = $(this).parent().siblings(".lavalamp:visible").not(mySubMenu);
            $(this).parent().siblings().find("a.active").removeClass('active');
	    if (otherSubMenus.length > 0) { $(otherSubMenus).hideSubMenu(); delay = 200; }

	}
	

	if (mySubMenu.css("display") == "block") {

	    $(mySubMenu).delay(delay).hideSubMenu();

	} else {

	    $(mySubMenu).delay(delay).showSubMenu();

	}

	return false;

    });


    $(".lavalamp li.real").on('click',
	      function(event) {
		  event.stopPropagation();
		  
		  $(this).stop(true,true);
		  wasActive = $(this).hasClass("active");

		  if (!wasActive) { // the current option is being activated

		      // deactivate any other options
		      $(this).siblings("li.real").navDeactivateOption();
		      $(this).parent().siblings("ul").find("li.real").navDeactivateOption();
		      $(this).mainPageHide(false);

		      // activate this one
		      $(this).navActivateOption();
	              $(this).mainPageSelect();

		  } else {

		      $(this).navDeactivateOption();
	              $(this).mainPageHide(true);

		  }

		  return false;
		  
	      });

};


function preAnimation() {

    $(".wrapmain")
        .css('opacity', '1.0');
    $("header > div")
	.css('opacity', '0.0');
    $("header #line")
        .css('width', '0px');
    $("nav")
	.css('opacity', '0.0');
    $("nav li.real,nav li.withanim,nav p")
        .css({ position: 'relative', right: '-' + (50 + $(this).width()) + 'px' });
    $("section#contact")
        .css('opacity', '0.0');
    $(".lavalamp").hide();

}

function postAnimation() {

    $("nav p a[href='#bio']").parent().mainPageSelectFade();
    // load resources not shown in animation
    // (saves time since animation happens on $window.load)
    setTimeout(function() {
        $("section#main").enableExternal();
    }, 900);
    
}

function introAnimation() {

    myRun(
	mySeq(
	    [ function(next) { $("header #title").transition({ opacity: '1.0' }, 1500, next); },
//	      function(next) { $("header #line").animate({ width: '600px', opacity: '1.0' }, 1000, next) },
	      myPar([ 
		  function(next) { $("header #subtitle").transition({ opacity: '1.0' }, 1500, next) },
		  function(next) { $("section#contact").transition({ opacity: '1.0' }, 1000, next); }
//		  function(next) { $("#construction").animate({ opacity: '1.0' }, 1000, next); }
	      ]),
	      myPar(
		  [ function(next) { $("nav").transition({opacity: '1.0' }, 1000, next); },
		    function(next) { 
			if ($("a.default").length > 0) {
			    $("a.default").parent().mainPageSelectFade();
			}
			next();
		    },
		    myPar(
			$("nav p").map( function(i, elm) {
			    var f = (function (next) { $(elm).delay( i * 100 ).animate({ right: '0px' }, 500 + ( 40 * (Math.max(6-i,0) )), next); });
			    return f;
			})
		    )]),
	      function(next) { postAnimation(); next(); }
	    ])
    );

};


$(window).ready(
    function() {
	preAnimation();
	setupPage();
    }
);

$(window).on("load",
    function() {
	$("#loading").hide();
	window.setTimeout(introAnimation, 500);
    }
);

