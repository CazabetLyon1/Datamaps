<?php

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

/*$myfile2 = fopen("data/groupestations.geojson", "w") or die("Unable to open file!");
$txt = "{\"type\": \"FeatureCollection\",\"features\": [\n";

foreach($MesStationsVelov2->getListeStations() as $key => $i){	
	if($key == (count($MesStationsVelov2->getListeStations()))-1) {
		$txt = $txt . "{\"type\": \"Feature\",\"properties\": {\"id\":" . "".$MesStationsVelov2->getAttribut($i,"numero")."," . "\"name\":" . "\"".$MesStationsVelov2->getAttribut($i,"nom")."\"," . "\"partof1\":" . "".$MesStationsVelov2->getAppartenanceGroupe($i,0)."," . "\"util1\":" . "".$MesStationsVelov2->getUtilisation($i,0)."," . "\"partof2\":" . "".$MesStationsVelov2->getAppartenanceGroupe($i,1)."," . "\"util2\":" . "".$MesStationsVelov2->getUtilisation($i,1)."," . "\"partof3\":" . "".$MesStationsVelov2->getAppartenanceGroupe($i,2)."," . "\"util3\":" . "".$MesStationsVelov2->getUtilisation($i,2)."," . "\"partof4\":" . "".$MesStationsVelov2->getAppartenanceGroupe($i,3)."," . "\"util4\":" . "".$MesStationsVelov2->getUtilisation($i,3)."," . "\"partof5\":" . "".$MesStationsVelov2->getAppartenanceGroupe($i,4)."," . "\"util5\":" . "".$MesStationsVelov2->getUtilisation($i,4)."," . "\"partof6\":" . "".$MesStationsVelov2->getAppartenanceGroupe($i,5)."," . "\"util6\":" . "".$MesStationsVelov2->getUtilisation($i,5)."" . "},\"geometry\": {\"type\": \"Point\",\"coordinates\":[" .$MesStationsVelov2->getAttribut($i,"y"). "," .$MesStationsVelov2->getAttribut($i,"x"). "]}}\n";
	}
	else{
		$txt = $txt . "{\"type\": \"Feature\",\"properties\": {\"id\":" . "".$MesStationsVelov2->getAttribut($i,"numero")."," . "\"name\":" . "\"".$MesStationsVelov2->getAttribut($i,"nom")."\"," . "\"partof1\":" . "".$MesStationsVelov2->getAppartenanceGroupe($i,0)."," . "\"util1\":" . "".$MesStationsVelov2->getUtilisation($i,0)."," . "\"partof2\":" . "".$MesStationsVelov2->getAppartenanceGroupe($i,1)."," . "\"util2\":" . "".$MesStationsVelov2->getUtilisation($i,1)."," . "\"partof3\":" . "".$MesStationsVelov2->getAppartenanceGroupe($i,2)."," . "\"util3\":" . "".$MesStationsVelov2->getUtilisation($i,2)."," . "\"partof4\":" . "".$MesStationsVelov2->getAppartenanceGroupe($i,3)."," . "\"util4\":" . "".$MesStationsVelov2->getUtilisation($i,3)."," . "\"partof5\":" . "".$MesStationsVelov2->getAppartenanceGroupe($i,4)."," . "\"util5\":" . "".$MesStationsVelov2->getUtilisation($i,4)."," . "\"partof6\":" . "".$MesStationsVelov2->getAppartenanceGroupe($i,5)."," . "\"util6\":" . "".$MesStationsVelov2->getUtilisation($i,5)."" . "},\"geometry\": {\"type\": \"Point\",\"coordinates\":[" .$MesStationsVelov2->getAttribut($i,"y"). "," .$MesStationsVelov2->getAttribut($i,"x"). "]}},\n";
	}
}

$txt = $txt . ']}';
fwrite($myfile2, $txt);
fclose($myfile2);*/
?>