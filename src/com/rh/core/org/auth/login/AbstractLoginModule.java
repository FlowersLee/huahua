package com.rh.core.org.auth.login;

import com.rh.core.base.Bean;
import com.rh.core.base.Context;
import com.rh.core.org.UserBean;
import com.rh.core.org.UserStateBean;
import com.rh.core.serv.OutBean;
import com.rh.core.serv.ParamBean;

/**
 * 抽象的认证模块累
 * 
 * @author cuihf
 * 
 */
public abstract class AbstractLoginModule implements LoginModule {

    /**
     * 验证用户身份
     * 
     * @param paramBean 传入的参数对象
     * @return 验证后的用户Bean
     */
    public abstract UserBean authenticate(Bean paramBean);

    /**
     * 用户身份认证接口
     * 
     * @param paramBean 传入的参数
     * @return 认证结果，SessionID，以及USER_CODE
     */
    public OutBean login(ParamBean paramBean) {
    	  UserBean userBean = authenticate(paramBean);
          OutBean outBean = new OutBean();
          if(paramBean.getBoolean("pwdSimpleFlag")) {//如果密码过于简单，无需设置session直接返回
          	outBean.set("USER_LOGIN_TYPE", userBean.getStr("USER_LOGIN_TYPE"))
          	.set("USER_EMAIL", userBean.getEmail())
          	.set("USER_NAME", userBean.getName())
          	.set("USER_CODE", userBean.getId())
          	.set("pwdSimpleFlag", paramBean.getBoolean("pwdSimpleFlag"));
          	return outBean;
          }
          //设用在线用户信息
          Context.setOnlineUser(userBean);
          UserStateBean user = Context.getOnlineUserState();
         
          outBean.setId(user.getId()).set("USER_CODE", user.getStr("USER_CODE"))
              .set("USER_TOKEN", user.getStr("USER_TOKEN"));//添加登陆方式
          return outBean;
    }
}
