const fs = require('fs');
const path = require('path');

const directoryPath = path.join(__dirname, 'src/pages/dashboard');

const replacements = [
  { regex: /bg-slate-50/g, replacement: 'bg-muted' },
  { regex: /text-slate-900/g, replacement: 'text-foreground' },
  { regex: /bg-white/g, replacement: 'bg-card' },
  { regex: /border-slate-100/g, replacement: 'border-border' },
  { regex: /border-slate-200/g, replacement: 'border-border' },
  { regex: /text-slate-800/g, replacement: 'text-card-foreground' },
  { regex: /text-slate-700/g, replacement: 'text-foreground' },
  { regex: /text-slate-600/g, replacement: 'text-muted-foreground' },
  { regex: /text-slate-500/g, replacement: 'text-muted-foreground' },
  { regex: /text-slate-400/g, replacement: 'text-muted-foreground' },
  { regex: /text-slate-300/g, replacement: 'text-muted-foreground' },
  { regex: /bg-slate-100/g, replacement: 'bg-accent' },
  { regex: /bg-slate-200/g, replacement: 'bg-accent' },
  { regex: /hover:bg-slate-50/g, replacement: 'hover:bg-accent' },
  { regex: /hover:bg-slate-100/g, replacement: 'hover:bg-accent' },
  { regex: /hover:bg-slate-200/g, replacement: 'hover:bg-accent' },
  { regex: /text-indigo-500/g, replacement: 'text-primary' },
  { regex: /text-indigo-600/g, replacement: 'text-primary' },
  { regex: /text-indigo-700/g, replacement: 'text-primary' },
  { regex: /hover:text-indigo-700/g, replacement: 'hover:text-primary' },
  { regex: /bg-indigo-50/g, replacement: 'bg-primary/10' },
  { regex: /bg-indigo-500/g, replacement: 'bg-primary' },
  { regex: /bg-indigo-600/g, replacement: 'bg-primary' },
  { regex: /text-rose-500/g, replacement: 'text-destructive' },
  { regex: /text-rose-600/g, replacement: 'text-destructive' },
  { regex: /bg-rose-50/g, replacement: 'bg-destructive/10' },
  { regex: /bg-emerald-50/g, replacement: 'bg-success/10' },
  { regex: /bg-emerald-100/g, replacement: 'bg-success/20' },
  { regex: /text-emerald-500/g, replacement: 'text-success' },
  { regex: /text-emerald-600/g, replacement: 'text-success' },
  { regex: /ring-indigo-500/g, replacement: 'ring-ring' },
];

function replaceInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  replacements.forEach(({ regex, replacement }) => {
    content = content.replace(regex, replacement);
  });
  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Updated:', filePath);
}

function traverseDirectory(dir) {
  fs.readdirSync(dir).forEach(file => {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      traverseDirectory(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      replaceInFile(fullPath);
    }
  });
}

traverseDirectory(directoryPath);
