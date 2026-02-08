import { z } from "zod";

const addToWatchlistSchema = z.object({
    movieId: z.string().uuid(),
    status: z.enum(["PLANNED", "WATCHING", "COMPLETED", "DROPPED"], {
        error: () => ({
            message: "Status must be one of: PLANNED, WATCHING, COMPLETED, DROPPED"
        }),
    }).optional(),
    rating: z.coerce.number().int("Rating must be an integer").min(1, "Rating must be at least 1").max(10, "Rating cannot be more than 10").optional(),
    notes: z.string().optional()
});

export { addToWatchlistSchema };