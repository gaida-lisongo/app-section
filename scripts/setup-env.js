/**
 * Script pour créer automatiquement le fichier .env.local
 */

const fs = require('fs');
const path = require('path');

console.log('🔧 Configuration automatique de l\'environnement...\n');

const envLocalPath = path.join(__dirname, '../.env.local');
const envExamplePath = path.join(__dirname, '../.env.example');

// Vérifier si .env.example existe
if (!fs.existsSync(envExamplePath)) {
  console.log('❌ ERREUR: .env.example n\'existe pas');
  process.exit(1);
}

// Lire le contenu de .env.example
const envExampleContent = fs.readFileSync(envExamplePath, 'utf8');

// Contenu par défaut pour .env.local
const defaultEnvContent = `# Configuration de l'application
# Fichier généré automatiquement - modifiez selon vos besoins

# ID de l'application
NEXT_PUBLIC_APP_ID=68c52ec8957f9a89ad8bfc3c

# URL de base de l'API
NEXT_PUBLIC_API_BASE_URL=http://192.168.1.85:4011/api/v1

# Environnement (development, production, staging)
NEXT_PUBLIC_ENVIRONMENT=development

# Version de l'API
NEXT_PUBLIC_API_VERSION=v1
`;

// Vérifier si .env.local existe déjà
if (fs.existsSync(envLocalPath)) {
  console.log('ℹ️  .env.local existe déjà');
  
  // Lire le contenu existant
  const existingContent = fs.readFileSync(envLocalPath, 'utf8');
  
  // Vérifier si les variables requises sont présentes
  const requiredVars = ['NEXT_PUBLIC_APP_ID', 'NEXT_PUBLIC_API_BASE_URL'];
  const missingVars = requiredVars.filter(varName => !existingContent.includes(varName));
  
  if (missingVars.length > 0) {
    console.log(`⚠️  Variables manquantes dans .env.local: ${missingVars.join(', ')}`);
    console.log('🔄 Mise à jour du fichier .env.local...');
    
    // Ajouter les variables manquantes
    let updatedContent = existingContent;
    if (!updatedContent.endsWith('\n')) {
      updatedContent += '\n';
    }
    updatedContent += '\n# Variables ajoutées automatiquement\n';
    
    missingVars.forEach(varName => {
      if (varName === 'NEXT_PUBLIC_APP_ID') {
        updatedContent += 'NEXT_PUBLIC_APP_ID=68c52ec8957f9a89ad8bfc3c\n';
      } else if (varName === 'NEXT_PUBLIC_API_BASE_URL') {
        updatedContent += 'NEXT_PUBLIC_API_BASE_URL=http://192.168.1.85:4011/api/v1\n';
      }
    });
    
    fs.writeFileSync(envLocalPath, updatedContent);
    console.log('✅ .env.local mis à jour avec les variables manquantes');
  } else {
    console.log('✅ .env.local contient toutes les variables requises');
  }
} else {
  // Créer .env.local
  console.log('📝 Création de .env.local...');
  fs.writeFileSync(envLocalPath, defaultEnvContent);
  console.log('✅ .env.local créé avec succès');
}

console.log('\n📋 Contenu de .env.local:');
const finalContent = fs.readFileSync(envLocalPath, 'utf8');
console.log('---');
console.log(finalContent);
console.log('---');

console.log('\n🎉 Configuration terminée !');
console.log('\n📝 Prochaines étapes:');
console.log('1. Vérifiez les valeurs dans .env.local');
console.log('2. Modifiez NEXT_PUBLIC_API_BASE_URL si nécessaire');
console.log('3. Redémarrez le serveur: npm run dev');
console.log('4. Testez: npm run verify-config');
