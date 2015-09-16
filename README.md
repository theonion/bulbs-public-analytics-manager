<strong><i>:exclamation: THIS REPO SHOULD NOT BE MADE PUBLIC :exclamation:</i></strong>

# bulbs-public-analytics-manager
Analytics manager for public side of sites. Tracks clicks via Google Analytics by checking the following attributes on elements:

- ```data-track-category```
- ```data-track-action```
- ```data-track-label```

Which work as category, action, and labels for events work on Google Analytics.

For the category, if it doesn't exist on an element, the category will be searched for up through the parents until one is found.

## Testing
To run tests:
```bash
$ npm install && bower install
$ npm test
```
