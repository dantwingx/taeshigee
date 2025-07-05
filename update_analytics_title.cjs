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
  'src/i18n/fr.ts': 'title: "Partagé"',
  'src/i18n/es.ts': 'title: "Compartido"',
  'src/i18n/de.ts': 'title: "Geteilt"',
  'src/i18n/ja.ts': 'title: "共有"',
  'src/i18n/zh.ts': 'title: "共享"',
  'src/i18n/it.ts': 'title: "Condiviso"',
  'src/i18n/pt.ts': 'title: "Compartilhado"',
  'src/i18n/ru.ts': 'title: "Общий"',
  'src/i18n/ar.ts': 'title: "مشترك"',
  'src/i18n/hi.ts': 'title: "साझा"',
  'src/i18n/th.ts': 'title: "แชร์"',
  'src/i18n/vi.ts': 'title: "Chia sẻ"',
  'src/i18n/id.ts': 'title: "Dibagikan"',
  'src/i18n/sv.ts': 'title: "Delad"',
  'src/i18n/nl.ts': 'title: "Gedeeld"',
  'src/i18n/pl.ts': 'title: "Udostępnione"',
  'src/i18n/tr.ts': 'title: "Paylaşılan"',
  'src/i18n/ms.ts': 'title: "Dikongsi"'
};

languageFiles.forEach(filePath => {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Replace analytics title
    const regex = /(\s+)(title:\s*"[^"]*")(,?)/;
    const replacement = `$1${translations[filePath]}$3`;
    
    content = content.replace(regex, replacement);
    
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated ${filePath}`);
  } catch (error) {
    console.error(`Error updating ${filePath}:`, error.message);
  }
});

console.log('All analytics titles updated successfully!'); 