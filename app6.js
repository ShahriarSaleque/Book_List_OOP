class Book {
  constructor(title, author, isbn) {
    this.title = title;
    this.author = author;
    this.isbn = isbn;
  }
}

class UI {
  addBooktoList(book) {
    const list = document.getElementById("book-list");
    //create a row element
    const row = document.createElement("tr");
    //init row element
    row.innerHTML = `
     <td>${book.title}</td>
     <td>${book.author}</td>
     <td>${book.isbn}</td>
     <td><a href='#' class="delete">X</a></td>
    `;
    //append to list
    list.appendChild(row);
  }

  clear() {
    document.getElementById("title").value = "";
    document.getElementById("author").value = "";
    document.getElementById("isbn").value = "";
  }

  showDialog(message, className) {
    //Create a div element
    const div = document.createElement("div");
    //Add classes and textNode
    div.className = `alert ${className}`;
    div.appendChild(document.createTextNode(message));

    //Get parent tag and form
    const container = document.querySelector(".container");
    const form = document.querySelector("#book-form");

    //Add div dialog box before the form
    container.insertBefore(div, form);

    //Set timeout function
    setTimeout(function() {
      document.querySelector(".alert").remove();
    }, 3000);
  }

  deleteBook(target) {
    if (target.classList.contains("delete")) {
      target.parentElement.parentElement.remove();
    }
  }
}

class Store {
  static getBooks() {
    let books;
    if (localStorage.getItem("books") === null) {
      books = [];
    } else {
      books = JSON.parse(localStorage.getItem("books"));
    }
    return books;
  }

  static displayBooks() {
    //Initialize the UI object
    const ui = new UI();
    const books = Store.getBooks();
    books.forEach(book => {
      ui.addBooktoList(book);
    });
  }

  static addBook(book) {
    const books = Store.getBooks();

    books.push(book);

    //set LS
    localStorage.setItem("books", JSON.stringify(books));
  }

  static removeBook(isbn) {
    const books = Store.getBooks();

    books.forEach(function(book, index) {
      if (book.isbn == isbn) {
        books.splice(index, 1);
      }
      //Set Items back to LS
      localStorage.setItem("books", JSON.stringify(books));
    });
  }
}

//Add DOM listener
document.addEventListener("DOMContentLoaded", Store.displayBooks());

//Add event handler to add element
document.getElementById("book-form").addEventListener("submit", function(e) {
  const title = document.getElementById("title").value;
  const author = document.getElementById("author").value;
  const isbn = document.getElementById("isbn").value;

  //create a book object
  const book = new Book(title, author, isbn);

  //create a UI object
  const ui = new UI();

  //Check if all the fields are filled
  if (title === "" || author == "" || isbn === "") {
    //Show error dialog
    ui.showDialog("All input fields are required", "error");
  } else {
    //Add book to list --> function to be added to UI
    ui.addBooktoList(book);

    //Add Book to Ls
    Store.addBook(book);

    //Add success dialog message
    ui.showDialog("Book Added Succesfully", "success");

    //clear all input fields
    ui.clear();
  }

  e.preventDefault();
});

//Event Listener for delete functionality
document.getElementById("book-list").addEventListener("click", function(e) {
  //Initialize the UI object
  const ui = new UI();

  //Add delete via event delegation
  ui.deleteBook(e.target);

  //Delete book from LS
  Store.removeBook(e.target.parentElement.previousElementSibling.textContent);

  if (e.target.classList.contains("delete")) {
    //Show success delete message
    ui.showDialog("Deleted Successfully", "success");
  }

  e.preventDefault();
});
