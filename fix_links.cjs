const fs = require('fs');
const files = ['index.html', 'main.js', 'destinations.html'];
files.forEach(f => {
  if (fs.existsSync(f)) {
    let content = fs.readFileSync(f, 'utf8');
    content = content.replace(/href="service\?/g, 'href="service.html?');
    content = content.replace(/href="location\?/g, 'href="location.html?');
    content = content.replace(/window\.location\.href = `destinations\?/g, 'window.location.href = `destinations.html?');
    fs.writeFileSync(f, content);
  }
});
console.log('Fixed links!');
