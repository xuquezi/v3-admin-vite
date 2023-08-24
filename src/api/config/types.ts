export interface ConfigData {
  configId: string
  configName: string
  configKey: string
  configValue: string
}

export interface ConfigQuery extends PageQuery {
  configName?: string
}

export interface ConfigForm {
  configId: string

  configName: string

  configKey: string

  configValue: string
}
