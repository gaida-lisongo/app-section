/**
 * Script de vérification de la configuration
 * Vérifie que la migration vers les variables d'environnement fonctionne correctement
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Vérification de la migration de configuration...\n');

// 1. Vérifier que config.json n'existe plus
const configJsonPath = path.join(__dirname, '../app/services/config.json');
if (fs.existsSync(configJsonPath)) {
  console.log('❌ ERREUR: config.json existe encore et devrait être supprimé');
  process.exit(1);
} else {
  console.log('✅ config.json correctement supprimé');
}

// 2. Vérifier que config.ts existe
const configTsPath = path.join(__dirname, '../app/services/config.ts');
if (!fs.existsSync(configTsPath)) {
  console.log('❌ ERREUR: config.ts n\'existe pas');
  process.exit(1);
} else {
  console.log('✅ config.ts existe');
}

// 3. Vérifier que .env.example existe
const envExamplePath = path.join(__dirname, '../.env.example');
if (!fs.existsSync(envExamplePath)) {
  console.log('❌ ERREUR: .env.example n\'existe pas');
  process.exit(1);
} else {
  console.log('✅ .env.example existe');
}

// 4. Vérifier les imports dans les services
const servicesDir = path.join(__dirname, '../app/services');
const serviceFiles = fs.readdirSync(servicesDir)
  .filter(file => file.endsWith('.ts') && file !== 'config.ts')
  .filter(file => !file.includes('.examples.') && !file.includes('.README.'));

let hasConfigJsonImport = false;
let configImportCount = 0;

serviceFiles.forEach(file => {
  const filePath = path.join(servicesDir, file);
  const content = fs.readFileSync(filePath, 'utf8');
  
  // Vérifier les imports de config.json (ne devrait plus exister)
  if (content.includes('config.json')) {
    console.log(`❌ ERREUR: ${file} importe encore config.json`);
    hasConfigJsonImport = true;
  }
  
  // Compter les imports de config
  if (content.includes("import config from './config'") || content.includes('import config from "./config"')) {
    configImportCount++;
  }
});

if (hasConfigJsonImport) {
  console.log('\n❌ Des fichiers importent encore config.json');
  process.exit(1);
} else {
  console.log(`✅ Aucun import de config.json trouvé`);
}

console.log(`✅ ${configImportCount} services utilisent le nouveau config.ts`);

// 5. Vérifier le contenu de config.ts
const configContent = fs.readFileSync(configTsPath, 'utf8');

const requiredElements = [
  'process.env.NEXT_PUBLIC_APP_ID',
  'process.env.NEXT_PUBLIC_API_BASE_URL',
  'interface Config',
  'export default config'
];

let missingElements = [];
requiredElements.forEach(element => {
  if (!configContent.includes(element)) {
    missingElements.push(element);
  }
});

if (missingElements.length > 0) {
  console.log(`❌ ERREUR: Éléments manquants dans config.ts: ${missingElements.join(', ')}`);
  process.exit(1);
} else {
  console.log('✅ config.ts contient tous les éléments requis');
}

// 6. Vérifier .env.example
const envExampleContent = fs.readFileSync(envExamplePath, 'utf8');
const requiredEnvVars = [
  'NEXT_PUBLIC_APP_ID',
  'NEXT_PUBLIC_API_BASE_URL'
];

let missingEnvVars = [];
requiredEnvVars.forEach(envVar => {
  if (!envExampleContent.includes(envVar)) {
    missingEnvVars.push(envVar);
  }
});

if (missingEnvVars.length > 0) {
  console.log(`❌ ERREUR: Variables manquantes dans .env.example: ${missingEnvVars.join(', ')}`);
  process.exit(1);
} else {
  console.log('✅ .env.example contient toutes les variables requises');
}

console.log('\n🎉 Migration de configuration vérifiée avec succès !');
console.log('\n📝 Prochaines étapes:');
console.log('1. Créez un fichier .env.local avec vos valeurs');
console.log('2. Copiez le contenu de .env.example vers .env.local');
console.log('3. Modifiez les valeurs selon votre environnement');
console.log('4. Redémarrez le serveur de développement');

console.log('\n💡 Exemple de .env.local:');
console.log('NEXT_PUBLIC_APP_ID=68c52ec8957f9a89ad8bfc3c');
console.log('NEXT_PUBLIC_API_BASE_URL=http://192.168.1.85:4011/api/v1');
