// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

(function(modules, cache, entry, globalName) {
  /* eslint-disable no-undef */
  var globalObject =
    typeof globalThis !== 'undefined'
      ? globalThis
      : typeof self !== 'undefined'
      ? self
      : typeof window !== 'undefined'
      ? window
      : typeof global !== 'undefined'
      ? global
      : {};
  /* eslint-enable no-undef */

  // Save the require from previous bundle to this closure if any
  var previousRequire =
    typeof globalObject.parcelRequire === 'function' &&
    globalObject.parcelRequire;
  // Do not use `require` to prevent Webpack from trying to bundle this call
  var nodeRequire =
    typeof module !== 'undefined' &&
    typeof module.require === 'function' &&
    module.require.bind(module);

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire =
          typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error("Cannot find module '" + name + "'");
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = (cache[name] = new newRequire.Module(name));

      modules[name][0].call(
        module.exports,
        localRequire,
        module,
        module.exports,
        this
      );
    }

    return cache[name].exports;

    function localRequire(x) {
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x) {
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function(id, exports) {
    modules[id] = [
      function(require, module) {
        module.exports = exports;
      },
      {},
    ];
  };

  globalObject.parcelRequire = newRequire;

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === 'object' && typeof module !== 'undefined') {
      module.exports = mainExports;

      // RequireJS
    } else if (typeof define === 'function' && define.amd) {
      define(function() {
        return mainExports;
      });

      // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }
})({"64c1770b35b04eb343009bb27a752262":[function(require,module,exports) {
var Refresh = require('react-refresh/runtime');

Refresh.injectIntoGlobalHook(window);

window.$RefreshReg$ = function () {};

window.$RefreshSig$ = function () {
  return function (type) {
    return type;
  };
};
},{"react-refresh/runtime":"6a2f65278353e882d7f14bcf674e0c85"}],"6a2f65278353e882d7f14bcf674e0c85":[function(require,module,exports) {
'use strict';

if ("development" === 'production') {
  module.exports = require('./cjs/react-refresh-runtime.production.min.js');
} else {
  module.exports = require('./cjs/react-refresh-runtime.development.js');
}
},{"./cjs/react-refresh-runtime.development.js":"356d4ad522052a25469644186ca8abea"}],"356d4ad522052a25469644186ca8abea":[function(require,module,exports) {
/** @license React v0.6.0
 * react-refresh-runtime.development.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
'use strict';

if ("development" !== "production") {
  (function () {
    'use strict'; // The Symbol used to tag the ReactElement-like types. If there is no native Symbol
    // nor polyfill, then a plain number is used for performance.

    var hasSymbol = typeof Symbol === 'function' && Symbol.for; // TODO: We don't use AsyncMode or ConcurrentMode anymore. They were temporary
    // (unstable) APIs that have been removed. Can we remove the symbols?

    var REACT_FORWARD_REF_TYPE = hasSymbol ? Symbol.for('react.forward_ref') : 0xead0;
    var REACT_MEMO_TYPE = hasSymbol ? Symbol.for('react.memo') : 0xead3;
    var PossiblyWeakMap = typeof WeakMap === 'function' ? WeakMap : Map; // We never remove these associations.
    // It's OK to reference families, but use WeakMap/Set for types.

    var allFamiliesByID = new Map();
    var allFamiliesByType = new PossiblyWeakMap();
    var allSignaturesByType = new PossiblyWeakMap(); // This WeakMap is read by React, so we only put families
    // that have actually been edited here. This keeps checks fast.
    // $FlowIssue

    var updatedFamiliesByType = new PossiblyWeakMap(); // This is cleared on every performReactRefresh() call.
    // It is an array of [Family, NextType] tuples.

    var pendingUpdates = []; // This is injected by the renderer via DevTools global hook.

    var helpersByRendererID = new Map();
    var helpersByRoot = new Map(); // We keep track of mounted roots so we can schedule updates.

    var mountedRoots = new Set(); // If a root captures an error, we add its element to this Map so we can retry on edit.

    var failedRoots = new Map();
    var didSomeRootFailOnMount = false;

    function computeFullKey(signature) {
      if (signature.fullKey !== null) {
        return signature.fullKey;
      }

      var fullKey = signature.ownKey;
      var hooks;

      try {
        hooks = signature.getCustomHooks();
      } catch (err) {
        // This can happen in an edge case, e.g. if expression like Foo.useSomething
        // depends on Foo which is lazily initialized during rendering.
        // In that case just assume we'll have to remount.
        signature.forceReset = true;
        signature.fullKey = fullKey;
        return fullKey;
      }

      for (var i = 0; i < hooks.length; i++) {
        var hook = hooks[i];

        if (typeof hook !== 'function') {
          // Something's wrong. Assume we need to remount.
          signature.forceReset = true;
          signature.fullKey = fullKey;
          return fullKey;
        }

        var nestedHookSignature = allSignaturesByType.get(hook);

        if (nestedHookSignature === undefined) {
          // No signature means Hook wasn't in the source code, e.g. in a library.
          // We'll skip it because we can assume it won't change during this session.
          continue;
        }

        var nestedHookKey = computeFullKey(nestedHookSignature);

        if (nestedHookSignature.forceReset) {
          signature.forceReset = true;
        }

        fullKey += '\n---\n' + nestedHookKey;
      }

      signature.fullKey = fullKey;
      return fullKey;
    }

    function haveEqualSignatures(prevType, nextType) {
      var prevSignature = allSignaturesByType.get(prevType);
      var nextSignature = allSignaturesByType.get(nextType);

      if (prevSignature === undefined && nextSignature === undefined) {
        return true;
      }

      if (prevSignature === undefined || nextSignature === undefined) {
        return false;
      }

      if (computeFullKey(prevSignature) !== computeFullKey(nextSignature)) {
        return false;
      }

      if (nextSignature.forceReset) {
        return false;
      }

      return true;
    }

    function isReactClass(type) {
      return type.prototype && type.prototype.isReactComponent;
    }

    function canPreserveStateBetween(prevType, nextType) {
      if (isReactClass(prevType) || isReactClass(nextType)) {
        return false;
      }

      if (haveEqualSignatures(prevType, nextType)) {
        return true;
      }

      return false;
    }

    function resolveFamily(type) {
      // Only check updated types to keep lookups fast.
      return updatedFamiliesByType.get(type);
    }

    function performReactRefresh() {
      {
        if (pendingUpdates.length === 0) {
          return null;
        }

        var staleFamilies = new Set();
        var updatedFamilies = new Set();
        var updates = pendingUpdates;
        pendingUpdates = [];
        updates.forEach(function (_ref) {
          var family = _ref[0],
              nextType = _ref[1]; // Now that we got a real edit, we can create associations
          // that will be read by the React reconciler.

          var prevType = family.current;
          updatedFamiliesByType.set(prevType, family);
          updatedFamiliesByType.set(nextType, family);
          family.current = nextType; // Determine whether this should be a re-render or a re-mount.

          if (canPreserveStateBetween(prevType, nextType)) {
            updatedFamilies.add(family);
          } else {
            staleFamilies.add(family);
          }
        }); // TODO: rename these fields to something more meaningful.

        var update = {
          updatedFamilies: updatedFamilies,
          // Families that will re-render preserving state
          staleFamilies: staleFamilies // Families that will be remounted

        };
        helpersByRendererID.forEach(function (helpers) {
          // Even if there are no roots, set the handler on first update.
          // This ensures that if *new* roots are mounted, they'll use the resolve handler.
          helpers.setRefreshHandler(resolveFamily);
        });
        var didError = false;
        var firstError = null;
        failedRoots.forEach(function (element, root) {
          var helpers = helpersByRoot.get(root);

          if (helpers === undefined) {
            throw new Error('Could not find helpers for a root. This is a bug in React Refresh.');
          }

          try {
            helpers.scheduleRoot(root, element);
          } catch (err) {
            if (!didError) {
              didError = true;
              firstError = err;
            } // Keep trying other roots.

          }
        });
        mountedRoots.forEach(function (root) {
          var helpers = helpersByRoot.get(root);

          if (helpers === undefined) {
            throw new Error('Could not find helpers for a root. This is a bug in React Refresh.');
          }

          try {
            helpers.scheduleRefresh(root, update);
          } catch (err) {
            if (!didError) {
              didError = true;
              firstError = err;
            } // Keep trying other roots.

          }
        });

        if (didError) {
          throw firstError;
        }

        return update;
      }
    }

    function register(type, id) {
      {
        if (type === null) {
          return;
        }

        if (typeof type !== 'function' && typeof type !== 'object') {
          return;
        } // This can happen in an edge case, e.g. if we register
        // return value of a HOC but it returns a cached component.
        // Ignore anything but the first registration for each type.


        if (allFamiliesByType.has(type)) {
          return;
        } // Create family or remember to update it.
        // None of this bookkeeping affects reconciliation
        // until the first performReactRefresh() call above.


        var family = allFamiliesByID.get(id);

        if (family === undefined) {
          family = {
            current: type
          };
          allFamiliesByID.set(id, family);
        } else {
          pendingUpdates.push([family, type]);
        }

        allFamiliesByType.set(type, family); // Visit inner types because we might not have registered them.

        if (typeof type === 'object' && type !== null) {
          switch (type.$$typeof) {
            case REACT_FORWARD_REF_TYPE:
              register(type.render, id + '$render');
              break;

            case REACT_MEMO_TYPE:
              register(type.type, id + '$type');
              break;
          }
        }
      }
    }

    function setSignature(type, key) {
      var forceReset = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
      var getCustomHooks = arguments.length > 3 ? arguments[3] : undefined;
      {
        allSignaturesByType.set(type, {
          forceReset: forceReset,
          ownKey: key,
          fullKey: null,
          getCustomHooks: getCustomHooks || function () {
            return [];
          }
        });
      }
    } // This is lazily called during first render for a type.
    // It captures Hook list at that time so inline requires don't break comparisons.


    function collectCustomHooksForSignature(type) {
      {
        var signature = allSignaturesByType.get(type);

        if (signature !== undefined) {
          computeFullKey(signature);
        }
      }
    }

    function getFamilyByID(id) {
      {
        return allFamiliesByID.get(id);
      }
    }

    function getFamilyByType(type) {
      {
        return allFamiliesByType.get(type);
      }
    }

    function findAffectedHostInstances(families) {
      {
        var affectedInstances = new Set();
        mountedRoots.forEach(function (root) {
          var helpers = helpersByRoot.get(root);

          if (helpers === undefined) {
            throw new Error('Could not find helpers for a root. This is a bug in React Refresh.');
          }

          var instancesForRoot = helpers.findHostInstancesForRefresh(root, families);
          instancesForRoot.forEach(function (inst) {
            affectedInstances.add(inst);
          });
        });
        return affectedInstances;
      }
    }

    function injectIntoGlobalHook(globalObject) {
      {
        // For React Native, the global hook will be set up by require('react-devtools-core').
        // That code will run before us. So we need to monkeypatch functions on existing hook.
        // For React Web, the global hook will be set up by the extension.
        // This will also run before us.
        var hook = globalObject.__REACT_DEVTOOLS_GLOBAL_HOOK__;

        if (hook === undefined) {
          // However, if there is no DevTools extension, we'll need to set up the global hook ourselves.
          // Note that in this case it's important that renderer code runs *after* this method call.
          // Otherwise, the renderer will think that there is no global hook, and won't do the injection.
          var nextID = 0;
          globalObject.__REACT_DEVTOOLS_GLOBAL_HOOK__ = hook = {
            supportsFiber: true,
            inject: function (injected) {
              return nextID++;
            },
            onCommitFiberRoot: function (id, root, maybePriorityLevel, didError) {},
            onCommitFiberUnmount: function () {}
          };
        } // Here, we just want to get a reference to scheduleRefresh.


        var oldInject = hook.inject;

        hook.inject = function (injected) {
          var id = oldInject.apply(this, arguments);

          if (typeof injected.scheduleRefresh === 'function' && typeof injected.setRefreshHandler === 'function') {
            // This version supports React Refresh.
            helpersByRendererID.set(id, injected);
          }

          return id;
        }; // We also want to track currently mounted roots.


        var oldOnCommitFiberRoot = hook.onCommitFiberRoot;

        hook.onCommitFiberRoot = function (id, root, maybePriorityLevel, didError) {
          var helpers = helpersByRendererID.get(id);

          if (helpers === undefined) {
            return;
          }

          helpersByRoot.set(root, helpers);
          var current = root.current;
          var alternate = current.alternate; // We need to determine whether this root has just (un)mounted.
          // This logic is copy-pasted from similar logic in the DevTools backend.
          // If this breaks with some refactoring, you'll want to update DevTools too.

          if (alternate !== null) {
            var wasMounted = alternate.memoizedState != null && alternate.memoizedState.element != null;
            var isMounted = current.memoizedState != null && current.memoizedState.element != null;

            if (!wasMounted && isMounted) {
              // Mount a new root.
              mountedRoots.add(root);
              failedRoots.delete(root);
            } else if (wasMounted && isMounted) {// Update an existing root.
              // This doesn't affect our mounted root Set.
            } else if (wasMounted && !isMounted) {
              // Unmount an existing root.
              mountedRoots.delete(root);

              if (didError) {
                // We'll remount it on future edits.
                // Remember what was rendered so we can restore it.
                failedRoots.set(root, alternate.memoizedState.element);
              } else {
                helpersByRoot.delete(root);
              }
            } else if (!wasMounted && !isMounted) {
              if (didError && !failedRoots.has(root)) {
                // The root had an error during the initial mount.
                // We can't read its last element from the memoized state
                // because there was no previously committed alternate.
                // Ideally, it would be nice if we had a way to extract
                // the last attempted rendered element, but accessing the update queue
                // would tie this package too closely to the reconciler version.
                // So instead, we just set a flag.
                // TODO: Maybe we could fix this as the same time as when we fix
                // DevTools to not depend on `alternate.memoizedState.element`.
                didSomeRootFailOnMount = true;
              }
            }
          } else {
            // Mount a new root.
            mountedRoots.add(root);
          }

          return oldOnCommitFiberRoot.apply(this, arguments);
        };
      }
    }

    function hasUnrecoverableErrors() {
      return didSomeRootFailOnMount;
    } // Exposed for testing.


    function _getMountedRootCount() {
      {
        return mountedRoots.size;
      }
    } // This is a wrapper over more primitive functions for setting signature.
    // Signatures let us decide whether the Hook order has changed on refresh.
    //
    // This function is intended to be used as a transform target, e.g.:
    // var _s = createSignatureFunctionForTransform()
    //
    // function Hello() {
    //   const [foo, setFoo] = useState(0);
    //   const value = useCustomHook();
    //   _s(); /* Second call triggers collecting the custom Hook list.
    //          * This doesn't happen during the module evaluation because we
    //          * don't want to change the module order with inline requires.
    //          * Next calls are noops. */
    //   return <h1>Hi</h1>;
    // }
    //
    // /* First call specifies the signature: */
    // _s(
    //   Hello,
    //   'useState{[foo, setFoo]}(0)',
    //   () => [useCustomHook], /* Lazy to avoid triggering inline requires */
    // );


    function createSignatureFunctionForTransform() {
      {
        var call = 0;
        var savedType;
        var hasCustomHooks;
        return function (type, key, forceReset, getCustomHooks) {
          switch (call++) {
            case 0:
              savedType = type;
              hasCustomHooks = typeof getCustomHooks === 'function';
              setSignature(type, key, forceReset, getCustomHooks);
              break;

            case 1:
              if (hasCustomHooks) {
                collectCustomHooksForSignature(savedType);
              }

              break;
          }

          return type;
        };
      }
    }

    function isLikelyComponentType(type) {
      {
        switch (typeof type) {
          case 'function':
            {
              // First, deal with classes.
              if (type.prototype != null) {
                if (type.prototype.isReactComponent) {
                  // React class.
                  return true;
                }

                var ownNames = Object.getOwnPropertyNames(type.prototype);

                if (ownNames.length > 1 || ownNames[0] !== 'constructor') {
                  // This looks like a class.
                  return false;
                } // eslint-disable-next-line no-proto


                if (type.prototype.__proto__ !== Object.prototype) {
                  // It has a superclass.
                  return false;
                } // Pass through.
                // This looks like a regular function with empty prototype.

              } // For plain functions and arrows, use name as a heuristic.


              var name = type.name || type.displayName;
              return typeof name === 'string' && /^[A-Z]/.test(name);
            }

          case 'object':
            {
              if (type != null) {
                switch (type.$$typeof) {
                  case REACT_FORWARD_REF_TYPE:
                  case REACT_MEMO_TYPE:
                    // Definitely React components.
                    return true;

                  default:
                    return false;
                }
              }

              return false;
            }

          default:
            {
              return false;
            }
        }
      }
    }

    var ReactFreshRuntime = Object.freeze({
      performReactRefresh: performReactRefresh,
      register: register,
      setSignature: setSignature,
      collectCustomHooksForSignature: collectCustomHooksForSignature,
      getFamilyByID: getFamilyByID,
      getFamilyByType: getFamilyByType,
      findAffectedHostInstances: findAffectedHostInstances,
      injectIntoGlobalHook: injectIntoGlobalHook,
      hasUnrecoverableErrors: hasUnrecoverableErrors,
      _getMountedRootCount: _getMountedRootCount,
      createSignatureFunctionForTransform: createSignatureFunctionForTransform,
      isLikelyComponentType: isLikelyComponentType
    }); // This is hacky but makes it work with both Rollup and Jest.

    var runtime = ReactFreshRuntime.default || ReactFreshRuntime;
    module.exports = runtime;
  })();
}
},{}],"b43181db6a6395d3e3b5def7bf5eb5c5":[function(require,module,exports) {
var global = arguments[3];
var HMR_HOST = null;
var HMR_PORT = 1234;
var HMR_ENV_HASH = "d751713988987e9331980363e24189ce";
module.bundle.HMR_BUNDLE_ID = "c12951d85a1d62f88910bcaff2634f2f";
/* global HMR_HOST, HMR_PORT, HMR_ENV_HASH */

var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept, acceptedAssets; // eslint-disable-next-line no-redeclare

var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = HMR_HOST || (location.protocol.indexOf('http') === 0 ? location.hostname : 'localhost');
  var port = HMR_PORT || location.port;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + (port ? ':' + port : '') + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    acceptedAssets = {};
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      // Remove error overlay if there is one
      removeErrorOverlay();
      let assets = data.assets.filter(asset => asset.envHash === HMR_ENV_HASH); // Handle HMR Update

      var handled = false;
      assets.forEach(asset => {
        var didAccept = asset.type === 'css' || hmrAcceptCheck(global.parcelRequire, asset.id);

        if (didAccept) {
          handled = true;
        }
      });

      if (handled) {
        console.clear();
        assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });

        for (var i = 0; i < assetsToAccept.length; i++) {
          var id = assetsToAccept[i][1];

          if (!acceptedAssets[id]) {
            hmrAcceptRun(assetsToAccept[i][0], id);
          }
        }
      } else {
        window.location.reload();
      }
    }

    if (data.type === 'error') {
      // Log parcel errors to console
      for (let ansiDiagnostic of data.diagnostics.ansi) {
        let stack = ansiDiagnostic.codeframe ? ansiDiagnostic.codeframe : ansiDiagnostic.stack;
        console.error('🚨 [parcel]: ' + ansiDiagnostic.message + '\n' + stack + '\n\n' + ansiDiagnostic.hints.join('\n'));
      } // Render the fancy html overlay


      removeErrorOverlay();
      var overlay = createErrorOverlay(data.diagnostics.html);
      document.body.appendChild(overlay);
    }
  };

  ws.onerror = function (e) {
    console.error(e.message);
  };

  ws.onclose = function (e) {
    console.warn('[parcel] 🚨 Connection to the HMR server was lost');
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
    console.log('[parcel] ✨ Error resolved');
  }
}

function createErrorOverlay(diagnostics) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID;
  let errorHTML = '<div style="background: black; opacity: 0.85; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; font-family: Menlo, Consolas, monospace; z-index: 9999;">';

  for (let diagnostic of diagnostics) {
    let stack = diagnostic.codeframe ? diagnostic.codeframe : diagnostic.stack;
    errorHTML += `
      <div>
        <div style="font-size: 18px; font-weight: bold; margin-top: 20px;">
          🚨 ${diagnostic.message}
        </div>
        <pre>
          ${stack}
        </pre>
        <div>
          ${diagnostic.hints.map(hint => '<div>' + hint + '</div>').join('')}
        </div>
      </div>
    `;
  }

  errorHTML += '</div>';
  overlay.innerHTML = errorHTML;
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push([bundle, k]);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function updateLink(link) {
  var newLink = link.cloneNode();

  newLink.onload = function () {
    if (link.parentNode !== null) {
      link.parentNode.removeChild(link);
    }
  };

  newLink.setAttribute('href', link.getAttribute('href').split('?')[0] + '?' + Date.now());
  link.parentNode.insertBefore(newLink, link.nextSibling);
}

var cssTimeout = null;

function reloadCSS() {
  if (cssTimeout) {
    return;
  }

  cssTimeout = setTimeout(function () {
    var links = document.querySelectorAll('link[rel="stylesheet"]');

    for (var i = 0; i < links.length; i++) {
      var absolute = /^https?:\/\//i.test(links[i].getAttribute('href'));

      if (!absolute) {
        updateLink(links[i]);
      }
    }

    cssTimeout = null;
  }, 50);
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    if (asset.type === 'css') {
      reloadCSS();
    } else {
      var fn = new Function('require', 'module', 'exports', asset.output);
      modules[asset.id] = [fn, asset.depsByBundle[bundle.HMR_BUNDLE_ID]];
    }
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (v) {
    return hmrAcceptCheck(v[0], v[1]);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached && cached.hot) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      var assetsToAlsoAccept = cb(function () {
        return getParents(global.parcelRequire, id);
      });

      if (assetsToAlsoAccept && assetsToAccept.length) {
        assetsToAccept.push.apply(assetsToAccept, assetsToAlsoAccept);
      }
    });
  }

  acceptedAssets[id] = true;
}
},{}],"7279b402b640b7f92be7156d139a932b":[function(require,module,exports) {

},{}]},{},["64c1770b35b04eb343009bb27a752262","b43181db6a6395d3e3b5def7bf5eb5c5","7279b402b640b7f92be7156d139a932b"], null)

//# sourceMappingURL=ReactApi.c12951d8.js.map
