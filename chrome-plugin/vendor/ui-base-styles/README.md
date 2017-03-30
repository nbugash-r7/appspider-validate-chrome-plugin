# Rapid7 Base Styles

## Importing the styles

### NPM

## Install the App
```
npm install "rapid7-base-styles" -S
```
*Note:* you must have Rapid7 Nexus configured to install from NPM, make sure you add the following to your .npmrc file:
`registry=https://artifacts.bos.rapid7.com/nexus/content/groups/npm-all`

### Bower

These styles are available via [Bower](http://bower.io).

```console
$ bower install git@github-r7:rapid7/ui-base-styles.git
```

**NB:** Replace `github-r7` with `github.com` if you're only using one SSH key.

## Using The base styles

When using the base styles you can reference the main scss file and complie the base styles as part of your project.

```
@import 'bower_components/ui-base-styles/app/styles/main.scss'
```

## Building

To compile the base styles run `npm run build`. This will also copy over the scss modules.

## Web Fonts
To generate the web fonts for the Rapid7 Icons run the `grunt webfont` task, this will update the rapid7.scss file and
 the linked font files. To add new icons you must follow the below steps:
- Add the new svg file to `src/svgs/`
- Make sure to rename the icon and follow the naming convention throughout which is (icon- *icon name*)
- Update the `codepoints.json` file with the new icon name and code, taking the last code and increasing by 1.
- if you haven't already, make sure to install fontforge: (https://github.com/sapegin/grunt-webfont#installation)
- Run `grunt webfont`
-- NOTE after running the webfont task you must update the rapid7.scss file with the following changes:
-- in _rapid7.scss replace `../dist/fonts/` with `#{$rapid7-font-path}`

## Deployment
- Checkout the lastest `master` branch 
- `npm version major|minor|patch` based on the release you want to make.
- update the `bower.json` version to the new version, commit this change
- Push the new tag `git push --follow-tags`
- Run the publish job from [Jenkins](https://razorci.osdc.lax.rapid7.com/search/?q=npm-ui-base-styles-master)

## Theming

A [rudimentary demonstration of theming can be found here.](https://github.com/rapid7/ui-base-styles/blob/master/public/main.scss#L9-L16). Here's [an example of a theme file](https://github.com/rapid7/ui-base-styles/blob/master/public/styles/themes/_dark.scss).

For an idea of what's possible to theme just by changing variables, check out [`_variables.css`](https://github.com/rapid7/ui-base-styles/blob/master/bower_components/bootstrap-sass/assets/stylesheets/bootstrap/_variables.scss).
