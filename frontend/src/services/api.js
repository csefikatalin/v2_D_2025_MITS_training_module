import axios from "axios";

//Létrehozok egy saját axios példányt, a továbbiakban ezt használom az api hívásoknál, így az alapértelmezett header és végpont információkat tartalmazza.

export  const myAxios = axios.create({
  baseURL: "http://localhost:5000/api/v1",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

  /* minden kérésnél a header-hez hozzá kell tenni a tokent.  */
 export  function getAuthHeaders() {
    const token = localStorage.getItem("token");
    return {
      "X-API-TOKEN": token,
      "Content-Type": "application/json",
    };
  }