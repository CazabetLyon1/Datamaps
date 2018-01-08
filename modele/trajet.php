<?php
    /* Génération du DOM pour l'outil itinéraire */

    include('Liste_stations.php');
    $MesStationsVelov = new ListeStations ();

    if(isset($_POST['x1']) && isset($_POST['y1']) && isset($_POST['x2']) && isset($_POST['y2'])){
        $trajet = $MesStationsVelov->getTrajet($_POST['x1'],$_POST['y1'],$_POST['x2'],$_POST['y2']);
        $nom1 = $MesStationsVelov->getAttribut($trajet[0],"nom");
        $nom2 = $MesStationsVelov->getAttribut($trajet[1],"nom");
        echo '<h4>Station départ :</h4>'.$nom1.'<h4>Station arrivé :</h4>'.$nom2.'<h4>Distance à pied :</h4>'.round($trajet[2],2).' mètres<h4>Distance à vélo :</h4>'.round($trajet[3],2).
        ' mètres<br><br><button onclick="fermertrajet()">Fermer</button>';
    }

?>