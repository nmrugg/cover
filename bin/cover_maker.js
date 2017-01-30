#!/usr/bin/env node

var cover_maker = require(require("path").join(__dirname, "..", "cover_maker.js"));


function color(color_code, str)
{
    return "\u001B[" + color_code + "m" + str + "\u001B[0m";
}

function hightlight(str)
{
    return color(33, str);
}

function note(str)
{
    return color(36, str);
}

if (process.argv[2] && process.argv[3] && process.argv[4]) {
    console.log(cover_maker.generate(process.argv[2], process.argv[3], process.argv[4], process.argv[5]));
} else {
    if (process.argv[2] || process.argv[3] || process.argv[4]) {
        console.log("Invalid input");
    }
    console.log("");
    console.log("Usage: " + hightlight("cover_maker.js") + " " + note("Page_Width") + " " + note("Page_Height") + " " + note("Page_Count") + " [" + note("Page_Type") + "]");
    console.log("");
    console.log(note("Page_Width") + " and " + note("Page_Height") + " must be in inches.");
    console.log(note("Page_Count") + " is the total number of pages in the book (each leaf is two pages).");
    console.log(note("Page_Type") + " can be " + hightlight("white") + ", " + hightlight("cream") + ", or " + hightlight("color") + ".");
    console.log(note("Page_Type") + " defaults to " + hightlight("white") + ".");
    console.log("");
}
