function GDocs(selector) {
  var SCOPE_ = 'https://www.googleapis.com/drive/v2/';
  this.lastResponse = null;
  this.__defineGetter__('SCOPE', function() {
    return SCOPE_;
  });
  this.__defineGetter__('DOCLIST_FEED', function() {
    return SCOPE_ + 'files';
  });
  this.__defineGetter__('CREATE_SESSION_URI', function() {
    return 'https://www.googleapis.com/upload/drive/v2/files?uploadType=resumable';
  });
  this.__defineGetter__('DEFAULT_CHUNK_SIZE', function() {
    return 1024 * 1024 * 100; // 100MB;
  });
};

GDocs.prototype.auth = function(interactive, opt_callback) {
  try {
    chrome.identity.getAuthToken({interactive: interactive}, function(token) {
      if (token) {
        this.accessToken = token;
        opt_callback && opt_callback();
      }
    }.bind(this));
  } catch(e) {
    console.log(e);
  }
};

GDocs.prototype.removeCachedAuthToken = function(opt_callback) {
  if (this.accessToken) {
    var accessToken = this.accessToken;
    this.accessToken = null;
    // Remove token from the token cache.
    chrome.identity.removeCachedAuthToken({ 
      token: accessToken
    }, function() {
      opt_callback && opt_callback();
    });
  } else {
    opt_callback && opt_callback();
  }
};

GDocs.prototype.revokeAuthToken = function(opt_callback) {
  if (this.accessToken) {
    // Make a request to revoke token
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'https://accounts.google.com/o/oauth2/revoke?token=' +
             this.accessToken);
    xhr.send();
    this.removeCachedAuthToken(opt_callback);
  }
}


