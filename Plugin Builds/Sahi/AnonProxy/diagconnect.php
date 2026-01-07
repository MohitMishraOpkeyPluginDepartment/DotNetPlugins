<html>
<link rel='stylesheet' href='anon_proxy_server.css' />
<head>
<title>Anon Proxy Server - diagnose connection</title>
</head>
<body>
<center><img src='img/anon_proxy_server.jpg' border='0' /><p />
<?php


function diagnoseConnect()
{
	$host=$_REQUEST['host'];
	$port=$_REQUEST['port'];
	if($host != "") {
		echo "<table class='pps_table'><tr><th colspan='2'>Connection</th>";
		echo "<tr><td colspan='2' class='largef'>$host</td>";
		echo "<tr><td><pre>";

		set_time_limit(120);
		if(extension_loaded("com_dotnet")) {
			system("tracert.exe ".escapeshellarg($host));
		} else {
			system("/usr/sbin/tcptraceroute 127.0.0.1 >/dev/null",$tcpRet);
			if($tcpRet==0) {
				system("/usr/sbin/tcptraceroute -p ".escapeshellarg($port)." ".escapeshellarg($host));
			} else {
				system("/usr/sbin/traceroute ".escapeshellarg($host));
			}
		}
		echo "</pre></td>";
		echo "</table><br />";
	}

echo <<<EOF
<form>
<table class='pps_table'><tr><th>Pick a host</th><tr><td>
Domain name: <input name='host' size='50' value="$host" /><br />
<center>
<input type='submit' value="Check Connection" />
</center>
</td></table>
</form>
EOF;
}

diagnoseConnect();

?>
</body>
</html>
