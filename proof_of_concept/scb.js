const fetch = require('node-fetch');

const { querySalary } = require('./queries.js')

const urlSCB1 = 'http://api.scb.se/OV0104/v1/doris/sv/ssd/HE/HE0110/HE0110A/SamForvInk2';

async function fetchSCB(url, data) {
  let result;

  const options = {
    method: "POST",
    mode: 'no-cors',
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  };

  await fetch(url, options)
    .then(response => response.text())
    .then(res => result = JSON.parse(res.trim()))
    .catch(err => console.log(err))

  return result;
}

async function printFetch() {
  const result = await fetchSCB(urlSCB1, querySalary);

  const sortedCollection = {}
  result.data.forEach(element => {
    if (!sortedCollection[element.key[0]]) {
      sortedCollection[element.key[0]] = [];
    }
    sortedCollection[element.key[0]].push({
      year: element.key[3],
      value: element.values[0]
    });
  });

  return sortedCollection
}


module.exports.printFetch = printFetch;