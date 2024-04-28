document.addEventListener("DOMContentLoaded", function () {
    const rotaryGroup = document.getElementsByClassName("rotary-feature")[0];

    for (let i = 0; i < 3; i++) {
        let rotaryClone = rotaryGroup.cloneNode(true);

        let inputs = rotaryClone.getElementsByTagName("input");

        // change name attribute on inputs
        for (let j = 0; j < inputs.length; j++) {
            inputs[j].setAttribute("name", inputs[j].getAttribute("name").slice(0, -2) + (i + 1) + "]");
            inputs[j].checked = false;
        }

        let title = rotaryClone.getElementsByTagName("legend")[0];

        // default selections
        switch (i) {
            case 0:
                title.innerHTML = 'Top Right Rotary';
                inputs[2].checked = true;
                break;
            case 1:
                title.innerHTML = 'Bottom Left Rotary';
                inputs[5].checked = true;
                break;
            case 2:
                title.innerHTML = 'Bottom Right Rotary';
                inputs[3].checked = true;
                break;
        }

        document.getElementById("rotary-features").appendChild(rotaryClone);

    }

    // Input Listeners
    let inputs = document.querySelectorAll('input');

    for (var i = 0, len = inputs.length; i < len; i++) {
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

        // array to base64 string
        settingsStringb64 = encodeURIComponent(btoa(JSON.stringify({ settings })));

        // update url
        window.history.pushState({}, '', '?' + settingsStringb64);
    }

    // Load settings from URL
    let settingsStringb64 = window.location.search.substring(1);

    if (settingsStringb64.length > 0) {
        let loadedSettings = JSON.parse(atob(decodeURIComponent(settingsStringb64)));

        for (var i = 0, len = inputs.length; i < len; i++) {
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
    }

    var saveData = (function () {
        var a = document.createElement("a");
        document.body.appendChild(a);
        a.style = "display: none";
        return function (data, fileName) {
            var blob = new Blob([data], { type: "octet/stream" }),
                url = window.URL.createObjectURL(blob);
            a.href = url;
            a.download = fileName;
            a.click();
            window.URL.revokeObjectURL(url);
        };
    }());

    // download button click listener
    document.getElementById("download").addEventListener("click", function () {

        fetch("https://raw.githubusercontent.com/jason-murray/deleter-gt-neo/main/simagic-gt-neo-leds/Deleters_GT_Neo_iRacing_template.json")
            .then((res) => res.text())
            .then((text) => {
                let settingsStart = text.substring(0, text.indexOf("// --- Global Config ---\\r\\n"));
                let settingsEnd = text.substring(text.indexOf("// END CONFIG"));

                let inputs = document.getElementsByClassName('config-var');
                let settings = "";
                let preSettings = "// --- Global Config ---\\r\\n// Settings URL: " + window.location.href + "\\r\\n\\r\\nlet rotaries = [";

                for (var i = 0, len = inputs.length; i < len; i++) {
                    if (inputs[i].type === 'checkbox') {
                        settings += "let " + inputs[i].name + " = " + inputs[i].checked + ";\\r\\n";
                    } else if (inputs[i].type === 'color') {
                        settings += "let " + inputs[i].name + " = '" + inputs[i].value + "';\\r\\n";
                    } else if (inputs[i].type === 'radio') {
                        if (inputs[i].checked === true) {
                            preSettings += inputs[i].value + ",";
                        }
                    } else {
                        settings += "let " + inputs[i].name + " = " + inputs[i].value + ";\\r\\n";
                    }
                }

                preSettings = preSettings.slice(0, -1) + "];\\r\\n";

                console.log(settingsStart + preSettings + settings + settingsEnd);

                saveData(settingsStart + preSettings + settings + settingsEnd, "Deleters_GT_Neo_iRacing.ledsprofile");
            })
            .catch((e) => console.error(e));

    });
});
