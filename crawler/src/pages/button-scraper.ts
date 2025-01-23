import puppeteer, { Page } from "puppeteer";

async function getClickableButtons(url: string): Promise<void> {
  // Lance une nouvelle instance de navigateur
  const browser = await puppeteer.launch({ headless: true }); // headless: false pour voir la navigation
  const page: Page = await browser.newPage();

  try {
    // Accède à la page cible
    console.log(`Navigation vers ${url}...`);
    await page.goto(url, { waitUntil: "networkidle2" });

    // Extrait les boutons cliquables
    const clickableButtons = await page.$$eval("button, a, input[type='button'], input[type='submit']", (elements) => {
      return elements.map((el) => {
        let text = el.textContent?.trim() || ""; // Récupère le texte du bouton
        const tagName = el.tagName.toLowerCase(); // Récupère le type d'élément
        const id = el.id ? `#${el.id}` : "";
        const classes = el.className ? `.${el.className.split(" ").join(".")}` : "";
        return { tagName, text, selector: `${tagName}${id}${classes}` };
      });
    });

    // Affiche les boutons cliquables dans la console
    console.log("Boutons cliquables trouvés :");
    clickableButtons.forEach((button, index) => {
      console.log(`${index + 1}. [${button.tagName}] - Texte: "${button.text}" | Sélecteur: ${button.selector}`);
    });
  } catch (error) {
    console.error("Erreur lors du scraping :", error);
  } finally {
    // Ferme le navigateur
    await browser.close();
  }
}

// Appelle la fonction avec une URL cible
const targetURL = "https://www.adidas.fr/"; // Remplacez par l'URL à scraper
getClickableButtons(targetURL);
