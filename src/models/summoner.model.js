import mongoose from "mongoose";

const SummonerSchema = new mongoose.Schema({
 
  puuid: String,
  name: String,
  level: Number,
  profileIconId: Number,
  rank: String,
  wins: Number,
  losses: Number,
  lp: Number,
});

export const Summoner = mongoose.model("Summoner", SummonerSchema);
