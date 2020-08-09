import {STAT, PROC_NAME, STAT_NAME}  from 'constant/data'


export function formatStat(state) {
  return STAT[state]
}


export function getOperFilter() {
  return [ {text: 's1', value:'s1'}, 
           {text: 's2', value:'s2'},
           {text: 's3', value:'s3'}, 
           {text: 's4', value:'s4'},
           {text: 's5', value:'s5'}, 
           {text: 's6', value:'s6'},
           {text: 's7', value:'s7'}, 
           {text: 's8', value:'s8'},
           {text: 's9', value:'s9'}, 
           {text: 's10', value:'s10'},
         ]
}

export function getStatusFilter() {
  return [ {text: '已提交', value:'已提交'}, {text: '暂存', value:'暂存'} ]
}

export function getMethodFilter() {
  return [ {text: '个人推荐', value:'个人推荐'},{text: '机构推荐', value:'机构推荐'} ]
}

export function getStatFilter() {
  let ret = []
  STAT.forEach((item,index)=>{
    ret.push({
      text:  item[0],
      value: item[0],
    })
  })
  return ret
}