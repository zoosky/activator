define(function() {

  return {
    readableSize: function(size) {
      if(size < 1024) {
        return size.toFixed(2) + ' b';
      }
      size /= 1024.0;
      if(size < 1024) {
        return size.toFixed(2) + ' Kb';
      }
      size /= 1024.0;
      if(size < 1024) {
        return size.toFixed(2) + 'Mb';
      }
      size /= 1024.0;
      return size.toFixed(2) + 'Gb';
    }
  }

});
