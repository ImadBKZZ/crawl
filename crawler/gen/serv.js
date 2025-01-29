import * as http from 'http';
import * as fs from 'fs';
import { exec } from 'child_process';
const inputFilePath = './input.txt'; // Chemin vers le fichier input.txt
const PORT = process.env.PORT || 50001;
console.log("\n\nListening on port : " + PORT);
// Fonction pour extraire le nom de domaine
function extractDomainName(link) {
    const regex = /^(https?:\/\/)?(www\.)?([a-zA-Z0-9-]+)(\.[a-zA-Z]{2,})/;
    const match = link.match(regex);
    if (match && match[3]) {
        return match[3]; // Retourne le nom de domaine (sans "www" ou "https://")
    }
    return null; // Retourne null si aucun nom de domaine n'est trouvé
}
http.createServer((req, resp) => {
    let body = [];
    req.on('data', (chunk) => {
        body.push(chunk);
    }).on('end', () => {
        const bodyStr = Buffer.concat(body).toString();
        resp.writeHead(200, { 'Content-type': 'text/plain' });
        if (bodyStr.length !== 0) {
            const values = bodyStr.split(' ');
            const link = values[0];
            console.log("Received link: " + link);
            const domainName = extractDomainName(link);
            if (!domainName) {
                console.error("Nom de domaine non valide");
                resp.write("Erreur: Nom de domaine non valide\r\n");
                resp.end();
                return;
            }
            // Écrire le lien dans le fichier input.txt
            fs.writeFile(inputFilePath, link, async (err) => {
                if (err) {
                    console.error(`Erreur lors de l'écriture du fichier: ${err.message}`);
                    resp.write(`Erreur: ${err.message}\r\n`);
                    resp.end();
                    return;
                }
                console.log(`Nom de domaine écrit dans ${inputFilePath}`);
                // Exécuter la commande avec gen/crawler-cli.js
                const command = `node gen/crawler-cli.js --name ${domainName} --output_dir ./output/ --crawl_list ${inputFilePath} --pg_conf_file pg_conf.json --scrape_ads --click_ads=noClick --headless=false`;
                console.log(`Exécution de la commande: ${command}`);
                const crawlProcess = exec(command, (error, stdout, stderr) => {
                    if (error) {
                        console.error(`Erreur lors de l'exécution de la commande: ${error.message}`);
                        resp.write(`Erreur: ${error.message}\r\n`);
                        return;
                    }
                    if (stderr) {
                        console.error(`Erreur de sortie: ${stderr}`);
                        resp.write(`Erreur de sortie: ${stderr}\r\n`);
                        return;
                    }
                    console.log(`Sortie de la commande: ${stdout}`);
                    resp.write(`Sortie de la commande: ${stdout}\r\n`);
                });
                crawlProcess.on('close', (code) => {
                    console.log(`La commande s'est terminée avec le code ${code}`);
                });
            });
        }
        resp.end();
    });
}).listen(PORT);
//# sourceMappingURL=serv.js.map