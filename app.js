// 1 ) Appel du connecteur ( on s'en sert gèrer les intéractions avec le bot ) . Il faudra le configurer plus tard.
var builder = require('botbuilder');

//Sauf que l'on a pas de module pour diffuser les messages à tous les intéragisseurs , on va appeler le module 'restify'
//2) Appeler un serveur RESTIFY pour broacast les messages
var restify = require('restify');
var server = restify.createServer();
const port = 3978;

//Chaque serveur doit avoir un port d'écoute pour fonctionner .
//3) On lui en donne un "au hasard" qui n'est pas utilisé.
server.listen(port,function(){console.log("Serveur sur écoute du port "+port+" du serveur",server.name);});

// 4) Configuration de notre BUILDER via ChatConnector()
//Par défaut 'ChatConnector' n'attend pas de paramètres
var connector = new builder.ChatConnector();

// 5)   Créer notre route de dialogue avec une requête POST
//Pour envoyer un message au BOT , on créer un requête POST.
//Dans celle-ci ,on dit que le BUILDER doit écouter les évènement à cette requête.
//A chaque message , le serveur se rafraîchit et charge automatiquement les messages connector.listen
server.post('/api/messages' ,connector.listen());

// 6) Ouverture du manageur de conversation entre l'utilisateur et le bot.
// Manages your bots conversations with users across multiple channels

//On y met nos dialogues. Ces dialogues seront définis plus bas.
var bot = new builder.UniversalBot(connector,[
    //C'est ici que le dialogue commence, mais il faut l'appeler
    function(session){
        // 7) Appel le dialogue (On appelle le 'beginDialogue' -> ROOT car c'est lui qui le commence )
        session.beginDialog('dialog1');
        session.beginDialog('dialog2'); //Trouver la bonne méthode pour avoir un 2nd exo.
    },function(session,result){ //Une fois la première fonction terminée.
        session.send("Coucou %s",result.response);
        session.send("Je crois qu'elle peeut demain");
    }//La pile est vide
]);


//Un dialogue crée que l'on va implémenter dans le manager de concversion.
bot.dialog('dialog1', [
    function(session){// Notre LIFO car c'est notre première fonction
        //Notre Bot utilise bot.Prompts.text() par affihcer c'est message sur l a console.
        builder.Prompts.text(session, 'c\'est quoi ton prénom ?' );
    },
    function(session, result){
            session.endDialogWithResult(result);
    }
]);

/*
  NOTIONS à REVOIR  -> Builder  , beginDialog & Pile

  ROOT  => dialogue par défaut de la conversation. Il se lancera automatiquement
  LIFO => Première fonction d'un digolgue
*/
