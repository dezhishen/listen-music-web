const tokenKey = '_token_'

const getToken = function () {
  let jsonStr = localStorage.getItem(tokenKey)
  if (!jsonStr) return
  return JSON.parse(jsonStr)
}

const setToken = function ({token, userId, refreshToken, expire}) {
  expire = new Date().getTime + expire * 1000
  localStorage.setItem(tokenKey, JSON.stringify({token, userId, refreshToken, expire}))
}
export {getToken, setToken}
