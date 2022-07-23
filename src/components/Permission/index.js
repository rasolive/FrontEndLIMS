import React, { useEffect, useState } from "react";
import { BackendLIMSAxios } from "../../utils/axiosInstances";



function HasPermission(roles)  {
    const [permissions, setPermissions] = useState([]);
    const [token, setToken] = useState(sessionStorage.getItem('token'))
    const [header, setHeader] = useState({headers: {'authorization': `${token}`}});

    useEffect(() => {
        async function loadRoles() {
             
          const response = await BackendLIMSAxios.get("users/roles", header);
          console.log('roles', response.data)          
          const findRole = response.data.some((r) =>roles?.includes(r))
          setPermissions(findRole);
        }
    
        loadRoles(); 
      }, []);

  return permissions 
};

export default HasPermission;