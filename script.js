const clientSecret = `25d5efd65d8b5cab2e461ebe98e3117b76766e8e`
let accessToken = `8a15d84d3f5dce03a5fd1e3eabf95ed314b0b117`
let starredSegmentsLink = `https://www.strava.com/api/v3/segments/starred?page=1&per_page=30&access_token=${accessToken}` //old one, only works if accessToken is hard coded & up to date
const refreshToken = `34a4515d34fcddd543ed7a03b8e572397a6386b7`
const clientId = `89151`

let segmentList = document.querySelector('.segment-list')

const inputBar = document.getElementById('search-input')
const getAllButton = document.getElementById('search')
const powerButton = document.getElementById('calculate-curve')
const searchButton = document.getElementById('nameSearch')
const randomButton = document.getElementById('random')
const loadAllButton = document.getElementById('load')

let pwr5Sec = document.getElementById('5sec')
let pwr1Min = document.getElementById('1min')
let pwr5Min = document.getElementById('5min')
let pwr20Min = document.getElementById('20min')

const loadProgress = document.getElementById('loadProgress')

const segmentArray = []

const timeToReadable = (time) => {
  if (time == undefined) {
    return 'No Segment Efforts'
  } else {
    let min = Math.floor(Math.abs(time))
    let sec = Math.floor(Math.abs(time) % 60)
    return (
      (min < 10 ? '0' : '') +
      `${(min / 60).toFixed(0)} min ` +
      (sec < 10 ? '0' : '') +
      `${sec} sec`
    )
  }
}

class Segment {
  constructor(segName, segDistance, segGrade, segClimbCat, segPrTime) {
    this.segName = segName
    this.segDistance = (segDistance * 0.000621371).toFixed(2)
    this.segGrade = segGrade
    this.segClimbCat = segClimbCat
    this.segPrTime = timeToReadable(segPrTime)
  }
}

const colorGrade = (seg) => {
  let gradient = document.querySelector('.gradient')
  const gradeMath = ((seg.segGrade + 4) / 19) * 100
  gradient.style.backgroundColor = `rgb(${gradeMath * 2.2}, ${
    (100 - gradeMath) * 2.2
  },0) `
  gradient.classList.remove('gradient')
}

const loadBarGrade = (width) => {
  const gradeMath = width * 2
  let barGrade = document.getElementById('loadBar')
  barGrade.style.backgroundColor = `rgb(${gradeMath + 190 - gradeMath * 2.2}, ${
    gradeMath * 1.3
  },0) `
}

const getLoggedInAthleteStarredSegments = (res) => {
  let starredSegmentsLink = `https://www.strava.com/api/v3/segments/starred?page=1&per_page=30&access_token=${res.access_token}`

  loadAllButton.addEventListener('click', async () => {
    moveLoadBar()
    const response = await axios.get(starredSegmentsLink)
    for (let i = 0; i < response.data.length; i++) {
      let segment = new Segment(
        response.data[i].name,
        response.data[i].distance,
        response.data[i].average_grade,
        response.data[i].climb_category,
        response.data[i].pr_time
      )
      segmentArray.push(segment)
    }
  })
}

let l = 0
const moveLoadBar = () => {
  if (l == 0) {
    l = 1
    let barGrade = document.getElementById('loadBar')
    let width = 0.5
    let id = setInterval(frame, 10)
    function frame() {
      if (width >= 50) {
        clearInterval(id)
        l = 0
        loadBarGrade(width)
        loadProgress.innerHTML = 'Segments Loaded!'
      } else if (width <= 10) {
        width = width + 0.1
        loadProgress.innerHTML = 'Getting Segments...'
        barGrade.style.width = width + '%'
        loadBarGrade(width)
      } else if (width <= 20 && width >= 10) {
        width = width + 0.1
        loadProgress.innerHTML = 'Still Gettin em....'
        barGrade.style.width = width + '%'
        loadBarGrade(width)
      } else if (width <= 30 && width >= 20) {
        width = width + 0.1
        loadProgress.innerHTML = '...is that really your FTP?'
        barGrade.style.width = width + '%'
        loadBarGrade(width)
      } else if (width <= 38 && width >= 30) {
        width = width + 0.1
        loadProgress.innerHTML = 'Calculating meaning of the universe...'
        barGrade.style.width = width + '%'
        loadBarGrade(width)
      } else if (width <= 50 && width >= 38) {
        width = width + 0.1
        loadProgress.innerHTML =
          'Yea, we got your segments already but we heard yall like long loading bars'
        barGrade.style.width = width + '%'
        loadBarGrade(width)
      }
    }
  }
}

const clearSegs = () => {
  segmentList.innerText = ''
}

getAllButton.addEventListener('click', () => {
  clearSegs()
  for (i = 0; i < segmentArray.length; i++) {
    const listItem = document.createElement('tr')
    listItem.innerHTML = `<td>${segmentArray[i].segName}</td>
  <td>${segmentArray[i].segDistance} mi</td>
  <td class='gradient'>${segmentArray[i].segGrade} % </td>
  <td>${segmentArray[i].segClimbCat}</td>
  <td>${segmentArray[i].segPrTime}</td>`

    segmentList.append(listItem)

    colorGrade(segmentArray[i])
  }
})

searchButton.addEventListener('click', () => {
  clearSegs()
  let userInput = inputBar.value
  for (i = 0; i < segmentArray.length; i++) {
    if (segmentArray[i].segName.includes(userInput)) {
      console.log(segmentArray[i].segName)
      const listItem = document.createElement('tr')
      listItem.innerHTML = `<td>${segmentArray[i].segName}</td>
        <td>${segmentArray[i].segDistance} mi</td>
        <td class='gradient'>${segmentArray[i].segGrade} % </td>
        <td>${segmentArray[i].segClimbCat}</td>
        <td>${segmentArray[i].segPrTime}</td>`

      segmentList.prepend(listItem)
      colorGrade(segmentArray[i])
    }
  }
})

randomButton.addEventListener('click', () => {
  clearSegs()
  let randomSegment = Math.floor(Math.random() * segmentArray.length)
  const listItem = document.createElement('tr')
  listItem.innerHTML = `<td>${segmentArray[randomSegment].segName}</td>
        <td>${segmentArray[randomSegment].segDistance} mi</td>
        <td class='gradient'>${segmentArray[randomSegment].segGrade} % </td>
        <td>${segmentArray[randomSegment].segClimbCat}</td>
        <td>${segmentArray[randomSegment].segPrTime}</td>`

  segmentList.prepend(listItem)

  colorGrade(segmentArray[randomSegment])
})

//functionality for user logins so I don't have to repeatedly refresh access code. Huge thanks to everyone online with OAuth tutorials for helping me parse this out!
const authLink = 'https://www.strava.com/oauth/token'

const reAuthorize = () => {
  fetch(authLink, {
    method: 'post',
    headers: {
      Accept: 'application/json, text/plain, */*',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`
    },

    body: JSON.stringify({
      client_id: `${clientId}`,
      client_secret: `${clientSecret}`,
      refresh_token: `${refreshToken}`,
      grant_type: `refresh_token`
    })
  })
    .then((res) => res.json())
    .then((res) => getLoggedInAthleteStarredSegments(res))
}

reAuthorize()

let sortTable = Array.from(document.querySelectorAll('.sortable'))
let table = document.getElementById('table')

console.log(sortTable)

function sortSegments(j) {
  let switchCount = 0
  let shouldSwitch = true
  let switching = true
  direction = 'ascending'

  while (switching) {
    switching = false
    let rows = table.rows

    for (i = 1; i < rows.length - 1; i++) {
      shouldSwitch = false

      let x = rows[i].getElementsByTagName('td')[j]
      let y = rows[i + 1].getElementsByTagName('td')[j]
      let intX = parseFloat(x)
      let intY = parseFloat(y)

      if (direction == 'ascending') {
        if (
          parseFloat(x.innerText.toLowerCase()) >
          parseFloat(y.innerText.toLowerCase())
        ) {
          shouldSwitch = true
          break
        }
      } else if (direction == 'descending') {
        if (
          parseFloat(x.innerText.toLowerCase()) <
          parseFloat(y.innerText.toLowerCase())
        ) {
          shouldSwitch = true
          break
        }
      }
    }
    if (shouldSwitch == true) {
      rows[i].parentNode.insertBefore(rows[i + 1], rows[i])
      switching = true
      switchCount++
    } else {
      if (switchCount == 0 && direction == 'ascending') {
        direction = 'descending'
        switching = true
      }
    }
  }
}
