import { simpleGit, SimpleGit, SimpleGitOptions } from 'simple-git';

const options: Partial<SimpleGitOptions> = {
   baseDir: path.join(process.cwd(), 'output'),
   binary: 'git',
   maxConcurrentProcesses: 6,
   trimmed: false,
};

// when setting all options in a single object
const git: SimpleGit = simpleGit(options);

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';


// Définir le chemin du dépôt
const repoPath = path.join(process.cwd(), "/output");
console.log(`test repo path :${repoPath}`);  
// Initialiser simple-git avec le chemin du répertoire

// Fonction pour nettoyer le dépôt
async function cleanRepository(folderToKeep: string): Promise<void> {
    try {
        // Vérifier si le répertoire existe
        if (!fs.existsSync(repoPath)) {
            throw new Error(`Le répertoire ${repoPath} n'existe pas.`);
        }

        const items = fs.readdirSync(repoPath); // Lister les éléments du répertoire

        // Parcourir les éléments du répertoire
        for (const item of items) {
            const fullPath = path.join(repoPath, item);

            // Supprimer tout sauf le dossier à conserver et le répertoire .git
            if (item !== folderToKeep && item !== '.git') {
                console.log(`Suppression de : ${item}`);
                if (fs.statSync(fullPath).isDirectory()) {
                    fs.rmSync(fullPath, { recursive: true, force: true });
                } else {
                    fs.unlinkSync(fullPath);
                }
            }
        }

        console.log(`Le dépôt a été nettoyé. Seul le dossier '${folderToKeep}' est conservé.`);
    } catch (error) {
        console.error('Erreur lors du nettoyage du dépôt :', error);
        throw error; // Propager l'erreur pour une gestion ultérieure
    }
}

// Fonction pour pousser les changements
async function pushChanges(folderToKeep: string): Promise<void> {
    try {
        // Nettoyer le dépôt
        await cleanRepository(folderToKeep);

        // Vérifier si le dossier à conserver existe
        
        const folderPath = path.join(repoPath, folderToKeep);
        console.log(folderPath);
        if (!fs.existsSync(folderPath)) {
            throw new Error(`Le dossier '${folderToKeep}' n'existe pas dans le répertoire.`);
        }

        await git.add(`./${folderToKeep}`);

        // Faire un commit avec un message
        await git.commit('Mise à jour automatique du dépôt');

        // Push les changements vers la branche principale
        await git.push('origin', 'main'); // Remplacez 'main' par votre branche si nécessaire

        console.log('Les changements ont été poussés avec succès.');
    } catch (error) {
        console.error('Erreur lors du push des changements :', error);
        throw error; // Propager l'erreur pour une gestion ultérieure
    }
}

export { cleanRepository, pushChanges };