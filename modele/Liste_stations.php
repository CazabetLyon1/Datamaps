<?php

    /* Classe représentant la liste des stations velov en temps réel
        Version 3.4.1_patch du 15/11/17 par Luc Gombert */
    
    require 'station.php';
    
    class ListeStations {
    
        private $tab_station; //Tableau contenant les stations, tableau d'entiers
        private $actu_stations; // Timestamp de la dernière actualisation des stations, entier
        private $actu_liste_stations; // Timestamp de la dernière actualisation de la liste des stations, entier
        
        /* Construit la liste des stations à partir du cache, un fichier texte stocké sur le serveur contenant la dernière actualisation */
        function __construct () {
            // Initialisation à garder
            $this->tab_station = array();
            // Chargement depuis cache
            $this->ChargerDepuisCache();
        }
        
        /*  Retourne la station correspondant à l'indice du tableau donné. Si -1 est donné, retourne le tableau entier
            Renvoie une exeption si l'indice donné est inexistant */
        function __get($name) {
            if ($name == -1) {
                return $this->tab_station;
            }
            if (array_key_exists($name, $this->tab_station)) {
                return $this->tab_station[$name];
            }
            throw new Exception("La station ".$name." semble ne pas exister");
        }
        
        /* Chargement de la liste des stations depuis le cache */
        private function ChargerDepuisCache () {
            global $CheminVersData; // Récupération chemin vers dossier data
            
            // Récupération date d'actualisation des stations
            if(file_exists($CheminVersData."stationsActualisation.data")){
                $this->actu_stations = (integer) file_get_contents($CheminVersData."stationsActualisation.data");
            } else {
                // Création du fichier, mise de la date 0
                $fichier=fopen($CheminVersData."stationsActualisation.data",'w');
                if($fichier == False)
                    throw new exception ("Impossible de créer le fichier de sauvegarde de l'heure");
                fwrite($fichier,0);
                fclose($fichier);
                $this->actu_stations = 0;
            }
            // Actualisation des stations depuis le site JCDecaux si la date de dernière actualisation date d'il y a plus de 5 minutes
            if(time()-$this->actu_stations > 300) {
                $this->actualiserToutesStations();
            } else { // Sinon, actualisation depuis le cache qui est à jour
                // Récupération des numéros station
                if (file_exists($CheminVersData."stations.data")) {
                    // Récupération des données sur fichier et mise à jour de l'instance
                    $stationsJSON = file_get_contents($CheminVersData."stations.data");
                    $this->ConstruireDepuisJSON($stationsJSON);
                } else {
                    // Récupération en ligne et création du fichier
                    $this->ALS();
                }
            }
        }
        
        /* Requete JCDecaux pour récupérer la liste des station existantes, analyse de la réponse et mise à jour */
        private function ALS () {
            global $CheminVersData; // Récupération chemin vers dossier data
            // Requête et récupération de la reponse, puis construction de la liste de stations
            $stationsJSON = file_get_contents("https://api.jcdecaux.com/vls/v1/stations?apiKey=136afafc42a09678e5d4776412281b5a65dc3a15&contract=Lyon");
            // Épuration des données récupérées, on ne garde que le 'number' dont on a besoin
            $stations = json_decode($stationsJSON);
            $numeros = array();
            foreach($stations as $station) {
                $numeros[] = $station->number;
            }
            $stationsJSON = json_encode($numeros);
            // Traitement des stations
            $this->ConstruireDepuisJSON($stationsJSON);
            // mise à jour du fichier listant toutes les stations
            $fichier=fopen($CheminVersData."stations.data",'w');
            if($fichier == False)
                throw new exception ("Impossible d'écrire la liste des stations dans le fichier");
            fwrite($fichier,$stationsJSON);
            fclose($fichier);
        }
        
        /* Construit la liste des stations avec un JSON fourni en paramètre, puis ajoutes les fichiers des stations JSON */
        private function ConstruireDepuisJSON ($stationsJSON) {
            
            // Ajout des stations en txt du dossier data (contient les supprimées par jcdecaux car inactives depuis trop longtemps)
            global $CheminVersData;
            foreach(scandir($CheminVersData) as $i) {
                if(preg_match("<^station\d{4}\d?\.data$>",$i)){ // Fichier .data représentant une station
                    // Récupération du numéro
                    $j = (integer) preg_replace("<^(station)(\d{4}\d?)(\.data)$>","$2",$i);
                    $st = new Station ($j);
                    $this->tab_station[$j] = $st;
                }
            }
            // Ajout des stations du json (les actives) si elles n'existant pas déjà
            // La complexité est en n^2, mais bon ^^
            $stations = json_decode($stationsJSON);
            foreach($stations as $i) {
                $contient = False;
                foreach($this->tab_station as $j) {
                    if($j->__get("num")==$i) {
                        $contient = True;
                        break;
                    }
                }
                if (!$contient) {
                    $st = new Station ($i);
                    $this->tab_station[$i] = $st;
                }
            }
        }
        
        /* Récupère les numéros de toutes les stations */
        private function genereLS () {
            // Pour chaque station, renvoie le numéro correspondant
            $tab_retour = array();
            foreach($this->tab_station as $i) {
                $tab_retour[] = $i->__get("id");
            }
            return $tab_retour;
        }
        
        /* Met à jour le cache de toutes les stations existantes et actualise les objets correspondants */
        private function actualiserToutesStations () {
            global $CheminVersData; // Récupération chemin vers dossier data
            $stationsJSON = file_get_contents("https://api.jcdecaux.com/vls/v1/stations?apiKey=136afafc42a09678e5d4776412281b5a65dc3a15&contract=Lyon");
            $stations = json_decode($stationsJSON);
            foreach($stations as $station) {
                if (!isset($this->tab_station[$station->number]))
                    $this->ALS();
                $this->tab_station[$station->number]->actualiserDepuisJSON(json_encode($station));
            }
            // Actualisation du temps et écriture dans le fichier
            $this->actu_stations = time();
            $fichier=fopen($CheminVersData."stationsActualisation.data",'w');
            if($fichier == False)
                throw new exception ("Impossible d'écrire la date d'actualisation dans le fichier");
            fwrite($fichier,$this->actu_stations);
            fclose($fichier);
        }
        
        /* Renvoie le timestamps (integer) de la dernière actualisation gloable des stations (rappel : timestamp + 1 = 1 seconde plus tard ;) ) 
        En public uniquement pour la compatibilité avec les versions antérieurs à la 3, la gestion du temps est désormais effecuée en interne */
        public function getDerniereActualisation() {
            return $this->actu_stations;
        }
        
        /* Actualise la liste des stations velov existantes, s'effctue automatique une fois par jour ou lors de l'ajout d'une nouvelle station
        Il ne devrait pas être nécesssaire de l'appeler, mais est en public au cas ou */
        public function actualiserListeStations() {
            $this->ALS();
        }
        
         /* Actualise les données de toutes les stations velov depuis le site de JCDecaux en une seule requête à leur site
         Se fait automatiquement, reste en public pour des raisons de compatibilité avec les versions précédentes*/
        public function actualiser() {
            $this->actualiserToutesStations();
        }
        
        /************************************************************************************************************************************************/
        /*                                      Début de l'API (partie utile pour les développeurs graphiques)                                          */
        /************************************************************************************************************************************************/
        
        /* Renvoie un tableau contenant les numéros de toutes les stations vélov connues lors de la dernière actualisation des stations (voir actualiserListeStations()) triées par ordre croissant */
        public function getListeStations() {
            return $this->genereLS();
        }
        
        /* Retourne l'attribut $attr de la station numéro $num parmis les attributs :
            - les coordonnées (rentrer dans $attr "x" ou "y" pour avoir le float correspondant, ou "xy" pour un tableau clé-indice ayant les deux données aux clés x et y) au format WGS84, float
            - le numéro unique de la station ($attr = "numero"), integer
            - le nom de la station ($attr = "nom"), string
            - le statut (ouvert ou fermée) de la station ($attr = "statut"), booléen
            - le nombre de points d'attache que possède la station ($attr="points_attache"), integer
            - le nombre de points d'attache disponibles (c'est à dire sans vélos) disponible sur la station ($attr="points_attache_disponibles"), integer
            - le nombre de vélos disponibles et opérationnels du la station ($attr="velos"), integer
            - le timestamp de la dernière actualisation des données de la station ($attr="timestamp"), integer
            - le moment de la dernière actualisation sous forme de chaine de caractères ($attr="moment"), string
            Renvoie une exeption si l'indice donné est inexistant
        */
        public function getAttribut(int $num,$attr) {
            return $this->__get($num)->__get($attr);
        }
        
        /* Actualise les données de la station numéro $num depuis le site de JCDecaux
            Utiliser ponctuellement. Pour mettre plus de 2-3 stations à jour, il vaut mieux utiliser la fonction actualiser()
            NE PAS faire de boucle appelant actualiserStation */
        public function actualiserStation(int $num) {
            $this->__get($num)->actualiser();
        }
     
        /* Pour que florentin puisse s'amuser : met l'ensemble des stations à l'état du JSON passé en paramètre */
        public function modifieStations($stations) {
            foreach($stations as $station) {
                if (isset($this->tab_station[$station->number])) // On ne le fait que si la station existe
                    $this->tab_station[$station->number]->ConstruireJSONIncomplet(json_encode($station));
            }
        }
    
    }
?>
