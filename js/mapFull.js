function charger(){
	$.ajax({
		type: "GET",
		url : "../index.php?page=controleur/traitement.php",
		success : function(){
			if($('.load-delay').length !== 0) {
				reloadMapContainerFull();
				generateMapFull();
			}
		}
	});
    setTimeout(charger,300000);
}

charger();

function reloadMapContainerFull(){
	document.getElementById('map').innerHTML = "<div id='mapid' style='max-width: 100%; height: 100vh; position: relative;'></div>";
}
function generateMapFull(){
	
	var mapboxAttribution = 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>';
	var mapboxUrl = 'https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiZmxvZG9uIiwiYSI6ImNqODdnZW9yMDB3Y2cycW1qaWI0NG5vZWQifQ.1RvHn1sbWz9_v6uzEZDLTA';
	var light = L.tileLayer(mapboxUrl, { id: 'mapbox.light', attribution: mapboxAttribution });
	var streets = L.tileLayer(mapboxUrl, { id: 'mapbox.streets', attribution: mapboxAttribution });
	var dark = L.tileLayer(mapboxUrl, { id: 'mapbox.dark', attribution: mapboxAttribution });
	var satellite = L.tileLayer(mapboxUrl, { id: 'mapbox.satellite', attribution: mapboxAttribution });
	var streets2 = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', { attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors' });
	var pistecyclable = L.tileLayer('http://{s}.tile.opencyclemap.org/cycle/{z}/{x}/{y}.png');
	var terrain = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', { attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community' });

	var objMarkers = {
		marker: function (i) { return { radius: 8, fillColor: getColor(i.properties.available, i.properties.capacity), color: getColor(i.properties.available, i.properties.capacity), weight: 1, opacity: 1, fillOpacity: 1 } }
	}
	
	function getColor(d, e) {
		return e == 0 ? '#A9A9A9' :
			(d / e) == 1 ? '#005000' :
				(d / e) > 0.9 ? '#00FF00' :
					(d / e) > 0.8 ? '#47FF00' :
						(d / e) > 0.7 ? '#7CFF00' :
							(d / e) > 0.6 ? '#B0FF00' :
								(d / e) > 0.5 ? '#E5FF00' :
									(d / e) > 0.4 ? '#FFE400' :
										(d / e) > 0.3 ? '#FFAF00' :
											(d / e) > 0.25 ? '#FF7B00' :
												(d / e) > 0.2 ? '#FF5700' :
													(d / e) > 0.15 ? '#FF4600' :
														(d / e) > 0.1 ? '#FF3400' :
															(d / e) > 0.05 ? '#FF2300' :
																'#FF0000';
	}
	var objGeoLayer = {
		geoLayerSearch: L.geoJson(),
		geoLayerAll: L.geoJson(false, { onEachFeature: onEachFeature, pointToLayer: pointToLayerAll }),
		geoLayerEmpty: L.geoJson(false, { onEachFeature: onEachFeature, pointToLayer: pointToLayerEmpty }),
		geoLayerLow: L.geoJson(false, { onEachFeature: onEachFeature, pointToLayer: pointToLayerLow }),
		geoLayerMedium: L.geoJson(false, { onEachFeature: onEachFeature, pointToLayer: pointToLayerMedium }),
		geoLayerHigh: L.geoJson(false, { onEachFeature: onEachFeature, pointToLayer: pointToLayerHigh }),
		geoLayerFull: L.geoJson(false, { onEachFeature: onEachFeature, pointToLayer: pointToLayerFull })
	}
	$.ajax({
		dataType: "json",
		cache: false,
		url: "../data/datatest.geojson",
		success: function (data) {
			objGeoLayer.geoLayerAll.addData(data);
			objGeoLayer.geoLayerEmpty.addData(data);
			objGeoLayer.geoLayerLow.addData(data);
			objGeoLayer.geoLayerMedium.addData(data);
			objGeoLayer.geoLayerHigh.addData(data);
			objGeoLayer.geoLayerFull.addData(data);
			objGeoLayer.geoLayerSearch.addData(data);
		}
	});
		
	var mymap = L.map('mapid', {
		center: [45.76, 4.85],
		zoom: 13,
		layers: [streets, objGeoLayer.geoLayerAll]
	});

	var firstpolyline = new L.Polyline([], {
		color: 'blue',
		weight: 3,
		opacity: 1,
		smoothFactor: 1
	});

	var legend = L.control({ position: 'bottomleft' });
	legend.onAdd = function (mymap) {

		var div = L.DomUtil.create('div', 'legendeinfo legendestyle');
		div.innerHTML += '<div id=\"closed\"></div> Fermée<br><div id=\"low\"></div> < 1/3 vélos dispo<br><div id=\"medium\"></div> < 2/3 vélos dispo<br><div id=\"high\"></div> > 2/3 vélos dispo<br><div id=\"full\"></div> pleines';
		return div;
	};
	legend.addTo(mymap);
		
	var baseLayers = [
		{
			groupName: "Fonds de cartes",
			expanded: true,
			layers:
				{
					" Rues": streets,
					" Rues couleur": streets2,
					" Pistes cyclables": pistecyclable,
					" Claire": light,
					" Fonçé": dark,
					" Terrain": terrain,
					" Satellite": satellite
				}
		}
	];
	var overlay = [
		{
			groupName: "Toutes les stations",
			expanded: true,
			layers:
				{
					" Toutes": objGeoLayer.geoLayerAll
				}
		},
		{
			groupName: "Stations densité élevée",
			expanded: true,
			layers:
				{
					" Stations pleines": objGeoLayer.geoLayerFull,
					" Plus de 2/3 vélos disponibles": objGeoLayer.geoLayerHigh
				}
		},
		{
			groupName: "Stations densité moyenne",
			expanded: true,
			layers:
				{
					" Plus de 1/3 vélos disponibles": objGeoLayer.geoLayerMedium
				}
		},
		{
			groupName: "Stations densité faible",
			expanded: true,
			layers:
				{
					" Moins de 1/3 vélos disponibles": objGeoLayer.geoLayerLow,
					" Stations vides": objGeoLayer.geoLayerEmpty
				}
		}
	];
	var options = {
		container_width: "300px",
		container_maxHeight: "400px",
		group_maxHeight: "200px",
		exclusive: false,
		collapsed: true
	};

	mymap.addControl(new L.Control.Fullscreen());
	mymap.addControl(new L.Control.styledLayerControl(baseLayers, overlay, options));

	var searchControl = new L.Control.Search({
		position: 'topleft',
		layer: objGeoLayer.geoLayerSearch,
		propertyName: 'name',
		marker: {
			icon: false,
			animate: true,
			circle: {
				radius: 10,
				weight: 3,
				color: '#0000FF',
				stroke: true,
				fill: false
			}
		},
		moveToLocation: function (latlng, title, mymap) {
			mymap.setView(latlng, 15);
		}
	});
	
	mymap.addControl(searchControl);

	function onMapClick(e) {
		if ($('input[name=x1]').get(0) != null && $('#livalidation').get(0) == null) {
			if ($('input[name=x1]').val() == "") {
				$('input[name=x1]').val(e.latlng.lat.toString());
				$('input[name=y1]').val(e.latlng.lng.toString());
			} else {
				$('input[name=x2]').val(e.latlng.lat.toString());
				$('input[name=y2]').val(e.latlng.lng.toString());
				$('#listetools').append("<li id=\"livalidation\"><a><button type=\"button\" class=\"btn btn-success\" onclick=\"coorToObject()\">Valider</button><button style=\"float:right;\" type=\"button\" class=\"btn btn-danger\" onclick=\"cancel()\">Cancel</button></a></li>");
			}
		}
	}
	mymap.on('click', onMapClick);

	function onEachFeature(feature, layer) {
		var popup = '';
		if (feature.properties.statut) {
			popup = '<b>Nom : ' + feature.properties.name + '</b><br><b>Statut :</b> Ouverte<br><b>Capacité : </b>' + feature.properties.capacity + '<br><b>Velos disponibles : </b>' + feature.properties.available + '<br><b>Dernière maj : </b>' + feature.properties.last_update + '<br><br><a href="#" class="refresh"><i class="fa fa-refresh"></i> Rafraîchir</a>';
		} else {
			popup = '<b>Nom : ' + feature.properties.name + '</b><br><b>Statut :</b> Fermée<br><b>Capacité : </b>' + feature.properties.capacity + '<br><b>Velos disponibles : </b>' + feature.properties.available + '<br><b>Dernière maj : </b>' + feature.properties.last_update + '<br><br><a href="#" class="refresh"><i class="fa fa-refresh"></i> Rafraîchir</a>';
		}
		layer.bindPopup(popup);
	}
	mymap.on('popupopen', function (e) {
		$('.refresh').click(function () {
			if (typeof mymap !== "undefined") { mymap.off(); mymap.remove(); }
			reloadMapContainer();
			generateMap();
		});
		if ($('#checkbox2').prop("checked")) {
			$.ajax({
				url: "modele/lienstations.php",
				type: "POST",
				cache: false,
				data: "num=" + e.popup._source.feature.properties.id,
				dataType: "Json",
				success: function (data) {
					var pointA = new L.LatLng(e.popup._source.feature.geometry.coordinates[1], e.popup._source.feature.geometry.coordinates[0]);
					var pointB = new L.LatLng(data[1][0], data[1][1]);
					var pointC = new L.LatLng(data[2][0], data[2][1]);
					var pointD = new L.LatLng(data[3][0], data[3][1]);
					var pointE = new L.LatLng(data[4][0], data[4][1]);
					var pointF = new L.LatLng(data[5][0], data[5][1]);
					var pointG = new L.LatLng(data[6][0], data[6][1]);
					var pointH = new L.LatLng(data[7][0], data[7][1]);
					var pointI = new L.LatLng(data[8][0], data[8][1]);
					var pointJ = new L.LatLng(data[9][0], data[9][1]);
					var pointList = [
						[pointA, pointB],
						[pointA, pointC],
						[pointA, pointD],
						[pointA, pointE],
						[pointA, pointF],
						[pointA, pointG],
						[pointA, pointH],
						[pointA, pointI],
						[pointA, pointJ]
					];
					firstpolyline.setLatLngs(pointList);
					mymap.addLayer(firstpolyline);
				}
			});
		}
	});

	$('#checkbox2').change(function () {
		if (!this.checked) {
			firstpolyline.setLatLngs([]);
		}
	})

	function pointToLayerAll(feature, latlng) {
		return L.circleMarker(latlng, objMarkers.marker(feature));
	}

	function pointToLayerEmpty(feature, latlng) {
		if (feature.properties.statut == 0 || feature.properties.available == 0) {
			return L.circleMarker(latlng, objMarkers.marker(feature));
		}
	}

	function pointToLayerLow(feature, latlng) {
		if (feature.properties.statut != 0 && feature.properties.available != 0 && feature.properties.available < feature.properties.capacity / 3) {
			return L.circleMarker(latlng, objMarkers.marker(feature));
		}
	}

	function pointToLayerMedium(feature, latlng) {
		if (feature.properties.statut != 0 && feature.properties.available >= feature.properties.capacity / 3 && feature.properties.available < (feature.properties.capacity * (2 / 3))) {
			return L.circleMarker(latlng, objMarkers.marker(feature));
		}
	}

	function pointToLayerHigh(feature, latlng) {
		if (feature.properties.statut != 0 && feature.properties.available != feature.properties.capacity && feature.properties.available >= (feature.properties.capacity * (2 / 3))) {
			return L.circleMarker(latlng, objMarkers.marker(feature));
		}
	}

	function pointToLayerFull(feature, latlng) {
		if (feature.properties.statut != 0 && feature.properties.available == feature.properties.capacity) {
			return L.circleMarker(latlng, objMarkers.marker(feature));
		}
	}
}