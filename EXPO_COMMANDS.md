# 🔧 Comandos Rápidos para Desenvolvimento

## Iniciar o Projeto

### Modo 1: USB (RECOMENDADO para Android)
```bash
# Com limpeza total
npx expo start --clear --android

# Ou com modo verbose para mais logs
npx expo start --android --verbose
```

### Modo 2: Túnel (Funciona em qualquer lugar)
```bash
npx expo start --tunnel
# Escaneie o QR code com a câmera do celular ou Expo Go
```

### Modo 3: LAN (Rede local)
```bash
npx expo start --lan
```

### Modo 4: Localhost (Sem conexão de rede)
```bash
npx expo start --localhost
```

---

## Resetar/Limpar Cache

```bash
# Limpe o cache do Metro Bundler
npx expo start --clear

# Remova node_modules e instale novamente
rm -rf node_modules package-lock.json
npm install

# Limpe cache do Expo
expo cache clean
```

---

## Verificar Status do Dispositivo

### Android
```bash
adb devices                    # Lista dispositivos conectados
adb kill-server               # Reinicia ADB
adb start-server              # Inicia ADB
adb logcat                     # Ver logs do Android
```

### iOS
```bash
xcrun xcode-select -p          # Verifica Xcode tools
```

---

## Modo Desenvolvedor no Android

1. Vá para **Configurações > Sobre o telefone**
2. Pressione "Número de compilação" 7 vezes
3. Volte para **Configurações > Opções de desenvolvedor**
4. Ative:
   - Depuração USB ✓
   - Instalação de apps via USB ✓

---

## Se Tudo Falhar

```bash
# Opção nuclear - limpe TUDO
rm -rf node_modules .expo .next .cache dist build
npm cache clean --force
npm install

# Reinstale Expo do zero
npm install expo@latest expo-cli@latest

# Reinicie do zero
npx expo start --clear
```

---

## Logs Importantes para Procurar

✅ `Tunnel is ready` - Túnel pronto
✅ `Local development server is running` - Servidor local rodando
❌ `Metro Bundler Error` - Erro de sintaxe no código
❌ `Cannot find module` - Falta importação ou dependência
❌ `Tried to access React/Native before it was initialized` - Erro na inicialização

---

## Dicas Extras

- Se usar Expo Go, escaneie o QR code com a câmera (iOS) ou abra em Expo Go (Android)
- Mantenha o terminal rodando durante o desenvolvimento
- Se fechar o terminal, a conexão cai
- Para parar: Pressione `Ctrl + C`

---

## Para Testar Compilação

```bash
# Teste a build de Android
npx expo run:android

# Ou iOS (requer macOS)
npx expo run:ios
```
