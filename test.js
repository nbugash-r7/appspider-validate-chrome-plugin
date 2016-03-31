/**
 * Created by nbugash on 3/30/16.
 */
exports.config = {
    seleniumAddress: 'http://localhost:4444/wd/hub',
    specs: ['test/plugin-spec.js'],
    capabilities: {
        browserName: 'chrome',
        chromeOptions: {
            args: [
                'load-extension=chrome-plugin/'
            ]
        }
    }
};