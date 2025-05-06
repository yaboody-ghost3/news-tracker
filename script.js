// Your API key from TheNewsAPI
const apiKey = "ia52IZqrSoOR3TvTFt1bbWiyOLjYckIjdfagERVE";  // Replace with your actual TheNewsAPI key

// Get DOM elements for displaying the news
const newsContainer = document.getElementById("newsContainer");
const favoritesContainer = document.getElementById("favoritesContainer");
const categorySelect = document.getElementById("categorySelect");
const searchInput = document.getElementById("searchInput");
const sectionTitle = document.getElementById("sectionTitle");
const toggleThemeBtn = document.getElementById("toggleTheme");

// Function to get favorite articles from localStorage
function getFavorites() {
  return JSON.parse(localStorage.getItem("favorites")) || [];
}

// Function to save a favorite article to localStorage
function saveFavorite(article) {
  const favorites = getFavorites();
  if (!favorites.find(fav => fav.url === article.url)) {
    favorites.push(article);
    localStorage.setItem("favorites", JSON.stringify(favorites));
    displayFavorites();
  }
}

// Function to display saved favorite articles
function displayFavorites() {
  const favorites = getFavorites();
  favoritesContainer.innerHTML = favorites.map(article => `
    <div class="article">
      <img src="${article.urlToImage || 'https://via.placeholder.com/400x200'}" alt="News Image"/>
      <div class="content">
        <h2>${article.title}</h2>
        <p>${article.description || 'No description available.'}</p>
        <a href="${article.url}" target="_blank">Read more</a>
      </div>
    </div>
  `).join('');
}

// Function to fetch news articles based on a search query
async function fetchNews(query = "top news") {
  newsContainer.innerHTML = "Loading...";
  sectionTitle.textContent = `News for "${query}"`;

  try {
    const response = await fetch(`https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&apiKey=${apiKey}`);
    
    // Check if the response is ok
    if (!response.ok) {
      throw new Error('Failed to fetch news');
    }

    const data = await response.json();
    displayNews(data.articles);

  } catch (error) {
    newsContainer.innerHTML = "❌ Failed to load news.";
    console.error("Error fetching news:", error);
  }
}

// Function to display news articles on the page
function displayNews(articles) {
  newsContainer.innerHTML = "";
  if (!articles || !articles.length) {
    newsContainer.innerHTML = "No articles found.";
    return;
  }

  articles.forEach(article => {
    const articleEl = document.createElement("div");
    articleEl.className = "article";
    articleEl.innerHTML = `
      <img src="${article.urlToImage || 'https://via.placeholder.com/400x200'}" alt="News Image"/>
      <div class="content">
        <h2>${article.title}</h2>
        <p>${article.description || "No description available."}</p>
        <a href="${article.url}" target="_blank">Read more</a>
        <button class="favorite">Add to Favorites</button>
      </div>
    `;
    articleEl.querySelector(".favorite").addEventListener("click", () => saveFavorite(article));
    newsContainer.appendChild(articleEl);
  });
}

// Event listener for category selection
categorySelect.addEventListener("change", () => {
  fetchNews(categorySelect.value);
});

// Event listener for search input (triggered by Enter key)
searchInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    fetchNews(searchInput.value);
  }
});

// Event listener for theme toggle button
toggleThemeBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
  toggleThemeBtn.textContent = document.body.classList.contains("dark-mode") ? "☀️" : "🌙";
});

// Initial call to fetch default news
fetchNews(); // Load default news
displayFavorites(); // Load saved favorites
