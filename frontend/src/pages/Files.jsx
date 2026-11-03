import React, { useState, useEffect } from 'react';
import { 
  FolderOpen, 
  Search, 
  Send, 
  Trash2, 
  Edit3, 
  FileText, 
  CheckCircle,
  Plus,
  RefreshCw,
  X,
  FileCode,
  FileSpreadsheet,
  Image as ImageIcon,
  File as FileGeneric,
  Folder
} from 'lucide-react';
import { 
  fetchFiles, 
  sendFileApi, 
  deleteFileApi, 
  renameFileApi, 
  createFileApi 
} from '../services/apiClient';

export default function Files({ showToast }) {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Modals state: 'rename' | 'add' | null
  const [activeModal, setActiveModal] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [renameInput, setRenameInput] = useState('');

  // Create File form state
  const [newFileName, setNewFileName] = useState('');
  const [newFileContent, setNewFileContent] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadFiles();
    const interval = setInterval(loadFiles, 4000);
    return () => clearInterval(interval);
  }, []);

  const loadFiles = async () => {
    const data = await fetchFiles();
    if (data) {
      setFiles(data);
    }
    setLoading(false);
  };

  const filteredFiles = files.filter(file => 
    file.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Send File
  const handleSendFile = async (file) => {
    showToast(`Sending ${file.name} to Kali Linux via transfer.py...`);
    const res = await sendFileApi(file.name);
    if (res?.success) {
      showToast(`Success: ${res.message}`);
    } else {
      showToast(`Error: ${res?.message || 'Transfer failed'}`);
    }
    loadFiles();
  };

  // Delete File
  const handleDeleteFile = async (fileName) => {
    if (!window.confirm(`Are you sure you want to delete ${fileName} from C:\\SyncFolder?`)) {
      return;
    }
    showToast(`Deleting ${fileName}...`);
    const res = await deleteFileApi(fileName);
    if (res?.success) {
      showToast(`Deleted ${fileName} successfully.`);
    } else {
      showToast(`Error: ${res?.message || 'Delete failed'}`);
    }
    loadFiles();
  };

  // Open Rename Modal
  const openRenameModal = (file) => {
    setSelectedFile(file);
    setRenameInput(file.name);
    setActiveModal('rename');
  };

  // Submit Rename
  const handleRenameSubmit = async (e) => {
    e.preventDefault();
    if (!renameInput.trim() || !selectedFile) return;

    showToast(`Renaming ${selectedFile.name} → ${renameInput}...`);
    const res = await renameFileApi(selectedFile.name, renameInput.trim());
    if (res?.success) {
      showToast(`Renamed ${selectedFile.name} to ${renameInput.trim()}`);
    } else {
      showToast(`Error: ${res?.message || 'Rename failed'}`);
    }
    setActiveModal(null);
    setSelectedFile(null);
    setRenameInput('');
    loadFiles();
  };

  // Submit Create File
  const handleCreateFileSubmit = async (e) => {
    e.preventDefault();
    const filename = newFileName.trim();
    if (!filename) {
      showToast('Please enter a valid file name.');
      return;
    }

    setSubmitting(true);
    showToast(`Creating ${filename} in C:\\SyncFolder...`);
    const res = await createFileApi(filename, newFileContent);
    setSubmitting(false);

    if (res?.success) {
      showToast(`Created ${filename} successfully. Synced to Kali!`);
      setActiveModal(null);
      setNewFileName('');
      setNewFileContent('');
      loadFiles();
    } else {
      showToast(`Error: ${res?.message || 'File creation failed'}`);
    }
  };

  // Pick file icon
  const getFileIcon = (filename) => {
    const ext = filename?.split('.').pop()?.toLowerCase();
    if (ext === 'pdf') return <FileText size={18} style={{ color: '#ef4444' }} />;
    if (['xlsx', 'csv', 'xls'].includes(ext)) return <FileSpreadsheet size={18} style={{ color: '#22c55e' }} />;
    if (['png', 'jpg', 'jpeg', 'svg', 'gif'].includes(ext)) return <ImageIcon size={18} style={{ color: '#38bdf8' }} />;
    if (['py', 'js', 'json', 'sql', 'sh'].includes(ext)) return <FileCode size={18} style={{ color: '#a855f7' }} />;
    return <FileText size={18} style={{ color: '#00d2ff' }} />;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      
      {/* Page Title & Path Tag */}
      <div className="page-title-banner">
        <h1 className="page-main-heading">
          Synchronized <span className="highlight-cyan">Files</span>
        </h1>
        <p className="page-subtitle">
          Manage synchronized files between Windows and Kali Linux
        </p>
        <div className="path-pill">
          <FolderOpen size={13} />
          <span>C:\SyncFolder ↔ ~/SyncFolder</span>
        </div>
      </div>

      {/* Action Toolbar */}
      <div className="cyber-card" style={{ padding: '1rem 1.5rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', flex: 1, minWidth: '280px' }}>
            {/* Search Input */}
            <div style={{ position: 'relative', width: '100%', maxWidth: '360px' }}>
              <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input 
                type="text"
                className="input-search"
                placeholder="Search real files in C:\SyncFolder..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Refresh */}
            <button className="btn btn-secondary btn-sm" onClick={loadFiles}>
              <RefreshCw size={14} className={loading ? 'spin' : ''} /> Refresh
            </button>
          </div>

          {/* Create File Primary Button */}
          <button className="btn btn-primary" onClick={() => setActiveModal('add')}>
            <Plus size={16} /> Create File
          </button>

        </div>
      </div>

      {/* Files Table Card */}
      <div className="cyber-card">
        <div className="cyber-card-header">
          <div className="cyber-card-title">
            <FolderOpen size={18} style={{ color: 'var(--cyan)' }} />
            <span>Synchronized Files ({filteredFiles.length})</span>
          </div>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
            Real SyncFolder Explorer
          </span>
        </div>

        <div className="table-container">
          <table className="cyber-table">
            <thead>
              <tr>
                <th>File Name</th>
                <th>Size</th>
                <th>Source Node</th>
                <th>Last Modified</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredFiles.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '3rem 1.5rem', color: 'var(--text-muted)' }}>
                    {loading ? 'Scanning SyncFolder...' : 'No files found in C:\\SyncFolder. Click "+ Create File" to add one!'}
                  </td>
                </tr>
              ) : (
                filteredFiles.map((file) => (
                  <tr key={file.id || file.name}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                        {getFileIcon(file.name)}
                        <span style={{ fontWeight: '600', fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' }}>
                          {file.name}
                        </span>
                      </div>
                    </td>
                    <td className="mono" style={{ color: 'var(--text-secondary)' }}>
                      {file.size}
                    </td>
                    <td>
                      <span className="badge badge-modify">
                        {file.source || 'Windows'}
                      </span>
                    </td>
                    <td className="mono" style={{ color: 'var(--text-muted)' }}>
                      {file.lastModified}
                    </td>
                    <td>
                      <span className="badge badge-online">
                        <CheckCircle size={11} /> {file.status || 'Synced'}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'flex-end' }}>
                        <button 
                          className="btn btn-secondary btn-sm" 
                          title="Trigger transfer.py send_file to Kali"
                          onClick={() => handleSendFile(file)}
                        >
                          <Send size={13} style={{ color: 'var(--cyan)' }} /> Send
                        </button>
                        <button 
                          className="btn btn-secondary btn-sm" 
                          title="Rename File"
                          onClick={() => openRenameModal(file)}
                        >
                          <Edit3 size={13} style={{ color: 'var(--cyan-bright)' }} /> Rename
                        </button>
                        <button 
                          className="btn btn-danger btn-sm" 
                          title="Delete File"
                          onClick={() => handleDeleteFile(file.name)}
                        >
                          <Trash2 size={13} /> Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* =====================================================
          RENAME FILE MODAL
         ===================================================== */}
      {activeModal === 'rename' && (
        <div className="modal-overlay">
          <div className="modal-dialog">
            <div className="cyber-card-header">
              <div className="cyber-card-title">
                <Edit3 size={18} style={{ color: 'var(--cyan)' }} />
                <span>Rename File via transfer.py</span>
              </div>
              <button className="btn btn-secondary btn-sm" onClick={() => setActiveModal(null)}>
                <X size={14} />
              </button>
            </div>
            
            <form onSubmit={handleRenameSubmit} style={{ padding: '1.5rem' }}>
              <div style={{ marginBottom: '1.25rem' }}>
                <label className="form-label">Current File Name:</label>
                <div style={{ 
                  fontFamily: 'var(--font-mono)', 
                  padding: '0.65rem 1rem', 
                  background: 'rgba(0,0,0,0.3)', 
                  borderRadius: 'var(--radius-md)', 
                  border: '1px solid var(--border-dim)',
                  marginBottom: '1rem',
                  color: '#fff'
                }}>
                  {selectedFile?.name}
                </div>

                <label className="form-label">New File Name:</label>
                <input 
                  type="text" 
                  className="form-input"
                  style={{ fontFamily: 'var(--font-mono)' }}
                  value={renameInput}
                  onChange={(e) => setRenameInput(e.target.value)}
                  autoFocus
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setActiveModal(null)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Execute Rename
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =====================================================
          CREATE FILE MODAL
         ===================================================== */}
      {activeModal === 'add' && (
        <div className="modal-overlay">
          <div className="modal-dialog" style={{ maxWidth: '560px' }}>
            <div className="cyber-card-header">
              <div className="cyber-card-title">
                <Plus size={18} style={{ color: 'var(--cyan)' }} />
                <span>Create New File</span>
              </div>
              <button className="btn btn-secondary btn-sm" onClick={() => setActiveModal(null)}>
                <X size={14} />
              </button>
            </div>
            
            <form onSubmit={handleCreateFileSubmit} style={{ padding: '1.5rem' }}>
              <div style={{ marginBottom: '1.25rem' }}>
                <label className="form-label">File Name:</label>
                <input 
                  type="text" 
                  className="form-input"
                  style={{ fontFamily: 'var(--font-mono)' }}
                  placeholder="e.g. security_audit.txt"
                  value={newFileName}
                  onChange={(e) => setNewFileName(e.target.value)}
                  autoFocus
                />
              </div>

              <div style={{ marginBottom: '1.25rem' }}>
                <label className="form-label">File Content:</label>
                <textarea 
                  className="form-input"
                  style={{ minHeight: '130px', fontFamily: 'var(--font-mono)', resize: 'vertical' }}
                  placeholder="Enter file text content here..."
                  value={newFileContent}
                  onChange={(e) => setNewFileContent(e.target.value)}
                />
              </div>

              <div style={{ 
                fontSize: '0.75rem', 
                color: 'var(--text-muted)', 
                background: 'rgba(0, 210, 255, 0.05)', 
                padding: '0.65rem 0.85rem', 
                borderRadius: 'var(--radius-sm)',
                border: '1px solid rgba(0, 210, 255, 0.15)',
                marginBottom: '1.5rem'
              }}>
                File will be written to <strong style={{ color: 'var(--cyan)' }}>C:\SyncFolder</strong> and automatically synchronized to Kali Linux by Watchdog.
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setActiveModal(null)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={submitting}>
                  {submitting ? 'Creating...' : 'Create File'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}