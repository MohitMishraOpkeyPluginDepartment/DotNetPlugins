<?php


include_once("general.php");

$regoFile="cache/anonProxys.lst";

// these number must be changed at pserver.c if it is changed here..
$proxyItemLen=16;
$proxyRegisterSecs=6*60;
$proxysPerDownload=16;

//function testServer($ip,$port,$key) {
//	if(!($fd=fsockopen($ip,$port,$errno,$errstr,15))) {
//		fwrite($fd,sprintf("GET http://anon_proxy_server/pinganon/%08x HTTP/1.0\n\n",$key));
//		$str=fread($fd,1000);
//		fclose($fd);
//		if(substr($str,strpos($str," ")+1,3)==200) { return 1; }
//	}
//	return 0;
//}

function testServerSSL($ip,$port,$key) {
	if(!($fd=fopen(sprintf("https://$ip:$port/http://anon_proxy_server/pinganon/%08x",$key),"r"))) {
		return 0;
	}
	fwrite($fd,"\n\n\n");
	$str=fread($fd,1000);
	fclose($fd);
	if(substr($str,0,6)=="pinged") { return 1; }

	return 0;
}

// test only the server's port
function testServerPort($ip,$port) {
	if(!($fd=fopen("https://$ip:$port/http://anon_proxy_server/ping","r"))) {
		return 0;
	}

//	if(!($fd=fsockopen($ip,$port,$errno,$errStr,15))) {
//		return 0;
//	}
//	fwrite($fd,"GET http://anon_proxy_server/ping HTTP/1.0\n\n");
	$str=fread($fd,1000);
	fclose($fd);
	if(substr($str,0,4)=="HTTP" || strstr($str,"pinged")>=0) {
		return 1;
	}
	return 0;
}


function registerServer() {
	global $regoFile;
	global $proxyItemLen;
	global $proxyRegisterSecs;
	global $config;
	include "cache/config.php";


	$ip=$_SERVER['X_FORWARDED_FOR'];
	if(!isset($ip)) {
		$ip=$_SERVER['REMOTE_ADDR'];
	}

	if($ip == "127.0.0.1" && isset($_REQUEST['printProxys'])) {
		printProxys();
		return 0;
	}

	if(!isset($_REQUEST['port'])) {
		$proxyPort=$_REQUEST['proxyPort'];
		echo <<<EOF
<link rel='stylesheet' href="anon_proxy_server.css">
<center>
<table class='pps_table'>
<tr><th>Check if your proxy is accessable...</th>
<tr><td>
<center>
<form method='get'>
<br />
Port: <input name='port' size='5' value='$proxyPort' />
<br />
<input type='hidden' name='check' value='1' />
<input type='submit' value="Check your proxy" />
</form>
</center>
</td>
</table>
</center>
EOF;
		return 0;
	}

	$port=$_REQUEST['port'];
	if(isset($_REQUEST['check'])) {
		$err=ini_get("error_reporting");
		error_reporting(0);
		printHeader();
		echo <<<EOF
<center>
<table class='pps_table'>
<tr><th>Proxy Access</th></tr>
<tr><td>
EOF;
		if(!testServerPort($ip,$port)) {
			header("HTTP/1.0 500 Not accessable");
			echo "You are not accessable on $ip:$port";
		} else {
			echo "Your proxy is accessable on $ip:$port";
		}
		echo "</td></tr></table></center>";
		printFooter();
		return 0;
	}
	if(!isset($_REQUEST['key'])) {
		header("HTTP/1.0 500 Must mention a key");
	}

	// stupid intval won't do unsigned numbers
	$keyNum=(intval(substr($_REQUEST['key'],0,4),16)<<16) |
		intval(substr($_REQUEST['key'],4,4),16);

	$err=ini_get("error_reporting");
	error_reporting(0);
	if(!testServerSSL($ip,$port,$keyNum)) {
		header("HTTP/1.0 500 you are not accessable on $ip:$port");
		echo "Cannot register, proxy is not accessable on $ip:$port";
		return 0;
	}

	$packedIp=pack("NnnNN",ip2long($ip),$port,0,$keyNum,intval(time()));
	if(!($fd=fopen($regoFile,"a+b"))) {
		header("HTTP/1.0 500 Could not open rego file");
		echo "Could not open rego file:$regoFile";
		return 0;
	}
	flock($fd,LOCK_EX);
	fseek($fd,-$proxyItemLen,SEEK_END);
	$lastIp=fread($fd,$proxyItemLen);
	$lastTime=unpack("N",substr($lastIp,12,4));
	if(substr($packedIp,0,6)!=substr($lastIp,0,6) || substr($packedIp,8,4)!=substr($lastIp,8,4)) {
		// don't let em register two times in a row 
		fseek($fd,0,SEEK_END);
		fwrite($fd,$packedIp,$proxyItemLen);
	}


	global $proxyItemLen;
	global $proxysPerDownload;
	$proxyListLen=$proxysPerDownload*$proxyItemLen;

	$packedHeader=pack("NNNN",12,time(),ip2long($ip),$proxyListLen);
	echo $packedHeader;
	printProxyList($fd);

	flock($fd,LOCK_UN);
	fclose($fd);
	return 1;
}

function printProxys() {
	global $proxyItemLen;
	global $regoFile;

	if(!($fd=fopen($regoFile,"rb"))) {
		header("HTTP/1.0 500 Could not open rego file");
		echo "Could not open rego file:$regoFile";
		return 0;
	}
	echo "<table border='1'>";
	$lines=array();
	while(true) {
		$contents=fread($fd,$proxyItemLen);
		if($contents===false || strlen($contents)<=0) {
			break;
		}
		$arr=unpack("Nip/nport/cfails/cspare/Nkey/Ntime",$contents);
		$arr2=array(
			long2ip($arr['ip']),
			$arr['port'],
			sprintf('%08x',$arr['key']),
			strftime("%d/%b/%Y %H:%M:%S",$arr['time'])
		);
		array_push($lines,"<tr><td>".join("</td><td>",$arr2)."</td></tr>");
	}
	$lines=array_reverse($lines);
	echo join('',$lines);
	echo "</table>";
	fclose($fd);
}

function printProxyList($fd) {
	global $proxyItemLen;
	global $proxysPerDownload;

	$proxyListLen=$proxysPerDownload*$proxyItemLen;
	fseek($fd,0,SEEK_END);
	$totalLen=ftell($fd);
	if($totalLen>$proxyListLen) { $len=$proxyListLen; }
	else { $len=$totalLen; }
	fseek($fd,-$len,SEEK_END);

	// skip the last one that's probably the current web server.
	if($len>$proxyItemLen) {
		$str=fread($fd,$len-$proxyItemLen);
		echo $str;
	}

	if($totalLen>=($proxyItemLen*256)) {
		// prune regoFile once in a while.
		fseek($fd,-$len,SEEK_END);
		$str=fread($fd,$len);
		fseek($fd,0,SEEK_SET);
		ftruncate($fd,0);
		fwrite($fd,$str);
	}
}

registerServer();


?>
