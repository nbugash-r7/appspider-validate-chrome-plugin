# Chrome plugin starter kit
This is the starter kit framework to build a chrome plugin.

### Version
0.0.1

### Initialize the starter kit
This starter kit is used in order to a quickly create a plugin 

1. Clone the repo
    ```sh
    $ git clone https://github.com/nbugash-r7/chrome-plugin-starterkit.git [name-of-plugin]
    ```    

2. Run npm update
    ```sh
    $ npm update
    ```

3. Run the initialization script and input the correct information requested by the script
    ```sh
    $ node init.js
    ```

4. [Optional] Re-run npm update since package.json was updated. See Step 2.

5. Run bower update.
    ```sh
    $ bower update
    ```

### Installing the chrome plugin to Chrome
Once you're done with building your awesome chrome plugin, it's time to test and see how it's going to look like.

1. Type '<i>chrome://extensions</i>' in the chrome browser

2. Click on the '<i>Load unpacked extension...</i>' button

3. Navigate to the repo location and upload just the chrome-plugin directory. i.e: <i>${BASE_REPO}\chrome-plugin</i>
