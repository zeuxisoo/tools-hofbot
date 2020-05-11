# Tools HofBot

A tools for automatelly to do easy action on defined webpage

## Usage

Install the dependencies

    yarn install

Or you can using the `npm`

    npm install

Copy the default settings

    cp settings.json.example settings.json

Edit the default settings like login name, password, attack time settings and so on

    nano settings.json

## Action List

Attack the monster

    node index.js attack -t monster

Attack the boss

    node index.js attack -t boss

List your char

    node index.js char -l

List the monster

    node index.js monster -l

List the boss

    node index.js boss -l

Watering time tree

    node index.js timetree
