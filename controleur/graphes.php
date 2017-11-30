<div id="divlogo">
  <img src="vue/logo.png"/>
</div>
<div id="graphes" class="container">

	<script>
        var data =[];
        
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

        data.push(transformForGraph (dataLine,"station " + <?php 
             
            if(isset($_GET['station'])) {
                echo($_GET['station']);
            }
                else{
                    echo(" 0");
                }
            ?>,"#ff7f0e"));
        
        newSimpleLineGraph(data,'Heure de la semaine','Nombre de trajets moyens par heure');
        
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
        pieChart(TransformForPie(dataPie));
        
        var dataLS = 
        <?php 
         
        $LS= new ListeStations;
        $getLS=$LS->getListeStations();
        $res = array();
        $it=0;
        foreach($getLS as $It){
            //$res .= "<br>";
            $res[$it]=$LS->getAttribut($It,"nom");
            $it++;
        }
        print_r(json_encode($res)); ?>;
    console.log(dataLS);
        var res= [];
        var stationParArrond = [];
        for (var i =0 ;i< 12; i ++)
            stationParArrond.push([]);
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
        
    res.forEach(function(e){
        stationParArrond[getArrond(e[0])-1].push({num :e[0] , nom : e[1] });        
    });
    
    function generateListStation (arrond){
        var generateRes = '<select class="selectpicker form-control "  title="Choisir Station" >';
        stationParArrond[arrond].forEach(function(e){
            generateRes += '<option value="index.php?page=controleur/graphes.php&station='+ e.num  +'"   onclick="location = this.value;"><a> '+ e.num + " - " + e.nom + '</a></option>' ; 
        })
        generateRes += "</select>"; 
        document.getElementById("selectStation").innerHTML = generateRes;
    }
    

        
        
        </script>
    
        
   
    
	<h2 id="Welcome">Quelques graphes !</h2><br>
	
      <div>
<div id= 'selectArrond' class="col-sm-3">

    
<select class=" form-control" data-live-search="true" title="Choisir Arrondissement" >
  <optgroup label="Lyon">
    <option  onclick=generateListStation(0)><a>Lyon 1°</a></option>
    <option  onclick=generateListStation(1)><a>Lyon 2°</a></option>
    <option  onclick=generateListStation(2)><a>Lyon 3°</a></option>
    <option  onclick=generateListStation(3)><a>Lyon 4°</a></option>
    <option  onclick=generateListStation(4)><a>Lyon 5°</a></option>
    <option  onclick=generateListStation(5)><a>Lyon 6°</a></option>
    <option  onclick=generateListStation(6)><a>Lyon 7°</a></option>
    <option  onclick=generateListStation(7)><a>Lyon 8°</a></option>
    <option  onclick=generateListStation(8)><a>Lyon 9°</a></option>
    </optgroup>
    <optgroup label="Aglomeration">
    <option class="item"  onclick=generateListStation(9)><a>Villeurbanne</a></option>
    <option class="item"  onclick=generateListStation(10)><a>Caluire</a></option>
    <option class="item"  onclick=generateListStation(11)><a>Vaulx-en-Velin</a></option>
      </optgroup>
      
    </select> 
    </div>
    <div id="selectStation"  class="col-sm-3">
        
    </div>
    
    <form id = "searchStation" method="get">
    <input type="hidden" name="page" value="controleur/graphes.php" >
     <input type="text" name="station" placeholder="Recherche station" >   
    </form>
    

</div>
    
    <div>
    <div id="chart1" class="col-sm-6"> </div>
    <svg id="test1" class="mypiechart" class="col-sm-3"></svg>
    </div>
    
    
</div>