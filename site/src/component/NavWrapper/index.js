import React from 'react'
import { Link } from 'react-router-dom'
import { inject } from 'mobx-react'
import {withRouter} from "react-router-dom";
import { MENU_MAIN } from 'constant/data'
import { Tag} from "antd";

import './index.less'
import home from 'icon/icon_home.svg';
import mooc from 'icon/icon_mooc.svg';
import proj from 'icon/icon_proj.svg';
import about from 'icon/icon_about.svg';

var _timeHandle


@inject('userStore')
class NavWrapper extends React.Component {
	constructor(props) {
		super(props)
    this.state = {
      cur: 0,
      role: null,
      ret: {},
    }
	}

  doTimer = ()=>{
    _timeHandle = setTimeout( async () => {
      let r = await this.props.userStore.setAuditRet()
      this.setState({ ret: r.data })
      this.doTimer()
    }, 60000*5)
  }

  async componentDidMount() { 
    let r = await this.props.userStore.setAuditRet()
    this.setState({ ret: r.data })
    this.doTimer()
  }

  componentWillUnmount() {
    clearTimeout(_timeHandle)
  }

  doMenu = (path)=>{
    this.props.history.push(path)
  }

  logout = ()=>{
    this.props.userStore.logout()
    this.props.history.push('/')
  }

	render() {
    let {ret} = this.state
    let path
    let r = (this.props.userStore.currUser)?parseInt(this.props.userStore.currUser.role):-1

    switch(r) {
      case 0: path = '/listDataS';break;
      case 1: path = '/listDataT';break;
      case 2: path = '/listDataM';break;
    }


    return (
      <div className="g-nav">
        <div className="g-menu">
          <div className="m-logo">
            中华学术外译项目选题规划初筛工作平台
          </div>

          <div className="m-query">
           {Object.keys(ret).map((v,i)=>
              <div key={i}><Tag>{v}</Tag><label>{ret[v]}</label></div>
            )} 
          </div>
          <div className="m-menu-item" onClick={this.doMenu.bind(this,path)}>
            <span>首页</span> 
          </div>
          
          
          {/*退出登录*/}
          <div className="m-menu-item m-menu-logout" onClick={this.logout}>
            <span>退出登录</span>
          </div>

        </div>
        <div className="g-main">
          {this.props.children}
        </div>

      </div>
    )
  }
}

export default withRouter(NavWrapper)
