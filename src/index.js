const path = require('path')
const express = require('express')
const upload = require('express-fileupload')
const xlsx = require('node-xlsx')
const workingFile = require('./utils/calcFirmPower')

const app = express()
const publicPath = path.join(__dirname, '../public')
const port = process.env.PORT || 3000

app.use(express.static(publicPath))
app.use(upload())


app.post('/fileUpload', (req, res)=>{
  let data
  if(req.files){
    const file = xlsx.parse(req.files.fileUp.data)
    data = workingFile(req.body.confidence, req.body.demand, file)
   
  }
  res.json({what: data})
  
  
})


app.listen(port, ()=>{
  console.log(`Server is up on port ${port}`)
})
