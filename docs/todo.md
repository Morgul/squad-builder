# ToDo List

These are the issues I know are still outstanding. (Consider it a poor man's issue tracker.)

* [X] Google Account support
* [ ] Squad Builder
    * [X] Upgrade bindings are super wonky
    * [X] Print 'Build Mat'.
    * [X] Save Squad
    * [X] Delete Squad
    * [X] Save edited squad.
    * [X] Pop a warning dialog when switching factions (since we clear the current squad.)
    * [ ] Fix ui-select issues on mobile with the keyboard popping up constantly.
    * [X] Support cards that increase the number of modifications you can equip.
* [X] Card Browser
    * [X] Display cards (same format as build mat)
    * [X] Search all cards
* [X] My Collection
    * [X] List all expansions
    * [X] Allow user to specify how many of each expansion they own
    * [X] Correctly highlight cards that the user doesn't own, or has used too many of.
* [X] My Squads
    * [X] List saved squads w/ summary
    * [X] Ability to delete, edit or print build mat of squad.
    * [X] Tracking of win/loss ratios
    * [X] Allow squads to track ownership, and prevent modification to a squad you don't own.
* [X] Profile
    * [X] Ability to view information about a user
    * [X] View top squads
    * [X] View overall win/loss ratio

## 1.0.0 Features

These are the features I require before my 1.0.0 release.

* [X] Mobile Device support
    * [X] Specifically designed for use on iPad (Tested on an iPad 4th gen)
    * [X] Specifically designed for use on mobile phones (Tested on a Nexus 5)
* [X] JSON Database of cards
    * [X] Documented json schema.
    * [X] Permissive license to promote reuse of data.
    * [X] Available through a completely open REST API for other developers to leverage, if they wish.
* [X] REST API
    * [X] You can search ships, pilots, and upgrades.
    * [X] Supports filtering through equality, <, >, <=, >=.
* [X] Squads
    * [X] You are disallowed from building flagrantly invalid squads.
    * [X] You can name squads.
    * [X] You can save squads.
    * [X] You can delete squads.
    * [X] You can view a list of saved squads.
    * [X] You can edit saved squads.
    * [X] You can print a build mat for a give squad.
    * [X] You can share/link to squads.
* [X] Collection
    * [X] You can track how many of each expansion you own.
* [X] Browser
    * [X] You can search by card name.
    * [X] You can preview cards.
* [X] Accounts
    * [X] You can use Google to authenticate.
    * [X] Profile page

## Future Features

These are features I may want to add in the future.

* [ ] XWS Import/Export
* [ ] Top Squads page
* [ ] Card Browser improvements
    * [ ] Card images (toggle between build mat format and images)
    * [ ] Ability to filter cards by something other than name (type, stats, etc)
* [ ] Rules Card support
* [ ] Importer improvements
    * [ ] 'upsert' mode (current: updates existing models, inserts new ones)
    * [ ] 'clean' mode (clears existing db, imports fresh)
    * [ ] 'insert' mode (only inserts new records)
* [ ] Alternative sources
    * [ ] Attack Wing support?
    * [ ] Community built cards/ships?


