var fs = require('fs');
var c = fs.readFileSync('question_data.js', 'utf8');
// Search for 48 in different formats
console.log('"id":48:', c.indexOf('"id":48'));
console.log('"id": 48:', c.indexOf('"id": 48'));
console.log('"id":49:', c.indexOf('"id":49'));
console.log('"id": 49:', c.indexOf('"id": 49'));

// Find what's between id=47 and id=49
var idx47 = c.indexOf('"id": 47');
var idx49 = c.indexOf('"id": 49');
if(idx47 >= 0 && idx49 >= 0) {
    var between = c.substring(idx47, idx49);
    console.log('Between 47 and 49, length:', between.length);
    // Show last 300 chars of this section
    console.log('End of q48 area:', JSON.stringify(between.substring(between.length - 300)));
}
