# Angular SuggestBox
Angular SuggestBox is an AngularJS component (directive) which provides highly customizable dropdown list (combobox, multiselect).

# Features
- Fully customizable layout. Directive comes without template. It uses the html layout that you provide inside the element.
- Multiple items selection. Customizable by _sb-max-selection_ option
- Duplicate item selection option.
- Allow adding

# Examples


# Documentation

## Installation
```bash
npm install
bower install
gulp
```

## Attributes
+ sb-list | Array Required |
+ sb-model | array Required |
+ sb-max-selection | integer optional 0 |
+ sb-allow-duplicates | boolean optional false |
+ sb-allow-free-text | boolean optional false |
+ sb-allow-add-item | boolean optional false |
+ sb-new-item-field | string optional 'name' |
+ sb-search-field | string optional null |
+ sb-broadcast-event-name | string optional azSuggestBoxSelect |
+ sb-close-list-on-select | boolean optional false |
+ sb-on-selection-change | function optional |

## Directives
+ az-suggest-box| root
+ sb-selection-item| selected items repeater
+ sb-remove-item-from-selection| button to remove item from selection must be placed inside sb-selection-item
+ sb-trigger-area|
+ sb-type-ahead| handles search throw list items. must be placed on input element. requires ng-model to be set on any name
+ sb-dropdown-item | dropdown item repeater

## Functions
+ getSearchResultsCount|
+ getListItemsCount|

# Component Based Development
Since SuggestBox exposes its layout, it doesn't follow component based paradigm.

Best practise would be to wrap it inside your component like this:

```javascript
angular
    .module('myModule', ['azSuggestBox'])
    .directive('myComponent', [function(){
        return {
            restrict: 'E',
            template: ''
        }
    }])
```
