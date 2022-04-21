// main.js - kr 

!function($) {
	var main = {}
	
	main.slide = function() {
		var visual = {
			slideWrap: ".visual_slide",
			indWrap: ".visual_indigator",
			circleWrap: ".circle_bg",
			curIndex: 0,
			nextIndex: 1,
			count: 0,
			time: 1000,
			imgUrl: "",
			text: "",
			updateFlag: true,
			circleColor: ["#248dd5 ", "#ffec48", "#f64e5a", "#cef047", "#ff4b4b", "#ffec48"]
		};

		return { 
			_init: function($body) {
				var self = this;

				self = $.extend(true, self, visual);

				self.$visWrap = $body;
				self.$slideWrap = self.$visWrap.find(self.slideWrap);
				self.$indWrap = self.$visWrap.find(self.indWrap);
				self.$circleWrap = self.$visWrap.find(self.circleWrap);

				self._setVisual();	
			},
			_setVisual: function() {
				var self = this,
					$visSlide = self.$slideWrap.find(".slide_cont"),
					$indigator = self.$indWrap.find(".indigator"),
					$indFirstBtn = $indigator.find("button").eq(self.curIndex),
					$indSlide = self.$indWrap.find(".ind_slide"),
					$indText = self.$indWrap.find(".ind_text"),
					$ProdBox = self.$circleWrap.find(".prd_img"),
					$prodImg = $ProdBox.find("img");
					
				self.$visWrap.addClass("color_" + self.curIndex);
				self.imgUrl = $indFirstBtn.data("url");
				self.text = $indFirstBtn.data("text");
				var w_width =$(window).width();
				var w_circle;
				if(w_width<1440){
					w_circle = parseInt(1395*($(window).width()))/1440;
				} else {
					w_circle = 1395;
				}
				//console.log(w_circle);

				$(window).resize(function(){
					var w_width =$(window).width();
					var w_circle;
					if(w_width<1440){
						w_circle = parseInt(1395*($(window).width()))/1440;
					} else {
						w_circle = 1395;
					}
					//console.log(w_circle);
				})

				self.$circleWrap.find(".circle_cvn").circleProgress({
					value: 1,
					size: w_circle,
					thickness: 310,
					fill: {
						color: self.circleColor[self.curIndex]
					},
					reverse: true,
					lineCap: 'round',
					startAngle: 0,
					animationStartValue: 1
		        });
				
				$prodImg.attr("src", self.imgUrl).one("load", function() {
					$ProdBox.css({left: $prodImg.width() * -0.21});  //171130 0.15 =>0.21로 수정
				});

				$visSlide.css({opacity: 0, left: "100%"});
				$visSlide.eq(self.curIndex).css({opacity: 1, left: 0});
				$indSlide.find(".slide_cont.active").css({opacity: 1});
				
				$indText.find(".txt").html(self.text);
				
				$indigator.on("click", "button:not('.active')", $.proxy(self._onChangeVisual, self));
				
				self.autoPlay = setTimeout($.proxy(self._setAutoSlide, self), self.time);
			},
			_setAutoSlide: function() {
				var self = this,
					$indigator = self.$indWrap.find(".indigator");

				clearTimeout(self.autoPlay);

				if (self.count < 4) {
 					$indigator.find(".count_list.count_" + self.curIndex).find("li").eq(self.count).addClass("active");

 					self.count++;					
					self.autoPlay = setTimeout($.proxy(self._setAutoSlide, self), self.time);			
				} else {
					self.count = 0;

					$indigator.find(".count_list li").removeClass("active");
					$indigator.find("button").eq(self.nextIndex).trigger("click");
				}
			},
			_onChangeVisual: function(e) {
				if (TweenMax.isTweening($("*"))) {
					return false;
				}

				var	self  = this,
					$thisBtn = $(e.target),
					$slide = self.$slideWrap.find(".slide_cont"),
					$indigator = self.$indWrap.find(".indigator"),
					$indText = self.$indWrap.find(".txt"),

					$curSlide = null, $nextSlide = null;

				clearTimeout(self.autoPlay);
				
				$thisBtn.siblings().removeClass("active");
				$thisBtn.addClass("active");
				$indigator.find(".count_list li").removeClass("active");

				self.count = 0;
				self.imgUrl = $thisBtn.data("url");
				self.nextIndex = $thisBtn.data("index");
				self.text = $thisBtn.data("text");

				$curSlide = $($slide[self.curIndex]);
				$nextSlide = $($slide[self.nextIndex]);

				$nextSlide.css({left: "-100%", opacity: 1});
				$indText.css({opacity: 0});
				
				TweenMax.to($curSlide, 1, {left: "100%"});
				TweenMax.to($nextSlide, 1, {left:"0", onUpdate: _updateSlide, onComplete: _completeSlide});

				self._onChangeCircle();
				self._onChangeImg();

				function _updateSlide() {
					var slideLeft = parseInt($curSlide.css("left"));

					if (self.updateFlag && (slideLeft >= self.$indWrap.offset().left)) {
						self.updateFlag = false;
						self._onChangeSlide();
					}
				}
				function _completeSlide() {
					self.updateFlag = true;

				}
			},
			_onChangeSlide: function() {
				var self = this,
					$curInd = self.$indWrap.find(".slide_cont.active"),
					$nextInd = self.$indWrap.find(".slide_cont:not('.active')"),
					$indText = self.$indWrap.find(".txt");

				self.$visWrap.removeClass("color_" + self.curIndex);
				self.$visWrap.addClass("color_" + self.nextIndex);

				$nextInd.prop("class", "slide_cont color_" + self.nextIndex);
				$nextInd.css({left:"-100%", opacity:1});

				$indText.css({opacity: 0});
				$indText.html(self.text);

				TweenMax.to($curInd, 1, {left:"100%"});
				TweenMax.to($nextInd, 1, {left:"0"});
				TweenMax.to($indText, 1, {opacity:1, onComplete: function() {
					self.autoPlay = setTimeout($.proxy(self._setAutoSlide, self), self.time);
				}});

				self.$indWrap.find(".slide_cont").toggleClass("active");

				self.curIndex = self.nextIndex;
				self.nextIndex = self.curIndex == 5 ? 0 : self.curIndex + 1;	
			},
			_onChangeCircle: function() {
				var w_width =$(window).width();
				var w_circle;
				if(w_width<1440){
					w_circle = parseInt(1395*($(window).width()))/1440;
				} else {
					w_circle = 1395;
				}
				//console.log(w_circle);
				$(window).resize(function(){
					var w_width =$(window).width();
					var w_circle;
					if(w_width<1440){
						w_circle = parseInt(1395*($(window).width()))/1440;
					} else {
						w_circle = 1395;
					}
					//console.log(w_circle);
				})
				var self = this,
					$circle = self.$circleWrap.find(".circle_cvn");

				$circle.circleProgress({
					emptyFill: self.circleColor[self.curIndex],
					fill: {
						color: self.circleColor[self.nextIndex]
					},
					animationStartValue: 0,
					animation: {
		            	duration: 1500,
		            	easing: "circleProgressEasing"
					},
					size: w_circle,
					value: 1
				});
			},
			_onChangeImg: function() {
				var self = this,
					$prodBox = self.$circleWrap.find(".prd_img"),
					url = self.imgUrl,
					imgWidth = 0;
					
				TweenMax.to($prodBox, 0.5, {left: "380px", onComplete: function() {
					var $prodImg = $prodBox.find("img");
					
					imgWidth = $prodImg.width() * -0.21;
				
					$prodImg.removeAttr("src").attr("src", url);
					TweenMax.to($prodBox, 0.5, {left: imgWidth, ease: Back.easeOut.config(1)});
				}});
			}
		}
	}();

	$(function() {
		main.slide._init($(".main_visual"));

		if( $(window).width() < 1440 ){
			var width = parseInt(1395*($(window).width()))/1440;
			$(".circle_cvn canvas").css({ "width" :  width + "px" , "height" :  width + "px"  })
		} else {
			$(".circle_cvn canvas").removeAttr("style");
		}
	});

	$(window).resize(function(){
		if( $(window).width() < 1440 ){
			var width = parseInt(1395*($(window).width()))/1440;
			$(".circle_cvn canvas").css({ "width" :  width + "px" , "height" :  width + "px"  })
		} else {
			$(".circle_cvn canvas").removeAttr("style");
		}		
	});

}(window.jQuery);


!function($) {
	var present = {}
	
	present.slide = function() {
		var present = {
			slideNm: ".prd_slide_wrap",
			slotNm: ".year_count",
			tabIndex: 0,
			slickOpt: {		
				dots: true,
				arrows: false,
				infinite: true,
				speed: 1000,
				autoplay: true,
				autoplaySpeed: 0,
				slidesToShow: 1,
				slidesToScroll: 1,
				draggable: false,
				fade: true,
				appendDots: ".prd_indigator",
				customPaging: function(slider, i) {
					var year = $(slider.$slides[i]).data("year");
					return "<button type='button' class='item' data-year='"+year+"'>" + year + "</button>"; 	
				},
				responsive: [
					{
						breakpoint: 768,
						settings: {
							fade: false,
							draggable: true,
							speed: 800
						}
					}
				]
			},
			slotOpt: {
				active: [1,9,8,8],
				itemHeight: 0,
				slotHeight: 0
			}
		};

		return { 
			_init: function($body) {
				var self = this;

				self.$container = $body; 
				self._setTab(0);
			},
			_setTab: function(index) {
				var self = this;

				self = $.extend(true, self, present);

				self.tabIndex = index;

				self.$slot = self.$container.find(self.slotNm).eq(self.tabIndex);
				self.$slide = self.$container.find(self.slideNm).eq(self.tabIndex);
				self.$indigator = self.$container.find(self.slickOpt.appendDots).eq(self.tabIndex);

				self.slickOpt.appendDots = self.$indigator;

				self.$slide.slick(self.slickOpt);
				self.$slide.slick('slickPause');

				self._setSlot();
				self._setEvent();

				self._changeSlide(1);
			},
			_setEvent: function() {
				var self = this;

				self.$slide.off("beforeChange").on("beforeChange", function(event, slick, currentSlide, nextSlide) {
					var year = self.$indigator.find("button:eq(" + nextSlide + ")").data("year") + "";

					self.$slot.find(".count").stop();
					self.$indigator.find(".bar").stop().css({height: 25 * nextSlide + "%"});
					self.$indigator.find("li").each(function(i, elm) {
						if (i < nextSlide) {
							$(elm).addClass("test");
						} else {
							$(elm).removeClass("test");
						}
					});

					$.each(self.slotOpt.active, function(i, el) {
						self.slotOpt.active[i] = year.substr(i, 1);
					});
				});

				self.$slide.off("afterChange").on("afterChange", function(event, slick, currentSlide) {
					self.$slide.slick('slickPause');
					self._rollingSlot();
				});

				self.$container.find(".visbtn_wrap").off("click").on("click", "button", function() {
					var $this = $(this),
						index = $this.index() + 1;

					if (!$this.hasClass("active")) {
						$this.siblings().removeClass("active");
						$this.addClass("active");

						self.$container.find(".prdtab_cont").hide();
						self.$container.find(".prdtab_cont.prd_0" + index).show();		
						
						self._destroySlide();
						self._setTab(index - 1);
					}
				});

				$(window).off('.present').on('resize.present', function() {
					var $itemBox = self.$slot.find(".count"),
						$item = $itemBox.filter(":first").find("li");

					self.slotOpt.itemHeight = $item.outerHeight();
					self.slotOpt.slotHeight = self.slotOpt.itemHeight * ($item.length - 1);

					$itemBox.each(function(i) {
						if (!$(this).is(':animated')) {
							$(this).css({top: -self.slotOpt.active[i] * self.slotOpt.itemHeight});
						} else {
							self._spin($(this));
						}					
					});
				});
			},
			_changeSlide: function(index) {
				var self = this,
					$loadingBar = self.$indigator.find(".bar"),
					percent = 25 * index;

				if (percent > 100) {
					setTimeout(function() {
						$loadingBar.stop().css({height: 0});
						self.$slide.slick('slickPlay');
					}, 1500);
				} else {
					$loadingBar.stop().animate({height: percent + "%"}, 1500, function() {
						self.$slide.slick('slickPlay');
					});
				}
			},
			_setSlot: function() {
				var self = this,
					$item = self.$slot.find(".count:first li"),
					year = self.$slide.find(".slide_item:first").data("year") + "";

				self.slotOpt.itemHeight = $item.outerHeight();
				self.slotOpt.slotHeight = self.slotOpt.itemHeight * ($item.length - 1);

				$.each(self.slotOpt.active, function(i, el) {
					self.slotOpt.active[i] = year.substr(i, 1);
				});

				self.$slot.find(".count").each(function(i) {
					$(this).css({top: -self.slotOpt.active[i] * self.slotOpt.itemHeight});
				});
			},
			_rollingSlot: function() {
				var self = this,
					$itemBox = self.$slot.find(".count");

				self.count = -1;

				$itemBox.css({top:'0px'});	
				$itemBox.each(function() {
					self._spin($(this));
				});
			},
			_spin: function($slot) { 
				var self = this;
									
				$slot.stop().animate({top: -self.slotOpt.slotHeight}, {
					complete: function() {
						var $this = $(this),
							index = $this.index();

						$this.css({top:'0px'});	

						if (index == 0 && self.count == -1) {
							self.count++;
						}

						if (self.count != index) { 
							self._spin($this);
						} else {
							self._finish($this);
						}
					},
					easing: "linear",
					duration: 800
				});
			},
			_finish: function($slot) {
				var self = this,
					index = $slot.index(),
					finalPos = self.slotOpt.active[index] * -self.slotOpt.itemHeight;

				$slot.stop().animate({top: finalPos}, {
					complete: function() {
						if (index == self.$slot.find(".count").length - 1) {
							var nextSlide = self.$slide.slick('slickCurrentSlide') + 1;

							self._changeSlide(nextSlide);
						}
						self.count++;
					},
					easing: "linear",
					duration: 800
				});
			},
			_destroySlide: function() {
				var self = this;

				self.$slide.slick('slickPause');
				self.$slide.slick("unslick");
				self.$indigator.find(".bar").stop().css({height:"0px"});
				self.$slot.find(".count").stop().css({top:"0px"});
			}
		}
	}();

	$(function() {
		present.slide._init($(".main_cont.type02"));	
	});

}(window.jQuery);

!function($) {
	var now = {}
	
	now.slide = function() {
		var now = {
			slideNm: ".main_slider",
			slidebarNm: ".main_slidebar",
			slideTxt: ["보도자료", "공지사항", "빙그레 영상","글로벌 빙그레", "사회공헌"],
			slideOpt: {
				dots: true,
				arrows: false,
				infinite: true,
				speed: 800,
				autoplay: true,
				autoplaySpeed: 1500,
				slidesToShow: 3,
				slidesToScroll: 1,
				centerMode: true,
				pauseOnHover: false,
				pauseOnFocus: false,
				appendDots: ".main_slidebar",
				customPaging: function(slider, i) {
					return "<button type='button' data-index='" + i + "'>" + now.slideTxt[i/3] + "</button>";
				},
				responsive: [
					{
						breakpoint: 767,
						settings: {
							dots:false,
							slidesToShow: 1,
							centerPadding: '45px'
						}
					}
				]
			},
			pauseFlag: false,
			total: 0,
			timer: null
		}

		return {
			_init: function($body) {
				var self = this;

				self = $.extend(true, self, now);
				
				self.$container = $body;
				self.$slide = self.$container.find(self.slideNm);
				self.$slideBar = self.$container.find(self.slidebarNm);

				self._setEvent();
				
				self.$slide.slick(self.slideOpt);
			
				self.$slideBar.find(".slick-dots button").eq(0).addClass("active"); // 171129 추가
			},
			_setEvent: function() {
				var self = this;

				self.$slide.on('init', function(slick) {
					self.total = self.$slide.find(".slide_box:not(.slick-cloned)").length;
					self.$slideBar.append("<span class='slidepage'><em>01</em> \/ " + self.total + "</span>");	
				});

				self.$slide.on('afterChange', function(event, slick, currentSlide) {
					var $loadingBar = null,
						percent = 0;

					clearTimeout(self.timer);

					if ((currentSlide + 1) % 3 == 0) {
						$loadingBar = self.$slideBar.find(".bar");
						$loadingBar.stop();

						percent = (parseInt(currentSlide / 3) + 1) * 25;

						if (percent > 100) { 
							self.timer = setTimeout(function() {
								$loadingBar.css({width: 0});
							
								self.$slideBar.find(".slick-dots button").removeClass("active");	// 171129 추가
								self.$slideBar.find(".slick-dots button").eq(currentSlide).addClass("active");	// 171129 추가
							}, 1500);
						} else {
							$loadingBar.animate({width: percent  + "%"}, 1500, function() {	// 171129 추가
								self.$slideBar.find(".slick-dots button").removeClass("active");	// 171129 추가
								self.$slideBar.find(".slick-dots button").eq(currentSlide).addClass("active");	// 171129 추가
							});
						}
					}
				});

				self.$slide.on('beforeChange', function(event, slick, currentSlide, nextSlide) {
					var $loadingBar = null,
						percent = 0,
						page = nextSlide + 1;
						
					clearTimeout(self.timer);

					self.$slideBar.find(".slidepage em").html(page < 10 ? "0" + page : page);

					if (nextSlide % 3 == 0) {
						$loadingBar = self.$slideBar.find('.bar');
						$loadingBar.stop();

						percent = parseInt(nextSlide / 3) * 25;

						if (percent > 100) {
							$loadingBar.css({width: 0});
							self.$slideBar.find(".slick-dots button").removeClass("active");	// 171129 추가
							self.$slideBar.find(".slick-dots button").eq(nextSlide).addClass("active");	// 171129 추가
						} else {
							$loadingBar.css({width: percent + "%"});
							self.$slideBar.find(".slick-dots button").removeClass("active");	// 171129 추가
							self.$slideBar.find(".slick-dots button").eq(nextSlide).addClass("active");	// 171129 추가
						}
					}
				});

				self.$slideBar.find('.btn_stop').on('click', function() {
					var $loadingBar = self.$slideBar.find('.bar'),
						curIndex = self.$slide.slick('slickCurrentSlide'),
						dotIndex = parseInt(curIndex / 3);

					clearTimeout(self.timer);

					self.pauseFlag = !self.pauseFlag;

					if (!self.pauseFlag) {
						
						if (self.total - 1 == curIndex) {
							self.$slide.slick('slickPlay');
						} else {
							if ((curIndex + 1) % 3 == 0) {
								$loadingBar.stop().animate({width: (dotIndex+1)*25+"%"}, 1500, function() {
									self.$slide.slick('slickPlay');		
								});
							} else {
								self.$slide.slick('slickPlay');
							}
						}
					} else {
						self.$slide.slick('slickPause');
						$loadingBar.stop().css({width: dotIndex*25+"%"});
					}

					$(this).toggleClass('stoped');
				});
			}
		};
	}();

	$(function() {
		now.slide._init($(".main_cont.type03"));
	});

}(window.jQuery);


!function($) {
	var changePage = {};
	
	changePage = {
		currentCover: -1,
		coverLength: 0,
		withWheel: true,
		$content: null,
		next: function() { 
			var self = this;

			if (self.currentCover < self.coverLength) {
			    self.currentCover++;

			    $("html, body").stop().animate({
			    	scrollTop: self.$content.eq(self.currentCover).offset().top
			    }, 600);
		    }
		},
		prev: function() {
			var self = this;

			if (self.currentCover > 0) {
				self.currentCover--;

				$("html, body").stop().animate({
			    	scrollTop: self.$content.eq(self.currentCover).offset().top
			    }, 600);
	    	}   
		},
		disableScroll: function() {
			$(window).on("scroll.disableScroll mousewheel.disableScroll DOMMouseScroll.disableScroll touchmove.disableScroll", function(e) {
				e.preventDefault();
		        return;
		    });
		},
		enableScroll: function() {
			$(window).off(".disableScroll");
		},
		setPage: function(e) {
			var self = this,
				scrollTop = 0;

			if (!self.withWheel) {
				scrollTop = $(window).scrollTop();

				self.$content.each(function(i) {
					if ($(this).offset().top <= scrollTop) {
						self.currentCover = i;
					}
				});

				if (scrollTop < self.$content.eq(0).offset().top - 80) {
					self.currentCover = -1;
				}
			}
			
		},
		setEvent: function() {
			var self = this;

			$(".wrap").on("mouseover.changePage", function() {
				self.withWheel = true;
			});

			$(".wrap").on("mouseleave.changePage", function(e) {
				e.stopPropagation();
  				self.withWheel = false;
			});

			$(window).on('scroll.changePage', $.proxy(self.setPage, self));
		},
		destroy: function() {
			this.withWheel = true;
			$(".wrap").off('mousewheel');
			$(".wrap").off('.changePage');
			$(window).off('.changePage');
		},
		init: function() {
			var self = this,
				initTop = $(window).scrollTop(),
				completed = true;
			
			self.$content = $(".main_cont:not(.m_visual)");
			self.coverLength = self.$content.length - 1;

			self.$content.each(function(i) {
				if ($(this).offset().top <= initTop) {
					self.currentCover = i;
				}
			});

			self.setEvent();

			$(".wrap").on('mousewheel', function(e) {
		      	clearTimeout(interval);
				
				if ((self.currentCover <= 0 && e.deltaY > 0) || (self.currentCover == self.coverLength && e.deltaY < 0)) {
					if (self.currentCover == 0) {
						self.currentCover = -1;
					}

					return;
				}

		      	if (completed == true) {
		            var interval = "";

		            completed = false;

		        	self.disableScroll();

		        	if (self.currentCover > -1) {
						var $curContent = self.$content.eq(self.currentCover),
							nextTop = $curContent.offset().top + $curContent.outerHeight(true);

						if (e.deltaY < 0 && nextTop - ($(window).scrollTop() + $(window).height()) > 80) {
							$("html, body").stop().animate({
						    	scrollTop: nextTop - $(window).height()
						    }, 600);

							setInterval();

							return;
		  					
						} else if (e.deltaY > 0 && $(window).scrollTop() - $curContent.offset().top > 80) {
							$("html, body").stop().animate({
						    	scrollTop:  $curContent.offset().top
						    }, 600);

							setInterval();

							return;
						}
						}
					//2017.12.18 수정 (레이어팝업오픈시스크롤제어)
					var $noticepop = $('.main_notice').attr('data-layer-active');
					
					if ($noticepop == 'true') {
						self.disableScroll();
					} else {
						if (e.deltaY > 0) {
							self.prev();
						} else {
							self.next();
						}
					}

					setInterval();
		      	}

		      	function setInterval() {
		      		interval = setTimeout(function() {	
	            		self.enableScroll();
	            		completed = true;
	            	}, 700);
		      	}

		    });

		    $(".topgo_link").off('click').on('click', function() {
		    	
		    	self.disableScroll();
		    	
				$(window).off('.changePage');
				$(".wrap").off('.changePage');

		    	$('body, html').animate({
		    		scrollTop: 0
		    	}, 600, function() {
		    		self.currentCover = -1;
		    		self.setEvent();
		    		self.enableScroll();
		    	});
		    });

		    return self;
		}
	};

	$(function() {
		var device = deviceChecker(),
			_changePage = null;

		if (device != "mobile") {
			_changePage = changePage.init();	
		}

 		$(window).resize(function() {
 			device = deviceChecker();

 			if (device == "mobile") {
 				if (_changePage) {
 					changePage.destroy();
 					_changePage = null;
 				}
 			} else {
 				if (!_changePage) {
 					_changePage = changePage.init();
 				}
 			}
 		});
	});



	$(function(){
		var _mouse = $('.mouse');
		var _wheelBar = $('.mouse > .wheel');
		var _arrow = $('.mouse_info .arrow > .arw');
		function wheelArw() {
			_arrow.eq(0).animate({'opacity':'0'},400).animate({'opacity':'1'},800, wheelArw);
			_arrow.eq(1).animate({'opacity':'0'},400).animate({'opacity':'1'},900, wheelArw);
			_arrow.eq(2).animate({'opacity':'0'},400).animate({'opacity':'1'},1000, wheelArw);
		}
		function wheelBar() {
			_wheelBar.animate({'opacity':'.8', 'top':'0'},400).animate({'opacity':'0', 'top':'7px'},1000, wheelBar);
		}
		wheelArw();
		wheelBar();
	});

	// mouseIcon  pos  -- S  17-11-24 add
	function mouseIcon(){
			var _icoMus = $('.visual_section .mouse_info');
			var _thisBrowserH = $(window).height();
			if( _thisBrowserH > 900){
				_icoMus.css({'bottom' : '7.3vw'});
			}
			else if( _thisBrowserH > 850){
				_icoMus.css({'bottom' : '8.5vw'});
			}
			else if( _thisBrowserH > 800 ){ 
				_icoMus.css({'bottom' : '7.5vw'});
			}
			else { 
				_icoMus.css({'bottom' : '9.5vw'});
			}
	}
	$(function(){
		if(deviceChecker() == "pc") {
			mouseIcon();
			$(window).resize(function(){
				mouseIcon();
			});
			$(window).scroll(function(){
				var _mainScr = $(window).scrollTop();
				if(_mainScr >= 100){
					$('.mouse_info').fadeOut();
				} else {
					$('.mouse_info').fadeIn();
				}
			});
		}
	});
	// mouseIcon  pos --E

}(window.jQuery);