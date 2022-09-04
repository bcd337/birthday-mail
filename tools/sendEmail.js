const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const url = process.env.URL_SERVICE_EMAIL

async function sendEmail(email, message) {
  return fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email,
      message,
    })
  })
}

module.exports = sendEmail