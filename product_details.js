// product_details.js
document.addEventListener("DOMContentLoaded", displayProductDetails);

function displayProductDetails() {
  // Extract the product ID from the URL query parameters
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get('id');

  // Fetch detailed product information using the product ID
  fetch(`https://dummyjson.com/products/${productId}`)
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then(product => {
      const productDetailsDiv = document.getElementById("productDetails");
      productDetailsDiv.innerHTML = `
        <h2>${product.title}</h2>
        <p>Price: ${product.price}</p>
        <p>Discount: ${product.discount}%</p>
        <p>Category: ${product.category}</p>
        <p>Stock: ${product.stock}</p>
        <img src="${product.thumbnail}" alt="${product.title}" />
        <!-- Add additional details as needed -->
      `;
    })
    .catch(error => console.error("Error fetching product details:", error));
}
