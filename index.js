const express = require('express')
const cors = require('cors')
const { updateLeaderboard } = require('./updateLeaderboard')
const fs = require('fs')
const cron = require('node-cron')

const app = express()
app.use(cors())

app.get('/', (req, res) => {
  res.send('Welcome to df server')
})

app.get('/leaderboard', async (req, res) => {
    const leaderboard = JSON.parse(fs.readFileSync('./leaderboard.json'))
    // console.log('get leaderboard ', leaderboard.timestamp)
    // const currentTimestamp = Date.now()

    // if (currentTimestamp - leaderboard.timestamp > 5*60*1000) {
    //     await updateLeaderboard()
    // }
    res.json({entries: leaderboard.entries})
})

cron.schedule('*/5 * * * *', async () => {
    try {
        console.log('update leader board every 5 min')
        await updateLeaderboard()
        console.log('update success')
    } catch (e) {
        console.log(e)
        console.log('update failed')
    }
});


const port = 3088

app.listen(port, () => {
  console.log(`DF server listening on port ${port}`)
})