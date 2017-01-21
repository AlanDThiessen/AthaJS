'use strict';

const assert = require('assert');
const app = require('../../../src/app');

describe('houses service', function() {
  it('registered the houses service', () => {
    assert.ok(app.service('houses'));
  });
});
