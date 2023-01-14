# Stanscards
Ever wanted to play Marvel Champions solo in your browser?  That's what this project is for.
It's basically in an alpha state though.  You can and will run into wonky behavior.  I probably
won't spend too much more time on this as I'm moving onto other things, so feel free to fork
this and improve it.  If you do make a masterpiece though from my work, throwing me a credit
(or even a coffee via [my patreon](https://www.patreon.com/kphurley)) would be rad.

## I don't care about all of this tech crap, I just want to play Marvel Champions in my browser
Live link forthcoming.

### How to play
First, you need to load decks.  The game recognizes MarvelDB decks exported in OCTGN (.o8d) format, so start there. Then, use the file menu to browse for the .o8d file on your local system and upload it, which will then parse your deck and load it into the app.

Next, under file, choose `Start Game`.  This will give you a dialog to choose your villain and modulars.

A lot of the game can be played just by clicking on stuff and dragging cards around.  You can right click on decks to shuffle them, and there is a menu for decks you can get by clicking ≡ for the given deck that will allow you to do things like search for a card or move cards to other decks.  The nemesis cards for a given hero can be found in the game menu (for those fun moments when you draw Shadow of the Past).

There are a few other hotkeys needed to make things work smoothly:

E - "Exhaust" a card, usable on player cards
F - "Flips" a card - usable on the Hero
N - Go to the "Next" villain or main scheme card, usable only while the Villain or Main Scheme card is selected
P - Go to the "Previous" villain card, usable only while the Villain or Main Scheme card is selected
R - "Reveal" a card - usable only on encounter or Main Scheme cards
D - "Discard" a card, usable on any in-play card, will go to the discard pile
  - "Draw" a card, this happens when a face-down deck is selected
  - "Delete" a token, when it is selected

Speaking of tokens:

- Click on the token you want to spawn it, then just drag it to the right place
- For tokens with amounts, use + and - to increment/decrement the amount

Keeping track of hero/villain health:
Use the provided - and + buttons on the screen

Hopefully that covers it.  The app is a little rough, but it definitely is usable.  []

### Any automations for this like in Tabletop Sim?
Nope, sorry.  I wanted this to feel like I was playing with the real cards.  Plus I don't have the time to maintain this as it is.  Feel free to fork this project and implement that yourself!

## Hacking on this project
### Prerequisites

- node.js
- Ability to do things on a terminal (the below assumes a Unix-like environment)

### Installation

- Clone this project - `git clone ...` 
- `cd stanscards`
- `npm install`
- `npm start`
- visit `http://localhost:8080/`

### Working with marvelcdb.com data

In order to keep the app current with the latest hotness from marvelcdb.com, there are a couple of scripts in the `/scripts` folder.
These are there to keep encounterData.json and heroData.json current, which the app relies on for its data.

To keep this data current, we do the following:

- Run `npm run proxy` in one terminal window.  In order to get around CORS issues, we need to proxy requests to marvelcdb.com.  To do this, we're using a library called local-cors-proxy.  In order to make to API calls to marvelcdb resolve when running the project locally, we need to make sure this proxy service is running before we start the app, otherwise certain data fetches we need from the API to set all of the information up won't resolve properly.
- In another window, run each script:  `npm run config:encounterCards` and `npm run config:heroCards`
- This will update the `encounterData.json` and `heroData.json` files, which need to then be committed.

### Known issues

- The app doesn't currently handle special heroes that have multiple cards, or three-sided cards, like Ant-Man or Ironheart
- Some of the images don't resolve properly (show as broken images)
- Some of the tokens can "jump" around on the screen when state updates happen, fixing this likely involves moving the local state of each draggable to the app state
