
var buildForAutomation = true;

var appSepecificTrackerObject = null;
function startAppSpecificTracker() {
    var _currentPageUrl = document.URL;

    if (_currentPageUrl != null && _currentPageUrl.indexOf("oraclecloud.com") > -1) {
        appSepecificTrackerObject = new CommonErpAppDataTracker();
        appSepecificTrackerObject.startTracking("ORACLEFUSION");
    }
    else if (_currentPageUrl != null && _currentPageUrl.indexOf("workday.com") > -1) {
        appSepecificTrackerObject = new CommonErpAppDataTracker();
        appSepecificTrackerObject.startTracking("WORKDAY");
    }

    else if (opkey_detectERP(_currentPageUrl) != null) {
        var _erpType = opkey_detectERP(_currentPageUrl);
        appSepecificTrackerObject = new CommonErpAppDataTracker();
        appSepecificTrackerObject.startTracking(_erpType);
    }

    else {
        appSepecificTrackerObject = new CommonErpAppDataTracker();
        appSepecificTrackerObject.startTracking("GENERICAPP");
    }
}

function opkey_detectERP(url) {
    // Array of ERP systems with their corresponding identifying substrings
    const erpPatterns = [
        {
            name: "SAP",
            // Example substring: "sapcloud.com"
            identifier: "sapcloud.com"
        },
        {
            name: "SALESFORCE",
            // Example substrings: "salesforce.com", "my.salesforce.com"
            identifier: "salesforce.com"
        },
        {
            name: "PEOPLESOFT",
            // Example substring: "peoplesoft"
            identifier: "peoplesoft"
        },
        {
            name: "MSDYNAMICSFSO",
            // Example substring: "crm.dynamics.com"
            identifier: "crm.dynamics.com"
        },
        {
            name: "VEEVAVAULT",
            // Example substring: "vault.veevavault.com"
            identifier: "vault.veevavault.com"
        },
        {
            name: "COUPA",
            // Example substring: "coupahost.com"
            identifier: "coupahost.com"
        },
        {
            name: "KRONOS",
            // Example substring: "krnos"
            identifier: "kronos"
        }
    ];

    // Iterate through each ERP pattern to find a match
    for (const erp of erpPatterns) {
        if (url.toLowerCase().indexOf(erp.identifier.toLowerCase()) !== -1) {
            return erp.name;
        }
    }

    // If no ERP patterns matched, return "UNKNOWN ERP"
    return null;
}

function startTrackingOnlyWhiteListedUrls() {
    chrome.runtime.sendMessage({
        GetAllAgentWhiteListedUrls: "GetAllAgentWhiteListedUrls"
    }, function (response) {
        if (chrome.runtime.lastError) { }
        if (response != null) {
            for (var wui = 0; wui < response.length; wui++) {
                if (document.URL != null) {
                    if (document.URL.indexOf(response[wui]) > -1) {
                        startAppSpecificTracker();
                    }
                }
            }
        }
    });
}

if (buildForAutomation == true) {
    startAppSpecificTracker();
}
else {
    startTrackingOnlyWhiteListedUrls();
}


function createUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0,
            v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}
