(function() {
    function walk(node) {
        var child, next;
        try {
            switch (node.nodeType) {
                case 1:
                case 9:
                case 11:
                    child = node.firstChild;
                    while (child) {
                        next = child.nextSibling;
                        walk(child);
                        child = next;
                    }
                    break;
                case 3:
                    if (node.parentElement.tagName.toLowerCase() != "script") {
                        processTextNode(node);
                    }
                    break;
            }
        } catch (err) {
            console.log("Error Bitsee: " + err);
        }
    }

    function nodeInLink(textNode) {
        var curNode = textNode;
        while (curNode) {
            if (curNode.tagName == 'A')
                return true;
            else
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
                span.setAttribute('key', spanKey);
                span.className = spanClass;
                span.appendChild(document.createTextNode(''));
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
            if (myVar.readyState == 4) {
                var status = myVar.status;
                if (status == 200) {
                    var myReceived = parseInt(myVar.response.total_received) / 100000000;
                    var myBalance = parseInt(myVar.response.final_balance) / 100000000;
                    node.innerHTML = ' Balance: ' + myBalance + ' BTC Received: ' + myReceived + ' BTC <a href="https://blockchain.info/address/' + publicKey + '" target="_blank"></a>';
                } else {
                    node.innerHTML = ' <a href="https://blockchain.info/address/' + publicKey + '" target="_blank">Blockchain</a> info not available.';
                    console.log('Blockchain info not available. Error ' + status + '.');
                    loadBlockExplorerData(node, publicKey);
                }
            }
        }
        var url = 'https://blockchain.info/rawaddr/' + publicKey + '?limit=0'
        node.innerHTML = ' Loading...';

        myVar.open("GET", url, true);
        myVar.responseType = 'json';
        myVar.send();
    }

    function loadBlockExplorerData(node, publicKey) {
        var myVar = new XMLHttpRequest();
        myVar.onreadystatechange = function() {
            if (myVar.readyState == 4) {
                var status = myVar.status;
                if (status == 200) {
                    var myBalance = parseInt(myVar.response) / 100000000;
                    loadBlockExplorerReceived(node, publicKey, myBalance);
                } else {
                    node.innerHTML = ' <a href="https://blockexplorer.com/address/' + publicKey + '" target="_blank">BlockExplorer</a> not available.';
                    console.log('BlockExplorer not available. Error ' + status + '.');
                }
            }
        }
        var url = 'https://blockexplorer.com/q/addressbalance/' + publicKey;

        myVar.open("GET", url, true);
        myVar.send();
    }

    function loadBlockExplorerReceived(node, publicKey, myBalance) {
        var myVar = new XMLHttpRequest();
        myVar.onreadystatechange = function() {
            if (myVar.readyState == 4) {
                var status = myVar.status;
                if (status == 200) {
                    var myReceived = parseInt(myVar.response) / 100000000;
                    node.innerHTML = ' Balance: ' + myBalance + ' BTC. Received: ' + myReceived + ' BTC. <a href="https://blockexplorer.com/address/' + publicKey + '" target="_blank">BlockExplorer</a>';
                } else {
                    node.innerHTML = '<a href="https://blockexplorer.com/address/' + publicKey + '" target="_blank">BlockExplorer</a> not available.';
                    console.log('BlockExplorer not available. Error ' + status + '.');
                }
            }
        }
        var url = 'https://blockexplorer.com/q/getreceivedbyaddress/' + publicKey;

        myVar.open("GET", url, true);
        myVar.send();
    }

    function bbToggle() {
        if (this.nextSibling.innerHTML == '') {
            this.nextSibling.style.display = 'inline';
            var publicKey = this.parentNode.getAttribute('key');
            loadData(this.nextSibling, publicKey);
        } else {
            if (this.nextSibling.style.display == 'none') {
                this.nextSibling.style.display = 'inline';
            } else {
                this.nextSibling.style.display = 'none';
            }
        }
    }

    function addHolderContent(context) {
        try {
            var list = context.getElementsByClassName('bbHolder');

            for (var i = 0, len = list.length; i < len; i++) {
                var img = document.createElement("img");
                img.src = browser.extension.getURL("icons/logo32.png");
                img.className = 'bitcoinBalanceIcon';
                img.setAttribute('title', 'BitSee');
                img.setAttribute('alt', '');
                img.style.cssText = 'height:1em;vertical-align:-10%;cursor:pointer;margin-left:.5em;display:inline;';
                list[i].appendChild(img);

                var span = document.createElement("span");
                span.style.cssText = 'display:none';
                span.appendChild(document.createTextNode(''));
                list[i].appendChild(span);
            }

        } catch (err) {
            console.log("Error Bitsee: " + err);
            return false;
        }
    }

    function processTextNode(textNode) {

        var bitcoinHash = /\b[13][1-9A-HJ-NP-Za-km-z]{26,33}\b/g
        var val = textNode.nodeValue;

        if (bitcoinHash.test(val)) {
            if (nodeInLink(textNode)) {
                var publicKeys = val.match(bitcoinHash);
                var publicKey = publicKeys[0];

                insertSpanAfterLink(textNode, publicKey, 'bbHolder');
            } else {
                var anotherBitcoinHash = /\b[13][1-9A-HJ-NP-Za-km-z]{26,33}\b/g;


                var myArray;
                var prev = 0;
                var counter = 0;
                var curNode = textNode;
                while ((myArray = anotherBitcoinHash.exec(val)) !== null) {
                    insertSpanInTextNode(curNode, myArray[0], 'bbHolder', anotherBitcoinHash.lastIndex - prev);
                    prev = anotherBitcoinHash.lastIndex;
                    counter = counter + 1;
                    curNode = textNode.parentNode.childNodes[2 * counter];
                }
            }
        }
    }

    function observeMutations() {
        target = document.body;
        var observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                target = mutation.addedNodes[0];
                main(target);
            });
        });
        var config = { attributes: true, childList: true, characterData: true };
        observer.observe(target, config);
    }

    function main(target) {
        walk(target);
        addHolderContent(target);
        addEventListenerByClass('bitcoinBalanceIcon', 'click', bbToggle);


    }
    main(document.body);
    observeMutations();

})();