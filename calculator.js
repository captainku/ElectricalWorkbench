
//create chart on load:
updateChart(1, 1, 1);

function calculateResults() {
    var solveFor = document.getElementById('solveFor').value;
    var power = parseFloat(document.getElementById('powerInput').value);
    var powerUnit = document.getElementById('powerUnit').value;
    var voltage = parseFloat(document.getElementById('voltageInput').value);
    var voltageUnit = document.getElementById('voltageUnit').value;
    var voltageType = document.getElementById('voltageType').value;
    var current = parseFloat(document.getElementById('currentInput').value);
    var pf = parseFloat(document.getElementById('pfInput').value);
    var eff = parseFloat(document.getElementById('effInput').value);
    //var amountContinue = parseFloat(document.getElementById('loadContinueAmount').value);
    var phaseType = document.querySelector('input[name="phaseType"]:checked').value;

    var result = 0;
    var powerResult = 0;
    var currentResult = 0;
    var voltageResult = 0;
    var powerResultUnit = "W";
    var currentResultUnit = "A";
    var voltageResultUnit = "V";
    var powerAppResultUnit= "VA";
    var powerReactiveResultUnit="Var";
    var powerS = 0;
    var powerQ = 0;
    var inputHistory =""



    // Convert all values to base units (Watts, Volts, Amps)
    power *= (powerUnit === 'kW' ? 1000 : 
            (powerUnit === 'MW' ? 1000000 : 
            (powerUnit === 'Hp' ? 745.7 : 1))); // 1 Horsepower is approximately equal to 745.7 Watts

    voltage *= (voltageUnit === 'kV' ? 1000 : 
                (voltageUnit === 'mV' ? 0.001 : 1));

    //convert eff to decmil
        eff = eff/100;

    // Check if it's a three-phase system
    var isThreePhase = phaseType === 'Three Phase';

    if (solveFor === 'power' && !isNaN(voltage) && !isNaN(current)) {
        
        if(voltageType == "Line-Line")
        {
            powerResult = isThreePhase ? Math.sqrt(3) * voltage * current * pf*eff : voltage * current * pf*eff;
        }
        else
        {
            powerResult = isThreePhase ? 3 * voltage * current * pf*eff : voltage * current * pf*eff ;
        }
        currentResult = current;
        voltageResult = voltage;
    } else if (solveFor === 'voltage' && !isNaN(power) && !isNaN(current) && current !== 0) {
        if(voltageType == "Line-Line")
        {
            voltageResult = isThreePhase ? power / (Math.sqrt(3) * current *pf*eff) : power / (current*pf*eff);
        }
        else
        {
            voltageResult = isThreePhase ? power / (3 * current*pf*eff) : power / (current*pf*eff);
        }

        currentResult = current;
        powerResult = power;
    } else if (solveFor === 'current' && !isNaN(power) && !isNaN(voltage) && voltage !== 0) {
        if(voltageType == "Line-Line")
        {
            currentResult = isThreePhase ? power / (Math.sqrt(3) * voltage *pf*eff ): power /(voltage *pf*eff );
        }
        else
        {
            currentResult = isThreePhase ? power / (3 * voltage *pf*eff) : power / (voltage *pf*eff);
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
    powerAppResultUnit = powerS > 1000 ? "KVA" : "VA";
    powerS = powerS > 1000 ? powerS / 1000 : powerS;
    powerReactiveResultUnit = powerQ > 1000 ? "KVAR" : "VAR";
    powerQ = powerQ > 1000 ? powerQ / 1000 : powerQ;

    //Update Result values here:
        // First, remove the highlighted class from all result elements
    document.querySelectorAll('.result-value').forEach(function(element) {
        element.classList.remove('highlighted-result');
    });

        // Add the highlighted class to the corresponding result element
    switch (solveFor) {
        case 'power':
            document.getElementById('resultPower').classList.add('highlighted-result');
            break;
        case 'voltage':
            console.log("Adding class to voltage");
            document.getElementById('resultVoltage').classList.add('highlighted-result');
            break;
        case 'current':
            document.getElementById('resultCurrent').classList.add('highlighted-result');
            break;
    }




    document.getElementById('resultPower').textContent = powerResult.toFixed(1) + " " + powerResultUnit;
    document.getElementById('resultVoltage').textContent = voltageResult.toFixed(1) + " " + voltageResultUnit;
    document.getElementById('resultCurrent').textContent = currentResult.toFixed(1) + " " + currentResultUnit;
    document.getElementById('resultPhaseType').textContent = phaseType;
    document.getElementById('resultVoltageType').textContent = voltageType;
    document.getElementById('resultPf').textContent = pf;
    document.getElementById('resultPowerApp').textContent = powerS.toFixed(1)+ " " + powerAppResultUnit;
    document.getElementById('resultPowerActive').textContent = powerResult.toFixed(1) + " " + powerResultUnit;
    document.getElementById('resultPowerReactive').textContent = powerQ.toFixed(1) + " " + powerReactiveResultUnit;

    //Get cable size
    //calc required cable ampacity based on load type
   /* var amountNonContinue = 100-amountContinue;
    var ampsRequired = currentResult*(amountNonContinue/100) + currentResult*(amountContinue/100)*1.25;
    console.log(currentResult);
    console.log("Amps Required Calculated: " + ampsRequired);
    var cableSelected = selectCableSize(ampsRequired);
    document.getElementById('resultCableSize').innerHTML = cableSelected;
    */
    //draw chart
    updateChart(powerResult, powerQ, powerS);

    //update log
    inputHistory = "Power: " + powerResult.toFixed(1) + " " + powerResultUnit + 
    " Voltage: " + voltageResult.toFixed(1) + " " + voltageResultUnit +
     " Current: " + currentResult.toFixed(1) + " " + currentResultUnit;

    // In your calculateResults function, after you've calculated the results, call updateMathLog with the actual values
    var voltageDisplay = voltageResult.toFixed(1) + " " + voltageResultUnit;
    var currentDisplay = currentResult.toFixed(1) + " " + currentResultUnit;
    var powerMath = powerResult.toFixed(1) + " " + powerResultUnit;
    updateResultMath(voltageDisplay, currentDisplay, pf.toFixed(2), eff, powerMath,solveFor, phaseType);

}



document.getElementById('solveFor').addEventListener('change', function() {

        // Remove the highlighted class from all result elements
        document.querySelectorAll('.result-value').forEach(function(element) {
            element.classList.remove('highlighted-result');
        });
    var selectedOption = this.value;

    // List of all input elements and their corresponding units dropdowns
    var inputs = [
        { input: 'powerInput', unit: 'powerUnit' },
        { input: 'voltageInput', unit: 'voltageUnit' },
        { input: 'currentInput', unit: null } // No unit dropdown for current input
    ];

    inputs.forEach(function(item) {
        var inputElement = document.getElementById(item.input);
        var unitElement = item.unit ? document.getElementById(item.unit) : null;

        // Reset and enable all inputs and dropdowns
        inputElement.disabled = false;
        inputElement.value = '';
        inputElement.placeholder = "Enter " + item.input.replace('Input', '');

        if (unitElement) {
            unitElement.disabled = false;
        }
        console.log("Selected Option: " + selectedOption + "Is Equal to" + item.input);
        // Disable the selected input and its unit dropdown, if applicable
        if (selectedOption === item.input.replace('Input', '')) {
            inputElement.disabled = true;
            inputElement.placeholder = "Solving For " + selectedOption;

            if (unitElement) {
                unitElement.disabled = true;
            }
        }
    });


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
});
// Input validation for the Current input field
document.getElementById('pfInput').addEventListener('input', function() {
    validateInput(this, 'pfWarning');
});
document.getElementById('effInput').addEventListener('input', function() {
    const value = parseFloat(this.value); // Convert input value to a floating-point number

    // Check if the value is between 0 and 1
    if (value < 0 || value > 100 || isNaN(value)) {
        // If not, show the warning message
        document.getElementById('effWarning').style.display = 'block';
        document.getElementById('effWarning').textContent = 'Please enter a valid number between 0 and 100.';
    } else {
        // If the value is valid, hide the warning message
        document.getElementById('effWarning').style.display = 'none';
    }
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
                    beginAtZero: true,
                    ticks: {
                        color: 'white' // Change x-axis ticks color to white
                    },
                    title: {
                        display: true,
                        text: 'Your X Axis Title',
                        color: 'white' // Change x-axis title color to white
                    }
                },
                y: {
                    beginAtZero: true,
                    ticks: {
                        color: 'white' // Change y-axis ticks color to white
                    },
                    title: {
                        display: true,
                        text: 'Your Y Axis Title',
                        color: 'white' // Change y-axis title color to white
                    }
                }
            },
            plugins: {
                legend: {
                    labels: {
                        color: 'white' // Change legend labels to white
                    }
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



function updateResultMath(voltage, current, pf, eff, powerMath,solve, phase) {
    var resultFormula = document.getElementById('resultFormula');
    var resultMath = document.getElementById('resultMath');
    var resultResult = document.getElementById('resultResult');
    // Format efficiency for display (as a percentage)
    var effDisplay = eff.toFixed(2) + '%';
    // Update the content with the new formula
    //Three Phase Line to Line Formula:
    console.log(phase);
    // Three Phase Line to Line Formula:
    if (solve == "Power" && phase == "Three Phase") {
        resultFormula.innerHTML = `<p>$$ P_{\\text{three-phase}} = \\sqrt{3} \\times V_{L} \\times I_{L} \\times PF \\times EFF $$</p>`;
        resultMath.innerHTML = `<p>$$ P = \\sqrt{3} \\times ${voltage} \\times ${current} \\times ${pf} \\times ${effDisplay} $$</p>`;
        resultResult.innerHTML = `<p>$$ P = ${powerMath} $$</p>`;
    } 

    // Single Phase Formula:
    else if (solve == "Power" && phase =="Single Phase" ) {
        resultFormula.innerHTML = `<p>$$ P_{\\text{single-phase}} = V \\times I \\times PF \\times EFF $$</p>`;
        resultMath.innerHTML = `<p>$$ P = ${voltage} \\times ${current} \\times ${pf} \\times ${effDisplay} $$</p>`;
        resultResult.innerHTML = `<p>$$ P = ${powerMath} $$</p>`;
    }

    else if (solve == "Voltage" && phase == "Three Phase") {
        resultFormula.innerHTML = `<p>$$ V_{L} = \\frac{P}{\\sqrt{3} \\times I_{L} \\times PF \\times EFF} $$</p>`;
        resultMath.innerHTML = `<p>$$ V_{L} = \\frac{${powerMath}}{\\sqrt{3} \\times ${current} \\times ${pf} \\times ${effDisplay}} $$</p>`;
        resultResult.innerHTML = `<p>$$ V_{L} = ${voltage} $$</p>`;
    } 
    else if (solve == "Voltage" && phase == "Single Phase") {
        resultFormula.innerHTML = `<p>$$ V = \\frac{P}{I \\times PF \\times EFF} $$</p>`;
        resultMath.innerHTML = `<p>$$ V = \\frac{${powerMath}}{${current} \\times ${pf} \\times ${effDisplay}} $$</p>`;
        resultResult.innerHTML = `<p>$$ V = ${voltage} $$</p>`;
    }

    else if (solve == "Current" && phase == "Three Phase") {
        // For three-phase, solving for current
        resultFormula.innerHTML = `<p>$$ I_{L} = \\frac{P}{\\sqrt{3} \\times V_{L} \\times PF \\times EFF} $$</p>`;
        resultMath.innerHTML = `<p>$$ I = \\frac{${powerMath}}{\\sqrt{3} \\times ${voltage} \\times ${pf} \\times ${effDisplay}} $$</p>`;
        resultResult.innerHTML = `<p>$$ I = ${current} $$</p>`;
    } else if (solve == "Current" && phase == "Single Phase") {
        // For single-phase, solving for current
        resultFormula.innerHTML = `<p>$$ I = \\frac{P}{V \\times PF \\times EFF} $$</p>`;
        resultMath.innerHTML = `<p>$$ I = \\frac{${powerMath}}{${voltage} \\times ${pf} \\times ${effDisplay}} $$</p>`;
        resultResult.innerHTML = `<p>$$ I = ${current} $$</p>`;
    }

    

    else{
        resultFormula.innerHTML = "";
        resultMath.innerHTML = "";
        resultResult.innerHTML = "";
    }

    // Request MathJax to typeset the new content
    MathJax.typesetPromise([resultFormula, resultMath, resultResult]);
}




//Cable Sizing:
function selectCableSize(current) {
    const cableSizes75 = [
        { current: 20, size: '14 AWG' },
        { current: 25, size: '12 AWG' },
        { current: 35, size: '10 AWG' },
        { current: 50, size: '8 AWG' },
        { current: 65, size: '6 AWG' },
        { current: 85, size: '4 AWG' },
        { current: 100, size: '3 AWG' },
        { current: 115, size: '2 AWG' },
        { current: 130, size: '1 AWG' },
        { current: 150, size: '1/0' },
        { current: 175, size: '2/0' },
        { current: 200, size: '3/0' },
        { current: 230, size: '4/0' },
        { current: 255, size: '250' },
        { current: 285, size: '300' },
        { current: 310, size: '350' },
        { current: 335, size: '400' },
        { current: 380, size: '500' },
        { current: 420, size: '600' },
        { current: 460, size: '700' },
        { current: 475, size: '750' },
    ];

    // Find the smallest cable size that can handle the current
    const suitableCable = cableSizes75.find(cable => cable.current >= current);

    if (suitableCable) {
        return suitableCable.size;
    } else {
        throw new Error('Current exceeds the capacity of standard cable sizes');
    }
}


