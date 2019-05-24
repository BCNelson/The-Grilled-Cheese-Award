import 'bootstrap'
import './css/bootstrap.min.css'
import Fuse from 'fuse.js';
var $ = require('jquery'); // Load jQuery as a module
require('jsrender')($);
$.views.settings.delimiters("{%", "%}")

var options = {
  shouldSort: true,
  threshold: 0.1,
  tokenize: true,
  keys: [
    "title",
    "text",
    "description"
  ]
};

//http://davidwalsh.name/javascript-debounce-function
function debounce(func, wait, immediate) {
  var timeout;
  return function () {
    var context = this, args = arguments;
    var later = function () {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    var callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
};

var fuse;
$.getJSON("/index.json", function (data) {
  fuse = new Fuse(data, options);
  let searchParams = new URLSearchParams(window.location.search)
  if (searchParams.has("q")){
    $("#searchBar").val(searchParams.get("q"));
    var searchTerm = $("#searchBar").val();
    var result = fuse.search(searchTerm);

    $("#results").empty();
    var tmpl = $.templates("#CardTmpl");
    result.forEach(element => {
      var html = $("#CardTmpl").render(element);
      $("#results").append(html);
    });
  }
})

$(function () {
  $("#navSearch").hide();

  $("#searchBar").keyup(debounce(function (event) {
    var searchTerm = $("#searchBar").val();
    var result = fuse.search(searchTerm);
    if(searchTerm == ""){
      $("#results").empty();
      return;
    }

    $("#results").empty();
    var tmpl = $.templates("#CardTmpl");
    result.forEach(element => {
      var html = $("#CardTmpl").render(element);
      $("#results").append(html);
    });
    
  }, 250))
});