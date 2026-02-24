afin de mettre en place une solution de front pour l'emailing je dois faire l"etude de ce ticket:
Etude et inventaire sur les outils externe de gestion des Template mails.



Détails clés
Field Tab
KPI
Divers
Description US


Contexte : 

Dans la continuité des fonctionnalités proposées par SELFY, un prochain lot portera sur l’intégration de la gestion des templates mails.
À ce jour, la création ou la modification d’un template mail nécessite une intervention technique directement sur l’asset concerné, impliquant un développement et une mise en production.

Le Service Client (SC) souhaite désormais être autonome sur la gestion des templates mails afin de pouvoir créer, modifier ou activer/désactiver des templates sans dépendre d’une MeP.

Par ailleurs, Comutitre a récemment mis en place une brique technique centralisée => IRIS permettant la gestion unifiée des différents templates mail utilisés par les assets internes.

Le présent lot vise à proposer un FE SELFY, connecté à IRIS, permettant au SC d’interagir avec cette brique technique pour que les actions de gestion des templates soient prises en compte par l’ensemble des assets durant l’envoi des mails.

Voici un récap des besoins SC : ( image jointes)
Objectif de l’étude

L’objectif de cette étude est de réaliser un inventaire des solutions existantes “sur étagère”, incluant notamment AWS SES, afin de proposer une solution FE intégrée à SELFY permettant :

d’éviter le développement complet d’un outil de gestion de templates mails from scratch ;

de répondre aux besoins d’autonomie du SC ;

de s’interfacer avec IRIS et la brique technique Comutitre.

L’étude devra permettre d’identifier la solution la plus adaptée parmi trois approches possibles :
➡️ Solution Comutitre (full SELFY)
➡️ Solution hybride
➡️ Solution externe

Périmètre de l’étude

L’étude devra analyser et comparer trois types de solutions :

Solution Comutitre – FE entièrement porté par SELFY
Développement d’un front spécifique dans SELFY.

Logique métier assurée par IRIS + la brique technique Comutitre.

UI/UX et parcours utilisateur implementés côté SELFY.

Solution Hybride
Utilisation de composants ou UI préexistants d’un outil tiers.

Intégration partielle dans SELFY pour simplifier le développement.

Connexion à IRIS et à la brique Comutitre.

Solution Externe
Choisir un outil de gestion de templates mails (ex : AWS SES, Mailjet, SendGrid, etc.).

Connexion de cet outil à IRIS et à la brique Comutitre.

Couverture maximale des besoins SC sans redévelopper des fonctionnalités existantes.

L’étude devra fournir pour chaque solution :

les avantages et limites ;

les impacts sur SELFY, IRIS et la brique technique ;

une estimation de charge (macro-chiffrage) ;

les prérequis techniques ;

un niveau d’adhérence avec les besoins SC.

Livrables attendus

Inventaire détaillé des solutions du marché pertinentes pour la gestion de templates mails.

Comparatif formalisé des trois scénarios (SELFY, hybride, externe).

Recommandation argumentée de la solution cible.
