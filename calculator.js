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



