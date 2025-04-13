function searchBooks() {
  const title = document.getElementById('titleInput').value.trim();
  const author = document.getElementById('authorInput').value.trim();
  const year = document.getElementById('yearInput').value.trim();
  const sortOrder = document.getElementById('sortOrder').value;
  const resultsDiv = document.getElementById('results');

  resultsDiv.innerHTML = "Loading...";

  // Build the correct API URL using separate parameters
  let url = 'https://openlibrary.org/search.json?';
  let queryParts = [];

  if (title) queryParts.push(`title=${encodeURIComponent(title)}`);
  if (author) queryParts.push(`author=${encodeURIComponent(author)}`);
  if (year) queryParts.push(`first_publish_year=${encodeURIComponent(year)}`);

  if (queryParts.length === 0) {
    resultsDiv.innerHTML = "<p>Please enter at least one search field.</p>";
    return;
  }

  url += queryParts.join("&");
  console.log("Request URL:", url);
  // Fetch data from Open Library API
  fetch(url)
    .then(res => res.json())
    .then(data => {
      resultsDiv.innerHTML = "";
      
      let books = data.docs.slice(0, 20); // Take more results for sorting

      if (books.length === 0) {
        resultsDiv.innerHTML = "No books found.";
        return;
      }

      // Sort based on dropdown selection
      if (sortOrder === "newest") {
        books.sort((a, b) => (b.first_publish_year || 0) - (a.first_publish_year || 0));
      } else if (sortOrder === "oldest") {
        books.sort((a, b) => (a.first_publish_year || 9999) - (b.first_publish_year || 9999));
      }

      // Display top 10 results
      books.slice(0, 10).forEach(book => {
        const title = book.title || "No title";
        const author = book.author_name ? book.author_name.join(', ') : "Unknown author";
        const year = book.first_publish_year || "Unknown year";
        const coverId = book.cover_i;
        const coverURL = coverId
          ? `https://covers.openlibrary.org/b/id/${coverId}-M.jpg`
          : "https://via.placeholder.com/150x200?text=No+Cover";

        const bookHTML = `
          <div class="book">
            <img src="${coverURL}" alt="Book Cover">
            <div class="book-title">${title}</div>
            <div class="author">${author}</div>
            <div>First Published: ${year}</div>
          </div>
        `;

        resultsDiv.innerHTML += bookHTML;
      });
    })
    .catch(err => {
      resultsDiv.innerHTML = "Error fetching data.";
      console.error(err);
    });
}
