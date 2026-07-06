/* Thin, namespaced wrapper around window.localStorage */

const Storage = {
  prefix: "pfmf:",

  get(key, fallback = null) {
    try {
      const raw = localStorage.getItem(this.prefix + key);
      return raw === null ? fallback : JSON.parse(raw);
    } catch (e) {
      console.error("Storage.get failed for", key, e);
      return fallback;
    }
  },

  set(key, value) {
    try {
      localStorage.setItem(this.prefix + key, JSON.stringify(value));
      return true;
    } catch (e) {
      console.error("Storage.set failed for", key, e);
      return false;
    }
  },

  remove(key) {
    localStorage.removeItem(this.prefix + key);
  },

  has(key) {
    return localStorage.getItem(this.prefix + key) !== null;
  }
};
