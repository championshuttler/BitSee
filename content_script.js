// Author : championshuttler
// Date : 25th Jan 2018
// Last Update : 28th Jan 2018


(function() {
    function walk(node) {
        var chil, next;
        try {
            switch (node.nodeType) {
                case 1: // element
                case 9: // document
                case 11: // document fragment
                    child = node.firstChild;
                    while (child) {
                        next = child.nextSibling;
                        walk(child);
                        child = next;
                    }
                    break;
                case 3: // text node
                    if (node.parentElement.tagName.toLowerCase() != "script") {
                        processTextNode(node);
                    }
                    break;


            }
        } catch (err) {
            console.console.log("Error Bitsee: " + err);

        }
    }

    function nodeInLink(textNode) {
        var curNode = textNode;
        while (curNode) {
            if (curNode.tagName == 'A')
                return true;
            else {
                curNode = curNode.parentNode;
            }
            return false;
        }

        function addEventListenerByClass(className, event, fn) {
            var list = document.getElementsByClassName(className);
            for (var i = 0, len = list.length; i < len; i++) {
                list[i].addEventListener(event, fn, false);
            }
        }

        function insertSpanInTextNode(textNode, spanKey, spanClass, at) {
            var span = document.createElement("span");
            span.setAttribute('key', spanKey);
            span.className = spanClass;
            span.appendChild(document.createTextNode(''));
            textNode.parentNode.insertBefore(span, textNode.splitText(at));
        }

    }

})