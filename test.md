# Étude technique & macro-chiffrage  
## Formulaire hybride d'abonnement iRS SCOL'R  
### Comparatif Solution 1 (Référentiel BO) vs Solution 2 (Token + DataFactory)

---

## 1. Contexte et objectifs

### 1.1 Contexte métier

Dans le cadre de la digitalisation partielle de la souscription à l'abonnement **iRS SCOL'R**, Comutitres, au sein de l'équipe **LA FABRIQUE**, est sollicitée pour produire une **étude technique** et un **macro-chiffrage** concernant la mise en place d'un **formulaire hybride**.

Le caractère hybride du processus provient du fait que :

- le client complète son dossier en ligne depuis un ordinateur ou un terminal mobile ;
- le formulaire est ensuite généré au format PDF ;
- le client imprime le document ;
- il complète la partie papier nécessitant des pièces ou actions manuelles :
  - signature,
  - photo,
  - RIB ;
- le dossier papier est ensuite envoyé par voie postale au partenaire ;
- le partenaire procède enfin à la saisie dans le SIG.

Cette étude compare deux scénarios proposés lors des échanges entre les parties prenantes.

### 1.2 Objectifs de l'étude

Les objectifs sont les suivants :

- analyser les deux solutions proposées sur la base des diagrammes de séquence fournis ;
- identifier les composants techniques à développer ;
- évaluer les impacts d'architecture, de sécurité, d'exploitation et de maintenance ;
- produire un macro-chiffrage cohérent pour une implémentation en **NestJS / Node.js / PostgreSQL** ;
- formuler une recommandation argumentée et exploitable en comité.

---

## 2. Hypothèses structurantes de l'étude

Les hypothèses suivantes sont retenues pour cadrer le chiffrage et éviter toute ambiguïté :

- le volume d'utilisateurs est **faible** ;
- la solution sera développée en **NestJS / Node.js** ;
- la base de données sera en **PostgreSQL** ;
- le formulaire sera exposé via une application web dédiée ;
- les PDFs seront générés côté backend ;
- les données sensibles devront être stockées et journalisées conformément aux exigences de sécurité et de conformité ;
- la saisie finale dans le SIG reste hors périmètre Fabrique ;
- le processus papier est maintenu ;
- le chiffrage est un **macro-chiffrage**, et non un engagement forfaitaire détaillé ;
- la recette métier, les homologations transverses, les dépendances infra et les validations de sécurité peuvent faire évoluer le chiffrage final.

---

## 3. Besoin fonctionnel

### 3.1 Finalité

Permettre aux personnes éligibles à l'abonnement **iRS SCOL'R** d'accéder à une page de formulaire, de renseigner leurs informations, puis de télécharger un PDF prérempli à imprimer et signer.

### 3.2 Champs attendus

Le formulaire devra collecter les informations suivantes :

- Référence carte scol'R
- Nom et prénom du payeur
- Nom et prénom du porteur
- Date de naissance
- Adresse e-mail du payeur
- Adresse e-mail du porteur
- Niveau scolaire
- Nom de l'établissement
- Adresse postale de l'établissement
- Photo du porteur
- Numéro de client du porteur si déjà existant
- Numéro de client du payeur si déjà existant
- Mandat SEPA et RUM
- RIB
- Signature

### 3.3 Remarques fonctionnelles

Plusieurs champs nécessitent une clarification métier avant conception détaillée :

- la photo est-elle déposée en ligne, collée sur le formulaire papier, ou les deux ;
- le RIB est-il téléversé en ligne, fourni uniquement en papier, ou les deux ;
- la signature reste manuscrite, donc le PDF devra inclure les zones réservées correspondantes ;
- certains champs peuvent être préremplis selon le scénario retenu.

---

## 4. Architecture cible de référence

Compte tenu du contexte annoncé, l'architecture cible raisonnable est la suivante.

### 4.1 Socle technique

- **Frontend** : application web formulaire
- **Backend** : API NestJS
- **Runtime** : Node.js
- **Base de données** : PostgreSQL
- **Génération de PDF** : service backend NestJS
- **Emailing** : hors Fabrique en solution 1, intégré via outillage externe en solution 2
- **Stockage documentaire** : selon arbitrage, en base ou via stockage objet si besoin futur

### 4.2 Découpage logique recommandé

#### Frontend
- affichage du formulaire ;
- validation de premier niveau ;
- gestion de l'expérience utilisateur ;
- gestion de l'accès par lien simple ou par token.

#### Backend NestJS
- endpoint d'ouverture du formulaire ;
- endpoint de soumission ;
- endpoint de génération du PDF ;
- service métier de génération de RUM ;
- service de validation métier ;
- service de traçabilité et journalisation.

#### PostgreSQL
- persistance des formulaires ;
- persistance des RUM générées ;
- historisation des statuts ;
- gestion des tokens et de leur consommation en solution 2.

### 4.3 Principes d'architecture recommandés

Pour sécuriser la trajectoire, il est recommandé de séparer dès la V1 :

- le **service de génération RUM** ;
- le **service de génération PDF** ;
- le **module formulaire** ;
- le **module de persistance / référentiel**.

Cette séparation permettra une évolution future vers le scénario 2 sans refonte lourde.

---

## 5. Algorithme de génération de la RUM

### 5.1 Règles métier rappelées

La RUM est un identifiant SEPA de **33 ou 35 caractères**, obtenu par concaténation de :

1. un indicateur de migration :
   - `"++"` si le mandat SEPA migré est à `Oui`,
   - vide sinon ;
2. le code ICS de COMUTITRES :
   - `FR42ZZZ457385`
3. la référence du contrat commercial ou du contrat tiers payant sur **14 caractères** :
   - compléter à gauche avec des zéros si nécessaire ;
   - remplacer les caractères `_` par `-` dans la RUM finale ;
4. le code produit sur **2 caractères** :
   - `01` pour iRS,
   - `02` pour iRE,
   - `04` pour NVA,
   - `05` pour NL+ ;
5. un indice sur **2 caractères** :
   - commence à `00`,
   - permet de distinguer plusieurs mandats sur un même contrat ;
6. une clé de contrôle sur **2 chiffres** :
   - calculée par `97 - modulo97`.

### 5.2 Particularités du calcul

Pour la clé de contrôle :

- les `++` sont remplacés par `11` ;
- l'ICS n'est pas pris en compte ;
- les `_` éventuels dans la référence contrat ne sont pas considérés dans le calcul.

### 5.3 Exemple fourni

Pour le contrat de référence `000987654_3` :

- RUM finale : `++FR42ZZZ457385000000987654-3040028`
- chaîne numérique utilisée : `1100000098765430400`
- calcul :
  - `Modulo97(1100000098765430400) = 69`
  - `97 - 69 = 28`

### 5.4 Enjeu technique majeur

La génération de RUM doit être :

- **unique** ;
- **déterministe** ;
- **atomique** ;
- **traçable**.

Ce point est critique car il touche à un identifiant bancaire de mandat.  
En conséquence, la génération doit impérativement être protégée contre les problèmes de concurrence.

### 5.5 Recommandation d'implémentation

La génération doit être portée par un **service métier dédié** avec :

- transaction PostgreSQL ;
- verrouillage logique ou requête atomique sur l'indice ;
- historique de la RUM générée ;
- tests unitaires exhaustifs ;
- tests d'intégration sur cas de concurrence.

---

## 6. Solution 1 — Référentiel BO / Génération RUM à la demande

### 6.1 Description du flux

Dans cette solution :

1. TSA envoie l'email contenant le lien vers le formulaire ;
2. le client clique sur le lien ;
3. il accède à la page formulaire ;
4. il complète les informations demandées ;
5. au clic sur le téléchargement PDF, le backend appelle le service de génération de RUM ;
6. le backend génère une nouvelle RUM via le référentiel ;
7. le PDF est produit avec la RUM ;
8. le client imprime le document ;
9. il signe et joint les pièces nécessaires ;
10. il envoie le dossier papier au partenaire ;
11. le partenaire saisit le dossier dans le SIG.

### 6.2 Caractéristiques

#### Avantages
- architecture plus simple ;
- moins de dépendances externes ;
- mise en œuvre plus rapide ;
- responsabilité emailing hors Fabrique ;
- bonne adéquation à un faible volume.

#### Inconvénients
- lien potentiellement non nominatif ou faiblement sécurisé ;
- aucune pré-identification native du client ;
- RUM générée tardivement, donc possible consommation inutile si abandon après génération ;
- traçabilité plus faible sur l'origine du formulaire.

### 6.3 Composants à développer

- page formulaire ;
- validation front et back ;
- module NestJS de soumission ;
- service de génération PDF ;
- service de génération de RUM ;
- référentiel PostgreSQL pour les RUM ;
- journalisation ;
- gestion d'erreurs.

### 6.4 Points de vigilance

#### Sécurité
Même avec un petit volume, un accès par lien direct doit être protégé au minimum par :

- captcha ou anti-bot léger ;
- rate limiting côté API ;
- validation stricte des entrées ;
- journalisation des accès.

#### RUM consommée à tort
Si la RUM est générée lors du téléchargement du PDF mais que le client n'envoie jamais le dossier, la RUM reste consommée.  
Ce n'est pas forcément bloquant fonctionnellement, mais ce comportement doit être assumé et documenté.

#### UX
Le client repart d'une page générique, sans personnalisation ni préremplissage.

---

## 7. Solution 2 — Référentiel RUM + Token

### 7.1 Description du flux

Dans cette solution :

1. IDFM ou TSA transmet une liste d'adresses e-mail ;
2. un composant de préparation de campagne génère pour chaque client :
   - une RUM,
   - un token unique,
   - un lien personnalisé ;
3. l'outil d'emailing envoie les messages ;
4. le client clique sur un lien personnalisé ;
5. le backend valide le token ;
6. le client complète le formulaire ;
7. le PDF est généré avec la RUM déjà préparée ;
8. le client imprime, signe et envoie le dossier papier ;
9. le partenaire saisit dans le SIG.

### 7.2 Caractéristiques

#### Avantages
- meilleur contrôle d'accès ;
- traçabilité plus forte ;
- possibilité de préremplissage ;
- meilleure maîtrise du parcours utilisateur ;
- plus extensible à long terme.

#### Inconvénients
- complexité plus forte ;
- besoin d'un mécanisme de génération et stockage des tokens ;
- responsabilité accrue sur l'emailing ;
- plus de dépendances et de gouvernance inter-équipes.

### 7.3 Recommandation technique sur le token

Le terme JWT a été évoqué dans les propositions initiales, mais dans ce contexte précis, avec un faible volume et un besoin simple, il est préférable de rester pragmatique :

- soit un **token opaque** aléatoire stocké en base ;
- soit un **JWT signé** contenant des métadonnées minimales.

Pour une première implémentation sobre et robuste, la recommandation est :

- **token opaque aléatoire** ;
- stockage PostgreSQL ;
- date d'expiration ;
- statut `consommé / non consommé` ;
- possibilité de révocation ;
- lien unitaire associé à un dossier donné.

Ce choix évite de déporter trop d'information sensible dans l'URL et simplifie l'exploitation.

### 7.4 Composants à développer

- tout le périmètre de la solution 1, sauf génération tardive de RUM ;
- service de génération de token ;
- référentiel token + statut ;
- interface ou batch d'alimentation des listes d'envoi ;
- intégration emailing ;
- logique de consommation de token ;
- gestion de l'expiration.

### 7.5 Points de vigilance

#### Anti-replay
Un même lien ne doit pas permettre la génération répétée de formulaires signables sans contrôle.

#### Gouvernance
Il faudra définir précisément :

- qui fournit les adresses e-mail ;
- à quelle fréquence ;
- sous quel format ;
- qui relance les clients ;
- qui gère les erreurs d'envoi.

#### Exploitation
Toute anomalie sur la génération préalable des tokens peut bloquer la campagne complète.

---

## 8. Modèle de données recommandé

### 8.1 Table `subscription_form`

Contient les données du formulaire :

- id
- reference_carte_scolr
- nom_payeur
- prenom_payeur
- nom_porteur
- prenom_porteur
- date_naissance
- email_payeur
- email_porteur
- niveau_scolaire
- nom_etablissement
- adresse_etablissement
- numero_client_porteur
- numero_client_payeur
- rum
- statut_formulaire
- pdf_genere
- date_creation
- date_modification

### 8.2 Table `rum_registry`

Permet la génération et la traçabilité des RUM :

- id
- reference_contrat
- code_produit
- indice
- indicateur_migration
- rum_complete
- cle_controle
- statut
- date_generation
- date_utilisation
- form_id

### 8.3 Table `form_access_token` (solution 2)

- id
- token
- email
- rum
- expires_at
- consumed_at
- status
- metadata
- created_at

### 8.4 Table `audit_log`

- id
- event_type
- event_payload
- actor
- ip
- user_agent
- created_at

---

## 9. Sécurité et conformité

### 9.1 Exigences minimales communes

Même avec un faible volume, la sensibilité des données impose a minima :

- validation stricte côté backend ;
- sanitation des entrées ;
- journalisation des événements significatifs ;
- HTTPS obligatoire ;
- contrôle des tailles et formats de fichiers si upload ;
- gestion rigoureuse des erreurs ;
- masquage des données sensibles dans les logs.

### 9.2 Points spécifiques

#### Solution 1
- protection anti-bot ;
- limitation de débit ;
- surveillance des abus sur URL publique.

#### Solution 2
- expiration du token ;
- révocation ;
- anti-rejeu ;
- non-réutilisation d'un token consommé.

### 9.3 RGPD

Les éléments suivants doivent être explicitement cadrés :

- durée de conservation des données ;
- durée de conservation des pièces ;
- politique de purge ;
- accès aux données ;
- journalisation conforme sans surexposition des données sensibles.

---

## 10. Exploitation / RUN

Une étude crédible doit intégrer l'exploitation.

### 10.1 Journaux et supervision

Prévoir :

- logs applicatifs ;
- logs d'erreurs techniques ;
- logs d'événements métier ;
- indicateurs de volumétrie ;
- alertes en cas d'échec de génération PDF ou RUM.

### 10.2 Indicateurs utiles

- nombre de formulaires démarrés ;
- nombre de PDFs générés ;
- nombre de RUM générées ;
- nombre de tokens consommés ;
- nombre d'échecs ;
- délais moyens de génération.

### 10.3 Support

Le support devra pouvoir identifier :

- un formulaire ;
- une RUM ;
- un token ;
- un horodatage de génération ;
- un statut de traitement.

---

## 11. Analyse comparative synthétique

| Critère | Solution 1 | Solution 2 |
|---|---|---|
| Complexité | Faible à modérée | Modérée à forte |
| Délai de mise en œuvre | Rapide | Plus long |
| Dépendances externes | Limitées | Plus nombreuses |
| Sécurité d'accès | Moyenne | Bonne |
| Traçabilité | Moyenne | Forte |
| Maintenance | Simple | Plus structurée |
| Adaptation petit volume | Très bonne | Bonne |
| Scalabilité future | Moyenne | Meilleure |
| Préremplissage / personnalisation | Faible | Possible |
| Risque projet | Modéré | Plus élevé |

---

## 12. Macro-chiffrage

### 12.1 Méthodologie

Le chiffrage est exprimé en **jours.homme** sur la base d'un contexte de faible volumétrie, d'une stack NestJS / Node.js / PostgreSQL, et d'une implémentation sobre.

Les charges incluent :

- conception technique ;
- développement ;
- tests unitaires ;
- tests d'intégration ;
- QA technique ;
- pilotage léger.

Les charges n'incluent pas :

- recette métier complète ;
- homologation de sécurité transverse ;
- déploiement production élargi ;
- conduite du changement ;
- support post go-live.

---

### 12.2 Solution 1 — Macro-chiffrage détaillé

#### Lot 1 — Cadrage technique et conception
- analyse détaillée
- spécifications techniques
- modèle de données
- stratégie RUM

**Charge estimée : 3 à 4 j.h**

#### Lot 2 — Développement formulaire frontend
- page formulaire
- validations
- parcours utilisateur

**Charge estimée : 4 à 6 j.h**

#### Lot 3 — Développement backend NestJS
- endpoints
- validations métier
- persistance PostgreSQL

**Charge estimée : 5 à 7 j.h**

#### Lot 4 — Service de génération RUM
- algorithme
- tests unitaires
- gestion transactionnelle PostgreSQL

**Charge estimée : 4 à 6 j.h**

#### Lot 5 — Génération PDF
- templating
- intégration des données
- génération du document

**Charge estimée : 3 à 5 j.h**

#### Lot 6 — Journalisation / sécurité minimale / gestion erreurs
- audit
- rate limiting
- sécurisation des entrées

**Charge estimée : 2 à 3 j.h**

#### Lot 7 — QA technique et tests d'intégration
- scénarios fonctionnels
- vérifications non-régression
- cas de bord

**Charge estimée : 4 à 6 j.h**

#### Lot 8 — Pilotage / coordination
- synchronisation
- support recette
- ajustements

**Charge estimée : 2 à 3 j.h**

### Total Solution 1

**Charge brute estimée : 27 à 40 j.h**

Compte tenu des incertitudes classiques de cadrage et d'intégration, il est recommandé d'appliquer une marge de **15 à 20 %**.

**Charge macro retenue : 31 à 48 j.h**

---

### 12.3 Solution 2 — Macro-chiffrage détaillé

#### Lot 1 — Cadrage technique et conception
- analyse détaillée
- spécifications techniques
- modèle de données
- stratégie RUM + token

**Charge estimée : 4 à 5 j.h**

#### Lot 2 — Développement formulaire frontend
- page formulaire
- lecture du token
- gestion d'accès
- validations

**Charge estimée : 5 à 7 j.h**

#### Lot 3 — Développement backend NestJS
- endpoints
- validation token
- persistance
- logique de consommation

**Charge estimée : 6 à 8 j.h**

#### Lot 4 — Service RUM
- génération
- persistance
- traçabilité

**Charge estimée : 4 à 6 j.h**

#### Lot 5 — Service token
- génération
- stockage
- expiration
- consommation

**Charge estimée : 4 à 6 j.h**

#### Lot 6 — Génération PDF
- templating
- intégration
- génération

**Charge estimée : 3 à 5 j.h**

#### Lot 7 — Préparation des campagnes / import liste / intégration emailing
- ingestion des adresses
- mapping
- préparation des liens
- gestion des erreurs de lot

**Charge estimée : 4 à 7 j.h**

#### Lot 8 — Journalisation / sécurité / anti-replay
- audit
- statuts
- sécurisation du lien
- contrôles anti-réutilisation

**Charge estimée : 3 à 5 j.h**

#### Lot 9 — QA technique et tests d'intégration
- scénarios fonctionnels
- cas d'expiration
- cas de lien déjà utilisé
- cas de régénération

**Charge estimée : 5 à 7 j.h**

#### Lot 10 — Pilotage / coordination
- synchronisation
- support recette
- coordination inter-équipes

**Charge estimée : 2 à 4 j.h**

### Total Solution 2

**Charge brute estimée : 40 à 60 j.h**

Avec une marge de **15 à 20 %** :

**Charge macro retenue : 46 à 72 j.h**

---

## 13. Analyse des risques

### 13.1 Risques communs

- ambiguïtés métier sur le périmètre exact du formulaire ;
- validation tardive du modèle PDF ;
- comportement attendu sur la photo, le RIB et la signature ;
- sous-estimation des exigences de sécurité.

### 13.2 Risques spécifiques solution 1

- lien trop ouvert ;
- génération inutile de RUM ;
- difficulté de suivi nominatif ;
- expérience utilisateur moins maîtrisée.

### 13.3 Risques spécifiques solution 2

- dépendance à la qualité des listes d'e-mails reçues ;
- besoin de gouvernance claire sur l'emailing ;
- gestion des tokens expirés ;
- blocage global possible en cas d'échec de préparation de campagne.

---

## 14. Recommandation

### 14.1 Recommandation principale

Au regard :

- du **faible volume** ;
- de la stack **NestJS / Node.js / PostgreSQL** ;
- du besoin de mise en œuvre pragmatique ;
- du maintien d'un processus papier ;
- et du rapport valeur / complexité,

la **Solution 1** apparaît comme la solution la plus pertinente pour une première mise en œuvre.

### 14.2 Justification

La solution 1 présente plusieurs avantages dans ce contexte :

- architecture plus simple ;
- moins de dépendances externes ;
- meilleure rapidité de mise en œuvre ;
- charge projet maîtrisée ;
- adéquation suffisante à un faible nombre d'utilisateurs.

La solution 2 est plus robuste d'un point de vue traçabilité et sécurité d'accès, mais son surcoût et sa complexité sont moins justifiés à ce stade, sauf contrainte forte de personnalisation ou de sécurisation nominative du lien.

### 14.3 Recommandation d'architecture

Il est néanmoins recommandé, même en retenant la solution 1, de concevoir dès la V1 :

- un **service RUM isolé** ;
- un **module PDF isolé** ;
- un **schéma PostgreSQL extensible** ;
- une **traçabilité exploitable**.

Cela permettra une évolution vers la solution 2 ultérieurement sans refonte majeure.

---

## 15. Conditions qui pourraient faire basculer le choix vers la solution 2

La solution 2 deviendrait prioritaire si l'un des éléments suivants se confirme :

- besoin de sécuriser nominativement l'accès au formulaire ;
- besoin de préremplir certaines données ;
- besoin de suivre précisément les campagnes d'envoi ;
- augmentation significative de la volumétrie ;
- volonté d'industrialiser le dispositif pour d'autres produits similaires.

---

## 16. Questions ouvertes à traiter avant engagement final

Les points suivants doivent être clarifiés avant chiffrage définitif :

1. Le lien du formulaire en solution 1 est-il totalement générique ou partiellement personnalisé ?
2. La photo et le RIB sont-ils réellement gérés en ligne ou uniquement sur support papier ?
3. Faut-il conserver les brouillons de formulaire ?
4. Le PDF doit-il être archivé côté Comutitres ?
5. Existe-t-il un modèle exact du document à générer ?
6. Quelle est la volumétrie prévisionnelle, même si elle est faible ?
7. Faut-il un back-office de consultation ?
8. Quels sont les niveaux d'attente en matière de supervision et de support ?
9. La RUM consommée mais non finalisée est-elle acceptable métier ?
10. En solution 2, qui porte précisément la gouvernance emailing ?

---

## 17. Conclusion

Les deux solutions sont techniquement réalisables avec un socle **NestJS / Node.js / PostgreSQL**.

Dans le contexte exprimé, caractérisé par un **petit nombre d'utilisateurs** et une recherche de pragmatisme, la **solution 1** constitue la meilleure option pour une première implémentation :

- plus rapide ;
- moins coûteuse ;
- plus simple à exploiter ;
- suffisante au regard du besoin initial.

La **solution 2** reste une cible d'évolution pertinente si le besoin de personnalisation, de sécurisation nominative ou d'industrialisation augmente.

Le point technique le plus sensible dans les deux cas demeure la **génération transactionnelle et traçable de la RUM**, qui doit être traitée comme un composant métier critique.

---

## 18. Synthèse exécutive

### Recommandation
**Retenir la Solution 1 en V1**, avec architecture préparant une évolution future vers la solution 2.

### Charges macro
- **Solution 1** : **31 à 48 j.h**
- **Solution 2** : **46 à 72 j.h**

### Décision d'architecture
- NestJS / Node.js
- PostgreSQL
- service RUM dédié
- génération PDF backend
- sécurité minimale robuste dès la V1

---

Document de travail interne — Équipe LA FABRIQUE / Comutitres
