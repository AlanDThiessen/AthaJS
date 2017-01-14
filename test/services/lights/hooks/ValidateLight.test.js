'use strict';

const assert = require('assert');
const validateLight = require('../../../../src/services/lights/hooks/ValidateLight.js');

describe('lights validateLight hook', function() {
    it('hook can be used', function() {
        const mockHook = {
            type: 'before',
            app: {},
            params: {},
            result: {},
            data: {}
        };

        validateLight()(mockHook);

        assert.ok(mockHook.validateLight);
    });
});
