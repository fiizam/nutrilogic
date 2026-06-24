const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, 'app', 'dashboard', 'page.tsx');
let contentStr = fs.readFileSync(file, 'utf8');

const isWindows = contentStr.includes('\r\n');
const lines = contentStr.split(isWindows ? '\r\n' : '\n');

// 1. Add import
const importIdx = lines.findIndex(l => l.includes("import { HasilRekomendasi } from '@/types';"));
if (importIdx !== -1 && !contentStr.includes('PlanResult')) {
  lines.splice(importIdx + 1, 0, "import PlanResult from '@/components/PlanResult';");
}

// 2. Replace the detail view block
// Looking at the view_file output, the block starts around line 250:
// "                    <div className="rounded-3xl border border-slate-200 shadow-sm overflow-hidden bg-white">"
// And ends at line 334:
// "                    </div>"

const startBlock = '                    <div className="rounded-3xl border border-slate-200 shadow-sm overflow-hidden bg-white">';
const endBlock = '                    </div>';

const startIndex = lines.findIndex(l => l === startBlock);

// Find the corresponding end block (the one just before ");" and "})()")
let endIndex = -1;
for (let i = startIndex + 1; i < lines.length; i++) {
  if (lines[i] === endBlock && lines[i+1] === '                  );' && lines[i+2] === '                })()') {
    endIndex = i;
    break;
  }
}

if (startIndex !== -1 && endIndex !== -1) {
  const replacement = `                    <PlanResult 
                      hasil={data}
                      biometrics={{ berat: currentBerat || 0, target_berat: currentBerat || 0 }}
                      derivedTargetDiet="stabil"
                      isSavedView={true}
                      onClose={() => setSelectedPlanId(null)}
                    />`;
                    
  lines.splice(startIndex, endIndex - startIndex + 1, replacement);
  
  const separator = isWindows ? '\r\n' : '\n';
  fs.writeFileSync(file, lines.join(separator), 'utf8');
  console.log('Replaced dashboard inline view successfully');
} else {
  console.log('Failed to find boundaries in dashboard:', startIndex, endIndex);
}
