import {STAT, PROC_NAME, STAT_NAME}  from 'constant/data'


export function formatStat(state) {
  return STAT[state]
}


// export function formatProcName(index) {
//   return PROC_NAME[index-1]
// }

// export function formatProcStat(index) {
//   return STAT_NAME[index]
// }

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