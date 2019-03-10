# Base node js server

PixelPlex base nodeJs server

### Installation
1. Clone the project
2. Move to the cloned directory
3. Install dependencies: `npm install`
4. Create `./config/local.json`
```
{
	"port": {env}{project-number}{i},
   	"db": {
   		"database": "database_name"
   	},
   	"raven": {
   		"enabled": false
   	}
}
```
* {env}:  
    * 1 - development  
    * 2 - stage  
    * 3 - production  
    * 4 - test  
* {project-number} - three digit project number  
* {i} - index number for an instance, if you need to start several instances of a module

### Scripts
Full list of scripts is listed in the `package.json`

---
* `npm start`  
Run default module in a local environment. The default module is `api`
---
* `npm run start-api`  
Run the `api` module in local environment
---
* `npm run supervisor-api`  
Run the `api` module in local environment using `supervisor`, which provides hot-reloading. (`supervisor` is a npm package and must be installed globally)
---
* `npm run start-cron`  
Run the `cron` module
---
* `npm run test`  
Run tests 
---
* `npm run posttest`  
Collect code coverage by tests. Coverage folder: `./coverage`
---
* `npm run lint`  
Run lint check
---
* `npm run dev-migrate`  
Run dev migrations
---
* `npm run stage-migrate`  
Run stage migrations
---
* `npm run doc`  
Run api docs building. ApiDoc folder: `./apidoc`
---
