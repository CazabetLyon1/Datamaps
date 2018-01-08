import pandas as pd
import matplotlib.pyplot as pt
import numpy as np

# Pour l'import de stations/calcul distances
from os import path as chemin
from geopy.distance import vincenty as dst
from json import loads as json_loads

# fonction permettant d'importer depuis le fichier txt fourni, renvoie l'objet pandas correspondant
# Elle index selon les heures, et les deux stations (<=> tableau 3D)
def importer_txt_index_stations():
    # Objets contenat les infos
    station1 = []
    station2 = []
    heures = [] # Heures de la semaine
    for a in range(0,168):
        heures.append(a)
    values = []

    #Lecture du fichier et analyse
    mon_fichier = open("typicalWeek2015.txt",'r')
    contenu = mon_fichier.read()
    lignes = contenu.split(sep="\n")
    for ligne in lignes:
        elements = ligne.split(sep="\t")
        stations = elements.pop(0)
        stations = stations.split(sep="_")
        if(len(stations) == 2): # Si données mauvaises, pas d'ajout
            station1.append(stations[0])
            station2.append(stations[1])
            values.append(elements)
    arrays = [np.array(station1,dtype=np.int16),np.array(station2,dtype=np.int16)]
    values = np.array(values,dtype=np.float16)
    s = pd.DataFrame(values, index=arrays, columns=heures)
    mon_fichier.close()
    s = s.sort_index()
    return s

# fonction permettant d'importer depuis le fichier txt fourni, renvoie l'objet pandas correspondant
# Elle index comme une base SQL (TRAJET (station1, station2, horaire_semaine, valeur))
def importer_txt():
    station1 = []
    station2 = []
    heures = []
    valeurs = []
    mon_fichier = open("typicalWeek2015.txt",'r')
    contenu = mon_fichier.read()
    mon_fichier.close()
    lignes = contenu.split(sep="\n")
    for ligne in lignes:
        elements = ligne.split(sep="\t")
        stations = elements.pop(0)
        stations = stations.split(sep="_")
        if(len(stations) == 2): # Si données mauvaises, pas d'ajout
            for heure in range(0,168):
                if(elements[heure] != '0.0'):
                    station1.append(stations[0])
                    station2.append(stations[1])
                    heures.append(heure)
                    valeurs.append(elements[heure])
    s = pd.DataFrame({"station1" : np.array(station1,dtype=np.uint16),
                     "station2" : np.array(station2,dtype=np.uint16),
                     "heure" : np.array(heures,dtype=np.uint8),
                     "valeur" : np.array(valeurs,dtype=np.float16)})
    return s

# fonction permettant d'importer depuis les fichiers data temps réel les coordonnées GPS des station contenues dans la dataframe donnée
#renvoie un dtatframe indexé comme une base SQL (STATION (id, position_x, position_y))
def importer_stations(a):
    station = []
    x = []
    y = []
    for i in a['station1'].append(a['station2']).unique():
        if(chemin.isfile("../data/TempsReel/station"+str(i)+".data")):
            mon_fichier = open("../data/TempsReel/station"+str(i)+".data")
            contenu = mon_fichier.read()
            mon_fichier.close()
            contenu = json_loads(contenu)
            station.append(i)
            x.append(contenu['position']['lat'])
            y.append(contenu['position']['lng'])
        else:
            print("station "+str(i)+" non disponible")
    s = pd.DataFrame({"station" : np.array(station,dtype=np.uint16),
                      "latitude" : np.array(x),
                      "longitude": np.array(y)})
    return s
        
    

# Exporte les statistiques d'utilisation par station depuis un dataFrame comme celui créé par importer_txt
def exporte_utilisation(a):
    chemin = "../data/utilisation/"
    for i in a['station1'].append(a['station2']).unique():
        a[(a['station1'] == i) | (a['station2'] == i)].groupby('heure')['valeur'].agg(np.sum).to_json(chemin + "utilisation" + str(i) + ".data")
    return a.groupby('heure')['valeur'].agg(np.sum)

# Exporte les la force des relations entre une station donnée et les autres, triés. Peut être utile pour un pie chart par exemple
def exporte_relations(a):
    chemin = "../data/relations/"
    for i in a['station1'].append(a['station2']).unique():
        (a[(a['station2'] == i)].groupby('station1')['valeur'].agg(np.sum).append(a[(a['station1'] == i) & (a['station2'] != i)].groupby('station2')['valeur'].agg(np.sum))).sort_values(ascending=False).to_json(chemin + "relations" + str(i) + ".data")
    b = a.groupby('station1')['valeur'].agg(np.sum).append(a.groupby('station2')['valeur'].agg('sum')).sort_index()
    c = []
    stations=[]
    for i in a['station1'].append(a['station2']).unique():
        c.append(b[i].sum())
        stations.append(i)
    s = pd.DataFrame(np.array(c), index = np.array(stations), columns=['nb_trajets']).sort_values('nb_trajets',ascending=False).to_json(chemin + "relationsGlobales.data")
    return 0

# exporte les distances des trajets depuis chaque stations et globales, par tranche de 100 mètres
# a est le dataframe contenant les stations et leur coordonnées
# s est le dataframe contenant les trajets
def exporte_distances(s,a):
    chemin = "../data/distances/"
    distance = range(0,12100,100)
    # Pour export statistiques globales
    coef = [0]*121
    unique_stations = s['station1'].append(s['station2']).unique()
    for i in unique_stations: # Parcours selon toutes les stations as station 1
        # Pour exports des statistiques de la station
        val = [0]*121
        if(i != 501): # On n'a pas les coordonnées du dépot de velovs
            for j in unique_stations: # Parcours selon toutes les stations as station 2
                if(j != 501):
                    dist = round(dst((a[a['station']==i]['latitude'].values[0],a[a['station']==i]['longitude'].values[0]),(a[a['station']==j]['latitude'].values[0],a[a['station']==j]['longitude'].values[0])).meters,-2)
                    somme = s[(((s['station1']==i) & (s['station2']==j)) | (s['station1']==i) & (s['station2']==j))]['valeur'].sum()
                    val[int(dist/100)] += somme
                    coef[int(dist/100)] += somme
            pd.DataFrame(np.array(val),index=np.array(distance),columns=['distance']).to_json(chemin + "distances"+str(i)+".data")
    n = pd.DataFrame(np.array(coef), index=np.array(distance), columns=['distance'])
    n.to_json(chemin + "distancesGlobales.data")
    return n

# Effectue une factorisation de matrices non nulles sur l'utilisation heure par heure des stations
# b est le dataframe provenant de importer_txt_index_stations()
# Renvoie la matrice W correspondant à la factorisation
def NMFStation(b):
    # Sommation
    somme = []
    station = []
    for x in b.index.get_level_values(0).unique():
        if(x != 501): # Station peu intéressante (dépot)
            somme.append(b.T[x].T.sum()+b.swaplevel(0,1).T[x].T.sum()-b.T[x,x].T)
            station.append(x)
    # Decomposition matrice
    from sklearn.decomposition import NMF
    model = NMF(n_components=6) #On prend 6 composants (comme choisi par remy)
    W = model.fit_transform(somme)
    UtilisationStH = pd.DataFrame(data=W,index=station,columns=range(1,7))
    H = model.components_
    H = pd.DataFrame(data=H,index=range(1,7),columns=range(0,168))
    return H
    # Passage en pourcentage
    pourcent = []
    station = []
    for i in UtilisationStH.index:
        pourcent.append(UtilisationStH.T[i]/UtilisationStH.T[i].sum())
        station.append(i)
    UtilisationStH = pd.DataFrame(data=pourcent,index=station,columns=range(1,7))
    return UtilisationStH



