# Data Structure

The data stored in `/server/db` is a representation of all pilots, ships, and upgrades in the _X-Wing Miniatures_ game.
This data is publicly available from several sources, including
[Fantasy Flight](http://www.fantasyflightgames.com/edge_minisite.asp?eidm=174) itself, though you'll have to dig through
news posts and transcribe it from the cards show in the images.

Because this data is public, I see no reason not to share it in a useful format for anyone looking to play with it. This
document is an attempt to document the format used, to make it easier for other people to use it.

## A Note on the format

These json files are stored as the on-disk format of [jbase](https://github.com/Morgul/jbase), a small key value
database I wrote for web projects. They are 'plain' json files, where each file is a single object, with a uuid as the
key, and the value being whatever was stored in the database. As such, the `id` parameter and the initial key of each
object can safely be ignored if you wish; the natural key for the data is actually the `canonicalName` parameter.

## General fields

Some fields have universal meanings and rules across all data. Instead of duplicating these rules, they are collected
here. If you can't find a description for a particular field in the relevant section, try looking for it here.

### `id`

This is a uuid (version 4). These are guaranteed to be unique across the data, but there is no guarantee that these ids
will be shared across different applications; if you need cross compatibility, you should use `canonicalName`.

### `name`

This is a string that should match the name printed on the card. While these should be unique, no formal guarantee is
made, as there may be legitimate reasons to have duplicate names. If you are looking for a unique id, use either `id` or
`canonicalName`.

### `canonicalName`

This is a lowercase string adhering to the [xws](https://github.com/elistevens/xws-spec#canonical-unique-ids) canonical
unique id specification. These ids are be used as the primary way of referencing cards. Unfortunately, there are
currently some overlaps in uniqueness; a given canonical name is only unique in each card type. (For example,
`'lukeskywalker'` is both a pilot card, and a crew upgrade card.)

### `text`

This is the rules text of the card (special abilities, etc). This currently contains the entire text, as it appears on
the physical card, but in the future will just be limited to the rules part of the text. Restrictions, etc will be
auto-generated based on the other fields of the card.

### `sources`

These are the names of the expansions that this card was featured in.

### `actions`

This is always an array. These are the actions a ship can take. They are always lower case. The possible values are
`'barrel-roll'`, `'boost'`, `'cloak'`, `'coordinate'`, `'evade'`, `'focus'`, `'jam'`, `'recover'`, `'reinforce'`, and
`'target-lock'`.

### `unique`

This is a boolean value. It indicates if the card should be considered 'unique', for rules purposes.

### `limited`

This is a boolean value. It indicates if the card should be considered 'limited', for rules purposes.

## `ships.json`

```javascript
{
    "458ca0db-88d1-44a7-a8bf-a0165aac7021": {
        "factions": [ "empire" ],
        "actions": [ "focus", "target-lock" ],
        "maneuvers": [
            [ null, null, null, null, null, null, null, null ],
            [ null, "white", "white", "white", null, null, null, null ],
            [ "white", "green", "green", "green", "white", null, null, null ],
            [ "white", "white", "green", "white", "white", null, null, null ],
            [ null, null, "white", null, null, null, null, null ]
        ],
        "size": "large",
        "name": "VT-49 Decimator",
        "canonicalName": "vt49decimator",
        "attack": 3,
        "agility": 0,
        "hull": 12,
        "shields": 4,
        "id": "458ca0db-88d1-44a7-a8bf-a0165aac7021"
    }
}
```

This is a collection of ships from the game. These are the intrinsic stats of the ship before a pilot is applied. Most
of the parameters are easy to understand, while a few may be worth going over.

### Stats (`attack`, `agility`, `hull`, etc.)

These stats represent the 'base' of the ship. They are the default, unless the pilot overrides them.

### `factions`

This is always an array. These are the factions a card can be played as. Some ships (like the Y-Wing) are in multiple
factions. The possible values are `'empire'`, `'rebel'`, and `'scum'`.

### `maneuvers`

This is a two dimensional array. The index in the first array is the size of the movement, starting at 0. Each sub array
is of length eight, and each index corresponds to the direction of movement, in the following order:

    1. Left Turn
    2. Left Bank
    3. Forward
    4. Right Bank
    5. Right Turn
    6. Koiogran Turn (180 degree)
    7. Left Segnor’s Loop
    8. Right Segnor’s Loop

The possible values are `null` (or anything falsey), `'red'`, `'white'`, or `'green'`, representing the difficulty of
the maneuver. This format can easily be extended in the future if new maneuvers are added to the game (or if you wish to
store _Star Trek: Attack Wing_ data), simply by defining new columns after the original 8.

There is a single special case: 0 speed maneuvers. To date, the only valid maneuver with 0 speed is the 'stationary'
maneuver. This is considered a `Forward` maneuver, for the purposes of storage.

### `size`

This is the size of the ship, and is always a string. The possible values are `'small'`, `'large'`, and `'huge'`. (Huge
ships are only valid in epic play.)

## `pilots.json`

```javascript
{
    "a53a0ecb-6ec2-4e1b-b1ee-fecb48327368": {
        "sources": [
            "Millennium Falcon Expansion Pack"
        ],
        "actions": [],
        "upgrades": [
            "elite",
            "missile",
            "crew",
            "crew"
        ],
        "unique": true,
        "name": "Han Solo",
        "canonicalName": "hansolo",
        "text": "<p>When attacking, you may reroll all of your dice.  If you choose to do so, you must reroll as many of your dice as possible.</p>",
        "skill": 9,
        "ship": "yt1300",
        "points": 46,
        "faction": "rebel",
        "attack": 3,
        "agility": 1,
        "hull": 8,
        "shields": 5,
        "id": "a53a0ecb-6ec2-4e1b-b1ee-fecb48327368"
    }
}
```

### `upgrades`

These are the upgrade slots grated to the ship by the pilot card.

### `faction`

This is the canonical faction the card belongs to. It should be considered authoritative over any other source.

### `skill`

This is the skill value of the pilot.

### `points`

This is the total point cost to field this pilot. Equipped upgrades add to this value. (In a system like _Star Trek:
Attack Wing_, this would just be the captain cost, not the ship + captain cost.)

### Stats (`attack`, `agility`, `hull`, etc.)

These stats are considered to override the stats that come with the ship.

## `upgrades.json`

These include all possible upgrades in the game, including modifications and titles.

```javascript
{
    "86866a6e-e089-43e3-b913-45a3705e52a8": {
        "size": "huge",
        "sources": [
            "Rebel Transport Expansion Pack"
        ],
        "grants": {
            "upgrades": [],
            "actions": []
        },
        "limited": false,
        "unique": false,
        "name": "Expanded Cargo Hold",
        "canonicalName": "expandedcargohold",
        "text": "<p><span class=\"restriction\">GR-75 only.</span></p><p>Once per round, when you would be dealt a faceup Damage card, you may draw that card from either the fore or aft Damage deck.</p>",
        "points": 1,
        "ship": "gr75mediumtransport",
        "type": "cargo",
        "id": "86866a6e-e089-43e3-b913-45a3705e52a8"
    }
}
```

### `size`

The size of ship this card can be equipped to. The values are `null`, `'small'`, `'large'`, `'huge'`.

### `grants`

This is a list of any overrides to the ship.pilot properties. These values are considered _additive_, instead of
absolute. For example, an upgrade with `"grants:" { "attack": 1 }` would add one to the combined attack value of the
ship it was equipped on.

### `points`

This is the total cost in points to equip this upgrade.

### `ship`

This indicates that the upgrade is limited to this ship only.

### `type`

This is the type of upgrade.

## `expansions.json`

```javascript
{
    "466b8c4f-05cc-4b8d-a699-f0a295fd3e60": {
        "cards": [
            {
                "name": "xwing",
                "count": 1,
                "type": "ship"
            },
            {
                "name": "tiefighter",
                "count": 2,
                "type": "ship"
            },
            {
                "name": "lukeskywalker",
                "count": 1,
                "type": "pilot"
            },
            {
                "name": "biggsdarklighter",
                "count": 1,
                "type": "pilot"
            },
            {
                "name": "redsquadronpilot",
                "count": 1,
                "type": "pilot"
            },
            {
                "name": "rookiepilot",
                "count": 1,
                "type": "pilot"
            },
            {
                "name": "maulermithel",
                "count": 1,
                "type": "pilot"
            },
            {
                "name": "darkcurse",
                "count": 1,
                "type": "pilot"
            },
            {
                "name": "nightbeast",
                "count": 1,
                "type": "pilot"
            },
            {
                "name": "blacksquadronpilot",
                "count": 2,
                "type": "pilot"
            },
            {
                "name": "obsidiansquadronpilot",
                "count": 2,
                "type": "pilot"
            },
            {
                "name": "academypilot",
                "count": 2,
                "type": "pilot"
            },
            {
                "name": "protontorpedoes",
                "count": 1,
                "type": "upgrade"
            },
            {
                "name": "r2f2",
                "count": 1,
                "type": "upgrade"
            },
            {
                "name": "r2d2",
                "count": 1,
                "type": "upgrade"
            },
            {
                "name": "determination",
                "count": 1,
                "type": "upgrade"
            },
            {
                "name": "marksmanship",
                "count": 1,
                "type": "upgrade"
            }
        ],
        "released": true,
        "name": "Core",
        "image": "/images/expansions/core.png",
        "id": "466b8c4f-05cc-4b8d-a699-f0a295fd3e60"
    }
}
```

### `cards`

A list of cards provided by the expansion. These cards are normalized to their canonical names, and include their type
and how many are provided by the expansion.

### `released`

This indicates that the expansion has been released.

### `image`

This is the url (relative to the server) where an image of the expansion's box can be found.
