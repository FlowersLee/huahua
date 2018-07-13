<style type="text/css">
<!--
.test_anfang_con table tr td {
	padding:3px 3px 3px 6px;
}

.test_anfang_con select{border:1px solid #666;}
.tbl_grid  td{border:1px solid #006699;}
.tbl_grid thead{background:#83b5cd;}
.tbl_grid tbody td{text-align:right}
.tbl_grid tbody tr td:first-child{text-align:left}
.tbl_grid{margin:0px 5px 10px 5px}
.tbl_title{text-align:center;margin-top:20px;margin-bottom:20px;font-size:16px;font-weight:bold;}
-->
</style>

<div id='test_anfang' class='portal-box'>
<div class='portal-box-title'><span class='portal-box-title-icon icon_portal_todo'></span>
	<span class="portal-box-title-label">${title}</span>
	<span class="portal-box-hideBtn  conHeanderTitle-expand"></span><span class="portal-box-more"><a href="#" onclick="openMore()"></a></span></div>
<div class='test_anfang_con'>

<table width="400" border="0">
  <tr style="height:30px">
    <td>业务条线</td>
    <td><select name="select5">
      <option>案防工作</option>
      <option>廉政工作</option>
    </select>
    </td>
    <td>业务类型</td>
    <td><select name="select2">
      <option value="0"></option>
      <option value="1">组织推动类</option>
      <option value="2">学习培训类</option>
      <option value="3">专业检查类</option>
      <option value="4">内控管理类</option>
      <option value="5">异常行为排查类</option>
      <option value="6">效能监察类</option>
      <option value="7">责任追究类</option>
      <option value="8">其它类</option>
    </select></td>
  </tr>
  <tr style="height:30px">
    <td>单位</td>
    <td colspan="3"><label>
      <input type="text" name="textfield" style="width:90%" />
    </label></td>
    </tr>
  <tr style="height:30px">
    <td>按年统计</td>
    <td><select name="select">
      <option value="2012">2012</option>
      <option value="2013">2013</option>
      <option value="2014">2014</option>
      <option value="2015">2015</option>
    </select>
    </td>
    <td>按月统计</td>
    <td><select name="select3">
	  <option value="0">-</option>
      <option value="1">1</option>
      <option value="2">2</option>
      <option value="3">3</option>
      <option value="4">4</option>
      <option value="5">5</option>
      <option value="6">6</option>
      <option value="7">7</option>
      <option value="8">8</option>
      <option value="9">9</option>
      <option value="10">10</option>
      <option value="11">11</option>
      <option value="12">12</option>
    </select>
    </td>
  </tr>
  <tr style="height:30px">
    <td>按季统计</td>
    <td colspan="3">
      <select name="select4">
        <option>一季度</option>
        <option>二季度</option>
        <option selected>三季度</option>
        <option>四季度</option>
      </select>
    </td>
  </tr>
  <tr style="height:30px">
    <td colspan="4" align="center"><label>
      <input type="submit" name="Submit" value=" 确定 " />&nbsp;&nbsp;
	  <input type="submit" name="Submit" value=" 清空 " />
    </label></td>
  </tr>
</table>
<div class="tbl_title">第三季度   案防事项统计表</div>
<table width="400" border="0" class="tbl_grid">
<thead>
  <tr>
    <td>&nbsp;</td>
    <td>组织推动</td>
    <td>学习培训</td>
    <td>专业检查</td>
    <td>内控管理</td>
    <td>异常行为排查</td>
    <td>效能检查</td>
    <td>责任追究</td>
    <td>其他</td>
  </tr>
</thead>
<tbody>
  <tr>
    <td>华夏总行</td>
    <td>5</td>
    <td>10</td>
    <td>1</td>
    <td>2</td>
    <td>2</td>
    <td>2</td>
    <td>3</td>
    <td>1</td>
  </tr>
  <tr>
    <td>北京</td>
    <td>1</td>
    <td>3</td>
    <td>1</td>
    <td>1</td>
    <td>0</td>
    <td>0</td>
    <td>0</td>
    <td>0</td>
  </tr>
  <tr>
    <td>温州</td>
    <td>0</td>
    <td>4</td>
    <td>1</td>
    <td>1</td>
    <td>1</td>
    <td>1</td>
    <td>1</td>
    <td>0</td>
  </tr>
  <tr>
    <td>广州</td>
    <td>1</td>
    <td>4</td>
    <td>1</td>
    <td>1</td>
    <td>0</td>
    <td>0</td>
    <td>0</td>
    <td>0</td>
  </tr>
  <tr>
    <td>武汉</td>
    <td>3</td>
    <td>3</td>
    <td>1</td>
    <td>1</td>
    <td>1</td>
    <td>1</td>
    <td>0</td>
    <td>6</td>
  </tr>
  <tr>
    <td>无锡</td>
    <td>2</td>
    <td>6</td>
    <td>8</td>
    <td>1</td>
    <td>4</td>
    <td>0</td>
    <td>9</td>
    <td>2</td>
  </tr>
  <tr>
    <td>大连</td>
    <td>5</td>
    <td>2</td>
    <td>0</td>
    <td>3</td>
    <td>1</td>
    <td>0</td>
    <td>1</td>
    <td>6</td>
  </tr>
  <tr>
    <td>重庆</td>
    <td>0</td>
    <td>5</td>
    <td>7</td>
    <td>9</td>
    <td>3</td>
    <td>2</td>
    <td>1</td>
    <td>4</td>
  </tr>
  <tr>
    <td>西安</td>
    <td>0</td>
    <td>7</td>
    <td>9</td>
    <td>1</td>
    <td>6</td>
    <td>3</td>
    <td>4</td>
    <td>2</td>
  </tr>
  <tr>
    <td>杭州</td>
    <td>8</td>
    <td>6</td>
    <td>1</td>
    <td>0</td>
    <td>8</td>
    <td>4</td>
    <td>5</td>
    <td>1</td>
  </tr>
</tbody>
</table>
</div>
</div>