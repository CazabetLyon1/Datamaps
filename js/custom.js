/// **************************
/// ******* Graphes **********
/// **************************

function newSimpleLineGraph(data,xLabel,yLabel){
    /*These lines are all chart setup.  Pick and choose which chart features you want to utilize. */
    //data est un tableau d'objet obtenu par transformForGraph
        var chart;
    
    nv.addGraph(function() {
		chart = nv.models.lineChart()
		.showLegend(false)

            .options({
                duration: 300,
                useInteractiveGuideline: true,
            })


        ;
        // chart sub-models (ie. xAxis, yAxis, etc) when accessed directly, return themselves, not the parent chart, so need to chain separately
        chart.xAxis
            .axisLabel(xLabel)
            .tickFormat(d3.format(',.1f'))
            .staggerLabels(true)
        ;
        chart.yAxis
            .axisLabel(yLabel)
            .tickFormat(function(d) {
                if (d == null) {
                    return 'N/A';
                }
                return d3.format(',.2f')(d);
            })
        ;

        d3.select('#chartTrajet ').append('svg')
            .attr('height', 600)
            .datum(data)
            .call(chart);
        nv.utils.windowResize(chart.update);
        return chart;
    });
}


// permet de passer des data sous format d'affichage pour les graphe
function transformForGraph (data, key , color){

    //data : les données sous la forme {x,y} (tableau d'objet)
    //key : le nom donné pour l'affichage
    //color : couleur des données pour l'affichage
    
    
    var data1 = Object.values(data);

    
    var data2=[];
    var i = 0;
    /*for (var i = 0; i < 168; i++) {
        data2.push({x: i, y: data1[i]});

        }
    */
    data1.forEach(function(){
        data2.push({x: i, y: data1[i]})
        i++;
    });
    
    return {
            values : data2,
            key : key,
            color : color
    }

}

function pieChart(data)
{
    var testdata = [
        {key: "One", y: 5},
        {key: "Two", y: 2},
        {key: "Three", y: 9},
        {key: "Four", y: 7},
        {key: "Five", y: 4},
        {key: "Six", y: 3},
        {key: "Seven", y: 0.5}
    ];
    var height = 150;
    var width = 150;
    var chart1;

    nv.addGraph(function() {
        var chart1 = nv.models.pieChart()
            .x(function(d) { return d.key })
            .y(function(d) { return d.y })
            .donut(true)
            .width(width)
            .height(height)
            .padAngle(.08)
            .cornerRadius(5)
        .showLegend(false)
            .id('donut1'); // allow custom CSS for this one svg


        chart1.pie.labelsOutside(true).donut(true);
        d3.select("#charttop10")
            .datum(data)

            .attr('height',150)
            .attr('width',150)
            .transition().duration(120)
            .call(chart1);
        // LISTEN TO WINDOW RESIZE
        nv.utils.windowResize(chart1.update);
        // LISTEN TO CLICK EVENTS ON SLICES OF THE PIE/DONUT
         chart1.pie.dispatch.on('elementClick', function(e) {
            
            
            document.location.href="index.php?page=controleur/graphes.php&station=" + e.data.key;
    
         });
       

        return chart1;
    });
}



function TransformForPie(data){

    var data1 = Object.values(data);
    var data3 = Object.keys(data);
   
    var data2=[];
    var i = 0;


    data1.forEach(function(){
        data2.push({key: data3[i], y: data1[i]})
        i++;
    });
   
    data2.sort(function (a, b) {
  return b.y - a.y;});
    

    var res =[];
    for (i=0 ; i<10;i++){
        res.push(data2[i]);
    }
    
    return res;
}

function getArrond(e){
    if(e.length == 5 && e[0] !=0 )
        return e.slice(0,2);
    if(e.length == 5 && e[0] ==0 )
        return e[1];
    else if(e.length==4)
        return e[0];
    else return -1;
}

