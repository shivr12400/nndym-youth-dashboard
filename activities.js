const calculateAge = (birthday) => {
    if (!birthday) return 0;
    const today = new Date();
    const birthDate = new Date(birthday);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
}

const getAgeRange = (age) => {
    if (age >= 1 && age <= 8) return '1-8';
    if (age >= 9 && age <= 13) return '9-13';
    if (age >= 14 && age <= 18) return '14-18';
    if (age >= 19 && age <= 25) return '19-25';
    return null;
}

const countActivities = (kids) => {
    let artsCraftsInterest = 0
    let dancingInterest = 0
    let instrumentInterest = 0
    let singingInterest = 0
    let sportsInterest = 0
    let videoGamesInterest = 0
    
    for (let i = 0; i < kids.length; i++) {
        if (kids[i].artsCraftsInterest) {
            artsCraftsInterest++
        }
        if (kids[i].dancingInterest) {
            dancingInterest++
        }
        if (kids[i].instrumentInterest) {
            instrumentInterest++
        }
        if (kids[i].singingInterest) {
            singingInterest++
        }
        if (kids[i].sportsInterest) {
            sportsInterest++
        }
        if (kids[i].videoGamesInterest) {
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

export const activities = (kidsList) => {
    const ageRanges = {
        '1-8': [],
        '9-13': [],
        '14-18': [],
        '19-25': []
    }
    
    // Group kids by age range
    for (let i = 0; i < kidsList.length; i++) {
        const age = calculateAge(kidsList[i].birthday);
        const range = getAgeRange(age);
        if (range) {
            ageRanges[range].push(kidsList[i]);
        }
    }
    
    // Count activities for each age range
    return {
        '1-8': countActivities(ageRanges['1-8']),
        '9-13': countActivities(ageRanges['9-13']),
        '14-18': countActivities(ageRanges['14-18']),
        '19-25': countActivities(ageRanges['19-25'])
    }
}