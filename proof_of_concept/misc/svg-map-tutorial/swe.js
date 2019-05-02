const { swe_kommuner } = require('./swe_kommuner.js');

function getSwePaths() {
  // console.log(swe_kommuner[4]); // 4 to end!
  
  const swe_kommuner_paths = [];
  
  for (const kommun of swe_kommuner) {
    swe_kommuner_paths.push(kommun.path)
  }
  
  return swe_kommuner_paths;
}

