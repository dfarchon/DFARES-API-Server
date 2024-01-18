const fs = require('fs')
require('dotenv').config();
const { ethers } = require("ethers")
const dfABI = require('./DarkForest.json')
const axios = require('axios')

const { DEFAULT_RPC, GAME_ADDRESS } = process.env;


const contractAddress = GAME_ADDRESS;
const rpcUrl = DEFAULT_RPC; 

// console.log('---------------------------')
// console.log(contractAddress);
// console.log(rpcUrl);
// console.log('---------------------------')

const provider = new ethers.providers.JsonRpcProvider(rpcUrl)

// const decodePlayer = (player, addressToTwitter) => {

//     console.log(player[1], addressToTwitter[player[1].toLowerCase()])

//     return {
//         ethAddress: player[1],
//         score: player[5].toNumber(),
//         twitter: addressToTwitter[player[1].toLowerCase()]
//     }
// }

// const getAllTwitter = async () => {
//     const { data } = await axios.get('https://api.zkga.me/twitter/all-twitters')
//     return data
// }

const updateLeaderboard = async () => {
    const df = new ethers.Contract(contractAddress, dfABI, provider)
    const result = await df.getNPlayers()
    const numOfPlayer = result.toString()

    console.log('number of players: ', numOfPlayer)

    const rawPlayers = await df.bulkGetPlayers(0, numOfPlayer)

    // const addressToTwitter = await getAllTwitter()
    // rawPlayers.map(player => decodePlayer(player, addressToTwitter)).sort((a,b) => b.score - a.score)

    const entries = [];
    
    for(const player of rawPlayers){
        let address = player[1]
        let score = await df.getScore(address);
        let scoreStr = score.toString();
        if(scoreStr === '115792089237316195423570985008687907853269984665640564039457584007913129639935') score =undefined;
        else score = score.toNumber();

        console.log(address,' ',score);
        let tmp = {ethAddress: address.toLowerCase(),score: score}

        entries.push(tmp);
       
    }
    

    fs.writeFileSync('./leaderboard.json', JSON.stringify({timestamp: Date.now(), entries}))
}

updateLeaderboard()
module.exports = {
    updateLeaderboard
}
