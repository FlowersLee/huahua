package com.am.token;

import com.am.constant.ConstantAm;
import com.am.util.AccessToken;
import com.am.util.UtileAm;
import com.rh.core.base.Bean;
import com.rh.core.base.Context;
import com.rh.core.util.DateUtils;

/**
 * 
 * @author huahua
 *
 */
public class TokenMgr {
	// accessToken
		public Bean TokenMoment() {
			Bean bean = new Bean();
			String sql = "select * from AM_TOKEN";
			Bean tokenBean = Context.getExecutor().queryOne(sql);
			System.out.println("查token呢");
			int expires = 0;
			long _time = 0;
			String atime = "";
			String token = "";
			if (tokenBean != null) {
				expires = tokenBean.getInt("TOKEN_EXPIRES_IN");
				atime = tokenBean.getStr("S_ATIME");
				_time = Long.parseLong(atime);
			}
			System.out.println(expires);
			System.out.println(System.currentTimeMillis());
			System.out.println(_time);
			if (tokenBean != null && (System.currentTimeMillis() - _time) / 1000 < expires) {// 有效
				bean.set("TOKEN", tokenBean.getStr("TOKEN_INFO"));

				System.out.println("持久token~~~~~~~~");
			} else {
				try {
					AccessToken at = new AccessToken();
					at = UtileAm.getAccessToken(ConstantAm.APPID, ConstantAm.APPSECRET);
					token = at.getToken();
					expires = at.getExpiresIn();
					String delSql = "delete from am_token";
					Context.getExecutor().execute(delSql);
					// Transaction.getExecutor().execute(delSql);
					String insertSql = "insert into AM_TOKEN(TOKEN_ID,TOKEN_INFO,TOKEN_EXPIRES_IN,S_MTIME,S_ATIME) VALUES('woshidameinv','"
							+ token + "'," + expires + ",'" + DateUtils.getDatetime() + "','" + System.currentTimeMillis()
							+ "')";
					Context.getExecutor().execute(insertSql);
					bean.set("TOKEN", token);
					System.out.println("新的token~~~~~~~~");
				} catch (Exception e) {
					System.out.println("更新token失败~~~~~" + e);
				}
			}
			return bean;
		}
}
