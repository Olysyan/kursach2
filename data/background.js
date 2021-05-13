var extraInfoSpec = ['blocking', 'requestHeaders'];
if (
    chrome.webRequest.OnBeforeSendHeadersOptions.hasOwnProperty('EXTRA_HEADERS')
) {
    extraInfoSpec.push('extraHeaders');
}

chrome.webRequest.onBeforeSendHeaders.addListener(
    details => {
        for (let i = 0; i < details.requestHeaders.length; i++) {
            if (details.requestHeaders[i].name === 'User-Agent') {
                details.requestHeaders[i].value = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:77.0) Gecko/20100101 Firefox/77.0';
            } else if (details.requestHeaders[i].name === 'Accept-Language') {
                details.requestHeaders[i].value = 'en-US,en;q=0.5';
            }
        }
        return { requestHeaders: details.requestHeaders };
    },
    { urls: ['<all_urls>'] },
    extraInfoSpec
);