<?php

// server runned in background
// php -q proxy_server.php >/dev/null &


class Connection {
	var $conn;
	var $url=null;
	var $parsedUrl=null;
	var $cmd=null;
	var $headerLineUpto=0; // -1=all header received
	var $currentLine="";
	var $writeBuf="";	// buffer to write back to user
	var $otherConnection=null;
	var $server;
	var $webConnection=false;
	var $lastActivity;
	var $recvLen=0;
	var $sentLen=0;

	function Connection($server,$conn) {
		$this->server=$server;
		$this->conn=$conn;
		$this->lastActivity=time();
	}

	function processUserHeaderLine($httpLine) {
		$r=$this->processUserHeaderLine1($httpLine);
		if($httpLine == "" || $httpLine=="\r") {
 echo "end of header\n";
			$this->headerLineUpto=-1;
		} else { $this->headerLineUpto++; }
		return $r;
	}
	function processUserHeaderLine1($httpLine) {
//echo "line: $httpLine\n";
		if($this->headerLineUpto==0) {
			$httpLineSpace=strpos($httpLine," ");
			$httpLineSpace2=strrpos($httpLine," ");
			if($httpLineSpace == false || $httpLineSpace2 == false) {
				echo "Bad request: $httpLine\n";
				return false;
			}
			$httpLineSpace++;

			$this->cmd=substr($httpLine,0,$httpLineSpace-1);
			$this->url=substr($httpLine,$httpLineSpace,$httpLineSpace2-$httpLineSpace);
			if($this->cmd == "CONNECT") {
				$this->url="https://".$this->url;
			}
			$this->parsedUrl=parse_url($this->url);
			if($this->parsedUrl['port']==false) {
				$this->parsedUrl['port']=$this->parsedUrl['scheme']=='https'?443:80;
			}
			if($this->parsedUrl == false) {
				echo "Bad url: $this->url\n";
				return false;
			} else {
				$host=$this->parsedUrl['host'];
				if(preg_match('/[^0-9\.]/',$host)>0) {
					//~~~ potential dns block here
					if(($hostAddr=gethostbyname($host)) == '' || $hostAddr==$host) {
						$this->error("bad host name: $host\n");
						return true;
					}
				}
				$webConn=socket_create(AF_INET,SOCK_STREAM,SOL_TCP);
 echo "connect: $webConn, ($this->url)$hostAddr:" . $this->parsedUrl['port']. "\n";
				socket_set_nonblock($webConn);
				socket_connect($webConn,$hostAddr,$this->parsedUrl['port']);
				$server=$this->server;
				$otherConnection=$server->getNewConnection($webConn);
				$this->otherConnection=$otherConnection;
				$otherConnection->otherConnection=$this;
				$otherConnection->cmd=$this->cmd;
				$otherConnection->webConnection=true;
				if($this->cmd != "CONNECT") {
					$otherConnection->writeBuf=$this->cmd." ".$this->parsedUrl['path'].($this->parsedUrl['query'] == ''?'':('?'.$this->parsedUrl['query'])) . " HTTP/1.0\r\n";
				}  else {
					$this->writeBuf="HTTP/1.0 200 Connection established\r\n\r\n";
				}
			}
		} else if($this->otherConnection!=null) {
			//~~~ do any extra header processing

			// send header
			if($this->cmd!="CONNECT"
//		       	&& strncasecmp($httpLine,"Connection:",11)!=0
		       	&& strncasecmp($httpLine,"Proxy-Connection:",17)!=0
			) {
				$this->otherConnection->writeBuf.=$httpLine."\n";
			}
		}

		return true;
	}

	function read() {
		$this->lastActivity=time();
		$buf=socket_read($this->conn,4096);
		$l=strlen($buf);
		if($l==0) { return false; }
		$this->recvLen+=$l;
		if(!$this->webConnection) {
			// incoming header from user
			if($this->headerLineUpto>=0) {
				$this->currentLine.=$buf;
				while($this->headerLineUpto>=0) {
					$lf=strpos($this->currentLine,"\n");
					if($lf==false) { break; }
					$line=substr($this->currentLine,0,$lf);
					if(!$this->processUserHeaderLine($line)) {
						return false;
					}
					$this->currentLine=substr($this->currentLine,$lf+1);
				}

				// out of header just forward the rest to web server
				if($this->headerLineUpto<0 && $this->currentLine != "") {
					$this->otherConnection->writeBuf.=$this->currentLine;
					$this->currentLine="";
				}
				return true;
			}
		}
//echo "buf read: $this->conn\n";
		$this->otherConnection->writeBuf.=$buf;
		return true;
	}
	function write() {
		// write the request
		if($this->writeBuf != '') {
//echo "write: $this->conn\n";
			$writeLen=strlen($this->writeBuf);
			$len=socket_write($this->conn,$this->writeBuf,$writeLen);
			$this->sentLen+=$len;
			if($len<$writeLen) {
				$this->writeBuf=substr($this->writeBuf,$len);
			} else { $this->writeBuf=''; }
		}
		$this->checkClose();
		return true;
	}
	function checkClose() {
		if($this->otherConnection==null 
		&& ($this->writeBuf == '' || $this->webConnection) ) {
			// we've written everything over or we're the web connection, and the other side has closed connection, lets close too.
 echo "checkClose: $this->conn\n";
			$this->server->closeConnection($this->conn);
		}
	}

	// send an error back to the user
	function error($mess) {
		$userConn=$this;
		if($this->webConnection) {
			$userConn=$this->otherConnection;
		}
		if($userConn->sentLen==0 && $userConn->writeBuf == '') {
			$userConn->writeBuf="HTTP 404 Error\r\nContent-Type: text/html\r\n\r\n<html><body>Error<br />$this->url<br />$mess</body></html>";
		}
	}
	function close() {
		socket_close($this->conn);
	}
}



class Server {
	var $listenAddr;
	var $listenPort;
	var $connections=null;
	var $nextTimeoutCheck;

	function Server($listenAddr = "0.0.0.0",$listenPort="8080") {
		$this->listenAddr=$listenAddr;
		$this->listenPort=$listenPort;
		$this->nextTimeoutCheck=time()+10;
	}

	function getNewConnection($conn) {
		return $this->connections[$conn]=new Connection($this,$conn);
	}

	function closeConnection($e) {
		$e=intval($e);
		$conn=$this->connections[$e];
		if(!$conn) { return; }
echo "closeconn: $conn(web:$conn->webConnection,$conn->url), $e, recv:$conn->recvLen,send:$conn->sentLen\n";
		if($conn->otherConnection!=null) {
			$otherConnection=$conn->otherConnection;
 echo "close other socket: $otherConnection,$otherConnection->conn\n";
			$otherConnection->otherConnection=null;
			$otherConnection->checkClose();
		}
		$conn->close();
		unset($this->connections[$e]);

 $x=count($this->connections); echo "countconns: $x ($e)\n";
	}

	function checkTimeouts() {
		$t=time();
		if($this->nextTimeoutCheck>$t) {
			return 0;
		}
		$this->nextTimeoutCheck=$t+10;
		$timedouts=0;
		foreach ($this->connections as $conn => $connObj) {
 echo "check timeout $connObj, current:$t, last activity:$connObj->lastActivity\n";
			if($t<($connObj->lastActivity+60)) { continue; }
			$this->closeConnection($conn);
			$timedouts++;
		}
	}

	function writePidFile() {
		$pidFile="/tmp/php_proxy_server.pid";
		$p=fopen($pidFile,"w");
		fputs($p,posix_getpid());
		fclose($p);
	}

	function startServer() {
		$this->connections=array();
		$socket=socket_create(AF_INET,SOCK_STREAM,SOL_TCP);
		if (!$socket || !socket_bind($socket,$this->listenAddr,$this->listenPort)) {
			$errstr=socket_last_error();
			echo "Could not start server: $errstr\n";
			return false;
		}
		if(!socket_listen($socket,16)) {
			$err=socket_last_error();
			echo "Could not listen: $err\n";
			return false;
		}
//		socket_set_nonblock($socket);
		$this->writePidFile();
		while(true) {
			$this->checkTimeouts();
			$r=array($socket);
			$w=array();
			$e=array();
			foreach ($this->connections as $conn => $connObj) {
				if($connObj->writeBuf != '') {
					array_push($w,$connObj->conn);
//echo "selectw: $connObj->conn\n";
				}
				array_push($r,$connObj->conn);
				array_push($e,$connObj->conn);
			}
			$num=socket_select($r,$w,$e,5);
			if($num==0) {
				continue;
			}
			foreach ($r as $rsocket) {
				if($socket==$rsocket && $conn = socket_accept($socket)) {
 echo "accept connection\n";
					socket_set_nonblock($conn);
					$this->getNewConnection($conn);
				}
				else if($this->connections[$rsocket] && !$this->connections[$rsocket]->read()) {
 echo "close socketr: $rsocket\n";
					$this->closeConnection($rsocket);
				}
			}
			foreach ($w as $wsocket) {
				$conn=$this->connections[$wsocket];
				if($conn && !$conn->write()) {
 echo "close socketw: $wsocket\n";
					$this->closeConnection($wsocket);
				}
			}
			foreach ($e as $esocket) {
				if($this->connections[$esocket]) {
					$errstr=socket_last_error();
					$this->connections[$esocket]->error("$errstr");
 echo "close socket: $esocket\n";
					$this->closeConnection($esocket);
				}
			}
		}
		return true;
	}
}

$proxyServer=new Server();
$proxyServer->startServer();


?>
