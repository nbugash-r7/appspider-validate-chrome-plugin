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
                        console.log('Attack id: ' + attack.id + ' retrieved!');
                    });
                };
                attackCtrl.resendAttack = function (attack) {
                    /* 1. Resend the attack
                     *  2. Get response
                     *  3. Save attack and response */
                    appspider.http.send.viaXHR(attack,
                        function (xhr) {
                            attack.response.headers = appspider.util.parseAttackResponse(
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
                attackCtrl.updateAttack = function(attack, attribute, value) {
                    switch(attribute) {
                        case 'description':
                            attack.request.description = value;
                            break;
                        case 'method':
                            attack.request.method = value;
                            break;
                        case 'payload':
                            attack.request.payload = value;
                            break;
                        case 'url':
                            attack.request.uri.url = value;
                            break;
                        case 'protocol':
                            attack.request.uri.protocol = value;
                            break;
                        case 'path':
                            attack.request.uri.path = value;
                            break;
                        default:
                            break;
                    }
                    appspider.chrome.storage.local.saveAttack(attack, function() {
                        console.log('Attack ' + attack.id + ' saved!!');
                    });
                }
            },
            button: function () {
                var buttonCtrl = this;
                buttonCtrl.disabled = function (responseHeader) {
                    for (var index in responseHeader) {
                        if (responseHeader.hasOwnProperty(index)) {
                            if (responseHeader[index].key &&
                                responseHeader[index].value &&
                                responseHeader[index].key.toLowerCase() === 'content-type' &&
                                responseHeader[index].value === 'text/html') {
                                return false;
                            }
                        }
                    }
                    return true;
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
                            controllerAs: 'cookieCtrl',
                            size: size
                        });
                    };
                },
                headers: function($scope, $uibModal) {
                    var headerCtrl = this;
                    headerCtrl.open = function(id, size, attack) {
                        $scope.id = id;
                        $scope.attack = attack;
                        var modalInstance = $uibModal.open({
                            scope: $scope,
                            animation: true,
                            templateUrl: 'modal/headers.html',
                            controller: AppSpider.controller.modalInstance.headers,
                            controllerAs: 'headerCtrl',
                            size: size
                        });
                    };
                },
                parameters: function($scope, $uibModal) {
                    var paramCtrl = this;
                    paramCtrl.open = function(id, size, attack) {
                        $scope.id = id;
                        $scope.attack = attack;
                        var modalInstance = $uibModal.open({
                            scope: $scope,
                            animation: true,
                            templateUrl: 'modal/parameters.html',
                            controller: AppSpider.controller.modalInstance.parameters,
                            controllerAs: 'paramCtrl',
                            size: size
                        });
                    }
                }
            },
            modalInstance: {
                cookies: function ($scope, $uibModalInstance) {
                    var cookieCtrl = this;
                    cookieCtrl.id = $scope.id;
                    cookieCtrl.attack = $scope.attack;
                    cookieCtrl.cookies = cookieCtrl.attack.request.cookie;
                    cookieCtrl.save = function (cookies) {
                        cookieCtrl.attack.request.cookie = cookies;
                        appspider.chrome.storage.local.saveAttack(cookieCtrl.attack, function() {
                            console.log('Attack ' + attack.id + ' saved!!');
                        });
                        $uibModalInstance.dismiss();
                    };
                    cookieCtrl.addNewCookie = function () {
                        cookieCtrl.cookies.push({
                            key: 'Place cookie key here',
                            value: 'Place cookie value here'
                        });
                    };
                    cookieCtrl.cancel = function () {
                        $uibModalInstance.dismiss('cancel');
                    };
                    cookieCtrl.removeCookie = function (key) {
                        cookieCtrl.cookies = _.without(cookieCtrl.cookies,
                            _.findWhere(cookieCtrl.cookies, {key: key}));
                    }
                },
                headers: function ($scope, $uibModalInstance) {
                    var headerCtrl = this;
                    headerCtrl.id = $scope.id;
                    headerCtrl.attack = $scope.attack;
                    headerCtrl.headers = headerCtrl.attack.request.headers;
                    headerCtrl.saveHeaders = function(headers) {
                        headerCtrl.attack.request.headers = headers;
                        appspider.chrome.storage.local.saveAttack(headerCtrl.attack, function(){
                           console.log('Attack ' + headerCtrl.attack.id + ' saved!!');
                        });
                        $uibModalInstance.dismiss();
                    };
                    headerCtrl.close = function() {
                        $uibModalInstance.dismiss('close');
                    };
                    headerCtrl.addNewHeaders = function() {
                        headerCtrl.headers.push({
                            key: 'Place header key here',
                            value:'Place header value here'
                        });
                    };
                    headerCtrl.removeHeaders = function(key) {
                        headerCtrl.headers = _.without(headerCtrl.headers,
                            _.findWhere(headerCtrl.headers, { key: key}));
                    };
                },
                parameters: function($scope, $uibModalInstance) {
                    var paramCtrl = this;
                    paramCtrl.attack = $scope.attack;
                    paramCtrl.parameters = paramCtrl.attack.request.uri.parameters;
                    paramCtrl.addNewParams = function() {
                        paramCtrl.parameters.push({
                            key: 'Place new key here',
                            value: 'Place value here'
                        });
                    };
                    paramCtrl.removeParameters = function(key) {
                        paramCtrl.parameters = _.without(paramCtrl.parameters,
                            _.findWhere(paramCtrl.parameters, {key: key}));
                    };
                    paramCtrl.cancel = function() {
                        $uibModalInstance.dismiss('cancel');
                    };
                    paramCtrl.saveParameters = function(params) {
                        paramCtrl.attack.request.uri.parameters = params;
                        paramCtrl.attack.request.uri.queryString = appspider.util.queryString(params);
                        appspider.chrome.storage.local.saveAttack(paramCtrl.attack, function() {
                            console.log('Attack ' + attack.id + ' saved!!');
                        });
                        $uibModalInstance.dismiss();
                    }
                }
            }
        },
        directive: {
            attackRequestJSON: function () {
                return {
                    require: 'ngModel',
                    link: function (scope, element, attr, ngModelController) {

                        /* Convert data from model format to view format */
                        ngModelController.$formatters.push(function (data) {
                            return appspider.util.stringifyAttackRequest(data);
                        });
                    }
                };
            },
            attackResponseJSON: function () {
                return {
                    require: 'ngModel',
                    link: function (scope, element, attr, ngModelController) {
                        /* Convert data from view format to model format */
                        ngModelController.$parsers.push(function (data) {
                        });

                        /* Convert data from model format to view format */
                        ngModelController.$formatters.push(function (data) {
                            return appspider.util.stringifyAttackResponse(data);
                        });
                    }
                };
            },
            monitor: {
                attack: {
                    request: {
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
                        }
                    },
                    response: {
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
    appSpiderValidateApp.controller('HeaderModalController', ['$scope', '$uibModal', AppSpider.controller.modal.headers]);
    appSpiderValidateApp.controller('ParameterModalController', ['$scope', '$uibModal', AppSpider.controller.modal.parameters]);
    appSpiderValidateApp.controller('ButtonController', [AppSpider.controller.button]);
    appSpiderValidateApp.directive('monitorPayload', [AppSpider.directive.monitor.attack.request.payload]);
    appSpiderValidateApp.directive('monitorContent', [AppSpider.directive.monitor.attack.response.content]);
    appSpiderValidateApp.directive('attackRequestJson', [AppSpider.directive.attackRequestJSON]);
    appSpiderValidateApp.directive('attackResponseJson', [AppSpider.directive.attackResponseJSON]);
})();
