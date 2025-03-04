# TikTok Live Chat Viewer

Une application simple pour visualiser le chat en direct des streams TikTok.

## Fonctionnalités

- Connectez-vous à n'importe quel live TikTok en entrant le nom d'utilisateur
- Voir les messages de chat en temps réel
- Interface utilisateur moderne et réactive

## Technologie utilisée

- Next.js pour le frontend
- Express pour le backend API
- TikTok-Live-Connector (zerodytrash) pour la connexion aux streams TikTok
- Tailwind CSS pour les styles

## Architecture

L'application est divisée en deux parties :
1. Un serveur Express qui gère les connexions TikTok et stocke les messages
2. Une application Next.js qui affiche l'interface utilisateur et communique avec le serveur

Cette architecture résout les problèmes de compatibilité entre TikTok-Live-Connector et les React Server Components de Next.js.

## Installation

1. Installer les dépendances:

```bash
npm install
```

## Démarrage

Pour lancer l'application complète (frontend + backend), utilisez:

```bash
npm run dev:with-server
```

Ou vous pouvez démarrer chaque composant séparément:

```bash
# Pour le backend Express (port 3001)
npm run server

# Pour le frontend Next.js (port 3000)
npm run dev
```

3. Ouvrir [http://localhost:3000](http://localhost:3000) dans votre navigateur.

## Comment utiliser

1. Assurez-vous que les deux serveurs (Express et Next.js) sont en cours d'exécution
2. Entrez le nom d'utilisateur d'un compte TikTok actuellement en live (sans le '@')
3. Cliquez sur "Se connecter"
4. Les messages du chat s'afficheront en temps réel

Pour vous déconnecter, cliquez simplement sur le bouton "Se déconnecter".

## Note technique

Cette application utilise le polling API au lieu des WebSockets pour récupérer les messages. Le frontend interroge le backend Express toutes les secondes pour obtenir les nouveaux messages.

## Dépannage

- **Erreur de connexion au serveur**: Assurez-vous que le serveur Express est en cours d'exécution avec `npm run server`
- **Erreur lors de la connexion au live TikTok**: Vérifiez que le nom d'utilisateur est correct et que l'utilisateur est actuellement en live

## Crédits

Cette application utilise [TikTok-Live-Connector](https://github.com/zerodytrash/TikTok-Live-Connector) par zerodytrash pour se connecter à l'API TikTok Live.
