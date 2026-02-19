import React, { useEffect, useState } from 'react'
import type { User } from '@/lib/type';
import useAuthStore from '@/store/useAuthstore';
import { useAxiosPrivate } from '@/hooks/useAxiosPrivate';
import { Plus, RefreshCw, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

function UsersPage() {

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [perPage] = useState(20);
  const [totalPages, setTotalPages] = useState(1);

  const axiosPrivate = useAxiosPrivate();
  const { checkIsAdmin } = useAuthStore();
  const isAdmin = checkIsAdmin();


  const fetchUser = async () => {
    setLoading(true)
    try {
      const response = await axiosPrivate.get("/users")
      console.log("res", response);

    } catch (error) {
      console.error("Failed to load Users", error)
      toast.error("Failed to load Users")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUser()
  }, [])

  return (
    <div className='p-5 space-y-5'>
      {/* header */}
      <div className='flex items-center justify-between'>
        <div className=''>
          <h1 className='text-3xl font-bold text-gray-900'>Users Management</h1>
          <p className='text-gray-600 mt-0.5'>View and manage all system users</p>
        </div>
        <div className='flex items-center gap-4'>
          <div className='flex items-center gap-2'>
            <Users className='h-8 w-8 text-blue-600' />
            <span className='text-2xl font-bold text-blue-600'>{total}</span>
          </div>
          <Button
            variant="outline"
            // onClick={handleRefresh}
            disabled={refreshing}
            className="border-blue-600 text-blue-600 hover:bg-blue-50"
          >
            <RefreshCw
              className={`mr-2 h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
            />
            {refreshing ? "Refreshing..." : "Refresh"}
          </Button>
          {isAdmin && (
            <Button
              // onClick={() => setIsAddModalOpen(true)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add User
            </Button>
          )}
        </div>
      </div>
      {/* filters */}
      {/*users table  */}
      {/* add user model */}
      {/* edit user model */}
      {/*  delete user model*/}

    </div>
  )
}

export default UsersPage