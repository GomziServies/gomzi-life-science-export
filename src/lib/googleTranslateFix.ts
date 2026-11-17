/**
 * Google Website Translator swaps text nodes for its own <font> wrappers. When React later
 * removes or re-orders a node it rendered, that node may no longer be a child of the expected
 * parent, and the DOM throws ("Failed to execute 'removeChild' on 'Node'"), crashing the app.
 * These guards make those two calls no-ops in that situation instead of throwing.
 */
if (typeof Node === 'function' && Node.prototype) {
  const originalRemoveChild = Node.prototype.removeChild;
  Node.prototype.removeChild = function <T extends Node>(this: Node, child: T): T {
    if (child.parentNode !== this) return child;
    return originalRemoveChild.call(this, child) as T;
  };

  const originalInsertBefore = Node.prototype.insertBefore;
  Node.prototype.insertBefore = function <T extends Node>(this: Node, newNode: T, referenceNode: Node | null): T {
    if (referenceNode && referenceNode.parentNode !== this) return newNode;
    return originalInsertBefore.call(this, newNode, referenceNode) as T;
  };
}

export {};
