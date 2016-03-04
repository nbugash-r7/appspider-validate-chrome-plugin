/**
 * Created by nbugash on 02/03/16.
 */

/* reading file */
var prompt = require('prompt');
var fs = require('fs');
var packetJsonFileName = './package.json';
var bowerJsonFileName = './bower.json';
var manifestJsonFile = './chrome-plugin/manifest.json';
var packageJson = require(packetJsonFileName);
var bowerJson = require(bowerJsonFileName);
var manifestJson = require(manifestJsonFile);

var properties = [
	{
		name: 'pluginName',
		validator: /^[a-zA-Z\s\-]+$/,
		warning: 'Plugin name must be only letters, space or dashes',
		default: 'super-awesome-plugin',
		message: 'Enter the plugin name'
	},
	{
		name: 'description',
		default: 'TODO: Need to add a description',
		message: 'Enter a brief description of this plugin'
	},
	{
		name: 'author',
		message: 'Enter author name of this plugin',
		required: true,
		warning: 'Need to enter a valid author name'
	},
	{
		name: 'gitusername',
		validator: /^[a-zA-Z0-9\-]+$/,
		warning: 'Git username must be only letters, numbers or dashes',
		message: 'Enter your git username. A blank response will ignore a git entry'
	},
	{
		name: 'useR7StyleGuide',
		type: 'boolean',
		default: true,
		description: 'Do you want to use the Rapid7 style guide?'
	},
	{
		name: 'version',
		default: '0.0.1',
		message: 'Version number of this plugin'
	}
];

prompt.start();

prompt.get(properties, function (err, result) {
	if (err) { return onErr(err); }
	/* Updating the plugin name */
	packageJson.name = convertToValidName(result.pluginName);
	bowerJson.name = packageJson.name;
	manifestJson.name = result.pluginName;

	/* Updating the plugin description */
	packageJson.description = result.description;
	bowerJson.description = result.description;
	manifestJson.description = result.description;

	/* Updating the author of the plugin */
	packageJson.author = result.author;
	bowerJson.authors.push(result.author);

	/* Updating the git username of the plugin */
	if(result.gitusername === '' ){
		packageJson.repository = {};
		packageJson.bugs = {};
		bowerJson.homepage = packageJson.homepage = '';
	} else {
		packageJson.repository.type = 'git';
		packageJson.repository.url = 	'git+ssh://git@github.com/' + result.gitusername + '/' + packageJson.name + '.git';
		packageJson.bugs.url = 'https://github.com/' + result.gitusername + '/' + packageJson.name + '/issues';
		packageJson.homepage = 'https://github.com/' + result.gitusername + '/' + packageJson.name + '#readme';
		bowerJson.homepage = packageJson.homepage;
	}

	/* Adhere to Rapid7 style guides? */
	if(result.useR7StyleGuide) {
		bowerJson.dependencies['ui-base-styles'] = 'git@github.com:rapid7/ui-base-styles.git';
	} else {
		bowerJson.dependencies = {};
	}

	/* Update the version of the plugin */
	packageJson.version = manifestJson.version = result.version;

	prompt.stop();
	fs.writeFile(packetJsonFileName, JSON.stringify(packageJson, null, 2), function(err){
		if (err){
			return console.error(err);
		}
	});
	fs.writeFile(bowerJsonFileName, JSON.stringify(bowerJson, null, 2), function(err){
		if (err) {
			return console.error(err);
		}
	});
	fs.writeFile(manifestJsonFile, JSON.stringify(manifestJson, null, 2), function(err){
		if (err) {
			return console.error(err);
		}
	});
});

function onErr(err) {
	console.log(err);
	return 1;
}
function convertToValidName(name) {
	var array = name.toLocaleLowerCase().split(' ');
	if (array.length > 1) {
		name = array.join('-');
	}
	return name;
}