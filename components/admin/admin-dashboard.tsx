"use client"

import { useState, useEffect } from "react"
import { useAuthRole } from "@/hooks/use-auth-role"
import { supabaseClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import PriceDisplay from "@/components/ui/price-display"
import { 
  Car, 
  Users, 
  Settings, 
  Plus, 
  Edit, 
  Trash2, 
  Search,
  AlertCircle,
  Shield,
  Calendar,
  DollarSign,
  UserX,
  UserCheck,
  MoreVertical
} from "lucide-react"
import { formatCurrency } from "@/lib/utils"

// User Edit Form Component
function UserEditForm({ user, onSave, onCancel }: {
  user: UserData
  onSave: (user: UserData) => void
  onCancel: () => void
}) {
  const [formData, setFormData] = useState({
    full_name: user.full_name,
    email: user.email,
    phone_number: user.phone_number || '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({
      ...user,
      ...formData
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Full Name
        </label>
        <Input
          value={formData.full_name}
          onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
          required
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Email
        </label>
        <Input
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Phone Number
        </label>
        <Input
          value={formData.phone_number}
          onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
          placeholder="Optional"
        />
      </div>

      <div className="flex gap-3 justify-end pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" className="bg-primary-light hover:bg-primary-dark">
          Save Changes
        </Button>
      </div>
    </form>
  )
}

interface CarData {
  id: string
  name: string
  brand: string
  category: string
  year: number
  price: number
  price_excl_vat?: number
  vat_rate?: number
  vat_amount?: number
  currency: string
  color: string
  transmission: string
  image: string
  description: string
  user_id: string
  location?: string
  created_at: string
  updated_at: string
  users?: {
    full_name: string
    email: string
  }
}

interface UserData {
  id: string
  email: string
  full_name: string
  role: string
  phone_number?: string
  avatar_url?: string
  is_suspended?: boolean
  created_at: string
  updated_at: string
}

export default function AdminDashboard() {
  const { profile, isLoading, canAccessAdmin } = useAuthRole()
  const [cars, setCars] = useState<CarData[]>([])
  const [users, setUsers] = useState<UserData[]>([])
  const [isLoadingData, setIsLoadingData] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTab, setSelectedTab] = useState("overview")
  const [editingUser, setEditingUser] = useState<UserData | null>(null)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [userToDelete, setUserToDelete] = useState<UserData | null>(null)

  useEffect(() => {
    if (!isLoading && canAccessAdmin) {
      fetchAdminData()
    }
  }, [isLoading, canAccessAdmin])

  const fetchAdminData = async () => {
    try {
      setIsLoadingData(true)

      // Fetch all cars with user info
      const { data: carsData, error: carsError } = await supabaseClient
        .from('cars')
        .select(`
          *,
          users (
            full_name,
            email
          )
        `)
        .order('created_at', { ascending: false })

      if (carsError) throw carsError

      // Fetch all users
      const { data: usersData, error: usersError } = await supabaseClient
        .from('users')
        .select('*')
        .order('created_at', { ascending: false })

      if (usersError) throw usersError

      setCars(carsData || [])
      setUsers(usersData || [])
    } catch (error) {
      console.error('Error fetching admin data:', error)
    } finally {
      setIsLoadingData(false)
    }
  }

  const deleteCar = async (carId: string) => {
    if (!window.confirm('هل أنت متأكد من حذف هذه السيارة؟ / Are you sure you want to delete this car?')) {
      return
    }

    try {
      const { error } = await supabaseClient
        .from('cars')
        .delete()
        .eq('id', carId)

      if (error) throw error

      setCars(cars.filter(car => car.id !== carId))
      alert('تم حذف السيارة بنجاح / Car deleted successfully')
    } catch (error) {
      console.error('Error deleting car:', error)
      alert('خطأ في حذف السيارة / Error deleting car')
    }
  }

  const updateUserRole = async (userId: string, newRole: string) => {
    if (!window.confirm(`هل أنت متأكد من تغيير دور المستخدم إلى ${newRole}؟ / Are you sure you want to change user role to ${newRole}?`)) {
      return
    }

    try {
      const { error } = await supabaseClient
        .from('users')
        .update({ role: newRole, updated_at: new Date().toISOString() })
        .eq('id', userId)

      if (error) throw error

      setUsers(users.map(user => 
        user.id === userId 
          ? { ...user, role: newRole, updated_at: new Date().toISOString() }
          : user
      ))
      alert('تم تحديث دور المستخدم بنجاح / User role updated successfully')
    } catch (error) {
      console.error('Error updating user role:', error)
      alert('خطأ في تحديث دور المستخدم / Error updating user role')
    }
  }

  const editUser = (user: UserData) => {
    setEditingUser(user)
    setShowEditModal(true)
  }

  const updateUser = async (updatedUser: UserData) => {
    try {
      const { error } = await supabaseClient
        .from('users')
        .update({
          full_name: updatedUser.full_name,
          email: updatedUser.email,
          phone_number: updatedUser.phone_number,
          updated_at: new Date().toISOString()
        })
        .eq('id', updatedUser.id)

      if (error) throw error

      setUsers(users.map(user => 
        user.id === updatedUser.id ? updatedUser : user
      ))
      
      // Log activity
      await logActivity('user_edited', `User ${updatedUser.full_name} profile updated`, updatedUser.id)
      
      setShowEditModal(false)
      setEditingUser(null)
      alert('تم تحديث بيانات المستخدم بنجاح / User profile updated successfully')
    } catch (error) {
      console.error('Error updating user:', error)
      alert('خطأ في تحديث بيانات المستخدم / Error updating user profile')
    }
  }

  const deleteUser = async (user: UserData) => {
    setUserToDelete(user)
    setShowDeleteConfirm(true)
  }

  const confirmDeleteUser = async () => {
    if (!userToDelete) return

    try {
      // First delete all cars belonging to this user
      const { error: carsError } = await supabaseClient
        .from('cars')
        .delete()
        .eq('user_id', userToDelete.id)

      if (carsError) throw carsError

      // Then delete the user
      const { error: userError } = await supabaseClient
        .from('users')
        .delete()
        .eq('id', userToDelete.id)

      if (userError) throw userError

      // Log activity
      await logActivity('user_deleted', `User ${userToDelete.full_name} and all their cars deleted`, userToDelete.id)

      setUsers(users.filter(user => user.id !== userToDelete.id))
      setCars(cars.filter(car => car.user_id !== userToDelete.id))
      
      setShowDeleteConfirm(false)
      setUserToDelete(null)
      alert('تم حذف المستخدم و جميع سياراته بنجاح / User and all their cars deleted successfully')
    } catch (error) {
      console.error('Error deleting user:', error)
      alert('خطأ في حذف المستخدم / Error deleting user')
    }
  }

  const toggleUserSuspension = async (user: UserData) => {
    const action = user.is_suspended ? 'reactivate' : 'suspend'
    const actionText = user.is_suspended ? 'إعادة تفعيل' : 'تعطيل'
    
    if (!window.confirm(`هل أنت متأكد من ${actionText} هذا المستخدم؟ / Are you sure you want to ${action} this user?`)) {
      return
    }

    try {
      const { error } = await supabaseClient
        .from('users')
        .update({ 
          is_suspended: !user.is_suspended,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id)

      if (error) throw error

      setUsers(users.map(u => 
        u.id === user.id 
          ? { ...u, is_suspended: !user.is_suspended, updated_at: new Date().toISOString() }
          : u
      ))

      // Log activity
      await logActivity(
        user.is_suspended ? 'user_reactivated' : 'user_suspended',
        `User ${user.full_name} ${user.is_suspended ? 'reactivated' : 'suspended'}`,
        user.id
      )

      alert(`تم ${actionText} المستخدم بنجاح / User ${action}d successfully`)
    } catch (error) {
      console.error(`Error ${action}ing user:`, error)
      alert(`خطأ في ${actionText} المستخدم / Error ${action}ing user`)
    }
  }

  const logActivity = async (action: string, description: string, targetUserId?: string) => {
    try {
      const { error } = await supabaseClient
        .from('admin_activity_log')
        .insert({
          admin_id: profile?.id,
          admin_name: profile?.full_name,
          action,
          description,
          target_user_id: targetUserId,
          created_at: new Date().toISOString()
        })

      if (error) {
        console.error('Error logging activity:', error)
      }
    } catch (error) {
      console.error('Error logging activity:', error)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-light"></div>
      </div>
    )
  }

  if (!canAccessAdmin) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            You don't have permission to access the admin dashboard.
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  const filteredCars = cars.filter(car =>
    car.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    car.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
    car.category.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const filteredUsers = users.filter(user =>
    user.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const stats = {
    totalCars: cars.length,
    totalUsers: users.length,
    adminUsers: users.filter(u => u.role === 'admin').length,
    recentCars: cars.filter(car => {
      const createdDate = new Date(car.created_at)
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      return createdDate > weekAgo
    }).length
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <Shield className="h-6 w-6 text-primary-light" />
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        </div>
        <p className="text-gray-600">
          Welcome {profile?.full_name} - Manage cars and users
        </p>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
        <TabsList className="grid grid-cols-4 w-full max-w-2xl">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <Settings size={16} />
            Overview
          </TabsTrigger>
          <TabsTrigger value="cars" className="flex items-center gap-2">
            <Car size={16} />
            Cars ({stats.totalCars})
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users size={16} />
            Users ({stats.totalUsers})
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings size={16} />
            Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Cars</CardTitle>
                <Car className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalCars}</div>
                <p className="text-xs text-muted-foreground">
                  {stats.recentCars} new this week
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalUsers}</div>
                <p className="text-xs text-muted-foreground">
                  {stats.adminUsers} admins
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Recent Cars</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.recentCars}</div>
                <p className="text-xs text-muted-foreground">Last 7 days</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg Price</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {cars.length > 0 
                    ? formatCurrency(
                        Math.round(cars.reduce((sum, car) => sum + car.price, 0) / cars.length),
                        cars[0]?.currency || 'EUR'
                      )
                    : formatCurrency(0, 'EUR')
                  }
                </div>
                <p className="text-xs text-muted-foreground">All cars</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Cars</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoadingData ? (
                  <div className="flex justify-center p-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-light"></div>
                  </div>
                ) : cars.slice(0, 5).length > 0 ? (
                  <div className="space-y-4">
                    {cars.slice(0, 5).map((car) => (
                      <div key={car.id} className="flex items-center justify-between border-b pb-2">
                        <div>
                          <p className="font-medium">{car.brand} {car.name}</p>
                          <p className="text-sm text-gray-500">{car.users?.full_name || 'Unknown'}</p>
                        </div>
                        <Badge variant="outline">{formatCurrency(car.price, car.currency)}</Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center py-4 text-gray-500">No cars found</p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>New Users</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoadingData ? (
                  <div className="flex justify-center p-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-light"></div>
                  </div>
                ) : users.slice(0, 5).length > 0 ? (
                  <div className="space-y-4">
                    {users.slice(0, 5).map((user) => (
                      <div key={user.id} className="flex items-center justify-between border-b pb-2">
                        <div>
                          <p className="font-medium">{user.full_name}</p>
                          <p className="text-sm text-gray-500">{user.email}</p>
                        </div>
                        <Badge variant={user.role === 'admin' ? 'default' : 'outline'}>
                          {user.role}
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center py-4 text-gray-500">No users found</p>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="cars">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Car Management</CardTitle>
                  <CardDescription>
                    Manage all cars listed in the system
                  </CardDescription>
                </div>
                <Button className="bg-primary-light hover:bg-primary-dark text-white">
                  <Plus size={16} className="mr-2" />
                  Add Car
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search cars..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {isLoadingData ? (
                <div className="flex justify-center p-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-light"></div>
                </div>
              ) : filteredCars.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredCars.map((car) => (
                    <Card key={car.id} className="overflow-hidden">
                      <div className="aspect-video bg-gray-200 flex items-center justify-center relative overflow-hidden">
                        {car.image ? (
                          <img 
                            src={car.image} 
                            alt={`${car.brand} ${car.name}`}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                              target.nextElementSibling?.classList.remove('hidden');
                            }}
                          />
                        ) : null}
                        <div className={`absolute inset-0 flex items-center justify-center ${car.image ? 'hidden' : ''}`}>
                          <Car className="h-8 w-8 text-gray-400" />
                        </div>
                        

                      </div>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="font-semibold">{car.brand} {car.name}</h3>
                            <p className="text-sm text-gray-500">{car.year} • {car.category} • {car.location ? (
                              <span className="text-red-500 font-medium">📍 {car.location}</span>
                            ) : (
                              <span className="text-gray-400">Location N/A</span>
                            )}</p>
                            {car.created_at && (
                              <p className="text-sm text-gray-500 mt-1">
                                <span className="text-xs">{new Date(car.created_at).toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric'
                                })}</span>
                              </p>
                            )}
                          </div>
                          <div className="text-right">
                            <PriceDisplay
                              key={`admin-price-${car.id}`}
                              price={car.price}
                              priceExclVat={car.price_excl_vat}
                              vatRate={car.vat_rate}
                              vatAmount={car.vat_amount}
                              currency={car.currency}
                              enableToggle={true}
                              carId={car.id}
                              size="sm"
                            />
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">
                          Owner: {car.users?.full_name || 'Unknown'}
                        </p>
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="flex-1"
                            onClick={() => window.location.href = `/dashboard/edit-car/${car.id}`}
                          >
                            <Edit size={14} className="mr-1" />
                            Edit
                          </Button>
                          <Button 
                            size="sm" 
                            variant="destructive" 
                            onClick={() => deleteCar(car.id)}
                            className="flex-1"
                          >
                            <Trash2 size={14} className="mr-1" />
                            Delete
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Car className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No cars found</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>
                Manage users and roles
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search users..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {isLoadingData ? (
                <div className="flex justify-center p-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-light"></div>
                </div>
              ) : filteredUsers.length > 0 ? (
                <div className="space-y-4">
                  {filteredUsers.map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                          <Users className="h-5 w-5 text-gray-400" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{user.full_name}</h3>
                          <p className="text-sm text-gray-500">{user.email}</p>
                          <p className="text-xs text-gray-400">
                            Joined: {new Date(user.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge 
                          variant={user.role === 'admin' ? 'default' : 'outline'}
                          className={user.role === 'admin' ? 'bg-primary-light' : ''}
                        >
                          {user.role}
                        </Badge>
                        {user.is_suspended && (
                          <Badge variant="destructive" className="bg-red-500">
                            Suspended
                          </Badge>
                        )}
                        
                        <div className="flex items-center gap-1">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => editUser(user)}
                            className="h-8 w-8 p-0"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => toggleUserSuspension(user)}
                            className="h-8 w-8 p-0"
                            title={user.is_suspended ? 'Reactivate User' : 'Suspend User'}
                          >
                            {user.is_suspended ? (
                              <UserCheck className="h-4 w-4 text-green-600" />
                            ) : (
                              <UserX className="h-4 w-4 text-orange-600" />
                            )}
                          </Button>
                          
                          {user.id !== profile?.id && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => deleteUser(user)}
                              className="h-8 w-8 p-0 text-red-600 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                        
                        {user.role !== 'admin' && profile?.role === 'super_admin' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateUserRole(user.id, 'admin')}
                          >
                            Make Admin
                          </Button>
                        )}
                        {user.role === 'admin' && profile?.role === 'super_admin' && user.id !== profile.id && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateUserRole(user.id, 'user')}
                          >
                            Remove Admin
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No users found</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>System Settings</CardTitle>
              <CardDescription>
                General system settings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold mb-2">System Information</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Total Cars:</p>
                      <p className="font-semibold">{stats.totalCars}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Total Users:</p>
                      <p className="font-semibold">{stats.totalUsers}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Admins:</p>
                      <p className="font-semibold">{stats.adminUsers}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Last Updated:</p>
                      <p className="font-semibold">{new Date().toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>

                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold mb-2">System Actions</h3>
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={fetchAdminData}>
                      Refresh Data
                    </Button>
                    <Button variant="outline">
                      Export Data
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* User Edit Modal */}
      {showEditModal && editingUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h2 className="text-xl font-bold mb-4">Edit User Profile</h2>
            <UserEditForm 
              user={editingUser}
              onSave={updateUser}
              onCancel={() => {
                setShowEditModal(false)
                setEditingUser(null)
              }}
            />
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && userToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <Trash2 className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Delete User</h2>
                <p className="text-gray-600">This action cannot be undone</p>
              </div>
            </div>
            
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-red-800 font-medium mb-2">Warning:</p>
              <ul className="text-red-700 text-sm space-y-1">
                <li>• User "{userToDelete.full_name}" will be permanently deleted</li>
                <li>• All cars posted by this user will be deleted</li>
                <li>• This action cannot be undone</li>
              </ul>
            </div>

            <div className="flex gap-3 justify-end">
              <Button
                variant="outline"
                onClick={() => {
                  setShowDeleteConfirm(false)
                  setUserToDelete(null)
                }}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={confirmDeleteUser}
                className="bg-red-600 hover:bg-red-700"
              >
                Delete User
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 