'use strict';

const validateLight = require('./ValidateLight');

const globalHooks = require('../../../hooks');
const hooks = require('feathers-hooks');


exports.before = {
    all: [],
    find: [],
    get: [],
    create: [validateLight()],
    update: [validateLight()],
    patch: [],
    remove: []
};

exports.after = {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
};
