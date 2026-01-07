<html>
<link rel='stylesheet' href='anon_proxy_server.css' />
<head>
<title>Anon Proxy Server - Check DNS</title>
</head>
<body>
<center><img src='img/anon_proxy_server.jpg' border='0' /><p />
<?php


function printDNSTable($dnsHost,$ns) {
	$nsArr=explode("\n",$ns);
	echo "<table class='pps_table'><tr><th colspan='2'>Name servers</th>";
	echo "<tr><td colspan='2' class='largef'>$dnsHost</td>";
	system("dig >/dev/null",$digRet);
	if($digRet==0) {
		$useDig=1;
	}
	foreach ($nsArr as $n => $nsLine) {
		$rspace=strrpos($nsLine," ");
		if($rspace===false) {  continue; }
		$dnsServer=rtrim(substr($nsLine,$rspace+1));

		if($useDig) {
			$pingRet=shell_exec("dig ".escapeshellarg("@$dnsServer")." ".escapeshellarg($dnsHost)." ns +time=3 +retry=1 +noauthor | grep 'IN NS'"); $pingRet=$pingRet != ""?0:1;
		} else {
			// 'ping -w' doesn't stop on bad lookups from within php
			// 'host' has no timeout option
			system("host -t NS ".escapeshellarg($dnsHost)." ".escapeshellarg($dnsServer)." >/dev/null",$pingRet);
#			system("ping -c 1 -w 1 ".escapeshellarg($dnsServer)." >/dev/null",$pingRet);
		}
		echo "<tr><td class='etd'><a href='diagdns.php?host=$dnsServer'>$dnsServer</a>";
		echo "</td><td class='etd'><img src='img/";
		echo $pingRet==0?"tick":"cross";
		echo ".gif' /></td>";
	}
	echo "</table><br />";
}


function diagnoseDNS()
{
	$host=$_REQUEST['host'];
	if(extension_loaded("com_dotnet")) {
		echo <<<EOF
Normal dns checks are not available with windows.<br />
Forwarding you to other sites for dns checks...<br />
<iframe width='100%' height='40%' src="http://www.dnsreport.com/tools/dnsreport.ch?domain=$host"></iframe>
<iframe width='100%' height='40%' src="http://www.dnsstuff.com/tools/whois.ch?ip=$host"></iframe>
EOF;
//http://www.checkdns.net/quickcheck.aspx?domain=$host&detailed=1
		return;
	}
	if($host != "") {
		// look up dns
		$dnsHost=$host;
		$whois=isset($_REQUEST['whois'])?$_REQUEST['whois']:0;
		while(1) {
			$dot=strpos($dnsHost,".");
			if($dot===false) { 
				// don't do top level domain
				break; 
			}
			$ns=shell_exec("host -t NS ".escapeshellarg($dnsHost)." | grep 'name server'");
			if($ns != "") { 
				break; 
			}

			$dot=strpos($dnsHost,".");
			if($dot===false) { 
				break; 
			}
			$dnsHost=substr($dnsHost,$dot+1);
		}

		if($ns != "") {
			printDNSTable($dnsHost,$ns);
		} else { $whois=1; }
		if($whois) {
			echo "<table class='pps_table'><tr><th>Whois</th><tr><td><pre>";
			// look up whois
			$whois=shell_exec("whois ".escapeshellarg($dnsHost));
			echo $whois;
			echo "</pre></td></table><br />";
		}
	}

echo <<<EOF
<form>
<table class='pps_table'><tr><th>Pick a host</th><tr><td>
Domain name: <input name='host' size='50' value="$host" /><br />
<input type='checkbox' name='whois' value='1' />Use whois<br />
<center>
<input type='submit' value="Check DNS" />
</center>
</td></table>
</form>
EOF;
}

diagnoseDNS();

?>
</body>
</html>
