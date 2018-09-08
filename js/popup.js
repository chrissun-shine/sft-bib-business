nyc.ol.MultiFeaturePopup.prototype.showFeatures = function(features) {
  var popup = this;
  var filters = window.finderApp.filters;
  var source = window.finderApp.source;
  var feature = features[0];
  var projCol = filters.projColumns[filters.getGeo()];
  var coordinate = ol.extent.getCenter(feature.getGeometry().getExtent())
  var url = source.getUrl().split('?')[0];
  console.warn(projCol,feature.get(projCol));
  
  $.ajax({
    url: url + '?q=' + filters.popupSql(feature.get(projCol)),
    success: function(data) {
      popup.show({
        coordinate: coordinate,
        html: feature.html(data)
      })
    }
  })
};
