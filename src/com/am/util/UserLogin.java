package com.am.util;

public class UserLogin {
	// 用户唯一标识 
    private String openid;  
	// 会话密钥
	private String session_key;
	   
	public String getOpenid() {
		return openid;
	}
	public void setOpenid(String openid) {
		this.openid = openid;
	}
	public String getSession_key() {
		return session_key;
	}
	public void setSession_key(String session_key) {
		this.session_key = session_key;
	}  
}
