const CARQUERY_API_ENDPOINT = "https://www.carqueryapi.com/api/0.3/?callback=?";

document.addEventListener("DOMContentLoaded", function() {
  populateMakeDropdown();
});

function populateMakeDropdown() {
  var makeDropdown = document.getElementById("make");
  makeDropdown.innerHTML = "<option>Loading...</option>";

  fetch(CARQUERY_API_ENDPOINT + "&cmd=getMakes")
    .then(response => response.json())
    .then(data => {
      makeDropdown.innerHTML = "<option value=''>Select Make</option>";
      data.Makes.forEach(make => {
        var option = document.createElement("option");
        option.text = make.make_display;
        option.value = make.make_id;
        makeDropdown.appendChild(option);
      });
    })
    .catch(error => {
      console.error("Error fetching makes:", error);
      makeDropdown.innerHTML = "<option>Error fetching makes</option>";
    });
}

function populateModelDropdown(makeId) {
  var modelDropdown = document.getElementById("model");
  modelDropdown.innerHTML = "<option>Loading...</option>";

  if (!makeId) {
    modelDropdown.innerHTML = "<option>Select Make First</option>";
    modelDropdown.disabled = true;
    return;
  }

  fetch(CARQUERY_API_ENDPOINT + "&cmd=getModels&make=" + makeId)
    .then(response => response.json())
    .then(data => {
      modelDropdown.innerHTML = "<option value=''>Select Model</option>";
      data.Models.forEach(model => {
        var option = document.createElement("option");
        option.text = model.model_name;
        option.value = model.model_name;
        modelDropdown.appendChild(option);
      });
      modelDropdown.disabled = false;
    })
    .catch(error => {
      console.error("Error fetching models:", error);
      modelDropdown.innerHTML = "<option>Error fetching models</option>";
      modelDropdown.disabled = true;
    });
}

// Event listener for "Make" dropdown change
document.getElementById("make").addEventListener("change", function() {
  var makeId = this.value;
  populateModelDropdown(makeId);
});

// Event listener for "Model" dropdown change
document.getElementById("model").addEventListener("change", function() {
  fetchCarInfo();
});

function fetchCarInfo() {
  var make = document.getElementById("make").value;
  var model = document.getElementById("model").value;
  var year = document.getElementById("year").value;

  if (!make || !model || !year) {
    document.getElementById("carInfo").innerHTML = "<p class='error-message'>Please select Make, Model, and Year</p>";
    return;
  }

  var params = {
    cmd: "getTrims",
    make: make,
    model: model,
    year: year
  };

  var queryParams = Object.keys(params)
    .map(key => encodeURIComponent(key) + "=" + encodeURIComponent(params[key]))
    .join("&");

  var requestUrl = CARQUERY_API_ENDPOINT + "&" + queryParams;

  document.getElementById("carInfo").innerHTML = "Loading...";

  fetch(requestUrl)
    .then(response => response.json())
    .then(data => {
      if (data.Trims && data.Trims.length > 0) {
        var carDetails = "<h2>" + data.Trims[0].model_name + "</h2>";
        carDetails += "<p><strong>Make:</strong> " + data.Trims[0].make_display + "</p>";
        carDetails += "<p><strong>Model:</strong> " + data.Trims[0].model_name + "</p>";
        carDetails += "<p><strong>Year:</strong> " + data.Trims[0].model_year + "</p>";
        carDetails += "<p><strong>Engine:</strong> " + data.Trims[0].engine_power + " " + data.Trims[0].engine_power_unit + "</p>";
        carDetails += "<p><strong>Price:</strong> $" + data.Trims[0].model_price + "</p>";
        carDetails += "<p><strong>Fuel Type:</strong> " + data.Trims[0].model_fuel_type + "</p>";
        carDetails += "<p><strong>Transmission:</strong> " + data.Trims[0].model_transmission_type + "</p>";

        document.getElementById("carInfo").innerHTML = carDetails;
      } else {
        document.getElementById("carInfo").innerHTML = "No information found for the selected car.";
      }
    })
    .catch(error => {
      console.error("Error fetching car info:", error);
      document.getElementById("carInfo").innerHTML = "An error occurred. Please try again later.";
    });
}
