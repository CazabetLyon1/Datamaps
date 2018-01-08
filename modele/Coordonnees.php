<?php
    
    /* Classe représentant des coordonnées au format WGS84 
        Version 1.0 du 28/09/17 Par Luc Gombert */
    
    class Coordonnees {
        private $coordonnees_x;
        private $coordonnees_y;
        
        function __construct (float $_x,float $_y) {
            $this->coordonnees_x = $_x;
            $this->coordonnees_y = $_y;
        }
        
        // Getters : x ou y pour une coordonnée, xy pour un tableau clé-valeurs contenant les deux
        public function __get($name) {
            switch($name) {
                case "x":
                    return $this->coordonnees_x;
                case "y":
                    return $this->coordonnees_y;
                case "xy":
                    return ['x'=> $this->coordonnees_x,'y'=> $this->coordonnees_y];
                default:
                    throw new Exception("Getter sur un attribut non existant");
            }
        }
    }
    
?>
