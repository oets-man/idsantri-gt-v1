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

  async #performFetch(endPoint, options = {}) {
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

    let responseJson = null
    if (responseText) {
      try {
        responseJson = JSON.parse(responseText)
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
      throw responseJson
    }
    return responseJson
  }

  async register(gt_id, otp, email) {
    const response = await this.#performFetch('register', {
      method: 'POST',
      body: JSON.stringify({ gt_id, otp, email }),
    })
    return response
  }

  async requestOtp(email) {
    const response = await this.#performFetch('request-otp', {
      method: 'POST',
      body: JSON.stringify({ email }),
    })
    return response
  }

  async verifyOtp(email, otp) {
    const response = await this.#performFetch('verify-otp', {
      method: 'POST',
      body: JSON.stringify({ email, otp }),
    })
    if (!response.error && response.data?.token) {
      this.#saveToken(response.data.token)
    }
    return response
  }

  async getProfile() {
    const response = await this.#performFetch('me', {
      method: 'GET',
    })
    return response
  }

  async updateProfile(nomor_telepon) {
    const response = await this.#performFetch('me', {
      method: 'POST',
      body: JSON.stringify({ nomor_telepon }),
    })
    return response
  }
}

export default new Api()
