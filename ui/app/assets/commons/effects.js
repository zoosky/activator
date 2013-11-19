/*
 Copyright (C) 2013 Typesafe, Inc <http://typesafe.com>
 */
$("body").on("click", "dl.dropdown:not(.dropdownNoEvent)",function(e){
  $(this).toggleClass("active");
});
