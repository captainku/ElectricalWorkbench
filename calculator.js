function calculateResults() {
    var solveFor = document.getElementById('solveFor').value;
    var power = parseFloat(document.getElementById('powerInput').value);
    var powerUnit = document.getElementById('powerUnit').value;
    var voltage = parseFloat(document.getElementById('voltageInput').value);
    var voltageUnit = document.getElementById('voltageUnit').value;
    var voltageType = document.getElementById('voltageType').value;
    var current = parseFloat(document.getElementById('currentInput').value);
    var pf = parseFloat(document.getElementById('pfInput').value);
    var phaseType = document.querySelector('input[name="phaseType"]:checked').value;

    var result = 0;
    var powerResult = 0;
    var currentResult = 0;
    var voltageResult = 0;
    var powerResultUnit = "W";
    var currentResultUnit = "A";
    var voltageResultUnit = "V";
    var powerAppResultUnit= "VA";
    var powerReactiveResultUnit="Var"
    var powerS = 0;
    var powerQ = 0;

    // Convert all values to base units (Watts, Volts, Amps)
    power *= (powerUnit === 'kW' ? 1000 : (powerUnit === 'MW' ? 1000000 : 1));
    voltage *= (voltageUnit === 'kV' ? 1000 : (voltageUnit === 'mV' ? 0.001 : 1));

    // Check if it's a three-phase system
    var isThreePhase = phaseType === 'Three Phase';

    if (solveFor === 'Power' && !isNaN(voltage) && !isNaN(current)) {
        if(voltageType == "Line-Line")
        {
            powerResult = isThreePhase ? Math.sqrt(3) * voltage * current * pf : voltage * current * pf ;
        }
        else
        {
            powerResult = isThreePhase ? 3 * voltage * current * pf : voltage * current * pf ;
        }
        currentResult = current;
        voltageResult = voltage;
    } else if (solveFor === 'Voltage' && !isNaN(power) && !isNaN(current) && current !== 0) {
        if(voltageType == "Line-Line")
        {
            voltageResult = isThreePhase ? power / (Math.sqrt(3) * current *pf) : power / (current*pf);
        }
        else
        {
            voltageResult = isThreePhase ? power / (3 * current*pf) : power / (current*pf);
        }


        currentResult = current;
        powerResult = power;
    } else if (solveFor === 'Current' && !isNaN(power) && !isNaN(voltage) && voltage !== 0) {
        if(voltageType == "Line-Line")
        {
            currentResult = isThreePhase ? power / (Math.sqrt(3) * voltage *pf) : power /(voltage *pf);
        }
        else
        {
            currentResult = isThreePhase ? power / (3 * voltage *pf) : power / (voltage *pf);
        }

        voltageResult = voltage;
        powerResult = power;
    }

    //Calculate Other forms of Power
    powerS = powerResult/pf;
    powerQ = Math.sqrt((powerS*powerS)-(powerResult*powerResult));

    //Handle Unit management
    powerResultUnit = powerResult > 1000 ? "kW" : "W";
    powerResult = powerResult > 1000 ? powerResult / 1000 : powerResult;
    voltageResultUnit = voltageResult > 1000 ? "kV" : "V";
    voltageResult = voltageResult > 1000 ? voltageResult / 1000 : voltageResult;
    currentResultUnit = currentResult > 1000 ? "kA" : "A";
    currentResult = currentResult > 1000 ? currentResult / 1000 : currentResult;


    //Update Result values here:

    document.getElementById('resultPower').textContent = powerResult.toFixed(1) + " " + powerResultUnit;
    document.getElementById('resultVoltage').textContent = voltageResult.toFixed(1) + " " + voltageResultUnit;
    document.getElementById('resultCurrent').textContent = currentResult.toFixed(1) + " " + currentResultUnit;
    document.getElementById('resultPhaseType').textContent = phaseType;
    document.getElementById('resultVoltageType').textContent = voltageType;
    document.getElementById('resultPf').textContent = pf;
    document.getElementById('resultPowerApp').textContent = powerS.toFixed(1)+ " " + powerAppResultUnit;
    document.getElementById('resultPowerActive').textContent = powerResult.toFixed(1) + " " + powerResultUnit;
    document.getElementById('resultPowerReactive').textContent = powerQ.toFixed(1) + " " + powerReactiveResultUnit;

        //draw chart
        updateChart(powerResult, powerQ, powerS);


}



document.getElementById('solveFor').addEventListener('change', function() {
    var selectedOption = this.value;

    // Reset placeholders for all inputs
    document.getElementById('powerInput').placeholder = "Enter Power";
    document.getElementById('voltageInput').placeholder = "Enter Voltage";
    document.getElementById('currentInput').placeholder = "Enter Current";

    // Enable all inputs and dropdowns
    document.getElementById('powerInput').disabled = false;
    document.getElementById('powerUnit').disabled = false;
    document.getElementById('voltageInput').disabled = false;
    document.getElementById('voltageUnit').disabled = false;
    document.getElementById('currentInput').disabled = false;

    // Update placeholder and disable input for the selected "Solve For" option
    if (selectedOption === 'Power') {
        document.getElementById('powerInput').disabled = true;
        document.getElementById('powerUnit').disabled = true;
        document.getElementById('powerInput').value='';
        document.getElementById('powerInput').placeholder = "Solving For Power";
    } else if (selectedOption === 'Voltage') {
        document.getElementById('voltageInput').disabled = true;
        document.getElementById('voltageUnit').disabled = true;
        document.getElementById('voltageInput').value='';
        document.getElementById('voltageInput').placeholder = "Solving For Voltage";
    } else if (selectedOption === 'Current') {
        document.getElementById('currentInput').disabled = true;
        document.getElementById('currentInput').placeholder = "Solving For Current";
        document.getElementById('currentInput').value='';
    }
});

// Trigger change event on page load to set initial state
document.getElementById('solveFor').dispatchEvent(new Event('change'));


// Initialize the form state based on the current selection
document.getElementById('solveFor').dispatchEvent(new Event('change'));

// Input validation for the Power input field
document.getElementById('powerInput').addEventListener('input', function() {
    validateInput(this, 'powerWarning');
});

// Input validation for the Voltage input field
document.getElementById('voltageInput').addEventListener('input', function() {
    validateInput(this, 'voltageWarning');
});

// Input validation for the Current input field
document.getElementById('currentInput').addEventListener('input', function() {
    validateInput(this, 'currentWarning');
    console.log("Input");
});

function validateInput(inputElement, warningElementId) {
    var value = inputElement.value.trim();
    console.log("Validating Input");
    console.log(value);

    var warningElement = document.getElementById(warningElementId);

    // Check if the input value is not a valid number
    if (value == isNaN(value)) {
        // Show warning if input is not a number
        warningElement.style.display = 'block';
        console.log("Error!!!"); // For debugging purposes
    } else {
        // Hide warning if input is valid
        warningElement.style.display = 'none';
    }
}



function updateChart(realPower, reactivePower, apparentPower) {
    var ctx = document.getElementById('myChart').getContext('2d');
    if (window.myPowerTriangleChart) {
        window.myPowerTriangleChart.destroy(); // Destroy the old chart instance if exists
    }
    window.myPowerTriangleChart = new Chart(ctx, {
        type: 'scatter', // Use scatter chart for plotting individual points
        data: {
            datasets: [{
                label: 'Real Power (P)',
                data: [
                    {x: 0, y: 0}, // Origin
                    {x: realPower, y: 0} // End of Real Power (P) on x-axis
                ],
                borderColor: 'rgba(75, 192, 192, 1)', // Set Real Power line color
                borderWidth: 2,
                showLine: true,
                fill: false
            },
            {
                label: 'Reactive Power (Q)',
                data: [
                    {x: realPower, y: 0}, // Start from end of Real Power
                    {x: realPower, y: reactivePower} // End of Reactive Power (Q)
                ],
                borderColor: 'rgba(255, 159, 64, 1)', // Set Reactive Power line color
                borderWidth: 2,
                showLine: true,
                fill: false
            },
            {
                label: 'Apparent Power (S)',
                data: [
                    {x: 0, y: 0}, // Origin
                    {x: realPower, y: reactivePower} // Tip of the triangle representing apparent power
                ],
                backgroundColor: 'rgba(54, 162, 235, 1)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 2,
                showLine: true,
                fill: false,
                borderDash: [10,5] // Optional: Makes the hypotenuse a dashed line
            }]
        },
        options: {
            scales: {
                x: {
                    type: 'linear',
                    position: 'bottom',
                    beginAtZero: true
                },
                y: {
                    beginAtZero: true
                }
            },
            elements: {
                point:{
                    radius: 0 // Hide data points for a cleaner look
                }
            }
        }
    });
}

// Example usage, call this function with actual values after calculation
// updateChart(powerResult, powerQ, powerS);

