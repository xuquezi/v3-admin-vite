import request from "@/utils/service"
import { AxiosPromise } from "axios"
import { ClientQuery, ClientData, ClientForm } from "./types"
import { ADMIN } from "@/api/servicePort"

export function getClientPage(queryParams: ClientQuery): AxiosPromise<PageResult<ClientData[]>> {
  return request({
    url: ADMIN + "/client/queryClientByPage",
    method: "get",
    params: queryParams
  })
}

export function addClient(data: ClientForm) {
  return request({
    url: ADMIN + "/client/addClient",
    method: "post",
    data: data
  })
}

export function updateClient(data: ClientForm) {
  return request({
    url: ADMIN + "/client/updateClient",
    method: "put",
    data: data
  })
}

export function delClientById(clientId: string) {
  return request({
    url: ADMIN + "/client/delClientById",
    method: "delete",
    params: { clientId }
  })
}
