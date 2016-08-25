# uibot
UIBot is a JavaScript library for quickly generating input controls such as text input, sliders, menus, buttons and toggles, nearly automatically.

## Basic Example
In the example below, two sliders would be added to the container parameter supplied to the build() method in the last line. The first slider would have the label "Amplitude" and would provide values between 0 and 1 in increments of .01. The second slider would have the label "Osc 1", provide values between 1 and 20000 in increments of 1 and would also append the unit of measure "Hz" to the current value. Upon using the sliders the values of the supplied oscillator object would be set.

```js
var oscillator = {
    var amplitude = 0.5;
    var frequency = 440;
}

var params = {
    amplitude : {
        step : .01
        range : [0, 1.0]
    },
    frequency : {
        step : 1
        units : 'Hz'
        label : 'Osc 1'
        range : [1, 20000]
    }
}

var uibot = UIBot();
var ui = uibot.build(params, oscillator)
document.body.appendChild(ui);
```

## Datatypes
UIBot uses the data-type of the parameter to determine what kind of input to create. From the example above, UIBot will see that the amplitude property of the `oscillator` is a number and will create a slider control. UIBot will use defaults where properties are omitted. For instance, if the `step` property were to be left out of the frequency parameter, it would default to a value of .01.

Below is a list of supported data-types and the components that are created for each:

- Number: Creates a slider or a select menu if an "options" property is specified
- String: Creates a text input field or a select menu if an "options" property is specified
- Boolean: Creates a checkbox
- Function: Creates a button that triggers the function when pressed

## Parameter Object Specification

Datatype: `Function`<br/>
Input Type: Button

```js
function_name : {
    // User friendly version of function name, used as label
    // Default: function name
    // Optional
    label : “My Variable”

    // A list of arguments to supply to the function
    args : [arg1, arg2]
}
```

Datatype: `Number`<br/>
Input Type: Slider or Select Menu
```js
variable_name {
    // User friendly version of variable name, used as label
    // Default: variable name
    // Optional
    label : “My Variable”,

    // Decimal or integer for number of steps between values
    // Rounded values can be enforced by supplying an integer
    // Default: .01
    // Optional
    steps : .2,

    // Minimum and maximum
    // Defaults to [0-1]
    // Optional
    range : [0, 10],

    // Unit of measure to append to current value
    units : "unit type" (eg. Hz, lbs, mm),

    // A list of numeric options
    // If this exists,
    // step, range and units are ignored and a drop-down is displayed
    // Optional
    options : [1, 2, 3, 4, 5],
}
```

Datatype: `String`<br/>
Input Type: Text Input or Select Menu
```js
variable_name : {
    // User friendly version of variable name, used as label
    // Default: variable name
    // Optional
    label : “My Variable”,

    // Minimum and maximum text length restriction
    // Negative values indicate no restriction
    // Default: no restriction
    // Optional        
    maxLength : 10,

    // A list of text options
    // If this exists,
    // length, chars and charset
    // are ignored and a drop-down is displayed
    // Optional
    options : [‘a’, ‘b’, ‘c’, ‘d’]
}
```

Datatype: `Boolean`<br/>
Input Type: Checkbox
```js
variable_name : {
    // User friendly version of variable name, used as label
    // Default: variable name
    // Optional
    label : “My Variable”
}
```
