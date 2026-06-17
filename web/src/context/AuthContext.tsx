import {
 createContext,
 useContext,
 useState,
} from "react";

import type { ReactNode } from "react";


import type { User } from "../types/user";

import { loginUser } from "../services/auth.service";


type AuthContextType = {

 user:User | null;

 login:
 (
 email:string,
 password:string
 )=>Promise<void>;

 logout:()=>void;

};


const AuthContext =
 createContext<AuthContextType | null>(null);



export function AuthProvider(
 {
 children
 }:
 {
 children:ReactNode
 }
){

 const [user,setUser] =
   useState<User | null>(null);



 const login = async(
   email:string,
   password:string
 )=>{


   const data =
    await loginUser(
      email,
      password
    );


   localStorage.setItem(
    "token",
    data.token
   );


   setUser(data.user);

 };



 const logout = ()=>{

   localStorage.removeItem(
    "token"
   );

   setUser(null);

 };


 return (

 <AuthContext.Provider
 value={{
   user,
   login,
   logout
 }}
 >

 {children}

 </AuthContext.Provider>

 );

}



export function useAuth(){

 const context =
  useContext(AuthContext);


 if(!context){

  throw new Error(
   "useAuth must be inside AuthProvider"
  );

 }


 return context;

}