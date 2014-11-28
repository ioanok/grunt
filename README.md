# [grunt boilerplate]

## Quick start

1. install node.js and NPM
2. install the grunt command line interface by running npm install -g grunt-cli    
3. create package.json file with the content below
    {
      "name": "grunt-project",
      "version": "0.1.0",
      "devDependencies": {
        "grunt": "^0.4.5",
        "grunt-autoprefixer": "^2.0.0",
        "grunt-contrib-clean": "^0.6.0",
        "grunt-contrib-concat": "^0.5.0",
        "grunt-contrib-copy": "^0.7.0",
        "grunt-contrib-cssmin": "^0.10.0",
        "grunt-contrib-imagemin": "^0.9.2",
        "grunt-contrib-uglify": "^0.6.0",
        "grunt-contrib-watch": "^0.6.1",
        "grunt-processhtml": "^0.3.3",
        "load-grunt-tasks": "^1.0.0"
      }
    }

4. run npm install // to install the dependencies from package.json
5. install grunt plugins with command npm install grunt-plugin-name --save-dev    