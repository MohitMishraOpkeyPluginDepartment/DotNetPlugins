<?php

include('cache/config.php');
include_once('general.php');
include_once('startstop.php');




printHeader();
$finalMess=start();
menu();
echo $finalMess;
printFooter();

?>
