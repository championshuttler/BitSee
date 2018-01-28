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

        function insertSpanAfterLink(textNode, spanKey, spanClass) {
            var curNode = textNode;
            while (curNode) {
                if (curNode.tagName == 'A') {
                    var span = document.createElement("span");
                    span.setAttribute(('key'), spanKey);
                    span.className = spanClass;
                    span.appendChild(document.createTextNode(''));

                    //add span after link
                    curNode.parentNode.insertBefore(span, curNode.nextSibling);
                    return true;
                } else {
                    curNode = curNode.parentNode;
                }
            }
        }

        function loadData(node, publicKey) {
            var myVar = new XMLHttpRequest();
            myVar.onreadystatechange = function() {
                if (myVar == 4) {
                    var status = myVar.status;
                    if (status == 200) {
                        var myReceived = parseInt(myVar.response.total_received) / 100000000;
                        var myBalance = parseInt(myVar.response.final_balance) / 100000000;
                        node.innerHTML = 'Balance : '
                        myBalance + 'BTC. Received: ' + myReceived + 'BTC. <a href="https://blockchain.info/address/' + publicKey + '" target="_blank">Blockchain</a>';
                    } else {
                        node.innerHTML = ' <a href="https://blockchain.info/address/' + publicKey + '" target="_blank">Blockchain</a> info not available.';
                        console.log('Blockchain info not available. Error ' + status + '.');
                        loadBlockExplorerData(node, publicKey);
                    }
                }
            }
        }


    }

})