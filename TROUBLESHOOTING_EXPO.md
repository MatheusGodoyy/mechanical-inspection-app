# 🔧 Troubleshooting - Conexão Expo via USB

## ✅ Checklist de Resolução

### 1. **Verificar Expo CLI**
```bash
# Instale a versão correta
npm install -g expo-cli@latest

# Ou use o módulo local
npx expo --version
```

### 2. **Limpar Cache e Dependências**
```bash
# Remova node_modules e reinstale
rm -rf node_modules package-lock.json
npm install

# Limpe o cache do Expo
expo cache clean
npx expo start --clear
```

### 3. **Verifique a Versão do Node**
```bash
node --version  # Deve ser v18+ recomendado
npm --version   # Deve ser 9+
```

### 4. **Ativar Modo Desenvolvedor no Celular (IMPORTANTE)**
- **Android**: Vá para Configurações > Sobre o telefone > Pressione "Número de compilação" 7 vezes
- **iOS**: Configurações > Privacidade e segurança > Modo de Desenvolvedor (ativar)

### 5. **Conexão USB**
```bash
# Verifique se o dispositivo está conectado
adb devices           # Android
# ou
xcrun xcode-select -p  # iOS
```

### 6. **Iniciar o Expo Corretamente**
```bash
# Para Android via USB
npx expo start --android --tunnel

# Ou use localhost se estiver na mesma rede
npx expo start --localhost

# Ou use LAN
npx expo start --lan
```

### 7. **Se Continuar Falhando**
```bash
# Reinicie a ponte ADB (Android)
adb kill-server
adb start-server
adb devices

# Ou reinicie o Expo
npx expo start --clear --verbose
```

---

## 🐛 Logs para Verificar

Quando você inicia com `npx expo start --verbose`, procure por:
- ✅ `Tunnel is ready`
- ✅ `Local app is running`
- ❌ `Metro Bundler Error` - significa que há erro de sintaxe
- ❌ `Cannot find module` - falta dependência

**Se vir erro de sintaxe no console, anote o arquivo e a linha!**

---

## 📱 Se Usar Expo Go

1. Baixe o app "Expo Go" na Google Play ou App Store
2. Abra um terminal na pasta do projeto
3. Execute: `npx expo start`
4. Escaneie o QR code com a câmera do celular (ou abra em Expo Go)

---

## 🎯 Último Recurso

```bash
# Limpe TUDO
rm -rf node_modules .expo .git/hooks
npm install

# Reinstale Expo
npm install expo@latest

# Inicie limpo
npx expo start --clear
```

**Se ainda não funcionar, compartilhe a mensagem de erro exata do console que aparece quando tenta conectar!**
