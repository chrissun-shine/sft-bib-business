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
    return $('<h3 class="name">' + geoType + '</h3>')
  },
  geoName: function(geo) {
    return this.get(this.finderApp.filters.projColumns[geo]);
  },
  getName: function() {
    var geo = this.geo();
    return this.geoType(geo)
      .append(this.geoName(geo));
  },


  breakdownHtml: function() {
    var feature = this;
    var content = $('<div></div>');
    var breakdown = new nyc.Collapsible({
      target: $('<div></div>'),
      title: 'Breakdown',
      content: content,
      collapsed: true
    });
    breakdown.one('change', function() {
      breakdown.one('change', function() {
        var finderApp = feature.finderApp;
        var filters = finderApp.filters;
        var source = finderApp.source;
        var popup = finderApp.popup;
        var projCol = filters.projColumns[filters.getGeo()];
        var url = source.getUrl().split('?')[0];
        $.ajax({
          url: url + '?q=' + filters.breakdownSql(feature.get(projCol)),
          success: function(data) {
            content.html(feature.getDetails(data.rows));
            if ($.contains(popup.getElement(), content.get(0))) {
              popup.pan();
            }
          }
        })
      });
    });
    return breakdown.getContainer();
  },

  detailsHtml: function() {
    return this.getDetails([this.getProperties()])
      .append(this.breakdownHtml());
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
        .append('Active Applicant')
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

  getRep: function() {
    const geo = this.geo();
    if (geo === 'boro' || geo === 'council') {
      const rep = this.get('rep');
      const div = $('<divclass="rep"></div>');
      if (geo === 'boro') {
        return div.append('Borough President ' + rep)
      }
      if (geo === 'council') {
        return div.append('Council Member ' + rep)
      }
    }
  },

  html: function() {
    return $('<div class="sft-feature"></div>')
    .append(this.getName())
    .append(this.getRep())
    .append(this.detailsHtml());
  }
};