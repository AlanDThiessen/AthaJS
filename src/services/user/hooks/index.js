'use strict';

const globalHooks = require('../../../hooks');
const hooks = require('feathers-hooks');
const hooksCommon = require('feathers-hooks-common');
const auth = require('feathers-authentication').hooks;

/***
 *
 * Schema for data population when a user is queried
 * This schema is used to populate additional information along
 * with the user.
 *
 */
const userGroupsRolesSchema = {
    include: [
        {
            /**
             * Search the groupUsers service for this user's userId
             * and populate an array called "groups" with all of the
             * group ids returned by the service.
             */
            service: 'groupUsers',
            nameAs: 'groups',
            parentField: '_id',
            childField: 'userId',
            asArray: true,
            query: {
                $select: ['groupId']
            }
        },
        {
            /**
             * Search the roles service for this user's userId
             * and populate an array called "roles" with all of the
             * roles returned by the service.
             */
            service: 'roles',
            nameAs: 'roles',
            parentField: '_id',
            childField: 'userId',
            asArray: true,
            query: {
                $limit: 5,
                $select: ['role']
            }
        }
    ]
};


exports.before = {
    all: [],
    find: [
        auth.verifyToken(),
        auth.populateUser(),
        auth.restrictToAuthenticated(),
        globalHooks.adminOrOwnedBy()
    ],
    get: [
        auth.verifyToken(),
        auth.populateUser(),
        auth.restrictToAuthenticated()
        //auth.restrictToOwner({ ownerField: '_id' })
    ],
    create: [
        auth.hashPassword()
    ],
    update: [
        auth.verifyToken(),
        auth.populateUser(),
        auth.restrictToAuthenticated(),
        auth.hashPassword(),
        globalHooks.adminOrOwnedBy(),
        hooksCommon.dePopulate()
    ],
    patch: [
        auth.verifyToken(),
        auth.populateUser(),
        auth.restrictToAuthenticated(),
        auth.hashPassword(),
        globalHooks.adminOrOwnedBy(),
        hooksCommon.dePopulate()
    ],
    remove: [
        auth.verifyToken(),
        auth.populateUser(),
        auth.restrictToAuthenticated(),
        globalHooks.adminOrOwnedBy()
    ]
};

exports.after = {
    all: [
        hooks.remove('password')
    ],
    find: [
        hooksCommon.populate( { schema: userGroupsRolesSchema } )
    ],
    get: [
        hooksCommon.populate( { schema: userGroupsRolesSchema } )
    ],
    create: [
    ],
    update: [],
    patch: [],
    remove: []
};
