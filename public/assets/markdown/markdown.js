const ConversionTable = {
    "H1": "text-4xl",
    "H2": "text-3xl",
    "H3": "text-2xl",
    "H4": "text-1xl",
    "H5": "text-lg",
    "H6": "text-base",
};

function initMarkdownBody() {
    var parentNode = document.getElementById("markdown-body");
    let childs = parentNode.childNodes;
    for (const key in childs) {
        let node = childs[key];
        console.log(node.nodeName);
        if (node.nodeName in ConversionTable) {
            node.className = ConversionTable[node.nodeName];
        }
    }
}