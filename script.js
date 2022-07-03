const clientSecret = `25d5efd65d8b5cab2e461ebe98e3117b76766e8e`
let accessToken = `8a15d84d3f5dce03a5fd1e3eabf95ed314b0b117`
let starredSegmentsLink = `https://www.strava.com/api/v3/segments/starred?page=1&per_page=30&access_token=${accessToken}` //old one, only works if accessToken is hard coded & up to date
const refreshToken = `34a4515d34fcddd543ed7a03b8e572397a6386b7`
const clientId = `89151`

let segmentList = document.querySelector('.segment-list')

//functionality for user logins so I don't have to repeatedly refresh access code
const authLink = 'https://www.strava.com/oauth/token'

const getLoggedInAthleteStarredSegments = (res) => {
  let starredSegmentsLink = `https://www.strava.com/api/v3/segments/starred?page=1&per_page=30&access_token=${res.access_token}`
  searchButton.addEventListener('click', async () => {
    let userInput = inputBar.value
    const response = await axios.get(starredSegmentsLink)
    for (let i = 0; i < response.data.length; i++) {
      const segmentName = response.data[i].name
      const listItem = document.createElement('li')

      listItem.innerHTML = `${segmentName}`
      segmentList.append(listItem)
    }
  })
}

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

// const config = {
//   headers: { Authorization: `Bearer ${accessToken}` }
// }

//www.strava.com/oauth/token?client_id=89151&client_secret=25d5efd65d8b5cab2e461ebe98e3117b76766e8e&code=2aa2e231942117f3b5751b2e72b62491a3799522&grant_type=authorization_code

// const bodyParams = {
//   key: 'value'
// }

// axios.post(
//   `https://www.strava.com/api/v3/athlete/activities`,
//   bodyParams,
//   config
// )

// const authCode = `c4570843c740249df095b45d9bd1ccd457bd58e8`

const inputBar = document.getElementById('search-input')
const searchButton = document.getElementById('search')

//*** STRAVA'S JS CODE ON THE API SITE ***/
// let StravaApiV3 = 'strava_api_v3'
//   let defaultClient = StravaApiV3.ApiClient.instance

//   // Configure OAuth2 access token for authorization: strava_oauth
//   const strava_oauth = defaultClient.authentications[`${authCode}`]
//   strava_oauth.accessToken = `${accessToken}`

//   const api = new StravaApiV3.SegmentsApi()

//   const opts = {
//     page: 56, // {Integer} Page number. Defaults to 1.
//     perPage: 56 // {Integer} Number of items per page. Defaults to 30.
//   }

//   const callback = function (error, data, response) {
//     if (error) {
//       console.error(error)
//     } else {
//       console.log('API called successfully. Returned data: ' + data)
//     }
//   }
//   api.getLoggedInAthleteStarredSegments(opts, callback)
