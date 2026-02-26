Voici la réponse de l'architecte de IRIS:
Après lecture des différentes documentations, nous pouvons organiser un atelier avec Klee, pour discuter de la compréhension d'implémentation et d'intégration.
 
 
 
 
IRIS gère-t-il un statut (draft/published/archived) ou seulement des versions ?
 
=> comme exposé lors de la présentation, non il n'y a pas de notion de Draft / published / archived pour le moment, juste la notion de date de validité.
 
Il est possible de discuter de ce besoin coté IRIS afin  que IRIS-TEMPLATE serve de tampon avant de pousser sur AWS SES.
 
 
 
IRIS expose-t-il un endpoint “promote/publish” ?
 
=>  lien des Swagger des API Restful de IRIS-TEMPLATE
Création d'une version de composant de template - v26.1 - Documentation Asset - Confluence
 
Il faut se renseigner sur les host de Tests / Recette
 
 
 
 
IRIS gère-t-il des “components/snippets” réutilisables et leur versioning ?
 
 
Il faut en effet créer les "composants" qui sont versionnés avant de créer la Template qui regroupe les composants.
 
Type de composant de template parmi principal, style, signature, footer cf Swagger
 
Cf. API et diagramme de séquence sur les POST.
 
 
 
 
 
 
 
Format des templates : HTML libre, MJML, Handlebars/Liquid, autre ?
 
Voici l'Etude Klee sur le Templating SES :
[ETUDE] Complément IRIS-76 : template de courriel et versionnage - Etudes & Projets - Confluence
 
 
Voici la Doc AWS sur les possibilités avec le Templating :
Advanced email personalization - Amazon Simple Email Service
 
 
Ci-dessous un exemple de produit disponible pour créer les Templates au format AWS SES.
Je pense que le produit SELFY va devoir être proche de ce que fait cet éditeur.
 
Modèles d'e-mails AWS SES - Syntaxe Handlebars, bonnes pratiques et exemples
 
Basic SES Template Structure
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
   <title>{{subject}}</title>
    <style>
        body { font-family: Arial, sans-serif; }
        .container { max-width: 600px; margin: 0 auto; }
        .header { background: #007bff; color: white; padding: 20px; }
        .content { padding: 20px; }
        .footer { background: #f8f9fa; padding: 20px; text-align: center; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
           <h1>{{companyName}}</h1>
        </div>
        <div class="content">
            <p>Hello {{customerName}},</p>
            <p>{{messageBody}}</p>
            {{#if ctaButton}}
            <a href="{{ctaLink}}" style="background: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">{{ctaButton}}</a>
            {{/if}}
        </div>
        <div class="footer">
            <p>© {{year}} {{companyName}}. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
 
 
 
 
Comment sont définies les variables : schema (JSON schema) ou libre ?
 
=> Cf. exemple et Doc fournis au point 4.
 
 
Où se fait le render final : IRIS, brique technique, asset ?
 
=> C'est la moteur AWS SES qui fait le rendu à l'envoie de l'email.
Une méthode de "TestRenderTemplate" est disponible par API sur AWS SES mais pour le moment pas exposé par IRIS-TEMPLATE
TestRenderTemplate - Amazon Simple Email Service
 
 
 
Multi-assets : avez-vous un modèle “brand kit” (header/footer/signature/expéditeur) déjà existant ?
 
=>  Non, il n'y a pas d'exemple déjà créé.
Après lecture des différentes documentations, nous pouvons organiser un atelier avec Klee pour discuter plus précisément de l'implémentation et intégration
 
 
Qui est l’expéditeur/SMTP aujourd’hui , est-ce “par asset” ?
=> Cf Swagger des API IRIS-TEMPLATE
Dans la déclaration de la structure du template il y'a l'email de l'expéditeur à renseigner.
 
Example Value
Schema
{
  "emailTemplateName": "Main_Template",
  "senderEmailAddress": "test@mail.com",
  "subjectPart": "Subject",
  "validityStartDate": "2025-05-27T00:00:00Z",
  "components": [
    "principal_template"
  ]
}

et voici la réponse de l'equipe de developpement de IRIS
IRIS gère-t-il un statut (draft/published/archived) ou seulement des versions ?
Iris ne gère pas de statut, seulement des versions qui sont horodatées
 
IRIS expose-t-il un endpoint “promote/publish” ?
Iris n'expose pas de endpoint "promote/publish"
 
IRIS gère-t-il des “components/snippets” réutilisables et leur versioning ?
Iris gère des components réutilisables avec versioning. Pour créer un template (final) il faut d'abord créer ses composants qui sont chacun versionnés en fonction de date de validités (début/fin horodatés). Pour créer un template il faut à minima créer un composant de template de type principal. Parmi les types de composants il y a: principal, style, signature, footer. Une fois le composant créé il peut être utilisé pour créé un template final et il peut très bien être utilisé par différents templates finals.
 
Format des templates : HTML libre, MJML, Handlebars/Liquid, autre ?
La norme de templating repose sur la syntaxe Handlebars qui correspond à ce que AWS SES utilise. Ensuite le contenu des templates sont à définir en HTML et la syntaxe d'incorporation des composants de template se base sur une syntaxe personnalisé qui s'inspire de handlebars dans le sens ou c'est une notation avec des simples accolades: <html>...{nomDuComposant}...</html>
 
Comment sont définies les variables : schema (JSON schema) ou libre ?
Actuellement les variables sont définies librement dans le template. Il n'y a pas de structuration définie.
 
Où se fait le render final : IRIS, brique technique, asset ?
Un premier render se fait par le microservice Iris Template. On définit la structure du template via des appels API REST et ensuite Iris Template en fonction des données renseignées fusionne le tout et sauvegarde le template résultant dans AWS SES. Après la génération finale avec le remplacement des variables se fait par AWS SES. C'est pour cela que les variables sont définies en suivant la syntaxe Handlebars.
 
Multi-assets : avez-vous un modèle “brand kit” (header/footer/signature/expéditeur) déjà existant ?
Le brand kit existant actuellement c'est: une partie principal qui comprend le corps du template (body) auquel on peut rajouter une partie style, signature et footer. C'est une structure qui a été pensé lors des études IRIS demandées sur la gestion des templates dans IRIS.
 
À partir de l’adresse <https://comutitres.atlassian.net/wiki/spaces/DA/pages/5037490177/Cr+ation+d+une+version+d+un+mod+le+d+email+-+v26.1>
 
