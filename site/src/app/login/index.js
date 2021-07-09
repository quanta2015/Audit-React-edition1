import React from 'react'
import { Icon, Form, Input, Button, Spin, message } from 'antd'
import { inject, observer } from 'mobx-react'
import { Redirect } from 'react-router-dom'
import token from 'util/token.js'

import './index.less'
import logo from 'icon/logo.svg'

@inject('userStore')
@observer
class Login extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			loading: false,
			succ: false,
		}
	}

  callLogin=(user)=>{
    this.setState({ loading: true })
    this.props.userStore.login(user)
      .then(r => {
        if (r && r.code === 200) {
          message.success(r.msg)
          this.setState({ loading: true, succ: true})
          
          // this.props.history.push("/listDataS")
          console.log(r.data)

          switch(parseInt(r.data.role)) {
            case 0: this.props.history.push("/listS");break;
            case 1: this.props.history.push("/listT");break;
            case 2: this.props.history.push("/listM");break;
          }
          
        } else if (r && r.code === 301) {
          this.setState({ loading: false })
          message.error(r.msg)
        }
      })
  }


	async componentDidMount() {
    // let user = token.getUser()
    // if (user!==null) {
    //   this.callLogin(user)
    // }
  }


	goHome = () =>{
		this.props.history.push("/")
	}

	doLogin = () => {
		this.props.form.validateFields(async (err, values) => {
			if (err) { return }
      this.callLogin(values)
		})
	}

  onKeyUp=(e)=>{
    if(e.keyCode === 13) {
      this.doLogin()
    }
  }

	render() {
		const {getFieldDecorator} = this.props.form
		
		return (
			<Spin spinning={this.state.loading}>
				<div className='g-login' onKeyUp={this.onKeyUp}>
					<div className="m-login">
						<div className="m-logo">
							<div className="m-title">
                <label>中华学术外译项目选题规划初筛工作平台(v.2020)</label>
							</div>
						</div>
						<div className='m-form'>
							<Form >
								<Form.Item>
									{getFieldDecorator('usr', {
										rules: [{required: true, message: ' 请输入帐号！'}],
										initialValue: 's01'
									})(
										<Input
											icon="search"
											size='large'
											placeholder="帐号"
											allowClear
											prefix={<Icon type="user" style={{color: 'rgba(0,0,0,.25)'}}/>}
										/>)}
								</Form.Item>
								<Form.Item>
									{getFieldDecorator('pwd', {
										rules: [{required: true, message: '请输入密码！'}],
                    initialValue: 'a'
									})(
										<Input.Password
											size='large'
											placeholder="密码"
											prefix={<Icon type="lock" style={{color: 'rgba(0,0,0,.25)'}}/>}
										/>)}
								</Form.Item>

								<Form.Item>
                  <Button type="primary" className="input-btn" onClick={this.doLogin} block >登 录</Button>
								</Form.Item>
							</Form>
						</div>
					</div>
				</div>
			</Spin>
		)
	}
}

export default Form.create()(Login)
