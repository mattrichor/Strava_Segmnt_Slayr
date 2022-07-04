const clientSecret = `25d5efd65d8b5cab2e461ebe98e3117b76766e8e`
let accessToken = `8a15d84d3f5dce03a5fd1e3eabf95ed314b0b117`
let starredSegmentsLink = `https://www.strava.com/api/v3/segments/starred?page=1&per_page=30&access_token=${accessToken}` //old one, only works if accessToken is hard coded & up to date
const refreshToken = `34a4515d34fcddd543ed7a03b8e572397a6386b7`
const clientId = `89151`

let segmentList = document.querySelector('.segment-list')

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
    this.segDistance = `${(segDistance * 0.000621371).toFixed(2)} mi`
    this.segGrade = `${segGrade}%`
    this.segClimbCat = segClimbCat
    this.segPrTime = timeToReadable(segPrTime)
  }
}

const getLoggedInAthleteStarredSegments = (res) => {
  let starredSegmentsLink = `https://www.strava.com/api/v3/segments/starred?page=1&per_page=30&access_token=${res.access_token}`

  searchButton.addEventListener('click', async () => {
    let userInput = inputBar.value
    const response = await axios.get(starredSegmentsLink)
    for (let i = 0; i < response.data.length; i++) {
      let segment = new Segment(
        response.data[i].name,
        response.data[i].distance,
        response.data[i].average_grade,
        response.data[i].climb_category,
        response.data[i].pr_time
      )

      console.log(segment)
      const listItem = document.createElement('tr')
      //   console.log(response.data[i])
      listItem.innerHTML = `<th>${segment.segName}</th>
      <th>${segment.segDistance}</th>
      <th>${segment.segGrade}</th>
      <th>${segment.segClimbCat}</th>
      <th>${segment.segPrTime}</th>`
      segmentList.append(listItem)
    }
  })
}

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

const inputBar = document.getElementById('search-input')
const searchButton = document.getElementById('search')

//   {
//     segmName: response.data[i].name,
//     segDistance: response.data[i].distance,
//     segGradient: response.data[i].average_grade,
//     segClimbCat: response.data[i].climb_category,
//     segPrTime: response.data[i].pr_time
//   }
