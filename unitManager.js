// Conversion rates table
const conversionRates = {
    "HP_to_KW": 0.7457,
    "KW_to_HP": 1 / 0.7457,
    // Add more conversion rates here in the format "FROMUNIT_to_TOUNIT": rate,
};

function convertUnits() {
    let inputValue = document.getElementById('inputValue').value;
    let inputUnit = document.getElementById('inputUnit').value;
    let outputUnit = document.getElementById('outputUnit').value;
    let conversionKey = `${inputUnit}_to_${outputUnit}`;

    if (conversionRates.hasOwnProperty(conversionKey)) {
        let outputValue = inputValue * conversionRates[conversionKey];
        let resultText = `${inputValue} ${getFullUnitName(inputUnit)} = ${outputValue.toFixed(2)} ${getFullUnitName(outputUnit)}`;
        document.getElementById('outputValue').textContent = resultText;
        
        // Update the conversion history
        updateConversionHistory(resultText);
    } else {
        document.getElementById('outputValue').textContent = "Conversion not available";
    }
}

// Function to get the full unit name for display
function getFullUnitName(unitAbbreviation) {
    const unitNames = {
        "HP": "Horsepower",
        "KW": "Kilowatts",
        // Add more unit abbreviations and their full names here
    };
    return unitNames[unitAbbreviation] || unitAbbreviation;
}


function updateConversionHistory(resultText) {
    const historyList = document.getElementById('historyList');
    const newHistoryItem = document.createElement('li');
    newHistoryItem.innerHTML = `<i class="bi bi-lightning-fill"></i> ${resultText}`;

    // Add the new history item to the top of the list
    historyList.insertBefore(newHistoryItem, historyList.firstChild);

    // Limit the history to the last 5 conversions (or any number you prefer)
    while (historyList.children.length > 5) {
        historyList.removeChild(historyList.lastChild);
    }
}
