//* logic for the graph computation & segment time analysis */

let AWFULARRAY = [
  5, 60, 115, 180, 241, 300, 361, 422, 483, 544, 605, 665, 726, 787, 848, 909,
  970, 1030, 1092, 1157, 1200
]

let yValues = []
//create 'onclick' for calculate power curve button
const calcPowerChart = () => {
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
  console.log(yValues)
  //   console.log(xyValues)
  new Chart('pwr-graph', {
    type: 'line',
    data: {
      labels: yValues,
      datasets: [
        {
          data: yValues,
          fill: true,
          backgroundColor: 'rgba(249, 234, 224,1)',
          borderColor: `rgb(41, 62, 79)`,
          pointSize: 0
        }
      ]
    }
  })
  for (let n = 0; n < yValues.length; n++) {
    yValues[n].y = parseInt(yValues[n].y)
    yValues[n].x = parseInt(yValues[n].x)
  }
  console.log(yValues)
}

powerButton.addEventListener('click', calcPowerChart)

//Maths!

// v = (eval(velocity.value) / 3.6) * (units ? 1.609 : 1.0) // converted to m/s;
// tv = v + headwindv
// let A2Eff = tv > 0.0 ? A2 : -A2 // wind in face, must reverse effect
// powerv = (v * tres + v * tv * tv * A2Eff) / transv

// if (v > 0.0) t = (16.6667 * distancev) / v // v is m/s here, t is in minutes
// else t = 0.0 // don't want any div by zero errors

// power.value = makeDecimal0(powerv)
// dragSlider.setValue(powerv / 500.0)

// const newton = (aero, hw, tr, tran, p) => {
//   /* Newton's method */

//   let vel = 20 // Initial guess
//   let MAX = 10 // maximum iterations
//   let TOL = 0.05 // tolerance
//   for (i = 1; i < MAX; i++) {
//     let tv = vel + hw
//     let aeroEff = tv > 0.0 ? aero : -aero // wind in face, must reverse effect
//     let f = vel * (aeroEff * tv * tv + tr) - tran * p // the function
//     let fp = aeroEff * (3.0 * vel + hw) * tv + tr // the derivative
//     let vNew = vel - f / fp
//     if (Math.abs(vNew - vel) < TOL) return vNew // success
//     vel = vNew
//   }
//   return 0.0 // failed to converge
// }
