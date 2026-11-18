import config from '../config'
class Api {
  #BASE_URL = config.BASE_API + config.END_API

  get BASE_URL() {
    return this.#BASE_URL
  }

  #saveToken(token) {
    localStorage.setItem('token', token)
  }

  #getToken() {
    return localStorage.getItem('token')
  }

  #removeToken() {
    localStorage.removeItem('token')
  }

  logout() {
    this.#removeToken()
  }

  async performFetch(endPoint, options = {}) {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
    const token = this.#getToken()

    const finalOptions = {
      ...options,
      headers: {
        ...options.headers,
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        'X-Timezone': timezone,
        'Content-Type': 'application/json',
      },
    }
    let response
    let responseText
    try {
      response = await fetch(this.BASE_URL + '/' + endPoint, finalOptions)
      responseText = await response.text()
    } catch (error) {
      return {
        error: true,
        message:
          error.name === 'AbortError' ? 'Permintaan dibatalkan' : 'Gagal terhubung ke server',
        type: 'error',
        data: null,
      }
    }

    let payload = null
    if (responseText) {
      try {
        payload = JSON.parse(responseText)
      } catch {
        return {
          error: true,
          message: response.ok
            ? 'Respons server bukan JSON yang valid'
            : `Permintaan gagal (HTTP ${response.status})`,
          type: 'error',
          data: responseText,
        }
      }
    }

    if (!response.ok) {
      return {
        error: true,
        message:
          payload && typeof payload === 'object'
            ? payload.message || `Permintaan gagal (HTTP ${response.status})`
            : `Permintaan gagal (HTTP ${response.status})`,
        type: 'error',
        data: payload && typeof payload === 'object' && 'data' in payload ? payload.data : payload,
      }
    }

    if (payload && typeof payload === 'object' && typeof payload.error === 'boolean') {
      return {
        error: payload.error,
        message: payload.message || (payload.error ? 'Permintaan gagal' : 'Berhasil'),
        type: payload.error ? 'error' : payload.type || 'success',
        data: 'data' in payload ? payload.data : payload,
      }
    }

    return {
      error: false,
      message: 'Berhasil',
      type: 'success',
      data: payload,
    }
  }

  async register(gt_id, otp, email) {
    const response = await this.performFetch('register', {
      method: 'POST',
      body: JSON.stringify({ gt_id, otp, email }),
    })
    return response
  }

  async requestOtp(email) {
    const response = await this.performFetch('register', {
      method: 'POST',
      body: JSON.stringify({ email }),
    })
    return response
  }

  async verifyOtp(email, otp) {
    const response = await this.performFetch('register', {
      method: 'POST',
      body: JSON.stringify({ email, otp }),
    })
    if (!response.error && response.data?.token) {
      this.#saveToken(response.data.token)
    }
    return response
  }

  async getProfile() {
    const response = await this.performFetch('me', {
      method: 'GET',
    })
    return response
  }

  async updateProfile(nomor_telepon) {
    const response = await this.performFetch('me', {
      method: 'POST',
      body: JSON.stringify({ nomor_telepon }),
    })
    return response
  }
}

export default new Api()
