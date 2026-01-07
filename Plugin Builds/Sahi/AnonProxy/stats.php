<?php

include('cache/config.php');
include_once('general.php');
include_once('general_stats.php');

function printStatsTable($title,$info,$type,$numConvert=null)
{
	$totalName='Total';
	$cachedBytes=null;
	if(isset($_REQUEST['totalName'])) {
		$totalName=$_REQUEST['totalName'];
	} else if(isset($info['Cached '.$type])) {
		$cachedBytes=$info['Cached '.$type];
	}
	$totalBytes=$info[$totalName.' '.$type];

	$maxBytes=0;
	foreach ($totalBytes as $num=>$bytes) {
		if(intval($bytes)>$maxBytes) { $maxBytes=$bytes; }
	}
	if($maxBytes==0) {
		echo "No one has used this connection yet";
		return 0;
	}
	echo "<table class='pps_table'><tr><th colspan='4'>$title</th></tr>";
	echo "<tr><td class='borderRight'>#</td><td class='borderRight'>Count</td>";
	if($cachedBytes!==null) {
		echo "<td class='borderRight'>Cached %</td>";
	}
	echo "<td class='borderRight'>Graph</td></tr>";
	foreach ($totalBytes as $num=>$bytes) {
		$barWidth=($bytes/$maxBytes)*400;
		$percentStr="";
		if($bytes>0 && $cachedBytes!==null) {
			$cached=$cachedBytes[$num];
			$percentStr=sprintf('%.2f%%',($cached/$bytes)*100);
		}

		if($numConvert!=null) { $num=$numConvert($num); }
		echo "<tr><td class='totalnums'>$num</td><td class='totalnums'>".number_format($bytes)."</td>";
		if($cachedBytes!==null) {
			echo "<td class='totalnums'>$percentStr</td>";
		}
		echo "<td class='etd'>";

		if($bytes>0) {
			echo "<img src='img/statsbarleft.gif' /><img src='img/statsbar.gif' height='11' width='".$barWidth."' /><img src='img/statsbarright.gif' />";
		}
		echo "</td>";
	}
	echo "</td></table>";
	return 1;
}

function printGeneralStats($dataByType) {
	global $config;
	$totals=$dataByType['Total'];

	echo "<table width='300' class='pps_table'><tr><th colspan='4'>General</th>";
	$uptimeSecs=intval($dataByType['Uptime'][0][0]);
	$uptime=secsToStr($uptimeSecs);
	$currentTimeStr=strftime("%d/%b/%Y %H:%M:%S",time());
	$serverStartTimeStr=strftime("%d/%b/%Y %H:%M:%S",time()-$uptimeSecs);
	echo <<<EOF
<tr><td class='largef' colspan='2'>Uptime:</td><td class='totalnum' colspan='2'>$uptime</td>
<tr><td colspan='1'>Now:</td><td class='totalnum' colspan='3'>$currentTimeStr</td>
<tr><td colspan='1'>Started:</td><td class='totalnum' colspan='3'>$serverStartTimeStr</td>
EOF;

	if($totals['Total requests'][0]==0 || $totals['Total bytes'][0]==0) {
		echo "<tr><td colspan='4'>No one has used this proxy yet.</td>";
	} else {

		echo "<tr><td></td><td class='totalnum'></td><td class='totalnum'>Cached</td><td>Percent</td>";
		$reqsPercent=sprintf('%.2f',($totals['Cached requests'][0]/$totals['Total requests'][0])*100);
		$bytesPercent=sprintf('%.2f',($totals['Cached bytes'][0]/$totals['Total bytes'][0])*100);
		echo "<tr><td class='largef'>Requests:</td><td class='totalnum'>{$totals['Total requests'][0]}</td><td class='totalnum'>{$totals['Cached requests'][0]}</td><td class='totalnum'>$reqsPercent%</td>";
		echo "<tr><td class='largef'>Bytes:</td><td class='totalnum'>".number_format($totals['Total bytes'][0])."</td><td class='totalnum'>".number_format($totals['Cached bytes'][0])."</td><td class='totalnum'>$bytesPercent%</td>";
	}

	$proxyStr="";
	if(isset($dataByType['Anon Proxy'])) {
		$proxyArr=$dataByType['Anon Proxy'];
		$anonProxyStat=$dataByType['Anon Proxy'][0][0];
		$anonSecsDiff=$dataByType['Anon Proxy'][0][1];
		$anonProxyMess=$anonProxyStat;
		if($anonSecsDiff>10) {
			$anonProxyMess.=" (".secsToStr($anonSecsDiff). " seconds correction)"; 
			$anonProxyMess.= <<<EOF
<br />
<font class='smallf'>
Your computer's time is<br />
<script language='javascript'>

var d=new Date(); 
document.writeln(d.toString());

</script>
<br />
<a href="http://www.worldtimezone.com/">The correct time is here</a>
</font>
EOF;
		
		}
		echo "<tr><td colspan='1'>Anonymous Proxy:</td><td class='totalnum' colspan='3'>$anonProxyMess";
		echo "</td>";
		if($anonProxyStat != "ok") {
			echo "<tr><td colspan='4'>If you're behind a firewall/router you need to set it up to forward port {$config['port']} + {$config['anonPort']} to your machine. ". getRegisterProxyStr(). "</td>";
		} else {
			$count=0;
			foreach ($proxyArr as $ip => $info) {
				if($ip == "0") { continue; }
				$timeStr=hexTimeToStr($info[1]);
				$proxyStr.="<tr><td class='totalnum'>$ip</td><td class='totalnum'>{$info[0]}</td><td>$timeStr</td>";
				$count++;
			}
		}
	}

	echo "</table><br />";

	echo <<<EOF
<table class='pps_table'>
<tr><th colspan='2'>Usage stats...</th>
<tr><td>Web:</td><td><a href="stats.php?type=bytes">Bytes</a> | <a href="stats.php?type=requests">Requests</a></td>
<tr><td>Non Web or HTTPS:</td><td> <a href="stats.php?type=bytes&totalName=Non+Web">Bytes</a> | <a href="stats.php?type=requests&totalName=Non+Web">Requests</a></td>
<tr><td>Anonymous:</td><td> <a href="stats.php?type=bytes&totalName=Anon">Bytes</a> | <a href="stats.php?type=requests&totalName=Anon">Requests</a></td>
</table>
<p />
EOF;




	if($proxyStr != "") {
		echo "<table class='pps_table'><tr><th colspan='3'>Anon Proxys</th><tr class='td2'><td>IP</td><td>Fails</td><td>Time</td>";
		echo $proxyStr;
		echo "</table><br />";
	} else if($anonProxyStat=="ok") {
		echo "No Proxys downloaded<br />";
		echo getRegisterProxyStr();
	}


}




function printStats() {
	global $config;
	$dataByType=getStatsArr();

	$totals=$dataByType['Total'];
	$type=$_REQUEST['type'];
	if($type == "gen") { printGeneralStats($dataByType); }
	else if($totals['Total requests'][0]==0 || $totals['Total bytes'][0]==0) {
		echo "No one has used this proxy yet.";
	} else {
		$typeUcFirst=ucfirst($type);
		echo "<h2>{$_REQUEST['totalName']} $typeUcFirst</h2>";
		if($type =="") { $type='bytes'; }
		if(printStatsTable("Hours",$dataByType['Hour'],$type)) {
			echo "<br />";
			printStatsTable("Day of Week",$dataByType['Day of Week'],$type,"dowFunc");
		}
	}
	echo <<<EOF
<script language='javascript'>

setTimeout("window.location.reload()",15*60000);

</script>
EOF;
	return true;
}

printHeader();
menu();
if(getRunningPid()) {
	printStats();
}
printFooter();

?>
