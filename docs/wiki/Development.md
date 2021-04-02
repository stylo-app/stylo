# Development


### Requirements

- `node.js` ( `>=10`)
- `yarn` (tested on `1.6.0`)
- rustup [https://rustup.rs/](https://rustup.rs/)
- watchman [install instructions](https://facebook.github.io/watchman/docs/install.html) also you may need to increase the number of inotify watches with 
```bash
echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf;
sudo sysctl -p;
```

#### iOS
- `cocoapods` (`$ sudo gem install cocoapods`)
- `Xcode` (tested on `Version 11.3.1 (9F2000)`)

#### Android
- Install Android Studio (only for Android, tested on `Version 4.1`), [e.g like here](https://trendoceans.com/how-to-install-configure-android-studio-on-linux-ubuntu-20-04/#Install-Android-Studio-using-tar.gz)
- In Android studio, let the sdk point to `~/Android/Sdk/`
- Example of what sdk and tools to install
![Selection_009](https://user-images.githubusercontent.com/33178835/113449339-e8ff8180-93fd-11eb-80a0-e9fb381352c1.png)
![Selection_010](https://user-images.githubusercontent.com/33178835/113449342-eb61db80-93fd-11eb-8993-269c1aa6023e.png)
![Selection_011](https://user-images.githubusercontent.com/33178835/113449345-edc43580-93fd-11eb-9f88-f0c88a31fe99.png)
- On linux make sure you have installed `build-essential`
- Set environment variable for`$JAVA_HOME` set to java home directory, `$ANDROID_HOME` set to Android SDK directory and `$NDK_HOME` to point to the ndk directory and version installed by Android Studio.

example of `~/.bashrc` or `~/.zhrc`:
```
# React native Android development
 export ANDROID_HOME=$HOME/Android/Sdk
 export JAVA_HOME=$(readlink -f /usr/bin/javac | sed "s:/bin/javac::")
 export NDK_HOME=$ANDROID_HOME/ndk/22.0.7026061

 export PATH=$PATH:$ANDROID_HOME/emulator
 export PATH=$PATH:$ANDROID_HOME/tools
 export PATH=$PATH:$ANDROID_HOME/tools/bin
 export PATH=$PATH:$ANDROID_HOME/platform-tools
 export PATH=$PATH:$JAVA_HOME/bin
```
### Setup

- run `./scripts/init.sh` to install rust dependancies

#### iOS
- Install Dependencies

    ```
    yarn install:ios
    ```
#### Android
- Install Dependencies

    ```
    yarn install
    ```

#### Any system
- Generate an Android Debug Key if it is first time.

    ```
    ./scripts/gen_key.sh
    ```

### Develop

- Start React Native server

    ```
    yarn start
    ```

Then:

- iOS

    ```
    yarn ios
    ```

- Android

    ```
    yarn android
    ```
	
	Magic command to clean, reinstall deps and launch the RN server with the cache cleaned:  
  `yarn clean:android && yarn && yarn start --reset-cache` 
