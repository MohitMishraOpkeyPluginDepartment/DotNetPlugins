
//"Dest IP",
stype=new Array("","Host","Url","Url Regex","User IP","Port","Time","Day of Week","User Auth","Label");

stypeUserAuth=8;
var url_mess="Url will not work for https: because it is encrypted.";
stypeHelp=new Array(
"",
"'google.com' will include www.google.com, news.google.com, etc.",
""+url_mess,
"Type in a <a target=_blank href='http://en.wikipedia.org/wiki/Regular_expression'>regular expression</a>. "+url_mess,
"The ip or network of the user (ie. 10.0.5.1,  10.0.5.0/24, ...)",
"Port number, a number or a range ex: 1024-65535",
"Time of day (ie. 21:00-05:00, 12:00-13:00, ...)",
"Sun, Mon, etc.",
"Special user authentication, put in the command line of a program.<br />If the command returns 0 then the user is ok.<br />This rule will be forced to BLOCK + IS NOT (ie. block if !=0). Authenication with socks is not available yet. <a href='http://anonproxyserver.sourceforge.net/doc.html?d=userAuth' target='_blank'>Click here for instructions/examples.</a>",
"A label name that you have defined from a PREVIOUS action.",
"<a target=_blank href='findmac.php'>MAC address</a> of the user's machine."
);



targetBlock=0;
targetAnd=8;
target=new Array("Block","Allow","No Proxy","No cache","Url Redirect","Anon","Other Proxy","Label","And...");

targetHelp=new Array(
"Block access if anything matches, enter the reason in the text box below, this will be sent to the user.",
"Allow access if anything matches",
"Don't use the proxy if anything matches, the browser should use a direct connection instead. This is acheived via changes in the .pac file, certain options will not work: Port, Label, User Auth. ",
"Don't store into the cache if anything matches",
"Redirect the to another location if anything matches, enter the new url into the text box below.(ie. http://news.google.com/)",
"Use the anonymous proxy if anything matches, only useful in anonymous proxy mode.",
"Use another proxy if anything matches, enter the proxy into the text box(ie. proxy.xxx.com:8080)",
"Enter the name of a label in the text box below, it can be used later, in another step.",
"If this action matches, we will continue to the next action"
);
istype=new Array("is","is not");

function getSelectStr(arr,name,sel) {
	var s="";
	s+="<select name="+name+">";
	for(c=0; c<arr.length; c++) {
		s+="<option"+(sel==arr[c]?" selected":"")+" value=\""+arr[c]+"\">"+arr[c];
	}
	s+="</select>";
	return s;
}

function delAccessDivUrl(suf) {
	var divObj=document.getElementById('accessDivUrl'+suf);
	document.the_form['access_stype'+suf].selectedIndex=0;
	divObj.style.display="none";
}


function createAccessDivUrl(i,u,acc) {
	var urlDiv=document.createElement("DIV");
	var suf=i+"_"+u;
	urlDiv.id='accessDivUrl'+suf;
	var s="<div id=div_access_stypeh"+suf+"></div>";
	s+=getSelectStr(stype,"access_stype"+suf+" onchange='checkStype(\""+suf+"\")'",acc[0]);
	s+=getSelectStr(istype,"access_istype"+suf,acc[1]);
	s+="<input name=access_url"+suf+" size=30 value=\""+(acc[2]==undefined?"":acc[2])+"\" />";
	s+="<a href=\"javascript:delAccessDivUrl('"+suf+"');\"><img border=0 src=img/cross16.gif alt=Delete title=Delete></a>";
	urlDiv.innerHTML=s;
	return urlDiv;
}

function appendAccessDivUrl(i) {
	var divurls=document.getElementById('accessDivUrls'+i);
	var urlDiv=createAccessDivUrl(i,document.the_form["accessDivUrlsUpto"+i].value++,new Array());
	divurls.appendChild(urlDiv);
}



function renameAccessDiv(i,oldi) {
	for(var num=0; num<accessDivUpto; num++) {
		var order=getAccessDivOrder(num);
		if(order==oldi) {
			setAccessDivOrder(oldi,i);
		}
	}
//	setAccessDivOrder(i,oldi);
//	document.the_form['accessDivOrder'+oldi].value=i;
}

function upAccessDiv(n) {
	var o=getAccessDivOrder(n);
	if(o>0) {
		var swapi=findAccessDivByOrder(o-1);
		swapAccessDiv(swapi,n);
	}
}
function upAccessDivEvent(e) {
	if(!e) { e=window.event; }
	var n=findParentAccessDivNum(e);
}

function downAccessDiv(n) {
	var o=getAccessDivOrder(n);
	if((o+1)<accessDivUpto) {
		var swapi=findAccessDivByOrder(o+1);
		swapAccessDiv(n,swapi);
	}
}

function downAccessDivEvent(e) {
	if(!e) { e=window.event; }
	var n=parseInt(findParentAccessDivNum(e));
	downAccessDiv(n);
}

function insertAccessDivEvent(e) {
	if(!e) { e=window.event; }
	insertAccessDiv(findParentAccessDivNum(e));
}
function delAccessDivEvent(e) {
	if(!e) { e=window.event; }
	delAccessDiv(findParentAccessDivNum(e));
}
function appendAccessDivUrlEvent(e) {
	if(!e) { e=window.event; }
	appendAccessDivUrl(findParentAccessDivNum(e));
}
function checkTargetEvent(i,e) {
	if(!e) { e=window.event; }
	checkTarget(document.the_form["access_target"+i],findParentAccessDivNum(e));
}

function insertAccessDiv(i) {
	var order=getAccessDivOrder(i);
	for(var num=0; num<accessDivUpto; num++) {
		var o=getAccessDivOrder(num);
		if(o<0) { continue; }
		if(o>=order) {
			setAccessDivOrder(num,o+1);
		}
	}

	var beforeDiv=document.getElementById("access_divp"+i);
	var ndiv=createAccessDiv(accessDivUpto,0);
	var access_div=document.getElementById('access_div');
	access_div.insertBefore(ndiv,beforeDiv);

	setAccessDivOrder(accessDivUpto,order);
	// run checkTarget so we pretend that we've set a value to the new acessDiv
	checkTarget(document.the_form['access_target'+accessDivUpto],accessDivUpto);
	document.the_form.accessDivUpto.value=++accessDivUpto;
	//fixDispNums();
}

function addAccessDiv(i,preSelect) {
	var access_div=document.getElementById('access_div');
	var ndiv=createAccessDiv(i,preSelect);
	access_div.appendChild(ndiv);
	fixDispNums();
}


function findParentAccessDivNum(e) {
	var obj=e.srcElement?e.srcElement:e.target;
	while(obj.parentNode) {
		if(obj.id && obj.id.substr(0,11)=="access_divp") {
			return obj.id.substr(11);
		}
		obj=obj.parentNode;
	}
	return 0;
}

selectedAccessDiv=null;
function mouseoverAccessDiv(e) {
	if(selectedAccessDiv==null) { return; }
	if(!e) { e=window.event; }
	var fromNum=selectedAccessDiv.id.substr(11);
	var fromOrder=getAccessDivOrder(fromNum);
	var num=findParentAccessDivNum(e);
	var divObj=document.getElementById("access_divp"+num);
	var destOrder=getAccessDivOrder(num);
	if(destOrder>fromOrder) {
		downAccessDiv(fromNum);
	} if(destOrder<fromOrder) {
		upAccessDiv(fromNum);
	}
}

function mousedownAccessDiv(e) {
	if(!e) { e=window.event; }
	var num=findParentAccessDivNum(e);
	var divObj=document.getElementById("access_divp"+num);
//	divObj.style.backgroundColor="#f3e0c8";
	selectedAccessDiv=divObj;

	var access_hand=document.getElementById("access_hand");
	access_hand.style.display="block";

	return false;
}

function mousemoveAccessDiv(e) {
	if(!e) { e=window.event; }
	if(selectedAccessDiv==null) { return; }
	var num=selectedAccessDiv.id.substr(11);
	var access_hand=document.getElementById("access_hand");

	var x=0,y=0;
	if(e.pageX || e.pageY) {
		x=e.pageX;
		y=e.pageY;
	} else if(e.clientX || e.clientY) {
		x=e.clientX+document.body.scrollLeft;
		y=e.clientY+document.body.scrollTop;
	}
	access_hand.style.left=x-18;
	access_hand.style.top=y-18;
}
function mouseupAccessDiv(e) {
	if(selectedAccessDiv!=null) {
		var access_hand=document.getElementById("access_hand");
		access_hand.style.display="none";
		selectedAccessDiv.style.backgroundColor="";
	}
	selectedAccessDiv=null;
	return false;
}

function fixDispNums() {
	var numUpto=1;
	var doingAnd=0;
	for(var ordi=0; ordi<accessDivUpto; ordi++) {
		var i=findAccessDivByOrder(ordi);
		var target=document.the_form['access_target'+i];
		var dispNumDiv=document.getElementById('accessDivDispNum'+i);
		if(!target || !dispNumDiv) { continue; }
		var doNum=1;
		if(target.options[target.selectedIndex].value.substr(0,3)=="And") {
			if(doingAnd) { doNum=0; }
			doingAnd=1;
		} else if(doingAnd) {
			doNum=0;
			doingAnd=0;
		}
		if(doNum) {
			dispNumDiv.innerHTML=((numUpto<10)?'&nbsp;':'')+numUpto+".";
			numUpto++;
		} else {
			dispNumDiv.innerHTML='&nbsp;&nbsp;&nbsp;';
		}
	}
}

function createAccessDiv(i,preSelect) {
	var ndiv=document.createElement("DIV");
	ndiv.id="access_divp"+i;
	ndiv.onmouseover=mouseoverAccessDiv;

	var ntable=document.createElement("TABLE");
	ntable.cellSpacing=0;
	ntable.cellPadding=2;
	var ntr=ntable.insertRow(-1);
	var ntd2=ntr.insertCell(-1);
	ntd2.vAlign="top";
	ntd2.className="totalnum";
	var ntd=ntr.insertCell(-1);
	ntd.vAlign="top";

	var acc=access[i];
	if(!preSelect)  {acc=undefined; }
	var accUrl=new Array();
	if(acc!=undefined) { accUrl=acc[0]; }
	var ndivurls=document.createElement("DIV");
	ndivurls.id="accessDivUrls"+i;
	for(u=0; accUrl[u]; u++) {
		var urlDiv=createAccessDivUrl(i,u,accUrl[u]);
		ndivurls.appendChild(urlDiv);
	}
	if(u==0) {
		ndivurls.appendChild(createAccessDivUrl(i,u++,new Array()));
	}
	ntd.appendChild(ndivurls);

	ntd.innerHTML+="<center><a href=\"javascript:;\" onclick=\"appendAccessDivUrlEvent(event);\"><img src=img/add_down_flat.gif border=0 alt=Add title=Add></a></center>";
	var str="";
	str+="<div style='display: none;' id='access_target_help"+i+"'></div>";
	str+="<input type=hidden name=accessDivUrlsUpto"+i+" value="+u+" />";
	str+="<input type=hidden size=3 name=accessDivOrder"+i+" value="+i+" /><div style='display: inline' class=mspace id='accessDivDispNum"+i+"'></div>";

	str+=getSelectStr(target,"access_target"+i+" onchange='checkTargetEvent("+i+",event)'",acc==undefined?"":acc[1]);
	str+="<div id=access_hand"+i+" style='display: inline;' onmousedown='mousedownAccessDiv(event)'><img src=img/hand.gif onmousedown='return false;' ondragstart='return false;' alt=Move title='Drag to move' style='cursor:move;'></div>";
//	str+="<a href=\"javascript:;\" onclick=\"upAccessDivEvent(event);\"><img src=img/move_up.gif border=0 alt=Up title=Up></a>";
//	str+="<a href=\"javascript:;\" onclick=\"downAccessDivEvent(event);\"><img src=img/move_down.gif border=0 alt=Down title=Down></a>";
	str+="<a onclick=\"insertAccessDivEvent(event)\" href=\"javascript:;\"><img src=img/add_down_flat.gif border=0 alt=Insert title=Insert></a>";
	str+="<a href=\"javascript:;\" onclick=\"delAccessDivEvent(event);\"><img src=img/cross16.gif border=0 alt=Delete title=Delete></a>"+
		"<br><div id=div_access_and"+i+" style='display:none'><img src=img/and.gif></div><div id=div_access_comment"+i+"><textarea cols=19 rows=2 name=access_comment"+i+">"+(acc==undefined?"":acc[2])+"</textarea></div>";
	ntd2.innerHTML=str;

	ndiv.appendChild(ntable);
	return ndiv;
}



currentStypeHelpDiv=null;
function checkStype(suf) {
	var stypeHelpDiv=document.getElementById("div_access_stypeh"+suf);
	var s=document.the_form["access_stype"+suf].selectedIndex;
	if(currentStypeHelpDiv!=null) {
		currentStypeHelpDiv.style.display="none";
		currentStypeHelpDiv.innerHTML="";
	}
	if(s==stypeUserAuth) {
		document.the_form["access_istype"+suf].selectedIndex=1;
		var sufArr=suf.split("_");
		var targetObj=document.the_form["access_target"+sufArr[0]];
		if(targetObj.selectedIndex!=targetAnd && targetObj.selectedIndex!=targetBlock)
			targetObj.selectedIndex=targetBlock;
	}
	stypeHelpDiv.innerHTML="<font class=smallf>"+stypeHelp[s]+"</font>";
	stypeHelpDiv.style.display="block";
	currentStypeHelpDiv=stypeHelpDiv;
}

prevTargetHelpDiv=undefined;
function checkTarget(t,i)
{
	var commentDiv=document.getElementById("div_access_comment"+i);
	var targetHelpDiv=document.getElementById("access_target_help"+i);
	var andDiv=document.getElementById("div_access_and"+i);
	if(t.options[t.selectedIndex].value.substr(0,3)=="And") {
		// Remove the comment box if user picked "and"
		commentDiv.style.display="none";
		andDiv.style.display="block";
	} else {
		commentDiv.style.display="block";
		andDiv.style.display="none";
	}

	if(prevTargetHelpDiv!=undefined) {
		prevTargetHelpDiv.style.display='none';
	}
	if(targetHelpDiv.style.display=="none") {
		targetHelpDiv.style.display="inline";
	} else {
		targetHelpDiv.innerHTML="<table width='170' cellspacing='0' cellpadding='0' border='0'><tr><td style='border: 0px' class='help'>"+targetHelp[t.selectedIndex]+"</td></tr></table>";
	}
	fixDispNums();
}



function userAppendAccessDiv() {
	var i=accessDivUpto;
	appendAccessDiv();
	// run checkTarget so we pretend that we've set a value to the new acessDiv
	checkTarget(document.the_form['access_target'+i],i);
}

function appendAccessDiv() {
	addAccessDiv(accessDivUpto++,0);
	document.the_form.accessDivUpto.value=accessDivUpto;
}

function getAccessDivOrder(i) {
	if(!document.the_form['accessDivOrder'+i]) { return -1; }
	return parseInt(document.the_form['accessDivOrder'+i].value);
}

function findAccessDivByOrder(o) {
	for(var i=0; i<accessDivUpto; i++) {
		if(o==getAccessDivOrder(i)) { return i; }
	}
	return -1;
}

function setAccessDivOrder(i,newi) {
	if(!document.the_form['accessDivOrder'+i]) { return; }
	document.the_form['accessDivOrder'+i].value=newi;
}

function swapAccessDiv(shifti1,shifti2) {
	var access_div=document.getElementById("access_div");
	var divObj1=document.getElementById("access_divp"+shifti1);
	var divObj2=document.getElementById("access_divp"+shifti2);
	access_div.removeChild(divObj2);
	access_div.insertBefore(divObj2,divObj1);

	var o1=getAccessDivOrder(shifti1);
	var o2=getAccessDivOrder(shifti2);
	setAccessDivOrder(shifti1,o2);
	setAccessDivOrder(shifti2,o1);
	fixDispNums();
}


function delAccessDiv(i) {
	var access_div=document.getElementById('access_div');

	var order=getAccessDivOrder(i);
	setAccessDivOrder(i,-1);
	for(var num=0; num<accessDivUpto; num++) {
		var o=getAccessDivOrder(num);
		if(o<0) { continue; }
		if(o>order) {
			setAccessDivOrder(num,o-1);
		}
	}
	var access_divp=document.getElementById('access_divp'+i);
	access_div.removeChild(access_divp);
	fixDispNums();
}

