/**
 * Script pour nettoyer le cache Next.js et les fichiers temporaires
 */

const fs = require('fs');
const path = require('path');

console.log('🧹 Nettoyage du cache Next.js...\n');

const pathsToClean = [
  '.next',
  'node_modules/.cache',
  '.vercel',
  'out'
];

function deleteFolderRecursive(folderPath) {
  if (fs.existsSync(folderPath)) {
    try {
      fs.rmSync(folderPath, { recursive: true, force: true });
      console.log(`✅ Supprimé: ${folderPath}`);
      return true;
    } catch (error) {
      console.log(`❌ Erreur lors de la suppression de ${folderPath}: ${error.message}`);
      return false;
    }
  } else {
    console.log(`ℹ️  N'existe pas: ${folderPath}`);
    return true;
  }
}

// Nettoyer les dossiers
pathsToClean.forEach(folderPath => {
  const fullPath = path.join(__dirname, '..', folderPath);
  deleteFolderRecursive(fullPath);
});

console.log('\n🎉 Nettoyage terminé !');
console.log('\n📝 Prochaines étapes:');
console.log('1. Redémarrez le serveur de développement');
console.log('2. npm run dev');
console.log('3. Vérifiez que la configuration fonctionne');

// Vérifier que config.ts existe
const configPath = path.join(__dirname, '../app/services/config.ts');
if (fs.existsSync(configPath)) {
  console.log('\n✅ config.ts existe et est prêt');
} else {
  console.log('\n❌ ERREUR: config.ts n\'existe pas !');
  process.exit(1);
}
