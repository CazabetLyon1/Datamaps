<div id="divlogo"> <!-- Insertion du logo pour les écrans adéquats -->
  <img src="vue/logo.png"/>
</div>


<div id="graphes" class="container">

	<script>
        var data =[];
        var res= [];
        var stationParArrond = [];
            

        // Genration Data pour graphe en ligne 
            var dataLine = 
                <?php 
                    require 'modele/Statistiques_Stations.php';  
                    $Stat_S= new Statistiques_stations;
                    
                    if(isset($_GET['station'])) {
                        print_r($Stat_S->getStat($_GET['station']));
                    }
                        else{
                            print_r($Stat_S->getStat(0));
                        }
                ?>;

        // Ajout du graphe en ligne
            data.push(transformForGraph (dataLine,"station " + <?php 
                
                if(isset($_GET['station'])) {
                    echo($_GET['station']);
                }
                    else{
                        echo(" 0");
                    }
                ?>,"#ff7f0e"));
            
            newSimpleLineGraph(data,'Heure de la semaine','Trajets');
        
        //generation data donuts
            var dataPie =
                <?php 
                $test= new Statistiques_stations; 
                if(isset($_GET['station'])) {
                    print_r($Stat_S->getRelations($_GET['station']));
                }
                    else{
                        print_r($Stat_S->getRelations(0));
                    }
                ?>;
        // generation graphe donut
            pieChart(TransformForPie(dataPie));
        
        //recup liste stations
            var dataLS = 
                        <?php 
                        
                        $LS= new ListeStations;
                        $getLS=$LS->getListeStations();
                        $resLS = array();
                        $it=0;
                        foreach($getLS as $It){
                            
                            $resLS[$it]=$LS->getAttribut($It,"nom");
                            $it++;
                        }
                        print_r(json_encode($resLS)); ?>;
    
            for (var i =0 ;i< 12; i ++){
                stationParArrond.push([]);
            }

            dataLS.forEach(function(e){
                if (e.slice(4,7) == " - ")
                    res.push( e.split(" - "));

                else if (e.slice(5,8) == " - ")
                    res.push( e.split(" - "));
                
                else if (e.slice(4,6) == "- ") 
                    res.push( e.split("- "));

                else if (e.slice(5,7) == "- ")
                    res.push( e.split("- "));

            });
            
            
            var station = <?php 
                                if(isset($_GET['station'])) {
                                    echo($_GET['station']);
                                }
                                else{
                                   echo(" 0");
                                } ?>;

            
            res.forEach(function(e){
                stationParArrond[getArrond(e[0])-1].push({num :e[0] , nom : e[1] });
            });
           
            
            
        

            function generateListStation (arrond){
                var generatedRes ="";
                if (arrond == -1){
                    generatedRes = '<select class="form-control " ><option selected disable>Choisissez un arrondissement</option> </select>' ;
                }
                else {
                    generatedRes = '<select class="form-control "  title="Choisir Station" onchange="location = this.value;">';
                    stationParArrond[arrond].forEach(function(e){
                    generatedRes += '<option value="index.php?page=controleur/graphes.php&station='+ e.num  +'" > '+ e.num + " - " + e.nom + '</option>' ; 
                })
                generatedRes += "</select>"; 
                }
                
                document.getElementById("selectStation").innerHTML = generatedRes;
            };
        

            
               
    </script>
    
        
   
    <div id='Welcome' >
	
	</div>
    <h2>
        <?php 
        if(isset($_GET['station'])) {
            if($_GET['station']==0){
                echo(" Somme du réseau");
            }
            else {
                echo("Station ");
                    
                    foreach($getLS as $It){
                        if($It==$_GET['station'] || $It== "0" +$_GET['station'])
                        print_r($LS->getAttribut($It,"nom"));
                        
                    }
            }
        }
            else{
                echo(" Statistiques totales du réseau");
                
            }
            ?>
    </h2>
    
      <div>


<div id= 'selectArrond' class="col-sm-3">



<select class=" form-control" title="Choisir Arrondissement" onchange="generateListStation(this.value);">
    <option  value="" type="hidden" disabled selected >Choisir l'arrondissement</option>
  <optgroup label="Lyon">
    <option  value="0"><a>Lyon 1°</a></option>
    <option  value="1"><a>Lyon 2°</a></option>
    <option  value="2"><a>Lyon 3°</a></option>
    <option  value="3"><a>Lyon 4°</a></option>
    <option  value="4"><a>Lyon 5°</a></option>
    <option  value="5"><a>Lyon 6°</a></option>
    <option  value="6"><a>Lyon 7°</a></option>
    <option  value="7"><a>Lyon 8°</a></option>
    <option  value="8"><a>Lyon 9°</a></option>
    </optgroup>
    <optgroup label="Aglomeration">
    <option class="item"  value="9"><a>Villeurbanne</a></option>
    <option class="item"  value="10"><a>Caluire</a></option>
    <option class="item"  value="11"><a>Vaulx-en-Velin</a></option>
      </optgroup>
      
    </select> 
    </div>
    <div id="selectStation"  class="col-sm-3 ">
        <select class="form-control " >
            <option selected disabled>Choisissez un arrondissement</option>
        </select>
    </div>

    <button type="button" id="buttonMoyenne" class="btn btn-secondary" value="index.php?page=controleur/graphes.php&station=0" onclick="generateListStation(-1) ;location = this.value;">Moyenne des données</button>

    
    <form id = "searchStation" method="get">
    <input type="hidden" name="page" value="controleur/graphes.php" >
     <input type="text" name="station" placeholder="Recherche station" >   
    </form>
    
    
</div>
    
    
    <div id="chartTrajet" > 
    <h4 id="trajmoyen">Nombre moyen de trajets par heure</h4>
    </div>

    <div>
    <h4 id="top10">Les 10 stations les plus reliées</h4>
    <svg id="charttop10" class="mypiechart" ></svg>
    </div>
    
    
    
    
</div>