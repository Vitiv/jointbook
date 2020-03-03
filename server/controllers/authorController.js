const authorService = require("../services/author/AuthorService");

const config = require("config");

const bookService = require("../services/book/BookService");

const getAuthors = async (req, res, next) => {
    let amountAuthors = await authorService.getAuthorsAmount();

    authorService.getAuthors(req.query.page ? req.query.page : 1, config.get("amountAuthorsPerPageFront")).then(authors => {
        res.render("authors", {authors, page: req.query.page ? req.query.page : 1, amountPages: amountAuthors / config.get("amountAuthorsPerPageFront")});
    });
};
const createAuthor = async (req, res, next) => {
    authorService.createAuthor(req.body.name).then(response => {
        res.redirect("/author")
    })
};
const changeAuthor = async (req, res, next) => {
    authorService.updateAuthor(req.body.id, req.body.name).then(resposne => {
        res.redirect("/author");
    })
};
const deleteAuthor = async (req, res, next) => {
    let authorsBooks = (await authorService.getAuthorByIdWithBookPagination(req.body.id, 1, 1)).books;

    if (authorsBooks.length === 0) {
        authorService.deleteAuthor(req.body.id).then(response => {
            res.redirect("/author");
        })
    } else {
        res.redirect("/author");
    }
};


const getAuthorsBooks = async (req, res, next) => {
    let amountPages = (await bookService.getBookAmountByAuthor(req.query.id)) / config.get("amountBooksPerPageFront");

    authorService.getAuthorByIdWithBookPagination(req.query.id, req.query.page ? req.query.page : 1, config.get("amountBooksPerPageFront")).then(books => {
        res.render("authorsBooks", {books: books.books, authorName: books.name, page: req.query.page ? req.query.page : 1, amountPages, id: req.query.id});
    })
};
module.exports = {getAuthors, createAuthor, changeAuthor, deleteAuthor, getAuthorsBooks};