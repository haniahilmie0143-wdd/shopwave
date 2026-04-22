import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'

const AdminRoute = ({ children }) => {
  const { userInfo } = useSelector((state) => state.auth)

  if (!userInfo || !userInfo.isAdmin) {
    return <Navigate to="/login" replace />
  }

  return children
}

export default AdminRoute