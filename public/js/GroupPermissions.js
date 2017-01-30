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
        groupCtrl.permClicked = PermissionClicked;
        var houseId = $stateParams['houseId'];
        var groupId = $stateParams['groupId'];
        var devicesSvc = feathersSvc.getService('devices');
        var zonesSvc = feathersSvc.getService('zones');
        var permissionsSvc = feathersSvc.getService('permissions');
        var user = feathersSvc.getUser();
        groupCtrl.devices = [];
        groupCtrl.zones = {};
        var permissions = [];

        Start();

        return groupCtrl;


        function Start() {
            $scope.$on('$destroy', Unsubscribe);
            permissionsSvc.on('created', OnPermissionsCreated);
            permissionsSvc.on('removed', OnPermissionsRemoved);
            GetZones();
            GetDevicesForHouse();
            GetPermissionsForGroup();
        }


        function Unsubscribe() {
            permissionsSvc.off('created', OnPermissionsCreated);
            permissionsSvc.off('removed', OnPermissionsRemoved);
        }


        function GetDevicesForHouse() {
            devicesSvc.find( {
                query: {
                    $limit: 20,
                    'houseId': houseId,
                    $select: ['name', 'zoneId']
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


        function GetZones() {
            zonesSvc.find({
                query: {
                    $limit: 20,
                    'houseId': houseId
                }
            }).then(OnZonesUpdate, OnError);
        }


        function OnDevicesRetrieved(data) {
            groupCtrl.devices = [];

            data.data.forEach(function(device) {
                device.read = false;
                device.update = false;
                groupCtrl.devices.push(device);
            });

            CrossReferenceGroupPermissions();
        }


        function OnPermissionsRetrieved(data) {
            permissions = [];

            data.data.forEach(function(perm) {
                permissions.push(perm);
            });

            CrossReferenceGroupPermissions();
        }


        function OnZonesUpdate(data) {
            groupCtrl.zones = {};

            data.data.forEach(function(zone) {
                groupCtrl.zones[zone._id] = zone.name;
            });

            $scope.$apply();
        }


        function OnPermissionsCreated(perm) {
            if(perm.ownerId == groupId) {
                permissions.push(perm);
                CrossReferenceGroupPermissions();
            }
        }


        function OnPermissionsRemoved(perm) {
            var index = permissions.findIndex(function(thisPerm) {
                if(thisPerm._id == perm._id) {
                    return true;
                }
            });

            if(index != -1) {
                permissions.splice(index, 1);
                CrossReferenceGroupPermissions();
            }
        }


        function CrossReferenceGroupPermissions() {
            var currentDeviceId;
            var currentFunction;

            groupCtrl.devices.forEach(function(device) {
                currentDeviceId = device._id;

                ['read', 'update'].forEach(function(perm) {
                    currentFunction = perm;

                    if (permissions.findIndex(SearchPermissions) != -1) {
                        device[perm] = true;
                    }
                    else {
                        device[perm] = false;
                    }
                });
            });

            $scope.$apply();

            /**
             * @param element
             * @returns {boolean}
             */
            function SearchPermissions(element) {
                var found = false;

                if ((element.itemId == currentDeviceId) && (element.function == currentFunction)) {
                    found = true;
                }

                return found;
            }
        }


        function PermissionClicked(deviceId, perm) {
            var device = groupCtrl.devices.find(function(device) {
                return device._id == deviceId;
            });


            if(device != -1) {
                device[perm] = !device[perm];

                if(device[perm]) {
                    permissionsSvc.create({
                        'itemId': device._id,
                        'ownerId': groupId,
                        'function': perm
                    }).then(null, OnError);
                }
                else {
                    var index = permissions.findIndex(function(thisPerm) {
                        if(thisPerm.itemId == deviceId) {
                            return true;
                        }
                    });

                    if(index != -1) {
                        permissionsSvc.remove(permissions[index]._id).then(null, OnError);
                    }
                }
            }
        }


        function OnError(error) {
            console.log(error);
        }
    }
})();
