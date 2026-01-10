import { useRef, useState } from "react";

export function useVoiceRoom(onRoomUsersChanged) {
    const [connected, setConnected] = useState(false);
    const [connecting, setConnecting] = useState(false);
    const [muted, setMuted] = useState(false);
    const [selfTesting, setSelfTesting] = useState(false);
    const [error, setError] = useState(null);

    const streamRef = useRef(null);
    const peersRef = useRef(new Map());
    const socketRef = useRef(null);
    const audioRef = useRef(null);

    // Подключение микрофона
    async function startMicrophone() {
        const stream = await navigator.mediaDevices.getUserMedia({
            audio: true
        });

        streamRef.current = stream;
    }

    // Присоединиться к комнате
    async function join(roomId) {
        setConnecting(true);

        try {
            await startMicrophone();

            connectSignaling(roomId);
            const pc = createPeerConnection();
            peersRef.current.set('peer', pc);

            setTimeout(async () => {
                const offer = await pc.createOffer();
                await pc.setLocalDescription(offer);

                socketRef.current.send(JSON.stringify({
                    type: 'offer',
                    offer
                }));
            }, 1000);

            setConnected(true);
            return true;
        } catch (e) {
            console.error(e);
            setError('Не удалось получить доступ к микрофону');
        } finally {
            setConnecting(false);
        }
        return false;
    }

    // Покинуть комнату
    function leave() {
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.srcObject = null;
            audioRef.current = null;
        }

        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }

        setConnected(false);
        setMuted(false);
        setSelfTesting(false);
        setError(null);

        peersRef.current.forEach(pc => pc.close());
        peersRef.current.clear();

        if (socketRef.current) {
            socketRef.current.close();
            socketRef.current = null;
        }
    }

    // Кнопка заглушения
    function toggleMute() {
        if (!streamRef.current) return;

        streamRef.current.getAudioTracks().forEach(track => {
            track.enabled = !track.enabled;
        });

        setMuted(prev => !prev);
    }

    // Создать подключение
    function createPeerConnection() {
        const pc = new RTCPeerConnection({
            iceServers: [
                { urls: 'stun:stun.l.google.com:19302' }
            ]
        });

        pc.onicecandidate = e => {
            if (e.candidate) {
                socketRef.current.send(JSON.stringify({
                    type: 'ice',
                    candidate: e.candidate
                }));
            }
        };

        pc.ontrack = e => {
            const audio = new Audio();
            audio.srcObject = e.streams[0];
            audio.autoplay = true;
        };

        streamRef.current.getTracks().forEach(track =>
            pc.addTrack(track, streamRef.current)
        );

        return pc;
    }

    // Сигналинг
    async function handleSignal(msg) {
        let pc = peersRef.current.get('peer');

        if (msg.type === 'offer') {
            pc = createPeerConnection();
            peersRef.current.set('peer', pc);

            if (msg.type === 'answer') {
                if (pc.signalingState !== 'have-local-offer') {
                    console.warn(
                        'Пропускаем answer, состояние:',
                        pc.signalingState
                    );
                    return;
                }

                await pc.setRemoteDescription(
                    new RTCSessionDescription(msg.answer)
                );
            }


            await pc.setRemoteDescription(msg.offer);

            const answer = await pc.createAnswer();
            await pc.setLocalDescription(answer);

            socketRef.current.send(JSON.stringify({
                type: 'answer',
                answer
            }));
        }

        if (msg.type === 'answer') {
            await pc.setRemoteDescription(msg.answer);
        }

        if (msg.type === 'ice') {
            await pc.addIceCandidate(msg.candidate);
        }
    }

    // Подключяем WebSocket
    function connectSignaling(roomId) {
        const ws = new WebSocket(
            `ws://localhost:8080/ToGame-back-1.0-SNAPSHOT/ws/signaling/${roomId}`
        );

        socketRef.current = ws;

        ws.onmessage = async (e) => {
            const msg = JSON.parse(e.data);

            if (msg.type === 'user-joined' || msg.type === 'user-left') {
                // дергаем REST
                onRoomUsersChanged?.();
                return;
            }

            await handleSignal(msg);
        };

    }

    // Проверка микрофона
    function toggleSelfTest() {
        if (!streamRef.current) return;

        // выключаем
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.srcObject = null;
            audioRef.current = null;
            setSelfTesting(false);
            return;
        }

        // включаем
        const audio = new Audio();
        audio.srcObject = streamRef.current;
        audio.autoplay = true;

        audioRef.current = audio;
        setSelfTesting(true);
    }

    return {
        connected,
        connecting,
        muted,
        selfTesting,
        error,

        join,
        leave,
        toggleMute,
        toggleSelfTest
    };
}