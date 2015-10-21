// this is test of the execution API using service account
function testExecutionApi() {

  // Im keeping my downloaded JSON key on drive - 
  var projectKey = 'M9Bz3CpKhkwFxMs-wGDnwWSz3TLx7pV4j';
  var fileId = '0B92ExLh4POiZbHc4U29CQXdMelk';
  
  // get the credentials for the service account produced by cloud console
  var jsonKey = JSON.parse(DriveApp.getFileById(fileId).getBlob().getDataAsString());

  // get a service account - auths must match the script im executing.
  var serviceAuth = new ServiceAuth()
    .setJsonKey(jsonKey)
    .setScopes(['spreadsheets'])
    .build();
    
  // see if it worked
  if (!serviceAuth.hasToken()) {
    throw 'failed to get token ' + JSON.stringify(serviceAuth.getTokenResult());
  }
  // now I can execute the API
  var request = {
    "function":"trythis",
    "devMode":true,
    "parameters": [{
      "id":"1f4zuZZv2NiLuYSGB5j4ENFc6wEWOmaEdCoHNuv-gHXo",
      "sheetName":"lookup"
    }] 
  };

  
  var url = 'https://script.googleapis.com/v1/scripts/' + projectKey + ':run'
  var result = UrlFetchApp.fetch(url, {
    method:"POST",
    payload:request,
    muteHttpExceptions:true,
    headers:{
      authorization:"Bearer " + serviceAuth.getToken() 
    }
  });
  Logger.log(result);
}

/*
// under Publish > Deploy as API executable.
var scriptId = "<ENTER_YOUR_SCRIPT_ID_HERE>";

// Initialize parameters for function call.
var sheetId = "<ENTER_ID_OF_SPREADSHEET_TO_EXAMINE_HERE>";

// Create execution request.
var request = {
    'function': 'getSheetNames',
    'parameters': [sheetId],
    'devMode': true   // Optional.
};

// Make the request.
var op = gapi.client.request({
    'root': 'https://script.googleapis.com',
    'path': 'v1/scripts/' + scriptId + ':run',
    'method': 'POST',
    'body': request
});
function t() {

var creds = JSON.parse(DriveApp.getFileById('0B92ExLh4POiZUDh4ZDhkMEdQRDQ').getBlob().getDataAsString());

Logger.log(new ServiceAuth()
  .setJsonKey(creds)
  .setScopes(['drive'])
  .setDuration(3600) // an hour
  .getToken());
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