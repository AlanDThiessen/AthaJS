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
        .controller('GroupsCtrl', GroupsCtrl);

    GroupsCtrl.$inject = ['$scope', '$state', '$stateParams', 'FeathersJS'];
    function GroupsCtrl($scope, $state, $stateParams, feathersSvc) {
        var groupCtrl = this;
        groupCtrl.newGroupName = '';
        groupCtrl.groups = {};
        groupCtrl.new = CreateGroup;
        groupCtrl.edit = EditGroup;
        groupCtrl.remove = RemoveGroup;
        groupCtrl.saveGroupName = SaveGroupName;
        var groupsSvc = feathersSvc.getService('groups');
        var user = feathersSvc.getUser();
        var houseId = $stateParams.houseId;

        var query = {
            $limit: 100,
            $sort: {
                'name': 1
            }
        };

        if(typeof(houseId) != 'undefined') {
            query.houseId = houseId;
        }

        Start();

        return groupCtrl;


        function Start() {
            $scope.$on('$destroy', Unsubscribe);
            groupsSvc.on('created', OnGroupCreated);
            groupsSvc.on('updated', OnGroupUpdated);
            groupsSvc.on('removed', OnGroupRemoved);
            GetGroups();
        }


        function Unsubscribe() {
            groupsSvc.off('created', OnGroupCreated);
            groupsSvc.off('updated', OnGroupUpdated);
            groupsSvc.off('removed', OnGroupRemoved);
        }


        function GetGroups() {
            groupsSvc.find({
                'query': query
            }).then(OnGroupsUpdate, OnError);
        }


        function OnGroupsUpdate(data) {
            groupCtrl.groups = {};

            data.data.forEach(function(group) {
                groupCtrl.groups[group._id] = group;
            });

            $scope.$apply();
        }


        function OnGroupCreated(group) {
            if(group.userId == user._id) {
                if((typeof(houseId) != 'undefined') && (group.houseId == houseId) ) {
                    groupCtrl.groups[group._id] = group;
                    $scope.$apply();
                }
            }
        }


        function OnGroupUpdated(group) {
            if(groupCtrl.groups.hasOwnProperty(group._id)) {
                groupCtrl.groups[group._id] = group;
                $scope.$apply();
            }
        }


        function OnGroupRemoved(group) {
            if(groupCtrl.groups.hasOwnProperty(group._id)) {
                delete(groupCtrl.groups[group._id]);
                $scope.$apply();
            }
        }


        function CreateGroup() {
            var createObj = {
                'name': groupCtrl.newGroupName
            };

            if(typeof(houseId) != 'undefined') {
                createObj.houseId = houseId;
            }

            groupsSvc.create(createObj).then(null, OnError);
        }


        function EditGroup(groupId) {
            $state.go('home.groupDetails', {
                'houseId': houseId,
                'groupId': groupId
            });
        }


        function RemoveGroup(groupId) {
            groupsSvc.remove(groupId).then(null, OnError);
        }


        function SaveGroupName(newValue, id) {
            groupsSvc.patch(id, {
                'name': newValue
            }).then(OnGroupUpdated, OnError);
        }


        function OnError(err) {
            console.log(err);
        }
    }

})();
