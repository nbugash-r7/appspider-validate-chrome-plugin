/**
 * Created by nbugash on 4/1/16.
 */
var _ = require('underscore');

describe('Appspider validate chrome plugin: Multi Pages', function() {
    var appSpiderChromePlugin = undefined;
    var vulReportsPage = undefined;
    var SLEEPTIME = 2000;
    var OBSERVINGTIME = 2000;
    var WAITTIME = 1000;

    /* Run before each test */
    beforeEach(function () {
        browser.ignoreSynchronization = true;
        browser.driver.get('http://localhost:5000/Vulnerabilities.html');
        browser.driver.findElement(by.id('GID_1_0_icon')).click();
        browser.driver.findElement(by.id('testbutton')).click();
        browser.sleep(SLEEPTIME);
        browser.getAllWindowHandles().then(function (handles) {
            vulReportsPage = handles[0];
            appSpiderChromePlugin = handles[1];
            browser.switchTo().window(appSpiderChromePlugin);
        });
    });

    /* Run after each test */
    afterEach(function () {
        browser.sleep(SLEEPTIME);
        browser.close();
        browser.switchTo().window(vulReportsPage);
        expect(browser.getTitle()).toEqual('AppSpider Report (Build 6.6.22.1)');
    });

    it('should have the GET and POST in the dropdown', function() {
        var protocols = ['HTTP', 'HTTPS'];
        var dropdown = element.all(by.css('button.protocol-dropdown-btn')).first();
        dropdown.click().then(function() {
            var dropdownList = element.all(by.css('a.dropdown-item'));
            protocols.forEach(function(protocol, index) {
                expect(dropdownList.getText()).toContain(protocol);
            });
        });

    });

});