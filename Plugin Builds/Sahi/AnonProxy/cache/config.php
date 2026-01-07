<?php

$config=array(
'pid_file'=>"anon_proxy_server.pid",
'port'=>'9998',
'anonPort'=>'8082',
'ourUrl'=>'http://localhost:8081/anon_proxy_server/',
'ourHost'=>'localhost',
'configured'=>'1',
'debug'=>'10',
'anonProxy'=>'0',
'anonProxyFailAbort'=>'1',
'anonProxyBlockIntranet'=>'1',
'anonProxyMaxFails'=>'3',
'anonProxyTimeout'=>'15',
'anonProxyHomeBase'=>'',
'maxCacheMegs'=>'500',
'maxLogFileSize'=>'1000000',
'maxLogRotate'=>'4',
'dataTimeOutSeconds'=>'300',
'timeOutSeconds'=>'60',
'php_bin'=>'/usr/local/bin/php','access'=>array(
array(
array(
array('Host','is','intranet'),
array('Host','is','router')
),'No Proxy','No proxy used for http://intranet/... or http://router/...')
,
array(
array(
array('User IP','is','127.0.0.0/8')
),'Allow','allow internal hosts access')
,
array(
array(
array('User IP','is','192.168.0.0/16')
),'Allow','Allow intranet hosts')
,
array(
array(
array('User IP','is not','10.0.0.0/8')
),'Block','Non-intranet hosts not allowed access')
,
array(
array(
array('Host','is not','localhost')
),'Anon','If anonymous proxy is ticked, use it for everything.')

),'phpBeforeConnect'=>'$ok=false; if(!$ok && (($this->userAddrLong>= && $this->userAddrLong<1) == true)) { $ok=true;   }
if(!$ok && (($this->userAddrLong>= && $this->userAddrLong<1) == true)) { $ok=true;   }
if(!$ok && (($this->userAddrLong>= && $this->userAddrLong<1) != true)) { $this->error(\'Non-intranet hosts not allowed access\'); return true;   }
if(!$ok && (substr($this->parsedUrl[\'host\'],strlen($this->parsedUrl[\'host\'])-9) != \'localhost\' 
)) { $ok=true;   }
',
'phpAfterLookup'=>''
);

?>