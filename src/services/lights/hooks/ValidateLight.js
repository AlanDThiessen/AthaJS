'use strict';

// src/services/lights/hooks/ValidateLight.js
//
// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/hooks/readme.html

const defaults = {};

module.exports = function(options) {
    options = Object.assign({}, defaults, options);

    return function(hook) {
        hook.validateLight = true;

        if(typeof(hook.data.address) == 'undefined') {
            throw new Error('Lights must have an address.');
        }

        if(typeof(hook.data.name) == 'undefined') {
            throw new Error('Lights must have a name.');
        }

        if(typeof(hook.data.isDimmable) == 'undefined') {
            hook.data.isDimmable = false;
        }
        else if(typeof(hook.data.isDimmable) != 'boolean') {
            throw new Error('Lights isDimmable must be a boolean value.');
        }

        if(typeof(hook.data.level) == 'undefined') {
            hook.data.level = 100;
        }

        if(typeof(hook.data.status) == 'undefined') {
            hook.data.status = 'off';
        }
    };
};
