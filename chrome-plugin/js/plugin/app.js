/**
 * Created by nbugash on 3/8/16.
 */

var AppSpiderValidateApp = angular.module('AppSpiderValidateApp', []);
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
                })
            }
        }
    }
};
AppSpiderValidateApp.controller('AttackController', ['$scope', angular.controller.attack]);