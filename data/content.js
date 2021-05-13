const content = function (nav, font, canvas) {
        const Ns = {

            Settings: {
                NavigatorProtection: true,
                FontProtection: true,
                CanvasProtection: true
            },

            navigatorProtection: function () {
                const fakeUserAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:77.0) Gecko/20100101 Firefox/77.0';
                window.navigator.__defineGetter__('appVersion', function () {
                    return fakeUserAgent.substr(8);
                });
                window.navigator.__defineGetter__('language', function () {
                    return 'en-US';
                });
                window.navigator.__defineGetter__('languages', function () {
                    return ['en-US', 'en'];
                });
                window.navigator.__defineGetter__('mimeTypes', function () {
                    return { length: 0 };
                });
                window.navigator.__defineGetter__('oscpu', function () {
                    return undefined;
                });
                window.navigator.__defineGetter__('platform', function () {
                    return 'Win32';
                });
                window.navigator.__defineGetter__('plugins', function () {
                    return { length: 0 };
                });
                window.navigator.__defineGetter__('userAgent', function () {
                    return fakeUserAgent;
                });
            },

            fontProtection() {
                const inject = function () {
                    const shift = () => Math.floor(Math.random() * 2) - 1;
                    Object.defineProperty(HTMLElement.prototype, 'offsetHeight', {
                        get() {
                            const height = Math.floor(this.getBoundingClientRect().height);
                            return height + shift();
                        }
                    });
                    Object.defineProperty(HTMLElement.prototype, 'offsetWidth', {
                        get() {
                            const width = Math.floor(this.getBoundingClientRect().width);
                            return width + shift();
                        }
                    });
                    document.documentElement.dataset.allow = true;
                };

                const script_1 = document.createElement('script');
                script_1.textContent = '(' + inject + ')()';
                document.documentElement.appendChild(script_1);
                script_1.remove();

                if (document.documentElement.dataset.allow !== 'true') {
                    const script_2 = document.createElement('script');
                    script_2.textContent = `{
                    const iframes = [...window.top.document.querySelectorAll("iframe[sandbox]")];
                    for (var i = 0; i < iframes.length; i++) {
                        if (iframes[i].contentWindow) {
                            if (iframes[i].contentWindow.HTMLElement) {
                                iframes[i].contentWindow.HTMLElement.prototype.offsetWidth = HTMLElement.prototype.offsetWidth;
                                iframes[i].contentWindow.HTMLElement.prototype.offsetHeight = HTMLElement.prototype.offsetHeight;
                            }
                        }
                    }
                }`;
                    window.top.document.documentElement.appendChild(script_2);
                    script_2.remove();
                }
            },

            canvasProtection() {
                const inject = function () {
                    const toBlob = HTMLCanvasElement.prototype.toBlob;
                    const toDataURL = HTMLCanvasElement.prototype.toDataURL;

                    HTMLCanvasElement.prototype.noise = function () {
                        const { width, height } = this;
                        const context = this.getContext('2d');
                        const shift = () => Math.floor(Math.random() * 10) - 5;

                        const iData = context.getImageData(0, 0, width, height);
                        for (let i = 0; i < height; i++) {
                            for (let j = 0; j < width; j++) {
                                const index = ((i * (width * 4)) + (j * 4));
                                iData.data[index] = iData.data[index] + shift();
                                iData.data[index + 1] = iData.data[index + 1] + shift();
                                iData.data[index + 2] = iData.data[index + 2] + shift();
                                iData.data[index + 3] = iData.data[index + 3] + shift();
                            }
                        }
                        context.putImageData(iData, 0, 0);
                    };

                    Object.defineProperty(HTMLCanvasElement.prototype, 'toBlob', {
                        value: function () {
                            this.noise();
                            return toBlob.apply(this, arguments);
                        }
                    });
                    Object.defineProperty(HTMLCanvasElement.prototype, 'toDataURL', {
                        value: function () {
                            this.noise();
                            return toDataURL.apply(this, arguments);
                        }
                    });
                    document.documentElement.allowcanvas = true;
                };
                const script_1 = document.createElement('script');
                script_1.textContent = '(' + inject + ')()';

                document.documentElement.appendChild(script_1);
                script_1.remove();

                if (document.documentElement.dataset.allowcanvas !== 'true') {
                    const script_2 = document.createElement('script');
                    script_2.textContent = `{
                        const iframes = [...window.top.document.querySelectorAll("iframe[sandbox]")];
                        for (var i = 0; i < iframes.length; i++) {
                            if (iframes[i].contentWindow) {
                                if (iframes[i].contentWindow.HTMLCanvasElement) {
                                    Object.assign(iframes[i].contentWindow.HTMLCanvasElement.prototype, {
                                        toBlob: HTMLCanvasElement.prototype.toBlob,
                                        toDataURL: HTMLCanvasElement.prototype.toDataURL,
                                        noise: HTMLCanvasElement.prototype.noise
                                    })
                                }
                            }
                        }
                    }`;
                    window.top.document.documentElement.appendChild(script_2);
                    script_2.remove();
                }
            },
        };

        if (nav)
            Ns.navigatorProtection();
        if (font)
            Ns.fontProtection();
        if (canvas)
            Ns.canvasProtection();
    }
;


(function () {
    const init = function (nav, font, canvas) {
        const script = document.createElement('script');
        script.textContent = '(' + content.toString() + `)(${nav}, ${font}, ${canvas});`;
        const doc = (document.head || document.documentElement);
        doc.insertBefore(script, doc.firstChild);
        script.parentNode.removeChild(script);
    };

    chrome.storage.sync.get(null, function(data) {
        const { checkNav, checkFont, checkCanvas } = data;
        if (checkNav === undefined || checkNav === null) chrome.storage.sync.set({ checkNav: true });
        if (checkFont === undefined || checkFont === null) chrome.storage.sync.set({ checkFont: true });
        if (checkCanvas === undefined || checkCanvas === null) chrome.storage.sync.set({ checkCanvas: true });
        let nav = typeof checkNav === 'boolean' ? checkNav : true;
        let font = typeof checkFont === 'boolean' ? checkFont : true;
        let canvas = typeof checkCanvas === 'boolean' ? checkCanvas : true;
        init(nav, font, canvas);
    })
})();