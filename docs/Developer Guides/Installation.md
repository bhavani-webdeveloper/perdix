#Installation

##Prerequisites
1. Install [node.js](https://nodejs.org/en/)
2. Install [git](https://git-scm.com/)
3. Install [XAMPP](https://www.apachefriends.org/index.html) to `xamppDir` (let `xamppDir` be `C:\xampp`)

##Setting up IRF Elements
1. Create a folder in the directory `webRoot`(`xamppDir/htdocs`) called `perdix`
2. Clone the **irf-elements** project `perdix` directory
    - Right click in the `perdix` directory and open "git bash" from the menu
    - use command `git clone https://<USERNAME>@bitbucket.org/IRF/irf-elements.git`
3. Clone **ir-perdix-view** project into the `perdix` directory
    - Right click in the `perdix` directory and open "git bash" from the menu
    - use command `git clone https://<USERNAME>@bitbucket.org/IRF/ir-perdix-view.git`
4. From git bash,
    - Navigate to the **irf-elements** directory (`cd irf-elements`)
        - run `npm install` and wait for the process to complete
        - run `bower link` and note the link name (if done like above, it will be `irf-elements`)

##Setting up Perdix
1. Navigate to **ir-perdix-view** directory (`cd ../ir-perdix-view` from **irf-elements** directory or `cd ir-perdix-view` from perdix directory)
    - run `npm install`
    - run `bower link irf-elements` (irf-elements is the link name from [Setting up IRF Elements](##Setting up IRF Elements) bower link)
    - run `cordova prepare`
2. To test the installation
    - Open xampp control panel and start the Apache module
    - After the module is online, open Chrome Browser and navigate to the address [http://localhost/perdix/ir-perdix-view/dev-www/](http://localhost/perdix/ir-perdix-view/dev-www/)

> `dev-www` is the development directory and `www` is the output directory for build

> Executing `gulp build` from the `ir-perdix-view` directory will initiate the build

> Executing `cordova build android` from the `ir-perdix-view` directory will initiate the android build


