<?php

$MesStationsVelov->actualiserStation($_POST['id']);

$myfile = fopen("data/datatest.geojson", "w") or die("Unable to open file!");
$txt = "{\"type\": \"FeatureCollection\",\"features\": [\n";

foreach($MesStationsVelov->getListeStations() as $key => $i){
	if($key == (count($MesStationsVelov->getListeStations()))-1) {
		$txt = $txt . "{\"type\": \"Feature\",\"properties\": {\"id\":" . "".$MesStationsVelov->getAttribut($i,"numero")."," . "\"name\":" . "\"".$MesStationsVelov->getAttribut($i,"nom")."\"," . "\"capacity\":" . "".$MesStationsVelov->getAttribut($i,"points_attache")."," . "\"available\":" . "".$MesStationsVelov->getAttribut($i,"velos")."," . "\"statut\":" . "".$MesStationsVelov->getAttribut($i,"statut")."," . "\"last_update\":" . "\"".$MesStationsVelov->getAttribut($i,"moment")."\"" . "},\"geometry\": {\"type\": \"Point\",\"coordinates\":[" .$MesStationsVelov->getAttribut($i,"y"). "," .$MesStationsVelov->getAttribut($i,"x"). "]}}\n";
	}
	else{
		$txt = $txt . "{\"type\": \"Feature\",\"properties\": {\"id\":" . "".$MesStationsVelov->getAttribut($i,"numero")."," . "\"name\":" . "\"".$MesStationsVelov->getAttribut($i,"nom")."\"," . "\"capacity\":" . "".$MesStationsVelov->getAttribut($i,"points_attache")."," . "\"available\":" . "".$MesStationsVelov->getAttribut($i,"velos")."," . "\"statut\":" . "".$MesStationsVelov->getAttribut($i,"statut")."," . "\"last_update\":" . "\"".$MesStationsVelov->getAttribut($i,"moment")."\"" . "},\"geometry\": {\"type\": \"Point\",\"coordinates\":[" .$MesStationsVelov->getAttribut($i,"y"). "," .$MesStationsVelov->getAttribut($i,"x"). "]}},\n";
	}
}

$txt = $txt . ']}';
fwrite($myfile, $txt);
fclose($myfile);
?>