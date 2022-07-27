

const token = sessionStorage.getItem("token")

function header() {
  header = {
    headers: {
      'authorization': `${token}` 
    }}
  return(header)
  }

