/**
 * Created by nbugash on 3/30/16.
 */
exports.config = {
    seleniumAddress: 'http://localhost:4444/wd/hub',
    specs: [
        'test/singlePage-spec.js',
        'test/multiPage-spec.js'
        //'test/test-spec.js'
    ],
    capabilities: {
        browserName: 'chrome',
        chromeOptions: {
            args: [
                'load-extension=chrome-plugin/'
            ]
        }
    },
    /* Jasmin options */
    jasmineNodeOpts: {
        showColors: true,
        defaultTimeoutInterval: 100000,
        isVerbose: true
    }
};