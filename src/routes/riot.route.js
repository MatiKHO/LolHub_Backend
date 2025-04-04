import { Router } from 'express';
import { getRecentMatches, getSummonerByRiotId} from '../controllers/summoner.controller.js';

const router = Router();


// Riot - get PUUID by name and tag
router.get("/summoner/:name/:tag", getSummonerByRiotId);
router.get("/matches/:puuid", getRecentMatches);


export default router;