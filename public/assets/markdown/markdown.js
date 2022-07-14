const ConversionTable = {
    all: {
        _: "",
        a: "underline text-blue-400 dark:text-blue-200 hover:text-blue-600 dark:hover:text-blue-100",
    },
    _: "mt-4 dark:text-white",

    h1: "text-4xl",
    h2: "text-3xl",
    h3: "text-2xl",
    h4: "text-1xl",
    h5: "text-lg",
    h6: "text-base",

    blockquote: {
        self: "bg-gray-200 h-10",
        _: "",

        p: "mx-6 py-2",
    },

    ul: {
        self: "",
        _: "mt-1",
    },
};

function initMarkdownBody() {
    var parentNode = document.getElementById("markdown-body");
    let childs = parentNode.childNodes;
    for (const key in childs) {
        let node = childs[key];
        node.className = ConversionTable["_"];
        if (
            node.nodeName != undefined &&
            node.nodeName.toLowerCase() in ConversionTable
        ) {
            let tab = ConversionTable[node.nodeName.toLowerCase()];
            if (typeof tab == "string") {
                node.className += " " + tab;
            } else if (typeof tab == "object") {
                node.className += " " + tab["self"];
                for (const c in node.childNodes) {
                    let child = node.childNodes[c];
                    if (child == undefined || child.nodeName == undefined) {
                        continue;
                    }
                    let child_name = child.nodeName.toLowerCase();
                    child.className = tab["_"];
                    if (child_name in tab) {
                        child.className += tab[child_name];
                    }
                }
            }
        }
    }

    // match `all` element
    if ("all" in ConversionTable) {
        const all_tab = ConversionTable["all"];
        for(const name in all_tab) {
            let curr = all_tab[name];
            let eles = document.getElementsByTagName(name.toUpperCase());
            for(const key in eles) {
                let ele = eles[key];
                ele.className = all_tab["_"] + " " + curr;
            }
        }
    }
}

// better solve for `initMarkdownBody` function
function new_initMarkdownBody() {
    // TODO!
}