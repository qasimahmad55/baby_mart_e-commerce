import { useAxiosPrivate } from '@/hooks/useAxiosPrivate';
import useAuthStore from '@/store/useAuthstore';
import { useState } from 'react'
import type { Brand } from '@/lib/type';
import type z from 'zod';
import type { brandSchema } from '@/lib/validation';

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

  type FormData = z.infer<typeof brandSchema>
  
  return (
    <div>Brands</div>
  )
}

export default Brands