package com.ams;

import java.io.IOException;
import java.io.PrintWriter;
import java.io.Writer;
import java.util.ArrayList;
import java.util.List;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.log4j.Logger;
import org.apache.noggit.JSONUtil;

import com.rh.core.base.Bean;
import com.rh.core.base.Context;
import com.rh.core.base.db.Transaction;
import com.rh.core.util.JsonUtils;
import com.rh.core.util.Lang;

import net.sf.json.JSONObject;


public class WxServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
	private Logger log = Logger.getLogger(WxServlet.class);
	public WxServlet() {
		super();
	}
	public void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
        response.setContentType("text/html;charset=utf-8");          
        /* 设置响应头允许ajax跨域访问 */  
        response.setHeader("Access-Control-Allow-Origin", "*");  
        /* 星号表示所有的异域请求都可以接受， */  
        response.setHeader("Access-Control-Allow-Methods", "GET,POST");  
        //获取微信小程序get的参数值并打印
        String nickName = request.getParameter("nickName");
        String avatarUrl = request.getParameter("avatarUrl");
        String gender = request.getParameter("gender");
        createUser(nickName,avatarUrl,gender);
        //返回值给微信小程序
      //  getUserList();
    //    String users = getUserList().toString();
      //  String users = JSONObject.fromObject(getUserList()).toString();
       // String users = JsonUtils.toJson(getUserList()).toString().replaceAll("\n","").replaceAll("/","");
       String users = JSONUtil.toJSON(getUserList());
        System.out.println("0000000000000"+users);
        Writer out = response.getWriter(); 
        out.write(users);
        out.flush();   
        out.close();
	}
	/**
	 * 存储用户
	 * @param nickName
	 * @param avatarUrl
	 * @param gender
	 */
	public void createUser(String nickName,String avatarUrl,String gender){
		String qsql = "SELECT * FROM ams_user  where USER_NICKNAME='"+nickName+"'";
		Integer i = 0;
		 i =  Context.getExecutor().count(qsql);
		if (i>0) {
			return;
		}
		String sql = "insert into ams_user (user_id,USER_NICKNAME,USER_URL,USER_XB)value('"+Lang.getUUID()+"','"+nickName+"','"+avatarUrl+"','"+gender+"')";
		Context.getExecutor().execute(sql);
	}
	
	public List<Bean> getUserList(){
		String sql = "select * from ams_user";
		List<Bean> ulist = new ArrayList<Bean>();
		ulist =Context.getExecutor().query(sql);
		return  ulist;
	}
}
