const fs = require('fs');

const filePath = 'd:\\FYP\\FYP PORTAL CODE\\BE-BackUpBeforeWholeIntegration\\BE-BackUpBeforeWholeIntegration\\server\\controllers\\CoordinatorController\\EvaluateExamCont.js';
const lines = fs.readFileSync(filePath, 'utf8').split('\n');

const fix = `          },
        ],
      });`;

console.log('Line 1787:', lines[1787]); // Should be something like "          });"
console.log('Line 1936:', lines[1936]); // Should be something like "          });"

if (lines[1787].trim() === '});') {
    lines[1787] = fix;
}
if (lines[1936].trim() === '});') {
    lines[1936] = fix;
}

fs.writeFileSync(filePath, lines.join('\n'), 'utf8');
console.log('File updated via indices.');
