import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import * as MediaLibrary from "expo-media-library/legacy";
import * as FileSystem from "expo-file-system/legacy";
import { useEffect, useRef, useState } from "react";
import { Alert, Pressable, Text, View } from "react-native";
import Signature from "react-native-signature-canvas";
import db from "../database";
import { gerarPDF } from "../services/pdf/pdfEletrico";
import { FormularioRelatorioUI } from "./FormularioRelatorioUI";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { ActivityIndicator } from "react-native";
import { styles } from "../styles";
import { ROUTES, TIPO_INSPECAO } from "../constants";
import { ENV } from '../config';

const { STORAGE_KEY_RELATORIOS } = ENV;

///////////////////////////////////////////////////////////////////////////////////////////////////////////
const ITENS_ELETRICOS = [
    {
        id: "1",
        grupo: "Condição Geral",
        tituloItem: "Condição do Tanque",
        status: null,
        observacao: "",
        fotos: [],
        exigeFoto: true,
    },
    {
        id: "2",
        grupo: "Condição Geral",
        tituloItem: "Limpeza do Local (Sala)",
        status: null,
        observacao: "",
        fotos: [],
        exigeFoto: true,
    },
    {
        id: "3",
        grupo: "Condição Geral",
        tituloItem: "Ausência de Vegetação",
        status: null,
        observacao: "",
        fotos: [],
        exigeFoto: true,
    },
    {
        id: "4",
        grupo: "Condição Geral",
        tituloItem: "Condição da Pintura / Revestimento",
        status: null,
        observacao: "",
        fotos: [],
        exigeFoto: true,
    },
    {
        id: "5",
        grupo: "Condição Geral",
        tituloItem: "Condição do Radiador",
        status: null,
        observacao: "",
        fotos: [],
        exigeFoto: true,
    },
    {
        id: "6",
        grupo: "Condição Geral",
        tituloItem: "Condição da Fundação",
        status: null,
        observacao: "",
        fotos: [],
        exigeFoto: true,
    },
    {
        id: "7",
        grupo: "Condição Geral",
        tituloItem: "Situação de Cercas / Fechaduras",
        status: null,
        observacao: "",
        fotos: [],
        exigeFoto: true,
    },
    {
        id: "8",
        grupo: "Condição Geral",
        tituloItem: "Cobertura Geral",
        status: null,
        observacao: "",
        fotos: [],
        exigeFoto: true,
    },
    {
        id: "9",
        grupo: "Condição Geral",
        tituloItem: "Iluminação do Local",
        status: null,
        observacao: "",
        fotos: [],
        exigeFoto: true,
    },
    {
        id: "10",
        grupo: "Condição Geral",
        tituloItem: "Condição Medidores / Indicadores",
        status: null,
        observacao: "",
        fotos: [],
        exigeFoto: true,
    },
    {
        id: "11",
        grupo: "Condição Geral",
        tituloItem: "Condição Ventiladores da Sala",
        status: null,
        observacao: "",
        fotos: [],
        exigeFoto: true,
    },
    {
        id: "12",
        grupo: "Condição Geral",
        tituloItem: "Cabos e Conectores de Entrada",
        status: null,
        observacao: "",
        fotos: [],
        exigeFoto: true,
    },
    {
        id: "13",
        grupo: "Condição Geral",
        tituloItem: "Cabos Secundários e Dutos",
        status: null,
        observacao: "",
        fotos: [],
        exigeFoto: true,
    },
    {
        id: "14",
        grupo: "Condição Geral",
        tituloItem: "Condição do Resistor de Aterramento de Neutro, Enclausuramento e Isoladores",
        status: null,
        observacao: "",
        fotos: [],
        exigeFoto: true,
    },
    {
        id: "15",
        grupo: "Condição Geral",
        tituloItem: "Eletrocalhas e Suportes",
        status: null,
        observacao: "",
        fotos: [],
        exigeFoto: true,
    },
    {
        id: "16",
        grupo: "Condição Geral",
        tituloItem: "Condição da Contenção de Óleo",
        status: null,
        observacao: "",
        fotos: [],
        exigeFoto: true,
    },
    {
        id: "17",
        grupo: "Condição Geral",
        tituloItem: "Comutador de Tap Bloqueado?",
        status: null,
        observacao: "",
        fotos: [],
        exigeFoto: true,
    },
    {
        id: "18",
        grupo: "Condição Geral",
        tituloItem: "Aparelho Ultrassônico Ex Rater",
        status: null,
        observacao: "",
        fotos: [],
        exigeFoto: true,
    },
    {
        id: "19",
        grupo: "Checagem Audiovisual",
        tituloItem: "Vazamento de Óleo",
        status: null,
        observacao: "",
        fotos: [],
        exigeFoto: true,
    },
    {
        id: "20",
        grupo: "Checagem Audiovisual",
        tituloItem: "Sons Anormais",
        status: null,
        observacao: "",
        fotos: [],
        exigeFoto: true,
    },
    {
        id: "21",
        grupo: "Checagem Audiovisual",
        tituloItem: "Respiro Dessecante Sílica Gel",
        status: null,
        observacao: "",
        fotos: [],
        exigeFoto: true,
    },
    {
        id: "22",
        grupo: "Medições",
        tituloItem: "Temperatura Máxima do Óleo / Deslizamento",
        status: null,
        observacao: "",
        fotos: [],
        exigeFoto: true,
    },
    {
        id: "23",
        grupo: "Medições",
        tituloItem: "Temperatura Máxima (Enrolamento) / Deslizamento",
        status: null,
        observacao: "",
        fotos: [],
        exigeFoto: true,
    },
    {
        id: "24",
        grupo: "Medições",
        tituloItem: "Pressão do Tanque",
        status: null,
        observacao: "",
        fotos: [],
        exigeFoto: true,
    },
    {
        id: "25",
        grupo: "Medições",
        tituloItem: "Medidor do Nível de Fluído",
        status: null,
        observacao: "",
        fotos: [],
        exigeFoto: true,
    },
    {
        id: "26",
        grupo: "Temperatura do Cubículo",
        tituloItem: "Entrada/Saída do Varix",
        status: null,
        observacao: "",
        fotos: [],
        exigeFoto: true,
    },
    {
        id: "27",
        grupo: "Verificações Funcionais",
        tituloItem: "Trip do Circuito Primário (86 Bloqueio) Lâmpada de monitoramento está acesa?",
        status: null,
        observacao: "",
        fotos: [],
        exigeFoto: true,
    },
    {
        id: "28",
        grupo: "Identificação",
        tituloItem: "Número de está Identificação Legível",
        status: null,
        observacao: "",
        fotos: [],
        exigeFoto: true,
    },
    {
        id: "29",
        grupo: "Identificação",
        tituloItem: "A placa de identificação do Transformador está legível",
        status: null,
        observacao: "",
        fotos: [],
        exigeFoto: true,
    }
];
/////////////////////////////////////////////////////////////////////////////////////////////////////////////

export default function App({ navigation, route }: any) {
    const relatorio = route.params?.relatorio;
    const signatureRef = useRef<any>(null);
    const SignaturePad = Signature as any;
    const [relatorioAtualId, setRelatorioAtualId] = useState<string | null>(null);
    const [statusAtual, setStatusAtual] = useState<"aberto" | "finalizado">("aberto");
    const [assinatura, setAssinatura] = useState<string | null>(null);
    const [assinando, setAssinando] = useState(false);
    const [tituloInspecao, setTituloInspecao] = useState("");
    const [tipoInspecao, setTipoInspecao] = useState(TIPO_INSPECAO.ELETRICA);
    const [data1, setData1] = useState("");
    const [data2, setData2] = useState("");
    const [responsavel, setResponsavel] = useState("");
    const [fnEquipamento, setFnEquipamento] = useState("");
    const [nomeEquipamento, setnomeEquipamento] = useState("");
    const [localInstalacao, setLocalInstalacao] = useState("");
    const [plano, setPlano] = useState("");
    const [listaTarefas, setListaTarefas] = useState("");
    const [erroData1, setErroData1] = useState(false);
    const [erroData2, setErroData2] = useState(false);
    const [fotoSelecionada, setFotoSelecionada] = useState<string | null>(null);
    const [indiceEscopoFoto, setIndiceEscopoFoto] = useState<number | null>(null);
    const [unidade, setUnidade] = useState("");
    const insets = useSafeAreaInsets();
    const [finalizando, setFinalizando] = useState(false);
    const foiFinalizado = useRef(false);
    const [observacaoGeral, setObservacaoGeral] = useState("");


    const [erroTitulo, setErroTitulo] = useState(false);
    const [erroTipo, setErroTipo] = useState(false);
    const [erroUnidade, setErroUnidade] = useState(false);
    const [erroResponsavel, setErroResponsavel] = useState(false);
    const [erroFn, setErroFn] = useState(false);
    const [erroNomeEquipamento, setErroNomeEquipamento] = useState(false);
    const [erroLocalInstalacao, setErroLocalInstalacao] = useState(false);
    const [erroListaTarefas, setErroListaTarefas] = useState(false);
    const [erroPlano, setErroPlano] = useState(false);
    const [erroAssinatura, setErroAssinatura] = useState(false);
    const [erroEscopos, setErroEscopos] = useState<{
        [id: string]: {
            titulo?: boolean;
            observacao?: boolean;
            status?: boolean;
        }
    }>({});
    const formatDate = (text: string) => {
        let cleaned = text.replace(/\D/g, "");
        cleaned = cleaned.slice(0, 8);
        if (cleaned.length <= 2) return cleaned;
        if (cleaned.length <= 4) return cleaned.replace(/(\d{2})(\d+)/, "$1/$2");
        return cleaned.replace(/(\d{2})(\d{2})(\d+)/, "$1/$2/$3");
    };

    const isValidDate = (date: string) => {
        if (!/^\d{2}\/\d{2}\/\d{4}$/.test(date)) return false;
        const [day, month, year] = date.split("/").map(Number);
        if (month < 1 || month > 12) return false;
        const lastDayOfMonth = new Date(year, month, 0).getDate();
        if (day < 1 || day > lastDayOfMonth) return false;
        return true;
    };

    const isNextDateAfterCurrent = (current: string, next: string) => {
        const [d1, m1, y1] = current.split("/").map(Number);
        const [d2, m2, y2] = next.split("/").map(Number);
        const date1 = new Date(y1, m1 - 1, d1);
        const date2 = new Date(y2, m2 - 1, d2);
        return date2 > date1;
    };

    const handleOK = (signature: string) => {
        setAssinatura(signature);
        setAssinando(false);
        setErroAssinatura(false);
    };

    const [escopos, setEscopos] = useState<any[]>(ITENS_ELETRICOS);

    const removerEscopo = (index: number) => {
        Alert.alert("Remover item", "Tem certeza que deseja remover este item da inspeção?", [
            { text: "Cancelar", style: "cancel" },
            {
                text: "Remover",
                style: "destructive",
                onPress: () => setEscopos((prev) => prev.filter((_, i) => i !== index)),
            },
        ]);
    };

    const gerarPDFESalvar = async () => {
        console.log("BOTAO GERAR PDF CLICADO");
        try {
            const resultado = await gerarPDF({
                tituloInspecao, tipoInspecao, unidade, data1, data2, responsavel,
                fnEquipamento, nomeEquipamento, localInstalacao, plano, listaTarefas,
                escopos, observacaoGeral, assinatura,
            });

            if (!resultado) return;

            const itensConforme = escopos.filter((item) => item.status === "conforme").length;
            const itensNaoConforme = escopos.filter((item) => item.status === "nao_conforme").length;
            const totalItens = escopos.length;

            await db.runAsync(
                `INSERT INTO inspecoes (
          titulo_inspecao, tipo_inspecao, unidade, data_inspecao, proxima_inspecao, responsavel,
          equipamento_fn, equipamento_nome, equipamento_local, equipamento_plano, equipamento_lista_tarefas,
          itens_conforme, itens_nao_conforme, total_itens, escopos, path_pdf, status_sync, observacao_geral
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    tituloInspecao, tipoInspecao, unidade, data1, data2, responsavel,
                    fnEquipamento, nomeEquipamento, localInstalacao, plano, listaTarefas,
                    itensConforme, itensNaoConforme, totalItens,
                    JSON.stringify(escopos), resultado.path_pdf, "pending", observacaoGeral
                ],
            );
        } catch (erro) {
            console.log("ERRO AO GERAR PDF:", erro);
        }
    };

    // Salvar silencioso (sem Alert) — usado no auto-save ao sair
    const salvarSilencioso = async () => {
        console.log("[AutoSave] Iniciando salvamento automático:", new Date().toISOString());
        try {
            const dados = await AsyncStorage.getItem(STORAGE_KEY_RELATORIOS);
            const lista = JSON.parse(dados || "[]");

            let id = relatorioAtualId;
            if (!id) {
                id = Date.now().toString();
                setRelatorioAtualId(id);
            }

            const novoRelatorio = {
                id,
                status: statusAtual,
                tituloInspecao,
                tipoInspecao,
                unidade,
                data1,
                data2,
                responsavel,
                fnEquipamento,
                nomeEquipamento,
                localInstalacao,
                plano,
                listaTarefas,
                escopos,
                observacaoGeral,
                assinatura,
            };

            const index = lista.findIndex((r: any) => r.id === id);

            if (index !== -1) {
                // Atualiza existente, preservando dados que não foram alterados
                lista[index] = { ...lista[index], ...novoRelatorio };
            } else {
                // Cria novo
                lista.push(novoRelatorio);
            }

            await AsyncStorage.setItem(STORAGE_KEY_RELATORIOS, JSON.stringify(lista));
            console.log("[AutoSave] Salvamento automático concluído para relatório:", id);
        } catch (err) {
            console.warn("[AutoSave] Erro durante salvamento automático:", err);
        }
    };

    // Salvar com Alert — usado pelo botão manual
    const salvarRelatorio = async () => {
        await salvarSilencioso();
        Alert.alert(
            "Relatório salvo 📝",
            "Este relatório foi salvo como rascunho.\n\nO envio será realizado somente após a finalização.",
            [
                {
                    text: "OK",

                    onPress: () => {

                        navigation.reset({
                            index: 0,
                            routes: [{ name: ROUTES.LISTA }],
                        });

                    },
                },
            ]
        );
    };

    // Auto-save ao sair da tela
    useEffect(() => {
        const unsubscribe = navigation.addListener("beforeRemove", async () => {

            if (!foiFinalizado.current) {  // ← adiciona essa verificação
                console.log("[AutoSave] Detected navigation leaving screen, iniciando salvarSilencioso()");
                await salvarSilencioso();
                console.log("[AutoSave] salvarSilencioso() finalizado");
            }

        });
        return unsubscribe;
    }, [
        tituloInspecao, tipoInspecao, unidade, data1, data2, responsavel,
        fnEquipamento, nomeEquipamento, localInstalacao, plano, listaTarefas,
        escopos, observacaoGeral, assinatura, relatorioAtualId,
    ]);

    // Auto-save on any relevant change (debounced)
    const autoSaveTimerRef = useRef<any>(null);
    useEffect(() => {
        if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current);
        autoSaveTimerRef.current = setTimeout(async () => {
            if (!foiFinalizado.current) {
                console.log("[AutoSave] Mudança detectada — salvando automaticamente");
                await salvarSilencioso();
                console.log("[AutoSave] Salvamento automático por mudança concluído");
            }
        }, 800);

        return () => {
            if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current);
        };
    }, [
        tituloInspecao, tipoInspecao, unidade, data1, data2, responsavel,
        fnEquipamento, nomeEquipamento, localInstalacao, plano, listaTarefas,
        escopos, observacaoGeral, assinatura, relatorioAtualId,
    ]);

    useEffect(() => {
        if (!relatorio) return;
        setRelatorioAtualId(relatorio.id);
        // Sempre começa como "aberto" quando está sendo editado
        setStatusAtual("aberto");
        setTituloInspecao(relatorio.tituloInspecao);
        setTipoInspecao(TIPO_INSPECAO.ELETRICA);
        setUnidade(relatorio.unidade);
        setData1(relatorio.data1);
        setData2(relatorio.data2);
        setResponsavel(relatorio.responsavel);
        setFnEquipamento(relatorio.fnEquipamento);
        setnomeEquipamento(relatorio.nomeEquipamento);
        setLocalInstalacao(relatorio.localInstalacao);
        setPlano(relatorio.plano);
        setListaTarefas(relatorio.listaTarefas);
        setEscopos(relatorio.escopos || []);
        setAssinatura(relatorio.assinatura);
        setObservacaoGeral(relatorio.observacaoGeral || "");
    }, []);

    const finalizarRelatorio = async () => {
        // evita clique duplo
        if (finalizando) return;

        setFinalizando(true);

        try {
            // Salva silenciosamente antes de finalizar para garantir que todos os dados estejam persistidos
            await salvarSilencioso();

            let valido = true;

            const novosErrosEscopos: typeof erroEscopos = {};

            // Reset erros
            setErroTitulo(false);
            setErroTipo(false);
            setErroUnidade(false);
            setErroData1(false);
            setErroData2(false);
            setErroResponsavel(false);
            setErroFn(false);
            setErroNomeEquipamento(false);
            setErroLocalInstalacao(false);
            setErroPlano(false);
            setErroListaTarefas(false);
            setErroAssinatura(false);
            setErroEscopos({});

            if (!tituloInspecao.trim()) {
                setErroTitulo(true);
                valido = false;
            }

            if (!tipoInspecao.trim()) {
                setErroTipo(true);
                valido = false;
            }

            if (!unidade.trim()) {
                setErroUnidade(true);
                valido = false;
            }

            if (!isValidDate(data1)) {
                setErroData1(true);
                valido = false;
            }

            if (!isValidDate(data2)) {
                setErroData2(true);
                valido = false;
            }

            if (
                isValidDate(data1) &&
                isValidDate(data2) &&
                !isNextDateAfterCurrent(data1, data2)
            ) {
                setErroData2(true);
                valido = false;
            }

            if (!responsavel.trim()) {
                setErroResponsavel(true);
                valido = false;
            }

            if (!fnEquipamento.trim()) {
                setErroFn(true);
                valido = false;
            }

            if (!nomeEquipamento.trim()) {
                setErroNomeEquipamento(true);
                valido = false;
            }

            if (!localInstalacao.trim()) {
                setErroLocalInstalacao(true);
                valido = false;
            }

            if (!plano.trim()) {
                setErroPlano(true);
                valido = false;
            }

            if (!listaTarefas.trim()) {
                setErroListaTarefas(true);
                valido = false;
            }

            if (!assinatura) {
                setErroAssinatura(true);
                valido = false;
            }

            if (escopos.length === 0) {

                valido = false;

            } else {

                escopos.forEach((e) => {

                    const erros: {
                        titulo?: boolean;
                        observacao?: boolean;
                        status?: boolean;
                    } = {};

                    if (!e.tituloItem?.trim()) {
                        erros.titulo = true;
                        valido = false;
                    }

                    if (e.status === null) {
                        erros.status = true;
                        valido = false;
                    }

                    if (e.status === "nao_conforme") {

                        if (!e.observacao?.trim()) {
                            erros.observacao = true;
                            valido = false;
                        }

                    }

                    if (Object.keys(erros).length > 0) {
                        novosErrosEscopos[e.id] = erros;
                    }
                });
            }

            setErroEscopos(novosErrosEscopos);

            if (!valido) {

                Alert.alert(
                    "Campos obrigatórios",
                    "Preencha todos os campos destacados em vermelho antes de finalizar."
                );

                setFinalizando(false);

                return;
            }

            await gerarPDFESalvar();

            const dados = await AsyncStorage.getItem(STORAGE_KEY_RELATORIOS);

            const lista = JSON.parse(dados || "[]");

            const novaLista = lista.map((r: any) =>
                r.id === relatorioAtualId
                    ? { ...r, status: "finalizado" }
                    : r
            );

            await AsyncStorage.setItem(
                STORAGE_KEY_RELATORIOS,
                JSON.stringify(novaLista)
            );

            Alert.alert(
                "Relatório finalizado ✅",
                "O envio será feito automaticamente quando houver conexão com a internet.\n\n📌IMPORTANTE: Caso o relatório ainda não tenha sido enviado, ele será enviado automaticamente na próxima vez que você abrir o aplicativo com conexão à internet.",
                [
                    {
                        text: "OK",
                        onPress: () => {

                            setFinalizando(false);

                            foiFinalizado.current = true;

                            navigation.reset({
                                index: 0,
                                routes: [{ name: ROUTES.LISTA }],
                            });
                        }
                    },
                ]
            );

        } catch (error) {

            console.log("Erro ao finalizar:", error);

            Alert.alert(
                "Erro",
                "Ocorreu um erro ao finalizar o relatório."
            );

            setFinalizando(false);
        }
    };

    const confirmarFinalizacao = () => {

        Alert.alert(
            "Finalizar relatório",
            "Tem certeza que deseja finalizar este relatório?\n\nApós finalizado não será possível continuar editando. Será necessário criar um novo relatório.",
            [
                {
                    text: "Cancelar",
                    style: "cancel",
                },

                {
                    text: "Finalizar",
                    style: "destructive",

                    onPress: () => {
                        finalizarRelatorio();
                    },
                },
            ]
        );
    };



    const adicionarEscopo = () => { };

    const tirarFoto = async (index: number) => {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== "granted") { Alert.alert("Permissão necessária", "Precisamos da câmera"); return; }

        const result = await ImagePicker.launchCameraAsync({ quality: 0.7, allowsEditing: false });

        if (!result.canceled) {
            const uri = result.assets[0].uri;

            const nomeArquivo = `foto_${Date.now()}.jpg`;
            const destino = FileSystem.documentDirectory + nomeArquivo;
            await FileSystem.copyAsync({ from: uri, to: destino });

            try {
                const { granted } = await MediaLibrary.requestPermissionsAsync();
                if (granted) {
                    await MediaLibrary.saveToLibraryAsync(destino);
                    console.log("Salvo na galeria!");
                }
            } catch (e: any) {
                console.warn("Erro ao salvar na galeria:", e?.message, JSON.stringify(e));
            }

            const escopoIndex = index;
            setIndiceEscopoFoto(escopoIndex);
            finalizarEdicaoFoto(destino, escopoIndex);
        }
    };

    const escolherDaGaleria = async (index: number) => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") { Alert.alert("Permissão necessária", "Precisamos acessar a galeria"); return; }
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 0.7
        });
        if (!result.canceled) {
            const uri = result.assets[0].uri;

            const nomeArquivo = `foto_${Date.now()}.jpg`;
            const destino = FileSystem.documentDirectory + nomeArquivo;
            await FileSystem.copyAsync({ from: uri, to: destino });

            const escopoIndex = index;
            setIndiceEscopoFoto(escopoIndex);
            finalizarEdicaoFoto(destino, escopoIndex);
        }
    };

    const finalizarEdicaoFoto = (uriEditada: string, index: number | null = null) => {
        const escopoIndex = index ?? indiceEscopoFoto;
        if (escopoIndex === null) return;
        setEscopos((prev: any[]) => prev.map((item, i) =>
            i === escopoIndex ? { ...item, fotos: [...item.fotos, uriEditada] } : item
        ));
        setIndiceEscopoFoto(null);
    };

    const escolherImagem = (index: number) => {
        Alert.alert("Adicionar foto", "Escolha uma opção", [
            { text: "Câmera", onPress: () => tirarFoto(index) },
            { text: "Galeria", onPress: () => escolherDaGaleria(index) },
            { text: "Cancelar", style: "cancel" },
        ]);
    };

    if (assinando) {
        return (
            <View style={{ flex: 1, backgroundColor: "#fff", paddingBottom: insets.bottom }}>
                <SignaturePad
                    ref={signatureRef}
                    onOK={handleOK}
                    descriptionText="Assine abaixo"
                    clearText="Limpar"
                    confirmText="Salvar"
                />
                <Pressable
                    style={({ pressed }) => ({
                        backgroundColor: pressed ? "#1b5e20" : "#2e7d32",
                        padding: 15,
                        alignItems: "center",
                        transform: [{ scale: pressed ? 0.97 : 1 }],
                        opacity: pressed ? 0.85 : 1,
                    })}
                    onPress={() => signatureRef.current.readSignature()}
                >
                    <Text style={{ color: "white", fontWeight: "bold" }}>Salvar assinatura</Text>
                </Pressable>
                <Pressable
                    style={({ pressed }) => ({
                        backgroundColor: pressed ? "#8e0000" : "#c62828",
                        padding: 15,
                        alignItems: "center",
                        transform: [{ scale: pressed ? 0.97 : 1 }],
                        opacity: pressed ? 0.85 : 1,
                    })}
                    onPress={() => setAssinando(false)}
                >
                    <Text style={{ color: "white", fontWeight: "bold" }}>Cancelar</Text>
                </Pressable>
            </View>
        );
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={{ flex: 1 }}>
                <FormularioRelatorioUI
                    tituloInspecao={tituloInspecao}
                    setTituloInspecao={setTituloInspecao}
                    tipoInspecao={tipoInspecao}
                    setTipoInspecao={setTipoInspecao}
                    unidade={unidade}
                    setUnidade={setUnidade}
                    data1={data1}
                    setData1={setData1}
                    data2={data2}
                    setData2={setData2}
                    responsavel={responsavel}
                    setResponsavel={setResponsavel}
                    fnEquipamento={fnEquipamento}
                    setFnEquipamento={setFnEquipamento}
                    nomeEquipamento={nomeEquipamento}
                    setnomeEquipamento={setnomeEquipamento}
                    localInstalacao={localInstalacao}
                    setLocalInstalacao={setLocalInstalacao}
                    plano={plano}
                    setPlano={setPlano}
                    listaTarefas={listaTarefas}
                    setListaTarefas={setListaTarefas}
                    escopos={escopos}
                    setEscopos={setEscopos}
                    adicionarEscopo={adicionarEscopo}
                    removerEscopo={removerEscopo}
                    escolherImagem={escolherImagem}
                    assinatura={assinatura}
                    setAssinando={setAssinando}
                    fotoSelecionada={fotoSelecionada}
                    setFotoSelecionada={setFotoSelecionada}
                    salvarRelatorio={salvarRelatorio}
                    confirmarFinalizacao={confirmarFinalizacao}
                    formatDate={formatDate}
                    erroData1={erroData1}
                    erroData2={erroData2}
                    setErroData1={setErroData1}
                    setErroData2={setErroData2}
                    erroTitulo={erroTitulo}
                    setErroTitulo={setErroTitulo}
                    erroTipo={erroTipo}
                    setErroTipo={setErroTipo}
                    erroUnidade={erroUnidade}
                    erroResponsavel={erroResponsavel}
                    setErroResponsavel={setErroResponsavel}
                    erroFn={erroFn}
                    setErroFn={setErroFn}
                    erroNomeEquipamento={erroNomeEquipamento}
                    setErroNomeEquipamento={setErroNomeEquipamento}
                    erroLocalInstalacao={erroLocalInstalacao}
                    setErroLocalInstalacao={setErroLocalInstalacao}
                    erroPlano={erroPlano}
                    setErroPlano={setErroPlano}
                    erroListaTarefas={erroListaTarefas}
                    setErroListaTarefas={setErroListaTarefas}
                    observacaoGeral={observacaoGeral}
                    setObservacaoGeral={setObservacaoGeral}
                    erroAssinatura={erroAssinatura}
                    erroEscopos={erroEscopos}
                />

                {finalizando && (
                    <View style={styles.overlay}>

                        <View style={styles.loadingBox}>

                            <ActivityIndicator
                                size="large"
                                color="#1B5E20"
                            />

                            <Text style={styles.loadingTitle}>
                                Finalizando relatório...
                            </Text>

                            <Text style={styles.loadingSubtitle}>
                                Gerando PDF e salvando informações
                            </Text>

                        </View>

                    </View>
                )}
            </View>
        </SafeAreaView>
    );
}