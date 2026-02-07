import { prisma } from "../config/db.js";

const addToWatchlistController = async (req, res) => {
    const { movieId, status, rating, notes } = req.body;

    //Verify movie exists
    const movie = await prisma.movie.findUnique({
        where: { id: movieId },
    });

    if (!movie) {
        return res.status(404).json({ error: "Movie not found" });
    }

    //Check if already added to watchlist
    const existingInWatchlist = await prisma.watchlistItem.findUnique({
        where: {
            userId_movieId: {
                userId: req.user.id,
                movieId: movieId
            },
        },
    });

    if (existingInWatchlist) {
        return res.status(409).json({ error: "Movie already exists in watchlist" });
    }

    const watchlistItem = await prisma.watchlistItem.create({
        data: {
            userId: req.user.id,
            movieId,
            status: status || "PLANNED",
            rating: rating || null,
            notes: notes || null
        }
    });

    res.status(201).json({
        status: "success",
        data: watchlistItem
    });
};

const updateWatchlistController = async (req, res) => {
    const { status, rating, notes } = req.body;

    //Find the watchlist item by id and userId
    const watchlistItem = await prisma.watchlistItem.findUnique({
        where: { id: req.params.id },
    });

    if (!watchlistItem) {
        return res.status(404).json({ error: "Watchlist item not found" });
    }

    //Ensure only owner can update
    if (watchlistItem.userId !== req.user.id) {
        return res.status(403).json({ error: "Forbidden: You can only update your own watchlist items" });
    }

    const updateData = {};
    if (status !== undefined) updateData.status = status.toUpperCase();
    if (rating !== undefined) updateData.rating = rating;
    if (notes !== undefined) updateData.notes = notes;

    //Update the watchlist item
    const updatedWatchlistItem = await prisma.watchlistItem.update({
        where: { id: req.params.id },
        data: updateData
    });

    res.status(200).json({
        status: "success",
        data: {
            updatedWatchlistItem: updatedWatchlistItem
        }
    });

};

const removeFromWatchlistController = async (req, res) => {
    //Find the watchlist item by id and userId
    const watchlistItem = await prisma.watchlistItem.findUnique({
        where: { id: req.params.id },
    });

    if (!watchlistItem) {
        return res.status(404).json({ error: "Watchlist item not found" });
    }

    //Ensure only owner can delete
    if (watchlistItem.userId !== req.user.id) {
        return res.status(403).json({ error: "Forbidden: You can only delete your own watchlist items" });
    }

    await prisma.watchlistItem.delete({
        where: { id: req.params.id }
    });

    res.status(200).json({
        status: "success",
        message: "Watchlist item removed successfully"
    });
};

export { addToWatchlistController, removeFromWatchlistController, updateWatchlistController };