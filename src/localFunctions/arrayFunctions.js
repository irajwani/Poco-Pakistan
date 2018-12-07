const removeFalsyValuesFrom = (object) => {
    const newObject = {};
    Object.keys(object).forEach((property) => {
      if (object[property]) {newObject[property] = object[property]}
    })
    return Object.keys(newObject);
  }

export {removeFalsyValuesFrom}  