document.addEventListener("DOMContentLoaded", function() {
  createForm();
  populateMakesDropdown();
});

function createForm() {
  var container = document.createElement("div");
  container.classList.add("container");

  var heading = document.createElement("h1");
  heading.textContent = "Car Information Lookup";

  var makeDropdown = document.createElement("select");
  makeDropdown.id = "make";
  makeDropdown.innerHTML = "<option value=''>Select Make</option>";

  var modelDropdown = document.createElement("select");
  modelDropdown.id = "model";
  modelDropdown.disabled = true;
  modelDropdown.innerHTML = "<option value=''>Select Model</option>";

  var yearDropdown = document.createElement("select");
  yearDropdown.id = "year";
  yearDropdown.innerHTML = `
    <option value="">Select Year</option>
    <option value="2000">2000</option>
    <option value="2001">2001</option>
    <option value="2002">2002</option>
    <!-- Add more years as needed -->
  `;

  var getCarInfoBtn = document.createElement("button");
  getCarInfoBtn.id = "getCarInfoBtn";
  getCarInfoBtn.textContent = "Get Car Info";

  var carInfoDiv = document.createElement("div");
  carInfoDiv.id = "carInfo";

  container.appendChild(heading);
  container.appendChild(makeDropdown);
  container.appendChild(modelDropdown);
  container.appendChild(yearDropdown);
  container.appendChild(getCarInfoBtn);
  container.appendChild(carInfoDiv);

  document.body.appendChild(container);
}

function populateMakesDropdown() {
  var makeDropdown = document.getElementById("make");

  fetch("https://www.carqueryapi.com/api/0.3/?callback=?&cmd=getMakes&year=2000&sold_in_us=1", {
    method: "GET"
  })
    .then(response => response.json())
    .then(data => {
      data.Makes.forEach(make => {
        var option = document.createElement("option");
        option.text = make.make_display;
        option.value = make.make_id;
        makeDropdown.appendChild(option);
      });
    })
    .catch(error => {
      console.error("Error fetching makes:", error);
    });

  makeDropdown.addEventListener("change", function() {
    var selectedMakeId = this.value;
    var modelDropdown = document.getElementById("model");

    modelDropdown.innerHTML = "<option value=''>Select Model</option>";

    if (selectedMakeId === "") {
      modelDropdown.disabled = true;
      return;
    }

    fetch(`https://www.carqueryapi.com/api/0.3/?callback=?&cmd=getModels&make=${selectedMakeId}&year=2005&sold_in_us=1&body=SUV`, {
      method: "GET"
    })
      .then(response => response.json())
      .then(data => {
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
        modelDropdown.disabled = true;
      });
  });
}

document.addEventListener("click", function(event) {
  if (event.target && event.target.id === "getCarInfoBtn") {
    var make = document.getElementById("make").value;
    var model = document.getElementById("model").value;
    var year = document.getElementById("year").value;

    if (!make) {
      alert("Please select Make");
      return;
    }

    if (!model) {
      alert("Please select Model");
      return;
    }

    if (!year) {
      alert("Please select Year");
      return;
    }

    fetchCarInfo(make, model, year);
  }
});

function fetchCarInfo(make, model, year) {
  var apiUrl = "https://www.carqueryapi.com/api/0.3/?callback=?";
  var requestData = {
    cmd: "getTrims",
    make: make,
    model: model,
    year: year,
  };

  fetch(apiUrl, {
    method: "POST",
    body: JSON.stringify(requestData),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then(response => response.json())
    .then(data => {
      if (data.Trims && data.Trims.length > 0) {
        var carInfo = "<h2>Car Information</h2>";
        carInfo += "<p><strong>Make:</strong> " + data.Trims[0].make_display + "</p>";
        carInfo += "<p><strong>Model:</strong> " + data.Trims[0].model_name + "</p>";
        carInfo += "<p><strong>Year:</strong> " + data.Trims[0].model_year + "</p>";
        carInfo += "<p><strong>Price:</strong> $" + data.Trims[0].model_price + "</p>";
        carInfo += "<p><strong>Fuel Type:</strong> " + data.Trims[0].model_fuel_type + "</p>";
        carInfo += "<p><strong>Transmission:</strong> " + data.Trims[0].model_transmission_type + "</p>";
        carInfo += "<p><strong>Engine:</strong> " + data.Trims[0].model_engine_type + "</p>";
        carInfo += "<p><strong>Engine Size:</strong> " + data.Trims[0].model_engine_size + " L</p>";
        carInfo += "<p><strong>Doors:</strong> " + data.Trims[0].model_doors + "</p>";
        carInfo += "<p><strong>Seats:</strong> " + data.Trims[0].model_seats + "</p>";
        carInfo += "<p><strong>Drive:</strong> " + data.Trims[0].model_drive + "</p>";
        carInfo += "<p><strong>Weight:</strong> " + data.Trims[0].model_weight + " lbs</p>";
        carInfo += "<p><strong>Acceleration 0-60 mph:</strong> " + data.Trims[0].model_0_to_60 + " seconds</p>";
        carInfo += "<p><strong>Top Speed:</strong> " + data.Trims[0].model_top_speed + " mph</p>";

        document.getElementById("carInfo").innerHTML = carInfo;
      } else {
        document.getElementById("carInfo").innerHTML = "No information found for the selected car.";
      }
    })
    .catch(error => {
      console.error("Error fetching car info:", error);
      document.getElementById("carInfo").innerHTML = "An error occurred. Please try again later.";
    });
}
