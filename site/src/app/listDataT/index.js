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
      cur: 0,
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
      zhi_alld_d: this.state.record.zhi_alld_d,
      zhi_alld_p: this.state.record.zhi_alld_p,
      zhi_allq_d: this.state.record.zhi_allq_d,
      zhi_allq_p: this.state.record.zhi_allq_p,
      zhi_avg_d:  this.state.record.zhi_avg_d,
      zhi_avg_p:  this.state.record.zhi_avg_p,
      zhi_core_d: this.state.record.zhi_core_d,
      zhi_core_p: this.state.record.zhi_core_p,
      zhi_cscd_d: this.state.record.zhi_cscd_d,
      zhi_cscd_p: this.state.record.zhi_cscd_p,
      zhi_cssci_d:this.state.record.zhi_cssci_d,
      zhi_cssci_p:this.state.record.zhi_cssci_p,
      zhi1_file:  this.state.record.zhi1_file,
      zhi2_file:  this.state.record.zhi2_file,
      cao_all:    this.state.record.cao_all,
      cao_fav:    this.state.record.cao_fav,
      cao_index:  this.state.record.cao_index,
      cao_quote:  this.state.record.cao_quote,
      cao1_file:   this.state.record.cao1_file,
      cao2_file:   this.state.record.cao2_file,
      cssci_quote:this.state.record.cssci_quote,
      cssci_file: this.state.record.cssci_file,
      dou_mark:   this.state.record.dou_mark,
      dou_star1:  this.state.record.dou_star1,
      dou_start2: this.state.record.dou_start2,
      dou_file:   this.state.record.dou_file,
      int_key_cn: this.state.record.int_key_cn,
      int_key_en: this.state.record.int_key_en,
      int_file:   this.state.record.int_file,
      ws_2010:    this.state.record.ws_2010,
      ws_2011:    this.state.record.ws_2011,
      ws_2012:    this.state.record.ws_2012,
      ws_2013:    this.state.record.ws_2013,
      ws_2014:    this.state.record.ws_2014,
      ws_2015:    this.state.record.ws_2015,
      ws_2016:    this.state.record.ws_2016,
      ws_2017:    this.state.record.ws_2017,
      ws_2018:    this.state.record.ws_2018,
      ws_2019:    this.state.record.ws_2019,
      ws_high:    this.state.record.ws_high,
      ws_hot:     this.state.record.ws_hot,
      ws_open:    this.state.record.ws_open,
      ws_ret:     this.state.record.ws_ret,
      ws1_file:   this.state.record.ws1_file,
      ws2_file:   this.state.record.ws2_file,
      trans_eval: this.state.record.trans_eval,
      trans1_file:this.state.record.trans1_file,
      trans2_file:this.state.record.trans2_file,
    }
    let r = await this.props.userStore.subProject2(params)
    this.setState({ loading: false, show: false,list: r.data  })
    message.success('提交成功！')
  }

  doSubmitT2 = async () => {
    let params = {
      id:         this.state.record.key,
      zhi_all_d:  this.state.record.zhi_all_d,
      zhi_all_p:  this.state.record.zhi_all_p,
      zhi_alld_d: this.state.record.zhi_alld_d,
      zhi_alld_p: this.state.record.zhi_alld_p,
      zhi_allq_d: this.state.record.zhi_allq_d,
      zhi_allq_p: this.state.record.zhi_allq_p,
      zhi_avg_d:  this.state.record.zhi_avg_d,
      zhi_avg_p:  this.state.record.zhi_avg_p,
      zhi_core_d: this.state.record.zhi_core_d,
      zhi_core_p: this.state.record.zhi_core_p,
      zhi_cscd_d: this.state.record.zhi_cscd_d,
      zhi_cscd_p: this.state.record.zhi_cscd_p,
      zhi_cssci_d:this.state.record.zhi_cssci_d,
      zhi_cssci_p:this.state.record.zhi_cssci_p,
      zhi1_file:  this.state.record.zhi1_file,
      zhi2_file:  this.state.record.zhi2_file,
      cao_all:    this.state.record.cao_all,
      cao_fav:    this.state.record.cao_fav,
      cao_index:  this.state.record.cao_index,
      cao_quote:  this.state.record.cao_quote,
      cao1_file:   this.state.record.cao1_file,
      cao2_file:   this.state.record.cao2_file,
      cssci_quote:this.state.record.cssci_quote,
      cssci_file: this.state.record.cssci_file,
      dou_mark:   this.state.record.dou_mark,
      dou_star1:  this.state.record.dou_star1,
      dou_start2: this.state.record.dou_start2,
      dou_file:   this.state.record.dou_file,
      int_key_cn: this.state.record.int_key_cn,
      int_key_en: this.state.record.int_key_en,
      int_file:   this.state.record.int_file,
      ws_2010:    this.state.record.ws_2010,
      ws_2011:    this.state.record.ws_2011,
      ws_2012:    this.state.record.ws_2012,
      ws_2013:    this.state.record.ws_2013,
      ws_2014:    this.state.record.ws_2014,
      ws_2015:    this.state.record.ws_2015,
      ws_2016:    this.state.record.ws_2016,
      ws_2017:    this.state.record.ws_2017,
      ws_2018:    this.state.record.ws_2018,
      ws_2019:    this.state.record.ws_2019,
      ws_high:    this.state.record.ws_high,
      ws_hot:     this.state.record.ws_hot,
      ws_open:    this.state.record.ws_open,
      ws_ret:     this.state.record.ws_ret,
      ws1_file:   this.state.record.ws1_file,
      ws2_file:   this.state.record.ws2_file,
      trans_eval: this.state.record.trans_eval,
      trans1_file:this.state.record.trans1_file,
      trans2_file:this.state.record.trans2_file,
    }
    let r = await this.props.userStore.subProject4(params)
    this.setState({ loading: false, show: false,list: r.data  })
    message.success('提交成功！')
  }

  doSave = async () =>{
    let params = {
      id:         this.state.record.key,
      zhi_all_d:  this.state.record.zhi_all_d,
      zhi_all_p:  this.state.record.zhi_all_p,
      zhi_alld_d: this.state.record.zhi_alld_d,
      zhi_alld_p: this.state.record.zhi_alld_p,
      zhi_allq_d: this.state.record.zhi_allq_d,
      zhi_allq_p: this.state.record.zhi_allq_p,
      zhi_avg_d:  this.state.record.zhi_avg_d,
      zhi_avg_p:  this.state.record.zhi_avg_p,
      zhi_core_d: this.state.record.zhi_core_d,
      zhi_core_p: this.state.record.zhi_core_p,
      zhi_cscd_d: this.state.record.zhi_cscd_d,
      zhi_cscd_p: this.state.record.zhi_cscd_p,
      zhi_cssci_d:this.state.record.zhi_cssci_d,
      zhi_cssci_p:this.state.record.zhi_cssci_p,
      zhi1_file:  this.state.record.zhi1_file,
      zhi2_file:  this.state.record.zhi2_file,
      cao_all:    this.state.record.cao_all,
      cao_fav:    this.state.record.cao_fav,
      cao_index:  this.state.record.cao_index,
      cao_quote:  this.state.record.cao_quote,
      cao1_file:   this.state.record.cao1_file,
      cao2_file:   this.state.record.cao2_file,
      cssci_quote:this.state.record.cssci_quote,
      cssci_file: this.state.record.cssci_file,
      dou_mark:   this.state.record.dou_mark,
      dou_star1:  this.state.record.dou_star1,
      dou_start2: this.state.record.dou_start2,
      dou_file:   this.state.record.dou_file,
      int_key_cn: this.state.record.int_key_cn,
      int_key_en: this.state.record.int_key_en,
      int_file:   this.state.record.int_file,
      ws_2010:    this.state.record.ws_2010,
      ws_2011:    this.state.record.ws_2011,
      ws_2012:    this.state.record.ws_2012,
      ws_2013:    this.state.record.ws_2013,
      ws_2014:    this.state.record.ws_2014,
      ws_2015:    this.state.record.ws_2015,
      ws_2016:    this.state.record.ws_2016,
      ws_2017:    this.state.record.ws_2017,
      ws_2018:    this.state.record.ws_2018,
      ws_2019:    this.state.record.ws_2019,
      ws_high:    this.state.record.ws_high,
      ws_hot:     this.state.record.ws_hot,
      ws_open:    this.state.record.ws_open,
      ws_ret:     this.state.record.ws_ret,
      ws1_file:   this.state.record.ws1_file,
      ws2_file:   this.state.record.ws2_file,
      trans_eval: this.state.record.trans_eval,
      trans1_file:this.state.record.trans1_file,
      trans2_file:this.state.record.trans2_file,
    }
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


	render() {

    let { list,show,record,showImg } = this.state


    const columns = [{
        title: 'ID',
        dataIndex: 'key',
        key: 'key',
        width: '80px',
        ...this.getColumnSearchProps('key'),
      },{
        title: '流水号',
        dataIndex: 'sid',
        width: '125px',
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
        title: '著者',
        dataIndex: 'rec_auth',
        key: 'rec_auth',
        ...this.getColumnSearchProps('sid'),
      },{
        title: '操作',
        key: 'action',
        width: '100px',
        render: (text, record, index) => (
          < >
            {(record.exist == 1)&&(record.status != 1) && (record.status != 3) && <Button type="default" icon="file" onClick={this.doEdit.bind(this,record)}>详情</Button> }
            {(record.exist == 1)&&(record.status == 1) && <Button type="primary" icon="edit" onClick={this.doEdit.bind(this,record)}>开始编辑</Button> }
            {(record.exist == 1)&&(record.status == 3) && <Button className="c-orange" type="primary" icon="edit" onClick={this.doEdit.bind(this,record)}>开始编辑</Button> }
          </>
        ),
      },
    ];

    const { getFieldDecorator } = this.props.form;

		return (
      <div className="g-list">
        <div className="m-list">
          <Table size='small' dataSource={list} columns={columns}/>
        </div>
        
        {(show) && (record !== undefined) &&
        <div className="m-detail">
          <div className="m-detail-wrap">
            <div className="m-main">
              <div className="m-sid">
                <i>id: </i>
                <label>{record.key}</label>
                <i>操作员: </i>
                <label>s{parseInt(record.key/list.length*10)+1}</label>
                <span>{record.rec_med}</span>
              </div>
              
              <div className="m-book">
                <div className="m-title">{record.rec_name}</div>
                <div className="m-trans">
                  <div>
                    <label>著者</label><Tag>{record.rec_auth}</Tag>
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
                    <label>印数(册)</label><Tag>{record.rec_print}</Tag>
                  </div>
                  <div>
                    <label>字数(万)</label><Tag>{record.rec_letter}</Tag>
                  </div>
                </div>
                <div className="m-trans">
                  <div>
                    <label>涉及学科</label><Tag>{record.rec_sub}</Tag>
                  </div>
                  <div>
                    <label>建议译文</label><Tag>{record.rec_trans}</Tag>
                  </div>
                </div>
              </div>
              
              <div className="m-row-s">
                <label>推荐理由</label>
                <span>{record.rec_reason}</span>
              </div>
              <div className="m-row-s">
                <label>成果简介</label>
                <textarea rows="15" defaultValue={record.rec_info}></textarea>
                <span></span>
              </div>
              <div className="m-row-s">
                <label>是否有外方出版意向 {record.rec_cop}</label>
                
              </div>
              <div className="m-row">
                <label>外文名</label>
                <span>{record.rec_cop_en}</span>
              </div>
              <div className="m-row">
                <label>中文名</label>
                <span>{record.rec_cop_zh}</span>
              </div>
            </div>

            <div className="m-form">

              <div className="m-tl">
                <span>中国知网评价指标（第一列为著作指标，第二列为著者指标）</span>
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
                  <Input placeholder="著者" className="u-num"
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
                  <Input placeholder="著者" className="u-num"
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
                  <Input placeholder="著者" className="u-num"
                    onChange={this.doUpdate.bind(this,'zhi_avg_p')}
                    value = {this.state.record.zhi_avg_p}
                  />
                </div>
              </div>
              <div className="m-row">
                <div className="m-g">
                  <span className="u-tl">全部文献</span>
                  <Input placeholder="著作" className="u-num"
                    onChange={this.doUpdate.bind(this,'zhi_alld_d')}
                    value = {this.state.record.zhi_alld_d}
                  />
                  <Input placeholder="著者" className="u-num"
                    onChange={this.doUpdate.bind(this,'zhi_alld_p')}
                    value = {this.state.record.zhi_alld_p}
                  />
                </div>
                <div className="m-g">
                  <span className="u-tl">核心期刊引</span>
                  <Input placeholder="著作" className="u-num"
                    onChange={this.doUpdate.bind(this,'zhi_core_d')}
                    value = {this.state.record.zhi_core_d}
                  />
                  <Input placeholder="著者" className="u-num"
                    onChange={this.doUpdate.bind(this,'zhi_core_p')}
                    value = {this.state.record.zhi_core_p}
                  />
                </div>
              </div>
              <div className="m-row">
                <div className="m-g">
                  <span className="u-tl">CSSCI引</span>
                  <Input placeholder="著作" className="u-num"
                    onChange={this.doUpdate.bind(this,'zhi_cssci_d')}
                    value = {this.state.record.zhi_cssci_d}
                  />
                  <Input placeholder="著者" className="u-num"
                    onChange={this.doUpdate.bind(this,'zhi_cssci_p')}
                    value = {this.state.record.zhi_cssci_p}
                  />
                </div>
                <div className="m-g">
                  <span className="u-tl">CSCD引</span>
                  <Input placeholder="著作" className="u-num"
                    onChange={this.doUpdate.bind(this,'zhi_cscd_d')}
                    value = {this.state.record.zhi_cscd_d}
                  />
                  <Input placeholder="著者" className="u-num"
                    onChange={this.doUpdate.bind(this,'zhi_cscd_p')}
                    value = {this.state.record.zhi_cscd_p}
                  />
                </div>
              </div>


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
                <div className="m-g">
                  <span className="u-tl">引用指数</span>
                  <Input className="u-num"
                    onChange={this.doUpdate.bind(this,'cao_index')}
                    value = {this.state.record.cao_index}
                  />
                </div>
              </div>


              <div className="m-tl">
                <span>CSSCI系统</span>
                { (this.state.record.cssci_file) && 
                  <img src={`${API_SERVER}/${this.state.record.cssci_file}`} 
                       onClick={this.doShowImg.bind(this,this.state.record.cssci_file)} /> }
                
              </div>
              
              <div className="m-row">
                <div className="m-g">
                  <span className="u-tl">被引次数</span>
                  <Input className="u-num"
                    onChange={this.doUpdate.bind(this,'cssci_quote')}
                    value = {this.state.record.cssci_quote}
                  />
                </div>
              </div>


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
                  <span className="u-tl">二星比例</span>
                  <Input className="u-num"
                    onChange={this.doUpdate.bind(this,'dou_start2')}
                    value = {this.state.record.dou_start2}
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


              <div className="m-tl">
                <span>国际传播指标</span>
              </div>

              <div className="m-row">
                <div className="m-g">
                  <span className="u-tl">中文关键词</span>
                  <Input className="u-keyword-c"
                    onChange={this.doUpdate.bind(this,'int_key_cn')}
                    value = {this.state.record.int_key_cn}
                  />
                </div>
                <div className="m-g m-g-e">
                  <span className="u-tl">外文关键词</span>
                  <Input className="u-keyword-e"
                    onChange={this.doUpdate.bind(this,'int_key_en')}
                    value = {this.state.record.int_key_en}
                  />
                </div>
              </div>

              {(record.status != 0) && 
              <>
              <div className="m-tl">
                <span>Web of Science(SSCI、A&HCI)</span>
                { (this.state.record.ws1_file) && 
                  <img src={`${API_SERVER}/${this.state.record.ws1_file}`} 
                       onClick={this.doShowImg.bind(this,this.state.record.ws1_file)} /> }
                
                { (this.state.record.ws2_file) && 
                  <img src={`${API_SERVER}/${this.state.record.ws2_file}`} 
                       onClick={this.doShowImg.bind(this,this.state.record.ws2_file)} /> }
              </div>
              <div className="m-row">
                <div className="m-g">
                  <span className="u-tl">检索结果数</span>
                  <Input className="u-num"
                    onChange={this.doUpdate.bind(this,'ws_ret')}
                    value = {this.state.record.ws_ret}
                  />
                </div>
                <div className="m-g">
                  <span className="u-tl">高被引论文数</span>
                  <Input className="u-num"
                    onChange={this.doUpdate.bind(this,'ws_high')}
                    value = {this.state.record.ws_high}
                  />
                </div>
                <div className="m-g">
                  <span className="u-tl">热点论文数</span>
                  <Input className="u-num"
                    onChange={this.doUpdate.bind(this,'ws_hot')}
                    value = {this.state.record.ws_hot}
                  />
                </div>
                <div className="m-g">
                  <span className="u-tl">开放获取数</span>
                  <Input className="u-num"
                    onChange={this.doUpdate.bind(this,'ws_open')}
                    value = {this.state.record.ws_open}
                  />
                </div>
              </div>
              <div className="m-row-c">
                <span className="u-tl">近10年每年发表数</span>

                <div className="m-p">
                  <span>2010</span>
                  <span>2011</span>
                  <span>2012</span>
                  <span>2013</span>
                  <span>2014</span>
                  <span>2015</span>
                  <span>2016</span>
                  <span>2017</span>
                  <span>2018</span>
                  <span>2019</span>
                </div>
                <div className="m-p">
                  <Input onChange={this.doUpdate.bind(this,'ws_2010')} value = {this.state.record.ws_2010}></Input>
                  <Input onChange={this.doUpdate.bind(this,'ws_2011')} value = {this.state.record.ws_2011}></Input>
                  <Input onChange={this.doUpdate.bind(this,'ws_2012')} value = {this.state.record.ws_2012}></Input>
                  <Input onChange={this.doUpdate.bind(this,'ws_2013')} value = {this.state.record.ws_2013}></Input>
                  <Input onChange={this.doUpdate.bind(this,'ws_2014')} value = {this.state.record.ws_2014}></Input>
                  <Input onChange={this.doUpdate.bind(this,'ws_2015')} value = {this.state.record.ws_2015}></Input>
                  <Input onChange={this.doUpdate.bind(this,'ws_2016')} value = {this.state.record.ws_2016}></Input>
                  <Input onChange={this.doUpdate.bind(this,'ws_2017')} value = {this.state.record.ws_2017}></Input>
                  <Input onChange={this.doUpdate.bind(this,'ws_2018')} value = {this.state.record.ws_2018}></Input>
                  <Input onChange={this.doUpdate.bind(this,'ws_2019')} value = {this.state.record.ws_2019}></Input>
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
              </>
              }
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
		)
	}
}

export default Form.create()(listData)
