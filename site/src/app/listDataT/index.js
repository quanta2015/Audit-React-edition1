import React from 'react'
import { inject } from 'mobx-react'
import { Input, Form, Button, InputGroup, Radio, Switch, Icon,Tag, Table, Spin, Divider, Result, Modal, message, Skeleton } from "antd";
import EXIF from '@util/small-exif'
import Highlighter from 'react-highlight-words';
import { formatStat,getStatFilter,getMethodFilter,getStatusFilter,getOperFilter}  from 'util/stat'
import '../listDataS/index.less'
import {API_SERVER} from 'constant/apis'
import {STAT, STATUS} from 'constant/data'


@inject('userStore')
class listData extends React.Component {
	constructor(props) {
		super(props)

    this.state = {
      cur: 1,
      trans_eval: '非常关注',
      list: [],
      record: null,
      show: false,
      showImg: false,
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
          onPressEnter={() => this.handleSearch(selectedKeys, confirm)}
          style={{ width: 188, marginBottom: 8, display: 'block' }}
        />
        <Button
          type="primary"
          onClick={() => this.handleSearch(selectedKeys, confirm)}
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
        .includes(value.toLowerCase()),
    onFilterDropdownVisibleChange: visible => {
      if (visible) {
        setTimeout(() => this.searchInput.select());
      }
    },
    render: text => (
      <Highlighter
        highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
        searchWords={[this.state.searchText]}
        autoEscape
        textToHighlight={text.toString()}
      />
    ),
  });

  handleSearch = (selectedKeys, confirm) => {
    confirm();
    this.setState({ searchText: selectedKeys[0] });
  };

  handleReset = clearFilters => {
    clearFilters();
    this.setState({ searchText: '' });
  };

  async componentDidMount() {
    // let params = {mark: this.state.cur}
    this.setState({ loading: true })
    let r = await this.props.userStore.getProjListT()
    console.log(r)
    this.setState({ loading: false, list: r.data})
  }

  doEdit = (e)=>{
    // console.log(e)
    this.setState({ record: e, show: true })
  }

  doUpdate = (e,d)=>{
    let {record} =  this.state
    record[e] = d.target.value
    this.setState({ record: record })
  }

  onChangeEval =(e)=>{
    let {record} = this.state
    record.trans_eval = e.target.value
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

  doSubmitT1 = async () => {
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
    let r = await this.props.userStore.subProject2(params)
    this.setState({ loading: false, show: false,list: r.data  })
    message.success('提交成功！')
  }

  doSubmitT2 = async () => {
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
    let r = await this.props.userStore.subProject4(params)
    this.setState({ loading: false, show: false,list: r.data  })
    message.success('提交成功！')
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
    let r = await this.props.userStore.saveProject(params)
    console.log(r)
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

  doChangePage=(p)=>{
    this.setState({cur:p.current})
    // console.log(p.)
  }


	render() {

    let { list,show,record,showImg } = this.state
    let mark = (this.props.userStore.currUser)?this.props.userStore.currUser.mark:''


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
        title: '操作状态',
        dataIndex: 'status',
        width: '120px',
        filters: getStatFilter(),
        onFilter: (value, record) => record.status === STATUS[value],
        render: d =>
          <Tag color={formatStat(d)[1]}>
            {formatStat(d)[0]}
          </Tag>
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
        title: '推荐类型',
        dataIndex: 'rec_med',
        key: 'rec_med',
        width: '100px',
        filters: getMethodFilter(),
        onFilter: (value, record) => record.rec_med  === value,
      },{
        title: '原始状态',
        dataIndex: 'rec_status',
        key: 'rec_status',
        width: '100px',
        filters: getStatusFilter(),
        onFilter: (value, record) => record.rec_status  === value,
      },{
        title: '中文原著名',
        dataIndex: 'rec_name',
        key: 'rec_name',
        ...this.getColumnSearchProps('sid'),
      },{
        title: '作者',
        dataIndex: 'rec_auth',
        key: 'rec_auth',
        ...this.getColumnSearchProps('sid'),
      },{
        title: '操作',
        key: 'action',
        width: '100px',
        render: (text, record, index) => (
          < >
            {(record.status != 1) && (record.status != 3) && <Button type="default" icon="file" onClick={this.doEdit.bind(this,record)}>详情</Button> }
            {(record.status == 1) && <Button type="primary" icon="edit" onClick={this.doEdit.bind(this,record)}>开始编辑</Button> }
            {(record.status == 3) && <Button className="c-orange" type="primary" icon="edit" onClick={this.doEdit.bind(this,record)}>开始编辑</Button> }
          </>
        ),
      },
    ];

    const { getFieldDecorator } = this.props.form;

		return (
      <Spin spinning={this.state.loading}>
      <div className="g-list">
        <div className="m-list">
          <Table size='small' onChange={this.doChangePage} current={this.state.cur} dataSource={list} columns={columns}/>
        </div>
        
        {(show) && (record !== undefined) &&
        <div className="m-detail">
          <div className="m-detail-wrap">



            <div className="m-sid">
              <i>{record.sid} </i>
              <i>操作员: s{mark}</i>
              <label>{record.rec_name}</label>
              <span>{record.rec_med}</span>
            </div>

            <div className="m-l">
              <div className="m-wrap">
                <div className="m-main">
                  <div className="m-book">
                    <div className="m-trans">
                      <div>
                        <label>作者</label><Tag>{record.rec_auth}</Tag>
                      </div>
                    </div>
                    <div className="m-trans">
                      <div>
                        <label>ISBN</label><Tag>{record.isbn}</Tag>
                      </div>
                    </div>
                    <div className="m-trans">
                      <div>
                        <label>原著出版社</label><Tag>{record.rec_press}</Tag>
                      </div>
                    </div>
                    <div className="m-trans">
                      <div>
                        <label>出版日期</label><Tag>{record.rec_date}</Tag>
                      </div>
                    </div>
                    <div className="m-trans">
                      <div>
                        <label>字数(千)</label><Tag>{record.rec_letter}</Tag>
                      </div>
                    </div>
                    <div className="m-trans">
                      <div>
                        <label>涉及学科</label><Tag>{record.rec_sub}</Tag>
                      </div>
                    </div>
                    <div className="m-trans">
                      <div>
                        <label>申报文版</label><Tag>{record.rec_trans}</Tag>
                      </div>
                    </div>
                    <div className="m-trans">
                      <div>
                        <label>外方出版意向</label><Tag>{record.rec_cop}</Tag>
                      </div>
                    </div>
                    <div className="m-trans">
                      <div>
                        <label>中文名</label><Tag>{record.rec_cop_zh}</Tag>
                      </div>
                    </div>
                    <div className="m-trans">
                      <div>
                        <label>英文名</label><Tag>{record.rec_cop_en}</Tag>
                      </div>
                    </div>
                    <div className="m-trans">
                      <div>
                        <label>其他文名</label><Tag>{record.rec_cop_ot}</Tag>
                      </div>
                    </div>
                    
                  </div>
                </div>
              </div>
            </div>

            <div className="m-r">

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
          </div>

          <div className="m-detail-fun">
            <Button onClick={this.doCancel}>返回首页</Button>
            { ((record.status == 1)||(record.status == 3)) && <Button className="c-green" onClick={this.doSave}>保 存</Button> }
        
            {(record.status == 1) && <Button className="c-orange" onClick={this.doSubmitT1}>返回二次输入</Button> }
            {(record.status == 3) && <Button className="c-orange" onClick={this.doSubmitT2}>提交终审</Button> }
          </div>
        </div>}

        {(showImg && 
          <div className="m-img">
            <div class="m-img-wrap">
              <span className="m-del" onClick={this.doCloseImg}></span>
              <img src={`${API_SERVER}/${this.state.imgurl}`} />
            </div>
          </div>)}
      </div>
      </Spin>
		)
	}
}

export default Form.create()(listData)
