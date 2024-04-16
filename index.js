// Function to fetch available car makes from the provided link and populate dropdown
function fetchCarMakes() {
  const url = 'https://vpic.nhtsa.dot.gov/api/vehicles/GetMakesForVehicleType/car?format=json';

  fetch(url)
    .then(response => response.json())
    .then(data => {
      const makeSelect = document.getElementById('makeSelect');
      makeSelect.innerHTML = ''; // Clear previous options
      makeSelect.add(new Option('Select Make', '')); // Add default option

      data.Results.forEach(make => {
        const option = new Option(make.MakeName, make.MakeName);
        makeSelect.add(option);
      });
    })
    .catch(error => {
      console.error('Error fetching car makes:', error);
    });
}

// Function to fetch car models for the selected make from the API and populate dropdown
function fetchCarModels(make) {
  const baseUrl = 'https://vpic.nhtsa.dot.gov/api/vehicles';
  const endpoint = `/GetModelsForMake/${make}?format=json`;

  fetch(baseUrl + endpoint)
    .then(response => response.json())
    .then(data => {
      const modelSelect = document.getElementById('modelSelect');
      modelSelect.innerHTML = ''; // Clear previous options
      modelSelect.add(new Option('Select Model', '')); // Add default option

      data.Results.forEach(model => {
        const option = new Option(model.Model_Name, model.Model_Name);
        modelSelect.add(option);
      });
    })
    .catch(error => {
      console.error('Error fetching car models:', error);
    });
}

// Event listener to fetch car models when make is selected
document.getElementById('makeSelect').addEventListener('change', () => {
  const selectedMake = document.getElementById('makeSelect').value;
  fetchCarModels(selectedMake);
});

// Function to fetch car information for the selected make, model, year, and vehicle type from the API
function getCarInfo() {
  const make = document.getElementById('makeSelect').value;
  const model = document.getElementById('modelSelect').value;
  const year = document.getElementById('yearSelect').value;
  const vehicleType = document.getElementById('vehicleTypeSelect').value;
  
  const baseUrl = 'https://vpic.nhtsa.dot.gov/api/vehicles';
  let endpoint = `/GetVehicleVariableList/modelyear/${year}/make/${make}/model/${model}?format=json`;

  if (vehicleType) {
    endpoint = `/GetVehicleVariableList/modelyear/${year}/make/${make}/model/${model}/vehicletype/${vehicleType}?format=json`;
  }

  fetch(baseUrl + endpoint)
    .then(response => response.json())
    .then(data => {
      displayCarInfo(data.Results);
    })
    .catch(error => {
      console.error('Error fetching car information:', error);
    });
}

// Function to display car information
function displayCarInfo(carInfo) {
  const carDetails = `
    <h2>Car Information</h2>
    <ul>
      ${carInfo.map(item => `<li><strong>${item.Variable}:</strong> ${item.Value}</li>`).join('')}
    </ul>
    <button onclick="displayMoreInfo()">More Info</button>
    <div id="moreInfo" style="display: none;"></div>
  `;

  document.getElementById('carInfo').innerHTML = carDetails;
}

// Function to display more detailed information
function displayMoreInfo() {
  const make = document.getElementById('makeSelect').value;
  const model = document.getElementById('modelSelect').value;
  const year = document.getElementById('yearSelect').value;
  const vehicleType = document.getElementById('vehicleTypeSelect').value;
  
  const baseUrl = 'https://vpic.nhtsa.dot.gov/api/vehicles';
  let endpoint = `/GetVehicleVariableList/modelyear/${year}/make/${make}/model/${model}?format=json`;

  if (vehicleType) {
    endpoint = `/GetVehicleVariableList/modelyear/${year}/make/${make}/model/${model}/vehicletype/${vehicleType}?format=json`;
  }

  fetch(baseUrl + endpoint)
    .then(response => response.json())
    .then(data => {
      const moreInfoContainer = document.getElementById('moreInfo');
      moreInfoContainer.innerHTML = `
        <h3>More Information</h3>
        <ul>
          ${data.Results.map(item => `<li><strong>${item.Variable}:</strong> ${item.Value}</li>`).join('')}
        </ul>
      `;
      moreInfoContainer.style.display = 'block';
    })
    .catch(error => {
      console.error('Error fetching more information:', error);
    });
}

// On page load, fetch car makes and populate the year dropdown with current and past 10 years
window.onload = () => {
  fetchCarMakes();

  const yearSelect = document.getElementById('yearSelect');
  const currentYear = new Date().getFullYear();
  for (let year = currentYear; year >= currentYear - 10; year--) {
    const option = new Option(year, year);
    yearSelect.add(option);
  }
};
