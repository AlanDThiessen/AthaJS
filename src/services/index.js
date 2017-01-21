'use strict';
const groupUsers = require('./groupUsers');
const devTemplates = require('./devTemplates');
const devStatus = require('./devStatus');
const scenes = require('./scenes');
const groups = require('./groups');
const permissions = require('./permissions');
const devices = require('./devices');
const zones = require('./zones');
const houses = require('./houses');
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
  app.configure(houses);
  app.configure(zones);
  app.configure(devices);
  app.configure(permissions);
  app.configure(groups);
  app.configure(scenes);
  app.configure(devStatus);
  app.configure(devTemplates);
  app.configure(groupUsers);
};
