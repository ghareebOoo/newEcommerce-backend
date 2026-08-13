import express from "express";
import {getDashboardStats , getOrderPerMonth , getRevenuePerMonth , getSalesByCategory} from "../controllers/dashboardController.js";

const dashboardRouter = express.Router();

dashboardRouter.get('/stats' , getDashboardStats);
dashboardRouter.get('/orderPerMonth' , getOrderPerMonth);
dashboardRouter.get('/revenuePerMonth' , getRevenuePerMonth);
dashboardRouter.get('/salesByCategory' , getSalesByCategory);

export default dashboardRouter;