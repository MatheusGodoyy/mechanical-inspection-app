import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as Network from "expo-network";
import { useEffect, useState } from "react";
import { View, Text } from "react-native";
import { criarTabelas } from "./database";
import { FormularioRelatorioMecanicoCivil } from "./screens";
import { FormularioRelatorioEletrico } from "./screens";
import { ListaRelatorios } from "./screens";
import { SelecionarTipoInspecao } from "./screens";
import { sincronizar, temInternet } from "./services/sync";
import { navigationConfig } from "./config";
import { ROUTES } from "./constants";

const Stack = createNativeStackNavigator();

export default function App() {
    const [appReady, setAppReady] = useState(false);
    const [appError, setAppError] = useState<string | null>(null);

    useEffect(() => {
        console.log("🚀 App iniciando...");

        const syncIfOnline = async () => {
            try {
                console.log("🔍 Verificando conexão à internet...");
                const online = await temInternet();
                if (online) {
                    console.log("📡 Internet disponível, sincronizando...");
                    await sincronizar();
                    console.log("✅ Sincronização concluída");
                }
            } catch (error) {
                console.warn("⚠️ Falha ao verificar conexão ou sincronizar:", error);
            }
        };

        const iniciarApp = async () => {
            try {
                console.log("💾 Criando tabelas do banco de dados...");
                await criarTabelas();
                console.log("✓ Tabelas criadas com sucesso");
                setAppReady(true);
            } catch (error) {
                console.error("✗ Erro ao criar tabelas:", error);
                setAppError(String(error));
                // Continua mesmo com erro
                setAppReady(true);
            }

            try {
                await syncIfOnline();
            } catch (error) {
                console.warn("⚠️ Falha ao sincronizar na inicialização:", error);
            }
        };

        iniciarApp();

        const subscription = Network.addNetworkStateListener(async (state) => {
            console.log("🌐 Estado da rede:", state);
            if (state.isConnected && state.isInternetReachable !== false) {
                await syncIfOnline();
            }
        });

        // Sincroniza periodicamente quando a internet estiver acessível
        const interval = setInterval(async () => {
            await syncIfOnline();
        }, 30000); // 30 segundos

        return () => {
            subscription.remove();
            clearInterval(interval);
        };
    }, []);

    return (
        <NavigationContainer>
            {!appReady ? (
                <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#fff" }}>
                    <Text style={{ fontSize: 18, color: "#666" }}>Carregando aplicação...</Text>
                    {appError && (
                        <Text style={{ fontSize: 12, color: "#f00", marginTop: 10, paddingHorizontal: 20, textAlign: "center" }}>
                            ⚠️ {appError}
                        </Text>
                    )}
                </View>
            ) : (
                <Stack.Navigator>
                    <Stack.Screen
                        name={ROUTES.LISTA}
                        component={ListaRelatorios}
                        options={{ title: "Relatórios" }}
                    />

                    <Stack.Screen
                        name={ROUTES.SELECIONAR_TIPO}
                        component={SelecionarTipoInspecao}
                        options={{ title: "Tipo de Inspeção" }}
                    />

                    <Stack.Screen
                        name={ROUTES.FORMULARIO_MECANICO}
                        component={FormularioRelatorioMecanicoCivil}
                        options={{
                            title: "Inspeção Mecânica/Civil",
                            headerBackVisible: false
                        }}
                    />

                    <Stack.Screen
                        name={ROUTES.FORMULARIO_ELETRICO}
                        component={FormularioRelatorioEletrico}
                        options={{
                            title: "Inspeção Elétrica",
                            headerBackVisible: false
                        }}
                    />
                </Stack.Navigator>
            )}
        </NavigationContainer>
    );
}
