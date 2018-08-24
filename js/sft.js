new nyc.ol.FinderApp({
  title: 'Sandy Funding Tracker',
  geoclientUrl: 'https://maps.nyc.gov/geoclient/v1/search.json?app_key=74DF5DB1D7320A9A2&app_id=nyc-lib-example',
  facilityTabTitle: 'Project Count',
  facilityUrl: CARTO_URL + encodeURIComponent('select ST_AsText(g.the_geom_webmercator) wkt_geom, s.council_district, count(s.council_district) count, sum(s.total_drawdown_amount_with_fringe) drawdown from bib_business_dataset s, council g where s.council_district = g.cd group by s.council_district, g.the_geom_webmercator order by drawdown desc'),
  facilityFormat: new nyc.ol.format.CartoSql(),
  facilityStyle: style,
  filterChoiceOptions: [{
    title: 'Managing Agency',
    choices: [
      {name: 'agency_name', values: ['Department of Environmental Protection'], label: 'Department of Environmental Protection'},
      {name: 'agency_name', values: ['Housing Preservation and Development'], label: 'Housing Preservation and Development'},
      {name: 'agency_name', values: ['Department of Design and Construction'], label: 'Department of Design and Construction'}
    ]
  }, {
    title: 'Program',
    choices: [
      {name: 'program', values: ['Build It Back Single-Family'], label: 'Build It Back Single-Family'},
      {name: 'program', values: ['Build It Back Multifamily'], label: 'Build It Back Multifamily'},
      {name: 'program', values: ['Build It Back Temporary Disaster Assistance Program'], label: 'Build It Back Temporary Disaster Assistance Program'},
      {name: 'program', values: ['Business PREP'], label: 'Business PREP'},
      {name: 'program', values: ['Hurricane Sandy Business Loan and Grant Program'], label: 'Hurricane Sandy Business Loan and Grant Program'},
      {name: 'program', values: ['Resiliency Innov. for a Stronger Economy (RISE:NYC)'], label: 'Resiliency Innovation for a Stronger Economy'}

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
  map.addLayer(geoGroup.layers.boro);
});