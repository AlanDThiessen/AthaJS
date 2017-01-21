'use strict';

const path = require('path');
const NeDB = require('nedb');
const service = require('feathers-nedb');
const hooks = require('./hooks');

module.exports = function(){
    const app = this;

    const db = new NeDB({
        filename: path.join(app.get('nedb'), 'groups.db'),
        autoload: true
    });

    let options = {
        Model: db,
        paginate: {
            default: 5,
            max: 25
        }
    };

    // Initialize our service with any options it requires
    app.use('/groups', service(options));

    // Get our initialize service to that we can bind hooks
    const groupsService = app.service('/groups');

    // Set up our before hooks
    groupsService.before(hooks.before);

    // Set up our after hooks
    groupsService.after(hooks.after);
};
