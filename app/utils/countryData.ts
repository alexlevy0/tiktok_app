/**
 * Données des pays et leurs drapeaux
 * Organisés par continents pour faciliter la maintenance
 */

export type Continent = 'Europe' | 'North America' | 'South America' | 'Asia' | 'Africa' | 'Oceania';

export interface CountryData {
  name: string;
  continent: Continent;
}

// Groupes de pays par continent pour une meilleure organisation
export const CONTINENTS: Record<Continent, string> = {
  'Europe': 'Europe',
  'North America': 'Amérique du Nord',
  'South America': 'Amérique du Sud',
  'Asia': 'Asie',
  'Africa': 'Afrique',
  'Oceania': 'Océanie'
};

// Mapping complet des drapeaux vers les données de pays
const FLAG_TO_COUNTRY_DATA: Record<string, CountryData> = {
  // Europe
  '🇫🇷': { name: 'France', continent: 'Europe' },
  '🇬🇧': { name: 'Royaume-Uni', continent: 'Europe' },
  '🇩🇪': { name: 'Allemagne', continent: 'Europe' },
  '🇮🇹': { name: 'Italie', continent: 'Europe' },
  '🇪🇸': { name: 'Espagne', continent: 'Europe' },
  '🇳🇱': { name: 'Pays-Bas', continent: 'Europe' },
  '🇧🇪': { name: 'Belgique', continent: 'Europe' },
  '🇨🇭': { name: 'Suisse', continent: 'Europe' },
  '🇵🇹': { name: 'Portugal', continent: 'Europe' },
  '🇮🇪': { name: 'Irlande', continent: 'Europe' },
  '🇦🇹': { name: 'Autriche', continent: 'Europe' },
  '🇸🇪': { name: 'Suède', continent: 'Europe' },
  '🇩🇰': { name: 'Danemark', continent: 'Europe' },
  '🇫🇮': { name: 'Finlande', continent: 'Europe' },
  '🇳🇴': { name: 'Norvège', continent: 'Europe' },
  '🇬🇷': { name: 'Grèce', continent: 'Europe' },
  '🇵🇱': { name: 'Pologne', continent: 'Europe' },
  '🇭🇺': { name: 'Hongrie', continent: 'Europe' },
  '🇨🇿': { name: 'République Tchèque', continent: 'Europe' },
  '🇸🇰': { name: 'Slovaquie', continent: 'Europe' },
  '🇷🇴': { name: 'Roumanie', continent: 'Europe' },
  '🇧🇬': { name: 'Bulgarie', continent: 'Europe' },
  '🇭🇷': { name: 'Croatie', continent: 'Europe' },
  '🇸🇮': { name: 'Slovénie', continent: 'Europe' },
  '🇷🇸': { name: 'Serbie', continent: 'Europe' },
  '🇲🇰': { name: 'Macédoine du Nord', continent: 'Europe' },
  '🇦🇱': { name: 'Albanie', continent: 'Europe' },
  '🇱🇹': { name: 'Lituanie', continent: 'Europe' },
  '🇱🇻': { name: 'Lettonie', continent: 'Europe' },
  '🇪🇪': { name: 'Estonie', continent: 'Europe' },
  '🇲🇹': { name: 'Malte', continent: 'Europe' },
  '🇮🇸': { name: 'Islande', continent: 'Europe' },
  '🇱🇺': { name: 'Luxembourg', continent: 'Europe' },
  '🇲🇨': { name: 'Monaco', continent: 'Europe' },
  '🇻🇦': { name: 'Vatican', continent: 'Europe' },
  '🇦🇩': { name: 'Andorre', continent: 'Europe' },
  '🇲🇩': { name: 'Moldavie', continent: 'Europe' },
  '🇺🇦': { name: 'Ukraine', continent: 'Europe' },
  '🇧🇾': { name: 'Biélorussie', continent: 'Europe' },
  
  // Amérique du Nord
  '🇺🇸': { name: 'États-Unis', continent: 'North America' },
  '🇨🇦': { name: 'Canada', continent: 'North America' },
  '🇲🇽': { name: 'Mexique', continent: 'North America' },
  '🇨🇺': { name: 'Cuba', continent: 'North America' },
  '🇯🇲': { name: 'Jamaïque', continent: 'North America' },
  '🇭🇹': { name: 'Haïti', continent: 'North America' },
  '🇩🇴': { name: 'République Dominicaine', continent: 'North America' },
  '🇵🇷': { name: 'Porto Rico', continent: 'North America' },
  '🇧🇸': { name: 'Bahamas', continent: 'North America' },
  '🇹🇹': { name: 'Trinité-et-Tobago', continent: 'North America' },
  '🇬🇹': { name: 'Guatemala', continent: 'North America' },
  '🇧🇿': { name: 'Belize', continent: 'North America' },
  '🇸🇻': { name: 'Salvador', continent: 'North America' },
  '🇭🇳': { name: 'Honduras', continent: 'North America' },
  '🇳🇮': { name: 'Nicaragua', continent: 'North America' },
  '🇨🇷': { name: 'Costa Rica', continent: 'North America' },
  '🇵🇦': { name: 'Panama', continent: 'North America' },
  
  // Amérique du Sud
  '🇧🇷': { name: 'Brésil', continent: 'South America' },
  '🇦🇷': { name: 'Argentine', continent: 'South America' },
  '🇨🇱': { name: 'Chili', continent: 'South America' },
  '🇨🇴': { name: 'Colombie', continent: 'South America' },
  '🇵🇪': { name: 'Pérou', continent: 'South America' },
  '🇻🇪': { name: 'Venezuela', continent: 'South America' },
  '🇪🇨': { name: 'Équateur', continent: 'South America' },
  '🇧🇴': { name: 'Bolivie', continent: 'South America' },
  '🇵🇾': { name: 'Paraguay', continent: 'South America' },
  '🇺🇾': { name: 'Uruguay', continent: 'South America' },
  '🇬🇾': { name: 'Guyana', continent: 'South America' },
  '🇸🇷': { name: 'Suriname', continent: 'South America' },
  
  // Asie
  '🇨🇳': { name: 'Chine', continent: 'Asia' },
  '🇯🇵': { name: 'Japon', continent: 'Asia' },
  '🇰🇷': { name: 'Corée du Sud', continent: 'Asia' },
  '🇮🇳': { name: 'Inde', continent: 'Asia' },
  '🇮🇩': { name: 'Indonésie', continent: 'Asia' },
  '🇵🇭': { name: 'Philippines', continent: 'Asia' },
  '🇻🇳': { name: 'Vietnam', continent: 'Asia' },
  '🇹🇭': { name: 'Thaïlande', continent: 'Asia' },
  '🇲🇾': { name: 'Malaisie', continent: 'Asia' },
  '🇸🇬': { name: 'Singapour', continent: 'Asia' },
  '🇵🇰': { name: 'Pakistan', continent: 'Asia' },
  '🇧🇩': { name: 'Bangladesh', continent: 'Asia' },
  '🇳🇵': { name: 'Népal', continent: 'Asia' },
  '🇱🇰': { name: 'Sri Lanka', continent: 'Asia' },
  '🇰🇭': { name: 'Cambodge', continent: 'Asia' },
  '🇱🇦': { name: 'Laos', continent: 'Asia' },
  '🇲🇲': { name: 'Myanmar', continent: 'Asia' },
  '🇲🇴': { name: 'Macao', continent: 'Asia' },
  '🇭🇰': { name: 'Hong Kong', continent: 'Asia' },
  '🇹🇼': { name: 'Taïwan', continent: 'Asia' },
  '🇮🇱': { name: 'Israël', continent: 'Asia' },
  '🇸🇦': { name: 'Arabie Saoudite', continent: 'Asia' },
  '🇦🇪': { name: 'Émirats Arabes Unis', continent: 'Asia' },
  '🇶🇦': { name: 'Qatar', continent: 'Asia' },
  '🇰🇼': { name: 'Koweït', continent: 'Asia' },
  '🇧🇭': { name: 'Bahreïn', continent: 'Asia' },
  '🇴🇲': { name: 'Oman', continent: 'Asia' },
  '🇯🇴': { name: 'Jordanie', continent: 'Asia' },
  '🇱🇧': { name: 'Liban', continent: 'Asia' },
  '🇸🇾': { name: 'Syrie', continent: 'Asia' },
  '🇮🇶': { name: 'Irak', continent: 'Asia' },
  '🇮🇷': { name: 'Iran', continent: 'Asia' },
  '🇦🇫': { name: 'Afghanistan', continent: 'Asia' },
  '🇹🇷': { name: 'Turquie', continent: 'Asia' },
  '🇰🇵': { name: 'Corée du Nord', continent: 'Asia' },
  '🇲🇳': { name: 'Mongolie', continent: 'Asia' },
  '🇰🇿': { name: 'Kazakhstan', continent: 'Asia' },
  '🇺🇿': { name: 'Ouzbékistan', continent: 'Asia' },
  '🇹🇯': { name: 'Tadjikistan', continent: 'Asia' },
  '🇰🇬': { name: 'Kirghizistan', continent: 'Asia' },
  '🇹🇲': { name: 'Turkménistan', continent: 'Asia' },
  '🇦🇿': { name: 'Azerbaïdjan', continent: 'Asia' },
  '🇦🇲': { name: 'Arménie', continent: 'Asia' },
  '🇬🇪': { name: 'Géorgie', continent: 'Asia' },
  '🇧🇹': { name: 'Bhoutan', continent: 'Asia' },
  '🇲🇻': { name: 'Maldives', continent: 'Asia' },
  '🇹🇱': { name: 'Timor oriental', continent: 'Asia' },
  '🇧🇳': { name: 'Brunei', continent: 'Asia' },
  
  // Afrique
  '🇿🇦': { name: 'Afrique du Sud', continent: 'Africa' },
  '🇪🇬': { name: 'Égypte', continent: 'Africa' },
  '🇲🇦': { name: 'Maroc', continent: 'Africa' },
  '🇩🇿': { name: 'Algérie', continent: 'Africa' },
  '🇹🇳': { name: 'Tunisie', continent: 'Africa' },
  '🇱🇾': { name: 'Libye', continent: 'Africa' },
  '🇳🇬': { name: 'Nigeria', continent: 'Africa' },
  '🇰🇪': { name: 'Kenya', continent: 'Africa' },
  '🇪🇹': { name: 'Éthiopie', continent: 'Africa' },
  '🇹🇿': { name: 'Tanzanie', continent: 'Africa' },
  '🇬🇭': { name: 'Ghana', continent: 'Africa' },
  '🇸🇳': { name: 'Sénégal', continent: 'Africa' },
  '🇨🇮': { name: 'Côte d\'Ivoire', continent: 'Africa' },
  '🇨🇲': { name: 'Cameroun', continent: 'Africa' },
  '🇺🇬': { name: 'Ouganda', continent: 'Africa' },
  '🇿🇲': { name: 'Zambie', continent: 'Africa' },
  '🇲🇿': { name: 'Mozambique', continent: 'Africa' },
  '🇲🇬': { name: 'Madagascar', continent: 'Africa' },
  '🇦🇴': { name: 'Angola', continent: 'Africa' },
  '🇿🇼': { name: 'Zimbabwe', continent: 'Africa' },
  '🇷🇼': { name: 'Rwanda', continent: 'Africa' },
  '🇧🇮': { name: 'Burundi', continent: 'Africa' },
  '🇸🇱': { name: 'Sierra Leone', continent: 'Africa' },
  '🇱🇷': { name: 'Liberia', continent: 'Africa' },
  '🇬🇳': { name: 'Guinée', continent: 'Africa' },
  '🇬🇼': { name: 'Guinée-Bissau', continent: 'Africa' },
  '🇬🇲': { name: 'Gambie', continent: 'Africa' },
  '🇲🇱': { name: 'Mali', continent: 'Africa' },
  '🇳🇪': { name: 'Niger', continent: 'Africa' },
  '🇹🇩': { name: 'Tchad', continent: 'Africa' },
  '🇧🇫': { name: 'Burkina Faso', continent: 'Africa' },
  '🇸🇩': { name: 'Soudan', continent: 'Africa' },
  '🇸🇸': { name: 'Soudan du Sud', continent: 'Africa' },
  '🇪🇷': { name: 'Érythrée', continent: 'Africa' },
  '🇩🇯': { name: 'Djibouti', continent: 'Africa' },
  '🇸🇴': { name: 'Somalie', continent: 'Africa' },
  '🇨🇫': { name: 'République centrafricaine', continent: 'Africa' },
  '🇬🇦': { name: 'Gabon', continent: 'Africa' },
  '🇨🇬': { name: 'Congo', continent: 'Africa' },
  '🇨🇩': { name: 'République démocratique du Congo', continent: 'Africa' },
  '🇧🇯': { name: 'Bénin', continent: 'Africa' },
  '🇹🇬': { name: 'Togo', continent: 'Africa' },
  '🇬🇶': { name: 'Guinée équatoriale', continent: 'Africa' },
  '🇲🇷': { name: 'Mauritanie', continent: 'Africa' },
  '🇲🇼': { name: 'Malawi', continent: 'Africa' },
  '🇳🇦': { name: 'Namibie', continent: 'Africa' },
  '🇧🇼': { name: 'Botswana', continent: 'Africa' },
  '🇱🇸': { name: 'Lesotho', continent: 'Africa' },
  '🇸🇿': { name: 'Eswatini', continent: 'Africa' },
  '🇨🇻': { name: 'Cap-Vert', continent: 'Africa' },
  '🇲🇺': { name: 'Maurice', continent: 'Africa' },
  '🇸🇨': { name: 'Seychelles', continent: 'Africa' },
  '🇰🇲': { name: 'Comores', continent: 'Africa' },
  
  // Océanie
  '🇦🇺': { name: 'Australie', continent: 'Oceania' },
  '🇳🇿': { name: 'Nouvelle-Zélande', continent: 'Oceania' },
  '🇵🇬': { name: 'Papouasie-Nouvelle-Guinée', continent: 'Oceania' },
  '🇫🇯': { name: 'Fidji', continent: 'Oceania' },
  '🇸🇧': { name: 'Îles Salomon', continent: 'Oceania' },
  '🇻🇺': { name: 'Vanuatu', continent: 'Oceania' },
  '🇸🇲': { name: 'Samoa', continent: 'Oceania' },
  '🇹🇴': { name: 'Tonga', continent: 'Oceania' },
  '🇰🇮': { name: 'Kiribati', continent: 'Oceania' },
  '🇫🇲': { name: 'Micronésie', continent: 'Oceania' },
  '🇵🇼': { name: 'Palaos', continent: 'Oceania' },
  '🇲🇭': { name: 'Îles Marshall', continent: 'Oceania' },
  '🇹🇻': { name: 'Tuvalu', continent: 'Oceania' },
  '🇳🇷': { name: 'Nauru', continent: 'Oceania' },
  '🇵🇫': { name: 'Polynésie française', continent: 'Oceania' },
  '🇳🇨': { name: 'Nouvelle-Calédonie', continent: 'Oceania' },
  
  // Drapeaux spéciaux
  '🇪🇺': { name: 'Union Européenne', continent: 'Europe' },
  '🇺🇳': { name: 'Nations Unies', continent: 'Europe' },
  '🏳️‍🌈': { name: 'Drapeau LGBT', continent: 'Europe' },
  '🏴‍☠️': { name: 'Pirate', continent: 'Europe' }
};

/**
 * Récupère le nom d'un pays à partir de son drapeau
 * @param flag Emoji du drapeau
 * @returns Nom du pays ou "Pays inconnu" si non trouvé
 */
export const getCountryName = (flag: string): string => {
  const countryData = FLAG_TO_COUNTRY_DATA[flag];
  return countryData ? countryData.name : 'Pays inconnu';
};

/**
 * Récupère toutes les données d'un pays à partir de son drapeau
 * @param flag Emoji du drapeau
 * @returns Données du pays ou undefined si non trouvé
 */
export const getCountryData = (flag: string): CountryData | undefined => {
  return FLAG_TO_COUNTRY_DATA[flag];
};

/**
 * Récupère tous les drapeaux disponibles
 * @returns Liste des emojis de drapeaux
 */
export const getAllFlags = (): string[] => {
  return Object.keys(FLAG_TO_COUNTRY_DATA);
};

/**
 * Récupère tous les pays disponibles
 * @returns Liste des noms de pays
 */
export const getAllCountries = (): string[] => {
  return Object.values(FLAG_TO_COUNTRY_DATA).map(data => data.name);
};

/**
 * Récupère tous les drapeaux groupés par continent
 * @returns Objet avec les continents comme clés et les drapeaux comme valeurs
 */
export const getFlagsByContinent = (): Record<Continent, string[]> => {
  const result: Record<Continent, string[]> = {
    'Europe': [],
    'North America': [],
    'South America': [],
    'Asia': [],
    'Africa': [],
    'Oceania': []
  };
  
  Object.entries(FLAG_TO_COUNTRY_DATA).forEach(([flag, data]) => {
    result[data.continent].push(flag);
  });
  
  return result;
}; 