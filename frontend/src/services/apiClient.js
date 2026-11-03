const API_BASE_URL = 'http://localhost:8000/api';


// =====================================================
// CONFIGURATION
// =====================================================

export async function fetchConfig() {
  try {
    const res = await fetch(`${API_BASE_URL}/config`);

    if (!res.ok) {
      throw new Error('API request failed');
    }

    return await res.json();

  } catch (err) {
    console.warn(
      '[API Client] fetchConfig fallback:',
      err.message
    );

    return null;
  }
}


export async function updateConfig(newConfig) {
  try {
    const res = await fetch(`${API_BASE_URL}/config`, {
      method: 'POST',

      headers: {
        'Content-Type': 'application/json'
      },

      body: JSON.stringify(newConfig)
    });

    return await res.json();

  } catch (err) {

    return {
      success: false,

      message:
        `Failed to connect to API server: ${err.message}`
    };
  }
}


export async function testConnection(
  remoteIp,
  remotePort
) {
  try {

    const res = await fetch(
      `${API_BASE_URL}/config/test`,
      {
        method: 'POST',

        headers: {
          'Content-Type': 'application/json'
        },

        body: JSON.stringify({
          remote_ip: remoteIp,
          remote_port: remotePort
        })
      }
    );

    return await res.json();

  } catch (err) {

    return {
      success: false,

      message:
        `API test request error: ${err.message}`
    };
  }
}


// =====================================================
// FILES
// =====================================================

export async function fetchFiles() {
  try {

    const res = await fetch(
      `${API_BASE_URL}/files`
    );

    if (!res.ok) {
      throw new Error(
        'Failed to fetch files'
      );
    }

    return await res.json();

  } catch (err) {

    console.warn(
      '[API Client] fetchFiles fallback:',
      err.message
    );

    return null;
  }
}


// =====================================================
// LOGS
// =====================================================

export async function fetchLogs() {
  try {

    const res = await fetch(
      `${API_BASE_URL}/logs`
    );

    if (!res.ok) {
      throw new Error(
        'Failed to fetch logs'
      );
    }

    return await res.json();

  } catch (err) {

    console.warn(
      '[API Client] fetchLogs fallback:',
      err.message
    );

    return null;
  }
}


// =====================================================
// TRANSFERS
// =====================================================

export async function fetchTransfers() {
  try {

    const res = await fetch(
      `${API_BASE_URL}/transfers`
    );

    if (!res.ok) {
      throw new Error(
        'Failed to fetch transfers'
      );
    }

    return await res.json();

  } catch (err) {

    console.warn(
      '[API Client] fetchTransfers fallback:',
      err.message
    );

    return null;
  }
}


// =====================================================
// SYSTEM STATUS
// =====================================================

export async function fetchSystemStatus() {
  try {

    const res = await fetch(
      `${API_BASE_URL}/status`
    );

    if (!res.ok) {
      throw new Error(
        'Failed to fetch system status'
      );
    }

    return await res.json();

  } catch (err) {

    console.warn(
      '[API Client] fetchSystemStatus fallback:',
      err.message
    );

    return null;
  }
}


// =====================================================
// SEND FILE
// =====================================================

export async function sendFileApi(filename) {
  try {

    const res = await fetch(
      `${API_BASE_URL}/files/send`,
      {
        method: 'POST',

        headers: {
          'Content-Type': 'application/json'
        },

        body: JSON.stringify({
          filename
        })
      }
    );

    return await res.json();

  } catch (err) {

    return {
      success: false,

      message: err.message
    };
  }
}


// =====================================================
// CREATE FILE
// =====================================================

export async function createFileApi(
  filename,
  content
) {
  try {

    const res = await fetch(
      `${API_BASE_URL}/files/create`,
      {
        method: 'POST',

        headers: {
          'Content-Type': 'application/json'
        },

        body: JSON.stringify({
          filename,
          content
        })
      }
    );

    return await res.json();

  } catch (err) {

    return {
      success: false,

      message: err.message
    };
  }
}


// =====================================================
// DELETE FILE
// =====================================================

export async function deleteFileApi(filename) {
  try {

    const res = await fetch(
      `${API_BASE_URL}/files/delete`,
      {
        method: 'DELETE',

        headers: {
          'Content-Type': 'application/json'
        },

        body: JSON.stringify({
          filename
        })
      }
    );

    return await res.json();

  } catch (err) {

    return {
      success: false,

      message: err.message
    };
  }
}


// =====================================================
// RENAME FILE
// =====================================================

export async function renameFileApi(
  oldFilename,
  newFilename
) {
  try {

    const res = await fetch(
      `${API_BASE_URL}/files/rename`,
      {
        method: 'POST',

        headers: {
          'Content-Type': 'application/json'
        },

        body: JSON.stringify({
          old_filename: oldFilename,
          new_filename: newFilename
        })
      }
    );

    return await res.json();

  } catch (err) {

    return {
      success: false,

      message: err.message
    };
  }
}