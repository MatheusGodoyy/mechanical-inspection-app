import { useEffect, useMemo, useRef, useState } from "react";
import {
    ActivityIndicator,
    Modal,
    PanResponder,
    Pressable,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { Image } from "react-native";
import Svg, { Ellipse, Line, Path, Polygon } from "react-native-svg";
import ViewShot from "react-native-view-shot";
import * as FileSystem from "expo-file-system/legacy";

interface Point {
    x: number;
    y: number;
}

interface Stroke {
    kind: "freehand" | "arrow" | "circle";
    points: Point[];
    color: string;
    width: number;
}

interface FotoEditorModalProps {
    visible: boolean;
    imageUri: string | null;
    onCancel: () => void;
    onSave: (uri: string) => void;
}

export function FotoEditorModal({ visible, imageUri, onCancel, onSave }: FotoEditorModalProps) {
    const viewShotRef = useRef<any>(null);
    const strokeRef = useRef<Stroke[]>([]);
    const currentStrokeRef = useRef<Stroke | null>(null);
    const [strokes, setStrokes] = useState<Stroke[]>([]);
    const [currentStroke, setCurrentStroke] = useState<Stroke | null>(null);
    const [tool, setTool] = useState<"freehand" | "arrow" | "circle">("freehand");
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (!visible) {
            strokeRef.current = [];
            currentStrokeRef.current = null;
            setStrokes([]);
            setCurrentStroke(null);
        }
    }, [visible]);

    const panResponder = useMemo(
        () =>
            PanResponder.create({
                onStartShouldSetPanResponder: () => true,
                onMoveShouldSetPanResponder: () => true,
                onPanResponderGrant: (evt) => {
                    const { locationX, locationY } = evt.nativeEvent;
                    const novoTraço: Stroke = {
                        kind: tool,
                        points: [{ x: locationX, y: locationY }],
                        color: "#ff3b30",
                        width: 3,
                    };
                    currentStrokeRef.current = novoTraço;
                    setCurrentStroke(novoTraço);
                },
                onPanResponderMove: (evt) => {
                    if (!currentStrokeRef.current) return;
                    const { locationX, locationY } = evt.nativeEvent;
                    const pontos = currentStrokeRef.current.kind === "freehand"
                        ? [...currentStrokeRef.current.points, { x: locationX, y: locationY }]
                        : [currentStrokeRef.current.points[0], { x: locationX, y: locationY }];
                    const atualizado: Stroke = {
                        ...currentStrokeRef.current,
                        points: pontos,
                    };
                    currentStrokeRef.current = atualizado;
                    setCurrentStroke(atualizado);
                },
                onPanResponderRelease: () => {
                    if (currentStrokeRef.current) {
                        const finalized = currentStrokeRef.current;
                        strokeRef.current = [...strokeRef.current, finalized];
                        setStrokes(strokeRef.current);
                    }
                    currentStrokeRef.current = null;
                    setCurrentStroke(null);
                },
            }),
        [tool],
    );

    const limpar = () => {
        strokeRef.current = [];
        setStrokes([]);
        currentStrokeRef.current = null;
        setCurrentStroke(null);
    };

    const desfazer = () => {
        if (strokeRef.current.length === 0) return;
        strokeRef.current = strokeRef.current.slice(0, -1);
        setStrokes(strokeRef.current);
    };

    const salvar = async () => {
        if (!viewShotRef.current || !imageUri) return;
        setIsSaving(true);
        try {
            const uriCapturada = await viewShotRef.current.capture({ format: "jpg", quality: 0.95 });
            const nomeArquivo = `foto_editada_${Date.now()}.jpg`;
            const destino = FileSystem.documentDirectory + nomeArquivo;
            await FileSystem.copyAsync({ from: uriCapturada, to: destino });
            onSave(destino);
        } catch (erro) {
            console.warn("Erro ao salvar foto editada:", erro);
        } finally {
            setIsSaving(false);
        }
    };

    const pathFromPoints = (points: Point[]) => {
        if (!points.length) return "";
        const initial = `M ${points[0].x.toFixed(1)} ${points[0].y.toFixed(1)}`;
        const rest = points.slice(1).map((p) => `L ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(" ");
        return `${initial} ${rest}`.trim();
    };

    const getArrowPoints = (start: Point, end: Point) => {
        const dx = end.x - start.x;
        const dy = end.y - start.y;
        const angle = Math.atan2(dy, dx);
        const headLength = 16;
        const headAngle = Math.PI / 6;
        const leftX = end.x - headLength * Math.cos(angle - headAngle);
        const leftY = end.y - headLength * Math.sin(angle - headAngle);
        const rightX = end.x - headLength * Math.cos(angle + headAngle);
        const rightY = end.y - headLength * Math.sin(angle + headAngle);
        return `${end.x},${end.y} ${leftX},${leftY} ${rightX},${rightY}`;
    };

    const renderStroke = (stroke: Stroke) => {
        if (stroke.points.length === 0) return null;
        if (stroke.kind === "arrow" && stroke.points.length >= 2) {
            const start = stroke.points[0];
            const end = stroke.points[stroke.points.length - 1];
            return (
                <>
                    <Line x1={start.x} y1={start.y} x2={end.x} y2={end.y} stroke={stroke.color} strokeWidth={stroke.width} strokeLinecap="round" />
                    <Polygon points={getArrowPoints(start, end)} fill={stroke.color} />
                </>
            );
        }
        if (stroke.kind === "circle" && stroke.points.length >= 2) {
            const start = stroke.points[0];
            const end = stroke.points[stroke.points.length - 1];
            const cx = (start.x + end.x) / 2;
            const cy = (start.y + end.y) / 2;
            const rx = Math.abs(end.x - start.x) / 2;
            const ry = Math.abs(end.y - start.y) / 2;
            return <Ellipse cx={cx} cy={cy} rx={rx} ry={ry} stroke={stroke.color} strokeWidth={stroke.width} fill="none" />;
        }
        return <Path d={pathFromPoints(stroke.points)} stroke={stroke.color} strokeWidth={stroke.width} fill="none" strokeLinecap="round" strokeLinejoin="round" />;
    };

    return (
        <Modal visible={visible} transparent={false} animationType="slide">
            <View style={styles.container}>
                <View style={styles.header}>
                    <Pressable onPress={onCancel} style={styles.buttonSecondary}>
                        <Text style={styles.buttonTextSecondary}>Cancelar</Text>
                    </Pressable>
                    <View style={styles.headerActions}>
                        <Pressable onPress={desfazer} style={styles.buttonSecondary}>
                            <Text style={styles.buttonTextSecondary}>Desfazer</Text>
                        </Pressable>
                        <Pressable onPress={limpar} style={styles.buttonSecondary}>
                            <Text style={styles.buttonTextSecondary}>Limpar</Text>
                        </Pressable>
                        <Pressable onPress={salvar} style={styles.buttonPrimary} disabled={isSaving}>
                            {isSaving ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonTextPrimary}>Salvar</Text>}
                        </Pressable>
                    </View>
                </View>

                <View style={styles.toolsBar}>
                    {[
                        { key: "freehand", label: "Traço" },
                        { key: "arrow", label: "Seta" },
                        { key: "circle", label: "Círculo" },
                    ].map((item) => (
                        <Pressable
                            key={item.key}
                            onPress={() => setTool(item.key as any)}
                            style={[styles.toolButton, tool === item.key && styles.toolButtonActive]}
                        >
                            <Text style={[styles.toolText, tool === item.key && styles.toolTextActive]}>{item.label}</Text>
                        </Pressable>
                    ))}
                </View>

                <Text style={styles.helper}>Desenhe sobre a imagem para destacar detalhes: traço livre, setas ou círculos.</Text>

                <ViewShot ref={viewShotRef} style={styles.editorArea} options={{ format: "jpg", quality: 0.95 }}>
                    {imageUri ? (
                        <Image source={{ uri: imageUri }} style={styles.image} resizeMode="contain" />
                    ) : null}
                    <Svg style={StyleSheet.absoluteFillObject} pointerEvents="none">
                        {strokes.map((stroke, index) => (
                            <View key={`stroke-${index}`}>{renderStroke(stroke)}</View>
                        ))}
                        {currentStroke ? <View>{renderStroke(currentStroke)}</View> : null}
                    </Svg>
                    <View style={StyleSheet.absoluteFillObject} {...panResponder.panHandlers} />
                </ViewShot>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#111827",
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 12,
        paddingVertical: 12,
        backgroundColor: "#1f2937",
    },
    headerActions: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },
    buttonPrimary: {
        backgroundColor: "#2563eb",
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 8,
        minWidth: 70,
        alignItems: "center",
    },
    buttonSecondary: {
        backgroundColor: "#374151",
        paddingHorizontal: 10,
        paddingVertical: 8,
        borderRadius: 8,
    },
    buttonTextPrimary: {
        color: "#fff",
        fontWeight: "600",
    },
    buttonTextSecondary: {
        color: "#fff",
        fontSize: 12,
    },
    toolsBar: {
        flexDirection: "row",
        gap: 8,
        paddingHorizontal: 12,
        paddingTop: 8,
    },
    toolButton: {
        backgroundColor: "#374151",
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 8,
    },
    toolButtonActive: {
        backgroundColor: "#2563eb",
    },
    toolText: {
        color: "#f9fafb",
        fontSize: 13,
    },
    toolTextActive: {
        fontWeight: "700",
    },
    helper: {
        color: "#f9fafb",
        paddingHorizontal: 12,
        paddingTop: 10,
        fontSize: 13,
    },
    editorArea: {
        flex: 1,
        margin: 12,
        borderRadius: 12,
        overflow: "hidden",
        backgroundColor: "#000",
    },
    image: {
        width: "100%",
        height: "100%",
    },
});
