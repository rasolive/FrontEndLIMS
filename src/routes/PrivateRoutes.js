import React, { useEffect, useState, useContext } from "react";
import { Redirect, Route } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { BackendLIMSAxios } from "../utils/axiosInstances";


function PrivateRoutes(...rest) {
  const [permissions, setPermissions] = useState([]);
  const [token, setToken] = useState(sessionStorage.getItem('token'))
  const [header, setHeader] = useState({headers: {'authorization': `${token}`}});

  useEffect(() => {
    async function loadRoles() {
         
      if (token) {
         const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString()).role;


         const findRole = payload.some((r) =>rest[0].role?.includes(r))

        setPermissions(findRole);
     }else{

       setPermissions(false);

    }}

    loadRoles(); 
  }, [rest[0].role, token]);



  const { userLogged } = useContext(AuthContext);

  if (!userLogged()) {
    return <Redirect to="/" />;
  }

  if (!rest[0].role && userLogged()) {
   
    return <Route path={rest[0].path} exact component={rest[0].component} />;

  }

  return permissions ? <Route path={rest[0].path} exact component={rest[0].component} /> : <Redirect to="/" />;
};

export default PrivateRoutes;