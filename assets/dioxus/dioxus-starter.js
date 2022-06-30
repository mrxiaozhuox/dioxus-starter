import { Interpreter } from './snippets/dioxus-interpreter-js-459fb15b86d869f7/src/interpreter.js';

let wasm;

const heap = new Array(32).fill(undefined);

heap.push(undefined, null, true, false);

function getObject(idx) { return heap[idx]; }

let heap_next = heap.length;

function dropObject(idx) {
    if (idx < 36) return;
    heap[idx] = heap_next;
    heap_next = idx;
}

function takeObject(idx) {
    const ret = getObject(idx);
    dropObject(idx);
    return ret;
}

const cachedTextDecoder = new TextDecoder('utf-8', { ignoreBOM: true, fatal: true });

cachedTextDecoder.decode();

let cachedUint8Memory0;
function getUint8Memory0() {
    if (cachedUint8Memory0.byteLength === 0) {
        cachedUint8Memory0 = new Uint8Array(wasm.memory.buffer);
    }
    return cachedUint8Memory0;
}

function getStringFromWasm0(ptr, len) {
    return cachedTextDecoder.decode(getUint8Memory0().subarray(ptr, ptr + len));
}

function addHeapObject(obj) {
    if (heap_next === heap.length) heap.push(heap.length + 1);
    const idx = heap_next;
    heap_next = heap[idx];

    if (typeof(heap_next) !== 'number') throw new Error('corrupt heap');

    heap[idx] = obj;
    return idx;
}

function _assertBoolean(n) {
    if (typeof(n) !== 'boolean') {
        throw new Error('expected a boolean argument');
    }
}

function debugString(val) {
    // primitive types
    const type = typeof val;
    if (type == 'number' || type == 'boolean' || val == null) {
        return  `${val}`;
    }
    if (type == 'string') {
        return `"${val}"`;
    }
    if (type == 'symbol') {
        const description = val.description;
        if (description == null) {
            return 'Symbol';
        } else {
            return `Symbol(${description})`;
        }
    }
    if (type == 'function') {
        const name = val.name;
        if (typeof name == 'string' && name.length > 0) {
            return `Function(${name})`;
        } else {
            return 'Function';
        }
    }
    // objects
    if (Array.isArray(val)) {
        const length = val.length;
        let debug = '[';
        if (length > 0) {
            debug += debugString(val[0]);
        }
        for(let i = 1; i < length; i++) {
            debug += ', ' + debugString(val[i]);
        }
        debug += ']';
        return debug;
    }
    // Test for built-in
    const builtInMatches = /\[object ([^\]]+)\]/.exec(toString.call(val));
    let className;
    if (builtInMatches.length > 1) {
        className = builtInMatches[1];
    } else {
        // Failed to match the standard '[object ClassName]'
        return toString.call(val);
    }
    if (className == 'Object') {
        // we're a user defined class or Object
        // JSON.stringify avoids problems with cycles, and is generally much
        // easier than looping through ownProperties of `val`.
        try {
            return 'Object(' + JSON.stringify(val) + ')';
        } catch (_) {
            return 'Object';
        }
    }
    // errors
    if (val instanceof Error) {
        return `${val.name}: ${val.message}\n${val.stack}`;
    }
    // TODO we could test for more things here, like `Set`s and `Map`s.
    return className;
}

let WASM_VECTOR_LEN = 0;

const cachedTextEncoder = new TextEncoder('utf-8');

const encodeString = (typeof cachedTextEncoder.encodeInto === 'function'
    ? function (arg, view) {
    return cachedTextEncoder.encodeInto(arg, view);
}
    : function (arg, view) {
    const buf = cachedTextEncoder.encode(arg);
    view.set(buf);
    return {
        read: arg.length,
        written: buf.length
    };
});

function passStringToWasm0(arg, malloc, realloc) {

    if (typeof(arg) !== 'string') throw new Error('expected a string argument');

    if (realloc === undefined) {
        const buf = cachedTextEncoder.encode(arg);
        const ptr = malloc(buf.length);
        getUint8Memory0().subarray(ptr, ptr + buf.length).set(buf);
        WASM_VECTOR_LEN = buf.length;
        return ptr;
    }

    let len = arg.length;
    let ptr = malloc(len);

    const mem = getUint8Memory0();

    let offset = 0;

    for (; offset < len; offset++) {
        const code = arg.charCodeAt(offset);
        if (code > 0x7F) break;
        mem[ptr + offset] = code;
    }

    if (offset !== len) {
        if (offset !== 0) {
            arg = arg.slice(offset);
        }
        ptr = realloc(ptr, len, len = offset + arg.length * 3);
        const view = getUint8Memory0().subarray(ptr + offset, ptr + len);
        const ret = encodeString(arg, view);
        if (ret.read !== arg.length) throw new Error('failed to pass whole string');
        offset += ret.written;
    }

    WASM_VECTOR_LEN = offset;
    return ptr;
}

let cachedInt32Memory0;
function getInt32Memory0() {
    if (cachedInt32Memory0.byteLength === 0) {
        cachedInt32Memory0 = new Int32Array(wasm.memory.buffer);
    }
    return cachedInt32Memory0;
}

function makeMutClosure(arg0, arg1, dtor, f) {
    const state = { a: arg0, b: arg1, cnt: 1, dtor };
    const real = (...args) => {
        // First up with a closure we increment the internal reference
        // count. This ensures that the Rust closure environment won't
        // be deallocated while we're invoking it.
        state.cnt++;
        const a = state.a;
        state.a = 0;
        try {
            return f(a, state.b, ...args);
        } finally {
            if (--state.cnt === 0) {
                wasm.__wbindgen_export_2.get(state.dtor)(a, state.b);

            } else {
                state.a = a;
            }
        }
    };
    real.original = state;

    return real;
}

function logError(f, args) {
    try {
        return f.apply(this, args);
    } catch (e) {
        let error = (function () {
            try {
                return e instanceof Error ? `${e.message}\n\nStack:\n${e.stack}` : e.toString();
            } catch(_) {
                return "<failed to stringify thrown value>";
            }
        }());
        console.error("wasm-bindgen: imported JS function that was not marked as `catch` threw an error:", error);
        throw e;
    }
}

function _assertNum(n) {
    if (typeof(n) !== 'number') throw new Error('expected a number argument');
}

let stack_pointer = 32;

function addBorrowedObject(obj) {
    if (stack_pointer == 1) throw new Error('out of js stack');
    heap[--stack_pointer] = obj;
    return stack_pointer;
}
function __wbg_adapter_18(arg0, arg1, arg2) {
    try {
        _assertNum(arg0);
        _assertNum(arg1);
        wasm._dyn_core__ops__function__FnMut___A____Output___R_as_wasm_bindgen__closure__WasmClosure___describe__invoke__h18195c49bfa11a54(arg0, arg1, addBorrowedObject(arg2));
    } finally {
        heap[stack_pointer++] = undefined;
    }
}

function __wbg_adapter_21(arg0, arg1, arg2) {
    try {
        _assertNum(arg0);
        _assertNum(arg1);
        wasm._dyn_core__ops__function__FnMut___A____Output___R_as_wasm_bindgen__closure__WasmClosure___describe__invoke__h7668d63d73a382d7(arg0, arg1, addBorrowedObject(arg2));
    } finally {
        heap[stack_pointer++] = undefined;
    }
}

function makeClosure(arg0, arg1, dtor, f) {
    const state = { a: arg0, b: arg1, cnt: 1, dtor };
    const real = (...args) => {
        // First up with a closure we increment the internal reference
        // count. This ensures that the Rust closure environment won't
        // be deallocated while we're invoking it.
        state.cnt++;
        try {
            return f(state.a, state.b, ...args);
        } finally {
            if (--state.cnt === 0) {
                wasm.__wbindgen_export_2.get(state.dtor)(state.a, state.b);
                state.a = 0;

            }
        }
    };
    real.original = state;

    return real;
}
function __wbg_adapter_24(arg0, arg1, arg2) {
    _assertNum(arg0);
    _assertNum(arg1);
    wasm._dyn_core__ops__function__Fn__A____Output___R_as_wasm_bindgen__closure__WasmClosure___describe__invoke__h5d1bee55f31f7d38(arg0, arg1, addHeapObject(arg2));
}

function __wbg_adapter_27(arg0, arg1, arg2) {
    try {
        _assertNum(arg0);
        _assertNum(arg1);
        wasm._dyn_core__ops__function__FnMut___A____Output___R_as_wasm_bindgen__closure__WasmClosure___describe__invoke__h4bdc5ab0ce5d88a0(arg0, arg1, addBorrowedObject(arg2));
    } finally {
        heap[stack_pointer++] = undefined;
    }
}

function __wbg_adapter_30(arg0, arg1, arg2) {
    _assertNum(arg0);
    _assertNum(arg1);
    wasm._dyn_core__ops__function__FnMut__A____Output___R_as_wasm_bindgen__closure__WasmClosure___describe__invoke__h16607186c30799bc(arg0, arg1, addHeapObject(arg2));
}

function __wbg_adapter_33(arg0, arg1) {
    _assertNum(arg0);
    _assertNum(arg1);
    wasm._dyn_core__ops__function__FnMut_____Output___R_as_wasm_bindgen__closure__WasmClosure___describe__invoke__hbf0319ee6ecfdbb7(arg0, arg1);
}

function getCachedStringFromWasm0(ptr, len) {
    if (ptr === 0) {
        return getObject(len);
    } else {
        return getStringFromWasm0(ptr, len);
    }
}

function handleError(f, args) {
    try {
        return f.apply(this, args);
    } catch (e) {
        wasm.__wbindgen_exn_store(addHeapObject(e));
    }
}

function notDefined(what) { return () => { throw new Error(`${what} is not defined`); }; }

const u32CvtShim = new Uint32Array(2);

const uint64CvtShim = new BigUint64Array(u32CvtShim.buffer);

function isLikeNone(x) {
    return x === undefined || x === null;
}

async function load(module, imports) {
    if (typeof Response === 'function' && module instanceof Response) {
        if (typeof WebAssembly.instantiateStreaming === 'function') {
            try {
                return await WebAssembly.instantiateStreaming(module, imports);

            } catch (e) {
                if (module.headers.get('Content-Type') != 'application/wasm') {
                    console.warn("`WebAssembly.instantiateStreaming` failed because your server does not serve wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\n", e);

                } else {
                    throw e;
                }
            }
        }

        const bytes = await module.arrayBuffer();
        return await WebAssembly.instantiate(bytes, imports);

    } else {
        const instance = await WebAssembly.instantiate(module, imports);

        if (instance instanceof WebAssembly.Instance) {
            return { instance, module };

        } else {
            return instance;
        }
    }
}

function getImports() {
    const imports = {};
    imports.wbg = {};
    imports.wbg.__wbindgen_object_drop_ref = function(arg0) {
        takeObject(arg0);
    };
    imports.wbg.__wbindgen_string_new = function(arg0, arg1) {
        const ret = getStringFromWasm0(arg0, arg1);
        return addHeapObject(ret);
    };
    imports.wbg.__wbindgen_object_clone_ref = function(arg0) {
        const ret = getObject(arg0);
        return addHeapObject(ret);
    };
    imports.wbg.__wbindgen_cb_drop = function(arg0) {
        const obj = takeObject(arg0).original;
        if (obj.cnt-- == 1) {
            obj.a = 0;
            return true;
        }
        const ret = false;
        _assertBoolean(ret);
        return ret;
    };
    imports.wbg.__wbindgen_is_function = function(arg0) {
        const ret = typeof(getObject(arg0)) === 'function';
        _assertBoolean(ret);
        return ret;
    };
    imports.wbg.__wbg_new_693216e109162396 = function() { return logError(function () {
        const ret = new Error();
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_stack_0ddaca5d1abfb52f = function() { return logError(function (arg0, arg1) {
        const ret = getObject(arg1).stack;
        const ptr0 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        getInt32Memory0()[arg0 / 4 + 1] = len0;
        getInt32Memory0()[arg0 / 4 + 0] = ptr0;
    }, arguments) };
    imports.wbg.__wbg_error_09919627ac0992f5 = function() { return logError(function (arg0, arg1) {
        var v0 = getCachedStringFromWasm0(arg0, arg1);
    if (arg0 !== 0) { wasm.__wbindgen_free(arg0, arg1); }
    console.error(v0);
}, arguments) };
imports.wbg.__wbindgen_is_undefined = function(arg0) {
    const ret = getObject(arg0) === undefined;
    _assertBoolean(ret);
    return ret;
};
imports.wbg.__wbg_clearTimeout_65417660fe82f08d = typeof clearTimeout == 'function' ? clearTimeout : notDefined('clearTimeout');
imports.wbg.__wbg_setTimeout_131fc254e1bd5624 = function() { return handleError(function (arg0, arg1) {
    const ret = setTimeout(getObject(arg0), arg1);
    _assertNum(ret);
    return ret;
}, arguments) };
imports.wbg.__wbg_new_b28a2eedeb0ae791 = function() { return logError(function (arg0) {
    const ret = new Interpreter(takeObject(arg0));
    return addHeapObject(ret);
}, arguments) };
imports.wbg.__wbg_SetNode_3cacb3b69eaf984a = function() { return logError(function (arg0, arg1, arg2) {
    getObject(arg0).SetNode(arg1 >>> 0, takeObject(arg2));
}, arguments) };
imports.wbg.__wbg_PushRoot_2fc45e345a75c0f4 = function() { return logError(function (arg0, arg1, arg2) {
    u32CvtShim[0] = arg1;
    u32CvtShim[1] = arg2;
    const n0 = uint64CvtShim[0];
    getObject(arg0).PushRoot(n0);
}, arguments) };
imports.wbg.__wbg_PopRoot_37f502792df5013a = function() { return logError(function (arg0) {
    getObject(arg0).PopRoot();
}, arguments) };
imports.wbg.__wbg_AppendChildren_cb58331e674a9890 = function() { return logError(function (arg0, arg1) {
    getObject(arg0).AppendChildren(arg1 >>> 0);
}, arguments) };
imports.wbg.__wbg_ReplaceWith_047004f1504dd9fd = function() { return logError(function (arg0, arg1, arg2, arg3) {
    u32CvtShim[0] = arg1;
    u32CvtShim[1] = arg2;
    const n0 = uint64CvtShim[0];
    getObject(arg0).ReplaceWith(n0, arg3 >>> 0);
}, arguments) };
imports.wbg.__wbg_InsertAfter_2b51bcb76b875653 = function() { return logError(function (arg0, arg1, arg2, arg3) {
    u32CvtShim[0] = arg1;
    u32CvtShim[1] = arg2;
    const n0 = uint64CvtShim[0];
    getObject(arg0).InsertAfter(n0, arg3 >>> 0);
}, arguments) };
imports.wbg.__wbg_InsertBefore_35f9eb4e97336da6 = function() { return logError(function (arg0, arg1, arg2, arg3) {
    u32CvtShim[0] = arg1;
    u32CvtShim[1] = arg2;
    const n0 = uint64CvtShim[0];
    getObject(arg0).InsertBefore(n0, arg3 >>> 0);
}, arguments) };
imports.wbg.__wbg_Remove_4e775fa1976ca6ee = function() { return logError(function (arg0, arg1, arg2) {
    u32CvtShim[0] = arg1;
    u32CvtShim[1] = arg2;
    const n0 = uint64CvtShim[0];
    getObject(arg0).Remove(n0);
}, arguments) };
imports.wbg.__wbg_CreateTextNode_274d8b18710171d1 = function() { return logError(function (arg0, arg1, arg2, arg3) {
    u32CvtShim[0] = arg2;
    u32CvtShim[1] = arg3;
    const n0 = uint64CvtShim[0];
    getObject(arg0).CreateTextNode(takeObject(arg1), n0);
}, arguments) };
imports.wbg.__wbg_CreateElement_e83d7c8e84e44d57 = function() { return logError(function (arg0, arg1, arg2, arg3, arg4) {
    var v0 = getCachedStringFromWasm0(arg1, arg2);
    u32CvtShim[0] = arg3;
    u32CvtShim[1] = arg4;
    const n1 = uint64CvtShim[0];
    getObject(arg0).CreateElement(v0, n1);
}, arguments) };
imports.wbg.__wbg_CreateElementNs_14ee497c33e3c2eb = function() { return logError(function (arg0, arg1, arg2, arg3, arg4, arg5, arg6) {
    var v0 = getCachedStringFromWasm0(arg1, arg2);
    u32CvtShim[0] = arg3;
    u32CvtShim[1] = arg4;
    const n1 = uint64CvtShim[0];
    var v2 = getCachedStringFromWasm0(arg5, arg6);
    getObject(arg0).CreateElementNs(v0, n1, v2);
}, arguments) };
imports.wbg.__wbg_CreatePlaceholder_124b20053ff032fa = function() { return logError(function (arg0, arg1, arg2) {
    u32CvtShim[0] = arg1;
    u32CvtShim[1] = arg2;
    const n0 = uint64CvtShim[0];
    getObject(arg0).CreatePlaceholder(n0);
}, arguments) };
imports.wbg.__wbg_NewEventListener_bbe4a49a18dde684 = function() { return logError(function (arg0, arg1, arg2, arg3, arg4, arg5) {
    var v0 = getCachedStringFromWasm0(arg1, arg2);
    u32CvtShim[0] = arg3;
    u32CvtShim[1] = arg4;
    const n1 = uint64CvtShim[0];
    getObject(arg0).NewEventListener(v0, n1, getObject(arg5));
}, arguments) };
imports.wbg.__wbg_RemoveEventListener_92b2d0d66f2a2018 = function() { return logError(function (arg0, arg1, arg2, arg3, arg4) {
    u32CvtShim[0] = arg1;
    u32CvtShim[1] = arg2;
    const n0 = uint64CvtShim[0];
    var v1 = getCachedStringFromWasm0(arg3, arg4);
    getObject(arg0).RemoveEventListener(n0, v1);
}, arguments) };
imports.wbg.__wbg_SetText_f42fd3eb23f65f34 = function() { return logError(function (arg0, arg1, arg2, arg3) {
    u32CvtShim[0] = arg1;
    u32CvtShim[1] = arg2;
    const n0 = uint64CvtShim[0];
    getObject(arg0).SetText(n0, takeObject(arg3));
}, arguments) };
imports.wbg.__wbg_SetAttribute_862ba64fad05bd68 = function() { return logError(function (arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7) {
    u32CvtShim[0] = arg1;
    u32CvtShim[1] = arg2;
    const n0 = uint64CvtShim[0];
    var v1 = getCachedStringFromWasm0(arg3, arg4);
    var v2 = getCachedStringFromWasm0(arg6, arg7);
    getObject(arg0).SetAttribute(n0, v1, takeObject(arg5), v2);
}, arguments) };
imports.wbg.__wbg_RemoveAttribute_6d85cea304fd611f = function() { return logError(function (arg0, arg1, arg2, arg3, arg4, arg5, arg6) {
    u32CvtShim[0] = arg1;
    u32CvtShim[1] = arg2;
    const n0 = uint64CvtShim[0];
    var v1 = getCachedStringFromWasm0(arg3, arg4);
    var v2 = getCachedStringFromWasm0(arg5, arg6);
    getObject(arg0).RemoveAttribute(n0, v1, v2);
}, arguments) };
imports.wbg.__wbg_instanceof_Window_a2a08d3918d7d4d0 = function() { return logError(function (arg0) {
    const ret = getObject(arg0) instanceof Window;
    _assertBoolean(ret);
    return ret;
}, arguments) };
imports.wbg.__wbg_document_14a383364c173445 = function() { return logError(function (arg0) {
    const ret = getObject(arg0).document;
    return isLikeNone(ret) ? 0 : addHeapObject(ret);
}, arguments) };
imports.wbg.__wbg_location_3b5031b281e8d218 = function() { return logError(function (arg0) {
    const ret = getObject(arg0).location;
    return addHeapObject(ret);
}, arguments) };
imports.wbg.__wbg_history_138ac6c183c00847 = function() { return handleError(function (arg0) {
    const ret = getObject(arg0).history;
    return addHeapObject(ret);
}, arguments) };
imports.wbg.__wbg_sessionStorage_e83c2c60c5113416 = function() { return handleError(function (arg0) {
    const ret = getObject(arg0).sessionStorage;
    return isLikeNone(ret) ? 0 : addHeapObject(ret);
}, arguments) };
imports.wbg.__wbg_requestAnimationFrame_61bcf77211b282b7 = function() { return handleError(function (arg0, arg1) {
    const ret = getObject(arg0).requestAnimationFrame(getObject(arg1));
    _assertNum(ret);
    return ret;
}, arguments) };
imports.wbg.__wbg_requestIdleCallback_8829cb8872a18657 = function() { return handleError(function (arg0, arg1) {
    const ret = getObject(arg0).requestIdleCallback(getObject(arg1));
    _assertNum(ret);
    return ret;
}, arguments) };
imports.wbg.__wbg_title_f5963e572d9d8366 = function() { return logError(function (arg0, arg1) {
    const ret = getObject(arg1).title;
    const ptr0 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len0 = WASM_VECTOR_LEN;
    getInt32Memory0()[arg0 / 4 + 1] = len0;
    getInt32Memory0()[arg0 / 4 + 0] = ptr0;
}, arguments) };
imports.wbg.__wbg_createElement_2d8b75cffbd32c70 = function() { return handleError(function (arg0, arg1, arg2) {
    var v0 = getCachedStringFromWasm0(arg1, arg2);
    const ret = getObject(arg0).createElement(v0);
    return addHeapObject(ret);
}, arguments) };
imports.wbg.__wbg_getElementById_0c9415d96f5b9ec6 = function() { return logError(function (arg0, arg1, arg2) {
    var v0 = getCachedStringFromWasm0(arg1, arg2);
    const ret = getObject(arg0).getElementById(v0);
    return isLikeNone(ret) ? 0 : addHeapObject(ret);
}, arguments) };
imports.wbg.__wbg_pushState_54f843ea8212e98f = function() { return handleError(function (arg0, arg1, arg2, arg3, arg4, arg5) {
    var v0 = getCachedStringFromWasm0(arg2, arg3);
    var v1 = getCachedStringFromWasm0(arg4, arg5);
    getObject(arg0).pushState(getObject(arg1), v0, v1);
}, arguments) };
imports.wbg.__wbg_replaceState_4610ea3c3ac7961a = function() { return handleError(function (arg0, arg1, arg2, arg3, arg4, arg5) {
    var v0 = getCachedStringFromWasm0(arg2, arg3);
    var v1 = getCachedStringFromWasm0(arg4, arg5);
    getObject(arg0).replaceState(getObject(arg1), v0, v1);
}, arguments) };
imports.wbg.__wbg_instanceof_IdleDeadline_35d851665a577ee1 = function() { return logError(function (arg0) {
    const ret = getObject(arg0) instanceof IdleDeadline;
    _assertBoolean(ret);
    return ret;
}, arguments) };
imports.wbg.__wbg_timeRemaining_7a6ae69b762058f3 = function() { return logError(function (arg0) {
    const ret = getObject(arg0).timeRemaining();
    return ret;
}, arguments) };
imports.wbg.__wbg_instanceof_Node_4327514ecb844897 = function() { return logError(function (arg0) {
    const ret = getObject(arg0) instanceof Node;
    _assertBoolean(ret);
    return ret;
}, arguments) };
imports.wbg.__wbg_parentElement_479f575ed7e67715 = function() { return logError(function (arg0) {
    const ret = getObject(arg0).parentElement;
    return isLikeNone(ret) ? 0 : addHeapObject(ret);
}, arguments) };
imports.wbg.__wbg_childNodes_7d112cc802b98b9a = function() { return logError(function (arg0) {
    const ret = getObject(arg0).childNodes;
    return addHeapObject(ret);
}, arguments) };
imports.wbg.__wbg_textContent_5ad566f51aa7829c = function() { return logError(function (arg0, arg1) {
    const ret = getObject(arg1).textContent;
    var ptr0 = isLikeNone(ret) ? 0 : passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len0 = WASM_VECTOR_LEN;
    getInt32Memory0()[arg0 / 4 + 1] = len0;
    getInt32Memory0()[arg0 / 4 + 0] = ptr0;
}, arguments) };
imports.wbg.__wbg_settextContent_ce0ac980cbb8c820 = function() { return logError(function (arg0, arg1, arg2) {
    var v0 = getCachedStringFromWasm0(arg1, arg2);
    getObject(arg0).textContent = v0;
}, arguments) };
imports.wbg.__wbg_getItem_9cb4c95f48b3e51b = function() { return handleError(function (arg0, arg1, arg2, arg3) {
    var v0 = getCachedStringFromWasm0(arg2, arg3);
    const ret = getObject(arg1).getItem(v0);
    var ptr1 = isLikeNone(ret) ? 0 : passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len1 = WASM_VECTOR_LEN;
    getInt32Memory0()[arg0 / 4 + 1] = len1;
    getInt32Memory0()[arg0 / 4 + 0] = ptr1;
}, arguments) };
imports.wbg.__wbg_setItem_04c4ba5c4a9c337f = function() { return handleError(function (arg0, arg1, arg2, arg3, arg4) {
    var v0 = getCachedStringFromWasm0(arg1, arg2);
    var v1 = getCachedStringFromWasm0(arg3, arg4);
    getObject(arg0).setItem(v0, v1);
}, arguments) };
imports.wbg.__wbg_instanceof_Text_bace4b8e267ce92f = function() { return logError(function (arg0) {
    const ret = getObject(arg0) instanceof Text;
    _assertBoolean(ret);
    return ret;
}, arguments) };
imports.wbg.__wbg_instanceof_CompositionEvent_ef8b8844140881e5 = function() { return logError(function (arg0) {
    const ret = getObject(arg0) instanceof CompositionEvent;
    _assertBoolean(ret);
    return ret;
}, arguments) };
imports.wbg.__wbg_data_08682f1bf736c818 = function() { return logError(function (arg0, arg1) {
    const ret = getObject(arg1).data;
    var ptr0 = isLikeNone(ret) ? 0 : passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len0 = WASM_VECTOR_LEN;
    getInt32Memory0()[arg0 / 4 + 1] = len0;
    getInt32Memory0()[arg0 / 4 + 0] = ptr0;
}, arguments) };
imports.wbg.__wbg_href_49cbb85ef16f22d0 = function() { return handleError(function (arg0, arg1) {
    const ret = getObject(arg1).href;
    const ptr0 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len0 = WASM_VECTOR_LEN;
    getInt32Memory0()[arg0 / 4 + 1] = len0;
    getInt32Memory0()[arg0 / 4 + 0] = ptr0;
}, arguments) };
imports.wbg.__wbg_sethref_8ffe6d459d7fea43 = function() { return handleError(function (arg0, arg1, arg2) {
    var v0 = getCachedStringFromWasm0(arg1, arg2);
    getObject(arg0).href = v0;
}, arguments) };
imports.wbg.__wbg_length_2c074182e565b967 = function() { return logError(function (arg0) {
    const ret = getObject(arg0).length;
    _assertNum(ret);
    return ret;
}, arguments) };
imports.wbg.__wbg_item_e9de93d9a7489e03 = function() { return logError(function (arg0, arg1) {
    const ret = getObject(arg0).item(arg1 >>> 0);
    return isLikeNone(ret) ? 0 : addHeapObject(ret);
}, arguments) };
imports.wbg.__wbg_screenX_4a1574740bcab7d8 = function() { return logError(function (arg0) {
    const ret = getObject(arg0).screenX;
    _assertNum(ret);
    return ret;
}, arguments) };
imports.wbg.__wbg_screenY_dbf55ea4ae0b792e = function() { return logError(function (arg0) {
    const ret = getObject(arg0).screenY;
    _assertNum(ret);
    return ret;
}, arguments) };
imports.wbg.__wbg_clientX_6b0b436b9d080ac5 = function() { return logError(function (arg0) {
    const ret = getObject(arg0).clientX;
    _assertNum(ret);
    return ret;
}, arguments) };
imports.wbg.__wbg_clientY_ad822da59bec5850 = function() { return logError(function (arg0) {
    const ret = getObject(arg0).clientY;
    _assertNum(ret);
    return ret;
}, arguments) };
imports.wbg.__wbg_ctrlKey_dcad027c59a161a1 = function() { return logError(function (arg0) {
    const ret = getObject(arg0).ctrlKey;
    _assertBoolean(ret);
    return ret;
}, arguments) };
imports.wbg.__wbg_shiftKey_caae09b9476bd4cb = function() { return logError(function (arg0) {
    const ret = getObject(arg0).shiftKey;
    _assertBoolean(ret);
    return ret;
}, arguments) };
imports.wbg.__wbg_altKey_88cb2a3632dc0fb8 = function() { return logError(function (arg0) {
    const ret = getObject(arg0).altKey;
    _assertBoolean(ret);
    return ret;
}, arguments) };
imports.wbg.__wbg_metaKey_a5ee48992f390e88 = function() { return logError(function (arg0) {
    const ret = getObject(arg0).metaKey;
    _assertBoolean(ret);
    return ret;
}, arguments) };
imports.wbg.__wbg_button_943ba4d0c28109da = function() { return logError(function (arg0) {
    const ret = getObject(arg0).button;
    _assertNum(ret);
    return ret;
}, arguments) };
imports.wbg.__wbg_buttons_e5501e149392c421 = function() { return logError(function (arg0) {
    const ret = getObject(arg0).buttons;
    _assertNum(ret);
    return ret;
}, arguments) };
imports.wbg.__wbg_instanceof_HtmlFormElement_7e3c5f7169b9ec9c = function() { return logError(function (arg0) {
    const ret = getObject(arg0) instanceof HTMLFormElement;
    _assertBoolean(ret);
    return ret;
}, arguments) };
imports.wbg.__wbg_elements_dbe177bf183a325f = function() { return logError(function (arg0) {
    const ret = getObject(arg0).elements;
    return addHeapObject(ret);
}, arguments) };
imports.wbg.__wbg_instanceof_HtmlTextAreaElement_95d12aa332e44db2 = function() { return logError(function (arg0) {
    const ret = getObject(arg0) instanceof HTMLTextAreaElement;
    _assertBoolean(ret);
    return ret;
}, arguments) };
imports.wbg.__wbg_value_92e4233a8e4ce8c1 = function() { return logError(function (arg0, arg1) {
    const ret = getObject(arg1).value;
    const ptr0 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len0 = WASM_VECTOR_LEN;
    getInt32Memory0()[arg0 / 4 + 1] = len0;
    getInt32Memory0()[arg0 / 4 + 0] = ptr0;
}, arguments) };
imports.wbg.__wbg_pointerId_3517dc72b60101cb = function() { return logError(function (arg0) {
    const ret = getObject(arg0).pointerId;
    _assertNum(ret);
    return ret;
}, arguments) };
imports.wbg.__wbg_width_fbf556a6a1149874 = function() { return logError(function (arg0) {
    const ret = getObject(arg0).width;
    _assertNum(ret);
    return ret;
}, arguments) };
imports.wbg.__wbg_height_8361214642013e9e = function() { return logError(function (arg0) {
    const ret = getObject(arg0).height;
    _assertNum(ret);
    return ret;
}, arguments) };
imports.wbg.__wbg_pressure_65646fd2bff0fa8c = function() { return logError(function (arg0) {
    const ret = getObject(arg0).pressure;
    return ret;
}, arguments) };
imports.wbg.__wbg_tangentialPressure_dd3356ff4c02ca07 = function() { return logError(function (arg0) {
    const ret = getObject(arg0).tangentialPressure;
    return ret;
}, arguments) };
imports.wbg.__wbg_tiltX_5d1a1257cef44a50 = function() { return logError(function (arg0) {
    const ret = getObject(arg0).tiltX;
    _assertNum(ret);
    return ret;
}, arguments) };
imports.wbg.__wbg_tiltY_97509356ddf2d64e = function() { return logError(function (arg0) {
    const ret = getObject(arg0).tiltY;
    _assertNum(ret);
    return ret;
}, arguments) };
imports.wbg.__wbg_twist_7b49bd6ccc02f127 = function() { return logError(function (arg0) {
    const ret = getObject(arg0).twist;
    _assertNum(ret);
    return ret;
}, arguments) };
imports.wbg.__wbg_pointerType_8c83e3cc21cb28a6 = function() { return logError(function (arg0, arg1) {
    const ret = getObject(arg1).pointerType;
    const ptr0 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len0 = WASM_VECTOR_LEN;
    getInt32Memory0()[arg0 / 4 + 1] = len0;
    getInt32Memory0()[arg0 / 4 + 0] = ptr0;
}, arguments) };
imports.wbg.__wbg_isPrimary_e5a6fe11bd646034 = function() { return logError(function (arg0) {
    const ret = getObject(arg0).isPrimary;
    _assertBoolean(ret);
    return ret;
}, arguments) };
imports.wbg.__wbg_deltaX_b65a808a0ee2ad41 = function() { return logError(function (arg0) {
    const ret = getObject(arg0).deltaX;
    return ret;
}, arguments) };
imports.wbg.__wbg_deltaY_e3158374108000c8 = function() { return logError(function (arg0) {
    const ret = getObject(arg0).deltaY;
    return ret;
}, arguments) };
imports.wbg.__wbg_deltaZ_997781897cf27fc4 = function() { return logError(function (arg0) {
    const ret = getObject(arg0).deltaZ;
    return ret;
}, arguments) };
imports.wbg.__wbg_deltaMode_78fa2eac67504e1e = function() { return logError(function (arg0) {
    const ret = getObject(arg0).deltaMode;
    _assertNum(ret);
    return ret;
}, arguments) };
imports.wbg.__wbg_instanceof_Element_9a257409019cee1b = function() { return logError(function (arg0) {
    const ret = getObject(arg0) instanceof Element;
    _assertBoolean(ret);
    return ret;
}, arguments) };
imports.wbg.__wbg_getAttribute_7dbc1890fa53e0ee = function() { return logError(function (arg0, arg1, arg2, arg3) {
    var v0 = getCachedStringFromWasm0(arg2, arg3);
    const ret = getObject(arg1).getAttribute(v0);
    var ptr1 = isLikeNone(ret) ? 0 : passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len1 = WASM_VECTOR_LEN;
    getInt32Memory0()[arg0 / 4 + 1] = len1;
    getInt32Memory0()[arg0 / 4 + 0] = ptr1;
}, arguments) };
imports.wbg.__wbg_setAttribute_6091f6f3602fc299 = function() { return handleError(function (arg0, arg1, arg2, arg3, arg4) {
    var v0 = getCachedStringFromWasm0(arg1, arg2);
    var v1 = getCachedStringFromWasm0(arg3, arg4);
    getObject(arg0).setAttribute(v0, v1);
}, arguments) };
imports.wbg.__wbg_debug_8445d9e6649f346e = function() { return logError(function (arg0, arg1, arg2, arg3) {
    console.debug(getObject(arg0), getObject(arg1), getObject(arg2), getObject(arg3));
}, arguments) };
imports.wbg.__wbg_error_e2677af4c7f31a14 = function() { return logError(function (arg0) {
    console.error(getObject(arg0));
}, arguments) };
imports.wbg.__wbg_error_c67ca41b33779f06 = function() { return logError(function (arg0, arg1, arg2, arg3) {
    console.error(getObject(arg0), getObject(arg1), getObject(arg2), getObject(arg3));
}, arguments) };
imports.wbg.__wbg_info_89e9ec243332464d = function() { return logError(function (arg0, arg1, arg2, arg3) {
    console.info(getObject(arg0), getObject(arg1), getObject(arg2), getObject(arg3));
}, arguments) };
imports.wbg.__wbg_log_4a85132d4d89d41e = function() { return logError(function (arg0, arg1, arg2, arg3) {
    console.log(getObject(arg0), getObject(arg1), getObject(arg2), getObject(arg3));
}, arguments) };
imports.wbg.__wbg_warn_022e4f61a9c7964f = function() { return logError(function (arg0, arg1, arg2, arg3) {
    console.warn(getObject(arg0), getObject(arg1), getObject(arg2), getObject(arg3));
}, arguments) };
imports.wbg.__wbg_instanceof_HtmlElement_d2b7afdac18ee070 = function() { return logError(function (arg0) {
    const ret = getObject(arg0) instanceof HTMLElement;
    _assertBoolean(ret);
    return ret;
}, arguments) };
imports.wbg.__wbg_animationName_30531eac55bf62c6 = function() { return logError(function (arg0, arg1) {
    const ret = getObject(arg1).animationName;
    const ptr0 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len0 = WASM_VECTOR_LEN;
    getInt32Memory0()[arg0 / 4 + 1] = len0;
    getInt32Memory0()[arg0 / 4 + 0] = ptr0;
}, arguments) };
imports.wbg.__wbg_elapsedTime_c0bef50de21fad45 = function() { return logError(function (arg0) {
    const ret = getObject(arg0).elapsedTime;
    return ret;
}, arguments) };
imports.wbg.__wbg_pseudoElement_fea1f52b9dd01909 = function() { return logError(function (arg0, arg1) {
    const ret = getObject(arg1).pseudoElement;
    const ptr0 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len0 = WASM_VECTOR_LEN;
    getInt32Memory0()[arg0 / 4 + 1] = len0;
    getInt32Memory0()[arg0 / 4 + 0] = ptr0;
}, arguments) };
imports.wbg.__wbg_instanceof_HtmlInputElement_756d5883770e3491 = function() { return logError(function (arg0) {
    const ret = getObject(arg0) instanceof HTMLInputElement;
    _assertBoolean(ret);
    return ret;
}, arguments) };
imports.wbg.__wbg_checked_8951de981e9823d3 = function() { return logError(function (arg0) {
    const ret = getObject(arg0).checked;
    _assertBoolean(ret);
    return ret;
}, arguments) };
imports.wbg.__wbg_type_5e2d20a52a10a818 = function() { return logError(function (arg0, arg1) {
    const ret = getObject(arg1).type;
    const ptr0 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len0 = WASM_VECTOR_LEN;
    getInt32Memory0()[arg0 / 4 + 1] = len0;
    getInt32Memory0()[arg0 / 4 + 0] = ptr0;
}, arguments) };
imports.wbg.__wbg_value_5573c798506a4119 = function() { return logError(function (arg0, arg1) {
    const ret = getObject(arg1).value;
    const ptr0 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len0 = WASM_VECTOR_LEN;
    getInt32Memory0()[arg0 / 4 + 1] = len0;
    getInt32Memory0()[arg0 / 4 + 0] = ptr0;
}, arguments) };
imports.wbg.__wbg_altKey_7002b6d87793b4d3 = function() { return logError(function (arg0) {
    const ret = getObject(arg0).altKey;
    _assertBoolean(ret);
    return ret;
}, arguments) };
imports.wbg.__wbg_metaKey_ba20084aa6da7583 = function() { return logError(function (arg0) {
    const ret = getObject(arg0).metaKey;
    _assertBoolean(ret);
    return ret;
}, arguments) };
imports.wbg.__wbg_ctrlKey_6c4bea842807e3b5 = function() { return logError(function (arg0) {
    const ret = getObject(arg0).ctrlKey;
    _assertBoolean(ret);
    return ret;
}, arguments) };
imports.wbg.__wbg_shiftKey_5d09787dbd35a1c2 = function() { return logError(function (arg0) {
    const ret = getObject(arg0).shiftKey;
    _assertBoolean(ret);
    return ret;
}, arguments) };
imports.wbg.__wbg_propertyName_e695181d5cd7305f = function() { return logError(function (arg0, arg1) {
    const ret = getObject(arg1).propertyName;
    const ptr0 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len0 = WASM_VECTOR_LEN;
    getInt32Memory0()[arg0 / 4 + 1] = len0;
    getInt32Memory0()[arg0 / 4 + 0] = ptr0;
}, arguments) };
imports.wbg.__wbg_elapsedTime_f5ac64dabbb68dd2 = function() { return logError(function (arg0) {
    const ret = getObject(arg0).elapsedTime;
    return ret;
}, arguments) };
imports.wbg.__wbg_pseudoElement_f0bc655eaa458330 = function() { return logError(function (arg0, arg1) {
    const ret = getObject(arg1).pseudoElement;
    const ptr0 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len0 = WASM_VECTOR_LEN;
    getInt32Memory0()[arg0 / 4 + 1] = len0;
    getInt32Memory0()[arg0 / 4 + 0] = ptr0;
}, arguments) };
imports.wbg.__wbg_type_7299ad20ed8bf820 = function() { return logError(function (arg0, arg1) {
    const ret = getObject(arg1).type;
    const ptr0 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len0 = WASM_VECTOR_LEN;
    getInt32Memory0()[arg0 / 4 + 1] = len0;
    getInt32Memory0()[arg0 / 4 + 0] = ptr0;
}, arguments) };
imports.wbg.__wbg_target_98e6e332956ee051 = function() { return logError(function (arg0) {
    const ret = getObject(arg0).target;
    return isLikeNone(ret) ? 0 : addHeapObject(ret);
}, arguments) };
imports.wbg.__wbg_preventDefault_2e92eb64f38efc0d = function() { return logError(function (arg0) {
    getObject(arg0).preventDefault();
}, arguments) };
imports.wbg.__wbg_instanceof_HtmlSelectElement_836066b5c2058eac = function() { return logError(function (arg0) {
    const ret = getObject(arg0) instanceof HTMLSelectElement;
    _assertBoolean(ret);
    return ret;
}, arguments) };
imports.wbg.__wbg_value_409c5636766aca2f = function() { return logError(function (arg0, arg1) {
    const ret = getObject(arg1).value;
    const ptr0 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len0 = WASM_VECTOR_LEN;
    getInt32Memory0()[arg0 / 4 + 1] = len0;
    getInt32Memory0()[arg0 / 4 + 0] = ptr0;
}, arguments) };
imports.wbg.__wbg_get_035100e6af06db92 = function() { return logError(function (arg0, arg1) {
    const ret = getObject(arg0)[arg1 >>> 0];
    return isLikeNone(ret) ? 0 : addHeapObject(ret);
}, arguments) };
imports.wbg.__wbg_storageArea_9de34ee4f8d70d5c = function() { return logError(function (arg0) {
    const ret = getObject(arg0).storageArea;
    return isLikeNone(ret) ? 0 : addHeapObject(ret);
}, arguments) };
imports.wbg.__wbg_addEventListener_a77a92f38176616e = function() { return handleError(function (arg0, arg1, arg2, arg3, arg4) {
    var v0 = getCachedStringFromWasm0(arg1, arg2);
    getObject(arg0).addEventListener(v0, getObject(arg3), getObject(arg4));
}, arguments) };
imports.wbg.__wbg_removeEventListener_2882dfde82b5b4d9 = function() { return handleError(function (arg0, arg1, arg2, arg3, arg4) {
    var v0 = getCachedStringFromWasm0(arg1, arg2);
    getObject(arg0).removeEventListener(v0, getObject(arg3), arg4 !== 0);
}, arguments) };
imports.wbg.__wbg_charCode_8fd2c8ec9f05685b = function() { return logError(function (arg0) {
    const ret = getObject(arg0).charCode;
    _assertNum(ret);
    return ret;
}, arguments) };
imports.wbg.__wbg_keyCode_581f5bd073094e86 = function() { return logError(function (arg0) {
    const ret = getObject(arg0).keyCode;
    _assertNum(ret);
    return ret;
}, arguments) };
imports.wbg.__wbg_altKey_bca103a22083fb54 = function() { return logError(function (arg0) {
    const ret = getObject(arg0).altKey;
    _assertBoolean(ret);
    return ret;
}, arguments) };
imports.wbg.__wbg_ctrlKey_20cdd37998ea7a96 = function() { return logError(function (arg0) {
    const ret = getObject(arg0).ctrlKey;
    _assertBoolean(ret);
    return ret;
}, arguments) };
imports.wbg.__wbg_shiftKey_a4b7a145ce342240 = function() { return logError(function (arg0) {
    const ret = getObject(arg0).shiftKey;
    _assertBoolean(ret);
    return ret;
}, arguments) };
imports.wbg.__wbg_metaKey_44b29aac55225588 = function() { return logError(function (arg0) {
    const ret = getObject(arg0).metaKey;
    _assertBoolean(ret);
    return ret;
}, arguments) };
imports.wbg.__wbg_location_829b9f90da4c3b29 = function() { return logError(function (arg0) {
    const ret = getObject(arg0).location;
    _assertNum(ret);
    return ret;
}, arguments) };
imports.wbg.__wbg_repeat_52138b06714d5d73 = function() { return logError(function (arg0) {
    const ret = getObject(arg0).repeat;
    _assertBoolean(ret);
    return ret;
}, arguments) };
imports.wbg.__wbg_key_6e807abe0dbacdb8 = function() { return logError(function (arg0, arg1) {
    const ret = getObject(arg1).key;
    const ptr0 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len0 = WASM_VECTOR_LEN;
    getInt32Memory0()[arg0 / 4 + 1] = len0;
    getInt32Memory0()[arg0 / 4 + 0] = ptr0;
}, arguments) };
imports.wbg.__wbg_pageX_db57b427d47ef152 = function() { return logError(function (arg0) {
    const ret = getObject(arg0).pageX;
    _assertNum(ret);
    return ret;
}, arguments) };
imports.wbg.__wbg_pageY_872422be9743831e = function() { return logError(function (arg0) {
    const ret = getObject(arg0).pageY;
    _assertNum(ret);
    return ret;
}, arguments) };
imports.wbg.__wbg_which_ad26f34af0ec3ce8 = function() { return logError(function (arg0) {
    const ret = getObject(arg0).which;
    _assertNum(ret);
    return ret;
}, arguments) };
imports.wbg.__wbg_newnoargs_fc5356289219b93b = function() { return logError(function (arg0, arg1) {
    var v0 = getCachedStringFromWasm0(arg0, arg1);
    const ret = new Function(v0);
    return addHeapObject(ret);
}, arguments) };
imports.wbg.__wbg_call_4573f605ca4b5f10 = function() { return handleError(function (arg0, arg1) {
    const ret = getObject(arg0).call(getObject(arg1));
    return addHeapObject(ret);
}, arguments) };
imports.wbg.__wbg_new_306ce8d57919e6ae = function() { return logError(function () {
    const ret = new Object();
    return addHeapObject(ret);
}, arguments) };
imports.wbg.__wbg_self_ba1ddafe9ea7a3a2 = function() { return handleError(function () {
    const ret = self.self;
    return addHeapObject(ret);
}, arguments) };
imports.wbg.__wbg_window_be3cc430364fd32c = function() { return handleError(function () {
    const ret = window.window;
    return addHeapObject(ret);
}, arguments) };
imports.wbg.__wbg_globalThis_56d9c9f814daeeee = function() { return handleError(function () {
    const ret = globalThis.globalThis;
    return addHeapObject(ret);
}, arguments) };
imports.wbg.__wbg_global_8c35aeee4ac77f2b = function() { return handleError(function () {
    const ret = global.global;
    return addHeapObject(ret);
}, arguments) };
imports.wbg.__wbg_eval_5def934d54879ff9 = function() { return handleError(function (arg0, arg1) {
    var v0 = getCachedStringFromWasm0(arg0, arg1);
    const ret = eval(v0);
    return addHeapObject(ret);
}, arguments) };
imports.wbg.__wbg_getTime_7c8d3b79f51e2b87 = function() { return logError(function (arg0) {
    const ret = getObject(arg0).getTime();
    return ret;
}, arguments) };
imports.wbg.__wbg_getTimezoneOffset_d7a89256f8181a06 = function() { return logError(function (arg0) {
    const ret = getObject(arg0).getTimezoneOffset();
    return ret;
}, arguments) };
imports.wbg.__wbg_new0_6b49a1fca8534d39 = function() { return logError(function () {
    const ret = new Date();
    return addHeapObject(ret);
}, arguments) };
imports.wbg.__wbg_instanceof_Object_0c703ab7113e61ec = function() { return logError(function (arg0) {
    const ret = getObject(arg0) instanceof Object;
    _assertBoolean(ret);
    return ret;
}, arguments) };
imports.wbg.__wbg_hasOwnProperty_c165c08cafad3fa7 = function() { return logError(function (arg0, arg1) {
    const ret = getObject(arg0).hasOwnProperty(getObject(arg1));
    _assertBoolean(ret);
    return ret;
}, arguments) };
imports.wbg.__wbg_is_aafa609b540ad47f = function() { return logError(function (arg0, arg1) {
    const ret = Object.is(getObject(arg0), getObject(arg1));
    _assertBoolean(ret);
    return ret;
}, arguments) };
imports.wbg.__wbg_resolve_f269ce174f88b294 = function() { return logError(function (arg0) {
    const ret = Promise.resolve(getObject(arg0));
    return addHeapObject(ret);
}, arguments) };
imports.wbg.__wbg_then_1c698eedca15eed6 = function() { return logError(function (arg0, arg1) {
    const ret = getObject(arg0).then(getObject(arg1));
    return addHeapObject(ret);
}, arguments) };
imports.wbg.__wbg_set_b12cd0ab82903c2f = function() { return handleError(function (arg0, arg1, arg2) {
    const ret = Reflect.set(getObject(arg0), getObject(arg1), getObject(arg2));
    _assertBoolean(ret);
    return ret;
}, arguments) };
imports.wbg.__wbindgen_debug_string = function(arg0, arg1) {
    const ret = debugString(getObject(arg1));
    const ptr0 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len0 = WASM_VECTOR_LEN;
    getInt32Memory0()[arg0 / 4 + 1] = len0;
    getInt32Memory0()[arg0 / 4 + 0] = ptr0;
};
imports.wbg.__wbindgen_throw = function(arg0, arg1) {
    throw new Error(getStringFromWasm0(arg0, arg1));
};
imports.wbg.__wbindgen_closure_wrapper333 = function() { return logError(function (arg0, arg1, arg2) {
    const ret = makeMutClosure(arg0, arg1, 127, __wbg_adapter_18);
    return addHeapObject(ret);
}, arguments) };
imports.wbg.__wbindgen_closure_wrapper589 = function() { return logError(function (arg0, arg1, arg2) {
    const ret = makeMutClosure(arg0, arg1, 236, __wbg_adapter_21);
    return addHeapObject(ret);
}, arguments) };
imports.wbg.__wbindgen_closure_wrapper905 = function() { return logError(function (arg0, arg1, arg2) {
    const ret = makeClosure(arg0, arg1, 353, __wbg_adapter_24);
    return addHeapObject(ret);
}, arguments) };
imports.wbg.__wbindgen_closure_wrapper907 = function() { return logError(function (arg0, arg1, arg2) {
    const ret = makeMutClosure(arg0, arg1, 353, __wbg_adapter_27);
    return addHeapObject(ret);
}, arguments) };
imports.wbg.__wbindgen_closure_wrapper932 = function() { return logError(function (arg0, arg1, arg2) {
    const ret = makeMutClosure(arg0, arg1, 365, __wbg_adapter_30);
    return addHeapObject(ret);
}, arguments) };
imports.wbg.__wbindgen_closure_wrapper979 = function() { return logError(function (arg0, arg1, arg2) {
    const ret = makeMutClosure(arg0, arg1, 389, __wbg_adapter_33);
    return addHeapObject(ret);
}, arguments) };

return imports;
}

function initMemory(imports, maybe_memory) {

}

function finalizeInit(instance, module) {
    wasm = instance.exports;
    init.__wbindgen_wasm_module = module;
    cachedInt32Memory0 = new Int32Array(wasm.memory.buffer);
    cachedUint8Memory0 = new Uint8Array(wasm.memory.buffer);

    wasm.__wbindgen_start();
    return wasm;
}

function initSync(bytes) {
    const imports = getImports();

    initMemory(imports);

    const module = new WebAssembly.Module(bytes);
    const instance = new WebAssembly.Instance(module, imports);

    return finalizeInit(instance, module);
}

async function init(input) {

    const imports = getImports();

    if (typeof input === 'string' || (typeof Request === 'function' && input instanceof Request) || (typeof URL === 'function' && input instanceof URL)) {
        input = fetch(input);
    }

    initMemory(imports);

    const { instance, module } = await load(await input, imports);

    return finalizeInit(instance, module);
}

export { initSync }
export default init;
