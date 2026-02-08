import express from "express";
import {
    addToWatchlistController,
    removeFromWatchlistController,
    updateWatchlistController
} from "../controllers/watchlistController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { validateRequest } from "../middleware/validateRequest.js";
import { addToWatchlistSchema } from "../validators/watchlistValidators.js";

const router = express.Router();

router.use(authMiddleware);

router.post("/", validateRequest(addToWatchlistSchema), addToWatchlistController);
router.put("/:id", updateWatchlistController);
router.delete("/:id", removeFromWatchlistController);

export default router;