define(function(){

  // File model...
  function File(config) {
    var self = this;
    self.name = config.name || config.humanLocation;
    self.location = config.location;
    self.humanLocation = config.humanLocation;
    self.isDirectory = config.isDirectory;
    self.isFile = !config.isDirectory;
    self.highlighted = ko.observable(false);
    self.cancelable = config.cancelable || false;
  }

  // Function for filtering...
  function fileIsHighlighted(file) {
    return file.highlighted();
  }

  // Connections
  function browse(location) {
    return $.ajax({
      url: '/api/local/browse',
      type: 'GET',
      dataType: 'json',
      data: {
        location: location
      }
    }).error(function() {
      console.error('Failed to load file system.');
    });
  };
  function browseRoots() {
    return $.ajax({
        url: '/api/local/browseRoots',
        type: 'GET',
        dataType: 'json'
    });
  };

  // Object
  return {
    directory: browse,
    newFile: function(path, name){

    },
    newFolder: function(path, name){

    },
    saveFile: function(){

    }
  }
});
