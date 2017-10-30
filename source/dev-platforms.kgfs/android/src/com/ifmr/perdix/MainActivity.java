/*
       Licensed to the Apache Software Foundation (ASF) under one
       or more contributor license agreements.  See the NOTICE file
       distributed with this work for additional information
       regarding copyright ownership.  The ASF licenses this file
       to you under the Apache License, Version 2.0 (the
       "License"); you may not use this file except in compliance
       with the License.  You may obtain a copy of the License at

         http://www.apache.org/licenses/LICENSE-2.0

       Unless required by applicable law or agreed to in writing,
       software distributed under the License is distributed on an
       "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
       KIND, either express or implied.  See the License for the
       specific language governing permissions and limitations
       under the License.
 */

package com.ifmr.perdix;

import android.os.Bundle;
import android.webkit.WebView;

import org.apache.cordova.*;

public class MainActivity extends CordovaActivity implements IntegrationApi.IntegrationHandler {

    private IntegrationApi integrationApi = null;
    private WebView webView = null;

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // Set by <content src="index.html" /> in config.xml
        loadUrl("file:///android_asset/www/index.html"); // integration

        integrationApi = new IntegrationApi(this, Perdix8Activity.class);
        webView = integrationApi.start(appView);

        if (savedInstanceState != null) {
            webView.restoreState(savedInstanceState);
        }

/*
    new Timer().schedule(new TimerTask() {
        @Override
        public void run() {
            // this code will be executed after 2 seconds
        }
    }, 2000);
*/
    }

    @Override
    public boolean preSwitch() {
        System.out.println(">>>>launchUrl:" + launchUrl);
        final String oauthToken = integrationApi.getCookie(launchUrl, "oauth_token");
        System.out.println(">>>>oauthToken:" + oauthToken);
        webView.postDelayed(new Runnable() {
            @Override
            public void run() {
                loadUrl("javascript: localStorage.setItem('AuthData','{\"access_token\":\"" + oauthToken + "\"}')");
                loadUrl("javascript: if(location.hash == '#/Login') { location.hash = '#/' + irf.HOME_PAGE.url }");
            }
        }, 0);
        return true;
    }

    @Override
    public void onSaveInstanceState(Bundle outState) {
        webView.saveState(outState);
    }

    @Override
    public void onStop() {
        super.onStop();

    }

    @Override
    public void onRestart() {
        super.onRestart();
    }

    @Override
    public void onBackPressed() {
        super.onBackPressed();
    }
}
