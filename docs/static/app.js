document.addEventListener("DOMContentLoaded", function() {
    const rotaryGroup = document.getElementsByClassName("rotary-feature")[0];

    for (let i = 0; i < 3; i++) {
        let rotaryClone = rotaryGroup.cloneNode(true);

        let inputs = rotaryClone.getElementsByTagName("input");

        // change name attribute on inputs
        for (let j = 0; j < inputs.length; j++) {
            inputs[j].setAttribute("name", inputs[j].getAttribute("name").slice(0, -2) + (i+1) + "]");
        }

        let title = rotaryClone.getElementsByTagName("legend")[0];

        // change title
        title.innerHTML = title.innerHTML.slice(0, -1) + (i+2);

        document.getElementById("rotary-features").appendChild(rotaryClone);
    }
});
