// Site interactions for the CoherentRaster project page.

document.addEventListener('DOMContentLoaded', function () {
  // --- Mobile navbar toggle ---
  var burger = document.querySelector('.navbar-burger');
  if (burger) {
    burger.addEventListener('click', function () {
      var menu = document.getElementById(burger.dataset.target) || document.querySelector('.navbar-menu');
      burger.classList.toggle('is-active');
      if (menu) { menu.classList.toggle('is-active'); }
    });
  }

  // --- Scene carousel ---
  // A minimal one-slide-at-a-time carousel. Each slide is exactly the viewport
  // width and the viewport clips overflow, so neighbouring videos never peek in.
  var root = document.querySelector('#scene-carousel');
  if (!root) { return; }

  var track = root.querySelector('.scene-track');
  var slides = Array.prototype.slice.call(root.querySelectorAll('.scene-slide'));
  var videos = slides.map(function (s) { return s.querySelector('video'); });
  var dotsWrap = root.querySelector('.scene-dots');
  if (!track || slides.length === 0) { return; }

  var index = 0;

  // Build one pagination dot per slide.
  var dots = slides.map(function (_, i) {
    var dot = document.createElement('button');
    dot.type = 'button';
    dot.setAttribute('aria-label', 'Go to scene ' + (i + 1));
    dot.addEventListener('click', function () { goTo(i); });
    dotsWrap.appendChild(dot);
    return dot;
  });

  // Play only the active video; pause the rest. With preload="none" this also
  // means a clip is downloaded only once the visitor navigates to it.
  function updatePlayback() {
    videos.forEach(function (v, i) {
      if (!v) { return; }
      if (i === index) {
        if (v.paused) { v.play().catch(function () {}); }
      } else if (!v.paused) {
        v.pause();
      }
    });
  }

  function render() {
    track.style.transform = 'translateX(' + (-index * 100) + '%)';
    dots.forEach(function (d, i) { d.classList.toggle('is-active', i === index); });
    updatePlayback();
  }

  function goTo(i) {
    index = (i + slides.length) % slides.length;  // wrap around at the ends
    render();
  }

  root.querySelector('.scene-prev').addEventListener('click', function () { goTo(index - 1); });
  root.querySelector('.scene-next').addEventListener('click', function () { goTo(index + 1); });

  // Arrow-key navigation when the carousel has focus.
  root.tabIndex = 0;
  root.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') { goTo(index - 1); }
    else if (e.key === 'ArrowRight') { goTo(index + 1); }
  });

  render();
});
