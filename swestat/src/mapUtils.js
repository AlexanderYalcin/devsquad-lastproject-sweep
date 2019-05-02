function interpolateColors(startColorHex, goalColorHex, steps) {
  const startColor = hexToRgb(startColorHex);
  const goalColor = hexToRgb(goalColorHex);

  const R = startColor.r;
  const G = startColor.g;
  const B = startColor.b;

  const targetR = goalColor.r;
  const targetG = goalColor.g;
  const targetB = goalColor.b;

  const diffR = targetR - R;
  const diffG = targetG - G;
  const diffB = targetB - B;

  const gradientList = [];

  for (let i = 0; i < steps + 1; i++) {
    const newR = R + (diffR * i / steps)
    const newG = G + (diffG * i / steps)
    const newB = B + (diffB * i / steps)

    gradientList.push(rgbToHex(newR, newG, newB));
  }
  return gradientList
}

function hexToRgb(hex) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

function getWindowHeight() {
  const windowHeight = window.innerHeight
    || document.documentElement.clientHeight
    || document.body.clientHeight;

  return windowHeight * 0.9;

}

function rgbToHex(red, green, blue) {
  var rgb = blue | (green << 8) | (red << 16);
  return '#' + (0x1000000 + rgb).toString(16).slice(1)
}

function calcMinMax(countiesObj) {
  const countiesDataArr = Object.values(countiesObj).filter((el) => el !== -1);

  const valMin = Math.min(...countiesDataArr); // remove abs?
  const valMax = Math.max(...countiesDataArr);

  return { valMin: valMin, valMax: valMax }
}

function removeMap() {
  const mapOuter = document.getElementById("county-map")
  mapOuter.remove();

  const outerDiv = document.getElementsByClassName('map-container')[0];
  const newMapDiv = document.createElement('div');
  newMapDiv.id = "county-map";
  outerDiv.appendChild(newMapDiv);
}

// export default interpolateColors;
// export default getWindowHeight;
// export default calcMinMax;
// export default removeMap;
// module.exports.interpolateColors = interpolateColors;
// module.exports.hexToRgb = hexToRgb;
// module.exports.getWindowHeight = getWindowHeight;
// module.exports.calcMinMax = calcMinMax;
// module.exports.removeMap = removeMap;