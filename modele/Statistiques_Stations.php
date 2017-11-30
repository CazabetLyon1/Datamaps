<?php

/* Classe représentant les stations et permettant d'obtenir des statistiques dessus
    Ces statistiques sont des moyennes, et non pas du temps réel
    Version 2.0.1 du 15/11/17 par Luc GOMBERT */

// Ne pas oublier de définir le chemin vers le dossier où sont stockées les données
$CheminVersDossierData = "data/";
// Dossier des statistiques d'utilisation d'une station
$Utilisation = "utilisation/";
// Dossier des relations d'une station
$Relation = "relations/";
// Dossier des distances depuis une station
$Distance = "distances/";

class Statistiques_stations {
    
    private function transforme_tableau($MonObject) {
        return 0;
    }
    
    /************************************************************************************************************************************************/
    /*                                      Début de l'API (partie utile pour les développeurs graphiques)                                          */
    /************************************************************************************************************************************************/
    
    /* Renvoie un tableau contenant les statistiques d'utilisation d'une station :
        - La clé du tableau représente l'heure (ex1: getStat(8008)[5] => nombres de vélos utilisés entre 5 et 6 heures du matin le lundi sur la statsion 8008)
                                            (ex2: getStat(3103)[58] => nombres de vélos utilisés entre 10 et 11 heures du matin le mercredi sur la statsion 3103)
        - Si il n'y a pas de vélos empruntés sur la station donnée à l'heure précisée, la clé du tableau n'existera pas (ex: si il n'y a pas de vélos empruntés le lundi entre 11h et 12h sur la station 5029, getStat(5029)[11] n'existera pas, on obtiendra soit null, soit une erreur selon la version de php)
        - Pour que je sois certain que vous ayez lu la doc avant de me poser une question, mettez le mot arc-en-ciel dans la question ;)
        - Pour avoir les statistiques globales de l'ensemble des stations, mettre 0 comme numéro de station
    */
    public function getStat(int $station) {
        global $CheminVersDossierData;
        global $Utilisation;
        $chemin = $CheminVersDossierData.$Utilisation."utilisation".$station.".data";
        if($station == 0)
            $chemin = $CheminVersDossierData.$Utilisation."utilisationGlobale.data";
        $fichier=fopen($chemin,'r');
        if($fichier == False)
            throw new exception ("La station demandée semble ne pas exister dans la base de donnée");
        fclose($fichier);
        $statsJSON = file_get_contents($chemin);
        return json_encode(get_object_vars(json_decode($statsJSON)));
    }
    
    /* Renvoie un tableau du nombre de trajets entre la station donnée et les autres stations avec lesquelles des trajets ont été effectués :
        - La clé du tableau représente la station avec laquelle $station est en relation
        - La valeur associée représente la force de cette relation (nombre de trajets en moyenne entre ces deux stations par semaine
    Peut être utile pour tracer un 'camembert' des station les plus reliées à une station dans les statistiques d'une station
    Dans le tableau retourné, les stations sont triés, de la relation la plus importante à la moins importante
    */
    public function getRelations(int $station) {
        global $CheminVersDossierData;
        global $Relation;
        $chemin = $CheminVersDossierData.$Relation."relations".$station.".data";
        if($station == 0)
            $chemin = $CheminVersDossierData.$Relation."relationsGlobales.data";
        $fichier=fopen($chemin,'r');
        if($fichier == False)
            throw new exception ("La station demandée semble ne pas exister dans la base de donnée");
        fclose($fichier);
        $statsJSON = file_get_contents($chemin);
        return json_encode(get_object_vars(json_decode($statsJSON)));
    }

    /* Renvoie un tableau contenant la distance parcourue lors des trajets concernant cette station, arrondie à 100m :
        - La clé du tableau représente la distance (ex1: getDistance(1002)[500] => nombre de trajets parcourus depuis cette station dont la distance est comprise entre 500 et 600m)
        - La valeur associée représente le nombre de trajets moyens parcourus sur une semaine type de 2015 pour la distance [distance,distance+100[
        - Pour que je sois certain que vous ayez lu la doc avant de me poser une question, mettez le mot licorne dans la question ;)
        - Pour avoir la distance globale parcourue sur l'ensemble des stations, mettre 0 comme numéro de station
    */
    public function getDistance(int $station) {
        global $CheminVersDossierData;
        global $Distance;
        $chemin = $CheminVersDossierData.$Distance."distances".$station.".data";
        if($station == 0)
            $chemin = $CheminVersDossierData.$Distance."distancesGlobales.data";
        $fichier=fopen($chemin,'r');
        if($fichier == False)
            throw new exception ("La station demandée semble ne pas exister dans la base de donnée");
        fclose($fichier);
        $statsJSON = file_get_contents($chemin);
        return json_encode(get_object_vars(get_object_vars(json_decode($statsJSON))['distance']));
    }
    
}
?>
