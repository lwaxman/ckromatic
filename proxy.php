<?php
	// echo "i'm php!";
	// print_r($_GET);
	header('Content-Type: image/jpeg');
	readfile($_GET['src']);

?>
