<?php
include("fonctions.php");

// Ne pas oublier de définir le chemin vers le dossier data
$CheminVersData = "../data/";

/* Permet d'importer dans la base de donnée SQL tous les trajets onetnus dans le fichier $FICHIER
les trajets doivent être de la forme "station1_station2   nbTrajetsH0    ... nbTrajetsHN" avec un trajet par ligne du fichier
Attention : cette opération est vraiment TRÈS TRÈS longue, le fichier étant en général assez volumineux (fichier de 60 Mo : environ une heure)
Dans le cas ou les serveur trouve l'exécution trop longue et la coupe au milieu, relancer la fonction jusqu'à ce que 'import terminé' s'affiche*/

function import_trajets () {
    // Ouverture du fichier
    $FICHIER = "../data/typicalWeek2015.txt";
    assert(file_exists($FICHIER));
    $file = fopen($FICHIER,'r');
    if($file) {
        set_time_limit(600);
        global $connexion;
        connectBD();
        echo "Démarrage de l'import<br/>";
        //Variables pour lecture du fichier
        $station1 = 0; $station2 = 0; // les deux stations reliées
        $heure = 0; // Heure de la semaine en cours
        $char = "\n"; // Dernier caractère lu dans le fichier, on simule un retour à la ligne pour lancer correctement la lecture de la nouvelle ligne
        $ecriture = false; // Dans le cas où la fonction est relancée, permet de ne pas tenter d'écrire en double, passe en mode écriture quand les enregistrements ne sont pas trouvés
        while(false !== $char) {
            switch ($char) {
                case "_": // Fin de la lecture du numero de la première station, lecture du numéro de la seconde station
                    $tampon = ""; // mot en cours de lecture
                    $char = fgetc($file);
                    while($char != "\t" && $char !== false) {
                        $tampon = $tampon.$char;
                        $char = fgetc($file);
                    }
                    $station2 = intval($tampon);
                    break;
                case "\n": // Fin de la lecture d'une ligne, lecture du numéro de la nouvelle première station
                    $heure = 0; // On revient en début de semaine
                    $tampon = ""; // mot en cours de lecture
                    $char = fgetc($file);
                    while($char != '_' && $char !== false) {
                        $tampon = $tampon.$char;
                        $char = fgetc($file);
                    }
                    $station1 = intval($tampon);
                    break;
                case "\t": // Passage à l'heure suivante
                    $tampon = ""; // mot en cours de lecture
                    $char = fgetc($file);
                    while($char != "\t" && $char != "\n" && $char !== false) {
                        $tampon = $tampon.$char;
                        $char = fgetc($file);
                    }
                    $valeur = floatval($tampon);
                    if ($valeur != 0) {
                        if(!$ecriture) {
                            $requete = "SELECT * FROM Trajet WHERE (station1,station2,horaire_semaine) = (".$station1.",".$station2.",".$heure.");";
                            $resultat = mysqli_query($connexion, $requete);
                            if($resultat == FALSE) {
                                printf("<p style='font-color: red;'>Erreur : problème d'exécution de la requête SQL d'intégration des trajets.</p>");
                                deconnectBD();
                                throw new exception("Erreur execution requete dans import trajets");
                            }
                            if(mysqli_num_rows($resultat) == 0) { // Cette ligne n'a pas encore été écrite => mode écriture
                                $ecriture = true;
                            }
                        }
                        if($ecriture) {
                            $requete = "INSERT INTO Trajet (station1,station2,horaire_semaine,valeur) VALUES (".$station1.",".$station2.",".$heure.",".$valeur.");";
                            $resultat = mysqli_query($connexion, $requete);
                            if($resultat == FALSE) {
                                printf("<p style='font-color: red;'>Erreur : problème d'exécution de la requête SQL d'intégration des trajets.</p>");
                                deconnectBD();
                                throw new exception("Erreur lexecution dans import trajets");
                            }
                        }
                    }
                    $heure += 1;
                    break;
                default:
                    deconnectBD();
                    throw new exception("Erreur lecture fichier trajets, carcatère '".$char."' rencontré");
            }
        }
        deconnectBD();
        echo "import terminé<br/>";
    } else {
        throw new exception("Le fichier donnée n'existe pas");
        echo "problème lors de l'import<br/>";
    }
}

/* Permet d'importer une liste d'historique de l'état des stations contenus dans un fichier texte au format JSON de JCDecaux
Attention, le fichier fourni doit être correct pour que l'import se passe bien */

function import_etat_stations ($nom_fichier) {
    assert(file_exists($nom_fichier));
    $file = fopen($nom_fichier,'r');
    if($file) {
        global $connexion;
        connectBD();
        echo "Démarrage de l'import<br/>";
        $ecriture = false; // Dans le cas où la fonction est relancée, permet de ne pas tenter d'écrire en double, passe en mode écriture quand les enregistrements ne sont pas trouvés
        $char = "}"; // On simule une fin d'élément comme dernier caractère lu
        // Pour éviter de charger tout le fichier et de faire de trop gros imports JSON, on le charge élément par élément
        while(false !== $char  && $char !=="]") {
            if($char=="}") {
                while($char != "{" && $char != false) { // On attend le début de l'élément suivant
                    $char=fgetc($file);
                }
                if($char=="{") { // Un nouvel élément commence
                    $tampon = $char;
                    while($char != "}" && $char !== false) {
                        $char = fgetc($file);
                        $tampon = $tampon.$char;
                    }
                    $tampax = $tampon;
                    $element = json_decode($tampon);
                    // Écriture dans la BDD
                    if(!$ecriture) {
                        $requete = "SELECT * FROM Etat_Station WHERE (station,temps) = (".$element->number.",".(intval($element->last_update)/1000).");";
                        $resultat = mysqli_query($connexion, $requete);
                        if($resultat == FALSE) {
                            printf("<p style='font-color: red;'>Erreur : problème d'exécution de la requête SQL d'intégration des trajets.</p>");
                            deconnectBD();
                            throw new exception("Erreur execution requete dans import trajets");
                        }
                        if(mysqli_num_rows($resultat) == 0) { // Cette ligne n'a pas encore été écrite => mode écriture
                            $ecriture = true;
                        }
                    }
                    if($ecriture) {
                        $requete = "INSERT INTO Etat_Station (station,temps,statut,nb_velos,nb_bornes,nb_bornes_dispos) VALUES (".$element->number.",".(intval($element->last_update)/1000).",".(($element->status == "OPEN") ? 1 : 0).",".$element->available_bikes.",".$element->bike_stands.",".$element->available_bike_stands.");";
                        mysqli_query($connexion, $requete);
                    }
                }
            } else {
                deconnectBD();
                throw new exception("Erreur lecture fichier état, carcatère '".$char."' rencontré");
            }
        }
        deconnectBD();
        echo "import terminé<br/>";
    } else {
        throw new exception("Le fichier donnée n'existe pas");
        echo "problème lors de l'import<br/>";
    }
}

/* Exporte un fichier JSON par station résumant leur utilisation sur la semaine heure par heure */

function export_utilisation_station_JSON() {
    // On se base uniquement sur les champs station1 pour lister les stations existantes, qui contiennent tous les champs
    // Preuve : SELECT * FROM Trajet WHERE station2 NOT IN (SELECT DISTINCT station1 from Trajet) ne renvoie aucune ligne
    global $connexion;
    global $CheminVersData;
    connectBD();
    echo "Démarrage de l'export de l'utilisation des stations<br/>";
    $requete = "SELECT DISTINCT station1 from Trajet;";
    $resultat = mysqli_query($connexion, $requete);
    if($resultat == FALSE) {
        printf("<p style='font-color: red;'>Erreur : problème d'exécution de la requête SQL de récupération des stations existantes.</p>");
        deconnectBD();
        throw new exception("Erreur execution requete dans export utilisation stations");
    }
    
    // Export pour chaque station sur laquelle on a des données
    while ($row = mysqli_fetch_assoc($resultat)) {
        $requete = "SELECT horaire_semaine,COUNT(valeur) AS utilisation FROM Trajet WHERE station1=".$row['station1']." OR station2=".$row['station1']." GROUP BY horaire_semaine";
        $result = mysqli_query($connexion, $requete);
        // On met toutes les données d'utilisation de la station dans un tableau, que l'on convertira en JSON après
        $fichier=fopen($CheminVersData."utilisation".$row['station1'].".data",'w');
        if($fichier == False)
            throw new exception ("Impossible de créer le fichier");
        $tab = array();
        while($heure = mysqli_fetch_assoc($result)) { // Export de l'utilisation pour chaque heure de la station traitée
            $tab[$heure['horaire_semaine']]=$heure['utilisation'];
        }
        fwrite($fichier,json_encode($tab));
        fclose($fichier);
    }
    mysqli_free_result($resultat);
    
    // Ajout stats globales (trajets de toutes les stations)
    $requete = "SELECT horaire_semaine,COUNT(valeur) AS utilisation FROM Trajet GROUP BY horaire_semaine";
    $result = mysqli_query($connexion, $requete);
    // On met toutes les données d'utilisation de la station dans un tableau, que l'on convertira en JSON après
    $fichier=fopen($CheminVersData."utilisationGlobale.data",'w');
    if($fichier == False)
        throw new exception ("Impossible de créer le fichier");
    $tab = array();
    while($heure = mysqli_fetch_assoc($result)) { // Export de l'utilisation pour chaque heure de la station traitée
        $tab[$heure['horaire_semaine']]=$heure['utilisation'];
    }
    fwrite($fichier,json_encode($tab));
    fclose($fichier);
    
    mysqli_free_result($result);
    echo "export de l'utilisation des station terminé<br/>";
}

?>
