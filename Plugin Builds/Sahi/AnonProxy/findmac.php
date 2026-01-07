<?php

include('cache/config.php');
include_once('general.php');


function findMACAddress() {
	echo "<table class='pps_table'><tr><th>Mac address</th><tr><td><center>";

	$ip=$_REQUEST['ip'];
	if($ip == "") { $ip=$SERVER['REMOTE_ADDR']; }

	if(!($in=fopen("/proc/net/arp","r"))) {
		echo "Could not open arp table\n";
		return false;
	}
	while(($line=fgets($in))!==false) {
		if(preg_match('#^(\S+)\s+(\S+)\s+(\S+)\s+(\S+)#',$line,$lineArr)) {
			if($lineArr[1]==$ip) {
				echo "MAC Address for $ip: <font class='largef'>$lineArr[4]</font>";
			}
		}
	}
	fclose($in);
echo <<<EOF
<form >
IP address: <input name='ip' />
<br />
<input type='submit' value="Find mac address" />
</form>
EOF;
	echo "</td></table>";
	return true;
}

printHeader();
menu();
findMACAddress();
printFooter();

?>

