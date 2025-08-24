const poToCsvButton = document.getElementById('poToCsvBtn');
const csvToPoButton = document.getElementById('CsvToPoBtn');
const resultOutput = document.getElementById('resultOutput');

// Add event listener to button to convert the po file to csv
// Retuns string with the results of that conversion
poToCsvButton.addEventListener('click', async () => 
{
    const result = await window.electronAPI.convertPoToCsvFiles();
    resultOutput.innerText = result;
})

// Add event listener to button to convert the csv file to po
// Retuns string with the results of that conversion
csvToPoButton.addEventListener('click', async () => 
{
    const result = await window.electronAPI.convertCsvToPoFiles();
    resultOutput.innerText = result;
})