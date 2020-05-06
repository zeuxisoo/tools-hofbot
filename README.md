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

Start to run the action

    node index.js attack

## Note

How to find the char id on your account, run the following command to get the char list

    node index.js char -l
