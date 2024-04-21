<p align="center">
  <img width="250" src="https://github.com/knfs-jsc/bamimi-autoload/blob/master/docs/images/logo-background.png?raw=true">
  <br>
</p>

<h1> <span style="color:#013C4D;">About</span> <span style="color:#2B7F84;">Bamimi autoload</span></h1>


This is a package that helps you autoload files without having to re-import them in the code
 
 *!!! WARN: It is recommended that because it will be used as a global variable, you should consider using it to avoid affecting memory and conflicting global variables.*

---

## Install
```bash
npm i @knfs-tech/bamimi-autoload
#or
yarn add @knfs-tech/bamimi-autoload
```

## Usage

**Step 1**: Update info to *package.json*
```json
{
	"name": "<name project>",
	..., 
	"autoload": {
		"modules": {
			"module1": "" 
			"module2": "module2"
		},
		"packages": {
			"@knfs-tech/bamimi-socket.io": "socket"
		},
		"files": {
			"configs/config.js": "config"
		}
	},
	...,
}

```
autoload have 3 types and structure in each types is 
```js
{
	<file_path/package_name/module_name> : <name_param_will_be_used>
}

```
*See the example below for better understanding*

It can be understood that variables and values autoloaded are readily available for immediate use without the need for further import. If these values are assigned with parameters, they can be accessed using the format $_\<param>. Else it is just imported

3 types of autoload are:

* modules are folders
* packages are node_module packages
* files are javascript files or json files
  

**Step 2**: Create file *index.js*
```js
const { createServer } = require('node:http');
const socket = require("@knfs-tech/bamimi-socket.io")
const express = require("express");
const app = express();
const server = createServer(app);

/** 
 * Above we declared @knfs-tech/bamimi-socket.io as a socket 
 *  and configs/config.js is config
 *  so now we will use it and no need to import it again.
 **/
$_socket.io(server, $_config)


const connection = (io, socket) => {
	console.log("____Connection___")
}

$_socket.on(
	'/abc',
	function (socket, next) {
		console.log("___Middleware socket___")
		next()
	},
	connection
)

/** 
 * similar to sockets
 **/
console.log($_module2)

server.listen(3001, () => {
	console.log(`server running at http://localhost:3001`);
})
```
**Step 3**: Run file *index.js*
```bash
npm start
#or
node index.js
#or
yarn start
```

## Author
* [Khapu](https://github.com/khapu2906)
  
## Owner
* [Knfs.,jsc](https://github.com/knfs-jsc)


## License

Bamimi is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).