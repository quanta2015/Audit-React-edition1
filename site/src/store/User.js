import { observable, action, runInAction } from 'mobx'
import BaseActions from 'component/BaseActions'
import axios from 'axios'
import { message } from 'antd'
import * as urls from '@constant/urls'
import jwt from 'util/token.js'

class User extends BaseActions {
  @observable
  currUser = undefined

  @action
  async login(params) {
    const r = await this.post(urls.API_USER_LOGIN, params)
    if (r.code=== 200) {
      runInAction(() => {
        jwt.saveToken(r.token)
        this.currUser = r.data
      })
    }
    return r
  }

  @action
  logout() {
    jwt.removeToken()
    this.currUser = null
  }

  @action
  async getProjListS(params) {
    return await this.post(urls.API_PROJ_LIST_S,params)
  }

  @action
  async getProjListT(params) {
    return await this.post(urls.API_PROJ_LIST_T,params)
  }

  @action
  async upload(params) {
    return await this.post(urls.API_UPLOAD, params)
  }

  @action
  async saveProject(params) {
    return await this.post(urls.API_PROJ_SAVE,params)
  }

  @action
  async subProject1(params) {
    return await this.post(urls.API_PROJ_SUB1,params)
  }

  @action
  async subProject2(params) {
    return await this.post(urls.API_PROJ_SUB2,params)
  }

  @action
  async subProject3(params) {
    return await this.post(urls.API_PROJ_SUB3,params)
  }

  @action
  async subProject4(params) {
    return await this.post(urls.API_PROJ_SUB4,params)
  }

  @action
  async subProject5(params) {
    return await this.post(urls.API_PROJ_SUB5,params)
  }

  @action
  async setProjStatus(params) {
    return await this.post(urls.API_PROJ_STATUS,params)
  }

  @action
  async setAuditRet(params) {
    return await this.post(urls.API_AUDIT_RET,params)
  }


  

  




}

export default new User()