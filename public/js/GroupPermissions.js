/******************************************************************************
 *
 * The MIT License (MIT)
 *
 * Copyright (c) 2017 Alan Thiessen
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 *
 ******************************************************************************/

(function() {
    'use strict';

    angular.module('Atha')
        .controller('GroupPermissionsCtrl', GroupPermissionsCtrl);

    GroupPermissionsCtrl.$inject = ['$scope', '$stateParams', 'FeathersJS'];
    function GroupPermissionsCtrl($scope, $stateParams, feathersSvc) {
        var groupCtrl = this;
        var houseId = $stateParams['houseId'];
        var groupId = $stateParams['groupId'];
        var devicesSvc = feathersSvc.getService('devices');
        var permissionsSvc = feathersSvc.getService('permissions');
        var user = feathersSvc.getUser();
        var devices = {};
        var permissions = {};

        GetDevicesForHouse();
        GetPermissionsForGroup();

        return groupCtrl;


        function GetDevicesForHouse() {
            devicesSvc.find( {
                query: {
                    $limit: 20,
                    'houseId': houseId,
                    $select: ['name']
                }
            }).then(OnDevicesRetrieved, OnError);
        }


        function GetPermissionsForGroup() {
            permissionsSvc.find( {
                query: {
                    $limit: 20,
                    'ownerId': groupId
                }
            }).then(OnPermissionsRetrieved, OnError);
        }


        function OnDevicesRetrieved(data) {
            devices = {};

            data.data.forEach(function(device) {
                devices[device.id] = device;
            });
        }


        function OnPermissionsRetrieved(data) {
            permissions = {};

            data.data.forEach(function(perm) {
                permissions[perm.id] = perm;
            });
        }


        function OnError(error) {
            console.log(error);
        }
    }
})();
