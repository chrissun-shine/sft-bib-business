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
    var type = this.geoType(geo);
    var count = this.get('count');
    commacount = count.toLocaleString('en-US', {
      style: 'decimal'
    });
    return $('<div></div>')
      .append(type.append(this.geoName(geo)))
      .append(commacount + ' applicant')
      .append(count > 1 ? 's' : '')
  },

  getDetails: function() {
    var geo = this.geo();
    var type = this.geoType(geo);
    var count = this.get('count');
    commacount = count.toLocaleString('en-US', {
      style: 'decimal'
    });
    return $('<div></div>')
      .append(this.getDrawdown());
  },

  getDrawdown: function() {
    var drawdown = new Number(this.get('drawdown'));
    drawdown = drawdown.toLocaleString('en-US', {
      currency: 'USD',
      style: 'currency',
      maximumFractionDigits: 0,
      minimumFractionDigits: 0
    });
    return $('<div><p><b>Total Drawdown:</b></P></div>')
      .append(drawdown);
  },

  html: function() {
    return $('<div></div>')
      .append(this.getName())
      .append(this.getDetails());
  }
};