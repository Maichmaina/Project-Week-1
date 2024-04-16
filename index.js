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

// Function to fetch car models for the selected make and year from the API
function fetchCarModels(make, year) {
  const baseUrl = 'https://vpic.nhtsa.dot.gov/api/vehicles';
  const endpoint = `/GetModelsForMakeYear/make/${make}/modelyear/${year}?format=json`;

  fetch(baseUrl + endpoint)
    .then(response => response.json())
    .then(data => {
      const modelSelect = document.getElementById('modelSelect');
      modelSelect.innerHTML = ''; // Clear previous options

      data.Results.forEach(model => {
        const option = document.createElement('option');
        option.value = model.ModelName;
        option.textContent = model.ModelName;
        modelSelect.appendChild(option);
      });
    })
    .catch(error => {
      console.error('Error fetching car models:', error);
    });
}

// Function to fetch car information for the selected make, model, and year from the API
function getCarInfo() {
  const make = document.getElementById('makeSelect').value;
  const model = document.getElementById('modelSelect').value;
  const year = document.getElementById('yearSelect').value;
  
  const baseUrl = 'https://vpic.nhtsa.dot.gov/api/vehicles';
  const endpoint = `/GetVehicleVariableList/modelyear/${year}/make/${make}/model/${model}?format=json`;

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
  `;

  document.getElementById('carInfo').innerHTML = carDetails;
}

// Event listeners to fetch car models when make and year are selected
document.getElementById('makeSelect').addEventListener('change', () => {
  const selectedMake = document.getElementById('makeSelect').value;
  const selectedYear = document.getElementById('yearSelect').value;
  fetchCarModels(selectedMake, selectedYear);
});

document.getElementById('yearSelect').addEventListener('change', () => {
  const selectedMake = document.getElementById('makeSelect').value;
  const selectedYear = document.getElementById('yearSelect').value;
  fetchCarModels(selectedMake, selectedYear);
});

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
