import * as FileSystem from "expo-file-system/legacy";
import * as Network from "expo-network";
import db from "../../database/database";
import { RelatorioFinalizadoSQLite } from "../../types";

const URL_FLUXO_MECANICO = "https://defaulteb4154c51e814c3c9e5da8a547806c.8e.environment.api.powerplatform.com:443/powerautomate/automations/direct/workflows/ec9dfc3a7c914e06bc5d89b81831b7a6/triggers/manual/paths/invoke?api-version=1&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=WyX1laUfT9GICmr8rh1t8BAyXXwWJi8U-RYxwIX7Lsk";
const URL_FLUXO_ELETRICO = "https://defaulteb4154c51e814c3c9e5da8a547806c.8e.environment.api.powerplatform.com:443/powerautomate/automations/direct/workflows/6e4c74e6e71c477d8df83af98449c34f/triggers/manual/paths/invoke?api-version=1&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=M_tcmQF1FZ11XbmBfbXPA81BjWExQ6lykjmLm8jnOvA";

let sincronizando = false;

const converterDataSegura = (dataBR: string): string => {
    if (!dataBR || typeof dataBR !== "string") {
        throw new Error("Data inválida: valor vazio");
    }

    const regex = /^\d{2}\/\d{2}\/\d{4}$/;
    if (!regex.test(dataBR)) {
        throw new Error(`Formato inválido: ${dataBR}`);
    }

    const [dia, mes, ano] = dataBR.split("/").map(Number);

    if (mes < 1 || mes > 12) {
        throw new Error(`Mês inválido: ${dataBR}`);
    }

    const ultimoDiaMes = new Date(ano, mes, 0).getDate();
    if (dia < 1 || dia > ultimoDiaMes) {
        throw new Error(`Dia inválido: ${dataBR}`);
    }

    if (ano < 2000 || ano > 2100) {
        throw new Error(`Ano inválido: ${dataBR}`);
    }

    return `${ano}-${String(mes).padStart(2, "0")}-${String(dia).padStart(2, "0")}`;
};

export const buscarPendentes = async (): Promise<RelatorioFinalizadoSQLite[]> => {
    const result = await db.getAllAsync<RelatorioFinalizadoSQLite>(
        `SELECT * FROM inspecoes WHERE status_sync in ('pending', 'error')`
    );
    return result || [];
};

export const enviarInspecao = async (inspecao: RelatorioFinalizadoSQLite): Promise<boolean> => {
    const urlFluxo =
        inspecao.tipo_inspecao === "eletrica"
            ? URL_FLUXO_ELETRICO
            : URL_FLUXO_MECANICO;
    try {
        const fileInfo = await FileSystem.getInfoAsync(inspecao.path_pdf);

        if (!fileInfo.exists) {
            await marcarComoSincronizado(inspecao.id);
            return true;
        }

        const base64 = await FileSystem.readAsStringAsync(
            inspecao.path_pdf,
            {
                encoding: FileSystem.EncodingType.Base64,
            }
        );

        const escopos = JSON.parse(inspecao.escopos || "[]");

        let escoposFormatados;

        if (inspecao.tipo_inspecao === "eletrica") {

            escoposFormatados = escopos.map((item: any) => ({
                grupo: item.grupo,
                item: item.tituloItem,
                status: item.status,
                observacao: item.observacao || null,
            }));

        } else {

            escoposFormatados = escopos.map((item: any) => ({
                item: item.tituloItem,
                status: item.status,
                observacao:
                    item.status === "conforme"
                        ? item.observacao
                        : null,
                razao_nao_conformidade:
                    item.status === "nao_conforme"
                        ? item.observacao
                        : null,
                recomendacao:
                    item.status === "nao_conforme"
                        ? item.recomendacao
                        : null,
            }));

        }

        let dataInspecaoFormatada;
        let proximaInspecaoFormatada;

        try {
            dataInspecaoFormatada = converterDataSegura(
                inspecao.data_inspecao
            );
            proximaInspecaoFormatada = converterDataSegura(
                inspecao.proxima_inspecao
            );
        } catch (erro) {
            console.error("ERRO DE DATA:", erro);
            return false;
        }

        const response = await fetch(urlFluxo, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                titulo_inspecao: inspecao.titulo_inspecao,
                tipo_inspecao: inspecao.tipo_inspecao,
                unidade: inspecao.unidade,
                data_inspecao: dataInspecaoFormatada,
                proxima_inspecao: proximaInspecaoFormatada,
                responsavel: inspecao.responsavel,
                equipamento: {
                    fn: inspecao.equipamento_fn,
                    nome: inspecao.equipamento_nome,
                    local: inspecao.equipamento_local,
                    plano: inspecao.equipamento_plano,
                    lista_tarefas: inspecao.equipamento_lista_tarefas,
                },
                itens_conforme: inspecao.itens_conforme,
                itens_nao_conforme: inspecao.itens_nao_conforme,
                total_itens: inspecao.total_itens,
                escopos: escoposFormatados,
                pdf: base64,
            }),
        });

        if (!response.ok) {
            throw new Error("Erro ao enviar inspeção");
        }

        return true;
    } catch (error) {
        console.error("Erro ao enviar inspeção:", error);
        return false;
    }
};

export const marcarComoSincronizado = async (id: number): Promise<void> => {
    await db.runAsync(`UPDATE inspecoes SET status_sync = 'synced' WHERE id = ?`, [id]);
};

export const marcarComoEnviando = async (id: number): Promise<void> => {
    await db.runAsync(`UPDATE inspecoes SET status_sync = 'sending' WHERE id = ?`, [id]);
};

export const marcarComoErro = async (id: number): Promise<void> => {
    await db.runAsync(`UPDATE inspecoes SET status_sync = 'error' WHERE id = ?`, [id]);
};

export const sincronizar = async (): Promise<void> => {
    if (sincronizando) {
        return;
    }

    sincronizando = true;

    try {
        const pendentes = await buscarPendentes();

        for (const inspecao of pendentes) {
            console.log("ENVIANDO INSPEÇÃO:", inspecao.id);

            await marcarComoEnviando(inspecao.id);

            const sucesso = await enviarInspecao(inspecao);

            if (sucesso) {
                console.log("INSPEÇÃO SINCRONIZADA:", inspecao.id);
                await marcarComoSincronizado(inspecao.id);

                try {
                    await FileSystem.deleteAsync(inspecao.path_pdf, {
                        idempotent: true,
                    });
                    console.log("PDF DELETADO:", inspecao.path_pdf);
                } catch (erroDelete) {
                    console.error("Erro ao deletar PDF:", erroDelete);
                }
            } else {
                console.log("ERRO AO ENVIAR:", inspecao.id);
                await marcarComoErro(inspecao.id);
            }
        }
    } catch (error) {
        console.error("Erro na sincronização:", error);
    } finally {
        sincronizando = false;
    }
};

export const temInternet = async (): Promise<boolean> => {
    const state = await Network.getNetworkStateAsync();
    const internetReachable = state.isInternetReachable;
    return Boolean(state.isConnected && (internetReachable ?? true));
};
