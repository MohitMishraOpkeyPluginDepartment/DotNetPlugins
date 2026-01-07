<?php

include('cache/config.php');
include_once('general.php');

function printErrorLogs() {
	$errorLog="cache/anon_proxy_server.log";
	if(($fd=fopen($errorLog,"rb"))===false) {
		echo "cannot open error log: $errorLog\n";
		return 0;
	}
	fseek($fd,-10000,SEEK_END);
	fgets($fd);
	$lines=array();
	while(($line=fgets($fd))!==false) {
		$lineArr=explode(":",$line,2);
		array_push($lines,$lineArr);
	}
	$linesDone=0;
	echo "<table class='pps_table'><tr><th colspan='2'>Errors</th>\n";
	for($i=count($lines)-1; $i>=0; $i--) {
		$lineArr=$lines[$i];
		$timeStr=hexTimeToStr($lineArr[0]);
		echo "<tr><td class='totalnums' nowrap>$timeStr</td><td class='smallf'>".htmlspecialchars($lineArr[1])."</td>\n";
		$linesDone++;
	}
	if($linesDone==0) {
		echo "<tr><td colspan='2'>No errors yet<meta http-equiv='refresh' content='10' /></td>";
	}
	echo "</table><p />\n";
	return 1;
}


printHeader();
menu();
printErrorLogs();
printFooter();

?>

