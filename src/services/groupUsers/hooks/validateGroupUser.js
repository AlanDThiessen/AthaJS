'use strict';

// src/services/groupUsers/hooks/validateGroupUser.js
//
// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/hooks/readme.html

const defaults = {};

module.exports = function(options) {
    options = Object.assign({}, defaults, options);

    return function(hook) {
        hook.validateGroupUser = true;

        if(typeof(hook.data.userId) == 'undefined') {
            throw new Error('GroupUsers must have a userId.');
        }

        if(typeof(hook.data.groupId) == 'undefined') {
            throw new Error('GroupUsers must have a groupId.');
        }
    };
};
