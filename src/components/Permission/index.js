import React, { useEffect, useState } from "react";

function HasPermission(roles)  {
    const [permissions, setPermissions] = useState([]);
    const [token, setToken] = useState(sessionStorage.getItem('token'))
  
    useEffect(() => {
        async function loadRoles() {
             
          if (token) {

            const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString()).role;
          
            const findRole = payload.some((r) =>roles.includes(r))

            setPermissions(findRole);
         }else{

          setPermissions(false);

        }}
    
        loadRoles(); 
      }, []);

  return permissions 
};

export default HasPermission;