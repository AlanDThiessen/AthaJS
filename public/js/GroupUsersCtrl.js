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
        .controller('GroupUsersCtrl', GroupUsersCtrl);

    GroupUsersCtrl.$inject = ['$scope', '$stateParams', 'FeathersJS'];
    function GroupUsersCtrl($scope, $stateParams, feathersSvc) {
        var groupCtrl = this;
        groupCtrl.users = [];
        groupCtrl.userClicked = UserSelected;
        var houseId = $stateParams['houseId'];
        var groupId = $stateParams['groupId'];
        var usersSvc = feathersSvc.getService('users');
        var groupUsersSvc = feathersSvc.getService('groupUsers');
        var user = feathersSvc.getUser();
        var groupUsers = [];

        Start();

        return groupCtrl;


        function Start() {
            $scope.$on('$destroy', Unsubscribe);
            groupUsersSvc.on('created', OnGroupUsersCreated);
            groupUsersSvc.on('removed', OnGroupUsersRemoved);
            GetUsers();
            GetGroupUsers();
        }


        function Unsubscribe() {
            groupUsersSvc.off('created', OnGroupUsersCreated);
            groupUsersSvc.off('removed', OnGroupUsersRemoved);
        }


        function GetUsers() {
            usersSvc.find( {
                query: {
                    $limit: 20,
                    $select: ['name']
                }
            }).then(OnUsersRetrieved, OnError);
        }


        function GetGroupUsers() {
            groupUsersSvc.find( {
                query: {
                    $limit: 20,
                    'groupId': groupId
                }
            }).then(OnGroupUsersRetrieved, OnError);
        }


        function OnUsersRetrieved(data) {
            groupCtrl.users = [];

            data.data.forEach(function(user) {
                user.inGroup = false;
                groupCtrl.users.push(user);
            });

            CrossReferenceGroupUsers();
        }


        function OnGroupUsersRetrieved(data) {
            groupUsers = [];

            data.data.forEach(function(gu) {
                groupUsers.push(gu);
            });

            CrossReferenceGroupUsers();
        }



        function OnGroupUsersCreated(groupUser) {
            if(groupUser.groupId == groupId) {
                groupUsers.push(groupUser);
                CrossReferenceGroupUsers();
            }
        }


        function OnGroupUsersRemoved(groupUser) {
            var index = groupUsers.findIndex(function(thisGU) {
                if(thisGU._id == groupUser._id) {
                    return true;
                }
            });

            if(index != -1) {
                groupUsers.splice(index, 1);
                CrossReferenceGroupUsers();
            }
        }


        function CrossReferenceGroupUsers() {
            var currentUserId;

            groupCtrl.users.forEach(function(user) {
                currentUserId = user._id;

                if(groupUsers.findIndex(SearchGroupUsersForUser) != -1) {
                    user.inGroup = true;
                }
                else {
                    user.inGroup = false;
                }
            });

            $scope.$apply();

            /**
             * @param element
             * @returns {boolean}
             */
            function SearchGroupUsersForUser(element) {
                var found = false;

                if (element.userId == currentUserId) {
                    found = true;
                }

                return found;
            }
        }


        function UserSelected(userId) {
            var user = groupCtrl.users.find(function(user) {
                return user._id == userId;
            });


            if(user != -1) {
                user.inGroup = !user.inGroup;

                if(user.inGroup) {
                    groupUsersSvc.create({
                        'userId': user._id,
                        'groupId': groupId
                    }).then(null, OnError);
                }
                else {
                    var index = groupUsers.findIndex(function(thisGU) {
                        if(thisGU.userId == userId) {
                            return true;
                        }
                    });

                    if(index != -1) {
                        groupUsersSvc.remove(groupUsers[index]._id).then(null, OnError);
                    }
                }
            }
        }


        function OnError(error) {
            console.log(error);
        }
    }
})();
