<?php
	include('modele/Liste_stations.php');
	$MesStationsVelov = new ListeStations ();
?>
<!DOCTYPE html>
<html lang="en">
	<head>
		<title>Datamaps</title>
		<meta charset="utf-8">
		<meta http-equiv="X-UA-Compatible" content="IE=edge">
		<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
		<link rel="shortcut icon" href="vue/favicon.ico">
		<link href="css/bootstrap.min.css" rel="stylesheet">
		<link rel="stylesheet" href="font-awesome-4.7.0/css/font-awesome.min.css">
		<link href="css/custom.css" rel="stylesheet">
        <link href="css/nv.d3.min.css" rel="stylesheet">
		<link href='https://api.mapbox.com/mapbox-gl-js/v0.40.0/mapbox-gl.css' rel='stylesheet' />
		<link rel="stylesheet" href="https://unpkg.com/leaflet@1.2.0/dist/leaflet.css" integrity="sha512-M2wvCLH6DSRazYeZRIm1JnYyh22purTM+FDB5CsyxtQJYeKq83arPe5wgbNmcFXGqiSH2XR8dT/fJISVA1r/zQ==" crossorigin=""/>
		<link href='https://api.mapbox.com/mapbox.js/plugins/leaflet-fullscreen/v1.0.1/leaflet.fullscreen.css' rel='stylesheet' />
		<link rel="stylesheet" href="css/styledLayerControl.css">
		<link rel="stylesheet" href="node_modules/leaflet-search/src/leaflet-search.css" />
		<script src="js/jquery.js"></script>
		<script src="js/bootstrap.min.js"></script>
		<script src='https://api.mapbox.com/mapbox-gl-js/v0.40.0/mapbox-gl.js'></script>
		<script src="https://unpkg.com/leaflet@1.2.0/dist/leaflet.js" integrity="sha512-lInM/apFSqyy1o6s89K4iQUKg6ppXEgsVxT35HbzUupEVRh2Eu9Wdl4tHj7dZO0s1uvplcYGmt3498TtHq+log==" crossorigin=""></script>
		<script src='https://api.mapbox.com/mapbox.js/plugins/leaflet-fullscreen/v1.0.1/Leaflet.fullscreen.min.js'></script>
		<script src="js/styledLayerControl.js" type="text/javascript"></script>
		<script src="node_modules/leaflet-search/src/leaflet-search.js"></script>
		<script src="js/d3.min.js"></script>
		<script src="js/nv.d3.js"></script>
		<script type="text/javascript" src="js/custom.js"></script>
	</head>
	<body>
		<header role="banner">
			<?php include('vue/menu.php');?>
		</header><!-- /@banner -->
		<main role="main">
			<div class="contents">
				<?php
					$nomPage = 'controleur/accueil.php'; // page par défaut
					if(isset($_GET['page'])) {
						if(file_exists(addslashes($_GET['page'])) && addslashes($_GET['page']) != 'index.php')
							$nomPage = addslashes($_GET['page']);
					}
					include($nomPage);
				?>
			</div><!-- /.contents -->
		</main><!-- /@main -->
		<footer class="footer-distributed">
			<?php include('vue/pieddepage.php');?>
		</footer>
		<script src="js/customJquery.js"></script>
		<script src="js/jsFonctions.js"></script>
	</body>
</html>