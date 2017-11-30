<?php
    
    /* Classe représentant une station velov en temps réel
        Version 2.5 du 02/11/17 Par Luc Gombert */
    
    // Attention la classe Station stocke dans son fichier de sauvegarde les données brutes transmises par JCDecaux (attention au timestamp)
    
    require 'Coordonnees.php';

    // Variables globales pour l'API
    $CheminVersData = "data/TempsReel/"; // Chemin menant vers le dossier data où l'on veut stocker les données. Le dossier doit être dèla existant
    
    class Station {
        private $id; // Représente le numéro de la station (integer), numéro unique
        private $nom; // Représente le nom de la station (string)
        private $position; // Représente les coordonnées de la station (coordonnées)
        private $statut; // Représente l'état de la station, ouverte (vrai) ou fermée (faux) (booléen)
        private $points_attache; // Représente le nombre total de points d'attache disponibles sur la station (int)
        private $points_attache_disponibles; // Représente le nombre de points d'attache disponibles <=> pas de vélos dessus (int)
        private $vélos; // Représente le nombre de vélos disponibles ET opérationnels (int)
        private $timestamp; // Représente le timestamp de la dernière actualisation (int)
        private $construit; // Permet de savoir si la station a été construite (et possède donc tous ses attributs) ou non
        
        /* Constructeur à partir de l'identifiant, pas de surcharge pour constructeur vide */
        function __construct(int $_id) {
            $this->id = $_id;
            $this->construit = False;
        }
        
        /* Construit la station à partir du cache selon son id, un fichier texte stocké sur le serveur contenant la description de la dernière actualisation de la station
        Plus rapide qu'un appel au serveur de JCDecaux pour les dernières données, mais ces dernières ne sont pas actualisées */
        private function construire_depuis_cache () {
            global $CheminVersData; // Récupération chemin vers dossier data
            if (file_exists($CheminVersData."station".$this->id.".data")) {
                // Récupération des données sur fichier et mise à jour de l'instance
                $stationJSON = file_get_contents($CheminVersData."station".$this->id.".data");
                $this->ConstruireDepuisJSON($stationJSON);
            } else {
                // Récupération en ligne et création du fichier
                $this->actualiser();
            }
            $this->construit = true;
        }
        
        /* Construit/Actualise la station et le cache via le JSON fourni. Veiller à bien fournir les informations de la bonne station*/
        public function actualiserDepuisJSON ($stationJSON) {
            // Mise à jour de la station grâce au JSON
            $this->ConstruireDepuisJSON($stationJSON);
            $this->sauveCache($stationJSON);
        }
        
        /* Construit/Actualise la station via une requête au site jcdecaux, à partir de son id. Attention, peut être assez long, mais contiendra les dernières données */
        public function actualiser () {
            // Récupération des données en ligne
            $stationJSON = file_get_contents("https://api.jcdecaux.com/vls/v1/stations/".$this->id."?apiKey=136afafc42a09678e5d4776412281b5a65dc3a15&contract=Lyon");
            // Mise à jour de l'instance
            $this->ConstruireDepuisJSON($stationJSON);
            $this->sauveCache($stationJSON);
        }
        
        /* Sauve le contenu du JSON correspondant à la station dans un fichier cache, et écrase la dernière 'version' en cache de la station */
        private function sauveCache ($stationJSON) {
            global $CheminVersData; // Récupération chemin vers dossier data
            // Épuration du JSON, on ne sauve que les éléments nécessaires
            $station = json_decode($stationJSON);
            $stationEpuree = (object) array("number" => $station->number, "name" => $station->name, "position" => $station->position, "status" => $station->status, "bike_stands" => $station->bike_stands, "available_bike_stands" => $station->available_bike_stands, "last_update" => $station->last_update, "available_bikes" => $station->available_bikes);
            $stationJSON = json_encode($stationEpuree);
            $fichier=fopen($CheminVersData."station".$this->id.".data",'w');
            if($fichier == False)
                throw new exception ("Impossible d'écrire les infos de la station dans le fichier");
            fwrite($fichier,$stationJSON);
            fclose($fichier);
        }
        
        /* Construit une station depuis le JSON complet d'une fonction */
        private function ConstruireDepuisJSON ($stationJSON) {
            // décryptage et vérification
            $station = json_decode($stationJSON);
            if(!$station->number == $this->id)
                throw new Exception("Le JSON fourni ne correspond pas à la station");
            // Mise à jour des données de l'instance
            $this->nom = $station->name;
            $this->position = new Coordonnees ($station->position->lat,$station->position->lng);
            if($station->status == "OPEN") {
                $this->statut = True;
            } else {
                $this->statut = 0;
            }
            $this->points_attache = $station->bike_stands;
            $this->points_attache_disponibles = $station->available_bike_stands;
            $this->velos = $station->available_bikes;
            // POur le timestamp, on enlève les trois derniers 0, JCDecaux le stockant différement
            $this->timestamp = ($station->last_update)/1000;
            $this->construit = true;
        }
        
        /* Actualise une station avec un JSON incomplet (suelement les parties modifiables sont envoyées) utile pour charger une date précise par exemple s 
            Permet de ne pas sauvegarder ce nouveau JSON dans le cache*/
        public function ConstruireJSONIncomplet($stationJSON) {
            // On cnstruit la station entière depuis le cache pour ne pas voiri de cdonnées manquantes
            if(!$this->construit)
                $this->construire_depuis_cache();
            // On modifie ensuite les éléments que l'on avait déjà
            $station = json_decode($stationJSON);
            if(!$station->number == $this->id)
                throw new Exception("Le JSON fourni ne correspond pas à la station");
            // Mise à jour des données de l'instance
            if($station->status == "OPEN") {
                $this->statut = True;
            } else {
                $this->statut = 0;
            }
            $this->points_attache = $station->bike_stands;
            $this->points_attache_disponibles = $station->available_bike_stands;
            $this->velos = $station->available_bikes;
            // Pour le timestamp, on enlève les trois derniers 0, JCDecaux le stockant différement
            $this->timestamp = ($station->last_update)/1000;
        }
        
        public function __get($name) {
            // Que la station soit construite ou non, l'id est disponibles
            if ($name=="id" || $name=="identifiant" || $name=="numero" || $name=="num")
                return $this->id;
            // Pour avoir les autres attributs, il faut construire la station depuis le cache si elle ne l'est pas
            if(!$this->construit)
                $this->construire_depuis_cache();
            switch($name) {
                case "x":
                    return $this->position->__get('x');
                case "y":
                    return $this->position->__get('y');
                case "xy":
                    return $this->position->__get("xy");
                case "nom":
                    // On supprime le (far) à la fin des stations qui le possèdent
                    return preg_replace('< \(FAR\)>',"",$this->nom);
                case "statut":
                    return $this->statut;
                case "points_attache":
                    return $this->points_attache;
                case "points_attache_disponibles":
                    return $this->points_attache_disponibles;
                case "velos":
                    return $this->velos;
                case "timestamp":
                    return $this->timestamp;
                case "moment":
                    return date('d/m/Y G:i',$this->timestamp);
                default:
                    throw new Exception("Getter sur un attribut non existant");
            }
        }
    }
?>
