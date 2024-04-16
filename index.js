// Function to fetch available car makes from the API
function fetchCarMakes() {
  const baseUrl = 'https://vpic.nhtsa.dot.gov/api/vehicles';
  const endpoint = '/GetMakesForVehicleType/car?format=json';

  fetch(baseUrl + endpoint)
    .then(response => response.json())
    .then(data => {
      const makeSelect = document.getElementById('makeSelect');
      data.Results.forEach(make => {
        const option = document.createElement('option');
        option.value = make.MakeName;
        option.textContent = make.MakeName;
        makeSelect.appendChild(option);
      });
    })
    .catch(error => {
      console.error('Error fetching car makes:', error);
    });
}

// Function to fetch car models for the selected make, year, and vehicle type from the API
function fetchCarModels(make, year, vehicleType) {
  const baseUrl = 'https://vpic.nhtsa.dot.gov/api/vehicles';
  let endpoint = `/GetModelsForMakeYear/make/${make}/modelyear/${year}?format=json`;

  if (vehicleType) {
    endpoint = `/GetModelsForMakeYear/make/${make}/modelyear/${year}/vehicletype/${vehicleType}?format=json`;
  }

  fetch(baseUrl + endpoint)
    .then(response => response.json())
    .then(data => {
      displayCarModels(data.Results);
    })
    .catch(error => {
      console.error('Error fetching car models:', error);
    });
}

// Function to get selected make, year, and vehicle type, and fetch car models
function getCarModels() {
  const make = document.getElementById('makeSelect').value;
  const year = document.getElementById('yearSelect').value;
  const vehicleType = document.getElementById('vehicleTypeSelect').value;
  
  fetchCarModels(make, year, vehicleType);

  // Display selected make, year, and vehicle type
  document.getElementById('selectedMake').textContent = `Selected Make: ${make}`;
  document.getElementById('selectedYear').textContent = `Selected Year: ${year}`;
  document.getElementById('selectedVehicleType').textContent = `Selected Vehicle Type: ${vehicleType || 'Any'}`;
}

// Function to display fetched car models
function displayCarModels(models) {
  const carModelsContainer = document.getElementById('carModels');
  carModelsContainer.innerHTML = ''; // Clear previous content

  if (models.length === 0) {
    carModelsContainer.textContent = 'No models found.';
    return;
  }

  const ul = document.createElement('ul');
  models.forEach(model => {
    const li = document.createElement('li');
    li.textContent = model.Model_Name;
    ul.appendChild(li);
  });

  carModelsContainer.appendChild(ul);
}

// Event listeners to fetch car models when make, year, or vehicle type are selected
document.getElementById('makeSelect').addEventListener('change', getCarModels);
document.getElementById('yearSelect').addEventListener('change', getCarModels);
document.getElementById('vehicleTypeSelect').addEventListener('change', getCarModels);

// On page load, fetch car makes and populate the year dropdown with current and past 10 years
window.onload = () => {
  fetchCarMakes();

  const yearSelect = document.getElementById('yearSelect');
  const currentYear = new Date().getFullYear();
  for (let year = currentYear; year >= currentYear - 10; year--) {
    const option = document.createElement('option');
    option.value = year;
    option.textContent = year;
    yearSelect.appendChild(option);
  }
};
