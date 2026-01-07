<?php

include('cache/config.php');
include_once('general.php');
include_once('general_stats.php');

function printConnectionStats() {
	$dataByType=getStatsArr();
	$connection=$dataByType['connection'];
	if(!$connection) { 
		echo "No current connections";
		return; 
	}

	echo <<<EOF
<style type='text/css'>
td { 
	border-right: 1px solid #d1bea5;
}
</style>
<table class='pps_table'><tr><th colspan='9'>Connections</th>
<tr class='td2'><td>Web</td>
<td>Status</td>
<td>IP</td>
<td>In</td>
<td>Out</td>
<td>Conns</td>
<td>Time</td>
<td>Url</td>
EOF;
	$totalConnections=0;
	foreach ($connection as $num => $arr) {
//status,inet_ntoa(inAddr),conn->recvLen,conn->webContentLength,usecDiff);
		$contentLen=($arr[3]<0)?"":("/".$arr[3]);
		$tmsecs=intval($arr[4])%1000;
		$tsecs=intval($arr[4])/1000;
		$tsecs= secsToStr($tsecs) .  sprintf(".%03u",$tmsecs);
		$web=$arr[7];
		$url=$arr[8];
		$dataLen=$arr[2];
		$dataLen2=$arr[5];
		$totalResets=$arr[6];
		if(preg_match('#^http://anon_proxy_server/#',$url)) {
			// internal url
			$url='Internal command';
		}

		echo "<tr><td>$web</td><td class='totalnum'>$arr[0]</td><td class='totalnum'>$arr[1]</td><td class='totalnum'>$dataLen$contentLen</td><td class='totalnum'>$dataLen2</td><td>$totalResets</td><td class='totalnum'>$tsecs</td><td>$url</td>";
		$totalConnections++;
	}
	echo <<<EOF
</table>
<p />
<script language='javascript'>

useReload=1;
function reloadFunc()
{
	if(!useReload) { return; }
	window.location.reload();
}
function stopReload() {
	useReload=0;
}
setTimeout("reloadFunc()",60000);

</script>
<a href="javascript:stopReload();">Stop reloading</a><br />
<font class='smallf'>
<script language='javascript'>

var d=new Date(); 
document.writeln(d.toString());

</script>
</font>
EOF;
}

printHeader();
menu();
printConnectionStats();
printFooter();

?>
