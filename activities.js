export const activities = (kidsList) => {
    let artsCraftsInterest = 0
    let dancingInterest = 0
    let instrumentInterest = 0
    let singingInterest = 0
    let sportsInterest = 0
    let videoGamesInterest = 0
    for (let i = 0; i < kidsList.length; i++) {
        if (kidsList[i].artsCraftsInterest) {
            artsCraftsInterest++
        }
        if (kidsList[i].dancingInterest) {
            dancingInterest++
        }
        if (kidsList[i].instrumentInterest) {
            instrumentInterest++
        }
        if (kidsList[i].singingInterest) {
            singingInterest++
        }
        if (kidsList[i].sportsInterest) {
            sportsInterest++
        }
        if (kidsList[i].videoGamesInterest) {
            videoGamesInterest++
        }
    }
    return [
        {name: 'Arts and Crafts', value: artsCraftsInterest},
        {name: 'Dancing', value: dancingInterest},
        {name: 'Instrument', value: instrumentInterest},
        {name: "Singing", value: singingInterest},
        {name: "Sports", value: sportsInterest},
        {name: "Video Games", value: videoGamesInterest},
    ]
}