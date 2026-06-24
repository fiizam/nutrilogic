const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, 'app', 'planner', 'page.tsx');
let content = fs.readFileSync(file, 'utf8');

// Replace import
content = content.replace("import Link from 'next/link';", "import Link from 'next/link';\nimport PlanResult from '@/components/PlanResult';");

// Find start and end block
const startStr = '            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="space-y-6">';
const endStr = '            </motion.div>\r\n          )}';

const startIndex = content.indexOf(startStr);
const endIndex = content.indexOf(endStr, startIndex);

if (startIndex !== -1 && endIndex !== -1) {
  const replacement = `            <PlanResult 
              hasil={hasil}
              biometrics={{ berat: formData.berat, target_berat: formData.target_berat }}
              derivedTargetDiet={derivedTargetDiet}
              onSave={() => setShowSaveModal(true)}
              session={session}
            />`;
  
  // Also fix the end index depending on line endings
  // `endIndex + endStr.length` gets us to the end of `)}`
  // We want to replace from `startIndex` to the end of `</motion.div>`
  
  const actualEndIndex = content.indexOf('</motion.div>', startIndex);
  if (actualEndIndex !== -1) {
    const finalEndIndex = actualEndIndex + '</motion.div>'.length;
    const newContent = content.slice(0, startIndex) + replacement + content.slice(finalEndIndex);
    fs.writeFileSync(file, newContent, 'utf8');
    console.log('Replaced successfully');
  } else {
    console.log('End of motion.div not found');
  }
} else {
  console.log('Failed to find boundaries', startIndex, endIndex);
}
