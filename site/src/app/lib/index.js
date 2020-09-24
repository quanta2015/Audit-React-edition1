import React from 'react'
import { inject } from 'mobx-react'
import { Input, Form, Button, InputGroup, Radio, Switch, Icon,Tag, Table, Spin, Divider, Result, Modal, message, Skeleton } from "antd";
import EXIF from '@util/small-exif'
import './index.less'
import {API_SERVER} from 'constant/apis'
import {STAT, STATUS} from 'constant/data'


@inject('userStore')
class Lib extends React.Component {
	constructor(props) {
		super(props)

    this.state = {
      loading: false,
      libno: 'HZNU ZT0000022',
    }
	}


  doUpload= async (e) => {
    let type = this.state.libno
    if (e.target.files.length > 0) {
      let file = e.target.files[0]
      let formData = new FormData()
      formData.append('file', file, type)
      this.setState({ loading: true })
      let r = await this.props.userStore.uploadlib(formData)
      if (r.code === 200) {
        
        const w=window.open('about:blank');
        w.location.href=`${API_SERVER}/${r.data.path}`
        message.success('文件上传成功！')
      }else{
        message.success('文件上传失败！')
      }
    }
  }

  doUpdate = (e)=>{
    this.setState({ libno: e.target.value })
  }


	render() {

    let { list,show,record,showImg } = this.state


		return (
      <div className="g-lib">
        <div className="m-lib">
          <div className="m-tl">图书馆入库系统</div>
          <div className="m-main">
            <div className="m-row">
              <span>入库单编号</span>
              <Input placeholder=" 入库单编号" className="u-num" 
                    onChange={this.doUpdate.bind(this)}
                    value = {this.state.libno}
                  />
            </div>
            <div className="m-row">
              <span>财务单据</span>
              <input className="u-upload" type="file" accept=".pdf" onChange={this.doUpload.bind(this)}/>
                
            </div>

            

          </div>
        </div>
      

      </div>
		)
	}
}

export default Lib
