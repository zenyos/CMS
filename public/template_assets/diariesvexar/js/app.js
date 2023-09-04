/* Arrow for move movie box items */
const arrows = document.querySelectorAll(".arrow");
const movieLists = document.querySelectorAll(".movie-list");
arrows.forEach((arrow, i) => {
  let itemNumber = movieLists[i].querySelectorAll("img").length;
  itemNumber = itemNumber + 1;
  let clickCounter = 0;
  arrow.addEventListener("click", () => {
    const ratio = Math.floor(window.innerWidth / 270);
    clickCounter++;
    if (itemNumber - (4 + clickCounter) + (4 - ratio) >= 0) {
      movieLists[i].style.transform = `translateX(${
        movieLists[i].computedStyleMap().get("transform")[0].x.value - 300
      }px)`;
    } else {
      movieLists[i].style.transform = "translateX(0)";
      clickCounter = 0;
    }
  });
});
/* Arrow for move movie box items */

/* Theme dark and light toggle */
const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)");
const switcher_theme = document.querySelector(".toggle");
const btn = document.querySelector(".toggle-ball");
const items = document.querySelectorAll(
  ".container,.content-container,.top-nav-texts,.toggle-ball,.card h5,.card-title,.single-content-section h5,.movie-list-title,.movie-list-title-more,.fm-infos,.comment-form-textarea textarea,ul.comment_list li,.author-box .author-role,.navbar-container,.sidebar,.left-menu-icon,.toggle,.top-title-bg,.card,.sideTitle,.items,.footContent,#scrollTop,.footer-copyright");
const currentTheme = localStorage.getItem("theme");
if (currentTheme === "dark") {
  document.body.classList.toggle("dark-mode");
  items.forEach((item) => {
    item.classList.toggle("dark-mode");
  });
  btn.classList.toggle("light-mode");
} else if (currentTheme === "light") {
  document.body.classList.toggle("light-mode");
  items.forEach((item) => {
    item.classList.toggle("light-mode");
  });
  btn.classList.toggle("dark-mode-ball");
}
switcher_theme.addEventListener("click", function() {
  let theme;
  if (prefersDarkScheme.matches) {
    document.body.classList.toggle("light-mode");
    theme = document.body.classList.contains("light-mode") ? "light" : "dark";
    items.forEach((item) => {
      item.classList.toggle("light-mode");
      item.classList.toggle("dark-mode");
    });
  } else {
    document.body.classList.toggle("dark-mode");
    theme = document.body.classList.contains("dark-mode") ? "dark" : "light";
    items.forEach((item) => {
      item.classList.toggle("dark-mode");
      item.classList.toggle("light-mode");
    });
  }
  localStorage.setItem("theme", theme);
});
/* Theme dark and light toggle */

/* Side go to top button */
$(window).scroll(function() {
  if($(window).scrollTop()>150) {
    $("#scrollTop").addClass("isActive");
  }
  else {
    $("#scrollTop").removeClass("isActive");
  }
});
$(document).ready(function() {
  $('#scrollTop').click(function () {
    $('body,html').animate({
      scrollTop: 0
    }, 800);
    return false;
  });
});
/* Side go to top button */

/* Side section auto move and mouse drag list */
const sliders = document.querySelectorAll('.items');
const autoMovePostsItems = document.querySelectorAll('.item');
let isDown = [];
let stopMovement = [];
let startX;
let scrollLeft;
let mouseLeave = [];

autoMovePostsItems.forEach((item, i) => {
  mouseLeave[i] = true;
  stopMovement[i] = false;
  isDown[i] = false;
});
sliders.forEach((slider, i) => {
  const sliders = document.querySelectorAll('.items');
  let $container = [];
  sliders.forEach((slider, i) => {
    $container[i] = $(slider);
    slider.addEventListener('mousedown', (e) => {
      $container[i].stop();
      isDown[i] = true;
      stopMovement[i] = true;
      slider.classList.add('active');
      startX = e.pageX - slider.offsetLeft;
      scrollLeft = slider.scrollLeft;
    });
    slider.addEventListener('mouseenter', () => {
      mouseLeave[i] = false;
      stopMovement[i] = true;
    });
    slider.addEventListener('hover', () => {
      mouseLeave[i] = false;
    });
    slider.addEventListener('mouseleave', () => {
      mouseLeave[i] = true;
      isDown[i] = false;
      stopMovement[i] = false;
      slider.classList.remove('active');
    });
    slider.addEventListener('mouseup', () => {
      isDown[i] = false;
      stopMovement[i] = false;
      slider.classList.remove('active');
    });
    slider.addEventListener('mousemove', (e) => {
      if (!isDown[i]) return;
      $container[i].stop();
      e.preventDefault();
      const x = e.pageX - slider.offsetLeft;
      const walk = (x - startX) * 3;
      slider.scrollLeft = scrollLeft - walk;
      mouseLeave[i] = false;
    });
  });
});

$(document).ready(function (e) {
  const sliders = document.querySelectorAll('.items');
  let $container = [];
  sliders.forEach((slider, i) => {
    let duration = (sliders[i].children.length * 2) * 1000;
    let maxScrollLeft = slider.scrollWidth - slider.clientWidth;
    $container[i] = $(slider);
    let scroll = maxScrollLeft;

    if (isDown[i] || stopMovement[i]) {
      $container[i].stop();
      return;
    }

      setInterval(() => {
        if (!isDown[i] || !stopMovement[i]) {
          if(mouseLeave[i]) {
            if (slider.scrollLeft >= maxScrollLeft - 1) {
              slider.scrollLeft = 0;
              $container[i].stop();
            }
          }
          if (isDown[i] || stopMovement[i]) {
            $container[i].stop();
          } else {
            $container[i].animate({
              'scrollLeft': scroll
            }, duration);
          }
        }
        if (isDown[i] || stopMovement[i]) {
          $container[i].stop();
        } else {
          $container[i].animate({
            'scrollLeft': scroll
          }, duration);
        }
      }, 1000);
  });
});
/* Side section auto move and mouse drag list */

/* Search ui overlay */
function openSearch() {
  document.getElementById("myOverlay").style.display = "block";
}
function closeSearch() {
  document.getElementById("myOverlay").style.display = "none";
}
/* Search ui overlay */

/* Download box collapsible */
let coll = document.getElementsByClassName("collapsible");
for (let index = 0; index < coll.length; index++) {
  coll[index].addEventListener("click", function() {
    this.classList.toggle("active");
    let content = this.nextElementSibling;
    //let content = document.getElementsByClassName("dl-links");

      if (content.style.visibility === "hidden" || content.style.visibility.length === 0) {
        content.style.visibility = "visible";
        content.style.height = "auto";
        content.style.display = "block";
        content.style.transition = "height 0.5s ease;";
      } else {
        content.style.visibility = "hidden";
        content.style.height = 0 + "px";
        content.style.transition = "height 0.5s ease;";
      }

  });
}

let coll_child = document.getElementsByClassName("collapsible-child");
for (let index2 = 0; index2 < coll_child.length; index2++) {
  coll_child[index2].addEventListener("click", function() {
    this.classList.toggle("active-child");
   // let content_child = document.getElementsByClassName("dl-links-child");
    let content_child = this.nextElementSibling;

    if (content_child.style.display === "none" || content_child.style.display.length === 0) {
      content_child.style.display = "block";
    } else {
      content_child.style.display = "none";
    }
  });
}