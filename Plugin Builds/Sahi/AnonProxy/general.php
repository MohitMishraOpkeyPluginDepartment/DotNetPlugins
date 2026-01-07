<?php


$startWanted="cache/startWanted.txt";


// is_writable don't work in windows php
function isWritableFile($file) {
	$err=ini_get("error_reporting");
	error_reporting(0);
	$r=1;
	if(($fd=fopen($file,"ab"))===false) {
		$r=0;
	} else { fclose($fd); }
	error_reporting($err);
	return $r;
}

function isWritableDir($dir) {
	$err=ini_get("error_reporting");
	error_reporting(0);
	$r=1;
	if(mkdir("$dir/scrap")===false) { $r=0; }
	else { rmdir("$dir/scrap"); }
	error_reporting($err);
	return $r;
}


function getScriptPath() {
	$script_path=$_SERVER['SCRIPT_FILENAME'];
	return substr($script_path,0,strrpos($script_path,"/"));
}

function htmlspecialchars2($str) {
	return addslashes(htmlspecialchars($str));
}

function addslashes1($str) {
	$str=str_replace("\\","\\\\",$str);
	return str_replace("'","\'",$str);
}
function addslashes2($str) {
	return str_replace('"','\\"',$str);
}


function printHeader() {
	echo <<<EOF
<html>
<link rel='stylesheet' href='anon_proxy_server.css' />
<head>
<title>Anon Proxy Server</title>
</head>
<body>
<table width='100%' border='0'><tr><td class='etd' valign='top'>
EOF;
}

function printFooter() {
	echo <<<EOF
</td></table>

</body></html>
EOF;
}

function menu() {
	global $config;
	echo "<table class='pps_table'><tr><td><a href=\"index.php\"><img border='0' src='img/anon_proxy_server_150.jpg' /></a></td><tr><td class='largef'><center>";
	$isRunning=getRunningPid();

	if($config['configured'] || $_REQUEST['save']) {
		echo "<a href=\"".($isRunning?"stop":"start").".php\"><img src='img/power_".($isRunning?"on":"off").".jpg' border='0' /><br />".($isRunning?"Stop":"Start")."</a><br />";
		if($isRunning) {
			// just incase we're not really running
			echo "<a href=\"start.php\">Restart</a><br />";
		}
	}
	echo <<<EOF
</center></td></tr>
<tr><td class='largef'>
<a href="index.php?">Configure</a>
<br />
<br />
</td>
EOF;
	echo <<<EOF
<tr><th>Info</th></tr>
EOF;
	if($isRunning) {
		echo <<<EOF
<tr><td class='largef'>
<a href="stats.php?type=gen">Stats</a>
</td></tr>
<tr><td class='largef'>
<a href="connstats.php">Connections</a>
</td></tr>
EOF;
	}
		echo <<<EOF
<tr><td class='largef'>
<a href="log.php">Usage Log</a>
</td></tr>
<tr><td class='largef'>
<a href="logerror.php">Error Log</a>
</td></tr>
<tr><td class='largef'>
<a href="proxy_instructions.php">Instructions</a>
</td></tr>
<tr><td class='largef'>
<a href="http://anonproxyserver.sourceforge.net/doc.html">Documentation</a>
</td>
</table>
</td><td class='etd' valign='top' width='100%'>
<center>
EOF;
}


function getRunningPid() {
	global $config;
	$pidFile="cache/".$config['pid_file'];
	clearstatcache();
	if(!is_file($pidFile)) { return false; }
	if(($pidh=fopen($pidFile,"r"))) {
		$pid=fgets($pidh);
		fclose($pidh);
		return $pid;
	}
	return false;
}

function sendInternalCmd($cmd) {
	global $config;
	$pid=getRunningPid(); if(!$pid) { return false; }
	$serverFd=fsockopen("localhost",$config['port']);
	if($serverFd) {
		fwrite($serverFd,"GET http://anon_proxy_server/$cmd HTTP/1.0\r\n\r\n");
		$line=fgets($serverFd);
		$space1=strpos($line," ");
		$space2=strpos($line," ",$space1+1);
		$status=intval(substr($line,$space1,$space2));
		$mess=substr($line,$space2);
		fclose($serverFd);
		return $mess;
	}
	return false;
}


function secsToStr($secs) {
	$secs=intval($secs);
	if($secs>=(60*60*24)) {
		$days=intval($secs/(60*60*24));
		return sprintf("%u day%s, %02u:%02u:%02u",
			$days,$days>1?"s":"",
			($secs/60/60)%24,($secs/60)%60,$secs%60);
	}
	if($secs<60) {
		return sprintf("%02u",$secs%60);
	}
	if($secs<(60*60)) {
		return sprintf("%02u:%02u",($secs/60)%60,$secs%60);
	}
	return sprintf("%02u:%02u:%02u",($secs/60/60)%60,($secs/60)%60,$secs%60);
}

function hexTimeToStr($logTime) {
	$curTime=time();
	$logTime=intval($logTime,16);
	if($logTime>=($curTime-(60*60*24*6))) {
		$timeStr=strftime("%a %H:%M:%S",$logTime);
	} else {
		$timeStr=strftime("%d/%b/%Y %H:%M:%S",$logTime);
	}
	return $timeStr;
}

function useMACAddress() {
	clearstatcache();
	return is_readable("/proc/net/arp");
}


function getRegisterProxyStr() {
	global $config;
	$homeBase=$config['anonProxyHomeBase'];
	$anonPort=$config['anonPort'];
	$reRegister="<a href=\"registerProxy.php\">Click here to re-register.</a><br />";
	if($config['anonProxy']) {
		$reRegister.="<a href='$homeBase/anon.php?proxyPort=$anonPort'>Check if your proxy is accessable from the home base.</a><br />";
	}
	return $reRegister;
}


function printPacMess($pacUrl=null) {
	global $config;
	if($pacUrl==null) {
		if($config['ourUrl'] == "") {
			$config['ourUrl']=$_REQUEST['ourUrl'];
		}
		$pacUrl=$config['ourUrl']."pac.php";
	}
	echo <<<EOF
Use this url for your browser's automatic proxy configuration...<br /><a href="$pacUrl">$pacUrl</a><p />
Afterwards you can check your ip address <a href="http://www.danasoft.com/vipersig.jpg">here</a>
<p />
EOF;
}


$dowToText=array('Sun','Mon','Tue','Wed','Thu','Fri','Sat');

function dowFunc($num)
{
	global $dowToText;
	return $dowToText[$num];
}


?>
