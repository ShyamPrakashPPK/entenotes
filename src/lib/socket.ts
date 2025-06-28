import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export const getSocket = () => {
    if (!socket) {
        const token = localStorage.getItem('token');

        console.log('Initializing socket connection with token:', token ? 'present' : 'missing');

        socket = io('ws://localhost:3052', {
            auth: {
                token
            },
            withCredentials: true,
            transports: ['websocket'],
            autoConnect: false,
            reconnection: true,
            reconnectionAttempts: Infinity,
            reconnectionDelay: 1000,
            timeout: 20000,
        });

        // Handle connection events
        socket.on('connect', () => {
            console.log('Socket connected successfully', socket?.id);
        });

        socket.on('connect_error', (error: Error) => {
            console.error('Socket connection error:', error.message);
            if (error.message === 'Authentication error') {
                window.location.href = '/login';
            }
        });

        socket.on('disconnect', (reason) => {
            console.log('Socket disconnected:', reason);
            if (reason === 'io server disconnect') {
                // the disconnection was initiated by the server, reconnect manually
                socket?.connect();
            }
        });

        // Handle general errors
        socket.on('error', (error: { message: string }) => {
            console.error('Socket error:', error);
        });
    }

    if (!socket.connected) {
        console.log('Socket not connected, connecting now...');
        socket.connect();
    }

    return socket;
};

export const disconnectSocket = () => {
    if (socket) {
        console.log('Disconnecting socket:', socket.id);
        socket.disconnect();
        socket = null;
    }
};
