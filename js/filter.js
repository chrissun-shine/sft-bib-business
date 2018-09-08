var CARTO_URL = 'https://nycomb-admin.carto.com/api/v2/sql?q=';

nyc.ol.Filters.prototype.geoGroup = geoGroup;

nyc.ol.Filters.prototype.projColumns = {
  zip: 'address_postal_code',
  boro: 'borough',
  community: 'community_district',
  council: 'council_district'
};

nyc.ol.Filters.prototype.geoColumns = {
  zip: 'zip',
  boro: 'boro',
  community:'boro_cd',
  council: 'cd'
};

nyc.ol.Filters.prototype.getGeo = function() {
  return this.geoGroup.getGroup();
};

nyc.ol.Filters.prototype.select = function(projCol, popup) {
  var select = 'select s.' + projCol + ', count(s.' + projCol + ') count, sum(s.total_drawdown_amount_with_fringe) drawdown';
  if (popup) {
    select += ', s.program, count(s.program) prg_count';
  } else {
    select += ', ST_AsText(g.the_geom_webmercator) wkt_geom';
  }
  return select;
};

nyc.ol.Filters.prototype.from = function() {
  return ' from bib_business_dataset s, ' + this.getGeo() + ' g';
};

nyc.ol.Filters.prototype.where = function(projCol, geoCol, geoId) {
  var where = ['s.' + projCol + ' = g.' + geoCol];
  var namedFilters = {};
    for (var i = 0; i < this.choiceControls.length; i++) {
    var values = this.choiceControls[i].val();
    for (var j = 0; j < values.length; j++) {
      var choice = values[j];
      var filter = namedFilters[choice.name] || [];
      namedFilters[choice.name] = filter.concat("'" + choice.values + "'");
    }
  }
  for (var name in namedFilters) {
    where.push('s.' + name + ' in (' + namedFilters[name].join(',') + ')');
  }
  if (geoId) {
    where.push('g.' + geoCol + " = '" + geoId + "'");
  }
  return ' where ' + where.join(' AND ');
};

nyc.ol.Filters.prototype.group = function(projCol, popup) {
  var group = ' group by s.' + projCol;
  if (popup) {
    group += ', s.program';
  } else {
    group += ', g.the_geom_webmercator'
  }
  return group;
};

nyc.ol.Filters.prototype.sql = function() {
  var geo = this.getGeo();
  var geoCol = this.geoColumns[geo];
  var projCol = this.projColumns[geo];
  return encodeURIComponent(
    this.select(projCol) +
    this.from(projCol) +
    this.where(projCol, geoCol) +
    this.group(projCol)
  );
};

nyc.ol.Filters.prototype.filter = function() {
  var filters = this;
  var source = this.source;
  $.ajax({
    url: CARTO_URL + this.sql(),
    dataType: 'text', 
    success: function(response) {
      var features = source.getFormat().readFeatures(response);
      source.clear();
      source.addFeatures(features);
      filters.trigger('change', filters);
    }
  });
};

nyc.ol.Filters.prototype.breakdownSql = function(geoId) {
  var geo = this.getGeo();
  var geoCol = this.geoColumns[geo];
  var projCol = this.projColumns[geo];
  return encodeURIComponent(
    this.select(projCol, true) +
    this.from(projCol) +
    this.where(projCol, geoCol, geoId) +
    this.group(projCol, true)
  );
};