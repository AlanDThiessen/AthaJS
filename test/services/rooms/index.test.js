'use strict';

const assert = require('assert');
const app = require('../../../src/app');

describe('rooms service', function() {
  it('registered the rooms service', () => {
    assert.ok(app.service('rooms'));
  });
});
