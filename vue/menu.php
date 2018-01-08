<div id="menu" class="container"> <!-- Menu bootstrap adapté à nos besoins -->
  <nav class="navbar navbar-default navbar-fixed-top">
    <div class="container" id="navComplete">
      <div class="navbar-header">
        <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#navfull">
          <span class="sr-only">Toggle navigation</span>
          <span class="icon-bar"></span>
          <span class="icon-bar"></span>
          <span class="icon-bar"></span>
        </button>
        <a class="navbar-brand" href="index.php"><img class="logo-menu" src="vue/brand.png" alt="Datamaps"></a>
      </div>
      <div id="navfull" class="navbar-collapse collapse">
        <ul class="nav navbar-nav firstul">
          <li <?php if (isset($_GET['page']) && $_GET['page'] == "controleur/accueil.php") {echo 'class ="here"';} ?>><a href="index.php?page=controleur/accueil.php">Accueil</a></li>
          <li <?php if (isset($_GET['page']) && $_GET['page'] == "vue/apropos.php") {echo 'class ="here"';} ?>><a href="index.php?page=vue/apropos.php">A propos</a></li>
		      <li <?php if (isset($_GET['page']) && $_GET['page'] == "controleur/carte.php") {echo 'class ="here"';} ?>><a href="index.php?page=controleur/carte.php">La carte</a></li>
        </ul>
        <ul class="nav navbar-nav navbar-right secondul">
		      <li <?php if (isset($_GET['page']) && $_GET['page'] == "controleur/archives.php") {echo 'class ="here"';} ?>><a href="index.php?page=controleur/archives.php" class="archives"> Archives</a></li>
          <li <?php if (isset($_GET['page']) && $_GET['page'] == "controleur/graphes.php") {echo 'class ="here"';} ?>><a href="index.php?page=controleur/graphes.php" class="graphes"> Graphes</a></li>
		      <li <?php if (isset($_GET['page']) && $_GET['page'] == "controleur/statistiques.php") {echo 'class ="here"';} ?>><a href="index.php?page=controleur/statistiques.php"> Statistiques</a></li>
        </ul>
      </div>
    </div>
  </nav>
</div>