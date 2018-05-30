1) Appeler le module Botbuilder
  Permet de créer le bot et de gérer les interactions avec le bot depuis le serveur(voir suite).



2) Appeler le restify
  Permet de créer le serveur REST afin de partager les messages entre le bot et le client

3) Configurer et Lancer ce serveur pour le rendre disponible sur notre client(Bot Emulator)

````
var server = new restify.createServer();
const port = process.env.PORT || 3978;

server.listen(port, function(){console.log('Serveur sur écoute du port ${port} du serveur ${server.name}');});
````
4) Créer une instance d'un CHATCONNECTOR depuis le module BotBuilder.
````
var connector = new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});
````
5) Soumettre l'instance du BotBuilder à notre serveur REST via une requête POST.
````
server.post("/api/messages", connector.listen());
````

6) Instancier une UNITE DE STOCKAGE depuis le BotBuilder
(Expliquer)
````
var inMemoryStorage = new builder.MemoryBotStorage();
````

7) Créer une instance d'un UNIVERSALBOT
  -  Y associer le connector , l'unité de stockage et le tableau de fonctions(voir plus loin)
````
var bot = new builder.UniversalBot(connector, [
    function(session){
        session.beginDialog("menu");
    }
]).set('storage', inMemoryStorage);
````

8) Créer un dialogue avec la méthode dialog de l'instance UniversalBot prenant 2 paramètres : le nom du dialogue et un tableau de fonction.

  - Appeler un PROMPT dans une fonction pour afficher au client via la méthode text().

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
