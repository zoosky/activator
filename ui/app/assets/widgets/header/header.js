define([
  'commons/settings',
  'core/router',
  'widgets/omnisearch/omnisearch',
  'widgets/buttons/dropdown',
  'text!templates/header.html',
  'css!./header',
  'css!./breadcrumb'
], function(
  settings,
  router,
  omnisearch,
  dropdown,
  template
){

  var $header = $(template)[0];

  var Omnisearch = new function(){
    this.search = ko.observable("")
  }

  var LayoutManagerState = new function(){
    var self = this;
    this.pannelShape      = settings.observable("layoutManager.pannelShape"     , "right1");
    this.pannelState      = settings.observable("layoutManager.pannelState"     , true);
    this.navigationState  = settings.observable("layoutManager.navigationState" , true);

    this.pannelChange = function(it, e){
      self.pannelShape(e.target.className);
      self.pannelState(true);
    }
    this.pannelToggle = function(it, e){
      e.preventDefault();
      e.stopPropagation();
      self.pannelState(!self.pannelState());
    }
    this.navigationToggle = function(it,e){
      self.navigationState(!self.navigationState());
    }
    this.openPannelOptions = function(it, e){
      e.preventDefault();
      e.stopPropagation();
      $("#layoutManager").toggleClass("opened");
    }
    this.closePannelOptions = function(it, e){
      e.preventDefault();
      e.stopPropagation();
      $("#layoutManager").removeClass("opened");
    }
  }

  var HeaderState = {
    layoutManager: LayoutManagerState,
    omnisearch: Omnisearch,
    breadcrumb: router.breadcrumb,
    user: {},
    notifications: {},
    omnisearch: omnisearch
  };

  ko.applyBindings(HeaderState, $header)

  dropdown($header);

  return $header;

});
