import axios from 'axios'

export default function getPosition () {
    return new Promise( (resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (pos)=>{
          let lat = pos.coords.latitude
          let lng = pos.coords.longitude
          let host ='https://api.map.baidu.com/geocoder/v2'
          let key = 'AIzaSyBSWEVNt2h8CrDWufKNy32k-t14tnW9D9I'
          let url = `${host}/?ak=${key}&location=${lat},${lng}&callback=renderReverse`
          const r = await axios.get(url)
          if (r && r.status === 200) {

            console.log(r.data)
            resolve({
              lat,
              lng,
              loc: r.data.results[0].formatted_address
            })
          }else{
            reject('获取地址失败')
          }
        })
      } else {
        // console.log('获取地址失败')
        reject('获取地址失败')
      }
    })
}

