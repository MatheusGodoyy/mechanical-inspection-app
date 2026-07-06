import {
    View, Text, TextInput, ScrollView, Pressable, Image, Modal, KeyboardAvoidingView, Platform,
} from "react-native";
import { styles } from "../styles";
import { TIPO_INSPECAO } from "../constants";
import { MedicoesEletricas } from "../components/MedicoesEletricas";
import equipamentos from '../data/equipamentos.json';
import { useState } from "react";


export function FormularioRelatorioUI(props: any) {
    const {
        tituloInspecao,
        setTituloInspecao,
        tipoInspecao, setTipoInspecao,
        setArea,
        unidade,
        setUnidade,
        data1,
        setData1,
        data2,
        setData2,
        responsavel,
        setResponsavel,
        fnEquipamento, setFnEquipamento,
        nomeEquipamento, setnomeEquipamento,
        localInstalacao, setLocalInstalacao,
        plano, setPlano,
        listaTarefas, setListaTarefas,
        escopos, setEscopos,
        adicionarEscopo, removerEscopo, escolherImagem,
        assinatura, setAssinando,
        fotoSelecionada, setFotoSelecionada,
        salvarRelatorio, confirmarFinalizacao,
        formatDate,
        erroData1, erroData2, setErroData1, setErroData2,
        erroTitulo, setErroTitulo,
        erroTipo, setErroTipo,
        erroUnidade,
        erroResponsavel, setErroResponsavel,
        erroFn, setErroFn,
        erroNomeEquipamento, setErroNomeEquipamento,
        erroLocalInstalacao, setErroLocalInstalacao,
        erroPlano, setErroPlano,
        erroListaTarefas, setErroListaTarefas,
        erroAssinatura,
        erroEscopos,
        observacaoGeral, setObservacaoGeral
    } = props;

    const isEletrica = tipoInspecao === TIPO_INSPECAO.ELETRICA;

    const grupos = Array.from(
        new Set(
            escopos
                .filter((item: any) => item.grupo)
                .map((item: any) => String(item.grupo))
        )
    );

    const [sugestoes, setSugestoes] = useState<string[][]>([]);
    const [inputAtivo, setInputAtivo] = useState<number | null>(null);

    const buscarEquipamento = (texto: string, index: number) => {
        if (texto.length < 3) {
            setSugestoes([]);
            setInputAtivo(null);
            return;
        }
        const filtrados = (equipamentos as string[][])
            .filter(([fn]) => fn.startsWith(texto))
            .slice(0, 5);
        setSugestoes(filtrados);
        setInputAtivo(index);
    };

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : undefined}
            keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
        >
            <ScrollView
                style={styles.container}
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={{ paddingBottom: 40 }}
            >
                {/* CABEÇALHO */}
                <View style={styles.header}>
                    <Text style={[styles.subtitle, { marginBottom: 15 }]}>Sylvamo</Text>
                    <Text style={styles.title}>RELATÓRIO DIGITAL DE INSPEÇÃO TÉCNICA</Text>
                </View>

                {/* TÍTULO DA INSPEÇÃO */}
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionText}>TÍTULO DA INSPEÇÃO</Text>
                </View>
                <TextInput
                    style={[styles.input, erroTitulo && styles.inputError]}
                    placeholder="TÍTULO DA INSPEÇÃO"
                    placeholderTextColor="#ababab"
                    value={tituloInspecao}
                    onChangeText={(text) => { setTituloInspecao(text); setErroTitulo(false); }}
                />

                {/* DADOS DA INSPEÇÃO */}
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionText}>DADOS DA INSPEÇÃO</Text>
                </View>

                {isEletrica ? (
                    <View style={{ marginBottom: 15, marginTop: 10 }}>
                        <Text style={styles.label}>Tipo de inspeção:</Text>
                        <TextInput
                            style={styles.input}
                            value="Inspeção Elétrica - Transformadores"
                            editable={false}
                        />
                    </View>
                ) : (
                    <View style={{ marginBottom: 15, marginTop: 10 }}>
                        <Text style={styles.label}>Tipo de inspeção:</Text>
                        <TextInput
                            style={[styles.input, erroTipo && styles.inputError]}
                            placeholder="Ex: Inspeção Mecânica, Civil..."
                            placeholderTextColor="#ababab"
                            value={tipoInspecao}
                            onChangeText={(text) => { setArea(text); setErroTipo(false); }}
                        />
                    </View>
                )}

                <View style={{ marginBottom: 15, marginTop: 10 }}>
                    <Text style={styles.label}>Unidade:</Text>
                    {erroUnidade && (
                        <Text style={{ color: "red", fontSize: 12, marginTop: 4 }}>
                            Selecione uma unidade
                        </Text>
                    )}
                    <View style={{ flexDirection: "row", gap: 10 }}>
                        {["Mogi Guaçu", "Luiz Antônio", "Três Lagoas"].map((item) => (
                            <Pressable
                                key={item}
                                onPress={() => setUnidade(item)}
                                style={{
                                    padding: 10,
                                    borderRadius: 5,
                                    borderWidth: erroUnidade && unidade !== item ? 2 : 1,
                                    marginTop: 7,
                                    borderColor: erroUnidade ? "red" : "#ccc",
                                    backgroundColor: unidade === item ? "#333a34" : "#fff",
                                }}
                            >
                                <Text style={{ color: unidade === item ? "#fff" : "#000" }}>{item}</Text>
                            </Pressable>
                        ))}
                    </View>
                </View>

                <View style={{ marginBottom: 15, marginTop: 10 }}>
                    <Text style={styles.label}>Data da inspeção:</Text>
                    <TextInput
                        style={[styles.input, erroData1 && styles.inputError]}
                        placeholder="(DD/MM/AAAA)"
                        placeholderTextColor="#ababab"
                        keyboardType="numeric"
                        value={data1}
                        onChangeText={(text) => { setData1(formatDate(text)); setErroData1(false); }}
                    />
                </View>

                <View style={{ marginBottom: 15, marginTop: 10 }}>
                    <Text style={styles.label}>Data da próxima inspeção:</Text>
                    <TextInput
                        style={[styles.input, erroData2 && styles.inputError]}
                        placeholder="(DD/MM/AAAA)"
                        placeholderTextColor="#ababab"
                        keyboardType="numeric"
                        value={data2}
                        onChangeText={(text) => { setData2(formatDate(text)); setErroData2(false); }}
                    />
                </View>

                <View style={{ marginBottom: 15, marginTop: 10 }}>
                    <Text style={styles.label}>Nome do inspetor:</Text>
                    <TextInput
                        style={[styles.input, erroResponsavel && styles.inputError]}
                        placeholderTextColor="#ababab"
                        value={responsavel}
                        onChangeText={(text) => { setResponsavel(text); setErroResponsavel(false); }}
                    />
                </View>

                {/* DADOS DO EQUIPAMENTO */}
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionText}>DADOS DO EQUIPAMENTO</Text>
                </View>

                <View style={{ marginBottom: 15, marginTop: 10 }}>
                    <Text style={styles.label}>FN do equipamento:</Text>
                    <TextInput
                        style={[styles.input, erroFn && styles.inputError]}
                        placeholderTextColor="#ababab"
                        value={fnEquipamento}
                        onChangeText={(text) => { setFnEquipamento(text); setErroFn(false); }}
                    />
                </View>

                <View style={{ marginBottom: 15, marginTop: 10 }}>
                    <Text style={styles.label}>Nome do equipamento ou rota:</Text>
                    <TextInput
                        style={[styles.input, erroNomeEquipamento && styles.inputError]}
                        placeholderTextColor="#ababab"
                        value={nomeEquipamento}
                        onChangeText={(text) => { setnomeEquipamento(text); setErroNomeEquipamento(false); }}
                    />
                </View>

                <View style={{ marginBottom: 15, marginTop: 10 }}>
                    <Text style={styles.label}>Local da instalação:</Text>
                    <TextInput
                        style={[styles.input, erroLocalInstalacao && styles.inputError]}
                        placeholderTextColor="#ababab"
                        value={localInstalacao}
                        onChangeText={(text) => { setLocalInstalacao(text); setErroLocalInstalacao(false); }}
                    />
                </View>

                <View style={{ marginBottom: 15, marginTop: 10 }}>
                    <Text style={styles.label}>Plano:</Text>
                    <TextInput
                        style={[styles.input, erroPlano && styles.inputError]}
                        placeholderTextColor="#ababab"
                        value={plano}
                        onChangeText={(text) => { setPlano(text); setErroPlano(false); }}
                    />
                </View>

                <View style={{ marginBottom: 15, marginTop: 10 }}>
                    <Text style={styles.label}>Lista de tarefas:</Text>
                    <TextInput
                        style={[styles.input, erroListaTarefas && styles.inputError]}
                        placeholderTextColor="#ababab"
                        value={listaTarefas}
                        onChangeText={(text) => { setListaTarefas(text); setErroListaTarefas(false); }}
                    />
                </View>

                {/* OBJETIVOS */}
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionText}>OBJETIVOS DA INSPEÇÃO</Text>
                </View>
                <View style={styles.fixedBox}>
                    <Text style={styles.fixedText}>
                        Realizar a avaliação técnica das condições operacionais e estruturais do item
                        inspecionado, visando à identificação sistemática de não conformidades, anomalias ou
                        desvios em relação aos requisitos normativos e de segurança aplicáveis.
                    </Text>
                </View>

                {/* ESCOPOS */}
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionText}>ESCOPOS DA INSPEÇÃO</Text>
                </View>

                {grupos.map((grupo: any) => (
                    <View key={grupo}>
                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionText}>{grupo}</Text>
                        </View>

                        {escopos
                            .filter((item: any) => item.grupo === grupo)
                            .map((item: any) => {
                                const index = escopos.findIndex((e: any) => e.id === item.id);
                                const errosItem = erroEscopos?.[item.id] || {};

                                return (
                                    <View
                                        key={item.id}
                                        style={[
                                            styles.escopoBox,
                                            Object.keys(errosItem).length > 0 && { borderColor: "red", borderWidth: 2 },
                                        ]}
                                    >
                                        <Text style={styles.escopoTitle}>Item {index + 1}</Text>

                                        {isEletrica && (
                                            <Text style={{ fontSize: 16, fontWeight: "600", marginBottom: 10 }}>
                                                {item.tituloItem}
                                            </Text>
                                        )}

                                        {!isEletrica && (
                                            <>
                                                <TextInput
                                                    style={[styles.input, errosItem.titulo && styles.inputError]}
                                                    placeholder="Nome do item inspecionado"
                                                    placeholderTextColor="#9CA3AF"
                                                    value={item.tituloItem}
                                                    onChangeText={(text) => {
                                                        const copia = [...escopos];
                                                        copia[index].tituloItem = text;
                                                        setEscopos(copia);
                                                        buscarEquipamento(text, index);
                                                    }}
                                                    onBlur={() => {
                                                        setTimeout(() => setSugestoes([]), 200);
                                                    }}
                                                />
                                                {inputAtivo === index && sugestoes.length > 0 && (
                                                    <View style={{ borderWidth: 1, borderColor: '#ccc', borderRadius: 4, marginTop: 2 }}>
                                                        {sugestoes.map(([fn, nome]) => (
                                                            <Pressable
                                                                key={fn}
                                                                onPress={() => {
                                                                    const copia = [...escopos];
                                                                    copia[index].tituloItem = `${fn} - ${nome}`;
                                                                    setEscopos(copia);
                                                                    setSugestoes([]);
                                                                    setInputAtivo(null);
                                                                }}
                                                                style={{ padding: 10, borderBottomWidth: 1, borderColor: '#eee', backgroundColor: '#f9f9f9' }}
                                                            >
                                                                <Text style={{ fontSize: 13, color: '#333' }}>{fn} - {nome}</Text>
                                                            </Pressable>
                                                        ))}
                                                    </View>
                                                )}
                                            </>
                                        )}

                                        {!isEletrica && (
                                            <Pressable
                                                onPress={() => removerEscopo(index)}
                                                style={({ pressed }) => [styles.removeEscopoButton, pressed && { opacity: 0.7, transform: [{ scale: 0.96 }] }]}
                                            >
                                                <Text style={styles.removeEscopoText}>Remover item</Text>
                                            </Pressable>
                                        )}

                                        {item.id === "10" && (
                                            <MedicoesEletricas
                                                item={item}
                                                index={index}
                                                escopos={escopos}
                                                setEscopos={setEscopos}
                                            />
                                        )}

                                        {item.exigeFoto && (
                                            <Pressable
                                                onPress={() => escolherImagem(index)}
                                                style={({ pressed }) => [styles.photoButton, pressed && { opacity: 0.7, transform: [{ scale: 0.97 }] }]}
                                            >
                                                <Text style={styles.photoButtonText}>Adicionar foto</Text>
                                            </Pressable>
                                        )}

                                        <View style={{ flexDirection: "row", flexWrap: "wrap", marginTop: 10 }}>
                                            {item.fotos.map((foto: string, fotoIndex: number) => (
                                                <View key={fotoIndex} style={{ marginRight: 10, marginBottom: 10 }}>
                                                    <Pressable onPress={() => setFotoSelecionada(foto)}>
                                                        <Image source={{ uri: foto }} style={styles.photoPreview} />
                                                    </Pressable>
                                                    <Pressable
                                                        onPress={() => {
                                                            const copia = [...escopos];
                                                            copia[index].fotos.splice(fotoIndex, 1);
                                                            setEscopos(copia);
                                                        }}
                                                        style={({ pressed }) => [
                                                            { backgroundColor: pressed ? "#b71c1c" : "red", padding: 4, marginTop: 4, alignItems: "center", borderRadius: 4 },
                                                            pressed && { transform: [{ scale: 0.95 }] },
                                                        ]}
                                                    >
                                                        <Text style={{ color: "white", fontSize: 12 }}>Excluir</Text>
                                                    </Pressable>
                                                </View>
                                            ))}
                                        </View>

                                        <View style={styles.statusRow}>
                                            <Pressable
                                                style={[styles.statusButton, item.status === "conforme" && styles.statusConforme]}
                                                onPress={() => {
                                                    const copia = [...escopos];
                                                    copia[index].status = "conforme";
                                                    setEscopos(copia);
                                                }}
                                            >
                                                <Text style={{ color: item.status === "conforme" ? "white" : "#334155", fontWeight: "600" }}>
                                                    Conforme
                                                </Text>
                                            </Pressable>

                                            <Pressable
                                                style={[styles.statusButton, item.status === "nao_conforme" && styles.statusNaoConforme]}
                                                onPress={() => {
                                                    const copia = [...escopos];
                                                    copia[index].status = "nao_conforme";
                                                    setEscopos(copia);
                                                }}
                                            >
                                                <Text style={{ color: item.status === "nao_conforme" ? "white" : "#334155", fontWeight: "600" }}>
                                                    Não conforme
                                                </Text>
                                            </Pressable>

                                            {tipoInspecao === "eletrica" && (
                                                <Pressable
                                                    style={[styles.statusButton, item.status === "nao_aplicavel" && styles.statusNaoAplicavel]}
                                                    onPress={() => {
                                                        const copia = [...escopos];
                                                        copia[index].status = "nao_aplicavel";
                                                        setEscopos(copia);
                                                    }}
                                                >
                                                    <Text style={{ color: item.status === "nao_aplicavel" ? "white" : "#334155", fontWeight: "600" }}>
                                                        Não Aplicável
                                                    </Text>
                                                </Pressable>
                                            )}
                                        </View>

                                        {item.status && (
                                            <>
                                                {item.status === "nao_conforme" && (
                                                    <TextInput
                                                        multiline
                                                        textAlignVertical="top"
                                                        style={[styles.textArea, errosItem.observacao && styles.inputError]}
                                                        placeholder="Descreva a não conformidade *"
                                                        placeholderTextColor="#9CA3AF"
                                                        value={item.observacao}
                                                        onChangeText={(text) => {
                                                            const copia = [...escopos];
                                                            copia[index].observacao = text;
                                                            setEscopos(copia);
                                                        }}
                                                    />
                                                )}

                                                {item.status === "conforme" && (
                                                    <TextInput
                                                        multiline
                                                        textAlignVertical="top"
                                                        style={styles.textArea}
                                                        placeholder="Observações (opcional)"
                                                        placeholderTextColor="#9CA3AF"
                                                        value={item.observacao}
                                                        onChangeText={(text) => {
                                                            const copia = [...escopos];
                                                            copia[index].observacao = text;
                                                            setEscopos(copia);
                                                        }}
                                                    />
                                                )}

                                                {!isEletrica && item.status === "nao_conforme" && (
                                                    <TextInput
                                                        multiline
                                                        textAlignVertical="top"
                                                        style={[styles.textArea, errosItem.recomendacao && styles.inputError]}
                                                        placeholder="Recomendações *"
                                                        placeholderTextColor="#9CA3AF"
                                                        value={item.recomendacao}
                                                        onChangeText={(text) => {
                                                            const copia = [...escopos];
                                                            copia[index].recomendacao = text;
                                                            setEscopos(copia);
                                                        }}
                                                    />
                                                )}
                                            </>
                                        )}
                                    </View>
                                );
                            })}
                    </View>
                ))}

                {/* FORA DO MAP */}

                {!isEletrica && (
                    <Pressable
                        onPress={adicionarEscopo}
                        style={({ pressed }) => [styles.button, pressed && { opacity: 0.7, transform: [{ scale: 0.97 }] }]}
                    >
                        <Text style={styles.buttonText}>+ Adicionar item de inspeção</Text>
                    </Pressable>
                )}

                {isEletrica && (
                    <>
                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionText}>OBSERVAÇÕES GERAIS</Text>
                        </View>
                        <TextInput
                            style={[styles.input, { height: 120, textAlignVertical: "top" }]}
                            multiline
                            placeholder="Digite observações gerais da inspeção..."
                            value={observacaoGeral}
                            onChangeText={(texto) => setObservacaoGeral(texto)}
                        />
                    </>
                )}

                {/* ASSINATURAS */}
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionText}>ASSINATURAS</Text>
                </View>

                {erroAssinatura && (
                    <Text style={{ color: "red", fontSize: 12, marginTop: 8, textAlign: "center" }}>
                        Assinatura obrigatória
                    </Text>
                )}

                <Pressable
                    onPress={() => setAssinando(true)}
                    style={({ pressed }) => [
                        styles.signature,
                        erroAssinatura && { borderColor: "red", borderWidth: 2 },
                        pressed && { opacity: 0.8, transform: [{ scale: 0.98 }] },
                    ]}
                >
                    {assinatura ? (
                        <Image source={{ uri: assinatura }} style={{ width: "100%", height: "100%" }} resizeMode="stretch" />
                    ) : (
                        <Text style={{ textAlign: "center", marginTop: 70 }}>Toque para assinar</Text>
                    )}
                </Pressable>

                <Text style={styles.signatureLabel}>Responsável</Text>

                <Modal visible={fotoSelecionada !== null} transparent={true}>
                    <Pressable
                        onPress={() => setFotoSelecionada(null)}
                        style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.9)", justifyContent: "center", alignItems: "center" }}
                    >
                        {fotoSelecionada && (
                            <Image source={{ uri: fotoSelecionada }} style={{ width: "95%", height: "80%", resizeMode: "contain" }} />
                        )}
                    </Pressable>
                </Modal>

                <View style={{ marginTop: 30 }}>
                    <Pressable
                        onPress={salvarRelatorio}
                        style={({ pressed }) => [styles.button, pressed && { opacity: 0.7, transform: [{ scale: 0.97 }] }]}
                    >
                        <Text style={styles.buttonText}>Salvar relatório</Text>
                    </Pressable>

                    <Pressable
                        onPress={confirmarFinalizacao}
                        style={({ pressed }) => [
                            styles.button,
                            { backgroundColor: "#f24949" },
                            pressed && { opacity: 0.7, transform: [{ scale: 0.97 }] },
                        ]}
                    >
                        <Text style={styles.buttonText}>Finalizar relatório</Text>
                    </Pressable>
                </View>

            </ScrollView>
        </KeyboardAvoidingView>
    );
}