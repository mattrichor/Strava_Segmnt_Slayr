//* logic for the graph computation & segment time analysis */

let image = document.getElementById('img')
let resetBtn = document.getElementById('reset')
let canvas = document.getElementById('pwr-graph')
let riderWeight = document.getElementById('weight')
let bikeWeight = document.getElementById('bike-weight')

let rollingRes = 0.005

let aeroValues = [0.388, 0.42, 0.3]
let airDensity = 1.2225
let A2 = 0.5 * aeroValues[0] * airDensity

let xValues = []
let yValues = []
let pwrChart

new Chart('pwr-graph', {
  type: 'line'
})

const calcPowerChart = () => {
  image.style.opacity = '0'
  image.style.height = '1px'

  let yValues = [{ x: 5, y: pwr5Sec.value }]
  let i = 0
  const interp5To60 = (num) => {
    let interp = d3.interpolate(
      { x: 5, y: pwr5Sec.value },
      { x: 60, y: pwr1Min.value }
    )
    return interp(num)
  }

  const interp60To300 = (num) => {
    let interp = d3.interpolate(
      { x: 60, y: pwr1Min.value },
      { x: 300, y: pwr5Min.value }
    )
    return interp(num)
  }

  const interp3To12 = (num) => {
    let interp = d3.interpolate(
      { x: 300, y: pwr5Min.value },
      { x: 1200, y: pwr20Min.value }
    )
    return interp(num)
  }

  // function for interpolating 5 secs to 1 min
  for (i = 0.083; i < 1; i += 0.083) {
    yValues.push(interp5To60(i))
  }
  yValues.push({ x: 60, y: pwr1Min.value })

  for (let j = 0.021; j < 1; j += 0.021) {
    yValues.push(interp60To300(j))
  }
  yValues.push({ x: 300, y: pwr5Min.value })

  for (let k = 0.00564; k < 1; k += 0.00564) {
    yValues.push(interp3To12(k))
  }
  yValues.push({ x: 1200, y: pwr20Min.value })
  for (let n = 0; n < yValues.length; n++) {
    yValues[n].y = parseInt(yValues[n].y)
    yValues[n].x = parseInt(yValues[n].x)
    xValues.push(yValues[n].x)
  }

  let pwrChart = new Chart('pwr-graph', {
    type: 'line',
    data: {
      labels: xValues,
      datasets: [
        {
          data: yValues,
          fill: true,
          backgroundColor: 'rgb(81, 123, 159)',
          borderColor: 'black',
          pointRadius: 0,
          display: true
        }
      ],
      options: {
        scales: {
          labels: false
        }
      }
    }
  })

  console.log(yValues)
}

// reset button!

const resetZones = () => {
  yValues = []
  xValues = []
  i = 0
  pwr5Sec.value = ''
  pwr1Min.value = ''
  pwr5Min.value = ''
  pwr20Min.value = ''
  powerButton.addEventListener('click', calcPowerChart)
  image.style.opacity = '1'
  image.style.display = 'block'
  image.style.height = '290px'
  new Chart('pwr-graph', {
    type: 'line'
  })
  pwrDisplay.innerHTML = `Power Needed:`
  slayrName.innerHTML = 'Name:'
}

//Maths!

let frontalArea = 0.388 // meters^2

let slayrMenu = document.getElementById('slayr-menu')
let timeEstimate = document.getElementById('time-guess')
let calcWattsBtn = document.getElementById('est-watts')
let pwrDisplay = document.getElementById('pwr-needed')
let slayrName = document.getElementById('slayr-name')

slayrMenu.style.opacity = 0

const showWattsMenu = (i) => {
  slayrMenu.style.opacity = 1
  slayrName.innerHTML += ` <br>${segmentArray[i].segName}`
  const calculateWatts = () => {
    let powerNeeded = 0
    let sysWeight =
      (parseInt(bikeWeight.value) + parseInt(riderWeight.value)) * 0.453592
    console.log(segmentArray[i].segDistance)
    console.log(segmentArray[i])
    let meterDis = segmentArray[i].segDistance * 1609.34
    let totalWeight = 9.8 * sysWeight
    let gradeV = segmentArray[i].segGrade * 0.01
    let totalRes = totalWeight * (gradeV + rollingRes)
    let velocity = meterDis / timeEstimate.value
    powerNeeded =
      (velocity * totalRes + velocity * velocity * velocity * A2) / 0.95
    pwrDisplay.innerHTML += ` <br>${powerNeeded.toFixed(0)} Watts`
  }
  calcWattsBtn.addEventListener('click', calculateWatts)
}

resetBtn.addEventListener('click', resetZones)
powerButton.addEventListener('click', calcPowerChart)
