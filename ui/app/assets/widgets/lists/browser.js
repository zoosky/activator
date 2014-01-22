define([
  "text!templates/file-browser.html",
  "css!./browser"
], function(
  template
){

// Need to hack, because we can't parse a string template that contain a script tag
var tpl = $(template).filter("#fileBrowserTpl");
$('<script  type="text/html" id="fileBrowserTpl"'+'><'+'/script>')
  .html(tpl.html())
  .appendTo(document.body);
tpl.remove();

  return function(){
    var $browser = $(template)[0];
    return $browser;
  }

});
