/**
 * Created by nbugash on 3/30/16.
 */
describe('Appspider validate chrome plugin', function() {
    var appSpiderChromePlugin = undefined;
    var vulReportsPage = undefined;

    /* Run before each test */
    beforeEach(function(){
        browser.ignoreSynchronization = true;
        browser.driver.get('http://localhost:5000/Vulnerabilities.html') ;
        browser.driver.findElement(by.id('GID_1_0_icon')).click();
        browser.driver.findElement(by.id('testbutton')).click();
        browser.sleep(500);
        browser.getAllWindowHandles().then(function(handles) {
            vulReportsPage = handles[0];
            appSpiderChromePlugin = handles[1];
            browser.switchTo().window(appSpiderChromePlugin);
        });
    });

    /* Run after each test */
    afterEach(function(){
        browser.close();
        browser.switchTo().window(vulReportsPage);
        expect(browser.getTitle()).toEqual('AppSpider Report (Build 6.6.22.1)');
    });


    /* Unit tests */

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
        browser.sleep(5000);
        expect(attackPayloadModel.getAttribute('value')).toBe('Writing on the payload');
    });

    it('should show a modal of the header when the textarea for attack header was clicked', function() {
        var requestTextarea = element.all(by.model('attack.request')).first();
        requestTextarea.click().then(function() {
            browser.sleep(1000);
            expect(element(by.className('modal-content')).isDisplayed()).toBeTruthy();
            element(by.css('div.modal-header > button.close')).click();
        });
    });
});