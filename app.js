// Book Class
class Book {
    constructor(title, author, isbn) {
        this.title = title;
        this.author = author;
        this.isbn = isbn;
    }
}
// UI Class
class UI {
    // add book to list function
    addBook(book) {
        const list = document.querySelector('#book-list');
        const row = document.createElement('tr');
        row.innerHTML = `<td>${book.title}</td>
                        <td>${book.author}</td>
                        <td>${book.isbn}</td>
                        <td><a href="" style="text-decoration:none;" class="delete">x</a></td>`;
        list.appendChild(row);
    }
    // delete function
    deleteBook(target) {
        target.parentElement.parentElement.remove();
    }
    // clear fields function
    clearFields() {
        document.querySelector('#title').value = '';
        document.querySelector('#author').value = '';
        document.querySelector('#isbn').value = '';
    }
    // alert function
    static showAlert(message, nameOfClass) {
        // important elements
        const container = document.querySelector('.container');
        const form = document.querySelector('#book-form');
        // create div
        const alertDiv = document.createElement('div');
        // add classes
        alertDiv.className = `alert ${nameOfClass}`;
        // add text
        alertDiv.appendChild(document.createTextNode(message));
        container.insertBefore(alertDiv, form);
        if (document.getElementsByClassName(`${nameOfClass}`).length > 1) {
            UI.removeAlert();
        }
    }
    // remove alert function
    static removeAlert(nameOfClass) {
        if (document.getElementsByClassName(`${nameOfClass}`).length > 0) {
            document.querySelector(`.${nameOfClass}`).remove();
        }
    }
}

// Local Storage Class
class Store {
    static getBooksFromLocalStorage() {
        let books;
        if (localStorage.getItem('books') === null) {
            books = [];
        } else {
            books = JSON.parse(localStorage.getItem('books'));
        }
        return books;
    }
    static displayBooks() {
        const books = Store.getBooksFromLocalStorage();
        books.forEach(book => {
            const ui = new UI();
            // add book to UI
            ui.addBook(book);
        });
    }
    static addBookToLocalStorage(book) {
        const books = Store.getBooksFromLocalStorage();
        books.push(book);
        localStorage.setItem('books', JSON.stringify(books));
    }
    static removeBookFromLocalStorage(book) {
        const books = Store.getBooksFromLocalStorage();
        // find book to be deleted by isbn and delete
        for (let i = 0; i < books.length; i++) {
            if (books[i].title === book.title &&
                books[i].author === book.author &&
                books[i].isbn === book.isbn) {
                books.splice(i, 1);
                break;
            }
        }
        localStorage.setItem('books', JSON.stringify(books));
    }
}

// Validate Author
document.querySelector('#title').addEventListener('input', function () {
    // prevent white space in the beginning of input
    this.value = this.value.replace(/^\s/g, '');
});

// Validate Author
document.querySelector('#author').addEventListener('input', function () {
    // prevent white space in the beginning of input
    this.value = this.value.replace(/^\s/g, '');
});

// Validate ISBN
document.querySelector('#isbn').addEventListener('input', function () {
    // allow only integers and a maximum of 13 digits
    this.value = this.value.replace(/[^0-9]+/g, '').replace(/^(\d{0,13})\d*$/, '$1');
});

// Remove Red Border Line When Title Field Is In Focus
document.querySelector('#title').addEventListener('focus', function () {
    document.querySelector('#title').style.border = '1px solid #d1d1d1';
    if (document.getElementsByClassName('error').length > 0) {
        UI.removeAlert('error');
    }
});

// Remove Red Border Line When Author Field Is In Focus
document.querySelector('#author').addEventListener('focus', function () {
    document.querySelector('#author').style.border = '1px solid #d1d1d1';
    if (document.getElementsByClassName('error').length > 0) {
        UI.removeAlert('error');
    }
});

// Remove Red Border Line When ISBN Field Is In Focus
document.querySelector('#isbn').addEventListener('focus', function () {
    document.querySelector('#isbn').style.border = '1px solid #d1d1d1';
    if (document.getElementsByClassName('error').length > 0) {
        UI.removeAlert('error');
    }
});

// DOM Load Event
document.addEventListener('DOMContentLoaded', Store.displayBooks);

// Event Listener for Add Book
document.querySelector('#book-form').addEventListener('submit', function (e) {
    // get form values from the input fields
    const title = document.querySelector('#title').value,
        author = document.querySelector('#author').value,
        isbn = document.querySelector('#isbn').value;

    const book = new Book(title, author, isbn);
    const ui = new UI();

    // validate
    if (title === '' || author === '' || isbn === '') {
        // error alert
        if (document.getElementsByClassName('error').length < 1) {
            UI.showAlert('Please fill in the highlighted field(s)', 'error');
        }
        // highlight borders red
        if (title === '') {
            document.querySelector('#title').style.border = '1px solid red';
        }
        if (author === '') {
            document.querySelector('#author').style.border = '1px solid red';
        }
        if (isbn === '') {
            document.querySelector('#isbn').style.border = '1px solid red';
        }
    } else {
        // add book to list
        ui.addBook(book);
        // add book to local storage
        Store.addBookToLocalStorage(book);
        // clear input fields
        ui.clearFields();
        UI.showAlert('Book added!', 'success');
        setTimeout(function () {
            UI.removeAlert('success');
        }, 3000);
    }
    e.preventDefault();
});

// Event Listener for Delete Book
document.querySelector('#book-list').addEventListener('click', function (e) {
    // show deleted alert
    if (e.target.className === 'delete') {
        const ui = new UI();
        // remove book from UI
        ui.deleteBook(e.target);
        // remove book from local storage
        const title = (e.target.parentElement.previousElementSibling.previousElementSibling.previousElementSibling.textContent),
            author = (e.target.parentElement.previousElementSibling.previousElementSibling.textContent),
            isbn = (e.target.parentElement.previousElementSibling.textContent);
        Store.removeBookFromLocalStorage(new Book(title, author, isbn));
        // e.target.parentElement.previousElementSibling.textContent
        UI.showAlert('Book Removed', 'success');
        setTimeout(function () {
            UI.removeAlert('success');
        }, 3000);
    }
    e.preventDefault();
});
