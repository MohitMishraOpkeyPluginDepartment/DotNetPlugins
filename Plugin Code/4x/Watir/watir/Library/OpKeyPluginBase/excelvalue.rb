#require 'watir'


#def getCellValueWatir ($strUtilityPath,intSheetNumber,intRowNumber,intColumnsNumber)
      
  #    @@objExcel = WIN32OLE.new("excel.application")
   #   @@strUtilityBook=@@objExcel.workbooks.open($strUtilityPath,1)
     # @@strUtilitySheet=@@strUtilityBook.worksheets(intSheetNumber.to_i)
      #@@strUtilityCells=@@strUtilitySheet.UsedRange
       #@@strTestScript = @@strUtilityCells.Rows(intRowNumber.to_i).Columns(intColumnsNumber.to_i).Text
       #return generateResult(@@strTestScript) 
     #  return @@strTestScript
  #end




#def setCellValueWatir ($strUtilityPath,intSheetNumber,intRowNumber,intColumnsNumber,intvalue)
      #
      #@@objExcel = WIN32OLE.new("excel.application")
      #@@strUtilityBook=@@objExcel.workbooks.open($strUtilityPath,1)
      #@@strUtilitySheet=@@strUtilityBook.worksheets(intSheetNumber.to_i)
      #@@strUtilityCells=@@strUtilitySheet.UsedRange
      #@@strUtilityCells.Rows(intRowNumber.to_i).Columns(intColumnsNumber.to_i).Text = intvalue
     #  return generateResult(@@strTestScript) 
     #  return @@strTestScript
  #end
