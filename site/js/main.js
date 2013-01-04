/* parameters */

var navActivateCSS   = { backgroundColor : 'rgb(210,210,210)' };
var navDeactivateCSS = { backgroundColor : 'rgb(246, 248, 252)' };


$.extend( $.easing, { def : 'easeOutQuad' } );

/* youtube support */

$.fn.resetYoutube = function() {
    // hack to stop currently-playing videos
    this.find("iframe.youtube").each(function(w, iframe) {
	var video = $(iframe).attr("src").replace("&autoplay=1","");
	$(iframe).attr("src","").attr("hiddensrc",video);
    });
    return this;
};

$.fn.autoplayYoutube = function() {
    this.find("iframe.youtube").each(function(i, iframe) {
	var video = $(iframe).attr("hiddensrc");
	var autoplay = i==0 ? "&autoplay=1" : "";
	$(iframe).attr("hiddensrc", "").attr("src",video + autoplay);
    });
    return this;
};

$.fn.enableYoutube = function() {
    this.find("a.youtube").each(function(w, link) {
        $(link)
	    .replaceWith($("<iframe width='560' height='315' frameborder='0' allowfullscreen class='youtube'>")
			 .attr('hiddensrc', $(link).attr('href') ));
    });
    return this;
};

/* mailto links */

$.fn.mailToLinks = function() {
    this.find("a.contactaddress").each(function(w,link) {
	$(link).attr('href', "mailto:" + $(link).text().replace("(REMOVEME)",""));
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

/* hide/select the main page
   activates the <div class="mainpage" linkname="(1)"> where (1) is the href of the current option */

$.fn.mainPageHide = function(anim) {

    if (anim) {
	$("section#main div.mainpage.active")
	    .removeClass("active")
	    .animate({ left: '-' + (Math.max($("section#main").width() + 50, 800)) + 'px' }, 500,
		     function() { $(this).hide().resetYoutube(); $.waypoints('refresh'); });
    } else {
	$("section#main div.mainpage.active").removeClass("active").hide().resetYoutube();
	$.waypoints('refresh');
    }

    return this;

};

$.fn.mainPageSelect = function() {

    var id = $(this).find("a").attr("href").substring(1);
    $("section#main div.mainpage[linkname='" + id + "']")
	.addClass("active")
	.show().css({ left: '-' + (Math.max($("section#main").width() + 50, 800)) + 'px' })
	.animate({ left: '0px'  },
		 800,
		 function () { $(this).autoplayYoutube(); $.waypoints('refresh'); })
    // autoplayYoutube makes the first embedded youtube video play automatically
    return this;

};


$.fn.mainPageSelectFade = function() {

    var id = $(this).find("a").attr("href").substring(1);
    $("section#main div.mainpage[linkname='" + id + "']")
	.addClass("active")
	.show().css('opacity' , '0.0')
	.animate({ 'opacity' : '1.0' },
		 800);
    $.waypoints('refresh');
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

function setupPage() {

    $("#contact").mailToLinks();
    $("div.mainpage").targetLinks();
    if (Modernizr.svg) { $("header").switchToSVG(); }

    // anchoring of section#contact at the top of footer

    $("footer").waypoint(function(event, direction) {
	$("section#contact")
	    .toggleClass("fixed", direction === 'up')
	    .toggleClass("anchored", direction === 'down');
	$.waypoints('refresh');

//	if (direction === 'down') { $("section#contact").removeClass("fixed").addClass("anchored"); $.waypoints('refresh'); }
	event.stopPropagation();
    }, { offset : function() { return $.waypoints('viewportHeight') - $("section#contact").outerHeight() - 5; } });

    /*
    $("#contact_anchor").waypoint(function(event, direction) {
	if (direction === 'up') { $("section#contact").removeClass("anchored").addClass("fixed");  $.waypoints('refresh'); }
	event.stopPropagation();
    }, { offset: 'bottom-in-view' });
    */

    // menu
    // when an option is clicked, the div.mainpage with the right linkname is shown

    $("nav p a").click(function() {
	$(".lavalamp").find("li.real").navDeactivateOption();
	$(this).parent().mainPageHide(false).mainPageSelect();
	return false;
    });

    $("header #title a").click(function() {
	$(".lavalamp").find("li.real").navDeactivateOption();
	$(this).parent().mainPageHide(false).mainPageSelectFade();
	return false;
    });
	    

    $(".lavalamp")
	.lavaLamp(
	    { speed : 300, returnHome : true, includeMargins: true,
	      homeTop : 0, homeLeft : 500, homeWidth: 500, homeHeight : 0,
	      click : 

	      function() {
		  
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
		  
	      }
	    });
    
};


function preAnimation() {

    $(".wrapmain")
        .css('opacity', '1.0');
    $("header > div")
	.css('opacity', '0.0');
    $("header #line")
        .css('width', '0px');
    $("div.navheader")
        .css('opacity', '0.0');
    $("nav")
	.css('opacity', '0.0');
    $("nav li.real,nav p")
        .css({ position: 'relative', right: '-' + (50 + $(this).width()) + 'px' });
    $("section#contact")
        .css('opacity', '0.0');

}

function postAnimation() {

    // load resources not shown in animation
    // (saves time since animation happens on $window.load)
    $("section#main").enableYoutube();
    Galleria.run("#photos");
    
}

function introAnimation() {

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

    myRun(
	mySeq(
	    [ function(next) { $("header #title").animate({ opacity: '1.0' }, 1500, next); },
//	      function(next) { $("header #line").animate({ width: '600px', opacity: '1.0' }, 1000, next) },
	      myPar([ 
		  function(next) { $("header #subtitle").animate({ opacity: '1.0' }, 1500, next) },
		  function(next) { $("section#contact").animate({ opacity: '1.0' }, 1000, next); }
	      ]),
	      myPar(
		  [ function(next) { $("div.navheader").animate({opacity: '1.0'}, 1000, next); },
		    function(next) { $("nav").animate({opacity: '1.0' }, 1000, next); },
		    function(next) { 
			if ($("a.default").length > 0) {
			    $("a.default").parent().mainPageSelectFade();
			}
			next();
		    },
		    myPar(
			$("nav li.real, nav p").map( function(i, elm) {
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

$(window).load(
    function() {
	$("#loading").hide();
	window.setTimeout(introAnimation, 500);
    }
);

