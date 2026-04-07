import { useAxiosPrivate } from '@/hooks/useAxiosPrivate';
import useAuthStore from '@/store/useAuthstore';
import { useEffect, useState } from 'react'
import type { Brand } from '@/lib/type';
import type z from 'zod';
import { brandSchema } from '@/lib/validation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Edit, Loader2, Plus, RefreshCw, Trash } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import ImageUpload from '@/components/ui/ImageUpload';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { toast } from 'sonner';

function Brands() {

  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const axiosPrivate = useAxiosPrivate();

  const { checkIsAdmin } = useAuthStore();
  const isAdmin = checkIsAdmin();

  const fetchBrands = async () => {
    try {
      const response = await axiosPrivate.get("/brands")
      setBrands(response.data)
    } catch (error) {
      console.log("Failed to load brands", error);
      toast("Failed to load brands")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBrands()
  }, [])

  type FormData = z.infer<typeof brandSchema>

  const formAdd = useForm<FormData>({
    resolver: zodResolver(brandSchema),
    defaultValues: {
      name: "",
      image: ""
    }
  })
  const formEdit = useForm<FormData>({
    resolver: zodResolver(brandSchema),
    defaultValues: {
      name: "",
      image: ""
    }
  })

  const handleAddBrand = async (data: FormData) => {
    setFormLoading(true)
    try {
      const response = await axiosPrivate.post("/brands", data)
      console.log(response);
      toast("Brand created successfully")
      formAdd.reset()
      setIsAddModalOpen(false)
      fetchBrands()
    } catch (error) {
      console.log("Failed to create brand", error);
      toast("Failed to create brand")
    } finally {
      setFormLoading(false)
    }
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    try {
      const response = await axiosPrivate.get("/brands")
      setBrands(response.data)
      toast("Brands refreshed successfully")
    } catch (error) {
      console.log("Failed to refresh brands", error);
      toast("Failed to refresh brands")
    } finally {
      setRefreshing(false)
    }
  }

  const handleDeleteBrand = async () => {
    if (!selectedBrand) return
    try {
      await axiosPrivate.delete(`/brands/${selectedBrand._id}`)
      toast("Brand deleted successfully")
      setIsDeleteModalOpen(false)
      fetchBrands()
    } catch (error) {
      console.log("Failed to delete brand", error);
      toast("Failed to delete brand")
    }
  }

  const handleUpdateBrand = async (data: FormData) => {
    if (!selectedBrand) return
    setFormLoading(true)
    try {
      await axiosPrivate.put(`/brands/${selectedBrand._id}`, data)
      toast("Brand updated successfully")
      setIsEditModalOpen(false)
      fetchBrands()
    } catch (error) {
      console.log("Failed to update brand", error);
      toast("Failed to update brand")
    } finally {
      setFormLoading(false)
    }
  }

  const handleDelete = async (brand: Brand) => {
    setSelectedBrand(brand)
    setIsDeleteModalOpen(true)
  }

  const handleEdit = async (brand: Brand) => {
    setSelectedBrand(brand)
    formEdit.reset({
      name: brand.name,
      image: brand.image || ""
    })
    setIsEditModalOpen(true)
  }


  return (
    <div className="p-3 sm:p-5 space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0">
        <h1 className="text-2xl sm:text-3xl font-bold">Brands</h1>
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <Button
            variant="outline"
            onClick={handleRefresh}
            disabled={refreshing}
            size="sm"
          >
            <RefreshCw
              className={`mr-1 sm:mr-2 h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
            />
            <span className="hidden xs:inline">{refreshing ? "Refreshing..." : "Refresh"}</span>
          </Button>
          {isAdmin && (
            <Button onClick={() => setIsAddModalOpen(true)} size="sm">
              <Plus className="mr-1 sm:mr-2 h-4 w-4" /> <span className="hidden xs:inline">Add Brand</span><span className="xs:hidden">Add</span>
            </Button>
          )}
        </div>
      </div>
      {loading ? (
        <div className="flex justify-center items-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : (
        <div className="rounded-md border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">Image</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Created At</TableHead>
                {isAdmin && (
                  <TableHead className="text-right">Actions</TableHead>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {brands.map((brand) => (
                <TableRow key={brand._id}>
                  <TableCell>
                    {brand.image ? (
                      <div className="h-12 w-12 rounded overflow-hidden bg-muted">
                        <img
                          src={brand.image}
                          alt={brand.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="h-12 w-12 rounded bg-muted flex items-center justify-center text-muted-foreground">
                        No Image
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="font-medium">{brand.name}</TableCell>
                  <TableCell>
                    {new Date(brand.createdAt).toLocaleDateString()}
                  </TableCell>
                  {isAdmin && (
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(brand)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(brand)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  )}
                </TableRow>
              ))}
              {brands.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={isAdmin ? 4 : 3}
                    className="text-center py-10 text-muted-foreground"
                  >
                    No brands found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}
      {/* Add brands */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Brand</DialogTitle>
            <DialogDescription>Create a new product brand</DialogDescription>
          </DialogHeader>
          <Form {...formAdd}>
            <form
              onSubmit={formAdd.handleSubmit(handleAddBrand)}
              className="space-y-4"
            >
              <FormField
                control={formAdd.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input {...field} disabled={formLoading} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={formAdd.control}
                name="image"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Brand Image (Optional)</FormLabel>
                    <FormControl>
                      <ImageUpload
                        value={field.value ?? ""}
                        onChange={field.onChange}
                        disabled={formLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsAddModalOpen(false)}
                  disabled={formLoading}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={formLoading}>
                  {formLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    "Create Brand"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      {/* Edit Brand Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Brand</DialogTitle>
            <DialogDescription>Update brand information</DialogDescription>
          </DialogHeader>
          <Form {...formEdit}>
            <form
              onSubmit={formEdit.handleSubmit(handleUpdateBrand)}
              className="space-y-4"
            >
              <FormField
                control={formEdit.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input {...field} disabled={formLoading} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={formEdit.control}
                name="image"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Brand Image (Optional)</FormLabel>
                    <FormControl>
                      <ImageUpload
                        value={field.value ?? ""}
                        onChange={field.onChange}
                        disabled={formLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsEditModalOpen(false)}
                  disabled={formLoading}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={formLoading}>
                  {formLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    "Update Brand"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Delete Brand Confirmation */}
      <AlertDialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              brand <span className="font-semibold">{selectedBrand?.name}</span>
              .
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteBrand}
              className="bg-destructive hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

export default Brands