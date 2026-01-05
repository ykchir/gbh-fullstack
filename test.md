Oui, ma question c’était : est-ce que document-service doit appeler Cognito ou passer par user-service.

Je veux trancher :
- Je refuse que document-service appelle Cognito pour valider les tokens (latence, duplication config, risques, coûts).
- Je refuse aussi un call user-service systématique à chaque requête (SPOF + hop réseau).

Je veux donc l’Option C comme baseline :
- Chaque service valide le JWT localement via JWKS (cache, vérif iss/aud/exp/signature, extraction claims).
- Seul user-service gère refresh/login (c’est le seul endroit qui utilise le SDK Cognito).

Mais je veux un plan “prod-grade” pour la révocation / user disabled :
- Définis clairement quelles routes doivent faire une validation renforcée
- Propose un mécanisme d’introspection ponctuel via user-service (pas à chaque requête)
- Ajoute un fail-fast validator au boot qui interdit AWS_ENDPOINT_URL et interdit tout endpoint Cognito custom.
Donne-moi le code NestJS intégrable (guards + jwks cache + interfaces) avec commentaires en anglais.