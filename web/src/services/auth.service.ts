import api from "./api";

import type { User } from "../types/user";


interface LoginResponse {

 token:string;

 user:User;

}


export const loginUser = async (

 email:string,

 password:string

) => {


 const response =
   await api.post<LoginResponse>(
     "/auth/login",
     {
       email,
       password,
     }
   );


 return response.data;

};