Function Method_highlightObject12(properties)
    opvar              = TRUE
    DIM obj_index,opvar,indexORLocation
    mess               = " "
    SET  o_myObj       = f_getObjDescription (properties)
    SET obj_Collection = g_page.ChildObjects(o_myObj)
    indexORLocation    = f_getIndOrLoc(properties)

    FOR i = 1 TO 15

        IF  (obj_Collection.COUNT = 0)  THEN
            Wait (SYNCRONIZATION_TIME)
            SET obj_Collection = g_Page.ChildObjects(o_myObj)
        ELSE
            EXIT FOR
        END IF

    NEXT

    IF obj_Collection.COUNT = 0 THEN
        mess                   = "No object found for specified properties"
        opvar                  = FALSE
        returnString           = "<KeywordOutput><Result><![CDATA[" & opvar & "]]></Result><Status><![CDATA[" & opvar & "]]></Status><Message><![CDATA[" & mess & "]]></Message></KeywordOutput>"
        Method_highlightObject = returnString
        EXIT FUNCTION
    END IF

    IF (obj_Collection.COUNT = 1 AND indexORLocation <> " ") OR((obj_Collection.COUNT = 1 OR obj_Collection.COUNT > 1 ) AND indexORLocation = " ") THEN
        obj_index              = 0
    ELSEIF   (obj_Collection.COUNT > 1 AND indexORLocation <> " ") THEN
        obj_index              = indexORLocation
    ELSE
        mess                   = "More than one object found for specified properties"
        opvar                  = FALSE
        returnString           = "<KeywordOutput><Result><![CDATA[" & opvar & "]]></Result><Status><![CDATA[" & opvar & "]]></Status><Message><![CDATA[" & mess & "]]></Message></KeywordOutput>"
        Method_highlightObject = returnString
        EXIT FUNCTION
    END IF

    On Error Resume Next
    obj_Collection(obj_index).highlight

    IF ERR.NUMBER <> 0 THEN
        opvar = FALSE
        mess  = ERR.DESCRIPTION
        ERR.CLEAR()
    ELSE
        opvar = TRUE
        mess  = "Focussed"
    END IF

    returnString           = "<KeywordOutput><Result><![CDATA[" & mess & "]]></Result><Status><![CDATA[" & opvar & "]]></Status><Message><![CDATA[" & mess & "]]></Message></KeywordOutput>"
    Method_highlightObject = returnString
END FUNCTION
