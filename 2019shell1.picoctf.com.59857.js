/* 
Warning:
I did include the final key in this file.

CTF URL:
http://2019shell1.picoctf.com:59857/

Writeup:
Analyzing the HTML file I was reviewing what the Javascript in the head tag was doing. At
first it wasn't obvious what my goal was but besides to fix the corrupted PNG. To go about 
fixing the PNG was new to me and all I knew from reviewing the script is that my `key` had to
be 16 characters exactly and the bytes that were being requested were arranged in a way where you had to find the correct offset.

Because it was a QR code in my head I thought I needed to know the internals of how a QR code works and how you can generate one from scratch. Reading on up a QR code tutorial it gave me the knowledge how this
code is structured. But I realized that my goal was to generate a QR code that is a PNG and the path I  was initially taking wasn't correct. 

Because I was working with bytes of a PNG I started to do research on how the PNG format is structured. I found an article explaining that every valid PNG should start with a file signature of 137 80 78 71 13 10 26 10. I started to review the bytes and I noticed that the file signature did exist but it was in the incorrect order. Playing around with characters that could achieve the first value of 137 made me realize I had to find the correct character that would point to the correct offset to return a valid PNG. Because the file signature was only 8 characters this meant there were 8 characters more that I needed. Circling back to the PNG article I found out directory after the file signature was a header sequence and in ASCII it was the `IHDR` header. Using the same approach I did with the file signature I started to review the bytes to see if I could find these values. Sure sure enough, I did. 

This made be realize that it seemed that I had to construct the fist 16 bytes of a PNG. Because I've never seen an hex dump of a PNG. I decided to review a hex dump of a PNG and review the output with the bytes I was given. After reviewing I did find this sequence of 0 0 0 13. I've seen this before while reviewing hex dumps of JPEGs and I knew this had to be some kind of market to notate that the next chunk or header was coming up.

This gave me all the pieces to the puzzle. I started to use this formula within the console (index * 16) + offset. Which the value returned would be used in the bytes array. Slowly, I started to realize that I was returning the correct sequence that I thought was needed for the key. Manually doing this until I saw a pattern got me excited and I quickly finished the key. When I had a 16 character key I thought I found the correct value but the PNG was still broken. I was almost sure this is what the challenged wanted and I was confused why it didn't work even though it seemed correct. I went to review the bytes again and I noticed that the values I was looking for had duplicates. That meant there could be more then one value for some of these characters at a specific offset. I wrote a quick script that wrapped my solution and formula I was previously using to generate all possible values that this key needed.

Reviewing the output allowed me to manually input the possible values until the QR code appeared. This made me happy because it meant I was on the right track from the beginning.

Key:
4549618526012495

Resources:
http://www.libpng.org/pub/png/spec/1.2/PNG-Structure.html
http://www.asciitable.com/
https://www.youtube.com/watch?v=BLnOD1qC-Vo
*/

let key = [];
let pngSequence = [
  137,
  80,
  78,
  71,
  13,
  10,
  26,
  10,
  0,
  0,
  0,
  13,
  73,
  72,
  68,
  82
]

let offset = 0;
pngSequence.forEach(item => {
  let index = 0;
  let value = 0;
  let possibleValues = [];

  // Index that is returned will be used in the key
  // must be lower than 9
  while (index <= 9) {
    // Return the byte
    value = bytes[(index * 16) + offset];

    // Create a sub array that will contain
    // all possible values for this key. Try
    // each possible value to return QR code
    if (value === item) {
      possibleValues.push(index)
    }

    // Increase index
    index++;
  }

  // Increase offset
  offset++;

  // Push all possible values for this item
  key.push(possibleValues);
});