package com.am.qrcode;

import java.util.ArrayList;
import java.util.List;

import javax.servlet.http.HttpServletRequest;

import com.am.constant.ConstantAm;
import com.hg.sql.func.Function;
import com.rh.core.base.Bean;
import com.rh.core.base.Context;
import com.rh.core.base.db.Transaction;
import com.rh.core.serv.CommonServ;
import com.rh.core.util.DateUtils;
import com.rh.core.util.Lang;

/**
 * 
 * 二维码
 * @author huahua
 *
 */
public class QrcodeMgr extends CommonServ{
	
	public String getContent(String qrid){
		String content = "";
		String sql = "select * from am_qrcode where qrcode_paramid='"+qrid+"'";
		Bean qrcode = Transaction.getExecutor().queryOne(sql);
		if (qrcode!=null) {
			content = qrcode.getStr("qrcode_content");
		}
		return content;
	}

	/**
	 * 创建二维码
	 * 
	 * @param request
	 */
	public String createRrcode(HttpServletRequest request,String qrcontent,String qrcode_wxid) {
		String qrcodeurl="";
		QRCodeUtil qrCodeUtil = new QRCodeUtil();
		try {
			String newid = Lang.getUUID();			
			qrCodeUtil.creatm(request,newid);
			qrcodeurl = ConstantAm.APPURL  + "/image/qrcode/m/"+newid+".jpg";
			String sql = "insert into am_qrcode values ('"+Lang.getUUID()+"','"+qrcontent+"','"+DateUtils.getDate()+"','"+qrcode_wxid+"','"+newid+"','"+qrcodeurl+"')";
			Context.getExecutor().execute(sql);
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return qrcodeurl;
	}
	
	/**
	 * 创建连接二维码
	 * 
	 * @param request
	 */
	public String createRrcodeLj(HttpServletRequest request,String qrcontent,String qrcode_wxid) {
		String qrcodeurl="";
		QRCodeUtil qrCodeUtil = new QRCodeUtil();
		try {
			String newid = Lang.getUUID();			
			qrCodeUtil.creatmLj(request,newid,qrcontent);
			qrcodeurl = ConstantAm.APPURL  + "/image/qrcode/m/"+newid+".jpg";
			String sql = "insert into am_qrcode values ('"+Lang.getUUID()+"','"+qrcontent+"','"+DateUtils.getDate()+"','"+qrcode_wxid+"','"+newid+"','"+qrcodeurl+"')";
			Context.getExecutor().execute(sql);
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return qrcodeurl;
	}
	
	/**
	 * 
	 * 获取二维码列表 by openid
	 * @param openid
	 * @return
	 */
	public List<Bean> getQrcodeList(String openid){
		String sql = "select qrcode_id,left(qrcode_content,20)qrcode_content,qrcode_imageurl from am_qrcode  where qrcode_wxid='"+openid+"'";
		List<Bean> ulist = new ArrayList<Bean>();
		ulist =Context.getExecutor().query(sql);
		return  ulist;
	}
	
	/**
	 * 删除二维码
	 * @param id
	 */
	public void delQrcode(String id){		
		String sql ="delete from  am_qrcode where qrcode_id ='"+id+"'";
		Context.getExecutor().execute(sql);
	}
	
	/**
	 * 查询二维码地址
	 * @param id
	 * @return
	 */
	public String queryQrUrl(String id){
		String urlString ="";
		String sql ="select qrcode_imageurl from  am_qrcode where qrcode_id ='"+id+"'";
		Bean bean = Context.getExecutor().queryOne(sql);
		if (bean!=null) {
			urlString = bean.getStr("qrcode_imageurl");
		}
		System.out.println("======"+urlString);
		return urlString;
	}
}
