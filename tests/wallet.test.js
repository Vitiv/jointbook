//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
// let should = chai.should();

chai.use(chaiHttp);

//TODO start or clear test_db?

/*
  * Тест для открытия кошелька клиента
  */
 describe('open customer wallet', () => {
    it('it should open wallet', (done) => {
      let wallet = {}
      //TODO open customer's wallet
    });
});

/*
  * Тест для открытия кошелька книги
  */
 describe('ooen book wallet', () => {
  it('it should open wallet', (done) => {
    let wallet = {}
      //TODO open book's wallet
  });
});
