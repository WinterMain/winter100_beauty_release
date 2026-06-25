(function(){
  var rootEle = document.getElementById("winter100_comment");
  var href = location.href;

  var iframe;
  var commentUrl = "https://winter100.com/blockcomment?&href=" + encodeURIComponent(href) + "&title=" + document.title;
  commentUrl = commentUrl + (window.winter100_theme_color ? ("&themeColor=" + encodeURIComponent(window.winter100_theme_color)) : "");
  commentUrl = commentUrl + (window.winter100_theme ? ("&theme=" + encodeURIComponent(window.winter100_theme)) : "");

  try{
    iframe = document.createElement("<iframe name=\"winter100_commentifr\" src=\""+ commentUrl +"\"></iframe>");
  }catch(e){
    iframe = document.createElement("iframe");
    iframe.name = "winter100_commentifr";
    iframe.src = commentUrl;
  }

  iframe.style.width = "100%";
  iframe.style.overflow = "hidden";
  iframe.style.border = "0";
  iframe.frameborder = "0";

  window.addEventListener("message", function(event){
    if(event && event.data && !isNaN(parseFloat(event.data))) {
      iframe.style.height = event.data + 1 + "px";
    }
  }, false);

  if(rootEle) {
    rootEle.appendChild(iframe);
  } else {
    document.body.appendChild(iframe);
  }
})();