$(document).ready(function() {
  var carquery = new CarQuery();
  carquery.init();
  carquery.setFilters({ sold_in_us: true });
  carquery.initYearMakeModelTrim('car-years', 'car-makes', 'car-models', 'car-model-trims');

  $('#getCarInfoBtn').click(function() {
    var selectedYear = $('#car-years').val();
    var selectedMake = $('#car-makes').val();
    var selectedModel = $('#car-models').val();
    var selectedTrim = $('#car-model-trims').val();

    if (!selectedYear || !selectedMake || !selectedModel || !selectedTrim) {
      alert('Please select Year, Make, Model, and Trim.');
      return;
    }

    var requestData = {
      cmd: "getTrims",
      make: selectedMake,
      model: selectedModel,
      year: selectedYear,
      trim: selectedTrim
    };

    var apiUrl = "https://www.carqueryapi.com/api/0.3/?callback=?";

    $.ajax({
      url: apiUrl,
      method: "GET",
      data: requestData,
      dataType: "jsonp",
      success: function(data) {
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

          $("#carInfo").html(carInfo);
        } else {
          $("#carInfo").html("No information found for the selected car.");
        }
      },
      error: function(error) {
        console.error("Error fetching car info:", error);
        $("#carInfo").html("An error occurred. Please try again later.");
      }
    });
  });
});
