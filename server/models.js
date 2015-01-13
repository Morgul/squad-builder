//----------------------------------------------------------------------------------------------------------------------
// Models for the squad builder.
//
// @module models.js
//----------------------------------------------------------------------------------------------------------------------

var path = require('path');
var jbase = require('jbase');
var Promise = require('bluebird');

//----------------------------------------------------------------------------------------------------------------------

var db = { errors: jbase.errors };
var rootPath = path.join(__dirname, 'db');

db.choices = {
    factions: ['empire', 'rebel', 'scum'],
    actions: [
        'barrel-roll',
        'boost',
        'cloak',
        'coordinate',
        'evade',
        'focus',
        'jam',
        'recover',
        'reinforce',
        'target-lock'
    ],
    slots: [
        'astromech',
        'bomb',
        'cannon',
        'cargo',
        'crew',
        'elite',
        'hardpoint',
        'illicit',
        'missile',
        'modification',
        'salvaged astromech',
        'system',
        'team',
        'title',
        'torpedo',
        'turret'
    ]
};

//----------------------------------------------------------------------------------------------------------------------
// Define models
//----------------------------------------------------------------------------------------------------------------------

db.Faction = jbase.defineModel('factions', {
    name: { type: String, required: true }
}, { writeToDisk: false });

db.Ship = jbase.defineModel('ships', {
    name: String,
    canonicalName: String,
    factions: { type: Array, default: [] },
    energy: Number,
    attack: Number,
    agility: Number,
    hull: Number,
    shields: Number,
    epicPoints: Number,
    actions: { type: Array, default: [], choices: db.choices.actions },
    maneuvers: { type: Array, default: [] },
    size: { type: String, default: 'small', choices: ['small', 'large', 'huge'] }
}, { rootPath: rootPath });

db.Pilot = jbase.defineModel('pilots', {
    name: String,
    canonicalName: String,
    text: String,
    ship: String,
    skill: Number,
    points: Number,
    energy: Number,
    attack: Number,
    agility: Number,
    hull: Number,
    shields: Number,
    sources: { type: Array, default: [] },
    faction: { type: String, choices: db.choices.factions },
    actions: { type: Array, default: [], choices: db.choices.actions },
    upgrades: { type: Array, default: [], choices: db.choices.slots },
    unique: { type: Boolean, default: false }
}, { rootPath: rootPath });

db.Upgrade = jbase.defineModel('upgrades', {
    name: String,
    canonicalName: String,
    text: String,
    points: Number,
    energy: String,
    attack: Number,
    range: String,
    ship: String,
    size: { type: String, default: 'all', choices: ['all', 'small', 'large', 'huge'] },
    sources: { type: Array, default: [] },
    faction: { type: String, choices: db.choices.factions },
    type: { type: String, choices: db.choices.slots },
    grants: { type: Object, default: { upgrades: [], actions: [] } },
    limited: { type: Boolean, default: false },
    unique: { type: Boolean, default: false }
}, { rootPath: rootPath });

db.Expansion = jbase.defineModel('expansions', {
    name: String,
    cards: { type: Array, default: [] },
    released: { type: Boolean, default: false }
}, { rootPath: rootPath });

//----------------------------------------------------------------------------------------------------------------------

db.User = jbase.defineModel('users', {
    gPlusID: String,
    nickname: String,
    tagline: String,
    email: String,
    displayName: String,
    avatar: String,
    squads: { type: Array, default: [] },
    collection: { type: Array, default: [] }
}, { rootPath: rootPath });

db.Squad = jbase.defineModel('squads', {
    name: { type: String, default: "Untitled Squad"},
    notes: { type: String, default: "" },
    members: { type: Array, default: [] },
    wins: { type: Number, default: 0 },
    draws: { type: Number, default: 0 },
    losses: { type: Number, default: 0 }
}, { rootPath: rootPath });

//----------------------------------------------------------------------------------------------------------------------
// Populate static data
//----------------------------------------------------------------------------------------------------------------------

var factionsDB = jbase.db('factions', { writeToDisk: false });

// Store an initialize promise
db.initialize = Promise.join(
        factionsDB.store('empire', { name: "Galactic Empire" }),
        factionsDB.store('rebel', { name: "Rebel Alliance" }),
        factionsDB.store('scum', { name: "Scum and Villainy" })
    );

//----------------------------------------------------------------------------------------------------------------------

module.exports = db;

//----------------------------------------------------------------------------------------------------------------------