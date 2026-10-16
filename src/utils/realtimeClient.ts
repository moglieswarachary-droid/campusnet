/**
 * CampusNet+ Real-Time SSE Client
 * Manages Server-Sent Events (SSE) connection between portals and the backend realtime hub.
 */

export interface RealtimeNotification {
  id: string;
  type: string;
  title: string;
  message: string;
  targetRole?: string;
  targetUserId?: string;
  payload?: any;
  timestamp: string;
}

type NotificationListener = (notif: RealtimeNotification) => void;

class RealtimeClient {
  private eventSource: EventSource | null = null;
  private listeners: Set<NotificationListener> = new Set();
  private isConnected = false;
  private reconnectTimer: any = null;
  private currentRole = '';
  private currentUserId = '';

  public connect(role?: string, userId?: string) {
    if (typeof window === 'undefined') return;

    this.currentRole = role || '';
    this.currentUserId = userId || '';

    // Close any previous connection
    this.disconnect();

    const queryParams = new URLSearchParams();
    if (this.currentRole) queryParams.set('role', this.currentRole);
    if (this.currentUserId) queryParams.set('userId', this.currentUserId);

    const streamUrl = `/api/realtime/stream?${queryParams.toString()}`;

    try {
      this.eventSource = new EventSource(streamUrl);

      this.eventSource.onopen = () => {
        this.isConnected = true;
        // Connected to realtime stream
      };

      this.eventSource.addEventListener('notification', (event: MessageEvent) => {
        try {
          const data: RealtimeNotification = JSON.parse(event.data);
          this.notifyListeners(data);
        } catch (err) {
          console.error('[RealtimeClient] Failed to parse notification:', err);
        }
      });

      this.eventSource.onerror = () => {
        this.isConnected = false;
        if (this.eventSource) {
          this.eventSource.close();
          this.eventSource = null;
        }
        // Auto-reconnect after 8s
        if (!this.reconnectTimer) {
          this.reconnectTimer = setTimeout(() => {
            this.reconnectTimer = null;
            this.connect(this.currentRole, this.currentUserId);
          }, 8000);
        }
      };
    } catch (err) {
      console.warn('[RealtimeClient] SSE initialization skipped:', err);
    }
  }

  public disconnect() {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = null;
    }
    this.isConnected = false;
  }

  public subscribe(listener: NotificationListener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notifyListeners(notif: RealtimeNotification) {
    for (const listener of this.listeners) {
      try {
        listener(notif);
      } catch (err) {
        console.error('[RealtimeClient] Listener error:', err);
      }
    }
  }

  public async broadcast(announcement: {
    title: string;
    message: string;
    type?: string;
    targetRole?: string;
    targetUserId?: string;
    payload?: any;
  }): Promise<boolean> {
    try {
      const token = sessionStorage.getItem('campusnet_token') || localStorage.getItem('campusnet_token');
      const res = await fetch('/api/realtime/broadcast', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify(announcement)
      });
      return res.ok;
    } catch {
      return false;
    }
  }
}

export const realtimeClient = new RealtimeClient();
