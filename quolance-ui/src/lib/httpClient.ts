import Axios from 'axios'
/* eslint-disable @typescript-eslint/no-var-requires */
require('dotenv').config();
/* eslint-enable @typescript-eslint/no-var-requires */

const httpClient = Axios.create({
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  baseURL: process.env.NEXT_PUBLIC_BASE_URL!, 
  headers: {
      'X-Requested-With': 'XMLHttpRequest',
      'Content-Type': 'application/json',
      'Accept': 'application/json'
  },
  withCredentials: true,
  xsrfCookieName: 'XSRF-TOKEN',
  withXSRFToken: true,
})

export default httpClient