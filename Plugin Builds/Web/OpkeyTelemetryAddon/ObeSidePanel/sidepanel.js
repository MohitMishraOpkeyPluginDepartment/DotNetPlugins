
(async () => {
  const url = document.URL.split("opkeyUrl=")[1] + "?appType=" + await getCurrentErpAppType();

  const frame = document.getElementById("frame");
  const fallback = document.getElementById("fallback");

  if (url) {
    // Try to load; if the site blocks framing, show fallback message.
    frame.src = url;
    frame.addEventListener("error", () => { frame.style.display = "none"; fallback.style.display = "block"; });
  } else {
    fallback.textContent = "No URL provided for this tab.";
    frame.style.display = "none";
    fallback.style.display = "block";
  }
})();


async function getCurrentErpAppType() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab?.id) {
    return "GENERICAPP";
  }
  console.log(tab)

  var _currentPageUrl = tab.url;

  if (!_currentPageUrl) {
    return "GENERICAPP";
  }
  if (_currentPageUrl.indexOf("oraclecloud.com") > -1) {
    return "ORACLEFUSION";
  }
  else if (_currentPageUrl.indexOf("workday.com") > -1) {
    return "WORKDAY";
  }

  return "GENERICAPP"
}