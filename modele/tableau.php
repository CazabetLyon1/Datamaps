<?php

    /* Génère le DOM pour la version 'données' des stations */

    include('Liste_stations.php');
    $MesStationsVelov = new ListeStations ();

    $final = null;
    $final .= "<div class=\"table-responsive\" style=\"background: url(vue/bggreen.jpg);height: calc(100vh - 100px);overflow-y: scroll\"><table id=\"tableau\" class=\"table table-bordered table-striped table-hover\">
    <thead><tr><th>Nom de la station</th><th>Capacité</th><th>Places libres</th><th>Vélos disponibles</th><th>Dernière maj</th></tr></thead><tbody>";

    foreach($MesStationsVelov->getListeStations() as $key => $i){
        $final = $final . "<tr><td>" . $MesStationsVelov->getAttribut($i,"nom") . "</td><td>" . $MesStationsVelov->getAttribut($i,"points_attache") . "</td><td>"
        . $MesStationsVelov->getAttribut($i,"points_attache_disponibles"). "</td><td>" . $MesStationsVelov->getAttribut($i,"velos") . "</td><td>" . $MesStationsVelov->getAttribut($i,"moment") . "</td></tr>";
    }

    $final = $final . "</tbody></table></div>";
    echo $final;
?>