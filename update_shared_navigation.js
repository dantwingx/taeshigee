const fs = require('fs');
const path = require('path');

const languageFiles = [
  'src/i18n/fr.ts',
  'src/i18n/es.ts',
  'src/i18n/de.ts',
  'src/i18n/ja.ts',
  'src/i18n/zh.ts',
  'src/i18n/it.ts',
  'src/i18n/pt.ts',
  'src/i18n/ru.ts',
  'src/i18n/ar.ts',
  'src/i18n/hi.ts',
  'src/i18n/th.ts',
  'src/i18n/vi.ts',
  'src/i18n/id.ts',
  'src/i18n/sv.ts',
  'src/i18n/nl.ts',
  'src/i18n/pl.ts',
  'src/i18n/tr.ts',
  'src/i18n/ms.ts'
];

const translations = {
  'src/i18n/fr.ts': 'shared: "Partagé"',
  'src/i18n/es.ts': 'shared: "Compartido"',
  'src/i18n/de.ts': 'shared: "Geteilt"',
  'src/i18n/ja.ts': 'shared: "共有"',
  'src/i18n/zh.ts': 'shared: "共享"',
  'src/i18n/it.ts': 'shared: "Condiviso"',
  'src/i18n/pt.ts': 'shared: "Compartilhado"',
  'src/i18n/ru.ts': 'shared: "Общий"',
  'src/i18n/ar.ts': 'shared: "مشترك"',
  'src/i18n/hi.ts': 'shared: "साझा"',
  'src/i18n/th.ts': 'shared: "แชร์"',
  'src/i18n/vi.ts': 'shared: "Chia sẻ"',
  'src/i18n/id.ts': 'shared: "Dibagikan"',
  'src/i18n/sv.ts': 'shared: "Delad"',
  'src/i18n/nl.ts': 'shared: "Gedeeld"',
  'src/i18n/pl.ts': 'shared: "Udostępnione"',
  'src/i18n/tr.ts': 'shared: "Paylaşılan"',
  'src/i18n/ms.ts': 'shared: "Dikongsi"'
};

languageFiles.forEach(filePath => {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Replace analytics with shared in navigation section
    const regex = /(\s+)(analytics:\s*"[^"]*")(,?)/;
    const replacement = `$1${translations[filePath]}$3`;
    
    content = content.replace(regex, replacement);
    
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated ${filePath}`);
  } catch (error) {
    console.error(`Error updating ${filePath}:`, error.message);
  }
});

console.log('All language files updated successfully!'); 