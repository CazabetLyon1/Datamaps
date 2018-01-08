/* Génère le DOM du conteneur de la carte */
function reloadMapContainer(){
	document.getElementById('map').innerHTML = "<div id='mapid' style='max-width: 100%; height: calc(100vh - 100px); position: relative; box-shadow: 10px 10px 5px grey;'></div>";
}

/* Génère le DOM des conteneurs des 6 cartes */
function reloadMapStats(){
	document.getElementById('groupe1').innerHTML = "<div id='mapgroupe1' style='max-width: 100%; height: 300px; position: relative; box-shadow: 10px 10px 5px grey;'></div>";
	document.getElementById('groupe2').innerHTML = "<div id='mapgroupe2' style='max-width: 100%; height: 300px; position: relative; box-shadow: 10px 10px 5px grey;'></div>";
	document.getElementById('groupe3').innerHTML = "<div id='mapgroupe3' style='max-width: 100%; height: 300px; position: relative; box-shadow: 10px 10px 5px grey;'></div>";
	document.getElementById('groupe4').innerHTML = "<div id='mapgroupe4' style='max-width: 100%; height: 300px; position: relative; box-shadow: 10px 10px 5px grey;'></div>";
	document.getElementById('groupe5').innerHTML = "<div id='mapgroupe5' style='max-width: 100%; height: 300px; position: relative; box-shadow: 10px 10px 5px grey;'></div>";
	document.getElementById('groupe6').innerHTML = "<div id='mapgroupe6' style='max-width: 100%; height: 300px; position: relative; box-shadow: 10px 10px 5px grey;'></div>";
}

/* Génère la carte et tout ses paramètres */
function generateMap(){

	var mapboxAttribution = 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>';
	var mapboxUrl = 'https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiZmxvZG9uIiwiYSI6ImNqODdnZW9yMDB3Y2cycW1qaWI0NG5vZWQifQ.1RvHn1sbWz9_v6uzEZDLTA';
	var light = L.tileLayer(mapboxUrl, {id: 'mapbox.light', attribution: mapboxAttribution});
	var streets = L.tileLayer(mapboxUrl, {id: 'mapbox.streets', attribution: mapboxAttribution});
	var dark = L.tileLayer(mapboxUrl, {id: 'mapbox.dark', attribution: mapboxAttribution});
	var satellite = L.tileLayer(mapboxUrl, {id: 'mapbox.satellite', attribution: mapboxAttribution});
	var streets2 = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'});
	var pistecyclable = L.tileLayer('http://{s}.tile.opencyclemap.org/cycle/{z}/{x}/{y}.png');
	var terrain = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'});

	var objMarkers = {
		marker: function(i){return {radius: 8,fillColor: getColor(i.properties.available, i.properties.capacity), color: getColor(i.properties.available, i.properties.capacity),weight: 1,opacity: 1,fillOpacity: 1}}
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
		geoLayerAll: L.geoJson(false,{onEachFeature: onEachFeature,pointToLayer: pointToLayerAll}),
		geoLayerEmpty: L.geoJson(false,{onEachFeature: onEachFeature,pointToLayer: pointToLayerEmpty}),
		geoLayerLow: L.geoJson(false,{onEachFeature: onEachFeature,pointToLayer: pointToLayerLow}),
		geoLayerMedium: L.geoJson(false,{onEachFeature: onEachFeature,pointToLayer: pointToLayerMedium}),
		geoLayerHigh: L.geoJson(false,{onEachFeature: onEachFeature,pointToLayer: pointToLayerHigh}),
		geoLayerFull: L.geoJson(false,{onEachFeature: onEachFeature,pointToLayer: pointToLayerFull})
	}
	$.ajax({
		dataType: "json",
		url: "data/datatest.geojson",
		success: function(data) {
			objGeoLayer.geoLayerAll.addData(data);
			objGeoLayer.geoLayerEmpty.addData(data);
			objGeoLayer.geoLayerLow.addData(data);
			objGeoLayer.geoLayerMedium.addData(data);
			objGeoLayer.geoLayerHigh.addData(data);
			objGeoLayer.geoLayerFull.addData(data);
			objGeoLayer.geoLayerSearch.addData(data);
		}
	});

	bounds = new L.LatLngBounds(new L.LatLng(45.60, 5.10), new L.LatLng(45.91, 4.62));
	var mymap = L.map('mapid', {
		center: bounds.getCenter(),		
		zoom: 13,
		minZoom: 11,
		maxBounds: bounds,
		maxBoundsViscosity: 0.8,
		layers: [streets,objGeoLayer.geoLayerAll]
	});
	
	var firstpolyline = new L.Polyline([], {
		color: 'blue',
		weight: 3,
		opacity: 1,
		smoothFactor: 1
	});

	var legend = L.control({position: 'bottomleft'});
	legend.onAdd = function (mymap) {
	
		var div = L.DomUtil.create('div','legendeinfo legendestyle');
		div.innerHTML += '<div id=\"closed\"></div> Fermée<br><div id=\"low\"></div> < 1/3 vélos dispo<br><div id=\"medium\"></div> < 2/3 vélos dispo<br><div id=\"high\"></div> > 2/3 vélos dispo<br><div id=\"full\"></div> pleines';
		return div;
	};
	legend.addTo(mymap);
	
	var baseLayers = [
		{
			groupName : "Fonds de cartes",
			expanded : true,
			layers :
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
			groupName : "Toutes les stations",
			expanded : true,
			layers : 
				{
					" Toutes": objGeoLayer.geoLayerAll
				}
		},
		{
			groupName : "Stations densité élevée",
			expanded : true,
			layers : 
				{
					" Stations pleines": objGeoLayer.geoLayerFull,
					" Plus de 2/3 vélos disponibles": objGeoLayer.geoLayerHigh
				}
		},
		{
			groupName : "Stations densité moyenne",
			expanded : true,
			layers : 
				{
					" Plus de 1/3 vélos disponibles": objGeoLayer.geoLayerMedium
				}
		},
		{
			groupName : "Stations densité faible",
			expanded : true,
			layers : 
				{
					" Moins de 1/3 vélos disponibles": objGeoLayer.geoLayerLow,
					" Stations vides": objGeoLayer.geoLayerEmpty
				}
		}
	];
	var options = {
		container_width 	: "300px",
		container_maxHeight : "400px",
		group_maxHeight     : "200px",
		exclusive       	: false,
		collapsed : true
	};
				
	mymap.addControl(new L.Control.Fullscreen());
	mymap.addControl(new L.Control.styledLayerControl(baseLayers,overlay,options));

	var searchControl = new L.Control.Search({
		position:'topleft',		
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
		moveToLocation: function(latlng, title, mymap) {
			mymap.setView(latlng, 15);
		}
	});

	mymap.addControl( searchControl );

	function onMapClick(e) {
		if($('input[name=x1]').get(0) != null && $('#livalidation').get(0) == null){
			if($('input[name=x1]').val()==""){
				$('input[name=x1]').val(e.latlng.lat.toString());
				$('input[name=y1]').val(e.latlng.lng.toString());
			}else{
				$('input[name=x2]').val(e.latlng.lat.toString());
				$('input[name=y2]').val(e.latlng.lng.toString());
				$('#listetools').append("<li id=\"livalidation\"><a><button type=\"button\" class=\"btn btn-success\" onclick=\"coorToObject()\">Valider</button><button style=\"float:right;\" type=\"button\" class=\"btn btn-danger\" onclick=\"cancel()\">Cancel</button></a></li>");
			}
		}
	}
	mymap.on('click', onMapClick);
				
	function onEachFeature(feature, layer) {
		var popup = '';
		if(feature.properties.statut){
			popup = '<b>Nom : '+feature.properties.name+'</b><br><b>Statut :</b> Ouverte<br><b>Capacité : </b>'+feature.properties.capacity+'<br><b>Velos disponibles : </b>'+feature.properties.available+'<br><b>Dernière maj : </b>'+feature.properties.last_update+'<br><br><a href="#" class="refresh"><i class="fa fa-refresh"></i> Rafraîchir</a>';
		}else{
			popup = '<b>Nom : '+feature.properties.name+'</b><br><b>Statut :</b> Fermée<br><b>Capacité : </b>'+feature.properties.capacity+'<br><b>Velos disponibles : </b>'+feature.properties.available+'<br><b>Dernière maj : </b>'+feature.properties.last_update+'<br><br><a href="#" class="refresh"><i class="fa fa-refresh"></i> Rafraîchir</a>';
		}
		layer.bindPopup(popup);
	}
	mymap.on('popupopen', function(e) {
		$('.refresh').click(function() {
			if (typeof mymap !== "undefined") {mymap.off();mymap.remove(); }
			reloadMapContainer();
			generateMap();
		});
		if($('#checkbox2').prop("checked")){
			$.ajax({
				url : "modele/lienstations.php",
				type : "POST",
				data : "num=" + e.popup._source.feature.properties.id,
				dataType:"Json",
				success : function(data){
					var pointA = new L.LatLng(e.popup._source.feature.geometry.coordinates[1], e.popup._source.feature.geometry.coordinates[0]);
					var pointB = new L.LatLng(data[0][0], data[0][1]);
					var pointC = new L.LatLng(data[1][0], data[1][1]);
					var pointD = new L.LatLng(data[2][0], data[2][1]);
					var pointE = new L.LatLng(data[3][0], data[3][1]);
					var pointF = new L.LatLng(data[4][0], data[4][1]);
					var pointG = new L.LatLng(data[5][0], data[5][1]);
					var pointH = new L.LatLng(data[6][0], data[6][1]);
					var pointI = new L.LatLng(data[7][0], data[7][1]);
					var pointJ = new L.LatLng(data[8][0], data[8][1]);
					var pointK = new L.LatLng(data[9][0], data[9][1]);
					var pointList = [
						[pointA, pointB],
						[pointA, pointC],
						[pointA, pointD],
						[pointA, pointE],
						[pointA, pointF],
						[pointA, pointG],
						[pointA, pointH],
						[pointA, pointI],
						[pointA, pointJ],
						[pointA, pointK]
					];
					firstpolyline.setLatLngs(pointList);
					mymap.addLayer(firstpolyline);
				}
			});
		}
	});
				
	$('#checkbox2').change(function() {
		if(!this.checked) {
			firstpolyline.setLatLngs([]);
		}
	})

	function pointToLayerAll(feature, latlng) {
		return L.circleMarker(latlng, objMarkers.marker(feature));
	}
			
	function pointToLayerEmpty(feature, latlng) {
		if(feature.properties.statut==0 || feature.properties.available==0) {
			return L.circleMarker(latlng, objMarkers.marker(feature));
		}
	}
				
	function pointToLayerLow(feature, latlng) {
		if(feature.properties.statut!=0 && feature.properties.available!=0 && feature.properties.available<feature.properties.capacity/3) {
			return L.circleMarker(latlng, objMarkers.marker(feature));
		}
	}
				
	function pointToLayerMedium(feature, latlng) {
		if(feature.properties.statut!=0 && feature.properties.available>=feature.properties.capacity/3 && feature.properties.available<(feature.properties.capacity*(2/3))) {
			return L.circleMarker(latlng, objMarkers.marker(feature));
		}
	}
				
	function pointToLayerHigh(feature, latlng) {
		if(feature.properties.statut!=0 && feature.properties.available!=feature.properties.capacity && feature.properties.available>=(feature.properties.capacity*(2/3))) {
			return L.circleMarker(latlng, objMarkers.marker(feature));
		}
	}
		
	function pointToLayerFull(feature, latlng) {
		if(feature.properties.statut!=0 && feature.properties.available==feature.properties.capacity) {
			return L.circleMarker(latlng, objMarkers.marker(feature));
		}
	}
}

/* Génère les 6 cartes */
function generateMapStats(){
	var mapboxAttribution = 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>';
	var mapboxUrl = 'https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiZmxvZG9uIiwiYSI6ImNqODdnZW9yMDB3Y2cycW1qaWI0NG5vZWQifQ.1RvHn1sbWz9_v6uzEZDLTA';
    var streets = L.tileLayer(mapboxUrl, {id: 'mapbox.streets', attribution: mapboxAttribution});
	var streets2 = L.tileLayer(mapboxUrl, {id: 'mapbox.streets', attribution: mapboxAttribution});
	var streets3 = L.tileLayer(mapboxUrl, {id: 'mapbox.streets', attribution: mapboxAttribution});
	var streets4 = L.tileLayer(mapboxUrl, {id: 'mapbox.streets', attribution: mapboxAttribution});
	var streets5 = L.tileLayer(mapboxUrl, {id: 'mapbox.streets', attribution: mapboxAttribution});
	var streets6 = L.tileLayer(mapboxUrl, {id: 'mapbox.streets', attribution: mapboxAttribution});
	
	var objMarkers = {
		util1marker: function(i){return {radius: getSize(i.properties.util1),fillColor: getColor(i.properties.partof1), color: getColor(i.properties.partof1),weight: 1,opacity: 1,fillOpacity: 1}},
		util2marker: function(i){return {radius: getSize(i.properties.util2),fillColor: getColor(i.properties.partof2), color: getColor(i.properties.partof2),weight: 1,opacity: 1,fillOpacity: 1}},
		util3marker: function(i){return {radius: getSize(i.properties.util3),fillColor: getColor(i.properties.partof3), color: getColor(i.properties.partof3),weight: 1,opacity: 1,fillOpacity: 1}},
		util4marker: function(i){return {radius: getSize(i.properties.util4),fillColor: getColor(i.properties.partof4), color: getColor(i.properties.partof4),weight: 1,opacity: 1,fillOpacity: 1}},
		util5marker: function(i){return {radius: getSize(i.properties.util5),fillColor: getColor(i.properties.partof5), color: getColor(i.properties.partof5),weight: 1,opacity: 1,fillOpacity: 1}},
		util6marker: function(i){return {radius: getSize(i.properties.util6),fillColor: getColor(i.properties.partof6), color: getColor(i.properties.partof6),weight: 1,opacity: 1,fillOpacity: 1}},
		util7marker: function(i){return {radius: getSize(i.properties.util7),fillColor: getColor(i.properties.partof7), color: getColor(i.properties.partof7),weight: 1,opacity: 1,fillOpacity: 1}}
	}

	var objGeoLayer = {
		geoLayerGrp1: L.geoJson(false,{onEachFeature: onEachFeatureClosure(1,'feature.properties.partof1'),pointToLayer: pointToLayerClosure('objMarkers.util1marker(feature)')}),
		geoLayerGrp2: L.geoJson(false,{onEachFeature: onEachFeatureClosure(2,'feature.properties.partof2'),pointToLayer: pointToLayerClosure('objMarkers.util2marker(feature)')}),
		geoLayerGrp3: L.geoJson(false,{onEachFeature: onEachFeatureClosure(3,'feature.properties.partof3'),pointToLayer: pointToLayerClosure('objMarkers.util3marker(feature)')}),
		geoLayerGrp4: L.geoJson(false,{onEachFeature: onEachFeatureClosure(4,'feature.properties.partof4'),pointToLayer: pointToLayerClosure('objMarkers.util4marker(feature)')}),
		geoLayerGrp5: L.geoJson(false,{onEachFeature: onEachFeatureClosure(5,'feature.properties.partof5'),pointToLayer: pointToLayerClosure('objMarkers.util5marker(feature)')}),
		geoLayerGrp6: L.geoJson(false,{onEachFeature: onEachFeatureClosure(6,'feature.properties.partof6'),pointToLayer: pointToLayerClosure('objMarkers.util6marker(feature)')})
	}

	function getSize(d) {
		return d > 10 ? 15 :
			d > 9 ? 14 :
				d > 8 ? 13 :
					d > 7 ? 12 :
						d > 6 ? 11 :
							d > 5 ? 10 :
								d > 4 ? 9 :
									d > 3 ? 8 :
										d > 2 ? 7 :
											d > 1 ? 6 :
												d > 0.5 ? 5 :
													d > 0 ? 4 :
														0;
	}
	function getColor(d) {
		return d > 50 ? '#00FF00' :
			d > 40 ? '#47FF00' :
				d > 30 ? '#7CFF00' :
					d > 20 ? '#B0FF00' :
						d > 10 ? '#E5FF00' :
							d > 8 ? '#FFE400' :
								d > 6 ? '#FFAF00' :
									d > 4 ? '#FF7B00' :
										d > 3 ? '#FF5700' :
											d > 2 ? '#FF4600' :
												d > 1 ? '#FF3400' :
													d > 0 ? '#FF2300' :
														'#FF0000';
	}
	
	function onEachFeatureClosure(num,str){
		return function onEachFeatureGrp(feature, layer) {
			var popup = '';
			popup = '<b>Nom : '+feature.properties.name+'</b><br><b>Appartenance grp '+num+': </b>'+eval(str)+' %';
			layer.bindPopup(popup);
		}
	}
	
	function pointToLayerClosure(str){
		return function pointToLayerGrp1(feature, latlng) {
			return L.circleMarker(latlng, eval(str));
		}
	}
	
	$.ajax({
		dataType: "json",
		url: "data/groupestations.geojson",
		success: function(data) {
			objGeoLayer.geoLayerGrp1.addData(data);
			objGeoLayer.geoLayerGrp2.addData(data);
			objGeoLayer.geoLayerGrp3.addData(data);
			objGeoLayer.geoLayerGrp4.addData(data);
			objGeoLayer.geoLayerGrp5.addData(data);
			objGeoLayer.geoLayerGrp6.addData(data);
		}
	});
	
	bounds = new L.LatLngBounds(new L.LatLng(45.60, 5.10), new L.LatLng(45.91, 4.62));
	var objMaps = {
		mymap1: L.map('mapgroupe1', {center: bounds.getCenter(),zoom: 12,minZoom: 11,maxBounds: bounds,maxBoundsViscosity: 0.8,layers: [streets,objGeoLayer.geoLayerGrp1]}),
		mymap2: L.map('mapgroupe2', {center: bounds.getCenter(),zoom: 12,minZoom: 11,maxBounds: bounds,maxBoundsViscosity: 0.8,layers: [streets2,objGeoLayer.geoLayerGrp2]}),
		mymap3: L.map('mapgroupe3', {center: bounds.getCenter(),zoom: 12,minZoom: 11,maxBounds: bounds,maxBoundsViscosity: 0.8,layers: [streets3,objGeoLayer.geoLayerGrp3]}),
		mymap4: L.map('mapgroupe4', {center: bounds.getCenter(),zoom: 12,minZoom: 11,maxBounds: bounds,maxBoundsViscosity: 0.8,layers: [streets4,objGeoLayer.geoLayerGrp4]}),
		mymap5: L.map('mapgroupe5', {center: bounds.getCenter(),zoom: 12,minZoom: 11,maxBounds: bounds,maxBoundsViscosity: 0.8,layers: [streets5,objGeoLayer.geoLayerGrp5]}),
		mymap6: L.map('mapgroupe6', {center: bounds.getCenter(),zoom: 12,minZoom: 11,maxBounds: bounds,maxBoundsViscosity: 0.8,layers: [streets6,objGeoLayer.geoLayerGrp6]})
	}
	
	for (var prop in objMaps){
		objMaps[prop].addControl(new L.Control.Fullscreen());
	}
}

function charger(){
	$.ajax({
		type: "GET",
		url : "index.php?page=controleur/traitement.php",
		success : function(){
			if($('.load-delay').length !== 0) {
				reloadMapContainer();
				generateMap();
			}
		}
	});
    setTimeout(charger,300000);
}

/* Lance la génération du GeoJson et de la carte si l'on est sur la page de la carte */
if(window.location.href.indexOf("carte") > -1) {
    charger();
}
/* Lance la génération des cartes si l'on est sur la page des statistiques */
if(window.location.href.indexOf("statistiques") > -1) {
    reloadMapStats();
    generateMapStats();
}

function cancel(){
	$('.coordonnees, #livalidation').remove();
}
function fermertrajet(){
	$('#trajetitineraire').remove();
}
/* Récupère les données et génère le DOM pour les itinéraires */
function coorToObject(){
	var x1= $('input[name=x1]').val();
	var	y1= $('input[name=y1]').val();
	var	x2= $('input[name=x2]').val();
	var	y2= $('input[name=y2]').val();

	$('.coordonnees, #livalidation').remove();
	$('#listetools').append("<li id=\"loadingtrajet\"><img src=\"vue/loadingFull.gif\" style=\"max-width:100%;\"/></li>"); 
	$.ajax({
		type: "POST",
		url : "modele/trajet.php",
		data : "x1=" + x1 + "&y1=" + y1 + "&x2=" + x2 + "&y2=" + y2,
		success : function(data){
			$('#loadingtrajet').remove();
			$('#listetools').append("<li id=\"trajetitineraire\"><a>" + data + "</a></li>");
		}
	});
}

/* Filtre pour la version 'data' des informations sur les stations */
function filtre() 
{
	var input, filter, table, tr,td0, td1,td2,td3,td4, i;
	input = document.getElementById("searchinput");
	filter = input.value.toUpperCase();
	table = document.getElementById("tableau");
	tr = table.getElementsByTagName("tr");
	for (i = 0; i < tr.length; i++) {
		td0 = tr[i].getElementsByTagName("td")[0];
		td1 = tr[i].getElementsByTagName("td")[1];
		td2 = tr[i].getElementsByTagName("td")[2];
		td3 = tr[i].getElementsByTagName("td")[3];
		td4 = tr[i].getElementsByTagName("td")[4];
		if (td0 || td1 || td2 || td3 || td4) {
			if ((td0.innerHTML.toUpperCase().indexOf(filter) > -1) || (td1.innerHTML.toUpperCase().indexOf(filter) > -1) || (td2.innerHTML.toUpperCase().indexOf(filter) > -1) || 
			(td3.innerHTML.toUpperCase().indexOf(filter) > -1) || (td4.innerHTML.toUpperCase().indexOf(filter) > -1)){
				tr[i].style.display = "";
			} else {
				tr[i].style.display = "none";
			}
		}       
	}
}