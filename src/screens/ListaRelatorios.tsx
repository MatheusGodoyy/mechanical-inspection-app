import { View, Text, Pressable, Alert, Image, ScrollView, InteractionManager } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";
import { styles } from "../styles";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { ROUTES } from "../constants";
import { ENV } from '../config';

const { STORAGE_KEY_RELATORIOS } = ENV;

export default function ListaRelatorios({ navigation }: any) {
    const [relatoriosAbertos, setRelatoriosAbertos] = useState<any[]>([]);
    const [relatoriosFinalizados, setRelatoriosFinalizados] = useState<any[]>([]);
    const insets = useSafeAreaInsets();

    useFocusEffect(
        useCallback(() => {
            const carregarRelatorios = async () => {
                const dados = await AsyncStorage.getItem(STORAGE_KEY_RELATORIOS);

                if (!dados) {
                    setRelatoriosAbertos([]);
                    setRelatoriosFinalizados([]);
                    return;
                }

                const lista = JSON.parse(dados);

                setRelatoriosAbertos(lista.filter((r: any) => r.status === "aberto"));
                setRelatoriosFinalizados(lista.filter((r: any) => r.status === "finalizado"));
            };

            carregarRelatorios();
        }, []),
    );


    const confirmarExclusao = (id: string) => {
        InteractionManager.runAfterInteractions(() => {
            Alert.alert(
                "Excluir Relatório",
                "Tem certeza que deseja excluir este relatório?",
                [
                    { text: "Cancelar", style: "cancel" },
                    { text: "Excluir", style: "destructive", onPress: () => excluirRelatorio(id) },
                ]
            );
        });
    };


    const excluirRelatorio = async (id: string) => {
        const dados = await AsyncStorage.getItem(STORAGE_KEY_RELATORIOS);
        const lista = JSON.parse(dados || "[]");
        const novaLista = lista.filter((r: any) => r.id !== id);
        await AsyncStorage.setItem(STORAGE_KEY_RELATORIOS, JSON.stringify(novaLista));
        setRelatoriosAbertos(novaLista.filter((r: any) => r.status === "aberto"));
        setRelatoriosFinalizados(novaLista.filter((r: any) => r.status === "finalizado"));
    };

    const reabrirRelatorio = async (id: string) => {
        Alert.alert(
            "Reabrir relatório",
            "Deseja reabrir este relatório para edição?",
            [
                { text: "Cancelar", style: "cancel" },
                {
                    text: "Reabrir",
                    onPress: async () => {
                        const dados = await AsyncStorage.getItem(STORAGE_KEY_RELATORIOS);
                        const lista = JSON.parse(dados || "[]");
                        const relatorio = lista.find((r: any) => r.id === id);

                        if (relatorio) {
                            // Muda status para "aberto" enquanto está sendo editado
                            const novaLista = lista.map((r: any) =>
                                r.id === id ? { ...r, status: "aberto" } : r
                            );
                            await AsyncStorage.setItem(STORAGE_KEY_RELATORIOS, JSON.stringify(novaLista));
                            setRelatoriosAbertos(novaLista.filter((r: any) => r.status === "aberto"));
                            setRelatoriosFinalizados(novaLista.filter((r: any) => r.status === "finalizado"));

                            // Navega para o formulário correto baseado no tipo
                            const rota = relatorio?.tipoInspecao === "eletrica" ? ROUTES.FORMULARIO_ELETRICO : ROUTES.FORMULARIO_MECANICO;
                            // Passa o relatório com status já atualizado
                            const relatorioParaEditar = { ...relatorio, status: "aberto" };
                            navigation.navigate(rota, { relatorio: relatorioParaEditar });
                        }
                    },
                },
            ]
        );
    };

    const navegarParaFormulario = (relatorio: any) => {
        const rota = relatorio?.tipoInspecao === "eletrica" ? ROUTES.FORMULARIO_ELETRICO : ROUTES.FORMULARIO_MECANICO;
        navigation.navigate(rota, { relatorio });
    };

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <ScrollView style={{ flex: 1, backgroundColor: "#f2f2f2" }}>
                <View style={{ padding: 20, alignItems: "center" }}>
                    <Image source={require("../../assets/sylvamo-logo.png")} style={styles.logo} />

                    <Text style={{ fontSize: 18, color: "#555", marginBottom: 40 }}>
                        Relatórios técnicos de inspeção
                    </Text>

                    <Pressable
                        onPress={() => navigation.navigate(ROUTES.SELECIONAR_TIPO)}
                        style={({ pressed }) => [
                            {
                                backgroundColor: "#7B3FE4",
                                paddingVertical: 15,
                                paddingHorizontal: 80,
                                borderRadius: 8,
                                marginBottom: 25,
                                alignItems: "center",
                            },
                            pressed && { opacity: 0.8, transform: [{ scale: 0.96 }] },
                        ]}
                    >
                        <Text style={{ color: "white", fontSize: 18, fontWeight: "600" }}>Novo relatório</Text>
                    </Pressable>

                    <View style={{ height: 1, width: "100%", backgroundColor: "#ddd", marginVertical: 15 }} />
                </View>

                {/* SEÇÃO: EM ABERTO */}
                <View style={{ paddingHorizontal: 20 }}>
                    <Text style={{ fontSize: 20, fontWeight: "600", color: "#333", marginBottom: 6 }}>
                        Relatórios em aberto
                    </Text>
                    <Text style={{ marginBottom: 12, color: "#777" }}>
                        • Toque para continuar{"\n"}• Segure para excluir
                    </Text>

                    {relatoriosAbertos.length === 0 && (
                        <Text style={{ color: "#aaa", marginBottom: 20 }}>Nenhum relatório em aberto.</Text>
                    )}

                    {relatoriosAbertos.map((relatorio) => (
                        <Pressable
                            key={relatorio.id}
                            onPress={() => navegarParaFormulario(relatorio)}
                            onLongPress={() => confirmarExclusao(relatorio.id)}
                            style={({ pressed }) => [
                                {
                                    backgroundColor: pressed ? "#ddd" : "#eee",
                                    padding: 7,
                                    marginBottom: 7,
                                    borderRadius: 5,
                                },
                                pressed && { transform: [{ scale: 0.98 }] },
                            ]}
                        >
                            <Text style={{ fontWeight: "bold" }}>
                                {relatorio.tituloInspecao || "Relatório sem título"}
                            </Text>
                            <Text>Status: {relatorio.status}</Text>
                        </Pressable>
                    ))}
                </View>

                {/* SEÇÃO: FINALIZADOS */}
                <View style={{ paddingHorizontal: 20, marginTop: 30 }}>
                    <View style={{ height: 1, backgroundColor: "#ddd", marginBottom: 15 }} />

                    <Text style={{ fontSize: 20, fontWeight: "600", color: "#333", marginBottom: 6 }}>
                        Relatórios finalizados
                    </Text>
                    <Text style={{ marginBottom: 12, color: "#777" }}>
                        • Toque para reabrir{"\n"}• Segure para excluir
                    </Text>

                    {relatoriosFinalizados.length === 0 && (
                        <Text style={{ color: "#aaa", marginBottom: 20 }}>Nenhum relatório finalizado.</Text>
                    )}

                    {relatoriosFinalizados.map((relatorio) => (
                        <Pressable
                            key={relatorio.id}
                            onPress={() => reabrirRelatorio(relatorio.id)}
                            onLongPress={() => confirmarExclusao(relatorio.id)}
                            style={({ pressed }) => [
                                {
                                    backgroundColor: pressed ? "#c8e6c9" : "#dcedc8",
                                    padding: 7,
                                    marginBottom: 7,
                                    borderRadius: 5,
                                },
                                pressed && { transform: [{ scale: 0.98 }] },
                            ]}
                        >
                            <Text style={{ fontWeight: "bold" }}>
                                {relatorio.tituloInspecao || "Relatório sem título"}
                            </Text>
                            <Text>Status: {relatorio.status}</Text>
                        </Pressable>
                    ))}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
