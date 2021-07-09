import React from 'react'
import { inject } from 'mobx-react'
import { Input, Button, InputGroup, Radio, Switch, Icon,Tag, Table, Spin, Divider, Result, Modal, message, Skeleton } from "antd";
import EXIF from '@util/small-exif'
import Highlighter from 'react-highlight-words';
import { formatStat,getStatFilter,formatRet,getMethodFilter,getStatusFilter, getOperFilter,getRetFilter}  from 'util/stat'
import '../listDataS/index.less'
import {API_SERVER} from 'constant/apis'
import {STAT, STATUS} from 'constant/data'


@inject('userStore')
class listDataM extends React.Component {
	constructor(props) {
		super(props)

    this.state = {
      cur: null,
      trans_eval: '非常关注',
      list: [],
      record: null,
      show:     false,
      showImg:  false,
      showMod:  false,
      showInfo: false,
      status: null,
    }
	}


  getColumnSearchProps = dataIndex => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={node => {
            this.searchInput = node;
          }}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ width: 188, marginBottom: 8, display: 'block' }}
        />
        <Button
          type="primary"
          onClick={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
          icon="search"
          size="small"
          style={{ width: 90, marginRight: 8 }}
        >
          Search
        </Button>
        <Button onClick={() => this.handleReset(clearFilters)} size="small" style={{ width: 90 }}>
          Reset
        </Button>
      </div>
    ),
    filterIcon: filtered => (
      <Icon type="search" style={{ color: filtered ? '#1890ff' : undefined }} />
    ),
    onFilter: (value, record) => 
      record[dataIndex]
        .toString()
        .toLowerCase()
        .includes(value.replace(/(^\s*)|(\s*$)/g, "").toLowerCase()),
    onFilterDropdownVisibleChange: visible => {
      if (visible) {
        setTimeout(() => this.searchInput.select());
      }
    },
    render: text =>
      this.state.searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
          searchWords={[this.state.searchText.replace(/(^\s*)|(\s*$)/g, "")]}
          autoEscape
          textToHighlight={text.toString()}
        />
      ) : (
        text
      ),
  });

  handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    this.setState({
      searchText: selectedKeys[0],
      searchedColumn: dataIndex,
    });
  };

  handleReset = clearFilters => {
    clearFilters();
    this.setState({ searchText: '' });
  };

  async componentDidMount() {

    this.setState({ loading: true })
    let r = await this.props.userStore.getProjListT()
    // console.log(r.data)
    this.setState({ loading: false, list: r.data })
  }

  doEdit = async (e)=>{

    let params = { id: e.id }
    this.setState({ loading: true })
    let r = await this.props.userStore.getProjDetail(params)
    r.data.ret = (r.data.ret===null)?true:(r.data.ret==1)
    // r.data.ret = 
    r.data.ret_reason = (r.data.ret===null)?0:r.data.ret_reason
    this.setState({ loading: false, show: true, record: r.data })
  }

  doUpdate = (e,d)=>{
    let {record} =  this.state
    record[e] = d.target.value
    this.setState({ record: record })
  }

  

  doCancel =()=>{
    this.setState({ show: false })
  }

 doShowImg=(e)=>{
    this.setState({ showImg: true, imgurl: e},()=>{
      var box = document.querySelector(".m-img-wrap");
      var fa = document.querySelector('.m-img');
      box.onmousedown=function(ev) {
        var oEvent = ev; 
        // 浏览器有一些图片的默认事件,这里要阻止
        oEvent.preventDefault();
        var disX = oEvent.clientX - box.offsetLeft;
        var disY = oEvent.clientY - box.offsetTop;
        fa.onmousemove=function (ev) {
            oEvent = ev;
            oEvent.preventDefault();
            var x = oEvent.clientX -disX;
            var y = oEvent.clientY -disY;
            box.style.left = x + 'px';
            box.style.top = y + 'px';
        }
        fa.onmouseleave = function () {
          fa.onmousemove=null;
          fa.onmouseup=null;
        }
        fa.onmouseup=function() {
           fa.onmousemove=null;
           fa.onmouseup=null;
        } 
      }
    })
  }

  doCloseImg=()=>{
    this.setState({ showImg: false})
  }

  doSave = async () =>{

    let params = {
      id:         this.state.record.key,
      zhi_all_d:  this.state.record.zhi_all_d,
      zhi_all_p:  this.state.record.zhi_all_p,
      zhi_allq_d: this.state.record.zhi_allq_d,
      zhi_allq_p: this.state.record.zhi_allq_p,
      zhi_avg_d:  this.state.record.zhi_avg_d,
      zhi_avg_p:  this.state.record.zhi_avg_p,
      zhi1_file:  this.state.record.zhi1_file,
      zhi2_file:  this.state.record.zhi2_file,
      cssci_ret_d: this.state.record.cssci_ret_d,
      cssci_ret_p: this.state.record.cssci_ret_p,
      cssci_allq_d:this.state.record.cssci_allq_d,
      cssci_allq_p:this.state.record.cssci_allq_p,
      cssci_qc_d:  this.state.record.cssci_qc_d,
      cssci_qc_p:  this.state.record.cssci_qc_p,
      cssci1_file: this.state.record.cssci1_file,
      cssci2_file: this.state.record.cssci2_file,
      cao_fav:    this.state.record.cao_fav,
      cao_all:    this.state.record.cao_all,
      cao_quote:  this.state.record.cao_quote,
      cao1_file:   this.state.record.cao1_file,
      cao2_file:   this.state.record.cao2_file,
      dou_mark:   this.state.record.dou_mark,
      dou_markc:  this.state.record.dou_markc,
      dou_star2:  this.state.record.dou_star2,
      dou_star1:  this.state.record.dou_star1,
      dou_url:    this.state.record.dou_url,
      dou_file:   this.state.record.dou_file,

      ws1_ret:    this.state.record.ws1_ret,
      ws2_ret:    this.state.record.ws2_ret,
      ws3_ret:    this.state.record.ws3_ret,
      ws1_high:   this.state.record.ws1_high,
      ws2_high:   this.state.record.ws2_high,
      ws3_high:   this.state.record.ws3_high,
      ws1_hot:    this.state.record.ws1_hot,
      ws2_hot:    this.state.record.ws2_hot,
      ws3_hot:    this.state.record.ws3_hot,
      ws1_open:   this.state.record.ws1_open,
      ws2_open:   this.state.record.ws2_open,
      ws3_open:   this.state.record.ws3_open,

      ws1_2016:   this.state.record.ws1_2016,
      ws2_2016:   this.state.record.ws2_2016,
      ws3_2016:   this.state.record.ws3_2016,
      ws1_2017:   this.state.record.ws1_2017,
      ws2_2017:   this.state.record.ws2_2017,
      ws3_2017:   this.state.record.ws3_2017,
      ws1_2018:   this.state.record.ws1_2018,
      ws2_2018:   this.state.record.ws2_2018,
      ws3_2018:   this.state.record.ws3_2018,
      ws1_2019:   this.state.record.ws1_2019,
      ws2_2019:   this.state.record.ws2_2019,
      ws3_2019:   this.state.record.ws3_2019,
      ws1_2020:   this.state.record.ws1_2020,
      ws2_2020:   this.state.record.ws2_2020,
      ws3_2020:   this.state.record.ws3_2020,
      ws1_file:   this.state.record.ws1_file,
      ws2_file:   this.state.record.ws2_file,
      ws3_file:   this.state.record.ws3_file,
      trans_eval: this.state.record.trans_eval,
      trans1_file:this.state.record.trans1_file,
      trans2_file:this.state.record.trans2_file,
    }

    this.setState({ loading: true })
    let r = await this.props.userStore.saveProjectM(params)
    
    this.setState({ loading: false, record: r.data })
    message.success('保存成功！')
  }

  doUpload= async (type,e) => {
    if (e.target.files.length > 0) {
      let file = e.target.files[0]
      let formData = new FormData()
      formData.append('file', file, type)
      this.setState({ loading: true })
      let r = await this.props.userStore.upload(formData)
      if (r.code === 200) {
        let { record } = this.state
        record[`${type}_file`] = r.data.path
        this.setState({ loading: false, record: record })
        message.success('文件上传成功！')
      }else{
        message.success('文件上传失败！')
      }
    }
  }

  doAuditRet = (e)=>{
    let {record} =this.state
    record.ret = e
    this.setState({ record: record})
  }

  onChangeReason =(e)=>{
    let {record} = this.state
    record.ret_reason = e.target.value
    this.setState({ record: record })
  }

  onChangeEval =(e)=>{
    let {record} = this.state
    record.trans_eval = e.target.value
    this.setState({ record: record })
  }

  onChangeStatus=(e)=>{
    let {status} = this.state
    status = e.target.value
    this.setState({ status: status })
  }

  doModCancel=()=>{
    this.setState({ showMod: false })
  }

  doModStatus = async ()=>{
    let params = { status: this.state.status, id: this.state.cur }
    this.setState({ loading: true })
    let r = await this.props.userStore.setProjStatus(params)
    this.setState({ loading: false, showMod: false, list:r.data })
  }

  doStatus =(e)=>{
    this.setState({ showMod: true, cur: e.key })
  }

  doSubmitFin =async ()=>{
    let params = { 
      id: this.state.record.key,
      ret: this.state.record.ret,
      ret_reason: this.state.record.ret_reason,
    }
    this.setState({ loading: true  })
    let r = await this.props.userStore.subProject5(params)
    this.setState({ loading: false, show: false,list: r.data  })
    message.success('提交成功！')
  }


  doShowInfo=async(index)=>{
    this.setState({showInfo:true})


  }
    

  doCloseInfo=()=>{
    this.setState({showInfo:false})
  }


	render() {

    let { list,show,record,showImg,showMod,showInfo } = this.state

    const columns = [{
        title: 'ID',
        dataIndex: 'key',
        key: 'key',
        width: '60px',
        ...this.getColumnSearchProps('key'),
      },{
        title: '选题编号',
        dataIndex: 'sno',
        width: '150px',
        key: 'sno',
        ...this.getColumnSearchProps('sno'),
      },{
        title: '流水号',
        dataIndex: 'sid',
        width: '120px',
        key: 'sid',
        ...this.getColumnSearchProps('sid'),
      },{
        title: '操作员',
        dataIndex: 'id',
        dataIndex: 'id',
        width: '80px',
        filters: getOperFilter(),
        onFilter: (value, record) => `s${parseInt(record.id/list.length*10)+1}` === value ,
        render: d =>
          <Tag>
            s{parseInt(d/list.length*10)+1}
          </Tag>
      },{
        title: '操作状态',
        dataIndex: 'status',
        key: 'status',
        width: '120px',
        filters: getStatFilter(),
        onFilter: (value, record) => record.status === STATUS[value],
        render: d =>
          <Tag color={formatStat(d)[1]}>
            {formatStat(d)[0]}
          </Tag>
      },{
        title: '结果',
        dataIndex: 'ret',
        key: 'ret',
        width: '70px',
        filters: getRetFilter(),
        onFilter: (value, record) => {
          
          console.log(value)
          if (value===2) {
            return (record.ret === null)
          }else{
            return (record.ret === value)
          }
          
        },
        render: d =>{
          return (
          <span>
            {(d==1) && '通过'}
            {(d==0) && '未通过'}
            {(d===null) && '待审'}
          </span>)
        }
      },{
        title: '推荐类型',
        dataIndex: 'rec_med',
        key: 'rec_med',
        width: '100px',
        filters: getMethodFilter(),
        onFilter: (value, record) => record.rec_med  === value,
      },{
        title: '中文原著名',
        dataIndex: 'rec_name',
        key: 'rec_name',
        ...this.getColumnSearchProps('rec_name'),
      },{
        title: '作者',
        dataIndex: 'rec_auth',
        key: 'rec_auth',
        width: '100px',
        ...this.getColumnSearchProps('rec_auth'),
      },{
        title: '操作',
        key: 'action',
        width: '160px',
        render: (text, record, index) => (
          < >
            {<Button type="default" onClick={this.doStatus.bind(this,record)}>状态</Button>}
            {(record.status != 4) && <Button type="default" onClick={this.doEdit.bind(this,record)}>详情</Button> }
            {(record.status == 4) && <Button type="primary" onClick={this.doEdit.bind(this,record)}>编辑</Button> }
          </>
        ),
      },
    ];


		return (
      <Spin spinning={this.state.loading}>
      <div className="g-list">
        <div className="m-list">
          <Table size='small' dataSource={list} columns={columns}/>
        </div>
        
        {(show) && (record !== undefined) &&
        <div className="m-detail">
          <div className="m-detail-wrap">
            <div className="m-sid">
              <i>{record.sid} </i>
              <i>操作员: s{parseInt(record.key/list.length*10)+1}</i>
              <label>{record.rec_name}</label>
              <span>{record.rec_med}</span>
            </div>

            <div className="m-wrap">
              <div className="m-main">
              
                <div className="m-row-s">
                  <label>基本信息</label>
                  <div className="m-btn-detail" onClick={this.doShowInfo}>详情</div>
                </div>
                <div className="m-book">
                    <div className="m-trans">
                      <div>
                        <label>作者</label><Tag>{record.rec_auth}</Tag>
                      </div>
                      <div>
                        <label>ISBN</label><Tag>{record.isbn}</Tag>
                      </div>
                      
                    </div>
                    <div className="m-trans">
                      <div>
                        <label>出版社</label><Tag>{record.rec_press}</Tag>
                      </div>
                      <div>
                        <label>出版日期</label><Tag>{record.rec_date}</Tag>
                      </div>
                    </div>
                    <div className="m-trans">
                      <div>
                        <label>字数(万)</label><Tag>{record.rec_letter}</Tag>
                      </div>
                      <div>
                        <label>涉及学科</label><Tag>{record.rec_sub}</Tag>
                      </div>
                    </div>
                    <div className="m-trans">
                      <div>
                        <label>建议译文</label><Tag>{record.rec_trans}</Tag>
                      </div>
                      <div>
                        <label>外方出版意向</label><Tag>{record.rec_cop}</Tag>
                      </div>
                    </div>
                    <div className="m-trans">
                      <div>
                        <label>中文名</label><Tag>{record.rec_cop_zh}</Tag>
                      </div>
                      <div>
                        <label>外文名</label><Tag>{record.rec_cop_en}</Tag>
                      </div>
                    </div>
                </div>

                <div className="m-row-s">
                  <label>初筛意见</label>
                </div>

                <div className="m-row-m">
                  <label>是否进入专家评审环节</label>
                  <Switch defaultChecked onChange={this.doAuditRet} checked={this.state.record.ret} />
                </div>

                {(!this.state.record.ret) && 
                <div className="m-row-m">
                  <Radio.Group onChange={this.onChangeReason} value={this.state.record.ret_reason}>
                    <Radio value={'不符合公告要求'}>不符合公告要求</Radio>
                    <Radio value={'学术评标指标较低'}>学术评标指标较低</Radio>
                    <Radio value={'国际传播指标较低'}>国际传播指标较低</Radio>
                    <Radio value={'未达成国外出版意向'}>未达成国外出版意向</Radio>
                  </Radio.Group>
                </div>}
              </div>  

              <div className="m-person">
                <div className="m-dt">
                  <div>
                    <label>推荐人</label>
                    <Tag>{record.name} </Tag>
                    <label>工作单位</label>
                    <Tag>{record.rec_comp} </Tag>
                  </div>
                  <div>
                    <label>部门</label>
                    <Tag>{record.dep}</Tag>
                    <label>部门电话</label>
                    <Tag>{record.off_phone}</Tag>
                  </div>
                  <div>
                    <label>职位</label>
                    <Tag>{record.pos}</Tag>
                    <label> 职称</label>
                    <Tag>{record.title}</Tag>
                  </div>
                  <div>
                    <label>email</label>
                    <Tag>{record.email}</Tag>
                    <label>手机</label>
                    <Tag>{record.phone}</Tag>
                  </div>
                  <div>
                    <label>信用编码</label>
                    <Tag>{record.rec_comp_code} </Tag>
                    <label>身份证</label>
                    <Tag>{record.idn}</Tag>
                  </div>
                </div>
              </div>
            </div>

            


            <div className="m-form">
              <div className="m-tl">
                <span>中国知网评价指标（第一列为著作指标，第二列为作者指标）</span>
                { (this.state.record.zhi1_file) && 
                  <img src={`${API_SERVER}/${this.state.record.zhi1_file}`} 
                        onClick={this.doShowImg.bind(this,this.state.record.zhi1_file)} /> }
                { (this.state.record.zhi2_file) && 
                  <img src={`${API_SERVER}/${this.state.record.zhi2_file}`} 
                        onClick={this.doShowImg.bind(this,this.state.record.zhi2_file)} /> }
              </div>
              
              <div className="m-row">
                <div className="m-g">
                  <span className="u-tl">文献总数</span>
                  <Input placeholder="著作" className="u-num" 
                    onChange={this.doUpdate.bind(this,'zhi_all_d')}
                    value = {this.state.record.zhi_all_d}
                  />
                  <Input placeholder="作者" className="u-num"
                    onChange={this.doUpdate.bind(this,'zhi_all_p')}
                    value = {this.state.record.zhi_all_p}
                  />
                </div>
                <div className="m-g">
                  <span className="u-tl">总被引</span>
                  <Input placeholder="著作" className="u-num"
                    onChange={this.doUpdate.bind(this,'zhi_allq_d')}
                    value = {this.state.record.zhi_allq_d}
                  />
                  <Input placeholder="作者" className="u-num"
                    onChange={this.doUpdate.bind(this,'zhi_allq_p')}
                    value = {this.state.record.zhi_allq_p}
                  />
                </div>
                <div className="m-g">
                  <span className="u-tl">篇均被引</span>
                  <Input placeholder="著作" className="u-num"
                    onChange={this.doUpdate.bind(this,'zhi_avg_d')}
                    value = {this.state.record.zhi_avg_d}
                  />
                  <Input placeholder="作者" className="u-num"
                    onChange={this.doUpdate.bind(this,'zhi_avg_p')}
                    value = {this.state.record.zhi_avg_p}
                  />
                </div>
              </div>

              <div className="m-tl">
                <span>CSSCI系统</span>
                { (this.state.record.cssci1_file) && 
                  <img src={`${API_SERVER}/${this.state.record.cssci1_file}`} 
                       onClick={this.doShowImg.bind(this,this.state.record.cssci1_file)} /> }
                { (this.state.record.cssci2_file) && 
                  <img src={`${API_SERVER}/${this.state.record.cssci2_file}`} 
                       onClick={this.doShowImg.bind(this,this.state.record.cssci2_file)} /> }
              </div>
              
              <div className="m-row">
                <div className="m-g">
                  <span className="u-tl">结果数</span>
                  <Input placeholder="著作" className="u-num" 
                    onChange={this.doUpdate.bind(this,'cssci_ret_d')}
                    value = {this.state.record.cssci_ret_d}
                  />
                  <Input placeholder="作者" className="u-num"
                    onChange={this.doUpdate.bind(this,'cssci_ret_p')}
                    value = {this.state.record.cssci_ret_p}
                  />
                </div>

                <div className="m-g">
                  <span className="u-tl">总计被引</span>
                  <Input placeholder="著作" className="u-num" 
                    onChange={this.doUpdate.bind(this,'cssci_allq_d')}
                    value = {this.state.record.cssci_allq_d}
                  />
                  <Input placeholder="作者" className="u-num"
                    onChange={this.doUpdate.bind(this,'cssci_allq_p')}
                    value = {this.state.record.cssci_allq_p}
                  />
                </div>

                <div className="m-g">
                  <span className="u-tl">被引次数</span>
                  <Input placeholder="著作" className="u-num" 
                    onChange={this.doUpdate.bind(this,'cssci_qc_d')}
                    value = {this.state.record.cssci_qc_d}
                  />
                  <Input placeholder="作者" className="u-num"
                    onChange={this.doUpdate.bind(this,'cssci_qc_p')}
                    value = {this.state.record.cssci_qc_p}
                  />
                </div>
              </div>


              <div className="m-wrap">
                <div className="m-tl">
                  <span>超星读秀</span>

                  { (this.state.record.cao1_file) && 
                    <img src={`${API_SERVER}/${this.state.record.cao1_file}`} 
                          onClick={this.doShowImg.bind(this,this.state.record.cao1_file)} /> }
                  { (this.state.record.cao2_file) && 
                    <img src={`${API_SERVER}/${this.state.record.cao2_file}`} 
                          onClick={this.doShowImg.bind(this,this.state.record.cao2_file)} /> }
                </div>
                <div className="m-row">
                  <div className="m-g">
                    <span className="u-tl">收藏馆数</span>
                    <Input className="u-num"
                      onChange={this.doUpdate.bind(this,'cao_fav')}
                      value = {this.state.record.cao_fav}
                    />
                  </div>
                  <div className="m-g">
                    <span className="u-tl">总被引</span>
                    <Input className="u-num"
                      onChange={this.doUpdate.bind(this,'cao_all')}
                      value = {this.state.record.cao_all}
                    />
                  </div>
                  <div className="m-g">
                    <span className="u-tl">图书引用册数</span>
                    <Input className="u-num"
                      onChange={this.doUpdate.bind(this,'cao_quote')}
                      value = {this.state.record.cao_quote}
                    />
                  </div>
                </div>
              </div>
              
              
              <div className="m-wrap">
                <div className="m-tl">
                  <span>豆瓣图书</span>
                  { (this.state.record.dou_file) && 
                      <img src={`${API_SERVER}/${this.state.record.dou_file}`} 
                           onClick={this.doShowImg.bind(this,this.state.record.dou_file)} /> }
                </div>
                <div className="m-row">
                  <div className="m-g">
                    <span className="u-tl">评分</span>
                    <Input className="u-num"
                      onChange={this.doUpdate.bind(this,'dou_mark')}
                      value = {this.state.record.dou_mark}
                    />
                  </div>
                  <div className="m-g">
                    <span className="u-tl">评分人数</span>
                    <Input className="u-num"
                      onChange={this.doUpdate.bind(this,'dou_markc')}
                      value = {this.state.record.dou_markc}
                    />
                  </div>
                  <div className="m-g">
                    <span className="u-tl">二星比例</span>
                    <Input className="u-num"
                      onChange={this.doUpdate.bind(this,'dou_star2')}
                      value = {this.state.record.dou_star2}
                    />
                  </div>
                  <div className="m-g">
                    <span className="u-tl">一星比例</span>
                    <Input className="u-num"
                      onChange={this.doUpdate.bind(this,'dou_star1')}
                      value = {this.state.record.dou_star1}
                    />
                  </div>
                </div>
                <div className="m-row">
                  <div className="m-gs">
                    <span className="u-tl">URL</span>
                    <Input className="u-num-l"
                      onChange={this.doUpdate.bind(this,'dou_url')}
                      value = {this.state.record.dou_url}
                    />
                  </div>
                </div>
              </div>


              <div className="m-tl">
                <span>国际传播指标</span>
                { (this.state.record.ws1_file) && 
                    <img src={`${API_SERVER}/${this.state.record.ws1_file}`} 
                          onClick={this.doShowImg.bind(this,this.state.record.ws1_file)} /> }
                  { (this.state.record.ws2_file) && 
                    <img src={`${API_SERVER}/${this.state.record.ws2_file}`} 
                          onClick={this.doShowImg.bind(this,this.state.record.ws2_file)} /> }
                  { (this.state.record.ws3_file) && 
                    <img src={`${API_SERVER}/${this.state.record.ws3_file}`} 
                          onClick={this.doShowImg.bind(this,this.state.record.ws3_file)} /> }
              </div>


              <div className="m-row m-row-tab">
                  <div className="m-gs">
                    <span className="u-tl u-tl-s">序号</span>

                    <span className="u-tl">中文关键词</span>
                    <span className="u-tl">英文名</span>
                    <span className="u-tl">其他文名</span>

                    <span className="u-tl u-tl-s">检索数</span>
                    <span className="u-tl u-tl-s">高引数</span>
                    <span className="u-tl u-tl-s">热点数</span>
                    <span className="u-tl u-tl-s">开放数</span>
 
                    <span className="u-tl u-tl-s">2016</span>
                    <span className="u-tl u-tl-s">2017</span>
                    <span className="u-tl u-tl-s">2018</span>
                    <span className="u-tl u-tl-s">2019</span>
                    <span className="u-tl u-tl-s">2020</span>
                  </div>
                </div>

              <div className="m-row m-row-tab">
                <div className="m-gs">
                  <span className="u-ke u-tl-s">1</span>
                  <span className="u-ke">{record.key_cn_1}</span>
                  <span className="u-ke">{record.key_en_1}</span>
                  <span className="u-ke">{record.key_ot_1}</span>
                  <span className="u-ke u-tl-s">
                    <Input onChange={this.doUpdate.bind(this,'ws1_ret')}
                      value = {this.state.record.ws1_ret}
                    />
                  </span>
                  <span className="u-ke u-tl-s">
                    <Input onChange={this.doUpdate.bind(this,'ws1_high')}
                      value = {this.state.record.ws1_high}
                    />
                  </span>
                  <span className="u-ke u-tl-s">
                    <Input onChange={this.doUpdate.bind(this,'ws1_hot')}
                      value = {this.state.record.ws1_hot}
                    />
                  </span>
                  <span className="u-ke u-tl-s">
                    <Input onChange={this.doUpdate.bind(this,'ws1_open')}
                      value = {this.state.record.ws1_open}
                    />
                  </span>
                  <span className="u-ke u-tl-s">
                    <Input onChange={this.doUpdate.bind(this,'ws1_2016')}
                      value = {this.state.record.ws1_2016}
                    />
                  </span>
                  <span className="u-ke u-tl-s">
                    <Input onChange={this.doUpdate.bind(this,'ws1_2017')}
                      value = {this.state.record.ws1_2017}
                    />
                  </span>
                  <span className="u-ke u-tl-s">
                    <Input onChange={this.doUpdate.bind(this,'ws1_2018')}
                      value = {this.state.record.ws1_2018}
                    />
                  </span>
                  <span className="u-ke u-tl-s">
                    <Input onChange={this.doUpdate.bind(this,'ws1_2019')}
                      value = {this.state.record.ws1_2019}
                    />
                  </span>
                  <span className="u-ke u-tl-s">
                    <Input onChange={this.doUpdate.bind(this,'ws1_2020')}
                      value = {this.state.record.ws1_2020}
                    />
                  </span>
                </div>
              </div>

              <div className="m-row m-row-tab">
                <div className="m-gs">
                  <span className="u-ke u-tl-s">2</span>
                  <span className="u-ke">{record.key_cn_2}</span>
                  <span className="u-ke">{record.key_en_2}</span>
                  <span className="u-ke">{record.key_ot_2}</span>
                  <span className="u-ke u-tl-s">
                    <Input onChange={this.doUpdate.bind(this,'ws2_ret')}
                      value = {this.state.record.ws2_ret}
                    />
                  </span>
                  <span className="u-ke u-tl-s">
                    <Input onChange={this.doUpdate.bind(this,'ws2_high')}
                      value = {this.state.record.ws2_high}
                    />
                  </span>
                  <span className="u-ke u-tl-s">
                    <Input onChange={this.doUpdate.bind(this,'ws2_hot')}
                      value = {this.state.record.ws2_hot}
                    />
                  </span>
                  <span className="u-ke u-tl-s">
                    <Input onChange={this.doUpdate.bind(this,'ws2_open')}
                      value = {this.state.record.ws2_open}
                    />
                  </span>
                  <span className="u-ke u-tl-s">
                    <Input onChange={this.doUpdate.bind(this,'ws2_2016')}
                      value = {this.state.record.ws2_2016}
                    />
                  </span>
                  <span className="u-ke u-tl-s">
                    <Input onChange={this.doUpdate.bind(this,'ws2_2017')}
                      value = {this.state.record.ws2_2017}
                    />
                  </span>
                  <span className="u-ke u-tl-s">
                    <Input onChange={this.doUpdate.bind(this,'ws2_2018')}
                      value = {this.state.record.ws2_2018}
                    />
                  </span>
                  <span className="u-ke u-tl-s">
                    <Input onChange={this.doUpdate.bind(this,'ws2_2019')}
                      value = {this.state.record.ws2_2019}
                    />
                  </span>
                  <span className="u-ke u-tl-s">
                    <Input onChange={this.doUpdate.bind(this,'ws2_2020')}
                      value = {this.state.record.ws2_2020}
                    />
                  </span>
                </div>
              </div>

              <div className="m-row m-row-tab">
                <div className="m-gs">
                  <span className="u-ke u-tl-s">3</span>
                  <span className="u-ke">{record.key_cn_3}</span>
                  <span className="u-ke">{record.key_en_3}</span>
                  <span className="u-ke">{record.key_ot_3}</span>
                  <span className="u-ke u-tl-s">
                    <Input onChange={this.doUpdate.bind(this,'ws3_ret')}
                      value = {this.state.record.ws3_ret}
                    />
                  </span>
                  <span className="u-ke u-tl-s">
                    <Input onChange={this.doUpdate.bind(this,'ws3_high')}
                      value = {this.state.record.ws3_high}
                    />
                  </span>
                  <span className="u-ke u-tl-s">
                    <Input onChange={this.doUpdate.bind(this,'ws3_hot')}
                      value = {this.state.record.ws3_hot}
                    />
                  </span>
                  <span className="u-ke u-tl-s">
                    <Input onChange={this.doUpdate.bind(this,'ws3_open')}
                      value = {this.state.record.ws3_open}
                    />
                  </span>
                  <span className="u-ke u-tl-s">
                    <Input onChange={this.doUpdate.bind(this,'ws3_2016')}
                      value = {this.state.record.ws3_2016}
                    />
                  </span>
                  <span className="u-ke u-tl-s">
                    <Input onChange={this.doUpdate.bind(this,'ws3_2017')}
                      value = {this.state.record.ws3_2017}
                    />
                  </span>
                  <span className="u-ke u-tl-s">
                    <Input onChange={this.doUpdate.bind(this,'ws3_2018')}
                      value = {this.state.record.ws3_2018}
                    />
                  </span>
                  <span className="u-ke u-tl-s">
                    <Input onChange={this.doUpdate.bind(this,'ws3_2019')}
                      value = {this.state.record.ws3_2019}
                    />
                  </span>
                  <span className="u-ke u-tl-s">
                    <Input onChange={this.doUpdate.bind(this,'ws3_2020')}
                      value = {this.state.record.ws3_2020}
                    />
                  </span>
                </div>
              </div>
              
              <div className="m-tl">
                <span>外译文版学界评价(非英文版选填)</span>
                { (this.state.record.trans1_file) && 
                  <img src={`${API_SERVER}/${this.state.record.trans1_file}`} 
                       onClick={this.doShowImg.bind(this,this.state.record.trans1_file)} /> }
                { (this.state.record.trans2_file) && 
                  <img src={`${API_SERVER}/${this.state.record.trans2_file}`} 
                       onClick={this.doShowImg.bind(this,this.state.record.trans2_file)} /> }
              </div>
              
              <div className="m-row">
                <Radio.Group onChange={this.onChangeEval} value={this.state.record.trans_eval}>
                  <Radio value={'非常关注'}>非常关注</Radio>
                  <Radio value={'比较关注'}>比较关注</Radio>
                  <Radio value={'一般关注'}>一般关注</Radio>
                  <Radio value={'不关注'}>不关注</Radio>
                </Radio.Group>
              </div>
            </div>

          </div>
          
          <div className="m-detail-fun">
            <Button onClick={this.doCancel}>返回首页</Button>
            {(record.status == 4) && <Button className="c-green" onClick={this.doSave}>保 存</Button> }
            {(record.status == 4) && <Button className="c-orange" onClick={this.doSubmitFin}>完成终审</Button> }
          </div>
        </div>}


        {(showImg && 
          <div className="m-img">
            <div className="m-img-wrap">
              <span className="m-del" onClick={this.doCloseImg}></span>
              <img src={`${API_SERVER}/${this.state.imgurl}`} />
            </div>
          </div>)}

        {(showMod) && 
          <div className="m-mod">
            <div className="m-mod-wrap">
              <span>状态选择</span>
              <div className="m-sel">
                <Radio.Group onChange={this.onChangeStatus} value={this.state.status}>
                  <Radio value={0}>首次输入</Radio>
                  
                  <Radio value={3}>整体审核</Radio>
                  <Radio value={4}>最终评审</Radio>
                  <Radio value={5}>评审完成</Radio>
                </Radio.Group>
              </div>
              <div className="m-fun">
                <Button onClick={this.doModCancel}>取消</Button>
                <Button className="c-orange" onClick={this.doModStatus}>确定</Button>
                
              </div>

            </div>
          </div>}

        {(showInfo) &&
          <div className="m-info" onClick={this.doCloseInfo}>
            <div className="m-wrap">
              <div className="m-tl">推荐理由</div>
              <div className="m-dt">{record.rec_reason}</div>
              <div className="m-tl">成果简介</div>
              <div className="m-dt">{record.rec_info}</div>
              <div className="m-tl">作者简介</div>
              <div className="m-dt">{record.rec_auth_info}</div>
              <div className="m-tl">著作目录</div>
              <div className="m-dt">{record.rec_list}</div>
            </div>
          </div>}
          
      </div>
      </Spin>
		)
	}
}

export default listDataM
