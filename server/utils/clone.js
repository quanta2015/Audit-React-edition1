const clone =(e)=> {
  return JSON.parse(JSON.stringify(e))
}


module.exports = {
  clone,
}