# Why can't I change a Term?

Lute won't let you change a Term's actual text once it has been created and saved, you can only change the case of existing characters.  For example, you could change "CAT" to "Cat" or "cat", but not to "dog".

Allowing Terms themselves to be changed once created creates potential problems, so (for now) Lute just disables that.

> _As I get more experience with this feature of Lute, I may do away with this restriction._

Reasons for this restriction:

* During reading, if you click on an unknown word, and decide to change the term's capitalization, Lute won't let you mis-type the word.  For example, if you're reading a shocking Spanish newspaper article about "GATOS SALVAJES" (wild cats!), you might want to save the term "GATOS", but as lowercase "gatos".  Lute stops you from typing "gattos" during the fix, so the new term is created correctly.

* changing a term can cause unexpected data and/or behaviour.  For example, if you're reading Spanish, and click on the term "gatito", but edit it to "gato", what is the intent?  "Gatito" would not be updated on the reading pane.  You'd be creating another term, if it didn't already exist.  Also, sometimes people misunderstand Lute terms, and enter various inflections or plural forms of words in the term box (e.g., they change "cats" to "cats (cat)", or similar) ... this would result in terms that Lute would never end up using.

* suppose I have the word Spanish "tengo", with the translation "to have".  Then I decide that this should really be "tener", so I edit it ... but now "tengo" has been lost.

When I was developing Lute, the idea of changing a word's spelling just felt wrong -- a word is a word, and me changing it doesn't mean the word itself has changed, if that makes sense.