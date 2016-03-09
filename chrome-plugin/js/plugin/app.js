/**
 * Created by nbugash on 3/8/16.
 */
'use strict';

var appSpiderValidateApp = angular.module('appSpiderValidateApp', []);
var angular = {
    controller: {
        attack: function ($scope) {
            var attackCtrl = this;
            appspider.chrome.storage.local.retrieveAll(function (attacks) {
                $scope.$apply(function () {
                    $scope.attacks = attacks;
                });
            });
            attackCtrl.saveAttack = function (attack) {
                appspider.chrome.storage.local.save(attack, function () {
                    console.log('Attack id: ' + attack.id + ' was saved!');
                });
            };
            attackCtrl.getAttack = function (id) {
                appspider.storage.local.retrieve(id, function (attack) {
                    return attack;
                });
            };
            attackCtrl.prettifyAttack = function (headers) {
                return appspider.util.convertJSONToString(headers)
            };
            attackCtrl.resendAttack = function (attack) {
                /* 1. Resend the attack
                 *  2. Get response
                 *  3. Save attack and response */
                appspider.http.send.viaXHR(attack,
                    function (xhr) {
                        attack.response_headers = appspider.util.convertHeaderStringToJSON(
                            xhr.getAllResponseHeaders());
                        attack.response_content = xhr.responseText;
                        var attack_obj = {};
                        attack_obj[attack.id] = attack;
                        appspider.chrome.storage.local.save(attack_obj, function () {
                            console.log('Attack id: ' + attack.id + ' saved!');
                        })
                    },
                    function (error) {
                        /* On an error response */
                        console.error(xhr.status + ' ' + 'error status ' +
                            error.status + ' for attack id: ' + attack.id);
                    });
            }
        }
    },
    directive: {
        appspiderJSON: function () {
            return {
                require: 'ngModel',
                link: function (scope, element, attr, ngModelController) {
                    /* Convert data from view format to model format */
                    ngModelController.$parsers.push(function (data) {
                        console.log('Convert data from view format to model format');
                    });

                    /* Convert data from model format to view format */
                    ngModelController.$formatters.push(function (data) {
                        console.log('Convert data from model format to view format');
                        var attackController = new angular.controller.attack(scope);
                        return attackController.prettifyAttack(data);
                    });
                }
            };
        },
        parseRequestHeader: function () {
            return {
                link: function (scope, elt, attributes) {
                    scope.parseRequestHeader = function () {
                        var url_string = elt.val();
                        var url = document.createElement('a');
                        url.href = url_string;
                        this.attack.headers.REQUEST.uri = url.pathname;
                        this.attack.headers.Host = url.host;
                        AppSpider.attack.save(this.attack.id, this.attack);
                    };
                }
            };
        }
    }
};
appSpiderValidateApp.controller('AttackController', ['$scope', angular.controller.attack]);
appSpiderValidateApp.directive('appspiderjson', [angular.directive.appspiderJSON]);
