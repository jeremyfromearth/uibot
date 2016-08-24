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
        input.checked = target[param.name];

        div.appendChild(label);
        div.appendChild(input);
        container.appendChild(div);

        input.addEventListener('change', function(event) {
            target[param.name] = input.checked;
            console.log(input.checked);
        });
    }

    function createFunctionComponent(target, param, container) {

    }

    function createNumberComponent(target, param, container) {

    }

    function createStringComponent(target, param, container) {

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

var target = {
    num : 0,
    bool : false,
    options : 'A',
    string : 'Hello',
    ping : function() {
        console.log('ping');
    }
}

var params = {
    num : {
        min : 0,
        max : 1,
        step : 0.1,
        units : 'db',
        label : 'Amplitude'
    },

    options : {
        options : ['A', 'B', 'C']
    },

    defaults: ['bool', 'options', 'string', 'ping']
}

var uibot = UIBot();
uibot.build(target, params, document.body);
