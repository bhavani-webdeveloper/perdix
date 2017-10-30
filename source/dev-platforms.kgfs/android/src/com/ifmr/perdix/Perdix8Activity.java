package com.ifmr.perdix;

import android.app.AlertDialog;
import android.content.DialogInterface;
import android.os.Bundle;
import android.os.Handler;
import android.webkit.WebView;

import org.apache.cordova.*;

/**
 * Created by Stalin.Solomon on 13-02-2017.
 */
public class Perdix8Activity extends CordovaActivity implements IntegrationApi.IntegrationHandler {

    private IntegrationApi integrationApi = null;
    private WebView webView = null;
    private final Handler handler = new Handler();

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        // Set by <content src="index.html" /> in config.xml
        loadUrl("file:///android_asset/www/index8.html");

        integrationApi = new IntegrationApi(this, MainActivity.class);
        webView = integrationApi.start(appView);

        if (savedInstanceState != null) {
            webView.restoreState(savedInstanceState);
        }

        handler.postDelayed(new Runnable() {
            @Override
            public void run() {
                loadUrl("javascript:" + integrationApi.readFileContent("www/i8.js"));
            }
        }, 100);
    }

    @Override
    public boolean preSwitch() {
        new AlertDialog.Builder(this)
                .setTitle("Data Clear Warning")
                .setMessage("Are you sure you want to move back to Perdix 7? Current operation data will be lost")
                .setPositiveButton(android.R.string.yes, new DialogInterface.OnClickListener() {
                    public void onClick(DialogInterface dialog, int which) {
                        finish();
                    }
                })
                .setNegativeButton(android.R.string.no, new DialogInterface.OnClickListener() {
                    public void onClick(DialogInterface dialog, int which) {
                        // do nothing
                    }
                })
                .setIcon(android.R.drawable.ic_dialog_alert)
                .show();
        return false;
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
