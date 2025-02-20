## v2.0.0
* BREAKING CHANGE: references made with prefix \@ are not loaded from other files automatically, use \@filename:refname in that case.
* Object inheritance is now supported: "animal": { \<fields> }, "cat@animal": { \<additional fields> }.
* Now it is possible to declare nested arrays: "matrix2x2": [["double"]].
* Compiler rewritten from scratch: cleaner code, better more informative error handling.
* Compiler command line now accepts file names (optionally): packme \<srcDirectory> \<outDirectory> [file1, file2, file3...].

## v1.1.0
* Added support for binary type (uses Uint8List). Format: binary<LENGTH>, for example: binary12.
* Color schemes used to print messages are updated: list items are now displayed using color of corresponding data type.

## v1.0.0
* Enums and Types can be referenced from another manifest files.
* Enum declaration implemented.
* Type (nested object) declaration implemented.
* Single message or request and response messages declaration implemented.
* $response method for request messages implemented.
* Example provided.

