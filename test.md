1) Cadrage technique + contrat API + sécurité — 0,5 à 1,5 j.h
Définition endpoint (payload, taille max, formats), codes erreurs, motifs KO.
Gestion auth (A definir )

2) Création du microservice NestJS (squelette + standards) — 1 à 2 j.h
Repo/module, Dockerfile, config, healthcheck, versioning.
Middleware de correlationId / requestId.
Validation d’entrée (mime, taille, dimensions si dispo).

3) Portage logique Python Et PHP → TS (appel Bedrock + parsing réponse) — 1,5 à 3 j.h

Client Bedrock runtime en Node/TS.
Mapping strict des réponses vers OK/KO + motif.
Normalisation des erreurs (429/5xx/timeouts) vers erreurs métier/techniques.

4) Robustesse production (synchrone) — 2 à 4 j.h

Timeouts calibrés, retries bornés (ex: 1 retry max), backoff.
Circuit breaker, bulkhead / limite de concurrence côté service.
Stratégie d’erreurs : “KO technique, réessayer” vs “KO définitif”.

5) Observabilité — 1 à 2 j.h

Logs structurés sans image (taille, format, latence, code retour Bedrock, motif).
Metrics : latence p95/p99, taux OK/KO, taux 429/5xx, timeouts.

6) Tests + non-régression fonctionnelle vs script Python — 1,5 à 3 j.h

Tests unitaires (parsing, mapping).
Jeu d’images de test : idéalement un set anonymisé/autorisé, sinon mocks.

7) Ajustements post-déploiement 0,5 à 1,5 j.h

Total Dev : JH
