function t() {

var creds = JSON.parse(DriveApp.getFileById('0B92ExLh4POiZUDh4ZDhkMEdQRDQ').getBlob().getDataAsString());
  
Logger.log(new ServiceAuth()
  .setJsonKey(creds)
  .setScopes(['drive'])
  .setDuration(3600) // an hour
  .getToken());
}

// service account for Google auth
// called like this
// var serviceAuth = 
// new ServiceAuth()
//  .setJsonKey('the json key')
//  .setId('client id')
//  .setScopes(['drive.readonly','spreadsheets']) // no need to specify the full https:// although you can
//  .setDuration(3600) // an hour
//  .getToken();

var ServiceAuth = function () {

  'use strict';
  
  var self = this;
  
  var settings_ = {
    scope: "https://www.googleapis.com/auth/",
    assertionTarget:"https://www.googleapis.com/oauth2/v3/token",
    tokenRequest:"https://www.googleapis.com/oauth2/v3/token",
    defaultDuration:600,
    minimumTokenLifeSeconds:20, 
    type:'google'
  };
  
  var tokenPacket_, 
      jsonKey_,
      scopes_ ='',
      impersonate_,
      duration_;
  
  /**
   * allow settings to be modified
   * @return {object} settings
   */
  self.getSettings = function() {
    return settings_;
  };
  /**
   * whethere there is a viable token
   * @return {boolean} whether there is a usable token available
   */
  self.hasToken = function () {
    return tokenPacket_ &&  
      tokenPacket_.header.exp > Math.floor(new Date().getTime()/1000) + settings_.minimumTokenLifeSeconds &&
      tokenPacket_.status === 200 &&
      tokenPacket_.content.access_token;
  };
  
  /**
   * get the token
   * @return {string} the service token
   */
  self.getToken = function () {
    if (!self.hasToken() ) {
      makeTokenRequest_ ();
    }
    return tokenPacket_.content.access_token; 
  };
  
  
  /**
   * set the impersonate email, if there is one
   * @param {string} impersonationEmail the email of the user to impersonate
   * @return {cServiceAccount} self
   */
  self.impersonate = function (impersonationEmail) {
    impersonate_ = impersonationEmail;
    return self;
  };
  
  /**
   * set the Json key object created in the developers console
   * @param {string} jsonKey the json key
   * @return {cServiceAccount} self
   */
  self.setJsonKey = function (jsonKey) {
    jsonKey_ = jsonKey;
    return self;
  };
  
  /**
   * set the token duration in seconds
   * @param {number} duration the token duration
   * @return {cServiceAccount} self
   */
  self.setDuration = function (duration) {
    duration_ = duration || settings_.defaultDuration;
    return self;
  };
  
  
  /**
   * set the scopes
   * @param {[string]} scopes an array of required scopes
   * @return {cServiceAccount} self
   */
  self.setScopes = function (scopes) {
    
    // no need to put the full scope .. things tasks.readonly will do.
    scopes_ = scopes.map(function(d) {
      return (settings_.type === 'google' && d.indexOf('https://') === -1) ? settings_.scope + d : d;
    })
    .join(' ');
    
    return self;
  };

  /**
   * b64 and unpad an item suitable for jwt consumptions
   * @param {string} itemString the item to be encoded
   * @return {string}  the encoded
   */
  function encode_ (itemString) {
    return unPad_ (Utilities.base64EncodeWebSafe( itemString));
  }
  /**
   * generate a jwt for firebase using default settings
   * @return {string}  the jwt 
   */
  function generateJWT_ () {
   
    // generate the jwt
    var jwt = encode_(JSON.stringify(tokenPacket_.header)) + "." + encode_(JSON.stringify(tokenPacket_.claims));

    // now sign it 
    var signed = encode_(Utilities.computeRsaSha256Signature (jwt, jsonKey_.private_key));

    // and thats it
    return jwt + "." + signed;
  };

  /**
   * generate a jwt header
   * return {string} a jwt header b64
   */
  function getHeader_ () {
  
    return {
      "alg": "RS256",
      "typ": "JWT" 
    };
  }
  
  /**
   * generate a jwt claim for firebase
   * return {string} a jwt claimsm payload b64
   */
  function getClaims_  (data) {
    
    var now = Math.floor(new Date().getTime()/1000);
    var claims = {
      "iss" : jsonKey_.client_email,
      "scope":scopes_,
      "aud":settings_.assertionTarget,
      "exp":now+duration_,
      "iat":now
    };
      
    if (impersonate_) claims.impersonate = impersonate_;
    return claims;

  }
  
  /**
   * remove padding from base 64 as per JWT spec
   * @param {string} b64 the encoded string
   * @return {string} padding removed
   */
  function unPad_ (b64) {
    return b64 ?  b64.split ("=")[0] : b64;
  }

  /**
   * make token request
   */
  function makeTokenRequest_ () {
    
    // initialize the token
    tokenPacket_ = {
      header: getHeader_(),
      claims: getClaims_()
    };
    
    // request a new one
    var result = UrlFetchApp.fetch(settings_.tokenRequest,{
      method:"POST",
      muteHttpExceptions : true,
      contentType:'application/x-www-form-urlencoded',
      payload:{
        grant_type:"urn:ietf:params:oauth:grant-type:jwt-bearer",
        assertion:generateJWT_()
      } 
    });
    
    tokenPacket_.content = JSON.parse(result.getContentText());
    tokenPacket_.status = result.getResponseCode();
  }
  
  
  return self;
}

