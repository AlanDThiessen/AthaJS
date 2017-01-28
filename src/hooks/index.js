'use strict';

// Add any common hooks you want to share across services in here.
//
// see http://docs.feathersjs.com/hooks/readme.html for more details

exports.adminOrOwner = function(options) {
    return function(hook) {
        if(typeof(hook.params.user) != 'undefined') {
            if (!(Array.isArray(hook.params.user.roles)) || (hook.params.user.roles.indexOf('admin') == -1)) {
                hook.params.query['userId'] = hook.params.user._id;
            }
        }
    };
};
