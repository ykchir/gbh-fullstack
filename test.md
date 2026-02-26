# Étude & Inventaire — Outils de gestion de templates mails (SELFY ↔ IRIS ↔ AWS SES)
Client : Comutitres — Produit : SELFY  
Auteur : (CTO / Tech Lead)  
Date : 2026-02-26

---

## 0) Résumé exécutif

### Décision recommandée
**Scénario B — Hybride** : SELFY porte l’UX (listing, recherche, gouvernance, workflow, RBAC, audit, validation variables, preview) et embarque un **éditeur WYSIWYG**.  
SELFY s’interface avec **IRIS-TEMPLATE** (API) qui :
1) versionne et compose les composants (principal/style/signature/footer),  
2) **génère** le template final,  
3) **publie** le résultat dans **AWS SES**,  
puis AWS SES effectue le rendu final (substitution variables) à l’envoi.

### Pourquoi ce choix
- **IRIS ne gère pas** `draft/published/archived` ni endpoint `promote/publish` → la **gouvernance SC** doit vivre côté SELFY (ou être développée côté IRIS plus tard).
- Le composant le plus coûteux et risqué à développer from scratch est l’éditeur d’email HTML compatible clients (Outlook, Gmail, etc.). Le **déléguer à un SDK WYSIWYG** réduit drastiquement le risque et le time-to-market.
- “Solution externe” (outil emailing/ESP) crée une **double source of truth** (IRIS vs outil), complexifie RBAC/audit/conformité et n’est pas cohérente avec l’existant (IRIS pousse déjà vers SES).

### Livrables attendus (produits dans ce document)
- Inventaire marché (focus éditeurs WYSIWYG embeddables + alternatives)
- Comparatif scénarios A/B/C
- Matrice MVP vs Target
- Macro-chiffrage recalibré
- Risques + mitigations
- Plan POC (2 semaines)
- Schémas + mermaid
- Estimation des coûts éditeurs WYSIWYG (licences)

---

## 1) Contexte & objectifs

### Contexte
- Aujourd’hui, la création/modif de templates nécessite intervention technique + mise en production.
- SC souhaite autonomie : créer/modifier, activer/désactiver, planifier, prioriser, gérer conditions (J+1/J+4/event), duplication, comparaison, export, bibliothèque de snippets, preview.

### Contrainte structurante
- Comutitres a mis en place **IRIS** comme brique centralisée.  
- IRIS-TEMPLATE expose **uniquement une API** et repose sur **AWS SES** pour la substitution de variables à l’envoi.

### Objectif de l’étude
Identifier la solution la plus adaptée parmi :
- A) Solution Comutitre (full SELFY)
- B) Solution hybride (éditeur tiers embarqué)
- C) Solution externe (outil emailing/ESP)

Critères : autonomie SC, intégration IRIS, sécurité/conformité, time-to-market, coût (dev + récurrent), maintenabilité.

---

## 2) État des lieux technique — SELFY

### 2.1 Auth & RBAC
- Auth : JWT Cognito (validation locale RS256 via JWKS, token_use, exp/iat, revocation cache).
- Guard optionnel “introspection” : vérifie user actif + enrichit roles DB.
- RBAC : PostgreSQL, modèle roles/policies/conditions, decorators `RequirePermission(...)`.  
→ Très bon socle pour porter la gouvernance templates côté SELFY.

### 2.2 Observabilité & audit
- Correlation-id middleware + logs JSON structurés (stdout, CloudWatch-friendly).
- Audit DB existant via triggers (users) + tables audit dédiées.  
→ Réutilisable pour templates (triggers sur tables templates/versions/bibliothèque).

### 2.3 Intégrations externes
- HttpModule (Axios) configuré, mais pas encore de consommation REST externe (hors SDK AWS).
- Outbox pattern présent côté document-service (retry, status).  
→ Réutilisable si besoin de publication asynchrone vers IRIS / robustesse.

### 2.4 Frontend
- Next.js 15 (App Router), React Query v5, RHF + Zod, Zustand, DS (table, modals, etc.), Storybook.
- RBAC FE : principalement role-based routing, pas policy-based rendering fin.  
→ À compléter pour masquer/afficher actions selon permissions templates (MVP : simple).

---

## 3) Réponses IRIS — faits verrouillés

### 3.1 Gouvernance / statuts
- Pas de statuts `draft/published/archived`.
- Pas d’endpoint `promote/publish`.
- Versioning par **horodatage** + **dates de validité**.

### 3.2 Composants + templates finals
- Components réutilisables, versionnés, types : `principal`, `style`, `signature`, `footer`.
- Un template final référence des components (min : principal).  
- Components réutilisables entre plusieurs templates.

### 3.3 Format & rendu
- Variables : **Handlebars** (compatible AWS SES).
- Corps : **HTML**.
- Inclusion components : syntaxe custom `{nomDuComposant}` dans le HTML.
- Rendu/publish :
  - IRIS-TEMPLATE fusionne components + structure template, sauvegarde le **template résultant dans AWS SES**.
  - AWS SES fait la **substitution finale** des variables à l’envoi.
- Variables : définies **librement** (pas de JSON schema/validation côté IRIS).

---

## 4) Scénarios étudiés

### 4.1 Scénario A — “Full SELFY”
**Définition réaliste** : SELFY construit UI + workflow + preview + validation + bibliothèque ET implémente (au moins) un éditeur maison (WYSIWYG ou code) sans dépendance éditeur tiers.

**Avantages**
- Contrôle total UI/UX.
- Pas de coût récurrent éditeur.
- Souveraineté maximale.

**Limites**
- Coût et risque très élevés : l’éditeur email HTML est un produit à lui seul.
- Time-to-market long.
- Forte maintenance (compatibilité clients mail).

**Verdict**
- **Déconseillé** pour un lot orienté autonomie SC rapide.

---

### 4.2 Scénario B — Hybride (recommandé)
SELFY :
- gère listing/recherche, gouvernance (draft/review/approve/publish), RBAC/policies, audit,
- intègre un **éditeur WYSIWYG embeddable** pour produire HTML compatible email + merge tags,
- persiste via IRIS (components + template final + dates de validité).  
IRIS compose et publie dans SES.

**Avantages**
- Meilleur compromis time-to-market / qualité UX / risque.
- Le “dur” (éditeur HTML) est délégué.
- IRIS reste source technique, SES reste moteur.

**Limites**
- Dépendance éditeur (licence, vendor lock-in).
- Il faut implémenter la gouvernance côté SELFY (IRIS n’a pas de statuts).
- Variables libres côté IRIS → SELFY doit “sécuriser” (catalogue/validation).

**Verdict**
- **Recommandé** (avec POC rapide).

---

### 4.3 Scénario C — Externe (outil emailing/ESP)
Utiliser Mailjet/SendGrid/Brevo/etc comme outil de gestion templates complet, avec connecteur vers IRIS/SES.

**Avantages**
- Outil complet rapidement (éditeur + preview + parfois workflow).
- Peu de dev UI.

**Limites**
- Double source of truth (IRIS vs outil externe).
- RBAC/audit dupliqués.
- Conformité/RGPD (templates + potentiellement données) plus complexe.
- Intégration IRIS ↔ outil souvent non naturelle (versioning/validité/components).

**Verdict**
- **Non recommandé** tant que IRIS-TEMPLATE + SES est déjà la cible.

---

## 5) Architecture cible — schémas

### 5.1 Architecture recommandée (Scénario B)

```mermaid
flowchart TB
  SC[Service Client] --> FE[SELFY Frontend (Next.js)]
  FE -->|JWT| BE[SELFY Backend (NestJS)]
  FE -->|Embedded SDK| WYS[Editeur WYSIWYG (SDK)]

  BE -->|REST| IRIS[IRIS-TEMPLATE API]
  IRIS -->|Compose components + publish| SES[AWS SES - Template Store]
  ASSETS[Assets internes] -->|Send templated email| SES

  stateDiagram-v2
  [*] --> Draft
  Draft --> Review: Submit for review
  Review --> Draft: Request changes
  Review --> Approved: Approve
  Approved --> Published: Publish (create validity window + push via IRIS)
  Published --> Archived: End validity / deactivate
  Archived --> Draft: Duplicate / create new version
  6) MVP vs Target — périmètre (tableau)
Domaine	MVP (6–10 semaines)	Target (3–6 mois après MVP)
Catalogue templates	Listing + filtres + search + tags	Search avancée, diff avancé, recommandations
Édition	WYSIWYG + export HTML	Custom blocks, templates “seed”, contraintes design
Variables	Insert merge tags + validation basique (lint)	Catalogue par événement + règles + tests automatisés
Workflow	Draft/Review/Approved/Published + RBAC	Commentaires, approbations multi-niveaux, SLA
Publication	“Publish” = création version IRIS + validityStartDate + push SES	Rollback outillé, promotion Recette→Prod, gel de version
Bibliothèque	Gestion minimale : style/signature/footer par défaut	Library riche + dépendances + snippets + médias
Preview	Preview HTML local + dataset de test	TestRender SES (si exposé), preview clients (Outlook/Gmail)
Audit	Audit DB (triggers) sur tables templates	Audit applicatif unifié + export conformité
Monitoring	Logs techniques + tracking actions UI	KPI, alerting erreurs publication, bounces (si scope)
7) Comparatifs qui justifient le choix B (matrices)
7.1 Scoring comparatif A/B/C (MVP)

Échelle : 1 (faible) → 5 (excellent)

Critère	Poids	A Full SELFY	B Hybride	C Externe
Time-to-market	5	1	4	4
Risque technique (éditeur)	5	1	4	4
Cohérence UX SELFY	4	5	5	2
Cohérence “IRIS source of truth”	5	5	5	2
RBAC/Audit centralisés	4	5	5	2
Coût dev initial	3	1	3	4
Coût récurrent	3	5	2–4	1–3
Maintenabilité 12–18 mois	4	2	4	3

Lecture

A échoue sur time-to-market + risque éditeur.

C échoue sur cohérence IRIS/RBAC/audit.

B maximise la valeur SC sans casser l’architecture cible.

7.2 Comparatif “gouvernance”

IRIS ne fournit pas de statuts → la gouvernance doit être dans SELFY (B) ou refaite ailleurs (C) ou développée from scratch (A).

SELFY dispose déjà de RBAC/policies et d’un socle audit → B exploite l’existant au maximum.

8) Inventaire marché — éditeurs WYSIWYG embeddables (coûts & fit)

Note : les coûts ci-dessous sont des “prix catalogue” et peuvent varier selon volume / options / négociation.

8.1 Candidats principaux (embeddables pour SaaS)
1) Unlayer (embeddable email builder)

Points forts : intégration simple, large adoption, merge tags, preview, white-label selon plan.

Prix (catalogue) : plans payants type Launch / Scale / Optimize (exemples publiés : $250/mo, $750/mo, $2000/mo).

Page pricing officielle (à utiliser pour contractualiser) :

2) Beefree SDK (BEE) — SDK enterprise-grade

Points forts : très mature, white-label, customization, file manager.

Prix (catalogue) : Essentials $350/mo, Core $1000/mo, Superpowers $2500/mo, Enterprise $5000/mo (fees usage-based possibles).

3) Stripo Plugin (email editor SDK)

Points forts : plugin conçu pour intégration produit, offre “Startup/Business/Enterprise”.

Prix (catalogue plugin) : Startup $100/mo, Business $550/mo, Enterprise sur devis, + modèle d’usage (unique emails modifiés).

(Stripo a aussi une offre “outil” non-plugin à $20–$95/mo mais moins pertinente pour intégration SaaS).

8.2 Alternatives open-source / low-cost (attention au coût réel)
GrapesJS (framework open-source)

Le cœur GrapesJS est open-source (framework).

Attention : l’open-source réduit la licence, pas le coût produit :

effort d’intégration, maintenance, QA emails, sécurité (XSS), plugins, UX.

Intéressant si Comutitres veut internaliser l’éditeur, mais cela rapproche dangereusement le scénario A.

8.3 Recommandation “éditeur” (méthode de sélection)

Ne pas figer un vendor sans POC.
Décision recommandée : short-list 2 candidats (ex : Beefree SDK vs Unlayer, ou Unlayer vs Stripo Plugin) et POC sur :

insertion merge tags Handlebars + lint,

export HTML “email-safe”,

compatibilité avec structure IRIS (principal/style/signature/footer),

options white-label et gouvernance,

coûts réels (usage-based, volume, MAU).

9) Design pragmatique — comment SELFY compense les limites IRIS
9.1 Workflow & “publish”

IRIS n’ayant pas de statuts, SELFY doit porter :

template_status (Draft/Review/Approved/Published/Archived)

journal des transitions + qui/quand/pourquoi (audit)

règles RBAC (qui peut publier, archiver, rollback)

“Publish” déclenche :

création des versions components dans IRIS (principal/style/signature/footer)

création/màj du template final IRIS avec validityStartDate

IRIS push vers SES

9.2 Variables libres → sécurisation côté SELFY

Minimum MVP :

lint : détecter variables {{...}} et refuser celles hors whitelist si un “event” est choisi

dataset de test (fixtures) par type d’événement

preview HTML (client-side) avec injection simple (non SES)

Target :

catalogue de variables versionné

tests de rendu : utiliser TestRenderTemplate SES si IRIS l’expose ou si SELFY appelle SES via un rôle technique (à valider sécurité)

9.3 Bibliothèque (components) alignée IRIS

Commencer simple :

1 composant style par “brand”

1 signature et 1 footer par “brand”

le principal est édité par SC

template final = principal + style/signature/footer (référencés)

10) Macro-chiffrage recalibré (pragmatique)

Hypothèses : IRIS API stable + environnements test/recette accessibles + pas de contraintes compliance extraordinaires (ex : validation légale multi-étapes).

10.1 Scénario B — MVP (6–10 semaines)

Back-end (NestJS)

Adapter IRIS (auth, mapping, retries, erreurs, correlation-id) : 5–8 j

Modèle domaine templates + persistance SELFY (status + metadata) : 5–8 j

Workflow transitions + RBAC policies + seeds : 3–5 j

Audit (triggers DB ou service) : 3–6 j

Preview endpoint + lint variables : 3–6 j
Total BE : ~19–33 j

Front-end (Next.js)

Pages listing, filters, details, duplication, export : 8–12 j

Workflow UI (draft/review/approve/publish) : 4–7 j

Intégration WYSIWYG SDK + merge tags UI : 8–12 j

Preview UI + test dataset : 4–6 j

RBAC UI (actions conditionnelles) : 2–4 j
Total FE : ~26–41 j

Ops/QA

Environnements + secrets + pipelines + tests e2e ciblés : 5–10 j

Total MVP : ~50–84 jours-homme (≈ 6–10 semaines à 2–3 personnes)

10.2 Target (2–3 mois additionnels)

Diff/compare avancé

Gestion dépendances bibliothèque

Rollback outillé

Preview “SES render” + tests automatisés

Monitoring/alerting publication

11) Risques & mitigations
Risque	Impact	Probabilité	Mitigation
Variables libres (typos) → emails cassés	Elevé	Elevée	Whitelist par event + lint + preview + jeux de données
Divergence “statut SELFY” vs “validité IRIS”	Moyen	Moyenne	Règles strictes : Published = validity window active + trace publish
Vendor lock-in éditeur	Moyen	Moyenne	POC 2 vendors + abstraction “EditorAdapter” + export HTML standard
HTML email incompatible clients	Elevé	Moyenne	Choisir éditeur reconnu + QA sur templates critiques + guidelines
IRIS API instable / latences	Moyen	Moyenne	Retries contrôlés + timeouts + idempotency + circuit breaker léger si besoin
Sécurité (XSS via HTML)	Elevé	Moyenne	Sanitization, CSP, stockage sécurisé, validation inputs, restrictions upload
Coût usage-based (éditeur) sous-estimé	Moyen	Moyenne	Vérifier modèle de facturation (MAU/exports/emails) en POC + plafond contractuel
12) Plan POC (2 semaines) — livrables mesurables
Objectif

Valider le choix “Hybride” et réduire le risque éditeur + intégration IRIS.

Semaine 1

Intégrer 1 éditeur SDK (candidat #1) dans une page SELFY.

Implémenter insertion merge tags Handlebars (UI).

Export HTML + stockage temporaire côté SELFY.

Lint variables (regex Handlebars) + whitelist simple.

Semaine 2

Implémenter IRIS adapter minimal :

create component version (principal)

create template final avec validityStartDate

“Publish” end-to-end : SELFY -> IRIS -> SES (vérif présence template dans SES via IRIS logs/retours).

Preview basique (HTML local + dataset).

Rapport POC : points bloquants, estimation coûts, recommandation vendor shortlist.

Critères de succès

HTML exporté stable, merge tags utilisables, UX SC acceptable.

Publish via IRIS fonctionne sur environnement test/recette.

Aucun point “security blocker”.

13) Décision & prochaines étapes
Décision

Adopter Scénario B (Hybride).

L’éditeur WYSIWYG est sélectionné via POC comparatif (2 candidats).

Prochaines étapes (immédiates)

Atelier IRIS/Klee : environnements (test/recette), auth, quotas, conventions de nommage, stratégie validité/rollback.

POC 2 semaines.

Finalisation chiffrage + planning lot.

Mise en place MVP.

Annexes
A) Références prix éditeurs

Unlayer pricing (plans payants : Launch/Scale/Optimize avec valeurs publiées)

Unlayer pricing page officielle

Beefree SDK pricing plans

Stripo plugin pricing

Stripo tool pricing (non-plugin)

GrapesJS open-source repo
