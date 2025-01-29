function analyzeAdHTML(htmlContent: string): number {
    const suspiciousPatterns: RegExp[] = [
        /<script[^>]*>.*document\.cookie.*<\/script>/is, // Accès aux cookies
        /<script[^>]*>.*localStorage.*<\/script>/is, // Accès au stockage local
        /<script[^>]*>.*sessionStorage.*<\/script>/is, // Accès au stockage de session
        /<script[^>]*>.*window\.location.*<\/script>/is, // Redirection forcée
        /onload\s*=\s*["']?[^"']*window\.location/i, // Redirection via onload
        /<iframe[^>]*src=['"]?http/i, // Iframes pointant vers des sources externes suspectes
        /<script[^>]*>.*eval\(.*<\/script>/is // Exécution de code dynamique avec eval
    ];
    
    for (const pattern of suspiciousPatterns) {
        if (pattern.test(htmlContent)) {
            return -1; // Contenu malveillant détecté
        }
    }
    
    return 1; // Contenu sûr
}

export { analyzeAdHTML }
