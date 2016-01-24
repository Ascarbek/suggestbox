# Angular SuggestBox
Angular SuggestBox is an AngularJS component (directive) which provides highly customizable dropdown list (combobox, multiselect, autocomplete).

# Features
- Fully customizable layout. Directive comes without template. It uses the html layout that you provide inside the element.
- Multiple items selection. Customizable by _sb-max-selection_ option
- Duplicate item selection option.
- Allow adding

# Getting started
First of all, this is not the only dropdown component available. There are a lot of others. I used most of them.
All of them have one bad thing in common - they all come with built-in templates. To be fair this is true for Angular components.
Because Angular directive need to have template which will be rendered. But Angular directive has a really awesome
functionality called `transclude`, which allows to use HTML layout provided, why not use is?

I myself just hate when components dictate me how the UX should be. <br>
For example: I don't need the searchbox to be inside the dropdown area, but sometimes I do,
sometimes I don't need it at all because, hell, there are only 4 items, who needs to search for them? <br>
Another example: I want a dropdown list item to look more custom not just a one line word. Maybe a picture and two lines of data with gray
labels ahead. The picture can be at left side or right side or both or mixed depending on odd/even row index. <br>

I know that everything I described is achievable by hacking CSS and template modifying. But if you want to use different
layouts on the same page, then it becomes nightmare.

> There Must be a Better Way...

So I decided to make my own component that would fit all my needs. <br>
So here it is - Angular SuggestBox

# Install
```bash
bower install angular-suggestbox
```

# Examples
Live Demo available at
http://ascarbek.github.io/suggestbox/

# Documentation

## Attributes
+ sb-list-item-alias | string optional 'i' |
+ sb-list | Array Required |
+ sb-model-alias | string optional 's' |
+ sb-model | array optional |
+ sb-selected-indexes | array optional |
+ sb-max-selection | integer optional 0 |
+ sb-allow-duplicates | boolean optional false |
+ sb-allow-free-text | boolean optional false |
+ sb-allow-add-item | boolean optional false |
+ sb-new-item-field | string optional 'name' |
+ sb-search-fields | string optional null |
+ sb-key-fields | string optional null |
+ sb-select-first-list-item | boolean optional false |
+ sb-broadcast-event-name | string optional 'azSuggestBoxSelect' |
+ sb-selected-list-item-class | string optional 'ng-hide' |
+ sb-highlighted-list-item-class | string optional 'sb-list-item-highlight |
+ sb-close-list-on-select | boolean optional false |
+ sb-on-selection-change | function optional |

## Directives
+ az-suggest-box| root
+ sb-selection-item| selected items repeater
+ sb-remove-item-from-selection| button to remove item from selection must be placed inside sb-selection-item
+ sb-trigger-area|
+ sb-type-ahead| handles search throw list items. must be placed on input element
+ sb-dropdown-item | dropdown item repeater

## Functions
+ getSearchResultsCount|
+ getListItemsCount|
+ getSelectionCount

# Component Based Development
It's recommended to divide an App's layout into components. Components should keep its layout separately. Components can consist of other components.
The goal is to keep the layouts as small as possible. That way it becomes easier to maintain and support them.

Since SuggestBox exposes its layout, it doesn't fully follow component based paradigm.<br>
So, best practise would be to wrap it inside your own component like this:
```javascript
angular
    .module('myModule', ['azSuggestBox'])
    .directive('myComponent', [function(){
        return {
            restrict: 'E',
            scope: {
                listItems: '=',
                selectedItems: '=',
                onChange: '&'
            },
            template: '<div class="suggest-box" az-suggest-box '+
                'sb-list="listItems" ' +
                'sb-model="selectedItems" ' +
                'sb-on-selection-change="onChange()" > ' +
                    '<div az-suggest-box sb-list="vm.cities" class="suggest-box"> ' +
                        '<div class="select"> ' +
                            '<div class="input"> ' +
                                '<div sb-selection-item class="selection-item"> ' +
                                    '{{s.name}}&nbsp;<span sb-remove-item-from-selection class="rem-btn"><i class="fa fa-times"></i></span> ' +
                                '</div> ' +
                                '<input sb-trigger-area sb-type-ahead tabindex="1"> ' +
                            '</div> ' +
                            '<button sb-trigger-area><i class="fa fa-chevron-down"></i></button> ' +
                        '</div> ' +
                        '<ul class="dropdown"> ' +
                            '<li sb-dropdown-item class="item">{{i.name}}</li> ' +
                        '</ul> ' +
                    '</div>'+
                '</div>'
        }
    }])
```
after that the component will look cleaner:
```html
<my-component listItems="" selectedItems="" onChange=""></my-component>
```

# TODO
attributes that are currently ignored:
sb-select-first-list-item
sb-max-selection (except when it's =1 (combo behaviour))
