"use strict";

// Runs in the page's own JavaScript context (MAIN world) so it can observe the
// AJAX traffic Moodle uses to build the dashboard. The course number is no
// longer rendered into the HTML - it only arrives as the `idnumber` /
// `shortname` of the course objects inside /lib/ajax/service.php responses
// (e.g. "202150610120262" -> 202.1.5061).
//
// Whatever is picked up is written into a JSON <script> element so that
// scripts/moodle-content.js (isolated world) can read it, no matter which of
// the two scripts happens to run first.
(function () {
    const SERVICE_PATH = '/lib/ajax/service.php';
    const STORE_ID = 'bgu-scout-moodle-course-data';
    const EVENT_NAME = 'bgu-scout:moodle-course-data';
    const MAX_DEPTH = 12;

    if (window.__bguScoutMoodleHookInstalled) {
        return;
    }
    window.__bguScoutMoodleHookInstalled = true;

    const coursesById = new Map();

    function isServiceRequest(url) {
        return typeof url === 'string' && url.indexOf(SERVICE_PATH) !== -1;
    }

    // The course objects are nested at different depths depending on which web
    // service answered (calendar events, course overview, ...), so just walk the
    // whole payload and pick up anything that looks like a course.
    function collectCourses(node, found, depth) {
        if (!node || typeof node !== 'object' || depth > MAX_DEPTH) {
            return;
        }

        if (Array.isArray(node)) {
            node.forEach(item => collectCourses(item, found, depth + 1));
            return;
        }

        const idnumber = node.idnumber || node.shortname;
        if (node.id != null && typeof idnumber === 'string' && typeof node.fullname === 'string') {
            found.push({
                id: String(node.id),
                idnumber: idnumber,
                fullname: node.fullname
            });
        }

        Object.keys(node).forEach(key => collectCourses(node[key], found, depth + 1));
    }

    function storeCourses(payload) {
        const found = [];
        collectCourses(payload, found, 0);

        let changed = false;
        found.forEach(course => {
            const known = coursesById.get(course.id);
            if (!known || known.idnumber !== course.idnumber || known.fullname !== course.fullname) {
                coursesById.set(course.id, course);
                changed = true;
            }
        });

        if (!changed) {
            return;
        }

        let store = document.getElementById(STORE_ID);
        if (!store) {
            store = document.createElement('script');
            store.type = 'application/json';
            store.id = STORE_ID;
            (document.head || document.documentElement).appendChild(store);
        }
        store.textContent = JSON.stringify(Array.from(coursesById.values()));
        document.dispatchEvent(new CustomEvent(EVENT_NAME));
    }

    const originalFetch = window.fetch;
    if (typeof originalFetch === 'function') {
        window.fetch = function (...args) {
            const request = originalFetch.apply(this, args);
            try {
                const input = args[0];
                const url = (input && typeof input === 'object' && input.url) ? input.url : String(input);
                if (isServiceRequest(url)) {
                    request.then(response => response.clone().json())
                        .then(storeCourses)
                        .catch(() => { /* not a JSON service response, ignore */ });
                }
            } catch (error) {
                // Never let the hook break the page's own request.
            }
            return request;
        };
    }

    const originalOpen = XMLHttpRequest.prototype.open;
    const originalSend = XMLHttpRequest.prototype.send;

    XMLHttpRequest.prototype.open = function (method, url, ...rest) {
        this.__bguScoutUrl = typeof url === 'string' ? url : String(url);
        return originalOpen.call(this, method, url, ...rest);
    };

    XMLHttpRequest.prototype.send = function (...args) {
        if (isServiceRequest(this.__bguScoutUrl)) {
            this.addEventListener('load', function () {
                try {
                    if (this.responseType === 'json') {
                        storeCourses(this.response);
                    } else if (!this.responseType || this.responseType === 'text') {
                        storeCourses(JSON.parse(this.responseText));
                    }
                } catch (error) {
                    // Not a JSON service response, ignore.
                }
            });
        }
        return originalSend.apply(this, args);
    };
})();
