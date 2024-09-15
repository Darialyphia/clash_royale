# Design Document

## About this Document
This document is not a binding specification and represents more a initial draft idea for the project.

It is inteded to be treated as a living document.

## Inspiration
- [Clash Royale](https://clashroyale.fandom.com/wiki/Basics_of_Battle)
- [Minion Masters](https://minionmasters.fandom.com/wiki/Minion_Masters)

## Project stack
- Game Client: [ExcaliburJS](https://excaliburjs.com/)
- Game UI: To be decided
- Back end datastore: [Convex](https://www.convex.dev/) 
- Serverless game server: [Hathora](https://hathora.dev/)

## Core gameplay.

### Game Goal / Setup
- The battlefield is made of two sides (one per player), connected with 2 narrow bridges that act as choke points.
- Two players play against each other and try to destroy the opponent's towers
- Each player has 2 outer towers and one inner tower
- A player wins if they destroy the inner tower, even if all outer towers aren't destroyed
- An inner tower can only be attacked once at elast one outer tower has been destroyed
- To achieve this, players use a deck of cards that allows them to summon units or cast spells

### Cards
- To play cards, player need to have enough mana. Mana increases flatly over time up to a point.
- To play a unit, you click the card then click where you want to deploy the unit. You can only summon unit on your isde of the battlefield, unless the unit has a special effect specifying otherwise.
- Unit walk towards the nearest enemy tower, and will attack the closest unit that comes within their aggro range. Once they have a target, they attack it until it dies or goes out of their aggro range..
- Spells have effects that will deal damage or inflct negative / positive effects to units and tower within an certain area of effect. 
- Cards can be played multiple times. Once played, a card goes in a discard pile which gets put back into the deck once the deck is empty.
- Players are able to see the cards in their hand, as well has the "next" card they will draw once they play a card.
- To prevent lots of cards in rapid succession, The "next" card slot only gets filled up after a small delay once a card is play (in Clash royale it's +/- 2 seconds).

### Units
- Units have a small spawing time (about 1sec). Once this time is up, they're on the field and start moving / attacking.
- Units will by default walk towards the nearest valid tower.
- Units have an aggro and attack range. Once a enemy enters the aggro range, the unit walks towards it until it is in attack range then starts attacking.
- Units will follow their target until it exits their aggro range. This can happen if, for example, the target moves much faster than the unit.
- While they're attacking, units stop moving.
- Some units are flying and can only be attacked by ranged units.
- Some units can only attack towes and will ignore  other units.
- There is are collisions between units.

## Development milestones

### Phase 1
Get the core gameplay working locally client side, the user controlling only one of the players and the other one doing nothing. At this pont the player decks will be hardcoded with simple cards.

### Phase 2
Add an AI controlling the second player. The game is still played on the client without the need of a back end. The game could be released at that stage in order to get user feedback. Players could choose between a few different decks.

### Phase 3
Extracting the core game logic away from the client and adding the Hathora integration to have a game server running the backen logic, enabling multiplayer. layers would get access to a deckbuilder screen with all cards unlocked.

### Phase 4
Work on the persistance layer to enable features such as :
- user accounts, 
- card collection, 
- leaderboards, 
- friend list.

### Phase 5
Improve the game and keep adding new cool, but less important features. For example:
- Cosmetics: map / tower skins, titles, emotes
- 2 vs 2,
- spectator mode
- additional mechanics
- new cards / balance adjustments.
- new mechanics (Minion Masters has interesting ideas lke hero abilities)
- monetization (who knows ?)

## To be decided
- What would be the standard way for people to find a game ? (matchmaking VS lobbies)
- how to add AI (separate game mode / matching players vs bots to prevent long waiting times)
- What about mobile ?
