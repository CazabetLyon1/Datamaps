import pandas as pd
import numpy as np
import matplotlib.pyplot as pt

# renvoie une dataframe contenant tous les enregistrements des json du dossier historique
numero = []
velos = []
timestamp = []
point_attache = []
for annee in range(2017,2018):
    for i in range(2,12):
        mon_fichier = open("historique/data_all_Lyon.jjson_"+ str(annee) +"-"+ (str(i) if i>=10 else "0" + str(i))+"-01",'r')
        contenu = mon_fichier.read()
        lignes = contenu.split(sep="\n")
        import json
        for ligne in lignes:
            try :
                ligneDecode = json.loads(ligne)
            except Exception as inst:
                print(ligne) # Il y a parfois des lignes vides en fin de fichier. On affiche au cas ou ce ne soit pas le cas
            for enregistrement in ligneDecode:
                numero.append(enregistrement['number'])
                velos.append(enregistrement['available_bikes'])
                timestamp.append(enregistrement['last_update'])
                point_attache.append(enregistrement['available_bike_stands'])
# Avec tous les tableaux, création de la dataframe
timestamp = np.array(timestamp)
timestamp = timestamp/1000
timestamp = np.array(timestamp,dtype=np.uint32)
s = pd.DataFrame({"numero" : np.array(numero,dtype=np.uint16),
                  "velos" : np.array(velos,dtype=np.uint8),
                  "points_attache" : np.array(point_attache,dtype=np.uint8)},
                  index=timestamp)
