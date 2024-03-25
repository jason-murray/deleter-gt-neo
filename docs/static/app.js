document.addEventListener("DOMContentLoaded", function () {
    const rotaryGroup = document.getElementsByClassName("rotary-feature")[0];

    for (let i = 0; i < 3; i++) {
        let rotaryClone = rotaryGroup.cloneNode(true);

        let inputs = rotaryClone.getElementsByTagName("input");

        // change name attribute on inputs
        for (let j = 0; j < inputs.length; j++) {
            inputs[j].setAttribute("name", inputs[j].getAttribute("name").slice(0, -2) + (i + 1) + "]");
        }

        let title = rotaryClone.getElementsByTagName("legend")[0];

        // change title
        title.innerHTML = title.innerHTML.slice(0, -1) + (i + 2);

        document.getElementById("rotary-features").appendChild(rotaryClone);
    }

    // Input Listeners
    let inputs = document.querySelectorAll('input');

    for (var i = 0, len = inputs.length; i < len; i++) {
        // Listen for input event on numInput.
        inputs[i].addEventListener('input', function () {
            updateUrlSettingsString();
        }, false);
    }

    // Append settings to URL
    function updateUrlSettingsString() {
        let inputs = document.querySelectorAll('input');
        let settings = {};

        for (var i = 0, len = inputs.length; i < len; i++) {
            if (inputs[i].type === 'checkbox') {
                settings[inputs[i].name] = inputs[i].checked;
            } else if (inputs[i].type === 'radio') {
                if (inputs[i].checked === true) {
                    settings[inputs[i].name] = inputs[i].value;
                }
            } else {
                settings[inputs[i].name] = inputs[i].value;
            }
        }

        //array to string
        settingsStringb64 = encodeURIComponent(btoa(JSON.stringify({ settings })));

        // update url
        window.history.pushState({}, '', '?' + settingsStringb64);
    }

    // Load settings from URL
    let settingsStringb64 = window.location.search.substring(1);

    let loadedSettings = JSON.parse(atob(decodeURIComponent(settingsStringb64)));

    for (var i = 0, len = inputs.length; i < len; i++) {
        // Listen for input event on numInput.
        if (loadedSettings.settings[inputs[i].name] != null) {
            if (inputs[i].type === 'checkbox') {
                inputs[i].checked = loadedSettings.settings[inputs[i].name];
            } else if (inputs[i].type === 'radio') {
                if (inputs[i].value === loadedSettings.settings[inputs[i].name]) {
                    inputs[i].checked = true;
                }
            } else {
                inputs[i].value = loadedSettings.settings[inputs[i].name];
            }
        }
    }

    var saveData = (function () {
        var a = document.createElement("a");
        document.body.appendChild(a);
        a.style = "display: none";
        return function (data, fileName) {
            var blob = new Blob([data], {type: "octet/stream"}),
                url = window.URL.createObjectURL(blob);
            a.href = url;
            a.download = fileName;
            a.click();
            window.URL.revokeObjectURL(url);
        };
    }());

    // download button click listener
    document.getElementById("download").addEventListener("click", function () {
        
        fetch("https://raw.githubusercontent.com/jason-murray/deleter-gt-neo/main/Deleters_GT_Neo_iRacing.ledsprofile")
            .then((res) => res.text())
            .then((text) => {
                // do something with "text"
                let settingsStart = text.substring(0, text.indexOf("// --- Global Config ---\\r\\n"));
                let settingsEnd = text.substring(text.indexOf("// END CONFIG"));

                let inputs = document.querySelectorAll('input');
                let settings = "";
                let preSettings = "let rotaries = [";
        
                for (var i = 0, len = inputs.length; i < len; i++) {
                    if (inputs[i].type === 'checkbox') {
                        settings += "let " + inputs[i].name + " = " + inputs[i].checked + ";";
                    } else if (inputs[i].type === 'color') {
                        settings += "let " + inputs[i].name + " = '" + inputs[i].value + "';";
                    } else if (inputs[i].type === 'radio') {
                        if (inputs[i].checked === true) {
                            preSettings += inputs[i].value + ",";
                        }
                    } else {
                        settings += "let " + inputs[i].name + " = " + inputs[i].value + ";";
                    }
                }

                preSettings = preSettings.slice(0, -1) + "];";
                
                console.log(settingsStart + preSettings + settings + settingsEnd);

                saveData(settingsStart + preSettings + settings + settingsEnd, "Deleters_GT_Neo_iRacing.ledsprofile");
            })
            .catch((e) => console.error(e));



    });
});
