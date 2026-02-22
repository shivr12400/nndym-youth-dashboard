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

const isMale = (g) => { const s = String(g || '').toLowerCase(); return s === 'm' || s === 'male'; };
const isFemale = (g) => { const s = String(g || '').toLowerCase(); return s === 'f' || s === 'female'; };

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
        const gender = kid.gender ?? kid.Gender;

        if (kid.artsCraftsInterest ?? kid.arts_crafts_interest) {
            if (isMale(gender)) artsCraftsMale++;
            else if (isFemale(gender)) artsCraftsFemale++;
        }
        if (kid.dancingInterest ?? kid.dancing_interest) {
            if (isMale(gender)) dancingMale++;
            else if (isFemale(gender)) dancingFemale++;
        }
        if (kid.instrumentInterest ?? kid.instrument_interest) {
            if (isMale(gender)) instrumentMale++;
            else if (isFemale(gender)) instrumentFemale++;
        }
        if (kid.singingInterest ?? kid.singing_interest) {
            if (isMale(gender)) singingMale++;
            else if (isFemale(gender)) singingFemale++;
        }
        if (kid.sportsInterest ?? kid.sports_interest) {
            if (isMale(gender)) sportsMale++;
            else if (isFemale(gender)) sportsFemale++;
        }
        if (kid.videoGamesInterest ?? kid.video_games_interest) {
            if (isMale(gender)) videoGamesMale++;
            else if (isFemale(gender)) videoGamesFemale++;
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
    
    for (let i = 0; i < kidsList.length; i++) {
        const kid = kidsList[i];
        const ageNum = parseInt(kid.age ?? kid.Age, 10);
        const age = !isNaN(ageNum) ? ageNum : calculateAge(kid.birthday ?? kid.Birthday);
        const range = getAgeRange(age);
        if (range) {
            ageRanges[range].push(kid);
        }
    }
    
    return {
        '1-8': countActivities(ageRanges['1-8']),
        '9-13': countActivities(ageRanges['9-13']),
        '14-18': countActivities(ageRanges['14-18']),
        '19-25': countActivities(ageRanges['19-25'])
    }
}