function LocalFindProxyForURL() { return 'DIRECT'; }
function FindProxyForURL(url,host) {
labels=new Array();
<?php $http_host=$_SERVER["HTTP_HOST"]; $colon=strpos($http_host,":"); if($colon>0) { $http_host=substr($http_host,0,$colon); } ?>if(host=="anon_proxy_server") { return "PROXY <?php echo "$http_host:9998"; ?>;"; }
if(host=="127.0.0.1" || host=="localhost" || host=="localhost") { return "DIRECT"; }
if( ((host.length>=8 && host.substr(host.length-8) == "intranet") == true || (host.length>=6 && host.substr(host.length-6) == "router") == true )
) { return "DIRECT"; }
if(!shExpMatch(url,"http:*") && !shExpMatch(url,"https:*")) { return "SOCKS <?php echo "$http_host:9998"; ?>"; } 
return "PROXY <?php echo "$http_host:9998"; ?>;";
}
