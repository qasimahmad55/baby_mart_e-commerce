import { useEffect, useState } from 'react'
import type { User } from '@/lib/type';
import useAuthStore from '@/store/useAuthstore';
import { useAxiosPrivate } from '@/hooks/useAxiosPrivate';
import { Edit, Eye, Plus, RefreshCw, Search, Trash, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import UserSkeleton from '@/components/skeletons/UserSkeleton';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { userSchema } from '@/lib/validation';
import type z from 'zod';
import ImageUpload from '@/components/ui/ImageUpload';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Label } from '@/components/ui/label';

type FormData = z.infer<typeof userSchema>

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
  // const [page, setPage] = useState(1);
  // const [perPage] = useState(20);
  // const [totalPages, setTotalPages] = useState(1);

  const axiosPrivate = useAxiosPrivate();
  const { checkIsAdmin } = useAuthStore();
  const isAdmin = checkIsAdmin();

  const formAdd = useForm<FormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "user",
      avatar: ""
    }
  })

  const formEdit = useForm<FormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "user",
      avatar: ""
    }
  })


  const fetchUser = async () => {
    setLoading(true)
    try {
      const response = await axiosPrivate.get("/users")
      // console.log(response);

      if (response?.data) {
        setUsers(response?.data?.users)
        setTotal(response.data?.users.length)
      }
    } catch (error) {
      console.error("Failed to load Users", error)
      toast.error("Failed to load Users")
    } finally {
      setLoading(false)

    }
  }
  const handleRefresh = async () => {
    setLoading(true)
    setRefreshing(true)
    try {
      const response = await axiosPrivate.get("/users")
      // console.log(response);

      if (response?.data) {
        setUsers(response?.data?.users)
        setTotal(response.data?.users.length)
      }
    } catch (error) {
      console.error("Failed to load Users", error)
      toast.error("Failed to load Users")
    } finally {
      setRefreshing(false)
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUser()
  }, [])

  const filteredUsers = users.filter((user) => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) || user.email.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesRole = roleFilter === "all" || user.role === roleFilter

    return matchesSearch && matchesRole
  })

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-red-100 text-red-800";
      case "deliveryman":
        return "bg-blue-100 text-blue-800";
      case "user":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  }

  const handleAddUser = async (data: FormData) => {
    setFormLoading(true)
    try {
      await axiosPrivate.post("/users", data)
      toast.success("User created successfully!")
      formAdd.reset()
      setIsAddModalOpen(false)
      fetchUser()
    } catch (error) {
      console.log("Failed to create user", error);
      toast.error("Failed to create user")

    } finally {
      setFormLoading(false)
    }
  }

  const handleView = async (user: User) => {
    setSelectedUser(user)
    setIsViewModalOpen(true)
  }
  const handleDeleteUser = async () => {
    if (!selectedUser) return
    try {
      await axiosPrivate.delete(`/users/${selectedUser._id}`)
      toast("User deleted successfully")
      setIsDeleteModalOpen(false)
      fetchUser()
    } catch (error) {
      console.log("Failed to delete user");
      toast("Failed to delete user")
    } finally {
      setIsDeleteModalOpen(false)
    }
  }
  const handleEdit = async (user: User) => {
    setSelectedUser(user)
    formEdit.reset({
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
    })
    setIsEditModalOpen(true)
  }

  const handleDeletePopup = async (user: User) => {
    setSelectedUser(user)
    setIsDeleteModalOpen(true)
  }

  const handleUpdateUser = async (data: FormData) => {
    if (!selectedUser) return
    setFormLoading(true)
    try {
      await axiosPrivate.put(`/users/${selectedUser._id}`, data)
      toast("User updated successfully")
      setIsEditModalOpen(false)
      fetchUser()
    } catch (error) {
      console.log("Failed to update user data", error);
      toast("Failed to update user")
    } finally {
      setFormLoading(false)
    }
  }

  if (loading) {
    return <UserSkeleton isAdmin={isAdmin} />
  }

  return (
    <div className='p-3 sm:p-5 space-y-4 sm:space-y-5'>
      {/* header */}
      <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0'>
        <div className=''>
          <h1 className='text-2xl sm:text-3xl font-bold text-gray-900'>Users Management</h1>
          <p className='text-gray-600 mt-0.5 text-sm sm:text-base'>View and manage all system users</p>
        </div>
        <div className='flex flex-wrap items-center gap-2 sm:gap-4 w-full sm:w-auto'>
          <div className='flex items-center gap-2'>
            <Users className='h-6 w-6 sm:h-8 sm:w-8 text-blue-600' />
            <span className='text-xl sm:text-2xl font-bold text-blue-600'>{total}</span>
          </div>
          <Button
            variant="outline"
            onClick={handleRefresh}
            disabled={refreshing}
            className="border-blue-600 text-blue-600 hover:bg-blue-50"
            size="sm"
          >
            <RefreshCw
              className={`mr-1 sm:mr-2 h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
            />
            <span className="hidden xs:inline">{refreshing ? "Refreshing..." : "Refresh"}</span>
          </Button>
          {isAdmin && (
            <Button
              onClick={() => setIsAddModalOpen(true)}
              className="bg-blue-600 hover:bg-blue-700"
              size="sm"
            >
              <Plus className="mr-1 sm:mr-2 h-4 w-4" />
              <span className="hidden xs:inline">Add User</span><span className="xs:hidden">Add</span>
            </Button>
          )}
        </div>
      </div>
      {/* filters */}
      <div>
        <div className='flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4'>
          <div className='relative flex-1 sm:flex-none'>
            <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500' />
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder='Search users...'
              className='pl-9 w-full sm:w-64'
            />
          </div>
          <Select
            value={roleFilter}
            onValueChange={setRoleFilter}
          >
            <SelectTrigger className='w-full sm:w-48'>
              <SelectValue placeholder="Filter by value" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='all'>All Roles</SelectItem>
              <SelectItem value='admin'>Admin</SelectItem>
              <SelectItem value='user'>User</SelectItem>
              <SelectItem value='deliveryman'>Delivery Person</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      {/*users table  */}
      <div className='bg-white rounded-lg shadow-sm border overflow-hidden overflow-x-auto'>
        <Table>
          <TableHeader>
            <TableRow className='bg-gray-50'>
              <TableHead className="font-semibold">Avatar</TableHead>
              <TableHead className="font-semibold">Name</TableHead>
              <TableHead className="font-semibold">Email</TableHead>
              <TableHead className="font-semibold">Role</TableHead>
              <TableHead className="font-semibold">Created At</TableHead>
              <TableHead className="font-semibold">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers?.length > 0 ? (
              filteredUsers?.map((user) => (
                <TableRow key={user?._id}>
                  <TableCell>
                    <div
                      className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold shadow-sm overflow-hidden"
                    >
                      {user.avatar ? (
                        <img src={user.avatar} alt={user.name}
                          className="h-full w-full object-cover"
                        />
                      ) :
                        (
                          <span className='text-lg'>
                            {user.name.charAt(0).toUpperCase()}
                          </span>
                        )
                      }
                    </div>
                  </TableCell>
                  <TableCell>
                    {user.name}
                  </TableCell>
                  <TableCell>
                    {user.email}
                  </TableCell>
                  <TableCell>
                    <Badge className={cn("capitalize hover:cursor-pointer", getRoleColor(user.role))}>
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(user.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <div className='flex items-center gap-2'>
                      <Button
                        variant="ghost"
                        size="icon"
                        title="View user details"
                        onClick={() => handleView(user)}
                      >
                        <Eye className='h-4 w-4' />
                      </Button>
                      {isAdmin &&
                        (
                          <>
                            <Button
                              variant="ghost"
                              size="icon"
                              title='Edit user'
                              onClick={() => handleEdit(user)}
                            >
                              <Edit className='h-4 w-4' />
                            </Button>

                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-red-600 hover:text-red-700"
                              title='Delete user'
                              onClick={() => handleDeletePopup(user)}
                            >
                              <Trash className='h-4 w-4' />
                            </Button>

                          </>
                        )
                      }
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className='text-center py-12'>
                  <div className='flex flex-col items-center gap-4'>
                    <Users className='h-12 w-12 text-gray-400' />
                    <div>
                      <p className='text-lg font-medium text-gray-900'>No Users Found</p>
                      <p className="text-sm text-gray-500">
                        {searchTerm || roleFilter !== "all"
                          ? "Try adjusting your search or filters"
                          : "Users will appear here when they register"}
                      </p>
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {/* add user model */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Add User
            </DialogTitle>
            <DialogDescription>
              Create a new user account
            </DialogDescription>
          </DialogHeader>
          <Form {...formAdd}>
            <form onSubmit={formAdd.handleSubmit(handleAddUser)}
              className='space-y-6 mt-4'
            >
              <FormField
                control={formAdd.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 font-medium">
                      Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={formLoading}
                        className="border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                      />
                    </FormControl>
                    <FormMessage className="text-red-500 text-xs" />
                  </FormItem>
                )}
              />
              <FormField
                control={formAdd.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 font-medium">
                      Email
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        {...field}
                        disabled={formLoading}
                        className="border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                      />
                    </FormControl>
                    <FormMessage className="text-red-500 text-xs" />
                  </FormItem>
                )}
              />
              <FormField
                control={formAdd.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 font-medium">
                      Password
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        {...field}
                        disabled={formLoading}
                        className="border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                      />
                    </FormControl>
                    <FormMessage className="text-red-500 text-xs" />
                  </FormItem>
                )}
              />
              <FormField
                control={formAdd.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 font-medium">
                      Role
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={formLoading}
                    >
                      <FormControl>
                        <SelectTrigger className="border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 w-full">
                          <SelectValue placeholder="Select a role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="user">User</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="deliveryman">
                          Delivery Person
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-red-500 text-xs" />
                  </FormItem>
                )}
              />
              <FormField
                control={formAdd.control}
                name="avatar"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 font-medium">
                      Avatar
                    </FormLabel>
                    <FormControl>
                      <ImageUpload
                        value={field.value ?? ""}
                        onChange={field.onChange}
                        disabled={formLoading}
                      />
                    </FormControl>
                    <FormMessage className="text-red-500 text-xs" />
                  </FormItem>
                )}
              />
              <DialogFooter className="mt-6 flex justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsAddModalOpen(false)}
                  disabled={formLoading}
                  className="border-gray-300 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={formLoading}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-md transition-colors duration-200"
                >
                  {formLoading ? (
                    <>
                      <svg
                        className="animate-spin h-5 w-5 mr-2 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v8H4z"
                        />
                      </svg>
                      Creating...
                    </>
                  ) : (
                    "Create User"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      {/* edit user model */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>Update user information</DialogDescription>
          </DialogHeader>
          <Form {...formEdit}>
            <form
              onSubmit={formEdit.handleSubmit(handleUpdateUser)}
              className="space-y-6 mt-4"
            >
              <FormField
                control={formEdit.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 font-medium">
                      Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={formLoading}
                        className="border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                      />
                    </FormControl>
                    <FormMessage className="text-red-500 text-xs" />
                  </FormItem>
                )}
              />
              <FormField
                control={formEdit.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 font-medium">
                      Email
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        {...field}
                        disabled={formLoading}
                        className="border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                      />
                    </FormControl>
                    <FormMessage className="text-red-500 text-xs" />
                  </FormItem>
                )}
              />
              <FormField
                control={formEdit.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 font-medium">
                      Password (leave empty to keep current)
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        {...field}
                        placeholder="Leave empty to keep current password"
                        disabled={formLoading}
                        className="border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                      />
                    </FormControl>
                    <FormMessage className="text-red-500 text-xs" />
                  </FormItem>
                )}
              />
              <FormField
                control={formEdit.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 font-medium">
                      Role
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={formLoading}
                    >
                      <FormControl>
                        <SelectTrigger className="border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200">
                          <SelectValue placeholder="Select a role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="user">User</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="deliveryman">
                          Delivery Person
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-red-500 text-xs" />
                  </FormItem>
                )}
              />
              <FormField
                control={formEdit.control}
                name="avatar"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 font-medium">
                      Avatar
                    </FormLabel>
                    <FormControl>
                      <ImageUpload
                        value={field.value ?? ""}
                        onChange={field.onChange}
                        disabled={formLoading}
                      />
                    </FormControl>
                    <FormMessage className="text-red-500 text-xs" />
                  </FormItem>
                )}
              />
              <DialogFooter className="mt-6 flex justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsEditModalOpen(false)}
                  disabled={formLoading}
                  className="border-gray-300 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={formLoading}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-md transition-colors duration-200"
                >
                  {formLoading ? (
                    <>
                      <svg
                        className="animate-spin h-5 w-5 mr-2 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v8H4z"
                        />
                      </svg>
                      Updating...
                    </>
                  ) : (
                    "Update User"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      {/*  delete user model*/}
      <AlertDialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete{" "}
              <span className="font-semibold">{selectedUser?.name}</span>'s
              account.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteUser}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      {/* view user modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
            <DialogDescription>
              View complete user information
            </DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="h-20 w-20 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold shadow-sm overflow-hidden">
                  {selectedUser.avatar ? (
                    <img
                      src={selectedUser.avatar}
                      alt={selectedUser.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="text-2xl">
                      {selectedUser.name.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">
                    {selectedUser.name}
                  </h3>
                  <p className="text-gray-600">{selectedUser.email}</p>
                  <Badge
                    className={cn(
                      "capitalize mt-2",
                      getRoleColor(selectedUser.role)
                    )}
                  >
                    {selectedUser.role}
                  </Badge>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <div>
                  <Label className="text-sm font-medium text-gray-600">
                    User ID
                  </Label>
                  <p className="text-lg font-semibold">{selectedUser._id}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">
                    Created At
                  </Label>
                  <p>{new Date(selectedUser.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

    </div>
  )
}

export default UsersPage 