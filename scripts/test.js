// this is test of the execution API using service account
function testExecutionApi() {
  
  // Im keeping my downloaded JSON key on drive - this is its file ID
  var KEY_ID = '0B92ExLh4POiZUDh4ZDhkMEdQRDQ';
  var jsonKey = JSON.parse(DriveApp.getFileById(KEY_ID).getBlob().getDataAsString());
  
  // get a service account - auths must match the script im executing.
  var serviceAuth = new ServiceAuth()
    .setJsonKey(jsonKey)
    .setScopes(['spreadhsheets']);
    
  // now I can execute the API
  
  
}
/*
*Private Function testSheetGet() As cJobject
    Dim api As cExecutionApi, execPackage As cJobject, args As cJobject
    
    '-- set up a run
    ' generic - get all the data on a given sheet from a given workbook
    Set args = JSONParse("[{'id':'1f4zuZZv2NiLuYSGB5j4ENFc6wEWOmaEdCoHNuv-gHXo', _
        'sheetName':'lookup'}]")
    
    
    Set api = New cExecutionApi
    Set execPackage = api _
        .setFunctionName("execGetData") _
        .setProject("MMo4EFhHV6wqa7IdrGew0eiz3TLx7pV4j") _
        .setDevMode(True) _
        .setArgs(args) _
        .execute
    
    ' see what we got
    Debug.Print JSONStringify(execPackage, True)
    
    ' clear up
    args.tearDown
    
    ' maybe useful for something else
    Set testSheetGet = execPackage
End Function
*/