package com.test;

import java.io.IOException;

import org.apache.http.client.ClientProtocolException;

import com.am.qrcode.QRCodeUtil;

public class te {

	public static void main(String[] args) throws ClientProtocolException, IOException {
		new QRCodeUtil().createXqr();
	}
}
