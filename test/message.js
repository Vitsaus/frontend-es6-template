import Message from '../app/message.js';

describe('message', () => {

    it('should work', () => {

        let message = new Message();

        expect(message.getMessage()).to.equal('Hello world');

    });

});
