<?php

include('cache/config.php');
include_once('general.php');
include_once('startstop.php');
include_once('WriteConfig.php');




function findBinary($paths,$bin) {
	foreach ($paths as $p) {
		$fullBin=$p."/".$bin;
		if(is_executable($fullBin)) {
			return $fullBin;
		}
	}
	return null;
}



function istype2operator($istype) {
	if($istype == "is not") { return "!="; }
	return "==";
}

function getNetworkMask($maskStr) {
	if(strpos($maskStr,".")) { return $maskStr; }
	$ipnum=0-(1<<(32-$maskStr));
	return long2ip($ipnum);
}
function getNetworkFromStr($str) {
	$arr=explode($str,"/");
	if(count($arr)>=2) {
		$arr[1]=getNetworkMask($arr[1]);
		return $arr; 
	}
	return Array($str,"255.255.255.255");
}

function checkConfig($title,$ok,$mess,$okmess="") {
	echo "<tr><td>$title</td><td align='left'><table border='0' cellspacing='0'><tr><td class='etd'><img src='img/".($ok?'tick':'cross').".gif' /></td><td class='etd'>";
	if(!$ok) {
		echo "<font color=#c00000>$mess</font>";
	} 
	echo $okmess;
	echo "</td></table></td>";
}

function printConfigTable() {
	global $config;
	echo "<table id='confTable' width='500' class='pps_table'><tr><th colspan='2'>Configuration</th>";
	if(extension_loaded("posix")) {
		$currentUser=posix_getpwuid(posix_getuid());
		$currentGroup=posix_getgrgid(posix_getgid());
		$group=$currentGroup['name'];
		$user=$currentUser['name'];
		$cachePermInstruct="Run <b>chmod -R 0777 cache</b> or if you have root permission use <b>chown -R $user cache</b>.\n";
		$configPermInstruct="Run <b>chmod -R 0777 cache/config.php</b> or if you have root permission use <b>chown $user cache/config.php</b>\n";
	} else {
		$cachePermInstruct="Make sure the web server can write to the cache folder and everything in it.\n";
		$configPermInstruct="Make sure the config.php file can be written by the web server";
	}

	global $startTestErrorLog;
	$pserverExecuteOk=startServer('-test');
//	$magicQuotesOk=get_magic_quotes_gpc()!=0;
	$configWritable=isWritableFile("cache/config.php");
	$cacheWritable=isWritableDir("./cache");
	if(!$configWritable || !$cacheWritable || !$pserverExecuteOk) {
//		checkConfig("magic quotes gpc",$magicQuotesOk,"Please, turn magic quotes on by adding a 'magic_quotes_gpc=On' line into php.ini <a href='phpinfo.php'>click here</a> to see your current php setup.\n");
		clearstatcache();
		checkConfig("Cache writable",$cacheWritable,$cachePermInstruct);
//	checkConfig("Write access: proxy_server.php",isWritableFile("./proxy_server.php"),"Type <b>chown $user proxy_server.php</b> to give the web server permission.\n");

		checkConfig("Write access: config.php",$configWritable,$configPermInstruct);
		checkConfig("Can execute proxy server",$pserverExecuteOk,htmlspecialchars(file_get_contents($startTestErrorLog)).'You may need to compile <b>pserver</b> for your machine.  Run <b>make</b> from the command line.');
	}
	$php_bin_found=$config['php_bin'];
	$paths=array('/usr/bin','/bin','/usr/bin','/usr/local/bin','/usr/local/sbin','/usr/local/samba/bin');
	if($php_bin_found==null) {
		$php_bin_found=findBinary($paths,'php');
	}
//	checkConfig("PHP binary",$php_bin_found==null?0:1,"Could not find php binary(optional)","<input name='php_bin' value=\"$php_bin_found\">");
	echo "<input type='hidden' name='php_bin' value=\"$php_bin_found\" />";


	if($config['ourUrl'] == "") {
		$slashPos=strrpos($_SERVER['SCRIPT_NAME'],"/");
;
		$config['ourUrl']="http://".$_SERVER['HTTP_HOST'].substr($_SERVER['SCRIPT_NAME'],0,$slashPos+1);
	}
	echo '<tr><td>Max MBs in cache:</td><td><input name="maxCacheMegs" size="7" value="'.addslashes2($config['maxCacheMegs']).'" /></td>';
	echo '<tr><td>Anon proxy:</td><td><input name="anonProxy" type="checkbox" value="1" onclick="checkAnonSettings()" '.($config['anonProxy']?" checked":"").' /><font class="smallf">You can see if it\'s working in the Info General area.  Do not use on a firewall unless the firewall\'s output to inside your network is blocked.</font></td>';

//This will join your proxy to the anonymous proxy list.  Let you use other people\'s proxys for anonymous browsing and lets others use your proxy for anonymous browsing.  To use it, add a url to go to "anon" in the access section.

	echo "</table><p />";


	echo "<div id='anonProxySettings'><table class='pps_table'><tr><th colspan='2'>Anon proxy settings</th>";
	echo <<<EOF
<tr><td>Home proxy:</td><td><input name='anonProxyHomeBase' value="{$config['anonProxyHomeBase']}" size='60' /><br /><font class='smallf'>Proxys using the same home can surf with each other's connection.</font></td>
EOF;
	echo <<<EOF
<tr><td>Proxy Timeout:</td><td><input name='anonProxyTimeout' value="{$config['anonProxyTimeout']}" size='3' /> seconds</td>
<tr><td>Max Proxy Fails:</td><td><input name='anonProxyMaxFails' value="{$config['anonProxyMaxFails']}" size='3' /> <font class='smallf'>Stops using a proxy after it has failed this many times.</font></td>
EOF;
//	echo '<tr><td>Must be anon:</td><td><input name='anonProxyFailAbort' type='checkbox' value='1' '.($config['anonProxyFailAbort']?" checked":"").' /><font class='smallf'>If not ticked, it will connect straight to the web site if all proxys failed.</font></td>';
	echo '<tr><td>Block intranet IPs:</td><td><input name="anonProxyBlockIntranet" type="checkbox" value="1" '.($config['anonProxyBlockIntranet']?" checked":"").' /><font class="smallf">Untick if you want to allow people to use your proxy to look at web sites in the networks: 10.0.0.0/8, 192.168.0.0/16</font></td>';
	echo '<tr><td>Anon Port:</td><td><input name="anonPort" size="5" value="'.addslashes2($config['anonPort']).'" /> <font class="smallf">This port must be accessable from the outside world.</font></td>';
	echo <<<EOF
</table><br />
</div>
EOF;



	echo "<table id='confTable' width='500' class='pps_table'><tr><th colspan='2'>Other Configuration</th>";
	echo '<tr><td>Url of this installation:</td><td><input name="ourUrl" size="60" value="'.addslashes2($config['ourUrl']).'" />';
	echo '</td>';
	echo '<tr><td>Proxy Port:</td><td><input name="port" size="5" value="'.addslashes2($config['port']).'" /> <font class="smallf">Use the same port for HTTP, HTTPS, SOCKS</font></td>';
	echo '<tr><td>Log size:</td><td><input name="maxLogFileSize" size="10" value="'.addslashes2($config['maxLogFileSize']).'">bytes, <input name="maxLogRotate" size="3" value="'.addslashes2($config['maxLogRotate']).'" />files. (set to 0 if you don\'t want logging)</td>';
	echo '<tr><td>Time out:</td><td><input name="timeOutSeconds" size="4" value="'.addslashes2($config['timeOutSeconds']).'"> seconds to wait for connection<br /><input name="dataTimeOutSeconds" size="4" value="'.addslashes2($config['dataTimeOutSeconds']).'" /> seconds to wait inbetween data.</td>';
//	echo '<tr><td>Debug level:</td><td><input name="debug" size="3" value="'.addslashes2($config['debug']).'" /></td>';
	// only used by php version...
	echo '<input type="hidden" name="debug" value="10" />';

//	$userAuthCmd=$config['userAuthCmd'];
//	if($userAuthCmd==null) {
//		$smbclient=findBinary($paths,'smbclient');
//		if($smbclient != "") {
//			$userAuthCmd="$smbclient //XXXX/NETLOGON -U '%s' '%s' -W '%s' -c quit";
//		}
//	}

//	echo '<tr><td>User auth command:</td><td><input name="userAuthCmd" size="50" value="'.addslashes2($userAuthCmd).'" /><br /><font class='smallf'>If this command returns 0 then the user is ok.<br />Use %s for the arguments in this order: User, Password, String From Config<br />This command is checked every 5 mins.</font></td>';

	echo "</table><br />";

	if(!$config['configured']) {
		echo "<h2>Check settings and click save to continue...</h2>";
	}
	echo "<input type='submit' value='Save' /><p />";


	echo <<<EOF
<script language='javascript'>

function checkAnonSettings() {
	var s=document.the_form["anonProxy"].checked;
	var aDiv=document.getElementById("anonProxySettings");
	aDiv.style.display=s?"block":"none";
}

checkAnonSettings();

</script>
EOF;


//	echo '<input name='userAuthCmd' type='hidden' value="'.addslashes2($userAuthCmd).'">';
	printPacMess();
}


// Check if we've configured it for the first time.
function checkFirstTimeStart() {
	global $config;
	if(isset($_REQUEST['save'])) {
		if(!$config['configured']) {
			// configured for the first time.
			start();
		}
	}
}


function printConfigErrors() {
	$rout=startServer("-testConfig");
	echo "<font class='error'>";
	foreach($rout as $routLine) {
		$routLine=preg_replace("/^[^:]*:/","",$routLine);
		echo "$routLine<br />";
	}
	echo "</font><br />";
}


function printConfig() {
	global $config;
	if(isset($_REQUEST['save'])) {
		$writeConfig=new WriteConfig();
		if(($ret=$writeConfig->write())===true) {
			// wait till pserver loads in the configuration...
			sleep(2);
			printConfigErrors();
			echo "Configured<br /><font class='smallf'>(Some configurations may require you to restart your browser)</font><p />";

			printPacMess();
		}
		return $ret;
	}
	echo "<form name='the_form' method='post'>";

	if(!$config['configured']) {
		printConfigTable();
	} else {
		// check the current configuration for errors
		printConfigErrors();
	}

	$extraStypes="";
	if(useMACAddress()) {
//~~~ i haven't tested mac addresses yet.
//		$extraStypes.='push(stype,"MAC Address");';
	}

	echo <<<EOF
<input type='hidden' name='save' value='1' />
<input type='hidden' name='configured' value='1' />
<input type='hidden' name='f' value='config' />
<input type='hidden' name='accessDivUpto' value='0' />
<table class='pps_table'><tr><th colspan='2'>Access</th>
<tr><td class='td2' align='left'><b>ACTION</b>(first match will be used)</td><td class='td2' style='text-align:right'><b>RULES</b> (any match will invoke ACTION)</td>
<tr><td colspan='2' align='center'>
<div id='access_div'></div>

<script type="text/javascript" src="config.js"></script>

<script type="text/javascript">

$extraStypes
access=new Array();

EOF;

	// write previous selection from config
	$accessUpto=0;
	$access_arr=$config['access'];
	foreach ($access_arr as $access) {
		echo <<<EOF
access[$accessUpto]=new Array(
new Array(
EOF;

		$accessp=$access[0];
		if($accessp) {
			$upto=0;
			foreach ($accessp as $p) {
				if($upto>0) { echo ","; }
				echo 'new Array("'.htmlspecialchars2($p[0]).'",'.
					'"'.htmlspecialchars2($p[1]).'","'.
					htmlspecialchars2($p[2])."\")";
				$upto++;
			}
		}

		echo '),"'.htmlspecialchars2($access[1]).'","'.htmlspecialchars2($access[2]).'");';
		$accessUpto++;
	}

	echo <<<EOF
accessDivUpto=0;
for(; access[accessDivUpto]; accessDivUpto++) {
	addAccessDiv(accessDivUpto,1);
	uLen=document.the_form["accessDivUrlsUpto"+accessDivUpto].value;
	for(var u=0; u<uLen; u++) {
		checkStype(accessDivUpto+"_"+u);
	}
	checkTarget(document.the_form["access_target"+accessDivUpto],accessDivUpto);
}
userAppendAccessDiv();
document.body.onmouseup=mouseupAccessDiv;
document.body.onmousemove=mousemoveAccessDiv;


</script>
<center>
<div id='access_hand' style='position: absolute; display: none; z-order: 0'><img src='img/hand.gif' onmousedown='return false;' ondragstart='return false;' /></div>

<div align='left'>
<img src='img/blank.gif' width='32' height='2' /><a href="javascript:userAppendAccessDiv();"><img src=img/add_down_flat.gif border='0' alt='Add' title='Add' /></a>
</div>
<br />
<input type='submit' value="Save" />
</center>
</td></table>
<br />
<font class='smallf'>Drag the hand to move the sections.<br />
If nothing in the access list is matched then access is allowed.
<br />
This page is only for access to the proxy,
For access to the admin interface change the .htaccess file.
</font>
<br />
<p />
EOF;

//*** not a good idea, constant re-registering will cause this proxy to fill up the rotation
//	if($config['anonProxy']) {
//		echo "<a href=\"registerProxy.php\">Re-register anonymous proxy</a><p />";
//	}

	if($config['configured']) {
		printConfigTable();
	}

	echo <<<EOF
</form>
</center>
EOF;


	return true;
}


printHeader();

if(!isset($f)) {
	if(isset($_REQUEST['f'])) { $f=$_REQUEST['f']; }
	else { $f=""; }
}
checkFirstTimeStart();
menu();
if($f == "") { printConfig(); }
else if($f == "config") { printConfig(); }
else {
	echo "huh?";
}


printFooter();


?>

