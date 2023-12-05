document.addEventListener("DOMContentLoaded", fetchData);

let productsData = [];
const productsPerPage = 10;
let currentPage = 1;

function fetchData() {
  fetch("https://dummyjson.com/products")
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      productsData = Array.isArray(data) ? data : (data.products || []);
      if (productsData.length > productsPerPage) {
        displayProducts(currentPage);
        addPaginationButtons();
      } else {
        displayProducts(1);
      }
      populateCategoryFilter();
      initializeSearch();
      initializeCategoryFilter();
      initializeSearchButton();
      addProductClickListeners(); // Add this line to initialize the More Details button listeners
    })
    .catch(error => console.error("Error fetching data:", error));
}

function displayProducts(page, data = productsData) {
  const productListDiv = document.getElementById("productList");
  productListDiv.innerHTML = '';

  const startIndex = (page - 1) * productsPerPage;
  const endIndex = startIndex + productsPerPage;
  const displayedProducts = data.slice(startIndex, endIndex);

  displayedProducts.forEach(product => {
    const discountedPrice = product.price - (product.price * (product.discountPercentage / 100));
const priceRounded = discountedPrice.toFixed(2);
    const productDiv = document.createElement("div");
    productDiv.innerHTML = `
      <h2>${product.title}</h2>
      <p>Price: ${product.price}</p>
      <p>Discount: ${priceRounded}</p>
      <p>Category: ${product.category}</p>
      <p>Stock: ${product.stock}</p>
      <img src="${product.thumbnail}" alt="${product.title}" data-id="${product.id}" class="product-thumbnail"/>
      <br>
      <button class="more-details-button" data-id="${product.id}">More Details</button>
      <hr>
    `;
    productListDiv.appendChild(productDiv);
  });
}

function populateCategoryFilter() {
  const categories = Array.from(new Set(productsData.map(product => product.category)));
  const categoryFilter = document.getElementById('categoryFilter');

  categories.forEach(category => {
    const option = document.createElement('option');
    option.value = category.toLowerCase();
    option.textContent = category;
    categoryFilter.appendChild(option);
  });
}

function initializeSearch() {
  const searchInput = document.getElementById('searchInput');
  searchInput.addEventListener('input', () => {
    const searchTerm = searchInput.value.toLowerCase();
    const categoryValue = document.getElementById('categoryFilter').value.toLowerCase();
    const filteredData = filterData(searchTerm, categoryValue);
    displayProducts(currentPage, filteredData);
    updatePagination(filteredData);
  });
}

function initializeCategoryFilter() {
  const categoryFilter = document.getElementById('categoryFilter');
  categoryFilter.addEventListener('change', () => {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const categoryValue = categoryFilter.value.toLowerCase();
    const filteredData = filterData(searchTerm, categoryValue);
    displayProducts(currentPage, filteredData);
    updatePagination(filteredData);
  });
}

function initializeSearchButton() {
  const searchButton = document.getElementById('searchButton');
  searchButton.addEventListener('click', () => {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const categoryValue = document.getElementById('categoryFilter').value.toLowerCase();
    const filteredData = filterData(searchTerm, categoryValue);
    displayProducts(currentPage, filteredData);
    updatePagination(filteredData);
  });
}

function filterData(searchTerm, categoryValue) {
  let filteredData = productsData;
  if (categoryValue !== 'all') {
    filteredData = filterDataByCategory(filteredData, categoryValue);
  }
  if (searchTerm.trim() !== '') {
    filteredData = filterDataBySearchTerm(filteredData, searchTerm);
  }
  return filteredData;
}

function filterDataBySearchTerm(data, term) {
  return data.filter(product =>
    product.title.toLowerCase().includes(term) ||
    product.category.toLowerCase().includes(term)
    // Add other fields for searching if necessary (e.g., description)
  );
}

function filterDataByCategory(data, category) {
  if (category === 'all') {
    return data;
  } else {
    return data.filter(product =>
      product.category.toLowerCase() === category
    );
  }
}

function addPaginationButtons() {
  const totalPages = Math.ceil(productsData.length / productsPerPage);
  const paginationContainer = document.createElement('div');
  paginationContainer.classList.add('pagination');

  for (let i = 1; i <= totalPages; i++) {
    const button = document.createElement('button');
    button.textContent = i;
    button.addEventListener('click', () => {
      currentPage = i;
      displayProducts(currentPage);
      updateActiveButton(i);
    });
    paginationContainer.appendChild(button);
  }

  document.body.appendChild(paginationContainer);
  updateActiveButton(1);
}

function updateActiveButton(selectedPage) {
  const buttons = document.querySelectorAll('.pagination button');
  buttons.forEach(button => {
    if (parseInt(button.textContent) === selectedPage) {
      button.classList.add('active');
    } else {
      button.classList.remove('active');
    }
  });
}

function addProductClickListeners() {
  const productList = document.getElementById('productList');

  productList.addEventListener('click', event => {
    const clickedElement = event.target;
    if (clickedElement.classList.contains('more-details-button')) {
      const productId = clickedElement.getAttribute('data-id');
      openProductInfoPage(productId);
    }
  });
}

function openProductInfoPage(productId) {
  const productDetailsURL = `product_details.html?id=${productId}`;
  window.location.href = productDetailsURL;
}