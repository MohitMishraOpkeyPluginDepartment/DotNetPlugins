<html>
<link rel='stylesheet' href='anon_proxy_server.css' />
<head>
<title>Anon Proxy Server</title>
</head>
<body>
<center>
<img src='img/anon_proxy_server.jpg' />
<p />
<?php

include("cache/config.php");

function printPacMess($pacUrl) {
	echo "Use this url for your browser's automatic proxy configuration...<br /><a href=\"$pacUrl\">$pacUrl</a><p />";
}
printPacMess($config['ourUrl']."pac.php");




function printIEInstructions() {
	echo <<<EOF
<h1>Internet Explorer</h1>
<img src='img/ie_proxy0.jpg' />
<p />
<table border='0'><tr><td class='etd'>
Which button you click here depends on whether you...
<br />
* have to dialup to use the internet(adsl/56k) click <b>Settings</b><br />
* have the internet via LAN(router/cable) click <b>LAN Settings</b> <br
<br />
No harm setting the proxy on all, make sure you picked your connection
before clicking on "Settings"
</td></tr></table>
<p />
<img src='img/ie_proxy1.jpg' />
<p />
<img src='img/ie_proxy2.jpg' />
<p />
EOF;
}
function printFireFoxInstructions() {
	echo <<<EOF
<h2>FireFox</h2>
<img src='img/firefox_proxy1.jpg' />
<p />
<img src='img/firefox_proxy2.jpg' />
<p />
EOF;
}

function stripos1($h,$need,$off=0) {
	return(strpos(strtolower($h),strtolower($need),$off));
}

$printed=0;
if(isset($_REQUEST['userAgent'])) {
	$userAgent=$_REQUEST['userAgent'];
} else if(isset($_SERVER['HTTP_USER_AGENT'])) {
	$userAgent=$_SERVER['HTTP_USER_AGENT'];
}

if(stripos1($userAgent,"Firefox")!==false) {
	$instructions='printFireFoxInstructions';
} else if(stripos1($userAgent,"IE")!==false) {
	$instructions='printIEInstructions';
}

if(isset($instructions)) {
	echo <<<EOF
<a href='proxy_instructions.php?userAgent=IE'>Internet Explorer</a>
&nbsp;|&nbsp;
<a href='proxy_instructions.php?userAgent=Firefox'>Firefox</a>
<p />
EOF;

	$instructions();

} else {
	// print both instructions since
	printIEInstructions();
	echo "<hr />";
	printFireFoxInstructions();
}

?>
