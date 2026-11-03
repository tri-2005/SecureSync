// SecureSync Demo / Mock Dataset

export const WINDOWS_SYNC_PATH = 'C:\\SyncFolder';
export const KALI_SYNC_PATH = '/home/trivikram/SyncFolder';

export const initialFiles = [
  {
    id: 'f-1',
    name: 'project_report.docx',
    size: '2.4 MB',
    lastModified: '2026-09-27 15:42:10',
    source: 'Windows',
    status: 'Synced',
    path: `${WINDOWS_SYNC_PATH}\\project_report.docx`
  },
  {
    id: 'f-2',
    name: 'network_topology.png',
    size: '1.8 MB',
    lastModified: '2026-09-27 15:30:05',
    source: 'Kali Linux',
    status: 'Synced',
    path: `${KALI_SYNC_PATH}/network_topology.png`
  },
  {
    id: 'f-3',
    name: 'audit_payload.py',
    size: '14.2 KB',
    lastModified: '2026-09-27 15:15:22',
    source: 'Kali Linux',
    status: 'Synced',
    path: `${KALI_SYNC_PATH}/audit_payload.py`
  },
  {
    id: 'f-4',
    name: 'client_database_backup.sql',
    size: '45.8 MB',
    lastModified: '2026-09-27 14:50:00',
    source: 'Windows',
    status: 'Synced',
    path: `${WINDOWS_SYNC_PATH}\\client_database_backup.sql`
  },
  {
    id: 'f-5',
    name: 'security_config.json',
    size: '4.1 KB',
    lastModified: '2026-09-27 14:10:18',
    source: 'Windows',
    status: 'Synced',
    path: `${WINDOWS_SYNC_PATH}\\security_config.json`
  },
  {
    id: 'f-6',
    name: 'system_architecture.pdf',
    size: '8.5 MB',
    lastModified: '2026-09-27 13:05:44',
    source: 'Kali Linux',
    status: 'Synced',
    path: `${KALI_SYNC_PATH}/system_architecture.pdf`
  }
];

export const initialTransfers = [
  {
    id: 't-101',
    file: 'network_topology.png',
    direction: 'Kali → Windows',
    source: `Kali Linux (${KALI_SYNC_PATH})`,
    destination: `Windows (${WINDOWS_SYNC_PATH})`,
    status: 'Completed',
    progress: 100,
    speed: '14.2 MB/s (Demo)',
    time: '15:30:05'
  },
  {
    id: 't-102',
    file: 'project_report.docx',
    direction: 'Windows → Kali',
    source: `Windows (${WINDOWS_SYNC_PATH})`,
    destination: `Kali Linux (${KALI_SYNC_PATH})`,
    status: 'Completed',
    progress: 100,
    speed: '18.6 MB/s (Demo)',
    time: '15:42:10'
  },
  {
    id: 't-103',
    file: 'database_export_v2.tar.gz',
    direction: 'Windows → Kali',
    source: `Windows (${WINDOWS_SYNC_PATH})`,
    destination: `Kali Linux (${KALI_SYNC_PATH})`,
    status: 'In Progress',
    progress: 72,
    speed: '12.4 MB/s (Demo)',
    time: '16:04:12'
  },
  {
    id: 't-104',
    file: 'system_log_dump.log',
    direction: 'Kali → Windows',
    source: `Kali Linux (${KALI_SYNC_PATH})`,
    destination: `Windows (${WINDOWS_SYNC_PATH})`,
    status: 'Queued',
    progress: 0,
    speed: '--',
    time: '16:05:00'
  }
];

export const initialActivityLogs = [
  {
    id: 'act-1',
    timestamp: '2026-09-27 16:04:12',
    event: 'MODIFY',
    file: 'database_export_v2.tar.gz',
    source: 'Windows Watcher',
    status: 'Syncing',
    path: `${WINDOWS_SYNC_PATH}\\database_export_v2.tar.gz`
  },
  {
    id: 'act-2',
    timestamp: '2026-09-27 15:42:10',
    event: 'CREATE',
    file: 'project_report.docx',
    source: 'Windows Watcher',
    status: 'Completed',
    path: `${WINDOWS_SYNC_PATH}\\project_report.docx`
  },
  {
    id: 'act-3',
    timestamp: '2026-09-27 15:30:05',
    event: 'MODIFY',
    file: 'network_topology.png',
    source: 'Kali Watcher',
    status: 'Completed',
    path: `${KALI_SYNC_PATH}/network_topology.png`
  },
  {
    id: 'act-4',
    timestamp: '2026-09-27 15:10:00',
    event: 'RENAME',
    file: 'draft_notes.txt → final_notes.txt',
    source: 'Windows Watcher',
    status: 'Completed',
    path: `${WINDOWS_SYNC_PATH}\\final_notes.txt`
  },
  {
    id: 'act-5',
    timestamp: '2026-09-27 14:55:18',
    event: 'DELETE',
    file: 'temp_cache.tmp',
    source: 'Kali Watcher',
    status: 'Completed',
    path: `${KALI_SYNC_PATH}/temp_cache.tmp`
  }
];

export const mockSystemStatus = {
  windows: {
    nodeName: 'Windows 11 Workstation',
    os: 'Windows 11 Enterprise (64-bit)',
    ip: '192.168.1.105 (Demo IP)',
    syncFolder: WINDOWS_SYNC_PATH,
    services: [
      { name: 'Watchdog File System Watcher', status: 'Running', detail: 'Monitoring C:\\SyncFolder' },
      { name: 'TCP File Transfer Module', status: 'Active', detail: 'Ready for outbound sockets' },
      { name: 'Windows Socket Receiver', status: 'Online', detail: 'Listening on port 5001' },
      { name: 'Loop Prevention Engine', status: 'Active', detail: 'Suppression active' }
    ],
    metrics: {
      cpuUsage: '4.2% (Demo)',
      ramUsage: '128 MB (Demo)',
      uptime: '14h 22m (Demo)',
      stabilityCheck: 'Passed (File lock detection active)'
    }
  },
  kali: {
    nodeName: 'Kali Linux Engine',
    os: 'Kali Linux 2024.3 (Debian-based)',
    ip: '192.168.1.120 (Demo IP)',
    syncFolder: KALI_SYNC_PATH,
    services: [
      { name: 'PyInotify / Watchdog Service', status: 'Running', detail: 'Monitoring /home/trivikram/SyncFolder' },
      { name: 'TCP Sync Server', status: 'Active', detail: 'Listening on port 5000' },
      { name: 'Kali Receiver Module', status: 'Online', detail: 'Ready for incoming streams' },
      { name: 'Loop Prevention Engine', status: 'Active', detail: 'Suppression active' }
    ],
    metrics: {
      cpuUsage: '2.8% (Demo)',
      ramUsage: '94 MB (Demo)',
      uptime: '38h 15m (Demo)',
      stabilityCheck: 'Passed (Inotify buffer optimal)'
    }
  }
};

export const mockQuickStats = {
  totalSyncedFiles: 24,
  activeSyncStatus: 'Bidirectional Sync Active',
  storageSynced: '4.8 GB (Demo)',
  eventsToday: 142
};
