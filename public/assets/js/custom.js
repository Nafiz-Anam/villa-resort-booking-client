/*
Template name: Leestays
Author: 

JS table of index
:::::::::::::::::
01. Mobile header
02. Search popup  
*/
(function ($) {
	"use strict";


	//Menu On Hover Dropdown
	$('.primary-navigation').on('mouseenter mouseleave', '.nav-item', function (e) {
		if ($(window).width() > 750) {
			var _d = $(e.target).closest('.nav-item'); _d.addClass('show');
			setTimeout(function () {
				_d[_d.is(':hover') ? 'addClass' : 'removeClass']('show');
			}, 1);
		}
	});


	$(".datepicker").datepicker();
	$(".ui-dropdown").selectmenu();
	$.scrollUp({
		scrollText: "<i class='fa fa-angle-up'></i>",
		scrollDistance: 300,
		animation: 'fade', // Fade, slide, none
		animationInSpeed: 200, // Animation in speed (ms)
		animationOutSpeed: 200, // Animation out speed (ms)
	});


	$(".villa-wrap").owlCarousel({
		loop: true,
		margin: 30,
		responsiveClass: true,
		nav: true,
		dots: true,
		navText: ["<i class='fa fa-angle-left'></i>","<i class='fa fa-angle-right'></i>"],
		responsive: {
			0: {
				items: 1,
			},
			600: {
				items: 3,
			},
			1000: {
				items: 5,
			}
		}
	});
	$(".villa-gallery").owlCarousel({
		loop: true,
		items: 1,
		nav: true,
		dots: true,
		navText: ["<i class='fa fa-angle-left'></i>","<i class='fa fa-angle-right'></i>"],
	
	});


	$('.map-gallery').on('initialized.owl.carousel changed.owl.carousel', function(e) {
		if (!e.namespace)  {
		  return;
		}
		var carousel = e.relatedTarget;
		$('.slider-counter').text(carousel.relative(carousel.current()) + 1 + ' out of ' + carousel.items().length);
	  }).owlCarousel({
		items: 1,
		loop:true,
		margin:0,
		nav: true,
		dots: true,
		navText: ["<i class='fa fa-angle-left'></i>","<i class='fa fa-angle-right'></i>"],
	  });


	$(".review-slide").owlCarousel({
		loop: true,
		nav: true,
		dots: true,
		margin: 20,
		navText: ["<i class='fa fa-angle-left'></i>","<i class='fa fa-angle-right'></i>"],
		responsive: {
			0: {
				items: 1,
			},
			600: {
				items: 2,
			},
			1000: {
				items: 3,
			}
		}
	});
	$(".s-villa-carousel").owlCarousel({
		loop: true,
		nav: true,
		dots: false,
		margin: 20,
		navText: ["<i class='fa fa-angle-left'></i>","<i class='fa fa-angle-right'></i>"],
		responsive: {
			0: {
				items: 1,
			},
			600: {
				items: 2,
			},
			1000: {
				items: 3,
			}
		}
	});
	$(".villa-s-carousel").owlCarousel({
		loop: false,
		nav: false,
		dots: true,
		items: 1,
		
	});

// jQuery

$("#demo").intlTelInput({
});


	const my_calendar = new TavoCalendar('#my-calendar-1');
	const calendar = new TavoCalendar('#my-calendar-2');

	$('.vbox-item').venobox({
		autoplay: true,
	}); 



})(jQuery);
