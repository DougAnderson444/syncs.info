import BaseError from 'streamlined-idm-wallet-sdk/src/utils/errors/base';

export class PasswordError extends BaseError {
    constructor(message, props) {
        message = message || 'Password validation unsuccessful';

        super(message, 'LOCK_VALIDATION', props);
    }
}