<?php

function getStatsArr() {
	global $config;
	$serverFd=fsockopen("127.0.0.1",$config['port'],$errno,$errStr,5);
	if(!$serverFd) {
		echo "Unable to connect to server";
		return false;
	}

	fwrite($serverFd,"GET http://anon_proxy_server/stats HTTP/1.0\r\n\r\n");
	$dataByType=array();
	while($line=fgets($serverFd)) {
		if(rtrim($line)=="") { break; }
	}
	while($line=fgets($serverFd)) {
		$line=rtrim($line);
		$lineArr=explode(",",$line);
		if(!isset($dataByType[$lineArr[0]])) { $dataByType[$lineArr[0]]=array(); }
		if(isset($dataByType[$lineArr[0]][$lineArr[1]])) { continue; }
		$dataByType[$lineArr[0]][$lineArr[1]]=array_slice($lineArr,2);
	}
	fclose($serverFd);
	return $dataByType;
}


?>
