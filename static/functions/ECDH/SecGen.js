function SecGen(){
    return window.Secret = window.keys.computeSecret(window.ServKey)
}