"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hasUserConnections = exports.getConnection = exports.removeConnection = exports.addConnection = exports.getConnectedUsers = exports.getConnectionStats = exports.broadcastToRole = exports.broadcastToChurch = exports.broadcastToUser = exports.broadcastToConnections = void 0;
// Global connection store (in production, use Redis or similar)
const connections = new Map();
// Utility to send message to all connections
function broadcastToConnections(message, filter) {
    const data = `data: ${JSON.stringify(message)}\n\n`;
    connections.forEach((connection) => {
        if (!filter || filter(connection)) {
            try {
                connection.controller.enqueue(new TextEncoder().encode(data));
            }
            catch (error) {
                console.error('Error sending SSE message:', error);
                // Connection might be closed, remove it
                connections.delete(connection.id);
            }
        }
    });
}
exports.broadcastToConnections = broadcastToConnections;
// Broadcast to specific user
function broadcastToUser(userId, message) {
    broadcastToConnections(message, (conn) => conn.userId === userId);
}
exports.broadcastToUser = broadcastToUser;
// Broadcast to church
function broadcastToChurch(churchId, message) {
    broadcastToConnections(message, (conn) => conn.churchId === churchId);
}
exports.broadcastToChurch = broadcastToChurch;
// Broadcast to role
function broadcastToRole(role, message) {
    broadcastToConnections(message, (conn) => conn.role === role);
}
exports.broadcastToRole = broadcastToRole;
// Get connection statistics
function getConnectionStats() {
    const uniqueUsers = new Set();
    connections.forEach(conn => uniqueUsers.add(conn.userId));
    return {
        totalConnections: connections.size,
        uniqueUsers: uniqueUsers.size,
        averageConnectionsPerUser: connections.size / Math.max(uniqueUsers.size, 1)
    };
}
exports.getConnectionStats = getConnectionStats;
// Get connected users
function getConnectedUsers(churchId) {
    const users = new Map();
    connections.forEach(connection => {
        if (churchId && connection.churchId !== churchId)
            return;
        if (!users.has(connection.userId)) {
            users.set(connection.userId, {
                userId: connection.userId,
                churchId: connection.churchId,
                role: connection.role,
                name: connection.name,
                status: 'online',
                lastSeen: connection.startTime,
                connectionCount: 1
            });
        }
        else {
            const user = users.get(connection.userId);
            user.connectionCount++;
        }
    });
    return Array.from(users.values());
}
exports.getConnectedUsers = getConnectedUsers;
// Connection management functions
function addConnection(connectionId, connectionInfo) {
    connections.set(connectionId, {
        id: connectionId,
        ...connectionInfo
    });
}
exports.addConnection = addConnection;
function removeConnection(connectionId) {
    connections.delete(connectionId);
}
exports.removeConnection = removeConnection;
function getConnection(connectionId) {
    return connections.get(connectionId);
}
exports.getConnection = getConnection;
function hasUserConnections(userId) {
    return Array.from(connections.values()).some(conn => conn.userId === userId);
}
exports.hasUserConnections = hasUserConnections;
//# sourceMappingURL=sse-broadcast.js.map