'use strict';

const assert = require('assert');
const app = require('../../../src/app');

describe('devStatus service', function() {
  it('registered the devStatuses service', () => {
    assert.ok(app.service('devStatuses'));
  });
});
