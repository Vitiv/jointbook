//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
let should = chai.should();

chai.use(chaiHttp);

//TODO start or clear test_db?

/*
  * Тест для /GET author
  */
 describe('/GET authors', () => {
    it('it should render authors page', (done) => {
      chai.request(server)
          .get('/author')
          .end((err, res) => {
              res.should.have.status(200);
              res.body.should.be.a('array');
              res.body.length.should.be.eql(0);
            done();
          });
    });
});

/*
  * Тест для /POST новый автор
  */
 describe('/POST authors', () => {
  it('it should create author', (done) => {
    let author = {name: "J.R.R. Tolkien"}
    chai.request(server)
        .post('/author')
        .send(author)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('message').eql('Author successfully added!');
          res.body.book.should.have.property('name');
            
          done();
        });
  });
});

/*
  * Тест для /POST добавить книгу автора
  */
 describe('/GET author books', () => {
  it('it should GET all books of the author', (done) => {
    let book = {
      name: "The Lord of the Rings",
      author: "J.R.R. Tolkien",
      price: 200,
      description: "Just test book",
      media: "picture.png"
    }
    chai.request(server)
        .post('/author/books')
        .send(book)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('message').eql('Book successfully added!');
          res.body.book.should.have.property('name');
          res.body.book.should.have.property('author');
          res.body.book.should.have.property('description');
          res.body.book.should.have.property('price');
          res.body.book.should.have.property('media');           
          done();
        });
  });
});


/*
  * Тест для /POST/change author
  */
 describe('/POST/change authors', () => {
  it('it should change author"s data', (done) => {
    let author = {name: "J.R.R. Tolkien"}
    chai.request(server)
        .post('/author/change' + author.name)
        .send({name:"John Tolkien"})
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('message').eql('Author updated!');
          res.body.book.should.have.property('name').eql("John Tolkien");
          done();
        });
  });
});

/*
  * Тест для /POST delete author
  */
 describe('/POST authors', () => {
  it('it should POST delete author', (done) => {
    let author = { name: "John Tolkien" }
    chai.request(server)
        .post('/author/delete' + author.name)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('message').eql('Author successfully deleted!');
          
          
          done();
        });
  });
});


