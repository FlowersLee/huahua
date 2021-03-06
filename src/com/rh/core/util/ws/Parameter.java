package com.rh.core.util.ws;

import java.util.Iterator;

import org.dom4j.Element;

/**
 * 参数
 * 
 * @author wanghg
 */
public class Parameter {
	private String name;
	private String type;
    //为了适应参数为集合的需求新增字段
    private String maxOccurs;
	private Element ele;

	/**
	 * 参数
	 * 
	 * @param name
	 *            名称
	 * @param type
	 *            类型
	 */
	public Parameter(String name, String type) {
		this.name = name;
		this.type = type;
		if(type.indexOf("maxO=")>=0){
			this.maxOccurs = type.substring(type.indexOf("maxO=")+5);
		}
	}

	/**
	 * 基于xml元素构造
	 * 
	 * @param ele
	 *            元素
	 */
	public Parameter(Element ele) {
		this.name = ele.attributeValue("name");
		this.type = ele.attributeValue("type");
        //为了适应参数为集合的需求新增字段
		if(ele.attributeValue("maxOccurs")!=null&&!"".equals(ele.attributeValue("maxOccurs"))){
			this.maxOccurs = ele.attributeValue("maxOccurs");
		}else if(this.type.indexOf("maxO=")>=0){
			this.maxOccurs = this.type.substring(this.type.indexOf("maxO=")+5);
		}
		if (isObjectType()) { // 自定义对象
			this.ele = ele;
		}
	}

	/**
	 * 获取类型
	 * 
	 * @return 类型
	 */
	public String getType() {
		if (this.ele != null) {
			return getType(this.ele, this.name);
		} else {
			return type;
		}
	}

	/**
	 * 设置类型
	 * 
	 * @param type
	 *            类型
	 */
	public void setType(String type) {
		this.type = type;
	}

	/**
	 * 获取名称
	 * 
	 * @return 名称
	 */
	public String getName() {
		return name;
	}

	/**
	 * 设置名称
	 * 
	 * @param name
	 *            名称
	 */
	public void setName(String name) {
		this.name = name;
	}
	
	

	public String getMaxOccurs() {
		return maxOccurs;
	}

	public void setMaxOccurs(String maxOccurs) {
		this.maxOccurs = maxOccurs;
	}

	/**
	 * 是不是对象类型
	 * 
	 * @return 是不是对象类型
	 */
	public boolean isObjectType() {
		return isObjectType(this.type);
	}

	/**
	 * 将数据类型描述到xml元素中
	 * 
	 * @param parent
	 *            父元素
	 */
	public void typeToXml(Element parent) {
		typeToXml(parent, this.ele, this.name);
	}

	/**
	 * 将数据类型描述到xml元素中
	 * 
	 * @param root
	 *            跟元素
	 * @param parent
	 *            父元素
	 */
	public void returnToXml(Element root, Element parent) {
		returnToXml(root, parent, this.ele, this.name);
	}

	/**
	 * 是不是对象类型
	 * 
	 * @param type
	 *            类型
	 * @return 是不是对象类型
	 */
	public static boolean isObjectType(String type) {
		return type.startsWith("tns:");
	}

	/**
	 * 将数据类型描述到xml元素中
	 * 
	 * @param parent
	 *            父元素
	 * @param ele
	 *            元素
	 * @param name
	 *            名称
	 */
	public static void typeToXml(Element parent, Element ele, String name) {
		if (ele != null) {
			Iterator<?> it = ele.elementIterator();
			Element etype = parent.addElement("xs:complexType");
			etype.addAttribute("name", name);
			Element seq = etype.addElement("xs:sequence");
			Element cele;
			Element aele;
			while (it.hasNext()) {
				cele = (Element) it.next();
				aele = seq.addElement("xs:element");
				aele.addAttribute("name", cele.getName());
				 //为了适应参数为集合的需求新增字段
                if(cele.attributeValue("maxOccurs")!=null&&!"".equals(cele.attributeValue("maxOccurs"))){
                	aele.addAttribute("maxOccurs",  cele.attributeValue("maxOccurs"));
                }
				aele.addAttribute("type", getType(cele, cele.getName()));
				if (isObjectType(cele.attributeValue("type"))) {
					typeToXml(parent, cele, cele.getName());
				}
			}
		}
	}

	/**
	 * 将数据类型描述到xml元素中
	 * 
	 * @param parent
	 *            父元素
	 * @param root
	 *            跟元素
	 * @param ele
	 *            元素
	 * @param name
	 *            名称
	 */
	public static void returnToXml(Element root, Element parent, Element ele,
			String name) {
		if (ele != null) {
			Iterator<?> it = ele.elementIterator();

			Element cele;
			Element aele;
			while (it.hasNext()) {
				cele = (Element) it.next();
				aele = parent.addElement("xs:element");
				aele.addAttribute("name", cele.getName());
				//为了适应参数为集合的需求新增字段
                if(cele.attributeValue("maxOccurs")!=null&&!"".equals(cele.attributeValue("maxOccurs"))){
                	aele.addAttribute("maxOccurs",  cele.attributeValue("maxOccurs"));
                }
				aele.addAttribute("type", getType(cele, cele.getName()));
				if (isObjectType(cele.attributeValue("type"))) {
					typeToXml(root, cele, cele.getName());
				}
			}
		}
	}

	/**
	 * 获取类型
	 * 
	 * @param ele
	 *            元素
	 * @param name
	 *            名称
	 * @return 类型
	 */
	private static String getType(Element ele, String name) {
		if (isObjectType(ele.attributeValue("type"))) {
			return "tns:" + name;
		} else {
			return ele.attributeValue("type");
		}
	}
}
