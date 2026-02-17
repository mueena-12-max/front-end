import {create} from "zustand"
import {devtools,persist} from "zustand/middleware"

const authStore = (set)=>({
    login:false,
    logout:true,
    token:null,

    loginFunc: (data)=>{
        set({
            token:data,
        login:true,
        logout:false
    })
    },
        

    logoutFunc: ()=>{
        set({
             token:null,
            login:false,
            logout:true
        })
       
    }
});


const useAuthStore = create(
    devtools(
        persist(authStore,{
            name:"auth",
        })
    )
);
export default useAuthStore;