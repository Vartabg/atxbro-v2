const fs = require('fs');
const path = './src/components/Landing3D.tsx';
let content = fs.readFileSync(path, 'utf8');

// Add JetsStats import
content = content.replace(
  'import { useSpring, animated, SpringValue } from \'@react-spring/three\';',
  'import { useSpring, animated, SpringValue } from \'@react-spring/three\';\nimport JetsStats from \'./JetsStats\';'
);

// Update JetsHome interface to include JetsStats
content = content.replace(
  /(<h1 className="text-4xl font-bold mb-4">)([^<]*JetsHome[^<]*)(</h1>)/,
  '$1JetsHome Sports Analytics$3'
);

content = content.replace(
  /(<p className="text-xl mb-8">)([^<]*)(</p>)/,
  '$1Track Jets performance and stats$3'
);

// Add JetsStats component before the Back button
content = content.replace(
  /(<button onClick[^>]*>Back to Portal<\/button>)/,
  '<div className="mb-6"><JetsStats /></div>\n          $1'
);

fs.writeFileSync(path, content);
console.log('Simple JetsStats integration applied');
