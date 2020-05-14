
const $form = document.getElementById('uploadFrom')
const $file = document.getElementById('fileUp')
const $confidence = document.getElementById('confidence')
const $demand = document.getElementById('demand')

$form.addEventListener('submit', (event)=>{
  event.preventDefault()
  const formData = new FormData();
  formData.append('confidence',  $confidence.value)
  formData.append('demand', $demand.value)
  formData.append('fileUp', $file.files[0])

  data = {
    method: 'post',
    body: formData
  }
  
  postFile(data)


  location.reload()
  return false
})
console.log('clientJS')

async function postFile(data){
  const response = await fetch('/fileUpload', data)
  const json = await response.json()

  
  creteCSV(json.what)

  return response
}

function creteCSV(data){
  let arrCSV = []
  for(let x in data){
    arrCSV.push(data[x].join(','))
  }
 
  download(arrCSV.join('\n'))
}

function download(data){
  const blob = new Blob([data], { type: 'text/csv' })
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.setAttribute('hidden', '')
  a.setAttribute('href', url)
  a.setAttribute('download', 'download.csv')
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)

}