import React, {useEffect} from 'react'
import { apiGetUsers } from 'api'

const ManageUser = () => {
  const fetchUsers = async (params) => {
      const response = await apiGetUsers(params)
      console.log(response)
  }

  useEffect(() => {
      fetchUsers()
  }, [])
  return (
      <div>
          <h1 className='h-[75px] flex justify-between items-center text-xl font-bold px-4 border-item'>
              <span>Manage Users</span>
          </h1>
          <div>
              <table>
                  <thead>
                      <th>#</th>
                      <th>#</th>
                  </thead>
              </table>
          </div>
      </div>
  )
}

export default ManageUser