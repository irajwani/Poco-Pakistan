const removeFalsyValuesFrom = (object) => {
    const newObject = {};
    Object.keys(object).forEach((property) => {
      if (object[property]) {newObject[property] = object[property]}
    })
    return Object.keys(newObject);
  }

const splitArrayIntoArraysOfSuccessiveElements = (array) => {
  //array.forEach( (element, index) =>                     
    //index % 2 != 0 ? second.push(element) : first.push(element) 
  //)
  
  var first = array.filter( (element, index) => index % 2 == 0 ),
  second = array.filter( (element, index) => index % 2 != 0 );
  return {first, second}

} 

export {removeFalsyValuesFrom, splitArrayIntoArraysOfSuccessiveElements}  