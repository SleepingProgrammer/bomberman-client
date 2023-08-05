const CACHE_PREFIX = "BOMBERMAN_";
class CacheHelper {
  //Session is cleared on browser close
  saveToSession = (key, value) => {
    sessionStorage.setItem(CACHE_PREFIX + key, value);
  };

  loadFromSession = (key, defaultValue, expectedType="string") => {
    let cachedValue = sessionStorage.getItem(CACHE_PREFIX + key) || defaultValue;

    return this.translateFromString(cachedValue, expectedType);
  };

  removeFromSession = (key) => {
    sessionStorage.removeItem(CACHE_PREFIX + key);
  };


  //Local is persistent through browser lifecycles
  saveToLocal = (key, value) => {
    localStorage.setItem(CACHE_PREFIX + key, value);
  };

  loadFromLocal = (key, defaultValue, expectedType = "string") => {
    let cachedValue = localStorage.getItem(CACHE_PREFIX + key) || defaultValue;

    return this.translateFromString(cachedValue, expectedType);
  };

  //Session is persistent through browser lifecycles
  removeFromLocal = (key) => {
    localStorage.removeItem(CACHE_PREFIX + key);
  };

  translateFromString = (value, expectedType) => {
    let output = value;
    switch (expectedType) {
      case "integer":
      case "int":
        output = parseInt(value);
        break;
      case "float":
        output = parseFloat(value);
        break;
      case "boolean":
        output = value.toLowerCase() == "true";
        break;
    }

    return output;
  };
}

export default new CacheHelper();
