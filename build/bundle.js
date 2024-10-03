
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop() { }
    function assign(tar, src) {
        // @ts-ignore
        for (const k in src)
            tar[k] = src[k];
        return tar;
    }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    let src_url_equal_anchor;
    function src_url_equal(element_src, url) {
        if (!src_url_equal_anchor) {
            src_url_equal_anchor = document.createElement('a');
        }
        src_url_equal_anchor.href = url;
        return element_src === src_url_equal_anchor.href;
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function validate_store(store, name) {
        if (store != null && typeof store.subscribe !== 'function') {
            throw new Error(`'${name}' is not a store with a 'subscribe' method`);
        }
    }
    function subscribe(store, ...callbacks) {
        if (store == null) {
            return noop;
        }
        const unsub = store.subscribe(...callbacks);
        return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
    }
    function get_store_value(store) {
        let value;
        subscribe(store, _ => value = _)();
        return value;
    }
    function component_subscribe(component, store, callback) {
        component.$$.on_destroy.push(subscribe(store, callback));
    }
    function create_slot(definition, ctx, $$scope, fn) {
        if (definition) {
            const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
            return definition[0](slot_ctx);
        }
    }
    function get_slot_context(definition, ctx, $$scope, fn) {
        return definition[1] && fn
            ? assign($$scope.ctx.slice(), definition[1](fn(ctx)))
            : $$scope.ctx;
    }
    function get_slot_changes(definition, $$scope, dirty, fn) {
        if (definition[2] && fn) {
            const lets = definition[2](fn(dirty));
            if ($$scope.dirty === undefined) {
                return lets;
            }
            if (typeof lets === 'object') {
                const merged = [];
                const len = Math.max($$scope.dirty.length, lets.length);
                for (let i = 0; i < len; i += 1) {
                    merged[i] = $$scope.dirty[i] | lets[i];
                }
                return merged;
            }
            return $$scope.dirty | lets;
        }
        return $$scope.dirty;
    }
    function update_slot_base(slot, slot_definition, ctx, $$scope, slot_changes, get_slot_context_fn) {
        if (slot_changes) {
            const slot_context = get_slot_context(slot_definition, ctx, $$scope, get_slot_context_fn);
            slot.p(slot_context, slot_changes);
        }
    }
    function get_all_dirty_from_scope($$scope) {
        if ($$scope.ctx.length > 32) {
            const dirty = [];
            const length = $$scope.ctx.length / 32;
            for (let i = 0; i < length; i++) {
                dirty[i] = -1;
            }
            return dirty;
        }
        return -1;
    }
    function set_store_value(store, ret, value) {
        store.set(value);
        return ret;
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);
    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        if (node.parentNode) {
            node.parentNode.removeChild(node);
        }
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function prevent_default(fn) {
        return function (event) {
            event.preventDefault();
            // @ts-ignore
            return fn.call(this, event);
        };
    }
    function self(fn) {
        return function (event) {
            // @ts-ignore
            if (event.target === this)
                fn.call(this, event);
        };
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function to_number(value) {
        return value === '' ? null : +value;
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_input_value(input, value) {
        input.value = value == null ? '' : value;
    }
    function select_option(select, value, mounting) {
        for (let i = 0; i < select.options.length; i += 1) {
            const option = select.options[i];
            if (option.__value === value) {
                option.selected = true;
                return;
            }
        }
        if (!mounting || value !== undefined) {
            select.selectedIndex = -1; // no option should be selected
        }
    }
    function select_value(select) {
        const selected_option = select.querySelector(':checked');
        return selected_option && selected_option.__value;
    }
    function toggle_class(element, name, toggle) {
        element.classList[toggle ? 'add' : 'remove'](name);
    }
    function custom_event(type, detail, { bubbles = false, cancelable = false } = {}) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, cancelable, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error('Function called outside component initialization');
        return current_component;
    }
    /**
     * The `onMount` function schedules a callback to run as soon as the component has been mounted to the DOM.
     * It must be called during the component's initialisation (but doesn't need to live *inside* the component;
     * it can be called from an external module).
     *
     * `onMount` does not run inside a [server-side component](/docs#run-time-server-side-component-api).
     *
     * https://svelte.dev/docs#run-time-svelte-onmount
     */
    function onMount(fn) {
        get_current_component().$$.on_mount.push(fn);
    }
    /**
     * Schedules a callback to run immediately after the component has been updated.
     *
     * The first time the callback runs will be after the initial `onMount`
     */
    function afterUpdate(fn) {
        get_current_component().$$.after_update.push(fn);
    }
    /**
     * Schedules a callback to run immediately before the component is unmounted.
     *
     * Out of `onMount`, `beforeUpdate`, `afterUpdate` and `onDestroy`, this is the
     * only one that runs inside a server-side component.
     *
     * https://svelte.dev/docs#run-time-svelte-ondestroy
     */
    function onDestroy(fn) {
        get_current_component().$$.on_destroy.push(fn);
    }
    /**
     * Creates an event dispatcher that can be used to dispatch [component events](/docs#template-syntax-component-directives-on-eventname).
     * Event dispatchers are functions that can take two arguments: `name` and `detail`.
     *
     * Component events created with `createEventDispatcher` create a
     * [CustomEvent](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent).
     * These events do not [bubble](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Building_blocks/Events#Event_bubbling_and_capture).
     * The `detail` argument corresponds to the [CustomEvent.detail](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/detail)
     * property and can contain any type of data.
     *
     * https://svelte.dev/docs#run-time-svelte-createeventdispatcher
     */
    function createEventDispatcher() {
        const component = get_current_component();
        return (type, detail, { cancelable = false } = {}) => {
            const callbacks = component.$$.callbacks[type];
            if (callbacks) {
                // TODO are there situations where events could be dispatched
                // in a server (non-DOM) environment?
                const event = custom_event(type, detail, { cancelable });
                callbacks.slice().forEach(fn => {
                    fn.call(component, event);
                });
                return !event.defaultPrevented;
            }
            return true;
        };
    }
    // TODO figure out if we still want to support
    // shorthand events, or if we want to implement
    // a real bubbling mechanism
    function bubble(component, event) {
        const callbacks = component.$$.callbacks[event.type];
        if (callbacks) {
            // @ts-ignore
            callbacks.slice().forEach(fn => fn.call(this, event));
        }
    }

    const dirty_components = [];
    const binding_callbacks = [];
    let render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = /* @__PURE__ */ Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function tick() {
        schedule_update();
        return resolved_promise;
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    // flush() calls callbacks in this order:
    // 1. All beforeUpdate callbacks, in order: parents before children
    // 2. All bind:this callbacks, in reverse order: children before parents.
    // 3. All afterUpdate callbacks, in order: parents before children. EXCEPT
    //    for afterUpdates called during the initial onMount, which are called in
    //    reverse order: children before parents.
    // Since callbacks might update component values, which could trigger another
    // call to flush(), the following steps guard against this:
    // 1. During beforeUpdate, any updated components will be added to the
    //    dirty_components array and will cause a reentrant call to flush(). Because
    //    the flush index is kept outside the function, the reentrant call will pick
    //    up where the earlier call left off and go through all dirty components. The
    //    current_component value is saved and restored so that the reentrant call will
    //    not interfere with the "parent" flush() call.
    // 2. bind:this callbacks cannot trigger new flush() calls.
    // 3. During afterUpdate, any updated components will NOT have their afterUpdate
    //    callback called a second time; the seen_callbacks set, outside the flush()
    //    function, guarantees this behavior.
    const seen_callbacks = new Set();
    let flushidx = 0; // Do *not* move this inside the flush() function
    function flush() {
        // Do not reenter flush while dirty components are updated, as this can
        // result in an infinite loop. Instead, let the inner flush handle it.
        // Reentrancy is ok afterwards for bindings etc.
        if (flushidx !== 0) {
            return;
        }
        const saved_component = current_component;
        do {
            // first, call beforeUpdate functions
            // and update components
            try {
                while (flushidx < dirty_components.length) {
                    const component = dirty_components[flushidx];
                    flushidx++;
                    set_current_component(component);
                    update(component.$$);
                }
            }
            catch (e) {
                // reset dirty state to not end up in a deadlocked state and then rethrow
                dirty_components.length = 0;
                flushidx = 0;
                throw e;
            }
            set_current_component(null);
            dirty_components.length = 0;
            flushidx = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        seen_callbacks.clear();
        set_current_component(saved_component);
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    /**
     * Useful for example to execute remaining `afterUpdate` callbacks before executing `destroy`.
     */
    function flush_render_callbacks(fns) {
        const filtered = [];
        const targets = [];
        render_callbacks.forEach((c) => fns.indexOf(c) === -1 ? filtered.push(c) : targets.push(c));
        targets.forEach((c) => c());
        render_callbacks = filtered;
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
        else if (callback) {
            callback();
        }
    }

    function destroy_block(block, lookup) {
        block.d(1);
        lookup.delete(block.key);
    }
    function update_keyed_each(old_blocks, dirty, get_key, dynamic, ctx, list, lookup, node, destroy, create_each_block, next, get_context) {
        let o = old_blocks.length;
        let n = list.length;
        let i = o;
        const old_indexes = {};
        while (i--)
            old_indexes[old_blocks[i].key] = i;
        const new_blocks = [];
        const new_lookup = new Map();
        const deltas = new Map();
        const updates = [];
        i = n;
        while (i--) {
            const child_ctx = get_context(ctx, list, i);
            const key = get_key(child_ctx);
            let block = lookup.get(key);
            if (!block) {
                block = create_each_block(key, child_ctx);
                block.c();
            }
            else if (dynamic) {
                // defer updates until all the DOM shuffling is done
                updates.push(() => block.p(child_ctx, dirty));
            }
            new_lookup.set(key, new_blocks[i] = block);
            if (key in old_indexes)
                deltas.set(key, Math.abs(i - old_indexes[key]));
        }
        const will_move = new Set();
        const did_move = new Set();
        function insert(block) {
            transition_in(block, 1);
            block.m(node, next);
            lookup.set(block.key, block);
            next = block.first;
            n--;
        }
        while (o && n) {
            const new_block = new_blocks[n - 1];
            const old_block = old_blocks[o - 1];
            const new_key = new_block.key;
            const old_key = old_block.key;
            if (new_block === old_block) {
                // do nothing
                next = new_block.first;
                o--;
                n--;
            }
            else if (!new_lookup.has(old_key)) {
                // remove old block
                destroy(old_block, lookup);
                o--;
            }
            else if (!lookup.has(new_key) || will_move.has(new_key)) {
                insert(new_block);
            }
            else if (did_move.has(old_key)) {
                o--;
            }
            else if (deltas.get(new_key) > deltas.get(old_key)) {
                did_move.add(new_key);
                insert(new_block);
            }
            else {
                will_move.add(old_key);
                o--;
            }
        }
        while (o--) {
            const old_block = old_blocks[o];
            if (!new_lookup.has(old_block.key))
                destroy(old_block, lookup);
        }
        while (n)
            insert(new_blocks[n - 1]);
        run_all(updates);
        return new_blocks;
    }
    function validate_each_keys(ctx, list, get_context, get_key) {
        const keys = new Set();
        for (let i = 0; i < list.length; i++) {
            const key = get_key(get_context(ctx, list, i));
            if (keys.has(key)) {
                throw new Error('Cannot have duplicate keys in a keyed each');
            }
            keys.add(key);
        }
    }

    function get_spread_update(levels, updates) {
        const update = {};
        const to_null_out = {};
        const accounted_for = { $$scope: 1 };
        let i = levels.length;
        while (i--) {
            const o = levels[i];
            const n = updates[i];
            if (n) {
                for (const key in o) {
                    if (!(key in n))
                        to_null_out[key] = 1;
                }
                for (const key in n) {
                    if (!accounted_for[key]) {
                        update[key] = n[key];
                        accounted_for[key] = 1;
                    }
                }
                levels[i] = n;
            }
            else {
                for (const key in o) {
                    accounted_for[key] = 1;
                }
            }
        }
        for (const key in to_null_out) {
            if (!(key in update))
                update[key] = undefined;
        }
        return update;
    }
    function get_spread_object(spread_props) {
        return typeof spread_props === 'object' && spread_props !== null ? spread_props : {};
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = component.$$.on_mount.map(run).filter(is_function);
                // if the component was destroyed immediately
                // it will update the `$$.on_destroy` reference to `null`.
                // the destructured on_destroy may still reference to the old array
                if (component.$$.on_destroy) {
                    component.$$.on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            flush_render_callbacks($$.after_update);
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: [],
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            if (!is_function(callback)) {
                return noop;
            }
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.59.2' }, detail), { bubbles: true }));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation, has_stop_immediate_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        if (has_stop_immediate_propagation)
            modifiers.push('stopImmediatePropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function prop_dev(node, property, value) {
        node[property] = value;
        dispatch_dev('SvelteDOMSetProperty', { node, property, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.data === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    function construct_svelte_component_dev(component, props) {
        const error_message = 'this={...} of <svelte:component> should specify a Svelte component.';
        try {
            const instance = new component(props);
            if (!instance.$$ || !instance.$set || !instance.$on || !instance.$destroy) {
                throw new Error(error_message);
            }
            return instance;
        }
        catch (err) {
            const { message } = err;
            if (typeof message === 'string' && message.indexOf('is not a constructor') !== -1) {
                throw new Error(error_message);
            }
            else {
                throw err;
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    const subscriber_queue = [];
    /**
     * Creates a `Readable` store that allows reading by subscription.
     * @param value initial value
     * @param {StartStopNotifier} [start]
     */
    function readable(value, start) {
        return {
            subscribe: writable(value, start).subscribe
        };
    }
    /**
     * Create a `Writable` store that allows both updating and reading by subscription.
     * @param {*=}value initial value
     * @param {StartStopNotifier=} start
     */
    function writable(value, start = noop) {
        let stop;
        const subscribers = new Set();
        function set(new_value) {
            if (safe_not_equal(value, new_value)) {
                value = new_value;
                if (stop) { // store is ready
                    const run_queue = !subscriber_queue.length;
                    for (const subscriber of subscribers) {
                        subscriber[1]();
                        subscriber_queue.push(subscriber, value);
                    }
                    if (run_queue) {
                        for (let i = 0; i < subscriber_queue.length; i += 2) {
                            subscriber_queue[i][0](subscriber_queue[i + 1]);
                        }
                        subscriber_queue.length = 0;
                    }
                }
            }
        }
        function update(fn) {
            set(fn(value));
        }
        function subscribe(run, invalidate = noop) {
            const subscriber = [run, invalidate];
            subscribers.add(subscriber);
            if (subscribers.size === 1) {
                stop = start(set) || noop;
            }
            run(value);
            return () => {
                subscribers.delete(subscriber);
                if (subscribers.size === 0 && stop) {
                    stop();
                    stop = null;
                }
            };
        }
        return { set, update, subscribe };
    }
    function derived(stores, fn, initial_value) {
        const single = !Array.isArray(stores);
        const stores_array = single
            ? [stores]
            : stores;
        const auto = fn.length < 2;
        return readable(initial_value, (set) => {
            let started = false;
            const values = [];
            let pending = 0;
            let cleanup = noop;
            const sync = () => {
                if (pending) {
                    return;
                }
                cleanup();
                const result = fn(single ? values[0] : values, set);
                if (auto) {
                    set(result);
                }
                else {
                    cleanup = is_function(result) ? result : noop;
                }
            };
            const unsubscribers = stores_array.map((store, i) => subscribe(store, (value) => {
                values[i] = value;
                pending &= ~(1 << i);
                if (started) {
                    sync();
                }
            }, () => {
                pending |= (1 << i);
            }));
            started = true;
            sync();
            return function stop() {
                run_all(unsubscribers);
                cleanup();
                // We need to set this to false because callbacks can still happen despite having unsubscribed:
                // Callbacks might already be placed in the queue which doesn't know it should no longer
                // invoke this derived store.
                started = false;
            };
        });
    }

    const messageOfTheDay = writable("This is the very long message of the day that will definitely wrap to the next line!");


    const viewerId = "1";
      
      // Dummy data for police roster
      const dummyPoliceRoster = [
        {
          id: "1",
          name: 'Officer John',
          status: 'On-duty',
          rank: "6",
          po: "555",
          disciplinaries: "Basic TrainingBasic TrainingBasic Training",
          achievements: "Basic TrainingBasic TrainingBasic TrainingBasic Training",
          notes: "Basic TrainingBasic TrainingBasic Training",
          discord : "JohnDoe#1234",
          region : "Sandy Shores",
          lastactive : "2023-10-05T10:00:00Z",
          timezone : "EST",
          totalReports : "5",
          training : "Basic Training",
          totalduty : "5",

        },
        {
          id: "2",
          name: 'Officer Jane',
          status: 'Off-duty',
          rank: "5",
          po: "777",
          disciplinaries: "",
          achievements: "",
          notes: "",
          discord : "JohnDoe#1234",
          region : "Sandy Shores",
          lastactive : "2023-10-05T10:00:00Z",
          timezone : "EST",
          totalReports : "5",
          training : "Basic Training",
          totalduty : "5",

        },

      ];
      
      
      // Dummy data for roles and permissions
      const dummyRoles = {
        '1': {
          canViewReports: true,
          canEditReports: false,
          canViewCaseFiles: false, // Cannot view case files
          canViewCalculator: true,
          canViewPoliceRoster: true,
          canEditPoliceRoster: true,
          canEditWantedList: false,
          canWriteMOD: false,
          disableAlert: true,
          makeAnnouncement: false,
          editLaws: false,
          canCreateTraining: false,
          canEditTraining: false,
        },
        '5': {
          canViewReports: true,
          canEditReports: false,
          canViewCaseFiles: true, 
          canViewCalculator: true,
          canViewPoliceRoster: true,
          canEditPoliceRoster: true,
          canEditWantedList: false,
          canWriteMOD: false,
          disableAlert: true,
          makeAnnouncement: true,
          editLaws: false,
          canCreateTraining: false,
          canEditTraining: false,
        },
        '6': {
          canViewReports: true,
          canEditReports: true,
          canViewCaseFiles: true,
          canViewCalculator: true, 
          canViewPoliceRoster: true,
          canEditPoliceRoster: true,
          canEditWantedList: true,
          canWriteMOD: true,
          disableAlert: true,
          makeAnnouncement: true,
          editLaws: true,
          canCreateTraining: true,
          canEditTraining: true,
        },
        // Add more roles as needed
      };

      const dummyAlerts = [
        {
          id: "1", // Unique identifier for each alert
          title: 'Bank Robbery',
          description: 'Armed robbery in progress at Central Bank.',
          date: new Date().toISOString(), // Use ISO8601 date format for easy parsing
          status: 'Active', // Can be 'Active' or 'Inactive'
          responders: [], // Array of officer IDs who are assigned to this alert
        },
        {
          id: "2", // Unique identifier for each alert
          title: 'Wagon',
          description: 'Armed robbery in progress at Central Bank.',
          date: new Date(Date.now() - 3600 * 1000).toISOString(), // Use ISO8601 date format for easy parsing
          status: 'Active', // Can be 'Active' or 'Inactive'
          responders: [], // Array of officer IDs who are assigned to this alert
        },
        {
          id: "3", // Unique identifier for each alert
          title: 'Store',
          description: 'Armed robbery in progress at Central Bank.',
          date: new Date(Date.now() - 5600 * 1000).toISOString(), // Use ISO8601 date format for easy parsing
          status: 'Active', // Can be 'Active' or 'Inactive'
          responders: [], // Array of officer IDs who are assigned to this alert
        },
        {
          id: "4", // Unique identifier for each alert
          title: 'Bank Robbery',
          description: 'Armed robbery in progress at Central Bank.',
          date: new Date().toISOString(), // Use ISO8601 date format for easy parsing
          status: 'Active', // Can be 'Active' or 'Inactive'
          responders: [], // Array of officer IDs who are assigned to this alert
        },
        {
          id: "5", // Unique identifier for each alert
          title: 'Wagon',
          description: 'Armed robbery in progress at Central Bank.',
          date: new Date(Date.now() - 3600 * 1000).toISOString(), // Use ISO8601 date format for easy parsing
          status: 'Active', // Can be 'Active' or 'Inactive'
          responders: [], // Array of officer IDs who are assigned to this alert
        },
        {
          id: "5", // Unique identifier for each alert
          title: 'Wagon',
          description: 'Armed robbery in progress at Central Bank.',
          date: new Date(Date.now() - 3600 * 1000).toISOString(), // Use ISO8601 date format for easy parsing
          status: 'Active', // Can be 'Active' or 'Inactive'
          responders: [], // Array of officer IDs who are assigned to this alert
        },
        {
          id: "6", // Unique identifier for each alert
          title: 'Wagon',
          description: 'Armed robbery in progress at Central Bank.',
          date: new Date(Date.now() - 3600 * 1000).toISOString(), // Use ISO8601 date format for easy parsing
          status: 'Active', // Can be 'Active' or 'Inactive'
          responders: [], // Array of officer IDs who are assigned to this alert
        },
        {
          id: "7", // Unique identifier for each alert
          title: 'Wagon',
          description: 'Armed robbery in progress at Central Bank.',
          date: new Date(Date.now() - 3600 * 1000).toISOString(), // Use ISO8601 date format for easy parsing
          status: 'Active', // Can be 'Active' or 'Inactive'
          responders: [], // Array of officer IDs who are assigned to this alert
        },
        {
          id: "8", // Unique identifier for each alert
          title: 'Wagon',
          description: 'Armed robbery in progress at Central Bank.',
          date: new Date(Date.now() - 3600 * 1000).toISOString(), // Use ISO8601 date format for easy parsing
          status: 'Active', // Can be 'Active' or 'Inactive'
          responders: [], // Array of officer IDs who are assigned to this alert
        },
        {
          id: "9", // Unique identifier for each alert
          title: 'Wagon',
          description: 'Armed robbery in progress at Central Bank.',
          date: new Date(Date.now() - 3600 * 1000).toISOString(), // Use ISO8601 date format for easy parsing
          status: 'Active', // Can be 'Active' or 'Inactive'
          responders: [], // Array of officer IDs who are assigned to this alert
        },
        {
          id: "10", // Unique identifier for each alert
          title: 'Wagon',
          description: 'Armed robbery in progress at Central Bank.',
          date: new Date(Date.now() - 3600 * 1000).toISOString(), // Use ISO8601 date format for easy parsing
          status: 'Active', // Can be 'Active' or 'Inactive'
          responders: [], // Array of officer IDs who are assigned to this alert
        },
        {
          id: "11", // Unique identifier for each alert
          title: 'Wagon',
          description: 'Armed robbery in progress at Central Bank.',
          date: new Date(Date.now() - 3600 * 1000).toISOString(), // Use ISO8601 date format for easy parsing
          status: 'Active', // Can be 'Active' or 'Inactive'
          responders: [], // Array of officer IDs who are assigned to this alert
        },
      ];

      let chargeList = writable([
        { charge: 'Speeding', fine: 150, jail: 5, note: false, stackable: false, stackJailCap: 5, stackFineCap: 150, confiscate: 0 },
        { charge: 'Loitering', fine: 250, jail: 10, note: false, stackable: false, stackJailCap: 10, stackFineCap: 250, confiscate: 0 },
        { charge: 'Animal Cruelty', fine: 200, jail: 5, note: false, stackable: false, stackJailCap: 5, stackFineCap: 200, confiscate: 0 },
        { charge: 'Trespassing', fine: 200, jail: 5, note: false, stackable: false, stackJailCap: 5, stackFineCap: 200, confiscate: 0 },
        { charge: 'Criminal Threats', fine: 250, jail: 10, note: false, stackable: false, stackJailCap: 10, stackFineCap: 250, confiscate: 0 }, 
        { charge: 'Disorderly Conduct', fine: 150, jail: 5, note: false, stackable: false, stackJailCap: 5, stackFineCap: 150, confiscate: 0 },
        { charge: 'Crimes against a Local', fine: 250, jail: 10, note: false, stackable: false, stackJailCap: 10, stackFineCap: 250, confiscate: 0 },

        { charge: 'Corruption Of A Court Officer', fine: 450, jail: 10, note: false, stackable: false, stackJailCap: 10, stackFineCap: 450, confiscate: 0 }, 
        { charge: 'Brandishing', fine: 300, jail: 10, note: false, stackable: false, stackJailCap: 10, stackFineCap: 300, confiscate: 0 },
        { charge: 'Unlawful Discharge of a Weapon', fine: 350, jail: 10, note: false, stackable: false, stackJailCap: 10, stackFineCap: 350, confiscate: 1 },
        { charge: 'Concealment of Identity', fine: 400, jail: 10, note: false, stackable: false, stackJailCap: 10, stackFineCap: 400, confiscate: 0 },
        { charge: 'Assault', fine: 400, jail: 10, note: false, stackable: false, stackJailCap: 10, stackFineCap: 400, confiscate: 0 }, 
        { charge: 'Obstruction Of A Court Officer', fine: 400, jail: 10, note: false, stackable: false, stackJailCap: 10, stackFineCap: 400, confiscate: 0 },
        { charge: 'Illegal Duelling', fine: 450, jail: 10, note: false, stackable: false, stackJailCap: 10, stackFineCap: 450, confiscate: 1 }, 
        { charge: 'Evading Justice', fine: 300, jail: 10, note: false, stackable: false, stackJailCap: 10, stackFineCap: 300, confiscate: 0 },
        { charge: 'Failure To Comply With A Lawful Order', fine: 350, jail: 10, note: false, stackable: false, stackJailCap: 10, stackFineCap: 350, confiscate: 0 }, 
        { charge: 'Assisting A Fugitive From Justice', fine: 450, jail: 10, note: false, stackable: false, stackJailCap: 10, stackFineCap: 450, confiscate: 0 },

        { charge: 'Kidnapping', fine: 500, jail: 20, note: false, stackable: false, stackJailCap: 20, stackFineCap: 500, confiscate: 0 },
        { charge: 'Impersonating a Court Officer', fine: 500, jail: 20, note: false, stackable: false, stackJailCap: 20, stackFineCap: 500, confiscate: 6 }, 
        { charge: 'Arson', fine: 600, jail: 20, note: false, stackable: false, stackJailCap: 20, stackFineCap: 600, confiscate: 2 },
        { charge: 'Attempted Robbery', fine: 800, jail: 20, note: false, stackable: false, stackJailCap: 20, stackFineCap: 800, confiscate: 8 }, 
        { charge: 'Theft', fine: 500, jail: 20, note: false, stackable: false, stackJailCap: 20, stackFineCap: 500, confiscate: 2 }, 
        { charge: 'Robbery of Stores, Wagons & Oilrig', fine: 850, jail: 20, note: false, stackable: false, stackJailCap: 20, stackFineCap: 850, confiscate: 5 },
        { charge: 'Robbery of Forts & Banks', fine: 1000, jail: 20, note: false, stackable: false, stackJailCap: 20, stackFineCap: 1000, confiscate: 5 },
        { charge: 'Attempted Murder', fine: 1000, jail: 15, note: false, stackable: false, stackJailCap: 15, stackFineCap: 1000, confiscate: 1 }, 
        { charge: 'Murder', fine: 1300, jail: 30, note: false, stackable: false, stackJailCap: 30, stackFineCap: 1300, confiscate: 1 },
        { charge: 'Possession of Dynamite', fine: 1500, jail: 30, note: false, stackable: true, stackJailCap: 30, stackFineCap: 1500, confiscate: 2 }, 
        { charge: 'Attempted Murder of a Lawman', fine: 1250, jail: 20, note: false, stackable: false, stackJailCap: 20, stackFineCap: 1250, confiscate: 1 }, 
        { charge: 'Murder of a Lawman', fine: 1500, jail: 30, note: false, stackable: false, stackJailCap: 30, stackFineCap: 1500, confiscate: 1 }, 
        { charge: 'Use of a Marksmen in Major Crimes', fine: 700, jail: 20, note: false, stackable: false, stackJailCap: 20, stackFineCap: 700, confiscate: 7 },

        { charge: 'Class A Contraband', fine: 1000, jail: 0, note: false, stackable: true, stackJailCap: 0, stackFineCap: 9999999, confiscate: 2 },
        { charge: 'Class B Contraband', fine: 150, jail: 0, note: false, stackable: true, stackJailCap: 0, stackFineCap: 9999999, confiscate: 2 }, 
        { charge: 'Class C Contraband', fine: 100, jail: 0, note: false, stackable: true, stackJailCap: 0, stackFineCap: 9999999, confiscate: 2 },
        { charge: 'Class D Contraband', fine: 50, jail: 0, note: false, stackable: true, stackJailCap: 0, stackFineCap: 9999999, confiscate: 2 }
      ]);

    function hasPermission(userRank, permission) {
      return dummyRoles[userRank] && dummyRoles[userRank][permission];
    }

    function getOfficerRankById(officerId) {
      const officer = dummyPoliceRoster.find(o => o.id === officerId);
      return officer ? officer.rank : null;
    }

    function formatToLocalDateTime$1(isoString) {
      const localDate = new Date(isoString);

      const pad = (num) => num < 10 ? '0' + num : num;
      return localDate.getFullYear() + '-' +
             pad(localDate.getMonth() + 1) + '-' +
             pad(localDate.getDate()) + ' ' +
             pad(localDate.getHours()) + ':' +
             pad(localDate.getMinutes()) + ':' +
             pad(localDate.getSeconds());
    }
    // This function now only returns the local time part
    function formatToLocalTime(isoString) {
      const localDate = new Date(isoString);

      const pad = (num) => num < 10 ? '0' + num : num;
      return pad(localDate.getHours()) + ':' +
             pad(localDate.getMinutes()) + ':' +
             pad(localDate.getSeconds());
    }
    function sortList(list, column, sortOrder) { // sorting function
      return list.sort((a, b) => {
        if (sortOrder === 'none') return 0; // No sorting
        if (a[column] < b[column]) return sortOrder === 'ascending' ? -1 : 1;
        if (a[column] > b[column]) return sortOrder === 'ascending' ? 1 : -1;
        return 0;
      });
    }

    function paginate(items, currentPage, itemsPerPage) {
      const totalItems = items.length;
      const totalPages = Math.ceil(totalItems / itemsPerPage);
      const start = (currentPage - 1) * itemsPerPage;
      const end = start + itemsPerPage;
      const paginatedItems = items.slice(start, end);

      return { paginatedItems, totalPages };
    }

    function getPaginationRange(currentPage, totalPages, siblingCount = 1, boundaryPagesCount = 1) {
      const totalNumbers = siblingCount + 5; // siblings + first + last + current + 2 ellipses
      const totalBlocks = totalNumbers + 2; // +2 for the first and last page buttons

      if (totalPages > totalBlocks) {
        const startPage = Math.max(2, currentPage - siblingCount);
        const endPage = Math.min(totalPages - 1, currentPage + siblingCount);

        let pages = range(startPage, endPage);

        const hasLeftSpill = startPage > 2;
        const hasRightSpill = (totalPages - endPage) > 1;
        const spillOffset = totalNumbers - (pages.length + 1);

        switch (true) {
          // handle: (1) « 5 6 ... 10 »
          case (hasLeftSpill && !hasRightSpill): {
            const extraPages = range(startPage - spillOffset, startPage - 1);
            pages = ['...'].concat(extraPages).concat(pages);
            break;
          }

          // handle: (1) « 1 2 ... 5 6 »
          case (!hasLeftSpill && hasRightSpill): {
            const extraPages = range(endPage + 1, endPage + spillOffset);
            pages = pages.concat(extraPages).concat(['...']);
            break;
          }

          // handle: (1) « 1 2 ... 4 5 6 ... 9 10 »
          case (hasLeftSpill && hasRightSpill):
          default: {
            pages = ['...'].concat(pages).concat(['...']);
            break;
          }
        }

        return [1].concat(pages).concat([totalPages]);
      }

      return range(1, totalPages);
    }

    function range(start, end) {
      return Array.from({ length: end - start + 1 }, (_, i) => i + start);
    }

    const MaxItemsPerTablePage = 1;
    const charId = 1;


    // Get the correct rank using the viewerId
    const initialRank = getOfficerRankById(viewerId);

    // Initialize userRank Svelte store with the correct rank
    const userRank = writable(initialRank);
    let configData = {};

    // New store for MDT visibility
    const isMDTVisible = writable(false);

    const defaultConfigData = {
      maxBlocksPerPage: 10,
    };

    // Handle incoming NUI messages and data updates
    window.addEventListener('message', function(event){
      let data = event.data;
      // Toggle MDT visibility
      if (data.action === "showMDT") {
        configData = data.configData || defaultConfigData;
        charId = data.charId;
      }
    });

    // src/utils/config.js
    const devConfig = {
        isDevMode: true, // Toggle this to false for production
    };

    /**
     * @typedef {Object} WrappedComponent Object returned by the `wrap` method
     * @property {SvelteComponent} component - Component to load (this is always asynchronous)
     * @property {RoutePrecondition[]} [conditions] - Route pre-conditions to validate
     * @property {Object} [props] - Optional dictionary of static props
     * @property {Object} [userData] - Optional user data dictionary
     * @property {bool} _sveltesparouter - Internal flag; always set to true
     */

    /**
     * @callback AsyncSvelteComponent
     * @returns {Promise<SvelteComponent>} Returns a Promise that resolves with a Svelte component
     */

    /**
     * @callback RoutePrecondition
     * @param {RouteDetail} detail - Route detail object
     * @returns {boolean|Promise<boolean>} If the callback returns a false-y value, it's interpreted as the precondition failed, so it aborts loading the component (and won't process other pre-condition callbacks)
     */

    /**
     * @typedef {Object} WrapOptions Options object for the call to `wrap`
     * @property {SvelteComponent} [component] - Svelte component to load (this is incompatible with `asyncComponent`)
     * @property {AsyncSvelteComponent} [asyncComponent] - Function that returns a Promise that fulfills with a Svelte component (e.g. `{asyncComponent: () => import('Foo.svelte')}`)
     * @property {SvelteComponent} [loadingComponent] - Svelte component to be displayed while the async route is loading (as a placeholder); when unset or false-y, no component is shown while component
     * @property {object} [loadingParams] - Optional dictionary passed to the `loadingComponent` component as params (for an exported prop called `params`)
     * @property {object} [userData] - Optional object that will be passed to events such as `routeLoading`, `routeLoaded`, `conditionsFailed`
     * @property {object} [props] - Optional key-value dictionary of static props that will be passed to the component. The props are expanded with {...props}, so the key in the dictionary becomes the name of the prop.
     * @property {RoutePrecondition[]|RoutePrecondition} [conditions] - Route pre-conditions to add, which will be executed in order
     */

    /**
     * Wraps a component to enable multiple capabilities:
     * 1. Using dynamically-imported component, with (e.g. `{asyncComponent: () => import('Foo.svelte')}`), which also allows bundlers to do code-splitting.
     * 2. Adding route pre-conditions (e.g. `{conditions: [...]}`)
     * 3. Adding static props that are passed to the component
     * 4. Adding custom userData, which is passed to route events (e.g. route loaded events) or to route pre-conditions (e.g. `{userData: {foo: 'bar}}`)
     * 
     * @param {WrapOptions} args - Arguments object
     * @returns {WrappedComponent} Wrapped component
     */
    function wrap$1(args) {
        if (!args) {
            throw Error('Parameter args is required')
        }

        // We need to have one and only one of component and asyncComponent
        // This does a "XNOR"
        if (!args.component == !args.asyncComponent) {
            throw Error('One and only one of component and asyncComponent is required')
        }

        // If the component is not async, wrap it into a function returning a Promise
        if (args.component) {
            args.asyncComponent = () => Promise.resolve(args.component);
        }

        // Parameter asyncComponent and each item of conditions must be functions
        if (typeof args.asyncComponent != 'function') {
            throw Error('Parameter asyncComponent must be a function')
        }
        if (args.conditions) {
            // Ensure it's an array
            if (!Array.isArray(args.conditions)) {
                args.conditions = [args.conditions];
            }
            for (let i = 0; i < args.conditions.length; i++) {
                if (!args.conditions[i] || typeof args.conditions[i] != 'function') {
                    throw Error('Invalid parameter conditions[' + i + ']')
                }
            }
        }

        // Check if we have a placeholder component
        if (args.loadingComponent) {
            args.asyncComponent.loading = args.loadingComponent;
            args.asyncComponent.loadingParams = args.loadingParams || undefined;
        }

        // Returns an object that contains all the functions to execute too
        // The _sveltesparouter flag is to confirm the object was created by this router
        const obj = {
            component: args.asyncComponent,
            userData: args.userData,
            conditions: (args.conditions && args.conditions.length) ? args.conditions : undefined,
            props: (args.props && Object.keys(args.props).length) ? args.props : {},
            _sveltesparouter: true
        };

        return obj
    }

    function parse(str, loose) {
    	if (str instanceof RegExp) return { keys:false, pattern:str };
    	var c, o, tmp, ext, keys=[], pattern='', arr = str.split('/');
    	arr[0] || arr.shift();

    	while (tmp = arr.shift()) {
    		c = tmp[0];
    		if (c === '*') {
    			keys.push('wild');
    			pattern += '/(.*)';
    		} else if (c === ':') {
    			o = tmp.indexOf('?', 1);
    			ext = tmp.indexOf('.', 1);
    			keys.push( tmp.substring(1, !!~o ? o : !!~ext ? ext : tmp.length) );
    			pattern += !!~o && !~ext ? '(?:/([^/]+?))?' : '/([^/]+?)';
    			if (!!~ext) pattern += (!!~o ? '?' : '') + '\\' + tmp.substring(ext);
    		} else {
    			pattern += '/' + tmp;
    		}
    	}

    	return {
    		keys: keys,
    		pattern: new RegExp('^' + pattern + (loose ? '(?=$|\/)' : '\/?$'), 'i')
    	};
    }

    /* node_modules\svelte-spa-router\Router.svelte generated by Svelte v3.59.2 */

    const { Error: Error_1, Object: Object_1, console: console_1$f } = globals;

    // (267:0) {:else}
    function create_else_block$a(ctx) {
    	let switch_instance;
    	let switch_instance_anchor;
    	let current;
    	const switch_instance_spread_levels = [/*props*/ ctx[2]];
    	var switch_value = /*component*/ ctx[0];

    	function switch_props(ctx) {
    		let switch_instance_props = {};

    		for (let i = 0; i < switch_instance_spread_levels.length; i += 1) {
    			switch_instance_props = assign(switch_instance_props, switch_instance_spread_levels[i]);
    		}

    		return {
    			props: switch_instance_props,
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		switch_instance = construct_svelte_component_dev(switch_value, switch_props());
    		switch_instance.$on("routeEvent", /*routeEvent_handler_1*/ ctx[7]);
    	}

    	const block = {
    		c: function create() {
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			switch_instance_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (switch_instance) mount_component(switch_instance, target, anchor);
    			insert_dev(target, switch_instance_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const switch_instance_changes = (dirty & /*props*/ 4)
    			? get_spread_update(switch_instance_spread_levels, [get_spread_object(/*props*/ ctx[2])])
    			: {};

    			if (dirty & /*component*/ 1 && switch_value !== (switch_value = /*component*/ ctx[0])) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = construct_svelte_component_dev(switch_value, switch_props());
    					switch_instance.$on("routeEvent", /*routeEvent_handler_1*/ ctx[7]);
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
    				} else {
    					switch_instance = null;
    				}
    			} else if (switch_value) {
    				switch_instance.$set(switch_instance_changes);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(switch_instance_anchor);
    			if (switch_instance) destroy_component(switch_instance, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$a.name,
    		type: "else",
    		source: "(267:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (260:0) {#if componentParams}
    function create_if_block$k(ctx) {
    	let switch_instance;
    	let switch_instance_anchor;
    	let current;
    	const switch_instance_spread_levels = [{ params: /*componentParams*/ ctx[1] }, /*props*/ ctx[2]];
    	var switch_value = /*component*/ ctx[0];

    	function switch_props(ctx) {
    		let switch_instance_props = {};

    		for (let i = 0; i < switch_instance_spread_levels.length; i += 1) {
    			switch_instance_props = assign(switch_instance_props, switch_instance_spread_levels[i]);
    		}

    		return {
    			props: switch_instance_props,
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		switch_instance = construct_svelte_component_dev(switch_value, switch_props());
    		switch_instance.$on("routeEvent", /*routeEvent_handler*/ ctx[6]);
    	}

    	const block = {
    		c: function create() {
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			switch_instance_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (switch_instance) mount_component(switch_instance, target, anchor);
    			insert_dev(target, switch_instance_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const switch_instance_changes = (dirty & /*componentParams, props*/ 6)
    			? get_spread_update(switch_instance_spread_levels, [
    					dirty & /*componentParams*/ 2 && { params: /*componentParams*/ ctx[1] },
    					dirty & /*props*/ 4 && get_spread_object(/*props*/ ctx[2])
    				])
    			: {};

    			if (dirty & /*component*/ 1 && switch_value !== (switch_value = /*component*/ ctx[0])) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = construct_svelte_component_dev(switch_value, switch_props());
    					switch_instance.$on("routeEvent", /*routeEvent_handler*/ ctx[6]);
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
    				} else {
    					switch_instance = null;
    				}
    			} else if (switch_value) {
    				switch_instance.$set(switch_instance_changes);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(switch_instance_anchor);
    			if (switch_instance) destroy_component(switch_instance, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$k.name,
    		type: "if",
    		source: "(260:0) {#if componentParams}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$s(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block$k, create_else_block$a];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*componentParams*/ ctx[1]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error_1("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$s.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function wrap(component, userData, ...conditions) {
    	// Use the new wrap method and show a deprecation warning
    	// eslint-disable-next-line no-console
    	console.warn('Method `wrap` from `svelte-spa-router` is deprecated and will be removed in a future version. Please use `svelte-spa-router/wrap` instead. See http://bit.ly/svelte-spa-router-upgrading');

    	return wrap$1({ component, userData, conditions });
    }

    /**
     * @typedef {Object} Location
     * @property {string} location - Location (page/view), for example `/book`
     * @property {string} [querystring] - Querystring from the hash, as a string not parsed
     */
    /**
     * Returns the current location from the hash.
     *
     * @returns {Location} Location object
     * @private
     */
    function getLocation() {
    	const hashPosition = window.location.href.indexOf('#/');

    	let location = hashPosition > -1
    	? window.location.href.substr(hashPosition + 1)
    	: '/';

    	// Check if there's a querystring
    	const qsPosition = location.indexOf('?');

    	let querystring = '';

    	if (qsPosition > -1) {
    		querystring = location.substr(qsPosition + 1);
    		location = location.substr(0, qsPosition);
    	}

    	return { location, querystring };
    }

    const loc = readable(null, // eslint-disable-next-line prefer-arrow-callback
    function start(set) {
    	set(getLocation());

    	const update = () => {
    		set(getLocation());
    	};

    	window.addEventListener('hashchange', update, false);

    	return function stop() {
    		window.removeEventListener('hashchange', update, false);
    	};
    });

    const location = derived(loc, $loc => $loc.location);
    const querystring = derived(loc, $loc => $loc.querystring);
    const params = writable(undefined);

    async function push(location) {
    	if (!location || location.length < 1 || location.charAt(0) != '/' && location.indexOf('#/') !== 0) {
    		throw Error('Invalid parameter location');
    	}

    	// Execute this code when the current call stack is complete
    	await tick();

    	// Note: this will include scroll state in history even when restoreScrollState is false
    	history.replaceState(
    		{
    			...history.state,
    			__svelte_spa_router_scrollX: window.scrollX,
    			__svelte_spa_router_scrollY: window.scrollY
    		},
    		undefined
    	);

    	window.location.hash = (location.charAt(0) == '#' ? '' : '#') + location;
    }

    async function pop() {
    	// Execute this code when the current call stack is complete
    	await tick();

    	window.history.back();
    }

    async function replace(location) {
    	if (!location || location.length < 1 || location.charAt(0) != '/' && location.indexOf('#/') !== 0) {
    		throw Error('Invalid parameter location');
    	}

    	// Execute this code when the current call stack is complete
    	await tick();

    	const dest = (location.charAt(0) == '#' ? '' : '#') + location;

    	try {
    		const newState = { ...history.state };
    		delete newState['__svelte_spa_router_scrollX'];
    		delete newState['__svelte_spa_router_scrollY'];
    		window.history.replaceState(newState, undefined, dest);
    	} catch(e) {
    		// eslint-disable-next-line no-console
    		console.warn('Caught exception while replacing the current page. If you\'re running this in the Svelte REPL, please note that the `replace` method might not work in this environment.');
    	}

    	// The method above doesn't trigger the hashchange event, so let's do that manually
    	window.dispatchEvent(new Event('hashchange'));
    }

    function link(node, opts) {
    	opts = linkOpts(opts);

    	// Only apply to <a> tags
    	if (!node || !node.tagName || node.tagName.toLowerCase() != 'a') {
    		throw Error('Action "link" can only be used with <a> tags');
    	}

    	updateLink(node, opts);

    	return {
    		update(updated) {
    			updated = linkOpts(updated);
    			updateLink(node, updated);
    		}
    	};
    }

    function restoreScroll(state) {
    	// If this exists, then this is a back navigation: restore the scroll position
    	if (state) {
    		window.scrollTo(state.__svelte_spa_router_scrollX, state.__svelte_spa_router_scrollY);
    	} else {
    		// Otherwise this is a forward navigation: scroll to top
    		window.scrollTo(0, 0);
    	}
    }

    // Internal function used by the link function
    function updateLink(node, opts) {
    	let href = opts.href || node.getAttribute('href');

    	// Destination must start with '/' or '#/'
    	if (href && href.charAt(0) == '/') {
    		// Add # to the href attribute
    		href = '#' + href;
    	} else if (!href || href.length < 2 || href.slice(0, 2) != '#/') {
    		throw Error('Invalid value for "href" attribute: ' + href);
    	}

    	node.setAttribute('href', href);

    	node.addEventListener('click', event => {
    		// Prevent default anchor onclick behaviour
    		event.preventDefault();

    		if (!opts.disabled) {
    			scrollstateHistoryHandler(event.currentTarget.getAttribute('href'));
    		}
    	});
    }

    // Internal function that ensures the argument of the link action is always an object
    function linkOpts(val) {
    	if (val && typeof val == 'string') {
    		return { href: val };
    	} else {
    		return val || {};
    	}
    }

    /**
     * The handler attached to an anchor tag responsible for updating the
     * current history state with the current scroll state
     *
     * @param {string} href - Destination
     */
    function scrollstateHistoryHandler(href) {
    	// Setting the url (3rd arg) to href will break clicking for reasons, so don't try to do that
    	history.replaceState(
    		{
    			...history.state,
    			__svelte_spa_router_scrollX: window.scrollX,
    			__svelte_spa_router_scrollY: window.scrollY
    		},
    		undefined
    	);

    	// This will force an update as desired, but this time our scroll state will be attached
    	window.location.hash = href;
    }

    function instance$s($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Router', slots, []);
    	let { routes = {} } = $$props;
    	let { prefix = '' } = $$props;
    	let { restoreScrollState = false } = $$props;

    	/**
     * Container for a route: path, component
     */
    	class RouteItem {
    		/**
     * Initializes the object and creates a regular expression from the path, using regexparam.
     *
     * @param {string} path - Path to the route (must start with '/' or '*')
     * @param {SvelteComponent|WrappedComponent} component - Svelte component for the route, optionally wrapped
     */
    		constructor(path, component) {
    			if (!component || typeof component != 'function' && (typeof component != 'object' || component._sveltesparouter !== true)) {
    				throw Error('Invalid component object');
    			}

    			// Path must be a regular or expression, or a string starting with '/' or '*'
    			if (!path || typeof path == 'string' && (path.length < 1 || path.charAt(0) != '/' && path.charAt(0) != '*') || typeof path == 'object' && !(path instanceof RegExp)) {
    				throw Error('Invalid value for "path" argument - strings must start with / or *');
    			}

    			const { pattern, keys } = parse(path);
    			this.path = path;

    			// Check if the component is wrapped and we have conditions
    			if (typeof component == 'object' && component._sveltesparouter === true) {
    				this.component = component.component;
    				this.conditions = component.conditions || [];
    				this.userData = component.userData;
    				this.props = component.props || {};
    			} else {
    				// Convert the component to a function that returns a Promise, to normalize it
    				this.component = () => Promise.resolve(component);

    				this.conditions = [];
    				this.props = {};
    			}

    			this._pattern = pattern;
    			this._keys = keys;
    		}

    		/**
     * Checks if `path` matches the current route.
     * If there's a match, will return the list of parameters from the URL (if any).
     * In case of no match, the method will return `null`.
     *
     * @param {string} path - Path to test
     * @returns {null|Object.<string, string>} List of paramters from the URL if there's a match, or `null` otherwise.
     */
    		match(path) {
    			// If there's a prefix, check if it matches the start of the path.
    			// If not, bail early, else remove it before we run the matching.
    			if (prefix) {
    				if (typeof prefix == 'string') {
    					if (path.startsWith(prefix)) {
    						path = path.substr(prefix.length) || '/';
    					} else {
    						return null;
    					}
    				} else if (prefix instanceof RegExp) {
    					const match = path.match(prefix);

    					if (match && match[0]) {
    						path = path.substr(match[0].length) || '/';
    					} else {
    						return null;
    					}
    				}
    			}

    			// Check if the pattern matches
    			const matches = this._pattern.exec(path);

    			if (matches === null) {
    				return null;
    			}

    			// If the input was a regular expression, this._keys would be false, so return matches as is
    			if (this._keys === false) {
    				return matches;
    			}

    			const out = {};
    			let i = 0;

    			while (i < this._keys.length) {
    				// In the match parameters, URL-decode all values
    				try {
    					out[this._keys[i]] = decodeURIComponent(matches[i + 1] || '') || null;
    				} catch(e) {
    					out[this._keys[i]] = null;
    				}

    				i++;
    			}

    			return out;
    		}

    		/**
     * Dictionary with route details passed to the pre-conditions functions, as well as the `routeLoading`, `routeLoaded` and `conditionsFailed` events
     * @typedef {Object} RouteDetail
     * @property {string|RegExp} route - Route matched as defined in the route definition (could be a string or a reguar expression object)
     * @property {string} location - Location path
     * @property {string} querystring - Querystring from the hash
     * @property {object} [userData] - Custom data passed by the user
     * @property {SvelteComponent} [component] - Svelte component (only in `routeLoaded` events)
     * @property {string} [name] - Name of the Svelte component (only in `routeLoaded` events)
     */
    		/**
     * Executes all conditions (if any) to control whether the route can be shown. Conditions are executed in the order they are defined, and if a condition fails, the following ones aren't executed.
     * 
     * @param {RouteDetail} detail - Route detail
     * @returns {boolean} Returns true if all the conditions succeeded
     */
    		async checkConditions(detail) {
    			for (let i = 0; i < this.conditions.length; i++) {
    				if (!await this.conditions[i](detail)) {
    					return false;
    				}
    			}

    			return true;
    		}
    	}

    	// Set up all routes
    	const routesList = [];

    	if (routes instanceof Map) {
    		// If it's a map, iterate on it right away
    		routes.forEach((route, path) => {
    			routesList.push(new RouteItem(path, route));
    		});
    	} else {
    		// We have an object, so iterate on its own properties
    		Object.keys(routes).forEach(path => {
    			routesList.push(new RouteItem(path, routes[path]));
    		});
    	}

    	// Props for the component to render
    	let component = null;

    	let componentParams = null;
    	let props = {};

    	// Event dispatcher from Svelte
    	const dispatch = createEventDispatcher();

    	// Just like dispatch, but executes on the next iteration of the event loop
    	async function dispatchNextTick(name, detail) {
    		// Execute this code when the current call stack is complete
    		await tick();

    		dispatch(name, detail);
    	}

    	// If this is set, then that means we have popped into this var the state of our last scroll position
    	let previousScrollState = null;

    	let popStateChanged = null;

    	if (restoreScrollState) {
    		popStateChanged = event => {
    			// If this event was from our history.replaceState, event.state will contain
    			// our scroll history. Otherwise, event.state will be null (like on forward
    			// navigation)
    			if (event.state && (event.state.__svelte_spa_router_scrollY || event.state.__svelte_spa_router_scrollX)) {
    				previousScrollState = event.state;
    			} else {
    				previousScrollState = null;
    			}
    		};

    		// This is removed in the destroy() invocation below
    		window.addEventListener('popstate', popStateChanged);

    		afterUpdate(() => {
    			restoreScroll(previousScrollState);
    		});
    	}

    	// Always have the latest value of loc
    	let lastLoc = null;

    	// Current object of the component loaded
    	let componentObj = null;

    	// Handle hash change events
    	// Listen to changes in the $loc store and update the page
    	// Do not use the $: syntax because it gets triggered by too many things
    	const unsubscribeLoc = loc.subscribe(async newLoc => {
    		lastLoc = newLoc;

    		// Find a route matching the location
    		let i = 0;

    		while (i < routesList.length) {
    			const match = routesList[i].match(newLoc.location);

    			if (!match) {
    				i++;
    				continue;
    			}

    			const detail = {
    				route: routesList[i].path,
    				location: newLoc.location,
    				querystring: newLoc.querystring,
    				userData: routesList[i].userData,
    				params: match && typeof match == 'object' && Object.keys(match).length
    				? match
    				: null
    			};

    			// Check if the route can be loaded - if all conditions succeed
    			if (!await routesList[i].checkConditions(detail)) {
    				// Don't display anything
    				$$invalidate(0, component = null);

    				componentObj = null;

    				// Trigger an event to notify the user, then exit
    				dispatchNextTick('conditionsFailed', detail);

    				return;
    			}

    			// Trigger an event to alert that we're loading the route
    			// We need to clone the object on every event invocation so we don't risk the object to be modified in the next tick
    			dispatchNextTick('routeLoading', Object.assign({}, detail));

    			// If there's a component to show while we're loading the route, display it
    			const obj = routesList[i].component;

    			// Do not replace the component if we're loading the same one as before, to avoid the route being unmounted and re-mounted
    			if (componentObj != obj) {
    				if (obj.loading) {
    					$$invalidate(0, component = obj.loading);
    					componentObj = obj;
    					$$invalidate(1, componentParams = obj.loadingParams);
    					$$invalidate(2, props = {});

    					// Trigger the routeLoaded event for the loading component
    					// Create a copy of detail so we don't modify the object for the dynamic route (and the dynamic route doesn't modify our object too)
    					dispatchNextTick('routeLoaded', Object.assign({}, detail, {
    						component,
    						name: component.name,
    						params: componentParams
    					}));
    				} else {
    					$$invalidate(0, component = null);
    					componentObj = null;
    				}

    				// Invoke the Promise
    				const loaded = await obj();

    				// Now that we're here, after the promise resolved, check if we still want this component, as the user might have navigated to another page in the meanwhile
    				if (newLoc != lastLoc) {
    					// Don't update the component, just exit
    					return;
    				}

    				// If there is a "default" property, which is used by async routes, then pick that
    				$$invalidate(0, component = loaded && loaded.default || loaded);

    				componentObj = obj;
    			}

    			// Set componentParams only if we have a match, to avoid a warning similar to `<Component> was created with unknown prop 'params'`
    			// Of course, this assumes that developers always add a "params" prop when they are expecting parameters
    			if (match && typeof match == 'object' && Object.keys(match).length) {
    				$$invalidate(1, componentParams = match);
    			} else {
    				$$invalidate(1, componentParams = null);
    			}

    			// Set static props, if any
    			$$invalidate(2, props = routesList[i].props);

    			// Dispatch the routeLoaded event then exit
    			// We need to clone the object on every event invocation so we don't risk the object to be modified in the next tick
    			dispatchNextTick('routeLoaded', Object.assign({}, detail, {
    				component,
    				name: component.name,
    				params: componentParams
    			})).then(() => {
    				params.set(componentParams);
    			});

    			return;
    		}

    		// If we're still here, there was no match, so show the empty component
    		$$invalidate(0, component = null);

    		componentObj = null;
    		params.set(undefined);
    	});

    	onDestroy(() => {
    		unsubscribeLoc();
    		popStateChanged && window.removeEventListener('popstate', popStateChanged);
    	});

    	const writable_props = ['routes', 'prefix', 'restoreScrollState'];

    	Object_1.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$f.warn(`<Router> was created with unknown prop '${key}'`);
    	});

    	function routeEvent_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function routeEvent_handler_1(event) {
    		bubble.call(this, $$self, event);
    	}

    	$$self.$$set = $$props => {
    		if ('routes' in $$props) $$invalidate(3, routes = $$props.routes);
    		if ('prefix' in $$props) $$invalidate(4, prefix = $$props.prefix);
    		if ('restoreScrollState' in $$props) $$invalidate(5, restoreScrollState = $$props.restoreScrollState);
    	};

    	$$self.$capture_state = () => ({
    		readable,
    		writable,
    		derived,
    		tick,
    		_wrap: wrap$1,
    		wrap,
    		getLocation,
    		loc,
    		location,
    		querystring,
    		params,
    		push,
    		pop,
    		replace,
    		link,
    		restoreScroll,
    		updateLink,
    		linkOpts,
    		scrollstateHistoryHandler,
    		onDestroy,
    		createEventDispatcher,
    		afterUpdate,
    		parse,
    		routes,
    		prefix,
    		restoreScrollState,
    		RouteItem,
    		routesList,
    		component,
    		componentParams,
    		props,
    		dispatch,
    		dispatchNextTick,
    		previousScrollState,
    		popStateChanged,
    		lastLoc,
    		componentObj,
    		unsubscribeLoc
    	});

    	$$self.$inject_state = $$props => {
    		if ('routes' in $$props) $$invalidate(3, routes = $$props.routes);
    		if ('prefix' in $$props) $$invalidate(4, prefix = $$props.prefix);
    		if ('restoreScrollState' in $$props) $$invalidate(5, restoreScrollState = $$props.restoreScrollState);
    		if ('component' in $$props) $$invalidate(0, component = $$props.component);
    		if ('componentParams' in $$props) $$invalidate(1, componentParams = $$props.componentParams);
    		if ('props' in $$props) $$invalidate(2, props = $$props.props);
    		if ('previousScrollState' in $$props) previousScrollState = $$props.previousScrollState;
    		if ('popStateChanged' in $$props) popStateChanged = $$props.popStateChanged;
    		if ('lastLoc' in $$props) lastLoc = $$props.lastLoc;
    		if ('componentObj' in $$props) componentObj = $$props.componentObj;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*restoreScrollState*/ 32) {
    			// Update history.scrollRestoration depending on restoreScrollState
    			history.scrollRestoration = restoreScrollState ? 'manual' : 'auto';
    		}
    	};

    	return [
    		component,
    		componentParams,
    		props,
    		routes,
    		prefix,
    		restoreScrollState,
    		routeEvent_handler,
    		routeEvent_handler_1
    	];
    }

    class Router extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$s, create_fragment$s, safe_not_equal, {
    			routes: 3,
    			prefix: 4,
    			restoreScrollState: 5
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Router",
    			options,
    			id: create_fragment$s.name
    		});
    	}

    	get routes() {
    		throw new Error_1("<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set routes(value) {
    		throw new Error_1("<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get prefix() {
    		throw new Error_1("<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set prefix(value) {
    		throw new Error_1("<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get restoreScrollState() {
    		throw new Error_1("<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set restoreScrollState(value) {
    		throw new Error_1("<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\Navigation\Navbar.svelte generated by Svelte v3.59.2 */
    const file$r = "src\\Navigation\\Navbar.svelte";

    // (28:12) {#if canViewPoliceRoster}
    function create_if_block_2$6(ctx) {
    	let li;
    	let a;

    	const block = {
    		c: function create() {
    			li = element("li");
    			a = element("a");
    			a.textContent = "Roster";
    			attr_dev(a, "href", "#/police-roster");
    			attr_dev(a, "class", "svelte-37hig8");
    			add_location(a, file$r, 28, 16, 1032);
    			attr_dev(li, "class", "svelte-37hig8");
    			add_location(li, file$r, 28, 12, 1028);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, a);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$6.name,
    		type: "if",
    		source: "(28:12) {#if canViewPoliceRoster}",
    		ctx
    	});

    	return block;
    }

    // (36:12) {#if canViewCaseFiles}
    function create_if_block_1$b(ctx) {
    	let li;
    	let a;

    	const block = {
    		c: function create() {
    			li = element("li");
    			a = element("a");
    			a.textContent = "Case Files";
    			attr_dev(a, "href", "#/case-files");
    			attr_dev(a, "class", "svelte-37hig8");
    			add_location(a, file$r, 36, 20, 1432);
    			attr_dev(li, "class", "svelte-37hig8");
    			add_location(li, file$r, 36, 16, 1428);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, a);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$b.name,
    		type: "if",
    		source: "(36:12) {#if canViewCaseFiles}",
    		ctx
    	});

    	return block;
    }

    // (39:12) {#if canViewCalculator}
    function create_if_block$j(ctx) {
    	let li;
    	let a;

    	const block = {
    		c: function create() {
    			li = element("li");
    			a = element("a");
    			a.textContent = "Calc Config.";
    			attr_dev(a, "href", "#/calculator-configuration");
    			attr_dev(a, "class", "svelte-37hig8");
    			add_location(a, file$r, 39, 16, 1548);
    			attr_dev(li, "class", "svelte-37hig8");
    			add_location(li, file$r, 39, 12, 1544);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, a);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$j.name,
    		type: "if",
    		source: "(39:12) {#if canViewCalculator}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$r(ctx) {
    	let nav;
    	let button0;
    	let t1;
    	let div;
    	let ul;
    	let li0;
    	let a0;
    	let t3;
    	let t4;
    	let li1;
    	let a1;
    	let t6;
    	let li2;
    	let a2;
    	let t8;
    	let li3;
    	let a3;
    	let t10;
    	let li4;
    	let a4;
    	let t12;
    	let li5;
    	let a5;
    	let t14;
    	let t15;
    	let t16;
    	let button1;
    	let mounted;
    	let dispose;
    	let if_block0 = /*canViewPoliceRoster*/ ctx[0] && create_if_block_2$6(ctx);
    	let if_block1 = /*canViewCaseFiles*/ ctx[2] && create_if_block_1$b(ctx);
    	let if_block2 = /*canViewCalculator*/ ctx[1] && create_if_block$j(ctx);

    	const block = {
    		c: function create() {
    			nav = element("nav");
    			button0 = element("button");
    			button0.textContent = "◀";
    			t1 = space();
    			div = element("div");
    			ul = element("ul");
    			li0 = element("li");
    			a0 = element("a");
    			a0.textContent = "Pinboard";
    			t3 = space();
    			if (if_block0) if_block0.c();
    			t4 = space();
    			li1 = element("li");
    			a1 = element("a");
    			a1.textContent = "Alerts";
    			t6 = space();
    			li2 = element("li");
    			a2 = element("a");
    			a2.textContent = "Laws";
    			t8 = space();
    			li3 = element("li");
    			a3 = element("a");
    			a3.textContent = "Reports";
    			t10 = space();
    			li4 = element("li");
    			a4 = element("a");
    			a4.textContent = "Profiles";
    			t12 = space();
    			li5 = element("li");
    			a5 = element("a");
    			a5.textContent = "Trainings";
    			t14 = space();
    			if (if_block1) if_block1.c();
    			t15 = space();
    			if (if_block2) if_block2.c();
    			t16 = space();
    			button1 = element("button");
    			button1.textContent = "▶";
    			attr_dev(button0, "class", "svelte-37hig8");
    			add_location(button0, file$r, 23, 4, 819);
    			attr_dev(a0, "href", "#/");
    			attr_dev(a0, "class", "svelte-37hig8");
    			add_location(a0, file$r, 26, 14, 945);
    			attr_dev(li0, "class", "svelte-37hig8");
    			add_location(li0, file$r, 26, 10, 941);
    			attr_dev(a1, "href", "#/alerts");
    			attr_dev(a1, "class", "svelte-37hig8");
    			add_location(a1, file$r, 30, 16, 1110);
    			attr_dev(li1, "class", "svelte-37hig8");
    			add_location(li1, file$r, 30, 12, 1106);
    			attr_dev(a2, "href", "#/server-laws");
    			attr_dev(a2, "class", "svelte-37hig8");
    			add_location(a2, file$r, 31, 16, 1162);
    			attr_dev(li2, "class", "svelte-37hig8");
    			add_location(li2, file$r, 31, 12, 1158);
    			attr_dev(a3, "href", "#/reports");
    			attr_dev(a3, "class", "svelte-37hig8");
    			add_location(a3, file$r, 32, 16, 1217);
    			attr_dev(li3, "class", "svelte-37hig8");
    			add_location(li3, file$r, 32, 12, 1213);
    			attr_dev(a4, "href", "#/player-profiles");
    			attr_dev(a4, "class", "svelte-37hig8");
    			add_location(a4, file$r, 33, 16, 1271);
    			attr_dev(li4, "class", "svelte-37hig8");
    			add_location(li4, file$r, 33, 12, 1267);
    			attr_dev(a5, "href", "#/trainings");
    			attr_dev(a5, "class", "svelte-37hig8");
    			add_location(a5, file$r, 34, 16, 1334);
    			attr_dev(li5, "class", "svelte-37hig8");
    			add_location(li5, file$r, 34, 12, 1330);
    			attr_dev(ul, "class", "svelte-37hig8");
    			add_location(ul, file$r, 25, 8, 925);
    			attr_dev(div, "id", "nav-scroll-container");
    			attr_dev(div, "class", "svelte-37hig8");
    			add_location(div, file$r, 24, 4, 884);
    			attr_dev(button1, "class", "svelte-37hig8");
    			add_location(button1, file$r, 43, 4, 1658);
    			attr_dev(nav, "class", "svelte-37hig8");
    			add_location(nav, file$r, 22, 0, 808);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, nav, anchor);
    			append_dev(nav, button0);
    			append_dev(nav, t1);
    			append_dev(nav, div);
    			append_dev(div, ul);
    			append_dev(ul, li0);
    			append_dev(li0, a0);
    			append_dev(ul, t3);
    			if (if_block0) if_block0.m(ul, null);
    			append_dev(ul, t4);
    			append_dev(ul, li1);
    			append_dev(li1, a1);
    			append_dev(ul, t6);
    			append_dev(ul, li2);
    			append_dev(li2, a2);
    			append_dev(ul, t8);
    			append_dev(ul, li3);
    			append_dev(li3, a3);
    			append_dev(ul, t10);
    			append_dev(ul, li4);
    			append_dev(li4, a4);
    			append_dev(ul, t12);
    			append_dev(ul, li5);
    			append_dev(li5, a5);
    			append_dev(ul, t14);
    			if (if_block1) if_block1.m(ul, null);
    			append_dev(ul, t15);
    			if (if_block2) if_block2.m(ul, null);
    			append_dev(nav, t16);
    			append_dev(nav, button1);

    			if (!mounted) {
    				dispose = [
    					listen_dev(button0, "click", /*click_handler*/ ctx[4], false, false, false, false),
    					listen_dev(button1, "click", /*click_handler_1*/ ctx[5], false, false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*canViewPoliceRoster*/ ctx[0]) {
    				if (if_block0) ; else {
    					if_block0 = create_if_block_2$6(ctx);
    					if_block0.c();
    					if_block0.m(ul, t4);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (/*canViewCaseFiles*/ ctx[2]) {
    				if (if_block1) ; else {
    					if_block1 = create_if_block_1$b(ctx);
    					if_block1.c();
    					if_block1.m(ul, t15);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}

    			if (/*canViewCalculator*/ ctx[1]) {
    				if (if_block2) ; else {
    					if_block2 = create_if_block$j(ctx);
    					if_block2.c();
    					if_block2.m(ul, null);
    				}
    			} else if (if_block2) {
    				if_block2.d(1);
    				if_block2 = null;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(nav);
    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
    			if (if_block2) if_block2.d();
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$r.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function scrollNav(direction) {
    	const scrollAmount = 330;
    	const nav = document.getElementById("nav-scroll-container");

    	if (nav) {
    		if (direction === 'left') {
    			nav.scrollLeft -= scrollAmount;
    		} else {
    			nav.scrollLeft += scrollAmount;
    		}
    	}
    }

    function instance$r($$self, $$props, $$invalidate) {
    	let canViewCaseFiles;
    	let canViewCalculator;
    	let canViewPoliceRoster;
    	let $userRank;
    	validate_store(userRank, 'userRank');
    	component_subscribe($$self, userRank, $$value => $$invalidate(3, $userRank = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Navbar', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Navbar> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => scrollNav('left');
    	const click_handler_1 = () => scrollNav('right');

    	$$self.$capture_state = () => ({
    		userRank,
    		hasPermission,
    		scrollNav,
    		canViewPoliceRoster,
    		canViewCalculator,
    		canViewCaseFiles,
    		$userRank
    	});

    	$$self.$inject_state = $$props => {
    		if ('canViewPoliceRoster' in $$props) $$invalidate(0, canViewPoliceRoster = $$props.canViewPoliceRoster);
    		if ('canViewCalculator' in $$props) $$invalidate(1, canViewCalculator = $$props.canViewCalculator);
    		if ('canViewCaseFiles' in $$props) $$invalidate(2, canViewCaseFiles = $$props.canViewCaseFiles);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$userRank*/ 8) {
    			// Use a reactive statement to update permissions based on rank
    			$$invalidate(2, canViewCaseFiles = hasPermission(`${$userRank}`, 'canViewCaseFiles'));
    		}

    		if ($$self.$$.dirty & /*$userRank*/ 8) {
    			$$invalidate(1, canViewCalculator = hasPermission(`${$userRank}`, 'canViewCalculator'));
    		}

    		if ($$self.$$.dirty & /*$userRank*/ 8) {
    			$$invalidate(0, canViewPoliceRoster = hasPermission(`${$userRank}`, 'canViewPoliceRoster')); // Assume you will add this permission
    		}
    	};

    	return [
    		canViewPoliceRoster,
    		canViewCalculator,
    		canViewCaseFiles,
    		$userRank,
    		click_handler,
    		click_handler_1
    	];
    }

    class Navbar extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$r, create_fragment$r, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Navbar",
    			options,
    			id: create_fragment$r.name
    		});
    	}
    }

    /* src\Dashboard\Layout.svelte generated by Svelte v3.59.2 */
    const file$q = "src\\Dashboard\\Layout.svelte";

    function create_fragment$q(ctx) {
    	let h1;
    	let t1;
    	let navbar;
    	let t2;
    	let current;
    	navbar = new Navbar({ $$inline: true });
    	const default_slot_template = /*#slots*/ ctx[2].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[1], null);

    	const block = {
    		c: function create() {
    			h1 = element("h1");
    			h1.textContent = `${/*welcomeMessage*/ ctx[0]}`;
    			t1 = space();
    			create_component(navbar.$$.fragment);
    			t2 = space();
    			if (default_slot) default_slot.c();
    			attr_dev(h1, "class", "svelte-13whrd");
    			add_location(h1, file$q, 7, 0, 171);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h1, anchor);
    			insert_dev(target, t1, anchor);
    			mount_component(navbar, target, anchor);
    			insert_dev(target, t2, anchor);

    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 2)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[1],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[1])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[1], dirty, null),
    						null
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(navbar.$$.fragment, local);
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(navbar.$$.fragment, local);
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h1);
    			if (detaching) detach_dev(t1);
    			destroy_component(navbar, detaching);
    			if (detaching) detach_dev(t2);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$q.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$q($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Layout', slots, ['default']);
    	let welcomeMessage = "Syn County Sheriff Registry";
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Layout> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('$$scope' in $$props) $$invalidate(1, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({ Navbar, welcomeMessage });

    	$$self.$inject_state = $$props => {
    		if ('welcomeMessage' in $$props) $$invalidate(0, welcomeMessage = $$props.welcomeMessage);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [welcomeMessage, $$scope, slots];
    }

    class Layout extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$q, create_fragment$q, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Layout",
    			options,
    			id: create_fragment$q.name
    		});
    	}
    }

    /* src\components\MessageOfTheDay.svelte generated by Svelte v3.59.2 */
    const file$p = "src\\components\\MessageOfTheDay.svelte";

    // (55:0) {#if canWriteMOD}
    function create_if_block$i(ctx) {
    	let div;
    	let input;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div = element("div");
    			input = element("input");
    			attr_dev(input, "type", "text");
    			attr_dev(input, "placeholder", "Write a new message of the day");
    			attr_dev(input, "data-type", "message");
    			attr_dev(input, "class", "svelte-1qnajmb");
    			add_location(input, file$p, 56, 4, 1596);
    			add_location(div, file$p, 55, 2, 1585);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, input);
    			set_input_value(input, /*newMessage*/ ctx[0]);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input, "input", /*input_input_handler*/ ctx[6]),
    					listen_dev(input, "keypress", self(/*keypress_handler*/ ctx[7]), false, false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*newMessage*/ 1 && input.value !== /*newMessage*/ ctx[0]) {
    				set_input_value(input, /*newMessage*/ ctx[0]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$i.name,
    		type: "if",
    		source: "(55:0) {#if canWriteMOD}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$p(ctx) {
    	let div1;
    	let div0;
    	let p0;
    	let t0;
    	let t1;
    	let p1;
    	let t2;
    	let t3;
    	let if_block_anchor;
    	let if_block = /*canWriteMOD*/ ctx[2] && create_if_block$i(ctx);

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			p0 = element("p");
    			t0 = text(/*$messageOfTheDay*/ ctx[3]);
    			t1 = space();
    			p1 = element("p");
    			t2 = text(/*$messageOfTheDay*/ ctx[3]);
    			t3 = space();
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    			attr_dev(p0, "class", "typewriter-text svelte-1qnajmb");
    			add_location(p0, file$p, 49, 4, 1370);
    			attr_dev(p1, "class", "typewriter-text svelte-1qnajmb");
    			add_location(p1, file$p, 50, 4, 1459);
    			attr_dev(div0, "class", "typewriter-wrapper svelte-1qnajmb");
    			add_location(div0, file$p, 48, 2, 1312);
    			attr_dev(div1, "class", "typewriter-container svelte-1qnajmb");
    			add_location(div1, file$p, 47, 0, 1274);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			append_dev(div0, p0);
    			append_dev(p0, t0);
    			append_dev(div0, t1);
    			append_dev(div0, p1);
    			append_dev(p1, t2);
    			/*div0_binding*/ ctx[5](div0);
    			insert_dev(target, t3, anchor);
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*$messageOfTheDay*/ 8) set_data_dev(t0, /*$messageOfTheDay*/ ctx[3]);
    			if (dirty & /*$messageOfTheDay*/ 8) set_data_dev(t2, /*$messageOfTheDay*/ ctx[3]);

    			if (/*canWriteMOD*/ ctx[2]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$i(ctx);
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			/*div0_binding*/ ctx[5](null);
    			if (detaching) detach_dev(t3);
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$p.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$p($$self, $$props, $$invalidate) {
    	let $userRank;
    	let $messageOfTheDay;
    	validate_store(userRank, 'userRank');
    	component_subscribe($$self, userRank, $$value => $$invalidate(11, $userRank = $$value));
    	validate_store(messageOfTheDay, 'messageOfTheDay');
    	component_subscribe($$self, messageOfTheDay, $$value => $$invalidate(3, $messageOfTheDay = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('MessageOfTheDay', slots, []);
    	let newMessage = "";
    	let wrapper;
    	let canWriteMOD;
    	let animationId; // To hold the ID of the animation frame
    	let position = 0;
    	let textWidth;
    	let animationSpeed = 0.5;

    	onMount(() => {
    		$$invalidate(2, canWriteMOD = hasPermission($userRank, 'canWriteMOD'));

    		function scrollText() {
    			if (wrapper && wrapper.firstChild) {
    				textWidth = wrapper.firstChild.offsetWidth;
    			}

    			position -= animationSpeed;

    			if (-position >= textWidth) {
    				position = 0;
    			}

    			if (wrapper) {
    				// Check if wrapper is not null
    				$$invalidate(1, wrapper.style.transform = `translateX(${position}px)`, wrapper);
    			}

    			animationId = requestAnimationFrame(scrollText);
    		}

    		animationId = requestAnimationFrame(scrollText);
    	});

    	onDestroy(() => {
    		cancelAnimationFrame(animationId); // Cancel the animation when the component is destroyed
    	});

    	const updateMessage = () => {
    		if (newMessage.trim().length > 0) {
    			messageOfTheDay.set(newMessage);
    			$$invalidate(0, newMessage = "");
    		}
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<MessageOfTheDay> was created with unknown prop '${key}'`);
    	});

    	function div0_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			wrapper = $$value;
    			$$invalidate(1, wrapper);
    		});
    	}

    	function input_input_handler() {
    		newMessage = this.value;
    		$$invalidate(0, newMessage);
    	}

    	const keypress_handler = e => e.target.dataset.type === 'message' && e.key === 'Enter' && updateMessage();

    	$$self.$capture_state = () => ({
    		onMount,
    		onDestroy,
    		hasPermission,
    		userRank,
    		messageOfTheDay,
    		newMessage,
    		wrapper,
    		canWriteMOD,
    		animationId,
    		position,
    		textWidth,
    		animationSpeed,
    		updateMessage,
    		$userRank,
    		$messageOfTheDay
    	});

    	$$self.$inject_state = $$props => {
    		if ('newMessage' in $$props) $$invalidate(0, newMessage = $$props.newMessage);
    		if ('wrapper' in $$props) $$invalidate(1, wrapper = $$props.wrapper);
    		if ('canWriteMOD' in $$props) $$invalidate(2, canWriteMOD = $$props.canWriteMOD);
    		if ('animationId' in $$props) animationId = $$props.animationId;
    		if ('position' in $$props) position = $$props.position;
    		if ('textWidth' in $$props) textWidth = $$props.textWidth;
    		if ('animationSpeed' in $$props) animationSpeed = $$props.animationSpeed;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		newMessage,
    		wrapper,
    		canWriteMOD,
    		$messageOfTheDay,
    		updateMessage,
    		div0_binding,
    		input_input_handler,
    		keypress_handler
    	];
    }

    class MessageOfTheDay extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$p, create_fragment$p, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "MessageOfTheDay",
    			options,
    			id: create_fragment$p.name
    		});
    	}
    }

    /* src\components\Announcements.svelte generated by Svelte v3.59.2 */
    const file$o = "src\\components\\Announcements.svelte";

    function get_each_context$g(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[11] = list[i].id;
    	child_ctx[12] = list[i].message;
    	child_ctx[13] = list[i].date;
    	return child_ctx;
    }

    // (52:0) {#if canMakeAnnouncement}
    function create_if_block_1$a(ctx) {
    	let textarea;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			textarea = element("textarea");
    			attr_dev(textarea, "placeholder", "Type a new announcement...");
    			attr_dev(textarea, "class", "announcement-input svelte-123soxf");
    			add_location(textarea, file$o, 52, 2, 1468);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, textarea, anchor);
    			set_input_value(textarea, /*newAnnouncement*/ ctx[0]);

    			if (!mounted) {
    				dispose = [
    					listen_dev(textarea, "input", /*textarea_input_handler*/ ctx[6]),
    					listen_dev(textarea, "keydown", /*keydown_handler*/ ctx[7], false, false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*newAnnouncement*/ 1) {
    				set_input_value(textarea, /*newAnnouncement*/ ctx[0]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(textarea);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$a.name,
    		type: "if",
    		source: "(52:0) {#if canMakeAnnouncement}",
    		ctx
    	});

    	return block;
    }

    // (71:4) {#if canMakeAnnouncement && hoveredAnnouncementId === id}
    function create_if_block$h(ctx) {
    	let button;
    	let mounted;
    	let dispose;

    	function click_handler() {
    		return /*click_handler*/ ctx[8](/*id*/ ctx[11]);
    	}

    	const block = {
    		c: function create() {
    			button = element("button");
    			button.textContent = "X";
    			attr_dev(button, "class", "svelte-123soxf");
    			add_location(button, file$o, 71, 6, 2197);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", click_handler, false, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$h.name,
    		type: "if",
    		source: "(71:4) {#if canMakeAnnouncement && hoveredAnnouncementId === id}",
    		ctx
    	});

    	return block;
    }

    // (67:2) {#each $announcements as { id, message, date }
    function create_each_block$g(key_1, ctx) {
    	let li;
    	let pre;
    	let t0_value = /*message*/ ctx[12] + "";
    	let t0;
    	let t1;
    	let span;
    	let t2_value = formatToLocalDateTime(/*date*/ ctx[13]) + "";
    	let t2;
    	let t3;
    	let t4;
    	let mounted;
    	let dispose;
    	let if_block = /*canMakeAnnouncement*/ ctx[4] && /*hoveredAnnouncementId*/ ctx[1] === /*id*/ ctx[11] && create_if_block$h(ctx);

    	function mouseenter_handler() {
    		return /*mouseenter_handler*/ ctx[9](/*id*/ ctx[11]);
    	}

    	const block = {
    		key: key_1,
    		first: null,
    		c: function create() {
    			li = element("li");
    			pre = element("pre");
    			t0 = text(t0_value);
    			t1 = space();
    			span = element("span");
    			t2 = text(t2_value);
    			t3 = space();
    			if (if_block) if_block.c();
    			t4 = space();
    			attr_dev(pre, "class", "announcement-message svelte-123soxf");
    			add_location(pre, file$o, 68, 4, 2016);
    			attr_dev(span, "class", "date svelte-123soxf");
    			add_location(span, file$o, 69, 4, 2071);
    			attr_dev(li, "class", "svelte-123soxf");
    			add_location(li, file$o, 67, 2, 1906);
    			this.first = li;
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, pre);
    			append_dev(pre, t0);
    			append_dev(li, t1);
    			append_dev(li, span);
    			append_dev(span, t2);
    			append_dev(li, t3);
    			if (if_block) if_block.m(li, null);
    			append_dev(li, t4);

    			if (!mounted) {
    				dispose = [
    					listen_dev(li, "mouseenter", mouseenter_handler, false, false, false, false),
    					listen_dev(li, "mouseleave", /*mouseleave_handler*/ ctx[10], false, false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty & /*$announcements*/ 4 && t0_value !== (t0_value = /*message*/ ctx[12] + "")) set_data_dev(t0, t0_value);
    			if (dirty & /*$announcements*/ 4 && t2_value !== (t2_value = formatToLocalDateTime(/*date*/ ctx[13]) + "")) set_data_dev(t2, t2_value);

    			if (/*canMakeAnnouncement*/ ctx[4] && /*hoveredAnnouncementId*/ ctx[1] === /*id*/ ctx[11]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$h(ctx);
    					if_block.c();
    					if_block.m(li, t4);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    			if (if_block) if_block.d();
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$g.name,
    		type: "each",
    		source: "(67:2) {#each $announcements as { id, message, date }",
    		ctx
    	});

    	return block;
    }

    function create_fragment$o(ctx) {
    	let t;
    	let ul;
    	let each_blocks = [];
    	let each_1_lookup = new Map();
    	let if_block = /*canMakeAnnouncement*/ ctx[4] && create_if_block_1$a(ctx);
    	let each_value = /*$announcements*/ ctx[2];
    	validate_each_argument(each_value);
    	const get_key = ctx => /*id*/ ctx[11];
    	validate_each_keys(ctx, each_value, get_each_context$g, get_key);

    	for (let i = 0; i < each_value.length; i += 1) {
    		let child_ctx = get_each_context$g(ctx, each_value, i);
    		let key = get_key(child_ctx);
    		each_1_lookup.set(key, each_blocks[i] = create_each_block$g(key, child_ctx));
    	}

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			t = space();
    			ul = element("ul");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(ul, "class", "announcement-list svelte-123soxf");
    			add_location(ul, file$o, 65, 0, 1816);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, t, anchor);
    			insert_dev(target, ul, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				if (each_blocks[i]) {
    					each_blocks[i].m(ul, null);
    				}
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*canMakeAnnouncement*/ ctx[4]) if_block.p(ctx, dirty);

    			if (dirty & /*hoveredAnnouncementId, $announcements, removeAnnouncement, canMakeAnnouncement, formatToLocalDateTime*/ 22) {
    				each_value = /*$announcements*/ ctx[2];
    				validate_each_argument(each_value);
    				validate_each_keys(ctx, each_value, get_each_context$g, get_key);
    				each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value, each_1_lookup, ul, destroy_block, create_each_block$g, null, get_each_context$g);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(t);
    			if (detaching) detach_dev(ul);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].d();
    			}
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$o.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function fetchAnnouncements() {
    	fetch('https://syn_mdt/fetchAnnouncements', {
    		method: 'POST',
    		headers: { 'Content-Type': 'application/json' }
    	});
    }

    // Remove an announcement via NUI callback
    function removeAnnouncement(id) {
    	fetch('https://syn_mdt/removeAnnouncement', {
    		method: 'POST',
    		headers: { 'Content-Type': 'application/json' },
    		body: JSON.stringify({ id })
    	});
    }

    function instance$o($$self, $$props, $$invalidate) {
    	let $announcements;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Announcements', slots, []);
    	let announcements = writable([]);
    	validate_store(announcements, 'announcements');
    	component_subscribe($$self, announcements, value => $$invalidate(2, $announcements = value));
    	let newAnnouncement = '';
    	let canMakeAnnouncement = false;
    	let hoveredAnnouncementId = null;

    	onMount(() => {
    		fetchAnnouncements();
    	});

    	// Receive announcements from the client
    	window.addEventListener('message', event => {
    		if (event.data.action === 'receiveAnnouncements') {
    			announcements.set(event.data.data);
    		}
    	});

    	// Add a new announcement via NUI callback
    	function addAnnouncement() {
    		if (newAnnouncement.trim() !== '' && canMakeAnnouncement) {
    			fetch('https://syn_mdt/addAnnouncement', {
    				method: 'POST',
    				headers: { 'Content-Type': 'application/json' },
    				body: JSON.stringify({ message: newAnnouncement })
    			});

    			$$invalidate(0, newAnnouncement = '');
    		}
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Announcements> was created with unknown prop '${key}'`);
    	});

    	function textarea_input_handler() {
    		newAnnouncement = this.value;
    		$$invalidate(0, newAnnouncement);
    	}

    	const keydown_handler = e => {
    		if (e.key === 'Enter' && !e.shiftKey) {
    			e.preventDefault(); // Prevents the default action of the enter key
    			addAnnouncement();
    		}
    	};

    	const click_handler = id => removeAnnouncement(id);
    	const mouseenter_handler = id => $$invalidate(1, hoveredAnnouncementId = id);
    	const mouseleave_handler = () => $$invalidate(1, hoveredAnnouncementId = null);

    	$$self.$capture_state = () => ({
    		onMount,
    		writable,
    		announcements,
    		newAnnouncement,
    		canMakeAnnouncement,
    		hoveredAnnouncementId,
    		fetchAnnouncements,
    		addAnnouncement,
    		removeAnnouncement,
    		$announcements
    	});

    	$$self.$inject_state = $$props => {
    		if ('announcements' in $$props) $$invalidate(3, announcements = $$props.announcements);
    		if ('newAnnouncement' in $$props) $$invalidate(0, newAnnouncement = $$props.newAnnouncement);
    		if ('canMakeAnnouncement' in $$props) $$invalidate(4, canMakeAnnouncement = $$props.canMakeAnnouncement);
    		if ('hoveredAnnouncementId' in $$props) $$invalidate(1, hoveredAnnouncementId = $$props.hoveredAnnouncementId);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		newAnnouncement,
    		hoveredAnnouncementId,
    		$announcements,
    		announcements,
    		canMakeAnnouncement,
    		addAnnouncement,
    		textarea_input_handler,
    		keydown_handler,
    		click_handler,
    		mouseenter_handler,
    		mouseleave_handler
    	];
    }

    class Announcements extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$o, create_fragment$o, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Announcements",
    			options,
    			id: create_fragment$o.name
    		});
    	}
    }

    /* src\components\WantedPlayers.svelte generated by Svelte v3.59.2 */
    const file$n = "src\\components\\WantedPlayers.svelte";

    function get_each_context$f(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[7] = list[i].id;
    	child_ctx[8] = list[i].name;
    	return child_ctx;
    }

    // (45:12) {#if canRemoveFromList && hoveredId === id}
    function create_if_block$g(ctx) {
    	let button;
    	let mounted;
    	let dispose;

    	function click_handler() {
    		return /*click_handler*/ ctx[4](/*id*/ ctx[7]);
    	}

    	const block = {
    		c: function create() {
    			button = element("button");
    			button.textContent = "X";
    			attr_dev(button, "class", "svelte-a013ty");
    			add_location(button, file$n, 45, 14, 1534);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", click_handler, false, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$g.name,
    		type: "if",
    		source: "(45:12) {#if canRemoveFromList && hoveredId === id}",
    		ctx
    	});

    	return block;
    }

    // (41:6) {#each $localWantedList as { id, name }
    function create_each_block$f(key_1, ctx) {
    	let li;
    	let span1;
    	let span0;
    	let t0_value = /*name*/ ctx[8] + "";
    	let t0;
    	let t1;
    	let t2;
    	let mounted;
    	let dispose;
    	let if_block = /*canRemoveFromList*/ ctx[3] && /*hoveredId*/ ctx[0] === /*id*/ ctx[7] && create_if_block$g(ctx);

    	function mouseenter_handler() {
    		return /*mouseenter_handler*/ ctx[5](/*id*/ ctx[7]);
    	}

    	const block = {
    		key: key_1,
    		first: null,
    		c: function create() {
    			li = element("li");
    			span1 = element("span");
    			span0 = element("span");
    			t0 = text(t0_value);
    			t1 = space();
    			if (if_block) if_block.c();
    			t2 = space();
    			attr_dev(span0, "class", "name svelte-a013ty");
    			add_location(span0, file$n, 43, 12, 1308);
    			attr_dev(span1, "class", "name-button-container svelte-a013ty");
    			add_location(span1, file$n, 42, 10, 1258);
    			add_location(li, file$n, 41, 8, 1121);
    			this.first = li;
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, span1);
    			append_dev(span1, span0);
    			append_dev(span0, t0);
    			append_dev(span1, t1);
    			if (if_block) if_block.m(span1, null);
    			append_dev(li, t2);

    			if (!mounted) {
    				dispose = [
    					listen_dev(li, "mouseenter", mouseenter_handler, false, false, false, false),
    					listen_dev(li, "mouseleave", /*mouseleave_handler*/ ctx[6], false, false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty & /*$localWantedList*/ 2 && t0_value !== (t0_value = /*name*/ ctx[8] + "")) set_data_dev(t0, t0_value);

    			if (/*canRemoveFromList*/ ctx[3] && /*hoveredId*/ ctx[0] === /*id*/ ctx[7]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$g(ctx);
    					if_block.c();
    					if_block.m(span1, null);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    			if (if_block) if_block.d();
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$f.name,
    		type: "each",
    		source: "(41:6) {#each $localWantedList as { id, name }",
    		ctx
    	});

    	return block;
    }

    function create_fragment$n(ctx) {
    	let div1;
    	let label;
    	let t1;
    	let div0;
    	let ul;
    	let each_blocks = [];
    	let each_1_lookup = new Map();
    	let each_value = /*$localWantedList*/ ctx[1];
    	validate_each_argument(each_value);
    	const get_key = ctx => /*id*/ ctx[7];
    	validate_each_keys(ctx, each_value, get_each_context$f, get_key);

    	for (let i = 0; i < each_value.length; i += 1) {
    		let child_ctx = get_each_context$f(ctx, each_value, i);
    		let key = get_key(child_ctx);
    		each_1_lookup.set(key, each_blocks[i] = create_each_block$f(key, child_ctx));
    	}

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			label = element("label");
    			label.textContent = "Wanted List";
    			t1 = space();
    			div0 = element("div");
    			ul = element("ul");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(label, "class", "wanted-label svelte-a013ty");
    			add_location(label, file$n, 37, 2, 934);
    			attr_dev(ul, "class", "svelte-a013ty");
    			add_location(ul, file$n, 39, 4, 1013);
    			attr_dev(div0, "id", "wanted-list");
    			attr_dev(div0, "class", "svelte-a013ty");
    			add_location(div0, file$n, 38, 2, 985);
    			attr_dev(div1, "id", "wanted-list-container");
    			attr_dev(div1, "class", "svelte-a013ty");
    			add_location(div1, file$n, 36, 0, 898);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, label);
    			append_dev(div1, t1);
    			append_dev(div1, div0);
    			append_dev(div0, ul);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				if (each_blocks[i]) {
    					each_blocks[i].m(ul, null);
    				}
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*hoveredId, $localWantedList, removeFromList, canRemoveFromList*/ 11) {
    				each_value = /*$localWantedList*/ ctx[1];
    				validate_each_argument(each_value);
    				validate_each_keys(ctx, each_value, get_each_context$f, get_key);
    				each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value, each_1_lookup, ul, destroy_block, create_each_block$f, null, get_each_context$f);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].d();
    			}
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$n.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function fetchWantedPlayers() {
    	fetch('https://syn_mdt/fetchWantedPlayers', {
    		method: 'POST',
    		headers: { 'Content-Type': 'application/json' }
    	});
    }

    function removeFromList(id) {
    	fetch('https://syn_mdt/removeWantedPlayer', {
    		method: 'POST',
    		headers: { 'Content-Type': 'application/json' },
    		body: JSON.stringify({ id })
    	});
    }

    function instance$n($$self, $$props, $$invalidate) {
    	let $localWantedList;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('WantedPlayers', slots, []);
    	let localWantedList = writable([]);
    	validate_store(localWantedList, 'localWantedList');
    	component_subscribe($$self, localWantedList, value => $$invalidate(1, $localWantedList = value));
    	let canRemoveFromList = false;
    	let hoveredId = null;

    	onMount(() => {
    		fetchWantedPlayers();
    	});

    	// Receive wanted players
    	window.addEventListener('message', event => {
    		if (event.data.action === 'receiveWantedPlayers') {
    			localWantedList.set(event.data.data);
    		}
    	});

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<WantedPlayers> was created with unknown prop '${key}'`);
    	});

    	const click_handler = id => removeFromList(id);
    	const mouseenter_handler = id => $$invalidate(0, hoveredId = id);
    	const mouseleave_handler = () => $$invalidate(0, hoveredId = null);

    	$$self.$capture_state = () => ({
    		onMount,
    		writable,
    		localWantedList,
    		canRemoveFromList,
    		hoveredId,
    		fetchWantedPlayers,
    		removeFromList,
    		$localWantedList
    	});

    	$$self.$inject_state = $$props => {
    		if ('localWantedList' in $$props) $$invalidate(2, localWantedList = $$props.localWantedList);
    		if ('canRemoveFromList' in $$props) $$invalidate(3, canRemoveFromList = $$props.canRemoveFromList);
    		if ('hoveredId' in $$props) $$invalidate(0, hoveredId = $$props.hoveredId);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		hoveredId,
    		$localWantedList,
    		localWantedList,
    		canRemoveFromList,
    		click_handler,
    		mouseenter_handler,
    		mouseleave_handler
    	];
    }

    class WantedPlayers extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$n, create_fragment$n, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "WantedPlayers",
    			options,
    			id: create_fragment$n.name
    		});
    	}
    }

    /* src\components\OfficerStatus.svelte generated by Svelte v3.59.2 */
    const file$m = "src\\components\\OfficerStatus.svelte";

    function create_fragment$m(ctx) {
    	let p;
    	let span0;
    	let t1;
    	let t2_value = /*$onDutyOfficers*/ ctx[0].length + "";
    	let t2;
    	let t3;
    	let t4_value = /*$officers*/ ctx[1].length + "";
    	let t4;
    	let t5;
    	let span1;

    	const block = {
    		c: function create() {
    			p = element("p");
    			span0 = element("span");
    			span0.textContent = "🟢";
    			t1 = space();
    			t2 = text(t2_value);
    			t3 = text("/");
    			t4 = text(t4_value);
    			t5 = space();
    			span1 = element("span");
    			span1.textContent = "🟥";
    			attr_dev(span0, "class", "emoji svelte-a93u88");
    			add_location(span0, file$m, 40, 5, 1209);
    			attr_dev(span1, "class", "emoji svelte-a93u88");
    			add_location(span1, file$m, 40, 79, 1283);
    			attr_dev(p, "class", "svelte-a93u88");
    			add_location(p, file$m, 40, 2, 1206);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			append_dev(p, span0);
    			append_dev(p, t1);
    			append_dev(p, t2);
    			append_dev(p, t3);
    			append_dev(p, t4);
    			append_dev(p, t5);
    			append_dev(p, span1);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*$onDutyOfficers*/ 1 && t2_value !== (t2_value = /*$onDutyOfficers*/ ctx[0].length + "")) set_data_dev(t2, t2_value);
    			if (dirty & /*$officers*/ 2 && t4_value !== (t4_value = /*$officers*/ ctx[1].length + "")) set_data_dev(t4, t4_value);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$m.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function fetchOfficerStatus() {
    	fetch('https://syn_mdt/fetchOfficerStatus', {
    		method: 'POST',
    		headers: { 'Content-Type': 'application/json' }
    	});
    }

    // Toggle officer duty status via NUI callback
    function toggleDutyStatus(officerId) {
    	fetch('https://syn_mdt/toggleDutyStatus', {
    		method: 'POST',
    		headers: { 'Content-Type': 'application/json' },
    		body: JSON.stringify({ officerId })
    	});
    }

    function instance$m($$self, $$props, $$invalidate) {
    	let $onDutyOfficers;
    	let $officers;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('OfficerStatus', slots, []);
    	let officers = writable([]);
    	validate_store(officers, 'officers');
    	component_subscribe($$self, officers, value => $$invalidate(1, $officers = value));
    	let onDutyOfficers = derived(officers, $officers => $officers.filter(officer => officer.status === 'On Duty')); // Filter on-duty officers
    	validate_store(onDutyOfficers, 'onDutyOfficers');
    	component_subscribe($$self, onDutyOfficers, value => $$invalidate(0, $onDutyOfficers = value));
    	let searchQuery = '';

    	onMount(() => {
    		fetchOfficerStatus();
    	});

    	// Receive officer status updates
    	window.addEventListener('message', event => {
    		if (event.data.action === 'receiveOfficerStatus') {
    			officers.set(event.data.data);
    		}
    	});

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<OfficerStatus> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		onMount,
    		writable,
    		derived,
    		officers,
    		onDutyOfficers,
    		searchQuery,
    		fetchOfficerStatus,
    		toggleDutyStatus,
    		$onDutyOfficers,
    		$officers
    	});

    	$$self.$inject_state = $$props => {
    		if ('officers' in $$props) $$invalidate(2, officers = $$props.officers);
    		if ('onDutyOfficers' in $$props) $$invalidate(3, onDutyOfficers = $$props.onDutyOfficers);
    		if ('searchQuery' in $$props) searchQuery = $$props.searchQuery;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [$onDutyOfficers, $officers, officers, onDutyOfficers];
    }

    class OfficerStatus extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$m, create_fragment$m, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "OfficerStatus",
    			options,
    			id: create_fragment$m.name
    		});
    	}
    }

    /* src\Dashboard\Dashboard.svelte generated by Svelte v3.59.2 */
    const file$l = "src\\Dashboard\\Dashboard.svelte";

    function create_fragment$l(ctx) {
    	let messageoftheday;
    	let t0;
    	let div;
    	let wantedplayers;
    	let t1;
    	let officerstatus;
    	let t2;
    	let announcements;
    	let current;
    	messageoftheday = new MessageOfTheDay({ $$inline: true });
    	wantedplayers = new WantedPlayers({ $$inline: true });
    	officerstatus = new OfficerStatus({ $$inline: true });
    	announcements = new Announcements({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(messageoftheday.$$.fragment);
    			t0 = space();
    			div = element("div");
    			create_component(wantedplayers.$$.fragment);
    			t1 = space();
    			create_component(officerstatus.$$.fragment);
    			t2 = space();
    			create_component(announcements.$$.fragment);
    			attr_dev(div, "class", "status-container svelte-h3vi87");
    			add_location(div, file$l, 10, 2, 418);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(messageoftheday, target, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, div, anchor);
    			mount_component(wantedplayers, div, null);
    			append_dev(div, t1);
    			mount_component(officerstatus, div, null);
    			insert_dev(target, t2, anchor);
    			mount_component(announcements, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(messageoftheday.$$.fragment, local);
    			transition_in(wantedplayers.$$.fragment, local);
    			transition_in(officerstatus.$$.fragment, local);
    			transition_in(announcements.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(messageoftheday.$$.fragment, local);
    			transition_out(wantedplayers.$$.fragment, local);
    			transition_out(officerstatus.$$.fragment, local);
    			transition_out(announcements.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(messageoftheday, detaching);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(div);
    			destroy_component(wantedplayers);
    			destroy_component(officerstatus);
    			if (detaching) detach_dev(t2);
    			destroy_component(announcements, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$l.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$l($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Dashboard', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Dashboard> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		userRank,
    		Layout,
    		MessageOfTheDay,
    		Announcements,
    		WantedPlayers,
    		OfficerStatus
    	});

    	return [];
    }

    class Dashboard extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$l, create_fragment$l, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Dashboard",
    			options,
    			id: create_fragment$l.name
    		});
    	}
    }

    /* src\Dashboard\ServerLaws.svelte generated by Svelte v3.59.2 */
    const file$k = "src\\Dashboard\\ServerLaws.svelte";

    // (87:2) {:else}
    function create_else_block_1$3(ctx) {
    	let p;
    	let t;

    	const block = {
    		c: function create() {
    			p = element("p");
    			t = text(/*editedLawsData*/ ctx[1]);
    			add_location(p, file$k, 87, 4, 2193);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			append_dev(p, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*editedLawsData*/ 2) set_data_dev(t, /*editedLawsData*/ ctx[1]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_1$3.name,
    		type: "else",
    		source: "(87:2) {:else}",
    		ctx
    	});

    	return block;
    }

    // (85:2) {#if isEditing}
    function create_if_block_2$5(ctx) {
    	let textarea;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			textarea = element("textarea");
    			attr_dev(textarea, "class", "textarea svelte-1uqunrx");
    			add_location(textarea, file$k, 85, 4, 2110);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, textarea, anchor);
    			set_input_value(textarea, /*editedLawsData*/ ctx[1]);

    			if (!mounted) {
    				dispose = listen_dev(textarea, "input", /*textarea_input_handler*/ ctx[5]);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*editedLawsData*/ 2) {
    				set_input_value(textarea, /*editedLawsData*/ ctx[1]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(textarea);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$5.name,
    		type: "if",
    		source: "(85:2) {#if isEditing}",
    		ctx
    	});

    	return block;
    }

    // (92:0) {#if canEditLaws}
    function create_if_block$f(ctx) {
    	let div;

    	function select_block_type_1(ctx, dirty) {
    		if (/*isEditing*/ ctx[0]) return create_if_block_1$9;
    		return create_else_block$9;
    	}

    	let current_block_type = select_block_type_1(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if_block.c();
    			attr_dev(div, "class", "button-container");
    			add_location(div, file$k, 92, 2, 2258);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			if_block.m(div, null);
    		},
    		p: function update(ctx, dirty) {
    			if (current_block_type === (current_block_type = select_block_type_1(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(div, null);
    				}
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$f.name,
    		type: "if",
    		source: "(92:0) {#if canEditLaws}",
    		ctx
    	});

    	return block;
    }

    // (97:4) {:else}
    function create_else_block$9(ctx) {
    	let button;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			button.textContent = "Edit Laws";
    			attr_dev(button, "class", "save-button svelte-1uqunrx");
    			add_location(button, file$k, 97, 6, 2488);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*toggleEdit*/ ctx[3], false, false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$9.name,
    		type: "else",
    		source: "(97:4) {:else}",
    		ctx
    	});

    	return block;
    }

    // (94:4) {#if isEditing}
    function create_if_block_1$9(ctx) {
    	let button0;
    	let t1;
    	let button1;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			button0 = element("button");
    			button0.textContent = "Save Changes";
    			t1 = space();
    			button1 = element("button");
    			button1.textContent = "Cancel Edit";
    			attr_dev(button0, "class", "save-button svelte-1uqunrx");
    			add_location(button0, file$k, 94, 6, 2317);
    			attr_dev(button1, "class", "save-button svelte-1uqunrx");
    			add_location(button1, file$k, 95, 6, 2397);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button0, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, button1, anchor);

    			if (!mounted) {
    				dispose = [
    					listen_dev(button0, "click", /*saveChanges*/ ctx[4], false, false, false, false),
    					listen_dev(button1, "click", /*toggleEdit*/ ctx[3], false, false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button0);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(button1);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$9.name,
    		type: "if",
    		source: "(94:4) {#if isEditing}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$k(ctx) {
    	let div;
    	let t;
    	let if_block1_anchor;

    	function select_block_type(ctx, dirty) {
    		if (/*isEditing*/ ctx[0]) return create_if_block_2$5;
    		return create_else_block_1$3;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block0 = current_block_type(ctx);
    	let if_block1 = /*canEditLaws*/ ctx[2] && create_if_block$f(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if_block0.c();
    			t = space();
    			if (if_block1) if_block1.c();
    			if_block1_anchor = empty();
    			attr_dev(div, "class", "laws-container svelte-1uqunrx");
    			add_location(div, file$k, 83, 0, 2057);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			if_block0.m(div, null);
    			insert_dev(target, t, anchor);
    			if (if_block1) if_block1.m(target, anchor);
    			insert_dev(target, if_block1_anchor, anchor);
    		},
    		p: function update(ctx, [dirty]) {
    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block0) {
    				if_block0.p(ctx, dirty);
    			} else {
    				if_block0.d(1);
    				if_block0 = current_block_type(ctx);

    				if (if_block0) {
    					if_block0.c();
    					if_block0.m(div, null);
    				}
    			}

    			if (/*canEditLaws*/ ctx[2]) if_block1.p(ctx, dirty);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if_block0.d();
    			if (detaching) detach_dev(t);
    			if (if_block1) if_block1.d(detaching);
    			if (detaching) detach_dev(if_block1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$k.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function fetchLaws() {
    	fetch('https://syn_mdt/fetchLaws', {
    		method: 'POST',
    		headers: { 'Content-Type': 'application/json' }
    	});
    }

    function instance$k($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('ServerLaws', slots, []);
    	let lawsData = [];
    	let canEditLaws = false;
    	let isEditing = false;
    	let editedLawsData = [];

    	onMount(() => {
    		fetchLaws();
    	});

    	// Receive laws from the client
    	window.addEventListener('message', event => {
    		if (event.data.action === 'receiveLaws') {
    			lawsData = event.data.data;
    			$$invalidate(1, editedLawsData = [...lawsData]);
    		}
    	});

    	function toggleEdit() {
    		$$invalidate(0, isEditing = !isEditing);
    	}

    	function saveChanges() {
    		fetch('https://syn_mdt/saveLaws', {
    			method: 'POST',
    			headers: { 'Content-Type': 'application/json' },
    			body: JSON.stringify({ laws: editedLawsData })
    		});

    		$$invalidate(0, isEditing = false);
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<ServerLaws> was created with unknown prop '${key}'`);
    	});

    	function textarea_input_handler() {
    		editedLawsData = this.value;
    		$$invalidate(1, editedLawsData);
    	}

    	$$self.$capture_state = () => ({
    		onMount,
    		lawsData,
    		canEditLaws,
    		isEditing,
    		editedLawsData,
    		fetchLaws,
    		toggleEdit,
    		saveChanges
    	});

    	$$self.$inject_state = $$props => {
    		if ('lawsData' in $$props) lawsData = $$props.lawsData;
    		if ('canEditLaws' in $$props) $$invalidate(2, canEditLaws = $$props.canEditLaws);
    		if ('isEditing' in $$props) $$invalidate(0, isEditing = $$props.isEditing);
    		if ('editedLawsData' in $$props) $$invalidate(1, editedLawsData = $$props.editedLawsData);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		isEditing,
    		editedLawsData,
    		canEditLaws,
    		toggleEdit,
    		saveChanges,
    		textarea_input_handler
    	];
    }

    class ServerLaws extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$k, create_fragment$k, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ServerLaws",
    			options,
    			id: create_fragment$k.name
    		});
    	}
    }

    /* src\Dashboard\PoliceRoster.svelte generated by Svelte v3.59.2 */

    const { console: console_1$e } = globals;
    const file$j = "src\\Dashboard\\PoliceRoster.svelte";

    function get_each_context$e(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[16] = list[i];
    	return child_ctx;
    }

    // (184:8) {#each $filteredRoster as officer}
    function create_each_block$e(ctx) {
    	let tr;
    	let td0;
    	let a;
    	let t0_value = /*officer*/ ctx[16].name + "";
    	let t0;
    	let t1;
    	let td1;
    	let t2_value = /*officer*/ ctx[16].id + "";
    	let t2;
    	let t3;
    	let td2;
    	let t4_value = /*officer*/ ctx[16].po + "";
    	let t4;
    	let t5;
    	let td3;
    	let t6_value = /*officer*/ ctx[16].rank + "";
    	let t6;
    	let t7;
    	let td4;
    	let t8_value = /*officer*/ ctx[16].status + "";
    	let t8;
    	let t9;
    	let mounted;
    	let dispose;

    	function click_handler_5() {
    		return /*click_handler_5*/ ctx[14](/*officer*/ ctx[16]);
    	}

    	const block = {
    		c: function create() {
    			tr = element("tr");
    			td0 = element("td");
    			a = element("a");
    			t0 = text(t0_value);
    			t1 = space();
    			td1 = element("td");
    			t2 = text(t2_value);
    			t3 = space();
    			td2 = element("td");
    			t4 = text(t4_value);
    			t5 = space();
    			td3 = element("td");
    			t6 = text(t6_value);
    			t7 = space();
    			td4 = element("td");
    			t8 = text(t8_value);
    			t9 = space();
    			attr_dev(a, "href", "javascript:void(0);");
    			attr_dev(a, "class", "svelte-12lmkvj");
    			add_location(a, file$j, 185, 16, 6351);
    			attr_dev(td0, "class", "svelte-12lmkvj");
    			add_location(td0, file$j, 185, 12, 6347);
    			attr_dev(td1, "class", "svelte-12lmkvj");
    			add_location(td1, file$j, 186, 12, 6465);
    			attr_dev(td2, "class", "svelte-12lmkvj");
    			add_location(td2, file$j, 187, 12, 6500);
    			attr_dev(td3, "class", "svelte-12lmkvj");
    			add_location(td3, file$j, 188, 12, 6535);
    			attr_dev(td4, "class", "svelte-12lmkvj");
    			add_location(td4, file$j, 189, 12, 6572);
    			attr_dev(tr, "class", "svelte-12lmkvj");
    			add_location(tr, file$j, 184, 10, 6329);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, tr, anchor);
    			append_dev(tr, td0);
    			append_dev(td0, a);
    			append_dev(a, t0);
    			append_dev(tr, t1);
    			append_dev(tr, td1);
    			append_dev(td1, t2);
    			append_dev(tr, t3);
    			append_dev(tr, td2);
    			append_dev(td2, t4);
    			append_dev(tr, t5);
    			append_dev(tr, td3);
    			append_dev(td3, t6);
    			append_dev(tr, t7);
    			append_dev(tr, td4);
    			append_dev(td4, t8);
    			append_dev(tr, t9);

    			if (!mounted) {
    				dispose = listen_dev(a, "click", click_handler_5, false, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty & /*$filteredRoster*/ 8 && t0_value !== (t0_value = /*officer*/ ctx[16].name + "")) set_data_dev(t0, t0_value);
    			if (dirty & /*$filteredRoster*/ 8 && t2_value !== (t2_value = /*officer*/ ctx[16].id + "")) set_data_dev(t2, t2_value);
    			if (dirty & /*$filteredRoster*/ 8 && t4_value !== (t4_value = /*officer*/ ctx[16].po + "")) set_data_dev(t4, t4_value);
    			if (dirty & /*$filteredRoster*/ 8 && t6_value !== (t6_value = /*officer*/ ctx[16].rank + "")) set_data_dev(t6, t6_value);
    			if (dirty & /*$filteredRoster*/ 8 && t8_value !== (t8_value = /*officer*/ ctx[16].status + "")) set_data_dev(t8, t8_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(tr);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$e.name,
    		type: "each",
    		source: "(184:8) {#each $filteredRoster as officer}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$j(ctx) {
    	let div0;
    	let input;
    	let t0;
    	let div2;
    	let table0;
    	let thead;
    	let tr;
    	let th0;
    	let t2;
    	let th1;
    	let t4;
    	let th2;
    	let t6;
    	let th3;
    	let t8;
    	let th4;
    	let t10;
    	let div1;
    	let table1;
    	let tbody;
    	let mounted;
    	let dispose;
    	let each_value = /*$filteredRoster*/ ctx[3];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$e(get_each_context$e(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div0 = element("div");
    			input = element("input");
    			t0 = space();
    			div2 = element("div");
    			table0 = element("table");
    			thead = element("thead");
    			tr = element("tr");
    			th0 = element("th");
    			th0.textContent = "Name";
    			t2 = space();
    			th1 = element("th");
    			th1.textContent = "ID";
    			t4 = space();
    			th2 = element("th");
    			th2.textContent = "PO";
    			t6 = space();
    			th3 = element("th");
    			th3.textContent = "Rank";
    			t8 = space();
    			th4 = element("th");
    			th4.textContent = "Status";
    			t10 = space();
    			div1 = element("div");
    			table1 = element("table");
    			tbody = element("tbody");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(input, "type", "text");
    			attr_dev(input, "placeholder", "Search Roster...");
    			attr_dev(input, "class", "svelte-12lmkvj");
    			add_location(input, file$j, 141, 2, 4327);
    			attr_dev(div0, "class", "search-container svelte-12lmkvj");
    			add_location(div0, file$j, 140, 0, 4293);
    			attr_dev(th0, "class", "svelte-12lmkvj");
    			toggle_class(th0, "sorted-ascending", /*sortColumn*/ ctx[1] === 'name' && /*sortOrder*/ ctx[0] === 'ascending');
    			toggle_class(th0, "sorted-descending", /*sortColumn*/ ctx[1] === 'name' && /*sortOrder*/ ctx[0] === 'descending');
    			toggle_class(th0, "sorted-none", /*sortColumn*/ ctx[1] !== 'name' || /*sortOrder*/ ctx[0] === 'none');
    			add_location(th0, file$j, 147, 8, 4488);
    			attr_dev(th1, "class", "svelte-12lmkvj");
    			toggle_class(th1, "sorted-ascending", /*sortColumn*/ ctx[1] === 'id' && /*sortOrder*/ ctx[0] === 'ascending');
    			toggle_class(th1, "sorted-descending", /*sortColumn*/ ctx[1] === 'id' && /*sortOrder*/ ctx[0] === 'descending');
    			toggle_class(th1, "sorted-none", /*sortColumn*/ ctx[1] !== 'id' || /*sortOrder*/ ctx[0] === 'none');
    			add_location(th1, file$j, 153, 8, 4828);
    			attr_dev(th2, "class", "svelte-12lmkvj");
    			toggle_class(th2, "sorted-ascending", /*sortColumn*/ ctx[1] === 'po' && /*sortOrder*/ ctx[0] === 'ascending');
    			toggle_class(th2, "sorted-descending", /*sortColumn*/ ctx[1] === 'po' && /*sortOrder*/ ctx[0] === 'descending');
    			toggle_class(th2, "sorted-none", /*sortColumn*/ ctx[1] !== 'po' || /*sortOrder*/ ctx[0] === 'none');
    			add_location(th2, file$j, 159, 8, 5158);
    			attr_dev(th3, "class", "svelte-12lmkvj");
    			toggle_class(th3, "sorted-ascending", /*sortColumn*/ ctx[1] === 'rank' && /*sortOrder*/ ctx[0] === 'ascending');
    			toggle_class(th3, "sorted-descending", /*sortColumn*/ ctx[1] === 'rank' && /*sortOrder*/ ctx[0] === 'descending');
    			toggle_class(th3, "sorted-none", /*sortColumn*/ ctx[1] !== 'rank' || /*sortOrder*/ ctx[0] === 'none');
    			add_location(th3, file$j, 165, 8, 5488);
    			attr_dev(th4, "class", "svelte-12lmkvj");
    			toggle_class(th4, "sorted-ascending", /*sortColumn*/ ctx[1] === 'status' && /*sortOrder*/ ctx[0] === 'ascending');
    			toggle_class(th4, "sorted-descending", /*sortColumn*/ ctx[1] === 'status' && /*sortOrder*/ ctx[0] === 'descending');
    			toggle_class(th4, "sorted-none", /*sortColumn*/ ctx[1] !== 'status' || /*sortOrder*/ ctx[0] === 'none');
    			add_location(th4, file$j, 171, 8, 5828);
    			add_location(tr, file$j, 146, 6, 4474);
    			add_location(thead, file$j, 145, 4, 4459);
    			attr_dev(table0, "class", "svelte-12lmkvj");
    			add_location(table0, file$j, 144, 2, 4446);
    			attr_dev(tbody, "class", "svelte-12lmkvj");
    			add_location(tbody, file$j, 182, 6, 6266);
    			attr_dev(table1, "class", "svelte-12lmkvj");
    			add_location(table1, file$j, 181, 4, 6251);
    			attr_dev(div1, "class", "tbody-scroll svelte-12lmkvj");
    			add_location(div1, file$j, 180, 2, 6219);
    			attr_dev(div2, "class", "table-container svelte-12lmkvj");
    			add_location(div2, file$j, 143, 0, 4413);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div0, anchor);
    			append_dev(div0, input);
    			set_input_value(input, /*$searchQuery*/ ctx[2]);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, div2, anchor);
    			append_dev(div2, table0);
    			append_dev(table0, thead);
    			append_dev(thead, tr);
    			append_dev(tr, th0);
    			append_dev(tr, t2);
    			append_dev(tr, th1);
    			append_dev(tr, t4);
    			append_dev(tr, th2);
    			append_dev(tr, t6);
    			append_dev(tr, th3);
    			append_dev(tr, t8);
    			append_dev(tr, th4);
    			append_dev(div2, t10);
    			append_dev(div2, div1);
    			append_dev(div1, table1);
    			append_dev(table1, tbody);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				if (each_blocks[i]) {
    					each_blocks[i].m(tbody, null);
    				}
    			}

    			if (!mounted) {
    				dispose = [
    					listen_dev(input, "input", /*input_input_handler*/ ctx[8]),
    					listen_dev(th0, "click", /*click_handler*/ ctx[9], false, false, false, false),
    					listen_dev(th1, "click", /*click_handler_1*/ ctx[10], false, false, false, false),
    					listen_dev(th2, "click", /*click_handler_2*/ ctx[11], false, false, false, false),
    					listen_dev(th3, "click", /*click_handler_3*/ ctx[12], false, false, false, false),
    					listen_dev(th4, "click", /*click_handler_4*/ ctx[13], false, false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*$searchQuery*/ 4 && input.value !== /*$searchQuery*/ ctx[2]) {
    				set_input_value(input, /*$searchQuery*/ ctx[2]);
    			}

    			if (dirty & /*sortColumn, sortOrder*/ 3) {
    				toggle_class(th0, "sorted-ascending", /*sortColumn*/ ctx[1] === 'name' && /*sortOrder*/ ctx[0] === 'ascending');
    			}

    			if (dirty & /*sortColumn, sortOrder*/ 3) {
    				toggle_class(th0, "sorted-descending", /*sortColumn*/ ctx[1] === 'name' && /*sortOrder*/ ctx[0] === 'descending');
    			}

    			if (dirty & /*sortColumn, sortOrder*/ 3) {
    				toggle_class(th0, "sorted-none", /*sortColumn*/ ctx[1] !== 'name' || /*sortOrder*/ ctx[0] === 'none');
    			}

    			if (dirty & /*sortColumn, sortOrder*/ 3) {
    				toggle_class(th1, "sorted-ascending", /*sortColumn*/ ctx[1] === 'id' && /*sortOrder*/ ctx[0] === 'ascending');
    			}

    			if (dirty & /*sortColumn, sortOrder*/ 3) {
    				toggle_class(th1, "sorted-descending", /*sortColumn*/ ctx[1] === 'id' && /*sortOrder*/ ctx[0] === 'descending');
    			}

    			if (dirty & /*sortColumn, sortOrder*/ 3) {
    				toggle_class(th1, "sorted-none", /*sortColumn*/ ctx[1] !== 'id' || /*sortOrder*/ ctx[0] === 'none');
    			}

    			if (dirty & /*sortColumn, sortOrder*/ 3) {
    				toggle_class(th2, "sorted-ascending", /*sortColumn*/ ctx[1] === 'po' && /*sortOrder*/ ctx[0] === 'ascending');
    			}

    			if (dirty & /*sortColumn, sortOrder*/ 3) {
    				toggle_class(th2, "sorted-descending", /*sortColumn*/ ctx[1] === 'po' && /*sortOrder*/ ctx[0] === 'descending');
    			}

    			if (dirty & /*sortColumn, sortOrder*/ 3) {
    				toggle_class(th2, "sorted-none", /*sortColumn*/ ctx[1] !== 'po' || /*sortOrder*/ ctx[0] === 'none');
    			}

    			if (dirty & /*sortColumn, sortOrder*/ 3) {
    				toggle_class(th3, "sorted-ascending", /*sortColumn*/ ctx[1] === 'rank' && /*sortOrder*/ ctx[0] === 'ascending');
    			}

    			if (dirty & /*sortColumn, sortOrder*/ 3) {
    				toggle_class(th3, "sorted-descending", /*sortColumn*/ ctx[1] === 'rank' && /*sortOrder*/ ctx[0] === 'descending');
    			}

    			if (dirty & /*sortColumn, sortOrder*/ 3) {
    				toggle_class(th3, "sorted-none", /*sortColumn*/ ctx[1] !== 'rank' || /*sortOrder*/ ctx[0] === 'none');
    			}

    			if (dirty & /*sortColumn, sortOrder*/ 3) {
    				toggle_class(th4, "sorted-ascending", /*sortColumn*/ ctx[1] === 'status' && /*sortOrder*/ ctx[0] === 'ascending');
    			}

    			if (dirty & /*sortColumn, sortOrder*/ 3) {
    				toggle_class(th4, "sorted-descending", /*sortColumn*/ ctx[1] === 'status' && /*sortOrder*/ ctx[0] === 'descending');
    			}

    			if (dirty & /*sortColumn, sortOrder*/ 3) {
    				toggle_class(th4, "sorted-none", /*sortColumn*/ ctx[1] !== 'status' || /*sortOrder*/ ctx[0] === 'none');
    			}

    			if (dirty & /*$filteredRoster, navigateToProfile*/ 40) {
    				each_value = /*$filteredRoster*/ ctx[3];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$e(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$e(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(tbody, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div0);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(div2);
    			destroy_each(each_blocks, detaching);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$j.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$j($$self, $$props, $$invalidate) {
    	let $searchQuery;
    	let $filteredRoster;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('PoliceRoster', slots, []);
    	const policeRoster = writable(dummyPoliceRoster);
    	let sortOrder = 'none'; // Start with no sorting
    	let sortColumn = null; // No column is sorted by default
    	const searchQuery = writable(''); // Now a writable store
    	validate_store(searchQuery, 'searchQuery');
    	component_subscribe($$self, searchQuery, value => $$invalidate(2, $searchQuery = value));

    	function navigateToProfile(officerId) {
    		console.log('Navigating to profile for officer ID:', officerId);
    		push(`/rosterProfiles/${officerId}`);
    	}

    	const filteredRoster = derived([policeRoster, searchQuery], ([$policeRoster, $searchQuery]) => {
    		return $policeRoster.filter(officer => {
    			return officer.name.toLowerCase().includes($searchQuery.toLowerCase()) || officer.id.toString().includes($searchQuery) || officer.po.toString().includes($searchQuery) || officer.rank.toString().includes($searchQuery) || officer.status.toLowerCase().includes($searchQuery.toLowerCase());
    		});
    	});

    	validate_store(filteredRoster, 'filteredRoster');
    	component_subscribe($$self, filteredRoster, value => $$invalidate(3, $filteredRoster = value));

    	function handleSort(column) {
    		console.log(`Previous sort order: ${sortOrder}, column: ${sortColumn}`);

    		if (sortColumn === column) {
    			// If the same column was already sorted, change the order
    			if (sortOrder === 'ascending') $$invalidate(0, sortOrder = 'descending'); else if (sortOrder === 'descending') $$invalidate(0, sortOrder = 'none'); else if (sortOrder === 'none') $$invalidate(0, sortOrder = 'ascending');
    		} else {
    			// If a different column is clicked, start with ascending
    			$$invalidate(1, sortColumn = column);

    			$$invalidate(0, sortOrder = 'ascending');
    		}

    		if (sortOrder === 'none') {
    			$$invalidate(1, sortColumn = null);
    			policeRoster.set([...dummyPoliceRoster]); // Reset to the original roster
    		} else {
    			policeRoster.update(currentRoster => {
    				return sortList([...currentRoster], sortColumn, sortOrder);
    			});
    		}
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$e.warn(`<PoliceRoster> was created with unknown prop '${key}'`);
    	});

    	function input_input_handler() {
    		$searchQuery = this.value;
    		searchQuery.set($searchQuery);
    	}

    	const click_handler = () => handleSort('name');
    	const click_handler_1 = () => handleSort('id');
    	const click_handler_2 = () => handleSort('po');
    	const click_handler_3 = () => handleSort('rank');
    	const click_handler_4 = () => handleSort('status');
    	const click_handler_5 = officer => navigateToProfile(officer.id);

    	$$self.$capture_state = () => ({
    		push,
    		writable,
    		derived,
    		dummyPoliceRoster,
    		sortList,
    		policeRoster,
    		sortOrder,
    		sortColumn,
    		searchQuery,
    		navigateToProfile,
    		filteredRoster,
    		handleSort,
    		$searchQuery,
    		$filteredRoster
    	});

    	$$self.$inject_state = $$props => {
    		if ('sortOrder' in $$props) $$invalidate(0, sortOrder = $$props.sortOrder);
    		if ('sortColumn' in $$props) $$invalidate(1, sortColumn = $$props.sortColumn);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		sortOrder,
    		sortColumn,
    		$searchQuery,
    		$filteredRoster,
    		searchQuery,
    		navigateToProfile,
    		filteredRoster,
    		handleSort,
    		input_input_handler,
    		click_handler,
    		click_handler_1,
    		click_handler_2,
    		click_handler_3,
    		click_handler_4,
    		click_handler_5
    	];
    }

    class PoliceRoster extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$j, create_fragment$j, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "PoliceRoster",
    			options,
    			id: create_fragment$j.name
    		});
    	}
    }

    /* src\PlayerProfiles\rosterProfiles.svelte generated by Svelte v3.59.2 */

    const { console: console_1$d } = globals;
    const file$i = "src\\PlayerProfiles\\rosterProfiles.svelte";

    // (103:0) {:else}
    function create_else_block$8(ctx) {
    	let p;

    	const block = {
    		c: function create() {
    			p = element("p");
    			p.textContent = "Loading profile...";
    			attr_dev(p, "class", "svelte-1p1063f");
    			add_location(p, file$i, 103, 0, 3356);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$8.name,
    		type: "else",
    		source: "(103:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (31:0) {#if $profile && $profile.id}
    function create_if_block$e(ctx) {
    	let div13;
    	let div0;
    	let label0;
    	let t1;
    	let p0;
    	let t2_value = /*$profile*/ ctx[1].name + "";
    	let t2;
    	let t3;
    	let div1;
    	let label1;
    	let t5;
    	let p1;
    	let t6_value = /*$profile*/ ctx[1].id + "";
    	let t6;
    	let t7;
    	let div2;
    	let label2;
    	let t9;
    	let p2;
    	let t10_value = /*$profile*/ ctx[1].lastactive + "";
    	let t10;
    	let t11;
    	let div3;
    	let label3;
    	let t13;
    	let p3;
    	let t14_value = /*$profile*/ ctx[1].po + "";
    	let t14;
    	let t15;
    	let div4;
    	let label4;
    	let t17;
    	let p4;
    	let t18_value = /*$profile*/ ctx[1].totalduty + "";
    	let t18;
    	let t19;
    	let div5;
    	let label5;
    	let t21;
    	let input0;
    	let input0_disabled_value;
    	let t22;
    	let div6;
    	let label6;
    	let t24;
    	let input1;
    	let input1_disabled_value;
    	let t25;
    	let div7;
    	let label7;
    	let t27;
    	let input2;
    	let input2_disabled_value;
    	let t28;
    	let div8;
    	let label8;
    	let t30;
    	let p5;
    	let t31_value = /*$profile*/ ctx[1].totalReports + "";
    	let t31;
    	let t32;
    	let div9;
    	let label9;
    	let t34;
    	let textarea0;
    	let textarea0_disabled_value;
    	let t35;
    	let div10;
    	let label10;
    	let t37;
    	let textarea1;
    	let textarea1_disabled_value;
    	let t38;
    	let div11;
    	let label11;
    	let t40;
    	let textarea2;
    	let textarea2_disabled_value;
    	let t41;
    	let div12;
    	let label12;
    	let t43;
    	let textarea3;
    	let textarea3_disabled_value;
    	let t44;
    	let mounted;
    	let dispose;
    	let if_block = /*canEdit*/ ctx[0] && create_if_block_1$8(ctx);

    	const block = {
    		c: function create() {
    			div13 = element("div");
    			div0 = element("div");
    			label0 = element("label");
    			label0.textContent = "Name:";
    			t1 = space();
    			p0 = element("p");
    			t2 = text(t2_value);
    			t3 = space();
    			div1 = element("div");
    			label1 = element("label");
    			label1.textContent = "ID:";
    			t5 = space();
    			p1 = element("p");
    			t6 = text(t6_value);
    			t7 = space();
    			div2 = element("div");
    			label2 = element("label");
    			label2.textContent = "Last Clock-in:";
    			t9 = space();
    			p2 = element("p");
    			t10 = text(t10_value);
    			t11 = space();
    			div3 = element("div");
    			label3 = element("label");
    			label3.textContent = "PO:";
    			t13 = space();
    			p3 = element("p");
    			t14 = text(t14_value);
    			t15 = space();
    			div4 = element("div");
    			label4 = element("label");
    			label4.textContent = "Duty Hours:";
    			t17 = space();
    			p4 = element("p");
    			t18 = text(t18_value);
    			t19 = space();
    			div5 = element("div");
    			label5 = element("label");
    			label5.textContent = "Discord:";
    			t21 = space();
    			input0 = element("input");
    			t22 = space();
    			div6 = element("div");
    			label6 = element("label");
    			label6.textContent = "region:";
    			t24 = space();
    			input1 = element("input");
    			t25 = space();
    			div7 = element("div");
    			label7 = element("label");
    			label7.textContent = "Timezone:";
    			t27 = space();
    			input2 = element("input");
    			t28 = space();
    			div8 = element("div");
    			label8 = element("label");
    			label8.textContent = "Total Reports:";
    			t30 = space();
    			p5 = element("p");
    			t31 = text(t31_value);
    			t32 = space();
    			div9 = element("div");
    			label9 = element("label");
    			label9.textContent = "Training:";
    			t34 = space();
    			textarea0 = element("textarea");
    			t35 = space();
    			div10 = element("div");
    			label10 = element("label");
    			label10.textContent = "Disciplinaries:";
    			t37 = space();
    			textarea1 = element("textarea");
    			t38 = space();
    			div11 = element("div");
    			label11 = element("label");
    			label11.textContent = "Achievements:";
    			t40 = space();
    			textarea2 = element("textarea");
    			t41 = space();
    			div12 = element("div");
    			label12 = element("label");
    			label12.textContent = "Notes:";
    			t43 = space();
    			textarea3 = element("textarea");
    			t44 = space();
    			if (if_block) if_block.c();
    			add_location(label0, file$i, 34, 4, 1249);
    			attr_dev(p0, "class", "svelte-1p1063f");
    			add_location(p0, file$i, 35, 4, 1275);
    			attr_dev(div0, "class", "view-group single-column svelte-1p1063f");
    			add_location(div0, file$i, 33, 2, 1205);
    			add_location(label1, file$i, 39, 4, 1357);
    			attr_dev(p1, "class", "svelte-1p1063f");
    			add_location(p1, file$i, 40, 4, 1381);
    			attr_dev(div1, "class", "view-group single-column svelte-1p1063f");
    			add_location(div1, file$i, 38, 2, 1313);
    			add_location(label2, file$i, 44, 4, 1461);
    			attr_dev(p2, "class", "svelte-1p1063f");
    			add_location(p2, file$i, 45, 4, 1496);
    			attr_dev(div2, "class", "view-group single-column svelte-1p1063f");
    			add_location(div2, file$i, 43, 2, 1417);
    			add_location(label3, file$i, 49, 4, 1584);
    			attr_dev(p3, "class", "svelte-1p1063f");
    			add_location(p3, file$i, 50, 4, 1608);
    			attr_dev(div3, "class", "view-group single-column svelte-1p1063f");
    			add_location(div3, file$i, 48, 2, 1540);
    			add_location(label4, file$i, 53, 4, 1686);
    			attr_dev(p4, "class", "svelte-1p1063f");
    			add_location(p4, file$i, 54, 4, 1718);
    			attr_dev(div4, "class", "view-group single-column svelte-1p1063f");
    			add_location(div4, file$i, 52, 2, 1642);
    			attr_dev(label5, "for", "discord");
    			add_location(label5, file$i, 58, 4, 1805);
    			attr_dev(input0, "type", "text");
    			attr_dev(input0, "id", "discord");
    			input0.disabled = input0_disabled_value = !/*canEdit*/ ctx[0];
    			attr_dev(input0, "class", "svelte-1p1063f");
    			add_location(input0, file$i, 59, 4, 1848);
    			attr_dev(div5, "class", "view-group single-column svelte-1p1063f");
    			add_location(div5, file$i, 57, 2, 1761);
    			attr_dev(label6, "for", "region");
    			add_location(label6, file$i, 63, 4, 1990);
    			attr_dev(input1, "type", "text");
    			attr_dev(input1, "id", "region");
    			input1.disabled = input1_disabled_value = !/*canEdit*/ ctx[0];
    			attr_dev(input1, "class", "svelte-1p1063f");
    			add_location(input1, file$i, 64, 4, 2031);
    			attr_dev(div6, "class", "view-group single-column svelte-1p1063f");
    			add_location(div6, file$i, 62, 2, 1946);
    			attr_dev(label7, "for", "timezone");
    			add_location(label7, file$i, 68, 4, 2171);
    			attr_dev(input2, "type", "text");
    			attr_dev(input2, "id", "timezone");
    			input2.disabled = input2_disabled_value = !/*canEdit*/ ctx[0];
    			attr_dev(input2, "class", "svelte-1p1063f");
    			add_location(input2, file$i, 69, 4, 2216);
    			attr_dev(div7, "class", "view-group single-column svelte-1p1063f");
    			add_location(div7, file$i, 67, 2, 2127);
    			add_location(label8, file$i, 73, 4, 2362);
    			attr_dev(p5, "class", "svelte-1p1063f");
    			add_location(p5, file$i, 74, 4, 2397);
    			attr_dev(div8, "class", "view-group single-column svelte-1p1063f");
    			add_location(div8, file$i, 72, 2, 2318);
    			attr_dev(label9, "for", "training");
    			add_location(label9, file$i, 79, 4, 2490);
    			attr_dev(textarea0, "id", "training");
    			textarea0.disabled = textarea0_disabled_value = !/*canEdit*/ ctx[0];
    			attr_dev(textarea0, "class", "svelte-1p1063f");
    			add_location(textarea0, file$i, 80, 4, 2535);
    			attr_dev(div9, "class", "textarea-group full-width svelte-1p1063f");
    			add_location(div9, file$i, 78, 2, 2445);
    			attr_dev(label10, "for", "disciplinaries");
    			add_location(label10, file$i, 84, 4, 2682);
    			attr_dev(textarea1, "id", "disciplinaries");
    			textarea1.disabled = textarea1_disabled_value = !/*canEdit*/ ctx[0];
    			attr_dev(textarea1, "class", "svelte-1p1063f");
    			add_location(textarea1, file$i, 85, 4, 2739);
    			attr_dev(div10, "class", "textarea-group full-width svelte-1p1063f");
    			add_location(div10, file$i, 83, 2, 2637);
    			attr_dev(label11, "for", "achievements");
    			add_location(label11, file$i, 89, 4, 2898);
    			attr_dev(textarea2, "id", "achievements");
    			textarea2.disabled = textarea2_disabled_value = !/*canEdit*/ ctx[0];
    			attr_dev(textarea2, "class", "svelte-1p1063f");
    			add_location(textarea2, file$i, 90, 4, 2951);
    			attr_dev(div11, "class", "textarea-group full-width svelte-1p1063f");
    			add_location(div11, file$i, 88, 2, 2853);
    			attr_dev(label12, "for", "notes");
    			add_location(label12, file$i, 94, 4, 3106);
    			attr_dev(textarea3, "id", "notes");
    			textarea3.disabled = textarea3_disabled_value = !/*canEdit*/ ctx[0];
    			attr_dev(textarea3, "class", "svelte-1p1063f");
    			add_location(textarea3, file$i, 95, 4, 3145);
    			attr_dev(div12, "class", "textarea-group full-width svelte-1p1063f");
    			add_location(div12, file$i, 93, 2, 3061);
    			attr_dev(div13, "class", "profile-container svelte-1p1063f");
    			add_location(div13, file$i, 31, 0, 1138);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div13, anchor);
    			append_dev(div13, div0);
    			append_dev(div0, label0);
    			append_dev(div0, t1);
    			append_dev(div0, p0);
    			append_dev(p0, t2);
    			append_dev(div13, t3);
    			append_dev(div13, div1);
    			append_dev(div1, label1);
    			append_dev(div1, t5);
    			append_dev(div1, p1);
    			append_dev(p1, t6);
    			append_dev(div13, t7);
    			append_dev(div13, div2);
    			append_dev(div2, label2);
    			append_dev(div2, t9);
    			append_dev(div2, p2);
    			append_dev(p2, t10);
    			append_dev(div13, t11);
    			append_dev(div13, div3);
    			append_dev(div3, label3);
    			append_dev(div3, t13);
    			append_dev(div3, p3);
    			append_dev(p3, t14);
    			append_dev(div13, t15);
    			append_dev(div13, div4);
    			append_dev(div4, label4);
    			append_dev(div4, t17);
    			append_dev(div4, p4);
    			append_dev(p4, t18);
    			append_dev(div13, t19);
    			append_dev(div13, div5);
    			append_dev(div5, label5);
    			append_dev(div5, t21);
    			append_dev(div5, input0);
    			set_input_value(input0, /*$profile*/ ctx[1].discord);
    			append_dev(div13, t22);
    			append_dev(div13, div6);
    			append_dev(div6, label6);
    			append_dev(div6, t24);
    			append_dev(div6, input1);
    			set_input_value(input1, /*$profile*/ ctx[1].region);
    			append_dev(div13, t25);
    			append_dev(div13, div7);
    			append_dev(div7, label7);
    			append_dev(div7, t27);
    			append_dev(div7, input2);
    			set_input_value(input2, /*$profile*/ ctx[1].timezone);
    			append_dev(div13, t28);
    			append_dev(div13, div8);
    			append_dev(div8, label8);
    			append_dev(div8, t30);
    			append_dev(div8, p5);
    			append_dev(p5, t31);
    			append_dev(div13, t32);
    			append_dev(div13, div9);
    			append_dev(div9, label9);
    			append_dev(div9, t34);
    			append_dev(div9, textarea0);
    			set_input_value(textarea0, /*$profile*/ ctx[1].training);
    			append_dev(div13, t35);
    			append_dev(div13, div10);
    			append_dev(div10, label10);
    			append_dev(div10, t37);
    			append_dev(div10, textarea1);
    			set_input_value(textarea1, /*$profile*/ ctx[1].disciplinaries);
    			append_dev(div13, t38);
    			append_dev(div13, div11);
    			append_dev(div11, label11);
    			append_dev(div11, t40);
    			append_dev(div11, textarea2);
    			set_input_value(textarea2, /*$profile*/ ctx[1].achievements);
    			append_dev(div13, t41);
    			append_dev(div13, div12);
    			append_dev(div12, label12);
    			append_dev(div12, t43);
    			append_dev(div12, textarea3);
    			set_input_value(textarea3, /*$profile*/ ctx[1].notes);
    			append_dev(div13, t44);
    			if (if_block) if_block.m(div13, null);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input0, "input", /*input0_input_handler*/ ctx[6]),
    					listen_dev(input1, "input", /*input1_input_handler*/ ctx[7]),
    					listen_dev(input2, "input", /*input2_input_handler*/ ctx[8]),
    					listen_dev(textarea0, "input", /*textarea0_input_handler*/ ctx[9]),
    					listen_dev(textarea1, "input", /*textarea1_input_handler*/ ctx[10]),
    					listen_dev(textarea2, "input", /*textarea2_input_handler*/ ctx[11]),
    					listen_dev(textarea3, "input", /*textarea3_input_handler*/ ctx[12])
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$profile*/ 2 && t2_value !== (t2_value = /*$profile*/ ctx[1].name + "")) set_data_dev(t2, t2_value);
    			if (dirty & /*$profile*/ 2 && t6_value !== (t6_value = /*$profile*/ ctx[1].id + "")) set_data_dev(t6, t6_value);
    			if (dirty & /*$profile*/ 2 && t10_value !== (t10_value = /*$profile*/ ctx[1].lastactive + "")) set_data_dev(t10, t10_value);
    			if (dirty & /*$profile*/ 2 && t14_value !== (t14_value = /*$profile*/ ctx[1].po + "")) set_data_dev(t14, t14_value);
    			if (dirty & /*$profile*/ 2 && t18_value !== (t18_value = /*$profile*/ ctx[1].totalduty + "")) set_data_dev(t18, t18_value);

    			if (dirty & /*canEdit*/ 1 && input0_disabled_value !== (input0_disabled_value = !/*canEdit*/ ctx[0])) {
    				prop_dev(input0, "disabled", input0_disabled_value);
    			}

    			if (dirty & /*$profile*/ 2 && input0.value !== /*$profile*/ ctx[1].discord) {
    				set_input_value(input0, /*$profile*/ ctx[1].discord);
    			}

    			if (dirty & /*canEdit*/ 1 && input1_disabled_value !== (input1_disabled_value = !/*canEdit*/ ctx[0])) {
    				prop_dev(input1, "disabled", input1_disabled_value);
    			}

    			if (dirty & /*$profile*/ 2 && input1.value !== /*$profile*/ ctx[1].region) {
    				set_input_value(input1, /*$profile*/ ctx[1].region);
    			}

    			if (dirty & /*canEdit*/ 1 && input2_disabled_value !== (input2_disabled_value = !/*canEdit*/ ctx[0])) {
    				prop_dev(input2, "disabled", input2_disabled_value);
    			}

    			if (dirty & /*$profile*/ 2 && input2.value !== /*$profile*/ ctx[1].timezone) {
    				set_input_value(input2, /*$profile*/ ctx[1].timezone);
    			}

    			if (dirty & /*$profile*/ 2 && t31_value !== (t31_value = /*$profile*/ ctx[1].totalReports + "")) set_data_dev(t31, t31_value);

    			if (dirty & /*canEdit*/ 1 && textarea0_disabled_value !== (textarea0_disabled_value = !/*canEdit*/ ctx[0])) {
    				prop_dev(textarea0, "disabled", textarea0_disabled_value);
    			}

    			if (dirty & /*$profile*/ 2) {
    				set_input_value(textarea0, /*$profile*/ ctx[1].training);
    			}

    			if (dirty & /*canEdit*/ 1 && textarea1_disabled_value !== (textarea1_disabled_value = !/*canEdit*/ ctx[0])) {
    				prop_dev(textarea1, "disabled", textarea1_disabled_value);
    			}

    			if (dirty & /*$profile*/ 2) {
    				set_input_value(textarea1, /*$profile*/ ctx[1].disciplinaries);
    			}

    			if (dirty & /*canEdit*/ 1 && textarea2_disabled_value !== (textarea2_disabled_value = !/*canEdit*/ ctx[0])) {
    				prop_dev(textarea2, "disabled", textarea2_disabled_value);
    			}

    			if (dirty & /*$profile*/ 2) {
    				set_input_value(textarea2, /*$profile*/ ctx[1].achievements);
    			}

    			if (dirty & /*canEdit*/ 1 && textarea3_disabled_value !== (textarea3_disabled_value = !/*canEdit*/ ctx[0])) {
    				prop_dev(textarea3, "disabled", textarea3_disabled_value);
    			}

    			if (dirty & /*$profile*/ 2) {
    				set_input_value(textarea3, /*$profile*/ ctx[1].notes);
    			}

    			if (/*canEdit*/ ctx[0]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block_1$8(ctx);
    					if_block.c();
    					if_block.m(div13, null);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div13);
    			if (if_block) if_block.d();
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$e.name,
    		type: "if",
    		source: "(31:0) {#if $profile && $profile.id}",
    		ctx
    	});

    	return block;
    }

    // (99:2) {#if canEdit}
    function create_if_block_1$8(ctx) {
    	let button;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			button.textContent = "Save";
    			attr_dev(button, "class", "save-button svelte-1p1063f");
    			add_location(button, file$i, 99, 4, 3260);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*saveProfileData*/ ctx[3], false, false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$8.name,
    		type: "if",
    		source: "(99:2) {#if canEdit}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$i(ctx) {
    	let if_block_anchor;

    	function select_block_type(ctx, dirty) {
    		if (/*$profile*/ ctx[1] && /*$profile*/ ctx[1].id) return create_if_block$e;
    		return create_else_block$8;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, [dirty]) {
    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$i.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$i($$self, $$props, $$invalidate) {
    	let canEdit;
    	let $profile;
    	let $userRank;
    	let $params;
    	validate_store(userRank, 'userRank');
    	component_subscribe($$self, userRank, $$value => $$invalidate(4, $userRank = $$value));
    	validate_store(params, 'params');
    	component_subscribe($$self, params, $$value => $$invalidate(5, $params = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('RosterProfiles', slots, []);
    	const profile = writable({});
    	validate_store(profile, 'profile');
    	component_subscribe($$self, profile, value => $$invalidate(1, $profile = value));

    	function saveProfileData() {
    		console.log('Profile data saved:', $profile);
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$d.warn(`<RosterProfiles> was created with unknown prop '${key}'`);
    	});

    	function input0_input_handler() {
    		$profile.discord = this.value;
    		profile.set($profile);
    	}

    	function input1_input_handler() {
    		$profile.region = this.value;
    		profile.set($profile);
    	}

    	function input2_input_handler() {
    		$profile.timezone = this.value;
    		profile.set($profile);
    	}

    	function textarea0_input_handler() {
    		$profile.training = this.value;
    		profile.set($profile);
    	}

    	function textarea1_input_handler() {
    		$profile.disciplinaries = this.value;
    		profile.set($profile);
    	}

    	function textarea2_input_handler() {
    		$profile.achievements = this.value;
    		profile.set($profile);
    	}

    	function textarea3_input_handler() {
    		$profile.notes = this.value;
    		profile.set($profile);
    	}

    	$$self.$capture_state = () => ({
    		params,
    		writable,
    		dummyPoliceRoster,
    		hasPermission,
    		userRank,
    		profile,
    		saveProfileData,
    		canEdit,
    		$profile,
    		$userRank,
    		$params
    	});

    	$$self.$inject_state = $$props => {
    		if ('canEdit' in $$props) $$invalidate(0, canEdit = $$props.canEdit);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$params*/ 32) {
    			// Reactive statement to react to changes in params
    			if ($params && $params.id) {
    				const officerId = $params.id;
    				const officerProfile = dummyPoliceRoster.find(officer => officer.id === officerId);

    				if (officerProfile) {
    					profile.set(officerProfile);
    				} else {
    					console.error("Profile not found for ID:", officerId);
    				} // Handle the error state appropriately
    			} else {
    				console.error("No officer ID provided in params");
    			} // Handle the error state appropriately
    		}

    		if ($$self.$$.dirty & /*$userRank*/ 16) {
    			$$invalidate(0, canEdit = $userRank && hasPermission($userRank, 'canEditPoliceRoster'));
    		}
    	};

    	return [
    		canEdit,
    		$profile,
    		profile,
    		saveProfileData,
    		$userRank,
    		$params,
    		input0_input_handler,
    		input1_input_handler,
    		input2_input_handler,
    		textarea0_input_handler,
    		textarea1_input_handler,
    		textarea2_input_handler,
    		textarea3_input_handler
    	];
    }

    class RosterProfiles extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$i, create_fragment$i, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "RosterProfiles",
    			options,
    			id: create_fragment$i.name
    		});
    	}
    }

    /* src\Dashboard\Alerts.svelte generated by Svelte v3.59.2 */

    const { console: console_1$c } = globals;
    const file$h = "src\\Dashboard\\Alerts.svelte";

    function get_each_context$d(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[34] = list[i];
    	return child_ctx;
    }

    function get_each_context_1$4(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[37] = list[i];
    	return child_ctx;
    }

    // (331:12) {:else}
    function create_else_block_2$1(ctx) {
    	let button;

    	const block = {
    		c: function create() {
    			button = element("button");
    			attr_dev(button, "class", "action-button hidden svelte-1jlm235");
    			add_location(button, file$h, 331, 14, 8653);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_2$1.name,
    		type: "else",
    		source: "(331:12) {:else}",
    		ctx
    	});

    	return block;
    }

    // (327:12) {#if alert.status === 'Active'}
    function create_if_block_2$4(ctx) {
    	let button;

    	let t_value = (/*alert*/ ctx[37].responders.includes(viewerId)
    	? 'Leave'
    	: 'Join') + "";

    	let t;
    	let mounted;
    	let dispose;

    	function click_handler_4() {
    		return /*click_handler_4*/ ctx[22](/*alert*/ ctx[37]);
    	}

    	const block = {
    		c: function create() {
    			button = element("button");
    			t = text(t_value);
    			attr_dev(button, "class", "action-button svelte-1jlm235");
    			add_location(button, file$h, 327, 14, 8446);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			append_dev(button, t);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", click_handler_4, false, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (dirty[0] & /*paginatedAlerts*/ 16 && t_value !== (t_value = (/*alert*/ ctx[37].responders.includes(viewerId)
    			? 'Leave'
    			: 'Join') + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$4.name,
    		type: "if",
    		source: "(327:12) {#if alert.status === 'Active'}",
    		ctx
    	});

    	return block;
    }

    // (313:6) {#each paginatedAlerts as alert}
    function create_each_block_1$4(ctx) {
    	let tr;
    	let td0;
    	let t0_value = formatToLocalTime(/*alert*/ ctx[37].date) + "";
    	let t0;
    	let t1;
    	let td1;
    	let t2_value = /*alert*/ ctx[37].title + "";
    	let t2;
    	let t3;
    	let td2;
    	let t4_value = (/*alert*/ ctx[37].status === 'Active' ? '🟢' : '⚪️') + "";
    	let t4;
    	let t5;
    	let td3;
    	let t6_value = /*alert*/ ctx[37].responders.join(', ') + "";
    	let t6;
    	let t7;
    	let td4;
    	let t8;
    	let mounted;
    	let dispose;

    	function click_handler_2() {
    		return /*click_handler_2*/ ctx[20](/*alert*/ ctx[37]);
    	}

    	function click_handler_3() {
    		return /*click_handler_3*/ ctx[21](/*alert*/ ctx[37]);
    	}

    	function select_block_type(ctx, dirty) {
    		if (/*alert*/ ctx[37].status === 'Active') return create_if_block_2$4;
    		return create_else_block_2$1;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			tr = element("tr");
    			td0 = element("td");
    			t0 = text(t0_value);
    			t1 = space();
    			td1 = element("td");
    			t2 = text(t2_value);
    			t3 = space();
    			td2 = element("td");
    			t4 = text(t4_value);
    			t5 = space();
    			td3 = element("td");
    			t6 = text(t6_value);
    			t7 = space();
    			td4 = element("td");
    			if_block.c();
    			t8 = space();
    			attr_dev(td0, "class", "svelte-1jlm235");
    			add_location(td0, file$h, 314, 10, 7879);
    			attr_dev(td1, "class", "title-column svelte-1jlm235");
    			add_location(td1, file$h, 315, 10, 7931);
    			attr_dev(td2, "class", "midalign-column status-action svelte-1jlm235");
    			add_location(td2, file$h, 318, 10, 8060);
    			attr_dev(td3, "class", "midalign-column svelte-1jlm235");
    			add_location(td3, file$h, 324, 10, 8269);
    			attr_dev(td4, "class", "midalign-column action-column svelte-1jlm235");
    			add_location(td4, file$h, 325, 10, 8343);
    			add_location(tr, file$h, 313, 8, 7863);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, tr, anchor);
    			append_dev(tr, td0);
    			append_dev(td0, t0);
    			append_dev(tr, t1);
    			append_dev(tr, td1);
    			append_dev(td1, t2);
    			append_dev(tr, t3);
    			append_dev(tr, td2);
    			append_dev(td2, t4);
    			append_dev(tr, t5);
    			append_dev(tr, td3);
    			append_dev(td3, t6);
    			append_dev(tr, t7);
    			append_dev(tr, td4);
    			if_block.m(td4, null);
    			append_dev(tr, t8);

    			if (!mounted) {
    				dispose = [
    					listen_dev(td1, "click", click_handler_2, false, false, false, false),
    					listen_dev(td2, "click", click_handler_3, false, false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty[0] & /*paginatedAlerts*/ 16 && t0_value !== (t0_value = formatToLocalTime(/*alert*/ ctx[37].date) + "")) set_data_dev(t0, t0_value);
    			if (dirty[0] & /*paginatedAlerts*/ 16 && t2_value !== (t2_value = /*alert*/ ctx[37].title + "")) set_data_dev(t2, t2_value);
    			if (dirty[0] & /*paginatedAlerts*/ 16 && t4_value !== (t4_value = (/*alert*/ ctx[37].status === 'Active' ? '🟢' : '⚪️') + "")) set_data_dev(t4, t4_value);
    			if (dirty[0] & /*paginatedAlerts*/ 16 && t6_value !== (t6_value = /*alert*/ ctx[37].responders.join(', ') + "")) set_data_dev(t6, t6_value);

    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(td4, null);
    				}
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(tr);
    			if_block.d();
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1$4.name,
    		type: "each",
    		source: "(313:6) {#each paginatedAlerts as alert}",
    		ctx
    	});

    	return block;
    }

    // (362:4) {:else}
    function create_else_block_1$2(ctx) {
    	let button;
    	let t_value = /*page*/ ctx[34] + "";
    	let t;
    	let mounted;
    	let dispose;

    	function click_handler_7() {
    		return /*click_handler_7*/ ctx[27](/*page*/ ctx[34]);
    	}

    	const block = {
    		c: function create() {
    			button = element("button");
    			t = text(t_value);
    			attr_dev(button, "class", "svelte-1jlm235");
    			toggle_class(button, "active", /*page*/ ctx[34] === /*currentPage*/ ctx[2]);
    			add_location(button, file$h, 362, 6, 9651);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			append_dev(button, t);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", click_handler_7, false, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty[0] & /*currentPage, totalPages*/ 12 && t_value !== (t_value = /*page*/ ctx[34] + "")) set_data_dev(t, t_value);

    			if (dirty[0] & /*currentPage, totalPages*/ 12) {
    				toggle_class(button, "active", /*page*/ ctx[34] === /*currentPage*/ ctx[2]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_1$2.name,
    		type: "else",
    		source: "(362:4) {:else}",
    		ctx
    	});

    	return block;
    }

    // (347:4) {#if page === '...'}
    function create_if_block$d(ctx) {
    	let if_block_anchor;

    	function select_block_type_2(ctx, dirty) {
    		if (/*showInput*/ ctx[5]) return create_if_block_1$7;
    		return create_else_block$7;
    	}

    	let current_block_type = select_block_type_2(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (current_block_type === (current_block_type = select_block_type_2(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			}
    		},
    		d: function destroy(detaching) {
    			if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$d.name,
    		type: "if",
    		source: "(347:4) {#if page === '...'}",
    		ctx
    	});

    	return block;
    }

    // (358:6) {:else}
    function create_else_block$7(ctx) {
    	let button;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			button.textContent = "...";
    			attr_dev(button, "class", "svelte-1jlm235");
    			add_location(button, file$h, 359, 8, 9566);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*handleEllipsisClick*/ ctx[11], false, false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$7.name,
    		type: "else",
    		source: "(358:6) {:else}",
    		ctx
    	});

    	return block;
    }

    // (348:6) {#if showInput}
    function create_if_block_1$7(ctx) {
    	let input;
    	let t0;
    	let button;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			input = element("input");
    			t0 = space();
    			button = element("button");
    			button.textContent = "Go";
    			attr_dev(input, "type", "number");
    			attr_dev(input, "min", "1");
    			attr_dev(input, "max", /*totalPages*/ ctx[3]);
    			attr_dev(input, "class", "svelte-1jlm235");
    			add_location(input, file$h, 349, 8, 9244);
    			attr_dev(button, "class", "svelte-1jlm235");
    			add_location(button, file$h, 356, 8, 9438);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, input, anchor);
    			set_input_value(input, /*inputPage*/ ctx[6]);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, button, anchor);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input, "input", /*input_input_handler_1*/ ctx[25]),
    					listen_dev(input, "input", /*input_handler*/ ctx[26], false, false, false, false),
    					listen_dev(button, "click", /*handlePageSubmit*/ ctx[12], false, false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*totalPages*/ 8) {
    				attr_dev(input, "max", /*totalPages*/ ctx[3]);
    			}

    			if (dirty[0] & /*inputPage*/ 64 && to_number(input.value) !== /*inputPage*/ ctx[6]) {
    				set_input_value(input, /*inputPage*/ ctx[6]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(input);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(button);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$7.name,
    		type: "if",
    		source: "(348:6) {#if showInput}",
    		ctx
    	});

    	return block;
    }

    // (346:2) {#each getPaginationRange(currentPage, totalPages, 2) as page}
    function create_each_block$d(ctx) {
    	let if_block_anchor;

    	function select_block_type_1(ctx, dirty) {
    		if (/*page*/ ctx[34] === '...') return create_if_block$d;
    		return create_else_block_1$2;
    	}

    	let current_block_type = select_block_type_1(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (current_block_type === (current_block_type = select_block_type_1(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			}
    		},
    		d: function destroy(detaching) {
    			if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$d.name,
    		type: "each",
    		source: "(346:2) {#each getPaginationRange(currentPage, totalPages, 2) as page}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$h(ctx) {
    	let div0;
    	let input;
    	let t0;
    	let div1;
    	let table0;
    	let thead;
    	let tr;
    	let th0;
    	let t2;
    	let th1;
    	let t4;
    	let th2;
    	let t6;
    	let th3;
    	let t8;
    	let th4;
    	let t10;
    	let div2;
    	let table1;
    	let tbody;
    	let t11;
    	let div3;
    	let button0;
    	let t12;
    	let button0_disabled_value;
    	let t13;
    	let button1;
    	let t14;
    	let button1_disabled_value;
    	let t15;
    	let t16;
    	let button2;
    	let t17;
    	let button2_disabled_value;
    	let t18;
    	let button3;
    	let t19;
    	let button3_disabled_value;
    	let mounted;
    	let dispose;
    	let each_value_1 = /*paginatedAlerts*/ ctx[4];
    	validate_each_argument(each_value_1);
    	let each_blocks_1 = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks_1[i] = create_each_block_1$4(get_each_context_1$4(ctx, each_value_1, i));
    	}

    	let each_value = getPaginationRange(/*currentPage*/ ctx[2], /*totalPages*/ ctx[3], 2);
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$d(get_each_context$d(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div0 = element("div");
    			input = element("input");
    			t0 = space();
    			div1 = element("div");
    			table0 = element("table");
    			thead = element("thead");
    			tr = element("tr");
    			th0 = element("th");
    			th0.textContent = "Date";
    			t2 = space();
    			th1 = element("th");
    			th1.textContent = "Title";
    			t4 = space();
    			th2 = element("th");
    			th2.textContent = "Status";
    			t6 = space();
    			th3 = element("th");
    			th3.textContent = "Responders";
    			t8 = space();
    			th4 = element("th");
    			th4.textContent = "Action";
    			t10 = space();
    			div2 = element("div");
    			table1 = element("table");
    			tbody = element("tbody");

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].c();
    			}

    			t11 = space();
    			div3 = element("div");
    			button0 = element("button");
    			t12 = text("First");
    			t13 = space();
    			button1 = element("button");
    			t14 = text("Prev");
    			t15 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t16 = space();
    			button2 = element("button");
    			t17 = text("Next");
    			t18 = space();
    			button3 = element("button");
    			t19 = text("Last");
    			attr_dev(input, "type", "text");
    			attr_dev(input, "placeholder", "Search alerts...");
    			attr_dev(input, "class", "svelte-1jlm235");
    			add_location(input, file$h, 278, 2, 6770);
    			attr_dev(div0, "class", "search-container svelte-1jlm235");
    			add_location(div0, file$h, 277, 0, 6736);
    			attr_dev(th0, "class", "svelte-1jlm235");
    			toggle_class(th0, "sorted-ascending", /*sortColumn*/ ctx[1] === 'date' && /*sortOrder*/ ctx[0] === 'ascending');
    			toggle_class(th0, "sorted-descending", /*sortColumn*/ ctx[1] === 'date' && /*sortOrder*/ ctx[0] === 'descending');
    			toggle_class(th0, "sorted-none", /*sortColumn*/ ctx[1] !== 'date' || /*sortOrder*/ ctx[0] === 'none');
    			add_location(th0, file$h, 285, 8, 6935);
    			attr_dev(th1, "class", "svelte-1jlm235");
    			toggle_class(th1, "sorted-ascending", /*sortColumn*/ ctx[1] === 'title' && /*sortOrder*/ ctx[0] === 'ascending');
    			toggle_class(th1, "sorted-descending", /*sortColumn*/ ctx[1] === 'title' && /*sortOrder*/ ctx[0] === 'descending');
    			toggle_class(th1, "sorted-none", /*sortColumn*/ ctx[1] !== 'title' || /*sortOrder*/ ctx[0] === 'none');
    			add_location(th1, file$h, 293, 8, 7290);
    			attr_dev(th2, "class", "svelte-1jlm235");
    			add_location(th2, file$h, 301, 8, 7650);
    			attr_dev(th3, "class", "svelte-1jlm235");
    			add_location(th3, file$h, 302, 8, 7675);
    			attr_dev(th4, "class", "svelte-1jlm235");
    			add_location(th4, file$h, 303, 8, 7704);
    			add_location(tr, file$h, 284, 6, 6921);
    			add_location(thead, file$h, 283, 4, 6906);
    			attr_dev(table0, "class", "svelte-1jlm235");
    			add_location(table0, file$h, 282, 2, 6893);
    			attr_dev(div1, "class", "table-container svelte-1jlm235");
    			add_location(div1, file$h, 281, 0, 6860);
    			add_location(tbody, file$h, 311, 4, 7806);
    			attr_dev(table1, "class", "svelte-1jlm235");
    			add_location(table1, file$h, 310, 2, 7793);
    			attr_dev(div2, "class", "tbody svelte-1jlm235");
    			add_location(div2, file$h, 309, 0, 7770);
    			button0.disabled = button0_disabled_value = /*currentPage*/ ctx[2] === 1;
    			attr_dev(button0, "class", "svelte-1jlm235");
    			add_location(button0, file$h, 342, 2, 8861);
    			button1.disabled = button1_disabled_value = /*currentPage*/ ctx[2] === 1;
    			attr_dev(button1, "class", "svelte-1jlm235");
    			add_location(button1, file$h, 343, 2, 8947);
    			button2.disabled = button2_disabled_value = /*currentPage*/ ctx[2] === /*totalPages*/ ctx[3];
    			attr_dev(button2, "class", "svelte-1jlm235");
    			add_location(button2, file$h, 371, 2, 9816);
    			button3.disabled = button3_disabled_value = /*currentPage*/ ctx[2] === /*totalPages*/ ctx[3];
    			attr_dev(button3, "class", "svelte-1jlm235");
    			add_location(button3, file$h, 372, 2, 9924);
    			attr_dev(div3, "class", "pagination svelte-1jlm235");
    			add_location(div3, file$h, 341, 0, 8833);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div0, anchor);
    			append_dev(div0, input);
    			set_input_value(input, /*$searchQuery*/ ctx[7]);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, div1, anchor);
    			append_dev(div1, table0);
    			append_dev(table0, thead);
    			append_dev(thead, tr);
    			append_dev(tr, th0);
    			append_dev(tr, t2);
    			append_dev(tr, th1);
    			append_dev(tr, t4);
    			append_dev(tr, th2);
    			append_dev(tr, t6);
    			append_dev(tr, th3);
    			append_dev(tr, t8);
    			append_dev(tr, th4);
    			insert_dev(target, t10, anchor);
    			insert_dev(target, div2, anchor);
    			append_dev(div2, table1);
    			append_dev(table1, tbody);

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				if (each_blocks_1[i]) {
    					each_blocks_1[i].m(tbody, null);
    				}
    			}

    			insert_dev(target, t11, anchor);
    			insert_dev(target, div3, anchor);
    			append_dev(div3, button0);
    			append_dev(button0, t12);
    			append_dev(div3, t13);
    			append_dev(div3, button1);
    			append_dev(button1, t14);
    			append_dev(div3, t15);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				if (each_blocks[i]) {
    					each_blocks[i].m(div3, null);
    				}
    			}

    			append_dev(div3, t16);
    			append_dev(div3, button2);
    			append_dev(button2, t17);
    			append_dev(div3, t18);
    			append_dev(div3, button3);
    			append_dev(button3, t19);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input, "input", /*input_input_handler*/ ctx[17]),
    					listen_dev(th0, "click", /*click_handler*/ ctx[18], false, false, false, false),
    					listen_dev(th1, "click", /*click_handler_1*/ ctx[19], false, false, false, false),
    					listen_dev(button0, "click", /*click_handler_5*/ ctx[23], false, false, false, false),
    					listen_dev(button1, "click", /*click_handler_6*/ ctx[24], false, false, false, false),
    					listen_dev(button2, "click", /*click_handler_8*/ ctx[28], false, false, false, false),
    					listen_dev(button3, "click", /*click_handler_9*/ ctx[29], false, false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*$searchQuery*/ 128 && input.value !== /*$searchQuery*/ ctx[7]) {
    				set_input_value(input, /*$searchQuery*/ ctx[7]);
    			}

    			if (dirty[0] & /*sortColumn, sortOrder*/ 3) {
    				toggle_class(th0, "sorted-ascending", /*sortColumn*/ ctx[1] === 'date' && /*sortOrder*/ ctx[0] === 'ascending');
    			}

    			if (dirty[0] & /*sortColumn, sortOrder*/ 3) {
    				toggle_class(th0, "sorted-descending", /*sortColumn*/ ctx[1] === 'date' && /*sortOrder*/ ctx[0] === 'descending');
    			}

    			if (dirty[0] & /*sortColumn, sortOrder*/ 3) {
    				toggle_class(th0, "sorted-none", /*sortColumn*/ ctx[1] !== 'date' || /*sortOrder*/ ctx[0] === 'none');
    			}

    			if (dirty[0] & /*sortColumn, sortOrder*/ 3) {
    				toggle_class(th1, "sorted-ascending", /*sortColumn*/ ctx[1] === 'title' && /*sortOrder*/ ctx[0] === 'ascending');
    			}

    			if (dirty[0] & /*sortColumn, sortOrder*/ 3) {
    				toggle_class(th1, "sorted-descending", /*sortColumn*/ ctx[1] === 'title' && /*sortOrder*/ ctx[0] === 'descending');
    			}

    			if (dirty[0] & /*sortColumn, sortOrder*/ 3) {
    				toggle_class(th1, "sorted-none", /*sortColumn*/ ctx[1] !== 'title' || /*sortOrder*/ ctx[0] === 'none');
    			}

    			if (dirty[0] & /*toggleRespond, paginatedAlerts, toggleAlertStatus, navigateToAlertModal*/ 114704) {
    				each_value_1 = /*paginatedAlerts*/ ctx[4];
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1$4(ctx, each_value_1, i);

    					if (each_blocks_1[i]) {
    						each_blocks_1[i].p(child_ctx, dirty);
    					} else {
    						each_blocks_1[i] = create_each_block_1$4(child_ctx);
    						each_blocks_1[i].c();
    						each_blocks_1[i].m(tbody, null);
    					}
    				}

    				for (; i < each_blocks_1.length; i += 1) {
    					each_blocks_1[i].d(1);
    				}

    				each_blocks_1.length = each_value_1.length;
    			}

    			if (dirty[0] & /*currentPage*/ 4 && button0_disabled_value !== (button0_disabled_value = /*currentPage*/ ctx[2] === 1)) {
    				prop_dev(button0, "disabled", button0_disabled_value);
    			}

    			if (dirty[0] & /*currentPage*/ 4 && button1_disabled_value !== (button1_disabled_value = /*currentPage*/ ctx[2] === 1)) {
    				prop_dev(button1, "disabled", button1_disabled_value);
    			}

    			if (dirty[0] & /*handlePageSubmit, totalPages, inputPage, showInput, handleEllipsisClick, currentPage, changePage*/ 7276) {
    				each_value = getPaginationRange(/*currentPage*/ ctx[2], /*totalPages*/ ctx[3], 2);
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$d(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$d(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div3, t16);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}

    			if (dirty[0] & /*currentPage, totalPages*/ 12 && button2_disabled_value !== (button2_disabled_value = /*currentPage*/ ctx[2] === /*totalPages*/ ctx[3])) {
    				prop_dev(button2, "disabled", button2_disabled_value);
    			}

    			if (dirty[0] & /*currentPage, totalPages*/ 12 && button3_disabled_value !== (button3_disabled_value = /*currentPage*/ ctx[2] === /*totalPages*/ ctx[3])) {
    				prop_dev(button3, "disabled", button3_disabled_value);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div0);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(div1);
    			if (detaching) detach_dev(t10);
    			if (detaching) detach_dev(div2);
    			destroy_each(each_blocks_1, detaching);
    			if (detaching) detach_dev(t11);
    			if (detaching) detach_dev(div3);
    			destroy_each(each_blocks, detaching);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$h.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$h($$self, $$props, $$invalidate) {
    	let $userRank;
    	let $filteredAlerts;
    	let $searchQuery;
    	validate_store(userRank, 'userRank');
    	component_subscribe($$self, userRank, $$value => $$invalidate(30, $userRank = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Alerts', slots, []);
    	let sortOrder = 'none';
    	let sortColumn = null;
    	const searchQuery = writable('');
    	validate_store(searchQuery, 'searchQuery');
    	component_subscribe($$self, searchQuery, value => $$invalidate(7, $searchQuery = value));
    	const alerts = writable(dummyAlerts);
    	let currentPage = 1;
    	let itemsPerPage = 5; // Set the number of items per page
    	let totalPages = 0;
    	let paginatedAlerts = [];
    	let showInput = false; // Controls visibility of the input for the ellipsis
    	let inputPage = currentPage; // Holds the value entered in the input

    	// Pagination setup
    	const filteredAlerts = derived([alerts, searchQuery], ([$alerts, $searchQuery]) => {
    		const filtered = $alerts.filter(alert => alert.title.toLowerCase().includes($searchQuery.toLowerCase()));
    		$$invalidate(3, totalPages = Math.ceil(filtered.length / itemsPerPage));
    		$$invalidate(4, paginatedAlerts = paginate(filtered, currentPage, itemsPerPage).paginatedItems);
    		return filtered;
    	});

    	validate_store(filteredAlerts, 'filteredAlerts');
    	component_subscribe($$self, filteredAlerts, value => $$invalidate(31, $filteredAlerts = value));

    	function changePage(pageNumber) {
    		if (pageNumber > 0 && pageNumber <= totalPages) {
    			$$invalidate(2, currentPage = pageNumber);
    			$$invalidate(4, paginatedAlerts = paginate($filteredAlerts, currentPage, itemsPerPage).paginatedItems);
    		}
    	}

    	function handleEllipsisClick() {
    		$$invalidate(5, showInput = !showInput); // Toggle input field visibility
    		$$invalidate(6, inputPage = currentPage);
    	}

    	function handlePageSubmit() {
    		const page = parseInt(inputPage);

    		if (page > 0 && page <= totalPages) {
    			changePage(page);
    			$$invalidate(5, showInput = false);
    		}
    	}

    	function handleSort(column) {
    		if (sortColumn === column) {
    			if (sortOrder === 'ascending') $$invalidate(0, sortOrder = 'descending'); else if (sortOrder === 'descending') $$invalidate(0, sortOrder = 'none'); else $$invalidate(0, sortOrder = 'ascending');
    		} else {
    			$$invalidate(1, sortColumn = column);
    			$$invalidate(0, sortOrder = 'ascending');
    		}

    		if (sortOrder === 'none') {
    			$$invalidate(1, sortColumn = null);
    			alerts.set([...dummyAlerts]);
    		} else {
    			alerts.update(currentAlerts => sortList([...currentAlerts], sortColumn, sortOrder));
    		}
    	}

    	function toggleAlertStatus(alertId) {
    		if ($userRank && hasPermission($userRank, 'disableAlert')) {
    			alerts.update(currentAlerts => currentAlerts.map(alert => {
    				if (alert.id === alertId) {
    					alert.status = alert.status === 'Active' ? 'Inactive' : 'Active';
    				}

    				return alert;
    			}));
    		} else {
    			console.log('User does not have permission to disable alerts.');
    		}
    	}

    	function navigateToAlertModal(alertId) {
    		push(`/AlertModal/${alertId}`);
    	}

    	function toggleRespond(alertId) {
    		alerts.update(currentAlerts => currentAlerts.map(alert => {
    			if (alert.id === alertId) {
    				const responderIndex = alert.responders.indexOf(viewerId);

    				if (responderIndex !== -1) {
    					alert.responders.splice(responderIndex, 1);
    				} else {
    					alert.responders.push(viewerId);
    				}

    				return {
    					...alert,
    					isResponding: !alert.isResponding
    				};
    			}

    			return alert;
    		}));
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$c.warn(`<Alerts> was created with unknown prop '${key}'`);
    	});

    	function input_input_handler() {
    		$searchQuery = this.value;
    		searchQuery.set($searchQuery);
    	}

    	const click_handler = () => handleSort('date');
    	const click_handler_1 = () => handleSort('title');
    	const click_handler_2 = alert => navigateToAlertModal(alert.id);
    	const click_handler_3 = alert => toggleAlertStatus(alert.id);
    	const click_handler_4 = alert => toggleRespond(alert.id);
    	const click_handler_5 = () => changePage(1);
    	const click_handler_6 = () => changePage(currentPage - 1);

    	function input_input_handler_1() {
    		inputPage = to_number(this.value);
    		$$invalidate(6, inputPage);
    	}

    	const input_handler = e => $$invalidate(6, inputPage = e.target.value);
    	const click_handler_7 = page => changePage(page);
    	const click_handler_8 = () => changePage(currentPage + 1);
    	const click_handler_9 = () => changePage(totalPages);

    	$$self.$capture_state = () => ({
    		push,
    		writable,
    		derived,
    		sortList,
    		formatToLocalTime,
    		paginate,
    		getPaginationRange,
    		dummyAlerts,
    		viewerId,
    		hasPermission,
    		userRank,
    		sortOrder,
    		sortColumn,
    		searchQuery,
    		alerts,
    		currentPage,
    		itemsPerPage,
    		totalPages,
    		paginatedAlerts,
    		showInput,
    		inputPage,
    		filteredAlerts,
    		changePage,
    		handleEllipsisClick,
    		handlePageSubmit,
    		handleSort,
    		toggleAlertStatus,
    		navigateToAlertModal,
    		toggleRespond,
    		$userRank,
    		$filteredAlerts,
    		$searchQuery
    	});

    	$$self.$inject_state = $$props => {
    		if ('sortOrder' in $$props) $$invalidate(0, sortOrder = $$props.sortOrder);
    		if ('sortColumn' in $$props) $$invalidate(1, sortColumn = $$props.sortColumn);
    		if ('currentPage' in $$props) $$invalidate(2, currentPage = $$props.currentPage);
    		if ('itemsPerPage' in $$props) itemsPerPage = $$props.itemsPerPage;
    		if ('totalPages' in $$props) $$invalidate(3, totalPages = $$props.totalPages);
    		if ('paginatedAlerts' in $$props) $$invalidate(4, paginatedAlerts = $$props.paginatedAlerts);
    		if ('showInput' in $$props) $$invalidate(5, showInput = $$props.showInput);
    		if ('inputPage' in $$props) $$invalidate(6, inputPage = $$props.inputPage);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		sortOrder,
    		sortColumn,
    		currentPage,
    		totalPages,
    		paginatedAlerts,
    		showInput,
    		inputPage,
    		$searchQuery,
    		searchQuery,
    		filteredAlerts,
    		changePage,
    		handleEllipsisClick,
    		handlePageSubmit,
    		handleSort,
    		toggleAlertStatus,
    		navigateToAlertModal,
    		toggleRespond,
    		input_input_handler,
    		click_handler,
    		click_handler_1,
    		click_handler_2,
    		click_handler_3,
    		click_handler_4,
    		click_handler_5,
    		click_handler_6,
    		input_input_handler_1,
    		input_handler,
    		click_handler_7,
    		click_handler_8,
    		click_handler_9
    	];
    }

    class Alerts extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$h, create_fragment$h, safe_not_equal, {}, null, [-1, -1]);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Alerts",
    			options,
    			id: create_fragment$h.name
    		});
    	}
    }

    /* src\components\AlertModal.svelte generated by Svelte v3.59.2 */

    const { console: console_1$b } = globals;
    const file$g = "src\\components\\AlertModal.svelte";

    function get_each_context$c(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[5] = list[i];
    	return child_ctx;
    }

    // (61:8) {:else}
    function create_else_block$6(ctx) {
    	let p;

    	const block = {
    		c: function create() {
    			p = element("p");
    			p.textContent = "No alert data found.";
    			add_location(p, file$g, 61, 10, 1863);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$6.name,
    		type: "else",
    		source: "(61:8) {:else}",
    		ctx
    	});

    	return block;
    }

    // (47:8) {#if alertDetails}
    function create_if_block$c(ctx) {
    	let h2;
    	let t0_value = /*$alertDetails*/ ctx[0].title + "";
    	let t0;
    	let t1;
    	let p0;
    	let t2_value = /*$alertDetails*/ ctx[0].description + "";
    	let t2;
    	let t3;
    	let p1;
    	let t4;
    	let t5_value = formatToLocalDateTime$1(/*$alertDetails*/ ctx[0].date) + "";
    	let t5;
    	let t6;
    	let p2;
    	let t7;
    	let t8_value = /*$alertDetails*/ ctx[0].status + "";
    	let t8;
    	let t9;
    	let h3;
    	let t11;
    	let ul;
    	let each_value = /*$respondersDetails*/ ctx[1];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$c(get_each_context$c(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			h2 = element("h2");
    			t0 = text(t0_value);
    			t1 = space();
    			p0 = element("p");
    			t2 = text(t2_value);
    			t3 = space();
    			p1 = element("p");
    			t4 = text("Date: ");
    			t5 = text(t5_value);
    			t6 = space();
    			p2 = element("p");
    			t7 = text("Status: ");
    			t8 = text(t8_value);
    			t9 = space();
    			h3 = element("h3");
    			h3.textContent = "Responders";
    			t11 = space();
    			ul = element("ul");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			add_location(h2, file$g, 47, 8, 1371);
    			add_location(p0, file$g, 48, 8, 1411);
    			add_location(p1, file$g, 49, 8, 1455);
    			add_location(p2, file$g, 50, 8, 1521);
    			add_location(h3, file$g, 52, 8, 1570);
    			attr_dev(ul, "class", "responders-list svelte-pwiwuy");
    			add_location(ul, file$g, 53, 8, 1599);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h2, anchor);
    			append_dev(h2, t0);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, p0, anchor);
    			append_dev(p0, t2);
    			insert_dev(target, t3, anchor);
    			insert_dev(target, p1, anchor);
    			append_dev(p1, t4);
    			append_dev(p1, t5);
    			insert_dev(target, t6, anchor);
    			insert_dev(target, p2, anchor);
    			append_dev(p2, t7);
    			append_dev(p2, t8);
    			insert_dev(target, t9, anchor);
    			insert_dev(target, h3, anchor);
    			insert_dev(target, t11, anchor);
    			insert_dev(target, ul, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				if (each_blocks[i]) {
    					each_blocks[i].m(ul, null);
    				}
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$alertDetails*/ 1 && t0_value !== (t0_value = /*$alertDetails*/ ctx[0].title + "")) set_data_dev(t0, t0_value);
    			if (dirty & /*$alertDetails*/ 1 && t2_value !== (t2_value = /*$alertDetails*/ ctx[0].description + "")) set_data_dev(t2, t2_value);
    			if (dirty & /*$alertDetails*/ 1 && t5_value !== (t5_value = formatToLocalDateTime$1(/*$alertDetails*/ ctx[0].date) + "")) set_data_dev(t5, t5_value);
    			if (dirty & /*$alertDetails*/ 1 && t8_value !== (t8_value = /*$alertDetails*/ ctx[0].status + "")) set_data_dev(t8, t8_value);

    			if (dirty & /*$respondersDetails*/ 2) {
    				each_value = /*$respondersDetails*/ ctx[1];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$c(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$c(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(ul, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h2);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(p0);
    			if (detaching) detach_dev(t3);
    			if (detaching) detach_dev(p1);
    			if (detaching) detach_dev(t6);
    			if (detaching) detach_dev(p2);
    			if (detaching) detach_dev(t9);
    			if (detaching) detach_dev(h3);
    			if (detaching) detach_dev(t11);
    			if (detaching) detach_dev(ul);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$c.name,
    		type: "if",
    		source: "(47:8) {#if alertDetails}",
    		ctx
    	});

    	return block;
    }

    // (55:10) {#each $respondersDetails as responder}
    function create_each_block$c(ctx) {
    	let li;
    	let t0;
    	let t1_value = /*responder*/ ctx[5].name + "";
    	let t1;
    	let t2;
    	let t3_value = /*responder*/ ctx[5].rank + "";
    	let t3;
    	let t4;

    	const block = {
    		c: function create() {
    			li = element("li");
    			t0 = text("Name: ");
    			t1 = text(t1_value);
    			t2 = text(", Rank: ");
    			t3 = text(t3_value);
    			t4 = space();
    			attr_dev(li, "class", "responder-item svelte-pwiwuy");
    			add_location(li, file$g, 55, 12, 1692);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, t0);
    			append_dev(li, t1);
    			append_dev(li, t2);
    			append_dev(li, t3);
    			append_dev(li, t4);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$respondersDetails*/ 2 && t1_value !== (t1_value = /*responder*/ ctx[5].name + "")) set_data_dev(t1, t1_value);
    			if (dirty & /*$respondersDetails*/ 2 && t3_value !== (t3_value = /*responder*/ ctx[5].rank + "")) set_data_dev(t3, t3_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$c.name,
    		type: "each",
    		source: "(55:10) {#each $respondersDetails as responder}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$g(ctx) {
    	let div;
    	let h1;
    	let t1;

    	function select_block_type(ctx, dirty) {
    		if (/*alertDetails*/ ctx[2]) return create_if_block$c;
    		return create_else_block$6;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			h1 = element("h1");
    			h1.textContent = "Alert Details";
    			t1 = space();
    			if_block.c();
    			add_location(h1, file$g, 45, 4, 1311);
    			attr_dev(div, "class", "alert-card svelte-pwiwuy");
    			add_location(div, file$g, 43, 2, 1279);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, h1);
    			append_dev(div, t1);
    			if_block.m(div, null);
    		},
    		p: function update(ctx, [dirty]) {
    			if_block.p(ctx, dirty);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$g.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$g($$self, $$props, $$invalidate) {
    	let $params;
    	let $alertDetails;
    	let $respondersDetails;
    	validate_store(params, 'params');
    	component_subscribe($$self, params, $$value => $$invalidate(4, $params = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('AlertModal', slots, []);
    	let alertDetails = writable({});
    	validate_store(alertDetails, 'alertDetails');
    	component_subscribe($$self, alertDetails, value => $$invalidate(0, $alertDetails = value));
    	let respondersDetails = writable([]);
    	validate_store(respondersDetails, 'respondersDetails');
    	component_subscribe($$self, respondersDetails, value => $$invalidate(1, $respondersDetails = value));
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$b.warn(`<AlertModal> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		onMount,
    		params,
    		writable,
    		get: get_store_value,
    		dummyAlerts,
    		dummyPoliceRoster,
    		formatToLocalDateTime: formatToLocalDateTime$1,
    		alertDetails,
    		respondersDetails,
    		$params,
    		$alertDetails,
    		$respondersDetails
    	});

    	$$self.$inject_state = $$props => {
    		if ('alertDetails' in $$props) $$invalidate(2, alertDetails = $$props.alertDetails);
    		if ('respondersDetails' in $$props) $$invalidate(3, respondersDetails = $$props.respondersDetails);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$params*/ 16) {
    			if ($params && $params.id) {
    				const alertId = $params.id;
    				const alert = dummyAlerts.find(a => a.id === alertId);

    				if (alert) {
    					alertDetails.set(alert);

    					// Find responders' details
    					const responders = alert.responders.map(responderId => dummyPoliceRoster.find(officer => officer.id === responderId));

    					respondersDetails.set(responders);
    				} else {
    					console.error("Alert not found for ID:", alertId);
    				}
    			}
    		}
    	};

    	return [$alertDetails, $respondersDetails, alertDetails, respondersDetails, $params];
    }

    class AlertModal extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$g, create_fragment$g, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "AlertModal",
    			options,
    			id: create_fragment$g.name
    		});
    	}
    }

    const defaultReports = [
        {
            id: 1,
            suspectId: 1,
            suspectName: 'John Doe',
            reportTitle: 'Speeding',
            reportDescription: 'Speeding on the highway',
            location: 'Route 68',
            itemsConfiscated: 'None',
            jailTime: 0,
            originalFine: 100.00,
            reducedFine: 100.00,
            fineReduction: 'None',
            station: 'Mission Row PD',
            arrestingLawmenId: 2,
            arrestingLawmenName: 'Jane Doe',
            dateTime: '2021-09-01 12:00:00'
        },
        {
            id: 2,
            suspectId: 2,
            suspectName: 'Jane Doe',
            reportTitle: 'Reckless Driving',
            reportDescription: 'Reckless driving in the city',
            location: 'Vinewood Boulevard',
            itemsConfiscated: 'None',
            jailTime: 0,
            originalFine: 200.00,
            reducedFine: 200.00,
            fineReduction: 'None',
            station: 'Mission Row PD',
            arrestingLawmenId: 1,
            arrestingLawmenName: 'John Doe',
            dateTime: '2021-09-01 12:00:00'
        }
    ];

    const defaultReportsbySuspect = [
        {
            id: 1,
            suspectId: 1,
            suspectName: 'John Doe',
            suspectJob: 'Unemployed',
            reportTitle: 'Speeding',
            reportDescription: 'Speeding on the highway',
            location: 'Route 68',
            itemsConfiscated: 'None',
            jailTime: 0,
            originalFine: 100.00,
            reducedFine: 100.00,
            fineReduction: 'None',
            station: 'Mission Row PD',
            arrestingLawmenId: 2,
            arrestingLawmenName: 'Jane Doe',
            dateTime: '2021-09-01 12:00:00'
        },
        {
            id: 2,
            suspectId: 1,
            suspectName: 'John Doe',
            suspectJob: 'Unemployed',
            reportTitle: 'Reckless Driving',
            reportDescription: 'Reckless driving in the city',
            location: 'Vinewood Boulevard',
            itemsConfiscated: 'None',
            jailTime: 0,
            originalFine: 200.00,
            reducedFine: 200.00,
            fineReduction: 'None',
            station: 'Mission Row PD',
            arrestingLawmenId: 1,
            arrestingLawmenName: 'Jane Doe',
            dateTime: '2021-09-01 12:00:00'
        }
    ];

    const Reports = writable(defaultReports);
    const Report = writable({});
    const ReportsBySuspect = writable(defaultReportsbySuspect);
    const TotalReportPages = writable(0);
    //export const SearchedReports = writable([]);





    window.addEventListener("message", (event) => {
        const data = event.data;
        switch (data.type) {
            case "receiveReports":
                setReports(data.reports);
                break;
            case "receiveReport":
                setReport(data.report);
                break;
            case "receiveReportsBySuspect":
                setReportsBySuspect(data.reports);
                break;
            case "receiveTotalReportPages":
                setTotalReportPages(data.pages);
                break;
            case "receiveSearchedReports":
                setReports(data.reports);
                break;
            case "receiveTotalReportPagesBySuspect":
                setTotalReportPages(data.pages);
                break;
        }
    });

    function setReports(data) {
        Reports.set(data);
    }

    function setReport(data) {
        Report.set(data);
    }

    function setReportsBySuspect(data) {
        ReportsBySuspect.set(data);
    }

    function setTotalReportPages(data) {
        TotalReportPages.set(data);
    }

    function createReport(data) {
        {
            Reports.update(reports => {
                const newReport = {
                    id: reports.length + 1,
                    suspectId: data.suspectId,
                    suspectName: 'Sergi Doe',
                    suspectJob: 'Unemployed',
                    reportTitle: data.reportTitle,
                    reportDescription: data.reportDescription,
                    location: data.location,
                    itemsConfiscated: data.itemsConfiscated,
                    jailTime: data.jailTime,
                    originalFine: data.originalFine,
                    reducedFine: data.reducedFine,
                    fineReduction: data.fineReduction,
                    station: data.station,
                    arrestingLawmenId: data.arrestingLawmenId,
                    arrestingLawmenName: 'David Doe',
                    dateTime: data.dateTime
                };
                
                return [...reports, newReport];
            });
        }
    }

    function getReports(page) {
        {
            Reports.subscribe(value => {
                if (value.length === 0) {
                    setReports([
                        {
                            id: 1,
                            suspectId: 1,
                            suspectName: 'John Doe',
                            suspectJob: 'Unemployed',
                            reportTitle: 'Speeding',
                            reportDescription: 'Speeding on the highway',
                            location: 'Route 68',
                            itemsConfiscated: 'None',
                            jailTime: 0,
                            originalFine: 100.00,
                            reducedFine: 100.00,
                            fineReduction: 'None',
                            station: 'Mission Row PD',
                            arrestingLawmenId: 2,
                            arrestingLawmenName: 'Jane Doe',
                            dateTime: '2021-09-01 12:00:00'
                        },
                        {
                            id: 2,
                            suspectId: 2,
                            suspectName: 'Jane Doe',
                            suspectJob: 'Unemployed',
                            reportTitle: 'Reckless Driving',
                            reportDescription: 'Reckless driving in the city',
                            location: 'Vinewood Boulevard',
                            itemsConfiscated: 'None',
                            jailTime: 0,
                            originalFine: 200.00,
                            reducedFine: 200.00,
                            fineReduction: 'None',
                            station: 'Mission Row PD',
                            arrestingLawmenId: 1,
                            arrestingLawmenName: 'John Doe',
                            dateTime: '2021-09-01 12:00:00'
                        }
                    ]);
                }
            });
        }
        getTotalReportPages();
    }

    function getReport(reportId) {
        {
            setReport({
                id: 1,
                suspectId: 1,
                suspectName: 'John Doe',
                suspectJob: 'Unemployed',
                reportTitle: 'Speeding',
                reportDescription: 'Speeding on the highway',
                location: 'Route 68',
                itemsConfiscated: 'None',
                jailTime: 0,
                originalFine: 100.00,
                reducedFine: 100.00,
                fineReduction: 'None',
                station: 'Mission Row PD',
                arrestingLawmenId: 2,
                arrestingLawmenName: 'Jane Doe',
                dateTime: '2021-09-01 12:00:00'
            });
        }
    }

    function getReportsBySuspect(suspectId) {
        {
            setReportsBySuspect(defaultReportsbySuspect);   
        }    getTotalReportPagesBySuspect(suspectId);
    }

    function getSearchedReports(search) {
        {
            if (search === '') {
                Reports.set(defaultReports);
                return;
            }
            Reports.update(reports => {
                const filteredReports = reports.filter(report => {
                    return report.reportTitle.toLowerCase().includes(search.toLowerCase()) ||
                        report.reportDescription.toLowerCase().includes(search.toLowerCase()) ||
                        report.location.toLowerCase().includes(search.toLowerCase()) ||
                        report.station.toLowerCase().includes(search.toLowerCase()) ||
                        report.suspectId.toString() === search ||
                        report.arrestingLawmenId.toString() === search;
                });
                return filteredReports;
            });
        }
    }

    function getTotalReportPages() {
        {
            // Get the total number of reports and divide it by MaxItemsPerTablePage
            let totalReportPages = Math.ceil(defaultReports.length / MaxItemsPerTablePage);
            setTotalReportPages(totalReportPages);
        }
    }

    function getTotalReportPagesBySuspect(suspectId) {
        {
            // Get the total number of reports by the suspect ID and divide it by MaxItemsPerTablePage
            let reportsBySuspect = defaultReportsbySuspect.filter(report => report.suspectId === suspectId);
            let totalReportPages = Math.ceil(reportsBySuspect.length / MaxItemsPerTablePage);
            setTotalReportPages(totalReportPages);
        }
    }

    /* src\Reports\ArrestReport.svelte generated by Svelte v3.59.2 */

    const { console: console_1$a } = globals;
    const file$f = "src\\Reports\\ArrestReport.svelte";

    function get_each_context$b(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[22] = list[i];
    	return child_ctx;
    }

    function get_each_context_1$3(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[25] = list[i];
    	return child_ctx;
    }

    // (67:6) {#each $Reports as report}
    function create_each_block_1$3(ctx) {
    	let tr;
    	let td0;
    	let t0_value = /*report*/ ctx[25].dateTime + "";
    	let t0;
    	let t1;
    	let td1;
    	let t2_value = /*report*/ ctx[25].id + "";
    	let t2;
    	let t3;
    	let td2;
    	let t4_value = /*report*/ ctx[25].suspectName + "";
    	let t4;
    	let t5;
    	let td3;
    	let t6_value = /*report*/ ctx[25].arrestingLawmenName + "";
    	let t6;
    	let t7;
    	let mounted;
    	let dispose;

    	function click_handler() {
    		return /*click_handler*/ ctx[15](/*report*/ ctx[25]);
    	}

    	const block = {
    		c: function create() {
    			tr = element("tr");
    			td0 = element("td");
    			t0 = text(t0_value);
    			t1 = space();
    			td1 = element("td");
    			t2 = text(t2_value);
    			t3 = space();
    			td2 = element("td");
    			t4 = text(t4_value);
    			t5 = space();
    			td3 = element("td");
    			t6 = text(t6_value);
    			t7 = space();
    			attr_dev(td0, "class", "svelte-489zah");
    			add_location(td0, file$f, 68, 10, 1729);
    			attr_dev(td1, "class", "svelte-489zah");
    			add_location(td1, file$f, 69, 10, 1767);
    			attr_dev(td2, "class", "svelte-489zah");
    			add_location(td2, file$f, 70, 10, 1799);
    			attr_dev(td3, "class", "svelte-489zah");
    			add_location(td3, file$f, 71, 10, 1840);
    			attr_dev(tr, "class", "svelte-489zah");
    			add_location(tr, file$f, 67, 8, 1661);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, tr, anchor);
    			append_dev(tr, td0);
    			append_dev(td0, t0);
    			append_dev(tr, t1);
    			append_dev(tr, td1);
    			append_dev(td1, t2);
    			append_dev(tr, t3);
    			append_dev(tr, td2);
    			append_dev(td2, t4);
    			append_dev(tr, t5);
    			append_dev(tr, td3);
    			append_dev(td3, t6);
    			append_dev(tr, t7);

    			if (!mounted) {
    				dispose = listen_dev(tr, "click", click_handler, false, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty & /*$Reports*/ 4 && t0_value !== (t0_value = /*report*/ ctx[25].dateTime + "")) set_data_dev(t0, t0_value);
    			if (dirty & /*$Reports*/ 4 && t2_value !== (t2_value = /*report*/ ctx[25].id + "")) set_data_dev(t2, t2_value);
    			if (dirty & /*$Reports*/ 4 && t4_value !== (t4_value = /*report*/ ctx[25].suspectName + "")) set_data_dev(t4, t4_value);
    			if (dirty & /*$Reports*/ 4 && t6_value !== (t6_value = /*report*/ ctx[25].arrestingLawmenName + "")) set_data_dev(t6, t6_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(tr);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1$3.name,
    		type: "each",
    		source: "(67:6) {#each $Reports as report}",
    		ctx
    	});

    	return block;
    }

    // (79:0) {#if $TotalReportPages > 1}
    function create_if_block$b(ctx) {
    	let nav;
    	let button0;
    	let t0;
    	let button0_disabled_value;
    	let t1;
    	let button1;
    	let t2;
    	let button1_disabled_value;
    	let t3;
    	let t4;
    	let button2;
    	let t5;
    	let button2_disabled_value;
    	let t6;
    	let button3;
    	let t7;
    	let button3_disabled_value;
    	let mounted;
    	let dispose;
    	let each_value = getPaginationRange(/*$currentPage*/ ctx[5], /*$TotalReportPages*/ ctx[4], 2);
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$b(get_each_context$b(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			nav = element("nav");
    			button0 = element("button");
    			t0 = text("First");
    			t1 = space();
    			button1 = element("button");
    			t2 = text("Prev");
    			t3 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t4 = space();
    			button2 = element("button");
    			t5 = text("Next");
    			t6 = space();
    			button3 = element("button");
    			t7 = text("Last");
    			button0.disabled = button0_disabled_value = /*$currentPage*/ ctx[5] === 1;
    			attr_dev(button0, "class", "svelte-489zah");
    			add_location(button0, file$f, 80, 4, 2006);
    			button1.disabled = button1_disabled_value = /*$currentPage*/ ctx[5] === 1;
    			attr_dev(button1, "class", "svelte-489zah");
    			add_location(button1, file$f, 81, 4, 2093);
    			button2.disabled = button2_disabled_value = /*$currentPage*/ ctx[5] === TotalReportPages;
    			attr_dev(button2, "class", "svelte-489zah");
    			add_location(button2, file$f, 101, 4, 2868);
    			button3.disabled = button3_disabled_value = /*$currentPage*/ ctx[5] === TotalReportPages;
    			attr_dev(button3, "class", "svelte-489zah");
    			add_location(button3, file$f, 102, 4, 2984);
    			attr_dev(nav, "class", "pagination svelte-489zah");
    			add_location(nav, file$f, 79, 2, 1976);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, nav, anchor);
    			append_dev(nav, button0);
    			append_dev(button0, t0);
    			append_dev(nav, t1);
    			append_dev(nav, button1);
    			append_dev(button1, t2);
    			append_dev(nav, t3);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				if (each_blocks[i]) {
    					each_blocks[i].m(nav, null);
    				}
    			}

    			append_dev(nav, t4);
    			append_dev(nav, button2);
    			append_dev(button2, t5);
    			append_dev(nav, t6);
    			append_dev(nav, button3);
    			append_dev(button3, t7);

    			if (!mounted) {
    				dispose = [
    					listen_dev(button0, "click", /*click_handler_1*/ ctx[16], false, false, false, false),
    					listen_dev(button1, "click", /*click_handler_2*/ ctx[17], false, false, false, false),
    					listen_dev(button2, "click", /*click_handler_4*/ ctx[20], false, false, false, false),
    					listen_dev(button3, "click", /*click_handler_5*/ ctx[21], false, false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$currentPage*/ 32 && button0_disabled_value !== (button0_disabled_value = /*$currentPage*/ ctx[5] === 1)) {
    				prop_dev(button0, "disabled", button0_disabled_value);
    			}

    			if (dirty & /*$currentPage*/ 32 && button1_disabled_value !== (button1_disabled_value = /*$currentPage*/ ctx[5] === 1)) {
    				prop_dev(button1, "disabled", button1_disabled_value);
    			}

    			if (dirty & /*handlePageSubmit, TotalReportPages, inputPage, handlePageInputChange, isEllipsisClicked, handleEllipsisClick, getPaginationRange, $currentPage, $TotalReportPages, undefined, goToPage*/ 15411) {
    				each_value = getPaginationRange(/*$currentPage*/ ctx[5], /*$TotalReportPages*/ ctx[4], 2);
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$b(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$b(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(nav, t4);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}

    			if (dirty & /*$currentPage*/ 32 && button2_disabled_value !== (button2_disabled_value = /*$currentPage*/ ctx[5] === TotalReportPages)) {
    				prop_dev(button2, "disabled", button2_disabled_value);
    			}

    			if (dirty & /*$currentPage*/ 32 && button3_disabled_value !== (button3_disabled_value = /*$currentPage*/ ctx[5] === TotalReportPages)) {
    				prop_dev(button3, "disabled", button3_disabled_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(nav);
    			destroy_each(each_blocks, detaching);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$b.name,
    		type: "if",
    		source: "(79:0) {#if $TotalReportPages > 1}",
    		ctx
    	});

    	return block;
    }

    // (92:6) {:else}
    function create_else_block_1$1(ctx) {
    	let button;
    	let t_value = /*page*/ ctx[22] + "";
    	let t;
    	let button_aria_current_value;
    	let mounted;
    	let dispose;

    	function click_handler_3() {
    		return /*click_handler_3*/ ctx[19](/*page*/ ctx[22]);
    	}

    	const block = {
    		c: function create() {
    			button = element("button");
    			t = text(t_value);

    			attr_dev(button, "aria-current", button_aria_current_value = /*$currentPage*/ ctx[5] === /*page*/ ctx[22]
    			? 'page'
    			: undefined);

    			attr_dev(button, "class", "svelte-489zah");
    			toggle_class(button, "active", /*$currentPage*/ ctx[5] === /*page*/ ctx[22]);
    			add_location(button, file$f, 92, 8, 2629);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			append_dev(button, t);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", click_handler_3, false, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty & /*$currentPage, $TotalReportPages*/ 48 && t_value !== (t_value = /*page*/ ctx[22] + "")) set_data_dev(t, t_value);

    			if (dirty & /*$currentPage, $TotalReportPages*/ 48 && button_aria_current_value !== (button_aria_current_value = /*$currentPage*/ ctx[5] === /*page*/ ctx[22]
    			? 'page'
    			: undefined)) {
    				attr_dev(button, "aria-current", button_aria_current_value);
    			}

    			if (dirty & /*$currentPage, getPaginationRange, $TotalReportPages*/ 48) {
    				toggle_class(button, "active", /*$currentPage*/ ctx[5] === /*page*/ ctx[22]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_1$1.name,
    		type: "else",
    		source: "(92:6) {:else}",
    		ctx
    	});

    	return block;
    }

    // (85:6) {#if page === '...'}
    function create_if_block_1$6(ctx) {
    	let if_block_anchor;

    	function select_block_type_1(ctx, dirty) {
    		if (/*isEllipsisClicked*/ ctx[0]) return create_if_block_2$3;
    		return create_else_block$5;
    	}

    	let current_block_type = select_block_type_1(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (current_block_type === (current_block_type = select_block_type_1(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			}
    		},
    		d: function destroy(detaching) {
    			if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$6.name,
    		type: "if",
    		source: "(85:6) {#if page === '...'}",
    		ctx
    	});

    	return block;
    }

    // (89:8) {:else}
    function create_else_block$5(ctx) {
    	let button;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			button.textContent = "...";
    			attr_dev(button, "class", "svelte-489zah");
    			add_location(button, file$f, 89, 10, 2538);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*handleEllipsisClick*/ ctx[11], false, false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$5.name,
    		type: "else",
    		source: "(89:8) {:else}",
    		ctx
    	});

    	return block;
    }

    // (86:8) {#if isEllipsisClicked}
    function create_if_block_2$3(ctx) {
    	let input;
    	let t0;
    	let button;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			input = element("input");
    			t0 = space();
    			button = element("button");
    			button.textContent = "Go";
    			attr_dev(input, "type", "number");
    			attr_dev(input, "min", "1");
    			attr_dev(input, "max", TotalReportPages);
    			attr_dev(input, "class", "svelte-489zah");
    			add_location(input, file$f, 86, 10, 2339);
    			attr_dev(button, "class", "svelte-489zah");
    			add_location(button, file$f, 87, 10, 2462);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, input, anchor);
    			set_input_value(input, /*inputPage*/ ctx[1]);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, button, anchor);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input, "input", /*input_input_handler_1*/ ctx[18]),
    					listen_dev(input, "change", /*handlePageInputChange*/ ctx[12], false, false, false, false),
    					listen_dev(button, "click", /*handlePageSubmit*/ ctx[13], false, false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*inputPage*/ 2 && to_number(input.value) !== /*inputPage*/ ctx[1]) {
    				set_input_value(input, /*inputPage*/ ctx[1]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(input);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(button);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$3.name,
    		type: "if",
    		source: "(86:8) {#if isEllipsisClicked}",
    		ctx
    	});

    	return block;
    }

    // (84:4) {#each getPaginationRange($currentPage, $TotalReportPages, 2) as page}
    function create_each_block$b(ctx) {
    	let if_block_anchor;

    	function select_block_type(ctx, dirty) {
    		if (/*page*/ ctx[22] === '...') return create_if_block_1$6;
    		return create_else_block_1$1;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			}
    		},
    		d: function destroy(detaching) {
    			if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$b.name,
    		type: "each",
    		source: "(84:4) {#each getPaginationRange($currentPage, $TotalReportPages, 2) as page}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$f(ctx) {
    	let div0;
    	let input;
    	let t0;
    	let button;
    	let t2;
    	let div1;
    	let table;
    	let thead;
    	let tr;
    	let th0;
    	let t4;
    	let th1;
    	let t6;
    	let th2;
    	let t8;
    	let th3;
    	let t10;
    	let tbody;
    	let t11;
    	let if_block_anchor;
    	let mounted;
    	let dispose;
    	let each_value_1 = /*$Reports*/ ctx[2];
    	validate_each_argument(each_value_1);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks[i] = create_each_block_1$3(get_each_context_1$3(ctx, each_value_1, i));
    	}

    	let if_block = /*$TotalReportPages*/ ctx[4] > 1 && create_if_block$b(ctx);

    	const block = {
    		c: function create() {
    			div0 = element("div");
    			input = element("input");
    			t0 = space();
    			button = element("button");
    			button.textContent = "New Report";
    			t2 = space();
    			div1 = element("div");
    			table = element("table");
    			thead = element("thead");
    			tr = element("tr");
    			th0 = element("th");
    			th0.textContent = "Date";
    			t4 = space();
    			th1 = element("th");
    			th1.textContent = "Report ID";
    			t6 = space();
    			th2 = element("th");
    			th2.textContent = "Suspect Name";
    			t8 = space();
    			th3 = element("th");
    			th3.textContent = "Arresting Officer";
    			t10 = space();
    			tbody = element("tbody");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t11 = space();
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    			attr_dev(input, "type", "text");
    			attr_dev(input, "placeholder", "Search Reports...");
    			attr_dev(input, "class", "svelte-489zah");
    			add_location(input, file$f, 50, 2, 1241);
    			attr_dev(div0, "class", "search-container svelte-489zah");
    			add_location(div0, file$f, 49, 0, 1207);
    			add_location(button, file$f, 53, 0, 1330);
    			attr_dev(th0, "class", "svelte-489zah");
    			add_location(th0, file$f, 59, 8, 1469);
    			attr_dev(th1, "class", "svelte-489zah");
    			add_location(th1, file$f, 60, 8, 1492);
    			attr_dev(th2, "class", "svelte-489zah");
    			add_location(th2, file$f, 61, 8, 1520);
    			attr_dev(th3, "class", "svelte-489zah");
    			add_location(th3, file$f, 62, 8, 1551);
    			attr_dev(tr, "class", "svelte-489zah");
    			add_location(tr, file$f, 58, 6, 1455);
    			add_location(thead, file$f, 57, 4, 1440);
    			add_location(tbody, file$f, 65, 4, 1610);
    			attr_dev(table, "class", "svelte-489zah");
    			add_location(table, file$f, 56, 2, 1427);
    			attr_dev(div1, "class", "reports-container svelte-489zah");
    			add_location(div1, file$f, 55, 0, 1392);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div0, anchor);
    			append_dev(div0, input);
    			set_input_value(input, /*$searchQuery*/ ctx[3]);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, button, anchor);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, div1, anchor);
    			append_dev(div1, table);
    			append_dev(table, thead);
    			append_dev(thead, tr);
    			append_dev(tr, th0);
    			append_dev(tr, t4);
    			append_dev(tr, th1);
    			append_dev(tr, t6);
    			append_dev(tr, th2);
    			append_dev(tr, t8);
    			append_dev(tr, th3);
    			append_dev(table, t10);
    			append_dev(table, tbody);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				if (each_blocks[i]) {
    					each_blocks[i].m(tbody, null);
    				}
    			}

    			insert_dev(target, t11, anchor);
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input, "input", /*input_input_handler*/ ctx[14]),
    					listen_dev(button, "click", /*navigateToNewReport*/ ctx[8], false, false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*$searchQuery*/ 8 && input.value !== /*$searchQuery*/ ctx[3]) {
    				set_input_value(input, /*$searchQuery*/ ctx[3]);
    			}

    			if (dirty & /*navigateToReportDetails, $Reports*/ 516) {
    				each_value_1 = /*$Reports*/ ctx[2];
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1$3(ctx, each_value_1, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_1$3(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(tbody, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_1.length;
    			}

    			if (/*$TotalReportPages*/ ctx[4] > 1) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$b(ctx);
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div0);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(button);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(div1);
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(t11);
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$f.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const reportsPerPage = 1;

    function instance$f($$self, $$props, $$invalidate) {
    	let $Reports;
    	let $searchQuery;
    	let $TotalReportPages;
    	let $currentPage;
    	validate_store(Reports, 'Reports');
    	component_subscribe($$self, Reports, $$value => $$invalidate(2, $Reports = $$value));
    	validate_store(TotalReportPages, 'TotalReportPages');
    	component_subscribe($$self, TotalReportPages, $$value => $$invalidate(4, $TotalReportPages = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('ArrestReport', slots, []);
    	let searchQuery = writable('');
    	validate_store(searchQuery, 'searchQuery');
    	component_subscribe($$self, searchQuery, value => $$invalidate(3, $searchQuery = value));
    	let currentPage = writable(1);
    	validate_store(currentPage, 'currentPage');
    	component_subscribe($$self, currentPage, value => $$invalidate(5, $currentPage = value));
    	let isEllipsisClicked = false;
    	let inputPage = '';

    	onMount(() => {
    		getReports();
    		console.log('Reports:', $Reports);
    	});

    	function navigateToNewReport() {
    		push('/new-report');
    	}

    	function navigateToReportDetails(reportId) {
    		push(`/report-details/${reportId}`);
    	}

    	function goToPage(page) {
    		currentPage.set(page);
    		$$invalidate(0, isEllipsisClicked = false);
    		$$invalidate(1, inputPage = '');
    	}

    	function handleEllipsisClick() {
    		$$invalidate(0, isEllipsisClicked = true);
    	}

    	function handlePageInputChange(event) {
    		$$invalidate(1, inputPage = event.target.value);
    	}

    	function handlePageSubmit() {
    		const pageNum = parseInt(inputPage);

    		if (!isNaN(pageNum) && pageNum > 0 && pageNum <= TotalReportPages) {
    			goToPage(pageNum);
    		}

    		$$invalidate(0, isEllipsisClicked = false);
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$a.warn(`<ArrestReport> was created with unknown prop '${key}'`);
    	});

    	function input_input_handler() {
    		$searchQuery = this.value;
    		searchQuery.set($searchQuery);
    	}

    	const click_handler = report => navigateToReportDetails(report.id);
    	const click_handler_1 = () => goToPage(1);
    	const click_handler_2 = () => goToPage($currentPage - 1);

    	function input_input_handler_1() {
    		inputPage = to_number(this.value);
    		$$invalidate(1, inputPage);
    	}

    	const click_handler_3 = page => goToPage(page);
    	const click_handler_4 = () => goToPage($currentPage + 1);
    	const click_handler_5 = () => goToPage(TotalReportPages);

    	$$self.$capture_state = () => ({
    		push,
    		writable,
    		derived,
    		getReports,
    		Reports,
    		TotalReportPages,
    		onMount,
    		getPaginationRange,
    		searchQuery,
    		currentPage,
    		reportsPerPage,
    		isEllipsisClicked,
    		inputPage,
    		navigateToNewReport,
    		navigateToReportDetails,
    		goToPage,
    		handleEllipsisClick,
    		handlePageInputChange,
    		handlePageSubmit,
    		$Reports,
    		$searchQuery,
    		$TotalReportPages,
    		$currentPage
    	});

    	$$self.$inject_state = $$props => {
    		if ('searchQuery' in $$props) $$invalidate(6, searchQuery = $$props.searchQuery);
    		if ('currentPage' in $$props) $$invalidate(7, currentPage = $$props.currentPage);
    		if ('isEllipsisClicked' in $$props) $$invalidate(0, isEllipsisClicked = $$props.isEllipsisClicked);
    		if ('inputPage' in $$props) $$invalidate(1, inputPage = $$props.inputPage);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		isEllipsisClicked,
    		inputPage,
    		$Reports,
    		$searchQuery,
    		$TotalReportPages,
    		$currentPage,
    		searchQuery,
    		currentPage,
    		navigateToNewReport,
    		navigateToReportDetails,
    		goToPage,
    		handleEllipsisClick,
    		handlePageInputChange,
    		handlePageSubmit,
    		input_input_handler,
    		click_handler,
    		click_handler_1,
    		click_handler_2,
    		input_input_handler_1,
    		click_handler_3,
    		click_handler_4,
    		click_handler_5
    	];
    }

    class ArrestReport extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$f, create_fragment$f, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ArrestReport",
    			options,
    			id: create_fragment$f.name
    		});
    	}
    }

    /* src\Reports\ReportDetails.svelte generated by Svelte v3.59.2 */

    const { console: console_1$9 } = globals;
    const file$e = "src\\Reports\\ReportDetails.svelte";

    // (45:0) {:else}
    function create_else_block$4(ctx) {
    	let p;

    	const block = {
    		c: function create() {
    			p = element("p");
    			p.textContent = "Loading report details...";
    			add_location(p, file$e, 45, 2, 1691);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$4.name,
    		type: "else",
    		source: "(45:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (22:0) {#if $Report}
    function create_if_block$a(ctx) {
    	let div1;
    	let div0;
    	let h2;
    	let t0_value = /*$Report*/ ctx[0].reportTitle + "";
    	let t0;
    	let t1;
    	let button;
    	let t3;
    	let p0;
    	let strong0;
    	let t5;
    	let t6_value = /*$Report*/ ctx[0].reportDescription + "";
    	let t6;
    	let t7;
    	let p1;
    	let strong1;
    	let t9;
    	let t10_value = /*$Report*/ ctx[0].suspectId + "";
    	let t10;
    	let t11;
    	let p2;
    	let strong2;
    	let t13;
    	let t14_value = /*$Report*/ ctx[0].suspectName + "";
    	let t14;
    	let t15;
    	let p3;
    	let strong3;
    	let t17;
    	let t18_value = /*$Report*/ ctx[0].suspectJob + "";
    	let t18;
    	let t19;
    	let p4;
    	let strong4;
    	let t21;
    	let t22_value = /*$Report*/ ctx[0].dateTime + "";
    	let t22;
    	let t23;
    	let p5;
    	let strong5;
    	let t25;
    	let t26_value = /*$Report*/ ctx[0].location + "";
    	let t26;
    	let t27;
    	let p6;
    	let strong6;
    	let t29;
    	let t30_value = /*$Report*/ ctx[0].arrestingLawmenName + "";
    	let t30;
    	let t31;
    	let t32_value = /*$Report*/ ctx[0].arrestingLawmenId + "";
    	let t32;
    	let t33;
    	let t34;
    	let p7;
    	let strong7;
    	let t36;
    	let t37_value = /*$Report*/ ctx[0].itemsConfiscated + "";
    	let t37;
    	let t38;
    	let p8;
    	let strong8;
    	let t40;
    	let t41_value = /*$Report*/ ctx[0].chargeDetails + "";
    	let t41;
    	let t42;
    	let p9;
    	let strong9;
    	let t44;
    	let t45_value = /*$Report*/ ctx[0].jailTime + "";
    	let t45;
    	let t46;
    	let p10;
    	let strong10;
    	let t48;
    	let t49_value = /*$Report*/ ctx[0].originalFine + "";
    	let t49;
    	let t50;
    	let p11;
    	let strong11;
    	let t52;
    	let t53_value = /*$Report*/ ctx[0].reducedFine + "";
    	let t53;
    	let t54;
    	let p12;
    	let strong12;
    	let t56;
    	let t57_value = /*$Report*/ ctx[0].fineReduction + "";
    	let t57;
    	let t58;
    	let p13;
    	let strong13;
    	let t60;
    	let t61_value = /*$Report*/ ctx[0].station + "";
    	let t61;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			h2 = element("h2");
    			t0 = text(t0_value);
    			t1 = space();
    			button = element("button");
    			button.textContent = "← Back";
    			t3 = space();
    			p0 = element("p");
    			strong0 = element("strong");
    			strong0.textContent = "Description:";
    			t5 = space();
    			t6 = text(t6_value);
    			t7 = space();
    			p1 = element("p");
    			strong1 = element("strong");
    			strong1.textContent = "Suspect Id:";
    			t9 = space();
    			t10 = text(t10_value);
    			t11 = space();
    			p2 = element("p");
    			strong2 = element("strong");
    			strong2.textContent = "Suspect Name:";
    			t13 = space();
    			t14 = text(t14_value);
    			t15 = space();
    			p3 = element("p");
    			strong3 = element("strong");
    			strong3.textContent = "Suspect Job:";
    			t17 = space();
    			t18 = text(t18_value);
    			t19 = space();
    			p4 = element("p");
    			strong4 = element("strong");
    			strong4.textContent = "Date/Time:";
    			t21 = space();
    			t22 = text(t22_value);
    			t23 = space();
    			p5 = element("p");
    			strong5 = element("strong");
    			strong5.textContent = "Location:";
    			t25 = space();
    			t26 = text(t26_value);
    			t27 = space();
    			p6 = element("p");
    			strong6 = element("strong");
    			strong6.textContent = "Arresting Officer:";
    			t29 = space();
    			t30 = text(t30_value);
    			t31 = text(" (ID: ");
    			t32 = text(t32_value);
    			t33 = text(")");
    			t34 = space();
    			p7 = element("p");
    			strong7 = element("strong");
    			strong7.textContent = "Items Confiscated:";
    			t36 = space();
    			t37 = text(t37_value);
    			t38 = space();
    			p8 = element("p");
    			strong8 = element("strong");
    			strong8.textContent = "Charges:";
    			t40 = space();
    			t41 = text(t41_value);
    			t42 = space();
    			p9 = element("p");
    			strong9 = element("strong");
    			strong9.textContent = "Jail Time:";
    			t44 = space();
    			t45 = text(t45_value);
    			t46 = space();
    			p10 = element("p");
    			strong10 = element("strong");
    			strong10.textContent = "Original Fine:";
    			t48 = space();
    			t49 = text(t49_value);
    			t50 = space();
    			p11 = element("p");
    			strong11 = element("strong");
    			strong11.textContent = "Reduced Fine:";
    			t52 = space();
    			t53 = text(t53_value);
    			t54 = space();
    			p12 = element("p");
    			strong12 = element("strong");
    			strong12.textContent = "Fine Reduction:";
    			t56 = space();
    			t57 = text(t57_value);
    			t58 = space();
    			p13 = element("p");
    			strong13 = element("strong");
    			strong13.textContent = "Station:";
    			t60 = space();
    			t61 = text(t61_value);
    			attr_dev(h2, "class", "svelte-190dqfa");
    			add_location(h2, file$e, 25, 6, 614);
    			attr_dev(button, "class", "back-button svelte-190dqfa");
    			add_location(button, file$e, 26, 6, 652);
    			attr_dev(div0, "class", "header svelte-190dqfa");
    			add_location(div0, file$e, 24, 4, 586);
    			add_location(strong0, file$e, 29, 7, 736);
    			add_location(p0, file$e, 29, 4, 733);
    			add_location(strong1, file$e, 30, 7, 806);
    			add_location(p1, file$e, 30, 4, 803);
    			add_location(strong2, file$e, 31, 7, 867);
    			add_location(p2, file$e, 31, 4, 864);
    			add_location(strong3, file$e, 32, 7, 932);
    			add_location(p3, file$e, 32, 4, 929);
    			add_location(strong4, file$e, 33, 7, 995);
    			add_location(p4, file$e, 33, 4, 992);
    			add_location(strong5, file$e, 34, 7, 1054);
    			add_location(p5, file$e, 34, 4, 1051);
    			add_location(strong6, file$e, 35, 7, 1112);
    			add_location(p6, file$e, 35, 4, 1109);
    			add_location(strong7, file$e, 36, 7, 1224);
    			add_location(p7, file$e, 36, 4, 1221);
    			add_location(strong8, file$e, 37, 7, 1299);
    			add_location(p8, file$e, 37, 4, 1296);
    			add_location(strong9, file$e, 38, 7, 1361);
    			add_location(p9, file$e, 38, 4, 1358);
    			add_location(strong10, file$e, 39, 7, 1420);
    			add_location(p10, file$e, 39, 4, 1417);
    			add_location(strong11, file$e, 40, 7, 1487);
    			add_location(p11, file$e, 40, 4, 1484);
    			add_location(strong12, file$e, 41, 7, 1552);
    			add_location(p12, file$e, 41, 4, 1549);
    			add_location(strong13, file$e, 42, 7, 1621);
    			add_location(p13, file$e, 42, 4, 1618);
    			attr_dev(div1, "class", "report-details-container svelte-190dqfa");
    			add_location(div1, file$e, 22, 2, 494);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			append_dev(div0, h2);
    			append_dev(h2, t0);
    			append_dev(div0, t1);
    			append_dev(div0, button);
    			append_dev(div1, t3);
    			append_dev(div1, p0);
    			append_dev(p0, strong0);
    			append_dev(p0, t5);
    			append_dev(p0, t6);
    			append_dev(div1, t7);
    			append_dev(div1, p1);
    			append_dev(p1, strong1);
    			append_dev(p1, t9);
    			append_dev(p1, t10);
    			append_dev(div1, t11);
    			append_dev(div1, p2);
    			append_dev(p2, strong2);
    			append_dev(p2, t13);
    			append_dev(p2, t14);
    			append_dev(div1, t15);
    			append_dev(div1, p3);
    			append_dev(p3, strong3);
    			append_dev(p3, t17);
    			append_dev(p3, t18);
    			append_dev(div1, t19);
    			append_dev(div1, p4);
    			append_dev(p4, strong4);
    			append_dev(p4, t21);
    			append_dev(p4, t22);
    			append_dev(div1, t23);
    			append_dev(div1, p5);
    			append_dev(p5, strong5);
    			append_dev(p5, t25);
    			append_dev(p5, t26);
    			append_dev(div1, t27);
    			append_dev(div1, p6);
    			append_dev(p6, strong6);
    			append_dev(p6, t29);
    			append_dev(p6, t30);
    			append_dev(p6, t31);
    			append_dev(p6, t32);
    			append_dev(p6, t33);
    			append_dev(div1, t34);
    			append_dev(div1, p7);
    			append_dev(p7, strong7);
    			append_dev(p7, t36);
    			append_dev(p7, t37);
    			append_dev(div1, t38);
    			append_dev(div1, p8);
    			append_dev(p8, strong8);
    			append_dev(p8, t40);
    			append_dev(p8, t41);
    			append_dev(div1, t42);
    			append_dev(div1, p9);
    			append_dev(p9, strong9);
    			append_dev(p9, t44);
    			append_dev(p9, t45);
    			append_dev(div1, t46);
    			append_dev(div1, p10);
    			append_dev(p10, strong10);
    			append_dev(p10, t48);
    			append_dev(p10, t49);
    			append_dev(div1, t50);
    			append_dev(div1, p11);
    			append_dev(p11, strong11);
    			append_dev(p11, t52);
    			append_dev(p11, t53);
    			append_dev(div1, t54);
    			append_dev(div1, p12);
    			append_dev(p12, strong12);
    			append_dev(p12, t56);
    			append_dev(p12, t57);
    			append_dev(div1, t58);
    			append_dev(div1, p13);
    			append_dev(p13, strong13);
    			append_dev(p13, t60);
    			append_dev(p13, t61);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*goBack*/ ctx[1], false, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$Report*/ 1 && t0_value !== (t0_value = /*$Report*/ ctx[0].reportTitle + "")) set_data_dev(t0, t0_value);
    			if (dirty & /*$Report*/ 1 && t6_value !== (t6_value = /*$Report*/ ctx[0].reportDescription + "")) set_data_dev(t6, t6_value);
    			if (dirty & /*$Report*/ 1 && t10_value !== (t10_value = /*$Report*/ ctx[0].suspectId + "")) set_data_dev(t10, t10_value);
    			if (dirty & /*$Report*/ 1 && t14_value !== (t14_value = /*$Report*/ ctx[0].suspectName + "")) set_data_dev(t14, t14_value);
    			if (dirty & /*$Report*/ 1 && t18_value !== (t18_value = /*$Report*/ ctx[0].suspectJob + "")) set_data_dev(t18, t18_value);
    			if (dirty & /*$Report*/ 1 && t22_value !== (t22_value = /*$Report*/ ctx[0].dateTime + "")) set_data_dev(t22, t22_value);
    			if (dirty & /*$Report*/ 1 && t26_value !== (t26_value = /*$Report*/ ctx[0].location + "")) set_data_dev(t26, t26_value);
    			if (dirty & /*$Report*/ 1 && t30_value !== (t30_value = /*$Report*/ ctx[0].arrestingLawmenName + "")) set_data_dev(t30, t30_value);
    			if (dirty & /*$Report*/ 1 && t32_value !== (t32_value = /*$Report*/ ctx[0].arrestingLawmenId + "")) set_data_dev(t32, t32_value);
    			if (dirty & /*$Report*/ 1 && t37_value !== (t37_value = /*$Report*/ ctx[0].itemsConfiscated + "")) set_data_dev(t37, t37_value);
    			if (dirty & /*$Report*/ 1 && t41_value !== (t41_value = /*$Report*/ ctx[0].chargeDetails + "")) set_data_dev(t41, t41_value);
    			if (dirty & /*$Report*/ 1 && t45_value !== (t45_value = /*$Report*/ ctx[0].jailTime + "")) set_data_dev(t45, t45_value);
    			if (dirty & /*$Report*/ 1 && t49_value !== (t49_value = /*$Report*/ ctx[0].originalFine + "")) set_data_dev(t49, t49_value);
    			if (dirty & /*$Report*/ 1 && t53_value !== (t53_value = /*$Report*/ ctx[0].reducedFine + "")) set_data_dev(t53, t53_value);
    			if (dirty & /*$Report*/ 1 && t57_value !== (t57_value = /*$Report*/ ctx[0].fineReduction + "")) set_data_dev(t57, t57_value);
    			if (dirty & /*$Report*/ 1 && t61_value !== (t61_value = /*$Report*/ ctx[0].station + "")) set_data_dev(t61, t61_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$a.name,
    		type: "if",
    		source: "(22:0) {#if $Report}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$e(ctx) {
    	let if_block_anchor;

    	function select_block_type(ctx, dirty) {
    		if (/*$Report*/ ctx[0]) return create_if_block$a;
    		return create_else_block$4;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, [dirty]) {
    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$e.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$e($$self, $$props, $$invalidate) {
    	let $Report;
    	validate_store(Report, 'Report');
    	component_subscribe($$self, Report, $$value => $$invalidate(0, $Report = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('ReportDetails', slots, []);
    	let { params } = $$props;

    	onMount(() => {
    		const id = parseInt(params.reportId, 10);
    		console.log("Report ID from URL:", id); // Debugging line
    		getReport();
    	});

    	// Function to navigate back to the previous page
    	function goBack() {
    		pop();
    	}

    	$$self.$$.on_mount.push(function () {
    		if (params === undefined && !('params' in $$props || $$self.$$.bound[$$self.$$.props['params']])) {
    			console_1$9.warn("<ReportDetails> was created without expected prop 'params'");
    		}
    	});

    	const writable_props = ['params'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$9.warn(`<ReportDetails> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('params' in $$props) $$invalidate(2, params = $$props.params);
    	};

    	$$self.$capture_state = () => ({
    		onMount,
    		getReport,
    		Report,
    		pop,
    		params,
    		goBack,
    		$Report
    	});

    	$$self.$inject_state = $$props => {
    		if ('params' in $$props) $$invalidate(2, params = $$props.params);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [$Report, goBack, params];
    }

    class ReportDetails extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$e, create_fragment$e, safe_not_equal, { params: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ReportDetails",
    			options,
    			id: create_fragment$e.name
    		});
    	}

    	get params() {
    		throw new Error("<ReportDetails>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set params(value) {
    		throw new Error("<ReportDetails>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\Reports\ReportForm.svelte generated by Svelte v3.59.2 */

    const { console: console_1$8 } = globals;
    const file$d = "src\\Reports\\ReportForm.svelte";

    function get_each_context$a(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[34] = list[i];
    	return child_ctx;
    }

    function get_each_context_1$2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[37] = list[i];
    	child_ctx[38] = list;
    	child_ctx[39] = i;
    	return child_ctx;
    }

    function get_each_context_2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[40] = list[i];
    	return child_ctx;
    }

    // (134:12) {#each $chargeList as c}
    function create_each_block_2(ctx) {
    	let option;
    	let t_value = /*c*/ ctx[40].charge + "";
    	let t;
    	let option_value_value;

    	const block = {
    		c: function create() {
    			option = element("option");
    			t = text(t_value);
    			option.__value = option_value_value = /*c*/ ctx[40].charge;
    			option.value = option.__value;
    			add_location(option, file$d, 134, 14, 4291);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, option, anchor);
    			append_dev(option, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*$chargeList*/ 8192 && t_value !== (t_value = /*c*/ ctx[40].charge + "")) set_data_dev(t, t_value);

    			if (dirty[0] & /*$chargeList*/ 8192 && option_value_value !== (option_value_value = /*c*/ ctx[40].charge)) {
    				prop_dev(option, "__value", option_value_value);
    				option.value = option.__value;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(option);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_2.name,
    		type: "each",
    		source: "(134:12) {#each $chargeList as c}",
    		ctx
    	});

    	return block;
    }

    // (130:6) {#each chargeDetails as charge, index}
    function create_each_block_1$2(ctx) {
    	let div;
    	let select;
    	let option;
    	let t1;
    	let button;
    	let t3;
    	let mounted;
    	let dispose;
    	let each_value_2 = /*$chargeList*/ ctx[13];
    	validate_each_argument(each_value_2);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_2.length; i += 1) {
    		each_blocks[i] = create_each_block_2(get_each_context_2(ctx, each_value_2, i));
    	}

    	function select_change_handler() {
    		/*select_change_handler*/ ctx[25].call(select, /*each_value_1*/ ctx[38], /*index*/ ctx[39]);
    	}

    	function click_handler() {
    		return /*click_handler*/ ctx[26](/*index*/ ctx[39]);
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			select = element("select");
    			option = element("option");
    			option.textContent = "Select Charge";

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t1 = space();
    			button = element("button");
    			button.textContent = "🗑️";
    			t3 = space();
    			option.__value = "";
    			option.value = option.__value;
    			option.disabled = true;
    			add_location(option, file$d, 132, 12, 4189);
    			attr_dev(select, "class", "svelte-1e7v7gy");
    			if (/*charge*/ ctx[37].charge === void 0) add_render_callback(select_change_handler);
    			add_location(select, file$d, 131, 10, 4112);
    			attr_dev(button, "type", "button");
    			attr_dev(button, "class", "remove-charge-button svelte-1e7v7gy");
    			add_location(button, file$d, 137, 10, 4389);
    			attr_dev(div, "class", "charge-entry svelte-1e7v7gy");
    			add_location(div, file$d, 130, 8, 4074);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, select);
    			append_dev(select, option);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				if (each_blocks[i]) {
    					each_blocks[i].m(select, null);
    				}
    			}

    			select_option(select, /*charge*/ ctx[37].charge, true);
    			append_dev(div, t1);
    			append_dev(div, button);
    			append_dev(div, t3);

    			if (!mounted) {
    				dispose = [
    					listen_dev(select, "change", select_change_handler),
    					listen_dev(select, "change", /*calculateTotals*/ ctx[17], false, false, false, false),
    					listen_dev(button, "click", click_handler, false, false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (dirty[0] & /*$chargeList*/ 8192) {
    				each_value_2 = /*$chargeList*/ ctx[13];
    				validate_each_argument(each_value_2);
    				let i;

    				for (i = 0; i < each_value_2.length; i += 1) {
    					const child_ctx = get_each_context_2(ctx, each_value_2, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_2(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(select, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_2.length;
    			}

    			if (dirty[0] & /*chargeDetails, $chargeList*/ 8320) {
    				select_option(select, /*charge*/ ctx[37].charge);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1$2.name,
    		type: "each",
    		source: "(130:6) {#each chargeDetails as charge, index}",
    		ctx
    	});

    	return block;
    }

    // (146:8) {#each reductionOptions as option}
    function create_each_block$a(ctx) {
    	let option;
    	let t_value = /*option*/ ctx[34] + "";
    	let t;

    	const block = {
    		c: function create() {
    			option = element("option");
    			t = text(t_value);
    			option.__value = /*option*/ ctx[34];
    			option.value = option.__value;
    			add_location(option, file$d, 146, 10, 4740);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, option, anchor);
    			append_dev(option, t);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(option);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$a.name,
    		type: "each",
    		source: "(146:8) {#each reductionOptions as option}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$d(ctx) {
    	let div13;
    	let h2;
    	let t1;
    	let form;
    	let div0;
    	let label0;
    	let t3;
    	let input0;
    	let t4;
    	let div1;
    	let label1;
    	let t6;
    	let input1;
    	let t7;
    	let div2;
    	let label2;
    	let t9;
    	let input2;
    	let t10;
    	let div3;
    	let label3;
    	let t12;
    	let textarea;
    	let t13;
    	let div4;
    	let label4;
    	let t15;
    	let input3;
    	let t16;
    	let div5;
    	let label5;
    	let t18;
    	let input4;
    	let t19;
    	let div6;
    	let label6;
    	let t21;
    	let button0;
    	let t23;
    	let t24;
    	let div7;
    	let label7;
    	let t26;
    	let select;
    	let t27;
    	let div8;
    	let label8;
    	let t29;
    	let input5;
    	let t30;
    	let div9;
    	let label9;
    	let t32;
    	let input6;
    	let t33;
    	let div10;
    	let label10;
    	let t35;
    	let input7;
    	let t36;
    	let div11;
    	let label11;
    	let t38;
    	let input8;
    	let t39;
    	let div12;
    	let label12;
    	let t41;
    	let input9;
    	let t42;
    	let button1;
    	let mounted;
    	let dispose;
    	let each_value_1 = /*chargeDetails*/ ctx[7];
    	validate_each_argument(each_value_1);
    	let each_blocks_1 = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks_1[i] = create_each_block_1$2(get_each_context_1$2(ctx, each_value_1, i));
    	}

    	let each_value = /*reductionOptions*/ ctx[14];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$a(get_each_context$a(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div13 = element("div");
    			h2 = element("h2");
    			h2.textContent = "Create New Report";
    			t1 = space();
    			form = element("form");
    			div0 = element("div");
    			label0 = element("label");
    			label0.textContent = "Suspect Id:";
    			t3 = space();
    			input0 = element("input");
    			t4 = space();
    			div1 = element("div");
    			label1 = element("label");
    			label1.textContent = "Associate Names:";
    			t6 = space();
    			input1 = element("input");
    			t7 = space();
    			div2 = element("div");
    			label2 = element("label");
    			label2.textContent = "Report Title:";
    			t9 = space();
    			input2 = element("input");
    			t10 = space();
    			div3 = element("div");
    			label3 = element("label");
    			label3.textContent = "Report Description:";
    			t12 = space();
    			textarea = element("textarea");
    			t13 = space();
    			div4 = element("div");
    			label4 = element("label");
    			label4.textContent = "Location:";
    			t15 = space();
    			input3 = element("input");
    			t16 = space();
    			div5 = element("div");
    			label5 = element("label");
    			label5.textContent = "Items Confiscated:";
    			t18 = space();
    			input4 = element("input");
    			t19 = space();
    			div6 = element("div");
    			label6 = element("label");
    			label6.textContent = "Charges:";
    			t21 = space();
    			button0 = element("button");
    			button0.textContent = "Add Charge";
    			t23 = space();

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].c();
    			}

    			t24 = space();
    			div7 = element("div");
    			label7 = element("label");
    			label7.textContent = "Fine Reduction:";
    			t26 = space();
    			select = element("select");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t27 = space();
    			div8 = element("div");
    			label8 = element("label");
    			label8.textContent = "Original Fine:";
    			t29 = space();
    			input5 = element("input");
    			t30 = space();
    			div9 = element("div");
    			label9 = element("label");
    			label9.textContent = "Reduced Fine:";
    			t32 = space();
    			input6 = element("input");
    			t33 = space();
    			div10 = element("div");
    			label10 = element("label");
    			label10.textContent = "Total Jail Time:";
    			t35 = space();
    			input7 = element("input");
    			t36 = space();
    			div11 = element("div");
    			label11 = element("label");
    			label11.textContent = "Station:";
    			t38 = space();
    			input8 = element("input");
    			t39 = space();
    			div12 = element("div");
    			label12 = element("label");
    			label12.textContent = "Arresting Officer ID:";
    			t41 = space();
    			input9 = element("input");
    			t42 = space();
    			button1 = element("button");
    			button1.textContent = "Submit Report";
    			add_location(h2, file$d, 94, 2, 2736);
    			attr_dev(label0, "for", "suspectId");
    			attr_dev(label0, "class", "svelte-1e7v7gy");
    			add_location(label0, file$d, 97, 6, 2850);
    			attr_dev(input0, "id", "suspectId");
    			attr_dev(input0, "type", "text");
    			attr_dev(input0, "class", "svelte-1e7v7gy");
    			add_location(input0, file$d, 98, 6, 2900);
    			attr_dev(div0, "class", "form-group svelte-1e7v7gy");
    			add_location(div0, file$d, 96, 4, 2818);
    			attr_dev(label1, "for", "associateNames");
    			attr_dev(label1, "class", "svelte-1e7v7gy");
    			add_location(label1, file$d, 102, 6, 3011);
    			attr_dev(input1, "id", "associateNames");
    			attr_dev(input1, "type", "text");
    			attr_dev(input1, "class", "svelte-1e7v7gy");
    			add_location(input1, file$d, 103, 6, 3071);
    			attr_dev(div1, "class", "form-group svelte-1e7v7gy");
    			add_location(div1, file$d, 101, 4, 2979);
    			attr_dev(label2, "for", "reportTitle");
    			attr_dev(label2, "class", "svelte-1e7v7gy");
    			add_location(label2, file$d, 107, 6, 3192);
    			attr_dev(input2, "id", "reportTitle");
    			attr_dev(input2, "type", "text");
    			attr_dev(input2, "class", "svelte-1e7v7gy");
    			add_location(input2, file$d, 108, 6, 3246);
    			attr_dev(div2, "class", "form-group svelte-1e7v7gy");
    			add_location(div2, file$d, 106, 4, 3160);
    			attr_dev(label3, "for", "reportDescription");
    			attr_dev(label3, "class", "svelte-1e7v7gy");
    			add_location(label3, file$d, 112, 6, 3361);
    			attr_dev(textarea, "id", "reportDescription");
    			attr_dev(textarea, "class", "svelte-1e7v7gy");
    			add_location(textarea, file$d, 113, 6, 3427);
    			attr_dev(div3, "class", "form-group svelte-1e7v7gy");
    			add_location(div3, file$d, 111, 4, 3329);
    			attr_dev(label4, "for", "location");
    			attr_dev(label4, "class", "svelte-1e7v7gy");
    			add_location(label4, file$d, 117, 6, 3554);
    			attr_dev(input3, "id", "location");
    			attr_dev(input3, "type", "text");
    			attr_dev(input3, "class", "svelte-1e7v7gy");
    			add_location(input3, file$d, 118, 6, 3601);
    			attr_dev(div4, "class", "form-group svelte-1e7v7gy");
    			add_location(div4, file$d, 116, 4, 3522);
    			attr_dev(label5, "for", "itemsConfiscated");
    			attr_dev(label5, "class", "svelte-1e7v7gy");
    			add_location(label5, file$d, 122, 6, 3710);
    			attr_dev(input4, "id", "itemsConfiscated");
    			attr_dev(input4, "type", "text");
    			attr_dev(input4, "class", "svelte-1e7v7gy");
    			add_location(input4, file$d, 123, 6, 3774);
    			attr_dev(div5, "class", "form-group svelte-1e7v7gy");
    			add_location(div5, file$d, 121, 4, 3678);
    			attr_dev(label6, "class", "svelte-1e7v7gy");
    			add_location(label6, file$d, 127, 6, 3899);
    			attr_dev(button0, "type", "button");
    			attr_dev(button0, "class", "add-charge-button svelte-1e7v7gy");
    			add_location(button0, file$d, 128, 6, 3930);
    			attr_dev(div6, "class", "form-group svelte-1e7v7gy");
    			add_location(div6, file$d, 126, 4, 3867);
    			attr_dev(label7, "for", "fineReduction");
    			attr_dev(label7, "class", "svelte-1e7v7gy");
    			add_location(label7, file$d, 143, 6, 4572);
    			attr_dev(select, "id", "fineReduction");
    			attr_dev(select, "class", "svelte-1e7v7gy");
    			if (/*fineReduction*/ ctx[0] === void 0) add_render_callback(() => /*select_change_handler_1*/ ctx[27].call(select));
    			add_location(select, file$d, 144, 6, 4630);
    			attr_dev(div7, "class", "form-group svelte-1e7v7gy");
    			add_location(div7, file$d, 142, 4, 4540);
    			attr_dev(label8, "for", "originalFine");
    			attr_dev(label8, "class", "svelte-1e7v7gy");
    			add_location(label8, file$d, 152, 6, 4866);
    			attr_dev(input5, "id", "originalFine");
    			attr_dev(input5, "type", "number");
    			input5.disabled = true;
    			attr_dev(input5, "class", "svelte-1e7v7gy");
    			add_location(input5, file$d, 153, 6, 4922);
    			attr_dev(div8, "class", "form-group svelte-1e7v7gy");
    			add_location(div8, file$d, 151, 4, 4834);
    			attr_dev(label9, "for", "reducedFine");
    			attr_dev(label9, "class", "svelte-1e7v7gy");
    			add_location(label9, file$d, 157, 6, 5050);
    			attr_dev(input6, "id", "reducedFine");
    			attr_dev(input6, "type", "number");
    			input6.disabled = true;
    			attr_dev(input6, "class", "svelte-1e7v7gy");
    			add_location(input6, file$d, 158, 6, 5104);
    			attr_dev(div9, "class", "form-group svelte-1e7v7gy");
    			add_location(div9, file$d, 156, 4, 5018);
    			attr_dev(label10, "for", "jailTime");
    			attr_dev(label10, "class", "svelte-1e7v7gy");
    			add_location(label10, file$d, 162, 6, 5230);
    			attr_dev(input7, "id", "jailTime");
    			attr_dev(input7, "type", "number");
    			input7.disabled = true;
    			attr_dev(input7, "class", "svelte-1e7v7gy");
    			add_location(input7, file$d, 163, 6, 5284);
    			attr_dev(div10, "class", "form-group svelte-1e7v7gy");
    			add_location(div10, file$d, 161, 4, 5198);
    			attr_dev(label11, "for", "station");
    			attr_dev(label11, "class", "svelte-1e7v7gy");
    			add_location(label11, file$d, 167, 6, 5404);
    			attr_dev(input8, "id", "station");
    			attr_dev(input8, "type", "text");
    			attr_dev(input8, "class", "svelte-1e7v7gy");
    			add_location(input8, file$d, 168, 6, 5449);
    			attr_dev(div11, "class", "form-group svelte-1e7v7gy");
    			add_location(div11, file$d, 166, 4, 5372);
    			attr_dev(label12, "for", "arrestingLawmenId");
    			attr_dev(label12, "class", "svelte-1e7v7gy");
    			add_location(label12, file$d, 172, 6, 5556);
    			attr_dev(input9, "id", "arrestingLawmenId");
    			attr_dev(input9, "type", "text");
    			attr_dev(input9, "class", "svelte-1e7v7gy");
    			add_location(input9, file$d, 173, 6, 5624);
    			attr_dev(div12, "class", "form-group svelte-1e7v7gy");
    			add_location(div12, file$d, 171, 4, 5524);
    			attr_dev(button1, "type", "submit");
    			attr_dev(button1, "class", "submit-button svelte-1e7v7gy");
    			add_location(button1, file$d, 176, 4, 5719);
    			add_location(form, file$d, 95, 2, 2766);
    			attr_dev(div13, "class", "report-form-container svelte-1e7v7gy");
    			add_location(div13, file$d, 93, 0, 2697);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div13, anchor);
    			append_dev(div13, h2);
    			append_dev(div13, t1);
    			append_dev(div13, form);
    			append_dev(form, div0);
    			append_dev(div0, label0);
    			append_dev(div0, t3);
    			append_dev(div0, input0);
    			set_input_value(input0, /*suspectId*/ ctx[1]);
    			append_dev(form, t4);
    			append_dev(form, div1);
    			append_dev(div1, label1);
    			append_dev(div1, t6);
    			append_dev(div1, input1);
    			set_input_value(input1, /*associateNames*/ ctx[2]);
    			append_dev(form, t7);
    			append_dev(form, div2);
    			append_dev(div2, label2);
    			append_dev(div2, t9);
    			append_dev(div2, input2);
    			set_input_value(input2, /*reportTitle*/ ctx[3]);
    			append_dev(form, t10);
    			append_dev(form, div3);
    			append_dev(div3, label3);
    			append_dev(div3, t12);
    			append_dev(div3, textarea);
    			set_input_value(textarea, /*reportDescription*/ ctx[4]);
    			append_dev(form, t13);
    			append_dev(form, div4);
    			append_dev(div4, label4);
    			append_dev(div4, t15);
    			append_dev(div4, input3);
    			set_input_value(input3, /*location*/ ctx[5]);
    			append_dev(form, t16);
    			append_dev(form, div5);
    			append_dev(div5, label5);
    			append_dev(div5, t18);
    			append_dev(div5, input4);
    			set_input_value(input4, /*itemsConfiscated*/ ctx[6]);
    			append_dev(form, t19);
    			append_dev(form, div6);
    			append_dev(div6, label6);
    			append_dev(div6, t21);
    			append_dev(div6, button0);
    			append_dev(div6, t23);

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				if (each_blocks_1[i]) {
    					each_blocks_1[i].m(div6, null);
    				}
    			}

    			append_dev(form, t24);
    			append_dev(form, div7);
    			append_dev(div7, label7);
    			append_dev(div7, t26);
    			append_dev(div7, select);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				if (each_blocks[i]) {
    					each_blocks[i].m(select, null);
    				}
    			}

    			select_option(select, /*fineReduction*/ ctx[0], true);
    			append_dev(form, t27);
    			append_dev(form, div8);
    			append_dev(div8, label8);
    			append_dev(div8, t29);
    			append_dev(div8, input5);
    			set_input_value(input5, /*originalFine*/ ctx[9]);
    			append_dev(form, t30);
    			append_dev(form, div9);
    			append_dev(div9, label9);
    			append_dev(div9, t32);
    			append_dev(div9, input6);
    			set_input_value(input6, /*reducedFine*/ ctx[10]);
    			append_dev(form, t33);
    			append_dev(form, div10);
    			append_dev(div10, label10);
    			append_dev(div10, t35);
    			append_dev(div10, input7);
    			set_input_value(input7, /*jailTime*/ ctx[8]);
    			append_dev(form, t36);
    			append_dev(form, div11);
    			append_dev(div11, label11);
    			append_dev(div11, t38);
    			append_dev(div11, input8);
    			set_input_value(input8, /*station*/ ctx[11]);
    			append_dev(form, t39);
    			append_dev(form, div12);
    			append_dev(div12, label12);
    			append_dev(div12, t41);
    			append_dev(div12, input9);
    			set_input_value(input9, /*arrestingLawmenId*/ ctx[12]);
    			append_dev(form, t42);
    			append_dev(form, button1);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input0, "input", /*input0_input_handler*/ ctx[19]),
    					listen_dev(input1, "input", /*input1_input_handler*/ ctx[20]),
    					listen_dev(input2, "input", /*input2_input_handler*/ ctx[21]),
    					listen_dev(textarea, "input", /*textarea_input_handler*/ ctx[22]),
    					listen_dev(input3, "input", /*input3_input_handler*/ ctx[23]),
    					listen_dev(input4, "input", /*input4_input_handler*/ ctx[24]),
    					listen_dev(button0, "click", /*addCharge*/ ctx[15], false, false, false, false),
    					listen_dev(select, "change", /*select_change_handler_1*/ ctx[27]),
    					listen_dev(input5, "input", /*input5_input_handler*/ ctx[28]),
    					listen_dev(input6, "input", /*input6_input_handler*/ ctx[29]),
    					listen_dev(input7, "input", /*input7_input_handler*/ ctx[30]),
    					listen_dev(input8, "input", /*input8_input_handler*/ ctx[31]),
    					listen_dev(input9, "input", /*input9_input_handler*/ ctx[32]),
    					listen_dev(form, "submit", prevent_default(/*handleSubmit*/ ctx[18]), false, true, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*suspectId*/ 2 && input0.value !== /*suspectId*/ ctx[1]) {
    				set_input_value(input0, /*suspectId*/ ctx[1]);
    			}

    			if (dirty[0] & /*associateNames*/ 4 && input1.value !== /*associateNames*/ ctx[2]) {
    				set_input_value(input1, /*associateNames*/ ctx[2]);
    			}

    			if (dirty[0] & /*reportTitle*/ 8 && input2.value !== /*reportTitle*/ ctx[3]) {
    				set_input_value(input2, /*reportTitle*/ ctx[3]);
    			}

    			if (dirty[0] & /*reportDescription*/ 16) {
    				set_input_value(textarea, /*reportDescription*/ ctx[4]);
    			}

    			if (dirty[0] & /*location*/ 32 && input3.value !== /*location*/ ctx[5]) {
    				set_input_value(input3, /*location*/ ctx[5]);
    			}

    			if (dirty[0] & /*itemsConfiscated*/ 64 && input4.value !== /*itemsConfiscated*/ ctx[6]) {
    				set_input_value(input4, /*itemsConfiscated*/ ctx[6]);
    			}

    			if (dirty[0] & /*removeCharge, chargeDetails, calculateTotals, $chargeList*/ 204928) {
    				each_value_1 = /*chargeDetails*/ ctx[7];
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1$2(ctx, each_value_1, i);

    					if (each_blocks_1[i]) {
    						each_blocks_1[i].p(child_ctx, dirty);
    					} else {
    						each_blocks_1[i] = create_each_block_1$2(child_ctx);
    						each_blocks_1[i].c();
    						each_blocks_1[i].m(div6, null);
    					}
    				}

    				for (; i < each_blocks_1.length; i += 1) {
    					each_blocks_1[i].d(1);
    				}

    				each_blocks_1.length = each_value_1.length;
    			}

    			if (dirty[0] & /*reductionOptions*/ 16384) {
    				each_value = /*reductionOptions*/ ctx[14];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$a(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$a(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(select, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}

    			if (dirty[0] & /*fineReduction, reductionOptions*/ 16385) {
    				select_option(select, /*fineReduction*/ ctx[0]);
    			}

    			if (dirty[0] & /*originalFine*/ 512 && to_number(input5.value) !== /*originalFine*/ ctx[9]) {
    				set_input_value(input5, /*originalFine*/ ctx[9]);
    			}

    			if (dirty[0] & /*reducedFine*/ 1024 && to_number(input6.value) !== /*reducedFine*/ ctx[10]) {
    				set_input_value(input6, /*reducedFine*/ ctx[10]);
    			}

    			if (dirty[0] & /*jailTime*/ 256 && to_number(input7.value) !== /*jailTime*/ ctx[8]) {
    				set_input_value(input7, /*jailTime*/ ctx[8]);
    			}

    			if (dirty[0] & /*station*/ 2048 && input8.value !== /*station*/ ctx[11]) {
    				set_input_value(input8, /*station*/ ctx[11]);
    			}

    			if (dirty[0] & /*arrestingLawmenId*/ 4096 && input9.value !== /*arrestingLawmenId*/ ctx[12]) {
    				set_input_value(input9, /*arrestingLawmenId*/ ctx[12]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div13);
    			destroy_each(each_blocks_1, detaching);
    			destroy_each(each_blocks, detaching);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$d.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$d($$self, $$props, $$invalidate) {
    	let $chargeList;
    	validate_store(chargeList, 'chargeList');
    	component_subscribe($$self, chargeList, $$value => $$invalidate(13, $chargeList = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('ReportForm', slots, []);
    	let suspectId = '';
    	let associateNames = '';
    	let reportTitle = '';
    	let reportDescription = '';
    	let location = '';
    	let itemsConfiscated = '';
    	let chargeDetails = [];
    	let jailTime = 0;
    	let originalFine = 0;
    	let reducedFine = 0;
    	let fineReduction = 'None';
    	let station = '';
    	let arrestingLawmen = '';
    	let arrestingLawmenId = '';

    	// Reduction options for fine reduction dropdown
    	const reductionOptions = ['None', '10%', '25%', '50%'];

    	// Function to add charge
    	function addCharge() {
    		$$invalidate(7, chargeDetails = [...chargeDetails, { charge: '', fine: 0, jail: 0 }]);
    		calculateTotals(); // Call the calculateTotals function after adding a charge
    	}

    	// Function to remove a charge
    	function removeCharge(index) {
    		$$invalidate(7, chargeDetails = chargeDetails.filter((_, i) => i !== index));
    		calculateTotals(); // Call the calculateTotals function after removing a charge
    	}

    	// Calculate fines and jail time based on selected charges
    	function calculateTotals() {
    		let totalFine = 0;
    		let totalJailTime = 0;

    		chargeDetails.forEach(charge => {
    			const chargeInfo = $chargeList.find(c => c.charge === charge.charge);

    			if (chargeInfo) {
    				totalFine += chargeInfo.fine;
    				totalJailTime += chargeInfo.jail;
    			}
    		});

    		$$invalidate(9, originalFine = totalFine);
    		$$invalidate(8, jailTime = totalJailTime);

    		const reduction = fineReduction === '10%'
    		? 0.1
    		: fineReduction === '25%'
    			? 0.25
    			: fineReduction === '50%' ? 0.5 : 0;

    		$$invalidate(10, reducedFine = totalFine - totalFine * reduction);
    	}

    	// Function to handle form submission
    	function handleSubmit() {
    		const newReport = {
    			suspectId,
    			associateNames,
    			reportTitle,
    			reportDescription,
    			location,
    			itemsConfiscated,
    			charges: chargeDetails,
    			jailTime,
    			originalFine,
    			reducedFine,
    			fineReduction,
    			station,
    			arrestingLawmenId,
    			dateTime: new Date().toLocaleString(), // Capture the current date and time
    			
    		};

    		createReport(newReport);

    		// Navigate back to the report list
    		push('/reports');
    	}

    	onMount(() => {
    		// Fetch the charge list from the server
    		// This will be implemented later
    		console.log('Fetching charge list from the server...');
    	});

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$8.warn(`<ReportForm> was created with unknown prop '${key}'`);
    	});

    	function input0_input_handler() {
    		suspectId = this.value;
    		$$invalidate(1, suspectId);
    	}

    	function input1_input_handler() {
    		associateNames = this.value;
    		$$invalidate(2, associateNames);
    	}

    	function input2_input_handler() {
    		reportTitle = this.value;
    		$$invalidate(3, reportTitle);
    	}

    	function textarea_input_handler() {
    		reportDescription = this.value;
    		$$invalidate(4, reportDescription);
    	}

    	function input3_input_handler() {
    		location = this.value;
    		$$invalidate(5, location);
    	}

    	function input4_input_handler() {
    		itemsConfiscated = this.value;
    		$$invalidate(6, itemsConfiscated);
    	}

    	function select_change_handler(each_value_1, index) {
    		each_value_1[index].charge = select_value(this);
    		$$invalidate(7, chargeDetails);
    	}

    	const click_handler = index => removeCharge(index);

    	function select_change_handler_1() {
    		fineReduction = select_value(this);
    		$$invalidate(0, fineReduction);
    		$$invalidate(14, reductionOptions);
    	}

    	function input5_input_handler() {
    		originalFine = to_number(this.value);
    		$$invalidate(9, originalFine);
    	}

    	function input6_input_handler() {
    		reducedFine = to_number(this.value);
    		$$invalidate(10, reducedFine);
    	}

    	function input7_input_handler() {
    		jailTime = to_number(this.value);
    		$$invalidate(8, jailTime);
    	}

    	function input8_input_handler() {
    		station = this.value;
    		$$invalidate(11, station);
    	}

    	function input9_input_handler() {
    		arrestingLawmenId = this.value;
    		$$invalidate(12, arrestingLawmenId);
    	}

    	$$self.$capture_state = () => ({
    		push,
    		chargeList,
    		onMount,
    		createReport,
    		suspectId,
    		associateNames,
    		reportTitle,
    		reportDescription,
    		location,
    		itemsConfiscated,
    		chargeDetails,
    		jailTime,
    		originalFine,
    		reducedFine,
    		fineReduction,
    		station,
    		arrestingLawmen,
    		arrestingLawmenId,
    		reductionOptions,
    		addCharge,
    		removeCharge,
    		calculateTotals,
    		handleSubmit,
    		$chargeList
    	});

    	$$self.$inject_state = $$props => {
    		if ('suspectId' in $$props) $$invalidate(1, suspectId = $$props.suspectId);
    		if ('associateNames' in $$props) $$invalidate(2, associateNames = $$props.associateNames);
    		if ('reportTitle' in $$props) $$invalidate(3, reportTitle = $$props.reportTitle);
    		if ('reportDescription' in $$props) $$invalidate(4, reportDescription = $$props.reportDescription);
    		if ('location' in $$props) $$invalidate(5, location = $$props.location);
    		if ('itemsConfiscated' in $$props) $$invalidate(6, itemsConfiscated = $$props.itemsConfiscated);
    		if ('chargeDetails' in $$props) $$invalidate(7, chargeDetails = $$props.chargeDetails);
    		if ('jailTime' in $$props) $$invalidate(8, jailTime = $$props.jailTime);
    		if ('originalFine' in $$props) $$invalidate(9, originalFine = $$props.originalFine);
    		if ('reducedFine' in $$props) $$invalidate(10, reducedFine = $$props.reducedFine);
    		if ('fineReduction' in $$props) $$invalidate(0, fineReduction = $$props.fineReduction);
    		if ('station' in $$props) $$invalidate(11, station = $$props.station);
    		if ('arrestingLawmen' in $$props) arrestingLawmen = $$props.arrestingLawmen;
    		if ('arrestingLawmenId' in $$props) $$invalidate(12, arrestingLawmenId = $$props.arrestingLawmenId);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty[0] & /*fineReduction*/ 1) {
    			// Watcher to recalculate fines and jail time whenever fine reduction changes
    			(calculateTotals());
    		}
    	};

    	return [
    		fineReduction,
    		suspectId,
    		associateNames,
    		reportTitle,
    		reportDescription,
    		location,
    		itemsConfiscated,
    		chargeDetails,
    		jailTime,
    		originalFine,
    		reducedFine,
    		station,
    		arrestingLawmenId,
    		$chargeList,
    		reductionOptions,
    		addCharge,
    		removeCharge,
    		calculateTotals,
    		handleSubmit,
    		input0_input_handler,
    		input1_input_handler,
    		input2_input_handler,
    		textarea_input_handler,
    		input3_input_handler,
    		input4_input_handler,
    		select_change_handler,
    		click_handler,
    		select_change_handler_1,
    		input5_input_handler,
    		input6_input_handler,
    		input7_input_handler,
    		input8_input_handler,
    		input9_input_handler
    	];
    }

    class ReportForm extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$d, create_fragment$d, safe_not_equal, {}, null, [-1, -1]);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ReportForm",
    			options,
    			id: create_fragment$d.name
    		});
    	}
    }

    const defaultProfiles = [
        {
            id: 1,
            charId: 1,
            isWanted: false,
            mugshotLink: 'https://via.placeholder.com/150',
            firstname: 'John',
            lastname: 'Doe',
            job: 'Police Officer'
        },
        {
            id: 2,
            charId: 2,
            isWanted: true,
            mugshotLink: 'https://via.placeholder.com/150',
            firstname: 'Jane',
            lastname: 'Doe',
            job: 'Police Officer'
        }
    ];
    const profile = writable({});
    const profiles = writable(defaultProfiles);



    window.addEventListener('message', function(event) {
        switch(event.data.type) {
            case 'receiveProfile':
                setProfile(event.data.profile);
                break;
            case 'receiveProfiles':
                setProfiles(event.data.profiles);
                break;
        }
    });

    function setProfile(data) {
        profile.set(data);
    }
    function setProfiles(data) {
        console.log("Setting profiles", data);
        profiles.set(data);
    }
    function retrieveProfile(charId) {
        {
            // Check if the profile store is empty
            profile.subscribe(value => {
                if (Object.keys(value).length === 0) {
                    setProfile({
                        id: 1,
                        charId: 1,
                        isWanted: false,
                        mugshotLink: 'https://via.placeholder.com/150',
                        firstname: 'John',
                        lastname: 'Doe',
                        job: 'Police Officer'
                    });
                }
            });
        }
    }

    function retrieveProfiles(page) {
        {
            console.log(profiles);
            // Check profiles store length to see if it's empty
            profiles.subscribe(value => {
                if (value.length === 0) {
                    setProfiles([
                        {
                            id: 1,
                            charId: 1,
                            isWanted: false,
                            mugshotLink: 'https://via.placeholder.com/150',
                            firstname: 'John',
                            lastname: 'Doe',
                            job: 'Police Officer'
                        },
                        {
                            id: 2,
                            charId: 2,
                            isWanted: true,
                            mugshotLink: 'https://via.placeholder.com/150',
                            firstname: 'Jane',
                            lastname: 'Doe',
                            job: 'Police Officer'
                        }
                    ]);
                }
            });
        }
    }

    function createProfile(charId, isWanted, mugshotLink) {
        {
            // Add the new profile to the store. Consider it being a svelte store.
            profiles.update(currentProfiles => {
                const newProfile = {
                    id: currentProfiles.length + 1,
                    charId: charId,
                    isWanted: isWanted,
                    mugshotLink: mugshotLink,
                    firstname: 'John',
                    lastname: 'Doe',
                    job: 'Police Officer'
                };
                return [...currentProfiles, newProfile];
            });
        }
     }

    function updateProfile(charId, isWanted, mugshotLink) {
        {
            profiles.update(profiles => {
                const profile = profiles.find(profile => profile.charId == charId);
                if (profile) {
                    profile.isWanted = isWanted;
                    profile.mugshotLink = mugshotLink;
                }
                setProfile(profile);
                return profiles;
            });
        }
    }

    function searchProfiles(searchString) {
        {
            if (searchString === '') {
                profiles.set(defaultProfiles);
                return;
            }
            profiles.update(currentProfiles => {
                const filteredProfiles = currentProfiles.filter(profile => {
                    return profile.firstname.toLowerCase().includes(searchString.toLowerCase()) ||
                        profile.lastname.toLowerCase().includes(searchString.toLowerCase()) ||
                        profile.charId.toString() === searchString;
                });
                return filteredProfiles;
            });
        }
    }

    /* src\Profiles\Profile.svelte generated by Svelte v3.59.2 */

    const { console: console_1$7 } = globals;
    const file$c = "src\\Profiles\\Profile.svelte";

    function get_each_context$9(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[25] = list[i];
    	return child_ctx;
    }

    function get_each_context_1$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[28] = list[i];
    	return child_ctx;
    }

    // (139:0) {:else}
    function create_else_block_2(ctx) {
    	let p;

    	const block = {
    		c: function create() {
    			p = element("p");
    			p.textContent = "Loading profile details...";
    			add_location(p, file$c, 139, 2, 4768);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_2.name,
    		type: "else",
    		source: "(139:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (71:0) {#if $profile}
    function create_if_block$9(ctx) {
    	let div3;
    	let div0;
    	let h2;
    	let t1;
    	let p0;
    	let strong0;
    	let t3;
    	let t4_value = (/*$profile*/ ctx[4].firstname || 'N/A') + "";
    	let t4;
    	let t5;
    	let p1;
    	let strong1;
    	let t7;
    	let t8_value = (/*$profile*/ ctx[4].lastname || 'N/A') + "";
    	let t8;
    	let t9;
    	let p2;
    	let strong2;
    	let t11;
    	let t12_value = (/*$profile*/ ctx[4].charId || 'N/A') + "";
    	let t12;
    	let t13;
    	let p3;
    	let strong3;
    	let t15;
    	let t16_value = (/*$profile*/ ctx[4].job || 'N/A') + "";
    	let t16;
    	let t17;
    	let button0;

    	let t18_value = (/*isWanted*/ ctx[3]
    	? 'Remove from Wanted List'
    	: 'Add to Wanted List') + "";

    	let t18;
    	let t19;
    	let div2;
    	let h30;
    	let t21;
    	let div1;
    	let img;
    	let img_src_value;
    	let t22;
    	let button1;
    	let t24;
    	let div4;
    	let h31;
    	let t26;
    	let ul;
    	let t27;
    	let mounted;
    	let dispose;
    	let each_value_1 = /*$ReportsBySuspect*/ ctx[6];
    	validate_each_argument(each_value_1);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks[i] = create_each_block_1$1(get_each_context_1$1(ctx, each_value_1, i));
    	}

    	let if_block = /*$TotalReportPages*/ ctx[5] > 1 && create_if_block_1$5(ctx);

    	const block = {
    		c: function create() {
    			div3 = element("div");
    			div0 = element("div");
    			h2 = element("h2");
    			h2.textContent = "Profile";
    			t1 = space();
    			p0 = element("p");
    			strong0 = element("strong");
    			strong0.textContent = "Firstname:";
    			t3 = space();
    			t4 = text(t4_value);
    			t5 = space();
    			p1 = element("p");
    			strong1 = element("strong");
    			strong1.textContent = "Lastname:";
    			t7 = space();
    			t8 = text(t8_value);
    			t9 = space();
    			p2 = element("p");
    			strong2 = element("strong");
    			strong2.textContent = "Id:";
    			t11 = space();
    			t12 = text(t12_value);
    			t13 = space();
    			p3 = element("p");
    			strong3 = element("strong");
    			strong3.textContent = "Job:";
    			t15 = space();
    			t16 = text(t16_value);
    			t17 = space();
    			button0 = element("button");
    			t18 = text(t18_value);
    			t19 = space();
    			div2 = element("div");
    			h30 = element("h3");
    			h30.textContent = "Mugshot";
    			t21 = space();
    			div1 = element("div");
    			img = element("img");
    			t22 = space();
    			button1 = element("button");
    			button1.textContent = "Upload New Mugshot";
    			t24 = space();
    			div4 = element("div");
    			h31 = element("h3");
    			h31.textContent = "Criminal Record";
    			t26 = space();
    			ul = element("ul");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t27 = space();
    			if (if_block) if_block.c();
    			attr_dev(h2, "class", "svelte-mszb43");
    			add_location(h2, file$c, 74, 6, 2256);
    			add_location(strong0, file$c, 75, 9, 2283);
    			add_location(p0, file$c, 75, 6, 2280);
    			add_location(strong1, file$c, 76, 9, 2355);
    			add_location(p1, file$c, 76, 6, 2352);
    			add_location(strong2, file$c, 77, 9, 2425);
    			add_location(p2, file$c, 77, 6, 2422);
    			add_location(strong3, file$c, 78, 9, 2487);
    			add_location(p3, file$c, 78, 6, 2484);
    			attr_dev(button0, "class", "wanted-toggle svelte-mszb43");
    			add_location(button0, file$c, 79, 6, 2544);
    			attr_dev(div0, "class", "profile-section svelte-mszb43");
    			add_location(div0, file$c, 73, 4, 2219);
    			attr_dev(h30, "class", "svelte-mszb43");
    			add_location(h30, file$c, 86, 6, 2779);
    			if (!src_url_equal(img.src, img_src_value = /*$profile*/ ctx[4].mugshotLink || '')) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "Mugshot");
    			attr_dev(img, "class", "svelte-mszb43");
    			add_location(img, file$c, 88, 8, 2844);
    			attr_dev(button1, "class", "svelte-mszb43");
    			add_location(button1, file$c, 89, 8, 2908);
    			attr_dev(div1, "class", "mugshot-container svelte-mszb43");
    			add_location(div1, file$c, 87, 6, 2803);
    			attr_dev(div2, "class", "mugshot-section svelte-mszb43");
    			add_location(div2, file$c, 85, 4, 2742);
    			attr_dev(div3, "class", "profile-mugshot-container svelte-mszb43");
    			add_location(div3, file$c, 71, 2, 2144);
    			add_location(h31, file$c, 96, 4, 3089);
    			attr_dev(ul, "class", "svelte-mszb43");
    			add_location(ul, file$c, 97, 4, 3119);
    			attr_dev(div4, "class", "criminal-record-section svelte-mszb43");
    			add_location(div4, file$c, 95, 2, 3046);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div3, anchor);
    			append_dev(div3, div0);
    			append_dev(div0, h2);
    			append_dev(div0, t1);
    			append_dev(div0, p0);
    			append_dev(p0, strong0);
    			append_dev(p0, t3);
    			append_dev(p0, t4);
    			append_dev(div0, t5);
    			append_dev(div0, p1);
    			append_dev(p1, strong1);
    			append_dev(p1, t7);
    			append_dev(p1, t8);
    			append_dev(div0, t9);
    			append_dev(div0, p2);
    			append_dev(p2, strong2);
    			append_dev(p2, t11);
    			append_dev(p2, t12);
    			append_dev(div0, t13);
    			append_dev(div0, p3);
    			append_dev(p3, strong3);
    			append_dev(p3, t15);
    			append_dev(p3, t16);
    			append_dev(div0, t17);
    			append_dev(div0, button0);
    			append_dev(button0, t18);
    			append_dev(div3, t19);
    			append_dev(div3, div2);
    			append_dev(div2, h30);
    			append_dev(div2, t21);
    			append_dev(div2, div1);
    			append_dev(div1, img);
    			append_dev(div1, t22);
    			append_dev(div1, button1);
    			insert_dev(target, t24, anchor);
    			insert_dev(target, div4, anchor);
    			append_dev(div4, h31);
    			append_dev(div4, t26);
    			append_dev(div4, ul);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				if (each_blocks[i]) {
    					each_blocks[i].m(ul, null);
    				}
    			}

    			append_dev(div4, t27);
    			if (if_block) if_block.m(div4, null);

    			if (!mounted) {
    				dispose = [
    					listen_dev(button0, "click", /*toggleWantedStatus*/ ctx[13], false, false, false, false),
    					listen_dev(button1, "click", /*uploadMugshot*/ ctx[12], false, false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$profile*/ 16 && t4_value !== (t4_value = (/*$profile*/ ctx[4].firstname || 'N/A') + "")) set_data_dev(t4, t4_value);
    			if (dirty & /*$profile*/ 16 && t8_value !== (t8_value = (/*$profile*/ ctx[4].lastname || 'N/A') + "")) set_data_dev(t8, t8_value);
    			if (dirty & /*$profile*/ 16 && t12_value !== (t12_value = (/*$profile*/ ctx[4].charId || 'N/A') + "")) set_data_dev(t12, t12_value);
    			if (dirty & /*$profile*/ 16 && t16_value !== (t16_value = (/*$profile*/ ctx[4].job || 'N/A') + "")) set_data_dev(t16, t16_value);

    			if (dirty & /*isWanted*/ 8 && t18_value !== (t18_value = (/*isWanted*/ ctx[3]
    			? 'Remove from Wanted List'
    			: 'Add to Wanted List') + "")) set_data_dev(t18, t18_value);

    			if (dirty & /*$profile*/ 16 && !src_url_equal(img.src, img_src_value = /*$profile*/ ctx[4].mugshotLink || '')) {
    				attr_dev(img, "src", img_src_value);
    			}

    			if (dirty & /*navigateToIncident, $ReportsBySuspect*/ 2112) {
    				each_value_1 = /*$ReportsBySuspect*/ ctx[6];
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1$1(ctx, each_value_1, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_1$1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(ul, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_1.length;
    			}

    			if (/*$TotalReportPages*/ ctx[5] > 1) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block_1$5(ctx);
    					if_block.c();
    					if_block.m(div4, null);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div3);
    			if (detaching) detach_dev(t24);
    			if (detaching) detach_dev(div4);
    			destroy_each(each_blocks, detaching);
    			if (if_block) if_block.d();
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$9.name,
    		type: "if",
    		source: "(71:0) {#if $profile}",
    		ctx
    	});

    	return block;
    }

    // (99:6) {#each $ReportsBySuspect as incident}
    function create_each_block_1$1(ctx) {
    	let li;
    	let span0;
    	let t0_value = (/*incident*/ ctx[28].dateTime || 'Unknown Date') + "";
    	let t0;
    	let t1;
    	let span1;
    	let t2_value = (/*incident*/ ctx[28].reportTitle || 'No Title') + "";
    	let t2;
    	let t3;
    	let mounted;
    	let dispose;

    	function click_handler() {
    		return /*click_handler*/ ctx[15](/*incident*/ ctx[28]);
    	}

    	function keydown_handler(...args) {
    		return /*keydown_handler*/ ctx[16](/*incident*/ ctx[28], ...args);
    	}

    	const block = {
    		c: function create() {
    			li = element("li");
    			span0 = element("span");
    			t0 = text(t0_value);
    			t1 = text(" - ");
    			span1 = element("span");
    			t2 = text(t2_value);
    			t3 = space();
    			add_location(span0, file$c, 104, 10, 3373);
    			add_location(span1, file$c, 104, 63, 3426);
    			attr_dev(li, "tabindex", "0");
    			attr_dev(li, "class", "svelte-mszb43");
    			add_location(li, file$c, 99, 8, 3178);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, span0);
    			append_dev(span0, t0);
    			append_dev(li, t1);
    			append_dev(li, span1);
    			append_dev(span1, t2);
    			append_dev(li, t3);

    			if (!mounted) {
    				dispose = [
    					listen_dev(li, "click", click_handler, false, false, false, false),
    					listen_dev(li, "keydown", keydown_handler, false, false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty & /*$ReportsBySuspect*/ 64 && t0_value !== (t0_value = (/*incident*/ ctx[28].dateTime || 'Unknown Date') + "")) set_data_dev(t0, t0_value);
    			if (dirty & /*$ReportsBySuspect*/ 64 && t2_value !== (t2_value = (/*incident*/ ctx[28].reportTitle || 'No Title') + "")) set_data_dev(t2, t2_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1$1.name,
    		type: "each",
    		source: "(99:6) {#each $ReportsBySuspect as incident}",
    		ctx
    	});

    	return block;
    }

    // (110:4) {#if $TotalReportPages > 1}
    function create_if_block_1$5(ctx) {
    	let div;
    	let button0;
    	let t0;
    	let button0_disabled_value;
    	let t1;
    	let button1;
    	let t2;
    	let button1_disabled_value;
    	let t3;
    	let t4;
    	let button2;
    	let t5;
    	let button2_disabled_value;
    	let t6;
    	let button3;
    	let t7;
    	let button3_disabled_value;
    	let mounted;
    	let dispose;
    	let each_value = getPaginationRange(/*currentPage*/ ctx[0], /*$TotalReportPages*/ ctx[5], 2);
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$9(get_each_context$9(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			button0 = element("button");
    			t0 = text("First");
    			t1 = space();
    			button1 = element("button");
    			t2 = text("Prev");
    			t3 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t4 = space();
    			button2 = element("button");
    			t5 = text("Next");
    			t6 = space();
    			button3 = element("button");
    			t7 = text("Last");
    			button0.disabled = button0_disabled_value = /*currentPage*/ ctx[0] === 1;
    			attr_dev(button0, "class", "svelte-mszb43");
    			add_location(button0, file$c, 112, 8, 3629);
    			button1.disabled = button1_disabled_value = /*currentPage*/ ctx[0] === 1;
    			attr_dev(button1, "class", "svelte-mszb43");
    			add_location(button1, file$c, 113, 8, 3721);
    			button2.disabled = button2_disabled_value = /*currentPage*/ ctx[0] === /*totalPages*/ ctx[7];
    			attr_dev(button2, "class", "svelte-mszb43");
    			add_location(button2, file$c, 133, 8, 4507);
    			button3.disabled = button3_disabled_value = /*currentPage*/ ctx[0] === /*totalPages*/ ctx[7];
    			attr_dev(button3, "class", "svelte-mszb43");
    			add_location(button3, file$c, 134, 8, 4621);
    			attr_dev(div, "class", "pagination svelte-mszb43");
    			add_location(div, file$c, 111, 6, 3595);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, button0);
    			append_dev(button0, t0);
    			append_dev(div, t1);
    			append_dev(div, button1);
    			append_dev(button1, t2);
    			append_dev(div, t3);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				if (each_blocks[i]) {
    					each_blocks[i].m(div, null);
    				}
    			}

    			append_dev(div, t4);
    			append_dev(div, button2);
    			append_dev(button2, t5);
    			append_dev(div, t6);
    			append_dev(div, button3);
    			append_dev(button3, t7);

    			if (!mounted) {
    				dispose = [
    					listen_dev(button0, "click", /*click_handler_1*/ ctx[17], false, false, false, false),
    					listen_dev(button1, "click", /*click_handler_2*/ ctx[18], false, false, false, false),
    					listen_dev(button2, "click", /*click_handler_4*/ ctx[22], false, false, false, false),
    					listen_dev(button3, "click", /*click_handler_5*/ ctx[23], false, false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*currentPage*/ 1 && button0_disabled_value !== (button0_disabled_value = /*currentPage*/ ctx[0] === 1)) {
    				prop_dev(button0, "disabled", button0_disabled_value);
    			}

    			if (dirty & /*currentPage*/ 1 && button1_disabled_value !== (button1_disabled_value = /*currentPage*/ ctx[0] === 1)) {
    				prop_dev(button1, "disabled", button1_disabled_value);
    			}

    			if (dirty & /*handlePageSubmit, totalPages, inputPage, showInput, handleEllipsisClick, getPaginationRange, currentPage, $TotalReportPages, changePage*/ 1959) {
    				each_value = getPaginationRange(/*currentPage*/ ctx[0], /*$TotalReportPages*/ ctx[5], 2);
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$9(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$9(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div, t4);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}

    			if (dirty & /*currentPage*/ 1 && button2_disabled_value !== (button2_disabled_value = /*currentPage*/ ctx[0] === /*totalPages*/ ctx[7])) {
    				prop_dev(button2, "disabled", button2_disabled_value);
    			}

    			if (dirty & /*currentPage*/ 1 && button3_disabled_value !== (button3_disabled_value = /*currentPage*/ ctx[0] === /*totalPages*/ ctx[7])) {
    				prop_dev(button3, "disabled", button3_disabled_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$5.name,
    		type: "if",
    		source: "(110:4) {#if $TotalReportPages > 1}",
    		ctx
    	});

    	return block;
    }

    // (124:10) {:else}
    function create_else_block_1(ctx) {
    	let button;
    	let t_value = /*page*/ ctx[25] + "";
    	let t;
    	let mounted;
    	let dispose;

    	function click_handler_3() {
    		return /*click_handler_3*/ ctx[21](/*page*/ ctx[25]);
    	}

    	const block = {
    		c: function create() {
    			button = element("button");
    			t = text(t_value);
    			attr_dev(button, "class", "svelte-mszb43");
    			toggle_class(button, "active", /*page*/ ctx[25] === /*currentPage*/ ctx[0]);
    			add_location(button, file$c, 124, 12, 4294);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			append_dev(button, t);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", click_handler_3, false, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty & /*currentPage, $TotalReportPages*/ 33 && t_value !== (t_value = /*page*/ ctx[25] + "")) set_data_dev(t, t_value);

    			if (dirty & /*getPaginationRange, currentPage, $TotalReportPages*/ 33) {
    				toggle_class(button, "active", /*page*/ ctx[25] === /*currentPage*/ ctx[0]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_1.name,
    		type: "else",
    		source: "(124:10) {:else}",
    		ctx
    	});

    	return block;
    }

    // (117:10) {#if page === '...'}
    function create_if_block_2$2(ctx) {
    	let if_block_anchor;

    	function select_block_type_2(ctx, dirty) {
    		if (/*showInput*/ ctx[1]) return create_if_block_3$2;
    		return create_else_block$3;
    	}

    	let current_block_type = select_block_type_2(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (current_block_type === (current_block_type = select_block_type_2(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			}
    		},
    		d: function destroy(detaching) {
    			if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$2.name,
    		type: "if",
    		source: "(117:10) {#if page === '...'}",
    		ctx
    	});

    	return block;
    }

    // (121:12) {:else}
    function create_else_block$3(ctx) {
    	let button;
    	let t_value = /*page*/ ctx[25] + "";
    	let t;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			t = text(t_value);
    			attr_dev(button, "class", "svelte-mszb43");
    			add_location(button, file$c, 121, 14, 4188);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			append_dev(button, t);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*handleEllipsisClick*/ ctx[9], false, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*currentPage, $TotalReportPages*/ 33 && t_value !== (t_value = /*page*/ ctx[25] + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$3.name,
    		type: "else",
    		source: "(121:12) {:else}",
    		ctx
    	});

    	return block;
    }

    // (118:12) {#if showInput}
    function create_if_block_3$2(ctx) {
    	let input;
    	let t0;
    	let button;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			input = element("input");
    			t0 = space();
    			button = element("button");
    			button.textContent = "Go";
    			attr_dev(input, "type", "number");
    			attr_dev(input, "min", "1");
    			attr_dev(input, "max", /*totalPages*/ ctx[7]);
    			attr_dev(input, "class", "svelte-mszb43");
    			add_location(input, file$c, 118, 14, 3974);
    			attr_dev(button, "class", "svelte-mszb43");
    			add_location(button, file$c, 119, 14, 4104);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, input, anchor);
    			set_input_value(input, /*inputPage*/ ctx[2]);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, button, anchor);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input, "input", /*input_input_handler*/ ctx[19]),
    					listen_dev(input, "input", /*input_handler*/ ctx[20], false, false, false, false),
    					listen_dev(button, "click", /*handlePageSubmit*/ ctx[10], false, false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*inputPage*/ 4 && to_number(input.value) !== /*inputPage*/ ctx[2]) {
    				set_input_value(input, /*inputPage*/ ctx[2]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(input);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(button);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3$2.name,
    		type: "if",
    		source: "(118:12) {#if showInput}",
    		ctx
    	});

    	return block;
    }

    // (116:8) {#each getPaginationRange(currentPage, $TotalReportPages, 2) as page}
    function create_each_block$9(ctx) {
    	let if_block_anchor;

    	function select_block_type_1(ctx, dirty) {
    		if (/*page*/ ctx[25] === '...') return create_if_block_2$2;
    		return create_else_block_1;
    	}

    	let current_block_type = select_block_type_1(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (current_block_type === (current_block_type = select_block_type_1(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			}
    		},
    		d: function destroy(detaching) {
    			if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$9.name,
    		type: "each",
    		source: "(116:8) {#each getPaginationRange(currentPage, $TotalReportPages, 2) as page}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$c(ctx) {
    	let if_block_anchor;

    	function select_block_type(ctx, dirty) {
    		if (/*$profile*/ ctx[4]) return create_if_block$9;
    		return create_else_block_2;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, [dirty]) {
    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$c.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$c($$self, $$props, $$invalidate) {
    	let $profile;
    	let $TotalReportPages;
    	let $ReportsBySuspect;
    	validate_store(profile, 'profile');
    	component_subscribe($$self, profile, $$value => $$invalidate(4, $profile = $$value));
    	validate_store(TotalReportPages, 'TotalReportPages');
    	component_subscribe($$self, TotalReportPages, $$value => $$invalidate(5, $TotalReportPages = $$value));
    	validate_store(ReportsBySuspect, 'ReportsBySuspect');
    	component_subscribe($$self, ReportsBySuspect, $$value => $$invalidate(6, $ReportsBySuspect = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Profile', slots, []);
    	let { params = {} } = $$props;
    	let currentPage = 1;
    	let itemsPerPage = 5; // Adjust based on your needs
    	let totalPages = 0;
    	let showInput = false; // Controls visibility of the input for the ellipsis
    	let inputPage = currentPage; // Holds the value entered in the input
    	let isWanted = false; // Tracks if the profile is in the wanted list

    	onMount(() => {
    		if (!params.profileId) {
    			console.error("No profileId parameter provided.");
    			return;
    		}

    		const id = parseInt(params.profileId, 10);
    		retrieveProfile();
    		getReportsBySuspect(id);
    		$$invalidate(3, isWanted = $profile.isWanted);
    		console.log('Profile:', $profile);
    		console.log('ReportsBySuspect:', $ReportsBySuspect);
    		console.log('TotalReportPages:', $TotalReportPages);
    	});

    	function changePage(pageNumber) {
    		if (pageNumber > 0 && pageNumber <= totalPages) {
    			$$invalidate(0, currentPage = pageNumber);
    			retrieveProfiles();
    		}
    	}

    	function handleEllipsisClick() {
    		$$invalidate(1, showInput = !showInput); // Toggle input field visibility
    		$$invalidate(2, inputPage = currentPage);
    	}

    	function handlePageSubmit() {
    		const page = parseInt(inputPage);

    		if (page > 0 && page <= totalPages) {
    			changePage(page);
    			$$invalidate(1, showInput = false);
    		}
    	}

    	function navigateToIncident(reportId) {
    		push(`/report-details/${reportId}`);
    	}

    	function uploadMugshot() {
    		const newMugshot = prompt('Enter the URL for the new mugshot:');

    		if (newMugshot) {
    			updateProfile($profile.charId, $profile.isWanted, newMugshot);
    		}
    	}

    	function toggleWantedStatus() {
    		// Toggle the wanted status
    		$$invalidate(3, isWanted = !isWanted);

    		updateProfile($profile.charId, isWanted, $profile.mugshotLink);
    	}

    	const writable_props = ['params'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$7.warn(`<Profile> was created with unknown prop '${key}'`);
    	});

    	const click_handler = incident => navigateToIncident(incident.id);
    	const keydown_handler = (incident, e) => e.key === 'Enter' && navigateToIncident(incident.id);
    	const click_handler_1 = () => changePage(1);
    	const click_handler_2 = () => changePage(currentPage - 1);

    	function input_input_handler() {
    		inputPage = to_number(this.value);
    		$$invalidate(2, inputPage);
    	}

    	const input_handler = e => $$invalidate(2, inputPage = e.target.value);
    	const click_handler_3 = page => changePage(page);
    	const click_handler_4 = () => changePage(currentPage + 1);
    	const click_handler_5 = () => changePage(totalPages);

    	$$self.$$set = $$props => {
    		if ('params' in $$props) $$invalidate(14, params = $$props.params);
    	};

    	$$self.$capture_state = () => ({
    		onMount,
    		profile,
    		retrieveProfile,
    		retrieveProfiles,
    		updateProfile,
    		ReportsBySuspect,
    		getReportsBySuspect,
    		TotalReportPages,
    		push,
    		getPaginationRange,
    		params,
    		currentPage,
    		itemsPerPage,
    		totalPages,
    		showInput,
    		inputPage,
    		isWanted,
    		changePage,
    		handleEllipsisClick,
    		handlePageSubmit,
    		navigateToIncident,
    		uploadMugshot,
    		toggleWantedStatus,
    		$profile,
    		$TotalReportPages,
    		$ReportsBySuspect
    	});

    	$$self.$inject_state = $$props => {
    		if ('params' in $$props) $$invalidate(14, params = $$props.params);
    		if ('currentPage' in $$props) $$invalidate(0, currentPage = $$props.currentPage);
    		if ('itemsPerPage' in $$props) itemsPerPage = $$props.itemsPerPage;
    		if ('totalPages' in $$props) $$invalidate(7, totalPages = $$props.totalPages);
    		if ('showInput' in $$props) $$invalidate(1, showInput = $$props.showInput);
    		if ('inputPage' in $$props) $$invalidate(2, inputPage = $$props.inputPage);
    		if ('isWanted' in $$props) $$invalidate(3, isWanted = $$props.isWanted);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		currentPage,
    		showInput,
    		inputPage,
    		isWanted,
    		$profile,
    		$TotalReportPages,
    		$ReportsBySuspect,
    		totalPages,
    		changePage,
    		handleEllipsisClick,
    		handlePageSubmit,
    		navigateToIncident,
    		uploadMugshot,
    		toggleWantedStatus,
    		params,
    		click_handler,
    		keydown_handler,
    		click_handler_1,
    		click_handler_2,
    		input_input_handler,
    		input_handler,
    		click_handler_3,
    		click_handler_4,
    		click_handler_5
    	];
    }

    class Profile extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$c, create_fragment$c, safe_not_equal, { params: 14 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Profile",
    			options,
    			id: create_fragment$c.name
    		});
    	}

    	get params() {
    		throw new Error("<Profile>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set params(value) {
    		throw new Error("<Profile>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\Profiles\Profiles.svelte generated by Svelte v3.59.2 */

    const { console: console_1$6 } = globals;
    const file$b = "src\\Profiles\\Profiles.svelte";

    function get_each_context$8(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[7] = list[i];
    	return child_ctx;
    }

    // (50:6) {#each $profiles as profile}
    function create_each_block$8(ctx) {
    	let tr;
    	let td0;
    	let strong;
    	let t0_value = /*profile*/ ctx[7].firstname + ' ' + /*profile*/ ctx[7].lastname + "";
    	let t0;
    	let t1;
    	let td1;
    	let t2_value = /*profile*/ ctx[7].charId + "";
    	let t2;
    	let t3;
    	let td2;
    	let t4_value = /*profile*/ ctx[7].job + "";
    	let t4;
    	let t5;
    	let mounted;
    	let dispose;

    	function click_handler_1() {
    		return /*click_handler_1*/ ctx[6](/*profile*/ ctx[7]);
    	}

    	const block = {
    		c: function create() {
    			tr = element("tr");
    			td0 = element("td");
    			strong = element("strong");
    			t0 = text(t0_value);
    			t1 = space();
    			td1 = element("td");
    			t2 = text(t2_value);
    			t3 = space();
    			td2 = element("td");
    			t4 = text(t4_value);
    			t5 = space();
    			add_location(strong, file$b, 51, 14, 1413);
    			attr_dev(td0, "class", "svelte-10hqjag");
    			add_location(td0, file$b, 51, 10, 1409);
    			attr_dev(td1, "class", "svelte-10hqjag");
    			add_location(td1, file$b, 52, 10, 1491);
    			attr_dev(td2, "class", "svelte-10hqjag");
    			add_location(td2, file$b, 53, 10, 1528);
    			attr_dev(tr, "tabindex", "0");
    			attr_dev(tr, "class", "svelte-10hqjag");
    			add_location(tr, file$b, 50, 8, 1333);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, tr, anchor);
    			append_dev(tr, td0);
    			append_dev(td0, strong);
    			append_dev(strong, t0);
    			append_dev(tr, t1);
    			append_dev(tr, td1);
    			append_dev(td1, t2);
    			append_dev(tr, t3);
    			append_dev(tr, td2);
    			append_dev(td2, t4);
    			append_dev(tr, t5);

    			if (!mounted) {
    				dispose = listen_dev(tr, "click", click_handler_1, false, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty & /*$profiles*/ 2 && t0_value !== (t0_value = /*profile*/ ctx[7].firstname + ' ' + /*profile*/ ctx[7].lastname + "")) set_data_dev(t0, t0_value);
    			if (dirty & /*$profiles*/ 2 && t2_value !== (t2_value = /*profile*/ ctx[7].charId + "")) set_data_dev(t2, t2_value);
    			if (dirty & /*$profiles*/ 2 && t4_value !== (t4_value = /*profile*/ ctx[7].job + "")) set_data_dev(t4, t4_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(tr);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$8.name,
    		type: "each",
    		source: "(50:6) {#each $profiles as profile}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$b(ctx) {
    	let div1;
    	let div0;
    	let h1;
    	let t1;
    	let button;
    	let t3;
    	let input;
    	let t4;
    	let table;
    	let thead;
    	let tr;
    	let th0;
    	let t6;
    	let th1;
    	let t8;
    	let th2;
    	let t10;
    	let tbody;
    	let mounted;
    	let dispose;
    	let each_value = /*$profiles*/ ctx[1];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$8(get_each_context$8(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			h1 = element("h1");
    			h1.textContent = "Profiles";
    			t1 = space();
    			button = element("button");
    			button.textContent = "Create New Profile";
    			t3 = space();
    			input = element("input");
    			t4 = space();
    			table = element("table");
    			thead = element("thead");
    			tr = element("tr");
    			th0 = element("th");
    			th0.textContent = "Name";
    			t6 = space();
    			th1 = element("th");
    			th1.textContent = "CharId";
    			t8 = space();
    			th2 = element("th");
    			th2.textContent = "Job";
    			t10 = space();
    			tbody = element("tbody");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(h1, "class", "svelte-10hqjag");
    			add_location(h1, file$b, 29, 4, 844);
    			attr_dev(button, "class", "create-profile-button svelte-10hqjag");
    			add_location(button, file$b, 30, 4, 867);
    			attr_dev(div0, "class", "header-container svelte-10hqjag");
    			add_location(div0, file$b, 28, 2, 808);
    			attr_dev(input, "type", "text");
    			attr_dev(input, "placeholder", "Search profiles...");
    			attr_dev(input, "class", "search-bar svelte-10hqjag");
    			add_location(input, file$b, 33, 2, 986);
    			attr_dev(th0, "class", "svelte-10hqjag");
    			add_location(th0, file$b, 43, 8, 1187);
    			attr_dev(th1, "class", "svelte-10hqjag");
    			add_location(th1, file$b, 44, 8, 1210);
    			attr_dev(th2, "class", "svelte-10hqjag");
    			add_location(th2, file$b, 45, 8, 1235);
    			attr_dev(tr, "class", "svelte-10hqjag");
    			add_location(tr, file$b, 42, 6, 1173);
    			add_location(thead, file$b, 41, 4, 1158);
    			add_location(tbody, file$b, 48, 4, 1280);
    			attr_dev(table, "class", "svelte-10hqjag");
    			add_location(table, file$b, 40, 2, 1145);
    			attr_dev(div1, "class", "profiles-container svelte-10hqjag");
    			add_location(div1, file$b, 27, 0, 772);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			append_dev(div0, h1);
    			append_dev(div0, t1);
    			append_dev(div0, button);
    			append_dev(div1, t3);
    			append_dev(div1, input);
    			set_input_value(input, /*searchQuery*/ ctx[0]);
    			append_dev(div1, t4);
    			append_dev(div1, table);
    			append_dev(table, thead);
    			append_dev(thead, tr);
    			append_dev(tr, th0);
    			append_dev(tr, t6);
    			append_dev(tr, th1);
    			append_dev(tr, t8);
    			append_dev(tr, th2);
    			append_dev(table, t10);
    			append_dev(table, tbody);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				if (each_blocks[i]) {
    					each_blocks[i].m(tbody, null);
    				}
    			}

    			if (!mounted) {
    				dispose = [
    					listen_dev(button, "click", /*click_handler*/ ctx[4], false, false, false, false),
    					listen_dev(input, "input", /*handleSearch*/ ctx[3], false, false, false, false),
    					listen_dev(input, "input", /*input_input_handler*/ ctx[5])
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*searchQuery*/ 1 && input.value !== /*searchQuery*/ ctx[0]) {
    				set_input_value(input, /*searchQuery*/ ctx[0]);
    			}

    			if (dirty & /*navigateToProfile, $profiles*/ 6) {
    				each_value = /*$profiles*/ ctx[1];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$8(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$8(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(tbody, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			destroy_each(each_blocks, detaching);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$b.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$b($$self, $$props, $$invalidate) {
    	let $profiles;
    	validate_store(profiles, 'profiles');
    	component_subscribe($$self, profiles, $$value => $$invalidate(1, $profiles = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Profiles', slots, []);
    	let searchQuery = '';

    	onMount(() => {
    		retrieveProfiles();
    		console.log('Profiles:', $profiles);
    	});

    	function navigateToProfile(profileId) {
    		push(`/player-profiles/${profileId}`);
    	}

    	function handleSearch(event) {
    		$$invalidate(0, searchQuery = event.target.value.toLowerCase());
    		searchProfiles(searchQuery);
    	} /*filteredProfiles = profiles.filter(profile =>
      profile.name.toLowerCase().includes(searchQuery) ||
      profile.charId.toString().includes(searchQuery) ||
      profile.job.toLowerCase().includes(searchQuery)
    );*/

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$6.warn(`<Profiles> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => push('/new-profile');

    	function input_input_handler() {
    		searchQuery = this.value;
    		$$invalidate(0, searchQuery);
    	}

    	const click_handler_1 = profile => navigateToProfile(profile.id);

    	$$self.$capture_state = () => ({
    		onMount,
    		profiles,
    		retrieveProfiles,
    		searchProfiles,
    		push,
    		searchQuery,
    		navigateToProfile,
    		handleSearch,
    		$profiles
    	});

    	$$self.$inject_state = $$props => {
    		if ('searchQuery' in $$props) $$invalidate(0, searchQuery = $$props.searchQuery);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		searchQuery,
    		$profiles,
    		navigateToProfile,
    		handleSearch,
    		click_handler,
    		input_input_handler,
    		click_handler_1
    	];
    }

    class Profiles extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$b, create_fragment$b, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Profiles",
    			options,
    			id: create_fragment$b.name
    		});
    	}
    }

    /* src\Profiles\ProfileForm.svelte generated by Svelte v3.59.2 */
    const file$a = "src\\Profiles\\ProfileForm.svelte";

    function create_fragment$a(ctx) {
    	let div1;
    	let h2;
    	let t1;
    	let form;
    	let div0;
    	let label;
    	let t3;
    	let input;
    	let t4;
    	let button;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			h2 = element("h2");
    			h2.textContent = "Create New Profile";
    			t1 = space();
    			form = element("form");
    			div0 = element("div");
    			label = element("label");
    			label.textContent = "Character ID:";
    			t3 = space();
    			input = element("input");
    			t4 = space();
    			button = element("button");
    			button.textContent = "Create Profile";
    			add_location(h2, file$a, 21, 4, 634);
    			attr_dev(label, "for", "charId");
    			attr_dev(label, "class", "svelte-1daw0hx");
    			add_location(label, file$a, 24, 8, 755);
    			attr_dev(input, "id", "charId");
    			attr_dev(input, "type", "number");
    			input.required = true;
    			attr_dev(input, "class", "svelte-1daw0hx");
    			add_location(input, file$a, 25, 8, 806);
    			attr_dev(div0, "class", "form-group svelte-1daw0hx");
    			add_location(div0, file$a, 23, 6, 721);
    			attr_dev(button, "type", "submit");
    			attr_dev(button, "class", "submit-button svelte-1daw0hx");
    			add_location(button, file$a, 28, 6, 896);
    			add_location(form, file$a, 22, 4, 667);
    			attr_dev(div1, "class", "profile-form-container svelte-1daw0hx");
    			add_location(div1, file$a, 20, 2, 592);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, h2);
    			append_dev(div1, t1);
    			append_dev(div1, form);
    			append_dev(form, div0);
    			append_dev(div0, label);
    			append_dev(div0, t3);
    			append_dev(div0, input);
    			set_input_value(input, /*charId*/ ctx[0]);
    			append_dev(form, t4);
    			append_dev(form, button);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input, "input", /*input_input_handler*/ ctx[2]),
    					listen_dev(form, "submit", prevent_default(/*handleSubmit*/ ctx[1]), false, true, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*charId*/ 1 && to_number(input.value) !== /*charId*/ ctx[0]) {
    				set_input_value(input, /*charId*/ ctx[0]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$a.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$a($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('ProfileForm', slots, []);
    	let name = '';
    	let charId = '';
    	let job = '';
    	let mugshotLink = '';

    	// Function to handle form submission
    	function handleSubmit() {
    		// Add the new profile to dummyPlayerProfiles
    		createProfile(parseInt(charId, 10), false, '');

    		// Redirect to profiles list
    		push('/player-profiles');
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<ProfileForm> was created with unknown prop '${key}'`);
    	});

    	function input_input_handler() {
    		charId = to_number(this.value);
    		$$invalidate(0, charId);
    	}

    	$$self.$capture_state = () => ({
    		push,
    		createProfile,
    		profiles,
    		name,
    		charId,
    		job,
    		mugshotLink,
    		handleSubmit
    	});

    	$$self.$inject_state = $$props => {
    		if ('name' in $$props) name = $$props.name;
    		if ('charId' in $$props) $$invalidate(0, charId = $$props.charId);
    		if ('job' in $$props) job = $$props.job;
    		if ('mugshotLink' in $$props) mugshotLink = $$props.mugshotLink;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [charId, handleSubmit, input_input_handler];
    }

    class ProfileForm extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$a, create_fragment$a, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ProfileForm",
    			options,
    			id: create_fragment$a.name
    		});
    	}
    }

    /* src\Calculator\ChargeConfig.svelte generated by Svelte v3.59.2 */
    const file$9 = "src\\Calculator\\ChargeConfig.svelte";

    function get_each_context$7(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[19] = list[i];
    	return child_ctx;
    }

    function get_each_context_1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[22] = list[i];
    	return child_ctx;
    }

    // (88:2) {#if showForm}
    function create_if_block$8(ctx) {
    	let form;
    	let div0;
    	let label0;
    	let t1;
    	let input0;
    	let t2;
    	let div1;
    	let label1;
    	let t4;
    	let input1;
    	let t5;
    	let div2;
    	let label2;
    	let t7;
    	let input2;
    	let t8;
    	let div3;
    	let label3;
    	let t10;
    	let input3;
    	let t11;
    	let div4;
    	let label4;
    	let t13;
    	let input4;
    	let t14;
    	let div5;
    	let label5;
    	let t16;
    	let input5;
    	let t17;
    	let div6;
    	let label6;
    	let t19;
    	let select;
    	let t20;
    	let button0;
    	let t22;
    	let button1;
    	let mounted;
    	let dispose;
    	let each_value_1 = /*confiscates*/ ctx[3];
    	validate_each_argument(each_value_1);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
    	}

    	const block = {
    		c: function create() {
    			form = element("form");
    			div0 = element("div");
    			label0 = element("label");
    			label0.textContent = "Charge:";
    			t1 = space();
    			input0 = element("input");
    			t2 = space();
    			div1 = element("div");
    			label1 = element("label");
    			label1.textContent = "Fine:";
    			t4 = space();
    			input1 = element("input");
    			t5 = space();
    			div2 = element("div");
    			label2 = element("label");
    			label2.textContent = "Jail Time:";
    			t7 = space();
    			input2 = element("input");
    			t8 = space();
    			div3 = element("div");
    			label3 = element("label");
    			label3.textContent = "Stackable:";
    			t10 = space();
    			input3 = element("input");
    			t11 = space();
    			div4 = element("div");
    			label4 = element("label");
    			label4.textContent = "Stack Jail Cap:";
    			t13 = space();
    			input4 = element("input");
    			t14 = space();
    			div5 = element("div");
    			label5 = element("label");
    			label5.textContent = "Stack Fine Cap:";
    			t16 = space();
    			input5 = element("input");
    			t17 = space();
    			div6 = element("div");
    			label6 = element("label");
    			label6.textContent = "Confiscate:";
    			t19 = space();
    			select = element("select");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t20 = space();
    			button0 = element("button");
    			button0.textContent = "Save Charge";
    			t22 = space();
    			button1 = element("button");
    			button1.textContent = "Reset";
    			attr_dev(label0, "class", "svelte-16q2xet");
    			add_location(label0, file$9, 90, 8, 2667);
    			attr_dev(input0, "type", "text");
    			input0.required = true;
    			attr_dev(input0, "class", "svelte-16q2xet");
    			add_location(input0, file$9, 91, 8, 2699);
    			attr_dev(div0, "class", "form-group svelte-16q2xet");
    			add_location(div0, file$9, 89, 6, 2633);
    			attr_dev(label1, "class", "svelte-16q2xet");
    			add_location(label1, file$9, 95, 8, 2817);
    			attr_dev(input1, "type", "number");
    			attr_dev(input1, "class", "svelte-16q2xet");
    			add_location(input1, file$9, 96, 8, 2847);
    			attr_dev(div1, "class", "form-group svelte-16q2xet");
    			add_location(div1, file$9, 94, 6, 2783);
    			attr_dev(label2, "class", "svelte-16q2xet");
    			add_location(label2, file$9, 100, 8, 2956);
    			attr_dev(input2, "type", "number");
    			attr_dev(input2, "class", "svelte-16q2xet");
    			add_location(input2, file$9, 101, 8, 2991);
    			attr_dev(div2, "class", "form-group svelte-16q2xet");
    			add_location(div2, file$9, 99, 6, 2922);
    			attr_dev(label3, "class", "svelte-16q2xet");
    			add_location(label3, file$9, 105, 8, 3100);
    			attr_dev(input3, "type", "checkbox");
    			attr_dev(input3, "class", "svelte-16q2xet");
    			add_location(input3, file$9, 106, 8, 3135);
    			attr_dev(div3, "class", "form-group svelte-16q2xet");
    			add_location(div3, file$9, 104, 6, 3066);
    			attr_dev(label4, "class", "svelte-16q2xet");
    			add_location(label4, file$9, 110, 8, 3253);
    			attr_dev(input4, "type", "number");
    			attr_dev(input4, "class", "svelte-16q2xet");
    			add_location(input4, file$9, 111, 8, 3293);
    			attr_dev(div4, "class", "form-group svelte-16q2xet");
    			add_location(div4, file$9, 109, 6, 3219);
    			attr_dev(label5, "class", "svelte-16q2xet");
    			add_location(label5, file$9, 115, 8, 3410);
    			attr_dev(input5, "type", "number");
    			attr_dev(input5, "class", "svelte-16q2xet");
    			add_location(input5, file$9, 116, 8, 3450);
    			attr_dev(div5, "class", "form-group svelte-16q2xet");
    			add_location(div5, file$9, 114, 6, 3376);
    			attr_dev(label6, "class", "svelte-16q2xet");
    			add_location(label6, file$9, 120, 8, 3567);
    			attr_dev(select, "class", "svelte-16q2xet");
    			if (/*newCharge*/ ctx[0].confiscate === void 0) add_render_callback(() => /*select_change_handler*/ ctx[16].call(select));
    			add_location(select, file$9, 121, 8, 3603);
    			attr_dev(div6, "class", "form-group svelte-16q2xet");
    			add_location(div6, file$9, 119, 6, 3533);
    			attr_dev(button0, "type", "submit");
    			attr_dev(button0, "class", "save-button svelte-16q2xet");
    			add_location(button0, file$9, 128, 6, 3810);
    			attr_dev(button1, "type", "button");
    			attr_dev(button1, "class", "reset-button svelte-16q2xet");
    			add_location(button1, file$9, 129, 6, 3880);
    			attr_dev(form, "class", "charge-form");
    			add_location(form, file$9, 88, 4, 2561);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, form, anchor);
    			append_dev(form, div0);
    			append_dev(div0, label0);
    			append_dev(div0, t1);
    			append_dev(div0, input0);
    			set_input_value(input0, /*newCharge*/ ctx[0].charge);
    			append_dev(form, t2);
    			append_dev(form, div1);
    			append_dev(div1, label1);
    			append_dev(div1, t4);
    			append_dev(div1, input1);
    			set_input_value(input1, /*newCharge*/ ctx[0].fine);
    			append_dev(form, t5);
    			append_dev(form, div2);
    			append_dev(div2, label2);
    			append_dev(div2, t7);
    			append_dev(div2, input2);
    			set_input_value(input2, /*newCharge*/ ctx[0].jail);
    			append_dev(form, t8);
    			append_dev(form, div3);
    			append_dev(div3, label3);
    			append_dev(div3, t10);
    			append_dev(div3, input3);
    			input3.checked = /*newCharge*/ ctx[0].stackable;
    			append_dev(form, t11);
    			append_dev(form, div4);
    			append_dev(div4, label4);
    			append_dev(div4, t13);
    			append_dev(div4, input4);
    			set_input_value(input4, /*newCharge*/ ctx[0].stackJailCap);
    			append_dev(form, t14);
    			append_dev(form, div5);
    			append_dev(div5, label5);
    			append_dev(div5, t16);
    			append_dev(div5, input5);
    			set_input_value(input5, /*newCharge*/ ctx[0].stackFineCap);
    			append_dev(form, t17);
    			append_dev(form, div6);
    			append_dev(div6, label6);
    			append_dev(div6, t19);
    			append_dev(div6, select);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				if (each_blocks[i]) {
    					each_blocks[i].m(select, null);
    				}
    			}

    			select_option(select, /*newCharge*/ ctx[0].confiscate, true);
    			append_dev(form, t20);
    			append_dev(form, button0);
    			append_dev(form, t22);
    			append_dev(form, button1);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input0, "input", /*input0_input_handler*/ ctx[10]),
    					listen_dev(input1, "input", /*input1_input_handler*/ ctx[11]),
    					listen_dev(input2, "input", /*input2_input_handler*/ ctx[12]),
    					listen_dev(input3, "change", /*input3_change_handler*/ ctx[13]),
    					listen_dev(input4, "input", /*input4_input_handler*/ ctx[14]),
    					listen_dev(input5, "input", /*input5_input_handler*/ ctx[15]),
    					listen_dev(select, "change", /*select_change_handler*/ ctx[16]),
    					listen_dev(button1, "click", /*resetForm*/ ctx[8], false, false, false, false),
    					listen_dev(form, "submit", prevent_default(/*saveCharge*/ ctx[6]), false, true, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*newCharge, confiscates*/ 9 && input0.value !== /*newCharge*/ ctx[0].charge) {
    				set_input_value(input0, /*newCharge*/ ctx[0].charge);
    			}

    			if (dirty & /*newCharge, confiscates*/ 9 && to_number(input1.value) !== /*newCharge*/ ctx[0].fine) {
    				set_input_value(input1, /*newCharge*/ ctx[0].fine);
    			}

    			if (dirty & /*newCharge, confiscates*/ 9 && to_number(input2.value) !== /*newCharge*/ ctx[0].jail) {
    				set_input_value(input2, /*newCharge*/ ctx[0].jail);
    			}

    			if (dirty & /*newCharge, confiscates*/ 9) {
    				input3.checked = /*newCharge*/ ctx[0].stackable;
    			}

    			if (dirty & /*newCharge, confiscates*/ 9 && to_number(input4.value) !== /*newCharge*/ ctx[0].stackJailCap) {
    				set_input_value(input4, /*newCharge*/ ctx[0].stackJailCap);
    			}

    			if (dirty & /*newCharge, confiscates*/ 9 && to_number(input5.value) !== /*newCharge*/ ctx[0].stackFineCap) {
    				set_input_value(input5, /*newCharge*/ ctx[0].stackFineCap);
    			}

    			if (dirty & /*confiscates*/ 8) {
    				each_value_1 = /*confiscates*/ ctx[3];
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1(ctx, each_value_1, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(select, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_1.length;
    			}

    			if (dirty & /*newCharge, confiscates*/ 9) {
    				select_option(select, /*newCharge*/ ctx[0].confiscate);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(form);
    			destroy_each(each_blocks, detaching);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$8.name,
    		type: "if",
    		source: "(88:2) {#if showForm}",
    		ctx
    	});

    	return block;
    }

    // (123:10) {#each confiscates as option}
    function create_each_block_1(ctx) {
    	let option;
    	let t_value = /*option*/ ctx[22].conf + "";
    	let t;

    	const block = {
    		c: function create() {
    			option = element("option");
    			t = text(t_value);
    			option.__value = /*option*/ ctx[22].id;
    			option.value = option.__value;
    			add_location(option, file$9, 123, 12, 3700);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, option, anchor);
    			append_dev(option, t);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(option);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1.name,
    		type: "each",
    		source: "(123:10) {#each confiscates as option}",
    		ctx
    	});

    	return block;
    }

    // (149:6) {#each $chargeList as charge}
    function create_each_block$7(ctx) {
    	let tr;
    	let td0;
    	let t0_value = /*charge*/ ctx[19].charge + "";
    	let t0;
    	let t1;
    	let td1;
    	let t2_value = /*charge*/ ctx[19].fine + "";
    	let t2;
    	let t3;
    	let td2;
    	let t4_value = /*charge*/ ctx[19].jail + "";
    	let t4;
    	let t5;
    	let td3;
    	let t6_value = (/*charge*/ ctx[19].note ? 'Yes' : 'No') + "";
    	let t6;
    	let t7;
    	let td4;
    	let t8_value = (/*charge*/ ctx[19].stackable ? 'Yes' : 'No') + "";
    	let t8;
    	let t9;
    	let td5;
    	let t10_value = /*charge*/ ctx[19].stackJailCap + "";
    	let t10;
    	let t11;
    	let td6;
    	let t12_value = /*charge*/ ctx[19].stackFineCap + "";
    	let t12;
    	let t13;
    	let td7;
    	let button0;
    	let t15;
    	let button1;
    	let t17;
    	let mounted;
    	let dispose;

    	function click_handler_1() {
    		return /*click_handler_1*/ ctx[17](/*charge*/ ctx[19]);
    	}

    	function click_handler_2() {
    		return /*click_handler_2*/ ctx[18](/*charge*/ ctx[19]);
    	}

    	const block = {
    		c: function create() {
    			tr = element("tr");
    			td0 = element("td");
    			t0 = text(t0_value);
    			t1 = space();
    			td1 = element("td");
    			t2 = text(t2_value);
    			t3 = space();
    			td2 = element("td");
    			t4 = text(t4_value);
    			t5 = space();
    			td3 = element("td");
    			t6 = text(t6_value);
    			t7 = space();
    			td4 = element("td");
    			t8 = text(t8_value);
    			t9 = space();
    			td5 = element("td");
    			t10 = text(t10_value);
    			t11 = space();
    			td6 = element("td");
    			t12 = text(t12_value);
    			t13 = space();
    			td7 = element("td");
    			button0 = element("button");
    			button0.textContent = "Edit";
    			t15 = space();
    			button1 = element("button");
    			button1.textContent = "Delete";
    			t17 = space();
    			attr_dev(td0, "class", "svelte-16q2xet");
    			add_location(td0, file$9, 150, 10, 4416);
    			attr_dev(td1, "class", "svelte-16q2xet");
    			add_location(td1, file$9, 151, 10, 4452);
    			attr_dev(td2, "class", "svelte-16q2xet");
    			add_location(td2, file$9, 152, 10, 4486);
    			attr_dev(td3, "class", "svelte-16q2xet");
    			add_location(td3, file$9, 153, 10, 4520);
    			attr_dev(td4, "class", "svelte-16q2xet");
    			add_location(td4, file$9, 154, 10, 4569);
    			attr_dev(td5, "class", "svelte-16q2xet");
    			add_location(td5, file$9, 155, 10, 4623);
    			attr_dev(td6, "class", "svelte-16q2xet");
    			add_location(td6, file$9, 156, 10, 4665);
    			attr_dev(button0, "class", "edit-button svelte-16q2xet");
    			add_location(button0, file$9, 158, 12, 4746);
    			attr_dev(button1, "class", "delete-button svelte-16q2xet");
    			add_location(button1, file$9, 159, 12, 4837);
    			attr_dev(td7, "class", "actions-cell svelte-16q2xet");
    			add_location(td7, file$9, 157, 10, 4707);
    			attr_dev(tr, "class", "svelte-16q2xet");
    			add_location(tr, file$9, 149, 8, 4400);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, tr, anchor);
    			append_dev(tr, td0);
    			append_dev(td0, t0);
    			append_dev(tr, t1);
    			append_dev(tr, td1);
    			append_dev(td1, t2);
    			append_dev(tr, t3);
    			append_dev(tr, td2);
    			append_dev(td2, t4);
    			append_dev(tr, t5);
    			append_dev(tr, td3);
    			append_dev(td3, t6);
    			append_dev(tr, t7);
    			append_dev(tr, td4);
    			append_dev(td4, t8);
    			append_dev(tr, t9);
    			append_dev(tr, td5);
    			append_dev(td5, t10);
    			append_dev(tr, t11);
    			append_dev(tr, td6);
    			append_dev(td6, t12);
    			append_dev(tr, t13);
    			append_dev(tr, td7);
    			append_dev(td7, button0);
    			append_dev(td7, t15);
    			append_dev(td7, button1);
    			append_dev(tr, t17);

    			if (!mounted) {
    				dispose = [
    					listen_dev(button0, "click", click_handler_1, false, false, false, false),
    					listen_dev(button1, "click", click_handler_2, false, false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty & /*$chargeList*/ 4 && t0_value !== (t0_value = /*charge*/ ctx[19].charge + "")) set_data_dev(t0, t0_value);
    			if (dirty & /*$chargeList*/ 4 && t2_value !== (t2_value = /*charge*/ ctx[19].fine + "")) set_data_dev(t2, t2_value);
    			if (dirty & /*$chargeList*/ 4 && t4_value !== (t4_value = /*charge*/ ctx[19].jail + "")) set_data_dev(t4, t4_value);
    			if (dirty & /*$chargeList*/ 4 && t6_value !== (t6_value = (/*charge*/ ctx[19].note ? 'Yes' : 'No') + "")) set_data_dev(t6, t6_value);
    			if (dirty & /*$chargeList*/ 4 && t8_value !== (t8_value = (/*charge*/ ctx[19].stackable ? 'Yes' : 'No') + "")) set_data_dev(t8, t8_value);
    			if (dirty & /*$chargeList*/ 4 && t10_value !== (t10_value = /*charge*/ ctx[19].stackJailCap + "")) set_data_dev(t10, t10_value);
    			if (dirty & /*$chargeList*/ 4 && t12_value !== (t12_value = /*charge*/ ctx[19].stackFineCap + "")) set_data_dev(t12, t12_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(tr);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$7.name,
    		type: "each",
    		source: "(149:6) {#each $chargeList as charge}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$9(ctx) {
    	let div;
    	let h2;
    	let t1;
    	let button;
    	let t2_value = (/*showForm*/ ctx[1] ? 'Cancel' : 'Create New Charge') + "";
    	let t2;
    	let t3;
    	let t4;
    	let table;
    	let thead;
    	let tr;
    	let th0;
    	let t6;
    	let th1;
    	let t8;
    	let th2;
    	let t10;
    	let th3;
    	let t12;
    	let th4;
    	let t14;
    	let th5;
    	let t16;
    	let th6;
    	let t18;
    	let th7;
    	let t20;
    	let tbody;
    	let mounted;
    	let dispose;
    	let if_block = /*showForm*/ ctx[1] && create_if_block$8(ctx);
    	let each_value = /*$chargeList*/ ctx[2];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$7(get_each_context$7(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			h2 = element("h2");
    			h2.textContent = "Charge Configurations";
    			t1 = space();
    			button = element("button");
    			t2 = text(t2_value);
    			t3 = space();
    			if (if_block) if_block.c();
    			t4 = space();
    			table = element("table");
    			thead = element("thead");
    			tr = element("tr");
    			th0 = element("th");
    			th0.textContent = "Charge";
    			t6 = space();
    			th1 = element("th");
    			th1.textContent = "Fine";
    			t8 = space();
    			th2 = element("th");
    			th2.textContent = "Jail Time";
    			t10 = space();
    			th3 = element("th");
    			th3.textContent = "Note";
    			t12 = space();
    			th4 = element("th");
    			th4.textContent = "Stackable";
    			t14 = space();
    			th5 = element("th");
    			th5.textContent = "Stack Jail Cap";
    			t16 = space();
    			th6 = element("th");
    			th6.textContent = "Stack Fine Cap";
    			t18 = space();
    			th7 = element("th");
    			th7.textContent = "Actions";
    			t20 = space();
    			tbody = element("tbody");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			add_location(h2, file$9, 79, 2, 2272);
    			attr_dev(button, "class", "toggle-form-button svelte-16q2xet");
    			add_location(button, file$9, 82, 2, 2371);
    			attr_dev(th0, "class", "svelte-16q2xet");
    			add_location(th0, file$9, 137, 8, 4104);
    			attr_dev(th1, "class", "svelte-16q2xet");
    			add_location(th1, file$9, 138, 8, 4129);
    			attr_dev(th2, "class", "svelte-16q2xet");
    			add_location(th2, file$9, 139, 8, 4152);
    			attr_dev(th3, "class", "svelte-16q2xet");
    			add_location(th3, file$9, 140, 8, 4180);
    			attr_dev(th4, "class", "svelte-16q2xet");
    			add_location(th4, file$9, 141, 8, 4203);
    			attr_dev(th5, "class", "svelte-16q2xet");
    			add_location(th5, file$9, 142, 8, 4231);
    			attr_dev(th6, "class", "svelte-16q2xet");
    			add_location(th6, file$9, 143, 8, 4264);
    			attr_dev(th7, "class", "svelte-16q2xet");
    			add_location(th7, file$9, 144, 8, 4297);
    			attr_dev(tr, "class", "svelte-16q2xet");
    			add_location(tr, file$9, 136, 6, 4090);
    			add_location(thead, file$9, 135, 4, 4075);
    			add_location(tbody, file$9, 147, 4, 4346);
    			attr_dev(table, "class", "charges-table svelte-16q2xet");
    			add_location(table, file$9, 134, 2, 4040);
    			attr_dev(div, "class", "config-container svelte-16q2xet");
    			add_location(div, file$9, 78, 0, 2238);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, h2);
    			append_dev(div, t1);
    			append_dev(div, button);
    			append_dev(button, t2);
    			append_dev(div, t3);
    			if (if_block) if_block.m(div, null);
    			append_dev(div, t4);
    			append_dev(div, table);
    			append_dev(table, thead);
    			append_dev(thead, tr);
    			append_dev(tr, th0);
    			append_dev(tr, t6);
    			append_dev(tr, th1);
    			append_dev(tr, t8);
    			append_dev(tr, th2);
    			append_dev(tr, t10);
    			append_dev(tr, th3);
    			append_dev(tr, t12);
    			append_dev(tr, th4);
    			append_dev(tr, t14);
    			append_dev(tr, th5);
    			append_dev(tr, t16);
    			append_dev(tr, th6);
    			append_dev(tr, t18);
    			append_dev(tr, th7);
    			append_dev(table, t20);
    			append_dev(table, tbody);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				if (each_blocks[i]) {
    					each_blocks[i].m(tbody, null);
    				}
    			}

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*click_handler*/ ctx[9], false, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*showForm*/ 2 && t2_value !== (t2_value = (/*showForm*/ ctx[1] ? 'Cancel' : 'Create New Charge') + "")) set_data_dev(t2, t2_value);

    			if (/*showForm*/ ctx[1]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$8(ctx);
    					if_block.c();
    					if_block.m(div, t4);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			if (dirty & /*deleteCharge, $chargeList, editCharge*/ 164) {
    				each_value = /*$chargeList*/ ctx[2];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$7(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$7(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(tbody, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (if_block) if_block.d();
    			destroy_each(each_blocks, detaching);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$9.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$9($$self, $$props, $$invalidate) {
    	let $chargeList;
    	validate_store(chargeList, 'chargeList');
    	component_subscribe($$self, chargeList, $$value => $$invalidate(2, $chargeList = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('ChargeConfig', slots, []);

    	const confiscates = [
    		{ id: 0, conf: "N/A" },
    		{ id: 1, conf: "Removal of Weapon(s) used" },
    		{
    			id: 2,
    			conf: "Contraband & Potential Cash (From Contraband Sales)"
    		},
    		{
    			id: 3,
    			conf: "Amount of appraisal of possessions taken from person"
    		},
    		{
    			id: 4,
    			conf: "Proven extorted Goods, Weapons, or Money"
    		},
    		{
    			id: 5,
    			conf: "Removal of all Weapons and Contraband. If surrender only removal of Contraband"
    		},
    		{
    			id: 6,
    			conf: "Any documents used to falsely pose as a government official"
    		},
    		{ id: 7, conf: "Scoped Weapon" },
    		{ id: 8, conf: "Removal of Contraband" }
    	];

    	// Temporary fields to add or edit a charge
    	let newCharge = {
    		charge: '',
    		fine: 0,
    		jail: 0,
    		note: false,
    		stackable: false,
    		stackJailCap: 0,
    		stackFineCap: 0,
    		confiscate: 0
    	};

    	let showForm = false; // State to control form visibility

    	// Function to toggle form visibility
    	function toggleForm() {
    		$$invalidate(1, showForm = !showForm);
    	}

    	// Function to handle editing a charge
    	function editCharge(charge) {
    		$$invalidate(0, newCharge = { ...charge });
    		$$invalidate(1, showForm = true); // Ensure the form is displayed when editing
    	}

    	// Function to add or update a charge
    	function saveCharge() {
    		chargeList.update(charges => {
    			const index = charges.findIndex(c => c.charge === newCharge.charge);

    			if (index > -1) {
    				charges[index] = { ...newCharge }; // Update existing charge
    			} else {
    				charges.push({ ...newCharge }); // Add new charge
    			}

    			resetForm();
    			return charges;
    		});
    	}

    	// Function to delete a charge
    	function deleteCharge(charge) {
    		chargeList.update(charges => charges.filter(c => c.charge !== charge));
    	}

    	// Reset the form fields
    	function resetForm() {
    		$$invalidate(0, newCharge = {
    			charge: '',
    			fine: 0,
    			jail: 0,
    			note: false,
    			stackable: false,
    			stackJailCap: 0,
    			stackFineCap: 0,
    			confiscate: 0
    		});

    		$$invalidate(1, showForm = false);
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<ChargeConfig> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => toggleForm();

    	function input0_input_handler() {
    		newCharge.charge = this.value;
    		$$invalidate(0, newCharge);
    		$$invalidate(3, confiscates);
    	}

    	function input1_input_handler() {
    		newCharge.fine = to_number(this.value);
    		$$invalidate(0, newCharge);
    		$$invalidate(3, confiscates);
    	}

    	function input2_input_handler() {
    		newCharge.jail = to_number(this.value);
    		$$invalidate(0, newCharge);
    		$$invalidate(3, confiscates);
    	}

    	function input3_change_handler() {
    		newCharge.stackable = this.checked;
    		$$invalidate(0, newCharge);
    		$$invalidate(3, confiscates);
    	}

    	function input4_input_handler() {
    		newCharge.stackJailCap = to_number(this.value);
    		$$invalidate(0, newCharge);
    		$$invalidate(3, confiscates);
    	}

    	function input5_input_handler() {
    		newCharge.stackFineCap = to_number(this.value);
    		$$invalidate(0, newCharge);
    		$$invalidate(3, confiscates);
    	}

    	function select_change_handler() {
    		newCharge.confiscate = select_value(this);
    		$$invalidate(0, newCharge);
    		$$invalidate(3, confiscates);
    	}

    	const click_handler_1 = charge => editCharge(charge);
    	const click_handler_2 = charge => deleteCharge(charge.charge);

    	$$self.$capture_state = () => ({
    		chargeList,
    		confiscates,
    		newCharge,
    		showForm,
    		toggleForm,
    		editCharge,
    		saveCharge,
    		deleteCharge,
    		resetForm,
    		$chargeList
    	});

    	$$self.$inject_state = $$props => {
    		if ('newCharge' in $$props) $$invalidate(0, newCharge = $$props.newCharge);
    		if ('showForm' in $$props) $$invalidate(1, showForm = $$props.showForm);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		newCharge,
    		showForm,
    		$chargeList,
    		confiscates,
    		toggleForm,
    		editCharge,
    		saveCharge,
    		deleteCharge,
    		resetForm,
    		click_handler,
    		input0_input_handler,
    		input1_input_handler,
    		input2_input_handler,
    		input3_change_handler,
    		input4_input_handler,
    		input5_input_handler,
    		select_change_handler,
    		click_handler_1,
    		click_handler_2
    	];
    }

    class ChargeConfig extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$9, create_fragment$9, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ChargeConfig",
    			options,
    			id: create_fragment$9.name
    		});
    	}
    }

    const defaultCaseFiles = [
        {
            id: 1,
            name: 'Case File 1',
            created: '2021-01-01 00:00:00',
            updated: '2021-01-01 00:00:00',
            user_id: 1,
            status: 'open',
            pages: [
                {
                    id: 1,
                    created: '2021-01-01 00:00:00',
                    updated: '2021-01-01 00:00:00',
                    user_id: 1,
                    blocks: [
                        {
                            id: 1,
                            type: 'Paragraph',
                            content: 'This is a text block',
                            created: '2021-01-01 00:00:00',
                            updated: '2021-01-01 00:00:00',
                            user_id: 1
                        }
                    ]
                }
            ]
        },
        {
            id: 2,
            name: 'Case File 2',
            created: '2021-01-01 00:00:00',
            updated: '2021-01-01 00:00:00',
            user_id: 1,
            status: 'open',
            pages: [
                {
                    id: 2,
                    created: '2021-01-01 00:00:00',
                    updated: '2021-01-01 00:00:00',
                    user_id: 1,
                    blocks: [
                        {
                            id: 2,
                            type: 'Paragraph',
                            content: 'This is a text block',
                            created: '2021-01-01 00:00:00',
                            updated: '2021-01-01 00:00:00',
                            user_id: 1
                        }
                    ]
                }
            ]
        }
    ];

    const defaultCaseFile = {
        id: 2,
        name: 'Case File 2',
        created: '2021-01-01 00:00:00',
        updated: '2021-01-01 00:00:00',
        user_id: 1,
        status: 'open',
        pages: [
            {
                id: 2,
                created: '2021-01-01 00:00:00',
                updated: '2021-01-01 00:00:00',
                user_id: 1,
                blocks: [
                    {
                        id: 2,
                        type: 'Paragraph',
                        content: 'This is a text block',
                        created: '2021-01-01 00:00:00',
                        updated: '2021-01-01 00:00:00',
                        user_id: 1
                    }
                ]
            }
        ]
    };

    const defaultCaseFilesView = [
        {
            id: 1,
            name: 'Case File 1',
            created: '2021-01-01 00:00:00',        
        },
        {
            id: 2,
            name: 'Case File 2',
            created: '2021-01-01 00:00:00'
        }
    ];

    const defaultCaseFilePageView = {
        id: 1,
        created: '2021-01-01 00:00:00',
        updated: '2021-01-01 00:00:00',
        casefile_id: 2,
        blocks: [
            {
                id: 2,
                type: 'Paragraph',
                content: 'This is a text block',
                created: '2021-01-01 00:00:00',
                updated: '2021-01-01 00:00:00',
                page_id: 2                    
            },
        ]
    };

    const defaultCaseFileView = {
        id: 2,
        name: 'Case File 2',
        created: '2021-01-01 00:00:00',
        user_id: 1,
        pages: [
            {
                page_id: 2,
                casefile_id: 2,
                blocks: [
                    {
                        id: 2,
                        type: 'Paragraph',
                        content: 'This is a text block'
                    }
                ]
            }
        ]
    };

    const caseFiles = writable(defaultCaseFiles);
    const caseFile = writable(defaultCaseFile); // { name: '', pages: [{ blocks: [] }] }
    const caseFilesView = writable(defaultCaseFilesView);
    const caseFilePageView = writable(defaultCaseFilePageView);
    const caseFileView = writable(defaultCaseFileView);
    const caseFileTotalPages = writable(0);

    window.addEventListener('message', function(event) {
        switch(event.data.type) {
            case "caseFilesRetrieved":
                setCaseFiles(event.data.casefiles);
                break;
            case "caseFileRetrieved":
                setCaseFile(event.data.casefile);
                break;
            case "caseFilesViewRetrieved":
                setCaseFileView.set(event.data.casefilesView);
                break;
            case "caseFilePageRetrieved":
                setCaseFilePageView.set(event.data.casefileView);
                break;
            case "caseFileViewRetrieved":
                setCaseFilesView.set(event.data.casefileView);
                break;
            case "caseFileTotalPagesRetrieved":
                setCaseFileTotalPages(event.data.totalPages);
                break;
        }
    });

    function setCaseFiles(data) {
        caseFiles.set(data);
    }

    function setCaseFile(data) {
        caseFile.set(data);
    }

    function setCaseFilesView(data) {
        caseFilesView.set(data);
    }

    function setCaseFilePageView(data) {
        caseFilePageView.set(data);
    }

    function setCaseFileView(data) {
        caseFileView.set(data);
    }

    function setCaseFileTotalPages(data) {
        caseFileTotalPages.set(data);
    }

    function retrieveCaseFile(casefile_id) {
        {
            caseFile.subscribe(value => {
                if (Object.keys(value).length === 0) {
                    setCaseFile(defaultCaseFile);
                }
            });
        }
    }

    function retrieveCaseFilesView() {
        {
            caseFilesView.subscribe(value => {
                if (value.length === 0) {
                    setCaseFilesView(defaultCaseFilesView);
                }
            });
        }
    }

    function retrieveCaseFileView(casefile_id) {
        {
            caseFiles.subscribe(value => {
                if (Object.keys(value).length === 0) {
                    setCaseFileView(defaultCaseFileView);
                } else {
                    const caseFile = value.find(c => c.id === casefile_id);
                    setCaseFileView(caseFile);
                }
            });
        }
        retrieveCaseFileTotalPages(casefile_id);
    }

    function retrieveCaseFilePageView(pageIndex) {
        {
            caseFileView.subscribe(value => {
                if (value === undefined) {
                    setCaseFilePageView(defaultCaseFilePageView);
                } else {
                    // Return the page at the specified index
                    setCaseFilePageView(value.pages[pageIndex]);
                }
            });
        }
    }

    function createCaseFile(casefileData) {
        {
            caseFiles.update(value => {
                const newCaseFile = {
                    id: value.length + 1,
                    name: casefileData.name,
                    created: '2021-01-01 00:00:00',
                    updated: '2021-01-01 00:00:00',
                    user_id: casefileData.user_id,
                    status: 'open',
                    pages: casefileData.pages
                };
                return [...value, newCaseFile];
            });
        }
    }

    function editCaseFile(casefileData) {
        {
            caseFiles.update(value => {
                const caseFile = value.find(c => c.id === casefileData.id);

                if (caseFile) {
                    caseFile.name = casefileData.name;
                    caseFile.updated = '2021-01-01 00:00:00';
                    caseFile.user_id = casefileData.user_id;
                    caseFile.status = casefileData.status;
                    caseFile.pages = casefileData.pages;
                }
                setCaseFile(caseFile);
                return value;
            });
        }
    }

    function deleteCaseFile(casefile_id) {
        {
            caseFiles.update(value => {
                return value.filter(c => c.id !== casefile_id);
            });
        }
    }

    function retrieveCaseFileTotalPages(casefile_id) {
        {
            caseFiles.subscribe(value => {
                if (value === undefined) {
                    setCaseFileTotalPages(1);
                } else {
                    const caseFile = value.find(c => c.id === casefile_id);

                    if (!caseFile)  {
                        setCaseFileTotalPages(1); 
                        return;
                    }

                    setCaseFileTotalPages(caseFile.pages.length);
                }
            });
        }
    }

    /* src\CaseFiles\CaseFiles.svelte generated by Svelte v3.59.2 */

    const { console: console_1$5 } = globals;
    const file$8 = "src\\CaseFiles\\CaseFiles.svelte";

    function get_each_context$6(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[8] = list[i];
    	return child_ctx;
    }

    // (40:12) {#each $caseFiles as casefile}
    function create_each_block$6(ctx) {
    	let tr;
    	let td0;
    	let t0_value = /*casefile*/ ctx[8].name + "";
    	let t0;
    	let t1;
    	let td1;
    	let t2_value = new Date(/*casefile*/ ctx[8].created).toLocaleString() + "";
    	let t2;
    	let t3;
    	let td2;
    	let button0;
    	let t5;
    	let button1;
    	let t7;
    	let button2;
    	let t9;
    	let mounted;
    	let dispose;

    	function click_handler() {
    		return /*click_handler*/ ctx[5](/*casefile*/ ctx[8]);
    	}

    	function click_handler_1() {
    		return /*click_handler_1*/ ctx[6](/*casefile*/ ctx[8]);
    	}

    	function click_handler_2() {
    		return /*click_handler_2*/ ctx[7](/*casefile*/ ctx[8]);
    	}

    	const block = {
    		c: function create() {
    			tr = element("tr");
    			td0 = element("td");
    			t0 = text(t0_value);
    			t1 = space();
    			td1 = element("td");
    			t2 = text(t2_value);
    			t3 = space();
    			td2 = element("td");
    			button0 = element("button");
    			button0.textContent = "View";
    			t5 = space();
    			button1 = element("button");
    			button1.textContent = "Edit";
    			t7 = space();
    			button2 = element("button");
    			button2.textContent = "Delete";
    			t9 = space();
    			attr_dev(td0, "class", "svelte-l0fpmg");
    			add_location(td0, file$8, 41, 20, 1063);
    			attr_dev(td1, "class", "svelte-l0fpmg");
    			add_location(td1, file$8, 42, 20, 1109);
    			attr_dev(button0, "class", "svelte-l0fpmg");
    			add_location(button0, file$8, 44, 24, 1215);
    			attr_dev(button1, "class", "svelte-l0fpmg");
    			add_location(button1, file$8, 45, 24, 1303);
    			attr_dev(button2, "class", "svelte-l0fpmg");
    			add_location(button2, file$8, 46, 24, 1391);
    			attr_dev(td2, "class", "svelte-l0fpmg");
    			add_location(td2, file$8, 43, 20, 1185);
    			add_location(tr, file$8, 40, 16, 1037);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, tr, anchor);
    			append_dev(tr, td0);
    			append_dev(td0, t0);
    			append_dev(tr, t1);
    			append_dev(tr, td1);
    			append_dev(td1, t2);
    			append_dev(tr, t3);
    			append_dev(tr, td2);
    			append_dev(td2, button0);
    			append_dev(td2, t5);
    			append_dev(td2, button1);
    			append_dev(td2, t7);
    			append_dev(td2, button2);
    			append_dev(tr, t9);

    			if (!mounted) {
    				dispose = [
    					listen_dev(button0, "click", click_handler, false, false, false, false),
    					listen_dev(button1, "click", click_handler_1, false, false, false, false),
    					listen_dev(button2, "click", click_handler_2, false, false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty & /*$caseFiles*/ 1 && t0_value !== (t0_value = /*casefile*/ ctx[8].name + "")) set_data_dev(t0, t0_value);
    			if (dirty & /*$caseFiles*/ 1 && t2_value !== (t2_value = new Date(/*casefile*/ ctx[8].created).toLocaleString() + "")) set_data_dev(t2, t2_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(tr);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$6.name,
    		type: "each",
    		source: "(40:12) {#each $caseFiles as casefile}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$8(ctx) {
    	let div;
    	let h1;
    	let t1;
    	let table;
    	let thead;
    	let tr;
    	let th0;
    	let t3;
    	let th1;
    	let t5;
    	let th2;
    	let t7;
    	let tbody;
    	let t8;
    	let button;
    	let mounted;
    	let dispose;
    	let each_value = /*$caseFiles*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$6(get_each_context$6(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			h1 = element("h1");
    			h1.textContent = "Case Files";
    			t1 = space();
    			table = element("table");
    			thead = element("thead");
    			tr = element("tr");
    			th0 = element("th");
    			th0.textContent = "Name";
    			t3 = space();
    			th1 = element("th");
    			th1.textContent = "Date Created";
    			t5 = space();
    			th2 = element("th");
    			th2.textContent = "Actions";
    			t7 = space();
    			tbody = element("tbody");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t8 = space();
    			button = element("button");
    			button.textContent = "Create Case File";
    			add_location(h1, file$8, 29, 4, 750);
    			attr_dev(th0, "class", "svelte-l0fpmg");
    			add_location(th0, file$8, 33, 16, 835);
    			attr_dev(th1, "class", "svelte-l0fpmg");
    			add_location(th1, file$8, 34, 16, 866);
    			attr_dev(th2, "class", "svelte-l0fpmg");
    			add_location(th2, file$8, 35, 16, 905);
    			add_location(tr, file$8, 32, 12, 813);
    			add_location(thead, file$8, 31, 8, 792);
    			add_location(tbody, file$8, 38, 8, 968);
    			attr_dev(table, "class", "svelte-l0fpmg");
    			add_location(table, file$8, 30, 4, 775);
    			attr_dev(button, "class", "svelte-l0fpmg");
    			add_location(button, file$8, 52, 4, 1566);
    			attr_dev(div, "class", "casefiles-container svelte-l0fpmg");
    			add_location(div, file$8, 28, 0, 711);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, h1);
    			append_dev(div, t1);
    			append_dev(div, table);
    			append_dev(table, thead);
    			append_dev(thead, tr);
    			append_dev(tr, th0);
    			append_dev(tr, t3);
    			append_dev(tr, th1);
    			append_dev(tr, t5);
    			append_dev(tr, th2);
    			append_dev(table, t7);
    			append_dev(table, tbody);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				if (each_blocks[i]) {
    					each_blocks[i].m(tbody, null);
    				}
    			}

    			append_dev(div, t8);
    			append_dev(div, button);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*handleCreate*/ ctx[1], false, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*handleDelete, $caseFiles, handleEdit, handleView, Date*/ 29) {
    				each_value = /*$caseFiles*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$6(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$6(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(tbody, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$8.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$8($$self, $$props, $$invalidate) {
    	let $caseFiles;
    	validate_store(caseFiles, 'caseFiles');
    	component_subscribe($$self, caseFiles, $$value => $$invalidate(0, $caseFiles = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('CaseFiles', slots, []);

    	onMount(() => {
    		console.log("CaseFiles:", $caseFiles);
    		retrieveCaseFilesView();
    		console.log("CaseFiles:", $caseFiles);
    	});

    	function handleCreate() {
    		push('/create-casefile');
    	}

    	function handleView(id) {
    		push(`/case-files/${id}`);
    	}

    	function handleEdit(id) {
    		push(`/edit-casefile/${id}`);
    	}

    	function handleDelete(id) {
    		deleteCaseFile(id);
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$5.warn(`<CaseFiles> was created with unknown prop '${key}'`);
    	});

    	const click_handler = casefile => handleView(casefile.id);
    	const click_handler_1 = casefile => handleEdit(casefile.id);
    	const click_handler_2 = casefile => handleDelete(casefile.id);

    	$$self.$capture_state = () => ({
    		onMount,
    		caseFiles,
    		deleteCaseFile,
    		retrieveCaseFilesView,
    		push,
    		handleCreate,
    		handleView,
    		handleEdit,
    		handleDelete,
    		$caseFiles
    	});

    	return [
    		$caseFiles,
    		handleCreate,
    		handleView,
    		handleEdit,
    		handleDelete,
    		click_handler,
    		click_handler_1,
    		click_handler_2
    	];
    }

    class CaseFiles extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$8, create_fragment$8, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "CaseFiles",
    			options,
    			id: create_fragment$8.name
    		});
    	}
    }

    /* src\Reports\ReportReference.svelte generated by Svelte v3.59.2 */
    const file$7 = "src\\Reports\\ReportReference.svelte";

    function get_each_context$5(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[12] = list[i];
    	return child_ctx;
    }

    // (41:4) {#if $reports?.length > 0}
    function create_if_block_1$4(ctx) {
    	let ul;
    	let each_value = /*$reports*/ ctx[2];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$5(get_each_context$5(ctx, each_value, i));
    	}

    	const block_1 = {
    		c: function create() {
    			ul = element("ul");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			add_location(ul, file$7, 41, 8, 1192);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, ul, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				if (each_blocks[i]) {
    					each_blocks[i].m(ul, null);
    				}
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*selectReport, $reports*/ 36) {
    				each_value = /*$reports*/ ctx[2];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$5(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$5(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(ul, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(ul);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block: block_1,
    		id: create_if_block_1$4.name,
    		type: "if",
    		source: "(41:4) {#if $reports?.length > 0}",
    		ctx
    	});

    	return block_1;
    }

    // (43:12) {#each $reports as report}
    function create_each_block$5(ctx) {
    	let li;
    	let t_value = /*report*/ ctx[12].reportTitle + "";
    	let t;
    	let mounted;
    	let dispose;

    	function click_handler() {
    		return /*click_handler*/ ctx[9](/*report*/ ctx[12]);
    	}

    	const block_1 = {
    		c: function create() {
    			li = element("li");
    			t = text(t_value);
    			add_location(li, file$7, 43, 16, 1254);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, t);

    			if (!mounted) {
    				dispose = listen_dev(li, "click", click_handler, false, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty & /*$reports*/ 4 && t_value !== (t_value = /*report*/ ctx[12].reportTitle + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block: block_1,
    		id: create_each_block$5.name,
    		type: "each",
    		source: "(43:12) {#each $reports as report}",
    		ctx
    	});

    	return block_1;
    }

    // (48:4) {#if selectedReport}
    function create_if_block$7(ctx) {
    	let p;
    	let t0;
    	let t1_value = /*selectedReport*/ ctx[1].reportTitle + "";
    	let t1;

    	const block_1 = {
    		c: function create() {
    			p = element("p");
    			t0 = text("Selected Report: ");
    			t1 = text(t1_value);
    			add_location(p, file$7, 48, 8, 1404);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			append_dev(p, t0);
    			append_dev(p, t1);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*selectedReport*/ 2 && t1_value !== (t1_value = /*selectedReport*/ ctx[1].reportTitle + "")) set_data_dev(t1, t1_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block: block_1,
    		id: create_if_block$7.name,
    		type: "if",
    		source: "(48:4) {#if selectedReport}",
    		ctx
    	});

    	return block_1;
    }

    function create_fragment$7(ctx) {
    	let div;
    	let input;
    	let t0;
    	let t1;
    	let mounted;
    	let dispose;
    	let if_block0 = /*$reports*/ ctx[2]?.length > 0 && create_if_block_1$4(ctx);
    	let if_block1 = /*selectedReport*/ ctx[1] && create_if_block$7(ctx);

    	const block_1 = {
    		c: function create() {
    			div = element("div");
    			input = element("input");
    			t0 = space();
    			if (if_block0) if_block0.c();
    			t1 = space();
    			if (if_block1) if_block1.c();
    			attr_dev(input, "type", "text");
    			attr_dev(input, "placeholder", "Search for a report...");
    			add_location(input, file$7, 34, 4, 996);
    			add_location(div, file$7, 33, 0, 985);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, input);
    			set_input_value(input, /*reportQuery*/ ctx[0]);
    			append_dev(div, t0);
    			if (if_block0) if_block0.m(div, null);
    			append_dev(div, t1);
    			if (if_block1) if_block1.m(div, null);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input, "input", /*input_input_handler*/ ctx[8]),
    					listen_dev(input, "input", /*handleReportSearch*/ ctx[4], false, false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*reportQuery*/ 1 && input.value !== /*reportQuery*/ ctx[0]) {
    				set_input_value(input, /*reportQuery*/ ctx[0]);
    			}

    			if (/*$reports*/ ctx[2]?.length > 0) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);
    				} else {
    					if_block0 = create_if_block_1$4(ctx);
    					if_block0.c();
    					if_block0.m(div, t1);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (/*selectedReport*/ ctx[1]) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);
    				} else {
    					if_block1 = create_if_block$7(ctx);
    					if_block1.c();
    					if_block1.m(div, null);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block: block_1,
    		id: create_fragment$7.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block_1;
    }

    function instance$7($$self, $$props, $$invalidate) {
    	let $Reports;
    	let $reports;
    	validate_store(Reports, 'Reports');
    	component_subscribe($$self, Reports, $$value => $$invalidate(10, $Reports = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('ReportReference', slots, []);
    	let { block } = $$props;
    	let { blockIndex } = $$props;
    	let reportQuery = '';
    	let reports = writable([]);
    	validate_store(reports, 'reports');
    	component_subscribe($$self, reports, value => $$invalidate(2, $reports = value));
    	let selectedReport = null;
    	const dispatch = createEventDispatcher();

    	async function handleReportSearch(event) {
    		$$invalidate(0, reportQuery = event.target.value);

    		if (reportQuery.length > 2) {
    			await getSearchedReports(reportQuery);
    			reports.set($Reports);
    		} else {
    			reports.set([]);
    		}
    	}

    	function selectReport(report) {
    		$$invalidate(1, selectedReport = report);
    		$$invalidate(6, block.referenceId = report.id, block);
    		$$invalidate(6, block.content = report.reportTitle, block);
    		reports.set([]);
    		$$invalidate(0, reportQuery = '');

    		dispatch('update', {
    			blockIndex,
    			referenceId: report.id,
    			content: block.content
    		});
    	}

    	$$self.$$.on_mount.push(function () {
    		if (block === undefined && !('block' in $$props || $$self.$$.bound[$$self.$$.props['block']])) {
    			console.warn("<ReportReference> was created without expected prop 'block'");
    		}

    		if (blockIndex === undefined && !('blockIndex' in $$props || $$self.$$.bound[$$self.$$.props['blockIndex']])) {
    			console.warn("<ReportReference> was created without expected prop 'blockIndex'");
    		}
    	});

    	const writable_props = ['block', 'blockIndex'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<ReportReference> was created with unknown prop '${key}'`);
    	});

    	function input_input_handler() {
    		reportQuery = this.value;
    		$$invalidate(0, reportQuery);
    	}

    	const click_handler = report => selectReport(report);

    	$$self.$$set = $$props => {
    		if ('block' in $$props) $$invalidate(6, block = $$props.block);
    		if ('blockIndex' in $$props) $$invalidate(7, blockIndex = $$props.blockIndex);
    	};

    	$$self.$capture_state = () => ({
    		createEventDispatcher,
    		Reports,
    		getSearchedReports,
    		writable,
    		block,
    		blockIndex,
    		reportQuery,
    		reports,
    		selectedReport,
    		dispatch,
    		handleReportSearch,
    		selectReport,
    		$Reports,
    		$reports
    	});

    	$$self.$inject_state = $$props => {
    		if ('block' in $$props) $$invalidate(6, block = $$props.block);
    		if ('blockIndex' in $$props) $$invalidate(7, blockIndex = $$props.blockIndex);
    		if ('reportQuery' in $$props) $$invalidate(0, reportQuery = $$props.reportQuery);
    		if ('reports' in $$props) $$invalidate(3, reports = $$props.reports);
    		if ('selectedReport' in $$props) $$invalidate(1, selectedReport = $$props.selectedReport);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		reportQuery,
    		selectedReport,
    		$reports,
    		reports,
    		handleReportSearch,
    		selectReport,
    		block,
    		blockIndex,
    		input_input_handler,
    		click_handler
    	];
    }

    class ReportReference extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$7, create_fragment$7, safe_not_equal, { block: 6, blockIndex: 7 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ReportReference",
    			options,
    			id: create_fragment$7.name
    		});
    	}

    	get block() {
    		throw new Error("<ReportReference>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set block(value) {
    		throw new Error("<ReportReference>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get blockIndex() {
    		throw new Error("<ReportReference>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set blockIndex(value) {
    		throw new Error("<ReportReference>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\Profiles\ProfileReference.svelte generated by Svelte v3.59.2 */
    const file$6 = "src\\Profiles\\ProfileReference.svelte";

    function get_each_context$4(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[12] = list[i];
    	return child_ctx;
    }

    // (41:4) {#if $currentProfiles?.length > 0}
    function create_if_block_1$3(ctx) {
    	let ul;
    	let each_value = /*$currentProfiles*/ ctx[2];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$4(get_each_context$4(ctx, each_value, i));
    	}

    	const block_1 = {
    		c: function create() {
    			ul = element("ul");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			add_location(ul, file$6, 41, 8, 1267);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, ul, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				if (each_blocks[i]) {
    					each_blocks[i].m(ul, null);
    				}
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*selectProfile, $currentProfiles*/ 36) {
    				each_value = /*$currentProfiles*/ ctx[2];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$4(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$4(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(ul, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(ul);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block: block_1,
    		id: create_if_block_1$3.name,
    		type: "if",
    		source: "(41:4) {#if $currentProfiles?.length > 0}",
    		ctx
    	});

    	return block_1;
    }

    // (43:12) {#each $currentProfiles as profile}
    function create_each_block$4(ctx) {
    	let li;
    	let t_value = /*profile*/ ctx[12].firstname + " " + /*profile*/ ctx[12].lastname + "";
    	let t;
    	let mounted;
    	let dispose;

    	function click_handler() {
    		return /*click_handler*/ ctx[9](/*profile*/ ctx[12]);
    	}

    	const block_1 = {
    		c: function create() {
    			li = element("li");
    			t = text(t_value);
    			add_location(li, file$6, 43, 16, 1338);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, t);

    			if (!mounted) {
    				dispose = listen_dev(li, "click", click_handler, false, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty & /*$currentProfiles*/ 4 && t_value !== (t_value = /*profile*/ ctx[12].firstname + " " + /*profile*/ ctx[12].lastname + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block: block_1,
    		id: create_each_block$4.name,
    		type: "each",
    		source: "(43:12) {#each $currentProfiles as profile}",
    		ctx
    	});

    	return block_1;
    }

    // (48:4) {#if selectedProfile}
    function create_if_block$6(ctx) {
    	let p;
    	let t0;
    	let t1_value = /*selectedProfile*/ ctx[1].firstname + "";
    	let t1;
    	let t2;
    	let t3_value = /*selectedProfile*/ ctx[1].lastname + "";
    	let t3;

    	const block_1 = {
    		c: function create() {
    			p = element("p");
    			t0 = text("Selected Profile: ");
    			t1 = text(t1_value);
    			t2 = space();
    			t3 = text(t3_value);
    			add_location(p, file$6, 48, 8, 1515);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			append_dev(p, t0);
    			append_dev(p, t1);
    			append_dev(p, t2);
    			append_dev(p, t3);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*selectedProfile*/ 2 && t1_value !== (t1_value = /*selectedProfile*/ ctx[1].firstname + "")) set_data_dev(t1, t1_value);
    			if (dirty & /*selectedProfile*/ 2 && t3_value !== (t3_value = /*selectedProfile*/ ctx[1].lastname + "")) set_data_dev(t3, t3_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block: block_1,
    		id: create_if_block$6.name,
    		type: "if",
    		source: "(48:4) {#if selectedProfile}",
    		ctx
    	});

    	return block_1;
    }

    function create_fragment$6(ctx) {
    	let div;
    	let input;
    	let t0;
    	let t1;
    	let mounted;
    	let dispose;
    	let if_block0 = /*$currentProfiles*/ ctx[2]?.length > 0 && create_if_block_1$3(ctx);
    	let if_block1 = /*selectedProfile*/ ctx[1] && create_if_block$6(ctx);

    	const block_1 = {
    		c: function create() {
    			div = element("div");
    			input = element("input");
    			t0 = space();
    			if (if_block0) if_block0.c();
    			t1 = space();
    			if (if_block1) if_block1.c();
    			attr_dev(input, "type", "text");
    			attr_dev(input, "placeholder", "Search for a profile...");
    			add_location(input, file$6, 34, 4, 1060);
    			add_location(div, file$6, 33, 0, 1049);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, input);
    			set_input_value(input, /*profileQuery*/ ctx[0]);
    			append_dev(div, t0);
    			if (if_block0) if_block0.m(div, null);
    			append_dev(div, t1);
    			if (if_block1) if_block1.m(div, null);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input, "input", /*input_input_handler*/ ctx[8]),
    					listen_dev(input, "input", /*handleProfileSearch*/ ctx[4], false, false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*profileQuery*/ 1 && input.value !== /*profileQuery*/ ctx[0]) {
    				set_input_value(input, /*profileQuery*/ ctx[0]);
    			}

    			if (/*$currentProfiles*/ ctx[2]?.length > 0) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);
    				} else {
    					if_block0 = create_if_block_1$3(ctx);
    					if_block0.c();
    					if_block0.m(div, t1);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (/*selectedProfile*/ ctx[1]) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);
    				} else {
    					if_block1 = create_if_block$6(ctx);
    					if_block1.c();
    					if_block1.m(div, null);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block: block_1,
    		id: create_fragment$6.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block_1;
    }

    function instance$6($$self, $$props, $$invalidate) {
    	let $profiles;
    	let $currentProfiles;
    	validate_store(profiles, 'profiles');
    	component_subscribe($$self, profiles, $$value => $$invalidate(10, $profiles = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('ProfileReference', slots, []);
    	let { block } = $$props;
    	let { blockIndex } = $$props;
    	let profileQuery = '';
    	let currentProfiles = writable([]);
    	validate_store(currentProfiles, 'currentProfiles');
    	component_subscribe($$self, currentProfiles, value => $$invalidate(2, $currentProfiles = value));
    	let selectedProfile = null;
    	const dispatch = createEventDispatcher();

    	async function handleProfileSearch(event) {
    		$$invalidate(0, profileQuery = event.target.value);

    		if (profileQuery.length > 2) {
    			await searchProfiles(profileQuery);
    			currentProfiles.set($profiles);
    		} else {
    			currentProfiles.set([]);
    		}
    	}

    	function selectProfile(profile) {
    		$$invalidate(1, selectedProfile = profile);
    		$$invalidate(6, block.referenceId = profile.id, block);
    		$$invalidate(6, block.content = profile.firstname + " " + profile.lastname, block);
    		currentProfiles.set([]);
    		$$invalidate(0, profileQuery = '');

    		dispatch('update', {
    			blockIndex,
    			referenceId: profile.id,
    			content: block.content
    		});
    	}

    	$$self.$$.on_mount.push(function () {
    		if (block === undefined && !('block' in $$props || $$self.$$.bound[$$self.$$.props['block']])) {
    			console.warn("<ProfileReference> was created without expected prop 'block'");
    		}

    		if (blockIndex === undefined && !('blockIndex' in $$props || $$self.$$.bound[$$self.$$.props['blockIndex']])) {
    			console.warn("<ProfileReference> was created without expected prop 'blockIndex'");
    		}
    	});

    	const writable_props = ['block', 'blockIndex'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<ProfileReference> was created with unknown prop '${key}'`);
    	});

    	function input_input_handler() {
    		profileQuery = this.value;
    		$$invalidate(0, profileQuery);
    	}

    	const click_handler = profile => selectProfile(profile);

    	$$self.$$set = $$props => {
    		if ('block' in $$props) $$invalidate(6, block = $$props.block);
    		if ('blockIndex' in $$props) $$invalidate(7, blockIndex = $$props.blockIndex);
    	};

    	$$self.$capture_state = () => ({
    		createEventDispatcher,
    		searchProfiles,
    		profiles,
    		writable,
    		block,
    		blockIndex,
    		profileQuery,
    		currentProfiles,
    		selectedProfile,
    		dispatch,
    		handleProfileSearch,
    		selectProfile,
    		$profiles,
    		$currentProfiles
    	});

    	$$self.$inject_state = $$props => {
    		if ('block' in $$props) $$invalidate(6, block = $$props.block);
    		if ('blockIndex' in $$props) $$invalidate(7, blockIndex = $$props.blockIndex);
    		if ('profileQuery' in $$props) $$invalidate(0, profileQuery = $$props.profileQuery);
    		if ('currentProfiles' in $$props) $$invalidate(3, currentProfiles = $$props.currentProfiles);
    		if ('selectedProfile' in $$props) $$invalidate(1, selectedProfile = $$props.selectedProfile);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		profileQuery,
    		selectedProfile,
    		$currentProfiles,
    		currentProfiles,
    		handleProfileSearch,
    		selectProfile,
    		block,
    		blockIndex,
    		input_input_handler,
    		click_handler
    	];
    }

    class ProfileReference extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$6, create_fragment$6, safe_not_equal, { block: 6, blockIndex: 7 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ProfileReference",
    			options,
    			id: create_fragment$6.name
    		});
    	}

    	get block() {
    		throw new Error("<ProfileReference>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set block(value) {
    		throw new Error("<ProfileReference>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get blockIndex() {
    		throw new Error("<ProfileReference>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set blockIndex(value) {
    		throw new Error("<ProfileReference>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\CaseFiles\CaseFileForm.svelte generated by Svelte v3.59.2 */

    const { console: console_1$4 } = globals;
    const file$5 = "src\\CaseFiles\\CaseFileForm.svelte";

    function get_each_context$3(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[31] = list[i];
    	child_ctx[32] = list;
    	child_ctx[33] = i;
    	return child_ctx;
    }

    // (140:68) 
    function create_if_block_5$1(ctx) {
    	let reportreference;
    	let current;

    	reportreference = new ReportReference({
    			props: {
    				block: /*block*/ ctx[31],
    				blockIndex: /*blockIndex*/ ctx[33]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(reportreference.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(reportreference, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const reportreference_changes = {};
    			if (dirty[0] & /*casefile, currentPageIndex*/ 10) reportreference_changes.block = /*block*/ ctx[31];
    			reportreference.$set(reportreference_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(reportreference.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(reportreference.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(reportreference, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_5$1.name,
    		type: "if",
    		source: "(140:68) ",
    		ctx
    	});

    	return block;
    }

    // (138:69) 
    function create_if_block_4$1(ctx) {
    	let profilereference;
    	let current;

    	profilereference = new ProfileReference({
    			props: {
    				block: /*block*/ ctx[31],
    				blockIndex: /*blockIndex*/ ctx[33]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(profilereference.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(profilereference, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const profilereference_changes = {};
    			if (dirty[0] & /*casefile, currentPageIndex*/ 10) profilereference_changes.block = /*block*/ ctx[31];
    			profilereference.$set(profilereference_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(profilereference.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(profilereference.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(profilereference, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_4$1.name,
    		type: "if",
    		source: "(138:69) ",
    		ctx
    	});

    	return block;
    }

    // (136:57) 
    function create_if_block_3$1(ctx) {
    	let input;
    	let mounted;
    	let dispose;

    	function input_input_handler_2() {
    		/*input_input_handler_2*/ ctx[18].call(input, /*each_value*/ ctx[32], /*blockIndex*/ ctx[33]);
    	}

    	function input_handler_2(...args) {
    		return /*input_handler_2*/ ctx[19](/*blockIndex*/ ctx[33], ...args);
    	}

    	const block = {
    		c: function create() {
    			input = element("input");
    			attr_dev(input, "type", "text");
    			attr_dev(input, "placeholder", "Image URL");
    			attr_dev(input, "class", "svelte-16dmer9");
    			add_location(input, file$5, 136, 28, 5503);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, input, anchor);
    			set_input_value(input, /*block*/ ctx[31].content);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input, "input", input_input_handler_2),
    					listen_dev(input, "input", input_handler_2, false, false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (dirty[0] & /*casefile, currentPageIndex*/ 10 && input.value !== /*block*/ ctx[31].content) {
    				set_input_value(input, /*block*/ ctx[31].content);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(input);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3$1.name,
    		type: "if",
    		source: "(136:57) ",
    		ctx
    	});

    	return block;
    }

    // (134:61) 
    function create_if_block_2$1(ctx) {
    	let textarea;
    	let mounted;
    	let dispose;

    	function textarea_input_handler() {
    		/*textarea_input_handler*/ ctx[16].call(textarea, /*each_value*/ ctx[32], /*blockIndex*/ ctx[33]);
    	}

    	function input_handler_1(...args) {
    		return /*input_handler_1*/ ctx[17](/*blockIndex*/ ctx[33], ...args);
    	}

    	const block = {
    		c: function create() {
    			textarea = element("textarea");
    			attr_dev(textarea, "class", "svelte-16dmer9");
    			add_location(textarea, file$5, 134, 28, 5317);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, textarea, anchor);
    			set_input_value(textarea, /*block*/ ctx[31].content);

    			if (!mounted) {
    				dispose = [
    					listen_dev(textarea, "input", textarea_input_handler),
    					listen_dev(textarea, "input", input_handler_1, false, false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (dirty[0] & /*casefile, currentPageIndex*/ 10) {
    				set_input_value(textarea, /*block*/ ctx[31].content);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(textarea);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$1.name,
    		type: "if",
    		source: "(134:61) ",
    		ctx
    	});

    	return block;
    }

    // (132:24) {#if block.type === 'Title'}
    function create_if_block_1$2(ctx) {
    	let input;
    	let mounted;
    	let dispose;

    	function input_input_handler_1() {
    		/*input_input_handler_1*/ ctx[14].call(input, /*each_value*/ ctx[32], /*blockIndex*/ ctx[33]);
    	}

    	function input_handler(...args) {
    		return /*input_handler*/ ctx[15](/*blockIndex*/ ctx[33], ...args);
    	}

    	const block = {
    		c: function create() {
    			input = element("input");
    			attr_dev(input, "type", "text");
    			attr_dev(input, "class", "svelte-16dmer9");
    			add_location(input, file$5, 132, 28, 5127);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, input, anchor);
    			set_input_value(input, /*block*/ ctx[31].content);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input, "input", input_input_handler_1),
    					listen_dev(input, "input", input_handler, false, false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (dirty[0] & /*casefile, currentPageIndex*/ 10 && input.value !== /*block*/ ctx[31].content) {
    				set_input_value(input, /*block*/ ctx[31].content);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(input);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$2.name,
    		type: "if",
    		source: "(132:24) {#if block.type === 'Title'}",
    		ctx
    	});

    	return block;
    }

    // (129:16) {#each casefile.pages[currentPageIndex].blocks as block, blockIndex}
    function create_each_block$3(ctx) {
    	let div;
    	let label;
    	let t0_value = /*block*/ ctx[31].type + "";
    	let t0;
    	let t1;
    	let current_block_type_index;
    	let if_block;
    	let current;

    	const if_block_creators = [
    		create_if_block_1$2,
    		create_if_block_2$1,
    		create_if_block_3$1,
    		create_if_block_4$1,
    		create_if_block_5$1
    	];

    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*block*/ ctx[31].type === 'Title') return 0;
    		if (/*block*/ ctx[31].type === 'Paragraph') return 1;
    		if (/*block*/ ctx[31].type === 'Image') return 2;
    		if (/*block*/ ctx[31].type === 'Profile Reference') return 3;
    		if (/*block*/ ctx[31].type === 'Report Reference') return 4;
    		return -1;
    	}

    	if (~(current_block_type_index = select_block_type(ctx))) {
    		if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			label = element("label");
    			t0 = text(t0_value);
    			t1 = space();
    			if (if_block) if_block.c();
    			attr_dev(label, "class", "svelte-16dmer9");
    			add_location(label, file$5, 130, 24, 5018);
    			attr_dev(div, "class", "block svelte-16dmer9");
    			add_location(div, file$5, 129, 20, 4974);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, label);
    			append_dev(label, t0);
    			append_dev(div, t1);

    			if (~current_block_type_index) {
    				if_blocks[current_block_type_index].m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if ((!current || dirty[0] & /*casefile, currentPageIndex*/ 10) && t0_value !== (t0_value = /*block*/ ctx[31].type + "")) set_data_dev(t0, t0_value);
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if (~current_block_type_index) {
    					if_blocks[current_block_type_index].p(ctx, dirty);
    				}
    			} else {
    				if (if_block) {
    					group_outros();

    					transition_out(if_blocks[previous_block_index], 1, 1, () => {
    						if_blocks[previous_block_index] = null;
    					});

    					check_outros();
    				}

    				if (~current_block_type_index) {
    					if_block = if_blocks[current_block_type_index];

    					if (!if_block) {
    						if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    						if_block.c();
    					} else {
    						if_block.p(ctx, dirty);
    					}

    					transition_in(if_block, 1);
    					if_block.m(div, null);
    				} else {
    					if_block = null;
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);

    			if (~current_block_type_index) {
    				if_blocks[current_block_type_index].d();
    			}
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$3.name,
    		type: "each",
    		source: "(129:16) {#each casefile.pages[currentPageIndex].blocks as block, blockIndex}",
    		ctx
    	});

    	return block;
    }

    // (145:16) {#if casefile.pages[currentPageIndex].blocks.length < MAX_BLOCKS_PER_PAGE}
    function create_if_block$5(ctx) {
    	let div;
    	let label;
    	let t1;
    	let select;
    	let option0;
    	let option1;
    	let option2;
    	let option3;
    	let option4;
    	let option5;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div = element("div");
    			label = element("label");
    			label.textContent = "Add Block";
    			t1 = space();
    			select = element("select");
    			option0 = element("option");
    			option0.textContent = "Select Block Type";
    			option1 = element("option");
    			option1.textContent = "Title";
    			option2 = element("option");
    			option2.textContent = "Paragraph";
    			option3 = element("option");
    			option3.textContent = "Image";
    			option4 = element("option");
    			option4.textContent = "Profile Reference";
    			option5 = element("option");
    			option5.textContent = "Report Reference";
    			attr_dev(label, "class", "svelte-16dmer9");
    			add_location(label, file$5, 146, 24, 6180);
    			option0.__value = "";
    			option0.value = option0.__value;
    			add_location(option0, file$5, 148, 28, 6318);
    			option1.__value = "Title";
    			option1.value = option1.__value;
    			add_location(option1, file$5, 149, 28, 6390);
    			option2.__value = "Paragraph";
    			option2.value = option2.__value;
    			add_location(option2, file$5, 150, 28, 6455);
    			option3.__value = "Image";
    			option3.value = option3.__value;
    			add_location(option3, file$5, 151, 28, 6528);
    			option4.__value = "Profile Reference";
    			option4.value = option4.__value;
    			add_location(option4, file$5, 152, 28, 6593);
    			option5.__value = "Report Reference";
    			option5.value = option5.__value;
    			add_location(option5, file$5, 153, 28, 6682);
    			attr_dev(select, "class", "svelte-16dmer9");
    			if (/*selectedBlockType*/ ctx[0] === void 0) add_render_callback(() => /*select_change_handler*/ ctx[20].call(select));
    			add_location(select, file$5, 147, 24, 6229);
    			attr_dev(div, "class", "form-group svelte-16dmer9");
    			add_location(div, file$5, 145, 20, 6131);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, label);
    			append_dev(div, t1);
    			append_dev(div, select);
    			append_dev(select, option0);
    			append_dev(select, option1);
    			append_dev(select, option2);
    			append_dev(select, option3);
    			append_dev(select, option4);
    			append_dev(select, option5);
    			select_option(select, /*selectedBlockType*/ ctx[0], true);

    			if (!mounted) {
    				dispose = [
    					listen_dev(select, "change", /*select_change_handler*/ ctx[20]),
    					listen_dev(select, "change", /*addBlock*/ ctx[6], false, false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*selectedBlockType*/ 1) {
    				select_option(select, /*selectedBlockType*/ ctx[0]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$5.name,
    		type: "if",
    		source: "(145:16) {#if casefile.pages[currentPageIndex].blocks.length < MAX_BLOCKS_PER_PAGE}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$5(ctx) {
    	let div4;
    	let h1;

    	let t0_value = (/*isEdit*/ ctx[2]
    	? 'Edit Case File'
    	: 'Create Case File') + "";

    	let t0;
    	let t1;
    	let form;
    	let div0;
    	let label0;
    	let t3;
    	let input;
    	let t4;
    	let div3;
    	let label1;
    	let t6;
    	let div1;
    	let button0;
    	let t7;
    	let button0_disabled_value;
    	let t8;
    	let span;
    	let t9;
    	let t10_value = /*currentPageIndex*/ ctx[1] + 1 + "";
    	let t10;
    	let t11;
    	let t12_value = /*casefile*/ ctx[3].pages.length + "";
    	let t12;
    	let t13;
    	let button1;
    	let t14;
    	let button1_disabled_value;
    	let t15;
    	let div2;
    	let t16;
    	let t17;
    	let button2;
    	let t19;
    	let button3;
    	let t20_value = (/*isEdit*/ ctx[2] ? 'Save Changes' : 'Save') + "";
    	let t20;
    	let current;
    	let mounted;
    	let dispose;
    	let each_value = /*casefile*/ ctx[3].pages[/*currentPageIndex*/ ctx[1]].blocks;
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$3(get_each_context$3(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	let if_block = /*casefile*/ ctx[3].pages[/*currentPageIndex*/ ctx[1]].blocks.length < /*MAX_BLOCKS_PER_PAGE*/ ctx[4] && create_if_block$5(ctx);

    	const block = {
    		c: function create() {
    			div4 = element("div");
    			h1 = element("h1");
    			t0 = text(t0_value);
    			t1 = space();
    			form = element("form");
    			div0 = element("div");
    			label0 = element("label");
    			label0.textContent = "Name";
    			t3 = space();
    			input = element("input");
    			t4 = space();
    			div3 = element("div");
    			label1 = element("label");
    			label1.textContent = "Pages";
    			t6 = space();
    			div1 = element("div");
    			button0 = element("button");
    			t7 = text("Previous");
    			t8 = space();
    			span = element("span");
    			t9 = text("Page ");
    			t10 = text(t10_value);
    			t11 = text(" of ");
    			t12 = text(t12_value);
    			t13 = space();
    			button1 = element("button");
    			t14 = text("Next");
    			t15 = space();
    			div2 = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t16 = space();
    			if (if_block) if_block.c();
    			t17 = space();
    			button2 = element("button");
    			button2.textContent = "Add Page";
    			t19 = space();
    			button3 = element("button");
    			t20 = text(t20_value);
    			add_location(h1, file$5, 114, 4, 4083);
    			attr_dev(label0, "class", "svelte-16dmer9");
    			add_location(label0, file$5, 117, 12, 4222);
    			attr_dev(input, "type", "text");
    			input.required = true;
    			attr_dev(input, "class", "svelte-16dmer9");
    			add_location(input, file$5, 118, 12, 4254);
    			attr_dev(div0, "class", "form-group svelte-16dmer9");
    			add_location(div0, file$5, 116, 8, 4185);
    			attr_dev(label1, "class", "svelte-16dmer9");
    			add_location(label1, file$5, 121, 12, 4372);
    			attr_dev(button0, "type", "button");
    			button0.disabled = button0_disabled_value = /*currentPageIndex*/ ctx[1] === 0;
    			attr_dev(button0, "class", "svelte-16dmer9");
    			add_location(button0, file$5, 123, 16, 4455);
    			add_location(span, file$5, 124, 16, 4593);
    			attr_dev(button1, "type", "button");
    			button1.disabled = button1_disabled_value = /*currentPageIndex*/ ctx[1] === /*casefile*/ ctx[3].pages.length - 1;
    			attr_dev(button1, "class", "svelte-16dmer9");
    			add_location(button1, file$5, 125, 16, 4677);
    			attr_dev(div1, "class", "pagination-controls svelte-16dmer9");
    			add_location(div1, file$5, 122, 12, 4405);
    			attr_dev(div2, "class", "page svelte-16dmer9");
    			add_location(div2, file$5, 127, 12, 4850);
    			attr_dev(div3, "class", "form-group svelte-16dmer9");
    			add_location(div3, file$5, 120, 8, 4335);
    			attr_dev(button2, "type", "button");
    			attr_dev(button2, "class", "svelte-16dmer9");
    			add_location(button2, file$5, 159, 8, 6866);
    			attr_dev(button3, "type", "submit");
    			attr_dev(button3, "class", "svelte-16dmer9");
    			add_location(button3, file$5, 160, 8, 6933);
    			add_location(form, file$5, 115, 4, 4145);
    			attr_dev(div4, "class", "casefile-form-container svelte-16dmer9");
    			add_location(div4, file$5, 113, 0, 4041);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div4, anchor);
    			append_dev(div4, h1);
    			append_dev(h1, t0);
    			append_dev(div4, t1);
    			append_dev(div4, form);
    			append_dev(form, div0);
    			append_dev(div0, label0);
    			append_dev(div0, t3);
    			append_dev(div0, input);
    			set_input_value(input, /*casefile*/ ctx[3].name);
    			append_dev(form, t4);
    			append_dev(form, div3);
    			append_dev(div3, label1);
    			append_dev(div3, t6);
    			append_dev(div3, div1);
    			append_dev(div1, button0);
    			append_dev(button0, t7);
    			append_dev(div1, t8);
    			append_dev(div1, span);
    			append_dev(span, t9);
    			append_dev(span, t10);
    			append_dev(span, t11);
    			append_dev(span, t12);
    			append_dev(div1, t13);
    			append_dev(div1, button1);
    			append_dev(button1, t14);
    			append_dev(div3, t15);
    			append_dev(div3, div2);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				if (each_blocks[i]) {
    					each_blocks[i].m(div2, null);
    				}
    			}

    			append_dev(div2, t16);
    			if (if_block) if_block.m(div2, null);
    			append_dev(form, t17);
    			append_dev(form, button2);
    			append_dev(form, t19);
    			append_dev(form, button3);
    			append_dev(button3, t20);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(input, "input", /*input_input_handler*/ ctx[11]),
    					listen_dev(button0, "click", /*click_handler*/ ctx[12], false, false, false, false),
    					listen_dev(button1, "click", /*click_handler_1*/ ctx[13], false, false, false, false),
    					listen_dev(button2, "click", /*addPage*/ ctx[5], false, false, false, false),
    					listen_dev(form, "submit", /*handleSubmit*/ ctx[8], false, false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if ((!current || dirty[0] & /*isEdit*/ 4) && t0_value !== (t0_value = (/*isEdit*/ ctx[2]
    			? 'Edit Case File'
    			: 'Create Case File') + "")) set_data_dev(t0, t0_value);

    			if (dirty[0] & /*casefile*/ 8 && input.value !== /*casefile*/ ctx[3].name) {
    				set_input_value(input, /*casefile*/ ctx[3].name);
    			}

    			if (!current || dirty[0] & /*currentPageIndex*/ 2 && button0_disabled_value !== (button0_disabled_value = /*currentPageIndex*/ ctx[1] === 0)) {
    				prop_dev(button0, "disabled", button0_disabled_value);
    			}

    			if ((!current || dirty[0] & /*currentPageIndex*/ 2) && t10_value !== (t10_value = /*currentPageIndex*/ ctx[1] + 1 + "")) set_data_dev(t10, t10_value);
    			if ((!current || dirty[0] & /*casefile*/ 8) && t12_value !== (t12_value = /*casefile*/ ctx[3].pages.length + "")) set_data_dev(t12, t12_value);

    			if (!current || dirty[0] & /*currentPageIndex, casefile*/ 10 && button1_disabled_value !== (button1_disabled_value = /*currentPageIndex*/ ctx[1] === /*casefile*/ ctx[3].pages.length - 1)) {
    				prop_dev(button1, "disabled", button1_disabled_value);
    			}

    			if (dirty[0] & /*casefile, currentPageIndex, handleBlockChange*/ 138) {
    				each_value = /*casefile*/ ctx[3].pages[/*currentPageIndex*/ ctx[1]].blocks;
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$3(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$3(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(div2, t16);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}

    			if (/*casefile*/ ctx[3].pages[/*currentPageIndex*/ ctx[1]].blocks.length < /*MAX_BLOCKS_PER_PAGE*/ ctx[4]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$5(ctx);
    					if_block.c();
    					if_block.m(div2, null);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			if ((!current || dirty[0] & /*isEdit*/ 4) && t20_value !== (t20_value = (/*isEdit*/ ctx[2] ? 'Save Changes' : 'Save') + "")) set_data_dev(t20, t20_value);
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div4);
    			destroy_each(each_blocks, detaching);
    			if (if_block) if_block.d();
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$5($$self, $$props, $$invalidate) {
    	let $profiles;
    	let $Report;
    	let $profile;
    	validate_store(profiles, 'profiles');
    	component_subscribe($$self, profiles, $$value => $$invalidate(23, $profiles = $$value));
    	validate_store(Report, 'Report');
    	component_subscribe($$self, Report, $$value => $$invalidate(24, $Report = $$value));
    	validate_store(profile, 'profile');
    	component_subscribe($$self, profile, $$value => $$invalidate(25, $profile = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('CaseFileForm', slots, []);
    	let { params } = $$props;
    	const MAX_BLOCKS_PER_PAGE = configData?.maxBlocksPerPage || 10; // Use the maxBlocksPerPage value from the config data
    	let profileQuery = '';
    	let reportQuery = '';
    	let selectedBlockType = '';
    	let currentPageIndex = 0;
    	let isEdit = false;
    	let casefile = { name: '', pages: [{ blocks: [] }] };

    	onMount(() => {
    		if (params !== undefined && params.caseId !== undefined) {
    			parseInt(params.caseId, 10);
    			$$invalidate(2, isEdit = true);

    			// Fetch the case fileview from the server
    			retrieveCaseFile();

    			caseFile.subscribe(value => {
    				$$invalidate(3, casefile = value);
    			});
    		}
    	});

    	function addPage() {
    		$$invalidate(3, casefile.pages = [...casefile.pages, { blocks: [] }], casefile);
    		$$invalidate(1, currentPageIndex = casefile.pages.length - 1); // Navigate to the new page
    	}

    	function addBlock() {
    		if (selectedBlockType) {
    			$$invalidate(
    				3,
    				casefile.pages[currentPageIndex].blocks = [
    					...casefile.pages[currentPageIndex].blocks,
    					{ type: selectedBlockType, content: '' }
    				],
    				casefile
    			);

    			$$invalidate(0, selectedBlockType = '');
    		}
    	}

    	function handleBlockChange(blockIndex, event) {
    		const block = casefile.pages[currentPageIndex].blocks[blockIndex];
    		block.content = event.target.value;
    		$$invalidate(3, casefile = { ...casefile }); // Trigger reactivity
    	}

    	function handleSelectChange(blockIndex, event) {
    		const block = casefile.pages[currentPageIndex].blocks[blockIndex];
    		parseInt(event.target.value, 10);

    		if (block.type === 'Profile Reference') {
    			retrieveProfile();

    			block.content = $profile
    			? $profile.firstname + ' ' + $profile.lastname
    			: '';

    			block.referenceId = $profile.id; // Store the selected profile ID
    		} else if (block.type === 'Report Reference') {
    			getReport();
    			block.content = $Report ? $Report.reportTitle : ''; // Ensure correct field is used
    			block.referenceId = $Report.id; // Store the selected report ID
    		}

    		$$invalidate(3, casefile = { ...casefile }); // Trigger reactivity
    	}

    	function handleSubmit(event) {
    		event.preventDefault();

    		if (isEdit) {
    			editCaseFile(casefile);
    		} else {
    			createCaseFile(casefile); //casefiles.update(items => items.map(item => item.id === casefile.id ? { ...casefile, dateModified: new Date() } : item));
    		} //casefiles.update(items => [...items, { ...casefile, id: Date.now(), dateCreated: new Date() }]);

    		push('/case-files');
    	}

    	function goToPage(index) {
    		if (index >= 0 && index < casefile.pages.length) {
    			$$invalidate(1, currentPageIndex = index);
    		}
    	}

    	function handleProfileSearch(event) {
    		searchProfiles(event.target.value);
    		console.log($profiles);
    	}

    	function handleReportSearch(event) {
    		reportQuery = event.target.value;

    		if (reportQuery.length > 2) {
    			getSearchedReports(reportQuery);
    		}
    	}

    	function selectProfile(profile) {
    		selectedProfile = profile;

    		//profiles = [];
    		profileQuery = profile.name;
    	}

    	function selectReport(report) {
    		selectedReport = report;

    		//reports = [];
    		reportQuery = report.title;
    	}

    	$$self.$$.on_mount.push(function () {
    		if (params === undefined && !('params' in $$props || $$self.$$.bound[$$self.$$.props['params']])) {
    			console_1$4.warn("<CaseFileForm> was created without expected prop 'params'");
    		}
    	});

    	const writable_props = ['params'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$4.warn(`<CaseFileForm> was created with unknown prop '${key}'`);
    	});

    	function input_input_handler() {
    		casefile.name = this.value;
    		$$invalidate(3, casefile);
    	}

    	const click_handler = () => goToPage(currentPageIndex - 1);
    	const click_handler_1 = () => goToPage(currentPageIndex + 1);

    	function input_input_handler_1(each_value, blockIndex) {
    		each_value[blockIndex].content = this.value;
    		$$invalidate(3, casefile);
    		$$invalidate(1, currentPageIndex);
    	}

    	const input_handler = (blockIndex, e) => handleBlockChange(blockIndex, e);

    	function textarea_input_handler(each_value, blockIndex) {
    		each_value[blockIndex].content = this.value;
    		$$invalidate(3, casefile);
    		$$invalidate(1, currentPageIndex);
    	}

    	const input_handler_1 = (blockIndex, e) => handleBlockChange(blockIndex, e);

    	function input_input_handler_2(each_value, blockIndex) {
    		each_value[blockIndex].content = this.value;
    		$$invalidate(3, casefile);
    		$$invalidate(1, currentPageIndex);
    	}

    	const input_handler_2 = (blockIndex, e) => handleBlockChange(blockIndex, e);

    	function select_change_handler() {
    		selectedBlockType = select_value(this);
    		$$invalidate(0, selectedBlockType);
    	}

    	$$self.$$set = $$props => {
    		if ('params' in $$props) $$invalidate(10, params = $$props.params);
    	};

    	$$self.$capture_state = () => ({
    		push,
    		profile,
    		profiles,
    		retrieveProfile,
    		searchProfiles,
    		getReport,
    		Reports,
    		Report,
    		getSearchedReports,
    		caseFile,
    		createCaseFile,
    		editCaseFile,
    		retrieveCaseFile,
    		onMount,
    		ReportReference,
    		ProfileReference,
    		configData,
    		params,
    		MAX_BLOCKS_PER_PAGE,
    		profileQuery,
    		reportQuery,
    		selectedBlockType,
    		currentPageIndex,
    		isEdit,
    		casefile,
    		addPage,
    		addBlock,
    		handleBlockChange,
    		handleSelectChange,
    		handleSubmit,
    		goToPage,
    		handleProfileSearch,
    		handleReportSearch,
    		selectProfile,
    		selectReport,
    		$profiles,
    		$Report,
    		$profile
    	});

    	$$self.$inject_state = $$props => {
    		if ('params' in $$props) $$invalidate(10, params = $$props.params);
    		if ('profileQuery' in $$props) profileQuery = $$props.profileQuery;
    		if ('reportQuery' in $$props) reportQuery = $$props.reportQuery;
    		if ('selectedBlockType' in $$props) $$invalidate(0, selectedBlockType = $$props.selectedBlockType);
    		if ('currentPageIndex' in $$props) $$invalidate(1, currentPageIndex = $$props.currentPageIndex);
    		if ('isEdit' in $$props) $$invalidate(2, isEdit = $$props.isEdit);
    		if ('casefile' in $$props) $$invalidate(3, casefile = $$props.casefile);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		selectedBlockType,
    		currentPageIndex,
    		isEdit,
    		casefile,
    		MAX_BLOCKS_PER_PAGE,
    		addPage,
    		addBlock,
    		handleBlockChange,
    		handleSubmit,
    		goToPage,
    		params,
    		input_input_handler,
    		click_handler,
    		click_handler_1,
    		input_input_handler_1,
    		input_handler,
    		textarea_input_handler,
    		input_handler_1,
    		input_input_handler_2,
    		input_handler_2,
    		select_change_handler
    	];
    }

    class CaseFileForm extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, { params: 10 }, null, [-1, -1]);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "CaseFileForm",
    			options,
    			id: create_fragment$5.name
    		});
    	}

    	get params() {
    		throw new Error("<CaseFileForm>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set params(value) {
    		throw new Error("<CaseFileForm>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\CaseFiles\CaseFileView.svelte generated by Svelte v3.59.2 */

    const { console: console_1$3 } = globals;

    const file$4 = "src\\CaseFiles\\CaseFileView.svelte";

    function get_each_context$2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[12] = list[i];
    	return child_ctx;
    }

    // (71:0) {:else}
    function create_else_block$2(ctx) {
    	let p;

    	const block = {
    		c: function create() {
    			p = element("p");
    			p.textContent = "Loading...";
    			add_location(p, file$4, 71, 4, 2739);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$2.name,
    		type: "else",
    		source: "(71:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (41:0) {#if $caseFileView}
    function create_if_block$4(ctx) {
    	let div;
    	let h1;
    	let t0_value = /*$caseFileView*/ ctx[3].name + "";
    	let t0;
    	let t1;
    	let t2;
    	let if_block0 = /*$caseFileTotalPages*/ ctx[1] > 1 && create_if_block_7(ctx);
    	let if_block1 = /*$caseFilePageView*/ ctx[2] && create_if_block_1$1(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			h1 = element("h1");
    			t0 = text(t0_value);
    			t1 = space();
    			if (if_block0) if_block0.c();
    			t2 = space();
    			if (if_block1) if_block1.c();
    			add_location(h1, file$4, 42, 8, 1384);
    			add_location(div, file$4, 41, 4, 1369);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, h1);
    			append_dev(h1, t0);
    			append_dev(div, t1);
    			if (if_block0) if_block0.m(div, null);
    			append_dev(div, t2);
    			if (if_block1) if_block1.m(div, null);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$caseFileView*/ 8 && t0_value !== (t0_value = /*$caseFileView*/ ctx[3].name + "")) set_data_dev(t0, t0_value);

    			if (/*$caseFileTotalPages*/ ctx[1] > 1) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);
    				} else {
    					if_block0 = create_if_block_7(ctx);
    					if_block0.c();
    					if_block0.m(div, t2);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (/*$caseFilePageView*/ ctx[2]) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);
    				} else {
    					if_block1 = create_if_block_1$1(ctx);
    					if_block1.c();
    					if_block1.m(div, null);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$4.name,
    		type: "if",
    		source: "(41:0) {#if $caseFileView}",
    		ctx
    	});

    	return block;
    }

    // (44:8) {#if $caseFileTotalPages > 1}
    function create_if_block_7(ctx) {
    	let div;
    	let button0;
    	let t0;
    	let button0_disabled_value;
    	let t1;
    	let span;
    	let t2;
    	let t3_value = /*$currentPageIndex*/ ctx[0] + 1 + "";
    	let t3;
    	let t4;
    	let t5_value = /*$caseFileView*/ ctx[3].pages.length + "";
    	let t5;
    	let t6;
    	let button1;
    	let t7;
    	let button1_disabled_value;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div = element("div");
    			button0 = element("button");
    			t0 = text("Previous");
    			t1 = space();
    			span = element("span");
    			t2 = text("Page ");
    			t3 = text(t3_value);
    			t4 = text(" of ");
    			t5 = text(t5_value);
    			t6 = space();
    			button1 = element("button");
    			t7 = text("Next");
    			button0.disabled = button0_disabled_value = /*$currentPageIndex*/ ctx[0] === 0;
    			attr_dev(button0, "class", "svelte-16f667m");
    			add_location(button0, file$4, 45, 16, 1517);
    			add_location(span, file$4, 46, 16, 1615);
    			button1.disabled = button1_disabled_value = /*$currentPageIndex*/ ctx[0] === /*$caseFileView*/ ctx[3].pages.length - 1;
    			attr_dev(button1, "class", "svelte-16f667m");
    			add_location(button1, file$4, 47, 16, 1706);
    			attr_dev(div, "class", "pagination-controls svelte-16f667m");
    			add_location(div, file$4, 44, 12, 1466);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, button0);
    			append_dev(button0, t0);
    			append_dev(div, t1);
    			append_dev(div, span);
    			append_dev(span, t2);
    			append_dev(span, t3);
    			append_dev(span, t4);
    			append_dev(span, t5);
    			append_dev(div, t6);
    			append_dev(div, button1);
    			append_dev(button1, t7);

    			if (!mounted) {
    				dispose = [
    					listen_dev(button0, "click", /*prevPage*/ ctx[8], false, false, false, false),
    					listen_dev(button1, "click", /*nextPage*/ ctx[7], false, false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$currentPageIndex*/ 1 && button0_disabled_value !== (button0_disabled_value = /*$currentPageIndex*/ ctx[0] === 0)) {
    				prop_dev(button0, "disabled", button0_disabled_value);
    			}

    			if (dirty & /*$currentPageIndex*/ 1 && t3_value !== (t3_value = /*$currentPageIndex*/ ctx[0] + 1 + "")) set_data_dev(t3, t3_value);
    			if (dirty & /*$caseFileView*/ 8 && t5_value !== (t5_value = /*$caseFileView*/ ctx[3].pages.length + "")) set_data_dev(t5, t5_value);

    			if (dirty & /*$currentPageIndex, $caseFileView*/ 9 && button1_disabled_value !== (button1_disabled_value = /*$currentPageIndex*/ ctx[0] === /*$caseFileView*/ ctx[3].pages.length - 1)) {
    				prop_dev(button1, "disabled", button1_disabled_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_7.name,
    		type: "if",
    		source: "(44:8) {#if $caseFileTotalPages > 1}",
    		ctx
    	});

    	return block;
    }

    // (51:8) {#if $caseFilePageView}
    function create_if_block_1$1(ctx) {
    	let each_1_anchor;
    	let each_value = /*$caseFilePageView*/ ctx[2].blocks;
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$2(get_each_context$2(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				if (each_blocks[i]) {
    					each_blocks[i].m(target, anchor);
    				}
    			}

    			insert_dev(target, each_1_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$caseFilePageView, navigateToProfile, navigateToReport*/ 100) {
    				each_value = /*$caseFilePageView*/ ctx[2].blocks;
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$2(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$2(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$1.name,
    		type: "if",
    		source: "(51:8) {#if $caseFilePageView}",
    		ctx
    	});

    	return block;
    }

    // (63:60) 
    function create_if_block_6(ctx) {
    	let p;
    	let t0_value = /*block*/ ctx[12].content + "";
    	let t0;
    	let t1;
    	let mounted;
    	let dispose;

    	function click_handler_1() {
    		return /*click_handler_1*/ ctx[11](/*block*/ ctx[12]);
    	}

    	const block = {
    		c: function create() {
    			p = element("p");
    			t0 = text(t0_value);
    			t1 = space();
    			add_location(p, file$4, 63, 20, 2530);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			append_dev(p, t0);
    			append_dev(p, t1);

    			if (!mounted) {
    				dispose = listen_dev(p, "click", click_handler_1, false, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty & /*$caseFilePageView*/ 4 && t0_value !== (t0_value = /*block*/ ctx[12].content + "")) set_data_dev(t0, t0_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_6.name,
    		type: "if",
    		source: "(63:60) ",
    		ctx
    	});

    	return block;
    }

    // (59:61) 
    function create_if_block_5(ctx) {
    	let p;
    	let t0_value = /*block*/ ctx[12].content + "";
    	let t0;
    	let t1;
    	let mounted;
    	let dispose;

    	function click_handler() {
    		return /*click_handler*/ ctx[10](/*block*/ ctx[12]);
    	}

    	const block = {
    		c: function create() {
    			p = element("p");
    			t0 = text(t0_value);
    			t1 = space();
    			add_location(p, file$4, 59, 20, 2322);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			append_dev(p, t0);
    			append_dev(p, t1);

    			if (!mounted) {
    				dispose = listen_dev(p, "click", click_handler, false, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty & /*$caseFilePageView*/ 4 && t0_value !== (t0_value = /*block*/ ctx[12].content + "")) set_data_dev(t0, t0_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_5.name,
    		type: "if",
    		source: "(59:61) ",
    		ctx
    	});

    	return block;
    }

    // (57:49) 
    function create_if_block_4(ctx) {
    	let img;
    	let img_src_value;

    	const block = {
    		c: function create() {
    			img = element("img");
    			if (!src_url_equal(img.src, img_src_value = /*block*/ ctx[12].content)) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "Image");
    			add_location(img, file$4, 57, 20, 2198);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, img, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$caseFilePageView*/ 4 && !src_url_equal(img.src, img_src_value = /*block*/ ctx[12].content)) {
    				attr_dev(img, "src", img_src_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(img);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_4.name,
    		type: "if",
    		source: "(57:49) ",
    		ctx
    	});

    	return block;
    }

    // (55:53) 
    function create_if_block_3(ctx) {
    	let p;
    	let t_value = /*block*/ ctx[12].content + "";
    	let t;

    	const block = {
    		c: function create() {
    			p = element("p");
    			t = text(t_value);
    			add_location(p, file$4, 55, 20, 2103);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			append_dev(p, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$caseFilePageView*/ 4 && t_value !== (t_value = /*block*/ ctx[12].content + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3.name,
    		type: "if",
    		source: "(55:53) ",
    		ctx
    	});

    	return block;
    }

    // (53:16) {#if block.type === 'Title'}
    function create_if_block_2(ctx) {
    	let h2;
    	let t_value = /*block*/ ctx[12].content + "";
    	let t;

    	const block = {
    		c: function create() {
    			h2 = element("h2");
    			t = text(t_value);
    			add_location(h2, file$4, 53, 20, 2002);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h2, anchor);
    			append_dev(h2, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$caseFilePageView*/ 4 && t_value !== (t_value = /*block*/ ctx[12].content + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h2);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2.name,
    		type: "if",
    		source: "(53:16) {#if block.type === 'Title'}",
    		ctx
    	});

    	return block;
    }

    // (52:12) {#each $caseFilePageView.blocks as block}
    function create_each_block$2(ctx) {
    	let if_block_anchor;

    	function select_block_type_1(ctx, dirty) {
    		if (/*block*/ ctx[12].type === 'Title') return create_if_block_2;
    		if (/*block*/ ctx[12].type === 'Paragraph') return create_if_block_3;
    		if (/*block*/ ctx[12].type === 'Image') return create_if_block_4;
    		if (/*block*/ ctx[12].type === 'Profile Reference') return create_if_block_5;
    		if (/*block*/ ctx[12].type === 'Report Reference') return create_if_block_6;
    	}

    	let current_block_type = select_block_type_1(ctx);
    	let if_block = current_block_type && current_block_type(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (current_block_type === (current_block_type = select_block_type_1(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if (if_block) if_block.d(1);
    				if_block = current_block_type && current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			}
    		},
    		d: function destroy(detaching) {
    			if (if_block) {
    				if_block.d(detaching);
    			}

    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$2.name,
    		type: "each",
    		source: "(52:12) {#each $caseFilePageView.blocks as block}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$4(ctx) {
    	let if_block_anchor;

    	function select_block_type(ctx, dirty) {
    		if (/*$caseFileView*/ ctx[3]) return create_if_block$4;
    		return create_else_block$2;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, [dirty]) {
    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$4($$self, $$props, $$invalidate) {
    	let $currentPageIndex;
    	let $caseFileTotalPages;
    	let $caseFilePageView;
    	let $caseFileView;
    	validate_store(caseFileTotalPages, 'caseFileTotalPages');
    	component_subscribe($$self, caseFileTotalPages, $$value => $$invalidate(1, $caseFileTotalPages = $$value));
    	validate_store(caseFilePageView, 'caseFilePageView');
    	component_subscribe($$self, caseFilePageView, $$value => $$invalidate(2, $caseFilePageView = $$value));
    	validate_store(caseFileView, 'caseFileView');
    	component_subscribe($$self, caseFileView, $$value => $$invalidate(3, $caseFileView = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('CaseFileView', slots, []);
    	let { params } = $$props;
    	let currentPageIndex = writable(0);
    	validate_store(currentPageIndex, 'currentPageIndex');
    	component_subscribe($$self, currentPageIndex, value => $$invalidate(0, $currentPageIndex = value));

    	onMount(() => {
    		const caseId = parseInt(params.caseId, 10);
    		retrieveCaseFileView(caseId);
    		retrieveCaseFilePageView($currentPageIndex);
    		console.log("CurrentPageIndex: ", $currentPageIndex);
    		console.log("CaseFileView: ", $caseFileView);
    		console.log("CaseFilePageView: ", $caseFilePageView);
    		console.log("TotalPages: ", $caseFileTotalPages);
    	});

    	function navigateToProfile(profileId) {
    		push(`/player-profiles/${profileId}`);
    	}

    	function navigateToReport(reportId) {
    		push(`/report-details/${reportId}`);
    	}

    	function nextPage() {
    		currentPageIndex.update(n => n + 1);
    		retrieveCaseFilePageView($currentPageIndex);
    	}

    	function prevPage() {
    		currentPageIndex.update(n => n - 1);
    		retrieveCaseFilePageView($currentPageIndex);
    	}

    	$$self.$$.on_mount.push(function () {
    		if (params === undefined && !('params' in $$props || $$self.$$.bound[$$self.$$.props['params']])) {
    			console_1$3.warn("<CaseFileView> was created without expected prop 'params'");
    		}
    	});

    	const writable_props = ['params'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$3.warn(`<CaseFileView> was created with unknown prop '${key}'`);
    	});

    	const click_handler = block => navigateToProfile(block.referenceId);
    	const click_handler_1 = block => navigateToReport(block.referenceId);

    	$$self.$$set = $$props => {
    		if ('params' in $$props) $$invalidate(9, params = $$props.params);
    	};

    	$$self.$capture_state = () => ({
    		onMount,
    		push,
    		writable,
    		caseFileView,
    		caseFilePageView,
    		retrieveCaseFileView,
    		retrieveCaseFilePageView,
    		caseFileTotalPages,
    		params,
    		currentPageIndex,
    		navigateToProfile,
    		navigateToReport,
    		nextPage,
    		prevPage,
    		$currentPageIndex,
    		$caseFileTotalPages,
    		$caseFilePageView,
    		$caseFileView
    	});

    	$$self.$inject_state = $$props => {
    		if ('params' in $$props) $$invalidate(9, params = $$props.params);
    		if ('currentPageIndex' in $$props) $$invalidate(4, currentPageIndex = $$props.currentPageIndex);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		$currentPageIndex,
    		$caseFileTotalPages,
    		$caseFilePageView,
    		$caseFileView,
    		currentPageIndex,
    		navigateToProfile,
    		navigateToReport,
    		nextPage,
    		prevPage,
    		params,
    		click_handler,
    		click_handler_1
    	];
    }

    class CaseFileView extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, { params: 9 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "CaseFileView",
    			options,
    			id: create_fragment$4.name
    		});
    	}

    	get params() {
    		throw new Error("<CaseFileView>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set params(value) {
    		throw new Error("<CaseFileView>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    const trainings = writable([
        {
            id: 1,
            title: 'Training 1',
            description: 'Description 1',
            date: '2021-01-01',
            location: 'Location 1',
            maxAttendees: 10,
            currentAttendees: 5,
            instructorId: 1,
            created_at: '2021-01-01',
            updated_at: '2021-01-01',
            attendees: [
                {
                    id: 1,
                    training_id: 1,
                    attendeeId: 1,
                    attendeeName: 'John Doe',
                    created_at: '2021-01-01',
                    updated_at: '2021-01-01'
                },
                {
                    id: 2,
                    training_id: 1,
                    attendeeId: 2,
                    attendeeName: 'Jane Doe',
                    created_at: '2021-01-01',
                    updated_at: '2021-01-01'
                }
            ]
        },
        {
            id: 2,
            title: 'Training 2',
            description: 'Description 2',
            date: '2021-01-02',
            location: 'Location 2',
            maxAttendees: 10,
            currentAttendees: 5,
            instructorId: 1,
            created_at: '2021-01-02',
            updated_at: '2021-01-02',
            attendees: [
                {
                    id: 3,
                    training_id: 2,
                    attendeeId: 1,
                    attendeeName: 'John Doe',
                    created_at: '2021-01-02',
                    updated_at: '2021-01-02'
                },
                {
                    id: 4,
                    training_id: 2,
                    attendeeId: 2,
                    attendeeName: 'Jane Doe',
                    created_at: '2021-01-02',
                    updated_at: '2021-01-02'
                }
            ]
        }
    ]);
    const training = writable({});
    const attendees = writable([]);

    window.addEventListener('message', function(event) {
        switch(event.data.type) {
            case 'trainings':
                setTrainings(event.data.trainings);
                break;
            case 'training':
                setTraining(event.data.training);
                break;
            case 'attendees':
                setAttendees(event.data.attendees);
                break;
        }
    });

    function setTrainings(data) {
        trainings.set(data);
    }

    function setTraining(data) {
        training.set(data);
    }

    function setAttendees(data) {
        attendees.set(data);
    }

    function retrieveTrainings() {
        {
            setTrainings([
                {
                    id: 1,
                    title: 'Training 1',
                    description: 'Description 1',
                    date: '2021-01-01',
                    location: 'Location 1',
                    maxAttendees: 10,
                    currentAttendees: 5,
                    instructorId: 1,
                    created_at: '2021-01-01',
                    updated_at: '2021-01-01',
                    attendees: [
                        {
                            id: 1,
                            training_id: 1,
                            attendeeId: 1,
                            attendeeName: 'John Doe',
                            created_at: '2021-01-01',
                            updated_at: '2021-01-01'
                        },
                        {
                            id: 2,
                            training_id: 1,
                            attendeeId: 2,
                            attendeeName: 'Jane Doe',
                            created_at: '2021-01-01',
                            updated_at: '2021-01-01'
                        }
                    ]
                },
                {
                    id: 2,
                    title: 'Training 2',
                    description: 'Description 2',
                    date: '2021-01-02',
                    location: 'Location 2',
                    maxAttendees: 10,
                    currentAttendees: 5,
                    instructorId: 1,
                    created_at: '2021-01-02',
                    updated_at: '2021-01-02',
                    attendees: [
                        {
                            id: 3,
                            training_id: 2,
                            attendeeId: 1,
                            attendeeName: 'John Doe',
                            created_at: '2021-01-02',
                            updated_at: '2021-01-02'
                        },
                        {
                            id: 4,
                            training_id: 2,
                            attendeeId: 2,
                            attendeeName: 'Jane Doe',
                            created_at: '2021-01-02',
                            updated_at: '2021-01-02'
                        }
                    ]
                }
            ]);
        }
    }

    function retrieveTrainingById(id) {
        {
            setTraining({
                id: 1,
                title: 'Training 1',
                description: 'Description 1',
                date: '2021-01-01',
                location: 'Location 1',
                maxAttendees: 10,
                currentAttendees: 5,
                instructorId: 1,
                created_at: '2021-01-01',
                updated_at: '2021-01-01',
                attendees: [
                    {
                        id: 1,
                        training_id: 1,
                        attendeeId: 1,
                        attendeeName: 'John Doe',
                        created_at: '2021-01-01',
                        updated_at: '2021-01-01'
                    },
                    {
                        id: 2,
                        training_id: 1,
                        attendeeId: 2,
                        attendeeName: 'Jane Doe',
                        created_at: '2021-01-01',
                        updated_at: '2021-01-01'
                    }
                ]
            });
            training.subscribe(training => {
                console.log("1", training);
                setAttendees(training.attendees);
            });
        }
    }

    function createTraining(trainingData) {
        {
            trainings.update(trainings => {
                const newTraining = {
                    id: trainings.length + 1,
                    title: trainingData.title,
                    description: trainingData.description,
                    date: trainingData.date,
                    location: trainingData.location,
                    maxAttendees: trainingData.maxAttendees,
                    currentAttendees: 0,
                    instructorId: trainingData.instructorId,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                    attendees: []
                };
                return [...trainings, newTraining];
            });
        }
    }

    function updateTraining(trainingData) {
        {
            trainings.update(trainings => {
                const training = trainings.find(t => t.id === trainingData.id);

                training.title = trainingData.title;
                training.description = trainingData.description;
                training.date = trainingData.date;

                setTraining(training);
                return trainings;
            });
        }
    }

    function deleteTraining(id) {
        {
            trainings.update(trainings => {
                return trainings.filter(t => t.id !== id);
            });
        }
    }

    function atendTraining(trainingId, attendeeId) {
        {
            trainings.update(trainings => {
                const training = trainings.find(t => t.id === trainingId);
                training.currentAttendees += 1;
                training.attendees.push({
                    id: training.attendees.length + 1,
                    training_id: trainingId,
                    attendeeId: attendeeId,
                    attendeeName: 'David Doe',
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                });
                setTraining(training);
                return trainings;
            });
        }
    }

    function unatendTraining(trainingId, attendeeId) {
        {
            trainings.update(trainings => {
                const training = trainings.find(t => t.id === trainingId);
                training.currentAttendees -= 1;
                training.attendees = training.attendees.filter(a => a.attendeeId !== attendeeId);
                setTraining(training);
                return trainings;
            });
        }
    }

    function retrieveAttendees(trainingId) {
        {
            trainings.update(trainings => {
                const training = trainings.find(t => t.id === trainingId);
                if (training.attendees.length > 0) {
                    setAttendees(training.attendees);
                } else {
                    setAttendees([
                        {
                            id: 1,
                            training_id: trainingId,
                            attendeeId: 1,
                            attendeeName: 'John Doe',
                            created_at: '2021-01-01',
                            updated_at: '2021-01-01'
                        },
                        {
                            id: 2,
                            training_id: trainingId,
                            attendeeId: 2,
                            attendeeName: 'Jane Doe',
                            created_at: '2021-01-01',
                            updated_at: '2021-01-01'
                        }
                    ]);
                }
            });
        }
    }

    function isAttendee(trainingId, attendeeId) {
        {
            trainings.subscribe(trainings => {
                const training = trainings.find(t => t.id === trainingId);
                const attendee = training.attendees.find(a => a.attendeeId === attendeeId);
                return attendee ? true : false;
            });
        }
    }

    /* src\Trainings\Trainings.svelte generated by Svelte v3.59.2 */
    const file$3 = "src\\Trainings\\Trainings.svelte";

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[6] = list[i];
    	return child_ctx;
    }

    // (36:10) {#each $trainings as training}
    function create_each_block$1(ctx) {
    	let tr;
    	let td0;
    	let t0_value = /*training*/ ctx[6].date + "";
    	let t0;
    	let t1;
    	let td1;
    	let t2_value = /*training*/ ctx[6].title + "";
    	let t2;
    	let t3;
    	let td2;
    	let t4_value = /*training*/ ctx[6].location + "";
    	let t4;
    	let t5;
    	let mounted;
    	let dispose;

    	function click_handler() {
    		return /*click_handler*/ ctx[5](/*training*/ ctx[6]);
    	}

    	const block = {
    		c: function create() {
    			tr = element("tr");
    			td0 = element("td");
    			t0 = text(t0_value);
    			t1 = space();
    			td1 = element("td");
    			t2 = text(t2_value);
    			t3 = space();
    			td2 = element("td");
    			t4 = text(t4_value);
    			t5 = space();
    			attr_dev(td0, "class", "svelte-4emsvh");
    			add_location(td0, file$3, 37, 14, 980);
    			attr_dev(td1, "class", "svelte-4emsvh");
    			add_location(td1, file$3, 38, 14, 1020);
    			attr_dev(td2, "class", "svelte-4emsvh");
    			add_location(td2, file$3, 39, 14, 1061);
    			attr_dev(tr, "class", "svelte-4emsvh");
    			add_location(tr, file$3, 36, 12, 911);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, tr, anchor);
    			append_dev(tr, td0);
    			append_dev(td0, t0);
    			append_dev(tr, t1);
    			append_dev(tr, td1);
    			append_dev(td1, t2);
    			append_dev(tr, t3);
    			append_dev(tr, td2);
    			append_dev(td2, t4);
    			append_dev(tr, t5);

    			if (!mounted) {
    				dispose = listen_dev(tr, "click", click_handler, false, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty & /*$trainings*/ 1 && t0_value !== (t0_value = /*training*/ ctx[6].date + "")) set_data_dev(t0, t0_value);
    			if (dirty & /*$trainings*/ 1 && t2_value !== (t2_value = /*training*/ ctx[6].title + "")) set_data_dev(t2, t2_value);
    			if (dirty & /*$trainings*/ 1 && t4_value !== (t4_value = /*training*/ ctx[6].location + "")) set_data_dev(t4, t4_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(tr);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$1.name,
    		type: "each",
    		source: "(36:10) {#each $trainings as training}",
    		ctx
    	});

    	return block;
    }

    // (45:6) {#if hasPermission($userRank, 'canCreateTraining')}
    function create_if_block$3(ctx) {
    	let button0;
    	let t1;
    	let button1;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			button0 = element("button");
    			button0.textContent = "Create New Training";
    			t1 = space();
    			button1 = element("button");
    			button1.textContent = "Delete Training";
    			add_location(button0, file$3, 45, 8, 1230);
    			add_location(button1, file$3, 46, 8, 1300);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button0, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, button1, anchor);

    			if (!mounted) {
    				dispose = [
    					listen_dev(button0, "click", /*handleCreate*/ ctx[3], false, false, false, false),
    					listen_dev(button1, "click", /*handleDelete*/ ctx[2], false, false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button0);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(button1);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$3.name,
    		type: "if",
    		source: "(45:6) {#if hasPermission($userRank, 'canCreateTraining')}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$3(ctx) {
    	let div;
    	let h1;
    	let t1;
    	let table;
    	let thead;
    	let tr;
    	let th0;
    	let t3;
    	let th1;
    	let t5;
    	let th2;
    	let t7;
    	let tbody;
    	let t8;
    	let show_if = hasPermission(/*$userRank*/ ctx[1], 'canCreateTraining');
    	let each_value = /*$trainings*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
    	}

    	let if_block = show_if && create_if_block$3(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			h1 = element("h1");
    			h1.textContent = "Training Sessions";
    			t1 = space();
    			table = element("table");
    			thead = element("thead");
    			tr = element("tr");
    			th0 = element("th");
    			th0.textContent = "Date";
    			t3 = space();
    			th1 = element("th");
    			th1.textContent = "Training Type";
    			t5 = space();
    			th2 = element("th");
    			th2.textContent = "Location";
    			t7 = space();
    			tbody = element("tbody");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t8 = space();
    			if (if_block) if_block.c();
    			add_location(h1, file$3, 25, 4, 637);
    			attr_dev(th0, "class", "svelte-4emsvh");
    			add_location(th0, file$3, 29, 12, 723);
    			attr_dev(th1, "class", "svelte-4emsvh");
    			add_location(th1, file$3, 30, 12, 750);
    			attr_dev(th2, "class", "svelte-4emsvh");
    			add_location(th2, file$3, 31, 12, 786);
    			attr_dev(tr, "class", "svelte-4emsvh");
    			add_location(tr, file$3, 28, 10, 705);
    			add_location(thead, file$3, 27, 8, 686);
    			add_location(tbody, file$3, 34, 8, 848);
    			attr_dev(table, "class", "svelte-4emsvh");
    			add_location(table, file$3, 26, 4, 669);
    			attr_dev(div, "class", "trainings-container svelte-4emsvh");
    			add_location(div, file$3, 24, 0, 598);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, h1);
    			append_dev(div, t1);
    			append_dev(div, table);
    			append_dev(table, thead);
    			append_dev(thead, tr);
    			append_dev(tr, th0);
    			append_dev(tr, t3);
    			append_dev(tr, th1);
    			append_dev(tr, t5);
    			append_dev(tr, th2);
    			append_dev(table, t7);
    			append_dev(table, tbody);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				if (each_blocks[i]) {
    					each_blocks[i].m(tbody, null);
    				}
    			}

    			append_dev(div, t8);
    			if (if_block) if_block.m(div, null);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*navigateToTraining, $trainings*/ 17) {
    				each_value = /*$trainings*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$1(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(tbody, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}

    			if (dirty & /*$userRank*/ 2) show_if = hasPermission(/*$userRank*/ ctx[1], 'canCreateTraining');

    			if (show_if) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$3(ctx);
    					if_block.c();
    					if_block.m(div, null);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
    			if (if_block) if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let $trainings;
    	let $userRank;
    	validate_store(trainings, 'trainings');
    	component_subscribe($$self, trainings, $$value => $$invalidate(0, $trainings = $$value));
    	validate_store(userRank, 'userRank');
    	component_subscribe($$self, userRank, $$value => $$invalidate(1, $userRank = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Trainings', slots, []);

    	function handleDelete(id) {
    		deleteTraining(id);
    	}

    	function handleCreate() {
    		push('/new-training');
    	}

    	function navigateToTraining(id) {
    		push(`/trainings/${id}`);
    	}

    	onMount(() => {
    		retrieveTrainings();
    	});

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Trainings> was created with unknown prop '${key}'`);
    	});

    	const click_handler = training => navigateToTraining(training.id);

    	$$self.$capture_state = () => ({
    		push,
    		deleteTraining,
    		retrieveTrainings,
    		trainings,
    		charId,
    		userRank,
    		hasPermission,
    		onMount,
    		handleDelete,
    		handleCreate,
    		navigateToTraining,
    		$trainings,
    		$userRank
    	});

    	return [
    		$trainings,
    		$userRank,
    		handleDelete,
    		handleCreate,
    		navigateToTraining,
    		click_handler
    	];
    }

    class Trainings extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Trainings",
    			options,
    			id: create_fragment$3.name
    		});
    	}
    }

    /* src\Trainings\TrainingDetails.svelte generated by Svelte v3.59.2 */

    const { console: console_1$2 } = globals;

    const file$2 = "src\\Trainings\\TrainingDetails.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[7] = list[i];
    	return child_ctx;
    }

    // (59:0) {:else}
    function create_else_block$1(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			div.textContent = "Loading...";
    			add_location(div, file$2, 59, 4, 1922);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$1.name,
    		type: "else",
    		source: "(59:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (38:0) {#if $training}
    function create_if_block$2(ctx) {
    	let div;
    	let h1;
    	let t0_value = /*$training*/ ctx[1].title + "";
    	let t0;
    	let t1;
    	let p0;
    	let t2;
    	let t3_value = new Date(/*$training*/ ctx[1].date).toLocaleString() + "";
    	let t3;
    	let t4;
    	let p1;
    	let t5;
    	let t6_value = /*$training*/ ctx[1].description + "";
    	let t6;
    	let t7;
    	let p2;
    	let t8;
    	let t9_value = /*$training*/ ctx[1].location + "";
    	let t9;
    	let t10;
    	let ul;
    	let t11;
    	let button;
    	let t12_value = (/*attending*/ ctx[0] ? 'Attending' : 'Attend') + "";
    	let t12;
    	let t13;
    	let show_if = hasPermission(/*$userRank*/ ctx[3], 'canEditTraining');
    	let mounted;
    	let dispose;
    	let each_value = /*$attendees*/ ctx[2];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	let if_block = show_if && create_if_block_1(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			h1 = element("h1");
    			t0 = text(t0_value);
    			t1 = space();
    			p0 = element("p");
    			t2 = text("Date: ");
    			t3 = text(t3_value);
    			t4 = space();
    			p1 = element("p");
    			t5 = text("Description: ");
    			t6 = text(t6_value);
    			t7 = space();
    			p2 = element("p");
    			t8 = text("Location: ");
    			t9 = text(t9_value);
    			t10 = space();
    			ul = element("ul");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t11 = space();
    			button = element("button");
    			t12 = text(t12_value);
    			t13 = space();
    			if (if_block) if_block.c();
    			attr_dev(h1, "class", "svelte-cr2ei3");
    			add_location(h1, file$2, 39, 8, 1261);
    			add_location(p0, file$2, 40, 8, 1297);
    			add_location(p1, file$2, 41, 8, 1363);
    			add_location(p2, file$2, 42, 8, 1416);
    			add_location(ul, file$2, 43, 8, 1463);
    			attr_dev(button, "class", "svelte-cr2ei3");
    			add_location(button, file$2, 48, 8, 1607);
    			add_location(div, file$2, 38, 4, 1246);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, h1);
    			append_dev(h1, t0);
    			append_dev(div, t1);
    			append_dev(div, p0);
    			append_dev(p0, t2);
    			append_dev(p0, t3);
    			append_dev(div, t4);
    			append_dev(div, p1);
    			append_dev(p1, t5);
    			append_dev(p1, t6);
    			append_dev(div, t7);
    			append_dev(div, p2);
    			append_dev(p2, t8);
    			append_dev(p2, t9);
    			append_dev(div, t10);
    			append_dev(div, ul);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				if (each_blocks[i]) {
    					each_blocks[i].m(ul, null);
    				}
    			}

    			append_dev(div, t11);
    			append_dev(div, button);
    			append_dev(button, t12);
    			append_dev(div, t13);
    			if (if_block) if_block.m(div, null);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*handleAttend*/ ctx[5], false, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$training*/ 2 && t0_value !== (t0_value = /*$training*/ ctx[1].title + "")) set_data_dev(t0, t0_value);
    			if (dirty & /*$training*/ 2 && t3_value !== (t3_value = new Date(/*$training*/ ctx[1].date).toLocaleString() + "")) set_data_dev(t3, t3_value);
    			if (dirty & /*$training*/ 2 && t6_value !== (t6_value = /*$training*/ ctx[1].description + "")) set_data_dev(t6, t6_value);
    			if (dirty & /*$training*/ 2 && t9_value !== (t9_value = /*$training*/ ctx[1].location + "")) set_data_dev(t9, t9_value);

    			if (dirty & /*$attendees*/ 4) {
    				each_value = /*$attendees*/ ctx[2];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(ul, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}

    			if (dirty & /*attending*/ 1 && t12_value !== (t12_value = (/*attending*/ ctx[0] ? 'Attending' : 'Attend') + "")) set_data_dev(t12, t12_value);
    			if (dirty & /*$userRank*/ 8) show_if = hasPermission(/*$userRank*/ ctx[3], 'canEditTraining');

    			if (show_if) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block_1(ctx);
    					if_block.c();
    					if_block.m(div, null);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
    			if (if_block) if_block.d();
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$2.name,
    		type: "if",
    		source: "(38:0) {#if $training}",
    		ctx
    	});

    	return block;
    }

    // (45:12) {#each $attendees as attendee}
    function create_each_block(ctx) {
    	let li;
    	let t_value = /*attendee*/ ctx[7].attendeeName + "";
    	let t;

    	const block = {
    		c: function create() {
    			li = element("li");
    			t = text(t_value);
    			add_location(li, file$2, 45, 16, 1529);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$attendees*/ 4 && t_value !== (t_value = /*attendee*/ ctx[7].attendeeName + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(45:12) {#each $attendees as attendee}",
    		ctx
    	});

    	return block;
    }

    // (53:8) {#if hasPermission($userRank, 'canEditTraining')}
    function create_if_block_1(ctx) {
    	let button;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			button.textContent = "Edit";
    			attr_dev(button, "class", "svelte-cr2ei3");
    			add_location(button, file$2, 53, 12, 1791);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);

    			if (!mounted) {
    				dispose = listen_dev(
    					button,
    					"click",
    					function () {
    						if (is_function(/*handleEdit*/ ctx[4](/*$training*/ ctx[1].id))) /*handleEdit*/ ctx[4](/*$training*/ ctx[1].id).apply(this, arguments);
    					},
    					false,
    					false,
    					false,
    					false
    				);

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(53:8) {#if hasPermission($userRank, 'canEditTraining')}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$2(ctx) {
    	let if_block_anchor;

    	function select_block_type(ctx, dirty) {
    		if (/*$training*/ ctx[1]) return create_if_block$2;
    		return create_else_block$1;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, [dirty]) {
    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let $training;
    	let $attendees;
    	let $userRank;
    	validate_store(training, 'training');
    	component_subscribe($$self, training, $$value => $$invalidate(1, $training = $$value));
    	validate_store(attendees, 'attendees');
    	component_subscribe($$self, attendees, $$value => $$invalidate(2, $attendees = $$value));
    	validate_store(userRank, 'userRank');
    	component_subscribe($$self, userRank, $$value => $$invalidate(3, $userRank = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('TrainingDetails', slots, []);
    	let { params } = $$props;
    	let attending = false;

    	onMount(() => {
    		const id = parseInt(params.trainingId, 10);
    		console.log("Training ID from URL:", id); // Debugging line
    		retrieveTrainingById();
    		console.log("Training:", $training); // Debugging line
    		console.log("attendees:", $attendees); // Debugging line

    		// Check for attendee status
    		$$invalidate(0, attending = isAttendee($training.id, charId));
    	});

    	function handleEdit(id) {
    		push(`/edit-training/${id}`);
    	}

    	function handleAttend() {
    		// Reuse the function to handle both attending and unattending
    		if (attending) {
    			unatendTraining($training.id, charId);
    		} else {
    			atendTraining($training.id, charId);
    		}

    		$$invalidate(0, attending = !attending);
    	}

    	$$self.$$.on_mount.push(function () {
    		if (params === undefined && !('params' in $$props || $$self.$$.bound[$$self.$$.props['params']])) {
    			console_1$2.warn("<TrainingDetails> was created without expected prop 'params'");
    		}
    	});

    	const writable_props = ['params'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$2.warn(`<TrainingDetails> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('params' in $$props) $$invalidate(6, params = $$props.params);
    	};

    	$$self.$capture_state = () => ({
    		onMount,
    		userRank,
    		charId,
    		hasPermission,
    		push,
    		training,
    		attendees,
    		retrieveTrainingById,
    		isAttendee,
    		atendTraining,
    		unatendTraining,
    		retrieveAttendees,
    		params,
    		attending,
    		handleEdit,
    		handleAttend,
    		$training,
    		$attendees,
    		$userRank
    	});

    	$$self.$inject_state = $$props => {
    		if ('params' in $$props) $$invalidate(6, params = $$props.params);
    		if ('attending' in $$props) $$invalidate(0, attending = $$props.attending);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [attending, $training, $attendees, $userRank, handleEdit, handleAttend, params];
    }

    class TrainingDetails extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, { params: 6 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "TrainingDetails",
    			options,
    			id: create_fragment$2.name
    		});
    	}

    	get params() {
    		throw new Error("<TrainingDetails>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set params(value) {
    		throw new Error("<TrainingDetails>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\Trainings\TrainingForm.svelte generated by Svelte v3.59.2 */

    const { console: console_1$1 } = globals;

    const file$1 = "src\\Trainings\\TrainingForm.svelte";

    // (66:0) {:else}
    function create_else_block(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			div.textContent = "You do not have permission to create or edit training sessions.";
    			add_location(div, file$1, 66, 4, 2421);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(66:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (47:0) {#if isEditing ? hasPermission($userRank, 'canEditTraining') : hasPermission($userRank, 'canCreateTraining')}
    function create_if_block$1(ctx) {
    	let div3;
    	let h1;

    	let t0_value = (/*isEditing*/ ctx[0]
    	? 'Edit Training'
    	: 'Create Training') + "";

    	let t0;
    	let t1;
    	let form;
    	let div0;
    	let label0;
    	let t3;
    	let input0;
    	let t4;
    	let div1;
    	let label1;
    	let t6;
    	let input1;
    	let t7;
    	let div2;
    	let label2;
    	let t9;
    	let textarea;
    	let t10;
    	let button;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div3 = element("div");
    			h1 = element("h1");
    			t0 = text(t0_value);
    			t1 = space();
    			form = element("form");
    			div0 = element("div");
    			label0 = element("label");
    			label0.textContent = "Title";
    			t3 = space();
    			input0 = element("input");
    			t4 = space();
    			div1 = element("div");
    			label1 = element("label");
    			label1.textContent = "Date";
    			t6 = space();
    			input1 = element("input");
    			t7 = space();
    			div2 = element("div");
    			label2 = element("label");
    			label2.textContent = "Description";
    			t9 = space();
    			textarea = element("textarea");
    			t10 = space();
    			button = element("button");
    			button.textContent = "Save";
    			add_location(h1, file$1, 48, 8, 1634);
    			add_location(label0, file$1, 51, 16, 1770);
    			attr_dev(input0, "type", "text");
    			attr_dev(input0, "name", "title");
    			input0.required = true;
    			attr_dev(input0, "class", "svelte-b3o17j");
    			add_location(input0, file$1, 52, 16, 1808);
    			add_location(div0, file$1, 50, 12, 1747);
    			add_location(label1, file$1, 55, 16, 1960);
    			attr_dev(input1, "type", "datetime-local");
    			attr_dev(input1, "name", "date");
    			input1.required = true;
    			attr_dev(input1, "class", "svelte-b3o17j");
    			add_location(input1, file$1, 56, 16, 1997);
    			add_location(div1, file$1, 54, 12, 1937);
    			add_location(label2, file$1, 59, 16, 2157);
    			attr_dev(textarea, "name", "description");
    			textarea.required = true;
    			attr_dev(textarea, "class", "svelte-b3o17j");
    			add_location(textarea, file$1, 60, 16, 2201);
    			add_location(div2, file$1, 58, 12, 2134);
    			attr_dev(button, "type", "submit");
    			attr_dev(button, "class", "svelte-b3o17j");
    			add_location(button, file$1, 62, 12, 2342);
    			add_location(form, file$1, 49, 8, 1702);
    			attr_dev(div3, "class", "training-form-container svelte-b3o17j");
    			add_location(div3, file$1, 47, 4, 1587);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div3, anchor);
    			append_dev(div3, h1);
    			append_dev(h1, t0);
    			append_dev(div3, t1);
    			append_dev(div3, form);
    			append_dev(form, div0);
    			append_dev(div0, label0);
    			append_dev(div0, t3);
    			append_dev(div0, input0);
    			set_input_value(input0, /*training*/ ctx[1].title);
    			append_dev(form, t4);
    			append_dev(form, div1);
    			append_dev(div1, label1);
    			append_dev(div1, t6);
    			append_dev(div1, input1);
    			set_input_value(input1, /*training*/ ctx[1].date);
    			append_dev(form, t7);
    			append_dev(form, div2);
    			append_dev(div2, label2);
    			append_dev(div2, t9);
    			append_dev(div2, textarea);
    			set_input_value(textarea, /*training*/ ctx[1].description);
    			append_dev(form, t10);
    			append_dev(form, button);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input0, "input", /*input0_input_handler*/ ctx[6]),
    					listen_dev(input0, "input", /*handleChange*/ ctx[3], false, false, false, false),
    					listen_dev(input1, "input", /*input1_input_handler*/ ctx[7]),
    					listen_dev(input1, "input", /*handleChange*/ ctx[3], false, false, false, false),
    					listen_dev(textarea, "input", /*textarea_input_handler*/ ctx[8]),
    					listen_dev(textarea, "input", /*handleChange*/ ctx[3], false, false, false, false),
    					listen_dev(form, "submit", /*handleSubmit*/ ctx[4], false, false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*isEditing*/ 1 && t0_value !== (t0_value = (/*isEditing*/ ctx[0]
    			? 'Edit Training'
    			: 'Create Training') + "")) set_data_dev(t0, t0_value);

    			if (dirty & /*training*/ 2 && input0.value !== /*training*/ ctx[1].title) {
    				set_input_value(input0, /*training*/ ctx[1].title);
    			}

    			if (dirty & /*training*/ 2) {
    				set_input_value(input1, /*training*/ ctx[1].date);
    			}

    			if (dirty & /*training*/ 2) {
    				set_input_value(textarea, /*training*/ ctx[1].description);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div3);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(47:0) {#if isEditing ? hasPermission($userRank, 'canEditTraining') : hasPermission($userRank, 'canCreateTraining')}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$1(ctx) {
    	let show_if;
    	let if_block_anchor;

    	function select_block_type(ctx, dirty) {
    		if (dirty & /*isEditing, $userRank*/ 5) show_if = null;

    		if (show_if == null) show_if = !!(/*isEditing*/ ctx[0]
    		? hasPermission(/*$userRank*/ ctx[2], 'canEditTraining')
    		: hasPermission(/*$userRank*/ ctx[2], 'canCreateTraining'));

    		if (show_if) return create_if_block$1;
    		return create_else_block;
    	}

    	let current_block_type = select_block_type(ctx, -1);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, [dirty]) {
    			if (current_block_type === (current_block_type = select_block_type(ctx, dirty)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let $userRank;
    	validate_store(userRank, 'userRank');
    	component_subscribe($$self, userRank, $$value => $$invalidate(2, $userRank = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('TrainingForm', slots, []);
    	let { params } = $$props;
    	let isEditing = false;
    	let training = {};
    	let composedDate = new Date();

    	onMount(() => {
    		// Get relative url to check if it's an edit or create form
    		if (params !== undefined) {
    			let url = window.location.href;
    			parseInt(params.trainingId, 10);

    			if (url.includes('edit-training')) {
    				$$invalidate(0, isEditing = true);
    				$$invalidate(1, training = retrieveTrainingById());
    			}

    			// Compose a date from training.date and training.time
    			composedDate = new Date(training.date + 'T' + training.time);

    			console.log("Composed date:", composedDate); // Debugging line
    		}
    	});

    	function handleChange(event) {
    		$$invalidate(1, training[event.target.name] = event.target.value, training);
    	}

    	function handleSubmit(event) {
    		event.preventDefault();

    		if (isEditing) {
    			// Update existing training
    			updateTraining(training);
    		} else {
    			// Create new training
    			createTraining(training);
    		}

    		push('/trainings');
    	}

    	$$self.$$.on_mount.push(function () {
    		if (params === undefined && !('params' in $$props || $$self.$$.bound[$$self.$$.props['params']])) {
    			console_1$1.warn("<TrainingForm> was created without expected prop 'params'");
    		}
    	});

    	const writable_props = ['params'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$1.warn(`<TrainingForm> was created with unknown prop '${key}'`);
    	});

    	function input0_input_handler() {
    		training.title = this.value;
    		$$invalidate(1, training);
    	}

    	function input1_input_handler() {
    		training.date = this.value;
    		$$invalidate(1, training);
    	}

    	function textarea_input_handler() {
    		training.description = this.value;
    		$$invalidate(1, training);
    	}

    	$$self.$$set = $$props => {
    		if ('params' in $$props) $$invalidate(5, params = $$props.params);
    	};

    	$$self.$capture_state = () => ({
    		userRank,
    		onMount,
    		push,
    		hasPermission,
    		createTraining,
    		retrieveTrainingById,
    		updateTraining,
    		params,
    		isEditing,
    		training,
    		composedDate,
    		handleChange,
    		handleSubmit,
    		$userRank
    	});

    	$$self.$inject_state = $$props => {
    		if ('params' in $$props) $$invalidate(5, params = $$props.params);
    		if ('isEditing' in $$props) $$invalidate(0, isEditing = $$props.isEditing);
    		if ('training' in $$props) $$invalidate(1, training = $$props.training);
    		if ('composedDate' in $$props) composedDate = $$props.composedDate;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		isEditing,
    		training,
    		$userRank,
    		handleChange,
    		handleSubmit,
    		params,
    		input0_input_handler,
    		input1_input_handler,
    		textarea_input_handler
    	];
    }

    class TrainingForm extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, { params: 5 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "TrainingForm",
    			options,
    			id: create_fragment$1.name
    		});
    	}

    	get params() {
    		throw new Error("<TrainingForm>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set params(value) {
    		throw new Error("<TrainingForm>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    const routes = {
        '/': Dashboard,
        '/police-roster': PoliceRoster,
        '/Alerts': Alerts,
        '/rosterProfiles/:id': RosterProfiles,
        '/AlertModal/:id': AlertModal,
        '/server-laws': ServerLaws,
        '/reports': ArrestReport,
        '/report-details/:reportId': ReportDetails,
        '/new-report': ReportForm,
        '/player-profiles': Profiles,
        '/player-profiles/:profileId': Profile,
        '/new-profile': ProfileForm,
        '/calculator-configuration/': ChargeConfig,
        '/trainings': Trainings,
        '/trainings/:trainingId': TrainingDetails,
        '/new-training': TrainingForm,
        '/edit-training/:trainingId': TrainingForm,
        '/case-files': CaseFiles,
        '/case-files/:caseId': CaseFileView,
        '/edit-casefile/:caseId': CaseFileForm,
        '/create-casefile': CaseFileForm,
      };

    /* src\App.svelte generated by Svelte v3.59.2 */

    const { console: console_1 } = globals;
    const file = "src\\App.svelte";

    // (115:0) {#if $isMDTVisible}
    function create_if_block(ctx) {
    	let main;
    	let layout;
    	let current;

    	layout = new Layout({
    			props: {
    				$$slots: { default: [create_default_slot] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			main = element("main");
    			create_component(layout.$$.fragment);
    			attr_dev(main, "class", "svelte-15fr3r7");
    			add_location(main, file, 115, 2, 3346);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			mount_component(layout, main, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const layout_changes = {};

    			if (dirty & /*$$scope*/ 512) {
    				layout_changes.$$scope = { dirty, ctx };
    			}

    			layout.$set(layout_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(layout.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(layout.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_component(layout);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(115:0) {#if $isMDTVisible}",
    		ctx
    	});

    	return block;
    }

    // (117:4) <Layout>
    function create_default_slot(ctx) {
    	let router;
    	let current;
    	router = new Router({ props: { routes }, $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(router.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(router, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(router.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(router.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(router, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot.name,
    		type: "slot",
    		source: "(117:4) <Layout>",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let if_block_anchor;
    	let current;
    	let if_block = /*$isMDTVisible*/ ctx[0] && create_if_block(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*$isMDTVisible*/ ctx[0]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*$isMDTVisible*/ 1) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let $isMDTVisible;
    	validate_store(isMDTVisible, 'isMDTVisible');
    	component_subscribe($$self, isMDTVisible, $$value => $$invalidate(0, $isMDTVisible = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);
    	const configData = { maxBlocksPerPage: 10 }; // Add other configuration data here
    	let profiles = [];
    	let reports = [];
    	let laws = [];
    	let wantedPlayers = [];
    	let alerts = [];
    	let officerStatus = {};
    	let announcements = [];

    	// Check if in development mode and set MDT visibility accordingly on mount
    	onMount(() => {
    		if (devConfig.isDevMode) {
    			set_store_value(isMDTVisible, $isMDTVisible = true, $isMDTVisible);
    		}
    	});

    	// Listen for the Escape key
    	window.addEventListener('keydown', function (e) {
    		if (e.key === "Escape") {
    			set_store_value(isMDTVisible, $isMDTVisible = false, $isMDTVisible);
    		} // Communicate with your Lua backend if needed
    		// $.post('http://syn_mdt/closeui', JSON.stringify({}));
    	}); /* else if (e.key === "Enter") {
        $isMDTVisible = !$isMDTVisible;  // Toggle visibility on "Enter"
    } */

    	// Handle incoming NUI messages and data updates
    	window.addEventListener('message', function (event) {
    		let data = event.data;

    		// Toggle MDT visibility
    		if (data.action === "showMDT") {
    			console.log('Toggling MDT visibility');
    			set_store_value(isMDTVisible, $isMDTVisible = true, $isMDTVisible);
    			profiles = data.profiles || [];
    			reports = data.reports || [];
    			laws = data.laws || [];
    			wantedPlayers = data.wantedPlayers || [];
    			alerts = data.alerts || [];
    			officerStatus = data.officerStatus || {};
    			announcements = data.announcements || [];
    		}

    		// Handle profiles
    		if (data.action === 'receiveProfiles') {
    			profiles = data.profiles || [];
    		}

    		// Handle reports
    		if (data.action === 'receiveReports') {
    			reports = data.reports || [];
    		}

    		// Handle laws
    		if (data.action === 'receiveLaws') {
    			laws = data.laws || [];
    		}

    		// Handle wanted players
    		if (data.action === 'receiveWantedPlayers') {
    			wantedPlayers = data.wantedPlayers || [];
    		}

    		// Handle alerts
    		if (data.action === 'receiveAlerts') {
    			alerts = data.alerts || [];
    		}

    		// Handle officer status updates
    		if (data.action === 'updateOfficerStatus') {
    			officerStatus[data.playerId] = data.onDuty;
    		}

    		// Handle announcements
    		if (data.action === 'receiveAnnouncement') {
    			announcements.push(data.message);
    		}

    		// Handle alert addition
    		if (data.action === 'alertAdded') {
    			alerts.push(data.alert);
    		}

    		// Handle alert deletion
    		if (data.action === 'deleteAlert') {
    			alerts = alerts.filter(alert => alert.id !== data.alertId);
    		}

    		// Handle adding a player to wanted list
    		if (data.action === 'addWantedPlayer') {
    			wantedPlayers.push(data.player);
    		}

    		// Handle removing a player from wanted list
    		if (data.action === 'removeWantedPlayer') {
    			wantedPlayers = wantedPlayers.filter(player => player.id !== data.playerId);
    		}
    	});

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		onMount,
    		isMDTVisible,
    		devConfig,
    		Router,
    		Layout,
    		routes,
    		configData,
    		profiles,
    		reports,
    		laws,
    		wantedPlayers,
    		alerts,
    		officerStatus,
    		announcements,
    		$isMDTVisible
    	});

    	$$self.$inject_state = $$props => {
    		if ('profiles' in $$props) profiles = $$props.profiles;
    		if ('reports' in $$props) reports = $$props.reports;
    		if ('laws' in $$props) laws = $$props.laws;
    		if ('wantedPlayers' in $$props) wantedPlayers = $$props.wantedPlayers;
    		if ('alerts' in $$props) alerts = $$props.alerts;
    		if ('officerStatus' in $$props) officerStatus = $$props.officerStatus;
    		if ('announcements' in $$props) announcements = $$props.announcements;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [$isMDTVisible, configData];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, { configData: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});
    	}

    	get configData() {
    		return this.$$.ctx[1];
    	}

    	set configData(value) {
    		throw new Error("<App>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    const app = new App({
    	target: document.body,
    	props: {
    		name: 'world'
    	}
    });

    return app;

})();
//# sourceMappingURL=bundle.js.map
