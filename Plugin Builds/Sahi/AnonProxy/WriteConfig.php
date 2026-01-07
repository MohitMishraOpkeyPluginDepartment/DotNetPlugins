<?php

class WriteConfig {
	var $jsNeedsDestIP=false;
	var $jsNeedsDate=false;
	var $phpHostAddrLong=false;
	var $phpUserAddrLong=false;

	function time_to_mins_num($timeStr) {
		$hm=split(":",$timeStr);
		return ($hm[0]*60)+$hm[1];
	}

	function get_php_if($stype,$istype,$url) {
		$op=istype2operator($istype);
		if($stype == "Url") {
			return("(strpos(\$this->url,'".$url."') !== false) $op true");
		}
		if($stype == "Host") {
			$urlLen=strlen($url);
			return("substr(\$this->parsedUrl['host'],strlen(\$this->parsedUrl['host'])-$urlLen) $op '".$url."' \n");
		}
		if($stype == "User IP") {
			$arr=getNetworkFromStr($url);
			$startNet=ip2long($arr[0]);
			$endNet=$startNet+(0-ip2long($arr[1]));
		
			return ("(\$this->userAddrLong>=$startNet && \$this->userAddrLong<$endNet) $op true");
		}
		if($stype == "Dest IP") {
			$this->phpHostAddrLong=true;
			$arr=getNetworkFromStr($url);
			$endNet=$arr[0]+(0-$arr[1]);
			return ("(\$hostAddrLong>=$arr[0] && \$hostAddrLong<$endNet) $op true");
		}
		$url=str_replace("'","",$url);
		return("$stype $op '".$url."' \n");
	}

	function get_js_if($stype,$istype,$url) {
		$op=istype2operator($istype);
		if($stype=="User IP") { return null; }
		if($stype=="Url") { return "shExpMatch(url,\"*".addslashes($url)."*\") $op  true "; }
		if($stype=="Url Regex") { return "(url.match(\"".addslashes($url)."\")>0?1:0) $op 1 "; }
		if($stype=="Host") { 
			$urlLen=strlen($url);
			return "(host.length>=$urlLen && host.substr(host.length-$urlLen) == \"".addslashes($url)."\") $op true ";
		}
		if($stype=="Day of Week") {
			$this->jsNeedsDate=true;
			$dowArr=array(
				'sun'=>'0',
				'mon'=>'1',
				'tue'=>'2',
				'wed'=>'3',
				'thu'=>'4',
				'fri'=>'5',
				'sat'=>'6',
			);
			$dow=strtolower(substr($url,0,3));
			$dowNum=$dowArr[$dow];
			return " curdate.getDay() $op $dowNum ";
		}
		if($stype=="Label") {
			return " labels['$url'] $op 1 ";
		}
		if($stype=="Time") {
			$startend=split("-",$url);
			$mins1=$this->time_to_mins_num($startend[0]);
			$mins2=$this->time_to_mins_num($startend[1]);
			$this->jsNeedsDate=true;
			if($mins1>$mins2) {
				// overnight time.
				return "($mins1 < curtimenum || curtimenum <= $mins2) $op true";
			}
			return "($mins1 < curtimenum && curtimenum <= $mins2) $op true";
		}
		if($stype=="Dest IP") {
			$netw=getNetworkFromStr($url);
			$this->jsNeedsDestIP=true;
			return ('isInNet(destIP,"'.$netw[0].'","'.$netw[1]."\") $op true ");
		}
		return("$stype $op '".$url."' ");
	}


	function findOrder($order) {
		$accessTotal=$_REQUEST['accessDivUpto'];
		for($a=0; $a<$accessTotal; $a++) {
			$o=$_REQUEST['accessDivOrder'.$a];
			if(!isset($o) || $o<0) { continue; }
			if($o==$order) {
				return $a;
			}
		}
		return -1;
	}


	function write() {
		$AndString="And...";

		// save the config to a file.
		if(!($configFile=fopen("cache/config.php","w"))) {
			echo "Cannot open config.php";
			return false;
		}
		flock($configFile,LOCK_EX);
		$port=intval($_REQUEST['port']);
		$ourUrl=$_REQUEST['ourUrl'];
		if($ourUrl[strlen($ourUrl)-1] != '/') { $ourUrl.='/'; }
		$parsedOurUrl=parse_url($ourUrl);
		$ourHost=$parsedOurUrl['host'];
		$debug=intval($_REQUEST['debug']);
		$anonPort=intval($_REQUEST['anonPort']);
//** use var_export? not in old php
		$conf=<<<EOF
<?php

\$config=array(
'pid_file'=>"anon_proxy_server.pid",
'port'=>'$port',
'anonPort'=>'$anonPort',
'ourUrl'=>'$ourUrl',
'ourHost'=>'$ourHost',
'configured'=>'{$_REQUEST['configured']}',
'debug'=>'$debug',

EOF;
//'userAuthCmd'=>'{$_REQUEST['userAuthCmd']}',
		fwrite($configFile,$conf);
		$anonProxyBlockIntranet=0;
//		$anonProxyFailAbort=0;
//		if(isset($_REQUEST['anonProxyFailAbort'])) {
//			$anonProxyFailAbort=intval($_REQUEST['anonProxyFailAbort']);
//		}
		if(isset($_REQUEST['anonProxyBlockIntranet'])) {
			$anonProxyBlockIntranet=intval($_REQUEST['anonProxyBlockIntranet']);
		}
		$anonProxy=0;
		if(isset($_REQUEST['anonProxy'])) {
			$anonProxy=intval($_REQUEST['anonProxy']);
		}
		$anonProxyHomeBase=$_REQUEST['anonProxyHomeBase'];
		$anonProxyHomeBase=preg_replace('/index.php$/','',$anonProxyHomeBase);
		fwrite($configFile,
			"'anonProxy'=>'".$anonProxy."',\n".
			"'anonProxyFailAbort'=>'1',\n".
			"'anonProxyBlockIntranet'=>'".$anonProxyBlockIntranet."',\n".
			"'anonProxyMaxFails'=>'".intval($_REQUEST['anonProxyMaxFails'])."',\n".
			"'anonProxyTimeout'=>'".intval($_REQUEST['anonProxyTimeout'])."',\n".
			"'anonProxyHomeBase'=>'".$anonProxyHomeBase."',\n".
			"'maxCacheMegs'=>'".intval($_REQUEST['maxCacheMegs'])."',\n".
			"'maxLogFileSize'=>'".intval($_REQUEST['maxLogFileSize'])."',\n".
			"'maxLogRotate'=>'".intval($_REQUEST['maxLogRotate'])."',\n".
			"'dataTimeOutSeconds'=>'".intval($_REQUEST['dataTimeOutSeconds'])."',\n".
			"'timeOutSeconds'=>'".intval($_REQUEST['timeOutSeconds'])."',\n");

		fwrite($configFile, "'php_bin'=>'". $_REQUEST['php_bin']."',");

		// write access
		fwrite($configFile,"'access'=>array(\n");
		$accessTotal=$_REQUEST['accessDivUpto'];

		$this->jsNeedsDestIP=false;
		//$proxyAddr="{$parsedOurUrl['host']}:$port";
		$proxyAddr="<?php echo \"\$http_host:$port\"; ?>";
		$js='';
		$js.='<?php $http_host=$_SERVER["HTTP_HOST"]; $colon=strpos($http_host,":"); if($colon>0) { $http_host=substr($http_host,0,$colon); } ?>';
		$js.="if(host==\"anon_proxy_server\") { return \"PROXY $proxyAddr;\"; }\n";
		$js.="if(host==\"127.0.0.1\" || host==\"localhost\" || host==\"".$ourHost."\") { return \"DIRECT\"; }\n";
		$phpBeforeConnect="";
		$phpAfterLookup="";
		$prevTarget="";

		$accessesDone=0;
		for($orderUpto=0; $orderUpto<$accessTotal; $orderUpto++) {
//		for($accessUpto=0; $accessUpto<$accessTotal; $accessUpto++) {
			$accessUpto=$this->findOrder($orderUpto);
			if($accessUpto<0) { continue; }
			$accessUrlTotal=$_REQUEST['accessDivUrlsUpto'.$accessUpto];
			$phpBeforeConnect1="";
			$phpAfterLookup1="";
			$js1="";
			$target=$_REQUEST['access_target'.$accessUpto];
			$comment=$_REQUEST['access_comment'.$accessUpto];
			if($target=="") { continue; }

			$finalTarget=$target;
			$finalComment=$comment;
			$useJsTarget=null;
			if($target==$AndString) {
				// get final target
				for($targetUpto=$orderUpto; $targetUpto<$accessTotal; $targetUpto++) {
					$targetUptoNum=$this->findOrder($targetUpto);
					if($targetUptoNum<0) { continue; }
					$t=$_REQUEST['access_target'.$targetUptoNum];
					$c=$_REQUEST['access_comment'.$targetUptoNum];
					if($t!="" && $t!=$AndString) { $finalTarget=$t; $finalComment=$c; break; }
				}
			}
			if($finalTarget=="Label") {
				$useJsTarget="labels['$finalComment']=1;";
			}
			if($finalTarget=="Other Proxy") {
				$otherProxy=$finalComment;
				if(preg_match('/^[a-zA-Z]+\s/',$finalComment)) {
					$useJsTarget="return '$otherProxy;';";
				} else {
					$useJsTarget="return 'PROXY $otherProxy;';";
				}
			}
			if($finalTarget=="No Proxy") {
				// a "no proxy" is .pac controlled
				$useJsTarget='return "DIRECT";';
			}
			$urlsDone=0;
			$accessUrlWritten=0;
			for($accessUrlUpto=0; $accessUrlUpto<$accessUrlTotal; $accessUrlUpto++) {
				$suf=$accessUpto.'_'.$accessUrlUpto;
				$stype=$_REQUEST['access_stype'.$suf];
				$istype=$_REQUEST['access_istype'.$suf];
				$url=stripslashes($_REQUEST['access_url'.$suf]);
				$url=addslashes1($url);
				if($stype=="" || $url=="") { continue; }
				if($accessUrlWritten>0) { 
					fwrite($configFile,",\n"); 
				}
				$accessUrlWritten++;
				if($urlsDone==0) {
					if($accessesDone>0) { fwrite($configFile,",\n"); }

					fwrite($configFile,"array(\n");
					fwrite($configFile,"array(\n");
				}
				$urlsDone++;
				fwrite($configFile,
					"array('".$stype."',".
					"'$istype',".
					"'$url')"
					);
				if($useJsTarget !== null) {
					$jsIf=$this->get_js_if($stype,$istype,$url);
					if($jsIf!=null) {
						if($js1!="") { $js1.="|| "; }
						$js1.=$jsIf;
					}
				} else {
					$phpIf=$this->get_php_if($stype,$istype,$url);
					if($phpIf!=null) {
						if($stype == "Dest IP") {
							if($phpAfterLookup1!="") { $phpAfterLookup1.="|| "; }
							$phpAfterLookup1.=$phpIf;
						} else {
							if($phpBeforeConnect1!="") { $phpBeforeConnect1.="|| "; }
							$phpBeforeConnect1.=$phpIf;
						}
					}
				}
			}
			if($urlsDone==0) { continue; }

			if($target == "Block") {
				$phpAction="\$this->error('".$comment."'); return true; ";
			} else {
				$phpAction="\$ok=true; ";
			}
			if($phpAfterLookup1!="") {
				$phpAfterLookup.="if(!\$ok && ($phpAfterLookup1)) { $phpAction  }\n";
			}
			if($phpBeforeConnect1!="") {
				$phpBeforeConnect.="if(!\$ok && ($phpBeforeConnect1)) { $phpAction  }\n";
			}
			if($js1!="") {
				if($prevTarget==$AndString) {
					$js.=" && ($js1)\n"; 
				} else { $js.="if( ($js1)\n"; }
				if($target!=$AndString) {
					$js.=") { $useJsTarget }\n";
				}
			}
			if($urlsDone>0) {
				fwrite($configFile,"\n),'".$target."','".$comment."')\n");
			}
			$prevTarget=$target;
			$accessesDone++;
		}

		if($this->phpHostAddrLong) {
			$phpAfterLookup="$hostAddrLong=ip2long($hostAddr);\n$phpAfterLookup";
		}
		if($this->phpUserAddrLong) {
			$phpBeforeConnect="$phpBeforeConnect";
		}
		if($phpBeforeConnect!="") {
			$phpBeforeConnect="\$ok=false; $phpBeforeConnect";
		}
		if($phpAfterLookup!="") {
			$phpAfterLookup="\$ok=false; $phpAfterLookup";
		}


		fwrite($configFile,"\n),'phpBeforeConnect'=>'".addslashes1($phpBeforeConnect)."',\n".
			"'phpAfterLookup'=>'".addslashes1($phpAfterLookup)."'\n".
			");\n\n?>");
		flock($configFile,LOCK_UN);
		fclose($configFile);

		// write the pac file
		if(!($pacFile=fopen("cache/pac.php","w"))) {
			echo "Cannot open pac.php";
			return false;
		}
		fwrite($pacFile,"function LocalFindProxyForURL() { return 'DIRECT'; }\nfunction FindProxyForURL(url,host) {\nlabels=new Array();\n");
		if($this->jsNeedsDestIP) {
			fwrite($pacFile,"destIP=dnsResolve(host);\n");
		}
		if($this->jsNeedsDate) {
			fwrite($pacFile,"curdate=new Date();\nvar curtimenum=(curdate.getHours()*60)+curdate.getMinutes();\n;");
		}
		fwrite($pacFile,$js);
		fwrite($pacFile,'if(!shExpMatch(url,"http:*") && !shExpMatch(url,"https:*")) { return "SOCKS '.$proxyAddr.'"; } '. "\n");
		fwrite($pacFile,"return \"PROXY $proxyAddr;\";\n}\n");
		fclose($pacFile);

//		echo "Configured<p />";
//
//		printPacMess($ourUrl."pac.php");
//		global $config;
//		if(!$config['configured']) {
//			echo "<a href=\"start.php\">Click here to start the proxy</a><p />";
//		}
		return true;
	}
}

?>
