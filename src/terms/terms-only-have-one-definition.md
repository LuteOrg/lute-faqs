# Why do Terms only have one definition?

Some words don't just mean one thing.  For example, in German, "Arm" can mean either the body part ("Mein Arm tut weh", "my arm hurts"), or poor ("Der Mann ist arm", "the man is poor"); in English, "can" means different things in the sentences "he can play guitar" vs "he drank a can of pop".

There have been requests to allow for [multiple translation fields](https://github.com/LuteOrg/lute-v3/issues/198), with different statuses and parents for each of these, to allow for multiple shades of meaning.

Currently Lute only allows for a single translation (and single status) for each word.  That's not really an accurate model for real world language, but it vastly simplifies usage and coding.

First, as a user, I don't want to get buried in managing different statuses etc. for shades of meanings of a word.  Granted, I could potentially only use a single definition box and status for a term, even if that doesn't quite match the real "mental model" of a language.  For example, my "Arm" entry could have "1. arm (body part); 2. poor.", and I might know the first definition very well but not the second!

The real challenges for this come on the implementation and usability side.  Given the German "Arm/arm" example above, here are some initial questions:

* For reading, Lute renders different statuses as different colors.  Given the sentence "Arme Jungen sind hier," which could be eiher "Arm" or "arm", I'm not sure how the UI should behave.  Default to the lowest status?  Show some combination of colors?
* Currently page rendering outputs the word id and status id as part of the data for each element, which are used by hotkeys and various actions.  Hotkeys would either no longer function, or only function in bulk, if a word had multiple statuses.
* Parent selection would need to change.  For "Die armen Jungen", "armen" would need the parent "Arm (poor)" vs "Arm (arm)".
* CSV imports would likely not be possible for terms with multiple meanings.  If my CSV file had "arm / poor", would that be an update to an existing definition, or would it be a brand new row?  Or would there need to be some way to disambiguate the data, i.e. with a new "disambiguation key" field in the UI?
* One feature that Lute needs (in my opinion) is the ability to select specific sentences from texts, and associate with them with terms. Currently Lute just looks up recent sentences for a term.  If a term has multiple definitions, then the sentences would need to be associated with those different definitions ... somehow.  It makes sense to think of things that way, but in my mind this starts to feel rather unwieldy as a user.
* Anki exports currently run for Terms.  If I wanted to export a different meaning, the Anki export would need to have an intermediate step where users select the term and then the meaning to export.  (It’s actually tricky to manage no matter what you do ... Anki and AnkiConnect don’t like duplicate "note keys" ...)

In terms of database design, there are a couple of options:

* option 1: remove the uniqueness constraint of the word in the `words` table.
* option 2, way way harder: create a `wordmeanings` table, move most of the current `words` table fields over there, change all relationships code etc ... have fun with that.
