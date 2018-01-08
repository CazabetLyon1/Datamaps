<?php

    /* Classe représentant la liste des stations velov en temps réel
        Version 1.0 du 20/11/17 par Luc Gombert */
    
    require 'station.php';
    require 'Statistiques_Stations.php';
    
    // Variables globales pour l'API
    $CheminVersData2Global = "../data/"; // Chemin menant vers le dossier data où sont stockées les données
    $CheminVersData2 = $CheminVersData2Global."TempsReel/"; // Chemin menant vers les données en temps réel, pour station.php
    
    class GroupementStations {
    
        private $tab_appartenance; // Tableau contenant l'appartenance des stations à un groupe, les valeurs sont en pourcentage/100
        // Il est de la forme : {1:{1001:0.5478,1002:0.1645,...},2:{...},...}
        private $tab_station; // Tableau contenant les objets stations correspondant aux éléments du premier tableau. Utilile pour récupérer les coordonnées ou autre
        private $Stats;  // Classe permettant de récupérer les statitiques d'une station
        
        /* Construit la liste des stations à partir du fichier texte correspondant sur le serveur */
        function __construct () {
            // récupérations datas
            global $CheminVersData2Global;
            $groupement = file_get_contents($CheminVersData2Global."Decomposition_utilisation.json");
            $jsonGroupement = json_decode($groupement);
            $jsonGroupement = get_object_vars($jsonGroupement);
            // Remplissage tableau appartenance
            $this->tab_appartenance=array();
            foreach($jsonGroupement as $i)
                $this->tab_appartenance[] = get_object_vars($i);
            // Remplisssage tableau stations
            foreach (array_keys($this->tab_appartenance[1]) as $i) {
                $this->tab_station[$i] = new station($i);
            }
			$tab_appartenance = $jsonGroupement;
			$this->Stats = new Statistiques_stations();
        }

        
        /************************************************************************************************************************************************/
        /*                                      Début de l'API (partie utile pour les développeurs graphiques)                                          */
        /************************************************************************************************************************************************/
        
        /* Renvoie un tableau contenant les numéros de toutes les stations vélov pour lesquelles nous possédons des données */
        public function getListeStations() {
            $tabl = array();
            foreach($this->tab_station as $i) {
                $tabl[]=$i->__get("id");
            }
            return $tabl;
        }
        
        /* Retourne l'attribut $attr de la station numéro $num parmis les attributs :
            - les coordonnées (rentrer dans $attr "x" ou "y" pour avoir le float correspondant, ou "xy" pour un tableau clé-indice ayant les deux données aux clés x et y) au format WGS84, float
            - le numéro unique de la station ($attr = "numero"), integer
            - le nom de la station ($attr = "nom"), string
            Renvoie une exeption si l'indice donné est inexistant
        */
        public function getAttribut(int $num,$attr) {
            return $this->tab_station[$num]->__get($attr);
        }
        
        /*  Retourne le pourcentage d'appartenance de la station $num au groupe $groupe. La station doit appartenir à la liste des stations, et le groupe être compris entre 1 et 6
        */
        public function getAppartenanceGroupe(int $num,int $groupe) {
            return($this->tab_appartenance[$groupe][$num]*100);
        }
        
        /* 
            Retourne le pourcentage d'utilisation de la station relativement au groupe
        */
        public function getUtilisation(int $num, int $groupe) {
            // Récupération de l'utilisation des station, et somme heure par heure
            $tab = json_decode(($this->Stats)->getStat($num));
            $sum = 0;
            foreach($tab as $i) {
                $sum = $sum + $i;
            }
            return($sum/5000*$this->getAppartenanceGroupe($num,$groupe));
        }
    }
?>
