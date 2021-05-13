document.addEventListener('DOMContentLoaded', () => {
    const checkNav = document.getElementById('check-nav');
    const checkFont = document.getElementById('check-font');
    const checkCanvas = document.getElementById('check-canvas');
    const saveButton = document.getElementById('save');

    chrome.storage.sync.get('checkNav', (result) => {
        if (result?.checkNav)
            checkNav.checked = true;
    })

    chrome.storage.sync.get('checkFont', (result) => {
        if (result?.checkFont)
            checkFont.checked = true;
    })

    chrome.storage.sync.get('checkCanvas', (result) => {
        if (result?.checkCanvas)
            checkCanvas.checked = true;
    })

    saveButton.onclick = function() {
        const checkNavValue = checkNav.checked;
        const checkFontValue = checkFont.checked;
        const checkCanvasValue = checkCanvas.checked;

        chrome.storage.sync.set({
            checkNav: checkNavValue,
            checkFont: checkFontValue,
            checkCanvas: checkCanvasValue
        })

        document.getElementById('status').innerText = 'Successfully saved';
    }
})