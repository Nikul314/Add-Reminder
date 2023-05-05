import React, { useContext, useEffect, useState } from 'react'
import { auth }   from '../firebase'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth'

const AuthContext = React.createContext()

export const useAuth = () => {
  return useContext(AuthContext)
}

export default function AuthProvider({ children }) {

    const [currentUser, setCurrentUser] = useState()
    const [loading, setLoading] = useState(true)

    useEffect(()=>{
      const unsubscribe = auth.onAuthStateChanged(user =>{
        setCurrentUser(user)
        setLoading(false)
      })
      return unsubscribe
  },[])

    const signin = (auth, email, password) => {
      return createUserWithEmailAndPassword(auth, email, password)
    }
    const login = (auth, email, password) => {
      return signInWithEmailAndPassword(auth, email, password)
    }
    const logout = () => {
      return auth.signOut()
    }
  
    const value = {
        currentUser,
        signin,
        login,
        logout
    }
  return (
    <AuthContext.Provider value={value}>
        {!loading && children}
    </AuthContext.Provider>
  )
}