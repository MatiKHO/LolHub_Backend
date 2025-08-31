import { Summoner } from '../models/summoner.model.js';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const RIOT_API_KEY = process.env.RIOT_API_KEY;
const BASE_URL_EUROPE = process.env.BASE_URL_EUROPE;
const BASE_URL_EUW = process.env.BASE_URL_EUW;

export const getSummonerByRiotId = async (req, res, next) => {

    // Debug logs for local debugging (remove in production)
    console.log('RIOT_API_KEY:', RIOT_API_KEY);
    console.log('BASE_URL_EUROPE:', BASE_URL_EUROPE);
    console.log('BASE_URL_EUW:', BASE_URL_EUW);

    const { name, tag } = req.params;
    const encodedName = encodeURIComponent(name);
    const encodedTag = encodeURIComponent(tag);

    try {
        // Get PUUID
        const { data: summonerData } = await axios.get(
            `${BASE_URL_EUROPE}/riot/account/v1/accounts/by-riot-id/${encodedName}/${encodedTag}`,
      { headers: { "X-Riot-Token": RIOT_API_KEY } }
        )

        // Get summoner data
        const { data: summonerInfo } = await axios.get(
            `${BASE_URL_EUW}/summoner/v4/summoners/by-puuid/${summonerData.puuid}`,
            { headers: { "X-Riot-Token": RIOT_API_KEY } }
        );

        // Get summoner rank
        const { data: rankedData } = await axios.get(
            `${BASE_URL_EUW}/league/v4/entries/by-summoner/${summonerInfo.id}`,
            { headers: { "X-Riot-Token": RIOT_API_KEY } }
        );

        const rankedSolo = rankedData.find(r => r.queueType === "RANKED_SOLO_5x5") || {};

        // Save data into db
        const summoner = new Summoner({
            puuid: summonerData.puuid,
            name: summonerInfo.name,
            level: summonerInfo.summonerLevel,
            profileIconId: summonerInfo.profileIconId,
            rank: rankedSolo.tier ? `${rankedSolo.tier} ${rankedSolo.rank}` : "Unranked",
            wins: rankedSolo.wins || 0,
            losses: rankedSolo.losses || 0,
            lp: rankedSolo.leaguePoints || 0,
        });

        await summoner.save();
        res.json(summoner);
    } catch (error) {
        console.error("Error en getSummonerByRiotId", error.response?.data || error.message);
        next(error);
    }
};


export const getRecentMatches = async (req, res, next) => {
    try {
        const { puuid } = req.params;

        //  Get last games id
        const { data: matchIds } = await axios.get(
            `${BASE_URL_EUROPE}/lol/match/v5/matches/by-puuid/${puuid}/ids?start=0&count=5`,
            { headers: { "X-Riot-Token": RIOT_API_KEY } }
        );

        // Get match details
        const matchDetails = await Promise.all(
            matchIds.map(matchId =>
                axios.get(`${BASE_URL_EUROPE}/lol/match/v5/matches/${matchId}`, {
                    headers: { "X-Riot-Token": RIOT_API_KEY },
                }).then(res => res.data)
            )
        );

        res.json(matchDetails);
    } catch (error) {
        console.error(" Error in getRecentMatches", error.response?.data || error.message);
        next(error);
    }
};








