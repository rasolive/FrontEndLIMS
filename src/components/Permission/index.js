import React, { useEffect, useState } from "react";
import { BackendLIMSAxios } from "../../utils/axiosInstances";



function HasPermission(roles)  {
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
      }, []);

  return permissions 
};

export default HasPermission;