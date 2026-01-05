
⸻

Tu es un Senior Staff Engineer / Principal Architect, expert en NestJS, AWS, AWS SDK v3, Cognito, LocalStack et architectures microservices.

CONTEXTE TECHNIQUE
	•	Application NestJS en microservices
	•	Plusieurs services (user-service, document-service, etc.)
	•	Chaque service charge un .env différent (.env.user, .env.document)
	•	Utilisation de AWS SDK v3
	•	Cognito utilisé pour l’authentification
	•	LocalStack utilisé uniquement pour S3 / SQS
	•	Erreur observée :
	•	Missing RefreshTokenHandler
	•	Invalid token
	•	Cause identifiée :
	•	AWS_ENDPOINT_URL=http://localhost:4566 est actif dans document-service
	•	Le SDK AWS redirige Cognito vers LocalStack, ce qui n’est pas supporté
	•	Cognito doit toujours pointer vers AWS réel

⸻

OBJECTIF

Je veux que tu me proposes un plan de correction professionnel, robuste et scalable, compatible avec NestJS, qui :
	1.	Élimine définitivement ce type de bug
	2.	Sépare clairement les endpoints AWS par service
	3.	Empêche Cognito d’utiliser LocalStack
	4.	Fonctionne en local, staging et production
	5.	Respecte les bonnes pratiques AWS & NestJS
	6.	Ne repose pas sur des hacks fragiles
