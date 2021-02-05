// On récupère les objets dont on a besoin
// POur gérer les requêtes HTTP
let http = require('http');
// Pour gérer les fichiers
let fs = require('fs');
// Pour gérer les URL
let url = require('url');
// Création d'un eventEmitter
const EventEmitter = require('events');

// EXEMPLE EVENEMENT 1
// Création d'un événement
let monEcouteur = new EventEmitter();
// Déclaration de l'événement
// On peut ajouter des paramètres
// monEcouteur.once(...) : n'exécute l'event qu'une seule fois
monEcouteur.on('saute', function (a, b) {
    console.log("J'ai sauté !", a, b);
})
// On déclenche l'événement avec paramètres
monEcouteur.emit('saute', 10, 20);

// EXEMPLE EVENEMENT 2 : création d'un système d'événements
// On déclare notre objet App
let App = {
    // on crée la fonction start et son comportement
    start: function (port) {
        // On crée l'emitter
        let emitter = new EventEmitter();
        // On démarre le serveur
        let server = http.createServer((request, response) => {
            response.writeHead(200, {
                'Content-type': 'text/html; charset=utf-8'
            });
            // Si on se trouve à la racine du site, on déclenche l'événement root
            if (request.url === '/') {
                emitter.emit('root', response);
            }
            response.end();
        }).listen(port);
        return emitter;
    }
}
// On utilise l'objet créé
let app = App.start(8080);
// On décrit l'événement root
app.on('root', function (response) {
    response.write('Je suis à la racine');
});

// EXEMPLE 1
// let server = http.createServer();
// On écoute un événement sur la requête
// server.on('request', (request, response) => {
//     response.writeHead(200, {
//         'Content-type': 'text/html; charset=utf-8'
//     });
//     response.end('Salut, comment ça va?');
// });
// On déclare le port sur lequel on écoute
// server.listen(8080);

// EQUIVALENT A
// http.createServer((request, response) => {
//     response.writeHead(200, {
//         'Content-type': 'text/html; charset=utf-8'
//     });
//     response.end('Salut, comment ça va?');
// }).listen(8080);

// EXEMPLE 2 et 4 : avec une page HTML
// let server = http.createServer();
// // On écoute un événement sur la requête
// server.on('request', (request, response) => {
//     let query = url.parse(request.url, true).query;
//     let name = query.name === undefined ? 'anonyme' : query.name;
//     // Lecture de fichier
//     fs.readFile('index.html', 'utf-8', (err, data) => {
//         // Si erreur, on la renvoie
//         if (err) {
//             response.writeHead(404);
//             response.end("Ce fichier n'existe pas");
//         } else {
//             // Type de contenu
//             response.writeHead(200, {
//                 'Content-type': 'text/html; charset=utf-8'
//             });
//             data = data.replace('{{ name }}', name);
//             // On renvoie les data du fichier
//             response.end(data);
//         }
//     })

// });
// // // On déclare le port sur lequel on écoute
// server.listen(8080);

// EXEMPLE 3 :
// let server = http.createServer();
// server.on('request', (request, response) => {
//     response.writeHead(200);
//     // On parse l'URL de la requête
//     // 2e paramètre : Si true, on parse aussi ce qui est récupéré dans le paramètre HTTP
//     let query = url.parse(request.url, true).query;
//     if (query.name === undefined) {
//         response.write('Bonjour anonyme');
//     } else {
//         response.write('Bonjour ' + query.name);
//     }
//     response.end();
// });
// server.listen(8080);