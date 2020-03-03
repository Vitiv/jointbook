//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
let should = chai.should();

chai.use(chaiHttp);
//TODO start or clear test_db?

/*
  * Тест для /GET отображение страницы со всеми книгами
  */
 describe('/GET book', () => {
    it('it should render page with all books', (done) => {
      chai.request(server)
          .get('/')
          .end((err, res) => {
              res.should.have.status(200);
           
            done();
          });
    });
});
/*
  * Тест для /GET отображение страницы добавления книги
  */
describe('/GET create', () => {
  it('it should render book creating page', (done) => {
    chai.request(server)
      .get('/create')
      .end((err, res) => {
          res.should.have.status(200);
         
        done();
      });    
  });
});

/*
  * Тест для /POST добавление книги
  */
 describe('/POST create', () => {
  it('it should create book', (done) => {
    let book = {
      name: "The Lord of the Rings",
      author: "J.R.R. Tolkien",
      price: 100,
      description: "Just test book",
      media: "picture.png"
    }
    chai.request(server)
      .post('/create')
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
  * Тест для /POST change route
  */
 describe('/POST change', () => {
  it('it should POST change book', (done) => {
    let book = {
      name: "The Lord of the Rings",
      author: "J.R.R. Tolkien",
      price: 200,
      description: "Just test book",
      media: "picture.png"
    };
    book.save((err, book) => {
      chai.request(server)
        .post('/change' + book.name)
        .send({name: "The Chronicles of Narnia", author: "C.S. Lewis", description: "new desc", price: 778})
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('message').eql('Book updated!');
          res.body.book.should.have.property('description').eql("new desc");
          done();
        });    
  });
});
 });

/*
  * Тест для /GET change route
  */
 describe('/GET change', () => {
  it('it should render change book page', (done) => {
    let book = {
      name: "The Lord of the Rings",
      author: "J.R.R. Tolkien",
      price: 200,
      description: "Just test book",
      media: "picture.png"
    }
    chai.request(server)
      .get('/change' + book.name)
      .end((err, res) => {
          res.should.have.status(200);
         
         
        done();
      });    
  });
});
/*
  * Тест для /POST delete route
  */
 describe('/POST delete', () => {
  it('it should delete book', (done) => {
    let book = new Book({name: "The Chronicles of Narnia", author: "C.S. Lewis", description: "some words", price: 777})
	  	book.save((err, book) => {
				chai.request(server)
			    .delete('/book/' + book.name)
			    .end((err, res) => {
				  	res.should.have.status(200);
				  	res.body.should.be.a('object');
				  	res.body.should.have.property('message').eql('Book successfully deleted!');
				  	
			      done();
			    });
		  });  
  });
});
