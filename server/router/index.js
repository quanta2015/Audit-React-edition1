
var fs = require('fs')
var url = require('url')
var path = require('path')
var XLSX = require('xlsx')
var axios = require('axios')
var dayjs = require('dayjs')
var multer = require('multer')
var moment = require('moment')
var express = require('express')
var jwt = require('jsonwebtoken')
var formidable = require('formidable')
var { clone } = require('../utils/clone')
var auth = require('../utils/auth')


var router = express.Router()
var db = require("../db/db")
var __projdir = path.resolve(__dirname,'../')

var genppt = require('../lib/generate')
var marked = require('marked')
marked.setOptions({
    highlight: function (code) {
        return require('highlight.js').highlightAuto(code).value
    }
})

const SECRET_KEY = 'MOOC_SECRET'


function callProc(sql, params, res, cb) {
  db.procedureSQL(sql,JSON.stringify(params),(err,ret)=>{
    if (err) {
      res.status(500).json({ code: -1, msg: '提交请求失败，请联系管理员！', data: null})
    }else{
      cb(ret)
    }
  })
}

function callSQLProc(sql, params, res) {
  return new Promise (resolve => {
    db.procedureSQL(sql,JSON.stringify(params),(err,ret)=>{
      if (err) {
        res.status(500).json({ code: -1, msg: '提交请求失败，请联系管理员！', data: null})
      }else{
        resolve(ret)
      }
    })
  })
}

var callP = async (sql, params, res) => {
  return  await callSQLProc(sql, params, res)
}

var callLog = async (act, dat, user, res) => {
  if (user !== null) {
    let params = {
      uid: user.id,
      act: act,
      dat: dat,
    }
    let sql = `CALL PROC_LOG(?)`
    await callSQLProc(sql, params, res)
  }
}

var decodeUser =async (req)=>{
  let token = req.headers.authorization
  let ret 
  if (token !== undefined) {
    token = token.split(' ')[1]
    ret = await jwt.verify(token, 'MOOC_SECRET')
  }else{
    ret = null
  }
  return  ret
}


//登录
router.get('/list',async (req, res, next) =>{

  let sql  = `CALL PROC_PROJ_LIST_S(?)`
  let params = { mark: 1 }
  let r = await callP(sql, params, res)
  res.status(200).json({ code: 200, data: r })
})


//登录
router.post('/login',async (req, res, next) =>{
  let sql = `CALL PROC_USER_LOGIN(?)`
  let params = req.body

  callProc(sql, params, res, (ret) => {
    if (ret.length > 0) {
      let token = jwt.sign(clone(ret[0]), SECRET_KEY)
      res.status(200).json({code: 200, data: ret[0], token: token, msg: '登录成功'})
    } else {
      res.status(200).json({code: 301, data: null, msg: '用户名或密码错误'})
    }
  })
})

router.post('/getProjectList_s',async (req, res, next) =>{
  let user = await decodeUser(req)
  let sql  = `CALL PROC_PROJ_LIST_S(?)`
  let params = { mark: user.mark }
  let r = await callP(sql, params, res)
  res.status(200).json({ code: 200, data: r })
})


router.post('/getProjectList_t',async (req, res, next) =>{
  let sql  = `CALL PROC_PROJ_LIST_T(?)`
  let params = { }
  let r = await callP(sql, params, res)
  res.status(200).json({ code: 200, data: r })
})


router.post('/saveProject',async (req, res, next) =>{
  let user = await decodeUser(req)
  let params = req.body
  let sql  = `CALL PROC_PROJ_SAVE(?)`

  for(let key in params){
    if (params[key] === null) params[key] = ''
  }

  let r = await callP(sql, params, res)
  res.status(200).json({ code: 200, data: r[0] })
})

router.post('/subProject1',async (req, res, next) =>{
  let user = await decodeUser(req)
  let params = req.body
  params.mark = user.mark
  let sql  = `CALL PROC_PROJ_SUB1(?)`
  let r = await callP(sql, params, res)
  res.status(200).json({ code: 200, data:r })
})

router.post('/subProject2',async (req, res, next) =>{
  let user = await decodeUser(req)
  let params = req.body
  params.mark = user.mark
  let sql  = `CALL PROC_PROJ_SUB2(?)`
  let r = await callP(sql, params, res)
  res.status(200).json({ code: 200, data:r })
})

router.post('/subProject3',async (req, res, next) =>{
  let user = await decodeUser(req)
  let params = req.body
  params.mark = user.mark
  let sql  = `CALL PROC_PROJ_SUB3(?)`
  let r = await callP(sql, params, res)
  res.status(200).json({ code: 200, data:r })
})

router.post('/subProject4',async (req, res, next) =>{
  let user = await decodeUser(req)
  let params = req.body
  params.mark = user.mark
  let sql  = `CALL PROC_PROJ_SUB4(?)`
  let r = await callP(sql, params, res)
  res.status(200).json({ code: 200, data:r })
})

router.post('/subProject5',async (req, res, next) =>{
  let user = await decodeUser(req)
  let params = req.body
  params.ret = (params.ret)?1:0
  let sql  = `CALL PROC_PROJ_SUB5(?)`
  let r = await callP(sql, params, res)
  res.status(200).json({ code: 200, data:r })
})

router.post('/setProjStatus',async (req, res, next) =>{
  let params = req.body
  let sql  = `CALL PROC_PROJ_STATUS(?)`
  let r = await callP(sql, params, res)
  res.status(200).json({ code: 200, data:r })
})


//上传文件
router.post('/upload', function (req, res) {
  const form = new formidable.IncomingForm()
  form.parse(req)

  form.on('fileBegin', function (name, file) {
    let type = file.name
    file.path = `upload/${type}/${type}_${dayjs().format('YYYYMMDDhhmmss')}.jpeg`
  })

  form.on('file', (name, file) => {
    res.status(200).json({
      code: 200,
      msg: '上传照片成功',
      data: {path: file.path}
    })
  })
})







module.exports = router;