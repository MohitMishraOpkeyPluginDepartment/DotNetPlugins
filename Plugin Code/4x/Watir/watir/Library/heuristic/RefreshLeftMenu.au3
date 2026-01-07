
Func _RefreshLeftMenu($title = "TCS B",$text = "",$RefreshPosition = 18)
	WinActivate($title,$text)
	MouseClick("right",49,490)	
	Sleep(200)
	
	$counter = 1
	
	$var = "Refresh"
		
	if $var = "Refresh" then				
		While $counter <= $RefreshPosition	
			Send("{Down}")
			Sleep(100)			
			$counter = $counter + 1
		WEnd
	endIf
	
	;Send("{Down" & $RefreshPosition &"}")
	Send("{Enter}")
EndFunc


$title = $CmdLine[0]
$RefreshPosition = $CmdLine[1]
$text = ""

$RefreshPosition = 18
 _RefreshLeftMenu($title,$text,$RefreshPosition)
