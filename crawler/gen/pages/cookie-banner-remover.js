import fs from "fs";
// Fonction pour supprimer les bannières de cookies
export async function removeCookieBanners(page) {
    try {
        console.log("Waiting For Cookie Banner...");
        await new Promise((resolve) => setTimeout(resolve, 10000)); // Attendre 30 secondes
        // Fonction pour extraire les boutons d'une frame donnée
        const extractButtonsFromFrame = async (frame) => {
            const buttons = await frame.evaluate(() => {
                const buttonElements = Array.from(document.querySelectorAll("button"));
                return buttonElements.map((button) => ({
                    text: button.textContent?.trim() || null,
                    className: button.className || "",
                    tag: button.tagName.toLowerCase(),
                    isDisabled: button.disabled || false,
                }));
            });
            return buttons;
        };
        // Extraire les boutons de la page principale
        let buttons = await extractButtonsFromFrame(page.mainFrame());
        // Extraire les boutons de chaque iframe
        const frames = page.frames();
        for (const frame of frames) {
            try {
                const iframeButtons = await extractButtonsFromFrame(frame);
                buttons = buttons.concat(iframeButtons);
                // Traiter les boutons pour supprimer les bannières de cookies
                for (const button of iframeButtons) {
                    if (!button.text)
                        continue;
                    const buttonText = button.text.toLowerCase();
                    if (buttonText.includes("accept") ||
                        buttonText.includes("ok") ||
                        buttonText.includes("agree") ||
                        buttonText.includes("allow")) {
                        console.log(`Banner Removed : ${button.text}`);
                        if (button.className) {
                            const selector = `button.${button.className.trim().split(' ').join('.')}`;
                            console.log(`Trying to click: ${selector}`);
                            await frame.waitForSelector(selector, { visible: true });
                            await frame.click(selector);
                        }
                        else {
                            console.log(`Cannot find accept button : ${button.text}`);
                        }
                    }
                }
            }
            catch (error) {
                console.error(`Error processing frame: ${error}`);
            }
        }
        // Sauvegarder la liste des boutons dans un fichier JSON
        const filePath = "./output.json";
        fs.writeFileSync(filePath, JSON.stringify(buttons, null, 2), "utf8");
        console.log(`Button list saved to ${filePath}`);
    }
    catch (error) {
        console.error("Error while scraping :", error);
    }
}
//# sourceMappingURL=cookie-banner-remover.js.map