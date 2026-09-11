# ALXENA AIRich Branding Notes

Branding visible to users in the game has been changed from NIXEL to ALXENA.

- Game command: `.alxena`
- Aliases: `.gamecenter`, `.alxenagames`
- Game labels/watermark text: `ALXENA DINO`, `ALXENA DOOM`
- AIRich display text: `> ALXENA`
- Dino local/session storage keys were namespaced to ALXENA.
- Doom touch controls were updated so accidental vertical swipes do not rotate the camera or scroll the embedded game.

Some strings intentionally remain unchanged because they are protocol/dependency identifiers required for AIRich compatibility, including `@sairidev/baileys-new`, `FOAIDNixelButtonSheets`, and the AIRich source metadata used by the renderer. Renaming those technical identifiers would break the integration.

The original SairiDev license/credit notices were not altered.
