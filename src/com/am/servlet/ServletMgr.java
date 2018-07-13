package com.am.servlet;

import java.io.IOException;
import java.io.Writer;
import java.util.ArrayList;
import java.util.List;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.httpclient.util.DateUtil;
import org.apache.log4j.Logger;
import org.apache.noggit.JSONUtil;

import com.am.constant.ConstantAm;
import com.am.qrcode.QRCodeUtil;
import com.am.qrcode.QrcodeMgr;
import com.am.token.TokenMgr;
import com.am.util.AccessToken;
import com.am.util.UtileAm;
import com.ctc.wstx.util.DataUtil;
import com.rh.core.base.Bean;
import com.rh.core.base.Context;
import com.rh.core.util.DateUtils;
import com.rh.core.util.Lang;
import com.sun.org.apache.bcel.internal.generic.NEW;

/**
 * 
 * @author huhua
 *
 */
public class ServletMgr extends HttpServlet {

	private static final long serialVersionUID = 1L;
	private Logger log = Logger.getLogger(ServletMgr.class);

	public ServletMgr() {
		super();
	}

	public void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		response.setContentType("text/html;charset=utf-8");
		/* 设置响应头允许ajax跨域访问 */
		response.setHeader("Access-Control-Allow-Origin", "*");
		/* 星号表示所有的异域请求都可以接受， */
		response.setHeader("Access-Control-Allow-Methods", "GET,POST");
		// 获取微信小程序get的参数值并打印
        String writestr = "";
		String flag = request.getParameter("flag");
		if (flag.equals("qrcode")) {//二维码
			String qrcode_wxid = request.getParameter("qrcode_wxid");
			String qrcontent = request.getParameter("qrcontent");
			writestr = new QrcodeMgr().createRrcode(request,qrcontent,qrcode_wxid);
		} else if (flag.equals("token")) {//获取token
			TokenMgr tokenMgr = new TokenMgr();
			String toke = tokenMgr.TokenMoment().getStr("TOKEN");
			System.out.println("0000000000000" + toke);
		} else if(flag.equals("usercode")){//获取用户open-id
			String code = request.getParameter("code");
			UtileAm utileAm = new UtileAm();
			writestr = utileAm.getUserLogin(ConstantAm.APPID, ConstantAm.APPSECRET, code).getOpenid();
		}else if(flag.equals("getQrlist")){//获取二维码列表
			String openid = request.getParameter("openid");
			writestr = JSONUtil.toJSON(new QrcodeMgr().getQrcodeList(openid));
		}

		Writer out = response.getWriter();
		out.write(writestr);
		out.flush();
		out.close();
	}

	/**
	 * 存储用户
	 * 
	 * @param nickName
	 * @param avatarUrl
	 * @param gender
	 */
	public void createUser(String nickName, String avatarUrl, String gender) {
		String qsql = "SELECT * FROM ams_user  where USER_NICKNAME='" + nickName + "'";
		Integer i = 0;
		i = Context.getExecutor().count(qsql);
		if (i > 0) {
			return;
		}
		String sql = "insert into ams_user (user_id,USER_NICKNAME,USER_URL,USER_XB)value('" + Lang.getUUID() + "','"
				+ nickName + "','" + avatarUrl + "','" + gender + "')";
		Context.getExecutor().execute(sql);
	}

	public List<Bean> getUserList() {
		String sql = "select * from ams_user";
		List<Bean> ulist = new ArrayList<Bean>();
		ulist = Context.getExecutor().query(sql);
		return ulist;
	}

}
