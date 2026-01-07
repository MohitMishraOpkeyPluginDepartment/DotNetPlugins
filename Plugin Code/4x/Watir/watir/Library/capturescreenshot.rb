require "win32ole"
require 'watir'
@@word=WIN32OLE.new('Word.Application')
@@word.Documents.Add()

	def screenshot()
		@autoit = WIN32OLE.new("AutoItX3.Control")
		@autoit.Send("{PRINTSCREEN}")
		@@word.Selection.Paste	
               # @autoit.Send("{ENTER}")	
	 return generateResult('true','pass',"ScreenShot Captured Successfully")
		
	end
			
	def savefile(path)
		$path = path
		@@word.ActiveDocument.SaveAs($path)
		@@word.ActiveDocument.close
		@@word.Quit
	
	 return generateResult('true','pass',"ScreenShot save Successfully")
	end

         def sendkeywithtimes(command)
		 $event =command
		@autoit = WIN32OLE.new("AutoItX3.Control")
		@autoit.Send($event)
		return generateResult('true','pass',"PageDown")
	end	
	 def pageup()
		 @autoit = WIN32OLE.new("AutoItX3.Control")
		@autoit.Send("{PGUP 9}")
		return generateResult('true','pass',"Pageup")
	end
	
	def linkfocusByName(input)  
               $browser.frame(:index, 5).link(:name => "firstFocus", :index => input).flash
                   sleep (1)
                return generateResult('true','pass',"Parent window is selected")
	end
	#savefile('c:\Result\test.doc')
	#pagedown('PGDN','test')