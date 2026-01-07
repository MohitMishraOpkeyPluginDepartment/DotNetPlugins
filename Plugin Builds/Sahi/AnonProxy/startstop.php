<?php

function stopServer() {
	global $config;
	//$pid=getRunningPid(); if(!$pid) { return false; }
	$err=ini_get("error_reporting");
	error_reporting(0);
	$serverFd=fsockopen("localhost",$config['port'],$errno,$errStr,3);
	stream_set_timeout($serverFd,3);
	$r=false;
	if($serverFd) {
		fwrite($serverFd,"GET http://anon_proxy_server/shutdown HTTP/1.0\r\n\r\n");
		fclose($serverFd);
		$r=true;
		return true;
	}
	error_reporting($err);
	return $r;
}



// write config to pserver
function compileServer() {
	global $config;
	if(!($in=fopen("./pserver.php","r"))) {
		echo "Could not read ./pserver.php\n";
		return false;
	}
	if(!($out=fopen("cache/proxy_server.php","w"))) {
		echo "Could not write to cache/proxy_server.php\n";
		return false;
	}
	$withinIf=array();
	$ok=true;
	while(($line=fgets($in))!=false) {
		if(strncasecmp($line,"//endif",7)==0) {
			$ok=array_pop($withinIf);
			continue;
		}
		if(preg_match('#^//config (\S+)#',$line,$nums)) {
			fwrite($out,$config[$nums[1]]);
			continue;
		}
		else if(preg_match('#^//if (debug)([0-9]*)(:)?#',$line,$nums)) {
			if($config[$nums[1]]<$nums[2]) {
				$debugok=false;
			} else {  $debugok=true; }
			if(!isset($nums[3]) || $nums[3]!= ":") {
				array_push($withinIf,$ok);
				if($ok===true) { $ok=$debugok; }
				continue;
			} else if($debugok) {
				$line=substr($line,strpos($line,':')+1);
			} else { continue; }
		}
		if(!$ok) { continue; }
		fwrite($out,$line);
	}
	if(count($withinIf)>0) {
		echo "internal error: some if statements didn't end\n";
	}
	fclose($in);
	fclose($out);
	return true;
}

function killServer() {
	$pid=getRunningPid();
	if($pid!=false) {
		posix_kill($pid);
		sleep(5);
	}
}


function startPHP() {
	if(startPHPServer()) {
		echo <<<EOF
Started
EOF;
	}
}




//function stopServerRedir() {
//	echo '<meta http-equiv="Refresh" Content="3; URL=http://anon_proxy_server/shutdown" />';
//	echo <<<EOF
//If this browser is not setup to configured to use the proxy, connect it to the proxy and visit this url...<br />
//<a href="http://anon_proxy_server/shutdown">http://anon_proxy_server/shutdown</a>
//EOF;
//}



function startPHPServer() {
	compileServer();
	stopServer();

	global $config;
	$port=intval($config['port']);
	unlink('cache/proxy_server.log');
	exec("nohup ".$config['php_bin'] . " cache/proxy_server.php $port >cache/proxy_server.log 2>&1 &");
	return true;
}

$startTestErrorLog="/tmp/anon_proxy_server_error";

function startServer($options="") {
	if($options=="") { 
		$options="-run"; 
		compileServer();
		stopServer();
	}
	global $startTestErrorLog;
	$logFile="cache/proxy_server.log";
	if($options=="-test") { $logFile=$startTestErrorLog; }

	global $config;
	$port=intval($config['port']);
	$testConfig=false;
	if($options=="-testConfig") { $testConfig=true; }
	clearstatcache();
	if(is_file($logFile)) {
	
		if(is_file("$logFile.1")) {
			unlink("$logFile.1");
		}
		rename($logFile,"$logFile.1");
	}
	if(extension_loaded("com_dotnet")) {
		// windows
		$redir=$testConfig?"":">NUL";
		exec(".\\pserver.exe $options $redir",$rout,$r);
		if($testConfig) { return $rout; }
		return $r==0?true:false;
	} else {
		$redir=$testConfig?"":">$logFile 2>&1";
		if(is_executable("./pserver")) {
			// somebody has compiled it for themselves, lets use it.
			exec("./pserver $options ",$rout,$r);
			if($r==0) { 
				if($testConfig) { return $rout; }
				return true; 
			}
			// continue on to uclibc if we failed to start.
		}

		// use uclibc...
		// uclibc needs TZ for timezone
		$tzmins=intval(date("Z"));
		$tz=sprintf("%s%02d:%02d",
			$tzmins>0?"-":"+",
			($tzmins/60/60)%60,
			($tzmins/60)%60
			);
		exec("export TZ='GMT$tz'; ./pserver.uclibc $options $redir",$rout,$r);
		if($testConfig) { return $rout; }
		return $r==0?true:false;
	}
	return true;
}


function start() {
	global $startWanted;
	touch($startWanted);
	if(startServer()) {
		$finalMess="<meta http-equiv='refresh' content='5; URL=logerror.php' />";
		sleep(2);
		if(!getRunningPid()) {
			$finalMess.="Server may not have started properly.";
		} else {
			$finalMess="Started";
		}
	} else {
		$finalMess="Failed to start";
	}
	return $finalMess;
}

function stop() {
	global $startWanted;
	if(is_file($startWanted)) {
		unlink($startWanted);
	}
	if(stopServer()) {
		sleep(2);
		if(getRunningPid()) {
			$finalMess="Server may have crashed, click restart to start.";
		} else {
			$finalMess="Stopped";
		}
	} else {
		$finalMess="Couldn't stop";
	}
	return $finalMess;
}


?>
