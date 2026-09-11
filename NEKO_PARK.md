# ALXENA Neko Park

Neko Park is an original ALXENA chicken-park mini game inspired by the supplied reference screenshot.

## Current build
- Chicken player character
- Park scene, hills, clouds, bridge and coin pickups
- Touch controls for left/right/jump
- Emote buttons
- Hard touch/scroll locking for the AIRich HTML viewport

## Multiplayer
Cross-device realtime multiplayer is intentionally not faked. A real multiplayer mode requires a public realtime backend (WebSocket or Firebase) that can synchronize player position, emotes, room membership and disconnects.
The next architecture can add this without duplicating the game HTML for each account.
