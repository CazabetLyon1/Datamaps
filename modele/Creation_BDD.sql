/* STATION (id, nom, position_x, position_y) */
CREATE TABLE Station (
id INTEGER PRIMARY KEY,
nom VARCHAR(255) NOT NULL,
position_x FLOAT NOT NULL,
position_y FLOAT NOT NULL,
CONSTRAINT Position_Unique UNIQUE (position_x, position_y));

/* TRAJET (#station1, #station2, horaire_semaine, valeur) */
CREATE TABLE Trajet (
station1 INTEGER NOT NULL,
station2 INTEGER NOT NULL,
horaire_semaine INTEGER NOT NULL,
valeur FLOAT NOT NULL,
CONSTRAINT pk_trajets PRIMARY KEY (station1,station2,horaire_semaine));

/* ETAT_STATION (#station, timestamp, nb_velos, nb_bornes, nb_bornes_dispos) */
CREATE TABLE Etat_Station (
station INTEGER,
temps INTEGER NOT NULL,
nb_velos INTEGER NOT NULL,
nb_bornes INTEGER NOT NULL,
nb_bornes_dispos INTEGER NOT NULL,
CONSTRAINT pk_etat_station PRIMARY KEY (station,temps));
