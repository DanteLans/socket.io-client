import { faker } from '@faker-js/faker';



const users = [
    'B132**',
    'B4232**',
    'B5332**',
    'B5232**',
    'B53322**',
    'B4235**',
    'B6930**',
    'B5232**',
    'B0202**',
    'B2932**',
    'B4922**'
]
const games = {
    'Big Salmon Run': 'gameId=5386&extGameId=102217&origin=New%20Games&ProviderID=13',
    'Triple Lucky 8s': 'gameId=5184&extGameId=916&origin=New%20Games&ProviderID=2Muertos Mariachi',
    'Muertos Mariachi': 'gameId=5195&extGameId=1351&origin=New%20Games&ProviderID=14',
    'Triple Card Gamble': 'gameId=5387&extGameId=1181&origin=New%20Games&ProviderID=10',
    'Dragons Treasure': 'gameId=5393&extGameId=11507&origin=New%20Games&ProviderID=13',
    'Multi Hand Blackjack':'gameId=3073&extGameId=2001&origin=Blackjack&ProviderID=13',
    'Single Deck Blackjack': 'gameId=3074&extGameId=2006&origin=Blackjack&ProviderID=13',
    'All american': 'gameId=3227&extGameId=101380&origin=Video%20Poker&ProviderID=13',
    'Triple Card Gamble': 'gameId=5387&extGameId=1181&origin=Video%20Poker&ProviderID=10'
}


/**
 * (game, user, timetransac, betamount, section, type, redirect, multiplier, pay)
 * ejemplo ('Victory Line', 'B944**', 1699415147136, 12.55, 'casino', 'null', 'gameId=5352&extGameId=148&origin=New%20Games&ProviderID=1', 1.5,18.825)
 */
export function createRandomCasinoData() {
    const gameKeys  = Object.keys(games);
    const gameKey = faker.helpers.arrayElement(gameKeys);
    const betamount = faker.number.float({ min: 10, max: 200, precision: 0.001 });
    const multiplier = faker.number.float({ min: 0.1, max: 5, precision: 0.001 });
    return {
        users: faker.helpers.arrayElement(users),
        game: gameKey,
        timetransac: new Date().getTime(),
        betamount: betamount,
        section: 'casino',
        type: faker.helpers.arrayElement(['null', 'Bronze', 'Silver', 'Golden', 'Platinum', 'Diamond', 'Black']),
        redirect: games[gameKey],
        multiplier: multiplier,
        pay: betamount * multiplier,
    };
}

export function getRandomMilisecconds() {
    return  faker.number.int({ min: 2000, max: 5000 })
}