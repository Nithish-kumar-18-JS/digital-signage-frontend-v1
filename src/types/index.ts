// =====================
// ENUMS
// =====================
export enum MediaType {
    IMAGE = 'IMAGE',
    VIDEO = 'VIDEO',
    AUDIO = 'AUDIO',
    HTML = 'HTML',
    RSS = 'RSS',
    DOCUMENT = 'DOCUMENT',
  }
  
  export enum ScreenStatus {
    ONLINE = 'ONLINE',
    OFFLINE = 'OFFLINE',
    MAINTENANCE = 'MAINTENANCE',
  }
  
  export enum ScreenOrientation {
    LANDSCAPE = 'LANDSCAPE',
    PORTRAIT = 'PORTRAIT',
  }
  
  // =====================
  // INTERFACES
  // =====================
  
  export interface User {
    id: number;
    email: string;
    firstName?: string;
    lastName?: string;
    password?: string;
    createdAt: Date;
    updatedAt: Date;
  
    uploadedMedia: Media[];
    createdPlaylists: Playlist[];
    createdSchedules: Schedule[];
    authTokens: AuthToken[];
    auditLogs: AuditLog[];
  }
  
  export interface AuditLog {
    id: number;
    userId: number;
    action: string;
    createdAt: Date;
    updatedAt: Date;
    request: string;
    response: string;
    error?: string;
    status: number;
    lineNumber?: number;
  
    user: User;
  }
  
  export interface AuthToken {
    id: number;
    token: string;
    userId: number;
    expiresAt: Date;
    createdAt: Date;
  
    user: User;
  }
  
  export interface Media {
    id: number;
    name: string;
    description?: string;
    type: MediaType;
    url?: string;
    durationSeconds: number;
    uploadedById: number;
    createdAt: Date;
    updatedAt: Date;
  
    uploadedBy: User;
    playlistItems: PlaylistItem[];
  }
  
  export interface Playlist {
    id?: number;
    name: string;
    description?: string;
    createdById?: number;
    createdAt?: Date;
    updatedAt: Date;
  
    createdBy?: User;
    items: PlaylistItem[];
    schedulePlaylists?: SchedulePlaylist[];
  }
  
  export interface PlaylistItem {
    id: number;
    playlistId: number;
    mediaId: number;
    position: number;
    durationOverride?: number;
    transitionEffect?: string;
  
    playlist: Playlist;
    media: Media;
  }
  
  export interface Setting {
    id: number;
    screenId: number;
    key: string;
    value: string;
    updatedAt: Date;
  
    screen: Screen;
  }
  
  export interface Screen {
    id: number;
    name: string;
    description?: string;
    deviceId: string;
    status: ScreenStatus;
    lastSeen?: Date;
    resolution?: string;
    orientation: ScreenOrientation;
    createdAt: Date;
    updatedAt: Date;
    createdBy: number;
  
    settings: Setting[];
    schedules: Schedule[];
  }
  
  export interface Schedule {
    id: number;
    name: string;
    description?: string;
    screenId: number;
    assignedAt: Date;
    startTime?: Date;
    endTime?: Date;
    daysOfWeek?: string;
    repeatDaily: boolean;
    priority: string;
    createdById: number;
  
    createdBy: User;
    schedulePlaylists: SchedulePlaylist[];
    screen: Screen;
  }
  
  export interface SchedulePlaylist {
    id: number;
    scheduleId: number;
    playlistId: number;
  
    schedule: Schedule;
    playlist: Playlist;
  }
  

  export interface LoginData {
    email: string;
    password: string;
  }
    
  export interface RegisterData {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }