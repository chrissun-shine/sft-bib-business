new nyc.ol.FinderApp({
  title: 'Sandy Funding Tracker',
  geoclientUrl: 'https://maps.nyc.gov/geoclient/v1/search.json?app_key=74DF5DB1D7320A9A2&app_id=nyc-lib-example',
  facilityTabTitle: 'Project Count',
  facilityUrl: CARTO_URL + encodeURIComponent('select ST_AsText(g.the_geom_webmercator) wkt_geom, s.council_district, count(s.council_district) count, sum(s.total_drawdown_amount_with_fringe) drawdown from bib_business_dataset s, council g where s.council_district = g.cd group by s.council_district, g.the_geom_webmercator order by drawdown desc'),
  facilityFormat: new nyc.ol.format.CartoSql(),
  facilityStyle: style,
  filterChoiceOptions: [{
    title: 'Program',
    choices: [
      {name: 'program', values: ['Build It Back Single-Family'], label: 'Build It Back Single-Family'},
      {name: 'program', values: ['Build It Back Multifamily'], label: 'Build It Back Multifamily'},
      {name: 'program', values: ['Build It Back Temporary Disaster Assistance Program'], label: 'Build It Back Temporary Disaster Assistance Program'},
      {name: 'program', values: ['Business PREP'], label: 'Business PREP'},
      {name: 'program', values: ['Hurricane Sandy Business Loan and Grant Program'], label: 'Hurricane Sandy Business Loan and Grant Program'},
      {name: 'program', values: ['Resiliency Innov. for a Stronger Economy (RISE:NYC)'], label: 'Resiliency Innovation for a Stronger Economy'}

    ]
  }, {
  title: 'Applicant Type',
    choices: [
      {name: 'beneficiary_type', values: ['SF Home'], label: 'Single-Family Home'},
      {name: 'beneficiary_type', values: ['MF Building'], label: 'Multifamily Building'},
      {name: 'beneficiary_type', values: ['MF Unit'], label: 'Multifamily Individual Unit'},
      {name: 'beneficiary_type', values: ['Business'], label: 'Business'},
      {name: 'beneficiary_type', values: ['Renter'], label: 'TDAP Rental Assistance'}
    ]
  }],

  facilitySearch: false,
  decorations: [decorations]
});

finderApp.pager.pageSize = 20;
finderApp.layer.setZIndex(100);

$(document).ready(function() {
  var collapsible = new nyc.Collapsible({
    target: $('<div id="group"></div>'),
    title: 'Search By',
    content: geoGroup.getContainer()
  });

  geoGroup.on('change', finderApp.filters.filter, finderApp.filters);
  $('#filters').prepend(collapsible.getContainer());
  finderApp.tabs.open('#filters');

  var map = finderApp.map;
  map.addLayer(geoGroup.layers.council);
  map.addLayer(geoGroup.layers.zip);
  map.addLayer(geoGroup.layers.community); 
  map.addLayer(geoGroup.layers.boro);
});

var layerChoices = new nyc.Choice({
  target: $('<div></div>'),
  choices: [
    {name: 'layer', label: 'None', value: 'none', checked: true},
    {name: 'layer', label: 'Sandy Inundation Zone', value: 'inundation'},
  ],
  radio: true
});

var layerCollapsible = new nyc.Collapsible({
  target: $('<div></div>'),
  title: 'Additional Layers',
  content: layerChoices.getContainer(),
  collapsed: true
});
$('#filters').append(layerCollapsible.getContainer());

layerChoices.on('change', function() {
  for (var layer in extraLayers) {
    extraLayers[layer].setVisible(false);
  }
  var chosen = layerChoices.val()[0].value
  extraLayers[chosen].setVisible(true);
});


var inundationLayer = new ol.layer.Tile({
  zIndex: 0,
  visible: false,
  source: new ol.source.CartoDB({
    account: 'nycomb-admin',
    config: {
      layers: [{
        type: 'cartodb',
        options: {
          cartocss_version: '2.1.1',
          cartocss: '#layer{polygon-fill:#627FE0;polygon-opacity:0.8;::outline{line-color:#FFFFFF;line-width:1;line-opacity:0.5;}}',
          sql: 'select * from sandy_inundation_zone'
        }
      }]
    }
  })
});

finderApp.map.addLayer(inundationLayer);

var extraLayers = {
  inundation: inundationLayer,
};