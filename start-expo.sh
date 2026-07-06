#!/bin/bash

# Script para iniciar Expo com diferentes modos de conexão

echo "🚀 Iniciando Expo - Inspeção Técnica Digital"
echo ""
echo "Escolha o modo de conexão:"
echo "1) USB (recomendado para celular conectado)"
echo "2) Túnel (nuvem, funciona de qualquer lugar)"
echo "3) LAN (rede local)"
echo "4) Localhost (mesma máquina)"
echo ""
read -p "Digite a opção (1-4): " opcao

case $opcao in
    1)
        echo "📱 Inicializando em modo USB..."
        echo "Conecte o celular via USB e ative 'Modo Desenvolvedor'"
        npx expo start --android --tunnel
        ;;
    2)
        echo "☁️ Inicializando em modo Túnel..."
        npx expo start --tunnel
        ;;
    3)
        echo "🌐 Inicializando em modo LAN..."
        npx expo start --lan
        ;;
    4)
        echo "💻 Inicializando em modo Localhost..."
        npx expo start --localhost
        ;;
    *)
        echo "❌ Opção inválida!"
        exit 1
        ;;
esac
