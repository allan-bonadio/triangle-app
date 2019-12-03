# Triangle App

This app asks for the lengths of 3 sides of a triangle.  Then it analyzes it and displays what kind it is (scalene, isoscoles or equilateral) and any problems it encountered.

To run: drag the file index.html into your browser.

## Testing

In the root directory, run test.sh .  This will generate index.testing.html from index.html .  It will then attempt to open it in your handy dandy browser with the 'open' command.  I think this is mac-only; if it doesn't work, just grab that file and open it in your browser.  The test results are on the right after you load the page.

The test uses standalone-jasmine 3.5, which is in the jasmine directory (fresh from the website).  The tests are in triangle-app.test.js .

## Files

300 lines of code.

* index.html - main html file; run this to start
* triangle-app.js - main code
* icon.png - the TS icon
* jquery.js - used by js
* README.md - this file

for testing:

* index.testing.html alternate html file for running Jasmine
* jasmine/ - jasmine test library itself
* test.sh - runs the test
* triangle-app.test.js - the spec/test file with jasmine tests


## Colophon

I was going to write this in React, but I created an app and node_modules had like 1000 modules in it.  Exactly 1000 in fact.  And I thought, this is a simple project, there shouldn't be 1000 of anything.  So I did it in plain JS/HTML/jQuery.

The SVG I added thinking it would be easy.  Was more details than I expected.  It was just for fun.  It forced me to confront situations where the three numbers didn't make a triangle, which should also be handled.

