# PDFGenerator avec Template

## Vue d'ensemble

Le nouveau système de génération PDF utilise une approche **template-based** qui permet de :

1. **Séparer le design du contenu** : Le template contient la mise en page fixe, les données sont ajoutées dynamiquement
2. **Faciliter les modifications** : Ajuster les positions sans réécrire tout le code
3. **Maintenir la cohérence** : Un seul template pour tous les PDFs
4. **Optimiser les performances** : Template pré-construit, seules les données changent

## Structure des fichiers

```
utils/
├── PDFGeneratorTemplate.ts      # Nouvelle classe PDFGenerator avec template
├── pdf-template-config.ts       # Configuration des positions des champs
├── pdf-example.ts              # Exemples et fonctions de test
└── PDFGenerator.ts             # Ancienne version (fallback)
```

## Utilisation

### Basique

```typescript
import { PDFGenerator } from './utils/PDFGeneratorTemplate';

const generator = new PDFGenerator();
const pdf = await generator.generateInscriptionPDF(etudiant, section);
generator.save('fiche-inscription.pdf');
```

### Avec configuration personnalisée

```typescript
import { PDFGenerator } from './utils/PDFGeneratorTemplate';
import { defaultTemplateConfig } from './utils/pdf-template-config';

// Modifier la configuration
const config = {
  ...defaultTemplateConfig,
  page1: {
    ...defaultTemplateConfig.page1,
    matricule: { x: 180, y: 25, fontSize: 12, color: [255, 0, 0] }
  }
};

const generator = new PDFGenerator();
// Appliquer la config personnalisée si nécessaire
```

## Configuration des positions

Le fichier `pdf-template-config.ts` contient toutes les coordonnées :

```typescript
export interface TemplateFieldPosition {
  x: number;           // Position horizontale (0-210mm)
  y: number;           // Position verticale (0-297mm)
  fontSize?: number;   // Taille de police
  color?: [number, number, number]; // Couleur RGB
  align?: 'left' | 'center' | 'right';
  maxWidth?: number;   // Largeur maximale du texte
}
```

### Coordonnées de référence (Page A4)

- **Largeur** : 210mm
- **Hauteur** : 297mm
- **Marges recommandées** : 20mm
- **Zone de contenu** : 170mm x 257mm

### Sections principales

#### Page 1
- **En-tête** : y = 20-50mm
- **Informations étudiant** : y = 65-110mm
- **Résumé** : y = 120-170mm
- **Signatures** : y = 180-230mm
- **Pied de page** : y = 250-270mm

#### Page 2
- **En-tête** : y = 20-45mm
- **Photo** : y = 55-120mm
- **Documents** : y = 125-210mm
- **Vérification** : y = 220-270mm

## Avantages de l'approche template

### ✅ Pour les développeurs
- Code plus maintenable
- Séparation claire des responsabilités
- Facilité de debug des positions
- Réutilisabilité du template

### ✅ Pour les designers
- Contrôle précis des positions
- Possibilité d'ajuster sans coder
- Template visuel cohérent
- Facilité d'itération

### ✅ Pour la production
- Performance améliorée
- Consistance garantie
- Facilité de localisation
- Support de templates multiples

## Migration depuis l'ancienne version

L'ancienne classe `PDFGenerator` reste disponible comme fallback. Pour migrer :

1. **Remplacer l'import** :
   ```typescript
   // Avant
   import { PDFGenerator } from './utils/PDFGenerator';
   
   // Après
   import { PDFGenerator } from './utils/PDFGeneratorTemplate';
   ```

2. **Ajuster l'appel** (maintenant asynchrone) :
   ```typescript
   // Avant
   const pdf = generator.generateInscriptionPDF(etudiant, section);
   
   // Après
   const pdf = await generator.generateInscriptionPDF(etudiant, section);
   ```

3. **Tester et ajuster** les positions si nécessaire

## Tests et validation

Pour tester le nouveau système :

```typescript
import { genererPDFAvecTemplate, ajusterPositions } from './utils/pdf-example';

// Générer un PDF de test
await genererPDFAvecTemplate();

// Afficher le guide d'ajustement
ajusterPositions();
```

## Prochaines étapes

1. **Template PDF réel** : Charger un vrai fichier PDF template
2. **Logos dynamiques** : Intégrer les vraies images des sections
3. **Polices personnalisées** : Ajouter les polices officielles
4. **Templates multiples** : Support de différents types de documents

## Support

Pour ajuster les positions, modifiez les valeurs dans `pdf-template-config.ts` et testez avec `pdf-example.ts`.