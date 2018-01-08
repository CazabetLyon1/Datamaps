<div id="carte" class="row">
    <div class="side-menu"> <!-- Barre de menu de gauche -->
    
    	<nav class="navbar navbar-default" role="navigation">
    	<!-- Le logo et le menu se groupent pour une meilleur ergonomie mobile -->
			<div class="navbar-header">
				<div class="brand-wrapper">
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
				<ul class="nav navbar-nav" id="listetools" style="max-height: calc(100vh - 200px); overflow: auto;">

					<li><a href="#" id="buildgeo"><i class="fa fa-refresh fa-lg"></i> Actualisation</a></li>
					<li><a href="#" id="newtab"><i class="fa fa-external-link fa-lg"></i> Nouvel onglet</a></li>
					<li><a><i class="fa fa-globe fa-lg"></i> Carte <label class="switch"><input type="checkbox" id="checkbox1" checked="checked"><span class="slider round"></span></label></a></li>
					<li><a><i class="fa fa-arrows fa-lg"></i> Relations <label class="switch"><input type="checkbox" id="checkbox2" checked="checked"><span class="slider round"></span></label></a></li>
					<li><a href="#" id="newitineraire"><i class="fa fa-map-marker fa-lg"></i> Itinéraire</a></li>
				</ul>
			</div>
		</nav>
    </div>

    <!-- Contenu principal, la carte -->
    <div class="container-fluid">
        <div class="side-body">
		   <div id="map">
				<img class="load-delay" src="vue/loading.gif" style="background:url(vue/emptyfond.png);max-width: 100%; height: calc(100vh - 100px);position: relative; box-shadow: 10px 10px 5px grey;"/>
		   </div>
		</div>
    </div>
</div>