export const calculateAge = (birthday) => {
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

export const getAgeRange = (age) => {
    if (age >= 1 && age <= 8) return '1-8';
    if (age >= 9 && age <= 13) return '9-13';
    if (age >= 14 && age <= 18) return '14-18';
    if (age >= 19 && age <= 25) return '19-25';
    return null;
}

const countActivities = (kids) => {
    let artsCraftsMale = 0;
    let artsCraftsFemale = 0;
    let dancingMale = 0;
    let dancingFemale = 0;
    let instrumentMale = 0;
    let instrumentFemale = 0;
    let singingMale = 0;
    let singingFemale = 0;
    let sportsMale = 0;
    let sportsFemale = 0;
    let videoGamesMale = 0;
    let videoGamesFemale = 0;
    
    for (let i = 0; i < kids.length; i++) {
        const kid = kids[i];
        const gender = kid.gender;

        if (kid.artsCraftsInterest) {
            if (gender === 'Male') artsCraftsMale++;
            else if (gender === 'Female') artsCraftsFemale++;
        }
        if (kid.dancingInterest) {
            if (gender === 'Male') dancingMale++;
            else if (gender === 'Female') dancingFemale++;
        }
        if (kid.instrumentInterest) {
            if (gender === 'Male') instrumentMale++;
            else if (gender === 'Female') instrumentFemale++;
        }
        if (kid.singingInterest) {
            if (gender === 'Male') singingMale++;
            else if (gender === 'Female') singingFemale++;
        }
        if (kid.sportsInterest) {
            if (gender === 'Male') sportsMale++;
            else if (gender === 'Female') sportsFemale++;
        }
        if (kid.videoGamesInterest) {
            if (gender === 'Male') videoGamesMale++;
            else if (gender === 'Female') videoGamesFemale++;
        }
    }
    
    return [
        {name: 'Arts and Crafts', male: artsCraftsMale, female: artsCraftsFemale},
        {name: 'Dancing', male: dancingMale, female: dancingFemale},
        {name: 'Instrument', male: instrumentMale, female: instrumentFemale},
        {name: "Singing", male: singingMale, female: singingFemale},
        {name: "Sports", male: sportsMale, female: sportsFemale},
        {name: "Video Games", male: videoGamesMale, female: videoGamesFemale},
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