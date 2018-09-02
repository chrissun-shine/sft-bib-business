var geoGroup = new nyc.Choice({
  target: $('<div></div>'),
  radio: true,
  choices: [
    {name: 'group', values: ['council'], label: 'Council District', checked: true},
    {name: 'group', values: ['community'], label: 'Community District'},
    {name: 'group', values: ['zip'], label: 'Zip Code'},
    {name: 'group', values: ['boro'], label: 'Borough'}
  ]
});

var css ='#layer {line-color: #274b72;line-width:2}'
var councilLayer = new ol.layer.Tile({
  source: new ol.source.CartoDB({
    account: 'nycomb-admin',
    config: {
      layers: [{
        type: 'cartodb',
        options: {
          cartocss_version: '2.1.1',
          cartocss: css,
          sql: 'select cartodb_id, the_geom_webmercator, rep as rep, coun_dist as name from council_boundaries'
        }
      }]
    }
  })
});

var zipLayer = new ol.layer.Tile({
  visible: false,
  source: new ol.source.CartoDB({
    account: 'nycomb-admin',
    config: {
      layers: [{
        type: 'cartodb',
        options: {
          cartocss_version: '2.1.1',
          cartocss: css,
          sql: 'select cartodb_id, the_geom_webmercator, postalcode as name from zipcode_boundaries'
        }
      }]
    }
  })
});

var boroLayer = new ol.layer.Tile({
  visible: false,
  source: new ol.source.CartoDB({
    account: 'nycomb-admin',
    config: {
      layers: [{
        type: 'cartodb',
        options: {
          cartocss_version: '2.1.1',
          cartocss: css,
          sql: 'select cartodb_id, the_geom_webmercator, boro_name as name from borough_boundaries'
        }
      }]
    }
  })
});

var communityLayer = new ol.layer.Tile({
  visible: false,
  source: new ol.source.CartoDB({
    account: 'nycomb-admin',
    config: {
      layers: [{
        type: 'cartodb',
        options: {
          cartocss_version: '2.1.1',
          cartocss: css,
          sql: 'select cartodb_id, the_geom_webmercator, boro_cd as name from comm_boundaries'
        }
      }]
    }
  })
});

geoGroup.layers = {
  council: councilLayer,
  community: communityLayer,
  zip: zipLayer,
  boro: boroLayer
};

geoGroup.getGroup = function() {
  return this.val()[0].values[0];
};

geoGroup.on('change', function() {
  var group = geoGroup.getGroup();
  for (var name in geoGroup.layers) {
    geoGroup.layers[name].setVisible(group === name);
  }
});
