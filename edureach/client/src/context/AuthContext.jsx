import { createContext, useContext } from 'react'
import useAuthStore from '../store/authStore'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const { user, token, isAuthenticated, login, logout } = useAuthStore()
  const role = user?.role || 'student'

  return (
    <AuthContext.Provider value={{ user, token, role, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
