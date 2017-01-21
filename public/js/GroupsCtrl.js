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

    GroupsCtrl.$inject = ['$scope', 'FeathersJS'];
    function GroupsCtrl($scope, feathers) {
        var groupCtrl = this;
        groupCtrl.newGroupName = '';
        groupCtrl.groups = [];
        groupCtrl.new = CreateGroup;
        var groupsSvc = feathers.getService('groups');
        GetGroups();

        return groupCtrl;


        function GetGroups() {
            groupsSvc.find({
                $limit: 100
            }).then(OnGroupsUpdate, OnError);
        }


        function OnGroupsUpdate(data) {
            groupCtrl.groups = [];

            data.data.forEach(function(group) {
                groupCtrl.groups.push(group);
            });

            $scope.$apply();
        }


        function CreateGroup() {
            groupsSvc.create({
                'name': groupCtrl.newGroupName
            });
        }


        function OnError(err) {
            console.log(err);
        }
    }

})();
