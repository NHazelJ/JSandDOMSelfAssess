let allListings = [];

function cleanText(text) {
  if (!text) {
    return "No description provided.";
  }

  return text.replace(/<[^>]*>/g, "").slice(0, 140) + "...";
}

function getAmenities(amenitiesText) {
  if (!amenitiesText) {
    return [];
  }

  try {
    return JSON.parse(amenitiesText).slice(0, 4);
  } catch (error) {
    return [];
  }
}

function getPriceNumber(priceText) {
  return Number(priceText.replace("$", "").replace(",", ""));
}

function getPriceLabel(priceText) {
  const price = getPriceNumber(priceText);

  if (price < 100) {
    return "Budget find";
  }

  if (price < 200) {
    return "Regular price";
  }

  return "Expensive stay";
}

function getListingCode(listing) {
  const amenities = getAmenities(listing.amenities);

  return `
    <div class="col-md-4">
      <div class="card h-100">
        <img src="${listing.picture_url}" class="card-img-top listing-img" alt="Airbnb listing" />

        <div class="card-body">
          <h2 class="card-title h5">${listing.name}</h2>
          <p class="price">${listing.price} <span>${getPriceLabel(listing.price)}</span></p>
          <p>${cleanText(listing.description)}</p>

          <p class="mb-1"><strong>Amenities:</strong></p>
          <ul>
            ${amenities.map((amenity) => `<li>${amenity}</li>`).join("")}
          </ul>
        </div>

        <div class="card-footer host-box">
          <img src="${listing.host_thumbnail_url}" alt="Host photo" />
          <span>Host: ${listing.host_name}</span>
        </div>
      </div>
    </div>
  `;
}

function showListings(listings) {
  const listingsElement = document.querySelector("#listings");
  const countElement = document.querySelector("#listingCount");

  listingsElement.innerHTML = listings.map(getListingCode).join("");
  countElement.textContent = `Showing ${listings.length} listings`;
}

function setupSearch() {
  const searchInput = document.querySelector("#searchInput");

  searchInput.addEventListener("input", function () {
    const searchText = searchInput.value.toLowerCase();

    const filteredListings = allListings.filter(function (listing) {
      return (
        listing.name.toLowerCase().includes(searchText) ||
        listing.host_name.toLowerCase().includes(searchText)
      );
    });

    showListings(filteredListings);
  });
}

async function loadData() {
  const response = await fetch("./airbnb_sf_listings_500.json");
  const listings = await response.json();

  allListings = listings.slice(0, 50);
  showListings(allListings);
  setupSearch();
}

loadData();
