<div id="carte" class="row">
    <!-- uncomment code for absolute positioning tweek see top comment in css -->
    <!-- <div class="absolute-wrapper"> </div> -->
    <!-- Menu -->
    <div class="side-menu">
    
    	<nav class="navbar navbar-default" role="navigation">
    	<!-- Brand and toggle get grouped for better mobile display -->
			<div class="navbar-header">
				<div class="brand-wrapper">
					<!-- Hamburger -->
					<button type="button" class="navbar-toggle">
						<span class="sr-only">Toggle navigation</span>
						<span class="icon-bar"></span>
						<span class="icon-bar"></span>
						<span class="icon-bar"></span>
					</button>
			
					<!-- Brand -->
					<div class="brand-name-wrapper">
						<a class="navbar-brand" href="#"> <i class="fa fa-lg fa-wrench"></i><b> Outils </b></a>
					</div>
				</div>
			</div>

			<!-- Main Menu -->
			<div class="side-menu-container">
				<ul class="nav navbar-nav" id="listetools">

					<li><a href="#" id="buildgeo"><i class="fa fa-refresh fa-lg"></i> Actualisation complète</a></li>

					<!-- Dropdown-->
					<!--<li class="panel panel-default" id="dropdown">
						<a data-toggle="collapse" href="#dropdown-lvl1">
							<i class="fa fa-dashboard fa-lg"></i> Type de carte <span class="caret"></span>
						</a>

						<div id="dropdown-lvl1" class="panel-collapse collapse">
							<div class="panel-body">
								<ul class="nav navbar-nav">
									<li><label for='streets' id='streets'>Détails des rues</label></li>
									<li><label for='light' id='light'>Claire</label></li>
									<li><label for='dark' id='dark'>Fonçé</label></li>
									<li><label for='satellite' id='satellite'>Satellite</label></li>
								</ul>
							</div>
						</div>
					</li>-->
					<li><a href="#" id="newtab"><i class="fa fa-external-link fa-lg"></i> Nouvel onglet</a></li>
					<li><a><i class="fa fa-globe fa-lg"></i> Carte <label class="switch"><input type="checkbox" id="checkbox1" checked="checked"><span class="slider round"></span></label></a></li>
					<li><a href="#" data-toggle="modal" data-target="#modaltrajet" id="trajet"><i class="fa fa-road fa-lg"></i> Trajets</a></li>
					<li><a href="#" id="newitineraire"><i class="fa fa-map-marker fa-lg"></i> Itinéraire</a></li>
				</ul>
			</div><!-- /.navbar-collapse -->
		</nav>
    </div>

	<div class="modal fade" id="modaltrajet" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
  		<div class="modal-dialog" role="document">
    		<div class="modal-content">
    			<div class="modal-header">
        			<h3 class="modal-title" id="exampleModalLabel">Trajets !</h5>
        			<button type="button" class="close" data-dismiss="modal" aria-label="Close">
          				<span aria-hidden="true">&times;</span>
        			</button>
      			</div>
      			<div class="modal-body">
				  	<h4>Station 1</h4><br>
					<select name="trajet">
						<option value="">-----------------</option>
						<?php
							foreach($MesStationsVelov->getListeStations() as $key => $value){
								echo '<option value="'.$key.'">'.$MesStationsVelov->getAttribut($value,"nom").'</option>'; //close your tags!!
							}
						?>
					</select>
					<h4>Station 2</h4><br>
					<select name="trajet">
						<option value="">-----------------</option>
						<?php
							foreach($MesStationsVelov->getListeStations() as $key => $value){
								echo '<option value="'.$key.'">'.$MesStationsVelov->getAttribut($value,"nom").'</option>'; //close your tags!!
							}
						?>
					</select>
      			</div>
      			<div class="modal-footer">
        			<button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
        			<button type="button" class="btn btn-primary">Recherche</button>
      			</div>
    		</div>
		</div>
	</div>

    <!-- Main Content -->
    <div class="container-fluid">
        <div class="side-body">
		   <div id="map"></div>
		</div>
    </div>
</div>
<script>reloadMapContainer();generateMap();</script>