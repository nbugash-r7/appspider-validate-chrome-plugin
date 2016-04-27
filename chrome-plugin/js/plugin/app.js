/**
 * Created by nbugash on 3/8/16.
 */
'use strict';
(function () {
    var appSpiderValidateApp = angular.module('appSpiderValidateApp', ['ui.bootstrap','ngSanitize']);
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
                    for(var index in attacks) {
                        if(!attacks.hasOwnProperty(index)) continue;
                        attackCtrl.resendAttack(attacks[index]);
                    }
                });

                attackCtrl.saveAttack = function (attack) {
                    appspider.chrome.storage.local.saveAttack(attack, function () {
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
                            attack.response = appspider.util.parseAttackResponse(appspider.schema.response(), xhr);
                            appspider.chrome.storage.local.saveAttack(attack, function () {
                                console.log('Attack id: ' + attack.id + ' saved!');
                            })
                        },
                        function (error) {
                            /* On an error response */
                            console.error('Error status: ' +
                                error.status + ' for attack id: ' + attack.id);
                            attack.response.headers = [];
                            attack.response.headers.push({
                                key: 'Communication Error',
                                value: 'Connection refused'
                            });
                            attack.response.content = '';
                            appspider.chrome.storage.local.saveAttack(attack, function(){
                                console.log('Attack id: ' + attack.id + ' saved!');
                            });
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
                };
                attackCtrl.encodedHTML = function(htmlString) {
                    /*
                    * 1. encode htmlstring
                    * 2. inject <mark> tag
                    * 3. decode html string
                    * */
                    htmlString = decodeURI(encodeURI(htmlString));
                    return appspider.util.highlightText(htmlString,'head');
                };
            },
            button: function ($scope) {
                var buttonCtrl = this;
                $scope.showHTML = false;
                $scope.showHighlights = false;
                $scope.renderAs = 'html';
                $scope.btnHighlight = 'Highlight vulnerabilities';
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
                buttonCtrl.showAsHTML = function() {
                    $scope.showHTML = !$scope.showHTML;
                    if ($scope.renderAs === 'html') {
                        $scope.renderAs = 'string';
                    } else {
                        $scope.renderAs = 'html';
                    }
                };
                buttonCtrl.highlightHTML = function() {
                    var highlightedSection = new Hilitor('appspider-content-section-html-highlight-'+$scope.id);
                    $scope.showHighlights = !$scope.showHighlights;
                    if ($scope.showHighlights) {
                        switch($scope.attack.request.method.toUpperCase()) {
                            case 'GET':
                                highlightedSection.apply($scope.attack.uri.queryString);
                                break;
                            case 'POST':
                                highlightedSection.apply($scope.attack.request.payload);
                                break;
                            default:
                                highlightedSection.apply();
                                break;
                        }
                    } else {
                        highlightedSection.remove();
                    }

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
                },
                highlightedHTML: function($scope, $uibModal) {
                    var highlightModal = this;
                    highlightModal.open = function(id, size, attack) {
                        $scope.id = id;
                        $scope.attack = attack;
                        var modalInstance = $uibModal.open({
                            scope: $scope,
                            animation: true,
                            templateUrl: 'modal/highlight.html',
                            controller: AppSpider.controller.modalInstance.highlightedHTML,
                            controllerAs: 'highlightCtrl',
                            size: size
                        });
                    }
                },
                proxy: function($scope, $uibModal) {
                    var proxyModal = this;
                    proxyModal.open = function(id, size, attack) {
                        $scope.id = id;
                        $scope.attack = attack;
                        var modalInstance = $uibModal.open({
                            scope: $scope,
                            animation: true,
                            templateUrl: 'modal/proxy.html',
                            controller: AppSpider.controller.modalInstance.proxy,
                            controllerAs: 'proxyCtrl',
                            size: size
                        })
                    }
                },
                compare: function($scope, $uibModal) {
                    var compareModal = this;
                    compareModal.open = function(size, attacks) {
                        $scope.attacks = attacks;
                        var modalInstance = $uibModal.open({
                            scope: $scope,
                            animation: true,
                            templateUrl: 'modal/compare.html',
                            controller: AppSpider.controller.modalInstance.compare,
                            controllerAs: 'compareCtrl',
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
                        appspider.chrome.storage.local.saveAttack(cookieCtrl.attack, function () {
                            console.log('Attack ' + cookieCtrl.attack.id + ' saved!!');
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
                    headerCtrl.saveHeaders = function (headers) {
                        headerCtrl.attack.request.headers = headers;
                        appspider.chrome.storage.local.saveAttack(headerCtrl.attack, function () {
                            console.log('Attack ' + headerCtrl.attack.id + ' saved!!');
                        });
                        $uibModalInstance.dismiss();
                    };
                    headerCtrl.close = function () {
                        $uibModalInstance.dismiss('close');
                    };
                    headerCtrl.addNewHeaders = function () {
                        headerCtrl.headers.push({
                            key: 'Place header key here',
                            value: 'Place header value here'
                        });
                    };
                    headerCtrl.removeHeaders = function (key) {
                        headerCtrl.headers = _.without(headerCtrl.headers,
                            _.findWhere(headerCtrl.headers, {key: key}));
                    };
                },
                parameters: function ($scope, $uibModalInstance) {
                    var paramCtrl = this;
                    paramCtrl.attack = $scope.attack;
                    paramCtrl.parameters = paramCtrl.attack.request.uri.parameters;
                    paramCtrl.addNewParams = function () {
                        paramCtrl.parameters.push({
                            key: 'Place new key here',
                            value: 'Place value here'
                        });
                    };
                    paramCtrl.removeParameters = function (key) {
                        paramCtrl.parameters = _.without(paramCtrl.parameters,
                            _.findWhere(paramCtrl.parameters, {key: key}));
                    };
                    paramCtrl.cancel = function () {
                        $uibModalInstance.dismiss('cancel');
                    };
                    paramCtrl.saveParameters = function (params) {
                        paramCtrl.attack.request.uri.parameters = params;
                        paramCtrl.attack.request.uri.queryString = appspider.util.queryString(params);
                        appspider.chrome.storage.local.saveAttack(paramCtrl.attack, function () {
                            console.log('Attack ' + paramCtrl.attack.id + ' saved!!');
                        });
                        $uibModalInstance.dismiss();
                    }
                },
                highlightedHTML: function ($scope, $uibModalInstance) {
                    var highlightCtrl = this;
                    highlightCtrl.id = $scope.id;
                    highlightCtrl.attack = $scope.attack;
                    highlightCtrl.content = highlightCtrl.attack.response.content;
                    highlightCtrl.close = function () {
                        $uibModalInstance.dismiss();
                    };
                    highlightCtrl.showHighlight = function () {
                        $scope.btnHighlight = 'Highlight Vulnerabilities';
                        var highlightedSection = new Hilitor('highlight-html-' + $scope.id);
                        $scope.showHighlights = !$scope.showHighlights;
                        if ($scope.showHighlights) {
                            $scope.btnHighlight = 'Hide highlighted Vulnerabilities';
                            switch ($scope.attack.request.method.toUpperCase()) {
                                case 'GET':
                                    highlightedSection.apply("GET " + $scope.attack.request.uri.queryString);
                                    break;
                                case 'POST':
                                    highlightedSection.apply("POST " + $scope.attack.request.payload);
                                    break;
                                default:
                                    highlightedSection.apply();
                                    break;
                            }
                        } else {
                            $scope.btnHighlight = 'Highlight Vulnerabilities';
                            highlightedSection.remove();
                        }

                    }
                },
                proxy: function($scope, $uibModalInstance) {
                    var proxyCtrl = this;
                    proxyCtrl.attack = $scope.attack;
                    proxyCtrl.proxy = proxyCtrl.attack.proxy;
                    proxyCtrl.saveProxy = function(host, port) {
                        proxyCtrl.attack.proxy.host = host;
                        proxyCtrl.attack.proxy.port = port;
                        appspider.chrome.storage.local.saveAttack(proxyCtrl.attack, function() {
                            console.log('Attack ' + proxyCtrl.attack.id + ' saved!!');
                        });
                        $uibModalInstance.dismiss('Close');
                    };
                    proxyCtrl.close = function() {
                        $uibModalInstance.dismiss('Close');
                    };
                    proxyCtrl.clearProxy = function() {
                        proxyCtrl.proxy.host = '';
                        proxyCtrl.proxy.port = ''
                    }
                },
                compare: function($scope, $uibModalInstance) {
                    var compareCtrl = this;
                    compareCtrl.btnCompare = 'Highlight difference';
                    compareCtrl.markedAttacks = [];
                    for(var index in $scope.attacks) {
                        if($scope.attacks.hasOwnProperty(index)) {
                            var attack = $scope.attacks[index];
                            if(attack.markedForCompare) {
                                compareCtrl.markedAttacks.push(attack);
                            }
                        }
                    }

                    compareCtrl.stringifyAttackRequest = function(request) {
                        return appspider.util.stringifyAttackRequest(request).trim();
                    };
                    compareCtrl.close = function() {
                        $uibModalInstance.dismiss('Close');
                    };
                    compareCtrl.highlightDifference = function() {
                        $scope.showHighlightCompare = !$scope.showHighlightCompare;
                        var diffRequestHeader = JsDiff.diffLines(
                            appspider.util.stringifyAttackRequest(compareCtrl.markedAttacks[0].request),
                            appspider.util.stringifyAttackRequest(compareCtrl.markedAttacks[1].request)
                        );
                        var diffResponseContent = JsDiff.diffLines(
                            compareCtrl.markedAttacks[0].response.content,
                            compareCtrl.markedAttacks[1].response.content
                        );
                        if($scope.showHighlightCompare) {

                            diffRequestHeader.forEach(function(part) {
                                if (part.added || part.removed) {
                                    $('#compare-header-step-'+ compareCtrl.markedAttacks[1].id).highlight(part.value.trim());
                                    $('#compare-header-step-'+ compareCtrl.markedAttacks[0].id).highlight(part.value.trim());
                                }
                            });

                            diffResponseContent.forEach(function(part) {
                                if (part.added || part.removed) {
                                    $('#compare-content-step-'+ compareCtrl.markedAttacks[1].id).highlight(part.value.trim());
                                    $('#compare-content-step-'+ compareCtrl.markedAttacks[0].id).highlight(part.value.trim());                            }
                            });
                            compareCtrl.btnCompare = 'Hide highlights';
                        } else {
                            $('#compare-header-step-'+ compareCtrl.markedAttacks[1].id).removeHighlight();
                            $('#compare-header-step-'+ compareCtrl.markedAttacks[0].id).removeHighlight();
                            $('#compare-content-step-'+ compareCtrl.markedAttacks[1].id).removeHighlight();
                            $('#compare-content-step-'+ compareCtrl.markedAttacks[0].id).removeHighlight();
                            compareCtrl.btnCompare = 'Highlight difference';
                        }
                    }

                }
            },
            render: function($scope, $sce) {
                var renderCtrl = this;
                renderCtrl.html = function(htmlContent) {
                    return $sce.trustAsHtml(htmlContent);
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
            attackURL: function() {
              return {
                  restrict: 'A',
                  link: function(scope, element, attr, ngModelController) {
                      element.bind('blur', function() {
                          if(element.context.value) {
                              var request = scope.attack.request;
                              var parser = document.createElement('a');
                              parser.href = element.context.value;
                              request.uri.protocol = parser.protocol.slice(0,-1);
                              request.uri.url = parser.host;
                              request.uri.path = parser.pathname;
                              request.uri.queryString = parser.search;
                              request.uri.parameters = appspider.util.parseQueryString(parser.search);
                              scope.attack.request = request;
                          } else {
                              console.error('Invalid url string');
                              alert('Invalid Attack URL string');
                          }
                      });

                  }
              }
            },
            monitor: {
                attack: {
                    request: {
                        uri: {
                            protocol: function() {
                                return {
                                    require: 'ngModel',
                                    link: function(scope, element, attr, ngModelController) {
                                        scope.$watch('attack.request.uri.protocol', function(protocol) {
                                            console.log(protocol);
                                        });
                                    }
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
    appSpiderValidateApp.controller('HighlightedHTMLModalController', ['$scope', '$uibModal', AppSpider.controller.modal.highlightedHTML]);
    appSpiderValidateApp.controller('ProxyModalController', ['$scope', '$uibModal', AppSpider.controller.modal.proxy]);
    appSpiderValidateApp.controller('CompareModalController', ['$scope', '$uibModal', AppSpider.controller.modal.compare]);
    appSpiderValidateApp.controller('ButtonController', ['$scope', AppSpider.controller.button]);
    appSpiderValidateApp.controller('RenderController', ['$scope','$sce', AppSpider.controller.render]);
    appSpiderValidateApp.directive('monitorPayload', [AppSpider.directive.monitor.attack.request.payload]);
    appSpiderValidateApp.directive('monitorContent', [AppSpider.directive.monitor.attack.response.content]);
    appSpiderValidateApp.directive('attackRequestJson', [AppSpider.directive.attackRequestJSON]);
    appSpiderValidateApp.directive('attackResponseJson', [AppSpider.directive.attackResponseJSON]);
    appSpiderValidateApp.directive('attackUrl', [AppSpider.directive.attackURL]);
})();
