const fs = require('fs');
const path = require('path');
const files = ['index.html', 'service.html', 'location.html', 'destinations.html'];
files.forEach(file => {
  let p = path.join(process.cwd(), file);
  if (!fs.existsSync(p)) return;
  let content = fs.readFileSync(p, 'utf8');
  content = content.replace(/<a href="index\.html" class="logo">HOLIDAY PLANNER<\/a>/g, '<a href="index.html" class="logo" style="display:flex; align-items:center;"><img src="/images/logo.png" alt="Holiday Planner" style="height: 50px;"></a>');
  content = content.replace(/<h2 class="logo">HOLIDAY PLANNER<\/h2>/g, '<h2 class="logo"><img src="/images/logo.png" alt="Holiday Planner" style="height: 60px;"></h2>');
  content = content.replace(/<h1 class="loader-logo">HOLIDAY PLANNER<\/h1>/g, '<h1 class="loader-logo"><img src="/images/logo.png" alt="Holiday Planner" style="height: 100px;"></h1>');
  fs.writeFileSync(p, content);
});
