<?php

	$bdd = NULL;

	function connectBD(){
		global $bdd;
		$bd = 'florentihqdb';
		$user = 'florentihqdb';
		$passwd = 'Flomatluc3';
		$host = 'florentihqdb.mysql.db';
		$bdd = mysqli_connect($host ,$user ,$passwd, $bd);
		mysqli_set_charset($bdd, "utf8");
		if(mysqli_connect_errno()){ 
			printf("Echec de la connexion : %s\n" , mysqli_connect_error ());
			exit();
			}
	}


	function deconnectBD() {
		global $bdd;
		mysqli_close($bdd);
	}
?>