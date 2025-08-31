import { Router } from 'express';
import { getRecentMatches, getSummonerByRiotId} from '../controllers/summoner.controller.js';

const router = Router();


router.get("/summoner/:name/:tag", getSummonerByRiotId);
router.get("/matches/:puuid", getRecentMatches);


export default router;