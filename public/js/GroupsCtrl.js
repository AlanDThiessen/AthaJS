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

    GroupsCtrl.$inject = ['$scope', '$stateParams', 'FeathersJS'];
    function GroupsCtrl($scope, $stateParams, feathersSvc) {
        var groupCtrl = this;
        groupCtrl.newGroupName = '';
        groupCtrl.groups = {};
        groupCtrl.new = CreateGroup;
        groupCtrl.remove = RemoveGroup;
        var groupsSvc = feathersSvc.getService('groups');
        var user = feathersSvc.getUser();

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
                $limit: 100
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
                groupCtrl.groups[group._id] = group;
                $scope.$apply();
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
            groupsSvc.create({
                'name': groupCtrl.newGroupName
            });
        }


        function RemoveGroup(groupId) {
            groupsSvc.remove(groupId);
        }


        function OnError(err) {
            console.log(err);
        }
    }

})();
