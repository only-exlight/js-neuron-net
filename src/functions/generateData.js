const fs = require('fs');
const learn = [];

for (let i = 1; i <= 150; i++) {
    learn.push({
        image: 'training/' + i + '.png',
        isSquare: false
    });
}

const json = JSON.stringify(learn);

fs.appendFileSync('learn.json', json);