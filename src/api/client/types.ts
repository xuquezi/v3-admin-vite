export interface ClientQuery extends PageQuery {
  clientName?: string
}

export interface ClientData {
  clientId: string
  clientName: string
  clientKey: string
  clientSecret: string
}

export interface ClientForm {
  clientId: string
  clientName: string
  clientKey: string
  clientSecret: string
}
