/**
 * Serveur Express pour TikTok Live Chat Viewer
 * Ce serveur gère les connexions aux streams TikTok et stocke les messages
 * Il utilise le polling API au lieu des WebSockets comme demandé
 */

const express = require('express');
const cors = require('cors');
const { WebcastPushConnection } = require('tiktok-live-connector');

const app = express();
const PORT = process.env.PORT || 3001;

// Activer CORS pour permettre les requêtes depuis le frontend Next.js
app.use(cors());
app.use(express.json());

// Structure pour stocker les messages de chat
class ChatMessage {
  constructor(data) {
    this.id = `${data.userId}-${Date.now()}`;
    this.uniqueId = data.uniqueId;
    this.nickname = data.nickname;
    this.comment = data.comment; // Les données Unicode comme les émojis sont préservées par défaut
    this.profilePictureUrl = data.profilePictureUrl;
    this.timestamp = Date.now();
    
    // Log pour déboguer les drapeaux dans les messages
    if (this.comment && this.comment.includes('🇫🇷')) {
      console.log("Message avec drapeau français détecté:", this.comment);
    }
  }
}

// Structure pour stocker les connexions et les messages par utilisateur
const userConnections = new Map();

// Maximum de messages à conserver
const MAX_MESSAGES = 100;

// Route pour vérifier le statut du serveur
app.get('/status', (req, res) => {
  res.status(200).json({ status: 'online' });
});

// Route pour se connecter à un utilisateur TikTok
app.post('/connect', async (req, res) => {
  const { username } = req.body;
  
  if (!username) {
    return res.status(400).json({ error: 'Nom d\'utilisateur manquant' });
  }
  
  // Vérifier si une connexion existe déjà pour cet utilisateur
  if (userConnections.has(username)) {
    return res.status(200).json({ message: 'Déjà connecté à cet utilisateur' });
  }
  
  try {
    // Créer une nouvelle connexion TikTok
    const tiktokConnection = new WebcastPushConnection(username);
    
    // Connexion au live TikTok
    await tiktokConnection.connect();
    
    // Stocker les informations de connexion
    userConnections.set(username, {
      connection: tiktokConnection,
      messages: [],
      lastError: null,
      isConnected: true
    });
    
    // Configurer les événements
    setupTikTokEvents(tiktokConnection, username);
    
    console.log(`Connecté au live de ${username}`);
    res.status(200).json({ message: 'Connecté avec succès' });
  } catch (error) {
    console.error(`Erreur lors de la connexion à ${username}:`, error.message);
    res.status(400).json({ error: `Impossible de se connecter à ${username}: ${error.message}` });
  }
});

// Route pour se déconnecter d'un utilisateur TikTok
app.post('/disconnect', (req, res) => {
  const { username } = req.body;
  
  if (!username) {
    return res.status(400).json({ error: 'Nom d\'utilisateur manquant' });
  }
  
  // Récupérer les informations de connexion
  const userInfo = userConnections.get(username);
  
  if (userInfo && userInfo.connection) {
    // Fermer la connexion TikTok
    userInfo.connection.disconnect();
    userConnections.delete(username);
    console.log(`Déconnecté du live de ${username}`);
  }
  
  res.status(200).json({ message: 'Déconnecté avec succès' });
});

// Route pour récupérer les messages
app.get('/messages', (req, res) => {
  const { username } = req.query;
  
  if (!username) {
    return res.status(400).json({ error: 'Nom d\'utilisateur manquant' });
  }
  
  // Récupérer les informations de l'utilisateur
  const userInfo = userConnections.get(username);
  
  if (!userInfo) {
    return res.status(404).json({ error: 'Utilisateur non trouvé' });
  }
  
  res.status(200).json({
    messages: userInfo.messages,
    isConnected: userInfo.isConnected,
    lastError: userInfo.lastError
  });
});

// Route pour tester les drapeaux - Ajouter un message de test avec des drapeaux
app.post('/test-flag', (req, res) => {
  const { username, message } = req.body;
  
  if (!username || !message) {
    return res.status(400).json({ error: 'Nom d\'utilisateur et message requis' });
  }
  
  // Récupérer les informations de l'utilisateur
  const userInfo = userConnections.get(username);
  
  if (!userInfo) {
    return res.status(404).json({ error: 'Utilisateur non trouvé' });
  }
  
  // Créer un message de test
  const testMessage = new ChatMessage({
    userId: 'test-user',
    uniqueId: 'test-user',
    nickname: 'Test User',
    comment: message,
    profilePictureUrl: ''
  });
  
  // Ajouter le message au début de la liste
  userInfo.messages.unshift(testMessage);
  
  // Limiter le nombre de messages
  if (userInfo.messages.length > MAX_MESSAGES) {
    userInfo.messages = userInfo.messages.slice(0, MAX_MESSAGES);
  }
  
  console.log(`Test message ajouté: ${message}`);
  res.status(200).json({ message: 'Message de test ajouté' });
});

// Configurer les événements TikTok
function setupTikTokEvents(connection, username) {
  // Événement de chat
  connection.on('chat', data => {
    const userInfo = userConnections.get(username);
    if (!userInfo) return;
    
    // Créer un nouveau message
    const chatMessage = new ChatMessage(data);
    
    // Ajouter le message au début de la liste
    userInfo.messages.unshift(chatMessage);
    
    // Limiter le nombre de messages
    if (userInfo.messages.length > MAX_MESSAGES) {
      userInfo.messages = userInfo.messages.slice(0, MAX_MESSAGES);
    }
    
    console.log(`${username} - Nouveau message de ${data.nickname}: ${data.comment}`);
  });
  
  // Événement de déconnexion
  connection.on('disconnected', () => {
    const userInfo = userConnections.get(username);
    if (!userInfo) return;
    
    userInfo.isConnected = false;
    userInfo.lastError = 'Déconnecté du live TikTok';
    console.log(`${username} - Déconnecté du live TikTok`);
  });
  
  // Événement d'erreur
  connection.on('error', err => {
    const userInfo = userConnections.get(username);
    if (!userInfo) return;
    
    userInfo.lastError = `Erreur: ${err.message}`;
    console.error(`${username} - Erreur:`, err);
  });
}

// Démarrer le serveur
app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
}); 