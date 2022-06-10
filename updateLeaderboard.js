const fs = require('fs')

const { ethers } = require("ethers")
const dfABI = require('@darkforest_eth/contracts/abis/DarkForest.json')
const contractAddress = '0x094a1729e15f67d66a0ccc8cbf485ace4efb0f91'
const axios = require('axios')



const provider = new ethers.providers.JsonRpcProvider('https://poa-xdai.gateway.pokt.network/v1/lb/620c7e1399eef60039c2de86')

const decodePlayer = (player, addressToTwitter) => {

    console.log(player[1], addressToTwitter[player[1].toLowerCase()])

    return {
        ethAddress: player[1],
        score: player[5].toNumber(),
        twitter: addressToTwitter[player[1].toLowerCase()]
    }
}

const getAllTwitter = async () => {
    const { data } = await axios.get('https://api.zkga.me/twitter/all-twitters')
    return data
}

const updateLeaderboard = async () => {
    const df = new ethers.Contract(contractAddress, dfABI, provider)
    const result = await df.getNPlayers()
    const numOfPlayer = result.toString()

    console.log('number of players: ', numOfPlayer)

    const rawPlayers = await df.bulkGetPlayers(0, numOfPlayer)

    const addressToTwitter = await getAllTwitter()
    
    const entries = rawPlayers.map(player => decodePlayer(player, addressToTwitter)).sort((a,b) => b.score - a.score)

    fs.writeFileSync('./leaderboard.json', JSON.stringify({timestamp: Date.now(), entries}))
}

updateLeaderboard()
module.exports = {
    updateLeaderboard
}
