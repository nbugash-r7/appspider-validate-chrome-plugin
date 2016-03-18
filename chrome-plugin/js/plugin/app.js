/**
 * Created by nbugash on 3/8/16.
 */
'use strict';
(function () {
    var appSpiderValidateApp = angular.module('appSpiderValidateApp', ['ui.bootstrap']);
    var AppSpider = {
        controller: {
            attack: function ($scope) {
                $scope.initTab = function (id) {
                    return id === '1';
                };

                var attackCtrl = this;

                appspider.chrome.storage.local.retrieveAll(function (attacks) {
                    $scope.$apply(function () {
                        attackCtrl.attacks = attacks;
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
                        DotObject.str(attribute, updatedValue, attack);
                        appspider.chrome.storage.local.saveAttack(attack, function () {
                            console.log('Attack ID: ' + attack.id + ' updated!');
                        });
                    })
                }
            },
            button: function () {
                var buttonCtrl = this;
                buttonCtrl.protocol = 'HTTP';
                buttonCtrl.view = 'RAW';
                buttonCtrl.disabled = function (contentType) {
                    if (contentType !== 'text/html') {
                        return true;
                    }
                };
                buttonCtrl.setProtocol = function (protocol) {
                    buttonCtrl.protocol = protocol;
                };
                buttonCtrl.setView = function (view) {
                    buttonCtrl.view = view;
                };
                buttonCtrl.show = function (view) {
                    return buttonCtrl.view === view;
                };
                buttonCtrl.setMethod = function (method) {
                    buttonCtrl.method = method;
                };
                buttonCtrl.exportToFile = function () {

                };

            },
            modal: {
                cookies: function ($scope, $uibModal) {
                    var cookieModal = this;
                    cookieModal.open = function (id, size, attack) {
                        $scope.id = id;
                        $scope.attack = attack;
                        var modalInstance = $uibModal.open({
                            scope: $scope,
                            animation: true,
                            templateUrl: 'modal/cookies.html',
                            controller: AppSpider.controller.modalInstance.cookies,
                            controllerAs: 'modalInstanceCtrl',
                            size: size
                        });
                    };
                }
            },
            modalInstance: {
                cookies: function ($scope, $uibModalInstance) {
                    var modalInstanceCtrl = this;
                    modalInstanceCtrl.id = $scope.id;
                    modalInstanceCtrl.attack = $scope.attack;
                    modalInstanceCtrl.save = function (cookies) {
                        modalInstanceCtrl.attack.request.headers.Cookie = cookies;
                        appspider.chrome.storage.local.saveAttack(modalInstanceCtrl.attack, function () {
                            console.log('Attack ID: ' + modalInstanceCtrl.attack.id + ' saved!');
                        });
                        $uibModalInstance.dismiss();
                    };
                    modalInstanceCtrl.cancel = function () {
                        $uibModalInstance.dismiss('cancel');
                    };
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
                    headers: {
                        cookies: {
                            key: function () {

                            },
                            value: function () {

                            }
                        }
                    },
                    payload: function () {
                        return {
                            require: 'ngModel',
                            link: function (scope, element, attr, ngModelController) {
                                scope.$watch('attack.request.payload', function (payload) {
                                    appspider.chrome.storage.local.saveAttack(scope.attack, function () {
                                        console.log('Payload was saved for Attack ID: ' + scope.attack.id + ' saved');
                                    })
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
    appSpiderValidateApp.controller('CookieModalController', ['$scope', '$uibModal', AppSpider.controller.modal.cookies]);
    appSpiderValidateApp.controller('ButtonController', [AppSpider.controller.button]);
    appSpiderValidateApp.directive('monitorPayload', [AppSpider.directive.monitor.attack.payload]);
    appSpiderValidateApp.directive('monitorContent', [AppSpider.directive.monitor.attack.content]);
    appSpiderValidateApp.directive('appspiderjson', [AppSpider.directive.appspiderJSON]);
})();
