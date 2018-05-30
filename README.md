### Cours - Réalisation d'un ChatBot

Notions à comprendre : BOTBUILDER, SERVICE WEB, CHATCONNECTOR, UNIVERSALBOT, UNITE DE STOCKAGE, PROMPT , STATE

#### 1) Appeler le module **BOTBUILDER** qui permet de créer le bot et de gérer les interactions avec le bot depuis le service web(voir suite).  
  Appeler le module **SERVICE WEB** via *restify*
  qui permet de créer le service web afin de partager les messages entre le bot et le client. On l'utilisera sous forme de serveur.

  ````
  var builder = require("botbuilder");
  var restify = require("restify");
  ````

#### 2) Configurer et Lancer ce serveur pour le rendre disponible sur notre client([*Bot Emulator*](https://github.com/Microsoft/BotFramework-Emulator/releases))  
Chaque serveur doit avoir un port d'écoute pour fonctionner.

````
var server = new restify.createServer();
const port = process.env.PORT || 3978;

server.listen(port, function(){console.log('Serveur sur écoute du port ${port} du serveur ${server.name}');});
````

#### 4) Créer une instance d'un **CHATCONNECTOR** depuis le module BotBuilder.  
Le ChatConnector connecte le bot au serveur afin de "communiquer" avec lui.
````
var connector = new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});
````

#### 5) Soumettre l'instance du BotBuilder à notre serveur rest(service web) via une *requête post*.  
On lui dit que le connecteur écoutera les évènements à cette requête.
````
server.post("/api/messages", connector.listen());
````

##### 6) Instancier une **UNITE DE STOCKAGE** depuis le BotBuilder
La conversation avec le bot nécessitera une persistance de certaines infos pour le tracking de cette dernière.  
````
var inMemoryStorage = new builder.MemoryBotStorage();
````

Ces infos sont récupérés depuis des **STATES**  
- Les infos de l'utilisateur que l'on peut récupérer via le state *UserData*  
- ceux de la conversation via *conversationData*  
- ceux des dialogues via *dialogData*  

#### 7) Créer une instance d'un **UNIVERSALBOT**
  -  Y associer le connector , l'unité de stockage et le tableau de fonctions(voir plus loin)
  - On appelle le root (premier dialogue) avec beginDialog(nom du dialogue) .

````
var bot = new builder.UniversalBot(connector, [
    function(session){
        session.beginDialog("menu");
    }
]).set('storage', inMemoryStorage);
````  

C'est l'objet qui modalise une conversation. Cette conversation empilera un ou plusieurs dialogue. On parlera de **PILE DE DIALOGUE** qui est visible sur le client. Par défaut , la pile de dialogue est vide  . Si l'utilisateur envoie un message, le premier dialogue lui sera envoyé.


#### 8) Créer un dialogue avec la méthode dialog(nom du dialogue,tableau de fonction) de l'instance UniversalBot prenant 2 paramètres.

  - Appeler un **PROMPT** dans une fonction pour afficher au client via la méthode *text()*.

````
bot.dialog("dialog1", [
    function(session){
        builder.Prompts.text(session,`c\'est quoi ton prénom ?`);
    },
    function(session, result){
        session.endDialogWithResult(result);
    }
]);
````

(A mettre à jour)
