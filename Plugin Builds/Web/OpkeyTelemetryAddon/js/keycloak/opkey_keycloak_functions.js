// var Keycloak_Auth_Url = 'https://sstsauth.stg.opkeyone.com/auth/';
// var Keycloak_Realm = 'KC_SSTS_Auth';
// var Keycloak_Web_ClientId = 'SSTS';

var Keycloak_Auth_Url = "";
var Keycloak_Realm = "";
var Keycloak_Web_ClientId = "";
var Keycloak_Teams_ClientId = "";
var Sso_enabled = "";
var Sso_idphint = "";
var KeycloakClientName = "";

//var pre_url= window.location.href.indexOf("localhost")>-1? window.base_url:"";

var pre_url = localStorage.getItem('Domain');

//This method must now be deprecated as its name is mis-leading
function get_keycloak_attribute(keycloakClientName,url) {
  keycloak_init_without_force_login(keycloakClientName, null);
}

function _inner_keycloak_init() {
  debugger;

  if (window.keycloak) return;

  window.keycloak = new Keycloak({
    url: Keycloak_Auth_Url,
    realm: Keycloak_Realm,
    clientId: Keycloak_Web_ClientId,
  });

  keycloak
    .init({
      checkLoginIframe: false,
    })
    .then((auth) => {
     
      let chromeId = chrome.runtime.id;
      const loginPageUrl = keycloak.createLoginUrl({
        redirectUri: "https://" + chromeId + ".chromiumapp.org",
      });
      chrome.identity.launchWebAuthFlow(
        {
          url: loginPageUrl,
          interactive: true,
        },
        (authUrl) => {
          if (authUrl) {
            let hash;
            let JsonUrl = {};
            let hashes = authUrl.slice(authUrl.indexOf("?") + 1).split("&");
            for (let i = 0; i < hashes.length; i++) {
              hash = hashes[i].split("=");
              JsonUrl[hash[0]] = hash[1];
            }

            let state = hashes[0].split("#state=")[1];

            let kcObject = localStorage.getItem("kc-callback-" + state);
            kcObject = JSON.parse(kcObject);
            const code = JsonUrl.code;
            let details = {
              redirect_uri: "https://" + chromeId + ".chromiumapp.org",
              client_id: Keycloak_Web_ClientId,
              grant_type: "authorization_code",
              code: code,
              code_verifier: kcObject.pkceCodeVerifier,
            };

            let detailsBody = [];
            for (let property in details) {
              let encodedKey = encodeURIComponent(property);
              let encodedValue = encodeURIComponent(details[property]);
              detailsBody.push(encodedKey + "=" + encodedValue);
            }
            detailsBody = detailsBody.join("&");

            fetch(
              `${Keycloak_Auth_Url}/realms/KC_SSTS_Auth/protocol/openid-connect/token`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/x-www-form-urlencoded",
                },
                body: detailsBody,
              }
            )
              .then((response) => response.json())
              .then((response) => {
                window.keycloak;
                let timeLocal = new Date().getTime();
                set_keycloak_token(response.access_token);
                setToken(
                  response["access_token"],
                  response["refresh_token"],
                  response["id_token"],
                  timeLocal
                );
                document.cookie = "keycloak-token=" + response["access_token"];
                localStorage.setItem(
                  "keycloak-token",
                  response["access_token"]
                );
                // localStorage.setItem("AUTH_SESSION_ID", keycloak.sessionId);
              });
          } else {
            window.keycloak = null;
          }
        }
      );
    })
    .catch(function (e) {
      alert("failed to initialize " + e);
    });

  keycloak.onTokenExpired = () => {
    console.log("token expired", keycloak.token);
    keycloak
      .updateToken(60)
      .success(() => {
        console.log(" new keycloak token ", keycloak.token);
        set_keycloak_token(keycloak.token);
      })
      .error(() => {
        console.error("Unable to refresh keycloak token");
      });
  };
}

function keycloak_init_without_force_login(keycloakClientName, initedCallback) {
  if (window.keycloak) return;

  let xhr = new XMLHttpRequest();
  KeycloakClientName = keycloakClientName;
  xhr.open(
    "GET",
    pre_url +
      "/login/get_keycloak_settings?opkeyone_callsource=" +
      keycloakClientName
  );

  xhr.onload = function () {
    if (xhr.status == 200) {
      var stringfy_settings = xhr.responseText;
      var parse_settings = JSON.parse(stringfy_settings);

      Keycloak_Auth_Url = parse_settings.Keycloak_Auth_Url;
      Keycloak_Realm = parse_settings.Keycloak_Realm;
      Keycloak_Web_ClientId = parse_settings.Keycloak_Web_ClientId;
      Keycloak_Teams_ClientId = parse_settings.Keycloak_Teams_ClientId;
      Keycloak_sso_settings = parse_settings.SSO_Settings;
      Sso_enabled = Keycloak_sso_settings.isEnabled;
      Sso_idphint = Keycloak_sso_settings.IDP_Hint;

      _inner_keycloak_init();
    }
  };

  xhr.send();
}

function keycloak_logout() {
  var logout_redirect_uri = window.location.origin + "/opkeyone/";
  if (Sso_enabled) {
    logout_redirect_uri =
      window.location.origin + "/opkeyone/LoggedOutFromOpkey";
  }
  var logoutOptions = { redirectUri: logout_redirect_uri };
  window.keycloak.logout(logoutOptions);
}

function keycloak_logout_with_redirect_url() {
  if (!window.keycloak) {
    window.keycloak = new Keycloak({
      url: Keycloak_Auth_Url,
      realm: Keycloak_Realm,
      clientId: Keycloak_Web_ClientId,
    });
  }

  window.keycloak.init({ checkLoginIframe: false }).then(function () {
    var logoutOptions = {
      redirectUri: window.location.origin + "/profile/index",
    };
    window.keycloak.logout(logoutOptions);
  });
}

function keycloak_loaduserprofile() {
  window.keycloak
    .loadUserInfo()
    .success(function (data) {
      console.log("keycloak-data", data);
    })
    .error(function (data) {
      console.log("error", data);
      window.location.href = "/";
    });
}

function set_keycloak_token(token) {
  let xhr = new XMLHttpRequest();
  xhr.open(
    "POST",
    pre_url + "/login/create_keycloak_token_cookie?token=" + token
  );
  xhr.send();

  xhr.onload = function () {
    if (xhr.status == 200) {
    }
  };
}

function validate_updatetoken() {
  window.keycloak
    .updateToken(60)
    .then((updated) => {
      console.log("Token Updated?:", updated);
      if (updated) {
        window.set_keycloak_token(window.keycloak.token);
      }
    })
    .catch((err) => {
      console.error("Unable to refresh keycloak token", err);
    });
}

function generateCodeVerifier(length = 96) {
  const array = new Uint8Array(length);
  window.crypto.getRandomValues(array);
  return base64UrlEncode(array);
}

// Encode array buffer to base64url
function base64UrlEncode(arrayBuffer) {
  const base64 = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));
  return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function setToken(token, refreshToken, idToken, timeLocal) {
  if (keycloak.tokenTimeoutHandle) {
    clearTimeout(keycloak.tokenTimeoutHandle);
    keycloak.tokenTimeoutHandle = null;
  }

  if (refreshToken) {
    keycloak.refreshToken = refreshToken;
    keycloak.refreshTokenParsed = jwtDecode(refreshToken);
  } else {
    delete keycloak.refreshToken;
    delete keycloak.refreshTokenParsed;
  }

  if (idToken) {
    keycloak.idToken = idToken;
    keycloak.idTokenParsed = jwtDecode(idToken);
  } else {
    delete keycloak.idToken;
    delete keycloak.idTokenParsed;
  }

  if (token) {
    keycloak.token = token;
    keycloak.tokenParsed = jwtDecode(token);
    keycloak.sessionId = keycloak.tokenParsed.session_state;
    keycloak.authenticated = true;
    keycloak.subject = keycloak.tokenParsed.sub;
    keycloak.realmAccess = keycloak.tokenParsed.realm_access;
    keycloak.resourceAccess = keycloak.tokenParsed.resource_access;

    if (timeLocal) {
      keycloak.timeSkew =
        Math.floor(timeLocal / 1000) - keycloak.tokenParsed.iat;
    }

    if (keycloak.timeSkew != null) {
      if (keycloak.onTokenExpired) {
        var expiresIn =
          (keycloak.tokenParsed["exp"] -
            new Date().getTime() / 1000 +
            keycloak.timeSkew) *
          1000;

        if (expiresIn <= 0) {
          keycloak.onTokenExpired();
        } else {
          keycloak.tokenTimeoutHandle = setTimeout(
            keycloak.onTokenExpired,
            expiresIn
          );
        }
      }
    }
  } else {
    delete keycloak.token;
    delete keycloak.tokenParsed;
    delete keycloak.subject;
    delete keycloak.realmAccess;
    delete keycloak.resourceAccess;

    keycloak.authenticated = false;
  }
}

function jwtDecode(token, options) {
  if (typeof token !== "string") {
    throw new Error("Invalid token specified: must be a string");
  }
  options || (options = {});
  const pos = options.header === true ? 0 : 1;
  const part = token.split(".")[pos];
  if (typeof part !== "string") {
    throw new Error(`Invalid token specified: missing part #${pos + 1}`);
  }
  let decoded;
  try {
    decoded = base64UrlDecode(part);
  } catch (e) {
    throw new Error(
      `Invalid token specified: invalid base64 for part #${pos + 1} (${
        e.message
      })`
    );
  }
  try {
    return JSON.parse(decoded);
  } catch (e) {
    throw new Error(
      `Invalid token specified: invalid json for part #${pos + 1} (${
        e.message
      })`
    );
  }
}

function base64UrlDecode(str) {
  let output = str.replace(/-/g, "+").replace(/_/g, "/");
  switch (output.length % 4) {
    case 0:
      break;
    case 2:
      output += "==";
      break;
    case 3:
      output += "=";
      break;
    default:
      throw new Error("base64 string is not of the correct length");
  }
  try {
    return b64DecodeUnicode(output);
  } catch (err) {
    return atob(output);
  }
}
function b64DecodeUnicode(str) {
  return decodeURIComponent(
    atob(str).replace(/(.)/g, (m, p) => {
      let code = p.charCodeAt(0).toString(16).toUpperCase();
      if (code.length < 2) {
        code = "0" + code;
      }
      return "%" + code;
    })
  );
}
