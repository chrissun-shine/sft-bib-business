var decorations = {
  geo: function() {
    return this.finderApp.filters.getGeo();
  },
  geoType: function(geo) {
    var geoType = {
      council: 'City Council District: ',
      community: 'Community District: ',
      zip: 'ZIP Code: ',
      boro: ''
    }[geo];
    return $('<h3>' + geoType + '</h3>')
  },
  geoName: function(geo) {
    return this.get(this.finderApp.filters.projColumns[geo]);
  },
  getName: function() {
    var geo = this.geo();
    return this.geoType(geo)
      .append(this.geoName(geo));
  },

  detailsHtml: function(data) {
    var rows = data ? data.rows : [this.getProperties()];
    return this.getDetails(rows);
  },

  getDetails: function(rows) {
    var details = $('<div></div>');
    var feature = this;
    $.each(rows, function(_, row) {
      var detail = $('<p></p>');
      var program = row.program || '';
      var count = program ? row.prg_count : row.count;
      var commacount = count.toLocaleString('en-US', {
        style: 'decimal'
      });
      detail.append('<div><b>' + program + '</b></div>')
        .append('Applicant')
        .append(count > 1 ? 's: ' : ': ')
        .append(commacount)
        .append(feature.getDrawdown(row, program));
      details.append(detail);
    });
    return details;
  },

  getDrawdown: function(row) {
    var drawdown = new Number(row.drawdown);
    drawdown = drawdown.toLocaleString('en-US', {
      currency: 'USD',
      style: 'currency',
      maximumFractionDigits: 0,
      minimumFractionDigits: 0
    });
    return $('<div>Total Drawdown: </div>')
      .append(drawdown);
  },

  html: function(data) {
    return $('<div class="sft-feature"></div>')
      .append(this.getName())
      .append(this.detailsHtml(data));
  }
};