package com.ifmr.perdix;

import android.app.Activity;
import android.content.Intent;
import android.webkit.CookieManager;
import android.webkit.JavascriptInterface;
import android.webkit.WebView;

import org.apache.cordova.CordovaWebView;

import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;

/**
 * Created by Stalin.Solomon on 13-02-2017.
 */
public class IntegrationApi {

    public static interface IntegrationHandler {
        boolean preSwitch();
    }

    private Activity activity;
    private Class<? extends Activity> toActivityClass;

    public IntegrationApi(Activity activity, Class<? extends Activity> toActivityClass) {
        this.activity = activity;
        this.toActivityClass = toActivityClass;
    }

    @JavascriptInterface
    public void switchApp() {
        if (activity instanceof IntegrationHandler) {
            boolean proceed = ((IntegrationHandler)activity).preSwitch();
            if (proceed) {
                activity.startActivity(new Intent(activity, toActivityClass));
            }
        } else {
            activity.startActivity(new Intent(activity, toActivityClass));
        }
    }

    public WebView start(CordovaWebView appView) {
        WebView wv = (WebView)(appView.getEngine().getView());
        wv.addJavascriptInterface(this, "integrationApi");
        return wv;
    }

    public String getCookie(String siteName, String CookieName){
        String CookieValue = null;
        CookieManager cookieManager = CookieManager.getInstance();
        String cookies = cookieManager.getCookie(siteName);
        if(cookies != null){
            String[] temp=cookies.split(";");
            for (String ar1 : temp ){
                if(ar1.contains(CookieName)){
                    String[] temp1=ar1.split("=");
                    CookieValue = temp1[1];
                }
            }
        }
        return CookieValue;
    }

    public String readFileContent(String fileUrl) {
        try {
            StringBuilder buf = new StringBuilder();
            InputStream json = this.activity.getAssets().open(fileUrl);
            BufferedReader in = new BufferedReader(new InputStreamReader(json, "UTF-8"));
            String str;

            while ((str = in.readLine()) != null) {
                buf.append(str);
            }
            in.close();
            return buf.toString();
        } catch (Exception e) {
            return null;
        }
    }
}
