document.addEventListener('DOMContentLoaded', function() {
  populateMakesDropdown();
  populateYearsDropdown();

  document.getElementById('makeSelect').addEventListener('change', () => {
    const make = document.getElementById('makeSelect').value;
    populateModelsDropdown(make);
  });

  const defaultMake = document.getElementById('makeSelect').value;
  populateModelsDropdown(defaultMake);

  // Add event listener for "Get Info" button click
  document.getElementById('getCarInfoBtn').addEventListener('click', () => {
    getCarInfoFromFile();
  });
});

function populateMakesDropdown() {
  const makeSelect = document.getElementById('makeSelect');
  makeSelect.innerHTML = '';
  makeSelect.add(new Option('Select Make', ''));
  predefinedMakes.forEach(make => {
    const option = new Option(make, make);
    makeSelect.add(option);
  });
}

function populateModelsDropdown(make) {
  const modelSelect = document.getElementById('modelSelect');
  modelSelect.innerHTML = '';
  modelSelect.add(new Option('Select Model', ''));
  const models = predefinedModels[make] || [];
  models.forEach(model => {
    const option = new Option(model, model);
    modelSelect.add(option);
  });
}

function populateYearsDropdown() {
  const yearSelect = document.getElementById('yearSelect');
  yearSelect.innerHTML = '';
  predefinedYears.forEach(year => {
    const option = new Option(year, year);
    yearSelect.add(option);
  });
}

function getCarInfoFromFile() {
  fetch('data.js')
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      const make = document.getElementById('makeSelect').value;
      const model = document.getElementById('modelSelect').value;
      const year = document.getElementById('yearSelect').value;
      const engineCC = data.engineCC;
      const transmission = data.transmission;
      const carDetails = [
        { Variable: "Make", Value: make },
        { Variable: "Model", Value: model },
        { Variable: "Year", Value: year },
        { Variable: "Engine CC", Value: engineCC },
        { Variable: "Transmission", Value: transmission },
        // Add more details as needed
      ];
      displayCarInfo(carDetails);
    })
    .catch(error => {
      console.error('Error fetching car information:', error);
    });
}

function displayCarInfo(carInfo) {
  const carDetailsHTML = carInfo.map(item => `<p><strong>${item.Variable}:</strong> ${item.Value}</p>`).join('');
  document.getElementById('carInfo').innerHTML = carDetailsHTML;
}
