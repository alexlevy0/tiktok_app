/**
 * Utilitaires pour la détection et le traitement des drapeaux dans les messages
 */

/**
 * Vérifie si un caractère est un drapeau emoji
 * Les drapeaux de pays sont composés de deux lettres régionales (unicode: U+1F1E6 to U+1F1FF)
 */
export const isCountryFlag = (text: string): boolean => {
  // Les points de code de base pour les indicateurs régionaux sont entre 0x1F1E6 et 0x1F1FF
  // Ce qui correspond aux lettres A-Z utilisées dans les codes de pays
  const REGIONAL_INDICATOR_START = 0x1F1E6; // 'A'
  const REGIONAL_INDICATOR_END = 0x1F1FF;   // 'Z'
  
  // Convertir en tableau de points de code
  const codePoints = [...text].map(char => char.codePointAt(0) || 0);
  
  // Pour être un drapeau, il doit y avoir exactement 2 indicateurs régionaux consécutifs
  if (codePoints.length < 2) return false;
  
  // Vérifier si les deux premiers caractères sont des indicateurs régionaux
  return (
    codePoints[0] >= REGIONAL_INDICATOR_START && 
    codePoints[0] <= REGIONAL_INDICATOR_END &&
    codePoints[1] >= REGIONAL_INDICATOR_START && 
    codePoints[1] <= REGIONAL_INDICATOR_END
  );
};

/**
 * Extrait tous les drapeaux d'un message
 */
export const extractFlags = (message: string): string[] => {
  const flags: string[] = [];
  const emojiRegex = /\p{Emoji_Presentation}|\p{Extended_Pictographic}/gu;
  
  // Trouver tous les emojis potentiels dans le message
  const emojis = message.match(emojiRegex) || [];
  
  // Recherche spécifique des drapeaux
  const flagRegex = /\p{Regional_Indicator}{2}/gu;
  const possibleFlags = message.match(flagRegex) || [];
  
  // Tester chaque emoji trouvé
  for (const emoji of [...emojis, ...possibleFlags]) {
    if (isCountryFlag(emoji)) {
      flags.push(emoji);
    }
  }
  
  // Recherche manuelle pour les drapeaux qui pourraient ne pas être détectés
  for (let i = 0; i < message.length - 1; i++) {
    // Les drapeaux prennent généralement 2 caractères (ou plus avec la normalisation)
    // Essayons des segments de différentes longueurs
    for (let len = 2; len <= 4 && i + len <= message.length; len++) {
      const segment = message.substring(i, i + len);
      // Si ce segment n'a pas déjà été identifié comme un drapeau
      if (!flags.includes(segment) && isCountryFlag(segment)) {
        flags.push(segment);
        i += len - 1; // Sauter les caractères traités
        break;
      }
    }
  }
  
  return [...new Set(flags)]; // Éliminer les doublons
};

/**
 * Met à jour le compteur de drapeaux
 */
export const updateFlagCounts = (
  flagCounts: Record<string, number>,
  message: string
): Record<string, number> => {
  const newFlagCounts = { ...flagCounts };
  const flags = extractFlags(message);
  
  // Ajouter un log pour déboguer
  if (flags.length > 0) {
    console.log("Drapeaux détectés:", flags);
  }
  
  flags.forEach(flag => {
    newFlagCounts[flag] = (newFlagCounts[flag] || 0) + 1;
  });
  
  return newFlagCounts;
}; 