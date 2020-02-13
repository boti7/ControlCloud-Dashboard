import { Context, Plugin } from '@nuxt/types'
import * as CryptoJS from 'crypto-js'

const APIdomain = 'https://api.controlcloud.io/v2.1'
const clientId = 'ccdashboard'

interface AuthSession {
  sessionId: string
  secretKey: string
  socketToken: string
  nonce: number
}

interface Profile {
  email: string
  userId: string
}

class Auth {
  private context: Context
  private userSession?: AuthSession
  private userProfile?: Profile

  constructor(context: Context) {
    this.context = context

    const sessionId = localStorage.getItem('sessionId')
    const secretKey = localStorage.getItem('secretKey')
    const socketToken = localStorage.getItem('socketToken')
    const nonce = localStorage.getItem('apiNonce')
    const userProfile = localStorage.getItem('userProfile')

    if(sessionId && secretKey && socketToken && nonce && userProfile) {
      this.userSession = { sessionId, secretKey, socketToken, nonce: parseInt(nonce) }
      this.userProfile = JSON.parse(userProfile)
    }
  }

  private get session() {
    return this.userSession
  }

  private set session(value) {
    this.userSession = value

    localStorage.setItem('sessionId', <string>this.userSession?.sessionId)
    localStorage.setItem('secretKey', <string>this.userSession?.secretKey)
    localStorage.setItem('socketToken', <string>this.userSession?.socketToken)
    localStorage.setItem('apiNonce', <string>this.userSession?.nonce.toString())
  }

  get isLoggedIn() {
    return this.session !== undefined
  }

  get socketCreds() {
    return { sessionId: this.session?.sessionId, socketToken: this.session?.socketToken}
  }

  get profile() {
    return this.userProfile
  }

  async login(email: string, password: string) {
    this.session = await this.context.$axios.$post<AuthSession>(APIdomain + '/user/authenticate', {
      email: email,
      password: password,
      clientId: clientId,
      keepLoggedIn: true
    })
    this.userProfile = await this.context.$axios.$get<Profile>(this.signUrl('/user/profile'))
    localStorage.setItem('userProfile', JSON.stringify(this.userProfile))
    window.location.reload()
  }

  async logout() {
    await this.context.$axios.$post(this.signUrl('/user/logout'))
    localStorage.clear()
    window.location.reload()
  }

  signUrl(url: string, query: {[param: string]: string | undefined} = {}, data?: {[param: string]: string}) {
    if(!this.isLoggedIn) {
      return APIdomain + url
    }

    let nonce = parseInt(localStorage.getItem('apiNonce') || '')
    nonce++
    localStorage.setItem('apiNonce', nonce.toString())

    query['X-CC-SessionID'] = this.session?.sessionId
    query['X-CC-Timestamp'] = Math.floor(Date.now() / 1000).toString()
    query['X-CC-Nonce'] = nonce.toString()

    const queryString = Auth.getQueryString(query)
    const bodyString = Auth.getBodyString(data)

    const stringToSign = url + '?' + queryString + '\n' + bodyString
    const signature = Auth.createHmac(stringToSign, this.session?.secretKey || '')

    return APIdomain + url + '?' + queryString + '&X-CC-Signature=' + signature
  }

  private static getQueryString(query: {[param: string]: string | undefined}) {
    let queryArr = []

    for(const param in query) {
      if(param === 'X-CC-Signature')
        continue
      queryArr.push(param + '=' + query[param])
    }

    queryArr.sort()

    return queryArr.join('&')
  }

  private static getBodyString(body?: Object) {
    return body && body.constructor === Object && Object.keys(body).length !== 0 ? JSON.stringify(body) : ''
  }

  private static createHmac(str: string, key: string) {
    return CryptoJS.HmacSHA256(str, key).toString(CryptoJS.enc.Hex)
  }
}

declare module 'vue/types/vue' {
  interface Vue {
    $auth: Auth
  }
}

declare module '@nuxt/types' {
  interface NuxtAppOptions {
    $auth: Auth
  }
}

declare module 'vuex/types/index' {
  interface Store<S> {
    $auth: Auth
  }
}

const authPlugin: Plugin = (context, inject) => {
  inject('auth', new Auth(context))
}

export default authPlugin
