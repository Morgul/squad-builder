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

Some fields have universal meanings and rules across all data.

### `id`

This is a uuid (version 4). These are guaranteed to be unique across the data, but there is no guarantee that these ids
will be shared across different applications; if you need cross compatibility, you should use `canonicalName`.

### `name`

This is a string that should match the name printed on the card. While these should be unique, no formal guarantee is
made, as there may be legitimate reasons to have duplicate names. If you are looking for a unique id, use either `id` or
`canonicalName`.

### `canonicalName`

This is a lowercase string adhering to the [xws](https://github.com/elistevens/xws-spec#canonical-unique-ids) canonical
unique id specification. These ids can (and should!) be used as the primary way of referencing cards.

### `factions`

This is always an array. These are the factions a card can be played as. Some cards (like the Y-Wing) are in multiple
factions. The possible values are `'empire'`, `'rebel'`, and `'scum'`.

### `actions`

This is always an array. These are the actions a ship can take. They are always lower case. The possible values are
`'barrel-roll'`, `'boost'`, `'cloak'`, `'coordinate'`, `'evade'`, `'focus'`, `'jam'`, `'recover'`, `'reinforce'`, and
`'target-lock'`.

### `unique`

This is a boolean value. It indicates if the card should be considered unique, for rules purposes.

## `ships.json`

```javascript
{
    "458ca0db-88d1-44a7-a8bf-a0165aac7021": {
        "factions": [ "empire" ],
        "actions": [ "focus", "target-lock" ],
        "maneuvers": [
            [ null, null, null, null, null, null ],
            [ null, "white", "white", "white", null, null ],
            [ "white", "green", "green", "green", "white", null ],
            [ "white", "white", "green", "white", "white", null ],
            [ null, null, "white", null, null, null ]
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

_To be defined at a later date._

## `upgrades.json`

These include all possible upgrades in the game, including modifications and titles.

_To be defined at a later date._

## `expansions.json`

_To be defined at a later date._
