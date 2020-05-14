//Generators Information
let generatorName = []
let generatorPower = []
let generatorIndis = []
let generatorDis = []
let genPowernNames
let sumOfPower

//generators Firm information
let genaratorsIndividualPower = []
let initialFirmPower = []
let finalFirmPower = []
let toltalSystemPower
let residue

// constraints
let confidence
let demand 

function workingFile(conf, dem, file){

  data = [...file[0].data]
  confidence = conf/100
  demand = dem
  
  getNumbers(data)
  toltalSystemPower = preliminarPower(JSON.parse(JSON.stringify(genPowernNames)))
  if(toltalSystemPower > demand && confidence < 0.98){
    confidence = 0.98
    workingFile(confidence ,demand, file)
  }
  residue = calcIndividualPower()
  calcInitialFirmPower()
  calcFinalFirmPower()
  console.log(toltalSystemPower)
  console.log(residue)
  console.log(initialFirmPower)
  console.log(finalFirmPower)
  let finalData = [['Names', 'Power', 'unavailability', 'Preliminar Power', 'Initial Firm Power', 'Final Firm Power']]
  for(let y in initialFirmPower){
    let arrH= []
    arrH.push(generatorName[y], generatorPower[y],generatorIndis[y], genaratorsIndividualPower[y], initialFirmPower[y], finalFirmPower[y])
    finalData.push(arrH)
  }
  finalData.push(['Demand', demand],['Confidence', confidence],['Total system Power', toltalSystemPower], ['Residue', residue], ['Firm Power Residue', (demand-finalFirmPower.reduce((acc,curr) => acc +curr))])

  return finalData

  
  
}
function calcFinalFirmPower(){
  if(demand > toltalSystemPower){
    let prop = demand/toltalSystemPower
    for(let x in initialFirmPower){
      if(initialFirmPower[x] < 0){
        finalFirmPower.push(0)
      }
      else if(initialFirmPower[x]*prop > genPowernNames[x][1]){
        finalFirmPower.push(genPowernNames[x][1])
      }
      else{
      finalFirmPower.push(initialFirmPower[x]*prop)
      }
    }
    let FinalResidue = finalFirmPower.reduce((acc,curr)=> acc+curr) - demand
    if(FinalResidue < 0){
      FinalResidue *= -1
      let res = 0
      for(let x in finalFirmPower){
        if(finalFirmPower[x] != 0){
          res = genPowernNames - finalFirmPower[x]
          if(res > FinalResidue){
            finalFirmPower[x] += FinalResidue
            FinalResidue = 0
          }
          else{
          finalFirmPower[x] = genPowernNames[x][1]
          FinalResidue -= res
          }
          if(FinalResidue = 0){
            break
          }
          
        }
      }
    }
  }
}

function calcInitialFirmPower(){
  let mediumPower = []
  let difference = []
  let residueProp = []

  for(let x = 0; x<genPowernNames.length; x++){
    mediumPower.push(genPowernNames[x][1] * (1- genPowernNames[x][2]))
    difference.push(genPowernNames[x][1] - mediumPower[x])
  }
  let differenceSum = difference.reduce((acc, curr)=>acc+curr)
  for(let x in difference){
    residueProp.push((difference[x]/differenceSum)*residue)
 
    initialFirmPower.push(genaratorsIndividualPower[x] - residueProp[x])
    
  }

}

function calcIndividualPower(){

  for(let x = 0; x< genPowernNames.length; x++){
    let gensCopy = JSON.parse(JSON.stringify(genPowernNames))
    gensCopy.splice(x,1)


    genaratorsIndividualPower.push(toltalSystemPower - preliminarPower(gensCopy)) 
  }
  return genaratorsIndividualPower.reduce((acc, curr)=> acc+curr) - toltalSystemPower
}

function preliminarPower(generatorsArr){
  let arr = Array.from({ length: sumOfPower+1 }).fill(0)
  arr[0] = 1

  generatorsArr.unshift(['MAKEUPGEN', 0, 1, arr])
  for(let gen = 1; gen < generatorsArr.length; gen++){
    let calcProbArr = []
    let power = generatorsArr[gen][1]
    let indis = generatorsArr[gen][2]
    let probArr = generatorsArr[gen-1][3]
    let counter = 0
    for(let x = 0; x<= sumOfPower; x++){
      
      if(x-power < 0){
       
        calcProbArr.push( (((1-indis) * 0) + (indis * probArr[x])) )
      }
      else{
        
        calcProbArr.push( (((1-indis) * probArr[counter]) + (indis * probArr[x])) )
        counter++
      }
    }
   
    generatorsArr[gen].push(calcProbArr)
  }

  let workingProb = [...generatorsArr[generatorsArr.length - 1][3]]

  let findPowerProb = workingProb.length -1
  
  let probSum = 0
  for(findPowerProb = workingProb.length -1; findPowerProb>= 0; findPowerProb--){
    probSum += workingProb[findPowerProb]
    if(probSum >= confidence){
      break
    }
  }
  let probSum2 = probSum - workingProb[findPowerProb]
  let findPowerProb2 = findPowerProb+1
  for(findPowerProb2; findPowerProb2<workingProb.length; findPowerProb2++){
    if(probSum2 - workingProb[findPowerProb2] < probSum2){
      break
    }
  }

  return calcPower(findPowerProb2, findPowerProb, probSum2, probSum, confidence)

}

function calcPower(c1,c2, p1, p2, conf){
  let qx = c1 - (( (c1-c2)/(p1-p2) ) * (p1 - conf) )
  return qx
}

function getNumbers(data){
  for(let x = 1; x< data.length; x++){
    generatorName.push(data[x][1])
    generatorPower.push(data[x][2])
    generatorIndis.push(data[x][4])
  }
  for(let x of generatorIndis){
    generatorDis.push(1-x)
  }

  sumOfPower = generatorPower.reduce((acc, curr)=>{
    return acc + curr
  })
  sumOfPower *= 1.01694915254
  sumOfPower = Math.ceil(sumOfPower)
  genPowernNames = zip(generatorName, generatorPower, generatorIndis)



}

function zip(arr1, arr2, arr3){
  return arr1.map((k,i)=>{
    return [k, arr2[i], arr3[i]]
  })
   
}


module.exports = workingFile