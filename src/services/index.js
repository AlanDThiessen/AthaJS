'use strict';
const rooms = require('./rooms');
const lights = require('./lights');
const authentication = require('./authentication');
const user = require('./user');

module.exports = function() {
  const app = this;


  app.configure(authentication);
  app.configure(user);
  app.configure(lights);
  app.configure(rooms);
};
