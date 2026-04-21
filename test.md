En tant que referent technique et expert chez comutitres dans l'équipe FABRIQUE, on me demande de faire une etude/macrochiffrage pour la mise en place de cette solution( solution 1 et solution 2 comme sur les photos.
ces deux photos reprensentent le diagramme de sequence de ce qu'on veut implementer comme solution. la solution étant la création d'une page de formulaire permettant les personnes elligibles à l'abonnement IRS SCOL'S de pouvoir acceder à la page de formulaire.
voici les échanges d'email:
Bonjour à tous, 

Suite au point avec La Fabrique, Jean-Philippe a proposé 2 options pour la gestion du formulaire hybride ( le client complète son formulaire depuis son ordinateur puis l’imprime pour la signature, la photo et le RIB). 
L’équipe la Fabrique pourra faire un retour pour l’estimation du chiffrage pour le 15 avril. 

Scénario 1 : 
•	Ce scénario permet de générer la RUM suite à la génération du formulaire au format PDF pour impression :
o	Dans ce scénario, TSA pourra prendre en charge l’envoi du mail aux clients Scol’R,
o	Un référentiel devra être créé pour assurer la génération de la RUM avec le numéro du formulaire.

Scénario 2 :
•	Ce scénario permet de générer la RUM via un token présent dans le lien du formulaire envoyé par mail au client :
o	Dans ce scénario Comutitres devra envoyer le mail aux clients Scol’R,
	Il faudra donc définir un processus permettant à TSA de nous transmettre les adresses e mail des clients et le processus d’envoi de mail,
o	Un Référentiel RUM devra être créé ainsi qu’une génération de Token avec DataFactory.

Champs demandés aux clients pour réaliser sa souscription :
•	Référence carte scol'R,
•	Nom / prénom du payeur et du porteur,
•	Date de naissance,
•	Adresse e-mail du payeur,
•	Adresse e-mail du porteur,
•	Niveau scolaire, 
•	Nom de l’établissement,
•	Adresse postale de l’établissement,
•	Photo du porteur,
•	Numéro de client du porteur si déjà existant,
•	Numéro de client du payeur si déjà existant,
•	Mandant SEPA et RUM,
•	RIB,
•	Signature. 
@LIM Karine si tu identifies des champs manquant pour le formulaire, n’hésite pas à le compléter. 


Bonjour,

Pour faire suite à notre réunion, voici les détails pour générer la RUM :

o	Le n° de RUM est formé de 33 ou 35 caractères obtenus en concaténant :
	Indicateur de RUM issue de la continuité d’une APA en Mandat :
	« ++ » si l’indicateur de mandat SEPA migré est à « Oui ».
	Rien s’il s’agit de la création d’un nouveau mandat
	Code ICS de COMUTITRES : FR42ZZZ457385. 
	Référence du contrat commercial ou du contrat tiers payant sur 14 caractères, en remplaçant les caractères « _ » éventuellement présents en caractère « - ». La référence doit être éventuellement complétée à gauche par des zéros pour que sa longueur soit de 14 caractères. 
	Code produit du fichier de paramétrage : 01 (iRS), 02 (iRE), 04 (NVA),, 05 (NL+). Il doit être éventuellement complété à gauche par un zéro pour que sa longueur soit de 2 caractères.
	Indice sur 2 caractères : permet la distinction entre 2 mandats créés sur un même contrat commercial. Il doit être éventuellement complété à gauche par un zéro pour que sa longueur soit de 2 caractères. Il commence à « 00 ».
	Clé de contrôle : 2 chiffres ajoutés pour permettre au ACE de vérifier la chaîne de caractère de la RUM. Elle est construite à partir d’un modulo 97 (plus exactement, elle est de 97-modulo97). Les caractères utilisés pour ce calcul doivent être numériques. Ainsi : 
	Le cas échéant, les « ++ » sont remplacés par « 11 », 
	L’ICS n’est pas considéré, 
	En cas de présence d’un « _ » dans la référence du contrat commercial, celui-ci ne sera pas considéré.
o	Exemple pour le contrat au produit Navigo Annuel de référence 000987654_3 : 
	La RUM générée sera ++FR42ZZZ457385000000987654-30400yy, 
	Avec yy, la clé de contrôle calculée en utilisant les chiffres 1100000098765430400.
	A savoir : yy = 97 – Modulo97(1100000098765430400) = 97 – 69 = 28
Pour calculer le modulo97 : https://www.dcode.fr/calculatrice-modulo-n)

si vous avez des questions pour mieux comprendre n'hesitez pas pour mieux faire l'étude.
vous êtes la reference absolue, j'attend de vous un travail digne d'une personne de votre niveau.
