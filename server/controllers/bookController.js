const bookService = require('../services/book/BookService');
const bookFileService = require('../services/book/BookFileService');
const bookImageService = require('../services/book/BookImageService');
const bookWalletService = require('../services/book/BookWalletService');
const minterService = require('../services/MinterService');

const config = require('config');
const fs = require('fs');

const getBooksPage = async (req, res, next) => {
    const amountBooks = await bookService.getBooksAmount();

    bookService.getBooksWithConnectedData(req.query.page ? req.query.page : 1, config.get('amountBooksPerPageFront')).then(books => {
        res.render('books', {
            books,
            amountPages: amountBooks / config.get('amountBooksPerPageFront'),
            page: req.query.page ? req.query.page : 1
        });
    });
};

const getCreateBookPage = async (req, res, next) => {
    res.render('creatingBook', {authorId: req.query.authorId});
};

const createBook = async (req, res, next) => {
    const book = await bookService.createBook(req.body.authorId, req.body.name, req.body.description, req.body.cost);
    let pathImageToCreate = req.files.image ? req.files.image.map(file => `media/${file.filename}`) : [];
    let pathFileToCreate = req.files.file ? req.files.file.map(file => `media/${file.filename}`) : [];

    let promiseArray = [];

    promiseArray.push(bookImageService.addImagePath(book.id, pathImageToCreate));
    promiseArray.push(bookFileService.addFilePath(book.id, pathFileToCreate));
    promiseArray.push(bookWalletService.createWallet(await minterService.generateWallet(), book.id));

    await Promise.all(promiseArray).then(response => res.redirect('/'), err => res.redirect('/'));
};
const changeBook = async (req, res, next) => {
    bookService.updateBook(req.body.id, req.body.name, req.body.description, req.body.cost).then(async response => {
        let pathImageToCreate = req.files.image ? req.files.image.map(file => `media/${file.filename}`) : [];
        let pathFileToCreate = req.files.file ? req.files.file.map(file => `media/${file.filename}`) : [];

        let promiseArray = [];

        promiseArray.push(bookImageService.addImagePath(req.body.id, pathImageToCreate));
        promiseArray.push(bookFileService.addFilePath(req.body.id, pathFileToCreate));

        await Promise.all(promiseArray).then(response => response, err => res.redirect('/'));

        promiseArray = [];

        promiseArray.push(bookImageService.removeImagePath(req.body.imageToDelete));
        promiseArray.push(bookFileService.removeFilePath(req.body.fileToDelete));

        let allFilePathToDelete = [...req.body.imageToDelete, ...req.body.fileToDelete];

        allFilePathToDelete.forEach(path => fs.unlinkSync(path));

        Promise.all(promiseArray).then(response => {
            res.redirect('/');
        });
    });
};
const deleteBook = async (req, res, next) => {
    let promiseArray = [];
    promiseArray.push(bookImageService.getByBookId(req.body.id));
    promiseArray.push(bookFileService.getByBookId(req.body.id));

    let allFilesArrays = await Promise.all(promiseArray);
    let allFiles = [...allFilesArrays[0], ...allFilesArrays[1]];

    bookService.deleteBook(req.body.id).then(response => {
        allFiles.forEach(fileObj => fs.unlinkSync(fileObj.path));

        res.redirect('/');
    });
};
const getChangeBookPage = async (req, res, next) => {
    bookService.getBookDataById(req.query.id).then(book => {
        res.render('changeBookPage', {book});
    });
};
module.exports = {getBooksPage, getCreateBookPage, createBook, changeBook, deleteBook, getChangeBookPage};