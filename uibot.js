var UIBotId = 0;

function UIBot() {
    var bindId = 0;
    var inputs = [];
    var bindings = [];
    var uibotId = ++UIBotId;

    function createUIElement(target, param, container, callback) {
        if(!target.hasOwnProperty(param.name)) {
            console.log('UIBots Warning: target does not contain property: ', param.name);
        } else {
            var input = null;
            var type = typeof(target[param.name]); 
            switch(type) {
                case 'boolean':
                    input = createBooleanComponent(target, param, container, callback);
                    break;
                case 'function':
                    input = createFunctionComponent(target, param, container, callback);
                    break;
                case 'number':
                    input = createNumberComponent(target, param, container, callback);
                    break;
                case 'string':
                    input = createStringComponent(target, param, container, callback);
                    break;
            }
            
            if(input != null) {
                input.setAttribute('data-param', param.name);
                input.id = 'uibot-' + uibotId + '-' + param.name;
            }
            return input;
        }
        return null;
    }

    function createBooleanComponent(target, param, container, callback) {
        var div = document.createElement('div');
        div.className = 'boolean-container';
        
        var label = document.createElement('div');
        label.className = 'label';
        label.innerHTML = param.label;

        var input = document.createElement('input');
        input.type = 'checkbox';
        input.checked = target[param.name];

        div.appendChild(input);
        div.appendChild(label);
        container.appendChild(div);

        input.addEventListener('change', function(event) {
            target[param.name] = input.checked;
            if(callback) callback(event);
        });

        bindings.push(function() {
            input.checked = target[param.name];
        });

        return input;
    }

    function createFunctionComponent(target, param, container, callback) {
        var div = document.createElement('div');
        div.className = 'function-container';
        
        var input = document.createElement('input');
        input.type = 'button';
        input.param = param;
        input.value = param.label;
        input.className = 'button';
        
        div.appendChild(input);
        container.appendChild(div);

        input.addEventListener('click', function(event) {
            var args = param.args || []
            target[param.name].apply(null, args);
            if(callback) callback(event);
        });

        return input;
    }

    function createNumberComponent(target, param, container, callback) {
        if(param.hasOwnProperty('options')) {
            createSelectComponent(target, param, container, callback);
        } else {
            param.step = param.step || 0.1;
            param.range = param.range || [0, 1.0];
            param.units = param.units || '';

            var div = document.createElement('div');
            div.className = 'number-container';

            var label = document.createElement('div');
            label.innerHTML = param.label + ':';
            label.className = 'label';

            var value = document.createElement('div');
            value.innerHTML = target[param.name] + ' ' + param.units;

            var rangeDiv = document.createElement('div');
            var input = document.createElement('input');
            input.type = 'range';
            input.min = param.range[0];
            input.max = param.range[1];
            input.step = param.step;
            input.value = target[param.name];
            input.param = param;

            var min = document.createElement('div');
            min.innerHTML = param.range[0];
            min.className = 'range-min';

            var max = document.createElement('div');
            max.innerHTML = param.range[1];
            max.className = 'range-max';

            rangeDiv.appendChild(min);
            rangeDiv.appendChild(input);
            rangeDiv.appendChild(max);

            div.appendChild(label);
            div.appendChild(value);
            div.appendChild(rangeDiv);
            container.appendChild(div);

            input.addEventListener('input', function(event) {
                target[param.name] = Number(input.value);
                value.innerHTML = target[param.name] + ' ' + param.units;
                if(callback) callback(event);
            });

            bindings.push(function() {
                input.value = target[param.name];
                value.innerHTML = target[param.name] + ' ' + param.units;
            });

            return input;
        }
    }

    function createStringComponent(target, param, container, callback) {
        if(param.hasOwnProperty('options')) {
            createSelectComponent(target, param, container, callback);
        } else {
            var div = document.createElement('div');
            div.className = 'string-container';

            var label = document.createElement('div');
            label.className = 'label';
            label.innerHTML = param.label;

            var input = document.createElement('input');
            input.type = 'text';
            input.value = target[param.name];
            input.placeholder = param.placeholder || "";


            if(param.hasOwnProperty('max_length')) {
                input.maxLength = param.max_length;
            }

            div.appendChild(label);
            div.appendChild(input);
            container.appendChild(div);

            function update(event) {
                var value = param.delimiter ?
                    input.value.split(param.delimiter) : input.value;
                target[param.name] = value;
                if(callback) callback(event);
            }
            
            input.addEventListener('change', update);

            input.addEventListener('keyup', update);

            var focus = false;
            input.addEventListener('focus', function(event) {
                focus = true;
            });

            input.addEventListener('blur', function(event) {
                focus = false;
            });

            bindings.push(function() {
                if(!focus) input.value = target[param.name];
            });
            return input;
        }
    }

    function createSelectComponent(target, param, container, callback) {
        var div = document.createElement('div');
        div.className = 'select-container';

        var label = document.createElement('div');
        label.className = 'label';
        label.innerHTML = param.label;

        var select = document.createElement('select');
        for(var i = 0; i < param.options.length; i++) {
            var option = document.createElement('option');
            option.value = param.options[i];
            option.innerHTML = param.options[i];
            select.appendChild(option);
        }
        select.selectedIndex = param.options.indexOf(target[param.name]);

        div.appendChild(label);
        div.appendChild(select);
        container.appendChild(div);

        select.addEventListener('change', function(event) {
            target[param.name] = param.options[select.selectedIndex];
            if(callback) callback(event);
        })

        var focus = false;
        select.addEventListener('focus', function(event) {
            focus = true;
        });

        select.addEventListener('blur', function(event) {
            focus = false;
        });

        bindings.push(function() {
            if(!focus) {
                var index = param.options.indexOf(target[param.name]);
                select.selectedIndex = index;
            }
        });
    }

    function bind(interval) {
        unbind();
        bindId = setInterval(function() {
            for(var i = 0; i < bindings.length; i++) {
                bindings[i]();
            }
        }, interval || 500);
    }

    function unbind() {
        clearInterval(bindId);
    }

    function toTitleCase(str) {
        return str.replace(/\w\S*/g, function(txt){
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        });
    }

    return {
        id : uibotId,
        bind : bind,
        get_inputs : function() { return inputs; },
        build : function(target, params, wrapper, callback) {
            var container = document.createElement('div');
            wrapper.appendChild(container);
            container.className = 'uibot';
            container.id = 'uibot-' + uibotId + '-container';

            var ignored = params['ignore'];
            for(var name in params) {
                if(name != 'ignore' && !(ignored && ignored.indexOf(name) >= 0)) {
                    var param = params[name];
                    if(name == 'defaults') {
                        for(var item in param) {
                            var input = createUIElement(
                                target, {
                                    label : toTitleCase(param[item]), 
                                    name : param[item]
                                }, 
                                container, callback);
                            if(input) inputs.push(input);
                        }
                    } else {
                        param.name = name;
                        param.label = param.label || toTitleCase(name);
                        var input = createUIElement(target, param, container, callback);
                        if(input) inputs.push(input);
                    }
                }
            }
        },
        unind : unbind
    }
}
