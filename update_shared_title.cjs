const fs = require('fs');

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
  'src/i18n/fr.ts': 'sharedTitle: "Partagé"',
  'src/i18n/es.ts': 'sharedTitle: "Compartido"',
  'src/i18n/de.ts': 'sharedTitle: "Geteilt"',
  'src/i18n/ja.ts': 'sharedTitle: "共有"',
  'src/i18n/zh.ts': 'sharedTitle: "共享"',
  'src/i18n/it.ts': 'sharedTitle: "Condiviso"',
  'src/i18n/pt.ts': 'sharedTitle: "Compartilhado"',
  'src/i18n/ru.ts': 'sharedTitle: "Общий"',
  'src/i18n/ar.ts': 'sharedTitle: "مشترك"',
  'src/i18n/hi.ts': 'sharedTitle: "साझा"',
  'src/i18n/th.ts': 'sharedTitle: "แชร์"',
  'src/i18n/vi.ts': 'sharedTitle: "Chia sẻ"',
  'src/i18n/id.ts': 'sharedTitle: "Dibagikan"',
  'src/i18n/sv.ts': 'sharedTitle: "Delad"',
  'src/i18n/nl.ts': 'sharedTitle: "Gedeeld"',
  'src/i18n/pl.ts': 'sharedTitle: "Udostępnione"',
  'src/i18n/tr.ts': 'sharedTitle: "Paylaşılan"',
  'src/i18n/ms.ts': 'sharedTitle: "Dikongsi"'
};

languageFiles.forEach(filePath => {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Add sharedTitle after title in analytics section
    const regex = /(\s+title:\s*"[^"]*",)/;
    const replacement = `$1\n    ${translations[filePath]},`;
    
    content = content.replace(regex, replacement);
    
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated ${filePath}`);
  } catch (error) {
    console.error(`Error updating ${filePath}:`, error.message);
  }
});

console.log('All sharedTitle keys added successfully!'); 