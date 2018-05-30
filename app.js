require('dotenv').config();//Module dédié à la gestion de variables d'environnement(fichier .env)

// 1 ) Appel du connecteur => Gère/Programme les interactions entre le Bot et le client .
var builder = require("botbuilder");

//Sauf que l'on a pas de module pour diffuser les messages à tous les intéragisseurs , on va appeler le module 'restify'
//2) Appeler un serveur RESTIFY pour broacast les messages => Envoyer des messages au BOT / d'en recevoir
var restify = require("restify");

//Chaque serveur doit avoir un port d'écoute pour fonctionner .
//3) On crée un serveur en lui donnant un port d'écoute libre.
var server = new restify.createServer();
const port = process.env.PORT || 3978;

server.listen(port, function(){console.log(`Serveur sur écoute du port ${port} du serveur ${server.name}`);});

// 4) Configuration de notre BUILDER pour connecter le client avec bot.
//Par défaut 'ChatConnector' n'attend pas de paramètres
var connector = new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});

// 5)   Créer notre route de dialogue avec une requête POST pour ENVOYER un message
//Dans celle-ci ,on dit que le BUILDER doit écouter les évènement à cette requête.
server.post("/api/messages", connector.listen());

// creation d'un unite de stockage
var inMemoryStorage = new builder.MemoryBotStorage();

// 6) Ouverture de la conversation.
//On y met nos dialogues sous forme de tableau de fonctions. Ces dialogues seront définis plus bas.
var bot = new builder.UniversalBot(connector, [
    function(session){
        //session.beginDialog("greetings", session.userData.profile);
        //Cette fonction contient le dialogue "menu" programmé plus bas.
        session.beginDialog("menu");
    },
    /*function(session, results){
        session.userData.profile = results.response;
        session.send(`hello ${session.userData.profile.name} :) !!`);
    }*/
]).set('storage', inMemoryStorage);
//Définition de la mémoire de stockage pour nos DialogData , userData ou encore nos ConversionData.

// ------   LES DIALOGUES DE NOTRE BOT ----- //

//Le 'dialog1' contient deux fonctions. La première demande le nom du User et le 2nd contient
//la nom saisie qui sera retourner dans la conversation pour terminer le dialogue.
bot.dialog("dialog1", [
    function(session){
        builder.Prompts.text(session,`c\'est quoi ton prénom ?`);
    },
    function(session, result){
        session.endDialogWithResult(result);
    }
]);


/* Un objet initialisant le menu de notre dialogue suivant. Celui contient le contient la valeurs des rubriques de cemnu*/
const menuItems = {
    "toto":{
        items: "option1"
    },
    "titi":{
        items: "option2"
    },
    "tutu":{
        items: "option3"
    }
};

/*Celui effectue :
    - l'affichage du menu (menuItems) , l'obtention de la rubrique choisie.
    - Redirection vers un dialogue selon le lien du menu choisis.
*/
bot.dialog('menu',[
    //Etape1
    function(session){
        builder.Prompts.choice(session,"Choisissez une option du menu suivant:",menuItems,{listStyle:3});
        //Le prompt choisi affiche le lien du menu avec une mise en forme via l'attribut 'listStyle'.
    },
    function(session, results){
        var choice = results.response.entity;
        //Lien du menu relevé , si clique sur 'toto' , 'toto' sera stocké ici.
        //Pour ensuite être redirigé vers le nom du dialogue associé la rubrique 'toto' via 'menuItems[choice].items'
        session.beginDialog(menuItems[choice].items);
    }
]);


/*Ce dialogue  :
    1)  Définit les données de l'utilisateur en lui demandant son prénom
    2)  Assigne la valeur saisie à l'attribut 'name' de 'profile' puis la retourne en tant que réponse dans la conversation.
*/
bot.dialog('greetings', [
    //Etape 1
    function (session, args, next){
        session.dialogData.profile = args || {};
        if(!session.dialogData.profile.name) builder.Prompts.text(session, "What's your name ?");
        else next();
    },
    //Etape 2
    function (session, result){
        if(result.response){
            session.dialogData.profile.name = result.response;
        }
        session.endDialogWithResult({response: session.dialogData.profile});
    }
]);


/*--- Les dialogues de notre menu 'toto', 'titi' & 'tutu' ---*/
bot.dialog('option1',[
        function(session){ session.send('Vous êtes dans le dialogue 1');}
]);
bot.dialog('option2',[
    function(session){ session.send('Vous êtes dans le dialogue 2');}
]);
bot.dialog('option3',[
    function(session){session.send('Vous êtes dans le dialogue 3');}
]);
