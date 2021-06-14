Moodle Mobile
=================

This is the primary repository of source code for the official Moodle Mobile app.

* [User documentation](http://docs.moodle.org/en/Moodle_Mobile)
* [Developer documentation](http://docs.moodle.org/dev/Moodle_Mobile)
* [Development environment setup](http://docs.moodle.org/dev/Setting_up_your_development_environment_for_Moodle_Mobile_2)
* [Bug Tracker](https://tracker.moodle.org/browse/MOBILE)
* [Release Notes](http://docs.moodle.org/dev/Moodle_Mobile_Release_Notes)

License
-------

[Apache 2.0](http://www.apache.org/licenses/LICENSE-2.0)

Big Thanks
-----------

Cross-browser Testing Platform and Open Source <3 Provided by [Sauce Labs](https://saucelabs.com)

![Sauce Labs Logo](https://user-images.githubusercontent.com/557037/43443976-d88d5a78-94a2-11e8-8915-9f06521423dd.png)


Per creare l'apk:

https://valix85.wordpress.com/2016/06/22/installare-ionic-su-windows-10/

npm install -g cordova
npm install -g ionic
npm i -g cordova-res
https://developer.android.com/studio
necessaria JDK
https://www.oracle.com/java/technologies/javase/javase-jdk8-downloads.html
https://www.freakyjolly.com/resolve-could-not-find-an-installed-version-of-gradle-either-in-android-studio/


ionic cordova resources //vedi readme in resources
//NO cordova-res android --skip-config --copy

ionic cordova build --release android

aprire su android studio la cartella platform/android

/* non sono riuscito a far funzionare questi comandi ---inizio
keytool -genkey -v -keystore juice100.keystore -alias juice100 -keyalg RSA -keysize 2048 -validity 10000

copiata la key in cartella release

cd E:\PROGETTI\Ribelli\Juice\Source\AppGit\moodleapp\platforms\android\app\build\outputs\apk\release

jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore juice100.keystore app-release-unsigned.apk juice
//non va

C:\Users\Flavio\AppData\Local\Android\Sdk\build-tools\30.0.3\zipalign -v 4 app-release-unsigned.apk JUICE.apk

/* non sono riuscito a far funzionare questi comandi ---fine
