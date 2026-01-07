import  {myAxios, getAuthHeaders } from "../services/api";
import { createContext,  useState } from "react";

// 1. Context létrehozása
export const MentorContext = createContext();

// 2. Provider komponens
export function MentorProvider({ children }) {
  const [mentorList, setMentorList] = useState([]);
  const [loading, setLoading] = useState(true);

  function getMentor() {
    setLoading(true);
    myAxios
      .get("/mentors/sessions", { headers: getAuthHeaders() })
      .then((response) => {
        setMentorList(response.data.sessions)
    
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => setLoading(false));
  }


function bookedSession(id){
 setLoading(true)
    myAxios.post(
      `/mentors/sessions/${id}/book`,{},
      {
        headers: getAuthHeaders(),
      }
    )
    .then((response)=>{
      console.log(response)
    })
    .catch((error)=>{console.log(error)})
    .finally(()=>{setLoading(false)});
}

  
  return (
    <MentorContext.Provider
      value={{ getMentor,mentorList, loading,bookedSession}}
    >
      {children}
    </MentorContext.Provider>
  );
}
