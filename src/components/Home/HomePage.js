import React from 'react'
import  { Redirect } from 'react-router-dom'


function HomePage(props) {
return(
    <Redirect to='/login'  />
)}

export default HomePage;