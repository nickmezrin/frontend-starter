import { observable, action, computed } from 'mobx';
import Config from 'framework/Config';
import Router from 'framework/Router';
import { createHistory } from 'app/utils/browserHistory';
import { parseUrl, isAppUrl } from 'framework/utils/url';

export default class RouterStore {
    _router = new Router();
    _history = createHistory();

    /**
     * Location object.
     *
     * @type {{url: String, scheme: ?String, host: ?String, path: ?String, query: ?String, fragment: ?String}}
     */
    @observable location = {};

    /**
     * Set location.
     *
     * @param {String} url
     * @param {Boolean} [replace=false] - need to store previous location state?
     */
    @action
    setLocation(url, replace = false) {
        this.location = parseUrl(url);

        if (replace) {
            this._history.replace(url);
        } else {
            this._history.push(url);
        }
    }

    /**
     * Register application route.
     *
     * @param {String} route
     * @param {Function} component - component that show
     */
    @action
    register(route, component) {
        this._router.route(route, ['GET', 'HEAD', 'POST'], component);
    }

    /**
     * Get resolved component.
     *
     * @return {?Function}
     */
    @computed
    get component() {
        return this._router.resolve(this.location.path, 'GET').handler || null;
    }

    /**
     * Is registered application route.
     *
     * @param {String} location
     *
     * @return {Boolean}
     */
    isRegisteredRoute(location) {
        if (isAppUrl(location)) {
            location = location.substring(Config.get('app.baseUrl').length);
        }

        return Boolean(this._router.resolve(location, 'GET').handler);
    }
}
