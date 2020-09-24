-- 1313
-- select * from project p  where  p.status=5 and ret =1;  

-- 828
-- select * from project p  where  p.status=5 and ret =0;

-- 144
-- select *  from project p  where  p.status=4 and p.rec_med ='机构推荐' and p.id not in (2539,2540,2542,2912)
-- select * from project p  where  p.id=701

-- 15
-- select * from project p  where p.id in (2041,1256,1676,3059,2698,2539,2540,2542,2912,3026,2290,2338,2698,2706,2710,2875);

-- 789
-- 1. 首次输入 去掉期刊  2. 二次输入 8条  3. 最终评审 个人推荐
-- select *  from project p  where ( p.status=0 and p.id not in (3059,3026,2290,2338,2698,2706,2710,2875)) or p.status=2 or (p.status=4 and p.rec_med ='个人推荐' and p.id not in(2041,1256,1676) )


select 
  p.*,
  case p.ret_reason when '0' then '' when 'null' then '' else p.ret_reason end as ret_reason
from project p
left join audit a 
on p.id=a.pid 
where 
  p.id in (759,1249,1306,1901,1906,2216)





-- 1313
-- select * from project p  where  p.status=5 and ret =1;  

-- 828
-- select * from project p  where  p.status=5 and ret =0;

-- 144
-- select *  from project p  where  p.status=4 and p.rec_med ='机构推荐' and p.id not in (2539,2540,2542,2912)
-- select * from project p  where  p.id=701

-- 15
-- select * from project p  where p.id in (2041,1256,1676,3059,2698,2539,2540,2542,2912,3026,2290,2338,2698,2706,2710,2875);

-- 789
-- 1. 首次输入 去掉期刊  2. 二次输入 8条  3. 最终评审 个人推荐
-- select *  from project p  where ( p.status=0 and p.id not in (3059,3026,2290,2338,2698,2706,2710,2875)) or p.status=2 or (p.status=4 and p.rec_med ='个人推荐' and p.id not in(2041,1256,1676) )


select 
  p.id,p.sid,p.rec_name,p.rec_press,p.rec_auth,p.rec_sub,p.rec_trans,p.rec_cop,
  a.zhi_all_d,a.zhi_all_p,a.zhi_allq_d,a.zhi_allq_p,a.zhi_avg_d,a.zhi_avg_p,a.zhi_alld_d,a.zhi_alld_p,a.zhi_core_d,a.zhi_core_p,a.zhi_cssci_d,a.zhi_cssci_p,a.zhi_cscd_d,a.zhi_cscd_p,a.cao_fav,a.cao_all,a.cao_quote,a.cao_index,a.cssci_quote,a.dou_mark,a.dou_start2,a.dou_star1,a.int_key_cn,a.int_key_en,a.ws_ret,a.ws_high,a.ws_hot,a.ws_open,a.ws_2010,a.ws_2011,a.ws_2012,a.ws_2013,a.ws_2014,a.ws_2015,a.ws_2016,a.ws_2017,a.ws_2018,a.ws_2019,a.trans_eval,
  p.ret,
  case p.ret_reason when '0' then '' when 'null' then '' else p.ret_reason end as ret_reason
from project p
left join audit a 
on p.id=a.pid 
where 
( p.status=0 and p.id not in (701,3059,3026,2290,2338,2698,2706,2710,2875)) or p.status=2 or (p.status=4 and p.rec_med ='个人推荐' and p.id not in(2041,1256,1676) )




