
function showMyScriptAppResource(s) {
  try {
    return ScriptApp.getResource(s);
  }
  catch (err) {
    throw err + " getting script " + s;
  }
}


function getLibraryInfo () {

  return { 
    info: {
      name:'cServiceAuth',
      version:'0.0.1',
      key:'M-dipVp-nmaoC2XRYyy9nIiz3TLx7pV4j',
      description:'google service account library',
      share:'https://script.google.com/d/1PqmDSzGO6DwhxwAJWyq8xDmiiAbOTse2KoB4MCoziAtrIpYnEdmHhI1K/edit?usp=sharing'
    },
    dependencies:[
    ]
  }; 
}
