import DashboardSkeleton from '@/components/skeletons/DashboardSkeleton';
import { useAxiosPrivate } from '@/hooks/useAxiosPrivate';
import type { StatsData } from '@/lib/type';
import { useEffect, useState } from 'react'
import { toast } from 'sonner';
import { motion } from "framer-motion";
import { StatsCard } from '@/components/StatsCard';
import {
  Users,
  ShoppingBag,
  Tag,
  Bookmark,
  Package,
  DollarSign,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
} from "recharts";

const COLORS = [
  "hsl(217, 91%, 60%)", // Blue
  "hsl(221, 83%, 53%)", // Indigo
  "hsl(262, 83%, 58%)", // Purple
  "hsl(350, 87%, 55%)", // Red
  "hsl(120, 60%, 50%)", // Green
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

function Dashboard() {

  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const axiosPrivate = useAxiosPrivate();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "usd"
    }).format(amount)
  }

  useEffect(() => {
    setLoading(true)
    const fetchStats = async () => {
      try {
        const response = await axiosPrivate.get("/stats")
        console.log(response);
        setStats(response.data)
      } catch (error) {
        console.log("Error", error);
        toast("Failed to load dashboard statistics")

      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [axiosPrivate, toast])

  return (
    <div className="bg-gradient-to-br min-h-full from-gray-50 to-gray-100">
      {loading ? (
        <DashboardSkeleton />
      ) : (
        <div className="space-y-4 sm:space-y-6 p-3 sm:p-6 mx-auto">
          <h1 className="text-2xl sm:text-4xl font-bold text-gray-800">
            Dashboard OverView
          </h1>
          {stats && (
            <>
              <motion.div
                className="grid gap-3 sm:gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-6"
                variants={containerVariants}
              >
                <motion.div variants={cardVariants} className="h-full">
                  <StatsCard
                    title="Total Users"
                    value={stats.counts.users}
                    icon={<Users className="h-6 w-6 text-indigo-600" />}
                    href="/dashboard/users"
                    className="bg-white/95 shadow-lg rounded-xl hover:shadow-xl transition-shadow duration-300"
                  />
                </motion.div>
                <motion.div variants={cardVariants} className="h-full">
                  <StatsCard
                    title="Total Products"
                    value={stats.counts.products}
                    icon={<ShoppingBag className="h-6 w-6 text-indigo-600" />}
                    href="/dashboard/products"
                    className="bg-white/95 shadow-lg rounded-xl hover:shadow-xl transition-shadow duration-300"
                  />
                </motion.div>
                <motion.div variants={cardVariants} className="h-full">
                  <StatsCard
                    title="Categories"
                    value={stats.counts.categories}
                    icon={<Tag className="h-6 w-6 text-indigo-600" />}
                    href="/dashboard/categories"
                    className="bg-white/95 shadow-lg rounded-xl hover:shadow-xl transition-shadow duration-300"
                  />
                </motion.div>
                <motion.div variants={cardVariants} className="h-full">
                  <StatsCard
                    title="Brands"
                    value={stats.counts.brands}
                    icon={<Bookmark className="h-6 w-6 text-indigo-600" />}
                    href="/dashboard/brands"
                    className="bg-white/95 shadow-lg rounded-xl hover:shadow-xl transition-shadow duration-300"
                  />
                </motion.div>
                <motion.div variants={cardVariants} className="h-full">
                  <StatsCard
                    title="Total Orders"
                    value={stats.counts.orders}
                    icon={<Package className="h-6 w-6 text-indigo-600" />}
                    href="/dashboard/orders"
                    className="bg-white/95 shadow-lg rounded-xl hover:shadow-xl transition-shadow duration-300"
                  />
                </motion.div>
                <motion.div variants={cardVariants} className="h-full">
                  <StatsCard
                    title="Total Revenue"
                    value={formatCurrency(stats.counts.totalRevenue)}
                    icon={<DollarSign className="h-6 w-6 text-indigo-600" />}
                    href="/dashboard/account"
                    className="bg-white/95 shadow-lg rounded-xl hover:shadow-xl transition-shadow duration-300"
                  />
                </motion.div>
              </motion.div>

              <motion.div
                className="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-2"
                variants={containerVariants}
              >
                <motion.div variants={cardVariants}>
                  <Card className="bg-white/95 shadow-lg rounded-xl hover:shadow-xl transition-shadow duration-300">
                    <CardHeader className="p-4 sm:p-6">
                      <CardTitle className="text-base sm:text-lg font-semibold text-gray-800">
                        Categories Distribution
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="h-64 sm:h-80 lg:h-96 p-2 sm:p-6 pt-0">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={stats.categories}
                          margin={{ top: 10, right: 10, left: 0, bottom: 5 }}
                        >
                          <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="#e5e7eb"
                          />
                          <XAxis dataKey="name" tick={{ fill: "#4b5563", fontSize: 12 }} />
                          <YAxis tick={{ fill: "#4b5563", fontSize: 12 }} />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "white",
                              border: "1px solid #e5e7eb",
                              borderRadius: "8px",
                            }}
                          />
                          <Legend wrapperStyle={{ fontSize: 12 }} />
                          <Bar
                            dataKey="value"
                            name="Products"
                            radius={[4, 4, 0, 0]}
                            animationDuration={1000}
                          >
                            {stats.categories.map((_, index) => (
                              <Cell
                                key={`cell-${index}`}
                                fill={COLORS[index % COLORS.length]}
                              />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div variants={cardVariants}>
                  <Card className="bg-white/95 shadow-lg rounded-xl hover:shadow-xl transition-shadow duration-300">
                    <CardHeader className="p-4 sm:p-6">
                      <CardTitle className="text-base sm:text-lg font-semibold text-gray-800">
                        User Roles Distribution
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="h-64 sm:h-80 lg:h-96 p-2 sm:p-6 pt-0">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={stats.roles}
                            cx="50%"
                            cy="50%"
                            labelLine={true}
                            label={({ name, percent }) =>
                              percent !== undefined
                                ? `${name}: ${(percent * 100).toFixed(0)}%`
                                : name
                            }
                            outerRadius="70%"
                            animationDuration={1000}
                            dataKey="value"
                          >
                            {stats.roles.map((_, index) => (
                              <Cell
                                key={`cell-${index}`}
                                fill={COLORS[index % COLORS.length]}
                              />
                            ))}
                          </Pie>
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "white",
                              border: "1px solid #e5e7eb",
                              borderRadius: "8px",
                            }}
                          />
                          <Legend wrapperStyle={{ fontSize: 12 }} />
                        </PieChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div variants={cardVariants} className="lg:col-span-2">
                  <Card className="bg-white/95 shadow-lg rounded-xl hover:shadow-xl transition-shadow duration-300">
                    <CardHeader className="p-4 sm:p-6">
                      <CardTitle className="text-base sm:text-lg font-semibold text-gray-800">
                        Brand Distribution
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="h-64 sm:h-80 lg:h-96 p-2 sm:p-6 pt-0">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={stats.brands}
                          margin={{ top: 10, right: 10, left: 0, bottom: 5 }}
                        >
                          <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="#e5e7eb"
                          />
                          <XAxis dataKey="name" tick={{ fill: "#4b5563", fontSize: 12 }} />
                          <YAxis tick={{ fill: "#4b5563", fontSize: 12 }} />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "white",
                              border: "1px solid #e5e7eb",
                              borderRadius: "8px",
                            }}
                          />
                          <Legend wrapperStyle={{ fontSize: 12 }} />
                          <Bar
                            dataKey="value"
                            name="Products"
                            radius={[4, 4, 0, 0]}
                            animationDuration={1000}
                          >
                            {stats.brands.map((_, index) => (
                              <Cell
                                key={`cell-${index}`}
                                fill={COLORS[index % COLORS.length]}
                              />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </motion.div>
              </motion.div>
            </>
          )}
        </div>
      )}
    </div>
  )
}
export default Dashboard