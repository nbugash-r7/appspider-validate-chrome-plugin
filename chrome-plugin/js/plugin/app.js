/**
 * Created by nbugash on 3/8/16.
 */
'use strict';

var appSpiderValidateApp = angular.module('appSpiderValidateApp', []);
var AppSpider = {
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
                        attack.response.headers = appspider.util.convertHeaderStringToJSON(
                            xhr.getAllResponseHeaders());
                        attack.response.content = xhr.responseText;
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
            };
            attackCtrl.updateAttack = function (id, attribute, updatedValue) {
                appspider.chrome.storage.local.retrieve(id, function (attack) {
                    dotObject.str(attribute, updatedValue, attack);
                    return attack;
                })
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
                    });

                    /* Convert data from model format to view format */
                    ngModelController.$formatters.push(function (data) {
                        var attackController = new AppSpider.controller.attack(scope);
                        return attackController.prettifyAttack(data);
                    });
                }
            };
        },
        monitor: {
            attack: {
                headers: {},
                payload: function () {
                    return {
                        require: 'ngModel',
                        link: function (scope, element, attr, ngModelController) {
                            scope.$watch('attack.request.payload', function (payload) {
                                var attackID = scope.attack.id;
                                console.log("Attack ID: " + attackID + " New payload: " + payload);
                            });
                        }
                    }
                },
                request: {
                    headers: {},
                    content: function () {
                        return {
                            require: 'ngModel',
                            link: function (scope, element, attr, ngModelController) {
                                scope.$watch('attack.response.content', function (content) {
                                    console.log('new content value: ' + content)
                                })
                            }
                        }
                    }
                }
            }
        }
    }
};
appSpiderValidateApp.controller('AttackController', ['$scope', AppSpider.controller.attack]);
appSpiderValidateApp.directive('monitorPayload', [AppSpider.directive.monitor.attack.payload]);
appSpiderValidateApp.directive('monitorContent', [AppSpider.directive.monitor.attack.content]);
appSpiderValidateApp.directive('appspiderjson', [AppSpider.directive.appspiderJSON]);
