import express from "express";
import {
    addToWatchlistController,
    removeFromWatchlistController,
    updateWatchlistController
} from "../controllers/watchlistController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(authMiddleware);

router.post("/", addToWatchlistController);
router.put("/:id", updateWatchlistController);
router.delete("/:id", removeFromWatchlistController);

export default router;