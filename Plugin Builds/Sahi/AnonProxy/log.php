<?php

include('cache/config.php');
include_once('general.php');

if($_REQUEST['csv']) {
	header('Content-Disposition: attachment; filename="AnonProxyServer.csv";');
	header('Content-Type: text/comma-separated-values');
	printCsv($_REQUEST['suffix']);
	return;
}

function printDownloadLinks() {
	$suffixes=array();
	if(($dh=opendir("cache"))!==false) {
		while(($file=readdir($dh))!==false){
			if(substr($file,0,10)!="access.log") {
				continue;
			}
			$suffix=substr($file,10);
			array_push($suffixes,$suffix);
		}

		closedir($dh);
	}

	$num=0;
	sort($suffixes);
	echo "<div align='left'>";
	echo "Download logs: ";
	foreach($suffixes as $suffix) {
		if($num>0) { echo ' | '; }
		echo "<a href='log.php?csv=1&suffix=".$suffix."'>".($num==0?"Current":$num)."</a>";
		$num++;
	}
	echo "</div>";
}

function printCsv($suffix) {
	if(!($fd=fopen("cache/access.log".$suffix,"rb"))) {
		echo "Could not open log<br />";
		return false;
	}
	while(($line=fgets($fd))!==false) {
		printCsvLine($line);
	}
	fclose($fd);
	return true;
}

function printCsvLine($line) {
	$row=explode("\t",$line,10);
	$row[0]=strftime('%d/%b/%Y %H:%M:%S',hexdec($row[0]));
	//  
	$url=trim($row[9]);
	$url=str_replace('"','""',$url);
	$row[9]=null;
	echo join(',',$row).',"'.$url.'"'."\n";
}

function printLogLine($line,$func="addLogRow") {
	if(strlen($line)>0) {
		$logTime=substr($line,0,8);
		$timeStr=hexTimeToStr($logTime);

		$line=$timeStr. substr($line,8);
	}

	$line=htmlspecialchars($line,ENT_QUOTES);
	$arr=str_replace("\t","','",$line);

	echo <<<EOF
<script language='javascript'>
$func(new Array('$arr'));
</script>
EOF;
}


function printLogs() {
	$reloadSecs=50;

	set_time_limit(60*10);
	
	echo <<<EOF
<style type='text/css'>
td {
	font-size: 9pt;
	white-space: nowrap;
	border-right: 1px solid #d1bea5;
}
</style>
<table id='log_table' class='pps_table'>
<tr><th colspan='10'>Log</th>
<tr>
<td><b>Time</b></td>
<td><b>Cache</b></td>
<td><b>From</b></td>
<td><b></b></td>
<td><b>Size</b></td>
<td><b>Secs</b></td>
<td><b>Status</b></td>
<td><b>Cmd</b></td>
<td><b>To</b></td>
<td><b>Url</b></td>
</tr>
</table>
</td></table>
<script language='javascript'>

function initLogTable() {
	var log=document.getElementById('log_table');
	var tr=log.insertRow(2);
}
initLogTable();

function addLogRow(arr) {
	var log=document.getElementById('log_table');
	var tr=log.insertRow(2);

	for(i=0; i<arr.length; i++) {
		var td=tr.insertCell(-1);
		td.innerHTML=arr[i];
		if(i==4 || i==5) {
			td.style.textAlign="right";
		}
	}
}

function rotateLogRow(arr) {
	addLogRow(arr);

	var log=document.getElementById('log_table');
	log.deleteRow(log.rows.length-1);
}

setTimeout("window.location.reload()",$reloadSecs*1000);

</script>
EOF;


	if(!($fd=fopen("cache/access.log","rb"))) {
		echo "Could not open log<br />";
		return 0;
	}
	$nextFlushSecs=45;

	fseek($fd,-3200,SEEK_END);
	$line=fgets($fd);
	$firstLines=0;
	$lines=array();
	while(($line=fgets($fd))!==false) {
		if(substr($line,strlen($line)-1)!="\n") {
			break;
		}
		$line=rtrim($line);
		array_push($lines,$line);
		$firstLines++;
	}
	/*
	while($firstLines<25) {
		printLogLine('');
		$firstLines++;
	}
	 */
	foreach ($lines as $line) {
		printLogLine($line);
	}

	$prevSize=-1;
	ob_flush();
	$nextFlush=time()+$nextFlushSecs;
	$maxTime=time()+$reloadSecs;
	while(time()<$maxTime) {
		$statArr=fstat($fd);
		if($prevSize<0 || $statArr['size']) {
			$prevSize=$statArr['size'];
			$fpos=ftell($fd);
			$line=fgets($fd);
			if(substr($line,strlen($line)-1)=="\n") {
				$line=rtrim($line);
				printLogLine($line,"rotateLogRow");
				ob_flush();
				$nextFlush=time()+$nextFlushSecs;
				continue;
			} else {
				fseek($fd,$fpos,SEEK_SET);
			}
		}
		if(time()>=$nextFlush) {
			echo "\n";
			ob_flush();
			$nextFlush=time()+$nextFlushSecs;
		}
//		sleep(1);
		break;
	}
	fclose($fd);
?>
	<script>
window.setTimeout(function() { location.reload(); },10000);
	</script>
<?php
	return 1;
}



printHeader();
menu();
printDownloadLinks();
printLogs();
printFooter();

?>

