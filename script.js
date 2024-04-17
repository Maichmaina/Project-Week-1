document.addEventListener('DOMContentLoaded', function() {
  populateDropdowns();

  // Add event listener for "Get Car Info" button click
  document.getElementById('getCarInfoBtn').addEventListener('click', () => {
    getCarInfoFromFile();
  });
});

function populateDropdowns() {
  fetch('data.js')
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      const makes = Object.keys(data);
      const makeSelect = document.getElementById('makeSelect');
      makeSelect.innerHTML = '';
      makeSelect.add(new Option('Select Make', ''));

      makes.forEach(make => {
        const option = new Option(make, make);
        makeSelect.add(option);
      });

      // Call populateModelsDropdown initially to populate models based on the default make
      const defaultMake = makeSelect.value;
      populateModelsDropdown(defaultMake, data);

      // Populate years dropdown
      const yearSelect = document.getElementById('yearSelect');
      yearSelect.innerHTML = '';
      const currentYear = new Date().getFullYear();
      for (let year = currentYear; year >= currentYear - 10; year--) {
        const option = new Option(year, year);
        yearSelect.add(option);
      }
    })
    .catch(error => {
      console.error('Error fetching vehicle data:', error);
    });
}

function populateModelsDropdown(make, data) {
  const modelSelect = document.getElementById('modelSelect');
  modelSelect.innerHTML = '';
  modelSelect.add(new Option('Select Model', ''));

  const models = data[make] || [];
  models.forEach(model => {
    const option = new Option(model, model);
    modelSelect.add(option);
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
      displayCarInfo(data);
    })
    .catch(error => {
      console.error('Error fetching car information:', error);
    });
}

function displayCarInfo(data) {
  const make = document.getElementById('makeSelect').value;
  const model = document.getElementById('modelSelect').value;
  const year = document.getElementById('yearSelect').value;
  const engineCC = data[make][model].engineCC;
  const transmission = data[make][model].transmission;

  const carDetails = [
    { Variable: "Make", Value: make },
    { Variable: "Model", Value: model },
    { Variable: "Year", Value: year },
    { Variable: "Engine CC", Value: engineCC },
    { Variable: "Transmission", Value: transmission }
  ];

  const carDetailsHTML = carDetails.map(item => `<p><strong>${item.Variable}:</strong> ${item.Value}</p>`).join('');
  document.getElementById('carInfo').innerHTML = carDetailsHTML;
}
