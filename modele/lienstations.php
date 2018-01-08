<?php

include('Statistiques_Stations.php');
include('Liste_stations.php');
$MesStationsVelov = new ListeStations ();
$MesStationsVelovStats = new Statistiques_stations ();

if(isset($_POST['num'])){
    header('Content-Type: application/json');
    $j=0;
    foreach(json_decode($MesStationsVelovStats->getRelations($_POST['num'])) as $key => $i){
        if($j<10){
            $table[]=array($MesStationsVelov->getAttribut($key,"x"),$MesStationsVelov->getAttribut($key,"y"));
        }
        $j=$j+1;
    }
    echo json_encode($table);
}

?>