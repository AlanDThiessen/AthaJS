'use strict';

// src/services/user/hooks/createAccount.js
//
// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/hooks/readme.html

const defaults = {};

module.exports = function(options) {
    options = Object.assign({}, defaults, options);

    return function(hook) {
        hook.createAccount = true;

        var accounts = hook.app.service('accounts');
        accounts.create({
            'email': hook.result.email,
            'userId': hook.result._id
        });
    };
};
