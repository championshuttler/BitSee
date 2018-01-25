// Author : championshuttler
// Date : 25th Jan 2018


(function() {
    function walk(node) {
        var chil, next;
        try {
            switch (node.nodeType) {
                case 1: // elemeent
                case 9: // document
                case 11: // document fragment
                    child = node.firstChild;
                    while (child) {
                        next = child.nextSibling;
                        walk(child);
                        child = next;
                    }
            }
        }
    }
})