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
    this.comment = data.comment;
    this.profilePictureUrl = data.profilePictureUrl;
    this.timestamp = Date.now();
  }
}

// Structure pour stocker les connexions et les messages par utilisateur
const userConnections = new Map();

// Maximum de messages à conserver
const MAX_MESSAGES = 100;

// Route pour se connecter à un utilisateur TikTok
app.post('/api/tiktok/connect', async (req, res) => {
  try {
    const { username } = req.body;

    if (!username) {
      return res.status(400).json({ 
        success: false, 
        message: 'Le nom d\'utilisateur est requis' 
      });
    }

    // Nettoyer le nom d'utilisateur (enlever @ si présent)
    const cleanUsername = username.replace('@', '');

    // Vérifier si on est déjà connecté à cet utilisateur
    if (userConnections.has(cleanUsername) && userConnections.get(cleanUsername).isConnected) {
      return res.json({ 
        success: true, 
        username: cleanUsername,
        message: 'Déjà connecté'
      });
    }

    // Nettoyer une ancienne connexion si elle existe
    if (userConnections.has(cleanUsername)) {
      const oldConnection = userConnections.get(cleanUsername);
      if (oldConnection.connection) {
        oldConnection.connection.disconnect();
      }
      userConnections.delete(cleanUsername);
    }

    // Créer une nouvelle connexion
    const tiktokConnection = new WebcastPushConnection(cleanUsername);
    
    // Initialiser la structure de données pour cet utilisateur
    userConnections.set(cleanUsername, {
      connection: tiktokConnection,
      messages: [],
      isConnected: false,
      lastError: null
    });

    // Configurer les écouteurs d'événements
    tiktokConnection.on('chat', (data) => {
      const message = new ChatMessage(data);
      
      const userConnection = userConnections.get(cleanUsername);
      if (userConnection) {
        userConnection.messages.unshift(message);
        
        // Limiter le nombre de messages stockés
        if (userConnection.messages.length > MAX_MESSAGES) {
          userConnection.messages.pop();
        }
      }
    });

    tiktokConnection.on('error', (err) => {
      console.error(`Erreur de connexion pour ${cleanUsername}:`, err);
      const userConnection = userConnections.get(cleanUsername);
      if (userConnection) {
        userConnection.lastError = err.info || 'Erreur inconnue';
        userConnection.isConnected = false;
      }
    });

    tiktokConnection.on('streamEnd', () => {
      console.log(`Le stream de ${cleanUsername} est terminé`);
      const userConnection = userConnections.get(cleanUsername);
      if (userConnection) {
        userConnection.isConnected = false;
        userConnection.lastError = 'Le live est terminé';
      }
    });

    // Se connecter au live
    try {
      await tiktokConnection.connect();
      
      // Mettre à jour l'état de connexion
      const userConnection = userConnections.get(cleanUsername);
      if (userConnection) {
        userConnection.isConnected = true;
      }
      
      return res.json({ 
        success: true, 
        username: cleanUsername,
        message: 'Connecté avec succès au live TikTok'
      });
    } catch (error) {
      const errorMessage = error.message || 'Erreur lors de la connexion au live TikTok';
      console.error(`Erreur lors de la connexion à ${cleanUsername}:`, error);
      
      // Mettre à jour l'état d'erreur
      const userConnection = userConnections.get(cleanUsername);
      if (userConnection) {
        userConnection.isConnected = false;
        userConnection.lastError = errorMessage;
      }
      
      return res.status(500).json({ 
        success: false, 
        message: errorMessage
      });
    }
  } catch (error) {
    console.error('Erreur lors de la connexion:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Erreur serveur lors de la connexion'
    });
  }
});

// Route pour se déconnecter
app.post('/api/tiktok/disconnect', (req, res) => {
  try {
    const { username } = req.body;

    if (!username) {
      return res.status(400).json({ 
        success: false, 
        message: 'Le nom d\'utilisateur est requis' 
      });
    }

    // Nettoyer le nom d'utilisateur (enlever @ si présent)
    const cleanUsername = username.replace('@', '');

    // Déconnecter l'utilisateur
    if (userConnections.has(cleanUsername)) {
      const userConnection = userConnections.get(cleanUsername);
      if (userConnection.connection) {
        userConnection.connection.disconnect();
      }
      userConnection.isConnected = false;
      
      return res.json({ 
        success: true, 
        message: 'Déconnecté avec succès du live TikTok'
      });
    } else {
      return res.status(404).json({ 
        success: false, 
        message: 'Aucune connexion trouvée pour cet utilisateur'
      });
    }
  } catch (error) {
    console.error('Erreur lors de la déconnexion:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Erreur serveur lors de la déconnexion'
    });
  }
});

// Route pour récupérer les messages
app.get('/api/tiktok/messages', (req, res) => {
  try {
    const { username } = req.query;

    if (!username) {
      return res.status(400).json({ 
        success: false, 
        message: 'Le nom d\'utilisateur est requis'
      });
    }

    // Nettoyer le nom d'utilisateur (enlever @ si présent)
    const cleanUsername = username.replace('@', '');

    // Récupérer les messages de l'utilisateur
    if (userConnections.has(cleanUsername)) {
      const userConnection = userConnections.get(cleanUsername);
      
      return res.json({ 
        success: true, 
        username: cleanUsername,
        isConnected: userConnection.isConnected,
        messages: userConnection.messages,
        lastError: userConnection.lastError
      });
    } else {
      return res.json({ 
        success: true,
        username: cleanUsername,
        isConnected: false,
        messages: [],
        lastError: 'Aucune connexion trouvée pour cet utilisateur'
      });
    }
  } catch (error) {
    console.error('Erreur lors de la récupération des messages:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Erreur serveur lors de la récupération des messages'
    });
  }
});

// Route par défaut
app.get('/', (req, res) => {
  res.send('TikTok Live Chat API Server is running');
});

// Démarrer le serveur
app.listen(PORT, () => {
  console.log(`TikTok Live Chat API Server running on port ${PORT}`);
  console.log(`Cette API utilise le polling au lieu de WebSockets comme demandé.`);
}); 