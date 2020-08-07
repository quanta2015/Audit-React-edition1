import React from 'react'
import { Link } from 'react-router-dom'
import { inject } from 'mobx-react'
import {withRouter} from "react-router-dom";
import { MENU_MAIN } from 'constant/data'

import './index.less'
import home from 'icon/icon_home.svg';
import mooc from 'icon/icon_mooc.svg';
import proj from 'icon/icon_proj.svg';
import about from 'icon/icon_about.svg';


@inject('userStore')
class NavWrapper extends React.Component {
	constructor(props) {
		super(props)

    let u = this.props.userStore.currUser
    this.state = {
      cur: 0,
      role: ((u !== undefined)&&(u !== null))?u.type:-1,
    }

	}

  doMenu = (path)=>{
    this.props.history.push(path)
  }

  logout = ()=>{
    this.props.userStore.logout()
    this.props.history.push('/')
  }

	render() {
    let { cur,role } = this.state

   
        

    return (
      <div className="g-nav">
        <div className="g-menu">
          <div className="m-logo">
            中华学术外译项目选题规划初筛工作平台
          </div>
          <div className="m-menu-item" onClick={this.doMenu.bind(this,'/')}>
            <span>首页</span> 
          </div>
          
          
          {/*退出登录*/}
          <div className="m-menu-item m-menu-logout" onClick={this.logout}>
            <span>Logout</span>
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
