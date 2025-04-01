import  {Router} from 'express'; 
import { createSong, deleteSong, createAlbum, deleteAlbum, checkAdmin } from '../controllers/admin.controller.js';
import { protectRoute, requireAdmin } from '../middlewares/auth.middleware.js';

const router = Router();

// optimize clean code
router.use(protectRoute, requireAdmin);

//  check if is user is an Admin
router.get("/check", checkAdmin);

// Admin - create and delete songs
router.post("/songs", createSong);
router.delete("/songs/:id", deleteSong);

// Admin - create and delete albums
router.post("/albums", createAlbum);
router.post("/albums/:id", deleteAlbum);


export default router;