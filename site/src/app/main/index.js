import React from 'react'
import { Spin } from 'antd'
import { inject, observer } from 'mobx-react'
import './index.less'
import logo from 'icon/logo_co.svg';
import { API_SERVER } from 'constant/apis'

@inject('mainStore','userStore')
@observer
class Main extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			loading: false,
			mooclist: [],
      news: [],
      visible: false,
      mobile: (document.querySelector('html').clientWidth<1000),
		}
	}

  async componentDidMount() {
    let web, mob, n = []
    this.setState({ loading: true })
    
  }

  doNav = (mooc) => {
    window.location.replace(`/#/mooc/${mooc}`)
  }

  doLogin = () => {
    this.props.history.push("/login")
  }

  
	render() {
		let { mooclist, count, mobile, news } = this.state

		return (
      <Spin spinning={this.state.loading}>
			<div className='g-index'>
        <div className="m-index">
          <div className="m-nav">
            <div className="m-nav-wrap">
              <div className="m-nav-main">
                <div className="m-news">
                  <h1>News</h1>
                  {news.map((item,index)=>
                    <li key={index}>
                      <span>{item.data} </span>
                      <i>{item.date}</i>
                    </li>
                   )}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="m-footer">
          <span>杭州师范大学国际服务工程学院 前端技术社团</span>
          <span>2020@All Rights Researved <a href="http://icp.chinaz.com/info?q=webmooc.online">浙ICP备20005053号-1</a></span>

        </div> 
			</div>
      </Spin>
		)
	}
}

export default Main