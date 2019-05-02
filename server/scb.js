const fetch = require('node-fetch');

const { querySalary } = require('./queriesSalary.js')
const { queryPopulation } = require('./queriesPopulation.js')

const urlSalary = 'http://api.scb.se/OV0104/v1/doris/sv/ssd/HE/HE0110/HE0110A/SamForvInk2';
const urlPopulation = 'http://api.scb.se/OV0104/v1/doris/sv/ssd/BE/BE0101/BE0101A/BefolkningNy';

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

async function printFetch(type) {
  let result;
  let query;
  let startYear;
  switch (type) {
    case 'salary':
      result = await fetchSCB(urlSalary, querySalary);
      query = querySalary;
      startYear = query.query[3].selection.values[0];
      break;

    case 'population':
      result = await fetchSCB(urlPopulation, queryPopulation);
      query = queryPopulation;
      startYear = query.query[1].selection.values[0];
      break;

    default:
      throw new Error('invalid SCB type')
      break;
  }

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

  return { data: sortedCollection, startYear: startYear }
}


module.exports.printFetch = printFetch;