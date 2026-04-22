import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import axios from 'axios'
import { Link } from 'react-router-dom'
import AdminLayout from '../../components/layout/AdminLayout'

const DashboardPage = () => {
  const { userInfo } = useSelector((state) => state.auth)
  const [orders, setOrders] = useState([])
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const config = {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }

        const [ordersRes, usersRes] = await Promise.all([
          axios.get('/api/orders', config),
          axios.get('/api/users', config),
        ])

        setOrders(Array.isArray(ordersRes.data) ? ordersRes.data : [])
        setUsers(Array.isArray(usersRes.data) ? usersRes.data : [])
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const safeOrders = Array.isArray(orders) ? orders : []

  const totalRevenue = safeOrders
    .filter((o) => o?.isPaid)
    .reduce((acc, o) => acc + (o?.totalPrice || 0), 0)

  const paidOrders = safeOrders.filter((o) => o?.isPaid).length
  const unpaidOrders = safeOrders.filter((o) => !o?.isPaid).length

  return (
    <AdminLayout>

      {loading ? (
        <div className="py-20 text-center">Loading...</div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div>Total Revenue: ${totalRevenue.toFixed(0)}</div>
            <div>Total Orders: {safeOrders.length}</div>
            <div>Users: {users.length}</div>
            <div>Paid: {paidOrders} / Pending: {unpaidOrders}</div>
          </div>

          {/* TABLE FIX */}
          <div>
            {(Array.isArray(safeOrders) ? safeOrders : [])
              .slice(0, 5)
              .map((order) => (
                <div key={order?._id}>
                  {order?._id?.slice(-6)} - {order?.totalPrice}
                </div>
              ))}
          </div>
        </>
      )}

    </AdminLayout>
  )
}

export default DashboardPage