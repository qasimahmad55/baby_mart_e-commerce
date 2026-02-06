import express from 'express'
import { admin, protect } from '../middleware/authMiddleware.js'
import { getAnalyticsOverview, getInventoryAlerts, getProductAnalytics, getSalesAnalytics } from '../controllers/analyticsController.js'

const router = express.Router()

router.use(protect)
router.use(admin)

router.get("/overview", getAnalyticsOverview)

router.get("/products", getProductAnalytics)

router.get("/sales", getSalesAnalytics)

router.get("/inventory-alerts", getInventoryAlerts)

export default router