/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var onBackKeyDown = function(e) {
    e.preventDefault();
    e.preventBubble();
    return false;
}

var CDVPermissionManager = {
    getListOfPermissions: function(){
        var cdvPermissions = cordova.plugins.permissions;
        var listOfPermissions = [
            cdvPermissions.BLUETOOTH,
            cdvPermissions.BLUETOOTH_ADMIN,
            cdvPermissions.ACCESS_COARSE_LOCATION,
            cdvPermissions.ACCESS_FINE_LOCATION,
            cdvPermissions.CAMERA,
            cdvPermissions.FLASHLIGHT,
            cdvPermissions.WRITE_EXTERNAL_STORAGE,
            cdvPermissions.READ_EXTERNAL_STORAGE,
            cdvPermissions.READ_PHONE_STATE
        ];
        return listOfPermissions;
    },
    checkPermissions: function(success, error){
        success = success || function(){};
        error = error || function(){};

        var listOfPermissions = this.getListOfPermissions();
        var cdvPermissions = cordova.plugins.permissions;
        cdvPermissions.hasPermission(listOfPermissions, function(status){
            if (!status.hasPermission){
                cdvPermissions.requestPermissions(listOfPermissions, function(status){
                    if (!status.hasPermission) error(status)
                    success(status);
                }, function(error){
                    error(status);
                })
            }
        });
    }

}

var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
        document.addEventListener("backbutton", onBackKeyDown, false);

        /** 
         * Ensuring required permissions are set for the application
         */
        if (cordova.plugins && cordova.plugins.permissions) {
            CDVPermissionManager.checkPermissions();
        }
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        console.log('Received Event: ' + id);
    }
};

app.initialize();