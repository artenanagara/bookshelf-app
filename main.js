document.addEventListener('DOMContentLoaded', () => {
    const RENDER_EVENT = 'render-book';
    const SAVED_EVENT = 'saved-book';
    const STORAGE_KEY = 'BOOKSHELF';
    let books = [];

    function isStorageExist() {
        if (typeof (Storage) === undefined) {
            alert('Browser kamu tidak mendukung local storage');
            return false;
        }
        return true;
    }

    function saveData() {
        if (isStorageExist()) {
            const parsed /* string */ = JSON.stringify(books);
            localStorage.setItem(STORAGE_KEY, parsed);
            document.dispatchEvent(new Event(SAVED_EVENT));
        }
    }

    function loadDataFromStorage() {
        const serializedData /* string */ = localStorage.getItem(STORAGE_KEY);
        let data = JSON.parse(serializedData);

        if (data !== null) {
            books = data;
        }

        document.dispatchEvent(new Event(RENDER_EVENT));
    }

    const bookForm = document.getElementById('bookForm');
    const incompleteBookList = document.getElementById('incompleteBookList');
    const completeBookList = document.getElementById('completeBookList');
    const searchBookForm = document.getElementById('searchBook');
    const searchResults = document.getElementById('searchBookSection');
    const incompleteBookEmptyMessage = document.getElementById('incompleteBookEmptyMessage');
    const completeBookEmptyMessage = document.getElementById('completeBookEmptyMessage');

    bookForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const title = document.getElementById('bookFormTitle').value;
        const author = document.getElementById('bookFormAuthor').value;
        const year = parseInt(document.getElementById('bookFormYear').value, 10);
        const isComplete = document.getElementById('bookFormIsComplete').checked;
        const bookId = Date.now();

        const newBook = {
            id: bookId,
            title,
            author,
            year,
            isComplete
        };

        books.push(newBook);
        saveData();
        displayBooks();
        e.target.reset();
    });

    searchBookForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const query = document.getElementById('searchBookTitle').value.toLowerCase();
        displaySearchResults(query);
    });

    function createBookCard(book) {
        const bookCard = document.createElement('div');
        bookCard.classList.add('bookCard');
        bookCard.setAttribute('data-bookid', book.id);
        bookCard.setAttribute('data-testid', 'bookItem');

        const bookImage = document.createElement('img');
        bookImage.src = "https://dicoding-web-img.sgp1.cdn.digitaloceanspaces.com/original/academy/dos-data_scientist_logo_300124103000.png";
        bookImage.alt = "Book Cover";

        const bookTitle = document.createElement('h3');
        bookTitle.innerText = book.title;
        bookTitle.setAttribute('data-testid', 'bookItemTitle');

        const bookAuthor = document.createElement('p');
        bookAuthor.innerText = `Penulis: ${book.author}`;
        bookAuthor.setAttribute('data-testid', 'bookItemAuthor');

        const bookYear = document.createElement('p');
        bookYear.innerText = `Tahun: ${book.year}`;
        bookYear.setAttribute('data-testid', 'bookItemYear');

        const buttonContainer = document.createElement('div');
        buttonContainer.classList.add('buttonContainer');
        const completeButton = document.createElement('button');
        completeButton.innerText = book.isComplete ? 'Baca Ulang' : 'Selesai Dibaca';
        completeButton.style.backgroundColor = '#2D3D4E';
        completeButton.style.color = 'white';
        completeButton.style.border = '1px solid #2D3D4E';
        completeButton.style.padding = '8px 16px';
        completeButton.style.borderRadius = '4px';
        completeButton.style.cursor = 'pointer';
        completeButton.style.width = '80%';
        completeButton.addEventListener('mouseover', () => {
            completeButton.style.backgroundColor = 'white';
            completeButton.style.color = '#2D3D4E';
            completeButton.style.fontWeight = '600';
            completeButton.style.border = '1px solid #2D3D4E';
        });
        completeButton.addEventListener('mouseout', () => {
            completeButton.style.backgroundColor = '#2D3D4E';
            completeButton.style.color = 'white';
            completeButton.style.fontWeight = 'normal';
        });
        completeButton.setAttribute('data-testid', 'bookItemIsCompleteButton');
        const deleteButton = document.createElement('button');
        deleteButton.innerHTML = '<i class="fa fa-trash" style="font-size:16px; color: #CC2B52; text-align: center; padding: 8px 16px;"></i>';
        deleteButton.addEventListener('mouseover', () => {
            deleteButton.querySelector('i').style.color = 'white';
        });
        deleteButton.addEventListener('mouseout', () => {
            deleteButton.querySelector('i').style.color = '#CC2B52';
        });
        deleteButton.style.border = '1px solid #CC2B52';
        deleteButton.style.backgroundColor = 'white';
        deleteButton.style.borderRadius = '4px';
        deleteButton.style.cursor = 'pointer';
        deleteButton.addEventListener('mouseover', () => {
            deleteButton.style.backgroundColor = '#CC2B52';
            deleteButton.style.color = 'white';
        });
        deleteButton.addEventListener('mouseout', () => {
            deleteButton.style.backgroundColor = 'white';
            deleteButton.style.color = '#CC2B52';
        });
        deleteButton.setAttribute('data-testid', 'bookItemDeleteButton');
        buttonContainer.appendChild(completeButton);
        buttonContainer.appendChild(deleteButton);

        completeButton.addEventListener('click', () => toggleComplete(book.id));
        deleteButton.addEventListener('click', () => deleteBook(book.id));

        bookCard.appendChild(bookImage);
        bookCard.appendChild(bookTitle);
        bookCard.appendChild(bookAuthor);
        bookCard.appendChild(bookYear);
        bookCard.appendChild(buttonContainer);

        return bookCard;
    }

    function displayBooks() {
        incompleteBookList.innerHTML = '';
        completeBookList.innerHTML = '';

        books.forEach(book => {
            const bookCard = createBookCard(book);
            if (book.isComplete) {
                completeBookList.appendChild(bookCard);
            } else {
                incompleteBookList.appendChild(bookCard);
            }
        });
        document.dispatchEvent(new Event(RENDER_EVENT));
    }

    function displaySearchResults(query) {
        const results = books.filter(book => book.title.toLowerCase().includes(query));
        searchResults.innerHTML = '';

        const searchTitle = document.createElement('h2');
        searchTitle.innerText = 'Cari Bukumu';
        searchResults.appendChild(searchTitle);

        const searchInputContainer = document.createElement('div');
        searchInputContainer.classList.add('searchInputContainer');
        searchInputContainer.style.display = 'flex';
        searchInputContainer.style.gap = '4px';
        searchInputContainer.style.width = '100%';

        const searchInput = document.createElement('input');
        searchInput.type = 'text';
        searchInput.id = 'searchBookTitle';
        searchInput.placeholder = 'Cari buku...';
        searchInput.value = query;
        searchInput.style.width = '100%';
        searchInput.style.padding = '8px';
        searchInput.style.border = '1px solid #ccc';
        searchInput.style.borderRadius = '4px';


        const searchButton = document.createElement('button');
        searchButton.innerText = 'Cari';
        searchButton.style.backgroundColor = '#2D3D4E';
        searchButton.style.color = 'white';
        searchButton.style.border = '1px solid #2D3D4E';
        searchButton.style.padding = '8px 16px';
        searchButton.style.borderRadius = '4px';
        searchButton.style.cursor = 'pointer';
        searchButton.addEventListener('mouseover', () => {
            searchButton.style.backgroundColor = '#1E2A38';
            searchButton.style.color = 'white';
            searchButton.style.fontWeight = '600';
            searchButton.style.border = '1px solid #2D3D4E';
        });
        searchButton.addEventListener('mouseout', () => {
            searchButton.style.backgroundColor = '#2D3D4E';
            searchButton.style.color = 'white';
            searchButton.style.fontWeight = 'normal';
        });
        searchButton.addEventListener('click', () => {
            const newQuery = searchInput.value.toLowerCase();
            displaySearchResults(newQuery);
        });

        searchInputContainer.appendChild(searchInput);
        searchInputContainer.appendChild(searchButton);
        searchResults.appendChild(searchInputContainer);

        const resetButton = document.createElement('button');
        resetButton.innerText = 'Reset Pencarian';
        resetButton.style.backgroundColor = '#CC2B52';
        resetButton.style.color = 'white';
        resetButton.style.border = '1px solid #CC2B52';
        resetButton.style.padding = '8px 16px';
        resetButton.style.borderRadius = '4px';
        resetButton.style.cursor = 'pointer';
        resetButton.addEventListener('mouseover', () => {
            resetButton.style.backgroundColor = 'white';
            resetButton.style.color = '#CC2B52';
            resetButton.style.fontWeight = '600';
            resetButton.style.border = '1px solid #CC2B52';
        });
        resetButton.addEventListener('mouseout', () => {
            resetButton.style.backgroundColor = '#CC2B52';
            resetButton.style.color = 'white';
            resetButton.style.fontWeight = 'normal';
        });
        resetButton.addEventListener('click', () => {
            searchResults.innerHTML = '';
            searchResults.appendChild(searchTitle);
            searchResults.appendChild(searchInputContainer);
            searchInput.value = '';
        });

        searchResults.appendChild(resetButton);

        if (results.length) {
            results.forEach(book => {
            const bookCard = createBookCard(book);
            bookCard.style.width = '100%';
            bookCard.style.boxSizing = 'border-box';
            searchResults.appendChild(bookCard);

            const deleteButton = bookCard.querySelector('[data-testid="bookItemDeleteButton"]');
            deleteButton.addEventListener('click', () => {
                deleteBook(book.id);
                displaySearchResults(query);
            });
            });
        } else {
            const notFoundMessage = document.createElement('p');
            notFoundMessage.innerText = 'Buku tidak ditemukan.';
            searchResults.appendChild(notFoundMessage);
            searchResults.appendChild(searchInputContainer);
            searchResults.appendChild(resetButton);
        }
    }

    function toggleComplete(bookId) {
        const book = books.find(b => b.id === bookId);
        book.isComplete = !book.isComplete;
        saveData();
        displayBooks();
    }

    function deleteBook(bookId) {
        const bookIndex = books.findIndex(b => b.id === bookId);
        books.splice(bookIndex, 1);
        saveData();
        displayBooks();
    }

    if (isStorageExist()) {
        loadDataFromStorage();
    }

    document.addEventListener(RENDER_EVENT, () => console.log('Books rendered'));
    document.addEventListener(SAVED_EVENT, () => console.log('Data saved'));

    displayBooks();
});
