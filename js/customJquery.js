$(document).ready(function() {
	/* évenements pour le bouton d'actualisation*/ 
	$('#buildgeo').click(function(){
		if (typeof mymap !== "undefined") {mymap.off();mymap.remove(); }
		reloadMapContainer();
		generateMap();
	})
	/* Nouvel onglet */
	$('#newtab').click(function(){
		window.open("controleur/cartefull.php");
	})
	/* Switch entre version data et la carte */
	$('#checkbox1').change(function() {
		if(this.checked) {
			reloadMapContainer();
			generateMap();
			$('#lisearch').remove();
		}else{
			$.ajax({
				type: "GET",
				url : "modele/tableau.php",
				success : function(data){
					document.getElementById("map").innerHTML = "";
					$('#listetools').append("<li id=\"lisearch\"><a><input id=\"searchinput\" style=\"background-image: url('vue/search_icon.png');background-position: 5% 50%;background-repeat: no-repeat;padding-left: 20%;border-radius: 10px;\" type=\"text\" id=\"myInput\" placeholder=\"Recherche...\" class=\"form-control\" onkeyup=\"filtre()\"></a></li>");
					$('#map').append(data);
				}
			});
		}
	})
	/* évenements pour le bouton d'itinéraire */
	$('#newitineraire').click(function() {
		if($('input[name=x1]').get(0) == null){
			$('#listetools').append("<li class=\"coordonnees\"><a> X :<input type=\"text\" name=\"x1\" style=\"float:right\"></a><a>Y :<input type=\"text\" name=\"y1\" style=\"float:right\"></a></li>");
			$('#listetools').append("<li class=\"coordonnees\"><a> X :<input type=\"text\" name=\"x2\" style=\"float:right\"></a><a>Y :<input type=\"text\" name=\"y2\" style=\"float:right\"></a></li>");
		}
	})
		
	var getGif = function() {
		var gif = [];
		
		$('#archives img').each(function() {
			var data = $(this).data('alt');
			gif.push(data);
		});

		return gif;
	}
	
	var gif = getGif();

	// Preload les gif pour que ce soit instantané.
	var image = [];
	
	$.each(gif, function(index) {
		image[index]     = new Image();
		image[index].src = gif[index];
	});
	
	// Changer les images en gif et vice versa.

	$('figure').on('click', function() {
		
		var $this   = $(this),
		
		$index  = $this.index(),
		$img    = $this.children('img'),
		$imgSrc = $img.attr('src'),
		$imgAlt = $img.attr('data-alt'),
		$imgExt = $imgAlt.split('.');
		
		if($imgExt[1] === 'gif') {
			$img.attr('src', $img.data('alt')).attr('data-alt', $imgSrc);
		} else {
			$img.attr('src', $imgAlt).attr('data-alt', $img.data('alt'));
		}
	});
    
    /* Responsive du bandeau des outils */
	$('#carte .navbar-toggle').click(function () {
        $('#carte .navbar-nav').toggleClass('slide-in');
        $('#carte .side-body').toggleClass('body-slide-in');
        $('.absolute-wrapper').toggleClass('slide-in');  
	});
});