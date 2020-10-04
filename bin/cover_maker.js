#!/usr/bin/env node

var cover_maker = require(require("path").join(__dirname, "..", "cover_maker.js"));
var highlight = cover_maker.highlight;
var note = cover_maker.note;

if (process.argv[2] && process.argv[3] && process.argv[4]) {
    console.log(cover_maker.generate(process.argv[2], process.argv[3], process.argv[4], process.argv[5]));
} else {
    if (process.argv[2] || process.argv[3] || process.argv[4]) {
        console.log("Invalid input");
    }
    console.log("");
    console.log("Usage: " + highlight("cover_maker.js") + " " + note("Page_Width") + " " + note("Page_Height") + " " + note("Page_Count") + " [" + note("Page_Type") + "]");
    console.log("");
    console.log(note("Page_Width") + " and " + note("Page_Height") + " must be in inches.");
    console.log(note("Page_Count") + " is the total number of pages in the book (each leaf is two pages).");
    console.log(note("Page_Type") + " can be " + highlight("white") + ", " + highlight("cream") + ", or " + highlight("color") + ".");
    console.log(note("Page_Type") + " defaults to " + highlight("white") + ".");
    console.log("");
}
