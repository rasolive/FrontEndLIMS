import React, { useEffect, useState } from "react";
import { BackendLIMSAxios } from "../../utils/axiosInstances";



function PermissionComponent(...rest)  {
    const [permissions, setPermissions] = useState([]);
    const [token, setToken] = useState(sessionStorage.getItem('token'))
    const [header, setHeader] = useState({headers: {'authorization': `${token}`}});

    useEffect(() => {
        async function loadRoles() {
             
          const response = await BackendLIMSAxios.get("users/roles", header);
          console.log('roles', response.data)
          console.log('roles.rest2', rest)
          const findRole = response.data.some((r) =>rest[0].role?.includes(r))
          setPermissions(findRole);
        }
    
        loadRoles(); 
      }, [rest[0].role]);

  return <>{permissions && rest[0].children}</>;
};

export default PermissionComponent;