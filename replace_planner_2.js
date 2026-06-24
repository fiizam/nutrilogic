const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, 'app', 'planner', 'page.tsx');
const contentStr = fs.readFileSync(file, 'utf8');
// Handle both \r\n and \n correctly when splitting
const isWindows = contentStr.includes('\r\n');
const lines = contentStr.split(isWindows ? '\r\n' : '\n');

const startIdx = 422; // 0-indexed for line 423
const endIdx = 698;   // 0-indexed for line 699

if (lines[startIdx].includes('<motion.div') && lines[endIdx].includes('</motion.div>')) {
  const replacement = `            <PlanResult 
              hasil={hasil}
              biometrics={{ berat: formData.berat, target_berat: formData.target_berat }}
              derivedTargetDiet={derivedTargetDiet}
              onSave={() => setShowSaveModal(true)}
              session={session}
            />`;
  
  lines.splice(startIdx, endIdx - startIdx + 1, replacement);
  
  const separator = isWindows ? '\r\n' : '\n';
  const newContent = lines.join(separator);
  const finalContent = newContent.replace("import Link from 'next/link';", "import Link from 'next/link';\nimport PlanResult from '@/components/PlanResult';");
  fs.writeFileSync(file, finalContent, 'utf8');
  console.log('Replaced successfully by line');
} else {
  console.log('Line mismatch!');
  console.log('Start line (423):', lines[startIdx]);
  console.log('End line (699):', lines[endIdx]);
}
