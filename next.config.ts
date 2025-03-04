import type { NextConfig } from "next";
import path from 'path';

const nextConfig: NextConfig = {
  /* config options here */
  
  // Transpiler le package tiktok-live-connector pour résoudre les problèmes d'importation
  transpilePackages: ['tiktok-live-connector'],
  
  webpack: (config, { isServer }) => {
    // Ajouter un loader spécifique pour les fichiers .proto
    config.module.rules.push({
      test: /\.proto$/,
      use: 'null-loader',
    });
    
    // Rediriger spécifiquement le fichier proto problématique vers notre mock
    config.resolve.alias = {
      ...config.resolve.alias,
      'tiktok-live-connector/dist/proto/tiktokSchema.proto': path.resolve('./mocks/tiktokSchema.proto.js')
    };
    
    // Ignorer le fichier proto au niveau du webpack si on est côté client
    if (!isServer) {
      config.externals = [
        ...(config.externals || []),
         
        (context: unknown, request: string, callback: (error?: null | Error, result?: string) => void) => {
          if (request.includes('tiktokSchema.proto')) {
            // Traiter le fichier .proto comme un module externe vide
            return callback(null, 'commonjs {}');
          }
          callback();
        }
      ];
    }
    
    return config;
  },
  
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.tiktokcdn.com',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: '**.tiktokcdn-us.com',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: '**.tiktokcdn-eu.com',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: '**.tiktok.com',
        pathname: '**',
      },
    ],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
