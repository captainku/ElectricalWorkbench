const cableSizes60= [
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
const cableSizes90 = [
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

const overcurrentSizes= [
    { current: 15},
    { current: 20},
    { current: 25},
    { current: 30},
    { current: 35},
    { current: 40},
    { current: 45},
    { current: 50},
    { current: 60},
    { current: 70},
    { current: 80},
    { current: 90},
    { current: 100},
    { current: 110},
    { current: 125},
    { current: 150},
    { current: 175},
    { current: 200},
    { current: 225},
    { current: 250},
    { current: 300},
    { current: 350},
    { current: 400},
    { current: 450},
    { current: 500},
    { current: 600},
    { current: 700},
    { current: 800},
    { current: 1000},
    { current: 1200},
    { current: 1600},
    { current: 2000},
    { current: 2500},
    { current: 3000},
    { current: 4000},
    { current: 5000},
    { current: 6000},
];





//Cable Sizing-------------------------------------------------------------------:
function selectCableSize(currentCon, CurrentNonCon) {

    //Step 1 - Select the conductor to comply with 210.19(A), 215.2, and 230.42(A). Sections 210.19(A), 215.2 and 230.42(A) require the conductor to be sized no less than 100% of the noncontinuous load, plus 125% of the continuous load.
    var sizingCurrent = parseFloat(currentCon)*1.25 + parseFloat(CurrentNonCon);

    //Step 2 - The selected conductor must be protected against overcurrent in accordance with 240.4. This requires the branch circuit, feeder, and service conductors be protected against overcurrent in accordance with their ampacities as specified in Table 310.15(B)(16).
    // Find the smallest cable size that can handle the current
    const suitableCable = cableSizes75.find(cable => cable.current >= sizingCurrent);

    //Step 3 - Size the overcurrent device in accordance with 210.20(A) and 215.3. These two NEC rules require the overcurrent device (breaker or fuse) be sized no less than 100% of the noncontinuous load, plus 125% of the continuous load.
    var selectedOvercurrent= overcurrentSizes.find(overcurrent => overcurrent.current >= sizingCurrent);

    //Step 4 - Find th e

    //Debug Print area
    console.log("Calc notes:")
    console.log("Continue Current: " + currentCon);
    console.log("Not Continue Current: " + CurrentNonCon);
    console.log("Sizing Current: " + sizingCurrent);
    console.log("Cable Selected " + suitableCable);
    console.log("Selected Overcurrent: " + selectedOvercurrent.current)

    //update steps:
    updateSteps(currentCon,CurrentNonCon, sizingCurrent, suitableCable.size,suitableCable.current, selectedOvercurrent.current)



    if (suitableCable) {
        return {
            cableSize: suitableCable.size,
            overcurrent: selectedOvercurrent ? selectedOvercurrent.current : null
        };
    } else {
        throw new Error('Current exceeds the capacity of standard cable sizes');
    }
}









function generateCableSizeTable() {
    // Create table element with Bootstrap classes
    const table = document.createElement('table');
    table.className = 'table table-dark'; // 'table-dark' for dark theme with white text

    // Create table header with Bootstrap classes and custom yellow header class
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    headerRow.className = 'yellow-header'; // Custom class for yellow background

    const thSize = document.createElement('th');
    thSize.textContent = 'Cable Size';
    const th60 = document.createElement('th');
    th60.textContent = '60°C';
    const th75 = document.createElement('th');
    th75.textContent = '75°C';
    const th90 = document.createElement('th');
    th90.textContent = '90°C';

    headerRow.appendChild(thSize);
    headerRow.appendChild(th60);
    headerRow.appendChild(th75);
    headerRow.appendChild(th90);
    thead.appendChild(headerRow);
    table.appendChild(thead);

    // Create table body with white text values
    const tbody = document.createElement('tbody');
    for (let i = 0; i < cableSizes60.length; i++) {
        const row = document.createElement('tr');

        const sizeCell = document.createElement('td');
        sizeCell.textContent = cableSizes60[i].size;
        const current60Cell = document.createElement('td');
        current60Cell.textContent = cableSizes60[i].current + ' A';
        const current75Cell = document.createElement('td');
        current75Cell.textContent = cableSizes75[i].current + ' A';
        const current90Cell = document.createElement('td');
        current90Cell.textContent = cableSizes90[i].current + ' A';

        row.appendChild(sizeCell);
        row.appendChild(current60Cell);
        row.appendChild(current75Cell);
        row.appendChild(current90Cell);
        tbody.appendChild(row);
    }
    table.appendChild(tbody);

    // Append table to the container
    const container = document.getElementById('cableSizeTableContainer');
    container.innerHTML = ''; // Clear the container before appending new content
    container.appendChild(table);
}

// Call the function to generate and display the table
generateCableSizeTable();



function calculateCableSize() {
    // Get input values from the form
    var circuitAmpacityConInput = document.getElementById("circuitAmpacityCon");
    var circuitAmpacityConValue = circuitAmpacityConInput.value + " A";
    var circuitAmpacityNonConInput = document.getElementById("circuitAmpacityNonCon");
    var circuitAmpacityNonConValue = circuitAmpacityNonConInput.value+ " A";



    // Call selectCableSize and get the results
    var results = selectCableSize(circuitAmpacityConValue, circuitAmpacityNonConValue);

    // Update the page with the cable size and overcurrent protection size
    updateCableResults(results.cableSize, results.overcurrent);
}

function updateCableResults(cableSize, overcurrentSize) {
    // Update the cable size result on the page
    document.getElementById("resultCableSize").innerText = cableSize;
    // Update the overcurrent protection result on the page
    // Check if overcurrentSize is null or undefined before updating, otherwise set to 'Not Available'
    document.getElementById("resultOvercurrentProtection").innerText = overcurrentSize ? overcurrentSize + " Amp" : 'Not Available';

}


function updateSteps(currentCon, currentNonCon, currentSizing, cableSize, cableSizeRating, overcurrentSize){
        // Update the input values display
        document.getElementById("displayConLoad").innerText = currentCon;
        document.getElementById("displayNonConLoad").innerText = currentNonCon;

        //Update sizing current calculation step
        document.getElementById("calcSizingCurrent").innerText = "Sizing Current = 1.25 x "+currentCon+ " + " + currentNonCon +" = " + currentSizing;

        //Update cable selected step:
        document.getElementById("stepsCableSelected").innerText = "A size " + cableSize + " cable is rated for " + cableSizeRating + " Amps";

        //Update overcurrent selected step
        document.getElementById("stepsOvercurrentSelected").innerText = "A " + overcurrentSize + " A overcurrent device is > the sizing current:  " + currentSizing + " Amps";


        //Results Update
        document.getElementById("resultCableSize2").innerText = cableSize;
        document.getElementById("resultOvercurrentProtection2").innerText = overcurrentSize ? overcurrentSize + " Amp" : 'Not Available';


}
