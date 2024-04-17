// Define arrays of predefined makes, models, and years
const predefinedMakes = ["Honda", "Toyota", "Ford"];
const predefinedModels = {
  "Honda": ["Accord", "Civic", "CR-V"],
  "Toyota": ["Camry", "Corolla", "Rav4"],
  "Ford": ["F-150", "Focus", "Escape"]
};
const predefinedYears = (() => {
  const currentYear = new Date().getFullYear();
  const years = [];
  for (let year = currentYear; year >= currentYear - 10; year--) {
    years.push(year.toString());
  }
  return years;
})();

// Function to populate the dropdown with predefined makes
function populateMakesDropdown() {
  const makeSelect = document.getElementById('makeSelect');
  makeSelect.innerHTML = ''; // Clear previous options
  makeSelect.add(new Option('Select Make', '')); // Add default option

  predefinedMakes.forEach(make => {
    const option = new Option(make, make);
    makeSelect.add(option);
  });
}

// Function to populate the dropdown with predefined models based on the selected make
function populateModelsDropdown(make) {
  const modelSelect = document.getElementById('modelSelect');
  modelSelect.innerHTML = ''; // Clear previous options
  modelSelect.add(new Option('Select Model', '')); // Add default option

  const models = predefinedModels[make] || [];
  models.forEach(model => {
    const option = new Option(model, model);
    modelSelect.add(option);
  });
}

// Function to populate the dropdown with predefined years
function populateYearsDropdown() {
  const yearSelect = document.getElementById('yearSelect');
  yearSelect.innerHTML = ''; // Clear previous options

  predefinedYears.forEach(year => {
    const option = new Option(year, year);
    yearSelect.add(option);
  });
}

// On page load, populate dropdowns with predefined values and add event listeners
window.onload = () => {
  populateMakesDropdown();
  populateYearsDropdown();

  // Add event listener for make selection change
  document.getElementById('makeSelect').addEventListener('change', () => {
    const make = document.getElementById('makeSelect').value;
    populateModelsDropdown(make);
  });

  // Call populateModelsDropdown initially to populate models based on the default make
  const defaultMake = document.getElementById('makeSelect').value;
  populateModelsDropdown(defaultMake);
};

// Function to get car information and display it
function getCarInfo() {
  const make = document.getElementById('makeSelect').value;
  const model = document.getElementById('modelSelect').value;
  const year = document.getElementById('yearSelect').value;

  // Hardcoded car details
  const carDetails = [
    { Variable: "Make", Value: make },
    { Variable: "Model", Value: model },
    { Variable: "Year", Value: year },
    { Variable: "Engine CC", Value: "1500" }, // Example engine cc
    { Variable: "Transmission", Value: "Automatic" }, // Example transmission
    // Add more details as needed
  ];

  displayCarInfo(carDetails);
}

// Function to display car information
function displayCarInfo(carInfo) {
  const carDetailsHTML = carInfo.map(item => `<p><strong>${item.Variable}:</strong> ${item.Value}</p>`).join('');
  document.getElementById('carInfo').innerHTML = carDetailsHTML;
}
