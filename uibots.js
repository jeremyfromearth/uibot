var UIBotId = 0;
function UIBot() {
    var bindId = 0;
    var bindings = [];
    var uibotId = ++UIBotId;
    
    function createUIElement(target, param, container) {
        if(!target.hasOwnProperty([param.name])) {
            console.log('UIBots Warning: target does not contain property: ', param.name);
        } else {
            console.log('Creating UI Element For Param:', param);
            input = null;
            type = typeof(target[param.name]); 
            switch(type) {
                case 'boolean':
                    input = createBooleanComponent(target, param, container);
                    break;
                case 'function':
                    input = createFunctionComponent(target, param, container);
                    break;
                case 'number':
                    input = createNumberComponent(target, param, container);
                    break;
                case 'string':
                    input = createStringComponent(target, param, container);
                    break;
            }
            
            if(input != null) {
                input.id = 'uibot-' + uibotId + '-' + param.name;
            }
        }
    }

    function createBooleanComponent(target, param, container) {
        var div = document.createElement('div');
        div.className = 'uibot_component_container';
        
        var label = document.createElement('div');
        label.className = 'uibot_component_label';
        label.innerHTML = param.label;

        var input = document.createElement('input');
        input.type = 'checkbox';
        input.className = 'uibot_checkbox';
        input.checked = target[param.name];

        div.appendChild(label);
        div.appendChild(input);
        container.appendChild(div);

        input.addEventListener('change', function(event) {
            target[param.name] = input.checked;
            console.log(input.checked);
        });

        bindings.push(function() {
            input.checked = target[param.name];
        });

        return input;
    }

    function createFunctionComponent(target, param, container) {
        var div = document.createElement('div');
        div.className = 'uibot_component_container';
        
        var input = document.createElement('input');
        input.type = 'button';
        input.param = param;
        input.value = param.label;
        input.className = 'uibot-button';
        
        div.appendChild(input);
        container.appendChild(div);

        input.addEventListener('click', function() {
            var args = param.args || []
            target[param.name].apply(null, args);
        });

        return input;
    }

    function createNumberComponent(target, param, container) {
        if(param.options) {

        } else {
            param.step = param.step || 0.1;
            param.range = param.range || [0, 1.0];
            param.units = param.units || '';

            var div = document.createElement('div');
            div.className = 'uibot_component_container';

            var label = document.createElement('div');
            label.innerHTML = param.label + ':';
            label.className = 'uibot_component_label';

            var value = document.createElement('div');
            value.innerHTML = target[param.name] + ' ' + param.units;
            value.className = 'uibot_range_value_field';

            var rangeDiv = document.createElement('div');
            rangeDiv.className = 'uibot_range_div';

            var input = document.createElement('input');
            input.type = 'range';
            input.className = 'uibot_range';
            input.min = param.range[0];
            input.max = param.range[1];
            input.step = param.step;
            input.value = target[param.name];
            input.param = param;

            var min = document.createElement('div');
            min.innerHTML = param.range[0];
            min.className = 'uibot_range_label_min';

            var max = document.createElement('div');
            max.innerHTML = param.range[1];
            max.className = 'uibot_range_label_max';

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
            });

            bindings.push(function() {
                input.value = target[param.name];
                value.innerHTML = target[param.name] + ' ' + param.units;
            });
        }
    }

    function createStringComponent(target, param, container) {

    }

    function createSelectComponent(target, param, container) {

    }

    return {
        id : uibotId,
        build : function(target, params, container) {
            for(var name in params) {
                var param = params[name];
                if(name == 'defaults') {
                    for(var item in param) {
                        createUIElement(target, {label : param[item], name : param[item]}, container);
                    }
                } else {
                    param.name = name;
                    param.label = param.label || name;
                    createUIElement(target, param, container);
                }
            }
        }
    }
}
