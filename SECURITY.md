# Politique de Sécurité - Dona

## Versions Supportées

Dona est actuellement en version beta. Seule la dernière version est supportée pour les mises à jour de sécurité.

| Version | Supportée          |
| ------- | ------------------ |
| 1.0.0-beta   | :white_check_mark: |

## Signaler une Vulnérabilité

**La sécurité de Dona est une priorité.**

Si vous découvrez une vulnérabilité de sécurité, **NE LA PUBLIEZ PAS publiquement** dans les Issues GitHub.

### Comment signaler

**📧 Email :** safidymahefa03@gmail.com

**Sujet :** [SECURITY] Vulnérabilité dans Dona

**Incluez dans votre rapport :**

1. **Description de la vulnérabilité**
   - Type de vulnérabilité (XSS, injection, etc.)
   - Impact potentiel

2. **Étapes pour reproduire**
   - Instructions détaillées
   - Captures d'écran si pertinent

3. **Version affectée**
   - Version de Dona
   - Navigateur et OS

4. **Proof of Concept (optionnel)**
   - Code ou démo si disponible

5. **Suggestions de correction (optionnel)**
   - Si vous avez des idées de fix

### Ce qui se passe ensuite

1. **Accusé de réception** : Sous 48h
2. **Évaluation** : Analyse de la vulnérabilité (3-5 jours)
3. **Correction** : Développement du patch
4. **Notification** : Vous êtes informé de l'avancement
5. **Release** : Patch publié avec crédit (si vous le souhaitez)
6. **Disclosure** : Publication publique après correction

### Hall of Fame 🏆

Les chercheurs en sécurité qui signalent des vulnérabilités valides seront crédités (avec leur permission) :

- **Votre nom ici** - [Type de vulnérabilité] - [Date]

### Ce qui N'est PAS une vulnérabilité

Pour éviter les faux positifs :

❌ **Problèmes de performance** → Ouvrir une Issue normale
❌ **Bugs d'affichage** → Ouvrir une Issue normale
❌ **Features manquantes** → Feature Request
❌ **Problèmes sans impact sécurité** → Issue normale

### Scope de la Sécurité

**Dans le scope :**
✅ Injection de code malveillant
✅ Accès non autorisé aux fichiers locaux
✅ XSS (Cross-Site Scripting)
✅ Failles permettant vol de données
✅ Vulnérabilités dans les dépendances

**Hors scope :**
❌ Social engineering
❌ Déni de service (DoS) côté client
❌ Bugs nécessitant accès physique à la machine

### Engagement de Confidentialité

Nous nous engageons à :
- Traiter votre rapport avec sérieux
- Maintenir la confidentialité de votre identité
- Vous tenir informé de l'avancement
- Vous créditer publiquement (si vous le souhaitez)

### Politique de Divulgation Responsable

Nous vous demandons de :
- Ne pas exploiter la vulnérabilité au-delà de la preuve de concept
- Ne pas divulguer publiquement avant notre correction
- Nous donner un délai raisonnable pour corriger (90 jours)

## Contact

**Email sécurité :** safidymahefa03@gmail.com
**PGP Key :** (À venir)

---

**Merci de contribuer à la sécurité de Dona ! 🔒**
```

---

### **3️⃣ À quoi servent docs/ et examples/ ?**

#### **📚 docs/ - Documentation**

**Contient toute la documentation technique du projet :**
```
docs/
├── README.md (index de la doc)
├── installation.md (guide d'installation détaillé)
├── usage.md (comment utiliser Dona)
├── api.md (documentation de l'API/fonctions)
├── architecture.md (structure du code)
├── contributing/
│   ├── setup.md (environnement de dev)
│   ├── guidelines.md (standards de code)
│   └── testing.md (comment tester)
├── features/
│   ├── visualizers.md (documentation des modes)
│   ├── audio-analysis.md (FFT, BPM, etc.)
│   └── customization.md (personnalisation)
└── troubleshooting.md (résolution problèmes)