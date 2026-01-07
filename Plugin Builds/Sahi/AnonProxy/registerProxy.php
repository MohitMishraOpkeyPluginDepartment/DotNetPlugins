<?php

include('cache/config.php');
include_once('general.php');


function registerProxy()
{
	$mess=sendInternalCmd("registerProxy");
	if($mess!==false) {
		echo $mess;
		?><meta http-equiv='refresh' content='20; URL=stats.php?type=gen' /><?php
	} else  {
		echo "failed";
	}
}


printHeader();
menu();
registerProxy();
printFooter();

?>

