define([
  "core/plugins",
  "services/documentation",
  "text!templates/documentation.html",
  "css!./documentation",
  "css!widgets/navigation/menu"
], function(
  plugins,
  documentationService,
  template
){

  var DocumentationState = new function(){
    this.sections = ko.observable(documentationService.getSections());
    this.page       = ko.observable();

    this.openDir = function(doc, id) {
      return function() {
        sections(documentationService.getSections(id));
      }
    }
  }

  return {

    render: function(url) {
      var $documentation = $(template)[0];
      ko.applyBindings(DocumentationState, $documentation);
      $("#wrapper").replaceWith($documentation);
    },

    route: plugins.memorizeUrl(function(url, breadcrumb) {
      breadcrumb([['documentation/', "Documentation"]]);
      if (url.parameters[0] === void 0 || url.parameters[0] === "") {
        DocumentationState.page(0);
      } else {
        DocumentationState.page(documentationService.getPage(url.parameters[0]));
      }
    })

  }

});
