$(document).ready(function() {
	$('#buildgeo').click(function(){
		$.ajax({
			type: "GET",
			url : "index.php?page=controleur/traitement.php",
			success : function(){
				setTimeout(function(){
					if (typeof mymap !== "undefined") {mymap.off();mymap.remove(); }
					reloadMapContainer();
					generateMap();
				},100);
			}
		});
	})
	$('#newtab').click(function(){
		window.open("controleur/cartefull.php");
	})
	$('#checkbox1').change(function() {
		if(this.checked) {
			reloadMapContainer();
			generateMap();
			$('#lisearch').remove();
		}else{
			$.ajax({
				type: "GET",
				url : "tableau.php",
				success : function(data){
					document.getElementById("map").innerHTML = "";
					$('#listetools').append("<li id=\"lisearch\"><a><input id=\"searchinput\" style=\"background-image: url('vue/search_icon.png');background-position: 5% 50%;background-repeat: no-repeat;padding-left: 20%;border-radius: 10px;\" type=\"text\" id=\"myInput\" placeholder=\"Recherche...\" class=\"form-control\" onkeyup=\"filtre()\"></a></li>");
					$('#map').append(data);
				}
			});
		}
	})
	$('#newitineraire').click(function() {
		if($('input[name=x1]').get(0) == null){
			$('#listetools').append("<li class=\"coordonnees\"><a> X :<input type=\"text\" name=\"x1\" style=\"float:right\"></a><a>Y :<input type=\"text\" name=\"y1\" style=\"float:right\"></a></li>");
			$('#listetools').append("<li class=\"coordonnees\"><a> X :<input type=\"text\" name=\"x2\" style=\"float:right\"></a><a>Y :<input type=\"text\" name=\"y2\" style=\"float:right\"></a></li>");
		}
	})
	
	
	var getGif = function() {
		var gif = [];
		
		$('#archives img').each(function() {
			var data = $(this).data('alt');
			gif.push(data);
		});

		return gif;
	}
	
	var gif = getGif();

	
	// Preload les gif pour que ce soit instantané.

	var image = [];
	
	$.each(gif, function(index) {
		image[index]     = new Image();
		image[index].src = gif[index];
	});
	
	// Changer les images en gif et vice versa.

	$('figure').on('click', function() {
		
		var $this   = $(this),
		
		$index  = $this.index(),
		$img    = $this.children('img'),
		$imgSrc = $img.attr('src'),
		$imgAlt = $img.attr('data-alt'),
		$imgExt = $imgAlt.split('.');
		
		if($imgExt[1] === 'gif') {
			$img.attr('src', $img.data('alt')).attr('data-alt', $imgSrc);
		} else {
			$img.attr('src', $imgAlt).attr('data-alt', $img.data('alt'));
		}
	});
	
	    $('#carte .navbar-toggle').click(function () {
        $('#carte .navbar-nav').toggleClass('slide-in');
        $('#carte .side-body').toggleClass('body-slide-in');

        $('.absolute-wrapper').toggleClass('slide-in');
        
	});
});

function filtre() 
{
	var input, filter, table, tr, td, i;
	input = document.getElementById("searchinput");
	filter = input.value.toUpperCase();
	table = document.getElementById("tableau");
	tr = table.getElementsByTagName("tr");
	for (i = 0; i < tr.length; i++) {
		td0 = tr[i].getElementsByTagName("td")[0];
		td = tr[i].getElementsByTagName("td")[1];
		td2 = tr[i].getElementsByTagName("td")[2];
		td3 = tr[i].getElementsByTagName("td")[3];
		if (td0 || td || td2 || td3) {
			if ((td0.innerHTML.toUpperCase().indexOf(filter) > -1) || (td.innerHTML.toUpperCase().indexOf(filter) > -1) || (td2.innerHTML.toUpperCase().indexOf(filter) > -1) || (td3.innerHTML.toUpperCase().indexOf(filter) > -1)){
				tr[i].style.display = "";
			} else {
				tr[i].style.display = "none";
			}
		}       
	}
}

function charger(){

    setTimeout( function(){

        $.ajax({
            url : "index.php?page=controleur/traitement.php",
            type : "GET",
			success : function(){
				setTimeout(function(){
					if (typeof mymap !== "undefined") {mymap.off();mymap.remove(); }
					reloadMapContainer();
					generateMap();
				},100);
			}			
        });
		
		charger();
	}, 300000);
}

charger();

function cancel(){
	$('.coordonnees, #livalidation').remove();
}
function coorToObject(){
	var obj = {
		x1: $('input[name=x1]').val(),
		y1: $('input[name=y1]').val(),
		x2: $('input[name=x2]').val(),
		y2: $('input[name=y2]').val()
	}
	$('.coordonnees, #livalidation').remove();
	return obj;
}

function reloadMapContainer(){
	document.getElementById('map').innerHTML = "<div id='mapid' style='max-width: 100%; height: calc(100vh - 100px); position: relative; box-shadow: 10px 10px 5px grey;'></div>";
}
function reloadMapStats(){
	document.getElementById('groupe1').innerHTML = "<div id='mapgroupe1' style='max-width: 100%; height: 300px; position: relative; box-shadow: 10px 10px 5px grey;'></div>";
	document.getElementById('groupe2').innerHTML = "<div id='mapgroupe2' style='max-width: 100%; height: 300px; position: relative; box-shadow: 10px 10px 5px grey;'></div>";
	document.getElementById('groupe3').innerHTML = "<div id='mapgroupe3' style='max-width: 100%; height: 300px; position: relative; box-shadow: 10px 10px 5px grey;'></div>";
	document.getElementById('groupe4').innerHTML = "<div id='mapgroupe4' style='max-width: 100%; height: 300px; position: relative; box-shadow: 10px 10px 5px grey;'></div>";
	document.getElementById('groupe5').innerHTML = "<div id='mapgroupe5' style='max-width: 100%; height: 300px; position: relative; box-shadow: 10px 10px 5px grey;'></div>";
	document.getElementById('groupe6').innerHTML = "<div id='mapgroupe6' style='max-width: 100%; height: 300px; position: relative; box-shadow: 10px 10px 5px grey;'></div>";
}

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
		return d > 10 ? 15:
			   d > 9  ? 14:
			   d > 8  ? 13:
			   d > 7  ? 12:
			   d > 6  ? 11:
			   d > 5  ? 10:
			   d > 4  ? 9:
			   d > 3  ? 8:
			   d > 2  ? 7:
			   d > 1  ? 6:
			   d > 0.5 ? 5:
			   d > 0   ? 4:
						  0;
	}
	function getColor(d) {
		return d > 50 ? '#00FF00':
			   d > 40 ? '#47FF00':
			   d > 30 ? '#7CFF00':
			   d > 20 ? '#B0FF00':
			   d > 10 ? '#E5FF00':
			   d > 8  ? '#FFE400':
			   d > 6  ? '#FFAF00':
			   d > 4  ? '#FF7B00':
			   d > 3  ? '#FF5700':
			   d > 2  ? '#FF4600':
			   d > 1  ? '#FF3400':
			   d > 0  ? '#FF2300':
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
		cache: false,
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
	
	var objMaps = {
		mymap1: L.map('mapgroupe1', {center: [45.755, 4.845],zoom: 12,layers: [streets,objGeoLayer.geoLayerGrp1]}),
		mymap2: L.map('mapgroupe2', {center: [45.755, 4.845],zoom: 12,layers: [streets2,objGeoLayer.geoLayerGrp2]}),
		mymap3: L.map('mapgroupe3', {center: [45.755, 4.845],zoom: 12,layers: [streets3,objGeoLayer.geoLayerGrp3]}),
		mymap4: L.map('mapgroupe4', {center: [45.755, 4.845],zoom: 12,layers: [streets4,objGeoLayer.geoLayerGrp4]}),
		mymap5: L.map('mapgroupe5', {center: [45.755, 4.845],zoom: 12,layers: [streets5,objGeoLayer.geoLayerGrp5]}),
		mymap6: L.map('mapgroupe6', {center: [45.755, 4.845],zoom: 12,layers: [streets6,objGeoLayer.geoLayerGrp6]})
	}
	
	for (var prop in objMaps){
		objMaps[prop].addControl(new L.Control.Fullscreen());
	}
}

function generateMap(){
	
	var objGeoLayer = {
		geoLayerAll: L.geoJson(false,{onEachFeature: onEachFeature,pointToLayer: pointToLayerAll}),
		geoLayerEmpty: L.geoJson(false,{onEachFeature: onEachFeature,pointToLayer: pointToLayerEmpty}),
		geoLayerLow: L.geoJson(false,{onEachFeature: onEachFeature,pointToLayer: pointToLayerLow}),
		geoLayerMedium: L.geoJson(false,{onEachFeature: onEachFeature,pointToLayer: pointToLayerMedium}),
		geoLayerHigh: L.geoJson(false,{onEachFeature: onEachFeature,pointToLayer: pointToLayerHigh}),
		geoLayerFull: L.geoJson(false,{onEachFeature: onEachFeature,pointToLayer: pointToLayerFull})
	}
	
	$.ajax({
		dataType: "json",
		cache: false,
		url: "data/datatest.geojson",
		success: function(data) {
			objGeoLayer.geoLayerAll.addData(data);
			objGeoLayer.geoLayerEmpty.addData(data);
			objGeoLayer.geoLayerLow.addData(data);
			objGeoLayer.geoLayerMedium.addData(data);
			objGeoLayer.geoLayerHigh.addData(data);
			objGeoLayer.geoLayerFull.addData(data);
		}
	});
		
	var mapboxAttribution = 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>';
	var mapboxUrl = 'https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiZmxvZG9uIiwiYSI6ImNqODdnZW9yMDB3Y2cycW1qaWI0NG5vZWQifQ.1RvHn1sbWz9_v6uzEZDLTA';
	var light = L.tileLayer(mapboxUrl, {id: 'mapbox.light', attribution: mapboxAttribution});
    var streets = L.tileLayer(mapboxUrl, {id: 'mapbox.streets', attribution: mapboxAttribution});
	var dark = L.tileLayer(mapboxUrl, {id: 'mapbox.dark', attribution: mapboxAttribution});
	var satellite = L.tileLayer(mapboxUrl, {id: 'mapbox.satellite', attribution: mapboxAttribution});
	
	var objMarkers = {
		darkRedMarker: {radius: 8,fillColor: "#800000",color: "#800000",weight: 1,opacity: 1,fillOpacity: 1},
		redMarker: {radius: 8,fillColor: "#ff0000",color: "#ff0000",weight: 1,opacity: 1,fillOpacity: 1},
		greenMarker: {radius: 8,fillColor: "#00FF00",color: "#00FF00",weight: 1,opacity: 1,fillOpacity: 1},
		darkGreenMarker: {radius: 8,fillColor: "#0e4b20",color: "#0e4b20",weight: 1,opacity: 1,fillOpacity: 1},
		orangeMarker: {radius: 8,fillColor: "#FFA500",color: "#FFA500",weight: 1,opacity: 1,fillOpacity: 1},
		greyMarker: {radius: 8,fillColor: "#A9A9A9",color: "#A9A9A9",weight: 1,opacity: 1,fillOpacity: 1}
	}

	var mymap = L.map('mapid', {
		center: [45.76, 4.85],
		zoom: 13,
		layers: [streets,objGeoLayer.geoLayerAll]
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
		exclusive       	: false,
		collapsed : true
	};
	
	mymap.addControl(new L.Control.Fullscreen());
	
	mymap.addControl(new L.Control.styledLayerControl(baseLayers,overlay,options));

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
			$.ajax({
				url : "index.php?page=controleur/refresh.php",
				type : "POST",
				cache: false,
				data : "id=" + e.popup._source.feature.properties.id,
				success : function(){
					setTimeout(function(){
						if (typeof mymap !== "undefined") {mymap.off();mymap.remove(); }
						reloadMapContainer();
						generateMap();
					},100);
				}
			});
		});
	});
	
	function pointToLayerAll(feature, latlng) {
		if(feature.properties.statut==0){
			return L.circleMarker(latlng, objMarkers.greyMarker);
		}else if (feature.properties.available!=feature.properties.capacity){
			if(feature.properties.available==0){
				return L.circleMarker(latlng, objMarkers.darkRedMarker);
			}else if(feature.properties.available<feature.properties.capacity/3) {
				return L.circleMarker(latlng, objMarkers.redMarker);
			}else if(feature.properties.available<(feature.properties.capacity*(2/3))){
				return L.circleMarker(latlng, objMarkers.orangeMarker);
			}else{
				return L.circleMarker(latlng, objMarkers.greenMarker);
			}
		}else {
			return L.circleMarker(latlng, objMarkers.darkGreenMarker);
		}
	}	
	
	function pointToLayerEmpty(feature, latlng) {
		if(feature.properties.statut==0){
			return L.circleMarker(latlng, objMarkers.greyMarker);
		}else if (feature.properties.available==0) {
			return L.circleMarker(latlng, objMarkers.darkRedMarker);
		}
	}
	
	function pointToLayerLow(feature, latlng) {
		if(feature.properties.statut!=0 && feature.properties.available!=0 && feature.properties.available<feature.properties.capacity/3) {
			return L.circleMarker(latlng, objMarkers.redMarker);
		}
	}	
	
	function pointToLayerMedium(feature, latlng) {
		if(feature.properties.statut!=0 && feature.properties.available>=feature.properties.capacity/3 && feature.properties.available<(feature.properties.capacity*(2/3))) {
			return L.circleMarker(latlng, objMarkers.orangeMarker);
		}
	}
	
	function pointToLayerHigh(feature, latlng) {
		if(feature.properties.statut!=0 && feature.properties.available!=feature.properties.capacity && feature.properties.available>=(feature.properties.capacity*(2/3))) {
			return L.circleMarker(latlng, objMarkers.greenMarker);
		}
	}
	
	function pointToLayerFull(feature, latlng) {
		if(feature.properties.statut!=0 && feature.properties.available==feature.properties.capacity) {
			return L.circleMarker(latlng, objMarkers.darkGreenMarker);
		}
	}
}

/// **************************
/// ******* Graphes **********
/// **************************

function newSimpleLineGraph(data,xLabel,yLabel){
    /*These lines are all chart setup.  Pick and choose which chart features you want to utilize. */
    //data est un tableau d'objet obtenu par transformForGraph
        var chart;
    console.log(data);
    nv.addGraph(function() {
        chart = nv.models.lineChart()

            .options({
                duration: 300,
                useInteractiveGuideline: true,
            })


        ;
        // chart sub-models (ie. xAxis, yAxis, etc) when accessed directly, return themselves, not the parent chart, so need to chain separately
        chart.xAxis
            .axisLabel(xLabel)
            .tickFormat(d3.format(',.1f'))
            .staggerLabels(true)
        ;
        chart.yAxis
            .axisLabel(yLabel)
            .tickFormat(function(d) {
                if (d == null) {
                    return 'N/A';
                }
                return d3.format(',.2f')(d);
            })
        ;

        d3.select('#chart1 ').append('svg')
            .attr('height', 600)
            .datum(data)
            .call(chart);
        nv.utils.windowResize(chart.update);
        return chart;
    });
}

    function sinAndCos() {
        var sin = [],
            sin2 = [],
            cos = [],
            rand = [],
            rand2 = []
            ;
        for (var i = 0; i < 100; i++) {
            sin.push({x: i, y: i % 10 == 5 ? null : Math.sin(i/10) }); //the nulls are to show how defined works
            sin2.push({x: i, y: Math.sin(i/5) * 0.4 - 0.25});
            cos.push({x: i, y: .5 * Math.cos(i/10)});
            rand.push({x:i, y: Math.random() / 10});
            rand2.push({x: i, y: Math.cos(i/10) + Math.random() / 10 })
        }
        return [
            transformForGraph(sin,"Sine Wave","#ff7f0e"),
            transformForGraph(cos,"Cosine Wave","#2ca02c"),
            transformForGraph(rand,"Random Points","#2222ff"),
            transformForGraph(rand2,"Random Cosine","#667711"),
            transformForGraph(sin2,"Fill opacity","#EF9CFB")
            ]
    }

// permet de passer des data sous format d'affichage pour les graphe
function transformForGraph (data, key , color){

    //data : les données sous la forme {x,y} (tableau d'objet)
    //key : le nom donné pour l'affichage
    //color : couleur des données pour l'affichage
    console.log(data);
    
    var data1 = Object.values(data);

    //console.log(data1);console.log(data);
    var data2=[];
    var i = 0;
    /*for (var i = 0; i < 168; i++) {
        data2.push({x: i, y: data1[i]});

        }
    */
    data1.forEach(function(){
        data2.push({x: i, y: data1[i]})
        i++;
    });
    //console.log(data2);
    return {
            values : data2,
            key : key,
            color : color
    }

}

function pieChart(data)
{
    var testdata = [
        {key: "One", y: 5},
        {key: "Two", y: 2},
        {key: "Three", y: 9},
        {key: "Four", y: 7},
        {key: "Five", y: 4},
        {key: "Six", y: 3},
        {key: "Seven", y: 0.5}
    ];
    var height = 150;
    var width = 150;
    var chart1;

    nv.addGraph(function() {
        var chart1 = nv.models.pieChart()
            .x(function(d) { return d.key })
            .y(function(d) { return d.y })
            .donut(true)
            .width(width)
            .height(height)
            .padAngle(.08)
            .cornerRadius(5)
        .showLegend(false)
            .id('donut1'); // allow custom CSS for this one svg


        chart1.pie.labelsOutside(true).donut(true);
        d3.select("#test1")
            .datum(data)

            .attr('height',150)
            .attr('width',150)
            .transition().duration(120)
            .call(chart1);
        // LISTEN TO WINDOW RESIZE
        nv.utils.windowResize(chart1.update);
        // LISTEN TO CLICK EVENTS ON SLICES OF THE PIE/DONUT
         chart1.pie.dispatch.on('elementClick', function(e) {
            
             console.log(e.data.key);
            document.location.href="index.php?page=controleur/graphes.php&station=" + e.data.key;
    
         });
        // chart.pie.dispatch.on('chartClick', function() {
        //     code...
        // });
        // LISTEN TO DOUBLECLICK EVENTS ON SLICES OF THE PIE/DONUT
        // chart.pie.dispatch.on('elementDblClick', function() {
        //     code...
        // });
        // LISTEN TO THE renderEnd EVENT OF THE PIE/DONUT
        // chart.pie.dispatch.on('renderEnd', function() {
        //     code...
        // });
        // OTHER EVENTS DISPATCHED BY THE PIE INCLUDE: elementMouseover, elementMouseout, elementMousemove
        // @see nv.models.pie

        return chart1;
    });
}

function semiPieChart(){
    var testdata = [
        {key: "One", y: 5},
        {key: "Two", y: 2},
        {key: "Three", y: 9},
        {key: "Four", y: 7},
        {key: "Five", y: 4},
        {key: "Six", y: 3},
        {key: "Seven", y: 0.5}
    ];
    var height = 200;
    var width = 200;
    var chart2;
    nv.addGraph(function() {
        var chart2 = nv.models.pieChart()
            .x(function(d) { return d.key })
            .y(function(d) { return d.y })
            //.labelThreshold(.08)
            .showLabels(false)
            .color(d3.scale.category20().range().slice(10))
            .width(width)
            .height(height)
            .donut(true)
            .id('donut2')
            .titleOffset(-30)
            .title("woot");
        // MAKES IT HALF CIRCLE
        chart2.pie
            .startAngle(function(d) { return d.startAngle/2 -Math.PI/2 })
            .endAngle(function(d) { return d.endAngle/2 -Math.PI/2 });
        d3.select("#test2")
            //.datum(historicalBarChart)
            .datum(testdata)
            .transition().duration(1200)
            .call(chart2);
        nv.utils.windowResize(chart2.update);
        return chart2;
    });
}

function TransformForPie(data){

    var data1 = Object.values(data);
    var data3 = Object.keys(data);
   
    var data2=[];
    var i = 0;


    data1.forEach(function(){
        data2.push({key: data3[i], y: data1[i]})
        i++;
    });
   
    data2.sort(function (a, b) {
  return b.y - a.y;});
    

    var res =[];
    for (i=0 ; i<10;i++){
        res.push(data2[i]);
    }
    
    return res;
}

function getArrond(e){
    if(e.length == 5 && e[0] !=0 )
        return e.slice(0,2);
    if(e.length == 5 && e[0] ==0 )
        return e[1];
    else if(e.length==4)
        return e[0];
    else return -1;
}

