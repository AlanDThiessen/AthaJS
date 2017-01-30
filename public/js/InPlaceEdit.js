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
        .directive('inPlaceEdit', InPlaceEditor);

    function InPlaceEditor() {
        return {
            restrict: 'E',
            scope: {
                placeholder: '@placeholder',
                saveValue: '&onSave',
                editId: '=',
                currentValue: '=inValue'
            },
            link: function($scope, elem, attrs) {
                var oldValue = '';

                $scope.editorEnabled = false;

                $scope.enableEditor = function() {
                    oldValue = $scope.currentValue;
                    $scope.newValue = $scope.currentValue;
                    $scope.editorEnabled = true;
                };

                $scope.save = function() {
                    var saveParams = {
                        'newValue': $scope.newValue
                    };

                    if(typeof($scope.editId) != 'undefined') {
                        saveParams.id = $scope.editId;
                    }

                    $scope.saveValue(saveParams);
                    $scope.currentValue = $scope.newValue;
                    $scope.editorEnabled = false;
                };

                $scope.cancel = function() {
                    $scope.currentValue = oldValue;
                    $scope.editorEnabled = false;
                }
            },
            templateUrl: 'templates/inPlaceEdit.html'
        };
    }

})();
