import { observable, action, runInAction } from 'mobx'
import BaseActions from 'component/BaseActions'
import axios from 'axios'
import { message } from 'antd'
import * as urls from '@constant/urls'

class Main extends BaseActions {

  moocList = []
  cardschd = null

  @action
  async getNewsList() {
    return await this.get(urls.API_NEWS_LIST)
  }

  @action
  async getMoocList() {
    const r = await this.get(urls.API_MOOC_LIST)
    this.moocList = r
    return r
  }

  @action
  async getCount() {
    return await this.post(urls.API_COUNT)
  }

  @action
  async getMoocDetail(params) {
    return await this.post(urls.API_MOOC_DETAIL, params)
  }

  @action
  async checkUser(params) {
    return await this.post(urls.API_USER_CHECK, params)
  }

  @action
  async upload(params) {
    return await this.post(urls.API_UPLOAD, params)
  }


  @action
  async userReg(params) {
    return await this.post(urls.API_USER_REG, params)
  }

  

  @action
  async getCardSchdule() {
    const r =  await this.post(urls.API_CARD_SCHD, null)
    this.cardschd = r.cardschd
    return r
  }

  @action
  async getCardData(params) {
    return await this.post(urls.API_CARD_DATA, params)
  }

  @action
  async getLocation() {
    return new Promise( (resolve, reject) => {
      var fd = {data:{lat:0, lng: 0, loc: '未知地址'}}
      // var opt = { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 };

      var opt = { timeout: 5000 };

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (pos)=>{
          let lat = pos.coords.latitude
          let lng = pos.coords.longitude
          let params = {lat: lat, lng: lng}
          let r = await this.post(urls.API_CARD_LOC, params)
          resolve(r)
        }, async (err)=>{
          reject(fd)
        },opt)
      } else {
        reject(fd)
      }
    })
  }

  @action
  async doCard(params) {
    return await this.post(urls.API_CARD_CLOCK, params)
  }


  @action
  async faceCheck(params) {
    return await this.post(urls.API_CARD_FACE_CHECK, params)
  }

  @action
  async doRest(params) {
    return await this.post(urls.API_CARD_REST, params)
  }

  @action
  async getCalendar(params) {
    return await this.post(urls.API_CALENDAR, params)
  }

  @action
  async doGroupDel(params) {
    return await this.post(urls.API_GROUP_DEL, params)
  }

  @action
  async doGroupAdd(params) {
    return await this.post(urls.API_GROUP_ADD, params)
  }

  @action
  async getMoocQuestion(params) {
    return await this.post(urls.API_MOOC_QUES_LOAD, params)
  }

  @action
  async saveMoocQuesGrade(params) {
    return await this.post(urls.API_MOOC_QUES_SAVE, params)
  }

  
  

}

 



export default new Main()
