// Place your main application logic here
window.addEventListener('orientationchange', function(e) {
  //alert("wHeight: " + $(window).height());
  window.scrollTo(0, 1);
  console.log("Orientation change: " + e.orientation + ", " + window.orientation);
});
