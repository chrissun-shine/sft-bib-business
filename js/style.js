function radius(count) {
  if (count <= 10) return 9;
  if (count > 10 && count <= 100) return 10;
  if (count > 100 && count <= 500) return 11;
  if (count > 500 && count <= 1000) return 15;
  if (count > 1000 && count <= 2000) return 25;
  if (count > 2000) return 35;
};

function style(feature, resolution) {
  var count = feature.get('count');
  var rad = radius(count);
  return [
    new ol.style.Style({
      image: new ol.style.Circle({
        radius: rad,
        fill: new ol.style.Fill({color: 'rgba(0,68,255,.8)'}),
        stroke: new ol.style.Stroke({
          width: 1,
          color: 'white'
        })
      }),
      text: new ol.style.Text({
        text: count + '',
        fill: new ol.style.Fill({color: 'white'})
      })
    }),
    new ol.style.Style({
      image: new ol.style.Circle({
        radius: rad + 2,
        stroke: new ol.style.Stroke({
          width: 1,
          color: '#274b72'
        })
      })
    })
  ];
};
