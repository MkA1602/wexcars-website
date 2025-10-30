"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Building2, 
  Car, 
  Plus, 
  DollarSign, 
  TrendingUp, 
  Users, 
  Settings,
  FileText,
  CreditCard,
  BarChart3,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  Clock,
  AlertCircle
} from "lucide-react"
import { supabaseClient } from "@/lib/supabase/client"
import { useAuth } from "@/contexts/auth-context"
import { formatCurrency } from "@/lib/utils"
import type { Car as CarType } from "@/lib/types"
import Link from "next/link"

interface CompanyData {
  id: string
  company_name: string
  business_type: string
  subscription_plan: string
  status: string
  created_at: string
  total_cars: number
  active_cars: number
  sold_cars: number
  total_revenue: number
  pending_fees: number
}

interface FeeData {
  id: string
  car_id: string
  car_name: string
  amount: number
  currency: string
  status: string
  due_date: string
  created_at: string
}

export default function CompanyDashboard() {
  const { user } = useAuth()
  const router = useRouter()
  const [companyData, setCompanyData] = useState<CompanyData | null>(null)
  const [cars, setCars] = useState<CarType[]>([])
  const [fees, setFees] = useState<FeeData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("overview")

  useEffect(() => {
    if (!user) {
      router.push('/login')
      return
    }
    fetchCompanyData()
  }, [user, router])

  const fetchCompanyData = async () => {
    try {
      setIsLoading(true)

      // Fetch company data
      const { data: company, error: companyError } = await supabaseClient
        .from('companies')
        .select('*')
        .eq('user_id', user?.id)
        .single()

      if (companyError) {
        console.error('Company fetch error:', companyError)
        return
      }

      // Fetch company cars
      const { data: carsData, error: carsError } = await supabaseClient
        .from('cars')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })

      if (carsError) {
        console.error('Cars fetch error:', carsError)
      }

      // Fetch fees
      const { data: feesData, error: feesError } = await supabaseClient
        .from('company_fees')
        .select(`
          *,
          cars!inner(name)
        `)
        .eq('company_id', company.id)
        .order('created_at', { ascending: false })

      if (feesError) {
        console.error('Fees fetch error:', feesError)
      }

      // Calculate stats
      const totalCars = carsData?.length || 0
      const activeCars = carsData?.filter(car => !car.is_sold && car.is_published).length || 0
      const soldCars = carsData?.filter(car => car.is_sold).length || 0
      const totalRevenue = carsData?.reduce((sum, car) => sum + (car.is_sold ? car.price : 0), 0) || 0
      const pendingFees = feesData?.filter(fee => fee.status === 'pending').reduce((sum, fee) => sum + fee.amount, 0) || 0

      setCompanyData({
        ...company,
        total_cars: totalCars,
        active_cars: activeCars,
        sold_cars: soldCars,
        total_revenue: totalRevenue,
        pending_fees: pendingFees
      })

      setCars(carsData || [])
      setFees(feesData?.map(fee => ({
        ...fee,
        car_name: fee.cars.name
      })) || [])

    } catch (error) {
      console.error('Error fetching company data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'pending_verification': { color: 'bg-yellow-100 text-yellow-800', text: 'Pending Verification' },
      'verified': { color: 'bg-green-100 text-green-800', text: 'Verified' },
      'suspended': { color: 'bg-red-100 text-red-800', text: 'Suspended' },
      'rejected': { color: 'bg-red-100 text-red-800', text: 'Rejected' }
    }
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig['pending_verification']
    return <Badge className={config.color}>{config.text}</Badge>
  }

  const getFeeStatusBadge = (status: string) => {
    const statusConfig = {
      'pending': { color: 'bg-yellow-100 text-yellow-800', text: 'Pending', icon: Clock },
      'paid': { color: 'bg-green-100 text-green-800', text: 'Paid', icon: CheckCircle },
      'overdue': { color: 'bg-red-100 text-red-800', text: 'Overdue', icon: AlertCircle }
    }
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig['pending']
    const Icon = config.icon
    
    return (
      <Badge className={config.color}>
        <Icon className="w-3 h-3 mr-1" />
        {config.text}
      </Badge>
    )
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-light mx-auto mb-4"></div>
            <p className="text-gray-600">Loading company dashboard...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!companyData) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <Building2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">No Company Found</h2>
          <p className="text-gray-600 mb-6">You need to register your company first to access the dashboard.</p>
          <Button onClick={() => router.push('/company/register')} className="bg-primary-light hover:bg-primary-dark">
            Register Your Company
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{companyData.company_name}</h1>
            <div className="flex items-center gap-4 mt-2">
              {getStatusBadge(companyData.status)}
              <span className="text-gray-600">{companyData.business_type}</span>
              <span className="text-gray-600">•</span>
              <span className="text-gray-600">{companyData.subscription_plan} Plan</span>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => router.push('/company/settings')}>
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
            <Button onClick={() => router.push('/dashboard/add-car')}>
              <Plus className="w-4 h-4 mr-2" />
              Add Car
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Car className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Cars</p>
                <p className="text-2xl font-bold text-gray-900">{companyData.total_cars}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Eye className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Listings</p>
                <p className="text-2xl font-bold text-gray-900">{companyData.active_cars}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Sold Cars</p>
                <p className="text-2xl font-bold text-gray-900">{companyData.sold_cars}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <DollarSign className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(companyData.total_revenue, 'AED')}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <CreditCard className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending Fees</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(companyData.pending_fees, 'AED')}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="cars">My Cars</TabsTrigger>
          <TabsTrigger value="fees">Fees & Payments</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Cars */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Car className="w-5 h-5" />
                  Recent Cars
                </CardTitle>
                <CardDescription>Your latest car listings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {cars.slice(0, 5).map((car) => (
                    <div key={car.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <img
                          src={car.image || "/placeholder.svg"}
                          alt={car.name}
                          className="w-12 h-12 object-cover rounded"
                        />
                        <div>
                          <p className="font-medium">{car.brand} {car.name}</p>
                          <p className="text-sm text-gray-600">{car.year}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">{formatCurrency(car.price, car.currency)}</p>
                        <Badge variant={car.is_sold ? "destructive" : "default"}>
                          {car.is_sold ? "Sold" : "Active"}
                        </Badge>
                      </div>
                    </div>
                  ))}
                  {cars.length === 0 && (
                    <p className="text-center text-gray-500 py-4">No cars listed yet</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Recent Fees */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Recent Fees
                </CardTitle>
                <CardDescription>Latest fee transactions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {fees.slice(0, 5).map((fee) => (
                    <div key={fee.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{fee.car_name}</p>
                        <p className="text-sm text-gray-600">
                          Due: {new Date(fee.due_date).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">{formatCurrency(fee.amount, fee.currency)}</p>
                        {getFeeStatusBadge(fee.status)}
                      </div>
                    </div>
                  ))}
                  {fees.length === 0 && (
                    <p className="text-center text-gray-500 py-4">No fees yet</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="cars" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>My Cars</CardTitle>
                  <CardDescription>Manage your car listings</CardDescription>
                </div>
                <Button onClick={() => router.push('/dashboard/add-car')}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add New Car
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {cars.map((car) => (
                  <div key={car.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <img
                        src={car.image || "/placeholder.svg"}
                        alt={car.name}
                        className="w-16 h-16 object-cover rounded"
                      />
                      <div>
                        <h3 className="font-semibold">{car.brand} {car.name}</h3>
                        <p className="text-sm text-gray-600">{car.year} • {car.mileage?.toLocaleString()} km</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant={car.is_sold ? "destructive" : "default"}>
                            {car.is_sold ? "Sold" : "Active"}
                          </Badge>
                          {!car.is_published && (
                            <Badge variant="outline">Draft</Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-lg">{formatCurrency(car.price, car.currency)}</p>
                      <div className="flex gap-1">
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/collections/${car.id}`}>
                            <Eye className="w-4 h-4" />
                          </Link>
                        </Button>
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/dashboard/edit-car/${car.id}`}>
                            <Edit className="w-4 h-4" />
                          </Link>
                        </Button>
                        <Button variant="outline" size="sm">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
                {cars.length === 0 && (
                  <div className="text-center py-12">
                    <Car className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No cars listed yet</h3>
                    <p className="text-gray-600 mb-4">Start by adding your first car listing</p>
                    <Button onClick={() => router.push('/dashboard/add-car')}>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Your First Car
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="fees" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Fees & Payments</CardTitle>
              <CardDescription>Track your listing fees and payments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {fees.map((fee) => (
                  <div key={fee.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-gray-100 rounded-lg">
                        <CreditCard className="w-6 h-6 text-gray-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{fee.car_name}</h3>
                        <p className="text-sm text-gray-600">
                          Created: {new Date(fee.created_at).toLocaleDateString()}
                        </p>
                        <p className="text-sm text-gray-600">
                          Due: {new Date(fee.due_date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg">{formatCurrency(fee.amount, fee.currency)}</p>
                      {getFeeStatusBadge(fee.status)}
                      {fee.status === 'pending' && (
                        <Button size="sm" className="mt-2">
                          Pay Now
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
                {fees.length === 0 && (
                  <div className="text-center py-12">
                    <CreditCard className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No fees yet</h3>
                    <p className="text-gray-600">Fees will appear here when you list cars</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Sales Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Cars Listed</span>
                    <span className="font-semibold">{companyData.total_cars}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Cars Sold</span>
                    <span className="font-semibold">{companyData.sold_cars}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Success Rate</span>
                    <span className="font-semibold">
                      {companyData.total_cars > 0 
                        ? Math.round((companyData.sold_cars / companyData.total_cars) * 100)
                        : 0}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Revenue</span>
                    <span className="font-semibold">{formatCurrency(companyData.total_revenue, 'AED')}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Monthly Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Active Listings</span>
                    <span className="font-semibold">{companyData.active_cars}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Pending Fees</span>
                    <span className="font-semibold">{formatCurrency(companyData.pending_fees, 'AED')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Plan</span>
                    <span className="font-semibold capitalize">{companyData.subscription_plan}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status</span>
                    {getStatusBadge(companyData.status)}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

