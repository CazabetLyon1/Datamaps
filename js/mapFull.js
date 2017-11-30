function reloadMapContainerFull(){
	document.getElementById('map').innerHTML = "<div id='mapid' style='max-width: 100%; height: 100vh; position: relative;'></div>";
}
function generateMapFull(){
	
	var geoLayerAll=L.geoJson(false,{
		onEachFeature: onEachFeature,
		pointToLayer: pointToLayerAll
	});
	
	var geoLayerLow=L.geoJson(false,{
		onEachFeature: onEachFeature,
		pointToLayer: pointToLayerLow
	});
	
	var geoLayerMedium=L.geoJson(false,{
		onEachFeature: onEachFeature,
		pointToLayer: pointToLayerMedium
	});
	
	var geoLayerHigh=L.geoJson(false,{
		onEachFeature: onEachFeature,
		pointToLayer: pointToLayerHigh
	});
	
	var geoLayerFull=L.geoJson(false,{
		onEachFeature: onEachFeature,
		pointToLayer: pointToLayerFull
	});
	
	var geoLayerEmpty=L.geoJson(false,{
		onEachFeature: onEachFeature,
		pointToLayer: pointToLayerEmpty
	});
	
	$.ajax({
		dataType: "json",
		cache: false,
		url: "../data/datatest.geojson",
		success: function(data) {
			geoLayerAll.addData(data);
			geoLayerLow.addData(data);
			geoLayerMedium.addData(data);
			geoLayerHigh.addData(data);
			geoLayerFull.addData(data);
			geoLayerEmpty.addData(data);
		}
	});
		
	var mapboxAttribution = 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>';
	var mapboxUrl = 'https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiZmxvZG9uIiwiYSI6ImNqODdnZW9yMDB3Y2cycW1qaWI0NG5vZWQifQ.1RvHn1sbWz9_v6uzEZDLTA';
	var light = L.tileLayer(mapboxUrl, {id: 'mapbox.light', attribution: mapboxAttribution});
    var streets = L.tileLayer(mapboxUrl, {id: 'mapbox.streets', attribution: mapboxAttribution});
	var dark = L.tileLayer(mapboxUrl, {id: 'mapbox.dark', attribution: mapboxAttribution});
    var satellite = L.tileLayer(mapboxUrl, {id: 'mapbox.satellite', attribution: mapboxAttribution});
	
	
	var mymap = L.map('mapid', {
		center: [45.76, 4.85],
		zoom: 13,
		layers: [streets,geoLayerAll]
	});
	
	var baseLayers = [
		{
			groupName : "Fonds de cartes",
			expanded : true,
			layers : 
				{
					" Rues": streets,
					" Claire": light,
					" Fonçé": dark,
					" Satellite": satellite
				}
		}
	];
	var overlay = [
		{
			groupName : "Toutes les stations",
			expanded : true,
			layers : 
				{
					" Toutes": geoLayerAll
				}
		},
		{
			groupName : "Stations densité élevée",
			expanded : true,
			layers : 
				{
					" Stations pleines": geoLayerFull,
					" Plus de 2/3 vélos disponibles": geoLayerHigh
				}
		},
		{
			groupName : "Stations densité moyenne",
			expanded : true,
			layers : 
				{
					" Plus de 1/3 vélos disponibles": geoLayerMedium
				}			
		},
		{
			groupName : "Stations densité faible",
			expanded : true,
			layers : 
				{
					" Moins de 1/3 vélos disponibles": geoLayerLow,
					" Stations vides": geoLayerEmpty
				}				
		}
	];
	var options = {
		container_width 	: "300px",
		container_maxHeight : "400px",
		exclusive       	: false,
		collapsed : true
	};
	
	mymap.addControl(new L.Control.Fullscreen());
	
	mymap.addControl(new L.Control.styledLayerControl(baseLayers,overlay,options));
		
	/*var popup = L.popup();

	function onMapClick(e) {
		popup
		.setLatLng(e.latlng)
		.setContent("Click sur la position " + e.latlng.toString())
		.openOn(mymap);
	}
	mymap.on('click', onMapClick);*/

	function onEachFeature(feature, layer) {
		var popup = '';
		if(feature.properties.statut){
			popup = '<b>Nom : '+feature.properties.name+'</b><br><b>Statut :</b> Ouverte<br><b>Capacité </b>'+feature.properties.capacity+'<br><b>Velos disponibles : </b>'+feature.properties.available+'<br><b>Dernière maj : </b>'+feature.properties.last_update+'<br><br><a href="#" class="refresh"><i class="fa fa-refresh"></i> Rafraîchir</a>';
		}else{
			popup = '<b>Nom : '+feature.properties.name+'</b><br><b>Statut :</b> Fermée<br><b>Capacité </b>'+feature.properties.capacity+'<br><b>Velos disponibles : </b>'+feature.properties.available+'<br><b>Dernière maj : </b>'+feature.properties.last_update+'<br><br><a href="#" class="refresh">Rafraîchir</a>';
		}
		layer.bindPopup(popup);
	}
	
	mymap.on('popupopen', function(e) {
		$('.refresh').click(function() {
			$.ajax({
				url : "traitement.php",
				type : "POST",
				cache: false,
				data : "id=" + e.popup._source.feature.properties.id,
				success : function(){
					setTimeout(function(){
						if (typeof mymap !== "undefined") {mymap.off();mymap.remove(); }
						reloadMapContainerFull();
						generateMapFull();
					},100);
				}
			});
		});
	});
	
	function pointToLayerAll(feature, latlng) {
		if(feature.properties.statut==0){
			return L.circleMarker(latlng, greyMarker);
		}else{
			if(feature.properties.available==0){
				return L.circleMarker(latlng, darkRedMarker);
			}else if(feature.properties.available==feature.properties.capacity){
				return L.circleMarker(latlng, darkGreenMarker);
			}else if(feature.properties.available<=feature.properties.capacity/3) {
				return L.circleMarker(latlng, redMarker);
			}else if (feature.properties.available>=(feature.properties.capacity*(2/3))) {
				return L.circleMarker(latlng, greenMarker);
			}else{
				return L.circleMarker(latlng, orangeMarker);
			}
		}
	}		
	
	function pointToLayerEmpty(feature, latlng) {
		if(feature.properties.statut==0){
			return L.circleMarker(latlng, greyMarker);
		}else{
			if(feature.properties.available==0) {
				return L.circleMarker(latlng, darkRedMarker);
			}
		}
	}
	
	function pointToLayerLow(feature, latlng) {
		if(feature.properties.statut==0){
			return L.circleMarker(latlng, greyMarker);
		}else{
			if(feature.properties.available!=0 && feature.properties.available<=feature.properties.capacity/3) {
				return L.circleMarker(latlng, redMarker);
			}
		}
	}	
	
	function pointToLayerMedium(feature, latlng) {
		if(feature.properties.statut==0){
			return L.circleMarker(latlng, greyMarker);
		}else{
			if(feature.properties.available>feature.properties.capacity/3 && feature.properties.available<(feature.properties.capacity*(2/3))) {
				return L.circleMarker(latlng, orangeMarker);
			}
		}
	}
	
	function pointToLayerHigh(feature, latlng) {
		if(feature.properties.statut==0){
			return L.circleMarker(latlng, greyMarker);
		}else{
			if (feature.properties.available!=feature.properties.capacity && feature.properties.available>=(feature.properties.capacity*(2/3))) {
				return L.circleMarker(latlng, greenMarker);
			}
		}
	}
	
	function pointToLayerFull(feature, latlng) {
		if(feature.properties.statut==0){
			return L.circleMarker(latlng, greyMarker);
		}else{
			if(feature.properties.available==feature.properties.capacity) {
				return L.circleMarker(latlng, darkGreenMarker);
			}
		}
	}

	var darkRedMarker = {
		radius: 8,
		fillColor: "#800000",
		color: "#800000",
		weight: 1,
		opacity: 1,
		fillOpacity: 1
	};
	
	var redMarker = {
		radius: 8,
		fillColor: "#ff0000",
		color: "#ff0000",
		weight: 1,
		opacity: 1,
		fillOpacity: 1
	};

	var greenMarker = {
		radius: 8,
		fillColor: "#00FF00",
		color: "#00FF00",
		weight: 1,
		opacity: 1,
		fillOpacity: 1
	};
	
	var darkGreenMarker = {
		radius: 8,
		fillColor: "#0e4b20",
		color: "#0e4b20",
		weight: 1,
		opacity: 1,
		fillOpacity: 1
	};

	var orangeMarker = {
		radius: 8,
		fillColor: "#FFA500",
		color: "#FFA500",
		weight: 1,
		opacity: 1,
		fillOpacity: 1
	};

	var greyMarker = {
		radius: 8,
		fillColor: "#A9A9A9",
		color: "#A9A9A9",
		weight: 1,
		opacity: 1,
		fillOpacity: 1
	};	
}