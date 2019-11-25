const Counter = artifacts.require('./Counter');
require('chai')
.use(require('chai-as-promised'))
.should();

contract('Counter', ([deployer]) => {
    let counter; 

    beforeEach(async () => {
        counter = await Counter.new();
    });

    describe('deployment tests', async () => {
        it('tracks the initial value', async () => {
            const result = await counter.value();
            result.toString().should.equal('0');
        });
    });

    describe('increasing value', async () => {
        let result; 
        beforeEach(async () => {
            result = await counter.increase();
        });
        
        it('increase function will increase value by 1', async () => {
            const value = await counter.value();
            value.toString().should.equal('1');
        });

        it('emits an "Increase" event', async () => {
            const log = result.logs[0];
            log.event.should.equal('Increased');
            const event = log.args;
            event.newValue.toString().should.equal('1');
        });
    });
});