const express = require('express')
const { printFetch } = require('./scb.js')
var cors = require('cors')

// const kommuner = require('./swedish_counties.geo.json')

const app = express()
app.use(cors())
const port = 5000;

app.use(express.static('public'))

// app.get('/', (req, res) => res.sendFile('./public/index.html'))

app.get('/salary', async (req, res) => {
  const data = await printFetch('salary');
  res.send(data);
})

app.get('/population', async (req, res) => {
  const data = await printFetch('population');
  res.send(data);
})

// app.get('/api/counties', async (req, res) => {
//   // const data = await printFetch();
//   res.send(kommuner);
// })

app.listen(port, () => console.log(`Example app listening on port ${port}!`))