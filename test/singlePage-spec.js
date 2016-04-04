/**
 * Created by nbugash on 4/1/16.
 */
describe('Appspider validate chrome plugin: Single Page', function() {
    var appSpiderChromePlugin = undefined;
    var vulReportsPage = undefined;
    var SLEEPTIME = 3000;
    var OBSERVINGTIME = 5000;
    var WAITTIME = 2000;

    /* Run before each test */
    beforeEach(function(){
        browser.ignoreSynchronization = true;
        browser.driver.get('http://localhost:5000/Vulnerabilities.html') ;
        browser.driver.findElement(by.id('GID_1_0_icon')).click();
        browser.driver.findElement(by.id('testbutton')).click();
        browser.sleep(SLEEPTIME);
        browser.getAllWindowHandles().then(function(handles) {
            vulReportsPage = handles[0];
            appSpiderChromePlugin = handles[1];
            browser.switchTo().window(appSpiderChromePlugin);
        });
    });

    /* Run after each test */
    afterEach(function(){
        browser.sleep(SLEEPTIME);
        browser.close();
        browser.switchTo().window(vulReportsPage);
        expect(browser.getTitle()).toEqual('AppSpider Report (Build 6.6.22.1)');
    });

    it('should open the plugin', function() {
        expect(browser.getTitle()).toEqual('Validate');
    });

    it('should have the header textarea to be not editable', function() {
        var headerTextArea = element(by.id('appspider-request-header-1'));
        expect(headerTextArea.getAttribute('readonly')).toBeTruthy();
    });

    it('should have the payload textarea to be editable', function() {
        var attackPayload = element(by.id('attack-payload-1'));
        attackPayload.clear();
        expect(attackPayload.getAttribute('value')).toBe('');
    });

    it('should have the attack response header textarea to be editable', function() {
        var attackResponseHeader = element(by.id('appspider-response-header-1'));
        attackResponseHeader.clear();
        expect(attackResponseHeader.getAttribute('value')).toBe('');
    });

    it('should have the attack response content textarea to be editable', function() {
        var attackResponseContent = element(by.id('appspider-response-content-1'));
        attackResponseContent.clear();
        expect(attackResponseContent.getAttribute('value')).toBe('');
    });

    it('should have the payload value to change', function() {
        var attackPayload = element(by.id('attack-payload-1'));
        var attackPayloadModel = element.all(by.model('attack.request.payload')).first();
        attackPayload.clear();
        attackPayload.sendKeys('Writing on the payload');
        expect(attackPayloadModel.getAttribute('value')).toBe('Writing on the payload');
    });

    it('should show a modal of the header when the textarea for attack header was clicked', function() {
        var requestTextarea = element.all(by.model('attack.request')).first();
        requestTextarea.click().then(function() {
            expect(element(by.className('modal-content')).isDisplayed()).toBeTruthy();
            element(by.css('div.modal-header > button.close')).click();
        });
    });

    it('should show a modal of the parameter', function() {
        var parambutton = element.all(by.css('div.attack-url > div.input-group-btn:last-child > button.appspider-btn')).first();
        parambutton.click();
        browser.sleep(WAITTIME);
        expect(element(by.className('modal-content')).isDisplayed()).toBeTruthy();
        expect(element(by.css('div.modal-header > h3')).getText()).toBe('Parameters');
        browser.sleep(OBSERVINGTIME);
        element(by.css('div.modal-header > button.close')).click();
    });

    it('should show a modal of the cookie', function(){
        var cookiebutton = element.all(by.css('button.appspider-btn-cookies')).first();
        cookiebutton.click();
        browser.sleep(WAITTIME);
        expect(element(by.className('modal-content')).isDisplayed()).toBeTruthy();
        expect(element(by.css('div.modal-header > h3')).getText()).toBe('Cookies');
        browser.sleep(OBSERVINGTIME);
        element(by.css('div.modal-header > button.close')).click();
    });

    it('should have the GET and POST in the dropdown', function() {
        var httpVerbs = ['GET', 'POST'];
        var dropdown = element.all(by.css('div.attack-url > div.input-group-btn > ' +
            'button.dropdown-toggle')).first();
        dropdown.click().then(function() {
            var dropdownList = element.all(by.css('a.dropdown-item'));
            httpVerbs.forEach(function(httpVerb, index) {
                expect(dropdownList.getText()).toContain(httpVerb);
            });
        });

    });

    it('should have the HTTP and HTTPS in the dropdown list for the protocol button', function() {
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