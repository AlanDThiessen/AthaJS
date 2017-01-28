'use strict';

// Add any common hooks you want to share across services in here.
//
// see http://docs.feathersjs.com/hooks/readme.html for more details

exports.adminOrOwnedBy = function(options) {
    return function(hook) {
        if(typeof(hook.params.user) != 'undefined') {
            if (!(Array.isArray(hook.params.user.roles)) || (hook.params.user.roles.findIndex(SearchUserRoleAdmin) == -1)) {
                hook.params.query['userId'] = hook.params.user._id;
            }
        }
    };
};


exports.adminOnly = function(options) {
    return function(hook) {
        if(typeof(hook.params.user) == 'undefined') {
            throw new Error('Admin Only: User is not defined');
        }
        else if(hook.params.user.roles.findIndex(SearchUserRoleAdmin) == -1) {
            throw new Error('Admin Only: User is not administrator');
        }
    }
};


/**
 * @param element
 * @returns {boolean}
 */
function SearchUserRoleAdmin(element) {
    if(element.role == 'admin') {
        return true;
    }
    else {
        return false;
    }
}
