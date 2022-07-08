//* logic for the graph computation & segment time analysis */

let image = document.getElementById('img')
let resetBtn = document.getElementById('reset')
let canvas = document.getElementById('pwr-graph')
let riderWeight = document.getElementById('weight')
let bikeWeight = document.getElementById('bike-weight')

let sysWeight = riderWeight + bikeWeight
let xValues = []
let yValues = []
let pwrChart
//create 'onclick' for calculate power curve button
new Chart('pwr-graph', {
  type: 'line'
})

const calcPowerChart = () => {
  image.style.opacity = '0'

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
  new Chart('pwr-graph', {
    type: 'line'
  })
}

//Maths!

let aeroValues = [0.388, 0.42, 0.3] //resistance from: hoods, tops, drops

//find force from

let frontalArea = 0.388 // meters^2
let airDensity = 1.2225 //kg/m^3

// let force =
// let force =
// (aeroValues[1] / 2) * airDensity * frontalArea * (velocity * velocity)
// let rollingRes = 0.005
// let totalRes = mass * ((8.1 * 0.01) + rollingRes)
let meterDis = 3.12 * 1609.34
// let velocity = meterDis / timeEstimate.value
// let powerNeeded = (force * velocity)

//NEED ROLLING RESISTANCE WITH RESPECT FOR AIR DENSITY AND FRONTAL AREA AND AERO

let calcWattsBtn = document.getElementById('est-watts')
let timeEstimate = document.getElementById('time-guess')

const calcWatts = () => {
  let sysWeight = 158 * 0.453592
  let rollingRes = 0.005
  let A2 = 0.5 * 0.388 * airDensity //aeroValues

  let meterDis = 3.12 * 1609.34
  let totalWeight = 9.8 * sysWeight
  let gradeV = 8.1 * 0.01
  let totalRes = totalWeight * (gradeV + rollingRes)

  let velocity = meterDis / 1320
  let powerNeeded =
    (velocity * totalRes + velocity * velocity * velocity * A2) / 0.95

  console.log(powerNeeded)
}

// powerv = (v * tres + v * tv * tv * A2Eff) / transv
// tres = twt * (gradev + rollingRes)
// let transv = 0.95

// let mass = 8.1 * sysWeight * 0.453592

calcWatts()

resetBtn.addEventListener('click', resetZones)
powerButton.addEventListener('click', calcPowerChart)
calcWattsBtn.addEventListener('click', calcWatts)
