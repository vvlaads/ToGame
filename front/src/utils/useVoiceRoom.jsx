import { useRef, useState } from "react";

export function useVoiceRoom() {
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
    async function join() {
        setConnecting(true);

        try {
            await startMicrophone();
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
    function createPeerConnection() { }

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