# ToDo List

These are the issues I know are still outstanding. (Consider it a poor man's issue tracker.)

* [X] Google Account support
* [X] Squad Builder
    * [X] Upgrade bindings are super wonky
    * [X] Print 'Build Mat'.
    * [X] Save Squad
    * [X] Delete Squad
    * [X] Save edited squad.
* [X] Card Browser
    * [X] Display cards (same format as build mat)
    * [X] Search all cards
* [ ] My Collection
    * [ ] List all expansions
    * [ ] Allow user to specify how many of each expansion they own
    * [ ] Correctly highlight cards that the user doesn't own, or has used too many of.
* [ ] My Squads
    * [ ] List saved squads w/ summary
    * [ ] Ability to delete, edit or print build mat of squad.
    * [ ] Tracking of win/loss ratios
* [ ] Profile
    * [ ] Ability to view information about a user
    * [ ] View top squads
    * [ ] View overall win/loss ratio

## 1.0.0 Features

These are the features I require before my 1.0.0 release.

* [X] Mobile Device support
    * [X] Specifically designed for use on iPad (Tested on an iPad 4th gen)
    * [X] Specifically designed for use on mobile phones (Tested on a Nexus 5)
* [ ] JSON Database of cards
    * Documented json schema.
    * [X] Permissive license to promote reuse of data.
    * [X] Available through a completely open REST API for other developers to leverage, if they wish.
* [X] REST API
    * [X] You can search ships, pilots, and upgrades.
    * [X] Supports filtering through equality, <, >, <=, >=.
* [ ] Squads
    * [X] You are disallowed from building flagrantly invalid squads.
    * [X] You can name squads.
    * [X] You can save squads.
    * [X] You can delete squads.
    * [ ] You can view a list of saved squads.
    * [X] You can edit saved squads.
    * [X] You can print a build mat for a give squad.
    * [X] You can share/link to squads.
* [ ] Collection
    * [ ] You can track how many of each expansion you own.
* [X] Browser
    * [X] You can search by card name.
    * [X] You can preview cards.
* [X] Accounts
    * [X] You can use Google to authenticate.
    * [ ] Profile page

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


