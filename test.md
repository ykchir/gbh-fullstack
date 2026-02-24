1) Ce dont j’ai besoin côté SELFY (priorité haute)

Auth/RBAC

Comment Cognito est utilisé (JWT, groups, custom claims) et où est stocké le RBAC (tables, policy engine, guard NestJS) ?

Existe-t-il déjà un modèle “roles/permissions” exploitable pour SC (relecteur, valideur, admin) ?

Patterns d’intégration externes

As-tu déjà un microservice qui consomme une API externe (pattern adapter, retry, circuit breaker, idempotency, logs) ?

Y a-t-il déjà une brique “http client” standard (Axios/undici) + observabilité (correlation-id) ?

Observabilité et audit

Logging centralisé (CloudWatch, ELK, Datadog), tracing, correlation IDs ?

Y a-t-il déjà une notion d’audit log (qui a fait quoi) dans SELFY ?

Frontend Next.js

App Router ou Pages Router, pattern state management (Zustand/Redux), composant table, gestion forms.

Existence d’un “design system” ou UI kit (et contraintes).

Ces éléments permettent de chiffrer A/B correctement et de cadrer “workflow + audit” réaliste.

2) Ce dont j’ai besoin côté “format template” (priorité haute)

Même sans IRIS, si tu as dans le code actuel (assets existants) :

un exemple de template email actuel (HTML) + la façon dont les variables sont injectées,

la liste des variables typiques (ex: nom client, date, montant, lien),

la manière dont sont gérés header/footer/signature,

alors on peut déjà trancher “éditeur WYSIWYG compatible” vs “MJML/code-based” et cadrer la bibliothèque.
