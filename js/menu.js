// mo-nav
const menuToggleBtn = document.querySelector('.menu-toggle-btn');
const menuHide = document.getElementById('gnb-mo');
let isHideMenu = false;

menuToggleBtn.addEventListener('click', function () {
    isHideMenu = !isHideMenu;
    if (isHideMenu) {
        menuToggleBtn.classList.add('active');
        menuHide.classList.add('show');
    } else {
        menuToggleBtn.classList.remove('active');
        menuHide.classList.remove('show');
    }
});

// language
const dropdown = document.querySelector(".dropdown");
const dropdown_btn = document.querySelector(".dropdown-btn");
const dropdown_content = document.querySelector(".dropdown-content");
const dropdown_item = document.querySelectorAll(".dropdown-item");
const arrow = document.querySelector(".fas");

document.addEventListener("click", function (e) {
    if (e.target == dropdown_btn) {
        return;
    } else {
        if (dropdown_content.classList.contains("active")) {
            dropdown_content.classList.remove("active");
            dropdown_btn.classList.remove("active");
            dropdown_btn.classList.remove("active");
            arrow.classList.remove("fa-chevron-up");
        }
    }
});

dropdown.addEventListener("click", function () {
    this.classList.toggle("active");
    dropdown_content.classList.toggle("active");
    dropdown_btn.classList.toggle("active");
    arrow.classList.toggle("fa-chevron-up");
});

for (let i = 0; i < dropdown_item.length; i++) {
    dropdown_item[i].addEventListener("click", function () {
        dropdown_btn.getElementsByTagName("p")[0].textContent = this.textContent;
        console.log(this.dataset.value);
    });
}

$(document).ready(function () {
    "use strict";

    $('.menu > ul > li:has( > ul)').addClass('menu-dropdown-icon');
    //Checks if li has sub (ul) and adds class for toggle icon - just an UI

    $('.menu > ul > li > ul:not(:has(ul))').addClass('normal-sub');
    //Checks if drodown menu's li elements have anothere level (ul), if not the dropdown is shown as regular dropdown, not a mega menu (thanks Luka Kladaric)

    $(".menu > ul > li").hover(function (e) {
        if ($(window).width() > 943) {
            $(this).children("ul").stop(true, false).fadeToggle(150);
            e.preventDefault();
        }
    });
    //If width is more than 943px dropdowns are displayed on hover

    $(".menu > ul > li").click(function () {
        if ($(window).width() <= 943) {
            $(this).children("ul").fadeToggle(150);
        }
    });

    $('.slide').bxSlider({
        mode: 'horizontal',
        captions: true,
        speed: 2000,
        auto: true,
    });
});

//promotion
new Swiper('.promotion .swiper', {
    direction: 'horizontal', //방향
    loop: true, //무한반복
    autoplay : true, //자동시작
    slidesPerView: 4, //한 번에 보여지는 슬라이드 개수
    spaceBetween: 10, //슬라이드와 슬라이드 간격
    navigation : {
        prevEl : ".promotion .swiper-prev",
        nextEl : ".promotion .swiper-next"
    },
    breakpoints: { //반응형 조건 속성
    320: { //320 이상일 경우
      slidesPerView: 1, //레이아웃 1열
    },
    768: {
      slidesPerView: 3, //레이아웃 3열
    },
    1024: {
      slidesPerView: 5, //레이아웃 4열
    },
  }
});