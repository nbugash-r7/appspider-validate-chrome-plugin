/**
 * Created by nbugash on 3/30/16.
 */
describe('Appspider validate chrome plugin: Multi Pages', function() {
    var appSpiderChromePlugin = undefined;
    var vulReportsPage = undefined;
    var SLEEPTIME = 2000;
    var OBSERVINGTIME = 2000;
    var WAITTIME = 1000;

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


    /* Unit tests */
    it('should show the step number on each page', function() {
        var steps = element.all(by.css('ul.navbar-nav > li > a'));
        var stepId = 1;
        steps.each(function(elem, index) {
            elem.click().then(function() {
                var title = element.all(by.css('div.page-header > h3')).get(index);
                expect(title.getText()).toBe('Validate for Step ' + stepId);
                stepId++;
                browser.sleep(1000);
            });
        });
    });

    it ('should be able to navigate to different steps and modals for each step must appear', function() {
        var steps = element.all(by.css('ul.navbar-nav > li > a'));
        var stepId = 1;
        steps.each(function(elem) {
            elem.click().then(function() {
                var requestHeader = element(by.id('appspider-request-header-'+stepId));
                requestHeader.click();
                browser.sleep(WAITTIME);
                expect(element(by.className('modal-content')).isDisplayed()).toBeTruthy();
                browser.sleep(OBSERVINGTIME);
                element(by.css('div.modal-header > button.close')).click();
                stepId++;
            });
        });
    });

    it('should be able to open the parameter button for each step', function() {
        var steps = element.all(by.css('ul.navbar-nav > li > a'));
        steps.each(function(elem, index) {
            elem.click().then(function(){
                browser.sleep(WAITTIME);
                var parambutton = element.all(by.css('div.attack-url > div.input-group-btn:last-child > button.appspider-btn')).get(index);
                parambutton.click();
                browser.sleep(WAITTIME);
                expect(element(by.className('modal-content')).isDisplayed()).toBeTruthy();
                expect(element(by.css('div.modal-header > h3')).getText()).toBe('Parameters');
                browser.sleep(OBSERVINGTIME);
                element(by.css('div.modal-header > button.close')).click();
            });
        });
    });

    it('should be able to open the cookie modal for each step', function() {
        var steps = element.all(by.css('ul.navbar-nav > li > a'));
        steps.each(function(elem, index) {
            elem.click().then(function() {
                browser.sleep(WAITTIME);
                var cookiebutton = element.all(by.css('button.appspider-btn-cookies')).get(index);
                cookiebutton.click();
                browser.sleep(WAITTIME);
                expect(element(by.className('modal-content')).isDisplayed()).toBeTruthy();
                expect(element(by.css('div.modal-header > h3')).getText()).toBe('Cookies');
                browser.sleep(OBSERVINGTIME);
                element(by.css('div.modal-header > button.close')).click();
            })
        });
    });

    it('should have the GET and POST in the dropdown list for each step', function() {
        var httpVerbs = ['GET', 'POST'];
        var steps = element.all(by.css('ul.navbar-nav > li > a'));
        steps.each(function(elem, index) {
            elem.click().then(function() {
                browser.sleep(WAITTIME);
                var dropdown = element.all(by.css('div.attack-url > div.input-group-btn > ' +
                    'button.dropdown-toggle')).get(index);
                dropdown.click().then(function() {
                    var dropdownList = element.all(by.css('a.dropdown-item'));
                    httpVerbs.forEach(function(httpVerb, index) {
                        expect(dropdownList.getText()).toContain(httpVerb);
                    });
                });
            })
        });

    });
    it('should have the HTTP and HTTPS in the dropdown list for each step', function() {
        var protocols = ['HTTP', 'HTTPS'];
        var steps = element.all(by.css('ul.navbar-nav > li > a'));
        steps.each(function(elem, index) {
            elem.click().then(function() {
                browser.sleep(WAITTIME);
                var dropdown = element.all(by.css('button.protocol-dropdown-btn')).get(index);
                dropdown.click().then(function() {
                    var dropdownList = element.all(by.css('a.dropdown-item'));
                    protocols.forEach(function(protocol, index) {
                        expect(dropdownList.getText()).toContain(protocol);
                    });
                });
            })
        });

    });


});