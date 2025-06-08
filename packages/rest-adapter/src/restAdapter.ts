import axios, {AxiosInstance} from 'axios'
import {AuthnAdapter} from '@authn/core'

interface RestAdapterConfig {
  baseURL: string
  endpoints: {
    sendOTP: string
    verifyOTP: string
  }
}

export class RestAdapter implements AuthnAdapter {
  private client: AxiosInstance
  private endpoints: RestAdapterConfig['endpoints']

  constructor(config: RestAdapterConfig) {
    this.client = axios.create({baseURL: config.baseURL})
    this.endpoints = config.endpoints
  }

  async sendOTP({identifier}: {identifier: string}): Promise<void> {
    await this.client.post(this.endpoints.sendOTP, {identifier})
  }

  async verifyOTP({
    identifier,
    code,
  }: {
    identifier: string
    code: string
  }): Promise<{token: string; expiresIn: number}> {
    const response = await this.client.post(this.endpoints.verifyOTP, {
      identifier,
      code,
    })
    return {token: response.data.token, expiresIn: response.data.expiresIn}
  }
}
