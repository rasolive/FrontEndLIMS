

const token = sessionStorage.getItem("token")

console.log("55", token)
function header() {
  header = {
    headers: {
      'authorization': `${token}` 
    }}
  return(header)
  }

