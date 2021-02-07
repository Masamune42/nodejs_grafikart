const fs = require('fs');

// EXEMPLE 1
// fs.readFile('demo.mp4', (err, data) => {
//     if (err) throw err
//     fs.writeFile('copy.mp4', data, err => {
//         if (err) throw err
//         console.log("fichier copié");
//     });
// });
// Problème : gourmand en ressources à la lecture et à l'écriture

// EXEMPLE 2 : les streams
// Utile lors de la lecture / écriture de fichiers volumineux en les découpant morceau par morceau
// On peut écrire à différents endroits
let file = "demo.mp4";
// Création d'un stream de lecture
let read = fs.createReadStream(file);
// Création d'un stream d'écriture
let write = fs.createWriteStream("copy.mp4");
let write2 = fs.createWriteStream("copy2.mp4");

// On récupère les stats du fichier
fs.stat(file, (err, stat) => {
    // Taille totale du fichier
    let total = stat.size;
    let progress = 0;

    // A chaque fois qu'on lit une partie du fichier
    read.on('data', (chunk) => {
        progress += chunk.length;
        console.log("J'ai lu " + Math.round(100 * progress / total) + "%");
    });

    // On connecte le flux de lecture à celui d'écriture
    // Gère les engorgements et les pauses
    read.pipe(write);
    read.pipe(write2);

    // A la fin de la lecture
    // write.on('end', () => {
    //     console.log("J'ai fini de lire le fichier");
    // });

    // Lorsque l'on fini d'écrire, affichage
    write.on('finish', () => {
        console.log("Le fichier a été copié");
    });
})