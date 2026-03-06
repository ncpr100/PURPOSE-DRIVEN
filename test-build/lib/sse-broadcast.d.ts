export declare function broadcastToConnections(message: any, filter?: (conn: any) => boolean): void;
export declare function broadcastToUser(userId: string, message: any): void;
export declare function broadcastToChurch(churchId: string, message: any): void;
export declare function broadcastToRole(role: string, message: any): void;
export declare function getConnectionStats(): {
    totalConnections: number;
    uniqueUsers: number;
    averageConnectionsPerUser: number;
};
export declare function getConnectedUsers(churchId?: string): any[];
export declare function addConnection(connectionId: string, connectionInfo: {
    userId: string;
    churchId: string;
    role: string;
    name: string;
    controller: ReadableStreamDefaultController;
    startTime: Date;
}): void;
export declare function removeConnection(connectionId: string): void;
export declare function getConnection(connectionId: string): {
    id: string;
    userId: string;
    churchId: string;
    role: string;
    name: string;
    controller: ReadableStreamDefaultController<any>;
    startTime: Date;
} | undefined;
export declare function hasUserConnections(userId: string): boolean;
//# sourceMappingURL=sse-broadcast.d.ts.map